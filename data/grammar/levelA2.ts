
import { GrammarLesson } from '../../types';

export const LEVEL_A2: GrammarLesson[] = [
  {
    id: 'a2-past-simple',
    title: '1. Past Simple Mastery',
    level: 'A2',
    icon: 'fa-history',
    description: 'Cara akurat menceritakan kenangan, sejarah, dan kejadian yang sudah usai di masa lalu.',
    sections: [
      {
        heading: '1. Logika Garis Waktu: Kejadian yang Selesai',
        content: 'Past Simple digunakan secara eksklusif untuk aksi yang sudah dimulai dan SELESAI sepenuhnya di masa lalu. Kejadian tersebut tidak memiliki hubungan durasi lagi dengan masa kini. Bayangkan sebuah foto statis dari masa lalu; itulah hakikat dari tenses ini.\n\nTenses ini adalah instrumen utama dalam seni bercerita (Storytelling). Tanpanya, Anda tidak akan bisa menceritakan apa yang Anda lakukan tadi pagi, liburan tahun lalu, atau kisah-kisah bersejarah yang menjadi pelajaran bagi umat manusia. Ketepatan dalam menggunakan tenses ini menunjukkan bahwa Anda mampu membedakan antara fakta saat ini dan memori masa lalu.',
        formula: 'Subject + Verb 2 + [Time Signal]',
        exceptions: 'Hati-hati dengan kata kerja yang tidak berubah di masa lalu (seperti: Cut, Put, Read - diucapkan /red/).',
        examples: [
          { text: 'I prayed Fajr this morning.', isCorrect: true, translation: 'Saya shalat Fajr pagi ini.' },
          { text: 'He visited Mecca last year.', isCorrect: true, translation: 'Dia mengunjungi Mekkah tahun lalu.' },
          { text: 'We ate lunch together.', isCorrect: true, translation: 'Kami makan siang bersama.' },
          { text: 'She cleaned the house yesterday.', isCorrect: true, translation: 'Dia membersihkan rumah kemarin.' },
          { text: 'The rain stopped an hour ago.', isCorrect: true, translation: 'Hujan berhenti satu jam yang lalu.' }
        ]
      },
      {
        heading: '2. Perubahan Wujud: Regular vs Irregular',
        content: 'Dalam masa lalu, kata kerja berubah bentuk menjadi Verb 2. Mayoritas kata kerja bersifat "Regular" yang hanya butuh tambahan akhiran "-ed" (seperti Walk menjadi Walked). Namun, tantangan terbesarnya adalah kata kerja "Irregular" yang berubah secara total (seperti Go menjadi Went).\n\nAnda tidak bisa menebak bentuk Irregular dengan rumus; Anda harus menghafal dan sering mempraktikkannya. Kata-kata yang paling umum digunakan dalam percakapan sehari-hari justru seringkali bersifat Irregular. Menguasai daftar ini akan membuat narasi Anda terdengar lancar dan tidak tersendat karena keraguan dalam memilih bentuk kata.',
        formula: 'Regular: Verb + ed | Irregular: Unique Form',
        exceptions: 'Beberapa kata kerja memiliki perubahan vokal di tengah (seperti: Run -> Ran, Drink -> Drank).',
        examples: [
          { text: 'I worked late last night.', isCorrect: true, note: 'Regular verb.', translation: 'Saya bekerja lembur tadi malam.' },
          { text: 'She went to the market.', isCorrect: true, note: 'Irregular (Go -> Went).', translation: 'Dia pergi ke pasar.' },
          { text: 'We saw a beautiful sunset.', isCorrect: true, note: 'Irregular (See -> Saw).', translation: 'Kami melihat matahari terbenam yang indah.' },
          { text: 'They studied for the exam.', isCorrect: true, note: 'Regular verb.', translation: 'Mereka belajar untuk ujian.' },
          { text: 'He bought a new book.', isCorrect: true, note: 'Irregular (Buy -> Bought).', translation: 'Dia membeli buku baru.' }
        ]
      },
      {
        heading: '3. Hukum "DID": Sang Pencuri Masa Lalu',
        content: 'Dalam kalimat negatif dan kalimat tanya, kita menggunakan kata kerja bantu "DID". Aturan emas yang harus selalu diingat adalah: ketika "DID" muncul, kata kerja utama harus KEMBALI KE BENTUK DASAR (Verb 1). Mengapa? Karena DID sudah membawa identitas masa lalu, sehingga kita tidak butuh dua penanda masa lalu dalam satu kalimat.\n\nKesalahan umum adalah berkata "I didn\'t went" yang sangat salah secara struktur. Bentuk yang benar adalah "I didn\'t go". DID bertindak sebagai "pencuri" sifat masa lalu dari kata kerja utama, sehingga kata kerja tersebut kembali menjadi polos atau asli. Pahami logika ini agar Anda tidak memboroskan kata dalam satu kalimat.',
        formula: 'Neg: Didn\'t + Verb 1 | Que: Did + Subj + Verb 1?',
        exceptions: 'To Be (Was/Were) tidak memerlukan "DID" untuk kalimat negatif atau tanya.',
        examples: [
          { text: 'I did not (didn\'t) sleep well.', isCorrect: true, translation: 'Saya tidak tidur dengan nyenyak.' },
          { text: 'Did you see the crescent moon?', isCorrect: true, translation: 'Apakah kamu melihat bulan sabit?' },
          { text: 'They did not finish the task.', isCorrect: true, translation: 'Mereka tidak menyelesaikan tugas itu.' },
          { text: 'Did he pray at the mosque?', isCorrect: true, translation: 'Apakah dia shalat di masjid?' },
          { text: 'We didn\'t buy any snacks.', isCorrect: true, translation: 'Kami tidak membeli camilan apa pun.' }
        ]
      },
      {
        heading: '4. To Be Masa Lalu (Was & Were)',
        content: 'Sama seperti present tense, jika dalam kalimat masa lalu tidak ada aksi fisik (hanya status atau lokasi), kita menggunakan To Be. Namun, bentuknya berubah menjadi "Was" (untuk I, He, She, It) dan "Were" (untuk You, We, They).\n\n"Was" dan "Were" sangat penting untuk mendeskripsikan suasana atau perasaan Anda di masa lalu. Misalnya, menceritakan perasaan tenang saat berada di Masjidil Haram. Penggunaan To Be yang tepat membantu pendengar masuk ke dalam suasana emosional dari cerita yang sedang Anda sampaikan.',
        formula: 'I/He/She/It + Was | You/We/They + Were',
        exceptions: 'Dalam kalimat pengandaian (If I were you...), kita sering menggunakan "Were" untuk semua subjek, namun ini untuk level lanjut.',
        examples: [
          { text: 'I was very happy yesterday.', isCorrect: true, translation: 'Saya sangat senang kemarin.' },
          { text: 'They were in Medina last month.', isCorrect: true, translation: 'Mereka berada di Madinah bulan lalu.' },
          { text: 'The weather was so hot.', isCorrect: true, translation: 'Cuacanya sangat panas.' },
          { text: 'We were tired after the trip.', isCorrect: true, translation: 'Kami lelah setelah perjalanan itu.' },
          { text: 'She was a diligent student.', isCorrect: true, translation: 'Dia dulu adalah siswa yang rajin.' }
        ]
      },
      {
        heading: '5. Konteks Adab: Menceritakan Sejarah (Seerah)',
        content: 'Dalam Islam, akurasi dalam menceritakan sejarah (Seerah) Nabi dan Sahabat adalah hal yang sangat mulia. Menggunakan Past Simple dengan benar menunjukkan penghormatan Anda pada akurasi fakta sejarah tersebut. Kita tidak boleh sembarangan mengubah fakta masa lalu karena itu adalah amanah ilmiah.\n\nSaat Anda bercerita tentang kebaikan orang lain di masa lalu, gunakan tenses ini untuk mengunci memori kebaikan tersebut. Katakanlah dengan bangga, "They were great people", sebagai bentuk apresiasi atas jejak kebaikan yang mereka tinggalkan. Bahasa yang benar membantu kita menjaga integritas narasi sejarah umat manusia.',
        formula: 'Historical Fact + Past Simple',
        exceptions: 'Tetap gunakan Present Simple untuk fakta Al-Quran yang bersifat abadi, meskipun menceritakan masa lalu.',
        examples: [
          { text: 'The Prophet migrated to Medina.', isCorrect: true, translation: 'Nabi berhijrah ke Madinah.' },
          { text: 'The Sahabah were very brave.', isCorrect: true, translation: 'Para Sahabat sangat berani.' },
          { text: 'Islam spread rapidly in the past.', isCorrect: true, translation: 'Islam menyebar dengan cepat di masa lalu.' },
          { text: 'They built amazing civilizations.', isCorrect: true, translation: 'Mereka membangun peradaban yang luar biasa.' },
          { text: 'That was a great lesson for us.', isCorrect: true, translation: 'Itu adalah pelajaran besar bagi kita.' }
        ]
      }
    ],
    mindmap: {
      id: 'a2-ps-root', label: 'PAST SIMPLE', type: 'root', children: [
        { id: 'v2', label: 'Verb Forms', type: 'main', children: [
          { id: 'reg', label: 'Regular (+ed)', type: 'sub' },
          { id: 'irreg', label: 'Irregular (Memorize)', type: 'sub' }
        ]},
        { id: 'struc', label: 'Structure', type: 'main', children: [
          { id: 'neg', label: 'Neg: Didn\'t + V1', type: 'formula' },
          { id: 'que', label: 'Que: Did .. + V1?', type: 'formula' },
          { id: 'tobe', label: 'Status: Was/Were', type: 'sub' }
        ]}
      ]
    }
  },
  {
    id: 'a2-countable',
    title: '2. Countable & Uncountable Nouns',
    level: 'A2',
    icon: 'fa-apple-alt',
    description: 'Memahami cara menghitung benda dan zat untuk akurasi dalam permintaan dan deskripsi kuantitas.',
    sections: [
      {
        heading: '1. Countable Nouns: Benda yang Bisa Dihitung',
        content: 'Countable nouns adalah benda yang memiliki wujud fisik yang jelas dan bisa kita hitung satu per satu menggunakan angka. Benda-benda ini memiliki bentuk tunggal (Singular) dan bentuk jamak (Plural), biasanya ditandai dengan tambahan "S" atau "ES".\n\nMemahami countable nouns sangat penting untuk transaksi sehari-hari. Misalnya, saat Anda ingin membeli apel atau memesan kursi. Karena bisa dihitung, kita bisa menggunakan artikel "a/an" atau angka spesifik di depannya untuk memberikan kejelasan jumlah kepada lawan bicara kita.',
        formula: 'Singular: A/An + Noun | Plural: Noun + s/es',
        exceptions: 'Beberapa benda memiliki bentuk jamak yang tidak beraturan (Irregular Plural), seperti: Man -> Men, Child -> Children, Tooth -> Teeth.',
        examples: [
          { text: 'I have an apple.', isCorrect: true, translation: 'Saya punya sebuah apel.' },
          { text: 'There are five chairs.', isCorrect: true, translation: 'Ada lima kursi.' },
          { text: 'He bought three books.', isCorrect: true, translation: 'Dia membeli tiga buku.' },
          { text: 'Many students are here.', isCorrect: true, translation: 'Banyak siswa ada di sini.' },
          { text: 'We saw two mosques.', isCorrect: true, translation: 'Kami melihat dua masjid.' }
        ]
      },
      {
        heading: '2. Uncountable Nouns: Zat dan Ide Abstrak',
        content: 'Uncountable nouns adalah benda yang dianggap sebagai satu kesatuan besar, massa, atau ide abstrak yang tidak bisa dipisahkan menjadi unit-unit kecil untuk dihitung. Contohnya adalah cairan (air, susu), butiran halus (pasir, gula), atau perasaan (cinta, pengetahuan).\n\nBenda-benda ini tidak memiliki bentuk jamak. Kita tidak boleh mengatakan "waters" atau "knowledges". Untuk menyebutkan jumlahnya, kita sering menggunakan kata bantu seperti "some", "much", atau wadah tertentu. Kesalahan dalam kategori ini sering membuat pembelajar terdengar tidak alami.',
        formula: 'No Plural Form | No A/An',
        exceptions: 'Benda seperti "Bread", "Money", dan "Information" sering dianggap bisa dihitung dalam bahasa lain, tapi di bahasa Inggris mereka Uncountable.',
        examples: [
          { text: 'I need some water.', isCorrect: true, translation: 'Saya butuh air.' },
          { text: 'Knowledge is power.', isCorrect: true, translation: 'Pengetahuan adalah kekuatan.' },
          { text: 'There is too much salt.', isCorrect: true, translation: 'Ada terlalu banyak garam.' },
          { text: 'She drinks milk every day.', isCorrect: true, translation: 'Dia minum susu setiap hari.' },
          { text: 'We have enough time.', isCorrect: true, translation: 'Kita punya cukup waktu.' }
        ]
      },
      {
        heading: '3. Quantifiers: Many vs Much',
        content: 'Untuk menyatakan jumlah yang "banyak", bahasa Inggris membedakan kata yang digunakan berdasarkan jenis bendanya. "Many" digunakan khusus untuk benda yang bisa dihitung (Countable), sedangkan "Much" digunakan untuk benda yang tidak bisa dihitung (Uncountable).\n\nSeringkali pembelajar tertukar dalam menggunakan keduanya. Cara mudah mengingatnya adalah: jika bendanya punya akhiran "S" jamak, gunakan Many. Jika tidak bisa dijamakkan, gunakan Much. Dalam kalimat positif, kita juga sering menggunakan "A lot of" yang bisa digunakan untuk kedua jenis benda tersebut agar lebih aman.',
        formula: 'Many + Countable | Much + Uncountable',
        exceptions: '"A lot of" bisa digunakan untuk keduanya (fleksibel) dalam kalimat positif.',
        examples: [
          { text: 'How many brothers do you have?', isCorrect: true, translation: 'Berapa banyak saudara laki-laki yang kamu punya?' },
          { text: 'How much money do you need?', isCorrect: true, translation: 'Berapa banyak uang yang kamu butuhkan?' },
          { text: 'There are many trees in the park.', isCorrect: true, translation: 'Ada banyak pohon di taman.' },
          { text: 'I don\'t have much information.', isCorrect: true, translation: 'Saya tidak punya banyak informasi.' },
          { text: 'We eat a lot of rice.', isCorrect: true, translation: 'Kami makan banyak nasi.' }
        ]
      },
      {
        heading: '4. Satuan Ukuran (Containers & Units)',
        content: 'Meskipun uncountable nouns tidak bisa dihitung langsung, kita bisa menghitungnya menggunakan wadah (containers) atau satuan ukuran (units). Ini adalah cara kita memberikan batasan pada benda yang bersifat massa agar bisa dikuantifikasi secara logis.\n\nContohnya, alih-alih mencoba menghitung air, kita menghitung botolnya ("a bottle of water") atau gelasnya ("a glass of water"). Teknik ini sangat berguna dalam konteks belanja, memasak, dan memberikan instruksi teknis yang memerlukan presisi jumlah.',
        formula: 'A [Container/Unit] of [Uncountable Noun]',
        exceptions: 'Gunakan "A piece of" untuk benda abstrak seperti: A piece of advice, A piece of news.',
        examples: [
          { text: 'A cup of tea, please.', isCorrect: true, translation: 'Tolong satu cangkir teh.' },
          { text: 'I bought two bags of sugar.', isCorrect: true, translation: 'Saya membeli dua kantong gula.' },
          { text: 'Give me a piece of advice.', isCorrect: true, translation: 'Berikan saya satu nasihat.' },
          { text: 'We need three liters of oil.', isCorrect: true, translation: 'Kita butuh tiga liter minyak.' },
          { text: 'She ate a bowl of soup.', isCorrect: true, translation: 'Dia makan semangkuk sup.' }
        ]
      },
      {
        heading: '5. Etika Konsumsi: Menghargai Rezeki',
        content: 'Dalam Islam, pemahaman tentang kuantitas benda berkaitan erat dengan adab konsumsi, yaitu larangan berlebih-lebihan (Israf). Menggunakan quantifiers yang tepat saat mendeskripsikan makanan atau rezeki membantu kita mengekspresikan rasa cukup (Qanaah).\n\nKetepatan bahasa dalam menyebutkan jumlah rezeki juga merupakan bentuk syukur. Dengan mengatakan "I have enough food" daripada mengeluh tentang jumlahnya, kita mempraktikkan kesantunan dalam menerima pemberian Allah. Bahasa yang akurat membantu kita mengelola amanah harta dengan lebih bijaksana.',
        formula: 'Quantity + Gratitude',
        exceptions: 'Kedermawanan seringkali diekspresikan dengan memberikan "much" atau "many" bantuan kepada yang membutuhkan.',
        examples: [
          { text: 'We should not waste food.', isCorrect: true, translation: 'Kita sebaiknya tidak membuang-buang makanan.' },
          { text: 'Give some charity to the poor.', isCorrect: true, translation: 'Berikan sedekah kepada orang miskin.' },
          { text: 'A little gratitude goes a long way.', isCorrect: true, translation: 'Sedikit rasa syukur memberikan dampak yang besar.' },
          { text: 'Share your bread with others.', isCorrect: true, translation: 'Bagikan rotimu dengan orang lain.' },
          { text: 'Avoid having too many worldly desires.', isCorrect: true, translation: 'Hindari memiliki terlalu banyak keinginan duniawi.' }
        ]
      }
    ],
    mindmap: {
      id: 'a2-count-root', label: 'NOUN TYPES', type: 'root', children: [
        { id: 'c', label: 'Countable', type: 'main', children: [
          { id: 'cp', label: 'Plural: +S/ES', type: 'sub' },
          { id: 'cm', label: 'Many / A few', type: 'formula' }
        ]},
        { id: 'u', label: 'Uncountable', type: 'main', children: [
          { id: 'up', label: 'No Plural form', type: 'sub' },
          { id: 'um', label: 'Much / A little', type: 'formula' },
          { id: 'unit', label: 'Use Units (Bottle/Cup)', type: 'formula' }
        ]}
      ]
    }
  },
  {
    id: 'a2-comparatives',
    title: '3. Comparatives & Superlatives',
    level: 'A2',
    icon: 'fa-balance-scale',
    description: 'Seni membandingkan dua hal atau lebih untuk menentukan kualitas terbaik dan perbedaan karakteristik.',
    sections: [
      {
        heading: '1. Comparatives: Membandingkan Dua Hal',
        content: 'Comparative degree digunakan untuk membandingkan perbedaan antara dua objek. Kita menggunakan akhiran "-er" untuk kata sifat pendek (seperti *smaller*) atau kata "more" untuk kata sifat panjang (seperti *more beautiful*). Kata kuncinya adalah penggunaan "THAN" setelah kata sifat tersebut.\n\nKemampuan membandingkan sangat krusial dalam pengambilan keputusan. Alih-alih hanya menyebutkan sifat satu benda, Anda bisa memberikan perspektif yang lebih luas dengan membandingkannya. Ini membantu pendengar memahami posisi relatif suatu benda terhadap benda lainnya dalam hal ukuran, harga, atau kualitas.',
        formula: 'Short Adj + er + Than | More + Long Adj + Than',
        exceptions: 'Hati-hati dengan kata sifat berakhiran "y", ganti "y" menjadi "i" lalu tambah "er" (Happy -> Happier).',
        examples: [
          { text: 'This book is bigger than that one.', isCorrect: true, translation: 'Buku ini lebih besar daripada buku yang itu.' },
          { text: 'He is more patient than his brother.', isCorrect: true, translation: 'Dia lebih sabar daripada saudara laki-lakinya.' },
          { text: 'My house is closer to the mosque than yours.', isCorrect: true, translation: 'Rumah saya lebih dekat ke masjid daripada rumahmu.' },
          { text: 'Learning English is easier than I thought.', isCorrect: true, translation: 'Belajar bahasa Inggris lebih mudah daripada yang saya kira.' },
          { text: 'Today is colder than yesterday.', isCorrect: true, translation: 'Hari ini lebih dingin daripada kemarin.' }
        ]
      },
      {
        heading: '2. Superlatives: Yang Teratas di Kelompoknya',
        content: 'Superlative degree digunakan untuk menunjukkan objek yang memiliki tingkat kualitas tertinggi atau terendah dalam sebuah kelompok (minimal 3 hal). Kita menggunakan akhiran "-est" untuk kata sifat pendek atau "the most" untuk kata sifat panjang. Jangan lupa sertakan artikel "THE" sebelum kata sifat superlative.\n\nSuperlative membantu kita mengidentifikasi nilai ekstrem. Dalam sejarah atau geografi, ini sering digunakan untuk menyebutkan "yang terbesar", "yang tertua", atau "yang terbaik". Penguasaan bentuk ini memberikan kekuatan deskripsi yang sangat kuat pada narasi Anda karena menunjukkan hasil seleksi akhir.',
        formula: 'The + Short Adj + est | The Most + Long Adj',
        exceptions: 'Sama seperti comparative, akhiran "y" berubah menjadi "iest" (The Happiest).',
        examples: [
          { text: 'He is the tallest student in class.', isCorrect: true, translation: 'Dia adalah siswa paling tinggi di kelas.' },
          { text: 'This is the most interesting story.', isCorrect: true, translation: 'Ini adalah cerita yang paling menarik.' },
          { text: 'The Prophet PBUH is the best role model.', isCorrect: true, translation: 'Nabi SAW adalah panutan yang terbaik.' },
          { text: 'It was the happiest day of my life.', isCorrect: true, translation: 'Itu adalah hari paling bahagia dalam hidup saya.' },
          { text: 'Mount Everest is the highest mountain.', isCorrect: true, translation: 'Gunung Everest adalah gunung paling tinggi.' }
        ]
      },
      {
        heading: '3. Perubahan Ejaan dan Aturan Suku Kata',
        content: 'Dalam membentuk comparative dan superlative, jumlah suku kata menentukan rumusnya. Kata dengan 1 suku kata biasanya ditambah -er/-est. Kata dengan 3 suku kata atau lebih wajib menggunakan more/most. Untuk kata dengan 2 suku kata, ada yang fleksibel namun mayoritas kata berakhiran -y berubah menjadi -ier/-iest.\n\nAda juga aturan "CVC" (Consonant-Vowel-Consonant) di mana huruf terakhir harus didobel sebelum ditambah akhiran (seperti *Big* menjadi *Bigger*). Ketelitian dalam ejaan ini mencerminkan profesionalitas Anda dalam menulis. Meskipun terdengar teknis, pola ini akan terasa alami seiring dengan banyaknya latihan membaca.',
        formula: '1 Syllable: +er/est | 3+ Syllables: More/Most',
        exceptions: 'Kata seperti "Fun" tidak mengikuti aturan -er (bukan "funner" tapi "more fun").',
        examples: [
          { text: 'Happy -> Happier -> Happiest', isCorrect: true, translation: 'Bahagia -> Lebih bahagia -> Paling bahagia' },
          { text: 'Hot -> Hotter -> Hottest', isCorrect: true, translation: 'Panas -> Lebih panas -> Paling panas' },
          { text: 'Modern -> More modern -> Most modern', isCorrect: true, translation: 'Modern -> Lebih modern -> Paling modern' },
          { text: 'Bad -> Worse -> Worst', isCorrect: true, note: 'Irregular.', translation: 'Buruk -> Lebih buruk -> Paling buruk' },
          { text: 'Good -> Better -> Best', isCorrect: true, note: 'Irregular.', translation: 'Baik -> Lebih baik -> Terbaik' }
        ]
      },
      {
        heading: '4. Kesalahan Umum: Double Comparison',
        content: 'Kesalahan paling sering bagi pembelajar adalah menggunakan "Double Comparison", seperti berkata "more bigger" atau "most tallest". Dalam bahasa Inggris, Anda harus memilih salah satu: gunakan akhiran (-er/-est) ATAU gunakan kata bantu (more/most). Jangan gunakan keduanya sekaligus.\n\nHal ini sering terjadi karena pengaruh bahasa ibu atau keinginan untuk menekankan makna. Namun, secara gramatikal ini dianggap salah total. Ingatlah: jika kata sifatnya pendek, ia sudah cukup kuat dengan akhirannya sendiri. Jika panjang, ia butuh pengawal "more/most" di depannya tanpa mengubah dirinya sendiri.',
        formula: 'One marker only (er OR more)',
        exceptions: 'Hindari penggunaan "more" untuk kata yang sudah berakhiran "er".',
        examples: [
          { text: 'He is more tall than me.', isCorrect: false, note: 'Correct: taller than.', translation: '(Salah) Dia lebih tinggi dari saya.' },
          { text: 'She is the most smartest.', isCorrect: false, note: 'Correct: the smartest.', translation: '(Salah) Dia paling pintar.' },
          { text: 'This is more expensive than that.', isCorrect: true, translation: 'Ini lebih mahal daripada itu.' },
          { text: 'I am better today.', isCorrect: true, translation: 'Saya merasa lebih baik hari ini.' },
          { text: 'The cat is smaller than the dog.', isCorrect: true, translation: 'Kucing itu lebih kecil daripada anjing itu.' }
        ]
      },
      {
        heading: '5. Etika Perbandingan: Menjaga Hati',
        content: 'Dalam Adab Islami, membandingkan diri dengan orang lain dalam hal duniawi seringkali berujung pada hasad (iri) atau kesombongan. Namun, membandingkan dalam hal kebaikan (Fastabiqul Khairat) sangat dianjurkan. Gunakan tenses ini untuk memotivasi diri menjadi lebih baik dari hari kemarin.\n\nSaat membandingkan orang, pilihlah kata-kata yang tetap menjaga martabat. Alih-alih fokus pada kekurangan, gunakan perbandingan untuk menonjolkan kelebihan. "He is more diligent" terdengar lebih baik daripada merendahkan orang lain. Bahasa adalah alat untuk membangun, bukan untuk menjatuhkan.',
        formula: 'Positive Comparison + Fastabiqul Khairat',
        exceptions: 'Berhati-hatilah dengan superlative "The Best" agar tidak menimbulkan rasa ujub (bangga diri berlebihan).',
        examples: [
          { text: 'Be better than you were yesterday.', isCorrect: true, translation: 'Jadilah lebih baik daripada kamu yang kemarin.' },
          { text: 'He is the most generous person I know.', isCorrect: true, translation: 'Dia adalah orang paling murah hati yang saya kenal.' },
          { text: 'Seek the best reward in Jannah.', isCorrect: true, translation: 'Carilah pahala terbaik di Surga.' },
          { text: 'Wisdom is more valuable than gold.', isCorrect: true, translation: 'Kebijaksanaan lebih berharga daripada emas.' },
          { text: 'They are the most patient believers.', isCorrect: true, translation: 'Mereka adalah orang-orang beriman yang paling sabar.' }
        ]
      }
    ],
    mindmap: {
      id: 'a2-comp-root', label: 'COMPARISON', type: 'root', children: [
        { id: 'c1', label: 'Comparative (2 things)', type: 'main', children: [
          { id: 'er', label: 'Short: +ER + THAN', type: 'formula' },
          { id: 'mr', label: 'Long: MORE + ADJ + THAN', type: 'formula' }
        ]},
        { id: 's1', label: 'Superlative (3+ things)', type: 'main', children: [
          { id: 'est', label: 'Short: THE + EST', type: 'formula' },
          { id: 'mst', label: 'Long: THE MOST + ADJ', type: 'formula' }
        ]},
        { id: 'ir', label: 'Irregulars', type: 'warning', detail: 'Good/Better/Best, Bad/Worse/Worst' }
      ]
    }
  },
  {
    id: 'a2-future',
    title: '4. Future Forms: Will vs Going to',
    level: 'A2',
    icon: 'fa-calendar-alt',
    description: 'Mengomunikasikan rencana, janji, dan prediksi masa depan dengan pilihan kata yang tepat.',
    sections: [
      {
        heading: '1. Will: Keputusan Spontan dan Janji',
        content: '"Will" digunakan untuk keputusan yang dibuat tepat saat kita berbicara (spontan), janji, atau fakta masa depan yang pasti terjadi. Bayangkan Anda sedang duduk dan tiba-tiba haus, Anda akan berkata "I will drink".\n\nDalam konteks sosial, "Will" adalah kata kunci untuk komitmen. Mengatakan "I will help you" memberikan kesan kesigapan. Karena sifatnya yang fleksibel, "Will" sering digunakan dalam percakapan cepat di mana rencana belum disusun secara matang namun niat sudah ada di hati.',
        formula: 'Subject + Will + Verb 1',
        exceptions: 'Meskipun di sekolah sering diajarkan "Shall" untuk I/We, dalam percakapan modern "Will" sudah digunakan untuk semua subjek.',
        examples: [
          { text: 'I will call you later.', isCorrect: true, note: 'Janji.', translation: 'Saya akan meneleponmu nanti.' },
          { text: 'It will rain tomorrow.', isCorrect: true, note: 'Prediksi umum.', translation: 'Besok akan hujan.' },
          { text: 'Wait, I will open the door for you.', isCorrect: true, note: 'Keputusan spontan.', translation: 'Tunggu, saya akan membukakan pintu untukmu.' },
          { text: 'They will arrive at 5 PM.', isCorrect: true, note: 'Fakta jadwal.', translation: 'Mereka akan sampai jam 5 sore.' },
          { text: 'I will never leave you alone.', isCorrect: true, note: 'Komitmen.', translation: 'Saya tidak akan pernah meninggalkanmu sendirian.' }
        ]
      },
      {
        heading: '2. Going To: Rencana yang Sudah Matang',
        content: '"Going to" digunakan untuk rencana atau niat yang sudah dipikirkan SEBELUM waktu bicara. Ada elemen persiapan di sini. Misalnya, jika Anda sudah membeli tiket, Anda berkata "I am going to travel".\n\nSelain rencana, "Going to" juga digunakan untuk prediksi berdasarkan bukti yang terlihat saat ini (evidence). Contohnya, melihat awan hitam pekat, Anda berkata "It is going to rain". Penggunaan bentuk ini menunjukkan bahwa Anda adalah orang yang terencana dan memperhatikan tanda-tanda di sekitar Anda.',
        formula: 'Subject + To Be + Going to + Verb 1',
        exceptions: 'Dalam bahasa lisan, sering terdengar "Gonna", namun jangan tulis ini dalam dokumen formal.',
        examples: [
          { text: 'I am going to visit Mecca next month.', isCorrect: true, note: 'Rencana matang.', translation: 'Saya berencana mengunjungi Mekkah bulan depan.' },
          { text: 'Look at the clouds! It is going to rain.', isCorrect: true, note: 'Bukti fisik.', translation: 'Lihat awan itu! Akan segera turun hujan.' },
          { text: 'We are going to have dinner at 8.', isCorrect: true, translation: 'Kami akan makan malam jam 8.' },
          { text: 'She is going to study medicine.', isCorrect: true, note: 'Ambisi/Niat.', translation: 'Dia berencana belajar kedokteran.' },
          { text: 'Are they going to join the class?', isCorrect: true, translation: 'Apakah mereka akan bergabung di kelas?' }
        ]
      },
      {
        heading: '3. Kontraksi dan Pengucapan Cepat',
        content: 'Dalam percakapan sehari-hari, "Will" sering disingkat menjadi "\'ll" (seperti I\'ll, You\'ll, They\'ll). Sedangkan "Going to" sering terdengar seperti "Gonna" dalam bahasa gaul (slang). Namun, "Gonna" tidak boleh digunakan dalam tulisan formal.\n\nMemahami kontraksi ini sangat membantu kemampuan mendengarkan (listening) Anda. Penutur asli jarang mengucapkan "I will" secara terpisah kecuali untuk penekanan. Latihlah lidah Anda untuk mengucapkan "\'ll" dengan halus agar aliran bicara Anda terasa lebih natural dan tidak kaku.',
        formula: 'I will -> I\'ll | We will -> We\'ll',
        exceptions: 'Kontraksi negatif "Will not" menjadi "Won\'t" (bukan "willn\'t").',
        examples: [
          { text: 'I\'ll be there in five minutes.', isCorrect: true, translation: 'Saya akan sampai di sana dalam lima menit.' },
          { text: 'He\'ll help us with the bags.', isCorrect: true, translation: 'Dia akan membantu kita membawa tas-tas itu.' },
          { text: 'They\'ll come to the event.', isCorrect: true, translation: 'Mereka akan datang ke acara itu.' },
          { text: 'We\'ll see what happens.', isCorrect: true, translation: 'Kita lihat saja apa yang akan terjadi.' },
          { text: 'She\'ll love this gift.', isCorrect: true, translation: 'Dia akan menyukai hadiah ini.' }
        ]
      },
      {
        heading: '4. Kalimat Negatif dan Tanya Masa Depan',
        content: 'Bentuk negatif dari "Will" adalah "Will not" yang hampir selalu disingkat menjadi "WON\'T". Untuk "Going to", kita cukup menambahkan "not" setelah To Be (am/is/are not going to). Perbedaan tipis ini harus dikuasai agar tidak terjadi salah paham tentang pembatalan rencana.\n\nDalam kalimat tanya, kita melakukan inversi. "Will you...?" digunakan untuk meminta bantuan atau menanyakan janji. "Are you going to...?" digunakan untuk menanyakan rencana seseorang. Memilih pertanyaan yang tepat menunjukkan kepekaan Anda terhadap status rencana lawan bicara.',
        formula: 'Will not -> Won\'t | Be + Not + Going to',
        exceptions: 'Inversi subjek dan kata bantu tetap berlaku (Will you...? / Are you going to...?).',
        examples: [
          { text: 'I won\'t (will not) forget your kindness.', isCorrect: true, translation: 'Saya tidak akan melupakan kebaikanmu.' },
          { text: 'She isn\'t going to attend the meeting.', isCorrect: true, translation: 'Dia tidak akan menghadiri pertemuan itu.' },
          { text: 'Will you marry me?', isCorrect: true, translation: 'Maukah kamu menikah denganku?' },
          { text: 'Are you going to pray at the mosque?', isCorrect: true, translation: 'Apakah kamu akan shalat di masjid?' },
          { text: 'They won\'t be late this time.', isCorrect: true, translation: 'Mereka tidak akan terlambat kali ini.' }
        ]
      },
      {
        heading: '5. Etika Niat: Menjaga Janji dan InshaAllah',
        content: 'Bagi seorang Muslim, masa depan adalah rahasia Allah. Saat menggunakan tenses masa depan, sangat dianjurkan untuk menyertainya dengan kalimat "InshaAllah" (Jika Allah mengizinkan). Secara tata bahasa Inggris, ini bisa diselipkan di awal atau akhir kalimat sebagai bentuk tawakkal.\n\nMenjaga janji ("Will") adalah tanda orang beriman. Gunakan "Will" hanya jika Anda benar-benar berniat menepati kata-kata Anda. Bahasa bukan sekadar alat komunikasi, tapi juga cerminan integritas karakter Anda dalam merencanakan hari esok di bawah ridha-Nya.',
        formula: 'Future Intent + InshaAllah',
        exceptions: 'Hati-hati jangan menggunakan "InshaAllah" sebagai alasan untuk malas atau sengaja tidak menepati janji.',
        examples: [
          { text: 'InshaAllah, I will finish it today.', isCorrect: true, translation: 'Insya Allah, saya akan menyelesaikannya hari ini.' },
          { text: 'I am going to start my fasting tomorrow, InshaAllah.', isCorrect: true, translation: 'Saya berencana mulai berpuasa besok, Insya Allah.' },
          { text: 'We will meet again, InshaAllah.', isCorrect: true, translation: 'Kita akan bertemu lagi, Insya Allah.' },
          { text: 'He will be a great leader, InshaAllah.', isCorrect: true, translation: 'Dia akan menjadi pemimpin besar, Insya Allah.' },
          { text: 'InshaAllah, they will arrive safely.', isCorrect: true, translation: 'Insya Allah, mereka akan sampai dengan selamat.' }
        ]
      }
    ],
    mindmap: {
      id: 'a2-fut-root', label: 'FUTURE FORMS', type: 'root', children: [
        { id: 'will', label: 'WILL (Spontaneous)', type: 'main', children: [
          { id: 'w1', label: 'Decisions / Promises', type: 'sub' },
          { id: 'w2', label: 'Neg: Won\'t', type: 'formula' }
        ]},
        { id: 'gt', label: 'GOING TO (Planned)', type: 'main', children: [
          { id: 'g1', label: 'Plans / Evidence', type: 'sub' },
          { id: 'g2', label: 'Struct: Be + Going to + V1', type: 'formula' }
        ]},
        { id: 'ad', label: 'Adab', type: 'warning', detail: 'Always add "InshaAllah" for future plans.' }
      ]
    }
  },
  {
    id: 'a2-adverbs-freq',
    title: '5. Adverbs of Frequency',
    level: 'A2',
    icon: 'fa-redo',
    description: 'Menjelaskan seberapa sering Anda melakukan suatu aktivitas untuk membangun profil rutinitas yang jelas.',
    sections: [
      {
        heading: '1. Skala Intensitas: Dari Always ke Never',
        content: 'Adverbs of frequency adalah kata keterangan yang menunjukkan tingkat keseringan sebuah aksi. Skalanya dimulai dari 100% (*Always*), menurun ke *Usually* (90%), *Often* (70%), *Sometimes* (50%), *Rarely/Seldom* (10%), hingga 0% (*Never*).\n\nMenggunakan skala ini membantu Anda memberikan informasi yang akurat tentang gaya hidup Anda. Alih-alih hanya berkata "Saya shalat", menggunakan "I always pray" memberikan gambaran tentang komitmen dan konsistensi Anda. Ketepatan dalam memilih kata keterangan ini sangat membantu orang lain memahami karakter dan disiplin diri Anda.',
        formula: '100%: Always -> 70%: Often -> 50%: Sometimes -> 0%: Never',
        exceptions: 'Beberapa kata keterangan negatif (Rarely, Never) tidak boleh digabung dengan kalimat negatif (Double Negative).',
        examples: [
          { text: 'I always wake up early.', isCorrect: true, translation: 'Saya selalu bangun pagi.' },
          { text: 'He usually drinks honey in the morning.', isCorrect: true, translation: 'Dia biasanya minum madu di pagi hari.' },
          { text: 'We often visit our grandparents.', isCorrect: true, translation: 'Kami sering mengunjungi kakek-nenek kami.' },
          { text: 'They sometimes play football on Sundays.', isCorrect: true, translation: 'Mereka terkadang bermain bola di hari Minggu.' },
          { text: 'She never tells a lie.', isCorrect: true, translation: 'Dia tidak pernah berbohong.' }
        ]
      },
      {
        heading: '2. Aturan Posisi: Sebelum Kata Kerja Utama',
        content: 'Dalam kalimat standar, posisi adverbs of frequency adalah SEBELUM kata kerja utama (Main Verb). Misalnya: "I *always* read". Namun, jika kalimat tersebut menggunakan "To Be" (am, is, are), maka posisi kata keterangan ini berubah menjadi SETELAH To Be. Contohnya: "I am *always* happy".\n\nKesalahan penempatan posisi ini sangat sering terjadi. Banyak pembelajar berkata "Always I go" atau "I am often happy" (benar) vs "Often I am happy" (kurang alami). Membiasakan posisi yang benar akan membuat kalimat Anda terdengar lebih terstruktur dan sesuai dengan pola pikir penutur asli.',
        formula: 'Subject + Adverb + Verb | Subject + To Be + Adverb',
        exceptions: 'Kata "Sometimes" dan "Usually" bisa diletakkan di awal kalimat untuk penekanan, tapi "Always" dan "Never" tidak bisa.',
        examples: [
          { text: 'I always help my mother.', isCorrect: true, note: 'Before main verb.', translation: 'Saya selalu membantu ibu saya.' },
          { text: 'She is never late.', isCorrect: true, note: 'After To Be.', translation: 'Dia tidak pernah terlambat.' },
          { text: 'They usually arrive on time.', isCorrect: true, translation: 'Mereka biasanya datang tepat waktu.' },
          { text: 'We are sometimes tired after work.', isCorrect: true, translation: 'Kami terkadang lelah setelah bekerja.' },
          { text: 'He often speaks Arabic at home.', isCorrect: true, translation: 'Dia sering bicara bahasa Arab di rumah.' }
        ]
      },
      {
        heading: '3. Adverbials Lain: Every day, Once a week',
        content: 'Selain satu kata seperti *always*, kita juga bisa menggunakan frasa keterangan waktu yang lebih spesifik seperti "Every day", "Once a month", atau "Twice a year". Berbeda dengan adverbs tunggal, frasa ini biasanya diletakkan di PALING AKHIR atau PALING AWAL kalimat.\n\nPenggunaan frasa ini memberikan detail kuantitas yang lebih pasti. "I pray always" kurang tepat secara struktur, namun "I pray every day" sangat sempurna. Kombinasi antara adverbs tunggal dan frasa ini akan membuat deskripsi rutinitas Anda menjadi sangat kaya dan informatif bagi pendengar.',
        formula: 'Noun + Frequency Phrase (at the end)',
        exceptions: 'Jangan gunakan "Every" bersamaan dengan kata keterangan frekuensi tunggal dalam satu aksi yang sama (misal: I always pray every day - mubazir).',
        examples: [
          { text: 'I read the Quran every day.', isCorrect: true, translation: 'Saya membaca Al-Quran setiap hari.' },
          { text: 'We fast twice a week.', isCorrect: true, translation: 'Kita berpuasa dua kali seminggu.' },
          { text: 'He goes to the gym three times a month.', isCorrect: true, translation: 'Dia pergi ke gym tiga kali sebulan.' },
          { text: 'Every morning, I drink water.', isCorrect: true, translation: 'Setiap pagi, saya minum air.' },
          { text: 'They travel once a year.', isCorrect: true, translation: 'Mereka bepergian setahun sekali.' }
        ]
      },
      {
        heading: '4. Bertanya tentang Frekuensi: How Often',
        content: 'Untuk menanyakan seberapa sering seseorang melakukan sesuatu, kita menggunakan kata tanya "How often". Struktur kalimatnya mengikuti pola Present Simple: "How often + do/does + subjek + kata kerja?".\n\nPertanyaan ini adalah pembuka percakapan yang sangat bagus untuk mengenal hobi atau kebiasaan orang lain. Jawaban untuk pertanyaan ini bisa berupa adverbs tunggal (Always, Often) atau frasa waktu (Every day). Menguasai pola tanya-jawab ini akan membuat interaksi sosial Anda terasa lebih dinamis dan mengalir.',
        formula: 'How often + Do/Does + Subject + Verb 1?',
        exceptions: 'Ingatlah untuk menggunakan "Does" untuk subjek He/She/It.',
        examples: [
          { text: 'How often do you pray at the mosque?', isCorrect: true, translation: 'Seberapa sering kamu shalat di masjid?' },
          { text: 'How often does she study English?', isCorrect: true, translation: 'Seberapa sering dia belajar bahasa Inggris?' },
          { text: 'How often do they eat out?', isCorrect: true, translation: 'Seberapa sering mereka makan di luar?' },
          { text: 'How often do we have meetings?', isCorrect: true, translation: 'Seberapa sering kita mengadakan rapat?' },
          { text: 'How often do you read books?', isCorrect: true, translation: 'Seberapa sering kamu membaca buku?' }
        ]
      },
      {
        heading: '5. Konteks Istiqomah: Membangun Kebiasaan Baik',
        content: 'Dalam Islam, amal yang paling dicintai Allah adalah yang dilakukan secara konsisten (*Istiqomah*) meskipun sedikit. Adverbs of frequency seperti "Always" dan "Usually" mencerminkan nilai disiplin spiritual ini. Mengatakan "I always start with Bismillah" menunjukkan jati diri seorang Muslim.\n\nTenses ini membantu kita mengevaluasi diri (Muhasabah). Apakah kita "Often" melakukan kebaikan atau "Rarely"? Dengan menggunakan bahasa yang benar, kita belajar untuk jujur pada diri sendiri tentang kualitas rutinitas harian kita dan berusaha meningkatkan frekuensi amal shalih di masa depan.',
        formula: 'Routine + Consistency (Istiqomah)',
        exceptions: 'Menggunakan "Never" untuk hal-hal negatif (seperti berbohong) adalah bagian dari menjaga akhlak mahmudah.',
        examples: [
          { text: 'A good Muslim always speaks the truth.', isCorrect: true, translation: 'Muslim yang baik selalu berkata benar.' },
          { text: 'I usually give charity on Fridays.', isCorrect: true, translation: 'Saya biasanya bersedekah di hari Jumat.' },
          { text: 'They never forget their prayers.', isCorrect: true, translation: 'Mereka tidak pernah melupakan shalat mereka.' },
          { text: 'She often recites the Quran after Subuh.', isCorrect: true, translation: 'Dia sering membaca Al-Quran setelah Subuh.' },
          { text: 'We always respect our teachers.', isCorrect: true, translation: 'Kami selalu menghormati guru-guru kami.' }
        ]
      }
    ],
    mindmap: {
      id: 'a2-adv-root', label: 'FREQUENCY', type: 'root', children: [
        { id: 'scale', label: 'The Scale', type: 'main', children: [
          { id: '100', label: 'Always (100%)', type: 'sub' },
          { id: '50', label: 'Sometimes (50%)', type: 'sub' },
          { id: '0', label: 'Never (0%)', type: 'sub' }
        ]},
        { id: 'pos', label: 'Positioning', type: 'main', children: [
          { id: 'v', label: 'Before Action Verb', type: 'formula' },
          { id: 'b', label: 'After To Be', type: 'formula' }
        ]},
        { id: 'q', label: 'Question: How Often?', type: 'sub' }
      ]
    }
  },
  {
    id: 'a2-modals',
    title: '6. Modal Verbs: Advice & Obligation',
    level: 'A2',
    icon: 'fa-shield-alt',
    description: 'Menggunakan Should, Must, dan Have to untuk memberikan saran, aturan, dan menunjukkan keharusan.',
    sections: [
      {
        heading: '1. Should: Memberikan Saran yang Santun',
        content: '"Should" digunakan untuk memberikan rekomendasi atau saran (advice). Ini bukan sebuah perintah yang memaksa, melainkan pendapat tentang apa yang dianggap baik atau benar untuk dilakukan. Bentuk negatifnya adalah "Shouldn\'t" untuk melarang sesuatu secara halus.\n\nMenggunakan "Should" menunjukkan empati dan kepedulian Anda terhadap orang lain. Dalam percakapan, ini adalah cara paling sopan untuk membantu seseorang memecahkan masalah tanpa terkesan menggurui. "You should rest" terdengar jauh lebih hangat daripada "Rest!".',
        formula: 'Subject + Should + Verb 1',
        exceptions: 'Jangan gunakan "Should to" (salah). Langsung gunakan kata kerja setelah should.',
        examples: [
          { text: 'You should drink more water.', isCorrect: true, translation: 'Kamu sebaiknya minum lebih banyak air.' },
          { text: 'He should study harder for the exam.', isCorrect: true, translation: 'Dia sebaiknya belajar lebih keras untuk ujian.' },
          { text: 'You shouldn\'t eat too much sugar.', isCorrect: true, translation: 'Kamu sebaiknya tidak makan terlalu banyak gula.' },
          { text: 'Should I wear a jacket today?', isCorrect: true, translation: 'Haruskah saya memakai jaket hari ini?' },
          { text: 'We should be kind to everyone.', isCorrect: true, translation: 'Kita sebaiknya berbuat baik kepada semua orang.' }
        ]
      },
      {
        heading: '2. Must: Keharusan Mutlak dan Aturan',
        content: '"Must" digunakan untuk mengekspresikan kewajiban yang sangat kuat, seringkali datang dari otoritas luar (hukum, aturan agama) atau keinginan mendalam dari diri sendiri. Dalam bentuk negatif, "Mustn\'t" berarti LARANGAN KERAS yang tidak boleh dilanggar.\n\n"Must" memberikan kesan urgensi dan otoritas. Kita menggunakannya untuk hal-hal yang bersifat kritis atau prinsip hidup yang tidak bisa dinegosiasikan. Memahami penggunaan "Must" membantu Anda memahami batasan-batasan penting dalam instruksi keamanan atau hukum dasar.',
        formula: 'Subject + Must + Verb 1',
        exceptions: '"Mustn\'t" (larangan) sangat berbeda dengan "Don\'t have to" (tidak perlu).',
        examples: [
          { text: 'You must stop when the light is red.', isCorrect: true, translation: 'Kamu harus berhenti ketika lampu berwarna merah.' },
          { text: 'Muslims must pray five times a day.', isCorrect: true, translation: 'Muslim wajib shalat lima kali sehari.' },
          { text: 'I must finish this work tonight.', isCorrect: true, translation: 'Saya harus menyelesaikan pekerjaan ini malam ini.' },
          { text: 'You mustn\'t smoke in the hospital.', isCorrect: true, translation: 'Kamu dilarang merokok di rumah sakit.' },
          { text: 'We must respect our parents.', isCorrect: true, translation: 'Kita harus menghormati orang tua kita.' }
        ]
      },
      {
        heading: '3. Have To: Keharusan karena Situasi',
        content: '"Have to" sering disamakan dengan "Must", namun ada perbedaan halus: "Have to" biasanya merujuk pada kewajiban yang muncul karena situasi atau aturan eksternal yang bukan kita buat sendiri. Misalnya, aturan kantor atau jadwal kereta.\n\nSatu hal krusial yang harus diingat: bentuk negatif "Don\'t have to" TIDAK BERARTI LARANGAN, melainkan TIDAK PERLU (opsional). Ini sangat berbeda dengan "Mustn\'t". Jika Anda berkata "You don\'t have to come", artinya Anda boleh datang tapi tidak wajib. Jangan sampai tertukar dalam memberikan kelonggaran ini.',
        formula: 'Subject + Have to/Has to + Verb 1',
        exceptions: 'Gunakan "Has to" untuk subjek tunggal (He, She, It).',
        examples: [
          { text: 'I have to wear a uniform at school.', isCorrect: true, translation: 'Saya harus memakai seragam di sekolah.' },
          { text: 'Does she have to work on Sundays?', isCorrect: true, translation: 'Apakah dia harus bekerja pada hari Minggu?' },
          { text: 'You don\'t have to pay now; it\'s free.', isCorrect: true, note: 'Tidak perlu (opsional).', translation: 'Kamu tidak perlu membayar sekarang; ini gratis.' },
          { text: 'We have to arrive early for the flight.', isCorrect: true, translation: 'Kita harus datang lebih awal untuk penerbangan itu.' },
          { text: 'He has to take medicine twice a day.', isCorrect: true, translation: 'Dia harus minum obat dua kali sehari.' }
        ]
      },
      {
        heading: '4. Aturan Tanpa "S" dan Tanpa "TO"',
        content: 'Modal verbs (Should, Must) memiliki keunikan: mereka tidak pernah berubah bentuk. Tidak ada tambahan "S" untuk subjek tunggal, tidak ada bentuk "-ing", dan tidak ada bentuk masa lalu. Selain itu, setelah modal verb, kata kerja berikutnya WAJIB bentuk dasar tanpa "TO" (kecuali have to).\n\nBanyak pembelajar melakukan kesalahan seperti "He musts go" atau "I should to study". Ini salah. Polanya sangat simpel: **Subject + Modal + Verb 1**. Kemudahan aturan ini seharusnya membuat Anda lebih percaya diri dalam menyusun kalimat saran dan kewajiban dengan cepat.',
        formula: 'Subject + Modal + Base Verb',
        exceptions: 'Aturan ini tidak berlaku untuk "Have to" karena "Have" adalah kata kerja bantu yang bisa berubah menjadi "Has" atau "Had".',
        examples: [
          { text: 'She should study.', isCorrect: true, note: 'Bukan "shoulds".', translation: 'Dia sebaiknya belajar.' },
          { text: 'They must arrive.', isCorrect: true, note: 'Bukan "must to arrive".', translation: 'Mereka harus sampai.' },
          { text: 'He must listen carefully.', isCorrect: true, translation: 'Dia harus mendengarkan dengan saksama.' },
          { text: 'You should go now.', isCorrect: true, translation: 'Kamu sebaiknya pergi sekarang.' },
          { text: 'We must help the poor.', isCorrect: true, translation: 'Kita harus membantu orang miskin.' }
        ]
      },
      {
        heading: '5. Konteks Nasihat: Saling Menasehati dalam Kebenaran',
        content: 'Dalam Islam, memberi nasihat (Tashiyah) adalah bagian dari ukhuwwah. Menggunakan "Should" dengan nada yang lembut mencerminkan adab dalam berdakwah dan membimbing saudara. Kita diajarkan untuk memberi saran dengan cara yang paling baik (*Mauidzatul Hasanah*).\n\nSedangkan "Must" dan "Have to" digunakan untuk menegakkan pilar-pilar iman dan aturan syariat. Bahasa yang tepat membantu kita membedakan mana yang merupakan anjuran (Sunnah/Advice) dan mana yang merupakan kewajiban (Wajib/Obligation). Gunakanlah modal ini untuk saling mengingatkan dalam kebaikan dan kesabaran.',
        formula: 'Modal of Advice + Wisdom',
        exceptions: 'Gunakan "Should" untuk saran sunnah dan "Must" untuk perintah wajib syar\'i.',
        examples: [
          { text: 'We should always forgive others.', isCorrect: true, translation: 'Kita sebaiknya selalu memaafkan orang lain.' },
          { text: 'You must be honest in business.', isCorrect: true, translation: 'Kamu harus jujur dalam berbisnis.' },
          { text: 'We should speak only good words.', isCorrect: true, translation: 'Kita sebaiknya hanya mengucapkan kata-kata yang baik.' },
          { text: 'A student must respect the teacher.', isCorrect: true, translation: 'Seorang siswa wajib menghormati guru.' },
          { text: 'You don\'t have to worry, Allah is with us.', isCorrect: true, translation: 'Kamu tidak perlu khawatir, Allah bersama kita.' }
        ]
      }
    ],
    mindmap: {
      id: 'a2-mod-root', label: 'MODAL VERBS', type: 'root', children: [
        { id: 'adv', label: 'Advice (Should)', type: 'main', children: [
          { id: 's1', label: 'Should: Recommendation', type: 'sub' },
          { id: 'sn', label: 'Shouldn\'t: Mild prohibition', type: 'sub' }
        ]},
        { id: 'obl', label: 'Obligation (Must/Have to)', type: 'main', children: [
          { id: 'm1', label: 'Must: Internal/Strong', type: 'formula' },
          { id: 'ht', label: 'Have to: External/Rules', type: 'formula' },
          { id: 'mn', label: 'Mustn\'t: Strict Forbidden', type: 'warning' },
          { id: 'dht', label: 'Don\'t have to: Optional', type: 'sub' }
        ]}
      ]
    }
  },
  {
    id: 'a2-movement',
    title: '7. Prepositions of Movement & Place',
    level: 'A2',
    icon: 'fa-route',
    description: 'Menjelaskan perpindahan posisi dan arah secara dinamis menggunakan preposisi yang tepat.',
    sections: [
      {
        heading: '1. Menuju dan Masuk: To, Into, dan Towards',
        content: 'Preposisi gerakan menjelaskan perpindahan dari satu titik ke titik lain. "To" adalah preposisi paling umum untuk menunjukkan tujuan akhir. "Into" digunakan saat gerakan tersebut melibatkan perpindahan dari luar ke dalam suatu ruang tertutup. Sedangkan "Towards" menunjukkan arah tanpa harus sampai ke tujuan tersebut.\n\nKetepatan dalam menggunakan "Into" seringkali terabaikan. Banyak yang menggunakan "in" padahal ada aksi gerakan fisik yang terjadi. Contohnya: "He walks *into* the mosque". Memahami perbedaan dinamis ini membuat deskripsi aksi Anda terasa lebih hidup dan presisi bagi pendengar.',
        formula: 'Move + To (Point) | Move + Into (Space)',
        exceptions: 'Gunakan "Go home" (tanpa "to") karena "home" dalam konteks ini berfungsi sebagai adverb.',
        examples: [
          { text: 'I am going to the library.', isCorrect: true, translation: 'Saya sedang pergi ke perpustakaan.' },
          { text: 'He jumped into the water.', isCorrect: true, translation: 'Dia melompat ke dalam air.' },
          { text: 'They walked towards the mountains.', isCorrect: true, translation: 'Mereka berjalan ke arah pegunungan.' },
          { text: 'She ran into the house when it rained.', isCorrect: true, translation: 'Dia lari ke dalam rumah ketika hujan turun.' },
          { text: 'We are driving to Jakarta.', isCorrect: true, translation: 'Kami sedang berkendara ke Jakarta.' }
        ]
      },
      {
        heading: '2. Keluar dan Menjauh: Out of, Away from, dan Off',
        content: 'Kebalikan dari masuk adalah "Out of", yang menunjukkan gerakan meninggalkan ruang tertutup. "Away from" digunakan untuk menunjukkan aksi menjauh dari suatu titik. "Off" digunakan khusus untuk perpindahan dari atas sebuah permukaan ke posisi yang lebih rendah.\n\nPreposisi ini sangat vital untuk memberikan instruksi keamanan atau menceritakan aksi fisik. Jika Anda salah menggunakan "Off" dan "Out of", pendengar mungkin akan bingung membayangkan wujud ruangannya. Latihlah penggunaan preposisi ini dengan membayangkan gerakan fisik yang Anda lakukan setiap hari.',
        formula: 'Move + Out of (Space) | Move + Off (Surface)',
        exceptions: 'Gunakan "Get off" untuk transportasi umum (bis, kereta), tapi "Get out of" untuk mobil pribadi.',
        examples: [
          { text: 'Take your shoes off the carpet.', isCorrect: true, translation: 'Pindahkan sepatumu dari karpet.' },
          { text: 'He walked out of the room.', isCorrect: true, translation: 'Dia berjalan keluar dari ruangan.' },
          { text: 'Run away from danger.', isCorrect: true, translation: 'Larilah menjauh dari bahaya.' },
          { text: 'Get off the bus at the next stop.', isCorrect: true, translation: 'Turunlah dari bis di perhentian berikutnya.' },
          { text: 'The bird flew out of the cage.', isCorrect: true, translation: 'Burung itu terbang keluar dari sangkar.' }
        ]
      },
      {
        heading: '3. Melintasi dan Melewati: Through, Across, dan Past',
        content: 'Untuk gerakan yang memotong area, kita menggunakan "Through" (melewati ruang 3D seperti hutan atau pintu) dan "Across" (melewati permukaan 2D seperti jalan atau sungai). "Past" digunakan ketika Anda bergerak melewati sebuah titik tanpa berhenti di sana.\n\nMemahami perbedaan antara "Through" dan "Across" adalah kunci untuk deskripsi spasial yang cerdas. Bayangkan "Through" seperti menembus sesuatu, sedangkan "Across" seperti menyeberangi sesuatu. Ketelitian ini sangat membantu saat Anda memberikan arahan jalan (giving directions) kepada orang asing.',
        formula: 'Through (Inside) | Across (Surface) | Past (Pass by)',
        exceptions: 'Hati-hati dengan ejaan "Through" (lewat) vs "Thorough" (teliti) vs "Thought" (pikiran).',
        examples: [
          { text: 'We walked through the tunnel.', isCorrect: true, translation: 'Kami berjalan melewati terowongan.' },
          { text: 'They swam across the river.', isCorrect: true, translation: 'Mereka berenang menyeberangi sungai.' },
          { text: 'Go past the bank and turn left.', isCorrect: true, translation: 'Lewati bank itu dan belok kiri.' },
          { text: 'A breeze blew through the window.', isCorrect: true, translation: 'Angin sepoi-sepoi bertiup melewati jendela.' },
          { text: 'She walked across the street safely.', isCorrect: true, translation: 'Dia berjalan menyeberangi jalan dengan aman.' }
        ]
      },
      {
        heading: '4. Posisi Vertikal: Up, Down, dan Over',
        content: '"Up" dan "Down" adalah preposisi paling dasar untuk gerakan vertikal (naik dan turun). "Over" digunakan untuk gerakan yang melompati atau melintasi sesuatu dari posisi yang lebih tinggi tanpa menyentuhnya. Ini sering digunakan untuk rintangan seperti pagar atau jembatan.\n\nPreposisi ini juga sering digunakan secara kiasan dalam bahasa Inggris (Phrasal Verbs), namun di level A2 kita fokus pada makna fisiknya terlebih dahulu. Memetakan ruang secara vertikal membantu Anda mendeskripsikan pemandangan alam atau aktivitas fisik seperti mendaki dan berolahraga dengan lebih akurat.',
        formula: 'Move + Up/Down/Over',
        exceptions: '"Over" menyiratkan ada jarak/celah, berbeda dengan "On" yang menyentuh permukaan.',
        examples: [
          { text: 'Climb up the ladder.', isCorrect: true, translation: 'Naiklah tangga itu.' },
          { text: 'He sat down on the chair.', isCorrect: true, translation: 'Dia duduk di kursi.' },
          { text: 'The plane flew over the clouds.', isCorrect: true, translation: 'Pesawat itu terbang di atas awan.' },
          { text: 'Go down the stairs carefully.', isCorrect: true, translation: 'Turunlah tangga dengan hati-hati.' },
          { text: 'The cat jumped over the fence.', isCorrect: true, translation: 'Kucing itu melompati pagar.' }
        ]
      },
      {
        heading: '5. Konteks Perjalanan Ibadah: Hijra dan Safar',
        content: 'Dalam sejarah Islam, konsep perpindahan (Hijrah) dan perjalanan (Safar) memiliki makna yang sangat dalam. Menggunakan preposisi gerakan dengan tepat membantu kita menceritakan kembali kisah perjalanan Nabi Muhammad PBUH atau perjalanan Haji dengan penuh rasa hormat dan akurasi geografis.\n\nBahasa yang tepat dalam mendeskripsikan gerakan mencerminkan perhatian kita pada detail proses, bukan hanya hasil akhir. Saat kita berkata "I am walking to the mosque", setiap langkah kaki adalah ibadah. Gunakanlah preposisi ini untuk mengapresiasi setiap inci perjalanan hidup Anda menuju keridhaan-Nya.',
        formula: 'Direction + Spiritual Purpose',
        exceptions: 'Dalam ibadah Tawaf, kita menggunakan preposisi "Around" (mengelilingi).',
        examples: [
          { text: 'The Prophet PBUH migrated to Medina.', isCorrect: true, translation: 'Nabi SAW berhijrah ke Madinah.' },
          { text: 'Pilgrims walk around the Kaaba.', isCorrect: true, translation: 'Jamaah haji berjalan mengelilingi Ka\'bah.' },
          { text: 'We travel across the desert for Umrah.', isCorrect: true, translation: 'Kami melakukan perjalanan melintasi padang pasir untuk Umrah.' },
          { text: 'May Allah guide us through the straight path.', isCorrect: true, translation: 'Semoga Allah membimbing kita melewati jalan yang lurus.' },
          { text: 'Go into the mosque with your right foot.', isCorrect: true, translation: 'Masuklah ke dalam masjid dengan kaki kananmu.' }
        ]
      }
    ],
    mindmap: {
      id: 'a2-mov-root', label: 'PREPOSITIONS', type: 'root', children: [
        { id: 'in', label: 'Entering / Arrival', type: 'main', children: [
          { id: 'to', label: 'To (Destination)', type: 'sub' },
          { id: 'into', label: 'Into (Inside space)', type: 'sub' }
        ]},
        { id: 'out', label: 'Leaving / Away', type: 'main', children: [
          { id: 'outo', label: 'Out of (Exit)', type: 'sub' },
          { id: 'away', label: 'Away from (Distance)', type: 'sub' }
        ]},
        { id: 'cross', label: 'Crossing / Passing', type: 'main', children: [
          { id: 'thru', label: 'Through (3D space)', type: 'formula' },
          { id: 'acro', label: 'Across (2D surface)', type: 'formula' },
          { id: 'past', label: 'Past (Point)', type: 'sub' }
        ]}
      ]
    }
  },
  {
    id: 'a2-imperatives',
    title: '8. Imperatives & Giving Directions',
    level: 'A2',
    icon: 'fa-directions',
    description: 'Memberikan instruksi, arahan jalan, dan perintah secara lugas namun tetap santun.',
    sections: [
      {
        heading: '1. Prinsip Imperative: Kalimat Tanpa Subjek',
        content: 'Imperative (Kalimat Perintah) adalah bentuk kalimat unik dalam bahasa Inggris karena ia tidak memiliki subjek yang tertulis. Subjeknya dipahami secara otomatis sebagai "YOU" (lawan bicara). Kita langsung memulai kalimat dengan kata kerja bentuk dasar (Verb 1).\n\nBentuk ini digunakan untuk memberi perintah, instruksi, atau saran yang sangat kuat. Karena sifatnya yang langsung (*direct*), imperative harus digunakan dengan hati-hati. Tanpa nada bicara yang tepat atau tambahan kata santun, imperative bisa terdengar sangat kasar di telinga penutur asli.',
        formula: 'Verb 1 + Object!',
        exceptions: 'Meskipun tidak ada subjek tertulis, subjeknya selalu dianggap orang kedua (You).',
        examples: [
          { text: 'Open the door.', isCorrect: true, translation: 'Buka pintunya.' },
          { text: 'Stand up, please.', isCorrect: true, note: 'Polite with please.', translation: 'Silakan berdiri.' },
          { text: 'Listen to me.', isCorrect: true, translation: 'Dengarkan saya.' },
          { text: 'Be quiet in the library.', isCorrect: true, translation: 'Harap tenang di perpustakaan.' },
          { text: 'Read the instruction carefully.', isCorrect: true, translation: 'Baca instruksinya dengan teliti.' }
        ]
      },
      {
        heading: '2. Larangan dengan "DON\'T"',
        content: 'Untuk melarang seseorang melakukan sesuatu, kita cukup menambahkan kata "Don\'t" (Do not) di depan kata kerja utama. Aturan ini berlaku untuk semua kata kerja tanpa kecuali. Ini adalah cara yang paling efisien untuk memberikan peringatan atau batasan perilaku.\n\nDalam konteks keselamatan atau aturan publik, "Don\'t" sangat sering digunakan. Misalnya, "Don\'t touch" atau "Don\'t park here". Meskipun singkat, pesan yang disampaikan sangat jelas dan tidak ambigu, yang sangat penting dalam situasi darurat atau hukum.',
        formula: 'Don\'t + Verb 1',
        exceptions: 'Untuk "To Be", gunakan "Don\'t be..." (misal: Don\'t be sad).',
        examples: [
          { text: 'Don\'t be late tomorrow.', isCorrect: true, translation: 'Jangan terlambat besok.' },
          { text: 'Don\'t touch the fire.', isCorrect: true, translation: 'Jangan sentuh api itu.' },
          { text: 'Don\'t forget your umbrella.', isCorrect: true, translation: 'Jangan lupakan payungmu.' },
          { text: 'Please don\'t shout.', isCorrect: true, translation: 'Tolong jangan berteriak.' },
          { text: 'Don\'t waste your time.', isCorrect: true, translation: 'Jangan buang-buang waktumu.' }
        ]
      },
      {
        heading: '3. Navigasi: Seni Memberi Arahan Jalan',
        content: 'Memberi arahan jalan (*giving directions*) adalah aplikasi praktis paling umum dari imperative. Kita menggunakan urutan perintah yang logis untuk membantu seseorang mencapai tujuan. Frasa seperti "Turn left", "Go straight", dan "Stop at..." adalah kosakata wajib.\n\nKemampuan ini membutuhkan pemahaman tentang preposisi tempat dan gerakan yang sudah dipelajari sebelumnya. Saat memberi arahan, cobalah untuk menyebutkan patokan (*landmarks*) yang jelas untuk memudahkan lawan bicara. Kejelasan arahan Anda mencerminkan kecerdasan spasial dan niat baik Anda dalam menolong sesama.',
        formula: 'Action Verb + Direction/Landmark',
        exceptions: 'Gunakan "Take the [first/second] turning" untuk instruksi yang lebih presisi.',
        examples: [
          { text: 'Turn left at the next corner.', isCorrect: true, translation: 'Belok kiri di pojok berikutnya.' },
          { text: 'Go straight for two kilometers.', isCorrect: true, translation: 'Jalan lurus sejauh dua kilometer.' },
          { text: 'Cross the bridge and stop.', isCorrect: true, translation: 'Seberangi jembatan itu lalu berhenti.' },
          { text: 'Take the first exit at the roundabout.', isCorrect: true, translation: 'Ambil pintu keluar pertama di bundaran.' },
          { text: 'Go past the hospital and turn right.', isCorrect: true, translation: 'Lewati rumah sakit lalu belok kanan.' }
        ]
      },
      {
        heading: '4. Menghaluskan Perintah dengan Adab',
        content: 'Agar perintah tidak terdengar kasar, kita bisa menggunakan beberapa teknik. Yang paling sederhana adalah menambahkan kata "Please" di awal atau akhir kalimat. Kita juga bisa mengubahnya menjadi ajakan dengan kata "Let\'s" (Let us) yang berarti "Mari kita".\n\nTeknik lainnya adalah menggunakan struktur "Could you...?" yang secara teknis adalah pertanyaan namun berfungsi sebagai permintaan halus. Mempelajari cara menghaluskan perintah adalah bagian dari kecerdasan emosional dalam berbahasa Inggris. Orang akan lebih senang mengikuti instruksi Anda jika disampaikan dengan penuh hormat.',
        formula: 'Please + Imperative | Let\'s + Verb 1',
        exceptions: '"Let\'s" adalah singkatan dari "Let us", digunakan untuk mengajak bukan memerintah secara sepihak.',
        examples: [
          { text: 'Please help me with this bag.', isCorrect: true, translation: 'Tolong bantu saya dengan tas ini.' },
          { text: 'Let\'s pray together.', isCorrect: true, note: 'Invitation.', translation: 'Mari kita shalat berjamaah.' },
          { text: 'Close the window, please.', isCorrect: true, translation: 'Tolong tutup jendelanya.' },
          { text: 'Let\'s go to the market.', isCorrect: true, translation: 'Mari kita pergi ke pasar.' },
          { text: 'Be patient, please.', isCorrect: true, translation: 'Harap bersabar.' }
        ]
      },
      {
        heading: '5. Konteks Bimbingan: Dakwah dan Kebajikan',
        content: 'Dalam Islam, memberikan arahan yang benar adalah sebuah sedekah. Baik itu arahan jalan fisik maupun arahan menuju kebaikan (Amr Ma\'ruf). Menggunakan imperative dengan bijak mencerminkan karakter seorang pembimbing yang tegas namun penuh kasih sayang.\n\nBahasa yang kita gunakan untuk menginstruksikan anak-anak atau teman harus selalu dibalut dengan adab. Ingatlah bahwa perintah yang paling efektif adalah yang dicontohkan dengan perbuatan. Gunakanlah bentuk "Let\'s" lebih sering untuk menunjukkan bahwa Anda juga bagian dari perjuangan melakukan kebaikan tersebut bersama-sama.',
        formula: 'Imperative of Goodness + Hikmah',
        exceptions: 'Berhati-hatilah agar tidak menggunakan kalimat perintah untuk merendahkan harga diri orang lain.',
        examples: [
          { text: 'Always start your work with Bismillah.', isCorrect: true, translation: 'Selalu mulai pekerjaanmu dengan Bismillah.' },
          { text: 'Let\'s seek Allah\'s forgiveness.', isCorrect: true, translation: 'Mari kita memohon ampunan Allah.' },
          { text: 'Speak the truth even if it is bitter.', isCorrect: true, translation: 'Katakan kebenaran meskipun itu pahit.' },
          { text: 'Don\'t lose hope in Allah\'s mercy.', isCorrect: true, translation: 'Jangan berputus asa dari rahmat Allah.' },
          { text: 'Respect your parents every day.', isCorrect: true, translation: 'Hormati orang tuamu setiap hari.' }
        ]
      }
    ],
    mindmap: {
      id: 'a2-imp-root', label: 'IMPERATIVES', type: 'root', children: [
        { id: 'pos', label: 'Positive (Do)', type: 'main', children: [
          { id: 'v1', label: 'Start with Verb 1', type: 'formula' },
          { id: 'dir', label: 'Directions: Turn/Go/Cross', type: 'sub' }
        ]},
        { id: 'neg', label: 'Negative (Don\'t)', type: 'main', children: [
          { id: 'd1', label: 'Don\'t + Verb 1', type: 'formula' }
        ]},
        { id: 'pol', label: 'Politeness', type: 'main', children: [
          { id: 'plz', label: 'Add "Please"', type: 'sub' },
          { id: 'lets', label: 'Invitation: "Let\'s"', type: 'sub' }
        ]}
      ]
    }
  },
  {
    id: 'a2-past-continuous',
    title: '9. Past Continuous Tense',
    level: 'A2',
    icon: 'fa-spinner',
    description: 'Mendeskripsikan aksi yang sedang berlangsung di masa lalu, seringkali sebagai latar belakang cerita yang terinterupsi.',
    sections: [
      {
        heading: '1. Prinsip Latar Belakang: Aksi yang Sedang Terjadi',
        content: 'Past Continuous digunakan untuk membicarakan aksi yang sedang dalam proses dilakukan di titik waktu tertentu di masa lalu. Berbeda dengan Past Simple yang fokus pada "apa yang terjadi", Past Continuous fokus pada "apa yang sedang berlangsung".\n\nBayangkan tenses ini sebagai latar belakang sebuah cerita. Ia memberikan suasana pada narasi Anda. Misalnya, "Saat itu matahari sedang bersinar, angin sedang berembus dengan lembut, dan saya sedang berjalan...". Tanpa tenses ini, cerita Anda akan terasa kaku dan kehilangan detail atmosfer yang membuat pendengar bisa berimajinasi.',
        formula: 'Subject + Was/Were + Verb-ING',
        exceptions: 'Beberapa kata kerja (Stative Verbs) seperti Love, Know, Want jarang digunakan dalam bentuk Continuous.',
        examples: [
          { text: 'I was reading at 8 PM last night.', isCorrect: true, translation: 'Saya sedang membaca jam 8 malam tadi.' },
          { text: 'They were praying when the phone rang.', isCorrect: true, translation: 'Mereka sedang shalat ketika telepon berbunyi.' },
          { text: 'What were you doing at noon?', isCorrect: true, translation: 'Apa yang sedang kamu lakukan tadi siang?' },
          { text: 'She was cooking dinner while I was cleaning.', isCorrect: true, translation: 'Dia sedang memasak makan malam sementara saya sedang bersih-bersih.' },
          { text: 'It was raining all day yesterday.', isCorrect: true, translation: 'Hujan turun sepanjang hari kemarin.' }
        ]
      },
      {
        heading: '2. Rumus: Was/Were + Verb-ING',
        content: 'Struktur tenses ini sangat mirip dengan Present Continuous, hanya saja To Be yang digunakan adalah bentuk lampau. Gunakan "Was" untuk I, He, She, It, dan gunakan "Were" untuk You, We, They. Kata kerjanya selalu berakhiran "-ing".\n\nBanyak pembelajar sering lupa mencantumkan "Was/Were" dan hanya menggunakan Verb-ING saja. Ingatlah bahwa Verb-ING tidak bisa berdiri sendiri sebagai kata kerja utama tanpa bantuan To Be. Pasangan subjek dan To Be ini harus dikuasai secara otomatis agar kalimat Anda tidak terdengar terputus-putus.',
        formula: 'I/He/She/It + Was | You/We/They + Were',
        exceptions: 'Hati-hati dengan ejaan kata kerja berakhiran satu vokal + konsonan (misal: Run -> Running - dobel "n").',
        examples: [
          { text: 'I was sleeping.', isCorrect: true, translation: 'Saya sedang tidur.' },
          { text: 'We were talking.', isCorrect: true, translation: 'Kami sedang berbicara.' },
          { text: 'The cat was playing.', isCorrect: true, translation: 'Kucing itu sedang bermain.' },
          { text: 'He was working hard.', isCorrect: true, translation: 'Dia sedang bekerja keras.' },
          { text: 'You were looking for me.', isCorrect: true, translation: 'Kamu sedang mencari saya.' }
        ]
      },
      {
        heading: '3. Interupsi: Penggunaan When dan While',
        content: 'Kegunaan paling populer dari Past Continuous adalah untuk menunjukkan aksi panjang yang terinterupsi oleh aksi pendek lainnya. Kita menggunakan "When" untuk aksi pendek (Past Simple) dan "While" untuk aksi panjang (Past Continuous).\n\nContoh klasik: "Saya sedang tidur (*While*) ketika telepon berbunyi (*When*)". Struktur ini sangat penting untuk membangun alur cerita yang dramatis dan jelas. Memahami cara menghubungkan kedua tenses ini menunjukkan bahwa Anda sudah naik kelas dari sekadar kalimat sederhana ke kalimat majemuk yang kompleks.',
        formula: 'While + Past Continuous | When + Past Simple',
        exceptions: 'Dua aksi bisa terjadi bersamaan menggunakan "While" (misal: I was studying while she was reading).',
        examples: [
          { text: 'I was eating when she called.', isCorrect: true, translation: 'Saya sedang makan ketika dia menelepon.' },
          { text: 'While I was studying, my brother was playing.', isCorrect: true, note: 'Two ongoing actions.', translation: 'Sementara saya sedang belajar, adik saya sedang bermain.' },
          { text: 'What happened while you were driving?', isCorrect: true, translation: 'Apa yang terjadi sementara kamu sedang menyetir?' },
          { text: 'He fell when he was running.', isCorrect: true, translation: 'Dia jatuh ketika dia sedang berlari.' },
          { text: 'They were learning while they were working.', isCorrect: true, translation: 'Mereka sedang belajar sementara mereka sedang bekerja.' }
        ]
      },
      {
        heading: '4. Mendeskripsikan Suasana (Setting the Scene)',
        content: 'Dalam penulisan kreatif atau laporan, Past Continuous digunakan di awal paragraf untuk mendeskripsikan situasi awal. Ini membantu pembaca masuk ke dalam konteks sebelum aksi utama dimulai. Contohnya: "Orang-orang sedang berlarian, mobil-mobil sedang membunyikan klakson...".\n\nTeknik ini membuat narasi Anda terasa lebih profesional dan hidup. Alih-alih hanya menyebutkan daftar fakta, Anda melukis sebuah adegan. Latihlah kemampuan ini dengan menceritakan suasana di pasar, di masjid, atau di kantor saat Anda pertama kali sampai di sana kemarin.',
        formula: 'Opening Scene + Past Continuous',
        exceptions: 'Jangan gunakan tenses ini untuk menceritakan urutan kejadian satu per satu (gunakan Past Simple untuk itu).',
        examples: [
          { text: 'The wind was blowing gently.', isCorrect: true, translation: 'Angin sedang berembus dengan lembut.' },
          { text: 'People were waiting in line patiently.', isCorrect: true, translation: 'Orang-orang sedang mengantre dengan sabar.' },
          { text: 'The wind was blowing through the trees.', isCorrect: true, translation: 'Angin sedang bertiup melewati pepohonan.' },
          { text: 'Everyone was smiling during the event.', isCorrect: true, translation: 'Semua orang sedang tersenyum selama acara tersebut.' },
          { text: 'Cars were moving slowly in the traffic.', isCorrect: true, translation: 'Mobil-mobil sedang bergerak pelan di kemacetan.' }
        ]
      },
      {
        heading: '5. Konteks Kesadaran Waktu: Menghargai Proses',
        content: 'Dalam perspektif spiritual, Past Continuous mengingatkan kita bahwa hidup adalah rangkaian proses. Saat kita berkata "I was learning", kita mengakui adanya usaha yang berkelanjutan di masa lalu. Ini adalah bentuk apresiasi terhadap waktu yang telah kita investasikan untuk kebaikan.\n\nSelain itu, tenses ini sering digunakan dalam kesaksian yang jujur. Jika seseorang bertanya apa yang Anda lakukan saat sebuah kesalahan terjadi, kejujuran dalam mendeskripsikan aktivitas Anda adalah bagian dari integritas Muslim. Bahasa yang detail membantu kita memberikan penjelasan yang transparan dan dapat dipercaya.',
        formula: 'Action in Progress + Integrity',
        exceptions: 'Berhati-hatilah dengan stative verbs yang tidak bisa menggambarkan proses sedang dilakukan (seperti Believe).',
        examples: [
          { text: 'I was trying my best at that time.', isCorrect: true, translation: 'Saya sedang berusaha sebaik mungkin saat itu.' },
          { text: 'They were working for a good cause.', isCorrect: true, translation: 'Mereka sedang bekerja untuk tujuan yang baik.' },
          { text: 'We were helping the community.', isCorrect: true, translation: 'Kami sedang membantu masyarakat.' },
          { text: 'She was teaching the children with love.', isCorrect: true, translation: 'Dia sedang mengajar anak-anak dengan penuh kasih sayang.' },
          { text: 'He was seeking knowledge in Cairo.', isCorrect: true, translation: 'Dia sedang menuntut ilmu di Kairo.' }
        ]
      }
    ],
    mindmap: {
      id: 'a2-pc-root', label: 'PAST CONTINUOUS', type: 'root', children: [
        { id: 'f', label: 'Formula', type: 'main', children: [
          { id: 'w1', label: 'Was (I/H/S/I) + V-ing', type: 'formula' },
          { id: 'w2', label: 'Were (Y/W/T) + V-ing', type: 'formula' }
        ]},
        { id: 'u', label: 'Usage', type: 'main', children: [
          { id: 'bg', label: 'Background scene', type: 'sub' },
          { id: 'int', label: 'Interrupted by Past Simple', type: 'sub' }
        ]},
        { id: 'con', label: 'Connectors', type: 'main', children: [
          { id: 'wh', label: 'While (+ Continuous)', type: 'formula' },
          { id: 'wn', label: 'When (+ Simple)', type: 'formula' }
        ]}
      ]
    }
  },
  {
    id: 'a2-present-perfect-intro',
    title: '10. Introduction to Present Perfect',
    level: 'A2',
    icon: 'fa-link',
    description: 'Mengenal jembatan antara masa lalu dan masa kini untuk menceritakan pengalaman hidup tanpa batasan waktu yang kaku.',
    sections: [
      {
        heading: '1. Logika Pengalaman: "Pernah" atau "Belum"',
        content: 'Present Perfect adalah tenses yang unik karena ia memiliki satu kaki di masa lalu dan satu kaki di masa sekarang. Di level A2, kita fokus pada penggunaannya untuk menyatakan pengalaman hidup (Life Experience). Fokusnya bukan "kapan" kejadiannya, tapi " apakah" kejadian itu sudah pernah terjadi.\n\nDalam bahasa Indonesia, tenses ini sering diwakili oleh kata "Sudah", "Pernah", atau "Belum". Tenses ini sangat berguna untuk perkenalan yang mendalam, menceritakan tempat-tempat yang sudah dikunjungi, atau buku yang sudah dibaca. Ini adalah gerbang menuju percakapan tingkat lanjut yang lebih berfokus pada hasil daripada kronologi.',
        formula: 'Subject + Have/Has + Verb 3',
        exceptions: 'Gunakan "Been to" untuk pengalaman mengunjungi tempat, bukan "Gone to".',
        examples: [
          { text: 'I have visited Medina once.', isCorrect: true, translation: 'Saya sudah mengunjungi Madinah satu kali.' },
          { text: 'She has read that book.', isCorrect: true, translation: 'Dia sudah membaca buku itu.' },
          { text: 'We have finished our breakfast.', isCorrect: true, translation: 'Kami sudah menyelesaikan sarapan kami.' },
          { text: 'Have you ever been to Mecca?', isCorrect: true, translation: 'Apakah kamu pernah ke Mekkah?' },
          { text: 'I have never tried sushi.', isCorrect: true, translation: 'Saya belum pernah mencoba sushi.' }
        ]
      },
      {
        heading: '2. Struktur Dasar: Have/Has + Verb 3',
        content: 'Rumus utama tenses ini adalah penggunaan kata bantu "Have" atau "Has" diikuti oleh "Past Participle" (Verb 3). Gunakan "Has" untuk He, She, It, dan "Have" untuk subjek lainnya. Verb 3 adalah kunci yang membedakannya dengan tenses lainnya.\n\nTantangan terbesar adalah menghafal bentuk Verb 3, terutama untuk kata kerja irregular. Namun, Verb 3 adalah investasi jangka panjang karena ia juga digunakan dalam kalimat pasif (Passive Voice). Mulailah dengan menghafal kata-kata yang paling sering Anda gunakan sehari-hari seperti *Eat/Eaten, Go/Gone, dan Do/Done*.',
        formula: 'I/You/We/They + Have | He/She/It + Has',
        exceptions: 'Hati-hati dengan kata kerja yang Verb 2 dan Verb 3-nya sama (seperti: Bought, Brought).',
        examples: [
          { text: 'I have done my homework.', isCorrect: true, translation: 'Saya sudah mengerjakan PR saya.' },
          { text: 'He has gone to the mosque.', isCorrect: true, translation: 'Dia sudah pergi ke masjid.' },
          { text: 'They have eaten lunch.', isCorrect: true, translation: 'Mereka sudah makan siang.' },
          { text: 'She has written a letter.', isCorrect: true, translation: 'Dia sudah menulis surat.' },
          { text: 'We have broken the record.', isCorrect: true, translation: 'Kita sudah memecahkan rekor.' }
        ]
      },
      {
        heading: '3. Signal Words: Ever dan Never',
        content: 'Untuk mempertegas makna pengalaman, kita sering menyelipkan kata "Ever" (pernah - dalam pertanyaan) dan "Never" (tidak pernah - dalam pernyataan). Kata-kata ini diletakkan tepat di antara Have/Has dan Verb 3. Contoh: "I have *never* seen...".\n\nPenggunaan kata-kata ini membuat kalimat Anda terdengar sangat natural. "I haven\'t seen" terdengar teknis, namun "I have never seen" terdengar lebih ekspresif dalam konteks pengalaman hidup. Latihlah pola ini untuk saling bertukar cerita tentang hobi, perjalanan, dan prestasi dengan teman belajar Anda.',
        formula: 'Have + Ever/Never + Verb 3',
        exceptions: '"Ever" biasanya hanya untuk kalimat tanya, jangan gunakan dalam kalimat positif sebagai ganti "Once/Already".',
        examples: [
          { text: 'Have you ever read this book?', isCorrect: true, translation: 'Apakah kamu pernah membaca buku ini?' },
          { text: 'I have never met him before.', isCorrect: true, translation: 'Saya belum pernah bertemu dia sebelumnya.' },
          { text: 'Has she ever traveled alone?', isCorrect: true, translation: 'Apakah dia pernah bepergian sendirian?' },
          { text: 'They have never failed an exam.', isCorrect: true, translation: 'Mereka tidak pernah gagal dalam ujian.' },
          { text: 'We have never complained about food.', isCorrect: true, translation: 'Kami tidak pernah mengeluh tentang makanan.' }
        ]
      },
      {
        heading: '4. Perbedaan dengan Past Simple',
        content: 'Satu hal yang sering membingungkan adalah kapan menggunakan Past Simple dan kapan menggunakan Present Perfect. Aturannya sederhana: jika Anda menyebutkan WAKTU spesifik (Yesterday, In 2010), gunakan Past Simple. Jika waktunya TIDAK PENTING atau tidak disebutkan, gunakan Present Perfect.\n\nContoh: "I went to Mecca *last year*" (Past Simple) vs "I have been to Mecca" (Present Perfect). Memahami perbedaan ini menunjukkan kematangan logika bahasa Anda. Anda belajar untuk memisahkan antara laporan sejarah dan pernyataan tentang status atau pengalaman saat ini.',
        formula: 'Past Simple = When matters | Present Perfect = What matters',
        exceptions: 'Jika orangnya sudah meninggal, selalu gunakan Past Simple meskipun waktunya tidak disebutkan.',
        examples: [
          { text: 'I saw him yesterday.', isCorrect: true, note: 'Past Simple (Specific time).', translation: 'Saya melihatnya kemarin.' },
          { text: 'I have seen him before.', isCorrect: true, note: 'Present Perfect (Unspecified time).', translation: 'Saya sudah pernah melihatnya sebelumnya.' },
          { text: 'He has lived here.', isCorrect: true, translation: 'Dia pernah tinggal di sini.' },
          { text: 'He lived here in 2015.', isCorrect: true, translation: 'Dia tinggal di sini pada tahun 2015.' },
          { text: 'We have finished the task.', isCorrect: true, translation: 'Kami sudah menyelesaikan tugas itu.' }
        ]
      },
      {
        heading: '5. Konteks Syukur: Menghitung Nikmat yang Diterima',
        content: 'Dalam Islam, kita diajarkan untuk selalu menghitung nikmat Allah (*Tahaddus bin Ni\'mah*). Present Perfect adalah tenses terbaik untuk mengekspresikan syukur atas segala pencapaian dan pengalaman baik yang telah Allah berikan hingga detik ini.\n\nKalimat seperti "Allah has guided me" atau "I have learned many lessons" mengandung makna spiritual bahwa aksi tersebut dimulai oleh izin-Nya di masa lalu dan manfaatnya masih kita rasakan hingga sekarang. Jadikanlah tenses ini sebagai sarana untuk menceritakan keajaiban-keajaiban kecil dalam hidup Anda dengan penuh kerendahan hati.',
        formula: 'Divine Blessing + Present Perfect',
        exceptions: 'Tetap rendah hati dan gunakan tenses ini untuk mengakui bahwa semua keberhasilan adalah karena izin-Nya.',
        examples: [
          { text: 'Allah has given me everything I need.', isCorrect: true, translation: 'Allah telah memberiku segala yang aku butuhkan.' },
          { text: 'I have learned a lot from this experience.', isCorrect: true, translation: 'Saya telah belajar banyak dari pengalaman ini.' },
          { text: 'We have shared many beautiful moments.', isCorrect: true, translation: 'Kami telah berbagi banyak momen indah.' },
          { text: 'He has always been kind to us.', isCorrect: true, translation: 'Dia selalu baik kepada kami.' },
          { text: 'She has achieved her spiritual goals.', isCorrect: true, translation: 'Dia telah mencapai tujuan spiritualnya.' }
        ]
      }
    ],
    mindmap: {
      id: 'a2-pp-root', label: 'PRESENT PERFECT INTRO', type: 'root', children: [
        { id: 'logic', label: 'Life Experience', type: 'main', children: [
          { id: 'unsp', label: 'Unspecified Time', type: 'sub' },
          { id: 'res', label: 'Result in Present', type: 'sub' }
        ]},
        { id: 'form', label: 'Structure', type: 'main', children: [
          { id: 'v3', label: 'Have/Has + Verb 3', type: 'formula' },
          { id: 'sig', label: 'Ever / Never', type: 'formula' }
        ]},
        { id: 'diff', label: 'PP vs Past Simple', type: 'warning', detail: 'PP = No specific time | PS = Specific time (yesterday, etc)' }
      ]
    }
  }
];
