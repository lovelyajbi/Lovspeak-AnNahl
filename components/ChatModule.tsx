import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { getUserProfile, saveVocab, getCustomCategories, saveCustomCategory, CustomCategory, getGeminiApiKey } from '../services/storage';
import { transcribeAudio, analyzePronunciationAudio, translateText } from '../services/gemini';
import { ModuleProps, AppView } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { audioService } from '../services/audioService';
import { ttsService } from '../services/ttsService';

interface Correction {
  original: string;
  correction: string;
  explanation: string;
}

interface VocabSuggestion {
  english: string;
  indonesian: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  corrections?: Correction[];
  vocab?: VocabSuggestion[];
  mission?: string;
  score?: number;
  attachments?: {
    type: 'image' | 'audio';
    url: string;
  }[];
}

const QUICK_ACTIONS = [
  { label: "Correct my grammar", prompt: "Please review my last message and correct any grammar mistakes, explaining why." },
  { label: "Suggest a topic", prompt: "Can you suggest an interesting topic for us to discuss in English?" },
  { label: "Roleplay: Doctor", prompt: "Let's roleplay. You are a doctor and I am a patient. Start the conversation." },
  { label: "Translate to English", prompt: "How do I say 'Saya ingin belajar bahasa Inggris dengan cepat' in English?" },
  { label: "Explain Islamic term", prompt: "Can you explain the meaning of 'Taqwa' in English?" },
];

