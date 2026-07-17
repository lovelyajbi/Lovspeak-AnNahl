import { DAILY_ISLAMIC_ORIGINAL_THEMES } from './shadowing_daily_islamic_original_1';
import { DAILY_ISLAMIC_ORIGINAL_THEMES_2 } from './shadowing_daily_islamic_original_2';
import { ShadowingTask } from '../../types';

export interface ShadowingTheme {
  id: string;
  title: string;
  category: string;
  mainCategory?: 'Daily Conversations' | 'Idioms' | 'Slang';
  subCategory?: 'Islamic' | 'General';
  icon: string;
  description: string;
  tasks: ShadowingTask[];
}


import { DAILY_ISLAMIC_THEMES } from './shadowing_daily_islamic';
import { IDIOMS_GENERAL_THEMES } from './shadowing_idioms_general';
import { IDIOMS_ISLAMIC_THEMES } from './shadowing_idioms_islamic';
import { SLANG_GENERAL_THEMES } from './shadowing_slang_general';
import { SLANG_ISLAMIC_THEMES } from './shadowing_slang_islamic';
import { IDIOMS_GENERAL_THEMES_2 } from './shadowing_idioms_general_2';
import { SLANG_GENERAL_THEMES_2 } from './shadowing_slang_general_2';

export const SHADOWING_DATA: ShadowingTheme[] = [
  {
    id: 'gen_social',
    title: 'Social & Hangouts',
    category: 'General',
    icon: 'fa-comments',
    description: 'Sound more like a friend than a textbook with natural fillers and casual interjections.',
    tasks: [
      // EASY (10)
      {
        id: 's1',
        title: 'Forgetting a Name',
        category: 'General',
        difficulty: 'Easy',
        text: "I'm so sorry, I totally missed your name... It's just been one of those days, you know?",
        translation: "Maaf banget, saya tadi nggak dengar namamu... Hari ini lagi agak kacau nih, paham kan?",
        scenario: "Gunakan 'one of those days' sebagai alasan santai kenapa Anda bisa lupa atau kurang fokus."
      },
      {
        id: 's2',
        title: 'Natural Greeting',
        category: 'General',
        difficulty: 'Easy',
        text: "Hey! I don't think we've met yet. I'm Lovelya, it's a pleasure to finally meet you!",
        translation: "Hei! Sepertinya kita belum pernah bertemu. Saya Lovelya, senang akhirnya bisa bertemu denganmu!",
        scenario: "Cara ramah dan berenergi untuk memulai perkenalan dengan orang baru di sebuah acara atau pertemuan."
      },
      {
        id: 's4',
        title: 'Expressing Excitement',
        category: 'General',
        difficulty: 'Easy',
        text: "No way! That's awesome! I'm so stoked for you, man. You've worked so hard for this.",
        translation: "Masa sih? Keren banget! Saya ikut senang (banget) buat kamu. Kamu sudah kerja keras buat ini.",
        scenario: "Gunakan 'stoked' untuk menunjukkan rasa senang atau semangat yang lebih besar daripada sekadar 'happy'."
      },
      { id: 'gs_e4', title: 'Weekend Plans', category: 'General', difficulty: 'Easy', text: "Any big plans for the weekend? I'm just gonna take it easy and catch up on some sleep.", translation: "Ada rencana besar buat akhir pekan? Saya cuma mau nyantai dan balas dendam tidur.", scenario: "Menanyakan rencana akhir pekan teman dengan santai." },
      { id: 'gs_e5', title: 'Small Talk - Weather', category: 'General', difficulty: 'Easy', text: "Nice weather we're having, isn't it? I hope it stays like this for the rest of the week.", translation: "Cuacanya bagus ya? Semoga bakal kayak gini terus sampai akhir minggu.", scenario: "Memulai percakapan ringan dengan topik cuaca." },
      { id: 'gs_e6', title: 'Asking for Help', category: 'General', difficulty: 'Easy', text: "Hey, do you have a sec? I'm having a bit of trouble with this, and I was wondering if you could help.", translation: "Hei, ada waktu sebentar? Saya agak kesulitan nih, kira-kira kamu bisa bantu nggak?", scenario: "Meminta bantuan kecil secara sopan kepada orang terdekat." },
      { id: 'gs_e7', title: 'Complimenting Outfit', category: 'General', difficulty: 'Easy', text: "I love your jacket! Where'd you get it? It really suits you.", translation: "Suka banget sama jaketmu! Beli di mana? Cocok banget di kamu.", scenario: "Memberikan pujian tulus tentang pilihan pakaian seseorang." },
      { id: 'gs_e8', title: 'Common Interest', category: 'General', difficulty: 'Easy', text: "Wait, you like that show too? I'm obsessed with it! Who's your favorite character?", translation: "Eh, kamu suka acara itu juga? Saya terobsesi banget! Karakter favoritmu siapa?", scenario: "Merespons kesamaan minat dengan antusiasme tinggi." },
      { id: 'gs_e9', title: 'Checking In', category: 'General', difficulty: 'Easy', text: "How's it going? Been a while since we last talked. Hope everything's been good with you.", translation: "Gimana kabarnya? Sudah lama ya kita nggak ngobrol. Semoga semuanya baik-baik aja.", scenario: "Menanyakan kabar teman lama yang sudah jarang berkomunikasi." },
      { id: 'gs_e10', title: 'Introducting a Friend', category: 'General', difficulty: 'Easy', text: "Hey Sarah, have you met Mike? He's a graphic designer and just moved to the neighborhood.", translation: "Hey Sarah, sudah kenal Mike belum? Dia desainer grafis dan baru aja pindah ke lingkungan sini.", scenario: "Memperkenalkan orang baru agar lebih akrab di lingkungan sosial." },
      // MEDIUM (10)
      {
        id: 's3',
        title: 'Declining an Invite',
        category: 'General',
        difficulty: 'Medium',
        text: "I think I'm gonna pass tonight, honestly. I'm feeling pretty drained and just need to veg out at home.",
        translation: "Kayaknya saya nggak ikut dulu deh malam ini. Saya lagi capek banget dan mau nyantai saja di rumah.",
        scenario: "Gunakan 'pass' untuk menolak tawaran, dan 'veg out' untuk kegiatan malas-malasan di rumah."
      },
      {
        id: 's5',
        title: 'Wrapping Up Casually',
        category: 'General',
        difficulty: 'Medium',
        text: "Anyway, I should probably get going before it gets too late. It was great catching up with you!",
        translation: "Ngomong-ngomong, kayaknya saya harus cabut sebelum kemalaman. Senang bisa ngobrol lagi sama kamu!",
        scenario: "Gunakan 'catching up' saat mengakhiri obrolan dengan teman lama atau orang yang sudah lama tidak bertemu."
      },
      { id: 'gs_m3', title: 'Awkward Silence', category: 'General', difficulty: 'Medium', text: "So... this is a bit awkward, isn't it? I never know what to say in these situations, honestly.", translation: "Jadi... ini agak canggung ya? Jujur saya nggak pernah tahu harus ngomong apa dalam situasi kayak gini.", scenario: "Mengakui momen canggung untuk mencairkan suasana dengan humor." },
      { id: 'gs_m4', title: 'Agreeing to Disagree', category: 'General', difficulty: 'Medium', text: "I see your point, but I'm not sure I totally agree. Let's just agree to disagree for now, okay?", translation: "Saya paham maksudmu, tapi saya nggak yakin setuju sepenuhnya. Kita hargai perbedaan pendapat aja dulu ya?", scenario: "Mengakhiri perdebatan tanpa menyinggung perasaan orang lain." },
      { id: 'gs_m5', title: 'Offering Comfort', category: 'General', difficulty: 'Medium', text: "I'm so sorry to hear about what happened. If you need someone to talk to, I'm always here for you.", translation: "Turut berduka ya dengar apa yang terjadi. Kalau kamu butuh temen ngobrol, saya selalu ada buat kamu.", scenario: "Memberikan empati dan dukungan moral di saat teman berduka." },
      { id: 'gs_m6', title: 'Deep Conversation', category: 'General', difficulty: 'Medium', text: "I've been thinking a lot about the future lately. Do you ever feel like you're just drifting along?", translation: "Saya lagi banyak mikirin masa depan belakangan ini. Kamu pernah ngerasa kayak hidup cuma ngalir aja nggak?", scenario: "Memulai dialog yang lebih bermakna tentang tujuan hidup." },
      { id: 'gs_m7', title: 'Giving a Suggestion', category: 'General', difficulty: 'Medium', text: "If I were you, I'd probably wait a bit before making a decision. You don't want to rush into anything.", translation: "Kalau saya jadi kamu, mungkin saya bakal nunggu bentar sebelum mutusin. Kamu nggak mau buru-buru, kan?", scenario: "Memberikan saran bijak dengan gaya bahasa 'seandainya saya jadi kamu'." },
      { id: 'gs_m8', title: 'Reacting to News', category: 'General', difficulty: 'Medium', text: "Wait, seriously? I had no idea that was going on! That's actually pretty wild if you think about it.", translation: "Eh, serius? Saya sama sekali nggak tahu itu terjadi! Itu lumayan gila sih kalau dipikir-pikir.", scenario: "Memberikan reaksi natural terhadap kabar yang tidak terduga." },
      { id: 'gs_m9', title: 'Handling a Mistake', category: 'General', difficulty: 'Medium', text: "My bad! I completely forgot we were supposed to meet at five. Can we reschedule for tomorrow?", translation: "Salah saya! Saya bener-bener lupa kalau kita harusnya ketemu jam lima. Bisa atur ulang jadwal buat besok?", scenario: "Mengakui kesalahan kecil dan segera menawarkan opsi pengganti." },
      { id: 'gs_m10', title: 'Sharing an Opinion', category: 'General', difficulty: 'Medium', text: "In my opinion, it's just much better to be upfront about things. It saves a lot of trouble in the long run.", translation: "Menurut saya, jauh lebih baik buat jujur di awal. Itu bakal ngehindarin banyak masalah kedepannya.", scenario: "Menyampaikan pandangan pribadi secara dewasa dan logis." },
      // HARD (5)
      { id: 'gs_h1', title: 'Navigating Conflict', category: 'General', difficulty: 'Hard', text: "I feel like there's been some tension between us lately, and I'd really like to clear the air if possible.", translation: "Rasanya belakangan ini ada ketegangan di antara kita, dan saya pengen banget nyelesein masalahnya kalau bisa.", scenario: "Mengajak orang lain untuk menyelesaikan konflik interpersonal secara dewasa." },
      { id: 'gs_h2', title: 'Art of Persuasion', category: 'General', difficulty: 'Hard', text: "I understand your concerns, but have you considered the long-term benefits of this approach? It could be a game-changer.", translation: "Saya paham kekhawatiranmu, tapi apa kamu sudah nimbang keuntungan jangka panjangnya? Ini bisa ngerubah segalanya lho.", scenario: "Mencoba meyakinkan orang lain dengan argumen yang logis dan persuasif." },
      { id: 'gs_h3', title: 'Public Speaking Jitters', category: 'General', difficulty: 'Hard', text: "I've got a major presentation tomorrow, and I'm honestly a nervous wreck. I just hope I don't freeze up on stage.", translation: "Besok saya ada presentasi besar, dan jujur saya deg-degan parah. Saya cuma berharap nggak kaku pas di panggung.", scenario: "Mengekspresikan kecemasan yang mendalam ('nervous wreck')." },
      { id: 'gs_h4', title: 'Deep Reflection', category: 'General', difficulty: 'Hard', text: "It's interesting how our social circles shape our perspectives. I've realized that the people we surround ourselves with truly matter.", translation: "Menarik ya gimana lingkaran sosial kita ngebentuk cara pandang kita. Saya sadar kalau orang-orang di sekitar kita itu beneran ngaruh banget.", scenario: "Berbagi pemikiran filosofis tentang pengaruh lingkungan sosial." },
      { id: 'gs_h5', title: 'Setting Boundaries', category: 'General', difficulty: 'Hard', text: "I really value our friendship, but I need to set some boundaries regarding my personal space. I hope you understand.", translation: "Saya bener-bener ngehargain pertemanan kita, tapi saya perlu buat batasan soal ruang pribadi saya. Semoga kamu paham ya.", scenario: "Menyampaikan batasan pribadi secara tegas namun tetap menghargai hubungan." },
    ]
  },
  {
    id: 'gen_travel',
    title: 'Travel & Exploration',
    category: 'General',
    icon: 'fa-plane',
    description: 'Street-smart English for navigating new places, from airports to hidden gems.',
    tasks: [
      // EASY (10)
      {
        id: 'gt2',
        title: 'Lost in the City',
        category: 'General',
        difficulty: 'Easy',
        text: "Excuse me, I'm a bit lost. Do you happen to know where the nearest station is?",
        translation: "Permisi, saya agak nyasar. Tahu nggak di mana stasiun terdekat?",
        scenario: "Gunakan 'do you happen to know' agar terdengar lebih sopan saat bertanya kepada orang asing di jalan."
      },
      {
        id: 'gt3',
        title: 'Hotel Check-in',
        category: 'General',
        difficulty: 'Easy',
        text: "Hi there! Checking in for Smith. We've got a reservation for a double room.",
        translation: "Halo! Mau check-in atas nama Smith. Kami ada reservasi kamar double.",
        scenario: "Kalimat standar saat sampai di resepsionis hotel untuk proses administrasi masuk kamar."
      },
      { id: 'gt_e3', title: 'Airport Taxi', category: 'General', difficulty: 'Easy', text: "Can you take me to the airport, please? How much is the fare, roughly?", translation: "Bisa anter saya ke bandara? Kira-kira ongkosnya berapa ya?", scenario: "Memesan taksi menuju bandara dan menanyakan perkiraan biaya." },
      { id: 'gt_e4', title: 'Free Wi-Fi', category: 'General', difficulty: 'Easy', text: "Is there free Wi-Fi in this cafe? Do you happen to have the password?", translation: "Ada Wi-Fi gratis di kafe ini nggak? Boleh minta password-nya?", scenario: "Menanyakan akses internet gratis di tempat umum." },
      { id: 'gt_e5', title: 'Ordering Street Food', category: 'General', difficulty: 'Easy', text: "This smells amazing! I'll take one of those, please. Not too spicy, though.", translation: "Baunya enak banget! Saya mau satu ya. Jangan terlalu pedes tapi.", scenario: "Membeli makanan kaki lima dengan instruksi rasa tertentu." },
      { id: 'gt_e6', title: 'Platform Search', category: 'General', difficulty: 'Easy', text: "Excuse me, which platform does the train to London leave from?", translation: "Permisi, kereta ke London berangkat dari peron mana ya?", scenario: "Mencari peron keberangkatan kereta di stasiun besar." },
      { id: 'gt_e7', title: 'Taking a Photo', category: 'General', difficulty: 'Easy', text: "Would you mind taking a quick photo of us? Just hit the button right there.", translation: "Boleh minta tolong fotoin kita sebentar? Tinggal pencet tombol yang di situ aja.", scenario: "Meminta tolong orang asing untuk mengambil foto kenang-kenangan." },
      { id: 'gt_e8', title: 'Currency Exchange', category: 'General', difficulty: 'Easy', text: "Where can I exchange some money around here? Is there a bank nearby?", translation: "Di mana saya bisa tukar uang di sekitar sini? Ada bank deket sini nggak?", scenario: "Mencari tempat penukaran uang saat di luar negeri." },
      { id: 'gt_e9', title: 'Ticket Booking', category: 'General', difficulty: 'Easy', text: "I'd like to buy two tickets for the city tour, please. For the ten o'clock slot.", translation: "Saya mau beli dua tiket buat tur kota. Buat slot jam sepuluh ya.", scenario: "Melakukan pemesanan tiket wisata secara langsung." },
      { id: 'gt_e10', title: 'Asking for the Bill', category: 'General', difficulty: 'Easy', text: "Check, please! We're in a bit of a hurry to catch our next bus.", translation: "Minta bilnya! Kami agak buru-u mau ngejar bus selanjutnya.", scenario: "Meminta tagihan restoran dengan sopan saat harus segera pergi." },
      // MEDIUM (10)
      {
        id: 'gt1',
        title: 'Asking for Local Tips',
        category: 'General',
        difficulty: 'Medium',
        text: "What's the one place I absolutely shouldn't miss while I'm here? I'm looking for hidden gems.",
        translation: "Tempat mana yang benar-benar nggak boleh saya lewatkan selama di sini? Saya nyari tempat yang unik (jarang diketahui orang).",
        scenario: "Gunakan 'hidden gems' untuk menanyakan tempat yang indah namun tidak terlalu ramai turis."
      },
      { id: 'gt_m2', title: 'Delayed Flight', category: 'General', difficulty: 'Medium', text: "My flight's been delayed for three hours already. Is there any chance I can get a meal voucher?", translation: "Penerbangan saya sudah telat tiga jam. Ada kemungkinan saya dapet voucher makan nggak?", scenario: "Menanyakan kompensasi saat menghadapi penundaan penerbangan." },
      { id: 'gt_m3', title: 'Booking a Tour', category: 'General', difficulty: 'Medium', text: "I'm interested in the day trip to the mountains. Does it include lunch and transportation?", translation: "Saya tertarik sama trip harian ke gunung. Itu sudah termasuk makan siang sama transportasi belum?", scenario: "Menanyakan detail fasilitas dalam sebuah paket tur." },
      { id: 'gt_m4', title: 'Car Rental Trouble', category: 'General', difficulty: 'Medium', text: "There's a strange noise coming from the car. I think I need to swap it for another one.", translation: "Ada bunyi aneh dari mobilnya. Kayaknya saya perlu tukar sama mobil yang lain.", scenario: "Melaporkan masalah pada mobil sewaan." },
      { id: 'gt_m5', title: 'Packing Dilemma', category: 'General', difficulty: 'Medium', text: "I've packed way too much! I'm really worried my suitcase's gonna be over the weight limit.", translation: "Saya bawa barang kebanyakan! Khawatir banget koper saya bakal lewat batas berat.", scenario: "Mengeluhkan barang bawaan yang terlalu banyak saat traveling." },
      { id: 'gt_m6', title: 'Finding the Way Back', category: 'General', difficulty: 'Medium', text: "I must've taken a wrong turn somewhere. Everything's starting to look the same around here.", translation: "Pasti saya tadi salah belok. Semuanya mulai keliatan sama di sekitar sini.", scenario: "Menyadari bahwa Anda tersesat karena salah mengambil rute." },
      { id: 'gt_m7', title: 'Reviewing a Place', category: 'General', difficulty: 'Medium', text: "The view from the top is definitely worth the climb! I'd highly recommend it to anyone.", translation: "Pemandangan dari atas bener-bener sebanding sama usahanya! Saya rekomendasiin banget buat siapa pun.", scenario: "Mempromosikan tempat wisata yang bagus kepada orang lain." },
      { id: 'gt_m8', title: 'Language Barrier', category: 'General', difficulty: 'Medium', text: "I'm'ta be honest, my French is a bit rusty, so I'm relying heavily on translation apps.", translation: "Jujur aja, bahasa Prancis saya agak kaku, jadi saya banyak ngandelin aplikasi terjemahan.", scenario: "Mengakui keterbatasan bahasa saat berada di luar negeri." },
      { id: 'gt_m9', title: 'Late Check-out', category: 'General', difficulty: 'Medium', text: "Would it be possible to have a late check-out? My flight isn't until late this evening.", translation: "Mungkin nggak kalau saya check-out telat? Penerbangan saya baru nanti malam banget.", scenario: "Meminta izin untuk keluar hotel lebih lambat dari jadwal normal." },
      { id: 'gt_m10', title: 'Safety Concerns', category: 'General', difficulty: 'Medium', text: "I've heard some mixed reviews about this neighborhood. Is it generally safe to walk around at night?", translation: "Saya denger ulasan yang campur aduk soal lingkungan ini. Umumnya aman nggak jalan-jalan malem di sini?", scenario: "Menanyakan keamanan suatu area kepada penduduk lokal." },
      // HARD (5)
      { id: 'gt_h1', title: 'Solo Travel Reflection', category: 'General', difficulty: 'Hard', text: "Solo travel's such a transformative experience; it really pushes you outside of your comfort zone, you know?", translation: "Traveling sendirian itu pengalaman yang ngerubah diri banget; bener-bener dorong kamu keluar dari zona nyaman, tahu kan?", scenario: "Berbagi filosofi tentang manfaat bepergian seorang diri." },
      { id: 'gt_h2', title: 'Cultural Sensitivity', category: 'General', difficulty: 'Hard', text: "It's crucial to be mindful of local customs and traditions when you're visiting a different country.", translation: "Penting banget buat perhatiin adat dan tradisi lokal pas kamu lagi ngunjungin negara lain.", scenario: "Menekankan pentingnya menghargai budaya setempat saat traveling." },
      { id: 'gt_h3', title: 'Overtourism Debate', category: 'General', difficulty: 'Hard', text: "I'm seriously concerned about the impact of overtourism on these fragile ecosystems; we need to find a balance.", translation: "Saya bener-bener khawatir soal dampak pariwisata berlebihan di ekosistem yang rapuh ini; kita harus cari keseimbangan.", scenario: "Mendiskusikan isu lingkungan terkait ledakan jumlah turis." },
      { id: 'gt_h4', title: 'The Art of Wandering', category: 'General', difficulty: 'Hard', text: "Sometimes the best travel experiences happen when you throw away the map and just let yourself get lost.", translation: "Kadang pengalaman travel terbaik itu terjadi pas kamu buang petanya dan biarin dirimu nyasar gitu aja.", scenario: "Membahas konsep petualangan yang tidak terencana." },
      { id: 'gt_h5', title: 'Global Citizenship', category: 'General', difficulty: 'Hard', text: "Traveling has taught me that we're all part of a global community; it's broadened my horizons in so many ways.", translation: "Traveling ngajarin saya kalau kita semua bagian dari komunitas global; itu ngebuka wawasan saya dalam banyak hal.", scenario: "Menceritakan bagaimana perjalanan mengubah perspektif tentang dunia." },
    ]
  },
  {
    id: 'gen_work',
    title: 'Work & Professional',
    category: 'General',
    icon: 'fa-briefcase',
    description: 'Master the office talk with polite yet natural phrases for meetings and feedback.',
    tasks: [
      // EASY (10)
      {
        id: 'w1',
        title: 'Asking for Feedback',
        category: 'General',
        difficulty: 'Easy',
        text: "Could you spare a second to take a quick look at this? I just want to make sure I'm on the right track.",
        translation: "Bisa minta waktunya sebentar untuk cek ini? Saya cuma mau memastikan kalau sudah di jalur yang benar.",
        scenario: "Gunakan kalimat ini ketika Anda ingin meminta bantuan rekan kerja untuk melihat pekerjaan Anda secara santai namun profesional."
      },
      { id: 'gw_e2', title: 'Morning Greeting', category: 'General', difficulty: 'Easy', text: "Morning, everyone! Hope you all had a great weekend. Let's get this meeting started.", translation: "Pagi semuanya! Semoga akhir pekan kalian menyenangkan. Yuk, kita mulai rapatnya.", scenario: "Menyapa rekan kerja di pagi hari sebelum memulai rapat." },
      { id: 'gw_e3', title: 'Offering Coffee', category: 'General', difficulty: 'Easy', text: "I'm heading to the breakroom for some coffee. Does anyone else want a refill?", translation: "Saya mau ke pantry ambil kopi. Ada yang mau isi ulang juga nggak?", scenario: "Menawarkan traktiran atau bantuan kecil di kantor." },
      { id: 'gw_e4', title: 'Setting a Reminder', category: 'General', difficulty: 'Easy', text: "Don't forget the deadline is at five today! We've really got to stay focused.", translation: "Jangan lupa tenggat waktunya jam lima hari ini! Kita bener-bener harus fokus.", scenario: "Mengingatkan rekan satu tim tentang batas waktu pekerjaan." },
      { id: 'gw_e5', title: 'Agreeing to a Task', category: 'General', difficulty: 'Easy', text: "Sure thing! I can definitely take care of that for you. I'll have it done by noon.", translation: "Tentu! Saya bisa kok ngerjain itu buat kamu. Jam dua belas bakal beres.", scenario: "Menyatakan kesediaan untuk membantu tugas rekan kerja." },
      { id: 'gw_e6', title: 'Asking for Help', category: 'General', difficulty: 'Easy', text: "Sorry, I'm a bit stuck on this. Do you happen to know the password for the server?", translation: "Maaf, saya agak bingung nih. Tahu password buat server-nya nggak?", scenario: "Menanyakan informasi teknis yang diperlukan di kantor." },
      { id: 'gw_e7', title: 'Joining a Meeting', category: 'General', difficulty: 'Easy', text: "Hi, sorry I'm late! The traffic was a total nightmare this morning. What'd I miss?", translation: "Halo, maaf saya telat! Macetnya parah banget tadi pagi. Saya ketinggalan info apa aja tadi?", scenario: "Menjelaskan alasan keterlambatan masuk rapat secara wajar." },
      { id: 'gw_e8', title: 'Positive Feedback', category: 'General', difficulty: 'Easy', text: "Great job on the presentation! I really liked the way you handled the Q&A session.", translation: "Kerja bagus buat presentasinya! Saya suka banget cara kamu nanganin sesi tanya jawab tadi.", scenario: "Memberikan pujian atas performa kerja kolega." },
      { id: 'gw_e9', title: 'Quick Question', category: 'General', difficulty: 'Easy', text: "Hey, quick question! Are we still on for the lunch meeting at twelve?", translation: "Eh, tanya bentar! Jadi kan agenda makan siang jam dua belas nanti?", scenario: "Konfirmasi jadwal pertemuan secara informal." },
      { id: 'gw_e10', title: 'Leaving for the Day', category: 'General', difficulty: 'Easy', text: "Alright, I'm heading out. See you all tomorrow morning! Have a good evening.", translation: "Oke, saya cabut ya. Sampai ketemu besok pagi semuanya! Selamat sore.", scenario: "Berpamitan saat jam pulang kerja." },
      // MEDIUM (10)
      {
        id: 'w2',
        title: 'Polite Interruption',
        category: 'General',
        difficulty: 'Medium',
        text: "Sorry to jump in, but I was just thinking... wouldn't it be better if we focused on the user experience first?",
        translation: "Maaf menyela, tapi saya tadi berpikir... bukankah lebih baik kalau kita fokus ke pengalaman pengguna dulu?",
        scenario: "Cara sopan untuk menyela di tengah rapat ketika Anda memiliki ide yang berbeda namun ingin tetap menghargai suasana."
      },
      {
        id: 'w3',
        title: 'Declining a Meeting',
        category: 'General',
        difficulty: 'Medium',
        text: "I'd love to join, but I'm swamped with the project deadline today. Can we touch base tomorrow instead?",
        translation: "Saya ingin sekali ikut, tapi saya lagi sibuk banget sama deadline proyek hari ini. Bisa kita obrolin besok saja?",
        scenario: "Gunakan 'swamped' untuk menunjukkan Anda sangat sibuk, dan 'touch base' untuk mengajak bicara lagi nanti."
      },
      { id: 'gw_m3', title: 'Negotiating Workload', category: 'General', difficulty: 'Medium', text: "I'm happy to help, but I'm already juggling quite a bit. Could we prioritize these tasks first?", translation: "Saya seneng bisa bantu, tapi saya sudah nanganin banyak hal nih. Bisa kita prioritasin tugas-tugas ini dulu nggak?", scenario: "Menegosiasikan beban kerja yang terlalu banyak dengan atasan atau rekan." },
      { id: 'gw_m4', title: 'Brainstorming Session', category: 'General', difficulty: 'Medium', text: "That's an interesting idea, but how would it actually impact our budget in the long run?", translation: "Itu ide yang menarik, tapi gimana itu bakal ngaruh ke budget kita kedepannya nanti?", scenario: "Memberikan kritik konstruktif saat sesi bertukar ide." },
      { id: 'gw_m5', title: 'Taking Ownership', category: 'General', difficulty: 'Medium', text: "I'll take full responsibility for the delay. I should've communicated the issues much earlier.", translation: "Saya bakal tanggung jawab penuh buat penundaannya. Harusnya saya sampaikan masalahnya lebih awal.", scenario: "Mengakui kesalahan profesional secara jantan." },
      { id: 'gw_m6', title: 'Seeking Clarification', category: 'General', difficulty: 'Medium', text: "I'm not sure I quite follow. Could you explain that bit about the new policy again, please?", translation: "Saya kurang nangkep maksudnya. Bisa tolong jelasin lagi bagian soal kebijakan baru tadi?", scenario: "Meminta penjelasan ulang akan poin yang kurang dipahami." },
      { id: 'gw_m7', title: 'Requesting Resources', category: 'General', difficulty: 'Medium', text: "To finish this on time, we really need to bring in some extra help. Maybe a freelancer?", translation: "Biar selesai tepat waktu, kita beneran butuh bantuan tambahan. Mungkin pekerja lepas (freelancer)?", scenario: "Mengusulkan penambahan tenaga kerja untuk mengejar target." },
      { id: 'gw_m8', title: 'Professional Setback', category: 'General', difficulty: 'Medium', text: "It's definitely a setback, but I'm confident we can turn things around if we stay focused.", translation: "Ini beneran hambatan sih, tapi saya yakin kita bisa balikin keadaan kalau kita tetep fokus.", scenario: "Memberikan semangat kepada tim setelah kegagalan atau hambatan." },
      { id: 'gw_m9', title: 'Updating Progress', category: 'General', difficulty: 'Medium', text: "Just a quick update: we've finished the initial phase and are ready to move on to testing.", translation: "Sekadar update: fase awal sudah selesai dan kami siap lanjut ke tahap pengujian.", scenario: "Memberikan laporan kemajuan pekerjaan secara ringkas." },
      { id: 'gw_m10', title: 'Discussing Career', category: 'General', difficulty: 'Medium', text: "I'm'ta be honest, I'm looking for more opportunities for growth within the company.", translation: "Jujur aja, saya lagi nyari lebih banyak peluang buat berkembang di perusahaan ini.", scenario: "Menyampaikan aspirasi karier kepada supervisor." },
      // HARD (5)
      { id: 'gw_h1', title: 'Strategic Planning', category: 'General', difficulty: 'Hard', text: "We need to adopt a multi-faceted approach if we're going to expand into these new markets successfully.", translation: "Kita perlu pake pendekatan yang beragam kalau mau sukses ekspansi ke pasar-pasar baru ini.", scenario: "Membahas strategi bisnis tingkat lanjut dalam rapat direksi." },
      { id: 'gw_h2', title: 'Ethical Leadership', category: 'General', difficulty: 'Hard', text: "Our commitment to ethical business practices must remain unwavering, even in the face of intense pressure.", translation: "Komitmen kita ke praktik bisnis yang etis harus tetep kuat, bahkan pas dapet tekanan yang berat.", scenario: "Menegaskan integritas perusahaan dalam situasi sulit." },
      { id: 'gw_h3', title: 'Conflict Resolution', category: 'General', difficulty: 'Hard', text: "I'd like to schedule a formal mediation session to address the ongoing issues within the sales department.", translation: "Saya mau bikin jadwal sesi mediasi formal buat nanganin masalah yang terus berlanjut di departemen penjualan.", scenario: "Mengusulkan solusi formal untuk konflik internal tim." },
      { id: 'gw_h4', title: 'Innovation Talk', category: 'General', difficulty: 'Hard', text: "Disruptive innovation's the only way we're going to stay ahead of the competition in this rapidly evolving field.", translation: "Inovasi yang disruptif itu satu-satunya cara kita bisa tetep unggul dari kompetitor di bidang yang berkembang cepet ini.", scenario: "Mendorong rekan kerja untuk berpikir di luar kotak (think outside the box)." },
      { id: 'gw_h5', title: 'Global Market', category: 'General', difficulty: 'Hard', text: "We have to be mindful of the cultural nuances involved when we're dealing with our international clients.", translation: "Kita harus perhatiin nuansa budaya pas lagi berurusan sama klien internasional kita.", scenario: "Mengingatkan pentingnya kepekaan budaya dalam bisnis global." },
    ]
  },
  {
    id: 'gen_health',
    title: 'Health & Wellness',
    category: 'General',
    icon: 'fa-heartbeat',
    description: 'Communicate health needs and discuss wellness habits effectively.',
    tasks: [
      // EASY (10)
      { id: 'gh_e1', title: 'Feeling Under the Weather', category: 'General', difficulty: 'Easy', text: "I've been feeling a bit under the weather. My head is pounding.", translation: "Saya lagi kurang enak badan. Kepala saya rasanya mau pecah." },
      { id: 'gh_e2', title: 'Pharmacy Run', category: 'General', difficulty: 'Easy', text: "Hi, do you have anything for a scratchy throat? It's really bothering me.", translation: "Halo, ada obat buat tenggorokan gatal nggak? Ganggu banget nih." },
      { id: 'gh_e3', title: 'Emergency!', category: 'General', difficulty: 'Easy', text: "Quick, someone call an ambulance! It's an emergency!", translation: "Cepat, tolong panggil ambulans! Ini darurat!" },
      { id: 'gh_e4', title: 'Staying Hydrated', category: 'General', difficulty: 'Easy', text: "I'm trying to drink more water lately. It really helps with my energy.", translation: "Saya lagi nyoba banyakin minum air putih. Ngaruh banget ke energi saya." },
      { id: 'gh_e5', title: 'Desk Pain', category: 'General', difficulty: 'Easy', text: "My back is killing me! I think I've been sitting at my desk for too long.", translation: "Punggung saya pegal banget! Kayaknya saya kelamaan duduk di meja." },
      { id: 'gh_e6', title: 'Sleep Schedule', category: 'General', difficulty: 'Easy', text: "I'm trying to get to bed earlier. I need my eight hours!", translation: "Saya lagi nyoba tidur lebih awal. Saya butuh tidur delapan jam!" },
      { id: 'gh_e7', title: 'Healthy Snack', category: 'General', difficulty: 'Easy', text: "I've swapped chips for apples. It's a small change, but I feel better.", translation: "Saya ganti keripik sama apel. Perubahan kecil sih, tapi saya ngerasa lebih baik." },
      { id: 'gh_e8', title: 'Morning Jog', category: 'General', difficulty: 'Easy', text: "Nothing beats a quick jog in the morning to clear your head.", translation: "Nggak ada yang ngalahin lari pagi sebentar buat nyegerin pikiran." },
      { id: 'gh_e9', title: 'Vitamin Check', category: 'General', difficulty: 'Easy', text: "Do you take any vitamins? I'm thinking of starting a daily multivitamin.", translation: "Kamu minum vitamin nggak? Saya lagi mikir mau mulai minum multivitamin harian." },
      { id: 'gh_e10', title: 'Back on My Feet', category: 'General', difficulty: 'Easy', text: "I'm finally feeling like myself again after that nasty cold.", translation: "Akhirnya saya ngerasa seger lagi setelah flu parah kemarin." },
      // MEDIUM (10)
      { id: 'gh_m1', title: 'Doctor Visit', category: 'General', difficulty: 'Medium', text: "I've been having this really weird chest pain lately; it's probably nothing, but I can't help feeling a bit worried.", translation: "Belakangan ini saya ngerasa nyeri dada yang aneh banget; mungkin nggak apa-apa sih, tapi saya nggak bisa nggak khawatir." },
      { id: 'gh_m2', title: 'Cutting Sugar', category: 'General', difficulty: 'Medium', text: "I'm seriously trying to cut back on my sugar intake, but it's just so hard when there's cake everywhere!", translation: "Saya bener-bener nyoba ngurangin asupan gula, tapi susah banget kalau ada kue di mana-mana!" },
      { id: 'gh_m3', title: 'Mindfulness', category: 'General', difficulty: 'Medium', text: "Meditation has honestly been a total lifesaver for my stress levels lately; you should really give it a go!", translation: "Jujur meditasi bener-bener ngebantu banget ngadepin stres saya belakangan ini; kamu harus coba deh!" },
      { id: 'gh_m4', title: 'Allergy Alert', category: 'General', difficulty: 'Medium', text: "Just a quick heads up, I'm actually deathly allergic to peanuts, so please be extra careful with the food!", translation: "Sekadar info, saya sebenernya alergi parah sama kacang, jadi tolong hati-hati banget sama makanannya ya!" },
      { id: 'gh_m5', title: 'Physical Therapy', category: 'General', difficulty: 'Medium', text: "I'm currently doing physical therapy for my knee; it's slow progress, but I feel like I'm finally getting there.", translation: "Sekarang saya lagi terapi fisik buat lutut; kemajuannya pelan, tapi rasanya saya mulai membaik kok." },
      { id: 'gh_m6', title: 'Side Effects', category: 'General', difficulty: 'Medium', text: "Is there any chance this medicine might make me feel drowsy? I've got to drive quite a long way later.", translation: "Ada kemungkinan obat ini bakal bikin saya ngantuk? Saya harus nyetir lumayan jauh nanti." },
      { id: 'gh_m7', title: 'Describing Symptoms', category: 'General', difficulty: 'Medium', text: "I've had this nagging cough for days now, and I've just been feeling super tired all week long.", translation: "Saya batuk terus sudah berhari-hari, dan rasanya capek banget sepanjang minggu." },
      { id: 'gh_m8', title: 'Balance is Key', category: 'General', difficulty: 'Medium', text: "It's all about finding that balance, right? Eating good food, getting some exercise, and making sure you get enough rest.", translation: "Semuanya itu soal nyari keseimbangan, kan? Makan enak, olahraga, dan mastiin istirahat cukup." },
      { id: 'gh_m9', title: 'Annual Checkup', category: 'General', difficulty: 'Medium', text: "I've got my yearly checkup scheduled for tomorrow; I'm really hoping for a clean bill of health!", translation: "Saya ada jadwal pemeriksaan tahunan besok; saya bener-bener berharap hasilnya sehat-sehat aja!" },
      { id: 'gh_m10', title: 'Burnout Talk', category: 'General', difficulty: 'Medium', text: "I feel like I'm starting to hit a wall at work, so I really need to start prioritizing my mental health more.", translation: "Rasanya saya mulai jenuh sama kerjaan, jadi saya bener-bener harus mulai lebih prioritasin kesehatan mental saya." },
      // HARD (5)
      { id: 'gh_h1', title: 'Medical History', category: 'General', difficulty: 'Hard', text: "I'll need you to walk me through any past surgeries or chronic conditions you might have, so we can get a full picture of your health.", translation: "Saya perlu kamu jelasin soal operasi di masa lalu atau kondisi kronis yang mungkin kamu punya, biar kita dapet gambaran lengkap soal kesehatanmu." },
      { id: 'gh_h2', title: 'Prevention First', category: 'General', difficulty: 'Hard', text: "Prevention is way better than cure, so getting regular checkups can literally be a lifesaver; it's an investment in your future self.", translation: "Mencegah itu jauh lebih baik daripada mengobati, jadi rutin periksa itu bener-bener bisa nyelamatin nyawa; itu investasi buat dirimu di masa depan." },
      { id: 'gh_h3', title: 'Treatment Plan', category: 'General', difficulty: 'Hard', text: "The doctor explained the diagnosis in detail, and now we're weighing up a few different treatment options to see what's best for me.", translation: "Dokter ngejelasin diagnosisnya detail banget, dan sekarang kami lagi nimbang beberapa pilihan pengobatan buat liat mana yang terbaik buat saya." },
      { id: 'gh_h4', title: 'Holistic Approach', category: 'General', difficulty: 'Hard', text: "I'm starting to look into a more holistic approach to my health, focusing on both my mind and body to achieve a better sense of balance.", translation: "Saya mulai nyari pendekatan yang lebih holistik buat kesehatan saya, fokus ke pikiran sama tubuh juga buat dapet keseimbangan yang lebih baik." },
      { id: 'gh_h5', title: 'Public Health', category: 'General', difficulty: 'Hard', text: "We've all got to pull together if we want to tackle these major health issues in our community; it's a collective responsibility.", translation: "Kita semua harus kerja bareng kalau mau nyelesein masalah kesehatan besar di komunitas kita; ini tanggung jawab kita bareng-bareng." },
    ]
  },
  {
    id: 'gen_shopping',
    title: 'Shopping & Commerce',
    category: 'General',
    icon: 'fa-shopping-cart',
    description: 'Master the language of shopping, from bargaining to online orders.',
    tasks: [
      // EASY (10)
      { id: 'gsh_e1', title: 'Price Check', category: 'General', difficulty: 'Easy', text: "How much are you asking for this shirt? Does it come in any other colors?", translation: "Berapa harga kemeja ini? Ada warna lain nggak?" },
      { id: 'gsh_e2', title: 'Finding Milk', category: 'General', difficulty: 'Easy', text: "Excuse me, where's the dairy section? I'm looking for some milk.", translation: "Permisi, bagian produk susu di mana ya? Saya lagi nyari susu." },
      { id: 'gsh_e3', title: 'Fitting Room', category: 'General', difficulty: 'Easy', text: "Can I try this on? Where are the fitting rooms located?", translation: "Bisa saya coba ini? Ruang gantinya di mana ya?" },
      { id: 'gsh_e4', title: 'Payment Method', category: 'General', difficulty: 'Easy', text: "Do you guys take cards, or is it strictly cash?", translation: "Bisa pakai kartu nggak, atau cuma bisa tunai?" },
      { id: 'gsh_e5', title: 'Bargaining', category: 'General', difficulty: 'Easy', text: "Is this the best price you can do? It's a little over my budget.", translation: "Ini harga pasnya? Agak lewat budget saya nih." },
      { id: 'gsh_e6', title: 'Grocery List', category: 'General', difficulty: 'Easy', text: "I just need to grab some bread, milk, and maybe a dozen eggs.", translation: "Saya cuma perlu beli roti, susu, sama mungkin selusin telur." },
      { id: 'gsh_e7', title: 'Receipt Please', category: 'General', difficulty: 'Easy', text: "Can I get a receipt, please? Just in case I need to bring it back.", translation: "Bisa minta struknya? Jaga-jaga kalau saya mau balikin." },
      { id: 'gsh_e8', title: 'Closing Time', category: 'General', difficulty: 'Easy', text: "What time do you guys close tonight? I might be back later.", translation: "Jam berapa tutupnya malam ini? Mungkin saya balik lagi nanti." },
      { id: 'gsh_e9', title: 'No Bag Needed', category: 'General', difficulty: 'Easy', text: "I've got my own bag, thanks! No need for a plastic one.", translation: "Saya bawa tas sendiri, makasih! Nggak usah pakai plastik." },
      { id: 'gsh_e10', title: 'Size Search', category: 'General', difficulty: 'Easy', text: "Do you happen to have these shoes in a size eight?", translation: "Punya sepatu ini ukuran delapan nggak?" },
      // MEDIUM (10)
      { id: 'gsh_m1', title: 'Returning Clothes', category: 'General', difficulty: 'Medium', text: "I'd like to return this dress, if possible; it just doesn't look quite right on me now that I've tried it on at home.", translation: "Saya mau balikin gaun ini kalau bisa; pas dicoba di rumah kayaknya kurang cocok aja di saya." },
      { id: 'gsh_m2', title: 'Laptop Comparison', category: 'General', difficulty: 'Medium', text: "Which of these two models has a better battery life? I'm always on the go and need something that lasts.", translation: "Mana dari dua model ini yang baterainya lebih awet? Saya sering bepergian dan butuh yang tahan lama." },
      { id: 'gsh_m3', title: 'Online Shopping', category: 'General', difficulty: 'Medium', text: "Do you happen to know any good sites for buying electronics? I'm currently looking for a new tablet.", translation: "Tahu situs bagus buat beli elektronik nggak? Saya lagi nyari tablet baru sekarang." },
      { id: 'gsh_m4', title: 'Warranty Check', category: 'General', difficulty: 'Medium', text: "Does this product come with a full warranty? I just want to make sure I'm covered if anything goes wrong.", translation: "Produk ini ada garansi penuhnya nggak? Saya cuma mau pastiin aman kalau ada apa-apa." },
      { id: 'gsh_m5', title: 'Coffee Recommendation', category: 'General', difficulty: 'Medium', text: "Can you recommend a really good coffee blend? I usually like it smooth and not too bitter.", translation: "Bisa rekomendasiin campuran kopi yang enak banget? Biasanya saya suka yang lembut dan nggak terlalu pahit." },
      { id: 'gsh_m6', title: 'Damaged Goods', category: 'General', difficulty: 'Medium', text: "This item unfortunately arrived damaged; how do I go about getting a replacement sent out?", translation: "Sayangnya barang ini pas sampai rusak; gimana cara dapet penggantinya?" },
      { id: 'gsh_m7', title: 'Clearance Sale', category: 'General', difficulty: 'Medium', text: "There's a massive sale going on at the mall right now! Almost everything is like 50% off.", translation: "Lagi ada diskon besar-besaran di mal sekarang! Hampir semuanya diskon kayak 50%." },
      { id: 'gsh_m8', title: 'Delivery Time', category: 'General', difficulty: 'Medium', text: "How long does the shipping usually take? I really need it to arrive by Friday if at all possible.", translation: "Biasanya pengirimannya berapa lama? Saya bener-bener butuh barangnya sampai hari Jumat kalau bisa." },
      { id: 'gsh_m9', title: 'Gift Selection', category: 'General', difficulty: 'Medium', text: "Could you possibly gift-wrap this for me? It's actually a gift for a close friend of mine who just moved into a new house.", translation: "Bisa tolong dibungkus kado? Ini sebenernya kado buat temen deket saya yang baru aja pindah rumah." },
      { id: 'gsh_m10', title: 'Out of Stock', category: 'General', difficulty: 'Medium', text: "I'm so sorry, but we're actually completely out of stock for that particular model right now.", translation: "Maaf banget, tapi stok model yang itu bener-bener lagi habis sekarang." },
      // HARD (5)
      { id: 'gsh_h1', title: 'Know Your Rights', category: 'General', difficulty: 'Hard', text: "You've really got to know your rights as a consumer, especially when you're dealing with faulty products or misleading advertisements.", translation: "Kamu bener-bener harus tahu hakmu sebagai konsumen, apalagi pas lagi ngurus barang yang rusak atau iklan yang nipu." },
      { id: 'gsh_h2', title: 'Digital Shift', category: 'General', difficulty: 'Hard', text: "The massive shift towards online shopping has really changed the game for small local businesses; they've had to adapt or risk being left behind.", translation: "Peralihan besar ke belanja online bener-bener ngerubah segalanya buat bisnis lokal kecil; mereka harus adaptasi atau risikonya ketinggalan." },
      { id: 'gsh_h3', title: 'Bargaining Skills', category: 'General', difficulty: 'Hard', text: "Bargaining is definitely an art form! You've got to know exactly when to stand your ground or walk away to get the absolute best deal.", translation: "Tawar-menawar itu bener-bener ada seninya! Kamu harus tahu kapan harus bertahan atau pergi biar dapet harga yang paling oke." },
      { id: 'gsh_h4', title: 'Ethical Choices', category: 'General', difficulty: 'Hard', text: "I'm trying to be a lot more mindful these days and only buy from brands that are actually ethical and sustainable in their practices.", translation: "Saya lagi nyoba lebih sadar sekarang dan cuma beli dari brand yang bener-bener etis dan berkelanjutan dalam praktiknya." },
      { id: 'gsh_h5', title: 'Spending Power', category: 'General', difficulty: 'Hard', text: "At the end of the day, how we choose to spend our money really does shape the world we live in; every purchase is like a vote for the future.", translation: "Ujung-ujungnya, gimana kita milih buat ngebelanjain uang kita itu bener-bener ngebentuk dunia kita; tiap pembelian itu kayak suara buat masa depan." },
    ]
  },
  {
    id: 'gen_education',
    title: 'Education & Learning',
    category: 'General',
    icon: 'fa-graduation-cap',
    description: 'Discuss academic life, learning strategies, and educational goals.',
    tasks: [
      // EASY (10)
      { id: 'ged_e1', title: 'Favorite Subject', category: 'General', difficulty: 'Easy', text: "I was always a huge history buff back in school. What about you?", translation: "Dulu pas sekolah saya suka banget sejarah. Kalau kamu?" },
      { id: 'ged_e2', title: 'Math Help', category: 'General', difficulty: 'Easy', text: "Could you help me out with this math problem? It's totally confusing.", translation: "Bisa bantuin ngerjain soal matematika ini nggak? Bingung banget nih." },
      { id: 'ged_e3', title: 'Cramming', category: 'General', difficulty: 'Easy', text: "I've got to hit the books tonight. My finals are next week!", translation: "Saya harus belajar keras malam ini. Ujian akhir saya minggu depan!" },
      { id: 'ged_e4', title: 'New Gear', category: 'General', difficulty: 'Easy', text: "Check out my new notebooks! I'm all set for the new semester.", translation: "Liat deh buku catatan baru saya! Sudah siap tempur buat semester baru." },
      { id: 'ged_e5', title: 'Library Vibe', category: 'General', difficulty: 'Easy', text: "The library is so quiet. It's the only place I can actually get work done.", translation: "Perpustakaan tenang banget. Cuma di sini saya benar-benar bisa ngerjain tugas." },
      { id: 'ged_e6', title: 'English Practice', category: 'General', difficulty: 'Easy', text: "I try to speak English every day. Practice makes perfect, right?", translation: "Saya nyoba ngomong bahasa Inggris tiap hari. Biar makin lancar, kan?" },
      { id: 'ged_e7', title: 'Cool Teacher', category: 'General', difficulty: 'Easy', text: "Our new teacher is actually really cool. She makes everything so easy to understand.", translation: "Guru baru kita asik banget lho. Dia bikin semuanya jadi gampang dimengerti." },
      { id: 'ged_e8', title: 'Class Start', category: 'General', difficulty: 'Easy', text: "What time do we have to be in class on Monday? I don't want to be late.", translation: "Jam berapa kita harus masuk kelas hari Senin? Saya nggak mau telat." },
      { id: 'ged_e9', title: 'Project Deadline', category: 'General', difficulty: 'Easy', text: "I'm pulling an all-nighter to finish this project. It's due tomorrow!", translation: "Saya mau begadang buat nyelesein proyek ini. Besok harus dikumpulin!" },
      { id: 'ged_e10', title: 'Graduation!', category: 'General', difficulty: 'Easy', text: "I can't believe we're graduating next month! Time flies, doesn't it?", translation: "Nggak nyangka kita bakal lulus bulan depan! Cepat banget ya waktu berlalu?" },
      // MEDIUM (10)
      { id: 'ged_m1', title: 'Math Struggles', category: 'General', difficulty: 'Medium', text: "I'm really struggling to wrap my head around this math problem; it's just so incredibly complex!", translation: "Saya bener-bener susah nangkep soal matematika ini; bener-bener rumit banget!" },
      { id: 'ged_m2', title: 'Hitting the Books', category: 'General', difficulty: 'Medium', text: "I've been hitting the books all night long because I've got a huge exam coming up tomorrow morning.", translation: "Saya belajar mati-matian semalaman suntuk karena ada ujian besar besok pagi." },
      { id: 'ged_m3', title: 'Essay Help', category: 'General', difficulty: 'Medium', text: "Could you possibly give me a hand with this essay? I'm just not sure if the ideas flow well enough.", translation: "Bisa tolong bantuin saya ngerjain esai ini nggak? Saya cuma nggak yakin apa ide-idenya sudah nyambung." },
      { id: 'ged_m4', title: 'Online Course', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of signing up for an online course, maybe something related to graphic design.", translation: "Saya bener-bener mikir mau daftar kursus online, mungkin sesuatu yang berhubungan sama desain grafis." },
      { id: 'ged_m5', title: 'Project Reflection', category: 'General', difficulty: 'Medium', text: "I've honestly learned so much from working on this project; it was tough, but really rewarding in the end.", translation: "Jujur saya belajar banyak banget dari ngerjain proyek ini; emang susah, tapi akhirnya kerasa bermanfaat banget." },
      { id: 'ged_m6', title: 'Language Learning', category: 'General', difficulty: 'Medium', text: "I'm really trying to brush up on my English, so I've been listening to a lot of educational podcasts lately.", translation: "Saya bener-bener nyoba ngelancarin bahasa Inggris saya, jadi belakangan ini saya sering dengerin podcast edukasi." },
      { id: 'ged_m7', title: 'Busy Semester', category: 'General', difficulty: 'Medium', text: "I've got quite a lot on my plate this semester, so I'm just hoping I can manage to stay on top of everything.", translation: "Tugas saya lumayan numpuk semester ini, jadi saya cuma berharap bisa nanganin semuanya dengan baik." },
      { id: 'ged_m8', title: 'Class Review', category: 'General', difficulty: 'Medium', text: "I'm so incredibly glad I decided to take this class; the professor is amazing and I've learned a ton.", translation: "Saya seneng banget mutusin buat ambil kelas ini; profesornya luar biasa dan saya belajar banyak banget." },
      { id: 'ged_m9', title: 'Master\'s Degree', category: 'General', difficulty: 'Medium', text: "I'm actually thinking of going back to school because I've always wanted to get my master's degree.", translation: "Saya sebenernya mikir mau kuliah lagi karena dari dulu pengen banget dapet gelar magister." },
      { id: 'ged_m10', title: 'Presentation Prep', category: 'General', difficulty: 'Medium', text: "I've been practicing my presentation all day long, but I'm still feeling a bit nervous about the Q&A part.", translation: "Saya sudah latihan presentasi seharian suntuk, tapi masih ngerasa agak deg-degan soal sesi tanya jawabnya." },
      // HARD (5)
      { id: 'ged_h1', title: 'System Reform', category: 'General', difficulty: 'Hard', text: "I honestly think the whole education system needs a major shake-up to keep up with the times; we're still using methods from decades ago.", translation: "Jujur saya mikir seluruh sistem pendidikan butuh perombakan besar biar nggak ketinggalan zaman; kita masih pake metode dari puluhan tahun yang lalu." },
      { id: 'ged_h2', title: 'Academic Honesty', category: 'General', difficulty: 'Hard', text: "Cheating is never worth it in the long run; your integrity is way more important than any grade you'll ever get in school.", translation: "Nyontek itu nggak bakal sepadan nantinya; integritasmu jauh lebih penting daripada nilai apa pun yang bakal kamu dapet di sekolah." },
      { id: 'ged_h3', title: 'AI in Class', category: 'General', difficulty: 'Hard', text: "It's pretty wild to think that AI is going to change the way we learn forever; I'm curious to see how it'll impact our critical thinking skills.", translation: "Luar biasa ya kalau dipikir-pikir AI bakal ngerubah cara kita belajar selamanya; saya penasaran gimana itu bakal ngaruh ke kemampuan berpikir kritis kita." },
      { id: 'ged_h4', title: 'Testing Debate', category: 'General', difficulty: 'Hard', text: "I've always wondered if standardized tests actually prove anything; I'm not so sure they're the best way to measure someone's true potential.", translation: "Saya selalu penasaran apa ujian standar itu beneran ngebuktiin sesuatu; saya nggak yakin itu cara terbaik buat ngukur potensi asli seseorang." },
      { id: 'ged_h5', title: 'Global Literacy', category: 'General', difficulty: 'Hard', text: "We really need to make sure that everyone, everywhere, has the chance to at least learn how to read and write; it's a basic human right.", translation: "Kita bener-bener harus pastiin semua orang, di mana pun, punya kesempatan buat setidaknya belajar baca tulis; itu hak asasi manusia yang paling dasar." },
    ]
  },
  {
    id: 'gen_tech',
    title: 'Technology & Digital',
    category: 'General',
    icon: 'fa-laptop-code',
    description: 'Stay updated with the latest in tech, gadgets, and digital trends.',
    tasks: [
      // EASY (10)
      { id: 'gtc_e1', title: 'Always Connected', category: 'General', difficulty: 'Easy', text: "I'm literally always on my phone checking emails. It's a habit!", translation: "Saya benar-benar selalu megang HP buat cek email. Sudah jadi kebiasaan!" },
      { id: 'gtc_e2', title: 'WiFi Hunt', category: 'General', difficulty: 'Easy', text: "Does this place have free WiFi? I really need to get online.", translation: "Di sini ada WiFi gratis nggak? Saya perlu banget online nih." },
      { id: 'gtc_e3', title: 'Text Me', category: 'General', difficulty: 'Easy', text: "Just shoot me a text with the details later, okay?", translation: "Nanti kirim pesan aja ya buat detailnya, oke?" },
      { id: 'gtc_e4', title: 'Low Battery', category: 'General', difficulty: 'Easy', text: "My phone's about to die! Do you have a charger I can borrow?", translation: "HP saya mau mati nih! Punya charger yang bisa saya pinjam nggak?" },
      { id: 'gtc_e5', title: 'Surfing the Web', category: 'General', difficulty: 'Easy', text: "I love just browsing the web for random interesting facts.", translation: "Saya suka banget cuma sekadar browsing buat nyari fakta-fakta unik." },
      { id: 'gtc_e6', title: 'Great Camera', category: 'General', difficulty: 'Easy', text: "The camera on this phone is insane! The pictures are so crisp.", translation: "Kamera di HP ini gila banget! Hasil fotonya tajam banget." },
      { id: 'gtc_e7', title: 'Social Media Post', category: 'General', difficulty: 'Easy', text: "I just posted some photos from my trip. Go check them out!", translation: "Saya baru aja posting foto-foto perjalanan saya. Coba liat deh!" },
      { id: 'gtc_e8', title: 'App Recommendation', category: 'General', difficulty: 'Easy', text: "You've got to download this app. It's a total game-changer for learning.", translation: "Kamu harus download aplikasi ini. Benar-benar ngebantu banget buat belajar." },
      { id: 'gtc_e9', title: 'Basic Skills', category: 'General', difficulty: 'Easy', text: "I'm pretty good with the basics, like Word and Excel.", translation: "Saya lumayan bisa sih kalau yang dasar-dasar, kayak Word sama Excel." },
      { id: 'gtc_e10', title: 'Online Shopping', category: 'General', difficulty: 'Easy', text: "Shopping online is so much easier than going to the mall, right?", translation: "Belanja online jauh lebih gampang daripada ke mal, kan?" },
      // MEDIUM (10)
      { id: 'gtc_m1', title: 'Phone Trouble', category: 'General', difficulty: 'Medium', text: "My phone is acting up again for some reason; I'm starting to think I might actually need to get a new one.", translation: "HP saya mulai eror lagi nggak tahu kenapa; saya mulai mikir kayaknya beneran harus beli yang baru deh." },
      { id: 'gtc_m2', title: 'Account Setup', category: 'General', difficulty: 'Medium', text: "I'm trying to set up a new account on this site, but I'm having a bit of trouble with the password requirements.", translation: "Saya lagi nyoba buat akun baru di situs ini, tapi agak kesulitan sama syarat kata sandinya." },
      { id: 'gtc_m3', title: 'App Review', category: 'General', difficulty: 'Medium', text: "I've been using this productivity app for a while now, and it's really helped me stay organized with my tasks.", translation: "Saya sudah pakai aplikasi produktivitas ini lumayan lama, dan bener-bener ngebantu saya tetep teratur sama tugas-tugas." },
      { id: 'gtc_m4', title: 'Laptop Search', category: 'General', difficulty: 'Medium', text: "I'm thinking of upgrading to a new laptop soon; do you happen to have any good recommendations for me?", translation: "Saya rencana mau ganti laptop baru dalam waktu deket; kamu punya rekomendasi yang bagus nggak buat saya?" },
      { id: 'gtc_m5', title: 'Digital Detox', category: 'General', difficulty: 'Medium', text: "I've been spending way too much time on my phone lately, so I think I really need to do a digital detox.", translation: "Belakangan ini saya terlalu banyak main HP, jadi kayaknya saya bener-bener butuh detoks digital." },
      { id: 'gtc_m6', title: 'Learning to Code', category: 'General', difficulty: 'Medium', text: "I'm currently trying to learn how to code in Python; it's tough, but I'm slowly starting to get the hang of it.", translation: "Sekarang saya lagi belajar coding pakai Python; emang susah, tapi pelan-pelan saya mulai terbiasa kok." },
      { id: 'gtc_m7', title: 'Software Update', category: 'General', difficulty: 'Medium', text: "I've been using this new software at work lately, and it's honestly made my daily tasks a lot easier to manage.", translation: "Belakangan ini saya pakai software baru di kantor, dan jujur itu bikin tugas harian saya jauh lebih gampang dikerjain." },
      { id: 'gtc_m8', title: 'Blogging Ideas', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of starting my own blog because I have so many ideas and stories I want to share.", translation: "Saya bener-bener mikir mau mulai bikin blog sendiri karena banyak banget ide dan cerita yang pengen saya bagiin." },
      { id: 'gtc_m9', title: 'Internet Issues', category: 'General', difficulty: 'Medium', text: "I've been having some major trouble with my internet connection; it's been incredibly slow for the past few days.", translation: "Koneksi internet saya lagi bermasalah banget; sudah beberapa hari ini lemotnya minta ampun." },
      { id: 'gtc_m10', title: 'Smart Watch', category: 'General', difficulty: 'Medium', text: "I'm considering getting a smart watch to track my fitness; do you honestly think it's worth the investment?", translation: "Saya lagi nimbang mau beli jam tangan pintar buat pantau kebugaran; menurutmu jujur itu sepadan nggak?" },
      // HARD (5)
      { id: 'gtc_h1', title: 'Blockchain Talk', category: 'General', difficulty: 'Hard', text: "I'm still trying to wrap my head around blockchain; it's way more than just Bitcoin, and it could really change how we handle data.", translation: "Saya masih nyoba mahamin blockchain; ternyata jauh lebih luas daripada cuma Bitcoin, dan itu bisa bener-bener ngerubah cara kita ngelola data." },
      { id: 'gtc_h2', title: 'Digital Divide', category: 'General', difficulty: 'Hard', text: "It's a real shame that not everyone has the same access to the internet; the digital divide is a huge issue that we need to address.", translation: "Sayang banget nggak semua orang punya akses internet yang sama; kesenjangan digital itu masalah besar yang harus kita tanganin." },
      { id: 'gtc_h3', title: 'Ethical AI', category: 'General', difficulty: 'Hard', text: "I really hope we can make sure AI is used to actually help people and solve real problems, and not just to make a quick buck.", translation: "Saya bener-bener berharap kita bisa pastiin AI dipake buat beneran bantu orang dan nyelesein masalah nyata, bukan cuma cari untung cepet." },
      { id: 'gtc_h4', title: 'Cyber Threats', category: 'General', difficulty: 'Hard', text: "It's honestly scary how sophisticated cyber attacks are getting these days; you have to be so careful with your personal information online.", translation: "Jujur serem ya liat serangan siber makin canggih sekarang; kita harus hati-hati banget sama informasi pribadi kita di internet." },
      { id: 'gtc_h5', title: 'Tech Speed', category: 'General', difficulty: 'Hard', text: "Tech is moving at such a crazy pace that I feel like I'm constantly trying to play catch-up with all the new gadgets and software.", translation: "Teknologi gerak cepet banget sampai rasanya saya kayak terus-terusan nyoba ngejar ketertinggalan sama semua gadget dan software baru." },
    ]
  },
  {
    id: 'gen_nature',
    title: 'Nature & Environment',
    category: 'General',
    icon: 'fa-leaf',
    description: 'Discuss the beauty of nature and the importance of environmental protection.',
    tasks: [
      // EASY (10)
      { id: 'gn_e1', title: 'Sunset View', category: 'General', difficulty: 'Easy', text: "The sunset yesterday was just breathtaking. Did you catch it?", translation: "Matahari terbenam kemarin keren banget. Kamu liat nggak?" },
      { id: 'gn_e2', title: 'Planting Trees', category: 'General', difficulty: 'Easy', text: "We should plant more trees. It's a small step, but it helps.", translation: "Kita harusnya nanam lebih banyak pohon. Langkah kecil, tapi ngebantu." },
      { id: 'gn_e3', title: 'Weekend Hike', category: 'General', difficulty: 'Easy', text: "I'm planning to go for a hike this weekend. Want to come along?", translation: "Saya rencana mau naik gunung akhir pekan ini. Mau ikut?" },
      { id: 'gn_e4', title: 'Recycling Habit', category: 'General', difficulty: 'Easy', text: "I've started recycling my plastic. It's not that hard once you get used to it.", translation: "Saya sudah mulai daur ulang plastik. Nggak susah kok kalau sudah biasa." },
      { id: 'gn_e5', title: 'Saving Water', category: 'General', difficulty: 'Easy', text: "Don't forget to turn off the tap. Every drop counts, right?", translation: "Jangan lupa matiin keran. Tiap tetes itu berharga, kan?" },
      { id: 'gn_e6', title: 'Bird Watching', category: 'General', difficulty: 'Easy', text: "I love waking up to the sound of birds chirping in the morning.", translation: "Saya suka banget bangun tidur denger suara burung berkicau di pagi hari." },
      { id: 'gn_e7', title: 'Fresh Air', category: 'General', difficulty: 'Easy', text: "The air out here is so much fresher than in the city. I love it!", translation: "Udara di sini jauh lebih segar daripada di kota. Suka banget!" },
      { id: 'gn_e8', title: 'Animal Protection', category: 'General', difficulty: 'Easy', text: "We've got to do something to protect these animals before they're gone.", translation: "Kita harus ngelakuin sesuatu buat ngelindungin hewan-hewan ini sebelum punah." },
      { id: 'gn_e9', title: 'Picnic Weather', category: 'General', difficulty: 'Easy', text: "It's such a beautiful day! Perfect for a picnic in the park.", translation: "Harinya cerah banget! Pas banget buat piknik di taman." },
      { id: 'gn_e10', title: 'Nature Walk', category: 'General', difficulty: 'Easy', text: "Whenever I'm stressed, a walk in nature always clears my head.", translation: "Tiap kali lagi stres, jalan-jalan di alam selalu bikin pikiran saya jernih." },
      // MEDIUM (10)
      { id: 'gn_m1', title: 'Eco-Friendly Habits', category: 'General', difficulty: 'Medium', text: "I'm really trying to be more eco-friendly lately, so I've started composting my food waste and recycling more.", translation: "Belakangan ini saya bener-bener nyoba buat lebih ramah lingkungan, jadi saya mulai ngolah kompos sisa makanan dan lebih rajin daur ulang." },
      { id: 'gn_m2', title: 'Outdoor Time', category: 'General', difficulty: 'Medium', text: "I've been trying to spend more time outdoors lately; it's just so refreshing to get away from the city and be in nature.", translation: "Belakangan ini saya nyoba buat lebih banyak ngabisin waktu di luar; seger banget rasanya bisa jauh dari kota dan nyatu sama alam." },
      { id: 'gn_m3', title: 'Climate Change', category: 'General', difficulty: 'Medium', text: "I'm deeply worried about the long-term impact of climate change; I really feel like we need to take action right now.", translation: "Saya bener-bener khawatir sama dampak jangka panjang perubahan iklim; saya rasa kita harus bertindak sekarang juga." },
      { id: 'gn_m4', title: 'Local Wildlife', category: 'General', difficulty: 'Medium', text: "I've been learning so much more about local wildlife lately; it's amazing how much nature is right in our own backyard.", translation: "Belakangan ini saya belajar banyak soal satwa liar lokal; luar biasa banget ternyata banyak alam yang ada di halaman belakang kita sendiri." },
      { id: 'gn_m5', title: 'Garden Dreams', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of starting a small garden because I've always wanted to grow my own organic vegetables.", translation: "Saya bener-bener mikir mau mulai bikin kebun kecil karena dari dulu pengen banget nanam sayuran organik sendiri." },
      { id: 'gn_m6', title: 'Hiking Views', category: 'General', difficulty: 'Medium', text: "I've been going on a lot more hikes lately, and I have to say, the views from the top are just breathtaking.", translation: "Belakangan ini saya jadi sering mendaki, dan harus saya akuin, pemandangan dari puncaknya bener-bener bikin takjub." },
      { id: 'gn_m7', title: 'Plastic Waste', category: 'General', difficulty: 'Medium', text: "I'm really trying to cut down on my plastic waste, so I've started always carrying reusable bags and water bottles.", translation: "Saya bener-bener nyoba ngurangin sampah plastik, jadi saya mulai selalu bawa tas belanja dan botol minum sendiri." },
      { id: 'gn_m8', title: 'Sustainable Living', category: 'General', difficulty: 'Medium', text: "I've been learning a lot more about sustainable living lately; it's definitely a journey, but I feel like I'm making progress.", translation: "Belakangan ini saya belajar banyak soal gaya hidup berkelanjutan; emang butuh proses, tapi rasanya saya mulai ada kemajuan." },
      { id: 'gn_m9', title: 'Biodiversity Loss', category: 'General', difficulty: 'Medium', text: "I'm quite worried about the rapid loss of biodiversity; we really need to do more to protect our natural habitats.", translation: "Saya lumayan khawatir sama hilangnya keanekaragaman hayati yang cepet banget; kita bener-bener harus berbuat lebih buat lindungin habitat alami kita." },
      { id: 'gn_m10', title: 'Beach Vibes', category: 'General', difficulty: 'Medium', text: "I've been spending a lot more time at the beach lately; there's something so calming about the sound of the waves.", translation: "Belakangan ini saya jadi sering ke pantai; ada sesuatu yang bikin tenang banget dari suara ombaknya." },
      // HARD (5)
      { id: 'gn_h1', title: 'Biodiversity', category: 'General', difficulty: 'Hard', text: "It's really sad how many species we're losing every single year; it's a silent crisis that's going to affect all of us eventually.", translation: "Sedih banget liat banyak spesies yang punah tiap tahunnya; ini krisis diam-diam yang bakal berdampak ke kita semua ujung-ujungnya." },
      { id: 'gn_h2', title: 'Carbon Footprint', category: 'General', difficulty: 'Hard', text: "I'm really trying to do my bit for the planet by driving less and walking more whenever I can, but it's definitely a challenge.", translation: "Saya lagi nyoba berkontribusi buat planet dengan ngurangin nyetir dan banyakin jalan kaki sebisa mungkin, tapi emang ada tantangannya sendiri." },
      { id: 'gn_h3', title: 'Better Policies', category: 'General', difficulty: 'Hard', text: "I think we seriously need tougher laws to protect the environment if we want a decent and sustainable future for our kids.", translation: "Menurut saya kita bener-bener butuh hukum yang lebih tegas buat jaga lingkungan kalau mau masa depan yang layak dan berkelanjutan buat anak-anak." },
      { id: 'gn_h4', title: 'Sustainable Goals', category: 'General', difficulty: 'Hard', text: "I'm a big believer that living sustainably is the only way we're going to survive in the long run; we can't keep consuming like this.", translation: "Saya percaya banget kalau hidup berkelanjutan itu satu-satunya cara kita bisa bertahan dalam jangka panjang; kita nggak bisa terus-terusan konsumsi kayak gini." },
      { id: 'gn_h5', title: 'Nature\'s Balance', category: 'General', difficulty: 'Hard', text: "If we keep messing with the balance of nature for our own gain, we're the ones who are going to end up paying the price.", translation: "Kalau kita terus ngerusak keseimbangan alam demi keuntungan sendiri, kita sendiri yang bakal nanggung akibatnya." },
    ]
  },
  {
    id: 'gen_hobbies',
    title: 'Hobbies & Interests',
    category: 'General',
    icon: 'fa-palette',
    description: 'Share your passions and learn about others’ favorite pastimes.',
    tasks: [
      // EASY (10)
      { id: 'ghb_e1', title: 'Bookworm', category: 'General', difficulty: 'Easy', text: "I'm a total bookworm. I can't go to sleep without reading a few pages.", translation: "Saya hobi baca banget. Nggak bisa tidur kalau belum baca beberapa halaman." },
      { id: 'ghb_e2', title: 'Saturday Football', category: 'General', difficulty: 'Easy', text: "I usually play football with the guys on Saturday. It's a great workout.", translation: "Saya biasanya main bola sama teman-teman hari Sabtu. Lumayan buat olahraga." },
      { id: 'ghb_e3', title: 'Cooking Vibe', category: 'General', difficulty: 'Easy', text: "Cooking is my way of decompressing after a long day at the office.", translation: "Memasak itu cara saya buat ngelepas penat setelah seharian di kantor." },
      { id: 'ghb_e4', title: 'Nature Sounds', category: 'General', difficulty: 'Easy', text: "I always have nature sounds playing in the background. It helps me focus.", translation: "Saya selalu muter suara alam buat nemenin aktivitas. Biar fokus aja." },
      { id: 'ghb_e5', title: 'Family Gathering', category: 'General', difficulty: 'Easy', text: "We're having a family dinner this Friday. You should totally join us!", translation: "Kami mau ada makan malam keluarga Jumat ini. Kamu harus ikut!" },
      { id: 'ghb_e6', title: 'Sketching', category: 'General', difficulty: 'Easy', text: "I love just sitting in the park and sketching whatever I see.", translation: "Saya suka banget duduk di taman sambil ngegambar apa aja yang saya liat." },
      { id: 'ghb_e7', title: 'Green Thumb', category: 'General', difficulty: 'Easy', text: "I'm trying to develop a green thumb, but my plants keep dying!", translation: "Saya lagi nyoba belajar berkebun, tapi tanaman saya mati terus!" },
      { id: 'ghb_e8', title: 'Gaming Session', category: 'General', difficulty: 'Easy', text: "I'm going to spend the whole evening gaming. I need a break!", translation: "Saya mau ngabisin sepanjang malam buat main game. Butuh istirahat nih!" },
      { id: 'ghb_e9', title: 'Travel Bug', category: 'General', difficulty: 'Easy', text: "I've definitely got the travel bug. I'm already planning my next trip.", translation: "Saya bener-bener hobi jalan-jalan. Sudah ngerencanain perjalanan berikutnya nih." },
      { id: 'ghb_e10', title: 'New Language', category: 'General', difficulty: 'Easy', text: "Learning a new language is tough, but it's so rewarding when it clicks.", translation: "Belajar bahasa baru itu susah, tapi puas banget pas sudah mulai ngerti." },
      // MEDIUM (10)
      { id: 'ghb_m1', title: 'Photography Hobby', category: 'General', difficulty: 'Medium', text: "I've been really getting into photography lately; I just love the challenge of capturing beautiful, candid moments.", translation: "Belakangan ini saya bener-bener lagi seneng fotografi; saya suka banget tantangan buat nangkep momen indah yang apa adanya." },
      { id: 'ghb_m2', title: 'Book Club', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of starting a small book club because I'd love to discuss my favorite reads with other people.", translation: "Saya bener-bener mikir mau mulai bikin klub buku kecil karena saya pengen banget diskusiin bacaan favorit saya sama orang lain." },
      { id: 'ghb_m3', title: 'Cooking Skills', category: 'General', difficulty: 'Medium', text: "I've been practicing my cooking skills a lot lately; I'm currently trying to master a few new, more complex recipes.", translation: "Belakangan ini saya sering ngelatih keahlian masak saya; sekarang saya lagi nyoba buat mahirin beberapa resep baru yang lebih rumit." },
      { id: 'ghb_m4', title: 'Sports Team', category: 'General', difficulty: 'Medium', text: "I'm considering joining a local sports team soon; I really want to stay active and meet some new people in the area.", translation: "Saya lagi nimbang mau gabung tim olahraga lokal dalam waktu deket; saya pengen banget tetep aktif dan kenal orang-orang baru di sini." },
      { id: 'ghb_m5', title: 'Chess Strategy', category: 'General', difficulty: 'Medium', text: "I've been learning how to play chess lately; it's honestly such a great way to keep my mind sharp and focused.", translation: "Belakangan ini saya lagi belajar main catur; jujur itu cara yang bagus banget buat jaga pikiran tetep tajam dan fokus." },
      { id: 'ghb_m6', title: 'Podcast Ideas', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of starting my own podcast because I feel like I have so many interesting stories and perspectives to share.", translation: "Saya bener-bener mikir mau mulai bikin siniar sendiri karena rasanya saya punya banyak cerita dan sudut pandang menarik buat dibagiin." },
      { id: 'ghb_m7', title: 'Public Lectures', category: 'General', difficulty: 'Medium', text: "I've been trying to go to more public lectures lately; there's honestly nothing quite like the energy of learning something new.", translation: "Belakangan ini saya nyoba buat lebih sering ikut kajian umum; jujur nggak ada yang bisa ngalahin energi dari belajar hal baru." },
      { id: 'ghb_m8', title: 'Painting Passion', category: 'General', difficulty: 'Medium', text: "I'm thinking of taking up painting as a hobby; I really want to express my creativity in a completely new way.", translation: "Saya mikir mau mulai hobi melukis; saya pengen banget nuangin kreativitas saya dengan cara yang bener-bener baru." },
      { id: 'ghb_m9', title: 'Art History', category: 'General', difficulty: 'Medium', text: "I've been learning a lot more about art history lately; it's just fascinating to see how different styles have evolved over time.", translation: "Belakangan ini saya belajar banyak soal sejarah seni; menarik banget liat gimana berbagai gaya sudah berkembang dari waktu ke waktu." },
      { id: 'ghb_m10', title: 'Collecting Items', category: 'General', difficulty: 'Medium', text: "I'm actually thinking of starting a small collection, maybe something unique like vintage postcards from around the world.", translation: "Saya sebenernya mikir mau mulai koleksi sesuatu yang kecil, mungkin sesuatu yang unik kayak kartu pos jadul dari seluruh dunia." },
      // HARD (5)
      { id: 'ghb_h1', title: 'Mastering Craft', category: 'General', difficulty: 'Hard', text: "Mastering a new craft takes a ton of patience and dedication, but the feeling of creating something with your own hands is so worth it.", translation: "Menguasai keahlian baru butuh kesabaran ekstra dan dedikasi, tapi rasa pas berhasil bikin sesuatu pakai tangan sendiri itu sepadan banget." },
      { id: 'ghb_h2', title: 'Creative Outlet', category: 'General', difficulty: 'Hard', text: "I honestly think everyone needs some kind of creative outlet to just express themselves and unwind after a long and stressful day.", translation: "Jujur saya mikir semua orang butuh wadah kreatif buat ngekspresiin diri dan ngelepas penat setelah hari yang panjang dan bikin stres." },
      { id: 'ghb_h3', title: 'Team Spirit', category: 'General', difficulty: 'Hard', text: "Playing competitive sports really teaches you a lot about teamwork, discipline, and having the grit to keep going when things get tough.", translation: "Main olahraga kompetitif bener-bener ngajarin banyak soal kerja tim, disiplin, dan punya kegigihan buat terus maju pas lagi susah." },
      { id: 'ghb_h4', title: 'Keeping Sharp', category: 'General', difficulty: 'Hard', text: "I love challenging myself with complex puzzles and brain teasers; I feel like it really helps keep my mind sharp and focused.", translation: "Saya suka nantang diri sendiri pakai teka-teki rumit dan asah otak; rasanya itu ngebantu banget jaga pikiran tetap tajam dan fokus." },
      { id: 'ghb_h5', title: 'Work-Life Balance', category: 'General', difficulty: 'Hard', text: "Having a hobby you're truly passionate about is so essential for maintaining a healthy work-life balance and avoiding burnout.", translation: "Punya hobi yang bener-bener kamu sukai itu penting banget buat jaga keseimbangan antara kerja dan hidup biar nggak burnout." },
    ]
  },
  {
    id: 'gen_family',
    title: 'Family & Relationships',
    category: 'General',
    icon: 'fa-users',
    description: 'Discuss family dynamics, friendships, and social connections.',
    tasks: [
      // EASY (10)
      { id: 'gfm_e1', title: 'My Family', category: 'General', difficulty: 'Easy', text: "I've got a pretty small family—just my parents and my younger sister.", translation: "Keluarga saya lumayan kecil—cuma ada orang tua sama adik perempuan saya." },
      { id: 'gfm_e2', title: 'Bestie', category: 'General', difficulty: 'Easy', text: "My best friend is like a sibling to me. We can talk about anything.", translation: "Sahabat saya sudah kayak saudara sendiri. Kami bisa ngobrolin apa aja." },
      { id: 'gfm_e3', title: 'Helping Out', category: 'General', difficulty: 'Easy', text: "I usually help my parents with the chores over the weekend.", translation: "Saya biasanya bantuin orang tua ngerjain tugas rumah pas akhir pekan." },
      { id: 'gfm_e4', title: 'Sunday Dinner', category: 'General', difficulty: 'Easy', text: "We always have this big family dinner every Sunday. It's a tradition.", translation: "Kami selalu ada makan malam keluarga besar tiap hari Minggu. Sudah tradisi." },
      { id: 'gfm_e5', title: 'Sibling Rivalry', category: 'General', difficulty: 'Easy', text: "My brother and I bicker a lot, but at the end of the day, we're close.", translation: "Saya sama abang saya sering berantem kecil, tapi sebenarnya kami deket kok." },
      { id: 'gfm_e6', title: 'Family Reunion', category: 'General', difficulty: 'Easy', text: "It's always nice to catch up with all the relatives during the holidays.", translation: "Senang rasanya bisa ngumpul lagi sama semua kerabat pas hari libur." },
      { id: 'gfm_e7', title: 'Making Friends', category: 'General', difficulty: 'Easy', text: "I try to be friendly to everyone. You never know who you'll meet!", translation: "Saya nyoba buat ramah ke semua orang. Kita nggak pernah tahu bakal ketemu siapa!" },
      { id: 'gfm_e8', title: 'Visiting Grandparents', category: 'General', difficulty: 'Easy', text: "I love visiting my grandparents. They always have the best stories.", translation: "Saya suka banget ngunjungin kakek-nenek. Cerita mereka selalu seru." },
      { id: 'gfm_e9', title: 'Family Support', category: 'General', difficulty: 'Easy', text: "My family's always got my back, no matter what happens.", translation: "Keluarga saya selalu dukung saya, apa pun yang terjadi." },
      { id: 'gfm_e10', title: 'Childhood Memories', category: 'General', difficulty: 'Easy', text: "I have so many fond memories of growing up with my siblings.", translation: "Banyak banget kenangan manis pas tumbuh bareng saudara-saudara saya." },
      // MEDIUM (10)
      { id: 'gfm_m1', title: 'Family Gratitude', category: 'General', difficulty: 'Medium', text: "I'm just so incredibly grateful for my family; they've honestly always been there for me through thick and thin.", translation: "Saya bener-bener bersyukur banget punya keluarga saya; jujur mereka selalu ada buat saya dalam suka maupun duka." },
      { id: 'gfm_m2', title: 'Family Reunion', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of hosting a big family reunion soon; it's been way too long since we've all been together in one place.", translation: "Saya bener-bener mikir mau ngadain reuni keluarga besar dalam waktu deket; sudah kelamaan banget kita nggak kumpul bareng di satu tempat." },
      { id: 'gfm_m3', title: 'Partner Connection', category: 'General', difficulty: 'Medium', text: "I've been trying to spend more quality time with my partner lately, and it's really helped to strengthen our bond.", translation: "Belakangan ini saya nyoba buat lebih banyak ngabisin waktu berkualitas bareng pasangan, dan itu bener-bener ngebantu nguatin ikatan kami." },
      { id: 'gfm_m4', title: 'Sibling Trouble', category: 'General', difficulty: 'Medium', text: "I'm a bit worried about my relationship with my sibling lately; we've been having some trouble seeing eye to eye on things.", translation: "Saya agak khawatir sama hubungan saya sama saudara saya belakangan ini; kami lagi sering beda pendapat soal banyak hal." },
      { id: 'gfm_m5', title: 'New Chapter', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of starting a family of my own quite soon; I'm just so incredibly excited for this new chapter in my life.", translation: "Saya bener-bener mikir mau mulai bangun keluarga sendiri dalam waktu deket; saya bener-bener semangat banget buat babak baru dalam hidup saya ini." },
      { id: 'gfm_m6', title: 'Ancestry Search', category: 'General', difficulty: 'Medium', text: "I've been learning a lot more about my family history lately; it's just amazing to see where our ancestors actually came from.", translation: "Belakangan ini saya belajar banyak soal sejarah keluarga saya; luar biasa banget liat dari mana sebenernya leluhur kita berasal." },
      { id: 'gfm_m7', title: 'Better Listener', category: 'General', difficulty: 'Medium', text: "I'm really trying to be a much better listener in all my relationships; it's just so important to truly hear what others are saying.", translation: "Saya bener-bener nyoba buat jadi pendengar yang jauh lebih baik dalam semua hubungan saya; penting banget buat bener-bener dengerin apa yang orang lain omongin." },
      { id: 'gfm_m8', title: 'Grandparents\' Stories', category: 'General', difficulty: 'Medium', text: "I've been trying to spend a lot more time with my grandparents lately; they have so many amazing and inspiring stories to tell.", translation: "Belakangan ini saya nyoba buat lebih sering ngabisin waktu bareng kakek nenek; mereka punya banyak banget cerita luar biasa dan inspiratif buat dibagiin." },
      { id: 'gfm_m9', title: 'Tech Impact', category: 'General', difficulty: 'Medium', text: "I'm quite worried about the impact of technology on our personal relationships; I feel like we really need to be more present with each other.", translation: "Saya lumayan khawatir sama dampak teknologi ke hubungan pribadi kita; saya rasa kita bener-bener harus lebih hadir buat satu sama lain." },
      { id: 'gfm_m10', title: 'Family Memories', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of planning a big family vacation soon; I really want us to make some lasting memories together.", translation: "Saya bener-bener mikir mau ngerencanain liburan keluarga besar dalam waktu deket; saya pengen banget kita bikin kenangan indah yang nggak terlupakan bareng-bareng." },
      // HARD (5)
      { id: 'gfm_h1', title: 'Generation Gap', category: 'General', difficulty: 'Hard', text: "The generation gap can be pretty tricky to navigate sometimes, but we always try to be open-minded and see things from each other's perspective.", translation: "Kesenjangan generasi bisa lumayan rumit buat dihadapin kadang, tapi kami selalu nyoba buat berpikiran terbuka dan liat dari sudut pandang masing-masing." },
      { id: 'gfm_h2', title: 'Social Skills', category: 'General', difficulty: 'Hard', text: "I've realized that emotional intelligence is absolutely key if you want to get along well with all kinds of people in different social settings.", translation: "Saya sadar kalau kecerdasan emosional itu kunci utama kalau mau akur sama berbagai macam orang di berbagai lingkungan sosial." },
      { id: 'gfm_h3', title: 'Loyalty Matters', category: 'General', difficulty: 'Hard', text: "Loyalty is a huge deal for me; I really value people who are reliable, stay true to their word, and stand by you when things get tough.", translation: "Loyalitas itu penting banget buat saya; saya sangat ngehargai orang yang bisa diandalkan, pegang janji, dan selalu ada buat kamu pas lagi susah." },
      { id: 'gfm_h4', title: 'Staying Connected', category: 'General', difficulty: 'Hard', text: "Having a solid support system around you is so vital for your mental health, especially when you're going through a rough patch in life.", translation: "Punya lingkungan yang mendukung di sekitarmu itu penting banget buat kesehatan mental, apalagi pas kamu lagi ngadepin masa-masa sulit dalam hidup." },
      { id: 'gfm_h5', title: 'Meaning of Love', category: 'General', difficulty: 'Hard', text: "I've learned that love isn't just a feeling; it's about consistently showing up and making an effort for the people you truly care about.", translation: "Saya belajar kalau cinta itu bukan cuma perasaan; tapi soal selalu ada dan terus berusaha buat orang-orang yang bener-bener kita sayang." },
    ]
  },
  {
    id: 'gen_emotions',
    title: 'Emotions & Feelings',
    category: 'General',
    icon: 'fa-smile',
    description: 'Express your feelings and understand others’ emotions with clarity.',
    tasks: [
      // EASY (10)
      { id: 'gem_e1', title: 'Happy Vibe', category: 'General', difficulty: 'Easy', text: "I'm in such a good mood today! The weather is just perfect.", translation: "Suasana hati saya lagi bagus banget hari ini! Cuacanya pas banget." },
      { id: 'gem_e2', title: 'Homesick', category: 'General', difficulty: 'Easy', text: "I'm feeling a bit homesick. I really miss my family.", translation: "Saya lagi agak kangen rumah. Rindu banget sama keluarga." },
      { id: 'gem_e3', title: 'Exhausted', category: 'General', difficulty: 'Easy', text: "I'm absolutely wiped out after that shift. I need a nap.", translation: "Saya bener-bener capek banget habis shift tadi. Butuh tidur siang nih." },
      { id: 'gem_e4', title: 'Stoked!', category: 'General', difficulty: 'Easy', text: "I'm so stoked for our beach trip tomorrow! It's going to be epic.", translation: "Saya semangat banget buat ke pantai besok! Bakal seru banget nih." },
      { id: 'gem_e5', title: 'Nervous Jitters', category: 'General', difficulty: 'Easy', text: "I've got the jitters before this presentation. Wish me luck!", translation: "Saya lagi deg-degan nih sebelum presentasi. Doain ya!" },
      { id: 'gem_e6', title: 'Keeping Calm', category: 'General', difficulty: 'Easy', text: "I was pretty annoyed, but I tried my best to keep my cool.", translation: "Tadi saya lumayan kesel, tapi saya nyoba buat tetap tenang." },
      { id: 'gem_e7', title: 'Surprise!', category: 'General', difficulty: 'Easy', text: "I was totally caught off guard by the surprise gathering! I had no idea.", translation: "Saya bener-bener kaget pas acara kejutan tadi! Nggak nyangka sama sekali." },
      { id: 'gem_e8', title: 'Confused', category: 'General', difficulty: 'Easy', text: "I'm a bit lost with these instructions. Can you walk me through it?", translation: "Saya agak bingung sama instruksi ini. Bisa jelasin pelan-pelan?" },
      { id: 'gem_e9', title: 'Bored to Death', category: 'General', difficulty: 'Easy', text: "I'm bored to death! There's literally nothing to do here.", translation: "Saya bosan banget! Bener-bener nggak ada kerjaan di sini." },
      { id: 'gem_e10', title: 'Proud Moment', category: 'General', difficulty: 'Easy', text: "I'm so proud of my sister. She worked so hard for this win.", translation: "Saya bangga banget sama adik saya. Dia sudah berjuang keras buat menang." },
      // MEDIUM (10)
      { id: 'gem_m1', title: 'Stress Relief', category: 'General', difficulty: 'Medium', text: "I've been feeling a bit overwhelmed lately, so I'm really trying to find some healthy ways to de-stress.", translation: "Belakangan ini saya ngerasa agak kewalahan, jadi saya bener-bener nyoba nyari cara sehat buat ngelepas stres." },
      { id: 'gem_m2', title: 'Big Thanks', category: 'General', difficulty: 'Medium', text: "I just wanted to reach out and say a huge thank you for all the incredible support you've given me.", translation: "Saya cuma mau ngehubungin dan ngucapin terima kasih banyak atas semua dukungan luar biasa yang sudah kamu kasih ke saya." },
      { id: 'gem_m3', title: 'Facing Fears', category: 'General', difficulty: 'Medium', text: "I'm honestly quite nervous about the upcoming changes, but I'm trying my best to stay positive and hopeful.", translation: "Jujur saya lumayan deg-degan sama perubahan yang bakal dateng, tapi saya nyoba yang terbaik buat tetep positif dan penuh harap." },
      { id: 'gem_m4', title: 'Staying Hopeful', category: 'General', difficulty: 'Medium', text: "I've been feeling a bit down lately, but I'm slowly starting to feel more like myself again, which is a relief.", translation: "Belakangan ini saya ngerasa agak sedih, tapi pelan-pelan saya mulai ngerasa kayak diri saya lagi, lega banget rasanya." },
      { id: 'gem_m5', title: 'Proud Achievement', category: 'General', difficulty: 'Medium', text: "I'm so incredibly proud of everything you've achieved; you've worked so hard and you truly deserve this success.", translation: "Saya bener-bener bangga banget sama semua yang sudah kamu capai; kamu sudah berjuang keras dan kamu bener-bener pantes dapet kesuksesan ini." },
      { id: 'gem_m6', title: 'Mindful Emotions', category: 'General', difficulty: 'Medium', text: "I'm currently trying to be more mindful of my emotions and how they actually impact the people around me.", translation: "Sekarang saya lagi nyoba buat lebih sadar sama emosi saya dan gimana itu sebenernya berdampak ke orang-orang di sekitar saya." },
      { id: 'gem_m7', title: 'Frustration', category: 'General', difficulty: 'Medium', text: "I've been feeling a bit frustrated with the lack of progress lately, but I'm trying to stay patient and keep going.", translation: "Belakangan ini saya ngerasa agak kesel karena kurangnya kemajuan, tapi saya nyoba buat tetep sabar dan lanjut terus." },
      { id: 'gem_m8', title: 'Inspiration', category: 'General', difficulty: 'Medium', text: "I'm honestly so inspired by your resilience and strength; it really makes me want to be a better person.", translation: "Jujur saya terinspirasi banget sama ketangguhan dan kekuatanmu; itu bener-bener bikin saya pengen jadi orang yang lebih baik." },
      { id: 'gem_m9', title: 'Connecting More', category: 'General', difficulty: 'Medium', text: "I've been feeling a bit lonely lately, so I'm really trying to reach out and connect more with my friends and family.", translation: "Belakangan ini saya ngerasa agak kesepian, jadi saya bener-bener nyoba buat ngehubungin dan lebih nyambung lagi sama temen dan keluarga." },
      { id: 'gem_m10', title: 'Dream Opportunity', category: 'General', difficulty: 'Medium', text: "I'm so incredibly grateful for this opportunity; it's honestly a dream come true and I'm just so excited to get started.", translation: "Saya bener-bener bersyukur banget atas kesempatan ini; jujur ini mimpi yang jadi kenyataan dan saya semangat banget buat mulai." },
      // HARD (5)
      { id: 'gem_h1', title: 'Being Vulnerable', category: 'General', difficulty: 'Hard', text: "I've come to realize that being vulnerable and showing your true feelings isn't a weakness; it's actually a sign of real courage and strength.", translation: "Saya sadar kalau bersikap terbuka dan nunjukin perasaan yang sebenernya itu bukan kelemahan; itu justru tanda keberanian dan kekuatan sejati." },
      { id: 'gem_h2', title: 'Sitting with Feelings', category: 'General', difficulty: 'Hard', text: "We really need to learn how to just sit with our uncomfortable feelings and process them, instead of trying to hide or suppress them all the time.", translation: "Kita bener-bener harus belajar buat nerima dan ngerasain perasaan nggak nyaman kita, daripada terus-terusan nyoba buat nyembunyiin atau mendemnya." },
      { id: 'gem_h3', title: 'True Empathy', category: 'General', difficulty: 'Hard', text: "Empathy is way more than just listening to someone talk; it's about truly trying to put yourself in their shoes and understand what they're going through.", translation: "Empati itu jauh lebih dari sekadar dengerin orang ngomong; itu soal bener-bener nyoba nempatin diri di posisi mereka dan mahamin apa yang lagi mereka alamin." },
      { id: 'gem_h4', title: 'Mindful Reactions', category: 'General', difficulty: 'Hard', text: "I'm really working on being more mindful of how I react to things, especially when life gets stressful and I'm feeling a bit overwhelmed.", translation: "Saya lagi bener-bener nyoba buat lebih sadar gimana saya bereaksi terhadap sesuatu, apalagi pas hidup lagi stres dan saya ngerasa agak kewalahan." },
      { id: 'gem_h5', title: 'Power of Forgiveness', category: 'General', difficulty: 'Hard', text: "I think forgiveness is more of a gift you give yourself so you can finally find some inner peace and move on with your life.", translation: "Menurut saya memaafkan itu lebih ke hadiah buat diri sendiri biar akhirnya bisa dapet ketenangan batin dan lanjut jalanin hidup." },
    ]
  },
  {
    id: 'gen_food',
    title: 'Food & Dining',
    category: 'General',
    icon: 'fa-utensils',
    description: 'Explore the world of culinary delights and dining etiquette.',
    tasks: [
      // EASY (10)
      { id: 'gfd_e1', title: 'Coffee Order', category: 'General', difficulty: 'Easy', text: "Can I get a large latte, please? No sugar for me.", translation: "Pesan latte besar satu ya. Nggak pakai gula." },
      { id: 'gfd_e2', title: 'Favorite Dish', category: 'General', difficulty: 'Easy', text: "My go-to meal is definitely grilled chicken. I can't get enough of it!", translation: "Makanan favorit saya itu ayam panggang. Nggak pernah bosen deh!" },
      { id: 'gfd_e3', title: 'Water Please', category: 'General', difficulty: 'Easy', text: "Could I just get a glass of cold water? I'm parched.", translation: "Bisa minta segelas air dingin? Haus banget nih." },
      { id: 'gfd_e4', title: 'Breakfast Routine', category: 'General', difficulty: 'Easy', text: "I usually just grab some cereal and a banana on my way out.", translation: "Biasanya saya cuma makan sereal sama pisang pas mau berangkat." },
      { id: 'gfd_e5', title: 'Great Food', category: 'General', difficulty: 'Easy', text: "The food here is actually really good. You should try the pasta.", translation: "Makanan di sini enak banget lho. Kamu harus coba pastanya." },
      { id: 'gfd_e6', title: 'The Bill', category: 'General', difficulty: 'Easy', text: "Excuse me, could we get the check whenever you have a chance?", translation: "Permisi, bisa minta tagihannya kalau sudah sempat?" },
      { id: 'gfd_e7', title: 'Home Cooking', category: 'General', difficulty: 'Easy', text: "I love cooking for the family. It's my way of showing I care.", translation: "Saya suka masak buat keluarga. Itu cara saya nunjukin perhatian." },
      { id: 'gfd_e8', title: 'Sweet Tooth', category: 'General', difficulty: 'Easy', text: "I have such a sweet tooth. I can never say no to chocolate cake!", translation: "Saya suka banget yang manis-manis. Nggak bisa nolak kalau ada kue cokelat!" },
      { id: 'gfd_e9', title: 'Healthy Snacks', category: 'General', difficulty: 'Easy', text: "I'm trying to stick to healthy snacks like nuts and fruit.", translation: "Saya lagi nyoba makan camilan sehat kayak kacang sama buah." },
      { id: 'gfd_e10', title: 'Setting Table', category: 'General', difficulty: 'Easy', text: "Could you give me a hand setting the table for dinner?", translation: "Bisa bantuin saya tata meja buat makan malam?" },
      // MEDIUM (10)
      { id: 'gfd_m1', title: 'New Restaurant', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of trying out that new Italian restaurant downtown; I've heard the pasta there is absolutely amazing.", translation: "Saya bener-bener mikir mau nyobain restoran Italia baru di pusat kota; saya denger pasta di sana bener-bener enak banget." },
      { id: 'gfd_m2', title: 'Home Cooking', category: 'General', difficulty: 'Medium', text: "I've been trying to cook more at home lately; it's just so much healthier and honestly, it's quite relaxing too.", translation: "Belakangan ini saya nyoba buat lebih sering masak di rumah; jauh lebih sehat dan jujur, itu lumayan bikin rileks juga." },
      { id: 'gfd_m3', title: 'Recipe Request', category: 'General', difficulty: 'Medium', text: "Could you possibly give me the recipe for that delicious soup? I'd love to try making it myself sometime soon.", translation: "Bisa tolong kasih saya resep sup yang enak itu nggak? Saya pengen banget nyoba bikin sendiri kapan-kapan." },
      { id: 'gfd_m4', title: 'Dinner Gathering', category: 'General', difficulty: 'Medium', text: "I'm thinking of hosting a small dinner gathering next weekend; it's been way too long since we've all gotten together.", translation: "Saya mikir mau ngadain makan malam bersama kecil akhir pekan depan; sudah kelamaan banget kita nggak kumpul bareng." },
      { id: 'gfd_m5', title: 'Healthy Eating', category: 'General', difficulty: 'Medium', text: "I've been trying to eat a lot more fresh fruits and vegetables lately; I'm honestly starting to feel so much more energetic.", translation: "Belakangan ini saya nyoba buat makan jauh lebih banyak buah dan sayuran seger; jujur saya mulai ngerasa jauh lebih berenergi." },
      { id: 'gfd_m6', title: 'Vegetarian Thoughts', category: 'General', difficulty: 'Medium', text: "I'm seriously considering going vegetarian for a while; I've been reading a lot about the health benefits and it's quite interesting.", translation: "Saya bener-bener nimbang mau jadi vegetarian buat sementara; saya sudah banyak baca soal manfaat kesehatannya dan itu lumayan menarik." },
      { id: 'gfd_m7', title: 'Brunch Spots', category: 'General', difficulty: 'Medium', text: "I've been having some major trouble finding a good place for brunch; do you happen to have any favorite spots around here?", translation: "Saya lagi agak kesulitan nyari tempat brunch yang bagus; kamu punya tempat favorit nggak di sekitar sini?" },
      { id: 'gfd_m8', title: 'Cozy Atmosphere', category: 'General', difficulty: 'Medium', text: "I'm so incredibly glad we decided to try this place; the food is delicious and the atmosphere is just so cozy and inviting.", translation: "Saya seneng banget kita mutusin buat nyobain tempat ini; makanannya enak dan suasananya bener-bener nyaman dan bikin betah." },
      { id: 'gfd_m9', title: 'Global Cuisines', category: 'General', difficulty: 'Medium', text: "I've been learning a lot more about different cuisines lately; it's just fascinating to see how flavors vary so much across cultures.", translation: "Belakangan ini saya belajar banyak soal berbagai masakan; menarik banget liat gimana rasa bisa beda-beda banget di tiap budaya." },
      { id: 'gfd_m10', title: 'Baking Class', category: 'General', difficulty: 'Medium', text: "I'm thinking of taking a baking class soon; I've always wanted to learn how to make my own fresh bread from scratch.", translation: "Saya mikir mau ikut kelas manggang kue dalam waktu deket; dari dulu pengen banget belajar cara bikin roti seger sendiri dari nol." },
      // HARD (5)
      { id: 'gfd_h1', title: 'Farm to Table', category: 'General', difficulty: 'Hard', text: "The whole farm-to-table movement is really changing the way we think about the quality of our ingredients and where our food actually comes from.", translation: "Gerakan dari kebun ke meja makan bener-bener ngerubah cara kita mikir soal kualitas bahan makanan dan dari mana sebenernya makanan kita berasal." },
      { id: 'gfd_h2', title: 'Whole Foods', category: 'General', difficulty: 'Hard', text: "I'm really trying to cut back on all that processed and sugary stuff and just stick to more whole, natural foods for my overall health.", translation: "Saya lagi bener-bener nyoba ngurangin makanan olahan dan yang manis-manis, terus fokus ke makanan yang lebih alami buat kesehatan saya secara umum." },
      { id: 'gfd_h3', title: 'Cooking Therapy', category: 'General', difficulty: 'Hard', text: "For me, cooking is basically a form of therapy; it's honestly the best way to unwind and clear my head after a long and exhausting day at work.", translation: "Buat saya, masak itu semacam terapi; jujur itu cara terbaik buat ngelepas penat dan jernihin pikiran setelah hari yang panjang dan melelahkan di kantor." },
      { id: 'gfd_h4', title: 'Food & Culture', category: 'General', difficulty: 'Hard', text: "It's amazing how food has this incredible power to bring people together and bridge gaps, no matter where they're from or what language they speak.", translation: "Luar biasa ya gimana makanan punya kekuatan buat nyatuin orang dan ngehubungin perbedaan, nggak peduli dari mana asal mereka atau bahasa apa yang mereka pake." },
      { id: 'gfd_h5', title: 'Spice World', category: 'General', difficulty: 'Hard', text: "I'm honestly fascinated by the way different cultures use a wide variety of spices to create such unique, complex, and amazing flavors.", translation: "Jujur saya kagum banget sama cara berbagai budaya pakai macem-macem rempah buat bikin rasa yang unik, kompleks, dan enak banget." },
    ]
  },
  {
    id: 'gen_routine',
    title: 'Daily Routine',
    category: 'General',
    icon: 'fa-clock',
    description: 'Describe your daily activities and manage your time effectively.',
    tasks: [
      // EASY (10)
      { id: 'grt_e1', title: 'Waking Up', category: 'General', difficulty: 'Easy', text: "I'm an early bird. I usually wake up at six every morning.", translation: "Saya tipe orang yang bangun pagi. Biasanya jam enam sudah bangun." },
      { id: 'grt_e2', title: 'Brushing Teeth', category: 'General', difficulty: 'Easy', text: "Don't forget to brush your teeth! Twice a day is the rule.", translation: "Jangan lupa sikat gigi! Aturannya dua kali sehari ya." },
      { id: 'grt_e3', title: 'Getting Ready', category: 'General', difficulty: 'Easy', text: "I just need ten minutes to get dressed and grab some breakfast.", translation: "Saya cuma butuh sepuluh menit buat ganti baju sama sarapan." },
      { id: 'grt_e4', title: 'Off to Work', category: 'General', difficulty: 'Easy', text: "I'm heading out now. I catch the bus at seven thirty sharp.", translation: "Saya berangkat sekarang ya. Bisnya lewat jam tujuh tiga puluh tepat." },
      { id: 'grt_e5', title: 'Desk Lunch', category: 'General', difficulty: 'Easy', text: "I'm so busy today, I'll probably just have a quick lunch at my desk.", translation: "Hari ini sibuk banget, kayaknya saya makan siang di meja aja deh." },
      { id: 'grt_e6', title: 'Heading Home', category: 'General', difficulty: 'Easy', text: "I'm finally done for the day! I should be home by five thirty.", translation: "Akhirnya selesai juga kerjaan hari ini! Jam setengah enam sudah sampai rumah." },
      { id: 'grt_e7', title: 'Evening Chores', category: 'General', difficulty: 'Easy', text: "I've got to do some laundry tonight. The pile is getting huge!", translation: "Saya harus nyuci baju malam ini. Sudah numpuk banget!" },
      { id: 'grt_e8', title: 'Unwinding', category: 'General', difficulty: 'Easy', text: "I love just chilling in front of the TV for a bit before bed.", translation: "Saya suka banget santai bentar depan TV sebelum tidur." },
      { id: 'grt_e9', title: 'Bedtime', category: 'General', difficulty: 'Easy', text: "I'm hitting the sack. I've got a big day tomorrow!", translation: "Saya mau tidur duluan ya. Besok ada hari penting nih!" },
      { id: 'grt_e10', title: 'Sleeping In', category: 'General', difficulty: 'Easy', text: "I love sleeping in on Saturdays. It's the best part of the week.", translation: "Saya suka banget bangun siang hari Sabtu. Momen terbaik dalam seminggu." },
      // MEDIUM (10)
      { id: 'grt_m1', title: 'Morning Routine', category: 'General', difficulty: 'Medium', text: "I'm really trying to get into a better morning routine lately; I feel like it just sets a much more positive tone for the day.", translation: "Belakangan ini saya bener-bener nyoba buat punya rutinitas pagi yang lebih baik; rasanya itu bikin suasana hati jauh lebih positif seharian." },
      { id: 'grt_m2', title: 'Time Management', category: 'General', difficulty: 'Medium', text: "I've been trying to manage my time a lot more effectively lately; I'm honestly feeling so much more productive and less stressed.", translation: "Belakangan ini saya nyoba buat ngatur waktu jauh lebih efektif; jujur saya ngerasa jauh lebih produktif dan nggak gampang stres." },
      { id: 'grt_m3', title: 'New Hobby', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of starting a new hobby, maybe something like gardening or painting, just to unwind after a long day.", translation: "Saya bener-bener mikir mau mulai hobi baru, mungkin sesuatu kayak berkebun atau melukis, sekadar buat santai setelah hari yang panjang." },
      { id: 'grt_m4', title: 'Digital Detox', category: 'General', difficulty: 'Medium', text: "I've been trying to spend less time on social media lately; I'm honestly starting to feel like I have so much more free time now.", translation: "Belakangan ini saya nyoba buat ngurangin main media sosial; jujur saya mulai ngerasa punya jauh lebih banyak waktu luang sekarang." },
      { id: 'grt_m5', title: 'Sleep Schedule', category: 'General', difficulty: 'Medium', text: "I'm currently working on improving my sleep schedule; I've realized that getting enough rest is just so incredibly important for my health.", translation: "Sekarang saya lagi nyoba buat perbaiki jadwal tidur saya; saya sadar kalau dapet istirahat yang cukup itu bener-bener penting banget buat kesehatan saya." },
      { id: 'grt_m6', title: 'Evening Walk', category: 'General', difficulty: 'Medium', text: "I've been trying to go for a short walk every single evening; it's just such a great way to clear my head and get some fresh air.", translation: "Belakangan ini saya nyoba buat jalan santai tiap sore; itu cara yang bagus banget buat jernihin pikiran dan dapet udara seger." },
      { id: 'grt_m7', title: 'Meditation Practice', category: 'General', difficulty: 'Medium', text: "I'm seriously considering starting a daily meditation practice; I've heard it can really help with focus and overall mental well-being.", translation: "Saya bener-bener nimbang mau mulai latihan meditasi harian; saya denger itu bener-bener bisa ngebantu fokus dan kesejahteraan mental secara keseluruhan." },
      { id: 'grt_m8', title: 'Staying Organized', category: 'General', difficulty: 'Medium', text: "I've been trying to be a lot more organized with my tasks lately; I'm honestly finding it so much easier to stay on top of everything.", translation: "Belakangan ini saya nyoba buat jauh lebih teratur sama tugas-tugas saya; jujur saya ngerasa jauh lebih gampang buat nanganin semuanya." },
      { id: 'grt_m9', title: 'Learning Languages', category: 'General', difficulty: 'Medium', text: "I'm currently trying to learn a new language in my spare time; it's tough, but I'm slowly starting to make some real progress.", translation: "Sekarang saya lagi nyoba belajar bahasa baru di waktu luang; emang susah, tapi pelan-pelan saya mulai ada kemajuan yang nyata." },
      { id: 'grt_m10', title: 'Quality Time', category: 'General', difficulty: 'Medium', text: "I've been trying to spend more quality time with my loved ones lately; it's just so important to nurture those relationships every day.", translation: "Belakangan ini saya nyoba buat lebih banyak ngabisin waktu berkualitas bareng orang-orang tersayang; penting banget buat jaga hubungan itu tiap hari." },
      // HARD (5)
      { id: 'grt_h1', title: 'Morning Power', category: 'General', difficulty: 'Hard', text: "I've really noticed that how I start my morning and the habits I follow pretty much sets the tone for how productive I'll be for the entire day.", translation: "Saya bener-bener ngerasa kalau cara saya mulai pagi dan kebiasaan yang saya lakuin itu nentuin seberapa produktifnya saya seharian." },
      { id: 'grt_h2', title: 'Habit Sticking', category: 'General', difficulty: 'Hard', text: "If you want to build a new habit that actually sticks in the long run, consistency and starting small is absolutely the most important thing.", translation: "Kalau mau ngebangun kebiasaan baru yang beneran awet dalam jangka panjang, konsistensi dan mulai dari hal kecil itu mutlak hal yang paling penting." },
      { id: 'grt_h3', title: 'Intentional Living', category: 'General', difficulty: 'Hard', text: "I'm really trying to be more intentional with my time lately and stop all that mindless scrolling on my phone that just wastes so much energy.", translation: "Saya lagi bener-bener nyoba lebih bijak pakai waktu dan berhenti scroll HP nggak jelas yang cuma buang-buang energi aja." },
      { id: 'grt_h4', title: 'Sleep Priority', category: 'General', difficulty: 'Hard', text: "Getting a solid and restful night's sleep is pretty much non-negotiable if I want to actually be productive and stay focused the next day.", translation: "Tidur nyenyak dan berkualitas di malam hari itu nggak bisa ditawar kalau saya mau beneran produktif dan tetep fokus besoknya." },
      { id: 'grt_h5', title: 'Energy Rhythm', category: 'General', difficulty: 'Hard', text: "I'm still working on finding a daily rhythm and routine that actually fits my energy levels and helps me perform at my best throughout the day.", translation: "Saya masih nyoba nyari ritme dan rutinitas harian yang beneran pas sama tingkat energi saya dan ngebantu saya kasih performa terbaik seharian." },
    ]
  },
  {
    id: 'gen_transport',
    title: 'Transportation',
    category: 'General',
    icon: 'fa-bus',
    description: 'Navigate various modes of transport and discuss travel logistics.',
    tasks: [
      // EASY (10)
      { id: 'gtr_e1', title: 'Bus Ride', category: 'General', difficulty: 'Easy', text: "I catch the bus to the city center every morning. It's usually packed.", translation: "Saya naik bis ke pusat kota tiap pagi. Biasanya penuh banget.", scenario: "Menceritakan rutinitas berangkat kerja menggunakan bis." },
      { id: 'gtr_e2', title: 'Driving', category: 'General', difficulty: 'Easy', text: "I usually drive to work. It's just more convenient than the bus.", translation: "Biasanya saya nyetir ke kantor. Lebih praktis aja daripada naik bis.", scenario: "Menjelaskan alasan memilih menyetir mobil daripada naik kendaraan umum." },
      { id: 'gtr_e3', title: 'Cycling', category: 'General', difficulty: 'Easy', text: "I've started cycling to work. It's great for my health and the planet!", translation: "Saya mulai sepedaan ke kantor. Bagus buat kesehatan sama lingkungan!", scenario: "Berbagi kebiasaan baru yang sehat dan ramah lingkungan." },
      { id: 'gtr_e4', title: 'Taxi Time', category: 'General', difficulty: 'Easy', text: "I'm running late, so I'll just grab a taxi to the airport.", translation: "Saya sudah telat nih, jadi saya mau naik taksi aja ke bandara.", scenario: "Memutuskan naik taksi karena terburu-buru mengejar jadwal." },
      { id: 'gtr_e5', title: 'Walking', category: 'General', difficulty: 'Easy', text: "I love walking to school when the weather's nice. It's so peaceful.", translation: "Saya suka jalan kaki ke sekolah pas cuacanya enak. Tenang banget rasanya.", scenario: "Menceritakan kegemaran berjalan kaki saat cuaca mendukung." },
      { id: 'gtr_e6', title: 'The Station', category: 'General', difficulty: 'Easy', text: "The train station is right in the heart of the city. You can't miss it.", translation: "Stasiun keretanya ada di pusat kota. Pasti ketemu kok.", scenario: "Memberikan petunjuk arah stasiun kepada orang lain." },
      { id: 'gtr_e7', title: 'Train Ticket', category: 'General', difficulty: 'Easy', text: "I need to book a ticket for the next train. Hope it's not sold out!", translation: "Saya harus pesen tiket buat kereta berikutnya. Semoga belum habis!", scenario: "Kekhawatiran saat ingin membeli tiket kereta di waktu mepet." },
      { id: 'gtr_e8', title: 'Bus Stop', category: 'General', difficulty: 'Easy', text: "The bus stop is just a five-minute walk from my place.", translation: "Halte bisnya cuma lima menit jalan kaki dari rumah saya.", scenario: "Memberitahu lokasi halte bus terdekat dari rumah." },
      { id: 'gtr_e9', title: 'Traffic Jam', category: 'General', difficulty: 'Easy', text: "I was stuck in traffic for an hour! The roads were a nightmare.", translation: "Saya terjebak macet sejam! Jalanannya parah banget tadi.", scenario: "Mengeluhkan kondisi lalu lintas yang sangat buruk." },
      { id: 'gtr_e10', title: 'Public Transport', category: 'General', difficulty: 'Easy', text: "Using public transport is a great way to save money on gas.", translation: "Pakai transportasi umum itu cara bagus buat hemat uang bensin.", scenario: "Berbagi tips hemat dengan menggunakan kendaraan umum." },
      // MEDIUM (10)
      { id: 'gtr_m1', title: 'Electric Bike', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of getting an electric bike for my commute; I've heard it's a lot faster and honestly, it's better for the environment too.", translation: "Saya bener-bener mikir mau beli sepeda listrik buat berangkat kerja; saya denger itu jauh lebih cepet dan jujur, lebih bagus buat lingkungan juga." },
      { id: 'gtr_m2', title: 'Public Transport Issues', category: 'General', difficulty: 'Medium', text: "I've been having some major trouble with the public transport lately; the buses have been incredibly unreliable for the past few days.", translation: "Belakangan ini saya lagi dapet masalah besar sama transportasi umum; bisnya bener-bener nggak bisa diandalin selama beberapa hari terakhir." },
      { id: 'gtr_m3', title: 'Road Trip Plans', category: 'General', difficulty: 'Medium', text: "I'm thinking of taking a road trip across the country next summer; I've always wanted to see more of the beautiful landscapes around here.", translation: "Saya mikir mau road trip keliling negeri musim panas depan; dari dulu pengen banget liat lebih banyak pemandangan indah di sekitar sini." },
      { id: 'gtr_m4', title: 'Walking More', category: 'General', difficulty: 'Medium', text: "I've been trying to walk more instead of taking the car for short trips; it's just such a great way to get some extra exercise.", translation: "Belakangan ini saya nyoba buat lebih banyak jalan kaki daripada naik mobil buat jarak deket; itu cara yang bagus banget buat dapet olahraga tambahan." },
      { id: 'gtr_m5', title: 'Carpooling Thoughts', category: 'General', difficulty: 'Medium', text: "I'm seriously considering carpooling with some of my colleagues; it's just a lot more cost-effective and honestly, it's more social too.", translation: "Saya bener-bener nimbang mau nebeng bareng beberapa temen kantor; jauh lebih hemat biaya dan jujur, lebih seru juga karena ada temen ngobrol." },
      { id: 'gtr_m6', title: 'City Layout', category: 'General', difficulty: 'Medium', text: "I've been having some trouble finding my way around this new city; the layout is just so incredibly confusing for some reason.", translation: "Saya lagi agak kesulitan nyari jalan di kota baru ini; tata letaknya bener-bener bingungin banget nggak tahu kenapa." },
      { id: 'gtr_m7', title: 'Car Upgrade', category: 'General', difficulty: 'Medium', text: "I'm thinking of upgrading my car soon; I really want something that's a bit more fuel-efficient and has better safety features.", translation: "Saya mikir mau ganti mobil baru dalam waktu deket; saya pengen banget sesuatu yang lebih irit bensin dan punya fitur keamanan yang lebih baik." },
      { id: 'gtr_m8', title: 'Navigation Apps', category: 'General', difficulty: 'Medium', text: "I've been trying to use a navigation app more often lately; it's honestly helped me avoid so many major traffic jams in the city.", translation: "Belakangan ini saya nyoba buat lebih sering pakai aplikasi navigasi; jujur itu ngebantu saya hindarin banyak kemacetan parah di kota." },
      { id: 'gtr_m9', title: 'Coastal Train', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of taking the train for my next trip; I've heard the views along the coast are just absolutely breathtaking.", translation: "Saya bener-bener mikir mau naik kereta buat perjalanan berikutnya; saya denger pemandangan di sepanjang pantai bener-bener bikin takjub." },
      { id: 'gtr_m10', title: 'Carbon Footprint', category: 'General', difficulty: 'Medium', text: "I've been trying to be more mindful of my carbon footprint lately, so I'm really trying to use public transport whenever I can.", translation: "Belakangan ini saya nyoba buat lebih sadar sama jejak karbon saya, jadi saya bener-bener nyoba buat pakai transportasi umum sebisa mungkin." },
      // HARD (5)
      { id: 'gtr_h1', title: 'Electric Future', category: 'General', difficulty: 'Hard', text: "I'm pretty sure the future of transport is going to be all electric and autonomous; it's just better for the planet and efficiency in the long run.", translation: "Saya yakin banget masa depan transportasi bakal serba listrik dan otomatis; itu jauh lebih baik buat planet kita dan efisiensi dalam jangka panjang." },
      { id: 'gtr_h2', title: 'Reliable Transit', category: 'General', difficulty: 'Hard', text: "If we want more people to actually use public transport instead of their own cars, the system seriously needs to be a lot more reliable and affordable.", translation: "Kalau mau lebih banyak orang pakai transportasi umum daripada mobil pribadi, sistemnya bener-bener harus jauh lebih bisa diandalkan dan terjangkau." },
      { id: 'gtr_h3', title: 'Active Travel', category: 'General', difficulty: 'Hard', text: "I'm a huge fan of active travel, like just walking or cycling to get around, whenever the weather's nice enough and the distance is manageable.", translation: "Saya suka banget bepergian aktif, kayak jalan kaki atau sepedaan buat keliling, tiap kali cuacanya lagi enak dan jaraknya masih masuk akal." },
      { id: 'gtr_h4', title: 'City Congestion', category: 'General', difficulty: 'Hard', text: "The traffic congestion in this city is such a massive headache for everyone; we seriously need a better urban plan to deal with all these cars.", translation: "Kemacetan di kota ini bikin pusing banget buat semua orang; kita bener-bener butuh rencana tata kota yang lebih baik buat ngatasin semua mobil ini." },
      { id: 'gtr_h5', title: 'Road Trip Vibe', category: 'General', difficulty: 'Hard', text: "I just love the total freedom and spontaneity you get on a road trip; you can literally just stop whenever you see something cool or interesting.", translation: "Saya suka banget kebebasan dan spontanitas pas lagi road trip; bisa berhenti kapan aja tiap liat sesuatu yang keren atau menarik." },
    ]
  },

  {
    id: 'gen_emergency',
    title: 'Emergencies',
    category: 'General',
    icon: 'fa-exclamation-triangle',
    description: 'Stay calm and communicate clearly during urgent or critical situations.',
    tasks: [
      // EASY (10)
      { id: 'gemg_e1', title: 'Call for Help', category: 'General', difficulty: 'Easy', text: "Help! Somebody call an ambulance, quick!", translation: "Tolong! Siapa aja tolong panggil ambulans, cepet!", scenario: "Situasi kritis saat membutuhkan bantuan medis segera." },
      { id: 'gemg_e2', title: 'Fire!', category: 'General', difficulty: 'Easy', text: "There's a fire! Everyone out of the building now!", translation: "Ada kebakaran! Semuanya keluar dari gedung sekarang!", scenario: "Peringatan darurat saat melihat api di dalam gedung." },
      { id: 'gemg_e3', title: 'Lost Kid', category: 'General', difficulty: 'Easy', text: "I can't find my son! He's wearing a blue shirt and a red cap.", translation: "Saya nggak bisa nemuin anak saya! Dia pake baju biru sama topi merah.", scenario: "Melaporkan ciri-ciri anak yang hilang di tempat ramai." },
      { id: 'gemg_e4', title: 'Stolen Wallet', category: 'General', difficulty: 'Easy', text: "My wallet's gone! I think someone swiped it. I need to call the police.", translation: "Dompet saya hilang! Kayaknya ada yang nyolong. Saya harus lapor polisi.", scenario: "Menyadari kecopetan dan segera bertindak untuk melapor." },
      { id: 'gemg_e5', title: 'First Aid', category: 'General', difficulty: 'Easy', text: "Does anyone here know first aid? We've got an emergency!", translation: "Ada yang tahu pertolongan pertama nggak? Ada keadaan darurat nih!", scenario: "Mencari orang yang bisa memberikan pertolongan medis pertama." },
      { id: 'gemg_e6', title: 'Accident', category: 'General', difficulty: 'Easy', text: "There's been a crash at the main intersection. We need help!", translation: "Ada kecelakaan di persimpangan utama. Butuh bantuan nih!", scenario: "Melaporkan kecelakaan lalu lintas yang baru saja terjadi." },
      { id: 'gemg_e7', title: 'Feeling Faint', category: 'General', difficulty: 'Easy', text: "I'm feeling really dizzy. I think I'm going to pass out.", translation: "Kepala saya pusing banget. Kayaknya saya mau pingsan deh.", scenario: "Memberitahu orang di sekitar saat merasa kondisi fisik menurun drastis." },
      { id: 'gemg_e8', title: 'Blackout', category: 'General', difficulty: 'Easy', text: "The power's out! Does anyone have a flashlight or some candles?", translation: "Mati lampu! Ada yang punya senter atau lilin nggak?", scenario: "Situasi gelap gulita akibat pemadaman listrik total." },
      { id: 'gemg_e9', title: 'Pipe Burst', category: 'General', difficulty: 'Easy', text: "A pipe just burst in the kitchen! Water is everywhere!", translation: "Pipa di dapur baru aja pecah! Airnya ke mana-mana nih!", scenario: "Mengalami kerusakan infrastruktur rumah (pipa pecah)." },
      { id: 'gemg_e10', title: 'Locked Out', category: 'General', difficulty: 'Easy', text: "I'm locked out of my house. I need to find a locksmith, fast.", translation: "Saya terkunci di luar rumah. Harus cari tukang kunci cepet-cepet.", scenario: "Terjebak di luar karena kunci tertinggal atau hilang." },
      // MEDIUM (10)
      { id: 'gemg_m1', title: 'First Aid Course', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of taking a first aid course soon; I really feel like it's such an important skill to have, just in case.", translation: "Saya bener-bener mikir mau ikut kursus P3K dalam waktu deket; saya rasa itu keahlian yang penting banget buat dipunya, buat jaga-jaga aja." },
      { id: 'gemg_m2', title: 'Staying Alert', category: 'General', difficulty: 'Medium', text: "I've been trying to be a lot more aware of my surroundings lately; it's just so important to stay safe and alert when you're out alone.", translation: "Belakangan ini saya nyoba buat jauh lebih sadar sama keadaan sekitar; penting banget buat tetep aman dan waspada pas lagi di luar sendirian." },
      { id: 'gemg_m3', title: 'Emergency Kit', category: 'General', difficulty: 'Medium', text: "I'm seriously considering putting together a proper emergency kit for my home; I've realized that being prepared is just so incredibly vital.", translation: "Saya bener-bener nimbang mau nyiapin kotak darurat yang bener buat di rumah; saya sadar kalau persiapan itu bener-bener penting banget." },
      { id: 'gemg_m4', title: 'Home Security', category: 'General', difficulty: 'Medium', text: "I've been having some major trouble with my home security system lately; I really need to get it fixed as soon as possible for peace of mind.", translation: "Belakangan ini saya lagi dapet masalah besar sama sistem keamanan rumah; saya bener-bener harus benerin secepet mungkin biar ngerasa tenang." },
      { id: 'gemg_m5', title: 'Volunteering', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of volunteering for a local emergency response team; I really want to do my part to help keep our community safe.", translation: "Saya bener-bener mikir mau jadi relawan buat tim tanggap darurat lokal; saya pengen banget berkontribusi buat bantu jaga komunitas kita tetep aman." },
      { id: 'gemg_m6', title: 'Disaster Plan', category: 'General', difficulty: 'Medium', text: "I've been trying to learn more about what to do in case of a natural disaster; it's just so important to have a clear plan in place.", translation: "Belakangan ini saya nyoba buat belajar lebih banyak soal apa yang harus dilakuin pas ada bencana alam; penting banget buat punya rencana yang jelas." },
      { id: 'gemg_m7', title: 'Dashcam Benefits', category: 'General', difficulty: 'Medium', text: "I'm seriously considering getting a dashcam for my car; I've heard it can be incredibly helpful in case of an accident or any other emergency.", translation: "Saya bener-bener nimbang mau pasang dashcam di mobil; saya denger itu bisa ngebantu banget pas ada kecelakaan atau keadaan darurat lainnya." },
      { id: 'gemg_m8', title: 'Proactive Safety', category: 'General', difficulty: 'Medium', text: "I've been trying to be a lot more proactive about my personal safety lately; it's just so important to be prepared for any kind of situation.", translation: "Belakangan ini saya nyoba buat jauh lebih proaktif soal keamanan pribadi saya; penting banget buat siap siaga buat segala jenis situasi." },
      { id: 'gemg_m9', title: 'Self-Defense', category: 'General', difficulty: 'Medium', text: "I'm seriously thinking of taking a self-defense class soon; I really want to feel more confident and capable of protecting myself if I ever need to.", translation: "Saya bener-bener mikir mau ikut kelas bela diri dalam waktu deket; saya pengen banget ngerasa lebih percaya diri dan mampu lindungin diri sendiri kalau emang perlu." },
      { id: 'gemg_m10', title: 'Emergency Alerts', category: 'General', difficulty: 'Medium', text: "I've been trying to stay more informed about local emergency alerts lately; it's just so important to know what's going on in our area at all times.", translation: "Belakangan ini saya nyoba buat tetep dapet info soal peringatan darurat lokal; penting banget buat tahu apa yang lagi terjadi di daerah kita tiap saat." },
      // HARD (5)
      { id: 'gemg_h1', title: 'Crisis Comm', category: 'General', difficulty: 'Hard', text: "When an emergency hits, staying calm and keeping a clear head is honestly the most important thing you can do to help yourself and others.", translation: "Pas keadaan darurat terjadi, tetap tenang dan jernih pikirannya itu jujur hal paling penting yang bisa kamu lakuin buat bantu diri sendiri dan orang lain." },
      { id: 'gemg_h2', title: 'First Aid Skills', category: 'General', difficulty: 'Hard', text: "I think everyone should learn basic first aid and CPR; you never know when those skills might actually save someone's life in a critical moment.", translation: "Menurut saya semua orang harus belajar P3K dasar dan CPR; kita nggak pernah tahu kapan keahlian itu bisa beneran nyelamatin nyawa orang di saat kritis." },
      { id: 'gemg_h3', title: 'Preparedness Kit', category: 'General', difficulty: 'Hard', text: "We've actually got an emergency preparedness kit all packed and ready to go in a safe spot, just in case something unexpected happens.", translation: "Kami beneran udah nyiapin kotak siaga darurat yang siap dibawa dan ditaruh di tempat aman, jaga-jaga kalau sesuatu yang nggak terduga terjadi." },
      { id: 'gemg_h4', title: 'Resilient Community', category: 'General', difficulty: 'Hard', text: "Community resilience is really all about looking out for your neighbors and working together when things go wrong or a disaster strikes.", translation: "Ketangguhan komunitas itu sebenernya soal saling jaga tetangga dan kerja bareng pas ada masalah atau bencana dateng." },
      { id: 'gemg_h5', title: 'First Responders', category: 'General', difficulty: 'Hard', text: "I'm so incredibly grateful for the first responders who literally put their lives on the line every single day to keep our community safe and secure.", translation: "Saya sangat bersyukur sama petugas darurat yang bener-bener ngerasain nyawa mereka tiap hari demi jaga komunitas kita tetap aman dan terlindungi." },
    ]
  },
  {
    id: 'gen_idioms_slang',
    title: 'Idioms & Slang Expressions',
    category: 'Idioms & Slang',
    icon: 'fa-comment-dots',
    description: 'Learn to use popular idioms and modern slang naturally in real-life English conversations.',
    tasks: [
      // EASY (5)
      {
        id: 'is_e1',
        title: 'Biting the Bullet',
        category: 'Idioms & Slang',
        difficulty: 'Easy',
        text: "I guess I just have to bite the bullet and tell him the truth, even if it's hard.",
        translation: "Sepertinya saya harus berani menerima kenyataan dan mengatakan yang sebenarnya padanya, meskipun itu sulit.",
        scenario: "Gunakan 'bite the bullet' saat memutuskan untuk menghadapi situasi sulit dengan berani."
      },
      {
        id: 'is_e2',
        title: 'Feeling Under the Weather',
        category: 'Idioms & Slang',
        difficulty: 'Easy',
        text: "I'm feeling a bit under the weather today, so I think I'll just stay in bed.",
        translation: "Saya merasa kurang enak badan hari ini, jadi sepertinya saya akan tidur saja di kasur.",
        scenario: "Gunakan 'under the weather' sebagai ungkapan sopan dan alami saat Anda kurang sehat."
      },
      {
        id: 'is_e3',
        title: 'Piece of Cake',
        category: 'Idioms & Slang',
        difficulty: 'Easy',
        text: "Don't worry about the English exam; it's going to be a piece of cake for you!",
        translation: "Jangan khawatir soal ujian bahasa Inggris; itu bakal sangat mudah buat kamu!",
        scenario: "Gunakan 'piece of cake' untuk menyemangati seseorang bahwa suatu tugas sangatlah mudah."
      },
      {
        id: 'is_e4',
        title: 'No Cap (Slang)',
        category: 'Idioms & Slang',
        difficulty: 'Easy',
        text: "Your presentation was amazing, no cap! Everyone in the room was impressed.",
        translation: "Presentasimu luar biasa, jujur/serius! Semua orang di ruangan terkesan.",
        scenario: "Gunakan slang 'no cap' untuk menegaskan bahwa Anda benar-benar jujur dan tidak berbohong."
      },
      {
        id: 'is_e5',
        title: 'Gucci / All Good (Slang)',
        category: 'Idioms & Slang',
        difficulty: 'Easy',
        text: "Don't worry about the mistake, we're all Gucci here. Let's just fix it together.",
        translation: "Jangan khawatir soal kesalahannya, kita aman/baik-baik aja di sini. Yuk perbaiki bareng.",
        scenario: "Gunakan slang 'Gucci' untuk mengonfirmasi bahwa semuanya baik-baik saja (all good) dan tidak ada masalah."
      },
      // MEDIUM (5)
      {
        id: 'is_m1',
        title: 'Spilling the Beans',
        category: 'Idioms & Slang',
        difficulty: 'Medium',
        text: "Who spilled the beans about the surprise party? It was supposed to be a secret!",
        translation: "Siapa yang membocorkan rahasia tentang pesta kejutan itu? Harusnya kan rahasia!",
        scenario: "Gunakan 'spill the beans' ketika seseorang tidak sengaja atau sengaja membocorkan suatu rahasia."
      },
      {
        id: 'is_m2',
        title: 'Burning the Midnight Oil',
        category: 'Idioms & Slang',
        difficulty: 'Medium',
        text: "I've been burning the midnight oil lately to prepare for our startup launch.",
        translation: "Saya begadang sampai larut malam belakangan ini untuk mempersiapkan peluncuran startup kita.",
        scenario: "Gunakan 'burning the midnight oil' untuk menjelaskan kerja keras atau belajar hingga larut malam."
      },
      {
        id: 'is_m3',
        title: 'Once in a Blue Moon',
        category: 'Idioms & Slang',
        difficulty: 'Medium',
        text: "My brother lives abroad, so we only get to see him once in a blue moon.",
        translation: "Kakak saya tinggal di luar negeri, jadi kami hanya bisa bertemu dengannya sangat jarang sekali.",
        scenario: "Gunakan 'once in a blue moon' untuk menekankan bahwa suatu kejadian sangat jarang terjadi."
      },
      {
        id: 'is_m4',
        title: 'Ghosting Someone (Slang)',
        category: 'Idioms & Slang',
        difficulty: 'Medium',
        text: "We went on two dates, and then he just ghosted me... I don't get why people do that.",
        translation: "Kami berkencan dua kali, lalu dia menghilang begitu saja tanpa kabar... Saya nggak paham kenapa orang begitu.",
        scenario: "Gunakan slang 'ghost' ketika seseorang tiba-tiba memutus komunikasi tanpa penjelasan."
      },
      {
        id: 'is_m5',
        title: 'Spilling the Tea (Slang)',
        category: 'Idioms & Slang',
        difficulty: 'Medium',
        text: "Alright, tell me everything! Spill the tea on what happened at the office today.",
        translation: "Oke, ceritakan semuanya! Ceritain gosip/kabar seru tentang apa yang terjadi di kantor hari ini.",
        scenario: "Gunakan slang 'spill the tea' untuk meminta seseorang menceritakan gosip hangat atau berita menarik."
      },
      // HARD (5)
      {
        id: 'is_h1',
        title: 'Biting off More Than You Can Chew',
        category: 'Idioms & Slang',
        difficulty: 'Hard',
        text: "By taking on three projects at once, I think you're biting off more than you can chew.",
        translation: "Dengan mengambil tiga proyek sekaligus, rasanya kamu memikul tanggung jawab lebih besar dari kemampuanmu.",
        scenario: "Gunakan idiom ini untuk memperingatkan seseorang agar tidak mengambil beban kerja atau tanggung jawab yang berlebihan."
      },
      {
        id: 'is_h2',
        title: 'Taking with a Grain of Salt',
        category: 'Idioms & Slang',
        difficulty: 'Hard',
        text: "You should take what you read on social media with a grain of salt; check the facts first.",
        translation: "Kamu sebaiknya tidak menelan mentah-mentah apa yang kamu baca di media sosial; periksa faktanya dulu.",
        scenario: "Gunakan idiom ini saat menyarankan seseorang untuk tidak langsung memercayai informasi tanpa verifikasi."
      },
      {
        id: 'is_h3',
        title: 'Lowkey vs Highkey (Slang)',
        category: 'Idioms & Slang',
        difficulty: 'Hard',
        text: "I lowkey want to stay home tonight, but I highkey know I should go to support my friend.",
        translation: "Saya diam-diam/agak pengen di rumah aja malam ini, tapi saya bener-bener sadar harus pergi buat dukung teman saya.",
        scenario: "Kalimat ini menggabungkan 'lowkey' (perasaan tersembunyi/kecil) dan 'highkey' (keinginan kuat/jelas)."
      },
      {
        id: 'is_h4',
        title: 'Rizz & Charisma (Slang)',
        category: 'Idioms & Slang',
        difficulty: 'Hard',
        text: "He doesn't talk much, but he's got insane rizz. He can charm anyone without even trying.",
        translation: "Dia nggak banyak omong, tapi dia punya daya tarik/karisma luar biasa. Dia bisa memikat siapa saja tanpa perlu berusaha.",
        scenario: "Gunakan slang 'rizz' (kependekan dari charisma) untuk mendeskripsikan kemampuan memikat atau menarik perhatian orang lain."
      },
      {
        id: 'is_h5',
        title: 'GOAT of the Field (Slang)',
        category: 'Idioms & Slang',
        difficulty: 'Hard',
        text: "In terms of scientific research, she is hands down the GOAT. Her work changed the entire industry.",
        translation: "Dalam hal penelitian ilmiah, dia pastinya yang terbaik sepanjang masa. Karyanya mengubah seluruh industri.",
        scenario: "Gunakan akronim slang 'GOAT' (Greatest Of All Time) untuk menghormati seseorang yang terbaik di bidangnya."
      }
    ]
  },

  ...DAILY_ISLAMIC_ORIGINAL_THEMES,
  ...DAILY_ISLAMIC_ORIGINAL_THEMES_2,
  ...DAILY_ISLAMIC_THEMES,
  ...IDIOMS_GENERAL_THEMES,
  ...IDIOMS_ISLAMIC_THEMES,
  ...SLANG_GENERAL_THEMES,
  ...SLANG_ISLAMIC_THEMES,
  ...IDIOMS_GENERAL_THEMES_2,
  ...SLANG_GENERAL_THEMES_2
];
