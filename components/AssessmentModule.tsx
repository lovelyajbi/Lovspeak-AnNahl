
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ModuleProps, AssessmentQuestion, AssessmentResult } from '../types';
import { generateAssessmentTest, evaluateAssessment } from '../services/gemini';
import { saveUserProfile, getUserProfile } from '../services/storage';

const AssessmentModule: React.FC<ModuleProps> = ({ onComplete, onAssessmentResult }) => {
  const [status, setStatus] = useState<'intro' | 'loading' | 'testing' | 'evaluating' | 'results'>('intro');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [textInput, setTextInput] = useState('');
  const [mcqSelection, setMcqSelection] = useState<number | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioBlob(null); // Reset previous recording
    } catch (e) { 
      alert("Microphone access denied. Please enable it in settings."); 
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleStart = async () => {
    try {
      const test = await generateAssessmentTest();
      setQuestions(test);
      setResponses(new Array(test.length).fill(null));
      setStatus('testing');
    } catch (e) {
      alert("Failed to load test questions. Please try again.");
      setStatus('intro');
    }
  };

  const handleNext = async () => {
    const q = questions[currentIdx];
    const responseObj: any = { id: q.id, type: q.type, originalQuestion: q };

    if (q.type === 'speaking') {
      if (!audioBlob) return alert("Please record your story first.");
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      await new Promise(res => reader.onloadend = res);
      responseObj.audioBase64 = (reader.result as string).split(',')[1];
      setAudioBlob(null);
    } else if (q.type === 'writing') {
      if (!textInput.trim()) return alert("Please type your answer.");
      responseObj.textAnswer = textInput;
      setTextInput('');
    } else {
      if (mcqSelection === null) return alert("Please select one of the options.");
      responseObj.selectedOption = mcqSelection;
      setMcqSelection(null);
    }

    const newResponses = [...responses];
    newResponses[currentIdx] = responseObj;
    setResponses(newResponses);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      handleEvaluate(newResponses);
    }
  };

  const handleEvaluate = async (finalResponses: any[]) => {
    setStatus('evaluating');
    try {
      const evalResult = await evaluateAssessment(finalResponses);
      setResult(evalResult);
      setStatus('results');
      const profile = getUserProfile();
      saveUserProfile({ ...profile, level: evalResult.detectedLevel });
    } catch (e: any) {
      console.error("Evaluation error:", e);
      const errorMsg = e.message || "Unknown error";
      alert(`Evaluation failed: ${errorMsg.substring(0, 100)}. Please try again with shorter audio responses.`);
      setStatus('intro');
    }
  };

  if (status === 'intro') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-xl mx-auto p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 mx-2 md:mx-auto">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-xl md:text-2xl text-white mb-4 shadow-xl">
          <i className="fas fa-bolt"></i>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white mb-2">Express Placement Test</h2>
        <p className="text-xs md:text-sm text-gray-400 mb-6 font-medium leading-relaxed">
          Uji kemampuan bahasa Inggris Anda dalam 10 soal kilat: 2 Speaking, 6 Grammar, dan 2 Writing.
        </p>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleStart} className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-black text-sm shadow-xl transition">
          Start Test
        </motion.button>
      </motion.div>
    );
  }

  if (status === 'loading' || status === 'evaluating') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="flex gap-1.5">{[0,1,2].map(i => <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600" />)}</div>
        <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">
          {status === 'loading' ? 'Crafting Personalized Questions...' : 'Analysing Language Complexity...'}
        </p>
      </motion.div>
    );
  }

  if (status === 'results' && result) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 md:space-y-8 animate-bounce-in py-6 md:py-10 px-2 md:px-0">
        <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl md:rounded-[4rem] shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
           <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 md:w-64 md:h-64 bg-lovelya-500/10 rounded-full blur-3xl"></div>
           <h3 className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.4em] mb-4 md:mb-6">Placement Result</h3>
           <div className="text-7xl md:text-[10rem] font-black text-lovelya-600 leading-none mb-4 md:mb-6 drop-shadow-xl">{result.detectedLevel}</div>
           <div className="text-left bg-gray-50 dark:bg-gray-700/50 p-4 md:p-6 rounded-2xl text-sm md:text-base text-gray-700 dark:text-gray-200 whitespace-pre-wrap max-h-64 overflow-y-auto mt-4 mx-auto w-full shadow-inner leading-relaxed">
             {result.summary}
           </div>
           
           <div className="grid grid-cols-3 gap-2 md:gap-4 mt-6 md:mt-10">
              {['speaking', 'grammar', 'writing'].map(sec => (
                  <div key={sec} className="p-2.5 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl md:rounded-2xl border border-gray-100 dark:border-gray-600">
                      <div className="text-[7px] md:text-[9px] font-black uppercase text-gray-400 mb-0.5 md:mb-1 tracking-widest">{sec}</div>
                      <div className="text-xs md:text-base font-bold text-gray-800 dark:text-white">{(result.sections as any)[sec]?.score}%</div>
                  </div>
              ))}
           </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => onAssessmentResult ? onAssessmentResult(result) : onComplete?.()} className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-black text-sm shadow-xl transition">
          Continue to Set Up Plan ➔
        </motion.button>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto py-6 md:py-10 px-2 md:px-4">
      {/* Progress Bar */}
      <div className="mb-5 md:mb-8 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} className="bg-gradient-to-r from-violet-500 to-purple-600 h-full rounded-full" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 md:p-12 rounded-2xl md:rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden min-h-[400px] md:min-h-[500px] flex flex-col">
         <div className="flex items-center justify-between mb-5 md:mb-10">
            <span className="px-2.5 py-1 md:px-4 md:py-1.5 bg-lovelya-50 dark:bg-lovelya-900/30 text-lovelya-600 text-[7px] md:text-[10px] font-black uppercase rounded-full tracking-[0.1em] md:tracking-[0.2em] border border-lovelya-100">
                {currentQ.type}
            </span>
            <span className="text-[9px] md:text-xs font-bold text-gray-400 tracking-widest">{currentIdx + 1} OF 10</span>
         </div>

         <div className="flex-1 flex flex-col">
            <h3 className="text-lg md:text-3xl font-black text-gray-800 dark:text-white leading-tight mb-2 md:mb-4">
                {currentQ.prompt}
            </h3>
            
            {currentQ.type === 'speaking' && (
              <p className="text-[9px] md:text-sm text-gray-400 font-medium mb-5 md:mb-10 italic">
                *Click the microphone to start telling your story. Click again when you are finished.
              </p>
            )}

            <div className="space-y-3 md:space-y-6 flex-1 flex flex-col justify-center">
               {currentQ.type === 'speaking' && (
                  <div className="flex flex-col items-center py-3 md:py-6 space-y-3 md:space-y-6">
                     <button 
                       onClick={toggleRecording}
                       className={`w-16 h-16 md:w-28 md:h-28 rounded-full flex items-center justify-center text-xl md:text-4xl transition-all shadow-2xl transform active:scale-90 ${isRecording ? 'bg-red-500 text-white animate-pulse ring-4 md:ring-8 ring-red-100 dark:ring-red-900/20' : 'bg-lovelya-600 text-white hover:bg-lovelya-700 hover:scale-105'}`}
                     >
                       <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                     </button>
                     <div className="text-center">
                       <p className={`text-[9px] md:text-xs font-black uppercase tracking-widest ${isRecording ? 'text-red-500 animate-bounce' : 'text-gray-400'}`}>
                           {isRecording ? 'Listening Now...' : audioBlob ? 'Voice Saved ✓' : 'Tap to Start Recording'}
                       </p>
                       {audioBlob && !isRecording && (
                         <div className="mt-2 md:mt-4 flex items-center gap-2 text-green-500 bg-green-50 dark:bg-green-900/10 px-2.5 py-1 md:px-4 md:py-2 rounded-full">
                           <i className="fas fa-check-circle text-[10px] md:text-base"></i>
                           <span className="text-[9px] md:text-xs font-bold uppercase">Ready to submit</span>
                         </div>
                       )}
                     </div>
                  </div>
               )}

               {currentQ.type === 'writing' && (
                  <textarea 
                   autoFocus
                   value={textInput} 
                   onChange={e => setTextInput(e.target.value)} 
                   className="w-full h-32 md:h-48 p-4 md:p-8 rounded-xl md:rounded-[2.5rem] border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-lovelya-500 focus:bg-white outline-none transition-all text-sm md:text-lg font-medium leading-relaxed shadow-inner" 
                   placeholder="Your thoughts here..." 
                  />
               )}

               {currentQ.type === 'grammar' && currentQ.options && (
                  <div className="grid gap-2 md:gap-3">
                     {currentQ.options.map((opt, i) => (
                       <button 
                           key={i} 
                           onClick={() => setMcqSelection(i)} 
                           className={`w-full p-3 md:p-6 rounded-lg md:rounded-2xl border-2 text-left transition-all font-bold text-[11px] md:text-base flex items-center justify-between group transform hover:translate-x-1 md:hover:translate-x-2 ${mcqSelection === i ? 'border-lovelya-500 bg-lovelya-50 dark:bg-lovelya-900/30 text-lovelya-600' : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                       >
                         <span>{opt}</span>
                         {mcqSelection === i && <i className="fas fa-check-circle scale-100 md:scale-125"></i>}
                       </button>
                     ))}
                  </div>
               )}
            </div>
         </div>

         <div className="mt-6 md:mt-12 flex justify-between items-center pt-4 md:pt-8 border-t border-gray-50 dark:border-gray-700">
            <div className="flex items-center gap-1 md:gap-2 text-[7px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">
               <i className="fas fa-info-circle"></i> No Undo
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleNext} className="px-6 py-2.5 md:px-10 md:py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-black text-xs md:text-sm shadow-xl transition">
              {currentIdx === questions.length - 1 ? 'FINISH' : 'NEXT'}
            </motion.button>
         </div>
      </div>
    </motion.div>
  );
};

export default AssessmentModule;
