
import { GrammarLesson } from '../../types';

export const LEVEL_B2: GrammarLesson[] = [
  {
    id: 'b2-narrative-tenses',
    title: '1. Narrative Tenses Mastery',
    level: 'B2',
    icon: 'fa-book-open',
    description: 'Seni menggabungkan berbagai tenses masa lalu untuk menciptakan narasi yang hidup, mendalam, dan terstruktur secara kronologis.',
    sections: [
      {
        heading: '1. Dinamika Alur: Past Simple & Past Continuous',
        content: 'Dalam sebuah cerita, Past Simple digunakan sebagai "mesin" penggerak alur; ia mencatat aksi-aksi utama yang terjadi secara berurutan. Sementara itu, Past Continuous bertindak sebagai "layar lebar" yang memberikan latar belakang (background) atau suasana agar pendengar bisa membayangkan konteks kejadian tersebut.\n\nTanpa kombinasi ini, cerita Anda akan terasa datar dan kaku. Penggunaan tenses ini secara bergantian memungkinkan Anda untuk melakukan teknik "zooming" dalam cerita: menarik perhatian ke detail suasana sebelum menghantam pembaca dengan aksi utama. Ini adalah pondasi dasar bagi setiap pencerita yang ingin memikat audiensnya.',
        formula: 'Past Simple: S + V2 | Past Continuous: S + was/were + V-ing',
        exceptions: 'State verbs (know, love, believe) are generally not used in the continuous form.',
        examples: [
          { text: 'The sun was setting while I was walking home.', translation: 'Matahari sedang terbenam ketika saya sedang berjalan pulang.', isCorrect: true },
          { text: 'Suddenly, a cat jumped onto the table.', translation: 'Tiba-tiba, seekor kucing melompat ke atas meja.', isCorrect: true },
          { text: 'I was sleeping when the alarm went off.', translation: 'Saya sedang tidur ketika alarm berbunyi.', isCorrect: true },
          { text: 'They were discussing the project for hours.', translation: 'Mereka sedang mendiskusikan proyek itu selama berjam-jam.', isCorrect: true },
          { text: 'She opened the door and entered the room.', translation: 'Dia membuka pintu dan masuk ke dalam ruangan.', isCorrect: true }
        ]
      },
      {
        heading: '2. Past Perfect: Sang Penunjuk Urutan',
        content: 'Past Perfect (had + V3) adalah alat navigasi waktu. Ia digunakan untuk menandai kejadian yang sudah terjadi BAHKAN SEBELUM kejadian lain di masa lalu. Ini sangat krusial dalam cerita misteri atau kilas balik (flashback) agar pembaca tidak bingung dengan kronologi kejadian.\n\nJika Anda hanya menggunakan Past Simple, semua kejadian akan terlihat terjadi di waktu yang sama. Dengan Past Perfect, Anda memberikan kedalaman dimensi waktu. Anda bisa menjelaskan motivasi karakter atau rahasia masa lalu yang memengaruhi tindakan mereka saat ini. Ini adalah tanda kemahiran logika bahasa di level B2.',
        formula: 'S + had + Verb 3',
        exceptions: 'If the time sequence is clear with "before" or "after", the Past Simple is often used instead.',
        examples: [
          { text: 'I arrived late because I had lost my keys.', translation: 'Saya datang terlambat karena saya telah kehilangan kunci saya.', isCorrect: true },
          { text: 'He had already left when I called him.', translation: 'Dia sudah berangkat ketika saya meneleponnya.', isCorrect: true },
          { text: 'She realized she had forgotten her wallet.', translation: 'Dia menyadari bahwa dia telah melupakan dompetnya.', isCorrect: true },
          { text: 'They had finished lunch before the rain started.', translation: 'Mereka telah selesai makan siang sebelum hujan mulai turun.', isCorrect: true },
          { text: 'Had you ever seen him before that day?', translation: 'Apakah kamu pernah melihatnya sebelum hari itu?', isCorrect: true }
        ]
      },
      {
        heading: '3. Past Perfect Continuous: Penekanan pada Durasi',
        content: 'Past Perfect Continuous (had been + V-ing) mirip dengan Past Perfect, namun fokus utamanya adalah pada PROSES atau DURASI sebuah aksi di masa lalu sebelum terhenti oleh kejadian lain. Ini memberikan nuansa kelelahan, kerja keras, atau kebiasaan yang berlangsung lama.\n\nBayangkan Anda melihat seseorang yang bajunya basah kuyup. Alih-alih hanya berkata "Dia kehujanan", Anda bisa menekankan perjuangannya: "He had been walking in the rain for an hour". Tenses ini memberikan empati dan bobot emosional pada karakter dalam cerita Anda, membuat pembaca merasakan apa yang dirasakan tokoh tersebut.',
        formula: 'S + had been + V-ing',
        exceptions: 'Not used with non-continuous verbs (state verbs like "be", "know", "want").',
        examples: [
          { text: 'I had been studying for hours before I slept.', translation: 'Saya telah sedang belajar selama berjam-jam sebelum saya tidur.', isCorrect: true },
          { text: 'She was tired because she had been working hard.', translation: 'Dia lelah karena dia telah sedang bekerja keras.', isCorrect: true },
          { text: 'They had been living there for ten years.', translation: 'Mereka telah sedang tinggal di sana selama sepuluh tahun.', isCorrect: true },
          { text: 'Had you been waiting long before she arrived?', translation: 'Apakah kamu telah sedang menunggu lama sebelum dia datang?', isCorrect: true },
          { text: 'The road was wet; it had been raining.', translation: 'Jalannya basah; tadinya telah sedang hujan.', isCorrect: true }
        ]
      },
      {
        heading: '4. Memilih "Used to" vs "Would" untuk Nostalgia',
        content: 'Untuk menceritakan kebiasaan lama, B2 menuntut Anda bisa membedakan "Used to" dan "Would". "Used to" bisa digunakan untuk aksi maupun status (status: I used to be a teacher). Namun, "Would" hanya boleh digunakan untuk AKSI yang berulang (actions), memberikan kesan nostalgia yang lebih puitis.\n\nBanyak pelajar terjebak menggunakan "Would" untuk status (salah: I would be happy). Memahami perbedaan ini menunjukkan bahwa Anda peka terhadap nuansa sastra dalam bahasa Inggris. "Would" sering ditemukan dalam memoar atau esai reflektif yang menceritakan kenangan manis di masa kecil.',
        formula: 'Used to + V1 (States/Actions) | Would + V1 (Actions only)',
        exceptions: 'Never use "would" for past states (e.g., "I would have a cat" is incorrect for past possession).',
        examples: [
          { text: 'Every Friday, my father would take us to the mosque.', translation: 'Setiap hari Jumat, ayah saya biasa mengajak kami ke masjid.', isCorrect: true, note: 'Action habit.' },
          { text: 'I used to live in a small village.', translation: 'Saya dulu tinggal di sebuah desa kecil.', isCorrect: true, note: 'State habit (cannot use would).' },
          { text: 'She would always cook delicious meals for us.', translation: 'Dia akan selalu memasak makanan lezat untuk kami.', isCorrect: true },
          { text: 'We used to have a pet cat.', translation: 'Kami dulu punya kucing peliharaan.', isCorrect: true, note: 'Possession state.' },
          { text: 'I would read books until late at night.', translation: 'Saya biasanya membaca buku sampai larut malam.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Adab: Menjaga Amanah dalam Cerita',
        content: 'Dalam Islam, bercerita bukan sekadar hiburan, tapi sarana mengambil pelajaran (Ibrah). Menggunakan narrative tenses dengan akurat adalah bagian dari kejujuran ilmiah (Amanah). Kita tidak boleh mencampuradukkan fakta kronologis yang bisa mengubah makna sebuah peristiwa sejarah atau nasihat.\n\nKetelitian dalam tenses mencerminkan ketelitian dalam berpikir. Saat menceritakan kebaikan orang lain, gunakan tenses ini untuk menonjolkan jejak perjuangan mereka. Bahasa yang terstruktur rapi membantu kita menghargai warisan masa lalu dan menyampaikannya kembali kepada generasi mendatang dengan penuh integritas.',
        formula: 'Accuracy in Narrative Chronology',
        exceptions: 'Subjective narration should still respect the objective timeline of events.',
        examples: [
          { text: 'The Prophet PBUH had been praying when the revelation came.', translation: 'Nabi SAW sedang mengerjakan shalat ketika wahyu datang.', isCorrect: true },
          { text: 'People would travel for months to seek knowledge.', translation: 'Orang-orang dahulu biasa melakukan perjalanan berbulan-bulan untuk menuntut ilmu.', isCorrect: true },
          { text: 'They had already prepared the caravan before dawn.', translation: 'Mereka sudah menyiapkan kafilah sebelum fajar.', isCorrect: true },
          { text: 'He realized he had made a great contribution.', translation: 'Dia menyadari bahwa dia telah memberikan kontribusi besar.', isCorrect: true },
          { text: 'Wisdom had been passed down through generations.', translation: 'Hikmah telah diwariskan turun-temurun melalui generasi.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-nar-root', label: 'NARRATIVE TENSES', type: 'root', children: [
        { id: 'background', label: 'Background Info', type: 'main', children: [
          { id: 'pc', label: 'Past Continuous (Setting)', type: 'sub' },
          { id: 'ppc', label: 'Past Perfect Continuous (Duration)', type: 'sub' }
        ]},
        { id: 'main-action', label: 'Main Events', type: 'main', children: [
          { id: 'ps', label: 'Past Simple (Sequence)', type: 'sub' },
          { id: 'pp', label: 'Past Perfect (Flashback)', type: 'sub' }
        ]},
        { id: 'habits', label: 'Past Habits', type: 'main', children: [
          { id: 'ut', label: 'Used to (States & Actions)', type: 'formula' },
          { id: 'wd', label: 'Would (Actions only / Nostalgia)', type: 'formula' }
        ]}
      ]
    }
  },
  {
    id: 'b2-mixed-conditionals',
    title: '2. Mixed Conditionals Mastery',
    level: 'B2',
    icon: 'fa-code-branch',
    description: 'Menghubungkan penyesalan masa lalu dengan realitas masa kini atau sifat tetap seseorang dalam spekulasi logis.',
    sections: [
      {
        heading: '1. Logika Campuran: Past Cause, Present Result',
        content: 'Mixed Conditionals Tipe 1 digunakan ketika sebuah aksi di MASA LALU memiliki konsekuensi yang terasa di MASA KINI. Berbeda dengan tipe 3 murni (past-past), tipe campuran ini menyoroti bagaimana sejarah hidup Anda memengaruhi status Anda hari ini.\n\nStrukturnya menggabungkan "If + Past Perfect" (syarat masa lalu) dengan "Would + Verb 1" (hasil saat ini). Contoh: "Jika saya sudah belajar lebih rajin DULU, saya akan mahir SEKARANG". Ini adalah tenses favorit dalam diskusi mendalam tentang perkembangan diri dan hukum sebab-akibat lintas waktu.',
        formula: 'If + S + had + V3, S + would + V1',
        exceptions: 'You can use "could" or "might" instead of "would" to indicate possibility rather than certainty.',
        examples: [
          { text: 'If I had studied harder, I would be a doctor now.', translation: 'Jika saya sudah belajar lebih rajin, saya akan menjadi dokter sekarang.', isCorrect: true },
          { text: 'If they had won the game, they would be famous today.', translation: 'Jika mereka sudah memenangkan pertandingan, mereka akan terkenal hari ini.', isCorrect: true },
          { text: 'If she had taken the job, she would be rich now.', translation: 'Jika dia sudah mengambil pekerjaan itu, dia akan kaya sekarang.', isCorrect: true },
          { text: 'If we had saved money, we would be on vacation today.', translation: 'Jika kita sudah menabung uang, kita akan sedang berlibur hari ini.', isCorrect: true },
          { text: 'If I hadn\'t missed the flight, I would be in Mecca now.', translation: 'Jika saya tidak ketinggalan pesawat, saya akan berada di Mekkah sekarang.', isCorrect: true }
        ]
      },
      {
        heading: '2. Logika Campuran: Present Cause, Past Result',
        content: 'Tipe campuran kedua digunakan untuk menunjukkan bagaimana sifat atau kondisi permanen Anda (masa kini) memengaruhi kejadian di masa lalu. Strukturnya menggunakan "If + Past Simple" (kondisi umum/permanen) dan "Would have + V3" (hasil spesifik di masa lalu).\n\nMisalnya: "Jika saya orang yang berani (sifat permanen), saya pasti sudah melawan kemarin". Di sini, kita tidak membicarakan perubahan aksi di masa lalu saja, tapi bagaimana karakter dasar seseorang menjadi kunci dari peristiwa-peristiwa sejarah dalam hidupnya.',
        formula: 'If + S + V2 (Present State), S + would have + V3',
        exceptions: 'This is used only when the "If" condition is a permanent state, not a temporary action.',
        examples: [
          { text: 'If I weren\'t afraid of heights, I would have gone skydiving yesterday.', translation: 'Jika saya tidak takut ketinggian, saya pasti sudah terjun payung kemarin.', isCorrect: true },
          { text: 'If she were more patient, she wouldn\'t have shouted at him.', translation: 'Jika dia lebih sabar, dia tidak akan membentaknya.', isCorrect: true },
          { text: 'If they were honest, they would have told the truth.', translation: 'Jika mereka jujur, mereka pasti sudah mengatakan yang sebenarnya.', isCorrect: true },
          { text: 'If I knew English well, I would have accepted that job.', translation: 'Jika saya tahu bahasa Inggris dengan baik, saya pasti sudah menerima pekerjaan itu.', isCorrect: true },
          { text: 'If he were a better leader, the project would have succeeded.', translation: 'Jika dia pemimpin yang lebih baik, proyek itu pasti sudah berhasil.', isCorrect: true }
        ]
      },
      {
        heading: '3. Nuansa Penyesalan dan Evaluasi Diri',
        content: 'Mixed conditionals sering kali mengandung nada penyesalan (regret) atau kritik. Namun, di level B2, Anda belajar menggunakannya secara konstruktif untuk mengevaluasi keputusan. Ini adalah cara otak manusia memproses pengalaman agar tidak mengulangi kesalahan yang sama.\n\nMemahami struktur ini membantu Anda dalam diskusi tingkat lanjut tentang strategi, manajemen risiko, dan pengembangan karakter. Alih-alih hanya meratapi masa lalu, Anda belajar menghubungkan titik-titik (connecting the dots) antara tindakan dan konsekuensi jangka panjangnya.',
        formula: 'Logic: Connecting Past Actions to Present Identity',
        exceptions: 'Avoid overusing "If only" if the context requires a logical cause-effect analysis.',
        examples: [
          { text: 'If I hadn\'t spent all my money, I wouldn\'t be broke now.', translation: 'Jika saya tidak menghabiskan semua uang saya, saya tidak akan bangkrut sekarang.', isCorrect: true },
          { text: 'If you had listened to me, we wouldn\'t be lost.', translation: 'Jika kamu sudah mendengarkan saya, kita tidak akan tersesat.', isCorrect: true },
          { text: 'If she had worked harder, she would be the manager today.', translation: 'Jika dia sudah bekerja lebih keras, dia akan menjadi manajer hari ini.', isCorrect: true },
          { text: 'If they had followed the rules, they wouldn\'t be in trouble.', translation: 'Jika mereka sudah mengikuti aturan, mereka tidak akan dalam masalah.', isCorrect: true },
          { text: 'If I had been more careful, I wouldn\'t have broken my leg.', translation: 'Jika saya sudah lebih berhati-hati, saya tidak akan patah kaki.', isCorrect: true }
        ]
      },
      {
        heading: '4. Penggunaan Modal Lain: Might dan Could',
        content: 'Anda tidak harus selalu menggunakan "Would". Untuk memberikan nuansa ketidakpastian atau peluang, Anda bisa menggantinya dengan "Might" (mungkin) atau "Could" (bisa saja). Ini membuat spekulasi Anda terdengar lebih objektif dan tidak terlalu menghakimi.\n\n"If I had prayed more, I *might* be calmer now." Perhatikan bagaimana "Might" memberikan kesan kerendahan hati. Di level mahir, pemilihan modal verb ini sangat memengaruhi "suara" atau persona Anda dalam tulisan maupun percakapan formal.',
        formula: 'If clause + might/could + V1/have V3',
        exceptions: '"Might" indicates a lower probability than "could".',
        examples: [
          { text: 'If I had known, I might have helped you.', translation: 'Jika saya sudah tahu, saya mungkin sudah membantumu.', isCorrect: true },
          { text: 'If they had practiced, they could be the champions now.', translation: 'Jika mereka sudah berlatih, mereka bisa saja menjadi juara sekarang.', isCorrect: true },
          { text: 'If she had stayed, things might be different today.', translation: 'Jika dia tetap tinggal, keadaan mungkin berbeda hari ini.', isCorrect: true },
          { text: 'If we had left earlier, we could have arrived on time.', translation: 'Jika kita sudah berangkat lebih awal, kita bisa saja sampai tepat waktu.', isCorrect: true },
          { text: 'If I had asked, he might have said yes.', translation: 'Jika saya sudah bertanya, dia mungkin sudah mengiyakan.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Tawakkal: Menerima Takdir',
        content: 'Secara bahasa, berandai-andai (if clauses) sangat berguna untuk belajar. Namun, dalam Adab Islami, kita diingatkan untuk tidak membiarkan kata "Law" (Seandainya) membuka pintu setan jika itu memicu kesedihan mendalam atas takdir Allah. Gunakan tenses ini hanya untuk Muhasabah (evaluasi).\n\nFokuslah pada "If I hadn\'t... I wouldn\'t be..." sebagai sarana syukur atas pelajaran yang didapat. Bahasa membantu kita menstrukturkan pikiran, namun hati harus tetap pada keyakinan bahwa segala yang terjadi adalah kehendak-Nya. Gunakan tenses ini untuk tumbuh menjadi pribadi yang lebih bijak di masa depan.',
        formula: 'Philosophical Cause & Effect',
        exceptions: 'Always conclude self-reflection with "Alhamdulillah" for the lessons learned.',
        examples: [
          { text: 'Alhamdulillah, even if I had failed, I would still be grateful.', translation: 'Alhamdulillah, meskipun seandainya saya sudah gagal, saya akan tetap bersyukur.', isCorrect: true },
          { text: 'If Allah hadn\'t guided me, I would be lost today.', translation: 'Jika Allah tidak membimbing saya, saya akan tersesat hari ini.', isCorrect: true },
          { text: 'If we had known the future, we would have chosen this path anyway.', translation: 'Jika kita sudah tahu masa depan, kita akan tetap memilih jalan ini.', isCorrect: true },
          { text: 'If I had more time, I would spend it in worship.', translation: 'Jika saya punya lebih banyak waktu, saya akan menghabiskannya untuk ibadah.', isCorrect: true },
          { text: 'If they were truly wise, they would have chosen patience.', translation: 'Jika mereka benar-benar bijak, mereka pasti sudah memilih kesabaran.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-mix-root', label: 'MIXED CONDITIONALS', type: 'root', children: [
        { id: 'type1', label: 'Past Cause -> Present Result', type: 'main', children: [
          { id: 'f1', label: 'If + Past Perfect, Would + V1', type: 'formula' }
        ]},
        { id: 'type2', label: 'Present State -> Past Result', type: 'main', children: [
          { id: 'f2', label: 'If + Past Simple, Would have + V3', type: 'formula' }
        ]},
        { id: 'modals', label: 'Variations', type: 'sub', detail: 'Use Might/Could for possibility.' }
      ]
    }
  },
  {
    id: 'b2-advanced-passive',
    title: '3. Advanced Passive Forms',
    level: 'B2',
    icon: 'fa-shield-alt',
    description: 'Menguasai struktur pasif yang lebih kompleks untuk laporan berita, opini publik, dan aksi yang berkelanjutan secara profesional.',
    sections: [
      {
        heading: '1. Passive Continuous: Aksi yang Sedang "Dikenai"',
        content: 'Passive Continuous (Be + Being + V3) digunakan untuk menyatakan bahwa sebuah objek sedang berada dalam proses pengerjaan oleh pihak lain. Ini sangat umum dalam laporan operasional atau berita lapangan. Contoh: "Jembatan sedang diperbaiki" (The bridge is *being repaired*).\n\nTenses ini sangat penting untuk memberikan update status yang akurat. Tanpanya, Anda mungkin akan bingung membedakan antara aksi yang sudah selesai (Simple Passive) dan aksi yang masih butuh waktu untuk rampung. Penguasaan tenses ini memberikan kesan bahwa Anda sangat memperhatikan detail proses.',
        formula: 'S + am/is/are + being + V3 | S + was/were + being + V3',
        exceptions: 'Rarely used in the Future Continuous Passive (e.g., "will be being built" is avoided).',
        examples: [
          { text: 'The new mosque is being built right now.', translation: 'Masjid baru itu sedang dibangun sekarang.', isCorrect: true },
          { text: 'My car was being fixed when I called.', translation: 'Mobil saya sedang diperbaiki ketika saya menelepon.', isCorrect: true },
          { text: 'The reports are being processed by the team.', translation: 'Laporan-laporan itu sedang diproses oleh tim.', isCorrect: true },
          { text: 'Dinner is being prepared in the kitchen.', translation: 'Makan malam sedang disiapkan di dapur.', isCorrect: true },
          { text: 'The students were being tested by the teacher.', translation: 'Para siswa sedang diuji oleh guru.', isCorrect: true }
        ]
      },
      {
        heading: '2. Impersonal Passive: "Dikatakan bahwa..."',
        content: 'Impersonal Passive (It is said that... / He is thought to be...) adalah bahasa standar jurnalisme dan diskusi akademik. Ini digunakan untuk menyampaikan opini publik atau fakta yang belum terverifikasi 100% tanpa menyebutkan siapa sumber spesifiknya.\n\nStruktur ini memberikan kesan objektif dan berwibawa. Alih-alih berkata "Orang-orang percaya dia jujur", Anda berkata "He is believed to be honest". Ini adalah cara elegan untuk menjaga jarak profesional antara Anda sebagai penyampai pesan dan isi pesan itu sendiri.',
        formula: 'It is + V3 + that... | S + is + V3 + to + V1',
        exceptions: 'The structure "S + is + V3 + to + V1" is much more common in formal academic writing.',
        examples: [
          { text: 'It is said that patience is a virtue.', translation: 'Dikatakan bahwa kesabaran adalah suatu kebajikan.', isCorrect: true },
          { text: 'He is believed to have discovered a new cure.', translation: 'Dia diyakini telah menemukan obat baru.', isCorrect: true },
          { text: 'It is expected that the prices will rise.', translation: 'Diharapkan/Diperkirakan bahwa harga-harga akan naik.', isCorrect: true },
          { text: 'She is thought to be the best student.', translation: 'Dia dianggap sebagai siswa terbaik.', isCorrect: true },
          { text: 'It is known that the earth is round.', translation: 'Diketahui bahwa bumi itu bulat.', isCorrect: true }
        ]
      },
      {
        heading: '3. Passive with Modals: Keharusan yang Pasif',
        content: 'Seringkali kita butuh menyatakan kewajiban atau kemungkinan secara pasif, seperti "Aturan harus ditaati". Di sini kita menggabungkan modal verb dengan "Be + V3". Rumusnya: **Modal + Be + Verb 3**.\n\nTeknik ini sangat vital dalam penulisan kontrak, instruksi keamanan, atau kebijakan organisasi. Ia membuat pesan terdengar sangat tegas namun tidak menyerang individu tertentu secara personal karena fokusnya adalah pada objek dan aturan tersebut.',
        formula: 'Modal + be + Verb 3',
        exceptions: 'For past obligation in passive voice, use: Modal + have been + Verb 3.',
        examples: [
          { text: 'The rules must be followed by everyone.', translation: 'Aturan harus diikuti oleh semua orang.', isCorrect: true },
          { text: 'The data can be accessed online.', translation: 'Data tersebut dapat diakses secara online.', isCorrect: true },
          { text: 'This book should be read by every student.', translation: 'Buku ini sebaiknya dibaca oleh setiap siswa.', isCorrect: true },
          { text: 'The problem might be solved soon.', translation: 'Masalah tersebut mungkin akan segera teratasi.', isCorrect: true },
          { text: 'Your password must not be shared.', translation: 'Kata sandi Anda tidak boleh dibagikan.', isCorrect: true }
        ]
      },
      {
        heading: '4. The "Get" Passive: Fokus pada Perubahan Status',
        content: 'Dalam percakapan informal, penutur asli sering mengganti "To Be" dengan "Get" dalam kalimat pasif (seperti: got fired, got married). Perbedaan halusnya adalah: "Get" memberikan kesan adanya aksi yang mendadak, tidak terduga, atau ada elemen keberuntungan/nasib di dalamnya.\n\nNamun, berhati-hatilah karena "Get passive" dianggap kurang formal. Gunakan ini dalam percakapan santai dengan teman, namun hindari dalam esai akademik atau surat lamaran kerja. Mengetahui kapan menggunakan "Be" dan kapan menggunakan "Get" adalah ciri Anda memahami konteks sosial bahasa.',
        formula: 'S + get/got + Verb 3',
        exceptions: 'Avoid using "get" passive for negative outcomes in formal contexts.',
        examples: [
          { text: 'I got hired by a big company.', translation: 'Saya (berhasil) direkrut oleh perusahaan besar.', isCorrect: true },
          { text: 'They got lost in the woods.', translation: 'Mereka tersesat di hutan.', isCorrect: true },
          { text: 'She got promoted last month.', translation: 'Dia mendapatkan promosi bulan lalu.', isCorrect: true },
          { text: 'Be careful or you might get hurt.', translation: 'Berhati-hatilah atau kamu bisa terluka.', isCorrect: true },
          { text: 'We got invited to the seminar.', translation: 'Kami diundang ke seminar itu.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Objektivitas: Menjaga Amanah Berita',
        content: 'Dalam Islam, menyampaikan informasi harus disertai dengan kejujuran (Sidiq). Penggunaan Advanced Passive membantu kita menyampaikan fakta secara proporsional. "It is reported that..." menunjukkan bahwa kita sedang menukil berita dari sumber lain dengan hati-hati.\n\nHal ini juga melatih kita untuk tidak sembarangan menuduh pelaku sebelum ada bukti yang nyata. Dengan memfokuskan kalimat pada "aksi" dan "kejadian", kita menjaga lisan dari fitnah. Bahasa yang objektif adalah cerminan dari kecerdasan emosional dan integritas moral seorang mukmin.',
        formula: 'Ethical & Objective Reporting',
        exceptions: 'Passivity should not be used to avoid accountability for one\'s own actions.',
        examples: [
          { text: 'It is reported that the moon has been sighted.', translation: 'Dilaporkan bahwa hilal telah terlihat.', isCorrect: true },
          { text: 'The charity is being distributed fairly.', translation: 'Sedekah sedang disalurkan secara adil.', isCorrect: true },
          { text: 'Justice must be served for the oppressed.', translation: 'Keadilan harus ditegakkan bagi mereka yang terzalimi.', isCorrect: true },
          { text: 'She is considered to be a very pious person.', translation: 'Dia dianggap sebagai orang yang sangat salehah.', isCorrect: true },
          { text: 'The message of peace is being spread worldwide.', translation: 'Pesan perdamaian sedang disebarkan ke seluruh dunia.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-pas-root', label: 'ADVANCED PASSIVE', type: 'root', children: [
        { id: 'cont', label: 'Continuous Passive', type: 'main', children: [
          { id: 'f1', label: 'Be + BEING + V3', type: 'formula' }
        ]},
        { id: 'impers', label: 'Impersonal (Public Op)', type: 'main', children: [
          { id: 'it-said', label: 'It is said that...', type: 'sub' },
          { id: 'subj-thought', label: 'He is thought to be...', type: 'sub' }
        ]},
        { id: 'modals-p', label: 'Modal Passive', type: 'main', children: [
          { id: 'f3', label: 'Modal + BE + V3', type: 'formula' }
        ]}
      ]
    }
  },
  {
    id: 'b2-future-forms',
    title: '4. Future Perfect & Future Continuous',
    level: 'B2',
    icon: 'fa-hourglass-end',
    description: 'Mampu memproyeksikan diri ke masa depan untuk melihat hasil akhir dan proses yang sedang berjalan secara akurat.',
    sections: [
      {
        heading: '1. Future Continuous: Membayangkan Kesibukan Esok',
        content: 'Future Continuous (will be + V-ing) digunakan untuk membicarakan aksi yang akan SEDANG BERLANGSUNG pada titik waktu tertentu di masa depan. Bayangkan Anda melihat jadwal Anda besok jam 10 pagi; Anda tidak hanya akan mulai bekerja, tapi Anda akan berada di tengah-tengah pekerjaan tersebut.\n\nTenses ini sangat berguna untuk memberikan detail janji temu. "Jangan telepon jam 8, saya akan sedang shalat". Ini memberikan gambaran visual yang jelas kepada lawan bicara tentang ketersediaan waktu Anda, sehingga komunikasi menjadi lebih efektif dan penuh tenggang rasa.',
        formula: 'S + will be + V-ing',
        exceptions: 'Not used with state verbs (e.g., "I will be liking" is incorrect).',
        examples: [
          { text: 'This time tomorrow, I will be flying to Mecca.', translation: 'Waktu seperti ini besok, saya akan sedang terbang ke Mekkah.', isCorrect: true },
          { text: 'At 8 PM, we will be having dinner.', translation: 'Jam 8 malam, kita akan sedang makan malam.', isCorrect: true },
          { text: 'Will you be working this weekend?', translation: 'Apakah kamu akan sedang bekerja akhir pekan ini?', isCorrect: true },
          { text: 'She will be studying for the exam all night.', translation: 'Dia akan sedang belajar untuk ujian sepanjang malam.', isCorrect: true },
          { text: 'They will be waiting for us at the station.', translation: 'Mereka akan sedang menunggu kita di stasiun.', isCorrect: true }
        ]
      },
      {
        heading: '2. Future Perfect: Melihat Hasil dari Masa Depan',
        content: 'Future Perfect (will have + V3) adalah tenses "deadline". Ia digunakan untuk menyatakan bahwa sebuah aksi akan SUDAH SELESAI sebelum titik waktu tertentu di masa depan. Fokusnya bukan pada kapan dimulainya, tapi pada ketercapaian target tersebut.\n\nDalam dunia profesional, ini adalah tenses kunci untuk negosiasi kontrak dan manajemen proyek. Mengatakan "Saya akan sudah menyelesaikan laporan ini sebelum Senin" memberikan jaminan kepastian dan menunjukkan bahwa Anda adalah orang yang sangat terencana (well-planned).',
        formula: 'S + will have + Verb 3',
        exceptions: 'Requires a time reference (e.g., "by tomorrow", "before next week").',
        examples: [
          { text: 'I will have finished my homework by 9 PM.', translation: 'Saya akan sudah menyelesaikan PR saya sebelum jam 9 malam.', isCorrect: true },
          { text: 'She will have graduated by next year.', translation: 'Dia akan sudah lulus sebelum tahun depan.', isCorrect: true },
          { text: 'Will you have eaten dinner when I arrive?', translation: 'Apakah kamu akan sudah makan malam ketika saya datang?', isCorrect: true },
          { text: 'They will have built the school by June.', translation: 'Mereka akan sudah membangun sekolah itu sebelum bulan Juni.', isCorrect: true },
          { text: 'I will have learned 500 words by Ramadan.', translation: 'Saya akan sudah mempelajari 500 kata sebelum Ramadhan.', isCorrect: true }
        ]
      },
      {
        heading: '3. Nuansa Prediksi dan Asumsi',
        content: 'Kedua tenses ini juga bisa digunakan untuk membuat asumsi tentang apa yang mungkin sedang terjadi atau sudah terjadi sekarang berdasarkan logika kita. "Ali terlambat, dia pasti *sedang terjebak* macet" (Future Continuous logic applied to present assumption).\n\nMenggunakan struktur masa depan untuk asumsi masa kini memberikan nuansa keyakinan intelektual yang tinggi. Ini sering digunakan dalam diskusi strategi atau investigasi ringan. Kemampuan ini membedakan pelajar level intermediate dengan pelajar yang sudah mulai berpikir secara kompleks dalam bahasa target.',
        formula: 'Assumption logic: S + will + (be Ving / have V3)',
        exceptions: 'This is not about the future, but about high-certainty guesses about the present.',
        examples: [
          { text: 'Don\'t call him; he will be sleeping now.', translation: 'Jangan telepon dia; dia (pasti) sedang tidur sekarang.', isCorrect: true, note: 'Assumption about now.' },
          { text: 'They will have arrived by now, surely.', translation: 'Mereka (pasti) sudah sampai sekarang, tentulah.', isCorrect: true, note: 'Assumption about completion.' },
          { text: 'She will be praying at this hour.', translation: 'Dia (pasti) sedang shalat pada jam segini.', isCorrect: true },
          { text: 'The game will have finished by the time we get there.', translation: 'Pertandingannya (pasti) sudah selesai pada saat kita sampai di sana.', isCorrect: true },
          { text: 'He will be wondering where we are.', translation: 'Dia (pasti) sedang bertanya-tanya di mana kita berada.', isCorrect: true }
        ]
      },
      {
        heading: '4. Future Perfect Continuous: Dedikasi Waktu',
        content: 'Future Perfect Continuous (will have been + V-ing) adalah tenses yang paling jarang digunakan namun memiliki efek "prestasi" yang kuat. Ia digunakan untuk menyatakan SEBERAPA LAMA sebuah aksi akan sudah berlangsung pada titik waktu tertentu di masa depan.\n\nContoh: "Bulan depan, saya akan sudah belajar bahasa Inggris selama 3 tahun". Tenses ini menekankan pada ketekunan dan akumulasi waktu yang telah diinvestasikan. Ia sering ditemukan dalam biografi, pidato ulang tahun perusahaan, atau refleksi pencapaian hidup yang prestisius.',
        formula: 'S + will have been + V-ing',
        exceptions: 'Must include a duration (e.g., "for two hours") and a future point in time.',
        examples: [
          { text: 'By December, I will have been working here for 5 years.', translation: 'Sebelum Desember, saya akan sudah sedang bekerja di sini selama 5 tahun.', isCorrect: true },
          { text: 'How long will you have been traveling by then?', translation: 'Sudah berapa lama kamu akan sedang bepergian pada saat itu nanti?', isCorrect: true },
          { text: 'She will have been living in Cairo for a decade next June.', translation: 'Dia akan sudah sedang tinggal di Kairo selama satu dekade pada bulan Juni mendatang.', isCorrect: true },
          { text: 'They will have been playing for two hours by 5 PM.', translation: 'Mereka akan sudah sedang bermain selama dua jam sebelum jam 5 sore.', isCorrect: true },
          { text: 'We will have been fasting for 12 hours by Iftar.', translation: 'Kita akan sudah sedang berpuasa selama 12 jam menjelang waktu buka puasa.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Visi: Merancang Masa Depan yang Berkah',
        content: 'Dalam Islam, visi masa depan (Ukhrawi) harus selalu seimbang dengan usaha duniawi. Menggunakan future perfect untuk target-target mulia mencerminkan semangat "High Ambition" yang tetap dalam koridor tawakkal. Jangan lupa sertakan "InshaAllah" dalam setiap proyeksi masa depan Anda.\n\nBahasa proyeksi membantu kita untuk memvisualisasikan hasil akhir dari perjuangan kita saat ini. Saat kita berkata "I will have memorized the Quran", kita sedang menanamkan benih tekad yang kuat di dalam hati. Gunakan tenses ini sebagai alat motivasi diri untuk terus tumbuh dan memberikan manfaat luas bagi ummat.',
        formula: 'Strategic Visioning (Amal Jariyah)',
        exceptions: 'Planning is a form of worship (Ibadah) when accompanied by sincere intentions.',
        examples: [
          { text: 'InshaAllah, by next Eid, I will have shared more charity.', translation: 'Insya Allah, menjelang Idul Fitri berikutnya, saya akan sudah menyalurkan lebih banyak sedekah.', isCorrect: true },
          { text: 'I will be working on my character every day, InshaAllah.', translation: 'Saya akan terus memperbaiki karakter saya setiap hari, Insya Allah.', isCorrect: true },
          { text: 'May we have completed our goals by the end of the year.', translation: 'Semoga kita telah menyelesaikan target-target kita sebelum akhir tahun.', isCorrect: true },
          { text: 'InshaAllah, she will have recovered fully by next week.', translation: 'Insya Allah, dia akan sudah pulih sepenuhnya sebelum minggu depan.', isCorrect: true },
          { text: 'The community will be growing stronger every year, InshaAllah.', translation: 'Komunitas ini akan terus tumbuh lebih kuat setiap tahun, Insya Allah.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-fut-root', label: 'FUTURE PROJECTION', type: 'root', children: [
        { id: 'cont', label: 'Future Continuous', type: 'main', children: [
          { id: 'f1', label: 'Will be + V-ing', type: 'formula' },
          { id: 'u1', label: 'Ongoing action in future', type: 'sub' }
        ]},
        { id: 'perf', label: 'Future Perfect', type: 'main', children: [
          { id: 'f2', label: 'Will have + V3', type: 'formula' },
          { id: 'u2', label: 'Completed by a deadline', type: 'sub' }
        ]},
        { id: 'dur', label: 'Future Perf Continuous', type: 'sub', detail: 'How long a task will have been going on.' }
      ]
    }
  },
  {
    id: 'b2-wish-regrets',
    title: '5. Wishes and Regrets',
    level: 'B2',
    icon: 'fa-undo',
    description: 'Belajar mengekspresikan keinginan untuk perubahan di masa kini dan refleksi atas kejadian masa lalu dengan struktur puitis.',
    sections: [
      {
        heading: '1. Wish for Present: Mengharap Realitas Berbeda',
        content: 'Struktur "I wish + Past Simple" digunakan untuk menyatakan keinginan agar situasi saat ini berbeda dari kenyataan yang ada. Meskipun menggunakan tenses lampau, maknanya tetap untuk SEKARANG. Ini adalah cara otak kita memproses imajinasi tentang solusi atau kenyamanan tambahan.\n\nMisalnya, "I wish I were rich" berarti kenyataannya sekarang saya belum kaya. Perhatikan penggunaan "Were" yang bersifat formal untuk semua subjek (termasuk I/He/She). Penggunaan struktur ini menunjukkan kedalaman perasaan Anda terhadap sebuah kekurangan atau tantangan yang sedang dihadapi.',
        formula: 'S + wish + S + Past Simple',
        exceptions: 'Use "were" instead of "was" for all persons (I, he, she, it) in formal grammar.',
        examples: [
          { text: 'I wish I had more free time.', translation: 'Saya berharap saya punya lebih banyak waktu luang.', isCorrect: true },
          { text: 'She wishes she lived closer to the mosque.', translation: 'Dia berharap dia tinggal lebih dekat ke masjid.', isCorrect: true },
          { text: 'I wish it weren\'t so hot today.', translation: 'Saya berharap hari ini tidak begitu panas.', isCorrect: true },
          { text: 'They wish they knew the answer.', translation: 'Mereka berharap mereka tahu jawabannya.', isCorrect: true },
          { text: 'Do you wish you were younger?', translation: 'Apakah kamu berharap kamu lebih muda?', isCorrect: true }
        ]
      },
      {
        heading: '2. Wish for Past: Refleksi dan Penyesalan',
        content: 'Untuk membicarakan kejadian yang sudah lewat dan kita ingin itu terjadi secara berbeda, kita menggunakan "I wish + Past Perfect" (had + V3). Ini adalah bahasa murni penyesalan atau evaluasi sejarah hidup yang tidak bisa diubah lagi.\n\nMemahami struktur ini membantu Anda dalam diskusi psikologis atau narasi biografi. Ia memberikan dimensi kemanusiaan pada cerita Anda, menunjukkan bahwa setiap manusia pernah melakukan kesalahan atau memiliki peluang yang terlewatkan. Di level B2, Anda harus fasih mengubah fakta masa lalu ke dalam kalimat pengandaian ini.',
        formula: 'S + wish + S + Past Perfect (had + V3)',
        exceptions: 'This structure always refers to a finished period in the past.',
        examples: [
          { text: 'I wish I had studied harder for the exam.', translation: 'Saya berharap saya sudah belajar lebih giat untuk ujian itu.', isCorrect: true },
          { text: 'He wishes he hadn\'t said those mean words.', translation: 'Dia berharap dia tidak mengucapkan kata-kata kasar itu.', isCorrect: true },
          { text: 'We wish we had arrived on time.', translation: 'Kami berharap kami sudah sampai tepat waktu.', isCorrect: true },
          { text: 'She wishes she had taken the opportunity.', translation: 'Dia berharap dia sudah mengambil kesempatan itu.', isCorrect: true },
          { text: 'I wish I had known the truth earlier.', translation: 'Saya berharap saya sudah tahu kebenarannya lebih awal.', isCorrect: true }
        ]
      },
      {
        heading: '3. "If Only": Versi yang Lebih Dramatis',
        content: '"If only" memiliki fungsi yang identik dengan "I wish", namun ia memberikan tekanan emosional yang jauh lebih kuat. Kita menggunakannya untuk menunjukkan keinginan yang sangat mendalam atau kesedihan yang lebih tajam. Seringkali kalimat ini berdiri sendiri sebagai seruan.\n\n"If only I had known!" terdengar lebih pedih daripada "I wish I had known". Di level B2, pemilihan antara "I wish" dan "If only" mencerminkan kemampuan Anda mengontrol nada (tone) dan intensitas perasaan dalam komunikasi tertulis maupun lisan.',
        formula: 'If only + S + Past Simple / Past Perfect',
        exceptions: 'Can be used as a standalone exclamation to express strong regret.',
        examples: [
          { text: 'If only I were there with you!', translation: 'Seandainya saja saya ada di sana bersamamu!', isCorrect: true },
          { text: 'If only they had listened to the advice.', translation: 'Seandainya saja mereka sudah mendengarkan nasihat itu.', isCorrect: true },
          { text: 'If only it would stop raining!', translation: 'Seandainya saja hujan ini mau berhenti!', isCorrect: true, note: 'Wish for behavior change.' },
          { text: 'If only we had more patience.', translation: 'Seandainya saja kita punya lebih banyak kesabaran.', isCorrect: true },
          { text: 'If only she hadn\'t left so soon.', translation: 'Seandainya saja dia tidak pergi secepat itu.', isCorrect: true }
        ]
      },
      {
        heading: '4. Wish + Would: Mengeluhkan Kebiasaan Orang Lain',
        content: 'Ketika kita ingin seseorang (atau sesuatu) mengubah perilakunya yang menyebalkan atau mengganggu, kita menggunakan "I wish + WOULD + Verb 1". Ini adalah tenses untuk mengekspresikan ketidaksabaran atau keluhan terhadap faktor eksternal.\n\nPenting: Jangan gunakan "Would" untuk diri sendiri (I wish I would - SALAH). Gunakan hanya untuk orang lain atau benda mati (cuaca, mesin). Memahami batasan ini menunjukkan ketelitian Anda dalam membedakan antara keinginan internal dan ekspektasi terhadap lingkungan luar.',
        formula: 'S + wish + S (others) + would + V1',
        exceptions: 'Never use "I wish I would" when talking about yourself.',
        examples: [
          { text: 'I wish you would stop talking so loudly.', translation: 'Saya berharap kamu mau berhenti bicara begitu keras.', isCorrect: true },
          { text: 'He wishes the noise would go away.', translation: 'Dia berharap kebisingan itu mau hilang.', isCorrect: true },
          { text: 'I wish it would stop snowing.', translation: 'Saya berharap salju ini mau berhenti turun.', isCorrect: true },
          { text: 'She wishes he would help her more.', translation: 'Dia berharap dia (laki-laki) mau lebih banyak membantunya.', isCorrect: true },
          { text: 'They wish the bus would arrive soon.', translation: 'Mereka berharap busnya mau segera datang.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Muhasabah: Belajar Tanpa Meratapi',
        content: 'Dalam Adab Islam, penyesalan masa lalu (*Regret*) harus diarahkan menjadi Taubat atau pelajaran untuk masa depan. Menggunakan struktur "I wish" dalam konteks spiritual disebut Muhasabah. Kita mengakui kekurangan kita di hadapan Allah untuk memohon kekuatan agar menjadi lebih baik.\n\nNamun, kita juga diingatkan untuk tetap Ridha dengan takdir yang sudah terjadi. Gunakan bahasa "Wishes" untuk merumuskan target baru, bukan untuk terjebak dalam kesedihan yang melumpuhkan. Bahasa adalah cerminan kematangan jiwa dalam menerima masa lalu dan merancang masa depan yang lebih bertaqwa.',
        formula: ' Muhasabah (Self-Evaluation)',
        exceptions: 'The focus should shift from "why did I do that" to "how can I do better".',
        examples: [
          { text: 'I wish I had been more grateful for the blessings.', translation: 'Saya berharap saya sudah lebih bersyukur atas nikmat-nikmat tersebut.', isCorrect: true },
          { text: 'If only I could spend more time in Zikr.', translation: 'Seandainya saja saya bisa menghabiskan lebih banyak waktu untuk berzikir.', isCorrect: true },
          { text: 'We wish we had helped the orphans more.', translation: 'Kami berharap kami sudah lebih banyak membantu anak-anak yatim.', isCorrect: true },
          { text: 'I wish my heart were always at peace.', translation: 'Saya berharap hati saya selalu dalam keadaan damai.', isCorrect: true },
          { text: 'May Allah help us achieve what we wish for.', translation: 'Semoga Allah membantu kita mencapai apa yang kita harapkan.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-wish-root', label: 'WISHES & REGRETS', type: 'root', children: [
        { id: 'present', label: 'Present Wish', type: 'main', children: [
          { id: 'f1', label: 'Wish + Past Simple', type: 'formula' },
          { id: 'u1', label: 'Reality is different now', type: 'sub' }
        ]},
        { id: 'past', label: 'Past Regret', type: 'main', children: [
          { id: 'f2', label: 'Wish + Past Perfect', type: 'formula' },
          { id: 'u2', label: 'Regret about history', type: 'sub' }
        ]},
        { id: 'complaint', label: 'Behavior Change', type: 'sub', detail: 'Wish + WOULD + V1 (For others only)' }
      ]
    }
  },
  {
    id: 'b2-relative-clauses',
    title: '6. Non-Defining Relative Clauses',
    level: 'B2',
    icon: 'fa-link',
    description: 'Menambahkan detail deskriptif tambahan yang kaya tanpa mengubah inti identitas benda utama.',
    sections: [
      {
        heading: '1. Prinsip: Informasi Ekstra yang Elegan',
        content: 'Non-defining relative clauses memberikan informasi tambahan tentang seseorang atau sesuatu yang SUDAH JELAS identitasnya. Informasi ini bersifat opsional; jika dihapus, pembaca tetap tahu siapa atau apa yang sedang dibicarakan. Di sinilah letak perbedaannya dengan "defining" yang bersifat wajib.\n\nDalam penulisan formal, struktur ini adalah tanda kemahiran gaya bahasa. Ia memungkinkan Anda untuk menyisipkan fakta menarik, latar belakang, atau opini di tengah kalimat tanpa harus memecahnya menjadi kalimat-kalimat pendek yang terputus. Ini menciptakan aliran bacaan yang lebih dewasa dan profesional.',
        formula: 'S, [who/which/whose/where + clause], V + O',
        exceptions: 'The main sentence must still make complete sense if the clause is removed.',
        examples: [
          { text: 'My brother, who lives in Cairo, is an imam.', translation: 'Saudara laki-laki saya, yang tinggal di Kairo, adalah seorang imam.', isCorrect: true },
          { text: 'Medina, which is a holy city, is very peaceful.', translation: 'Madinah, yang merupakan kota suci, sangat damai.', isCorrect: true },
          { text: 'The Quran, which was revealed to the Prophet, is our guide.', translation: 'Al-Quran, yang diturunkan kepada Nabi, adalah petunjuk kita.', isCorrect: true },
          { text: 'Ahmad, whose father is a doctor, is my friend.', translation: 'Ahmad, yang ayahnya adalah seorang dokter, adalah teman saya.', isCorrect: true },
          { text: 'The Nile, which flows through Egypt, is very long.', translation: 'Sungai Nil, yang mengalir melalui Mesir, sangat panjang.', isCorrect: true }
        ]
      },
      {
        heading: '2. Aturan Tanda Baca: Kekuatan Koma',
        content: 'Ciri fisik paling menonjol dari non-defining clause adalah penggunaan koma di awal dan di akhir klausa tersebut. Koma ini bertindak seperti tanda kurung yang memberi sinyal kepada pembaca: "Ini hanya informasi tambahan, inti kalimatnya ada di luar sini".\n\nMelupakan koma dalam struktur ini adalah kesalahan tata bahasa yang serius di level B2. Tanpa koma, kalimat tersebut akan terbaca sebagai defining clause yang mungkin mengubah makna secara total. Ketelitian dalam tanda baca mencerminkan ketelitian Anda dalam menstrukturkan logika informasi bagi pembaca.',
        formula: '..., who/which/whose/where ...,',
        exceptions: 'If the relative clause comes at the end of the sentence, only one comma is used before the relative pronoun.',
        examples: [
          { text: 'The school, which was built in 1990, needs repair.', translation: 'Sekolah itu, yang dibangun pada tahun 1990, membutuhkan perbaikan.', isCorrect: true },
          { text: 'Sarah, who is the top student, won the award.', translation: 'Sarah, yang merupakan siswa terbaik, memenangkan penghargaan tersebut.', isCorrect: true },
          { text: 'That car, which I bought last year, is very fast.', translation: 'Mobil itu, yang saya beli tahun lalu, sangat cepat.', isCorrect: true },
          { text: 'Our teacher, who is very patient, helped us.', translation: 'Guru kami, yang sangat sabar, membantu kami.', isCorrect: true },
          { text: 'The project, which we started in May, is finished.', translation: 'Proyek itu, yang kami mulai pada bulan Mei, sudah selesai.', isCorrect: true }
        ]
      },
      {
        heading: '3. Larangan Kata "THAT"',
        content: 'Satu aturan emas yang sering menjebak pelajar adalah: Anda TIDAK BOLEH menggunakan kata "That" dalam non-defining relative clause. Anda wajib menggunakan *Who* untuk manusia, *Which* untuk benda, *Whose* untuk kepemilikan, atau *Where* untuk lokasi.\n\n"That" hanya diperuntukkan bagi defining clauses (tanpa koma). Membiasakan diri menggunakan "Which" atau "Who" setelah koma akan secara instan membuat tulisan Anda terlihat lebih akademik dan sesuai dengan standar tata bahasa internasional yang ketat.',
        formula: 'Use Who/Which, NOT "That" after a comma.',
        exceptions: '"That" can only be used in defining relative clauses (where no commas are present).',
        examples: [
          { text: 'My laptop, which is new, works well.', translation: 'Laptop saya, yang (masih) baru, berfungsi dengan baik.', isCorrect: true },
          { text: 'My laptop, that is new, works well.', translation: 'Laptop saya, yang baru, berfungsi dengan baik.', isCorrect: false, note: 'Cannot use "that" here.' },
          { text: 'Ali, who is my cousin, is very kind.', translation: 'Ali, yang merupakan sepupu saya, sangat baik hati.', isCorrect: true },
          { text: 'The mosque, where we pray, is beautiful.', translation: 'Masjid, tempat kita shalat, sangat indah.', isCorrect: true },
          { text: 'His books, which are famous, are in the library.', translation: 'Buku-bukunya, yang terkenal itu, ada di perpustakaan.', isCorrect: true }
        ]
      },
      {
        heading: '4. Menunjukkan Hubungan dan Konteks',
        content: 'Struktur ini sangat efektif untuk membangun kredibilitas karakter atau objek dalam cerita. Dengan menambahkan detail seperti profesi, hubungan keluarga, atau pencapaian masa lalu, Anda memberikan konteks yang lebih kaya bagi pembaca untuk memahami motivasi di balik sebuah aksi.\n\nDalam laporan profesional, ini digunakan untuk memberikan kualifikasi pada tokoh atau data yang disebutkan. "Mr. Ali, who has 20 years of experience, leads the team." Perhatikan bagaimana informasi di antara koma tersebut secara instan meningkatkan kepercayaan pembaca terhadap tokoh tersebut.',
        formula: 'Adding Background Context via Relative Pronouns',
        exceptions: 'Do not overload a single sentence with too many non-defining clauses.',
        examples: [
          { text: 'The CEO, who is a very busy man, accepted the invitation.', translation: 'CEO tersebut, yang merupakan orang yang sangat sibuk, menerima undangan itu.', isCorrect: true },
          { text: 'Jakarta, where millions of people live, is the capital.', translation: 'Jakarta, tempat jutaan orang tinggal, adalah ibu kota.', isCorrect: true },
          { text: 'This computer, which I borrowed from Ali, is broken.', translation: 'Komputer ini, yang saya pinjam dari Ali, rusak.', isCorrect: true },
          { text: 'The scholarship, which covers all costs, is very competitive.', translation: 'Beasiswa itu, yang menanggung semua biaya, sangat kompetitif.', isCorrect: true },
          { text: 'My uncle, whose house is near the beach, invited us.', translation: 'Paman saya, yang rumahnya dekat pantai, mengundang kami.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Deskripsi: Memberikan Apresiasi',
        content: 'Dalam perspektif Islam, memberikan detail yang baik tentang seseorang adalah bagian dari memuliakan sesama Muslim. Non-defining clauses memungkinkan kita menyisipkan pujian atau pengakuan atas jasa seseorang secara halus dan tidak berlebihan di dalam narasi kita.\n\n"Umar, who was known for his justice, was a great leader." Kalimat ini memberikan apresiasi pada karakter mulia tokoh tersebut. Gunakanlah struktur ini untuk menyebarkan nilai-nilai positif dan menginspirasi orang lain melalui detail-detail kebaikan yang Anda selipkan dalam setiap tulisan Anda.',
        formula: 'Apresiasi (Recognition) via Grammar',
        exceptions: 'Avoid excessive praise that might lead to pride (Riya); keep it factual and sincere.',
        examples: [
          { text: 'The Quran, which is the final revelation, provides peace.', translation: 'Al-Quran, yang merupakan wahyu terakhir, memberikan kedamaian.', isCorrect: true },
          { text: 'Our parents, who sacrificed so much, deserve our love.', translation: 'Orang tua kita, yang telah berkorban begitu banyak, layak mendapatkan cinta kita.', isCorrect: true },
          { text: 'Ramadan, which is a month of mercy, is coming soon.', translation: 'Ramadhan, yang merupakan bulan rahmat, akan segera datang.', isCorrect: true },
          { text: 'The scholars, who seek knowledge for Allah, are respected.', translation: 'Para ulama, yang menuntut ilmu karena Allah, sangat dihormati.', isCorrect: true },
          { text: 'The mosque, which is a house of Allah, must be clean.', translation: 'Masjid, yang merupakan rumah Allah, harus bersih.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-rel-root', label: 'NON-DEFINING CLAUSES', type: 'root', children: [
        { id: 'logic', label: 'Extra Information', type: 'main', children: [
          { id: 'opt', label: 'Optional detail', type: 'sub' },
          { id: 'known', label: 'Identity is already clear', type: 'sub' }
        ]},
        { id: 'punctuation', label: 'The Commas Rule', type: 'formula', children: [
          { id: 'c-start', label: 'Comma before who/which', type: 'sub' },
          { id: 'c-end', label: 'Comma at the end of clause', type: 'sub' }
        ]},
        { id: 'restriction', label: 'No "THAT"', type: 'warning', detail: 'Use only Who, Which, Whose, Where.' }
      ]
    }
  },
  {
    id: 'b2-modals-past',
    title: '7. Modals of Deduction: Past',
    level: 'B2',
    icon: 'fa-search',
    description: 'Mengembangkan kemampuan melakukan investigasi logis dan spekulasi tentang kejadian masa lalu berdasarkan bukti yang ada.',
    sections: [
      {
        heading: '1. Rumus Past Deduction: Modal + Have + V3',
        content: 'Untuk membuat spekulasi tentang masa lalu, kita tidak bisa menggunakan modal verb secara tunggal. Kita wajib menggunakan struktur "Perfect Infinitive" (Have + Past Participle). Rumus utamanya: **Subject + Modal + Have + Verb 3**.\n\nMemahami struktur ini adalah lonjakan besar bagi pelajar B2. Ini memungkinkan Anda untuk "melihat ke belakang" dan menarik kesimpulan dari jejak-jejak yang tertinggal. Ketelitian dalam menggunakan Verb 3 di sini sangat krusial agar pendengar tahu bahwa Anda sedang membicarakan masa lalu, bukan kemungkinan di masa depan.',
        formula: 'Subject + Modal + have + Verb 3',
        exceptions: 'The structure remains "have + V3" regardless of the subject (he/she/it).',
        examples: [
          { text: 'He must have arrived by now.', translation: 'Dia pasti sudah sampai sekarang.', isCorrect: true },
          { text: 'She might have forgotten the meeting.', translation: 'Dia mungkin sudah melupakan pertemuan itu.', isCorrect: true },
          { text: 'They could have finished the project.', translation: 'Mereka bisa saja sudah menyelesaikan proyek itu.', isCorrect: true },
          { text: 'You should have seen his face!', translation: 'Kamu seharusnya melihat wajahnya (saat itu)!', isCorrect: true },
          { text: 'I must have lost my keys at the park.', translation: 'Saya pasti sudah kehilangan kunci saya di taman.', isCorrect: true }
        ]
      },
      {
        heading: '2. Must Have: Kepastian Logis 90%',
        content: '"Must have + V3" digunakan ketika kita merasa sangat yakin bahwa sesuatu terjadi di masa lalu berdasarkan bukti yang sangat kuat saat ini. Ini bukan sekadar tebakan, tapi kesimpulan dari observasi yang mendalam.\n\nContoh: "Jalannya basah, pasti tadi hujan (It must have rained)". Penggunaan ini menunjukkan ketajaman analisis Anda. Di level B2, Anda diharapkan mampu memberikan alasan logis mengapa Anda menggunakan "Must have" alih-alih sekadar berkata "It rained" (yang merupakan fakta, bukan deduksi).',
        formula: 'Subject + must + have + Verb 3',
        exceptions: 'Do not use "must have" for negative deductions (e.g., "It must not have happened" is incorrect for deduction).',
        examples: [
          { text: 'The lights are off; they must have gone to bed.', translation: 'Lampu-lampunya mati; mereka pasti sudah tidur.', isCorrect: true },
          { text: 'He looks very happy; he must have passed the exam.', translation: 'Dia terlihat sangat senang; dia pasti sudah lulus ujian.', isCorrect: true },
          { text: 'The food is gone; the cat must have eaten it.', translation: 'Makanannya habis; kucing itu pasti sudah memakannya.', isCorrect: true },
          { text: 'She didn\'t answer; she must have been busy.', translation: 'Dia tidak menjawab; dia pasti sudah sedang sibuk.', isCorrect: true },
          { text: 'The team is celebrating; they must have won.', translation: 'Tim itu sedang merayakan; mereka pasti sudah menang.', isCorrect: true }
        ]
      },
      {
        heading: '3. Can\'t Have: Ketidakmungkinan di Masa Lalu',
        content: 'Kebalikan dari "Must have" adalah "Can\'t have + V3" (atau "couldn\'t have"). Kita menggunakannya ketika kita yakin 100% bahwa sesuatu TIDAK MUNGKIN terjadi karena bertentangan dengan bukti atau logika yang kita miliki.\n\nIngat: Jangan gunakan "Must not have" untuk deduksi negatif. Ini adalah kesalahan umum yang harus dihindari. "He can\'t have seen me, I was hiding" adalah cara yang benar untuk menyatakan kemustahilan sebuah peristiwa masa lalu dalam bahasa Inggris yang tepat.',
        formula: 'Subject + can\'t/couldn\'t + have + Verb 3',
        exceptions: '"Can\'t have" is used for high certainty of non-occurrence; do not use "must not have" for this purpose.',
        examples: [
          { text: 'He can\'t have stolen the money; he was with me.', translation: 'Dia tidak mungkin sudah mencuri uang itu; dia sedang bersama saya.', isCorrect: true },
          { text: 'She can\'t have finished the book; it\'s too long.', translation: 'Dia tidak mungkin sudah menyelesaikan buku itu; bukunya terlalu panjang.', isCorrect: true },
          { text: 'They can\'t have left already; their car is still here.', translation: 'Mereka tidak mungkin sudah berangkat; mobil mereka masih di sini.', isCorrect: true },
          { text: 'I can\'t have forgotten my bag; I had it at the bus.', translation: 'Saya tidak mungkin sudah melupakan tas saya; saya membawanya di bus.', isCorrect: true },
          { text: 'It can\'t have been Ali; he is in Mecca now.', translation: 'Itu tidak mungkin Ali; dia sedang berada di Mekkah sekarang.', isCorrect: true }
        ]
      },
      {
        heading: '4. Might/Could Have: Spekulasi Ringan',
        content: 'Ketika bukti yang ada sangat minim dan kita hanya sekadar menebak-nebak berbagai kemungkinan, kita menggunakan "Might have", "May have", atau "Could have". Ketiganya menunjukkan tingkat kepastian yang rendah (sekitar 30-50%).\n\nBahasa ini sangat berguna dalam diskusi investigatif atau pemecahan masalah yang belum tuntas. Dengan menggunakan modal ini, Anda menunjukkan sikap yang objektif dan tidak terburu-buru mengambil kesimpulan. Ini adalah ciri intelektualitas seorang pembelajar yang menghargai kompleksitas sebuah peristiwa.',
        formula: 'Subject + might/may/could + have + Verb 3',
        exceptions: '"Might have" is slightly less certain than "could have".',
        examples: [
          { text: 'He might have taken a different route.', translation: 'Dia mungkin saja sudah mengambil rute yang berbeda.', isCorrect: true },
          { text: 'They could have misunderstood the instructions.', translation: 'Mereka bisa saja sudah salah memahami instruksi tersebut.', isCorrect: true },
          { text: 'She may have left her phone at home.', translation: 'Dia mungkin saja sudah meninggalkan ponselnya di rumah.', isCorrect: true },
          { text: 'It might have been a mistake.', translation: 'Itu mungkin saja sebuah kesalahan.', isCorrect: true },
          { text: 'We could have helped if we had known.', translation: 'Kita bisa saja sudah membantu jika kita sudah tahu.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Prasangka: Husnudzon di Masa Lalu',
        content: 'Dalam Islam, kita diperintahkan untuk berprasangka baik (*Husnudzon*). Penggunaan modals of deduction membantu kita menjaga lisan dari tuduhan tanpa dasar. Gunakan "Must have" untuk menyimpulkan hal baik dan "Might have" untuk meragukan hal buruk tentang orang lain.\n\nMisalnya, daripada menuduh "Dia mencuri", gunakan deduksi yang santun: "He might have borrowed it by mistake". Bahasa yang kita pilih untuk mendeskripsikan masa lalu orang lain adalah ujian bagi kejujuran dan kasih sayang dalam hati kita. Jadikanlah tata bahasa ini sebagai pelindung martabat sesama Muslim.',
        formula: 'Husnudzon (Positive Assumption) Logic',
        exceptions: 'Deduction should be used to provide excuses for others (tabayyun), not to find faults.',
        examples: [
          { text: 'He must have intended to do good.', translation: 'Dia pasti sudah berniat untuk berbuat baik.', isCorrect: true },
          { text: 'She might have had a valid reason for being late.', translation: 'Dia mungkin saja punya alasan yang sah karena terlambat.', isCorrect: true },
          { text: 'They could have forgotten to call us.', translation: 'Mereka bisa saja sudah lupa untuk menelepon kita.', isCorrect: true },
          { text: 'There must have been a misunderstanding.', translation: 'Pasti sudah terjadi kesalahpahaman.', isCorrect: true },
          { text: 'He might not have seen your message.', translation: 'Dia mungkin saja belum melihat pesanmu.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-dedpast-root', label: 'PAST DEDUCTION', type: 'root', children: [
        { id: 'formula', label: 'The Structure', type: 'formula', children: [
          { id: 'f1', label: 'Modal + HAVE + Verb 3', type: 'formula' }
        ]},
        { id: 'certainty', label: 'Levels of Certainty', type: 'main', children: [
          { id: 'sure-y', label: '90% Sure (Yes): MUST HAVE', type: 'sub' },
          { id: 'sure-n', label: '90% Sure (No): CAN\'T HAVE', type: 'sub' },
          { id: 'maybe', label: '50% Maybe: MIGHT / COULD HAVE', type: 'sub' }
        ]},
        { id: 'adab', label: 'Islamic Adab', type: 'warning', detail: 'Always prioritize Husnudzon in deductions.' }
      ]
    }
  },
  {
    id: 'b2-causatives',
    title: '8. Causative Verbs (Have & Get)',
    level: 'B2',
    icon: 'fa-tasks',
    description: 'Seni mengomunikasikan delegasi tugas dan meminta bantuan secara profesional menggunakan Have dan Get.',
    sections: [
      {
        heading: '1. Prinsip Delegasi: Have Something Done',
        content: 'Causative structure "Have something done" digunakan ketika kita tidak melakukan pekerjaan itu sendiri, melainkan membayar atau meminta orang lain melakukannya untuk kita. Ini sangat umum untuk layanan profesional seperti potong rambut, servis mobil, atau renovasi rumah.\n\nStrukturnya adalah: **Have + Object + Verb 3**. Fokus utamanya adalah pada HASIL pengerjaannya, bukan pada siapa yang mengerjakannya. Penguasaan struktur ini menunjukkan bahwa Anda mampu mendeskripsikan manajemen tugas dalam kehidupan sehari-hari dengan cara yang sangat efisien dan alami bagi penutur asli.',
        formula: 'Subject + have + object + Verb 3',
        exceptions: 'The tense is indicated by the verb "have" (e.g., "I am having", "I had").',
        examples: [
          { text: 'I had my car repaired yesterday.', translation: 'Saya menyuruh orang memperbaiki mobil saya kemarin.', isCorrect: true, note: 'Montir yang memperbaiki.' },
          { text: 'She is having her hair cut right now.', translation: 'Dia sedang menyuruh orang memotong rambutnya sekarang.', isCorrect: true },
          { text: 'We had the house painted last month.', translation: 'Kami menyuruh orang mengecat rumah kami bulan lalu.', isCorrect: true },
          { text: 'They need to have the roof fixed.', translation: 'Mereka perlu menyuruh orang memperbaiki atapnya.', isCorrect: true },
          { text: 'I will have the report checked by the expert.', translation: 'Saya akan menyuruh ahli memeriksa laporan tersebut.', isCorrect: true }
        ]
      },
      {
        heading: '2. The "Get" Causative: Persuasi dan Usaha',
        content: '"Get something done" memiliki makna yang mirip dengan "Have", namun seringkali mengandung nuansa bahwa ada USAHA atau PERSUASI yang dilakukan untuk mewujudkannya. Kadang-kadang ini juga merujuk pada penyelesaian tugas yang sulit atau memakan waktu.\n\nDalam percakapan informal, "Get" jauh lebih sering digunakan daripada "Have". Contoh: "I finally got the computer fixed". Penggunaan "Get" memberikan kesan bahwa Anda telah berhasil menuntaskan sebuah masalah. Memahami perbedaan halus ini akan membuat bahasa Inggris Anda terdengar lebih dinamis dan ekspresif.',
        formula: 'Subject + get + object + Verb 3',
        exceptions: 'More informal than "have" and often implies that the task was difficult to complete.',
        examples: [
          { text: 'I got my homework done early.', translation: 'Saya (berhasil) menyelesaikan PR saya lebih awal.', isCorrect: true },
          { text: 'She got her brother to help her.', translation: 'Dia membujuk saudaranya untuk membantunya.', isCorrect: true, note: 'Active causative: Get + Person + TO + V1.' },
          { text: 'We finally got the car started.', translation: 'Kami akhirnya (berhasil) menyalakan mobilnya.', isCorrect: true },
          { text: 'Can you get the laundry done today?', translation: 'Bisakah kamu menyelesaikan cuciannya hari ini?', isCorrect: true },
          { text: 'I got my passport renewed at the embassy.', translation: 'Saya (berhasil) memperbarui paspor saya di kedutaan.', isCorrect: true }
        ]
      },
      {
        heading: '3. Active Causatives: Menyebutkan Pelakunya',
        content: 'Jika Anda ingin secara spesifik menyebutkan SIAPA yang Anda suruh atau minta, kita menggunakan pola aktif. Untuk "Have", polanya adalah **Have + Person + Verb 1** (tanpa to). Untuk "Get", polanya adalah **Get + Person + TO + Verb 1**.\n\nPerbedaan penggunaan "TO" ini adalah jebakan klasik bagi pelajar level intermediate. Menguasai pola ini sangat penting dalam instruksi manajemen atau koordinasi tim. "I will have him call you" (Benar) vs "I will get him TO call you" (Benar). Pilih salah satu dan gunakan secara konsisten sesuai dengan tingkat keformalan situasi.',
        formula: 'Have + Person + V1 | Get + Person + TO + V1',
        exceptions: 'The "to" is mandatory in the "get" structure and must be absent in the "have" structure.',
        examples: [
          { text: 'I had the technician check the machine.', translation: 'Saya menyuruh teknisi memeriksa mesin tersebut.', isCorrect: true },
          { text: 'She got her husband to wash the dishes.', translation: 'Dia membujuk suaminya untuk mencuci piring.', isCorrect: true },
          { text: 'The teacher had the students write an essay.', translation: 'Guru menyuruh para siswa menulis sebuah esai.', isCorrect: true },
          { text: 'I will get my friend to lend me his book.', translation: 'Saya akan membujuk teman saya untuk meminjamkan bukunya kepada saya.', isCorrect: true },
          { text: 'He had the waiter bring some water.', translation: 'Dia menyuruh pelayan membawakan air.', isCorrect: true }
        ]
      },
      {
        heading: '4. Causatives dalam Konteks Malapetaka',
        content: 'Menariknya, struktur causative juga bisa digunakan untuk menceritakan kejadian buruk yang menimpa kita (unpleasant experiences) meskipun kita tidak merencanakannya. Contoh: "I had my bike stolen" (Sepeda saya dicuri).\n\nDi sini, subjek bukan sebagai "penyuruh", melainkan sebagai pihak yang terkena dampak dari sebuah aksi orang lain. Menggunakan pola ini memberikan nuansa objektivitas pada narasi kemalangan Anda, seolah-olah Anda sedang melaporkan sebuah kejadian kepada pihak berwenang. Ini adalah teknik narasi yang sangat berguna untuk level B2.',
        formula: 'Subject + have + object + Verb 3 (for accidents)',
        exceptions: 'The meaning changes from "delegation" to "experiencing an event".',
        examples: [
          { text: 'She had her wallet stolen on the bus.', translation: 'Dompetnya dicuri di bus.', isCorrect: true },
          { text: 'They had their house damaged by the storm.', translation: 'Rumah mereka rusak karena badai.', isCorrect: true },
          { text: 'I had my account hacked yesterday.', translation: 'Akun saya diretas kemarin.', isCorrect: true },
          { text: 'He had his application rejected twice.', translation: 'Aplikasinya ditolak dua kali.', isCorrect: true },
          { text: 'We had our flight cancelled at the last minute.', translation: 'Penerbangan kami dibatalkan pada menit terakhir.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Kerjasama: Tolong-Menolong dalam Kebaikan',
        content: 'Dalam Islam, kita tidak bisa hidup sendirian; kita diperintahkan untuk saling tolong-menolong dalam kebaikan (*Ta\'awun*). Menggunakan causative verbs mencerminkan adab dalam berinteraksi dengan orang-orang yang memberikan jasa kepada kita, baik itu pekerja profesional maupun saudara sendiri.\n\nHargailah setiap orang yang "Anda minta pengerjaannya" dengan memberikan hak mereka secara penuh dan tepat waktu. Bahasa causative mengajarkan kita tentang struktur tanggung jawab dan delegasi yang sehat. Gunakanlah struktur ini untuk mengapresiasi bantuan orang lain dalam perjalanan belajar dan dakwah Anda.',
        formula: 'Adab of Delegation (Ta\'awun)',
        exceptions: 'Always ensure the terms of service are clear and fair before asking for something to be done.',
        examples: [
          { text: 'Let\'s get the mosque cleaned before Friday.', translation: 'Mari kita (upayakan) bersihkan masjid sebelum hari Jumat.', isCorrect: true },
          { text: 'I had the books distributed to the needy.', translation: 'Saya menyuruh orang membagikan buku-buku tersebut kepada yang membutuhkan.', isCorrect: true },
          { text: 'She got her children to memorize the short Surahs.', translation: 'Dia membujuk anak-anaknya untuk menghafalkan surah-surah pendek.', isCorrect: true },
          { text: 'We had the water wells built in the village.', translation: 'Kami menyuruh orang membangun sumur-sumur air di desa tersebut.', isCorrect: true },
          { text: 'I will get the expert to explain the Hadith to us.', translation: 'Saya akan membujuk ahli tersebut untuk menjelaskan Hadits kepada kita.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-caus-root', label: 'CAUSATIVE VERBS', type: 'root', children: [
        { id: 'passive-c', label: 'Passive (Focus: Result)', type: 'main', children: [
          { id: 'f1', label: 'HAVE / GET + Object + V3', type: 'formula' },
          { id: 'u1', label: 'Service/Accident', type: 'sub' }
        ]},
        { id: 'active-c', label: 'Active (Focus: Person)', type: 'main', children: [
          { id: 'f2', label: 'HAVE + Person + V1', type: 'formula' },
          { id: 'f3', label: 'GET + Person + TO + V1', type: 'formula' }
        ]},
        { id: 'diff', label: 'Nuance', type: 'sub', detail: 'Have = Order/Professional | Get = Persuade/Effort' }
      ]
    }
  },
  {
    id: 'b2-gerunds-nuance',
    title: '9. Gerunds vs Infinitives (Nuance)',
    level: 'B2',
    icon: 'fa-shapes',
    description: 'Menjelajahi perbedaan makna halus ketika sebuah kata kerja diikuti oleh bentuk -ing atau to+V1.',
    sections: [
      {
        heading: '1. Perubahan Makna: Stop, Remember, dan Forget',
        content: 'Di level B1, kita belajar bahwa beberapa kata kerja hanya bisa diikuti salah satu bentuk. Namun di level B2, kita menemui kata kerja "bunglon" yang bisa diikuti keduanya namun dengan PERUBAHAN MAKNA yang drastis. Kata kuncinya adalah: Forget, Remember, dan Stop.\n\nGunakan Gerund (-ing) untuk menengok ke belakang (masa lalu/memori). Gunakan Infinitive (to+V1) untuk melihat ke depan (tugas/tujuan). Contoh: "Remember *to pray*" (Ingat untuk shalat nanti) vs "Remember *praying*" (Ingat memori saat shalat tadi). Ketajaman dalam membedakan ini adalah bukti kematangan linguistik Anda.',
        formula: 'Verb + -ing (Memory/Past) | Verb + to V1 (Duty/Future)',
        exceptions: '"Stop to do" is actually "Stop [something else] in order to do [something new]".',
        examples: [
          { text: 'I stopped working.', translation: 'Saya berhenti bekerja (meninggalkan pekerjaan).', isCorrect: true, note: 'Berhenti total dari kebiasaan/pekerjaan.' },
          { text: 'I stopped to rest.', translation: 'Saya berhenti (sejenak) untuk beristirahat.', isCorrect: true, note: 'Berhenti dari aktivitas lain UNTUK beristirahat.' },
          { text: 'Remember to lock the door.', translation: 'Ingatlah untuk mengunci pintu.', isCorrect: true, note: 'Tugas masa depan.' },
          { text: 'I remember locking the door.', translation: 'Saya ingat sudah mengunci pintu.', isCorrect: true, note: 'Memori masa lalu.' },
          { text: 'Don\'t forget to send the email.', translation: 'Jangan lupa untuk mengirim emailnya.', isCorrect: true }
        ]
      },
      {
        heading: '2. Try dan Mean: Eksperimen vs Konsekuensi',
        content: 'Kata kerja "Try" juga memiliki dua nuansa. "Try + to V1" berarti Anda berusaha keras melakukan sesuatu yang sulit (effort). Sedangkan "Try + Gerund" berarti Anda sedang bereksperimen atau mencoba sebuah metode untuk melihat hasilnya (experiment).\n\nBegitu pula dengan "Mean". "Mean + to V1" menunjukkan niat (intention), sementara "Mean + Gerund" menunjukkan konsekuensi atau melibatkan sesuatu (involve). Memahami nuansa ini membantu Anda mendeskripsikan proses pemecahan masalah dengan sangat akurat dan cerdas.',
        formula: 'Try to (Effort) / Try -ing (Expt) | Mean to (Intend) / Mean -ing (Involve)',
        exceptions: '"Mean + -ing" often describes what a situation or job entails.',
        examples: [
          { text: 'I tried to open the window.', translation: 'Saya mencoba (sekuat tenaga) membuka jendela itu.', isCorrect: true, note: 'Mencoba sekuat tenaga.' },
          { text: 'Try opening the window to get some air.', translation: 'Cobalah membuka jendela (sebagai saran) untuk mendapat udara.', isCorrect: true, note: 'Saran eksperimen.' },
          { text: 'I meant to call you.', translation: 'Saya berniat meneleponmu.', isCorrect: true, note: 'Niat saya.' },
          { text: 'This job means traveling a lot.', translation: 'Pekerjaan ini berarti (konsekuensinya) banyak bepergian.', isCorrect: true, note: 'Konsekuensi pekerjaan.' },
          { text: 'She tries to learn Arabic every day.', translation: 'Dia berusaha belajar bahasa Arab setiap hari.', isCorrect: true }
        ]
      },
      {
        heading: '3. Regret: Pengumuman vs Masa Lalu',
        content: 'Kata kerja "Regret" memiliki pola yang sangat formal di level akademik. "Regret + to V1" biasanya digunakan dalam pengumuman formal untuk menyampaikan kabar buruk (seperti "Kami menyesal mengumumkan..."). Ini adalah bahasa diplomasi.\n\nSedangkan "Regret + Gerund" digunakan untuk penyesalan personal atas tindakan di masa lalu. "I regret saying that." Penguasaan bentuk ini sangat penting untuk menjaga etika dalam komunikasi formal, seperti saat menolak lamaran kerja atau membatalkan kerjasama secara tertulis.',
        formula: 'Regret to (Formal news) | Regret -ing (Personal regret)',
        exceptions: '"Regret to inform you" is a standard fixed expression in formal letters.',
        examples: [
          { text: 'We regret to inform you that you failed.', translation: 'Kami menyesal menginformasikan kepada Anda bahwa Anda gagal.', isCorrect: true, note: 'Formal announcement.' },
          { text: 'I regret buying this cheap car.', translation: 'Saya menyesal sudah membeli mobil murah ini.', isCorrect: true, note: 'Personal regret.' },
          { text: 'She regrets to say she cannot come.', translation: 'Dia menyesal mengatakan bahwa dia tidak bisa datang.', isCorrect: true },
          { text: 'They regret missing the opportunity.', translation: 'Mereka menyesal sudah melewatkan kesempatan itu.', isCorrect: true },
          { text: 'Do you regret changing your mind?', translation: 'Apakah kamu menyesal sudah berubah pikiran?', isCorrect: true }
        ]
      },
      {
        heading: '4. Go on: Kelanjutan vs Perubahan Aksi',
        content: '"Go on" adalah kata kerja yang sangat dinamis. "Go on + Gerund" berarti melanjutkan aktivitas yang sedang dilakukan (continue). Namun, "Go on + to V1" berarti Anda menyelesaikan satu tugas lalu berpindah melakukan tugas baru yang berbeda.\n\nBayangkan seorang ustadz yang sedang mengajar. Jika beliau "Go on talking", beliau terus bicara hal yang sama. Jika beliau "Go on to explain the next verse", beliau berpindah ke topik baru. Ketelitian ini membantu pendengar mengikuti alur presentasi atau penjelasan Anda dengan lebih sistematis.',
        formula: 'Go on -ing (Continue same) | Go on to V1 (Next task)',
        exceptions: 'This is often used in formal presentations to transition between points.',
        examples: [
          { text: 'She went on writing for an hour.', translation: 'Dia terus menulis selama satu jam.', isCorrect: true, note: 'Melanjutkan aksi yang sama.' },
          { text: 'After the intro, he went on to show the slides.', translation: 'Setelah perkenalan, dia lanjut menunjukkan slide.', isCorrect: true, note: 'Berpindah ke aksi baru.' },
          { text: 'Go on reading, please.', translation: 'Lanjutkan membacanya, silakan.', isCorrect: true },
          { text: 'We will go on to discuss the results later.', translation: 'Kita akan lanjut mendiskusikan hasilnya nanti.', isCorrect: true },
          { text: 'They went on complaining all day.', translation: 'Mereka terus saja mengeluh sepanjang hari.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Niat: Antara Rencana dan Memori',
        content: 'Dalam Islam, setiap perbuatan dimulai dari niat (*Intention*). Memahami perbedaan antara "Remember to do" (Amanah masa depan) dan "Remember doing" (Syukur atas masa lalu) membantu kita menstrukturkan kesadaran spiritual kita.\n\nJadilah orang yang selalu "Remember to fulfill your promises" dan "Never regret doing good deeds". Bahasa membantu kita memilah mana yang merupakan kewajiban yang harus ditunaikan dan mana yang merupakan hikmah yang harus diingat. Ketepatan kata adalah wujud dari kejujuran pikiran seorang pembelajar yang bertaqwa.',
        formula: 'Niyyah & Reflection Logic',
        exceptions: 'Correct usage reflects clarity of thought and mindfulness (Muraqabah).',
        examples: [
          { text: 'Remember to say Bismillah before you eat.', translation: 'Ingatlah untuk mengucapkan Bismillah sebelum kamu makan.', isCorrect: true },
          { text: 'I will never forget seeing the Kaaba for the first time.', translation: 'Saya tidak akan pernah lupa saat melihat Ka\'bah untuk pertama kalinya.', isCorrect: true },
          { text: 'We regret to say that we must leave early.', translation: 'Kami menyesal harus mengatakan bahwa kami harus pergi lebih awal.', isCorrect: true },
          { text: 'Try to be patient in every situation.', translation: 'Berusahalah untuk bersabar dalam setiap situasi.', isCorrect: true },
          { text: 'I mean to improve my character every day.', translation: 'Saya berniat untuk memperbaiki karakter saya setiap hari.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-gi-root', label: 'GERUND VS INFINITIVE', type: 'root', children: [
        { id: 'memory', label: 'Memory Verbs', type: 'main', children: [
          { id: 'rem-g', label: 'Rem/Forget + ING (Memory)', type: 'sub' },
          { id: 'rem-i', label: 'Rem/Forget + TO (Duty)', type: 'sub' }
        ]},
        { id: 'action', label: 'Action Verbs', type: 'main', children: [
          { id: 'stop-g', label: 'Stop + ING (Quit habit)', type: 'sub' },
          { id: 'stop-i', label: 'Stop + TO (Pause for another)', type: 'sub' }
        ]},
        { id: 'try-mean', label: 'Try & Mean', type: 'sub', detail: 'Try + TO (Hard) / ING (Expt) | Mean + TO (Intend) / ING (Involve)' }
      ]
    }
  },
  {
    id: 'b2-reported-speech',
    title: '10. Advanced Reported Speech',
    level: 'B2',
    icon: 'fa-comments',
    description: 'Seni melaporkan perkataan, perasaan, dan instruksi orang lain dengan akurasi dan integritas informasi yang tinggi.',
    sections: [
      {
        heading: '1. Backshift Mastery: Pergeseran Waktu',
        content: 'Reported Speech (Kalimat Tak Langsung) menuntut kita untuk menggeser tenses satu langkah ke masa lalu (Backshift) ketika melaporkan apa yang dikatakan seseorang di masa lampau. "Am" menjadi "Was", "Will" menjadi "Would", dan "Present Perfect" menjadi "Past Perfect".\n\nIni adalah teknik dasar untuk menjaga kronologi cerita. Tanpa backshift, pendengar akan bingung apakah sebuah pernyataan masih berlaku atau hanya benar di waktu lampau saat diucapkan. Penguasaan pola ini mencerminkan ketelitian Anda dalam menyampaikan pesan dari satu pihak ke pihak lain secara formal dan sistematis.',
        formula: 'Pres -> Past | Past/Pres Perf -> Past Perfect | Will -> Would',
        exceptions: 'No backshift is needed if the reported statement is still true or is a universal fact.',
        examples: [
          { text: 'He said he was happy.', translation: 'Dia mengatakan bahwa dia senang.', isCorrect: true, note: 'Direct: "I am happy".' },
          { text: 'She said she had finished her work.', translation: 'Dia mengatakan bahwa dia telah menyelesaikan pekerjaannya.', isCorrect: true, note: 'Direct: "I have finished".' },
          { text: 'They said they would come.', translation: 'Mereka mengatakan bahwa mereka akan datang.', isCorrect: true, note: 'Direct: "We will come".' },
          { text: 'Ahmad said he lived in London.', translation: 'Ahmad mengatakan bahwa dia tinggal di London.', isCorrect: true },
          { text: 'The teacher said the test was easy.', translation: 'Guru mengatakan bahwa ujiannya mudah.', isCorrect: true }
        ]
      },
      {
        heading: '2. Reporting Verbs: Beyond "Say" and "Tell"',
        content: 'Di level B2, Anda harus mulai meninggalkan kata "say" and "tell" yang monoton. Gunakan kata kerja yang lebih deskriptif untuk menunjukkan NADA atau MAKSUD dari pembicara, seperti *suggest, offer, refuse, promise, warn, dan insist*.\n\nSetiap reporting verb memiliki pola gramatikal yang unik. "Offer + to V1", "Suggest + Gerund", atau "Warn + someone + NOT to V1". Menggunakan variasi ini secara instan meningkatkan kelas bahasa Anda, membuat laporan Anda terasa lebih profesional dan mampu menangkap nuansa emosional dari percakapan aslinya.',
        formula: 'Suggest + -ing | Offer + to V1 | Warn someone not to V1',
        exceptions: 'Verbs like "suggest" or "recommend" cannot be followed by an infinitive with "to".',
        examples: [
          { text: 'He offered to help me with the luggage.', translation: 'Dia menawarkan diri untuk membantu saya dengan barang bawaan.', isCorrect: true },
          { text: 'She suggested going to the park.', translation: 'Dia menyarankan untuk pergi ke taman.', isCorrect: true },
          { text: 'They refused to sign the contract.', translation: 'Mereka menolak untuk menandatangani kontrak tersebut.', isCorrect: true },
          { text: 'I promised to pray for him.', translation: 'Saya berjanji untuk mendoakannya.', isCorrect: true },
          { text: 'The guard warned us not to enter.', translation: 'Penjaga memperingatkan kami untuk tidak masuk.', isCorrect: true }
        ]
      },
      {
        heading: '3. Reported Questions: Tanpa Inversi',
        content: 'Saat melaporkan pertanyaan, pola kalimat berubah kembali menjadi pola kalimat berita (Subjek + Kata Kerja). Anda TIDAK BOLEH melakukan inversi atau menggunakan kata bantu "do/does/did" dalam reported questions.\n\nUntuk pertanyaan Yes/No, kita menggunakan penghubung "IF" atau "WHETHER". Contoh: "He asked if I was hungry". Kesalahan tetap menggunakan pola tanya dalam laporan adalah penanda utama pelajar tingkat menengah. Membiasakan pola berita ini akan membuat narasi Anda terdengar sangat halus dan berpendidikan.',
        formula: 'He asked (if/wh-) + Subject + Verb',
        exceptions: 'The question mark is removed and replaced with a period in reported questions.',
        examples: [
          { text: 'He asked where I lived.', translation: 'Dia bertanya di mana saya tinggal.', isCorrect: true, note: 'Bukan "where did I live".' },
          { text: 'She asked if I knew her name.', translation: 'Dia bertanya apakah saya tahu namanya.', isCorrect: true },
          { text: 'They asked whether we liked the food.', translation: 'Mereka bertanya apakah kami menyukai makanannya.', isCorrect: true },
          { text: 'I asked what time it was.', translation: 'Saya bertanya jam berapa saat itu.', isCorrect: true },
          { text: 'He asked how she was doing.', translation: 'Dia bertanya bagaimana kabar dia (perempuan).', isCorrect: true }
        ]
      },
      {
        heading: '4. Reporting Orders and Requests',
        content: 'Untuk melaporkan perintah atau permintaan, kita menggunakan pola "Reporting Verb + Object + TO + V1". Struktur ini sangat praktis dan sering digunakan untuk merangkum instruksi dari atasan, guru, atau orang tua.\n\n"The doctor told me to rest." Perhatikan betapa ringkasnya struktur ini dibandingkan harus mengutip kalimat aslinya. Kemampuan merangkum instruksi ini sangat vital dalam dunia kerja internasional di mana kecepatan dan kejelasan informasi adalah prioritas utama bagi setiap anggota tim.',
        formula: 'Verb + Object + (not) TO + V1',
        exceptions: 'Use "ask" for requests and "tell" or "order" for commands.',
        examples: [
          { text: 'The teacher told the students to be quiet.', translation: 'Guru menyuruh para siswa untuk diam.', isCorrect: true },
          { text: 'My father asked me to buy some bread.', translation: 'Ayah saya meminta saya untuk membeli roti.', isCorrect: true },
          { text: 'He ordered them to leave the building.', translation: 'Dia memerintahkan mereka untuk meninggalkan gedung.', isCorrect: true },
          { text: 'She begged me not to tell anyone.', translation: 'Dia memohon kepada saya untuk tidak memberi tahu siapa pun.', isCorrect: true },
          { text: 'The boss requested us to finish the report.', translation: 'Bos meminta kami untuk menyelesaikan laporan tersebut.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Amanah: Menukil Pesan dengan Benar',
        content: 'Dalam Islam, menyampaikan pesan orang lain adalah sebuah amanah. Kita dilarang untuk memutarbalikkan fakta atau mengubah maksud asli dari pembicara. Menggunakan reported speech dengan akurat adalah wujud nyata dari sifat *Sidiq* (jujur) dan *Tabligh* (menyampaikan).\n\nKetepatan dalam memilih reporting verbs membantu kita menyampaikan "semangat" di balik sebuah ucapan tanpa harus berlebihan. Jika seseorang memberi nasihat dengan lembut, laporkanlah sebagai "advice". Jika mereka melarang dengan keras, laporkanlah sebagai "warning". Kejujuran linguistik Anda adalah bagian dari integritas akhlak Anda sebagai pembelajar Muslim.',
        formula: 'Amanah (Honesty) in Transmission',
        exceptions: 'Capturing the emotional tone (Nasihat vs Warning) is as important as the words themselves.',
        examples: [
          { text: 'The scholar advised us to be patient.', translation: 'Ulama tersebut menasihati kita untuk bersabar.', isCorrect: true },
          { text: 'He promised to return the debt tomorrow.', translation: 'Dia berjanji untuk mengembalikan hutang besok.', isCorrect: true },
          { text: 'She admitted making a mistake.', translation: 'Dia mengakui telah melakukan kesalahan.', isCorrect: true },
          { text: 'The Prophet PBUH said that deeds are judged by intentions.', translation: 'Nabi SAW bersabda bahwa amal perbuatan dinilai berdasarkan niatnya.', isCorrect: true },
          { text: 'He encouraged me to keep seeking knowledge.', translation: 'Dia menyemangati saya untuk terus menuntut ilmu.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-rs-root', label: 'REPORTED SPEECH', type: 'root', children: [
        { id: 'backshift', label: 'The Backshift Rule', type: 'main', children: [
          { id: 'pres-past', label: 'Present -> Past', type: 'sub' },
          { id: 'past-pp', label: 'Past / Pres Perf -> Past Perfect', type: 'sub' },
          { id: 'will-wd', label: 'Will -> Would', type: 'sub' }
        ]},
        { id: 'questions', label: 'Reported Questions', type: 'main', children: [
          { id: 'no-inv', label: 'No Inversion (Subj + Verb)', type: 'warning' },
          { id: 'if-whe', label: 'Use IF/WHETHER for Yes/No', type: 'formula' }
        ]},
        { id: 'verbs', label: 'Descriptive Verbs', type: 'formula', detail: 'Suggest, Offer, Refuse, Warn, Promise.' }
      ]
    }
  }
];
