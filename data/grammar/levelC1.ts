
import { GrammarLesson } from '../../types';

export const LEVEL_C1: GrammarLesson[] = [
  {
    id: 'c1-inversion',
    title: '1. Advanced Stylistic Inversion',
    level: 'C1',
    icon: 'fa-sort-amount-down',
    description: 'Teknik penekanan gaya bahasa tinggi yang sering ditemukan dalam literatur, pidato, dan teks akademik.',
    sections: [
      {
        heading: '1. Prinsip Inversi: Memberi Kejutan dan Penekanan',
        content: 'Inversi adalah pembalikan posisi standar antara Subjek dan Kata Kerja Bantu. Di level mahir (C1), inversi bukan lagi sekadar cara untuk bertanya, melainkan senjata retorika untuk memberikan penekanan emosional atau dramatis pada sebuah pernyataan. Dengan memindahkan elemen tertentu ke awal kalimat, Anda menarik perhatian pembaca secara instan.\n\nBayangkan sebuah pidato yang datar dibandingkan dengan pidato yang penuh tenaga. Kalimat "I have never seen this" terdengar biasa, namun "Never have I seen this" memberikan getaran kewibawaan dan kejutan. Inversi adalah tentang seni memanipulasi struktur untuk menonjolkan pesan yang paling penting dalam narasi Anda.',
        formula: 'Negative Adverb + Auxiliary + Subject + Main Verb',
        exceptions: 'Inversi hanya terjadi jika kata keterangan negatif diletakkan di awal kalimat; jika di tengah, gunakan struktur normal.',
        examples: [
          { text: 'Never have I seen such a beautiful mosque.', isCorrect: true, translation: 'Belum pernah saya melihat masjid seindah itu.' },
          { text: 'Rarely does he arrive late for his prayers.', isCorrect: true, translation: 'Jarang sekali dia datang terlambat untuk shalatnya.' },
          { text: 'Seldom do we find such peace in the city.', isCorrect: true, translation: 'Jarang kita menemukan kedamaian seperti itu di kota.' },
          { text: 'Little did they know about the surprise plan.', isCorrect: true, translation: 'Sedikit yang mereka ketahui tentang rencana kejutan tersebut.' },
          { text: 'Hardly had I started when the phone rang.', isCorrect: true, translation: 'Baru saja saya mulai ketika telepon berdering.' }
        ]
      },
      {
        heading: '2. Negative Adverbials: Pemicu Utama Inversi',
        content: 'Pemicu inversi paling umum adalah penggunaan kata keterangan negatif atau pembatas (Negative Adverbials) di awal kalimat. Kata-kata seperti *Never, Rarely, Seldom, Hardly, Scarcely, Barely,* dan *No sooner* mewajibkan kalimat tersebut mengikuti pola kalimat tanya (Auxiliary + Subject + Verb).\n\nTeknik ini sangat sering digunakan dalam penulisan esai formal atau laporan jurnalistik tingkat tinggi. Ia memberikan kesan bahwa penulis memiliki kendali penuh atas bahasa dan mampu menyusun argumen dengan variasi struktur yang kaya. Latihlah penggunaan kata-kata negatif ini untuk memberikan warna pada tulisan akademik Anda agar tidak terasa monoton.',
        formula: 'Negative Word (Never/Rarely/etc.) + Aux + Subject + Verb',
        exceptions: 'Inversi tidak diperlukan jika kata negatif tersebut tidak berada di posisi awal kalimat.',
        examples: [
          { text: 'Never before had the community been so united.', isCorrect: true, translation: 'Belum pernah sebelumnya komunitas ini begitu bersatu.' },
          { text: 'Scarcely had she finished when everyone cheered.', isCorrect: true, translation: 'Baru saja dia selesai ketika semua orang bersorak.' },
          { text: 'No sooner had he left than the rain started.', isCorrect: true, translation: 'Tidak lama setelah dia pergi, hujan pun mulai turun.' },
          { text: 'Barely could I hear his voice over the noise.', isCorrect: true, translation: 'Hampir tidak bisa saya mendengar suaranya di tengah kebisingan itu.' },
          { text: 'Rarely had such an event occurred in history.', isCorrect: true, translation: 'Jarang sekali peristiwa seperti itu terjadi dalam sejarah.' }
        ]
      },
      {
        heading: '3. Conditional Inversion: Profesionalitas Tanpa "IF"',
        content: 'Di level profesional, penggunaan kata "IF" terkadang dianggap terlalu sederhana. Inversi menawarkan cara yang lebih elegan untuk menyatakan pengandaian atau syarat, terutama dalam korespondensi bisnis atau dokumen hukum. Struktur seperti "Should you need..." atau "Had I known..." memberikan kesan kesantunan yang tinggi sekaligus otoritas.\n\nMisalnya, alih-alih berkata "If you have any questions," gunakanlah "Should you have any questions." Perubahan kecil ini secara instan meningkatkan derajat profesionalitas komunikasi Anda. Penguasaan teknik ini sangat penting bagi mereka yang ingin berkarier di lingkungan internasional yang mengedepankan etiket bahasa formal.',
        formula: 'Should/Had/Were + Subject + Verb (No "If")',
        exceptions: 'Hanya kata kerja bantu tertentu (Should, Had, Were) yang bisa digunakan untuk inversi kondisional.',
        examples: [
          { text: 'Should you require further info, contact us.', isCorrect: true, translation: 'Jika Anda memerlukan info lebih lanjut, hubungi kami.' },
          { text: 'Had I known the truth, I would have acted.', isCorrect: true, translation: 'Seandainya saya tahu kebenarannya, saya pasti sudah bertindak.' },
          { text: 'Were I in your position, I would accept it.', isCorrect: true, translation: 'Seandainya saya di posisi Anda, saya akan menerimanya.' },
          { text: 'Should it rain, the event will be moved.', isCorrect: true, translation: 'Seandainya hujan turun, acara akan dipindahkan.' },
          { text: 'Had they been more careful, they would have won.', isCorrect: true, translation: 'Seandainya mereka lebih berhati-hati, mereka pasti sudah menang.' }
        ]
      },
      {
        heading: '4. Inversi Lokasi dan Participle: Menciptakan Atmosfer',
        content: 'Inversi tidak hanya dipicu oleh kata negatif, tapi juga oleh ekspresi tempat atau waktu yang diletakkan di depan untuk efek artistik. Teknik ini sering ditemukan dalam narasi sastra atau deskripsi puitis untuk menciptakan suasana yang hidup dan membawa pembaca masuk ke dalam *setting* cerita.\n\nContohnya, "At the end of the valley stood a small village." Di sini, lokasi ditekankan terlebih dahulu sebelum subjeknya muncul. Begitu pula dengan inversi menggunakan kata kerja "-ing" atau "-ed" (Participles). Teknik ini memungkinkan Anda untuk melukiskan gambar dengan kata-kata secara lebih dinamis dibandingkan dengan struktur kalimat standar yang kaku.',
        formula: 'Place Expression + Main Verb + Subject',
        exceptions: 'Inversi ini tidak menggunakan kata kerja bantu (auxiliary), langsung kata kerja utama.',
        examples: [
          { text: 'Under the tree sat an old wise man.', isCorrect: true, translation: 'Di bawah pohon itu duduk seorang pria tua yang bijaksana.' },
          { text: 'On the wall hung a beautiful calligraphy.', isCorrect: true, translation: 'Di dinding tergantung sebuah kaligrafi yang indah.' },
          { text: 'Hidden in the archives were the old letters.', isCorrect: true, translation: 'Tersembunyi di dalam arsip adalah surat-surat lama itu.' },
          { text: 'Standing in the corner was a tall stranger.', isCorrect: true, translation: 'Berdiri di sudut adalah seorang asing yang tinggi.' },
          { text: 'Beside the river grew many colorful flowers.', isCorrect: true, translation: 'Di samping sungai tumbuh banyak bunga berwarna-warni.' }
        ]
      },
      {
        heading: '5. Nuansa Orasi: Membangun Retorika yang Kuat',
        content: 'Bagi seorang pembicara publik atau pemimpin, inversi adalah alat untuk membangun klimaks dalam sebuah argumen. Penggunaan struktur "Not only... but also" dengan inversi adalah salah satu cara paling efektif untuk menunjukkan dua poin penting secara bersamaan dengan bobot yang sangat kuat.\n\nMisalnya: "Not only is he a great scholar, but he is also a humble servant." Perhatikan bagaimana "is he" dibalik; ini memberikan jeda dramatis yang membuat audiens menunggu apa yang akan Anda sampaikan selanjutnya. Menguasai retorika ini berarti Anda siap untuk memengaruhi dan menginspirasi orang lain melalui kekuatan kata-kata Anda yang tersusun sempurna.',
        formula: 'Not only + Aux + Subject + Verb + but also...',
        exceptions: 'Inversi hanya terjadi pada bagian pertama kalimat (setelah Not only), bukan pada bagian kedua.',
        examples: [
          { text: 'Not only did they lose, but they also learned.', isCorrect: true, translation: 'Tidak hanya mereka kalah, tapi mereka juga belajar.' },
          { text: 'Only then did the nation realize the danger.', isCorrect: true, translation: 'Hanya pada saat itulah bangsa tersebut menyadari bahayanya.' },
          { text: 'So intense was the heat that we stayed inside.', isCorrect: true, translation: 'Begitu panasnya sehingga kami tetap berada di dalam ruangan.' },
          { text: 'Such was the power of his speech that many cried.', isCorrect: true, translation: 'Begitu besarnya kekuatan pidatonya sehingga banyak yang menangis.' },
          { text: 'In no way should this be considered a failure.', isCorrect: true, translation: 'Sama sekali tidak boleh hal ini dianggap sebagai kegagalan.' }
        ]
      }
    ],
    mindmap: {
      id: 'c1-inv-root', label: 'STYLISTIC INVERSION', type: 'root', children: [
        { id: 'neg-adv', label: 'Negative Adverbials', type: 'main', children: [
          { id: 'words', label: 'Never, Rarely, Seldom, Little', type: 'sub' },
          { id: 'soon', label: 'No sooner... than', type: 'sub' }
        ]},
        { id: 'cond-inv', label: 'Conditionals (No IF)', type: 'main', children: [
          { id: 'shd', label: 'Should (Future/Present)', type: 'formula' },
          { id: 'had-i', label: 'Had (Past)', type: 'formula' },
          { id: 'were-i', label: 'Were (Hypothetical)', type: 'formula' }
        ]},
        { id: 'place-p', label: 'Place & Participle', type: 'main', detail: 'Prep Phrase / V-ing at start' }
      ]
    }
  },
  {
    id: 'c1-mixed-conditionals',
    title: '2. Complex Mixed Conditionals',
    level: 'C1',
    icon: 'fa-code-branch',
    description: 'Menghubungkan realitas lintas waktu untuk mengevaluasi dampak keputusan masa lalu pada status masa kini.',
    sections: [
      {
        heading: '1. Logika Lintas Waktu: Masa Lalu Membentuk Masa Kini',
        content: 'Mixed Conditionals di level C1 menuntut pemahaman mendalam tentang bagaimana sebuah kejadian yang sudah selesai di masa lalu masih memiliki "gaung" atau efek yang mendefinisikan siapa kita hari ini. Ini adalah struktur favorit untuk refleksi diri dan analisis strategis.\n\nKita menggunakan **If + Past Perfect** untuk membicarakan kejadian masa lalu, yang digabungkan dengan **Would + Verb 1** untuk membicarakan hasilnya SEKARANG. Contoh: "If I hadn\'t taken that risk, I wouldn\'t be successful now." Di sini, Anda sedang memetakan garis takdir dan pilihan dalam satu struktur kalimat yang sangat cerdas.',
        formula: 'If + S + had + V3, S + would + V1',
        exceptions: 'Hanya digunakan jika kejadian masa lalu memiliki dampak yang masih berlanjut hingga saat ini.',
        examples: [
          { text: 'If I had studied medicine, I would be a doctor now.', isCorrect: true, translation: 'Jika saya dulu belajar kedokteran, saya pasti sudah jadi dokter sekarang.' },
          { text: 'If they had won the war, we would speak a different language today.', isCorrect: true, translation: 'Jika dulu mereka memenangkan perang, kita pasti akan bicara bahasa yang berbeda hari ini.' },
          { text: 'If she had followed my advice, she wouldn\'t be in trouble now.', isCorrect: true, translation: 'Jika dulu dia mengikuti saran saya, dia pasti tidak dalam masalah sekarang.' },
          { text: 'If we had invested early, we would be wealthy today.', isCorrect: true, translation: 'Jika dulu kita berinvestasi lebih awal, kita pasti sudah kaya hari ini.' },
          { text: 'If I hadn\'t missed the flight, I would be in Cairo now.', isCorrect: true, translation: 'Jika saya dulu tidak ketinggalan pesawat, saya pasti sudah ada di Kairo sekarang.' }
        ]
      },
      {
        heading: '2. Kebalikan Waktu: Karakter Tetap Memengaruhi Masa Lalu',
        content: 'Tipe campuran kedua sering kali terabaikan: bagaimana sifat atau kondisi permanen kita memengaruhi tindakan spesifik di masa lalu. Rumusnya: **If + Past Simple** (kondisi umum) + **Would have + Verb 3** (hasil spesifik di masa lalu).\n\nMisalnya: "If I weren\'t so shy, I would have spoken to him yesterday." Kalimat ini menunjukkan bahwa karakter "pemalu" Anda adalah alasan mengapa sebuah peluang terlewatkan kemarin. Memahami pola ini memungkinkan Anda untuk menjelaskan motivasi psikologis di balik setiap tindakan sejarah dalam hidup Anda.',
        formula: 'If + S + V2 (State), S + would have + V3',
        exceptions: 'Pola ini hanya berlaku untuk kondisi atau sifat yang bersifat permanen, bukan aksi sementara.',
        examples: [
          { text: 'If I knew English better, I would have applied for that job.', isCorrect: true, translation: 'Jika saya tahu bahasa Inggris lebih baik, saya pasti sudah melamar pekerjaan itu.' },
          { text: 'If he were a better person, he wouldn\'t have lied to us.', isCorrect: true, translation: 'Jika dia orang yang lebih baik, dia pasti tidak akan membohongi kita.' },
          { text: 'If they were more careful, they wouldn\'t have lost the keys.', isCorrect: true, translation: 'Jika mereka lebih berhati-hati, mereka pasti tidak akan kehilangan kunci itu.' },
          { text: 'If I weren\'t afraid of heights, I would have gone skydiving.', isCorrect: true, translation: 'Jika saya tidak takut ketinggian, saya pasti sudah terjun payung.' },
          { text: 'If she were rich, she would have bought that house last year.', isCorrect: true, translation: 'Jika dia kaya, dia pasti sudah membeli rumah itu tahun lalu.' }
        ]
      },
      {
        heading: '3. Variasi Modals: Might dan Could',
        content: 'Untuk memberikan nuansa ketidakpastian atau kerendahan hati, kita bisa mengganti "Would" dengan "Might" (mungkin) atau "Could" (bisa saja). Ini adalah ciri khas penutur level mahir yang menghindari klaim absolut dalam spekulasi.\n\n"If I had prayed more, I *might* be calmer now." Perhatikan bagaimana "Might" memberikan kesan bahwa ketenangan tersebut adalah sebuah peluang yang mungkin didapat, bukan jaminan otomatis. Pemilihan modal ini sangat memengaruhi "suara" intelektual Anda dalam diskusi mendalam.',
        formula: 'If + S + had + V3, S + might/could + V1',
        exceptions: 'Might dan Could memberikan nuansa kemungkinan (possibility) yang lebih rendah dibandingkan Would.',
        examples: [
          { text: 'If I had known, I might have helped you.', isCorrect: true, translation: 'Jika dulu saya tahu, saya mungkin sudah membantu Anda.' },
          { text: 'If they had practiced, they could be the champions now.', isCorrect: true, translation: 'Jika dulu mereka berlatih, mereka bisa saja menjadi juara sekarang.' },
          { text: 'If she had stayed, things might be different today.', isCorrect: true, translation: 'Jika dulu dia tetap tinggal, keadaan mungkin akan berbeda hari ini.' },
          { text: 'If we had left earlier, we could have arrived on time.', isCorrect: true, translation: 'Jika dulu kita berangkat lebih awal, kita bisa saja sampai tepat waktu.' },
          { text: 'If I had asked, he might have said yes.', isCorrect: true, translation: 'Jika dulu saya bertanya, dia mungkin sudah mengiyakan.' }
        ]
      },
      {
        heading: '4. Mixed Conditionals dalam Kritik dan Penyesalan',
        content: 'Struktur ini sangat kuat untuk memberikan kritik yang konstruktif atau mengekspresikan penyesalan yang mendalam tanpa terdengar emosional secara berlebihan. Karena strukturnya yang logis, ia memaksa lawan bicara untuk melihat hubungan sebab-akibat secara objektif.\n\nDalam dunia bisnis, ini digunakan untuk mengevaluasi strategi: "If we had noticed the market shift, we wouldn\'t be losing money now." Penguasaan tenses ini menunjukkan bahwa Anda mampu berpikir secara makro dan menghubungkan titik-titik (connecting the dots) antar periode waktu yang berbeda.',
        formula: 'If + S + had + V3, S + wouldn\'t be + [Status]',
        exceptions: 'Gunakan untuk mengevaluasi keputusan masa lalu secara logis dan objektif.',
        examples: [
          { text: 'If you had listened, you wouldn\'t be lost now.', isCorrect: true, translation: 'Jika Anda dulu mendengarkan, Anda pasti tidak akan tersesat sekarang.' },
          { text: 'If he had worked harder, he would have a better life now.', isCorrect: true, translation: 'Jika dia dulu bekerja lebih keras, dia pasti sudah punya kehidupan yang lebih baik sekarang.' },
          { text: 'If they hadn\'t wasted time, the project would be finished now.', isCorrect: true, translation: 'Jika dulu mereka tidak membuang waktu, proyeknya pasti sudah selesai sekarang.' },
          { text: 'If I hadn\'t spent all my money, I wouldn\'t be broke today.', isCorrect: true, translation: 'Jika dulu saya tidak menghabiskan semua uang saya, saya pasti tidak akan bangkrut hari ini.' },
          { text: 'If she had taken the chance, she might be famous now.', isCorrect: true, translation: 'Jika dulu dia mengambil kesempatan itu, dia mungkin sudah terkenal sekarang.' }
        ]
      },
      {
        heading: '5. Etika Muhasabah: Belajar dari Skenario "Law"',
        content: 'Dalam Adab Islam, berandai-andai (*Law*) dilarang jika hanya memicu kesedihan atas takdir. Namun, ia menjadi wajib jika tujuannya adalah Muhasabah (evaluasi diri) untuk perbaikan masa depan. Mixed Conditionals adalah alat linguistik terbaik untuk Muhasabah ini.\n\nDengan berkata "If I had been more grateful, I would be happier now," Anda sedang mengakui kekurangan diri sebagai pelajaran. Bahasa membantu kita menstrukturkan pertobatan dan rencana perbaikan. Gunakan tenses ini sebagai sarana syukur atas kesadaran yang Allah berikan, bukan sebagai pintu untuk meratapi hal yang sudah berlalu.',
        formula: 'If + [Divine Guidance/Virtue], result would be [Status]',
        exceptions: 'Gunakan untuk refleksi spiritual yang positif (Muhasabah), bukan untuk meratapi takdir.',
        examples: [
          { text: 'Alhamdulillah, if Allah hadn\'t guided me, I would be lost today.', isCorrect: true, translation: 'Alhamdulillah, jika Allah tidak membimbingku, aku pasti sudah tersesat hari ini.' },
          { text: 'If we had known the reward, we would have given more charity.', isCorrect: true, translation: 'Jika dulu kita tahu pahalanya, kita pasti sudah memberi sedekah lebih banyak.' },
          { text: 'If I had been more patient, I wouldn\'t have regretted my words.', isCorrect: true, translation: 'Jika dulu saya lebih sabar, saya pasti tidak akan menyesali kata-kata saya.' },
          { text: 'If they were truly wise, they would have chosen the truth.', isCorrect: true, translation: 'Jika mereka benar-benar bijaksana, mereka pasti sudah memilih kebenaran.' },
          { text: 'May we act today as if we had already seen the results.', isCorrect: true, translation: 'Semoga kita bertindak hari ini seolah-olah kita sudah melihat hasilnya.' }
        ]
      }
    ],
    mindmap: {
      id: 'c1-mix-root', label: 'MIXED CONDITIONALS', type: 'root', children: [
        { id: 'type1', label: 'Past Event -> Present State', type: 'main', children: [
          { id: 'f1', label: 'If + Past Perfect, Would + V1', type: 'formula' }
        ]},
        { id: 'type2', label: 'Present State -> Past Event', type: 'main', children: [
          { id: 'f2', label: 'If + Past Simple, Would have + V3', type: 'formula' }
        ]},
        { id: 'mod-v', label: 'Modal Variations', type: 'sub', detail: 'Use Might/Could for low certainty.' }
      ]
    }
  },
  {
    id: 'c1-participle-clauses',
    title: '3. Participle Clauses',
    level: 'C1',
    icon: 'fa-cut',
    description: 'Seni memadatkan kalimat dengan menghilangkan subjek dan kata penghubung untuk aliran tulisan yang lebih profesional.',
    sections: [
      {
        heading: '1. Prinsip Kompresi: Menghilangkan Pemborosan Kata',
        content: 'Participle clauses adalah teknik "pemangkasan" kalimat. Di level mahir, kita ingin tulisan kita mengalir tanpa banyak kata penghubung yang berulang seperti "because, when, after," atau "who". Kita menggunakan kata kerja berakhiran **-ing** (Present Participle) atau **-ed** (Past Participle) untuk menggantikan klausa utuh.\n\nSyarat utamanya adalah SUBJEK HARUS SAMA di kedua bagian kalimat. Contoh: "Feeling tired, I went to bed" lebih elegan daripada "Because I felt tired, I went to bed." Teknik ini membuat narasi Anda terasa lebih dinamis, cerdas, dan langsung pada inti informasi, sangat cocok untuk penulisan esai akademik.',
        formula: 'Verb-ing / Verb-ed, Subject + Main Verb',
        exceptions: 'Subjek pada participle clause HARUS sama dengan subjek pada main clause (klausa utama).',
        examples: [
          { text: 'Knowing the truth, he decided to stay silent.', isCorrect: true, translation: 'Mengetahui kebenarannya, dia memutuskan untuk tetap diam.' },
          { text: 'Waiting for the bus, I read a book.', isCorrect: true, translation: 'Sambil menunggu bis, saya membaca buku.' },
          { text: 'Looking out the window, she saw the moon.', isCorrect: true, translation: 'Melihat ke luar jendela, dia melihat bulan.' },
          { text: 'Having finished his work, Ali went home.', isCorrect: true, translation: 'Setelah menyelesaikan pekerjaannya, Ali pulang ke rumah.' },
          { text: 'Walking down the street, I met an old friend.', isCorrect: true, translation: 'Berjalan menyusuri jalan, saya bertemu dengan seorang teman lama.' }
        ]
      },
      {
        heading: '2. Present Participle (-ing): Aksi Aktif dan Sebab',
        content: 'Present Participle digunakan untuk menggantikan kalimat aktif atau untuk menunjukkan alasan/penyebab. Ia memberikan kesan bahwa dua hal terjadi secara bersamaan atau berurutan sangat cepat. Ini memberikan efek visual yang kuat bagi pembaca.\n\nMisalnya, "Feeling hungry, he ate the dates." Di sini, perasaan lapar adalah alasan (sebab) dia makan. Menggunakan bentuk "-ing" di awal kalimat memberikan sinyal kepada pembaca untuk segera mencari subjek di belakang koma, menciptakan ritme bacaan yang sangat memikat.',
        formula: 'Verb-ing + ..., Subject + Verb',
        exceptions: 'Digunakan untuk aksi aktif yang terjadi bersamaan atau sebagai alasan (sebab) dari aksi utama.',
        examples: [
          { text: 'Realizing my mistake, I apologized immediately.', isCorrect: true, translation: 'Menyadari kesalahan saya, saya segera meminta maaf.' },
          { text: 'Living in Cairo, she learned Arabic quickly.', isCorrect: true, translation: 'Tinggal di Kairo, dia belajar bahasa Arab dengan cepat.' },
          { text: 'Not wanting to argue, I left the room.', isCorrect: true, translation: 'Karena tidak ingin berdebat, saya meninggalkan ruangan.' },
          { text: 'Being a student, he gets a discount.', isCorrect: true, translation: 'Sebagai seorang siswa, dia mendapatkan diskon.' },
          { text: 'Smiling at the guest, the host offered tea.', isCorrect: true, translation: 'Tersenyum pada tamu, sang tuan rumah menawarkan teh.' }
        ]
      },
      {
        heading: '3. Past Participle (-ed): Nuansa Pasif dan Status',
        content: 'Past Participle digunakan untuk menggantikan kalimat pasif. Jika subjek "dikenai" sesuatu, kita memulai klausa dengan Verb 3. Ini adalah cara yang sangat ringkas untuk memberikan latar belakang pada subjek utama tanpa harus membuat kalimat baru yang kaku.\n\nContoh: "Shocked by the news, they remained silent." Kalimat aslinya adalah "Because they were shocked...". Perhatikan betapa jauh lebih berwibawa kalimat yang dipadatkan. Teknik ini sering digunakan dalam jurnalisme dan literatur untuk mendeskripsikan kondisi emosional karakter dengan cepat.',
        formula: 'Verb 3 (Past Participle) + ..., Subject + Verb',
        exceptions: 'Hanya digunakan jika subjek menerima aksi (makna pasif).',
        examples: [
          { text: 'Built in 1990, the mosque is still beautiful.', isCorrect: true, translation: 'Dibangun pada tahun 1990, masjid itu masih indah.' },
          { text: 'Written in Arabic, the letter was hard to read.', isCorrect: true, translation: 'Ditulis dalam bahasa Arab, surat itu sulit dibaca.' },
          { text: 'Surrounded by family, he felt happy.', isCorrect: true, translation: 'Dikelilingi oleh keluarga, dia merasa bahagia.' },
          { text: 'Located in the city center, the shop is busy.', isCorrect: true, translation: 'Terletak di pusat kota, toko itu sibuk.' },
          { text: 'Fascinated by the story, the kids sat quietly.', isCorrect: true, translation: 'Terpesona oleh ceritanya, anak-anak duduk dengan tenang.' }
        ]
      },
      {
        heading: '4. Perfect Participle: Menegaskan Urutan Kejadian',
        content: 'Untuk menekankan bahwa sebuah aksi sudah SELESAI SEBELUM aksi berikutnya dimulai, kita menggunakan **Having + Verb 3**. Ini memberikan dimensi waktu yang lebih tajam daripada sekadar menggunakan "-ing". Ia menunjukkan adanya proses persiapan sebelum hasil akhir.\n\nContoh: "Having prayed, I felt much better." Struktur ini sangat berguna dalam penulisan laporan atau biografi di mana urutan kronologis adalah kunci utama. Penggunaan "Having" memberikan kesan formalitas dan ketelitian pada narasi sejarah atau pengalaman hidup Anda.',
        formula: 'Having + Verb 3, Subject + Verb',
        exceptions: 'Gunakan untuk menekankan bahwa satu aksi sudah SELESAI sepenuhnya sebelum aksi berikutnya dimulai.',
        examples: [
          { text: 'Having lost my keys, I called a locksmith.', isCorrect: true, translation: 'Karena kehilangan kunci, saya memanggil tukang kunci.' },
          { text: 'Having read the book before, I didn\'t want to read it again.', isCorrect: true, translation: 'Karena sudah pernah membaca bukunya, saya tidak ingin membacanya lagi.' },
          { text: 'Having eaten lunch, we continued our journey.', isCorrect: true, translation: 'Setelah makan siang, kami melanjutkan perjalanan.' },
          { text: 'Having heard the adzan, they went to the mosque.', isCorrect: true, translation: 'Setelah mendengar adzan, mereka pergi ke masjid.' },
          { text: 'Having studied hard, she passed the exam easily.', isCorrect: true, translation: 'Setelah belajar keras, she lulus ujian dengan mudah.' }
        ]
      },
      {
        heading: '5. Konteks Adab: Ketelitian dalam Deskripsi',
        content: 'Dalam Islam, kejelasan deskripsi adalah bagian dari amanah informasi. Menggunakan participle clauses membantu kita mendeskripsikan kemuliaan orang lain tanpa bertele-tele. "Inspired by the Quran, he dedicated his life to science." Perhatikan betapa kuatnya pesan tersebut.\n\nNamun, beritahulah dengan "Dangling Participle" (partisipel yang menggantung), di mana subjek di awal dan di akhir berbeda (salah: *Walking home, the rain started* - seolah hujan yang berjalan pulang). Ketelitian tata bahasa ini mencerminkan kejernihan pikiran Anda dalam menyampaikan fakta yang benar dan terstruktur.',
        formula: 'Guided/Inspired by [Faith], Subject + Verb',
        exceptions: 'Hindari \'Dangling Participle\' (partisipel menggantung) di mana subjek awal dan akhir berbeda.',
        examples: [
          { text: 'Guided by faith, we find peace in our hearts.', isCorrect: true, translation: 'Dibimbing oleh iman, kita menemukan kedamaian dalam hati kita.' },
          { text: 'Searching for knowledge, the scholars traveled far.', isCorrect: true, translation: 'Mencari ilmu, para ulama melakukan perjalanan jauh.' },
          { text: 'Having given zakat, they felt a sense of relief.', isCorrect: true, translation: 'Setelah menunaikan zakat, mereka merasakan ketenangan.' },
          { text: 'Praising Allah, the bird started to sing.', isCorrect: true, translation: 'Sambil memuji Allah, burung itu mulai bernyanyi.' },
          { text: 'Moved by his kindness, I decided to help too.', isCorrect: true, translation: 'Tergerak oleh kebaikannya, saya pun memutuskan untuk membantu.' }
        ]
      }
    ],
    mindmap: {
      id: 'c1-pc-root', label: 'PARTICIPLE CLAUSES', type: 'root', children: [
        { id: 'pres-p', label: 'Present (-ing)', type: 'main', children: [
          { id: 'act', label: 'Active Action / Reason', type: 'sub' }
        ]},
        { id: 'past-p', label: 'Past (-ed)', type: 'main', children: [
          { id: 'pas', label: 'Passive Meaning / Status', type: 'sub' }
        ]},
        { id: 'perf-p', label: 'Perfect (Having + V3)', type: 'formula', children: [
          { id: 'seq', label: 'Action 1 finished BEFORE Action 2', type: 'sub' }
        ]},
        { id: 'rule-p', label: 'Golden Rule', type: 'warning', detail: 'Subjects MUST be the same in both clauses.' }
      ]
    }
  },
  {
    id: 'c1-cleft-sentences',
    title: '4. Cleft Sentences',
    level: 'C1',
    icon: 'fa-magic',
    description: 'Seni memfokuskan informasi dengan memecah kalimat untuk menonjolkan bagian yang paling penting.',
    sections: [
      {
        heading: '1. Logika Fokus: It-Cleft Sentences',
        content: 'Cleft (artinya: terbelah) sentences digunakan untuk memberikan penekanan luar biasa pada bagian tertentu dari informasi. It-Cleft dimulai dengan kata "It is/was... that...". Tujuannya adalah untuk menegaskan siapa pelaku atau apa faktor utamanya, seringkali untuk membantah anggapan lain.\n\nBandingkan: "Ali helping me" (Biasa) dengan "It was ALI that helped me" (Penekanan: Bukan orang lain, tapi Ali). Teknik ini sangat efektif dalam argumentasi hukum atau perdebatan intelektual untuk mengunci poin krusial Anda agar tidak bisa diabaikan oleh pendengar.',
        formula: 'It + is/was + [Fokus] + that/who ...',
        exceptions: 'Kata "It" di sini bersifat impersonal, sehingga tidak bisa diganti dengan "This" atau "That".',
        examples: [
          { text: 'It was the truth that set us free.', isCorrect: true, translation: 'Adalah kebenaran yang membebaskan kita.' },
          { text: 'It is the intention that matters most.', isCorrect: true, translation: 'Adalah niat yang paling penting.' },
          { text: 'It was in Medina that the society flourished.', isCorrect: true, translation: 'Di Madinah-lah masyarakat itu berkembang pesat.' },
          { text: 'It is her patience that I admire.', isCorrect: true, translation: 'Adalah kesabarannya yang saya kagumi.' },
          { text: 'It was yesterday that the decision was made.', isCorrect: true, translation: 'Kemarin-lah keputusan itu dibuat.' }
        ]
      },
      {
        heading: '2. Wh-Cleft (Pseudo-Cleft): Menekankan Kebutuhan dan Keinginan',
        content: 'Wh-Cleft diletakkan di awal kalimat menggunakan kata tanya seperti *What, Where, atau Why*. Bentuk yang paling umum adalah "What I need is...". Struktur ini memposisikan seluruh klausa sebagai subjek, menciptakan ketegangan yang membuat pembaca menunggu hasil akhirnya di belakang kalimat.\n\nTeknik ini sangat puitis dan retoris. Alih-alih berkata "I need peace", Anda berkata "What I need is peace." Perubahan ini memberikan bobot emosional yang jauh lebih besar. Di level C1, penguasaan Wh-Cleft menunjukkan bahwa Anda mampu berkomunikasi tidak hanya secara informatif, tapi juga secara persuasif.',
        formula: 'What ... + is/was + [Fokus]',
        exceptions: 'Kata "What" dalam pseudo-cleft biasanya merujuk pada benda atau aksi, bukan orang.',
        examples: [
          { text: 'What he said was very inspiring.', isCorrect: true, translation: 'Apa yang dia katakan sangat menginspirasi.' },
          { text: 'What we need is more cooperation.', isCorrect: true, translation: 'Apa yang kita butuhkan adalah lebih banyak kerjasama.' },
          { text: 'What she loves is reading the Quran.', isCorrect: true, translation: 'Apa yang dia sukai adalah membaca Al-Quran.' },
          { text: 'What matters is your sincerity.', isCorrect: true, translation: 'Apa yang penting adalah keikhlasanmu.' },
          { text: 'What happened was a total surprise.', isCorrect: true, translation: 'Apa yang terjadi adalah kejutan total.' }
        ]
      },
      {
        heading: '3. Clefting dengan Kata "ALL"',
        content: 'Variasi menarik dari Wh-Cleft adalah menggunakan kata "All" (Hanya). Struktur ini memberikan kesan eksklusivitas atau kesederhanaan yang mendalam. "All I want is your happiness." Di sini, "All" bertindak sebagai pembatas yang mempersempit fokus pembaca pada satu hal saja.\n\nDalam konteks spiritual atau pidato motivasi, struktur ini sangat sering digunakan untuk menunjukkan fokus tunggal pada tujuan mulia. Ia terdengar tulus, rendah hati, namun sangat berwibawa. Memahami kapan harus menggunakan "All" alih-alih "What" adalah tanda kepekaan Anda terhadap nuansa emosi dalam bahasa Inggris.',
        formula: 'All + S + V + is/was + [Fokus]',
        exceptions: 'Kata "All" di sini bermakna "The only thing" (satu-satunya hal).',
        examples: [
          { text: 'All I ask is for your honesty.', isCorrect: true, translation: 'Yang saya minta hanyalah kejujuranmu.' },
          { text: 'All he did was smile at the children.', isCorrect: true, translation: 'Yang dia lakukan hanyalah tersenyum pada anak-anak.' },
          { text: 'All we need is a bit more time.', isCorrect: true, translation: 'Yang kita butuhkan hanyalah sedikit lebih banyak waktu.' },
          { text: 'All she wants is to learn Arabic.', isCorrect: true, translation: 'Yang dia inginkan hanyalah belajar bahasa Arab.' },
          { text: 'All that matters is his safety.', isCorrect: true, translation: 'Yang terpenting hanyalah keselamatannya.' }
        ]
      },
      {
        heading: '4. Menekankan Tempat dan Waktu (Where & When Cleft)',
        content: 'Cleft sentences juga bisa digunakan untuk memberikan spotlight pada lokasi atau waktu kejadian. "Medina is where the Prophet lived" memberikan penekanan geografis yang kuat. "Friday is when we gather" memberikan penekanan temporal.\n\nStruktur ini sangat berguna dalam penulisan sejarah atau panduan perjalanan. Ia membantu pendengar membangun pemetaan mental yang jelas tentang peristiwa besar. Dengan membelah kalimat menjadi dua bagian, Anda memberikan jeda yang cukup bagi otak pendengar untuk memproses pentingnya lokasi atau waktu tersebut bagi narasi Anda.',
        formula: '[Place/Time] + is + where/when ...',
        exceptions: 'Gunakan untuk memberikan spotlight pada lokasi atau waktu kejadian.',
        examples: [
          { text: 'Medina is where our history changed.', isCorrect: true, translation: 'Madinah adalah tempat di mana sejarah kita berubah.' },
          { text: 'Dawn is when the world is most peaceful.', isCorrect: true, translation: 'Fajar adalah saat di mana dunia paling damai.' },
          { text: 'The library is where I find my inspiration.', isCorrect: true, translation: 'Perpustakaan adalah tempat di mana saya menemukan inspirasi.' },
          { text: 'Ramadan is when we find our inner strength.', isCorrect: true, translation: 'Ramadhan adalah saat di mana kita menemukan kekuatan batin.' },
          { text: 'Friday is when the community unites.', isCorrect: true, translation: 'Jumat adalah saat di mana komunitas bersatu.' }
        ]
      },
      {
        heading: '5. Konteks Integritas: Menegaskan Kebenaran',
        content: 'Dalam Islam, kebenaran (Haqq) harus ditegaskan dengan jelas. Cleft sentences membantu kita menyatakan prinsip-prinsip iman dengan tegas. "It is Allah who sustains us." Kalimat ini bukan sekadar informasi, tapi deklarasi tauhid yang sangat kuat secara gramatikal.\n\nBahasa yang terfokus mencerminkan hati yang teguh (Istiqomah). Gunakanlah struktur cleft untuk menonjolkan nilai-nilai luhur dan memberikan apresiasi yang pantas kepada orang-orang mulia dalam narasi Anda. Ketajaman bahasa adalah wujud dari keberanian intelektual seorang pembelajar yang berpegang teguh pada kebenaran.',
        formula: 'It is [Allah/Truth/Value] + who/that ...',
        exceptions: 'Gunakan untuk memperjelas prinsip utama dalam sebuah argumen spiritual.',
        examples: [
          { text: 'It is the Quran that guides our path.', isCorrect: true, translation: 'Adalah Al-Quran yang membimbing jalan kita.' },
          { text: 'What we seek is Allah\'s pleasure.', isCorrect: true, translation: 'Apa yang kita cari adalah ridha Allah.' },
          { text: 'It was the Sahabah who spread the light of Islam.', isCorrect: true, translation: 'Adalah para Sahabat yang menyebarkan cahaya Islam.' },
          { text: 'All that remains after death is our good deeds.', isCorrect: true, translation: 'Hanyalah amal baik kita yang tersisa setelah kematian.' },
          { text: 'Patience is what helps us face trials.', isCorrect: true, translation: 'Kesabaran adalah apa yang membantu kita menghadapi cobaan.' }
        ]
      }
    ],
    mindmap: {
      id: 'c1-cleft-root', label: 'CLEFT SENTENCES', type: 'root', children: [
        { id: 'it-c', label: 'IT-Cleft (The Spotlight)', type: 'main', children: [
          { id: 'it-f', label: 'It is/was + [Target] + that...', type: 'formula' }
        ]},
        { id: 'wh-c', label: 'WH-Cleft (The Build-up)', type: 'main', children: [
          { id: 'wh-f', label: 'What [Action] + is/was + [Target]', type: 'formula' }
        ]},
        { id: 'all-c', label: 'ALL-Cleft (Exclusivity)', type: 'main', children: [
          { id: 'all-f', label: 'All [Subject] did/wants + is...', type: 'formula' }
        ]}
      ]
    }
  },
  {
    id: 'c1-future-perfect-continuous',
    title: '5. Future Perfect Continuous',
    level: 'C1',
    icon: 'fa-hourglass-half',
    description: 'Mampu memproyeksikan akumulasi waktu dan dedikasi sebuah aksi hingga ke titik tertentu di masa depan.',
    sections: [
      {
        heading: '1. Konsep Akumulasi: Menghitung Investasi Waktu',
        content: 'Future Perfect Continuous (will have been + V-ing) adalah tenses yang paling jarang digunakan namun memberikan nuansa "pencapaian" yang sangat megah. Ia digunakan untuk menyatakan SEBERAPA LAMA sebuah aksi akan sudah berlangsung pada titik waktu tertentu di masa depan.\n\nBayangkan Anda sedang belajar bahasa Inggris sekarang. Jika Anda konsisten, tahun depan Anda bisa berkata: "By next year, I will have been learning English for two years." Tenses ini tidak fokus pada selesainya aksi, tapi pada akumulasi usaha dan dedikasi waktu yang telah Anda investasikan dalam perjuangan tersebut.',
        formula: 'S + will have been + V-ing',
        exceptions: 'Hanya digunakan untuk aksi yang terus berlanjut (continuous); tidak untuk kata kerja statis (state verbs).',
        examples: [
          { text: 'By December, I will have been working here for a decade.', isCorrect: true, translation: 'Pada bulan Desember, saya akan sudah bekerja di sini selama satu dekade.' },
          { text: 'In two hours, we will have been driving for 500 miles.', isCorrect: true, translation: 'Dalam dua jam, kita akan sudah berkendara sejauh 500 mil.' },
          { text: 'By next Ramadan, she will have been fasting for 20 years.', isCorrect: true, translation: 'Pada Ramadhan berikutnya, dia akan sudah berpuasa selama 20 tahun.' },
          { text: 'By 5 PM, they will have been playing for three hours.', isCorrect: true, translation: 'Pada jam 5 sore, mereka akan sudah bermain selama tiga jam.' },
          { text: 'How long will you have been living here by 2030?', isCorrect: true, translation: 'Berapa lama kamu akan sudah tinggal di sini pada tahun 2030?' }
        ]
      },
      {
        heading: '2. Syarat Penggunaan: Durasi dan Deadline',
        content: 'Ada dua elemen wajib dalam tenses ini: DURASI (for 2 hours, for a long time) dan TITIK WAKTU MASA DEPAN (by next Monday, by the time you arrive). Tanpa kedua elemen ini, kalimat Anda tidak akan memiliki konteks akumulasi yang kuat.\n\nPenggunaan "By the time" seringkali memicu kalimat majemuk. Ingatlah aturan: setelah "By the time," gunakan Present Simple, bukan Future. Contoh: "By the time you *arrive* (Present), I *will have been waiting* (Future Perf Cont) for an hour." Ketelitian sinkronisasi waktu ini adalah tanda kematangan linguistik level C1.',
        formula: 'By the time + S + V1 (Present), S + will have been + V-ing',
        exceptions: 'Setelah kata "By the time", kita menggunakan Present Simple, bukan Future.',
        examples: [
          { text: 'By the time she graduates, she will have been studying for four years.', isCorrect: true, translation: 'Pada saat dia lulus, dia akan sudah belajar selama empat tahun.' },
          { text: 'We will have been waiting for hours by the time the bus arrives.', isCorrect: true, translation: 'Kita akan sudah menunggu selama berjam-jam pada saat bis itu datang.' },
          { text: 'I will have been learning Arabic for months by then.', isCorrect: true, translation: 'Saya akan sudah belajar bahasa Arab selama berbulan-bulan pada saat itu.' },
          { text: 'By midnight, it will have been raining for ten hours.', isCorrect: true, translation: 'Pada tengah malam, hujan akan sudah turun selama sepuluh jam.' },
          { text: 'They will have been traveling for a week by next Friday.', isCorrect: true, translation: 'Mereka akan sudah bepergian selama seminggu pada hari Jumat depan.' }
        ]
      },
      {
        heading: '3. State Verbs: Batasan Continuous',
        content: 'Penting untuk diingat bahwa kata kerja statis (*State Verbs*) seperti "know, believe, love, own, understand" TIDAK BOLEH masuk ke bentuk Continuous. Jika Anda ingin menyatakan durasi untuk kata-kata ini, gunakanlah Future Perfect Simple (will have + V3).\n\nKesalahan umum adalah berkata "I will have been knowing him." Bentuk yang benar: "I will have known him for years." Memahami batasan ini menunjukkan bahwa Anda memiliki insting bahasa yang sangat tajam dan tidak terjebak dalam rumus "-ing" secara membabi buta.',
        formula: 'S + will have + V3 (Simple, for state verbs)',
        exceptions: 'Kata kerja statis seperti know, believe, understand tidak boleh menggunakan bentuk continuous.',
        examples: [
          { text: 'By next year, I will have known Ali for five years.', isCorrect: true, translation: 'Pada tahun depan, saya akan sudah mengenal Ali selama lima tahun.' },
          { text: 'She will have owned this car for a decade by August.', isCorrect: true, translation: 'Dia akan sudah memiliki mobil ini selama satu dekade pada bulan Agustus.' },
          { text: 'I will have been studying for three hours.', isCorrect: true, translation: 'Saya akan sudah belajar selama tiga jam.' },
          { text: 'We will have lived here for long.', isCorrect: true, translation: 'Kita akan sudah lama tinggal di sini.' },
          { text: 'They will have been practicing for months.', isCorrect: true, translation: 'Mereka akan sudah berlatih selama berbulan-bulan.' }
        ]
      },
      {
        heading: '4. Nuansa Prediksi dan Kelelahan',
        content: 'Selain durasi, tenses ini juga bisa digunakan untuk memprediksi penyebab dari sebuah kondisi di masa depan. Misalnya, jika Anda tahu besok Ali akan lari maraton selama 5 jam, Anda bisa berasumsi: "He will be exhausted because he will have been running all morning."\n\nPenggunaan ini memberikan kedalaman pada karakter atau subjek dalam cerita Anda. Anda tidak hanya menyebutkan mereka lelah, tapi memberikan alasan berupa proses yang panjang. Ini adalah teknik narasi yang sangat berguna bagi penulis profesional untuk membangun empati dan realisme dalam teks mereka.',
        formula: 'S + will be [status] because S + will have been + V-ing',
        exceptions: 'Gunakan untuk menjelaskan alasan logis di balik kondisi fisik atau mental di masa depan.',
        examples: [
          { text: 'You will be tired because you will have been studying all night.', isCorrect: true, translation: 'Kamu akan lelah karena kamu akan sudah belajar sepanjang malam.' },
          { text: 'She will be hungry because she will have been fasting for 14 hours.', isCorrect: true, translation: 'Dia akan lapar karena dia akan sudah berpuasa selama 14 jam.' },
          { text: 'The engine will be hot because it will have been running for days.', isCorrect: true, translation: 'Mesin itu akan panas karena ia akan sudah berjalan selama berhari-hari.' },
          { text: 'They will be happy because they will have been learning all week.', isCorrect: true, translation: 'Mereka akan senang karena mereka akan sudah belajar sepanjang minggu.' },
          { text: 'I will be fit because I will have been exercising regularly.', isCorrect: true, translation: 'Saya akan bugar karena saya akan sudah berolahraga secara teratur.' }
        ]
      },
      {
        heading: '5. Konteks Mujahadah: Istiqomah yang Terakumulasi',
        content: 'Dalam Islam, nilai sebuah amal seringkali diukur dari keistiqomahannya. Future Perfect Continuous membantu kita memvisualisasikan "gunung pahala" dari akumulasi kebaikan harian kita. "InshaAllah, I will have been reciting the Quran every day for years when I meet my Lord."\n\nVisualisasi masa depan ini memberikan energi (Himmah) bagi kita untuk terus berproses hari ini. Bahasa proyeksi waktu ini mengingatkan kita bahwa setiap detik yang kita habiskan untuk belajar atau beribadah sedang tercatat dan terakumulasi menjadi sejarah hidup yang mulia di masa depan. Gunakan tenses ini sebagai penyemangat jiwa dalam perjalanan mencari ilmu.',
        formula: 'InshaAllah, S + will have been + V-ing ... [point in future]',
        exceptions: 'Gunakan untuk visualisasi amal shaleh yang berkelanjutan sebagai motivasi spiritual.',
        examples: [
          { text: 'InshaAllah, I will have been seeking knowledge all my life.', isCorrect: true, translation: 'InshaAllah, saya akan sudah menuntut ilmu sepanjang hidup saya.' },
          { text: 'By next Eid, we will have been helping the needy for three years.', isCorrect: true, translation: 'Pada Idul Fitri depan, kita akan sudah membantu orang miskin selama tiga tahun.' },
          { text: 'She will have been wearing the hijab for a decade next June, InshaAllah.', isCorrect: true, translation: 'Dia akan sudah mengenakan jilbab selama satu dekade pada Juni depan, InshaAllah.' },
          { text: 'The community will have been growing for years by then.', isCorrect: true, translation: 'Komunitas ini akan sudah berkembang selama bertahun-tahun pada saat itu.' },
          { text: 'I will have been practicing patience in every trial, InshaAllah.', isCorrect: true, translation: 'Saya akan sudah melatih kesabaran dalam setiap ujian, InshaAllah.' }
        ]
      }
    ],
    mindmap: {
      id: 'c1-fpc-root', label: 'FUTURE PERFECT CONT', type: 'root', children: [
        { id: 'logic-fpc', label: 'Duration up to a point', type: 'main', children: [
          { id: 'accum', label: 'Accumulated Effort', type: 'sub' },
          { id: 'cause', label: 'Cause of future state', type: 'sub' }
        ]},
        { id: 'struc-fpc', label: 'Structure', type: 'formula', children: [
          { id: 'form-fpc', label: 'Will have been + V-ing', type: 'formula' },
          { id: 'markers-fpc', label: 'By [time] + For [duration]', type: 'warning' }
        ]},
        { id: 'stat-fpc', label: 'State Verbs Restriction', type: 'warning', detail: 'Use Future Perfect Simple instead.' }
      ]
    }
  },
  {
    id: 'c1-nominalization',
    title: '6. Advanced Nominalization',
    level: 'C1',
    icon: 'fa-font',
    description: 'Teknik mengubah kata kerja dan kata sifat menjadi kata benda untuk menciptakan teks yang objektif, padat, dan berwibawa.',
    sections: [
      {
        heading: '1. Logika Densitas: Dari Aksi ke Konsep',
        content: 'Nominalisasi adalah proses mengubah kata kerja (Verb) atau kata sifat (Adjective) menjadi kata benda (Noun). Di level C1, nominalisasi adalah kunci utama untuk menulis secara akademik dan profesional. Ia memungkinkan Anda untuk mengemas informasi yang kompleks menjadi satu konsep tunggal yang padat.\n\nBandingkan: "We analyzed the data and then we concluded that..." (Biasa) dengan "The analysis of the data led to the conclusion that..." (Nominalisasi). Perhatikan bagaimana kalimat kedua terdengar lebih objektif dan otoritatif. Ia menggeser fokus dari SIAPA yang melakukannya ke APA konsep yang sedang dibahas.',
        formula: 'Verb/Adj -> Noun transformation',
        exceptions: 'Beberapa kata benda memiliki bentuk yang sama dengan kata kerjanya (misal: "increase", "change").',
        examples: [
          { text: 'Reaction: The success of the project was amazing.', isCorrect: true, translation: 'Keberhasilan proyek itu sangat luar biasa.' },
          { text: 'Information: The distribution of wealth is essential.', isCorrect: true, translation: 'Distribusi kekayaan sangatlah penting.' },
          { text: 'Analysis: Her persistence led to victory.', isCorrect: true, translation: 'Kegigihannya membuahkan kemenangan.' },
          { text: 'Observation: The investigation lasted for weeks.', isCorrect: true, translation: 'Investigasi tersebut berlangsung selama berminggu-minggu.' },
          { text: 'Conclusion: Our agreement was reached quickly.', isCorrect: true, translation: 'Kesepakatan kita tercapai dengan cepat.' }
        ]
      },
      {
        heading: '2. Menciptakan Objektivitas dalam Esai',
        content: 'Dalam penulisan esai atau laporan, terlalu banyak menggunakan kata "I" atau "People" bisa membuat tulisan terasa terlalu personal atau kurang ilmiah. Nominalisasi membantu Anda menghilangkan pelaku (Agent) dan fokus pada fenomena atau proses itu sendiri.\n\nMisalnya, alih-alih berkata "Scientists observed how the temperature rose," Anda bisa menulis "The observation of the temperature rise..." Teknik ini sangat krusial saat Anda menulis abstrak penelitian, tesis, atau korespondensi resmi di mana keakuratan konsep lebih diutamakan daripada narasi personal.',
        formula: 'The + [Nominalization] + of ...',
        exceptions: 'Gunakan untuk menghilangkan subjek personal (I, We) agar teks terdengar lebih ilmiah.',
        examples: [
          { text: 'The implementation of the new law began yesterday.', isCorrect: true, translation: 'Implementasi hukum baru tersebut dimulai kemarin.' },
          { text: 'Rapid urbanization causes many social issues.', isCorrect: true, translation: 'Urbanisasi yang cepat menyebabkan banyak masalah sosial.' },
          { text: 'His rejection of the offer was unexpected.', isCorrect: true, translation: 'Penolakannya terhadap tawaran itu tidak terduga.' },
          { text: 'Scientific discovery requires patience.', isCorrect: true, translation: 'Penemuan ilmiah membutuhkan kesabaran.' },
          { text: 'The expansion of the city is inevitable.', isCorrect: true, translation: 'Ekspansi kota tersebut tidak terhindarkan.' }
        ]
      },
      {
        heading: '3. Kompresi Kalimat Majemuk',
        content: 'Nominalisasi memungkinkan Anda untuk menggabungkan beberapa kalimat menjadi satu struktur yang sangat efisien. Dengan mengubah rangkaian aksi menjadi satu frasa benda (Noun Phrase), Anda memberikan ruang lebih banyak untuk analisis tambahan dalam satu paragraf yang sama.\n\nContoh: "They failed because they didn\'t prepare" menjadi "The failure was due to lack of preparation." Kalimat kedua memberikan struktur yang lebih kuat untuk ditambahkan informasi lain di belakangnya. Ini adalah seni membangun "densitas leksikal" yang membedakan penulis amatir dengan penulis mahir.',
        formula: '[Noun Phrase] + is/was + due to / led to ...',
        exceptions: 'Nominalisasi membantu membangun "densitas leksikal" yang tinggi dalam tulisan.',
        examples: [
          { text: 'The sudden disappearance of the evidence shocked the court.', isCorrect: true, translation: 'Hilangnya bukti secara tiba-tiba mengejutkan pengadilan.' },
          { text: 'Careful preparation is the key to a good presentation.', isCorrect: true, translation: 'Persiapan yang matang adalah kunci presentasi yang baik.' },
          { text: 'Environmental protection is our shared duty.', isCorrect: true, translation: 'Perlindungan lingkungan adalah tugas kita bersama.' },
          { text: 'Her deep understanding of the subject was clear.', isCorrect: true, translation: 'Pemahamannya yang mendalam tentang subjek tersebut terlihat jelas.' },
          { text: 'The fluctuation in prices affected the market.', isCorrect: true, translation: 'Fluktuasi harga memengaruhi pasar.' }
        ]
      },
      {
        heading: '4. Perubahan Suffix dan Pola Kata',
        content: 'Menguasai nominalisasi menuntut Anda untuk sangat akrab dengan akhiran kata benda (Suffixes) seperti *-tion, -ment, -ity, -ance, dan -ness*. Anda harus mampu mengubah kata secara instan: *Decide -> Decision, Improve -> Improvement, Stable -> Stability*.\n\nSelain akhiran, perhatikan juga perubahan preposisi yang menyertainya. Kata kerja "rely ON" berubah menjadi "reliance ON". Ketepatan dalam memasangkan preposisi setelah nominalisasi adalah detail halus yang sering menjadi ujian dalam tes bahasa internasional tingkat tinggi seperti IELTS atau TOEFL.',
        formula: '-tion, -ment, -ity, -ance, -ness',
        exceptions: 'Hati-hati dengan perubahan preposisi setelah nominalisasi (misal: "rely on" -> "reliance on").',
        examples: [
          { text: 'Reliance on technology is increasing.', isCorrect: true, translation: 'Ketergantungan pada teknologi semakin meningkat.' },
          { text: 'Commitment to education is vital.', isCorrect: true, translation: 'Komitmen terhadap pendidikan sangatlah vital.' },
          { text: 'The frequency of prayers brings peace.', isCorrect: true, translation: 'Frekuensi shalat membawa kedamaian.' },
          { text: 'Resistance to change is normal.', isCorrect: true, translation: 'Resistensi terhadap perubahan adalah hal yang normal.' },
          { text: 'Preference for organic food is growing.', isCorrect: true, translation: 'Preferensi terhadap makanan organik semakin tumbuh.' }
        ]
      },
      {
        heading: '5. Konteks Hikmah: Bahasa Konseptual yang Mulia',
        content: 'Dalam tradisi keilmuan Islam, penggunaan kata benda abstrak untuk menjelaskan konsep iman sangatlah umum (seperti *Ikhlas, Sabr, Tawakkal*). Nominalisasi membantu kita mentransformasikan aksi ibadah menjadi prinsip hidup yang kokoh dalam bahasa Inggris.\n\nAlih-alih hanya berkata "We should be patient," menggunakan nominalisasi "The practice of patience" memberikan kedalaman makna bahwa kesabaran adalah sebuah sistem atau disiplin ilmu. Gunakanlah nominalisasi untuk mengangkat topik-topik spiritual ke level diskusi intelektual yang lebih tinggi dan bermartabat.',
        formula: 'The practice of [Virtue] + is ...',
        exceptions: 'Gunakan nominalisasi untuk mengangkat topik spiritual ke level diskusi intelektual.',
        examples: [
          { text: 'The pursuit of knowledge is an obligation.', isCorrect: true, translation: 'Menuntut ilmu adalah sebuah kewajiban.' },
          { text: 'The development of character starts at home.', isCorrect: true, translation: 'Pengembangan karakter dimulai dari rumah.' },
          { text: 'Sincerity of heart is the core of every deed.', isCorrect: true, translation: 'Keikhlasan hati adalah inti dari setiap amal.' },
          { text: 'The spread of peace is our primary goal.', isCorrect: true, translation: 'Penyebaran perdamaian adalah tujuan utama kita.' },
          { text: 'Gratitude for blessings increases our favors.', isCorrect: true, translation: 'Rasa syukur atas nikmat meningkatkan karunia-Nya.' }
        ]
      }
    ],
    mindmap: {
      id: 'c1-nom-root', label: 'NOMINALIZATION', type: 'root', children: [
        { id: 'logic-n', label: 'Concept Focus', type: 'main', children: [
          { id: 'obj-n', label: 'Academic Objectivity', type: 'sub' },
          { id: 'den-n', label: 'Lexical Density', type: 'sub' }
        ]},
        { id: 'suff-n', label: 'Common Suffixes', type: 'formula', children: [
          { id: 'tion', label: '-tion, -ment, -ity', type: 'sub' },
          { id: 'ance', label: '-ance, -ence, -ness', type: 'sub' }
        ]},
        { id: 'prep-n', label: 'Preposition Shift', type: 'warning', detail: 'Verb + Prep -> Noun + Prep (Rely on -> Reliance on)' }
      ]
    }
  },
  {
    id: 'c1-ellipsis-substitution',
    title: '7. Ellipsis and Substitution',
    level: 'C1',
    icon: 'fa-ghost',
    description: 'Teknik menghindari pengulangan kata yang membosankan untuk menciptakan percakapan dan tulisan yang cerdas serta efisien.',
    sections: [
      {
        heading: '1. Logika Efisiensi: Menghapus yang Sudah Jelas',
        content: 'Ellipsis adalah penghilangan kata-kata yang maknanya sudah dipahami dari konteks sebelumnya. Di level C1, ellipsis bukan sekadar malas bicara, melainkan cara untuk membuat komunikasi menjadi "lean" atau ramping. Ini menunjukkan bahwa Anda percaya pada kecerdasan lawan bicara Anda.\n\nDalam tulisan formal, ellipsis membantu Anda menghindari pengulangan subjek atau kata kerja bantu yang monoton. Contoh: "He can speak Arabic and (he can) write it too." Dengan menghilangkan bagian dalam kurung, kalimat Anda terdengar jauh lebih alami dan tajam. Ini adalah tanda kefasihan tingkat lanjut yang sangat dihargai dalam interaksi sosial profesional.',
        formula: '[Omitted Word] based on context',
        exceptions: 'Subjek atau kata kerja yang dihilangkan harus sudah disebutkan sebelumnya.',
        examples: [
          { text: 'I’ve been to Mecca, but Ali hasn\'t.', isCorrect: true, translation: 'Saya sudah pernah ke Mekkah, tapi Ali belum.' },
          { text: 'He likes tea, and she (likes) coffee.', isCorrect: true, translation: 'Dia suka teh, dan dia (suka) kopi.' },
          { text: 'Are you coming? I hope so.', isCorrect: true, translation: 'Apakah kamu ikut? Saya harap begitu.' },
          { text: 'If (it is) possible, let me know.', isCorrect: true, translation: 'Jika memungkinkan, beri tahu saya.' },
          { text: 'I went home after (I had) finished the work.', isCorrect: true, translation: 'Saya pulang setelah selesai mengerjakan tugas.' }
        ]
      },
      {
        heading: '2. Substitution dengan "DO" dan "SO"',
        content: 'Substitution adalah mengganti sebuah frasa atau seluruh ide dengan satu kata pendek seperti "Do, So, atau Not". Ini mencegah kita mengulang seluruh kalimat yang panjang. Contoh: "Do you think it will rain?" - "I think *so*."\n\nKata "Do" sangat kuat sebagai pengganti kata kerja aksi dalam perbandingan atau penegasan: "He works harder than his brother *does*." Menggunakan substitution menunjukkan bahwa Anda memiliki kontrol yang baik atas struktur teks secara keseluruhan (Textual Cohesion) dan mampu menjaga aliran ide tetap jernih tanpa beban kata-kata berlebih.',
        formula: 'Subject + do/does/did (as replacement)',
        exceptions: '"So" menggantikan seluruh klausa; "Do" menggantikan frasa kata kerja.',
        examples: [
          { text: 'She speaks well, and so does her sister.', isCorrect: true, translation: 'Dia bicara dengan baik, begitu juga saudara perempuannya.' },
          { text: 'Will they arrive on time? I believe so.', isCorrect: true, translation: 'Apakah mereka akan sampai tepat waktu? Saya rasa begitu.' },
          { text: 'He didn\'t win, but he hoped to (win).', isCorrect: true, translation: 'Dia tidak menang, tapi dia berharap untuk menang.' },
          { text: 'If you want to leave, you should (leave).', isCorrect: true, translation: 'Jika kamu ingin pergi, kamu harus pergi.' },
          { text: 'I don\'t think he is coming, but I hope not.', isCorrect: true, translation: 'Saya rasa dia tidak akan datang, tapi saya harap tidak demikian.' }
        ]
      },
      {
        heading: '3. Substitution dengan "ONE" dan "ONES"',
        content: 'Saat membicarakan benda, kita sering menggunakan kata "One" (tunggal) atau "Ones" (jamak) untuk mengganti kata benda yang sudah disebutkan sebelumnya. Ini sangat krusial saat kita melakukan perbandingan atau memberikan pilihan di antara beberapa objek.\n\nContoh: "I don\'t like this pen, give me the red *one*." Tanpa substitution, bahasa kita akan terdengar seperti anak kecil yang terus mengulang kata "pen, pen, pen". Penguasaan teknik ini memberikan nuansa kedewasaan dalam pemilihan kata dan menunjukkan bahwa Anda sangat memperhatikan kenyamanan pendengar.',
        formula: '[Adjective] + one/ones',
        exceptions: '"One" untuk benda tunggal, "Ones" untuk benda jamak.',
        examples: [
          { text: 'These books are old; I need some new ones.', isCorrect: true, translation: 'Buku-buku ini sudah tua; saya butuh yang baru.' },
          { text: 'Which car is yours? The blue one.', isCorrect: true, translation: 'Mobil yang mana milikmu? Yang biru.' },
          { text: 'The lessons today were harder than the ones yesterday.', isCorrect: true, translation: 'Pelajaran hari ini lebih sulit daripada yang kemarin.' },
          { text: 'If you need a pen, I have one.', isCorrect: true, translation: 'Jika kamu butuh pena, saya punya satu.' },
          { text: 'I prefer large rooms to small ones.', isCorrect: true, translation: 'Saya lebih suka kamar yang besar daripada yang kecil.' }
        ]
      },
      {
        heading: '4. Ellipsis dalam Percakapan Cepat (Informal)',
        content: 'Dalam percakapan lisan yang sangat cepat, penutur asli sering menghilangkan subjek atau kata kerja bantu di awal kalimat jika sudah sangat jelas dari situasi. Contoh: "(Have you) Finished yet?" atau "(I) See you later."\n\nMemahami ellipsis lisan ini akan secara drastis meningkatkan kemampuan mendengarkan (listening) Anda. Anda tidak akan bingung saat mendengar kalimat yang "tidak lengkap" karena Anda tahu bagian mana yang sengaja dihilangkan. Latihlah ini dalam konteks yang tepat agar Anda terdengar lebih natural dan akrab dengan ritme bicara asli.',
        formula: '(Aux/Subject) + Rest of sentence',
        exceptions: 'Hanya digunakan dalam situasi santai atau percakapan lisan.',
        examples: [
          { text: '(Are) You okay?', isCorrect: true, translation: '(Apakah) kamu baik-baik saja?' },
          { text: '(I) Love it!', isCorrect: true, translation: '(Saya) sangat menyukainya!' },
          { text: '(Do you) Want some water?', isCorrect: true, translation: '(Apakah kamu) mau minum?' },
          { text: '(It) Sounds good.', isCorrect: true, translation: '(Itu) kedengarannya bagus.' },
          { text: '(Does) Anyone want coffee?', isCorrect: true, translation: '(Apakah) ada yang mau kopi?' }
        ]
      },
      {
        heading: '5. Konteks Amanah: Ringkas namun Jelas',
        content: 'Dalam Adab Islam, kita diperintahkan untuk berbicara yang ringkas namun padat makna (*Jawami\'ul Kalim*). Ellipsis dan substitution adalah wujud nyata dari prinsip ini dalam bahasa Inggris. Kita menghilangkan kata yang berlebihan tanpa mengurangi kemuliaan maksud.\n\nNamun, pastikan bahwa ellipsis yang Anda lakukan tidak menimbulkan fitnah atau kesalahpahaman. Jika menghilangkan sebuah kata membuat makna menjadi ganda (ambigu), maka menyebutkan secara lengkap adalah bagian dari kejujuran. Bahasa yang cerdas adalah bahasa yang tahu kapan harus diam dan kapan harus bicara secara utuh demi menjaga kebenaran.',
        formula: 'Jawami\'ul Kalim (Concise Speech)',
        exceptions: 'Jangan melakukan ellipsis jika bisa menimbulkan fitnah atau ambiguitas.',
        examples: [
          { text: 'He promised to help, and he did (help).', isCorrect: true, translation: 'Dia berjanji akan membantu, dan dia membantunya.' },
          { text: 'Recite what is easy for you (to recite).', isCorrect: true, translation: 'Bacalah apa yang mudah bagimu.' },
          { text: 'Give charity even if (it is) only a little.', isCorrect: true, translation: 'Bersedekahlah meskipun hanya sedikit.' },
          { text: 'I hope we meet in Jannah. I hope so too.', isCorrect: true, translation: 'Saya harap kita bertemu di Jannah. Saya juga berharap demikian.' },
          { text: 'Seek knowledge, and do (seek it) with sincerity.', isCorrect: true, translation: 'Tuntutlah ilmu, dan lakukanlah dengan ikhlas.' }
        ]
      }
    ],
    mindmap: {
      id: 'c1-els-root', label: 'ELLIPSIS & SUBSTITUTION', type: 'root', children: [
        { id: 'els-m', label: 'Ellipsis (Removal)', type: 'main', children: [
          { id: 'aux-e', label: 'Auxiliary/Subject Removal', type: 'sub' },
          { id: 'inf-e', label: 'Informal short forms', type: 'sub' }
        ]},
        { id: 'sub-m', label: 'Substitution (Replacement)', type: 'main', children: [
          { id: 'so-not', label: 'So / Not (Whole ideas)', type: 'formula' },
          { id: 'one-s', label: 'One / Ones (Nouns)', type: 'formula' },
          { id: 'do-sub', label: 'Do / Does / Did (Verb phrases)', type: 'formula' }
        ]}
      ]
    }
  },
  {
    id: 'c1-advanced-modals',
    title: '8. Advanced Modals of Speculation',
    level: 'C1',
    icon: 'fa-search',
    description: 'Menguasai spekulasi tingkat lanjut tentang aksi yang sedang berlangsung atau berkelanjutan di masa lalu dengan nuansa kepastian yang presisi.',
    sections: [
      {
        heading: '1. Logika Investigasi: Modal + Have Been + V-ing',
        content: 'Di level C1, kita tidak hanya berspekulasi tentang APA yang terjadi, tapi tentang APA YANG MUNGKIN SEDANG BERLANGSUNG pada saat itu. Kita menggunakan struktur **Modal + Have Been + Verb-ing**. Struktur ini memberikan nuansa analisis yang sangat mendalam dan profesional.\n\nContoh: "His eyes are red; he *must have been crying*." Di sini, Anda bukan sekadar menebak dia menangis, tapi Anda membayangkan proses menangis yang berlangsung lama sebelum Anda bertemu dengannya. Penguasaan pola ini menunjukkan bahwa Anda mampu melakukan investigasi logis yang sangat tajam terhadap bukti-bukti fisik di sekitar Anda.',
        formula: 'Must/Might/Could + have been + V-ing',
        exceptions: 'Digunakan untuk spekulasi tentang aksi yang sedang berlangsung di masa lalu.',
        examples: [
          { text: 'The ground is wet; it must have been raining all night.', isCorrect: true, translation: 'Tanah basah; pasti sudah hujan semalaman.' },
          { text: 'She looks tired; she might have been working late.', isCorrect: true, translation: 'Dia terlihat lelah; mungkin dia sudah bekerja lembur.' },
          { text: 'They can\'t have been sleeping; the noise was too loud.', isCorrect: true, translation: 'Mereka tidak mungkin sedang tidur; kebisingannya terlalu keras.' },
          { text: 'You should have been listening to the instructions.', isCorrect: true, translation: 'Kamu seharusnya sedang mendengarkan instruksi tersebut.' },
          { text: 'He could have been waiting for hours.', isCorrect: true, translation: 'Dia bisa saja sudah menunggu selama berjam-jam.' }
        ]
      },
      {
        heading: '2. Passive Speculation: Modal + Have Been + V3',
        content: 'Seringkali kita harus berspekulasi tentang objek yang "dikenai" aksi di masa lalu secara pasif. Strukturnya: **Modal + Have Been + Verb 3**. Ini sangat umum dalam laporan teknis, forensik, atau diskusi sejarah yang memerlukan objektivitas tinggi.\n\n"The window *must have been broken* from the inside." Kalimat ini memberikan kesan deduksi ilmiah yang sangat kuat. Memahami perbedaan antara aktif (...have been breaking) dan pasif (...have been broken) dalam spekulasi adalah pembeda utama antara pelajar tingkat menengah dan ahli bahasa tingkat lanjut.',
        formula: 'Must/Might/Could + have been + V3',
        exceptions: 'Digunakan untuk spekulasi pasif tentang apa yang telah dikenai aksi di masa lalu.',
        examples: [
          { text: 'The documents must have been stolen yesterday.', isCorrect: true, translation: 'Dokumen-dokumen itu pasti telah dicuri kemarin.' },
          { text: 'The city might have been built by ancient Romans.', isCorrect: true, translation: 'Kota itu mungkin telah dibangun oleh bangsa Romawi kuno.' },
          { text: 'The project should have been finished last week.', isCorrect: true, translation: 'Proyek itu seharusnya sudah selesai minggu lalu.' },
          { text: 'This cake can\'t have been made without sugar.', isCorrect: true, translation: 'Kue ini tidak mungkin dibuat tanpa gula.' },
          { text: 'The message could have been misunderstood.', isCorrect: true, translation: 'Pesan tersebut bisa saja telah disalahpahami.' }
        ]
      },
      {
        heading: '3. Nuansa "Should Have": Kritik terhadap Proses',
        content: 'Kata "Should have been + V-ing" membawa nada kritik atau penyesalan terhadap tanggung jawab yang terabaikan. Ia menunjukkan bahwa seseorang seharusnya sedang melakukan tugasnya namun kenyataannya tidak. Ini adalah bahasa manajemen dan akuntabilitas.\n\n"You should have been studying instead of playing." Kalimat ini memberikan tekanan yang lebih berat pada "durasi waktu yang terbuang" dibandingkan hanya sekadar "You should have studied". Memahami intensitas emosional di balik struktur berkelanjutan ini membantu Anda berkomunikasi dengan lebih bernuansa dalam situasi formal.',
        formula: 'Should have been + V-ing',
        exceptions: 'Gunakan untuk memberikan kritik atau penyesalan terhadap tanggung jawab yang terabaikan.',
        examples: [
          { text: 'The security guard should have been watching the gate.', isCorrect: true, translation: 'Petugas keamanan seharusnya sedang menjaga gerbang.' },
          { text: 'We should have been preparing for this crisis months ago.', isCorrect: true, translation: 'Kita seharusnya sudah mempersiapkan krisis ini berbulan-bulan yang lalu.' },
          { text: 'You should have been paying attention during the lecture.', isCorrect: true, translation: 'Kamu seharusnya sedang memperhatikan selama kuliah.' },
          { text: 'They should have been helping their mother.', isCorrect: true, translation: 'Mereka seharusnya sedang membantu ibu mereka.' },
          { text: 'I should have been practicing my English more often.', isCorrect: true, translation: 'Saya seharusnya sudah berlatih bahasa Inggris saya lebih sering.' }
        ]
      },
      {
        heading: '4. Speculation about Present Continuous',
        content: 'Kita juga bisa menggunakan modal untuk menebak aksi yang sedang terjadi DETIK INI di tempat lain: **Modal + Be + V-ing**. Contoh: "Don\'t call him; he *might be praying*." Ini memberikan kesan bahwa Anda sangat peka terhadap rutinitas dan kemungkinan tindakan orang lain.\n\nTeknik ini membantu Anda membangun narasi yang sinkron. Alih-alih hanya menebak status (He is happy), Anda menebak aktivitas (He is working). Kemampuan ini sangat vital dalam koordinasi tim internasional di mana anggota tim berada di zona waktu yang berbeda dan Anda harus berspekulasi tentang apa yang sedang mereka lakukan.',
        formula: 'Modal + be + V-ing',
        exceptions: 'Gunakan untuk menebak aksi yang sedang terjadi saat ini di tempat lain.',
        examples: [
          { text: 'She must be sleeping now; it\'s 3 AM in London.', isCorrect: true, translation: 'Dia pasti sedang tidur sekarang; ini jam 3 pagi di London.' },
          { text: 'They might be having lunch at this hour.', isCorrect: true, translation: 'Mereka mungkin sedang makan siang pada jam ini.' },
          { text: 'He can\'t be working today; it\'s a holiday.', isCorrect: true, translation: 'Dia tidak mungkin sedang bekerja hari ini; ini hari libur.' },
          { text: 'We should be arriving at the station soon.', isCorrect: true, translation: 'Kita seharusnya segera sampai di stasiun.' },
          { text: 'The kids could be playing in the garden.', isCorrect: true, translation: 'Anak-anak bisa saja sedang bermain di taman.' }
        ]
      },
      {
        heading: '5. Etika Investigasi: Menjaga Kehormatan Masa Lalu',
        content: 'Dalam Islam, spekulasi tentang masa lalu orang lain harus selalu didasari oleh *Husnudzon* (prasangka baik). Menggunakan Advanced Modals membantu kita memberikan ruang "mungkin" yang menyelamatkan kehormatan seseorang. "He might have been busy" jauh lebih mulia daripada langsung menuduh.\n\nBahasa spekulasi yang hati-hati adalah cerminan dari kerendahan hati intelektual. Kita mengakui bahwa kita tidak tahu segalanya, hanya Allah yang Maha Tahu. Gunakanlah struktur ini untuk membela saudara Anda dari tuduhan yang belum pasti, dan tunjukkan bahwa sebagai pembelajar mahir, lisan Anda adalah pelindung bagi martabat sesama.',
        formula: 'Husnudzon (Prasangka Baik)',
        exceptions: 'Gunakan spekulasi untuk melindungi kehormatan orang lain, bukan untuk menuduh.',
        examples: [
          { text: 'He must have been intending to do a good deed.', isCorrect: true, translation: 'Dia pasti berniat melakukan amal saleh.' },
          { text: 'She might have been facing a very difficult trial.', isCorrect: true, translation: 'Dia mungkin sedang menghadapi ujian yang sangat sulit.' },
          { text: 'There must have been a misunderstanding between them.', isCorrect: true, translation: 'Pasti ada kesalahpahaman di antara mereka.' },
          { text: 'The charity could have been distributed more fairly.', isCorrect: true, translation: 'Sedekah itu bisa saja dibagikan secara lebih adil.' },
          { text: 'We should have been more supportive of their efforts.', isCorrect: true, translation: 'Kita seharusnya lebih mendukung upaya mereka.' }
        ]
      }
    ],
    mindmap: {
      id: 'c1-mods-root', label: 'ADVANCED SPECULATION', type: 'root', children: [
        { id: 'past-cont-s', label: 'Past Continuous Speculation', type: 'main', children: [
          { id: 'f1-s', label: 'Modal + HAVE BEEN + V-ing', type: 'formula' },
          { id: 'u1-s', label: 'Ongoing action in the past', type: 'sub' }
        ]},
        { id: 'past-pass-s', label: 'Past Passive Speculation', type: 'main', children: [
          { id: 'f2-s', label: 'Modal + HAVE BEEN + V3', type: 'formula' },
          { id: 'u2-s', label: 'Passive result in the past', type: 'sub' }
        ]},
        { id: 'pres-cont-s', label: 'Present Continuous Guess', type: 'sub', detail: 'Modal + BE + V-ing (Guessing what happens NOW)' }
      ]
    }
  },
  {
    id: 'c1-compound-modifiers',
    title: '9. Compound Modifiers',
    level: 'C1',
    icon: 'fa-link',
    description: 'Membangun kata sifat majemuk yang sangat deskriptif dan teknis untuk efisiensi penulisan tingkat lanjut.',
    sections: [
      {
        heading: '1. Logika Deskripsi Padat: Menggabungkan Dua Kata',
        content: 'Compound modifiers adalah penggunaan dua atau lebih kata yang bekerja sama sebagai satu kata sifat tunggal untuk mendeskripsikan sebuah benda. Ciri khasnya adalah penggunaan tanda hubung (Hyphen). Contoh: "A *well-known* scholar" lebih ringkas daripada "A scholar who is known very well."\n\nDi level C1, teknik ini bukan lagi opsional, melainkan kebutuhan untuk mencapai densitas informasi yang tinggi. Ia memungkinkan Anda untuk memberikan detail visual atau teknis yang sangat kaya dalam waktu singkat. Penggunaan tanda hubung yang tepat menunjukkan ketelitian Anda dalam menjaga struktur makna agar tidak tertukar dengan kata benda lainnya.',
        formula: '[Word1]-[Word2] + Noun',
        exceptions: 'Tanda hubung (hyphen) sangat krusial untuk menjaga makna agar tidak ambigu.',
        examples: [
          { text: 'He is a world-renowned scientist.', isCorrect: true, translation: 'Dia adalah ilmuwan yang terkenal di seluruh dunia.' },
          { text: 'We need a long-term solution.', isCorrect: true, translation: 'Kita butuh solusi jangka panjang.' },
          { text: 'She is a highly-respected teacher.', isCorrect: true, translation: 'Dia adalah guru yang sangat dihormati.' },
          { text: 'It was a life-changing experience.', isCorrect: true, translation: 'Itu adalah pengalaman yang mengubah hidup.' },
          { text: 'They are hard-working students.', isCorrect: true, translation: 'Mereka adalah siswa yang pekerja keras.' }
        ]
      },
      {
        heading: '2. Pola Pembentukan: Adverb + Participle',
        content: 'Pola paling populer adalah menggabungkan kata keterangan dengan kata kerja partisipel. **Well- + V3** (well-educated) atau **Fast- + V-ing** (fast-moving). Pola ini memberikan nuansa profesional pada deskripsi Anda, sering ditemukan dalam literatur bisnis dan akademik.\n\nIngatlah aturan emasnya: tanda hubung digunakan hanya jika kata sifat majemuk tersebut berada SEBELUM kata benda. Jika ia berada setelah kata kerja (seperti "The scientist is well known"), maka tanda hubung biasanya dihilangkan. Memahami aturan posisi ini adalah tanda bahwa Anda adalah seorang penulis yang sangat teliti terhadap detail teknis.',
        formula: 'Well/Fast/... + V-ing/V3',
        exceptions: 'Tanda hubung hanya digunakan jika modifier berada SEBELUM kata benda.',
        examples: [
          { text: 'A beautifully-written letter.', isCorrect: true, translation: 'Surat yang ditulis dengan indah.' },
          { text: 'The letter was beautifully written.', isCorrect: true, note: 'No hyphen after verb.', translation: 'Surat itu ditulis dengan indah.' },
          { text: 'A brightly-lit room.', isCorrect: true, translation: 'Ruangan yang terang benderang.' },
          { text: 'A custom-built computer.', isCorrect: true, translation: 'Komputer yang dibuat khusus.' },
          { text: 'A long-lasting friendship.', isCorrect: true, translation: 'Persahabatan yang tahan lama.' }
        ]
      },
      {
        heading: '3. Noun + Participle: Visualisasi yang Kuat',
        content: 'Anda juga bisa menggabungkan kata benda dengan kata kerja untuk menciptakan gambaran aksi yang membeku. Contoh: **Heart-breaking** (noun+v-ing) atau **Sun-dried** (noun+v3). Pola ini sangat puitis namun sangat akurat secara deskriptif.\n\nDalam penulisan kreatif, pola ini membantu Anda melukis pemandangan dengan sangat efisien. Alih-alih menulis "Grapes that are dried by the sun," Anda cukup menulis "Sun-dried grapes." Ini memberikan ritme yang lebih cepat pada tulisan Anda, membuat pembaca tetap fokus pada alur utama tanpa terganggu oleh deskripsi yang bertele-tele.',
        formula: 'Noun + V-ing/V3 (Heart-breaking / Sun-dried)',
        exceptions: 'Menciptakan gambaran aksi yang membeku secara deskriptif dan puitis.',
        examples: [
          { text: 'The soul-stirring recitation of the Quran.', isCorrect: true, translation: 'Lantunan Al-Quran yang menggetarkan jiwa.' },
          { text: 'A mouth-watering meal.', isCorrect: true, translation: 'Hidangan yang menggugah selera.' },
          { text: 'Hand-made carpets are expensive.', isCorrect: true, translation: 'Karpet buatan tangan sangatlah mahal.' },
          { text: 'Time-consuming tasks are annoying.', isCorrect: true, translation: 'Tugas yang memakan waktu sangatlah menyebalkan.' },
          { text: 'A record-breaking achievement.', isCorrect: true, translation: 'Pencapaian yang memecahkan rekor.' }
        ]
      },
      {
        heading: '4. Angka sebagai Modifiers: Tanpa Akhiran "S"',
        content: 'Salah satu jebakan terbesar bagi pembelajar adalah menggunakan angka dalam kata sifat majemuk. Aturannya: kata benda di dalam modifier TIDAK BOLEH jamak. Contoh: "A *five-hour* flight" (Benar) vs "A *five-hours* flight" (Salah).\n\nLogikanya adalah karena kata tersebut sudah berubah fungsi menjadi kata sifat, dan dalam bahasa Inggris kata sifat tidak mengenal bentuk jamak. Membiasakan pola ini akan secara instan membuat bahasa Inggris Anda terdengar sangat mahir dan terhindar dari kesalahan "pemula" yang sering merusak profesionalisme sebuah dokumen atau presentasi.',
        formula: 'Number-Noun (singular)',
        exceptions: 'Kata benda di dalam modifier angka TIDAK BOLEH menggunakan bentuk jamak (-s).',
        examples: [
          { text: 'A ten-minute break.', isCorrect: true, note: 'Bukan minutes.', translation: 'Istirahat sepuluh menit.' },
          { text: 'A six-year-old child.', isCorrect: true, note: 'Bukan years.', translation: 'Anak berusia enam tahun.' },
          { text: 'A twenty-page report.', isCorrect: true, translation: 'Laporan dua puluh halaman.' },
          { text: 'A two-week vacation.', isCorrect: true, translation: 'Liburan dua minggu.' },
          { text: 'A fifty-dollar bill.', isCorrect: true, translation: 'Uang kertas lima puluh dolar.' }
        ]
      },
      {
        heading: '5. Konteks Karakter: Deskripsi Akhlak yang Padat',
        content: 'Dalam Islam, deskripsi karakter (Akhlak) seringkali memerlukan ketelitian kata. Menggunakan compound modifiers membantu kita merangkum kualitas mulia seseorang dengan elegan. "A God-fearing person" (Seorang yang bertaqwa) atau "A soft-spoken leader."\n\nBahasa yang padat mencerminkan pemikiran yang jernih. Dengan merangkum kualitas kebaikan menjadi satu frasa yang harmonis, Anda menunjukkan rasa hormat yang tinggi kepada objek pembicaraan. Gunakanlah teknik ini untuk memuliakan orang tua, guru, dan para teladan dengan istilah-istilah yang indah, akurat, dan penuh wibawa.',
        formula: 'God-fearing / Soft-spoken',
        exceptions: 'Gunakan untuk merangkum kualitas mulia seseorang dengan elegan dan padat.',
        examples: [
          { text: 'He is a clear-minded scholar.', isCorrect: true, translation: 'Dia adalah sarjana yang berpikiran jernih.' },
          { text: 'She has a never-ending patience.', isCorrect: true, translation: 'Dia memiliki kesabaran yang tiada habisnya.' },
          { text: 'An awe-inspiring mosque architecture.', isCorrect: true, translation: 'Arsitektur masjid yang mengagumkan.' },
          { text: 'They are forward-thinking leaders.', isCorrect: true, translation: 'Mereka adalah pemimpin yang berpikiran maju.' },
          { text: 'A well-documented history of Islam.', isCorrect: true, translation: 'Sejarah Islam yang terdokumentasi dengan baik.' }
        ]
      }
    ],
    mindmap: {
      id: 'c1-comp-root', label: 'COMPOUND MODIFIERS', type: 'root', children: [
        { id: 'f-p', label: 'Formation Patterns', type: 'main', children: [
          { id: 'adv-p', label: 'Adverb + Participle (Well-known)', type: 'sub' },
          { id: 'noun-p', label: 'Noun + Participle (Sun-dried)', type: 'sub' },
          { id: 'num-p', label: 'Number + Noun (Five-hour)', type: 'sub' }
        ]},
        { id: 'h-rule', label: 'The Hyphen Rule', type: 'formula', children: [
          { id: 'before-n', label: 'Hyphen BEFORE noun', type: 'sub' },
          { id: 'after-v', label: 'NO hyphen after verb', type: 'warning' }
        ]},
        { id: 'sing-rule', label: 'Singular Rule', type: 'warning', detail: 'Never use plural "S" inside a modifier.' }
      ]
    }
  },
  {
    id: 'c1-discourse-markers',
    title: '10. Academic Discourse Markers',
    level: 'C1',
    icon: 'fa-pen-fancy',
    description: 'Menguasai kata penghubung tingkat tinggi untuk menavigasi argumen kompleks, transisi ide, dan memberikan nuansa akademik yang berwibawa.',
    sections: [
      {
        heading: '1. Logika Navigasi: Peta Pikiran Pembaca',
        content: 'Discourse markers adalah rambu-rambu lalu lintas dalam sebuah tulisan atau pidato. Di level mahir, Anda tidak lagi hanya menggunakan "but" atau "so", melainkan beralih ke kata-kata yang lebih tajam seperti *consequently, nevertheless, atau furthermore*. Kata-kata ini memberi tahu pembaca ke mana arah argumen Anda selanjutnya.\n\nTanpa discourse markers yang kuat, pembaca akan merasa tersesat dalam lautan ide Anda. Penggunaan markers yang tepat menciptakan koherensi—keterhubungan logis antar kalimat yang membuat seluruh tulisan Anda terasa seperti satu kesatuan bangunan yang kokoh. Ini adalah syarat mutlak bagi siapa saja yang ingin menulis jurnal ilmiah atau laporan kebijakan tingkat internasional.',
        formula: 'Consequently / Furthermore / Hence',
        exceptions: 'Berfungsi sebagai rambu-rambu navigasi untuk menjaga koherensi argumen.',
        examples: [
          { text: 'Furthermore, the evidence suggests a new pattern.', isCorrect: true, translation: 'Selain itu, bukti tersebut menunjukkan pola baru.' },
          { text: 'Consequently, the meeting was postponed.', isCorrect: true, translation: 'Akibatnya, pertemuan itu ditunda.' },
          { text: 'Moreover, we must consider the ethical impact.', isCorrect: true, translation: 'Terlebih lagi, kita harus mempertimbangkan dampak etisnya.' },
          { text: 'Hence, the result was predictable.', isCorrect: true, translation: 'Oleh karena itu, hasilnya sudah bisa diprediksi.' },
          { text: 'In addition, she is also a talented writer.', isCorrect: true, translation: 'Selain itu, dia juga seorang penulis berbakat.' }
        ]
      },
      {
        heading: '2. Kontras Tingkat Tinggi: Albeit dan Notwithstanding',
        content: 'Untuk menunjukkan pertentangan yang elegan, level C1 memperkenalkan kata-kata seperti *Albeit* (meskipun) dan *Notwithstanding* (meskipun demikian). Kata-kata ini sangat hemat ruang dan memberikan kesan intelektualitas yang sangat tinggi pada gaya bahasa Anda.\n\nContoh: "It was a successful event, *albeit* a small one." Perhatikan betapa ringkasnya kalimat tersebut dibandingkan menggunakan klausa "although" yang panjang. Penguasaan kata-kata langka ini menunjukkan bahwa Anda adalah seorang ahli bahasa yang memiliki perbendaharaan kata yang luas dan mampu menggunakannya dengan presisi yang tepat.',
        formula: 'Albeit / Notwithstanding',
        exceptions: 'Gunakan untuk menunjukkan kontras atau konsesi secara ringkas dan intelektual.',
        examples: [
          { text: 'The results were positive, albeit somewhat slow.', isCorrect: true, translation: 'Hasilnya positif, meskipun agak lambat.' },
          { text: 'Notwithstanding the rain, the event was a success.', isCorrect: true, translation: 'Meskipun hujan, acara tersebut sukses.' },
          { text: 'He accepted the job, albeit reluctantly.', isCorrect: true, translation: 'Dia menerima pekerjaan itu, meskipun dengan enggan.' },
          { text: 'Notwithstanding his age, he is very active.', isCorrect: true, translation: 'Meskipun usianya sudah lanjut, dia sangat aktif.' },
          { text: 'The plan was good, albeit difficult to implement.', isCorrect: true, translation: 'Rencananya bagus, meskipun sulit untuk diimplementasikan.' }
        ]
      },
      {
        heading: '3. Menghubungkan Sebab-Akibat yang Kompleks',
        content: 'Dalam analisis masalah, kita sering membutuhkan kata penghubung yang menunjukkan hubungan sebab-akibat yang bertahap. Kata-kata seperti *Accordingly, Thereby, dan Inasmuch as* membantu Anda menjelaskan bagaimana satu tindakan memicu rangkaian konsekuensi yang rumit.\n\n"The laws were changed; *accordingly*, the budget was adjusted." Struktur ini memberikan kesan bahwa keputusan tersebut diambil melalui pertimbangan yang matang dan logis. Kemampuan merangkai sebab-akibat dengan diksi yang variatif akan membuat laporan Anda terlihat lebih meyakinkan di mata atasan maupun rekan akademik.',
        formula: 'Accordingly / Thereby / Inasmuch as',
        exceptions: 'Membantu menjelaskan hubungan sebab-akibat yang bertahap dan kompleks.',
        examples: [
          { text: 'They improved the system, thereby reducing the cost.', isCorrect: true, translation: 'Mereka memperbaiki sistem, sehingga mengurangi biaya.' },
          { text: 'Accordingly, we decided to invest more.', isCorrect: true, translation: 'Oleh karena itu, kami memutuskan untuk berinvestasi lebih banyak.' },
          { text: 'Inasmuch as he is the leader, he should decide.', isCorrect: true, translation: 'Mengingat dia adalah pemimpinnya, dia harus memutuskan.' },
          { text: 'Thus, the conclusion was inevitable.', isCorrect: true, translation: 'Demikianlah, kesimpulan itu tidak terelakkan.' },
          { text: 'As a result of this, the economy improved.', isCorrect: true, translation: 'Sebagai hasil dari ini, ekonomi membaik.' }
        ]
      },
      {
        heading: '4. Aturan Tanda Baca: Koma dan Titik Koma',
        content: 'Salah satu kesalahan paling fatal di level C1 bukan pada arti katanya, tapi pada tanda bacanya. Banyak discourse markers (Conjunctive Adverbs) seperti *however* dan *therefore* memerlukan titik koma (;) sebelumnya atau berada di antara dua koma.\n\n"The plan was good; however, it failed." (Benar). Menggunakan koma saja (*comma splice*) dianggap sebagai tanda kurangnya ketelitian dalam penulisan formal. Membiasakan penggunaan titik koma menunjukkan bahwa Anda memahami struktur klausa independen dan mampu menjaga integritas gramatikal dalam kalimat-kalimat yang panjang dan kompleks.',
        formula: 'Semicolon (;) + Marker + Comma (,)',
        exceptions: 'Hati-hati dengan tanda baca; marker seringkali memerlukan titik koma sebelumnya.',
        examples: [
          { text: 'The price rose; therefore, demand fell.', isCorrect: true, translation: 'Harga naik; oleh karena itu, permintaan turun.' },
          { text: 'He was tired; nevertheless, he kept working.', isCorrect: true, translation: 'Dia lelah; namun, dia terus bekerja.' },
          { text: 'She is smart; moreover, she is very kind.', isCorrect: true, translation: 'Dia pintar; terlebih lagi, dia sangat baik.' },
          { text: 'I agree with you; however, we need more data.', isCorrect: true, translation: 'Saya setuju denganmu; namun, kita butuh lebih banyak data.' },
          { text: 'It was late; hence, they went home.', isCorrect: true, translation: 'Hari sudah larut; oleh karena itu, mereka pulang.' }
        ]
      },
      {
        heading: '5. Etika Diskusi: Navigasi Dakwah yang Santun',
        content: 'Dalam Islam, berdiskusi harus dilakukan dengan cara yang paling baik (*Jadilhum billati hiya ahsan*). Discourse markers membantu kita menunjukkan kerendahan hati saat memberikan pendapat yang berbeda. Kata-kata seperti *Admittedly* (harus diakui) atau *Granted* (memang benar) memberikan ruang apresiasi pada pendapat lawan bicara.\n\nBahasa yang objektif dan terstruktur mencerminkan kejernihan hati seorang mukmin dalam mencari kebenaran, bukan mencari kemenangan. Gunakanlah markers ini untuk membangun jembatan pemahaman, bukan dinding pemisah. Ketajaman argumen yang dibalut dengan adab bahasa yang tinggi adalah ciri utama dari seorang cendekiawan Muslim yang berwibawa.',
        formula: 'Admittedly / Granted / Conversely',
        exceptions: 'Gunakan untuk berdiskusi dengan adab, memberikan ruang bagi pendapat orang lain.',
        examples: [
          { text: 'Admittedly, the task is difficult, but it is necessary.', isCorrect: true, translation: 'Harus diakui, tugas itu sulit, tapi perlu dilakukan.' },
          { text: 'Granted, he made a mistake, but he apologized.', isCorrect: true, translation: 'Memang benar, dia membuat kesalahan, tapi dia sudah minta maaf.' },
          { text: 'Conversely, some scholars disagree with this view.', isCorrect: true, translation: 'Sebaliknya, beberapa sarjana tidak setuju dengan pandangan ini.' },
          { text: 'To sum up, patience is the key to success.', isCorrect: true, translation: 'Singkatnya, kesabaran adalah kunci kesuksesan.' },
          { text: 'Broadly speaking, the community is supportive.', isCorrect: true, translation: 'Secara garis besar, masyarakat sangat mendukung.' }
        ]
      }
    ],
    mindmap: {
      id: 'c1-dm-root', label: 'ACADEMIC MARKERS', type: 'root', children: [
        { id: 'addition-dm', label: 'Addition & Reinforcement', type: 'main', children: [
          { id: 'further', label: 'Furthermore, Moreover, In addition', type: 'sub' }
        ]},
        { id: 'contrast-dm', label: 'Contrast & Concession', type: 'main', children: [
          { id: 'neverth', label: 'Nevertheless, Nonetheless', type: 'sub' },
          { id: 'albeit', label: 'Albeit, Notwithstanding', type: 'sub' }
        ]},
        { id: 'result-dm', label: 'Cause & Effect', type: 'formula', children: [
          { id: 'conseq', label: 'Consequently, Accordingly, Thereby', type: 'sub' }
        ]},
        { id: 'punc-dm', label: 'Punctuation Rule', type: 'warning', detail: 'Use semicolon (;) before conjunctive adverbs like However/Therefore.' }
      ]
    }
  }
];
