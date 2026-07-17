import { GrammarLesson } from '../../types';

export const LEVEL_C2: GrammarLesson[] = [
  {
    id: 'c2-subjunctive',
    title: '1. The Subjunctive Mood',
    level: 'C2',
    icon: 'fa-crown',
    description: 'Puncak tata bahasa: Mengekspresikan keinginan, saran mendesak, dan situasi hipotesis murni dengan keanggunan tingkat master.',
    sections: [
      {
        heading: '1. Mandative Subjunctive: Urgensi dan Otoritas Formal',
        content: 'Subjunctive mood di level tertinggi (C2) sering digunakan setelah kata kerja yang mengekspresikan saran mendesak, permintaan formal, atau perintah yang mengikat. Kata-kata pemicunya antara lain *suggest, recommend, demand, insist, vital, essential,* dan *imperative*. Aturan uniknya: kata kerja berikutnya harus selalu dalam bentuk dasar (Base Form) tanpa akhiran "-s", "-ed", atau "-ing", apa pun subjeknya.\n\nBanyak penutur asli sekalipun sering salah dalam menggunakan bentuk ini, namun bagi seorang ahli bahasa, penggunaan subjunctive yang tepat adalah tanda dari kemahiran intelektual yang tinggi. Ia memberikan nuansa urgensi yang sopan namun sangat berwibawa, sering ditemukan dalam dokumen diplomatik atau resolusi internasional tingkat tinggi.',
        formula: 'Suggest/Demand/Vital + that + S + Base Form',
        exceptions: 'Hati-hati: kata kerja tidak menggunakan akhiran -s/-ed meskipun subjeknya tunggal.',
        examples: [
          { text: 'I suggest that he stay here tonight.', isCorrect: true, translation: 'Saya sarankan agar dia tinggal di sini malam ini.' },
          { text: 'It is essential that she be informed.', isCorrect: true, translation: 'Sangat penting agar dia diberi tahu.' },
          { text: 'The committee demanded that he resign.', isCorrect: true, translation: 'Komite menuntut agar dia mengundurkan diri.' },
          { text: 'I insist that the rules be followed.', isCorrect: true, translation: 'Saya tegaskan agar aturan-aturan itu dipatuhi.' },
          { text: 'It is vital that we not fail this mission.', isCorrect: true, translation: 'Sangat vital agar kita tidak gagal dalam misi ini.' }
        ]
      },
      {
        heading: '2. Hypothetical Subjunctive: Dunia Khayalan "Were"',
        content: 'Bentuk ini digunakan untuk membicarakan situasi yang benar-benar tidak nyata, mustahil, atau berlawanan dengan fakta saat ini. Ciri khasnya adalah penggunaan "WERE" untuk semua orang, termasuk subjek tunggal seperti "I", "He", atau "She" yang biasanya menggunakan "Was". Penggunaan "Were" di sini memberi sinyal kuat kepada pendengar bahwa Anda sepenuhnya sadar bahwa apa yang Anda bicarakan adalah sebuah imajinasi.\n\nTeknik ini sangat penting dalam penulisan sastra atau diskusi mendalam. Dengan mengatakan "If I were you", Anda menciptakan ruang empati yang mendalam namun tetap menjaga batasan logika bahwa Anda bukanlah orang tersebut. Di level C2, Anda diharapkan mampu menggunakan variasi ini untuk mengekspresikan keraguan atau pengandaian dengan sangat halus.',
        formula: 'If I were / I wish it were',
        exceptions: 'Gunakan "WERE" untuk semua subjek guna menunjukkan situasi hipotesis murni.',
        examples: [
          { text: 'If I were you, I would take the offer.', isCorrect: true, translation: 'Seandainya saya jadi kamu, saya akan mengambil tawaran itu.' },
          { text: 'I wish it were that simple to solve.', isCorrect: true, translation: 'Saya harap masalah ini sesederhana itu untuk dipecahkan.' },
          { text: 'If she were here, she would know what to do.', isCorrect: true, translation: 'Seandainya dia ada di sini, dia pasti tahu apa yang harus dilakukan.' },
          { text: 'Supposing he were to win, what would happen?', isCorrect: true, translation: 'Andaikata dia menang, apa yang akan terjadi?' },
          { text: 'If it were not for your help, I would fail.', isCorrect: true, translation: 'Seandainya bukan karena bantuanmu, saya akan gagal.' }
        ]
      },
      {
        heading: '3. Formulaic Subjunctive: Jejak Arkaik yang Bertahan',
        content: 'Bahasa Inggris modern masih menyimpan beberapa sisa dari penggunaan subjunctive kuno yang telah membeku menjadi frasa tetap (Fixed Phrases). Frasa-frasa ini sering digunakan dalam situasi formal, doa, atau teks sastra klasik. Meskipun terdengar kaku, frasa ini memberikan bobot sejarah dan martabat pada gaya bicara Anda.\n\nContoh seperti "God save the King" atau "Suffice it to say" adalah bukti bagaimana subjunctive masih hidup dalam identitas bahasa Inggris. Menguasai frasa-frasa formulaik ini memungkinkan Anda untuk tampil sangat fasih saat berada di lingkungan akademis atau saat membacakan teks-teks hukum dan literatur yang memiliki gaya bahasa tinggi.',
        formula: 'God save... / Suffice it to say',
        exceptions: 'Gunakan frasa formulaik ini untuk memberikan bobot sejarah dan martabat pada gaya bahasa.',
        examples: [
          { text: 'God save the King.', isCorrect: true, translation: 'Tuhan jagalah sang Raja.' },
          { text: 'Suffice it to say, we are disappointed.', isCorrect: true, translation: 'Cukup dikatakan bahwa kami kecewa.' },
          { text: 'Be that as it may, we must continue.', isCorrect: true, translation: 'Biarlah demikian, kita harus terus maju.' },
          { text: 'Heaven forbid that such a thing happen.', isCorrect: true, translation: 'Semoga Tuhan melarang hal seperti itu terjadi.' },
          { text: 'So be it then.', isCorrect: true, translation: 'Biarlah itu terjadi kalau begitu.' }
        ]
      },
      {
        heading: '4. Subjunctive dalam Negasi: Ketajaman Tanpa Bantuan',
        content: 'Dalam bentuk negatif, mandative subjunctive memiliki keunikan yang sangat mencolok: ia tidak menggunakan kata kerja bantu seperti "do", "does", atau "did". Kita cukup meletakkan kata "NOT" tepat sebelum kata kerja dasarnya. Struktur ini terdengar sangat formal, tegas, dan berwibawa di telinga penutur asli.\n\nMisalnya, kalimat "I recommend that he not go there" terdengar jauh lebih kuat dan profesional dibandingkan "I recommend that he doesn\'t go there". Penggunaan negasi subjunctive ini sangat efektif dalam negosiasi atau saat memberikan instruksi tertulis yang memerlukan kepatuhan mutlak tanpa kesan menggurui secara kasar.',
        formula: 'Mandative Subjunctive + NOT + Base Verb',
        exceptions: 'Jangan gunakan "do/does/did" dalam bentuk negasi subjunctive formal.',
        examples: [
          { text: 'It is vital that he not be late.', isCorrect: true, translation: 'Sangat vital agar dia tidak terlambat.' },
          { text: 'I suggest that they not participate.', isCorrect: true, translation: 'Saya sarankan agar mereka tidak berpartisipasi.' },
          { text: 'It is imperative that we not forget our values.', isCorrect: true, translation: 'Sangat mendesak agar kita tidak melupakan nilai-nilai kita.' },
          { text: 'She recommended that the child not see the film.', isCorrect: true, translation: 'Dia merekomendasikan agar anak itu tidak menonton film tersebut.' },
          { text: 'He insisted that the news not be leaked.', isCorrect: true, translation: 'Dia menegaskan agar beritanya tidak dibocorkan.' }
        ]
      },
      {
        heading: '5. Konteks Etika dan Diplomasi Internasional',
        content: 'Di level master (C2), tata bahasa bukan lagi sekadar alat komunikasi, melainkan instrumen diplomasi dan etika. Menggunakan subjunctive menunjukkan bahwa Anda memiliki kepekaan terhadap norma-norma bahasa yang paling halus. Ini digunakan untuk memberikan saran yang sangat kuat namun tetap berada dalam koridor kesantunan formal yang tertinggi.\n\nDalam konteks Islam, penggunaan bahasa yang tinggi (Al-Fusha dalam analogi Arab) mencerminkan kedalaman ilmu seseorang. Dengan menggunakan subjunctive secara akurat, Anda menunjukkan bahwa Anda menghargai integritas sebuah saran dan urgensi sebuah perbaikan demi kemaslahatan bersama. Jadilah pribadi yang elegan dalam tutur kata melalui penguasaan struktur bahasa yang paling mulia.',
        formula: 'Diplomasi dan Etika',
        exceptions: 'Gunakan subjunctive untuk memberikan saran mendesak dengan kesantunan formal tertinggi.',
        examples: [
          { text: 'It is imperative that justice be served for all.', isCorrect: true, translation: 'Sangat mendesak agar keadilan ditegakkan bagi semua.' },
          { text: 'I suggest that we all work together for peace.', isCorrect: true, translation: 'Saya sarankan agar kita semua bekerja sama demi perdamaian.' },
          { text: 'It is essential that every member follow the code.', isCorrect: true, translation: 'Sangat penting agar setiap anggota mengikuti kode etik.' },
          { text: 'I recommend that the council rethink the decision.', isCorrect: true, translation: 'Saya merekomendasikan agar dewan memikirkan kembali keputusan tersebut.' },
          { text: 'It is vital that the truth be revealed slowly.', isCorrect: true, translation: 'Sangat vital agar kebenaran diungkapkan secara perlahan.' }
        ]
      }
    ],
    mindmap: {
      id: 'c2-sub-root', label: 'SUBJUNCTIVE MOOD', type: 'root', children: [
        { id: 'mandative', label: 'Mandative (Urgency)', type: 'main', children: [
          { id: 'base', label: 'Use Base Form (no -s/-ed)', type: 'formula' },
          { id: 'not', label: 'Negation: just use NOT', type: 'formula' }
        ]},
        { id: 'hypo', label: 'Hypothetical (Unreal)', type: 'main', children: [
          { id: 'were', label: 'WERE for all subjects', type: 'formula' }
        ]},
        { id: 'fixed', label: 'Formulaic (Idioms)', type: 'sub', detail: 'God forbid, Suffice it to say.' }
      ]
    }
  },
  {
    id: 'c2-advanced-inversion',
    title: '2. Advanced Stylistic Inversion',
    level: 'C2',
    icon: 'fa-sort-amount-up',
    description: 'Menggunakan pembalikan struktur kalimat untuk menciptakan retorika yang kuat, puitis, dan penuh penekanan.',
    sections: [
      {
        heading: '1. Negative & Restrictive Inversion',
        content: 'Inversi ini terjadi ketika kata keterangan negatif atau pembatas diletakkan di awal kalimat untuk memberikan efek kejutan atau dramatis. Polanya mengikuti struktur kalimat tanya: **Adverb + Auxiliary + Subject + Verb**. Kata pemicunya termasuk *Never, Rarely, Seldom, Little, Under no circumstances,* dan *Not only*.\n\nDi level C2, inversi bukan sekadar variasi gaya, tapi cara untuk mengontrol aliran emosional pembaca. Ia memberikan kesan otoritas dan kepercayaan diri penulis. Penggunaan "Little did I know" memberikan dimensi naratif yang jauh lebih dalam dibandingkan sekadar "I didn\'t know", karena ia menyiratkan adanya rahasia besar yang baru terungkap kemudian.',
        formula: 'Never/Rarely/Little + Aux + S + V',
        exceptions: 'Inversi ini memberikan efek dramatis dan otoritas intelektual pada awal kalimat.',
        examples: [
          { text: 'Never have I witnessed such profound wisdom.', isCorrect: true, translation: 'Belum pernah saya menyaksikan hikmah yang begitu mendalam.' },
          { text: 'Under no circumstances should you open that door.', isCorrect: true, translation: 'Dalam keadaan apa pun kamu tidak boleh membuka pintu itu.' },
          { text: 'Rarely does one encounter such integrity.', isCorrect: true, translation: 'Jarang sekali seseorang menemui integritas seperti itu.' },
          { text: 'Little did they realize the impact of their words.', isCorrect: true, translation: 'Sedikit pun mereka tidak menyadari dampak dari kata-kata mereka.' },
          { text: 'Not only was he a scholar, but he was also a leader.', isCorrect: true, translation: 'Bukan saja dia seorang sarjana, tapi dia juga seorang pemimpin.' }
        ]
      },
      {
        heading: '2. Conditional Inversion (No "If")',
        content: 'Ini adalah bentuk pengandaian tingkat tinggi yang menghilangkan kata "If" dan menggantinya dengan memajukan kata kerja bantu ke depan. Struktur *Should you, Were I,* dan *Had I known* adalah standar dalam korespondensi formal tingkat tinggi. Ini memberikan kesan kesantunan yang sangat terpelajar.\n\nMenggunakan "Had I known the truth" terdengar jauh lebih canggih daripada "If I had known the truth". Di level Master, penguasaan ini membantu Anda berkomunikasi di lingkungan profesional yang mengedepankan etiket bahasa yang sangat halus dan tidak terlalu kasual.',
        formula: 'Had I known / Should you need',
        exceptions: 'Pembalikan ini memberikan kesan kesantunan yang sangat terpelajar dalam korespondensi formal.',
        examples: [
          { text: 'Had I known, I would have acted differently.', isCorrect: true, translation: 'Seandainya saya tahu, saya pasti sudah bertindak berbeda.' },
          { text: 'Should you require further assistance, do let us know.', isCorrect: true, translation: 'Jika kamu butuh bantuan lebih lanjut, beri tahu kami.' },
          { text: 'Were he to apologize, I might forgive him.', isCorrect: true, translation: 'Andaikata dia meminta maaf, saya mungkin akan memaafkannya.' },
          { text: 'Had the rain not stopped, the event would be canceled.', isCorrect: true, translation: 'Seandainya hujan tidak berhenti, acara itu pasti akan dibatalkan.' },
          { text: 'Should there be any issues, please call me.', isCorrect: true, translation: 'Jika ada masalah, tolong hubungi saya.' }
        ]
      },
      {
        heading: '3. Inversion after "Only" and "Not Until"',
        content: 'Frasa yang dimulai dengan "Only" (seperti *Only then, Only when*) atau "Not until" menuntut inversi pada klausa UTAMA, bukan klausa yang mengikutinya. Ini adalah salah satu struktur yang paling sering menjebak pelajar level lanjut.\n\nContoh: "Only when the results were out DID the students feel relief." Perhatikan bagaimana "Did" muncul setelah klausa pertama selesai. Struktur ini sangat efektif untuk membangun ketegangan dalam sebuah cerita atau laporan kronologis, di mana hasil akhir baru diungkapkan setelah syarat-syaratnya terpenuhi.',
        formula: 'Only then/when / Not until + Aux + S + V',
        exceptions: 'Hati-hati: inversi terjadi pada klausa UTAMA, bukan pada klausa "Only" itu sendiri.',
        examples: [
          { text: 'Only then did I understand the gravity of the situation.', isCorrect: true, translation: 'Baru saat itulah saya memahami kegentingan situasinya.' },
          { text: 'Not until I arrived home did I realize I lost my bag.', isCorrect: true, translation: 'Baru setelah sampai di rumah saya menyadari tas saya hilang.' },
          { text: 'Only after the meeting was over were we allowed to speak.', isCorrect: true, translation: 'Baru setelah pertemuan selesai kami diizinkan bicara.' },
          { text: 'Only in this way can we achieve true success.', isCorrect: true, translation: 'Hanya dengan cara inilah kita bisa mencapai kesuksesan sejati.' },
          { text: 'Not until next year will we see the results.', isCorrect: true, translation: 'Baru tahun depan kita akan melihat hasilnya.' }
        ]
      },
      {
        heading: '4. Locative & Participle Inversion',
        content: 'Untuk deskripsi puitis atau sastra, kita bisa meletakkan frasa tempat atau kata kerja berakhiran "-ing/-ed" di awal kalimat tanpa kata bantu, langsung diikuti oleh kata kerja utama. Contoh: "At the foot of the hill stood an old mosque."\n\nTeknik ini sangat visual; ia melukiskan latar belakang terlebih dahulu sebelum memperkenalkan subjek utamanya. Ini sangat berguna dalam penulisan kreatif atau esai deskriptif untuk menciptakan atmosfer yang hidup dan membawa pembaca masuk ke dalam pemandangan yang Anda bangun dengan kata-kata.',
        formula: 'Place/Participle + Verb + Subject',
        exceptions: 'Teknik ini melukiskan latar belakang terlebih dahulu sebelum memperkenalkan subjek utamanya.',
        examples: [
          { text: 'Beside the river grew beautiful white lilies.', isCorrect: true, translation: 'Di tepi sungai itu tumbuh bunga bakung putih yang indah.' },
          { text: 'Hidden in the archives were the forgotten letters.', isCorrect: true, translation: 'Tersembunyi di arsip itu ada surat-surat yang terlupakan.' },
          { text: 'Standing in the corner was a mysterious man.', isCorrect: true, translation: 'Berdiri di sudut itu ada seorang pria misterius.' },
          { text: 'From the minaret came the beautiful sound of Adzan.', isCorrect: true, translation: 'Dari menara itu terdengar suara adzan yang indah.' },
          { text: 'On the wall hung a large map of the world.', isCorrect: true, translation: 'Di dinding itu tergantung peta dunia yang besar.' }
        ]
      },
      {
        heading: '5. Retorika Dakwah: Menekankan Kebenaran',
        content: 'Dalam menyampaikan kebenaran, penekanan adalah segalanya. Inversi membantu kita menonjolkan poin-poin krusial dalam sebuah argumen atau nasihat. "In no way should we compromise our values" memberikan dampak yang jauh lebih kuat daripada kalimat standar.\n\nKemampuan memanipulasi struktur kalimat mencerminkan kedalaman pemikiran dan penguasaan emosional pembicara. Gunakanlah inversi untuk menginspirasi orang lain, membangun klimaks dalam pidato, dan memastikan bahwa pesan-pesan moral yang Anda sampaikan memiliki resonansi yang kuat di hati pendengar Anda.',
        formula: 'Retorika Dakwah',
        exceptions: 'Gunakan inversi untuk menonjolkan poin-poin krusial dan memberikan resonansi kuat pada pesan moral.',
        examples: [
          { text: 'In no way can this be considered a failure.', isCorrect: true, translation: 'Sama sekali ini tidak bisa dianggap sebagai kegagalan.' },
          { text: 'Only through patience will we find peace.', isCorrect: true, translation: 'Hanya melalui kesabaranlah kita akan menemukan kedamaian.' },
          { text: 'Seldom have we seen such dedication to knowledge.', isCorrect: true, translation: 'Jarang sekali kita melihat dedikasi seperti itu terhadap ilmu.' },
          { text: 'Never before has the world needed more compassion.', isCorrect: true, translation: 'Belum pernah sebelumnya dunia membutuhkan lebih banyak belas kasih.' },
          { text: 'Such was the power of his speech that many cried.', isCorrect: true, translation: 'Begitu kuatnya pidatonya sampai banyak yang menangis.' }
        ]
      }
    ],
    mindmap: {
      id: 'c2-inv-root', label: 'ADVANCED INVERSION', type: 'root', children: [
        { id: 'neg-inv', label: 'Negative Adverbials', type: 'main', children: [
          { id: 'n-rule', label: 'Adverb + Aux + Subj + Verb', type: 'formula' },
          { id: 'n-list', label: 'Never, Rarely, Under no circumstances', type: 'sub' }
        ]},
        { id: 'cond-inv', label: 'Conditional (No If)', type: 'main', children: [
          { id: 'c-list', label: 'Had I, Should you, Were I', type: 'formula' }
        ]},
        { id: 'only-inv', label: 'Only / Not Until', type: 'main', detail: 'Invert the MAIN clause.' }
      ]
    }
  },
  {
    id: 'c2-cleft-sentences',
    title: '3. Complex Cleft Sentences',
    level: 'C2',
    icon: 'fa-magic',
    description: 'Seni memecah kalimat untuk memberikan spotlight pada informasi yang paling vital dalam sebuah argumen.',
    sections: [
      {
        heading: '1. It-Cleft Mastery: Mengunci Fokus',
        content: 'It-Cleft adalah struktur "It is/was... that..." yang digunakan untuk menonjolkan satu elemen spesifik dari kalimat dan menepis kemungkinan elemen lain sebagai pelaku atau penyebab. Di level C2, kita menggunakannya untuk memberikan penegasan yang sangat tajam dalam perdebatan intelektual.\n\nMisalnya, "It was the lack of communication that led to the crisis." Di sini, Anda menegaskan bahwa PENYEBAB UTAMANYA adalah komunikasi, bukan faktor lain. Penguasaan It-Cleft menunjukkan bahwa Anda memiliki kendali penuh atas " spotlight" informasi dalam setiap kalimat yang Anda susun.',
        formula: 'It is/was + [Fokus] + that...',
        exceptions: 'Struktur ini mengunci fokus pembaca pada satu elemen spesifik dan menepis faktor lain.',
        examples: [
          { text: 'It was his honesty that impressed everyone.', isCorrect: true, translation: 'Kejujurannyalah yang mengesankan semua orang.' },
          { text: 'It is the Quran that provides the ultimate guidance.', isCorrect: true, translation: 'Al-Quranlah yang memberikan bimbingan tertinggi.' },
          { text: 'It was in Medina that the first Muslim community grew.', isCorrect: true, translation: 'Di Madinahlah komunitas Muslim pertama berkembang.' },
          { text: 'It is through science that we understand the universe.', isCorrect: true, translation: 'Melalui sainslah kita memahami alam semesta.' },
          { text: 'It was last night that the decision was finalized.', isCorrect: true, translation: 'Tadi malamlah keputusan itu difinalisasi.' }
        ]
      },
      {
        heading: '2. Wh-Cleft (Pseudo-Cleft): Membangun Ketegangan',
        content: 'Wh-Cleft menggunakan kata tanya (biasanya *What*) untuk memposisikan seluruh klausa sebagai subjek. Rumusnya: **What clause + IS/WAS + [Fokus]**. Ini memberikan efek dramatis karena pendengar harus menunggu sampai akhir kalimat untuk mengetahui apa inti pesannya.\n\n"What we need is more sincerity." Struktur ini jauh lebih puitis dan kuat daripada sekadar berkata "We need more sincerity". Di level Master, Wh-Cleft digunakan untuk merangkum aspirasi, kebutuhan, atau hasil dari sebuah diskusi yang panjang dan mendalam.',
        formula: 'What [clause] + is/was + [Fokus]',
        exceptions: 'Gunakan untuk membangun ketegangan naratif sebelum memberikan inti pesan di akhir kalimat.',
        examples: [
          { text: 'What he said was very inspiring to us.', isCorrect: true, translation: 'Apa yang dia katakan sangat menginspirasi kami.' },
          { text: 'What I admire most about him is his patience.', isCorrect: true, translation: 'Apa yang paling saya kagumi darinya adalah kesabarannya.' },
          { text: 'What happened was a total misunderstanding.', isCorrect: true, translation: 'Apa yang terjadi adalah kesalahpahaman total.' },
          { text: 'What we seek is Allah\'s pleasure.', isCorrect: true, translation: 'Apa yang kita cari adalah rida Allah.' },
          { text: 'What she loves is learning new things.', isCorrect: true, translation: 'Apa yang dia sukai adalah mempelajari hal-hal baru.' }
        ]
      },
      {
        heading: '3. Reversed Wh-Cleft: Penekanan Terbalik',
        content: 'Ini adalah variasi dari Wh-Cleft di mana fokusnya diletakkan di DEPAN. Rumusnya: **[Fokus] + IS/WAS + What clause**. Ini digunakan untuk memberikan jawaban langsung yang mengejutkan atau memberikan definisi yang sangat kuat pada sebuah objek.\n\n"Patience is what we need right now." Kalimat ini menempatkan nilai "Kesabaran" sebagai bintang utama di awal kalimat. Penguasaan teknik pembalikan ini memberikan Anda fleksibilitas gaya bahasa untuk menekankan urgensi atau identitas suatu konsep secara instan.',
        formula: '[Fokus] + is/was + What [clause]',
        exceptions: 'Memberikan penekanan terbalik untuk mendefinisikan suatu konsep secara instan di awal kalimat.',
        examples: [
          { text: 'Sincerity is what makes a deed valuable.', isCorrect: true, translation: 'Keikhlasanlah yang membuat sebuah amal berharga.' },
          { text: 'A sincere smile is what she gave me.', isCorrect: true, translation: 'Senyum tuluslah yang dia berikan kepada saya.' },
          { text: 'Knowledge is what sets us free.', isCorrect: true, translation: 'Ilmulah yang membebaskan kita.' },
          { text: 'Peace is what every soul yearns for.', isCorrect: true, translation: 'Kedamaianlah yang dirindukan setiap jiwa.' },
          { text: 'This book is what I have been looking for.', isCorrect: true, translation: 'Buku inilah yang sudah saya cari-cari.' }
        ]
      },
      {
        heading: '4. All-Cleft: Kesederhanaan dan Eksklusivitas',
        content: 'All-Cleft menggunakan kata "All" untuk menunjukkan bahwa hanya ada SATU hal yang penting atau sedang dilakukan. Struktur ini memberikan kesan fokus tunggal, kejujuran, dan seringkali kerendahan hati. "All I want is your happiness."\n\nDalam konteks spiritual atau motivasi, All-Cleft sangat efektif untuk menyaring distraksi dan menonjolkan prioritas utama. Ia terdengar sangat tulus karena membatasi spektrum keinginan atau aksi subjek pada satu poin tunggal yang sangat esensial bagi narasi tersebut.',
        formula: 'All I/he/she did was + Base Form',
        exceptions: 'Menunjukkan eksklusivitas dan kejujuran fokus tunggal pada satu aksi yang esensial.',
        examples: [
          { text: 'All he did was offer a helping hand.', isCorrect: true, translation: 'Yang dia lakukan hanyalah menawarkan bantuan.' },
          { text: 'All I ask for is a bit of honesty.', isCorrect: true, translation: 'Yang saya minta hanyalah sedikit kejujuran.' },
          { text: 'All that matters is your intention.', isCorrect: true, translation: 'Yang terpenting hanyalah niatmu.' },
          { text: 'All she wanted was to serve her parents.', isCorrect: true, translation: 'Yang dia inginkan hanyalah melayani orang tuanya.' },
          { text: 'All we can do is try our best.', isCorrect: true, translation: 'Yang bisa kita lakukan hanyalah mencoba yang terbaik.' }
        ]
      },
      {
        heading: '5. Ketajaman Berpikir: Fokus pada Haqq',
        content: 'Dalam Islam, kebenaran (*Haqq*) harus disampaikan dengan jelas. Cleft sentences adalah alat linguistik untuk menegaskan prinsip-prinsip iman. "It is Allah who sustains us." Kalimat ini bukan sekadar informasi, tapi deklarasi tauhid yang sangat kokoh secara gramatikal.\n\nKetajaman bahasa mencerminkan keteguhan hati (*Istiqomah*). Gunakanlah struktur cleft untuk memuliakan orang-orang yang berjasa, menonjolkan nilai-nilai luhur, dan memastikan bahwa dalam setiap tulisan Anda, poin yang paling benar dan paling penting selalu mendapatkan porsi perhatian yang layak.',
        formula: 'Fokus pada Haqq',
        exceptions: 'Gunakan cleft sentences untuk mendeklarasikan prinsip-prinsip iman dengan ketegasan gramatikal.',
        examples: [
          { text: 'It is the Quran that illuminates our hearts.', isCorrect: true, translation: 'Al-Quranlah yang menyinari hati kita.' },
          { text: 'What defines a person is their character.', isCorrect: true, translation: 'Apa yang mendefinisikan seseorang adalah karakter mereka.' },
          { text: 'It was the Sahabah who spread the light of faith.', isCorrect: true, translation: 'Para Sahabatlah yang menyebarkan cahaya iman.' },
          { text: 'All we seek is a meaningful life under His guidance.', isCorrect: true, translation: 'Yang kita cari hanyalah hidup bermakna di bawah bimbingan-Nya.' },
          { text: 'Patience is what helps us endure the darkest nights.', isCorrect: true, translation: 'Kesabaranlah yang membantu kita bertahan di malam-malam tergelap.' }
        ]
      }
    ],
    mindmap: {
      id: 'c2-cleft-root', label: 'CLEFT SENTENCES', type: 'root', children: [
        { id: 'it-cleft', label: 'IT-Cleft (Spotlight)', type: 'main', children: [
          { id: 'it-form', label: 'It is/was + [Target] + that...', type: 'formula' }
        ]},
        { id: 'wh-cleft', label: 'WH-Cleft (Build-up)', type: 'main', children: [
          { id: 'wh-form', label: 'What [clause] + is/was + [Target]', type: 'formula' }
        ]},
        { id: 'all-cleft', label: 'ALL-Cleft (Exclusivity)', type: 'sub', detail: 'All I did was...' }
      ]
    }
  },
  {
    id: 'c2-nominalization',
    title: '4. Nominalization & Lexical Density',
    level: 'C2',
    icon: 'fa-font',
    description: 'Transformasi aksi menjadi konsep abstrak untuk menciptakan teks yang berwibawa, objektif, dan padat informasi.',
    sections: [
      {
        heading: '1. Logika Densitas: Dari Narasi ke Abstraksi',
        content: 'Nominalisasi adalah teknik mengubah kata kerja atau kata sifat menjadi kata benda. Di level C2, nominalisasi adalah "tiket masuk" ke dunia penulisan akademik dan profesional tingkat dunia. Ia mengubah gaya bahasa yang bersifat bercerita (personal) menjadi gaya bahasa yang bersifat konseptual (objektif).\n\nBandingkan: "Scientists observed that the temperature rose" (Personal) dengan "The observation of the temperature rise..." (Objektif). Kalimat kedua lebih padat dan memungkinkan Anda untuk menambahkan analisis lebih lanjut dalam satu kalimat yang sama. Ini adalah tanda bahwa Anda memproses dunia melalui lensa konsep, bukan sekadar kejadian.',
        formula: 'Verb/Adj -> Noun transformation',
        exceptions: 'Nominalisasi mengubah narasi personal menjadi abstraksi konsep yang berwibawa.',
        examples: [
          { text: 'The implementation of the new law was successful.', isCorrect: true, translation: 'Implementasi hukum baru tersebut berhasil.' },
          { text: 'Rapid urbanization poses many challenges.', isCorrect: true, translation: 'Urbanisasi yang cepat menimbulkan banyak tantangan.' },
          { text: 'Her persistence led to great discoveries.', isCorrect: true, translation: 'Kegigihannya membuahkan penemuan-penemuan besar.' },
          { text: 'The analysis of the data confirmed the theory.', isCorrect: true, translation: 'Analisis data tersebut mengonfirmasi teorinya.' },
          { text: 'Failure to comply will result in a penalty.', isCorrect: true, translation: 'Kegagalan untuk mematuhi akan berakibat pada penalti.' }
        ]
      },
      {
        heading: '2. Menciptakan Objektivitas Ilmiah',
        content: 'Dengan menghilangkan subjek manusia (Agent) dan menggantinya dengan konsep nominal, tulisan Anda akan terasa lebih netral dan berwibawa. Ini sangat krusial dalam penulisan esai kritis, jurnal medis, atau dokumen kebijakan publik.\n\nNominalisasi membantu penulis untuk menjaga jarak profesional dari subjek bahasan. Ia menggeser fokus dari "siapa yang melakukan" ke "apa proses yang sedang terjadi". Di level Master, kemampuan ini sangat dihargai karena menunjukkan objektivitas intelektual yang tinggi.',
        formula: 'Objectivity (Agent Removal)',
        exceptions: 'Menciptakan jarak profesional dengan menghilangkan pelaku personal dari struktur kalimat.',
        examples: [
          { text: 'The distribution of wealth is a global issue.', isCorrect: true, translation: 'Distribusi kekayaan adalah masalah global.' },
          { text: 'Technological advancement changed our lives.', isCorrect: true, translation: 'Kemajuan teknologi mengubah hidup kita.' },
          { text: 'His rejection of the offer was unexpected.', isCorrect: true, translation: 'Penolakannya terhadap tawaran itu tidak terduga.' },
          { text: 'Scientific discovery requires immense patience.', isCorrect: true, translation: 'Penemuan ilmiah membutuhkan kesabaran yang luar biasa.' },
          { text: 'The expansion of the city is inevitable.', isCorrect: true, translation: 'Ekspansi kota tersebut tidak terhindarkan.' }
        ]
      },
      {
        heading: '3. Kompresi Kalimat: Efisiensi Informasi',
        content: 'Nominalisasi memungkinkan Anda mengemas beberapa informasi dalam satu subjek yang padat. Anda bisa menggabungkan sebab, proses, dan hasil dalam satu struktur kalimat majemuk yang elegan tanpa terlihat bertele-tele.\n\nTeknik ini meningkatkan "Lexical Density" atau kepadatan makna dalam tulisan Anda. Penulis level C2 mampu menyampaikan ide kompleks dalam jumlah kata yang lebih sedikit namun dengan bobot informasi yang jauh lebih besar dibandingkan penulis level intermediate.',
        formula: 'Compression (Lexical Density)',
        exceptions: 'Mengemas beberapa informasi kompleks menjadi satu frasa benda yang efisien dan padat.',
        examples: [
          { text: 'The sudden disappearance of the evidence shocked everyone.', isCorrect: true, translation: 'Hilangnya bukti secara tiba-tiba mengejutkan semua orang.' },
          { text: 'Careful preparation is the key to a good presentation.', isCorrect: true, translation: 'Persiapan yang matang adalah kunci presentasi yang baik.' },
          { text: 'Environmental protection is a shared responsibility.', isCorrect: true, translation: 'Perlindungan lingkungan adalah tanggung jawab bersama.' },
          { text: 'Fluctuations in market prices affect local farmers.', isCorrect: true, translation: 'Fluktuasi harga pasar memengaruhi petani lokal.' },
          { text: 'The restoration of the mosque took five years.', isCorrect: true, translation: 'Restorasi masjid tersebut memakan waktu lima tahun.' }
        ]
      },
      {
        heading: '4. Perubahan Preposisi: Detail yang Halus',
        content: 'Saat kata kerja berubah menjadi kata benda, preposisi yang menyertainya seringkali juga harus berubah atau disesuaikan. Misalnya, "rely ON" (kata kerja) menjadi "reliance ON" (kata benda). Ketepatan dalam memilih preposisi setelah nominalisasi adalah detail sangat halus yang membedakan ahli bahasa sejati.\n\nMelatih ketelitian ini akan membuat tulisan Anda terlihat sangat halus (polished). Kesalahan kecil dalam preposisi setelah nominalisasi seringkali menjadi penanda bahwa penulis masih menerjemahkan pola pikir dari bahasa ibunya. C2 menuntut Anda memiliki insting preposisi yang tajam.',
        formula: 'Preposition Shift (Reliance ON)',
        exceptions: 'Hati-hati dengan perubahan preposisi yang menyertai perubahan kata kerja menjadi kata benda.',
        examples: [
          { text: 'Our dependence on technology is growing.', isCorrect: true, translation: 'Ketergantungan kita pada teknologi semakin tumbuh.' },
          { text: 'She has a deep commitment to education.', isCorrect: true, translation: 'Dia memiliki komitmen yang mendalam terhadap pendidikan.' },
          { text: 'Resistance to change is a natural human trait.', isCorrect: true, translation: 'Resistensi terhadap perubahan adalah sifat alami manusia.' },
          { text: 'His preference for classic literature is well-known.', isCorrect: true, translation: 'Preferensinya terhadap sastra klasik sudah sangat dikenal.' },
          { text: 'The frequency of his visits increased.', isCorrect: true, translation: 'Frekuensi kunjungannya meningkat.' }
        ]
      },
      {
        heading: '5. Konteks Hikmah: Bahasa Prinsip yang Mulia',
        content: 'Dalam Islam, penggunaan kata benda abstrak (Mashdar) untuk menjelaskan konsep iman sangatlah umum (*Ikhlas, Sabr, Tawakkal*). Nominalisasi membantu kita mentransformasikan aksi ibadah menjadi prinsip hidup yang kokoh dalam bahasa Inggris.\n\nAlih-alih hanya berkata "We should be patient," menggunakan nominalisasi "The practice of patience" memberikan kedalaman makna bahwa kesabaran adalah sebuah sistem atau disiplin ilmu. Gunakanlah nominalisasi untuk mengangkat topik-topik spiritual ke level diskusi intelektual yang lebih tinggi dan bermartabat.',
        formula: 'Bahasa Prinsip (Mashdar)',
        exceptions: 'Gunakan nominalisasi untuk mengangkat topik spiritual ke level diskusi intelektual yang bermartabat.',
        examples: [
          { text: 'The pursuit of knowledge is an obligation.', isCorrect: true, translation: 'Menuntut ilmu adalah sebuah kewajiban.' },
          { text: 'The development of character starts from within.', isCorrect: true, translation: 'Pengembangan karakter dimulai dari dalam diri.' },
          { text: 'Sincerity of heart is the essence of every deed.', isCorrect: true, translation: 'Keikhlasan hati adalah esensi dari setiap amal.' },
          { text: 'The spread of peace is our primary objective.', isCorrect: true, translation: 'Penyebaran perdamaian adalah tujuan utama kita.' },
          { text: 'Gratitude for blessings increases our abundance.', isCorrect: true, translation: 'Rasa syukur atas nikmat meningkatkan keberlimpahan kita.' }
        ]
      }
    ],
    mindmap: {
      id: 'c2-nom-root', label: 'NOMINALIZATION', type: 'root', children: [
        { id: 'logic-n', label: 'From Action to Concept', type: 'main', children: [
          { id: 'obj-n', label: 'Objective & Academic Tone', type: 'sub' },
          { id: 'den-n', label: 'High Lexical Density', type: 'sub' }
        ]},
        { id: 'suffix', label: 'Common Suffixes', type: 'formula', children: [
          { id: 'tion', label: '-tion, -ment, -ity, -ance', type: 'sub' }
        ]},
        { id: 'prep-shift', label: 'Preposition Awareness', type: 'warning', detail: 'Verb+Prep -> Noun+Prep' }
      ]
    }
  },
  {
    id: 'c2-proportional-correlatives',
    title: '5. Proportional Correlatives',
    level: 'C2',
    icon: 'fa-balance-scale-right',
    description: 'Menguasai struktur "The more... the better" untuk menjelaskan hubungan sebab-akibat yang proporsional secara retoris.',
    sections: [
      {
        heading: '1. Logika Korelasi: Hubungan Simbiotis',
        content: 'Proportional Correlatives adalah struktur kalimat ganda yang menunjukkan bagaimana perubahan pada satu hal secara langsung memengaruhi hal lainnya secara proporsional. Polanya unik: **THE + Comparative + Subject + Verb, THE + Comparative + Subject + Verb**. Ini adalah alat yang sangat efektif untuk merangkum logika kompleks menjadi frasa yang mudah diingat.\n\nStruktur ini sering digunakan dalam pepatah, prinsip ekonomi, atau nasihat bijak. Ia memberikan ritme yang seimbang pada kalimat, menciptakan harmoni antara dua ide yang saling bergantung. Di level C2, Anda diharapkan mampu menyusun korelasi ini dengan kosa kata yang canggih untuk memberikan penekanan yang berwibawa pada argumen Anda.',
        formula: 'The [Comp] + S + V, The [Comp] + S + V',
        exceptions: 'Menjelaskan hubungan simbiotis di mana perubahan satu hal memengaruhi hal lainnya secara proporsional.',
        examples: [
          { text: 'The more you learn, the more you realize how little you know.', isCorrect: true, translation: 'Semakin banyak kamu belajar, semakin kamu menyadari betapa sedikit yang kamu tahu.' },
          { text: 'The harder you work, the luckier you become.', isCorrect: true, translation: 'Semakin keras kamu bekerja, semakin beruntung kamu jadinya.' },
          { text: 'The faster we finish, the earlier we can go home.', isCorrect: true, translation: 'Semakin cepat kita selesai, semakin awal kita bisa pulang.' },
          { text: 'The more generous she is, the happier she feels.', isCorrect: true, translation: 'Semakin dermawan dia, semakin bahagia dia rasakan.' },
          { text: 'The higher the pressure, the better the result.', isCorrect: true, translation: 'Semakin tinggi tekanannya, semakin baik hasilnya.' }
        ]
      },
      {
        heading: '2. Struktur Ringkas: Tanpa Kata Kerja',
        content: 'Dalam percakapan yang sangat fasih atau penulisan yang padat, kita seringkali menghilangkan subjek dan kata kerja dalam struktur ini jika maknanya sudah sangat jelas dari konteks. Hasilnya adalah frasa yang sangat tajam dan berdaya ingat tinggi, seperti "The more, the merrier".\n\nTeknik pemangkasan ini menunjukkan tingkat kefasihan yang luar biasa karena Anda mampu mengomunikasikan logika yang dalam hanya dengan beberapa kata kunci. Gunakan teknik ini saat Anda ingin memberikan kesimpulan yang kuat atau saat menjawab pertanyaan dengan gaya bahasa yang cerdas dan efisien.',
        formula: 'The [Comp], the [Comp]',
        exceptions: 'Omit subjek dan kata kerja untuk menciptakan pepatah atau kesimpulan yang sangat tajam dan efisien.',
        examples: [
          { text: 'The sooner, the better.', isCorrect: true, translation: 'Semakin cepat, semakin baik.' },
          { text: 'The bigger, the better.', isCorrect: true, translation: 'Semakin besar, semakin baik.' },
          { text: 'The more, the merrier.', isCorrect: true, translation: 'Semakin banyak, semakin meriah.' },
          { text: 'The less said, the better.', isCorrect: true, translation: 'Semakin sedikit yang dikatakan, semakin baik.' },
          { text: 'The cheaper, the worse.', isCorrect: true, translation: 'Semakin murah, semakin buruk.' }
        ]
      },
      {
        heading: '3. Korelasi Terbalik (Inverse Proportionality)',
        content: 'Struktur ini juga bisa digunakan untuk menunjukkan hubungan yang bertolak belakang (terbalik). Misalnya, ketika satu hal bertambah, hal lainnya justru berkurang. Kita menggunakan kata sifat yang berlawanan seperti *more vs less* atau *higher vs lower*.\n\n"The more he talks, the less I understand." Kalimat ini memberikan nuansa kritik atau observasi yang sangat tajam. Menggunakan korelasi terbalik secara tepat menunjukkan kemampuan Anda dalam menganalisis paradoks atau situasi yang kontradiktif dengan cara yang terstruktur dan elegan.',
        formula: 'Inverse Proportionality (More... less)',
        exceptions: 'Gunakan untuk menganalisis paradoks atau situasi yang kontradiktif secara elegan.',
        examples: [
          { text: 'The more he earns, the less he saves.', isCorrect: true, translation: 'Semakin banyak dia hasilkan, semakin sedikit dia tabung.' },
          { text: 'The more she practices, the fewer mistakes she makes.', isCorrect: true, translation: 'Semakin banyak dia berlatih, semakin sedikit kesalahan yang dia buat.' },
          { text: 'The more complex the problem, the simpler the solution should be.', isCorrect: true, translation: 'Semakin kompleks masalahnya, seharusnya semakin simpel solusinya.' },
          { text: 'The more we wait, the lower our chances become.', isCorrect: true, translation: 'Semakin lama kita menunggu, semakin rendah kesempatan kita.' },
          { text: 'The less you care, the more peaceful you are.', isCorrect: true, translation: 'Semakin sedikit kamu peduli, semakin damai dirimu.' }
        ]
      },
      {
        heading: '4. Variasi dengan Kata Keterangan (Adverbs)',
        content: 'Anda tidak harus selalu menggunakan kata sifat (Adjectives); Anda juga bisa menggunakan kata keterangan (Adverbs) untuk menunjukkan korelasi antara cara sebuah aksi dilakukan dengan hasilnya. Contoh: "The more clearly you speak, the better they listen."\n\nFleksibilitas ini memungkinkan Anda untuk mendeskripsikan proses kinerja atau kualitas interaksi dengan sangat detail. Di level Master, pemilihan adverbs yang tepat dalam struktur ini adalah cara yang hebat untuk memberikan instruksi yang presisi atau mengevaluasi efektivitas suatu tindakan.',
        formula: 'The [Adverb] ..., the [Adverb] ...',
        exceptions: 'Gunakan kata keterangan untuk menunjukkan korelasi antara cara aksi dilakukan dengan hasilnya.',
        examples: [
          { text: 'The more fluently you speak, the more confident you sound.', isCorrect: true, translation: 'Semakin fasih kamu bicara, semakin percaya diri kedengarannya.' },
          { text: 'The more deeply we think, the more wisdom we find.', isCorrect: true, translation: 'Semakin dalam kita berpikir, semakin banyak hikmah yang kita temukan.' },
          { text: 'The more carefully you drive, the safer you are.', isCorrect: true, translation: 'Semakin hati-hati kamu berkendara, semakin aman dirimu.' },
          { text: 'The more sincerely you pray, the calmer you feel.', isCorrect: true, translation: 'Semakin tulus kamu berdoa, semakin tenang perasaanmu.' },
          { text: 'The more efficiently we work, the more time we save.', isCorrect: true, translation: 'Semakin efisien kita bekerja, semakin banyak waktu yang kita hemat.' }
        ]
      },
      {
        heading: '5. Etika Syukur dan Kesadaran (Muhasabah)',
        content: 'Dalam Islam, prinsip korelasi ini sering ditemukan dalam janji Allah: "The more grateful you are, the more I will increase you." (Korelasi antara syukur dan tambahan nikmat). Menggunakan tenses ini membantu kita merumuskan prinsip hidup yang bertaqwa.\n\nBahasa yang proporsional mengajarkan kita tentang keadilan dan keseimbangan hidup. Dengan menyusun kalimat korelasi yang baik, kita belajar untuk selalu menghubungkan usaha kita dengan hasil akhir yang kita dambakan di sisi-Nya. Jadikanlah setiap struktur "The more..." sebagai pengingat untuk terus meningkatkan kualitas diri dan pengabdian kepada-Nya.',
        formula: 'Etika Syukur (Muhasabah)',
        exceptions: 'Gunakan struktur proporsional untuk merumuskan prinsip keseimbangan antara usaha dan hasil di sisi-Nya.',
        examples: [
          { text: 'The more we give in charity, the more our wealth is blessed.', isCorrect: true, translation: 'Semakin banyak kita bersedekah, semakin diberkahi harta kita.' },
          { text: 'The more we remember Allah, the more our hearts find rest.', isCorrect: true, translation: 'Semakin banyak kita mengingat Allah, semakin tenang hati kita.' },
          { text: 'The more patient we are, the greater our reward will be.', isCorrect: true, translation: 'Semakin sabar kita, semakin besar pahala kita nantinya.' },
          { text: 'The more we seek knowledge, the closer we get to the truth.', isCorrect: true, translation: 'Semakin banyak kita mencari ilmu, semakin dekat kita dengan kebenaran.' },
          { text: 'The more humble a person is, the higher they are raised by Allah.', isCorrect: true, translation: 'Semakin rendah hati seseorang, semakin tinggi derajatnya diangkat oleh Allah.' }
        ]
      }
    ],
    mindmap: {
      id: 'c2-pc-root', label: 'PROPORTIONAL CORRELATIVES', type: 'root', children: [
        { id: 'formula', label: 'The Pattern', type: 'formula', children: [
          { id: 'f-long', label: 'THE + Comp .. THE + Comp', type: 'formula' }
        ]},
        { id: 'types', label: 'Variations', type: 'main', children: [
          { id: 'adj-corr', label: 'Adjectives (The better, the cheaper)', type: 'sub' },
          { id: 'adv-corr', label: 'Adverbs (The faster, the more clearly)', type: 'sub' },
          { id: 'inv-corr', label: 'Inverse (More... less)', type: 'sub' }
        ]},
        { id: 'omission', label: 'Brevity', type: 'sub', detail: 'Omit Subj/Verb for catchy maxims.' }
      ]
    }
  },
  {
    id: 'c2-advanced-ellipsis',
    title: '6. Advanced Ellipsis & Substitution',
    level: 'C2',
    icon: 'fa-ghost',
    description: 'Menguasai seni penghilangan kata dan penggantian frasa untuk mencapai efisiensi bahasa yang sangat tinggi dan natural.',
    sections: [
      {
        heading: '1. Logika Brevitas: Menghapus yang Redundan',
        content: 'Ellipsis di level Master adalah tentang kemampuan membuang kata-kata yang secara logis sudah terwakili oleh konteks global, bukan sekadar konteks kalimat. Ini menciptakan aliran bahasa yang sangat "lean" (ramping) dan menunjukkan rasa percaya diri penulis bahwa pembacanya memiliki kecerdasan yang setara.\n\nDalam teks akademik atau sastra tingkat tinggi, ellipsis digunakan untuk menghindari repetisi yang membosankan dan untuk mempercepat ritme argumen. Misalnya, "Some people like the traditional approach, others (like) the modern (approach)." Dengan membuang kata yang diulang, ide Anda terasa lebih tajam dan fokus pada perbandingannya.',
        formula: 'Brevity (Omission)',
        exceptions: 'Penghilangan kata yang redundan menunjukkan rasa percaya diri terhadap kecerdasan pembaca.',
        examples: [
          { text: 'Ahmad has been to Mecca, and so has Ali.', isCorrect: true, translation: 'Ahmad sudah ke Mekkah, begitu juga Ali.' },
          { text: 'I don\'t want to go, but I have to (go).', isCorrect: true, translation: 'Saya tidak mau pergi, tapi saya harus (pergi).' },
          { text: 'She can speak English, but her brother can\'t (speak English).', isCorrect: true, translation: 'Dia bisa bicara bahasa Inggris, tapi saudaranya tidak bisa.' },
          { text: 'If (it is) necessary, we will call you.', isCorrect: true, translation: 'Jika perlu, kami akan menghubungimu.' },
          { text: 'He promised to help, and he did (help).', isCorrect: true, translation: 'Dia berjanji akan membantu, dan dia benar-benar membantu.' }
        ]
      },
      {
        heading: '2. Substitution: Mengganti Ide dengan "DO" dan "SO"',
        content: 'Substitution adalah teknik mengganti seluruh frasa atau klausa dengan satu kata pendek untuk menjaga kohesi teks. "Do/Does/Did" digunakan sebagai pengganti frasa kata kerja, sementara "So" dan "Not" seringkali menggantikan seluruh pernyataan atau klausa pelengkap.\n\nPenggunaan "I think so" atau "I hope not" adalah dasar, namun di level C2, Anda belajar untuk menggunakan substitution dalam struktur yang lebih kompleks. Teknik ini memungkinkan Anda untuk merujuk kembali pada argumen panjang sebelumnya hanya dengan satu kata kunci, menjaga pembaca tetap pada jalur pemikiran Anda tanpa harus mengulang narasi dari awal.',
        formula: 'Substitution (Do/So/Not)',
        exceptions: 'Gunakan sebagai alat kohesi untuk merujuk kembali pada argumen panjang tanpa pengulangan.',
        examples: [
          { text: 'They believe the project will succeed, and I do too.', isCorrect: true, translation: 'Mereka percaya proyeknya akan berhasil, dan saya juga percaya begitu.' },
          { text: 'Will it rain? I suspect so.', isCorrect: true, translation: 'Apakah akan hujan? Saya rasa begitu.' },
          { text: 'Do you want to join? If so, let me know.', isCorrect: true, translation: 'Kamu mau ikut? Jika demikian, beri tahu saya.' },
          { text: 'He might be late, but I hope not.', isCorrect: true, translation: 'Dia mungkin telat, tapi saya harap tidak.' },
          { text: 'She speaks Arabic well, and so does her teacher.', isCorrect: true, translation: 'Dia bicara bahasa Arab dengan baik, begitu juga gurunya.' }
        ]
      },
      {
        heading: '3. Gapping: Penghilangan Kata Kerja di Tengah',
        content: 'Gapping adalah bentuk ellipsis yang lebih ekstrem di mana kata kerja utama dihilangkan pada klausa kedua karena identik dengan klausa pertama. Contoh: "Sarah ordered tea and Ali (ordered) coffee." Struktur ini sangat umum dalam deskripsi paralel yang elegan.\n\nMenggunakan gapping secara tepat memberikan kesan bahwa Anda adalah seorang komunikator yang sangat efisien. Namun, berhati-hatilah untuk tidak melakukannya secara berlebihan jika subjek atau objeknya terlalu berbeda, karena bisa memicu ambiguitas. C2 menuntut Anda tahu persis kapan gapping memperjelas dan kapan ia membingungkan.',
        formula: 'Gapping (Mid-verb omission)',
        exceptions: 'Hati-hati dengan ambiguitas; gunakan hanya jika hubungan klausa sangat paralel dan jelas.',
        examples: [
          { text: 'My father likes books; my mother, flowers.', isCorrect: true, translation: 'Ayah saya suka buku; ibu saya, bunga.' },
          { text: 'Cairo is the capital of Egypt; Jakarta, of Indonesia.', isCorrect: true, translation: 'Kairo adalah ibukota Mesir; Jakarta, ibukota Indonesia.' },
          { text: 'One team wore blue shirts; the other, red.', isCorrect: true, translation: 'Satu tim memakai kaus biru; yang lain, merah.' },
          { text: 'He gave me a book; she, a pen.', isCorrect: true, translation: 'Dia memberi saya buku; dia (perempuan), pena.' },
          { text: 'The first lesson was easy; the second, hard.', isCorrect: true, translation: 'Pelajaran pertama mudah; yang kedua, sulit.' }
        ]
      },
      {
        heading: '4. Sluicing: Membuang Klausa setelah Kata Tanya',
        content: 'Sluicing terjadi ketika kita hanya meninggalkan kata tanya (Wh-words) dan membuang seluruh klausa yang mengikutinya karena sudah disebutkan sebelumnya. Contoh: "Someone called me, but I don\'t know WHO (called me)."\n\nIni adalah ciri khas percakapan natural penutur asli yang sangat lincah. Mempelajari sluicing akan membantu Anda dalam sesi tanya-jawab atau debat cepat. Ia memungkinkan Anda untuk menunjukkan rasa ingin tahu atau ketidakpastian dengan cara yang sangat singkat namun tetap secara tata bahasa benar dan sangat berpendidikan.',
        formula: 'Sluicing (Wh-word only)',
        exceptions: 'Gunakan dalam percakapan cepat untuk menunjukkan ketidakpastian atau rasa ingin tahu secara ringkas.',
        examples: [
          { text: 'He is leaving, but he didn\'t say when.', isCorrect: true, translation: 'Dia akan pergi, tapi tidak bilang kapan.' },
          { text: 'They are hiding something, but I don\'t know what.', isCorrect: true, translation: 'Mereka menyembunyikan sesuatu, tapi saya tidak tahu apa.' },
          { text: 'Someone is calling outside; can you see who?', isCorrect: true, translation: 'Ada yang memanggil di luar; bisa lihat siapa?' },
          { text: 'We need to fix this, but we aren\'t sure how.', isCorrect: true, translation: 'Kita perlu memperbaiki ini, tapi tidak yakin bagaimana.' },
          { text: 'She visited a city, but I forgot which.', isCorrect: true, translation: 'Dia mengunjungi sebuah kota, tapi saya lupa yang mana.' }
        ]
      },
      {
        heading: '5. Konteks Amanah: Ringkas namun Jelas (Jawami\'ul Kalim)',
        content: 'Dalam Islam, berbicara yang ringkas namun padat makna (*Jawami\'ul Kalim*) adalah sebuah keutamaan. Ellipsis dan substitution adalah wujud linguistik dari prinsip ini dalam bahasa Inggris. Kita menghilangkan pengulangan yang tidak perlu untuk menonjolkan esensi pesan.\n\nNamun, kejujuran (Sidiq) tetap menjadi prioritas. Jangan sampai penghilangan kata (ellipsis) mengubah makna atau menutupi kebenaran yang harus disampaikan secara utuh. Bahasa yang cerdas adalah bahasa yang tahu kapan harus berhenti bicara namun tetap bisa dipahami maksud baiknya oleh orang lain dengan sempurna.',
        formula: 'Jawami\'ul Kalim (Concise Speech)',
        exceptions: 'Ringkaslah bahasa Anda tanpa mengurangi kebenaran, guna menjaga amanah dalam berkomunikasi.',
        examples: [
          { text: 'He promised to help, and he did.', isCorrect: true, translation: 'Dia berjanji akan membantu, dan dia melakukannya.' },
          { text: 'Allah loves those who do good, and we should too.', isCorrect: true, translation: 'Allah mencintai mereka yang berbuat baik, dan kita juga harus begitu.' },
          { text: 'Recite what is easy for you (to recite).', isCorrect: true, translation: 'Bacalah apa yang mudah bagimu (untuk dibaca).' },
          { text: 'If you can help, do (help).', isCorrect: true, translation: 'Jika kamu bisa membantu, bantulah.' },
          { text: 'Some seek fame; the wise, knowledge.', isCorrect: true, translation: 'Ada yang mencari ketenaran; orang bijak, ilmu.' }
        ]
      }
    ],
    mindmap: {
      id: 'c2-els-root', label: 'ELLIPSIS & SUBSTITUTION', type: 'root', children: [
        { id: 'ellipsis', label: 'Ellipsis (Removal)', type: 'main', children: [
          { id: 'gapping', label: 'Gapping (Mid-verb)', type: 'sub' },
          { id: 'sluicing', label: 'Sluicing (Wh-only)', type: 'sub' },
          { id: 'aux-e', label: 'Auxiliary removal', type: 'sub' }
        ]},
        { id: 'subst', label: 'Substitution (Replace)', type: 'main', children: [
          { id: 'do-s', label: 'Do/Does/Did for Verbs', type: 'formula' },
          { id: 'so-not', label: 'So/Not for Clauses', type: 'formula' },
          { id: 'one-s', label: 'One/Ones for Nouns', type: 'formula' }
        ]}
      ]
    }
  },
  {
    id: 'c2-impersonal-passive',
    title: '7. Impersonal Passive & Distanced Reporting',
    level: 'C2',
    icon: 'fa-newspaper',
    description: 'Teknik melaporkan opini publik, temuan ilmiah, dan rumor dengan objektivitas tinggi dan jarak profesional.',
    sections: [
      {
        heading: '1. Logika Jarak: Objektivitas Tanpa "Saya"',
        content: 'Impersonal Passive digunakan untuk menyampaikan informasi atau opini tanpa harus menyebutkan siapa sumber spesifiknya. Ini menciptakan kesan bahwa informasi tersebut bersifat universal, berdasarkan konsensus, atau bersifat ilmiah. Struktur ini adalah standar emas dalam jurnalisme internasional dan penulisan tesis akademik.\n\nAda dua pola utama: **It is said that...** (pola pasif murni) dan **He is thought to be...** (pola personal-pasif). Dengan menggunakan struktur ini, Anda menjaga jarak profesional antara diri Anda sebagai penyampai berita dan isi berita tersebut, yang sangat krusial dalam diskusi yang sensitif atau saat menyampaikan fakta yang belum 100% terverifikasi.',
        formula: 'It is said that... / He is thought to be...',
        exceptions: 'Menciptakan objektivitas universal dan jarak profesional dalam melaporkan informasi sensitif.',
        examples: [
          { text: 'It is expected that the economy will grow.', isCorrect: true, translation: 'Diharapkan bahwa ekonomi akan tumbuh.' },
          { text: 'He is believed to have discovered a new planet.', isCorrect: true, translation: 'Dia diyakini telah menemukan planet baru.' },
          { text: 'It is known that patience leads to success.', isCorrect: true, translation: 'Diketahui bahwa kesabaran membawa pada kesuksesan.' },
          { text: 'She is considered to be the best student.', isCorrect: true, translation: 'Dia dianggap sebagai murid terbaik.' },
          { text: 'It is reported that the mission was a success.', isCorrect: true, translation: 'Dilaporkan bahwa misinya sukses.' }
        ]
      },
      {
        heading: '2. Pola Infinitif: Menghubungkan Subjek dan Status',
        content: 'Pola kedua ("He is said TO BE...") lebih menonjolkan subjek utama namun tetap dalam bingkai pasif. Setelah To Be + V3, kita wajib menggunakan infinitif (*to be, to do, to have done*). Pilihan jenis infinitif ini menentukan kapan aksi tersebut terjadi (sekarang atau masa lalu).\n\n"He is thought TO HAVE ESCAPED" berarti dia diduga sudah kabur di masa lalu. "He is thought TO BE ESCAPING" berarti dia diduga sedang kabur sekarang. Ketelitian dalam memilih infinitif setelah pasif menunjukkan kemampuan Anda dalam melaporkan detail waktu kejadian yang sangat presisi dalam laporan investigasi atau biografi tokoh.',
        formula: 'Passive + to-Infinitive (to have done)',
        exceptions: 'Pilihan jenis infinitif menentukan ketepatan waktu kejadian (sekarang atau masa lalu).',
        examples: [
          { text: 'He is thought to be living in Cairo now.', isCorrect: true, translation: 'Dia diduga sedang tinggal di Kairo sekarang.', note: 'Continuous status.' },
          { text: 'They are believed to have finished the work.', isCorrect: true, translation: 'Mereka diyakini telah menyelesaikan pekerjaan tersebut.', note: 'Past result.' },
          { text: 'The city is said to be very ancient.', isCorrect: true, translation: 'Kotanya dikatakan sangat kuno.' },
          { text: 'The documents are reported to have been stolen.', isCorrect: true, translation: 'Dokumen-dokumennya dilaporkan telah dicuri.', note: 'Passive infinitive.' },
          { text: 'She is rumored to be writing a new book.', isCorrect: true, translation: 'Dia dirumorkan sedang menulis buku baru.' }
        ]
      },
      {
        heading: '3. Reporting Verbs: Beyond "Say" and "Think"',
        content: 'Di level Master, Anda harus memperluas kosakata kata kerja pelapor (Reporting Verbs) untuk memberikan nuansa kepercayaan yang berbeda. Gunakan kata-kata seperti *claim, allege, suggest, estimate, acknowledge,* dan *presume*.\n\nSetiap kata kerja memberikan bobot kepastian yang berbeda. "He is alleged to..." menyiratkan adanya tuduhan hukum, sementara "He is acknowledged to..." menyiratkan adanya pengakuan publik atas prestasinya. Memilih kata yang tepat adalah bagian dari integritas Anda sebagai penulis yang menghargai akurasi nuansa emosional dan legal dari sebuah informasi.',
        formula: 'Alleged / Estimated / Acknowledged',
        exceptions: 'Pilihlah Reporting Verb yang tepat untuk memberikan bobot kepastian yang akurat secara legal.',
        examples: [
          { text: 'He is alleged to have committed the crime.', isCorrect: true, translation: 'Dia dituduh telah melakukan kejahatan tersebut.' },
          { text: 'The damage is estimated to be millions of dollars.', isCorrect: true, translation: 'Kerusakannya diestimasi mencapai jutaan dolar.' },
          { text: 'She is acknowledged to be a pioneer in her field.', isCorrect: true, translation: 'Dia diakui sebagai pionir di bidangnya.' },
          { text: 'The plan is presumed to be safe.', isCorrect: true, translation: 'Rencananya dianggap aman.' },
          { text: 'It is claimed that the remedy works instantly.', isCorrect: true, translation: 'Diklaim bahwa obatnya bekerja secara instan.' }
        ]
      },
      {
        heading: '4. Passives with Continuous & Perfect Forms',
        content: 'Untuk situasi yang lebih kompleks, kita bisa menggabungkan impersonal passive dengan bentuk continuous atau perfect. "It is being reported that..." menunjukkan bahwa berita tersebut masih terus mengalir (breaking news). "It had been thought that..." menunjukkan adanya perubahan opini dari masa lalu.\n\nStruktur berlapis ini memberikan kedalaman dimensi waktu pada laporan Anda. Anda tidak hanya melaporkan fakta, tapi melaporkan SEJARAH bagaimana fakta tersebut dipahami oleh publik. Kemampuan ini sangat vital bagi analis kebijakan atau kritikus sejarah yang seringkali harus meninjau ulang perspektif lama.',
        formula: 'It is being reported... / It had been thought...',
        exceptions: 'Gunakan bentuk berlapis ini untuk melaporkan sejarah perkembangan opini publik secara dinamis.',
        examples: [
          { text: 'It is being suggested that we postpone the event.', isCorrect: true, translation: 'Sedang disarankan agar kita menunda acaranya.' },
          { text: 'It had been believed that the earth was flat.', isCorrect: true, translation: 'Dahulu pernah diyakini bahwa bumi itu datar.' },
          { text: 'It has been acknowledged that mistakes were made.', isCorrect: true, translation: 'Sudah diakui bahwa kesalahan telah dilakukan.' },
          { text: 'It is being claimed that a solution has been found.', isCorrect: true, translation: 'Sedang diklaim bahwa solusi telah ditemukan.' },
          { text: 'It was once thought that gravity worked differently.', isCorrect: true, translation: 'Pernah terpikirkan bahwa gravitasi bekerja secara berbeda.' }
        ]
      },
      {
        heading: '5. Etika Informasi: Menghindari Fitnah',
        content: 'Dalam Islam, menyampaikan berita yang belum jelas sumbernya bisa berujung pada fitnah atau ghibah. Penggunaan impersonal passive secara bijak membantu kita untuk tetap bersikap hati-hati (*Tabayyun*). "It is said that..." memberikan ruang keraguan yang sehat sebelum sebuah fakta benar-benar terbukti.\n\nBahasa yang objektif dan "berjarak" mencerminkan kematangan karakter seorang Muslim dalam menjaga lisan. Kita tidak terburu-buru menghakimi seseorang dengan kalimat aktif langsung, melainkan melaporkan apa yang berkembang di masyarakat dengan penuh kesantunan dan kehati-hatian intelektual demi menjaga keharmonisan ummat.',
        formula: 'Tabayyun (Verifikasi)',
        exceptions: 'Gunakan impersonal passive untuk bersikap hati-hati dalam menyampaikan berita demi menghindari fitnah.',
        examples: [
          { text: 'It is reported that the crescent moon has been sighted.', isCorrect: true, translation: 'Dilaporkan bahwa hilal telah terlihat.' },
          { text: 'He is considered to be a very pious person.', isCorrect: true, translation: 'Dia dianggap sebagai orang yang sangat saleh.' },
          { text: 'The message is believed to have reached everyone.', isCorrect: true, translation: 'Pesan tersebut diyakini telah sampai ke semua orang.' },
          { text: 'It is understood that we must wait for verification.', isCorrect: true, translation: 'Dipahami bahwa kita harus menunggu verifikasi.' },
          { text: 'They are thought to be working for the common good.', isCorrect: true, translation: 'Mereka diduga sedang bekerja untuk kebaikan bersama.' }
        ]
      }
    ],
    mindmap: {
      id: 'c2-ip-root', label: 'IMPERSONAL PASSIVE', type: 'root', children: [
        { id: 'it-pola', label: 'IT Pattern (Passive Clause)', type: 'main', children: [
          { id: 'it-form', label: 'It + be + V3 + that clause', type: 'formula' },
          { id: 'it-ex', label: 'It is said that...', type: 'example' }
        ]},
        { id: 'sub-pola', label: 'Subject Pattern (Personal)', type: 'main', children: [
          { id: 'sub-form', label: 'Subj + be + V3 + to-Infinitive', type: 'formula' },
          { id: 'sub-ex', label: 'He is thought to have...', type: 'example' }
        ]},
        { id: 'verbs-list', label: 'Reporting Verbs', type: 'sub', detail: 'Alleged, Estimated, Acknowledged, Presumed.' }
      ]
    }
  },
  {
    id: 'c2-speculative-future',
    title: '8. Speculative Future Perfect Continuous',
    level: 'C2',
    icon: 'fa-hourglass-half',
    description: 'Proyeksi masa depan yang sangat spesifik, menggabungkan durasi, target penyelesaian, dan spekulasi logis.',
    sections: [
      {
        heading: '1. Konsep Akumulasi: Menghargai Investasi Waktu',
        content: 'Tenses ini (**Will have been + Verb-ing**) adalah yang paling kompleks dalam sistem waktu bahasa Inggris. Ia digunakan untuk menyatakan SEBERAPA LAMA sebuah aksi akan sudah berlangsung pada titik waktu tertentu di masa depan. Fokusnya bukan pada selesainya aksi, tapi pada akumulasi usaha yang telah diinvestasikan.\n\nBayangkan Anda sedang belajar bahasa Inggris hari ini. Jika Anda konsisten, tahun depan Anda bisa berkata: "By next year, I will have been learning for two years." Tenses ini memberikan nuansa kemegahan pada sebuah pencapaian karena ia menonjolkan ketekunan (Istiqomah) Anda dalam durasi yang panjang.',
        formula: 'Will have been + V-ing',
        exceptions: 'Menekankan akumulasi usaha (Istiqomah) yang diinvestasikan dalam durasi waktu yang panjang.',
        examples: [
          { text: 'By 2030, I will have been working here for twenty years.', isCorrect: true, translation: 'Menjelang tahun 2030, saya akan sudah bekerja di sini selama dua puluh tahun.' },
          { text: 'Next June, she will have been living in Cairo for a decade.', isCorrect: true, translation: 'Juni depan, dia akan sudah tinggal di Kairo selama satu dekade.' },
          { text: 'In two hours, we will have been driving for 500 miles.', isCorrect: true, translation: 'Dalam dua jam, kita akan sudah menyetir sejauh 500 mil.' },
          { text: 'By Ramadan, they will have been fasting for 10 years.', isCorrect: true, translation: 'Menjelang Ramadhan, mereka akan sudah berpuasa selama 10 tahun.' },
          { text: 'How long will you have been traveling by the time you reach Mecca?', isCorrect: true, translation: 'Berapa lama kamu akan sudah bepergian pada saat kamu sampai di Mekkah?' }
        ]
      },
      {
        heading: '2. Syarat Penggunaan: Durasi dan Deadline',
        content: 'Ada dua elemen wajib dalam tenses ini: DURASI (for 2 hours, for a year) dan TITIK WAKTU MASA DEPAN (by next Monday, by the time you arrive). Tanpa salah satu dari ini, kalimat Anda tidak akan memiliki konteks akumulasi yang kuat.\n\nPenggunaan "By the time" seringkali memicu kalimat majemuk. Ingatlah aturan: setelah "By the time," gunakan Present Simple, bukan Future. Contoh: "By the time you *arrive* (Present), I *will have been waiting* (Future) for an hour." Ketelitian sinkronisasi waktu ini adalah tanda kematangan linguistik level C2.',
        formula: 'By the time + Present Simple',
        exceptions: 'Pastikan sinkronisasi waktu; gunakan Present Simple setelah klausa "By the time".',
        examples: [
          { text: 'By the time she graduates, she will have been studying for four years.', isCorrect: true, translation: 'Pada saat dia lulus, dia akan sudah belajar selama empat tahun.' },
          { text: 'We will have been waiting for hours by the time the bus arrives.', isCorrect: true, translation: 'Kita akan sudah menunggu berjam-jam pada saat busnya tiba.' },
          { text: 'I will have been learning Arabic for months by then.', isCorrect: true, translation: 'Saya akan sudah belajar bahasa Arab selama berbulan-bulan pada saat itu.' },
          { text: 'By midnight, it will have been raining for ten hours.', isCorrect: true, translation: 'Menjelang tengah malam, hujan akan sudah turun selama sepuluh jam.' },
          { text: 'They will have been traveling for a week by next Friday.', isCorrect: true, translation: 'Mereka akan sudah bepergian selama seminggu pada Jumat depan.' }
        ]
      },
      {
        heading: '3. State Verbs: Batasan Continuous',
        content: 'Penting untuk diingat bahwa kata kerja statis (*State Verbs*) seperti *know, believe, love, own, understand* TIDAK BOLEH masuk ke bentuk Continuous. Jika Anda ingin menyatakan durasi untuk kata-kata ini, gunakanlah Future Perfect Simple (**Will have + V3**).\n\nKesalahan umum adalah berkata "I will have been knowing him." Bentuk yang benar: "I will have known him for years." Memahami batasan ini menunjukkan bahwa Anda memiliki insting bahasa yang sangat tajam dan tidak terjebak dalam rumus "-ing" secara membabi buta.',
        formula: 'State Verbs Exclusion',
        exceptions: 'Gunakan Future Perfect Simple (Will have + V3) untuk kata kerja statis yang tidak mengenal durasi.',
        examples: [
          { text: 'By next year, I will have known Ali for five years.', isCorrect: true, translation: 'Tahun depan, saya akan sudah mengenal Ali selama lima tahun.' },
          { text: 'She will have owned this car for a decade by August.', isCorrect: true, translation: 'Dia akan sudah memiliki mobil ini selama satu dekade menjelang Agustus.' },
          { text: 'I will have been studying for three hours.', isCorrect: true, translation: 'Saya akan sudah belajar selama tiga jam.', note: 'Action verb, continuous ok.' },
          { text: 'We will have lived here for long.', isCorrect: true, translation: 'Kita akan sudah tinggal di sini lama.', note: 'Live can be simple or continuous.' },
          { text: 'They will have been practicing for months.', isCorrect: true, translation: 'Mereka akan sudah berlatih selama berbulan-bulan.' }
        ]
      },
      {
        heading: '4. Nuansa Prediksi dan Spekulasi Penyebab',
        content: 'Selain durasi, tenses ini juga bisa digunakan untuk memprediksi penyebab dari sebuah kondisi di masa depan. Misalnya, jika Anda tahu besok Ali akan lari maraton selama 5 jam, Anda bisa berasumsi: "He will be exhausted because he will have been running all morning."\n\nPenggunaan ini memberikan kedalaman pada karakter atau subjek dalam cerita Anda. Anda tidak hanya menyebutkan mereka lelah, tapi memberikan alasan berupa proses yang panjang. Ini adalah teknik narasi yang sangat berguna bagi penulis profesional untuk membangun empati dan realisme dalam teks mereka.',
        formula: 'Prediction of Cause',
        exceptions: 'Gunakan untuk memprediksi alasan logis di balik kondisi fisik atau mental di masa depan.',
        examples: [
          { text: 'You will be tired because you will have been studying all night.', isCorrect: true, translation: 'Kamu akan lelah karena kamu akan sudah belajar semalaman.' },
          { text: 'She will be hungry because she will have been fasting for 14 hours.', isCorrect: true, translation: 'Dia akan lapar karena dia akan sudah berpuasa selama 14 jam.' },
          { text: 'The engine will be hot because it will have been running for days.', isCorrect: true, translation: 'Mesinnya akan panas karena akan sudah menyala selama berhari-hari.' },
          { text: 'They will be happy because they will have been learning all week.', isCorrect: true, translation: 'Mereka akan senang karena mereka akan sudah belajar sepanjang minggu.' },
          { text: 'I will be fit because I will have been exercising regularly.', isCorrect: true, translation: 'Saya akan bugar karena saya akan sudah berolahraga secara teratur.' }
        ]
      },
      {
        heading: '5. Konteks Mujahadah: Istiqomah yang Terakumulasi',
        content: 'Dalam Islam, nilai sebuah amal seringkali diukur dari keistiqomahannya. Future Perfect Continuous membantu kita memvisualisasikan "gunung pahala" dari akumulasi kebaikan harian kita. "InshaAllah, I will have been reciting the Quran every day for years when I meet my Lord."\n\nVisualisasi masa depan ini memberikan energi (Himmah) bagi kita untuk terus berproses hari ini. Bahasa proyeksi waktu ini mengingatkan kita bahwa setiap detik yang kita habiskan untuk belajar atau beribadah sedang tercatat dan terakumulasi menjadi sejarah hidup yang mulia di masa depan. Gunakan tenses ini sebagai penyemangat jiwa dalam perjalanan mencari ilmu.',
        formula: 'Mujahadah (Accumulated Effort)',
        exceptions: 'Visualisasikan akumulasi amal shaleh sebagai motivasi spiritual untuk terus berproses hari ini.',
        examples: [
          { text: 'InshaAllah, I will have been seeking knowledge all my life.', isCorrect: true, translation: 'InshaAllah, saya akan sudah menuntut ilmu sepanjang hidup saya.' },
          { text: 'By next Eid, we will have been helping the needy for three years.', isCorrect: true, translation: 'Menjelang Idul Fitri depan, kita akan sudah membantu orang yang membutuhkan selama tiga tahun.' },
          { text: 'She will have been wearing the hijab for a decade next June, InshaAllah.', isCorrect: true, translation: 'Dia akan sudah memakai hijab selama satu dekade Juni depan, InshaAllah.' },
          { text: 'The community will have been growing for years by then.', isCorrect: true, translation: 'Komunitasnya akan sudah berkembang selama bertahun-tahun pada saat itu.' },
          { text: 'I will have been practicing patience in every trial, InshaAllah.', isCorrect: true, translation: 'Saya akan sudah melatih kesabaran dalam setiap ujian, InshaAllah.' }
        ]
      }
    ],
    mindmap: {
      id: 'c2-fpc-root', label: 'FUTURE PERFECT CONT', type: 'root', children: [
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
    id: 'c2-compound-modifiers',
    title: '9. Compound Modifiers in Formal Discourse',
    level: 'C2',
    icon: 'fa-link',
    description: 'Membangun kata sifat majemuk yang sangat deskriptif dan teknis untuk efisiensi penulisan tingkat lanjut.',
    sections: [
      {
        heading: '1. Logika Deskripsi Padat: Menggabungkan Dua Kata',
        content: 'Compound modifiers adalah penggunaan dua atau lebih kata yang bekerja sama sebagai satu kata sifat tunggal untuk mendeskripsikan sebuah benda. Ciri khasnya adalah penggunaan tanda hubung (Hyphen). Contoh: "A *well-known* scholar" lebih ringkas daripada "A scholar who is known very well."\n\nDi level C2, teknik ini bukan lagi opsional, melainkan kebutuhan untuk mencapai densitas informasi yang tinggi. Ia memungkinkan Anda untuk memberikan detail visual atau teknis yang sangat kaya dalam waktu singkat. Penggunaan tanda hubung yang tepat menunjukkan ketelitian Anda dalam menjaga struktur makna agar tidak tertukar dengan kata benda lainnya.',
        formula: '[Word1]-[Word2] + Noun',
        exceptions: 'Tanda hubung (hyphen) sangat krusial untuk menjaga makna agar tidak ambigu.',
        examples: [
          { text: 'He is a world-renowned scientist.', isCorrect: true, translation: 'Dia adalah ilmuwan yang terkenal di dunia.' },
          { text: 'We need a long-term solution.', isCorrect: true, translation: 'Kita butuh solusi jangka panjang.' },
          { text: 'She is a highly-respected teacher.', isCorrect: true, translation: 'Dia adalah guru yang sangat dihormati.' },
          { text: 'It was a life-changing experience.', isCorrect: true, translation: 'Itu adalah pengalaman yang mengubah hidup.' },
          { text: 'They are hard-working students.', isCorrect: true, translation: 'Mereka adalah murid-murid yang bekerja keras.' }
        ]
      },
      {
        heading: '2. Pola Pembentukan: Adverb + Participle',
        content: 'Pola paling populer adalah menggabungkan kata keterangan dengan kata kerja partisipel. **Well- + V3** (well-educated) atau **Fast- + V-ing** (fast-moving). Pola ini memberikan nuansa profesional pada deskripsi Anda, sering ditemukan dalam literatur bisnis dan akademik.\n\nIngatlah aturan emasnya: tanda hubung digunakan hanya jika kata sifat majemuk tersebut berada SEBELUM kata benda. Jika ia berada setelah kata kerja (seperti "The scientist is well known"), maka tanda hubung biasanya dihilangkan. Memahami aturan posisi ini adalah tanda bahwa Anda adalah seorang penulis yang sangat teliti terhadap detail teknis.',
        formula: 'Well/Fast/... + V-ing/V3',
        exceptions: 'Tanda hubung hanya digunakan jika modifier berada SEBELUM kata benda.',
        examples: [
          { text: 'A beautifully-written letter.', isCorrect: true, translation: 'Surat yang ditulis dengan indah.' },
          { text: 'The letter was beautifully written.', isCorrect: true, translation: 'Suratnya ditulis dengan indah.', note: 'No hyphen after verb.' },
          { text: 'A brightly-lit room.', isCorrect: true, translation: 'Ruangan yang diterangi dengan terang.' },
          { text: 'A custom-built computer.', isCorrect: true, translation: 'Komputer yang dibangun secara kustom.' },
          { text: 'A long-lasting friendship.', isCorrect: true, translation: 'Persahabatan yang bertahan lama.' }
        ]
      },
      {
        heading: '3. Noun + Participle: Visualisasi yang Kuat',
        content: 'Anda juga bisa menggabungkan kata benda dengan kata kerja untuk menciptakan gambaran aksi yang membeku. Contoh: **Heart-breaking** (noun+v-ing) atau **Sun-dried** (noun+v3). Pola ini sangat puitis namun sangat akurat secara deskriptif.\n\nDalam penulisan kreatif, pola ini membantu Anda melukis pemandangan dengan sangat efisien. Alih-alih menulis "Grapes that are dried by the sun," Anda cukup menulis "Sun-dried grapes." Ini memberikan ritme yang lebih cepat pada tulisan Anda, membuat pembaca tetap fokus pada alur utama tanpa terganggu oleh deskripsi yang bertele-tele.',
        formula: 'Noun + V-ing/V3 (Heart-breaking / Sun-dried)',
        exceptions: 'Menciptakan gambaran aksi yang membeku secara deskriptif dan puitis.',
        examples: [
          { text: 'The soul-stirring recitation of the Quran.', isCorrect: true, translation: 'Lantunan Al-Quran yang menggetarkan jiwa.' },
          { text: 'A mouth-watering meal.', isCorrect: true, translation: 'Makanan yang menggugah selera.' },
          { text: 'Hand-made carpets are expensive.', isCorrect: true, translation: 'Karpet buatan tangan itu mahal.' },
          { text: 'Time-consuming tasks are annoying.', isCorrect: true, translation: 'Tugas yang memakan waktu itu menjengkelkan.' },
          { text: 'A record-breaking achievement.', isCorrect: true, translation: 'Pencapaian yang memecahkan rekor.' }
        ]
      },
      {
        heading: '4. Angka sebagai Modifiers: Tanpa Akhiran "S"',
        content: 'Salah satu jebakan terbesar bagi pembelajar adalah menggunakan angka dalam kata sifat majemuk. Aturannya: kata benda di dalam modifier TIDAK BOLEH jamak. Contoh: "A *five-hour* flight" (Benar) vs "A *five-hours* flight" (Salah).\n\nLogikanya adalah karena kata tersebut sudah berubah fungsi menjadi kata sifat, dan dalam bahasa Inggris kata sifat tidak mengenal bentuk jamak. Membiasakan pola ini akan secara instan membuat bahasa Inggris Anda terdengar sangat mahir dan terhindar dari kesalahan "pemula" yang sering merusak profesionalisme sebuah dokumen atau presentasi.',
        formula: 'Number-Noun (singular)',
        exceptions: 'Kata benda di dalam modifier angka TIDAK BOLEH menggunakan bentuk jamak (-s).',
        examples: [
          { text: 'A ten-minute break.', isCorrect: true, translation: 'Istirahat sepuluh menit.' },
          { text: 'A six-year-old child.', isCorrect: true, translation: 'Anak berusia enam tahun.' },
          { text: 'A twenty-page report.', isCorrect: true, translation: 'Laporan dua puluh halaman.' },
          { text: 'A two-week vacation.', isCorrect: true, translation: 'Liburan dua minggu.' },
          { text: 'A fifty-dollar bill.', isCorrect: true, translation: 'Uang kertas lima puluh dolar.' }
        ]
      },
      {
        heading: '5. Konteks Karakter: Deskripsi Akhlak yang Padat',
        content: 'Dalam Islam, deskripsi karakter (Akhlak) seringkali memerlukan ketelitian kata. Menggunakan compound modifiers membantu kita merangkum kualitas mulia seseorang dengan elegan. "A God-fearing person" (Seorang yang bertaqwa) atau "A soft-spoken leader."\n\nBahasa yang padat mencerminkan pemikiran yang jernih. Dengan merangkum kualitas kebaikan menjadi satu frasa yang harmonis, Anda menunjukkan rasa hormat yang tinggi kepada objek pembicaraan. Gunakanlah teknik ini untuk memuliakan orang tua, guru, dan para teladan dengan istilah-istilah yang indah, akurat, dan penuh wibawa.',
        formula: 'God-fearing / Soft-spoken',
        exceptions: 'Gunakan untuk merangkum kualitas mulia seseorang dengan elegan and padat.',
        examples: [
          { text: 'He is a clear-minded scholar.', isCorrect: true, translation: 'Dia adalah sarjana yang berpemikiran jernih.' },
          { text: 'She has a never-ending patience.', isCorrect: true, translation: 'Dia memiliki kesabaran yang tiada habisnya.' },
          { text: 'An awe-inspiring mosque architecture.', isCorrect: true, translation: 'Arsitektur masjid yang menakjubkan.' },
          { text: 'They are forward-thinking leaders.', isCorrect: true, translation: 'Mereka adalah pemimpin yang berpikiran maju.' },
          { text: 'A well-documented history of Islam.', isCorrect: true, translation: 'Sejarah Islam yang terdokumentasi dengan baik.' }
        ]
      }
    ],
    mindmap: {
      id: 'c2-cm-root', label: 'COMPOUND MODIFIERS', type: 'root', children: [
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
    id: 'c2-discourse-markers',
    title: '10. Nuanced Discourse Markers',
    level: 'C2',
    icon: 'fa-pen-fancy',
    description: 'Menguasai navigasi argumen intelektual dengan kata penghubung yang paling halus dan berwibawa.',
    sections: [
      {
        heading: '1. Logika Navigasi: Peta Pikiran Intelektual',
        content: 'Discourse markers di level C2 adalah rambu-rambu lalu lintas untuk pikiran pembaca. Anda tidak lagi hanya menggunakan "but" atau "so", melainkan beralih ke kata-kata yang lebih tajam seperti *consequently, nevertheless, atau furthermore*. Kata-kata ini memberikan arah argumen Anda dengan sangat presisi.\n\nTanpa discourse markers yang kuat, pembaca akan merasa tersesat dalam ide-ide kompleks Anda. Penggunaan markers yang tepat menciptakan koherensi—keterhubungan logis antar kalimat yang membuat seluruh tulisan Anda terasa seperti satu kesatuan bangunan yang kokoh. Ini adalah syarat mutlak bagi siapa saja yang ingin menulis jurnal ilmiah atau laporan kebijakan internasional.',
        formula: 'Consequently / Furthermore / Hence',
        exceptions: 'Berfungsi sebagai rambu-rambu navigasi intelektual untuk menjaga koherensi argumen kompleks.',
        examples: [
          { text: 'Furthermore, the evidence suggests a new pattern.', isCorrect: true, translation: 'Terlebih lagi, buktinya menyarankan adanya pola baru.' },
          { text: 'Consequently, the meeting was postponed.', isCorrect: true, translation: 'Sebagai konsekuensinya, pertemuannya ditunda.' },
          { text: 'Moreover, we must consider the ethical impact.', isCorrect: true, translation: 'Selain itu, kita harus mempertimbangkan dampak etisnya.' },
          { text: 'Hence, the result was predictable.', isCorrect: true, translation: 'Oleh karena itu, hasilnya sudah bisa ditebak.' },
          { text: 'In addition, she is also a talented writer.', isCorrect: true, translation: 'Sebagai tambahan, dia juga seorang penulis berbakat.' }
        ]
      },
      {
        heading: '2. Kontras Tingkat Tinggi: Albeit dan Notwithstanding',
        content: 'Untuk menunjukkan pertentangan yang elegan, Master level memperkenalkan kata-kata seperti *Albeit* (meskipun) dan *Notwithstanding* (meskipun demikian). Kata-kata ini sangat hemat ruang dan memberikan kesan intelektualitas yang sangat tinggi pada gaya bahasa Anda.\n\nContoh: "It was a successful event, *albeit* a small one." Perhatikan betapa ringkasnya kalimat tersebut dibandingkan menggunakan klausa "although" yang panjang. Penguasaan kata-kata langka ini menunjukkan bahwa Anda adalah seorang ahli bahasa yang memiliki perbendaharaan kata yang luas dan mampu menggunakannya dengan presisi yang tepat.',
        formula: 'Albeit / Notwithstanding',
        exceptions: 'Gunakan untuk menunjukkan kontras atau konsesi secara ringkas dan berwibawa.',
        examples: [
          { text: 'The results were positive, albeit somewhat slow.', isCorrect: true, translation: 'Hasilnya positif, meskipun agak lambat.' },
          { text: 'Notwithstanding the rain, the event was a success.', isCorrect: true, translation: 'Meskipun hujan, acaranya sukses.' },
          { text: 'He accepted the job, albeit reluctantly.', isCorrect: true, translation: 'Dia menerima pekerjaannya, meskipun dengan enggan.' },
          { text: 'Notwithstanding his age, he is very active.', isCorrect: true, translation: 'Meskipun usianya, dia sangat aktif.' },
          { text: 'The plan was good, albeit difficult to implement.', isCorrect: true, translation: 'Rencananya bagus, meskipun sulit diimplementasikan.' }
        ]
      },
      {
        heading: '3. Menghubungkan Sebab-Akibat yang Kompleks',
        content: 'Dalam analisis masalah, kita sering membutuhkan kata penghubung yang menunjukkan hubungan sebab-akibat yang bertahap. Kata-kata seperti *Accordingly, Thereby, dan Inasmuch as* membantu Anda menjelaskan bagaimana satu tindakan memicu rangkaian konsekuensi yang rumit.\n\n"The laws were changed; *accordingly*, the budget was adjusted." Struktur ini memberikan kesan bahwa keputusan tersebut diambil melalui pertimbangan yang matang dan logis. Kemampuan merangkai sebab-akibat dengan diksi yang variatif akan membuat laporan Anda terlihat lebih meyakinkan di mata kolega profesional maupun rekan akademik.',
        formula: 'Accordingly / Thereby / Inasmuch as',
        exceptions: 'Membantu menjelaskan hubungan sebab-akibat yang bertahap dan kompleks secara profesional.',
        examples: [
          { text: 'They improved the system, thereby reducing the cost.', isCorrect: true, translation: 'Mereka meningkatkan sistemnya, dengan demikian mengurangi biayanya.' },
          { text: 'Accordingly, we decided to invest more.', isCorrect: true, translation: 'Oleh karena itu, kami memutuskan untuk berinvestasi lebih banyak.' },
          { text: 'Inasmuch as he is the leader, he should decide.', isCorrect: true, translation: 'Mengingat dia adalah pemimpinnya, dialah yang harus memutuskan.' },
          { text: 'Thus, the conclusion was inevitable.', isCorrect: true, translation: 'Maka, kesimpulannya tidak terelakkan.' },
          { text: 'As a result of this, the economy improved.', isCorrect: true, translation: 'Sebagai hasil dari ini, ekonominya membaik.' }
        ]
      },
      {
        heading: '4. Aturan Tanda Baca: Koma dan Titik Koma',
        content: 'Salah satu kesalahan paling fatal di level Master bukan pada arti katanya, tapi pada tanda bacanya. Banyak discourse markers (Conjunctive Adverbs) seperti *however* dan *therefore* memerlukan titik koma (;) sebelumnya atau berada di antara dua koma.\n\n"The plan was good; however, it failed." (Benar). Menggunakan koma saja (*comma splice*) dianggap sebagai tanda kurangnya ketelitian dalam penulisan formal. Membiasakan penggunaan titik koma menunjukkan bahwa Anda memahami struktur klausa independen dan mampu menjaga integritas gramatikal dalam kalimat-kalimat yang panjang dan kompleks.',
        formula: 'Semicolon (;) + Marker + Comma (,)',
        exceptions: 'Hati-hati dengan tanda baca; marker seringkali memerlukan titik koma sebelumnya.',
        examples: [
          { text: 'The price rose; therefore, demand fell.', isCorrect: true, translation: 'Harga naik; oleh karena itu, permintaan turun.' },
          { text: 'He was tired; nevertheless, he kept working.', isCorrect: true, translation: 'Dia lelah; meskipun demikian, dia terus bekerja.' },
          { text: 'She is smart; moreover, she is very kind.', isCorrect: true, translation: 'Dia pintar; terlebih lagi, dia sangat baik.' },
          { text: 'I agree with you; however, we need more data.', isCorrect: true, translation: 'Saya setuju denganmu; namun, kita butuh lebih banyak data.' },
          { text: 'It was late; hence, they went home.', isCorrect: true, translation: 'Sudah larut; maka dari itu, mereka pulang.' }
        ]
      },
      {
        heading: '5. Etika Diskusi: Navigasi Dakwah yang Santun',
        content: 'Dalam Islam, berdiskusi harus dilakukan dengan cara yang paling baik (*Jadilhum billati hiya ahsan*). Discourse markers membantu kita menunjukkan kerendahan hati saat memberikan pendapat yang berbeda. Kata-kata seperti *Admittedly* (harus diakui) atau *Granted* (memang benar) memberikan ruang apresiasi pada pendapat lawan bicara.\n\nBahasa yang objektif dan terstruktur mencerminkan kejernihan hati seorang mukmin dalam mencari kebenaran, bukan mencari kemenangan. Gunakanlah markers ini untuk membangun jembatan pemahaman, bukan dinding pemisah. Ketajaman argumen yang dibalut dengan adab bahasa yang tinggi adalah ciri utama dari seorang cendekiawan Muslim yang berwibawa.',
        formula: 'Jadilhum billati hiya ahsan',
        exceptions: 'Gunakan markers ini untuk membangun jembatan pemahaman dengan adab diskusi yang tinggi.',
        examples: [
          { text: 'Admittedly, the task is difficult, but it is necessary.', isCorrect: true, translation: 'Harus diakui, tugasnya sulit, tapi memang perlu.' },
          { text: 'Granted, he made a mistake, but he apologized.', isCorrect: true, translation: 'Memang benar dia berbuat salah, tapi dia sudah minta maaf.' },
          { text: 'Conversely, some scholars disagree with this view.', isCorrect: true, translation: 'Sebaliknya, beberapa sarjana tidak setuju dengan pandangan ini.' },
          { text: 'To sum up, patience is the key to success.', isCorrect: true, translation: 'Sebagai kesimpulan, kesabaran adalah kunci kesuksesan.' },
          { text: 'Broadly speaking, the community is supportive.', isCorrect: true, translation: 'Secara garis besar, komunitasnya mendukung.' }
        ]
      }
    ],
    mindmap: {
      id: 'c2-dm-root', label: 'ACADEMIC MARKERS', type: 'root', children: [
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
