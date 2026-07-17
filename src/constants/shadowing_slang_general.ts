import { ShadowingTask } from '../../types';
import { ShadowingTheme } from './shadowingData';

export const SLANG_GENERAL_THEMES: ShadowingTheme[] = [
  {
    id: 'slang_general_1',
    title: 'Modern Internet & Street Slang',
    category: 'Slang',
    mainCategory: 'Slang',
    subCategory: 'General',
    icon: 'fa-fire',
    description: 'Sound like a true local with the latest modern slang, internet terms, and casual street expressions.',
    tasks: [
      // EASY
      { id: 'sg_e1', title: 'Ghosting Someone', category: 'Slang', difficulty: 'Easy', text: "I submitted my application weeks ago, but the company just completely ghosted me.", translation: "Saya mengirimkan lamaran beberapa minggu lalu, tapi perusahaan itu tiba-tiba menghilang tanpa kabar (ghosting) gitu aja.", scenario: "Menceritakan perusahaan yang tidak memberi kabar setelah wawancara/lamaran kerja." },
      { id: 'sg_e2', title: 'That\'s Lit', category: 'Slang', difficulty: 'Easy', text: "Did you see his new car? That thing is absolutely lit!", translation: "Kamu lihat mobil barunya nggak? Mobilnya bener-bener keren abis!", scenario: "Mengekspresikan kekaguman pada sesuatu yang sangat keren atau luar biasa." },
      { id: 'sg_e3', title: 'Lowkey', category: 'Slang', difficulty: 'Easy', text: "I'm not gonna lie, I'm lowkey terrified of what's going to happen next.", translation: "Sejujurnya, saya diam-diam/agak takut sama apa yang bakal terjadi selanjutnya.", scenario: "Mengakui perasaan atau hal yang tidak ingin terlalu ditonjolkan." },
      { id: 'sg_e4', title: 'Spill the Tea', category: 'Slang', difficulty: 'Easy', text: "Okay, sit down and spill the tea. What happened at the committee meeting?", translation: "Oke, duduk sini dan ceritain gosipnya (spill the tea). Apa yang terjadi di rapat panitia itu?", scenario: "Meminta teman untuk menceritakan kabar terbaru atau kejadian seru di kampus/kantor." },
      { id: 'sg_e5', title: 'Salty', category: 'Slang', difficulty: 'Easy', text: "Don't be so salty just because you lost the game.", translation: "Jangan marah/kesal (salty) gitu dong cuma gara-gara kamu kalah permainannya.", scenario: "Menegur teman yang terlihat kesal karena hal sepele atau kekalahan." },
      // MEDIUM
      { id: 'sg_m1', title: 'No Cap', category: 'Slang', difficulty: 'Medium', text: "That was the best burger I've ever had in my entire life, no cap.", translation: "Itu burger terenak yang pernah saya makan seumur hidup, serius (no cap/nggak bohong).", scenario: "Meyakinkan seseorang bahwa apa yang dikatakan adalah kebenaran murni." },
      { id: 'sg_m2', title: 'Catching Feelings', category: 'Slang', difficulty: 'Medium', text: "I wasn't planning on adopting a cat, but when I saw that kitten, I started catching feelings.", translation: "Saya nggak berencana mengadopsi kucing, tapi pas lihat anak kucing itu, saya mulai terbawa perasaan (catching feelings).", scenario: "Mengakui mulai munculnya rasa sayang pada sesuatu (bisa hewan peliharaan atau hal lain)." },
      { id: 'sg_m3', title: 'Flexing', category: 'Slang', difficulty: 'Medium', text: "He's always flexing his expensive watch on Instagram, it's getting kind of annoying.", translation: "Dia selalu pamer jam tangan mahalnya di Instagram, lama-lama agak nyebelin sih.", scenario: "Membicarakan orang yang suka pamer harta atau pencapaian." },
      { id: 'sg_m4', title: 'Living Rent-Free', category: 'Slang', difficulty: 'Medium', text: "That awkward thing I said five years ago is still living rent-free in my head.", translation: "Hal canggung yang saya bilang lima tahun lalu itu masih aja terngiang-ngiang di kepalaku.", scenario: "Menggambarkan sesuatu (biasanya hal memalukan) yang terus-menerus dipikirkan tanpa sengaja." },
      { id: 'sg_m5', title: 'Vibe Check', category: 'Slang', difficulty: 'Medium', text: "I had to do a quick vibe check before I decided to join their study group.", translation: "Saya harus ngecek suasananya (vibe check) dulu sebelum mutusin gabung kelompok belajar mereka.", scenario: "Menilai atmosfer atau energi seseorang/kelompok sebelum berinteraksi lebih jauh." },
      // HARD
      { id: 'sg_h1', title: 'Gatekeeping', category: 'Slang', difficulty: 'Hard', text: "Stop gatekeeping that indie band; everyone deserves to listen to good music, man.", translation: "Berhenti merahasiakan (gatekeeping) band indie itu; semua orang berhak dengerin musik bagus, bro.", scenario: "Menegur orang yang menyembunyikan informasi bagus agar tetap eksklusif." },
      { id: 'sg_h2', title: 'Touch Grass', category: 'Slang', difficulty: 'Hard', text: "You've been arguing on Twitter for six hours straight; you seriously need to go outside and touch grass.", translation: "Kamu udah debat di Twitter enam jam berturut-turut; kamu bener-bener harus keluar rumah dan sadar dunia nyata (touch grass).", scenario: "Menyuruh seseorang yang terlalu obsesif di internet untuk kembali ke kehidupan nyata." },
      { id: 'sg_h3', title: 'Gaslighting', category: 'Slang', difficulty: 'Hard', text: "Don't let him gaslight you into thinking that you're the one who caused all this drama.", translation: "Jangan biarin dia memanipulasi (gaslight) kamu sampai kamu mikir kalau kamulah penyebab semua drama ini.", scenario: "Memperingatkan teman tentang manipulasi psikologis dari orang toksik." },
      { id: 'sg_h4', title: 'Rizz (Charisma)', category: 'Slang', difficulty: 'Hard', text: "I don't know how he does it, but his unspoken rizz when presenting on stage is just off the charts.", translation: "Saya nggak tahu gimana caranya, tapi karismanya (rizz) yang nggak terucap saat presentasi di panggung bener-bener luar biasa.", scenario: "Membahas kemampuan seseorang (karisma) dalam menarik perhatian audiens saat public speaking." },
      { id: 'sg_h5', title: 'Main Character Energy', category: 'Slang', difficulty: 'Hard', text: "Walking into the room in that stunning outfit, she was absolutely radiating main character energy.", translation: "Berjalan masuk ke ruangan dengan pakaian memukau itu, dia benar-benar memancarkan aura pemeran utama.", scenario: "Memuji seseorang yang tampil sangat percaya diri dan menjadi pusat perhatian." }
    ]
  }
];