const ChatModule: React.FC<ModuleProps> = ({ onComplete, onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [missionMode, setMissionMode] = useState(true);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<{ file: File, type: 'image' | 'audio', preview: string }[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatSessionRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userProfile = getUserProfile();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    return () => ttsService.cancel();
  }, []);

  const initChat = async () => {
    try {
      const apiKey = getGeminiApiKey();
      if (!apiKey) {
        setMessages([{ id: 'error', role: 'model', text: "Assalamu'alaikum. Sepertinya AI API Key belum diatur. Silakan atur di menu setting agar kita bisa berbincang.", timestamp: new Date() }]);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const levelGuidelines = userProfile.level === 'A1' || userProfile.level === 'A2'
        ? "- Use simple basic vocabulary, very short sentences (max 10-15 words). Speak simply."
        : userProfile.level === 'B1' || userProfile.level === 'B2'
        ? "- Use moderate vocabulary, standard sentence lengths. Introduce useful idioms occasionally."
        : "- Use advanced, sophisticated vocabulary, native-like expressions, and complex sentence structures.";

      const systemInstruction = `You are Lovelya, a warm, wise, and encouraging English mentor with a Shari'a-compliant personality. 
      
      PERSONALITY:
      - You are compassionate, refined, and highly observant.
      - Your tone is natural and conversational, like a supportive elder sister or mentor. Avoid robotic or repetitive structures.
      - You integrate Islamic wisdom naturally into the conversation. Greet with 'Assalamu'alaikum' and use expressions like 'Alhamdulillah' naturally.
      - You maintain high moral standards (Akhlaq) and avoid any language or topics that contradict Islamic values.
      
      CORE INTERACTION RULES:
      1. CONVERSATION FLOW: Prioritize a meaningful chat over correction. Focus on building the student's confidence.
      2. SMART CORRECTIONS: If there's a significant error, provide a correction at the very end of your response using: [CORRECTION: "mistake" -> "correction" | "brief explanation"].
      3. NO SPECIAL TAGS: Respond purely in natural English text. Do NOT use special markers for vocabulary anymore. The user can click on any word to save it.
      4. LIVE MISSIONS & SCORING: If mission mode is ON, you MUST evaluate the user's grammar and provide a score.
         - Format for Score: [SCORE: 0-100]
         - Format for Mission: [MISSION: "Task description"]
         - Place these tags at the VERY END of your response.
      
      The student is ${userProfile.name} (Level: ${userProfile.level}).
      
      LEVEL ADAPTATION:
      ${levelGuidelines}
      
      Keep responses soulful and engaging. You are more than a tool; you are a companion in their learning journey.`;

      chatSessionRef.current = ai.chats.create({
        model: 'gemini-2.5-flash-lite',
        config: { systemInstruction }
      });

      const welcomeMsg = userProfile.level === 'A1'
        ? `Assalamu'alaikum ${userProfile.name}! I'm Lovelya. Don't be afraid to make mistakes—that's how we grow. Shall we talk about your day?`
        : `Assalamu'alaikum ${userProfile.name}, it's wonderful to see you. I'm Lovelya, your mentor. What's on your mind today? I'm here to listen and learn with you.`;

      setMessages([{ id: 'init', role: 'model', text: welcomeMsg, timestamp: new Date() }]);
    } catch (err) {
      console.error("AI Chat Init Error:", err);
      setMessages([{ id: 'error', role: 'model', text: "Bafis... Maaf, sistem Lovelya sedang mengalami gangguan teknis saat mulai. Pastikan API Key Anda benar.", timestamp: new Date() }]);
    }
  };

  useEffect(() => {
    initChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, isTranscribing]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() && attachedFiles.length === 0) return;

    // Auto-retry init if session is missing
    if (!chatSessionRef.current) {
      await initChat();
      if (!chatSessionRef.current) {
        setToast("AI Not Ready. Please check API Key.");
        return;
      }
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
      attachments: attachedFiles.map(a => ({ type: a.type, url: a.preview }))
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const currentAttachments = [...attachedFiles];
    setAttachedFiles([]);
    setIsLoading(true);
    setIsTyping(true);

    const aiMsgId = `ai-${Date.now()}`;
    const aiMsg: Message = { id: aiMsgId, role: 'model', text: '', timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);

    try {
      const parts: any[] = [{ text: textToSend }];
      if (!missionMode) {
        parts.push({ text: "(Note: Do not suggest a mission in this response as Mission Mode is currently paused)" });
      }

      // Handle file attachments for Gemini
      for (const item of currentAttachments) {
        const base64 = await fileToBase64(item.file);
        parts.push({
          inlineData: {
            data: base64,
            mimeType: item.file.type
          }
        });
      }

      const stream = await chatSessionRef.current.sendMessageStream({ message: parts });
      let fullText = '';

      const correctionRegex = /\[CORRECTION:\s*"?(.*?)"?\s*->\s*"?(.*?)"?\s*\|\s*"?(.*?)"?\]/g;
      const vocabRegex = /\[\[(.*?)\|(.*?)\]\]/g;
      const legacyVocabRegex = /\[VOCAB:\s*"?(.*?)"?\s*\|\s*"?(.*?)"?\]/g;
      const missionRegex = /\[MISSION:\s*"?(.*?)"?\]/g;
      const scoreRegex = /\[SCORE:\s*(\d+)\]/g;

      for await (const chunk of stream) {
        const chunkText = chunk.text || "";
        fullText += chunkText;

        // Live clean text for streaming display
        const streamingClean = fullText
          .replace(/\[CORRECTION:.*?\]/g, '')
          .replace(/\[MISSION:.*?\]/g, '')
          .replace(/\[VOCAB:.*?\]/g, '')
          .replace(/\[\[.*?\|.*?\]\]/g, (m) => {
            // If we encounter any leftover tags, handle them gracefully
            const parts = m.slice(2, -2).split('|');
            return parts[0];
          })
          .trim();

        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: streamingClean } : m));
      }

      // Final parsing for metadata
      const corrections: Correction[] = [];
      const vocab: VocabSuggestion[] = [];
      let mission = '';

      let match;
      while ((match = correctionRegex.exec(fullText)) !== null) {
        corrections.push({ original: match[1], correction: match[2], explanation: match[3] });
      }
      // Handle both new inline format and legacy format
      while ((match = vocabRegex.exec(fullText)) !== null) {
        vocab.push({ english: match[1], indonesian: match[2] });
      }
      while ((match = legacyVocabRegex.exec(fullText)) !== null) {
        vocab.push({ english: match[1], indonesian: match[2] });
      }

      const scoreMatch = fullText.match(scoreRegex);
      const scoreValue = scoreMatch ? parseInt(scoreMatch[0].match(/\d+/)?.[0] || '0') : undefined;

      const missionMatch = fullText.match(missionRegex);
      if (missionMatch) mission = missionMatch[0].replace(/\[MISSION:\s*|\]/g, '').replace(/"/g, '');

      // Clean the text from special tags for UI
      const cleanText = fullText
        .replace(correctionRegex, '')
        .replace(vocabRegex, '')
        .replace(legacyVocabRegex, '')
        .replace(missionRegex, '')
        .replace(scoreRegex, '')
        .trim();

      setMessages(prev => prev.map(m => m.id === aiMsgId ? {
        ...m,
        text: cleanText,
        corrections: corrections.length > 0 ? corrections : undefined,
        vocab: vocab.length > 0 ? vocab : undefined,
        mission: mission || undefined,
        score: scoreValue
      } : m));

      // Auto-play disabled per user request
      // if (cleanText.length < 150) speakText(cleanText, aiMsgId);
    } catch (error) {
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: "Connection error. Try again." } : m));
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const speakText = (text: string, msgId: string) => {
    if (playingMessageId === msgId) {
      ttsService.cancel();
      setPlayingMessageId(null);
      return;
    }
    setPlayingMessageId(msgId);
    
    const isBeginner = userProfile.level === 'A1' || userProfile.level === 'A2';
    const isAdvanced = userProfile.level === 'C1' || userProfile.level === 'C2';
    const rate = isBeginner ? 0.85 : isAdvanced ? 1.05 : 0.95;
    const pitch = isBeginner ? 1.1 : 1.0;

    ttsService.speak(
      text,
      'en-US',
      rate,
      pitch,
      () => setPlayingMessageId(null),
      () => setPlayingMessageId(null)
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsTranscribing(true);
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const text = await transcribeAudio(base64, 'audio/webm');
          setIsTranscribing(false);
          if (text?.trim()) handleSend(text);
        };
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { alert("Mic denied"); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); } };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const type = file.type.startsWith('image/') ? 'image' : (file.type.startsWith('audio/') ? 'audio' : null);
      if (type) {
        setAttachedFiles(prev => [...prev, {
          file,
          type: type as 'image' | 'audio',
          preview: URL.createObjectURL(file)
        }]);
      }
    });
    // Reset input
    e.target.value = '';
  };

  const [selectedWord, setSelectedWord] = useState<{ english: string; indonesian: string }>({ english: '', indonesian: '' });
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);
  const [vocabCategory, setVocabCategory] = useState('General');
  const [currentSentence, setCurrentSentence] = useState('');
  const [customCats, setCustomCats] = useState<CustomCategory[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setCustomCats(getCustomCategories());
  }, []);

  const handleWordClick = async (word: string, fullText: string) => {
    // Clean word from punctuation
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
    if (!cleanWord) return;

    setSelectedWord({ english: cleanWord, indonesian: '' });

    // Find containing sentence
    const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [fullText];
    const sentence = sentences.find(s => s.toLowerCase().includes(word.toLowerCase()))?.trim() || fullText;

    setCurrentSentence(sentence);
    setIsVocabModalOpen(true);
    setIsTranslating(true);
    setVocabCategory('General');

    try {
      const result = await translateText(cleanWord, 'en-id');
      setSelectedWord(prev => ({ ...prev, indonesian: result.translation }));
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveToVocab = () => {
    if (!selectedWord.english || !selectedWord.indonesian) return;

    saveVocab({
      id: `chat-${Date.now()}`,
      english: selectedWord.english,
      indonesian: selectedWord.indonesian,
      sentence: currentSentence,
      category: vocabCategory,
      isUserGenerated: true
    });

    if (vocabCategory && !customCats.some(c => c.name.toLowerCase() === vocabCategory.toLowerCase())) {
      saveCustomCategory({ name: vocabCategory, icon: 'fa-folder' });
      setCustomCats(getCustomCategories());
    }

    audioService.play('success');
    setToast('Saved');
    setIsVocabModalOpen(false);
  };

  const renderMessageContent = (msgText: string) => {
    // Treat as normal text but wrap words in clickable spans
    const words = msgText.split(/(\s+)/);

    return (
      <div className="flex flex-wrap items-baseline">
        {words.map((part, i) => {
          if (part.trim() === '') return <span key={i}>{part}</span>;

          return (
            <span
              key={i}
              onClick={() => handleWordClick(part, msgText)}
              className="hover:bg-lovelya-100 dark:hover:bg-lovelya-900/40 cursor-pointer rounded px-0.5 transition-colors border-b border-transparent hover:border-lovelya-300 dark:hover:border-lovelya-700 decoration-dotted"
            >
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-3 md:p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate ? onNavigate(AppView.HOME) : (onComplete && onComplete())}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <i className="fas fa-arrow-left text-lg"></i>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 flex items-center justify-center text-white shadow-xl text-lg">
              <i className="fas fa-hand-holding-heart"></i>
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight">Lovelya</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">With you, always</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMissionMode(!missionMode);
              setToast(missionMode ? 'Lite Mode: Relaxed Chat' : 'Mission Mode: On Challenge');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${missionMode ? 'bg-lovelya-50 border-lovelya-200 text-lovelya-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
          >
            <i className={`fas ${missionMode ? 'fa-rocket' : 'fa-coffee'} text-[10px]`}></i>
            <span className="text-[10px] font-black uppercase tracking-wider">{missionMode ? 'Mission ON' : 'Lite Mode'}</span>
          </button>
        </div>
      </div>

      {/* ChatGPT Promotional Banner */}
      <a
        href="https://chatgpt.com/g/g-697061036aac81919c363fe6648fa5c2-lovelya"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-lovelya-50 to-rose-50 dark:from-lovelya-900/30 dark:to-rose-900/30 border-b border-lovelya-100 dark:border-lovelya-900/50 p-2.5 md:p-3 text-center transition-all hover:bg-lovelya-100 dark:hover:bg-lovelya-900/50 z-10 sticky top-[65px] md:top-[73px]"
      >
        <div className="flex items-center justify-center gap-2">
          <i className="fas fa-sparkles text-amber-500 animate-pulse text-sm md:text-base"></i>
          <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
            Dapatkan <i>experience</i> ngobrol yang lebih optimal bareng <strong className="text-lovelya-600 dark:text-lovelya-400 font-black">Lovelya Eksklusif di ChatGPT!</strong> <i className="fas fa-external-link-alt ml-1 opacity-70"></i>
          </span>
        </div>
      </a>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 no-scrollbar" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              group relative p-3 md:p-4 rounded-[1.5rem] shadow-sm text-sm md:text-[15px] max-w-[85%] md:max-w-[75%] leading-relaxed
              ${msg.role === 'user'
                ? 'bg-lovelya-600 text-white rounded-tr-none shadow-lovelya-200'
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none border border-gray-100 dark:border-gray-600'}
            `}>
              {/* Attachments Display */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {msg.attachments.map((at, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-white/20">
                      {at.type === 'image' ? (
                        <img src={at.url} alt="upload" className="max-w-[200px] max-h-[200px] object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="p-3 bg-white/10 flex items-center gap-2">
                          <i className="fas fa-file-audio text-xl"></i>
                          <span className="text-xs">Audio File</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="prose dark:prose-invert prose-sm max-w-none text-[15px] md:text-[16px]">
                {msg.role === 'model' ? renderMessageContent(msg.text) : <ReactMarkdown>{msg.text}</ReactMarkdown>}
              </div>

              {missionMode && msg.role === 'model' && msg.score !== undefined && (
                <div className="mt-2 flex items-center gap-2">
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter flex items-center gap-1.5 ${msg.score >= 80 ? 'bg-green-100 text-green-700' :
                    msg.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                    <i className="fas fa-chart-line"></i>
                    Grammar Score: {msg.score}%
                  </div>
                </div>
              )}

              {/* Extra AI Insights */}
              <AnimatePresence>
                {msg.role === 'model' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 mt-4"
                  >
                    {msg.corrections && msg.corrections.map((c, i) => (
                      <div key={i} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 p-3 rounded-2xl text-xs md:text-sm">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black uppercase tracking-tighter mb-1">
                          <i className="fas fa-magic"></i> Improvement
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="line-through text-gray-400">{c.original}</span>
                          <span className="font-bold text-gray-800 dark:text-white">{c.correction}</span>
                          <p className="text-[10px] md:text-xs text-amber-700/70 dark:text-amber-300/70 italic mt-1">{c.explanation}</p>
                        </div>
                      </div>
                    ))}

                    {msg.mission && (
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 border-2 border-dashed border-cyan-200 dark:border-cyan-800/50 p-3 rounded-2xl">
                        <div className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-1">Live Mission</div>
                        <p className="text-xs font-bold text-cyan-800 dark:text-cyan-200">{msg.mission}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {msg.role === 'model' && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600/50 flex items-center justify-between">
                  <button
                    onClick={() => speakText(msg.text, msg.id)}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition
                      ${playingMessageId === msg.id
                        ? 'bg-lovelya-100 text-lovelya-600 dark:bg-lovelya-900/30'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600'}
                    `}
                  >
                    <i className={`fas ${playingMessageId === msg.id ? 'fa-stop' : 'fa-volume-up'}`}></i>
                    {playingMessageId === msg.id ? 'Stop' : 'Listen'}
                  </button>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 items-center text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            </div>
            Lovelya is typing
          </div>
        )}
        {isTranscribing && (
          <div className="flex gap-2 items-center text-[10px] font-black text-lovelya-500 uppercase tracking-widest animate-pulse">
            <i className="fas fa-wave-square"></i> Transcribing audio...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 sticky bottom-0">
        {/* Attachment Previews */}
        <AnimatePresence>
          {attachedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-2 overflow-x-auto pb-3 mb-3 no-scrollbar"
            >
              {attachedFiles.map((file, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {file.type === 'image' ? (
                    <img src={file.preview} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <i className="fas fa-file-audio text-lovelya-500"></i>
                  )}
                  <button
                    onClick={() => removeAttachment(i)}
                    className="absolute top-0 right-0 w-5 h-5 bg-black/50 text-white text-[10px] rounded-bl-xl flex items-center justify-center"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-3 no-scrollbar">
          {QUICK_ACTIONS.map((a, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(a.prompt)}
              className="whitespace-nowrap px-3 py-1.5 bg-lovelya-50 dark:bg-gray-900/30 text-lovelya-700 dark:text-lovelya-300 text-[10px] font-black rounded-full border border-lovelya-100 dark:border-lovelya-800 hover:bg-lovelya-100 transition shadow-sm uppercase tracking-widest"
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 focus-within:border-lovelya-500 transition-all">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,audio/*"
            multiple
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-lovelya-500 transition"
          >
            <i className="fas fa-paperclip text-lg"></i>
          </button>

          <button
            type="button"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-lovelya-600 shadow-sm'}`}
          >
            <i className="fas fa-microphone"></i>
          </button>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={1}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ketik pesan..."
            className="flex-1 bg-transparent outline-none text-[15px] md:text-[16px] font-medium py-2.5 px-1 max-h-32 resize-none dark:text-white"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${(!input.trim() && attachedFiles.length === 0) ? 'bg-gray-200 dark:bg-gray-700 text-gray-400' : 'bg-lovelya-600 text-white shadow-lg shadow-lovelya-200 hover:bg-lovelya-700'}`}
            disabled={!input.trim() && attachedFiles.length === 0}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full font-black shadow-xl flex items-center gap-2 border border-white/10 text-xs uppercase tracking-widest"
          >
            <i className="fas fa-check-circle text-green-400"></i>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Vocab Modal */}
      <AnimatePresence>
        {isVocabModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVocabModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-gray-800 w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Save Word</h3>
                  <button onClick={() => setIsVocabModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <i className="fas fa-times text-lg"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-lovelya-500 uppercase tracking-widest block mb-2">English Word</label>
                    <input
                      type="text"
                      value={selectedWord.english}
                      onChange={(e) => setSelectedWord({ ...selectedWord, english: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lovelya-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-lovelya-500 uppercase tracking-widest block mb-2">Translation</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={selectedWord.indonesian}
                        placeholder={isTranslating ? "Translating..." : "Type translation..."}
                        onChange={(e) => setSelectedWord({ ...selectedWord, indonesian: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lovelya-400"
                      />
                      {isTranslating && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <i className="fas fa-circle-notch fa-spin text-lovelya-400"></i>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-lovelya-500 uppercase tracking-widest block mb-2">Context Sentence</label>
                    <button
                      onClick={() => {
                        setSelectedWord(prev => ({ ...prev, english: currentSentence }));
                        setIsTranslating(true);
                        translateText(currentSentence, 'en-id').then(res => {
                          setSelectedWord(prev => ({ ...prev, indonesian: res.translation }));
                          setIsTranslating(false);
                        });
                      }}
                      className="w-full text-left p-3 rounded-xl bg-lovelya-50 dark:bg-lovelya-900/20 border border-lovelya-100 dark:border-lovelya-800 text-xs text-gray-600 dark:text-gray-300 italic hover:border-lovelya-300 transition"
                    >
                      "{currentSentence}"
                      <div className="mt-1 text-[9px] font-bold text-lovelya-500 uppercase tracking-wider">Click to save full sentence</div>
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-lovelya-500 uppercase tracking-widest block mb-2">Category / Folder</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto mb-2 p-1">
                      {['General', 'Chat discoveries', ...customCats.map(c => c.name)].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setVocabCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${vocabCategory === cat ? 'bg-lovelya-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="+ Create new category..."
                      value={(customCats.some(c => c.name === vocabCategory) || ['General', 'Chat discoveries'].includes(vocabCategory)) ? '' : vocabCategory}
                      onChange={(e) => setVocabCategory(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-2 text-xs font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lovelya-400"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveToVocab}
                  disabled={!selectedWord.english || !selectedWord.indonesian || isTranslating}
                  className="w-full bg-gradient-to-r from-lovelya-500 to-rose-500 text-white rounded-2xl py-4 font-black uppercase tracking-widest shadow-xl shadow-lovelya-200/50 mt-8 disabled:opacity-50 active:scale-95 transition"
                >
                  Save to Vocab
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatModule;
