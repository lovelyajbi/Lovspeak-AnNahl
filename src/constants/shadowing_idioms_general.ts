import { ShadowingTask } from '../../types';
import { ShadowingTheme } from './shadowingData';

export const IDIOMS_GENERAL_THEMES: ShadowingTheme[] = [
  {
    id: 'idioms_general_1',
    title: 'Essential Native Idioms',
    category: 'Idioms',
    mainCategory: 'Idioms',
    subCategory: 'General',
    icon: 'fa-lightbulb',
    description: 'Master the most common English idioms that native speakers use every day to sound more natural and fluent.',
    tasks: [
      // EASY
      { id: 'ig_e1', title: 'Piece of Cake', category: 'Idioms', difficulty: 'Easy', text: "Don't worry about the test tomorrow. It's going to be a piece of cake!", translation: "Jangan khawatir soal ujian besok. Itu bakal gampang banget!", scenario: "Gunakan 'piece of cake' untuk menggambarkan sesuatu yang sangat mudah." },
      { id: 'ig_e2', title: 'Break the Ice', category: 'Idioms', difficulty: 'Easy', text: "He told a funny joke to break the ice at the beginning of the meeting.", translation: "Dia menceritakan lelucon lucu untuk mencairkan suasana di awal rapat.", scenario: "Mencairkan suasana yang canggung saat baru pertama kali bertemu." },
      { id: 'ig_e3', title: 'Under the Weather', category: 'Idioms', difficulty: 'Easy', text: "I think I'm going to stay home today; I'm feeling a bit under the weather.", translation: "Kayaknya saya mau di rumah aja hari ini; saya lagi agak kurang enak badan.", scenario: "Cara halus untuk mengatakan bahwa Anda sedang sakit." },
      { id: 'ig_e4', title: 'Cost an Arm and a Leg', category: 'Idioms', difficulty: 'Easy', text: "I'd love to buy that car, but it costs an arm and a leg.", translation: "Saya pengen banget beli mobil itu, tapi harganya mahal banget.", scenario: "Menggambarkan sesuatu yang harganya sangat mahal." },
      { id: 'ig_e5', title: 'Call it a Day', category: 'Idioms', difficulty: 'Easy', text: "We've been working for ten hours straight. Let's just call it a day.", translation: "Kita sudah kerja sepuluh jam penuh. Kita akhiri saja hari ini (istirahat).", scenario: "Mengakhiri pekerjaan setelah merasa cukup untuk hari itu." },
      // MEDIUM
      { id: 'ig_m1', title: 'Bite the Bullet', category: 'Idioms', difficulty: 'Medium', text: "I hate going to the dentist, but I just have to bite the bullet and go.", translation: "Saya benci ke dokter gigi, tapi saya harus memaksakan diri dan pergi.", scenario: "Menghadapi sesuatu yang tidak menyenangkan dengan berani." },
      { id: 'ig_m2', title: 'Cut Corners', category: 'Idioms', difficulty: 'Medium', text: "They really cut corners when building this house, and now the roof is leaking.", translation: "Mereka benar-benar mengambil jalan pintas saat membangun rumah ini, dan sekarang atapnya bocor.", scenario: "Melakukan sesuatu dengan buruk atau murah untuk menghemat waktu/uang." },
      { id: 'ig_m3', title: 'Hit the Nail on the Head', category: 'Idioms', difficulty: 'Medium', text: "You really hit the nail on the head with that analysis; it was absolutely perfect.", translation: "Kamu benar-benar tepat sasaran dengan analisis itu; itu sangat sempurna.", scenario: "Menyatakan atau melakukan sesuatu dengan sangat akurat/tepat." },
      { id: 'ig_m4', title: 'Let the Cat out of the Bag', category: 'Idioms', difficulty: 'Medium', text: "We wanted to keep the surprise gift a secret, but my little brother let the cat out of the bag.", translation: "Kami ingin merahasiakan hadiah kejutan itu, tapi adik laki-lakiku membocorkan rahasianya.", scenario: "Membongkar rahasia secara tidak sengaja." },
      { id: 'ig_m5', title: 'Spill the Beans', category: 'Idioms', difficulty: 'Medium', text: "Come on, don't keep me in suspense! Just spill the beans already.", translation: "Ayo dong, jangan bikin saya penasaran! Ceritain aja rahasianya sekarang.", scenario: "Meminta seseorang untuk mengungkapkan informasi rahasia." },
      // HARD
      { id: 'ig_h1', title: 'Devil\'s Advocate', category: 'Idioms', difficulty: 'Hard', text: "I agree with your plan, but let me play devil's advocate for a second to test its weaknesses.", translation: "Saya setuju dengan rencanamu, tapi biarkan saya berpura-pura menentang untuk menguji kelemahannya.", scenario: "Mengambil posisi berlawanan hanya demi argumen atau menguji sebuah ide." },
      { id: 'ig_h2', title: 'Blessing in Disguise', category: 'Idioms', difficulty: 'Hard', text: "Losing that job was actually a blessing in disguise because it pushed me to start my own business.", translation: "Kehilangan pekerjaan itu sebenarnya adalah berkah terselubung karena itu mendorongku untuk memulai bisninku sendiri.", scenario: "Sesuatu yang awalnya tampak buruk namun akhirnya membawa kebaikan." },
      { id: 'ig_h3', title: 'Burn the Midnight Oil', category: 'Idioms', difficulty: 'Hard', text: "If we want to get this project launched by Friday, we're going to have to burn the midnight oil.", translation: "Kalau kita mau proyek ini rilis hari Jumat, kita harus rela begadang untuk bekerja keras.", scenario: "Bekerja sangat larut malam untuk menyelesaikan sesuatu." },
      { id: 'ig_h4', title: 'Steal Someone\'s Thunder', category: 'Idioms', difficulty: 'Hard', text: "I was going to announce my engagement, but Sarah stole my thunder by announcing her pregnancy.", translation: "Aku mau mengumumkan pertunanganku, tapi Sarah mencuri perhatian dengan mengumumkan kehamilannya.", scenario: "Mencuri perhatian atau pujian yang seharusnya untuk orang lain." },
      { id: 'ig_h5', title: 'Beat Around the Bush', category: 'Idioms', difficulty: 'Hard', text: "Stop beating around the bush and just tell me exactly what the problem is.", translation: "Berhenti bertele-tele dan beritahu saya apa sebenarnya masalahnya.", scenario: "Menghindari topik utama karena tidak nyaman membicarakannya." }
    ]
  }
];
