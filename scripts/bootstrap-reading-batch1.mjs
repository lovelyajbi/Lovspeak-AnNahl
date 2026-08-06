import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();

const readThemes = {
  adab: {
    intro: 'Good manners make daily life calmer and more dignified for a Muslim adult.',
    topics: [
      {
        title: 'Memulai Hari dengan Salam',
        scenario: 'a young employee entering the office in the morning',
        action: 'offer salam first and smile in a calm way',
        lesson: 'a warm greeting can open the day with respect and ease',
      },
      {
        title: 'Meminta Izin Sebelum Masuk',
        scenario: 'a man visiting his older brother after work',
        action: 'knock, wait, and ask for permission before entering',
        lesson: 'privacy is protected when simple manners are practiced well',
      },
      {
        title: 'Menjaga Nada Bicara di Rumah',
        scenario: 'a tired woman returning home after a long day',
        action: 'speak softly even when she feels tired',
        lesson: 'a calm voice keeps the home peaceful',
      },
      {
        title: 'Menghormati Guru dan Pembimbing',
        scenario: 'a student joining an evening Quran class',
        action: 'listen carefully before speaking',
        lesson: 'respect helps knowledge enter the heart more easily',
      },
      {
        title: 'Belajar Menunggu Giliran',
        scenario: 'several people standing in line at a clinic counter',
        action: 'wait with patience and avoid pushing ahead',
        lesson: 'good manners appear clearly when a person chooses patience',
      },
      {
        title: 'Lembut kepada yang Lebih Muda',
        scenario: 'an older sister helping her younger brother after school',
        action: 'guide him with gentle words instead of sharp ones',
        lesson: 'gentleness teaches better than anger',
      },
      {
        title: 'Menepati Janji dalam Hal Sederhana',
        scenario: 'a friend trying to keep a promise before maghrib',
        action: 'come on time and explain clearly if there is a delay',
        lesson: 'trust grows through small promises that are kept',
      },
      {
        title: 'Adab Makan yang Menenangkan',
        scenario: 'a family sitting together for dinner after a busy day',
        action: 'begin with bismillah and eat without haste',
        lesson: 'simple table manners increase gratitude',
      },
      {
        title: 'Kata-Kata Baik di Tempat Umum',
        scenario: 'a customer buying fruit in a crowded market',
        action: 'speak politely to the seller and other buyers',
        lesson: 'good words can reduce tension in busy places',
      },
      {
        title: 'Mendengar Sebelum Menjawab',
        scenario: 'a man sitting with his parents after isha',
        action: 'listen fully before giving an opinion',
        lesson: 'careful listening is part of respect',
      },
      {
        title: 'Berani Meminta Maaf',
        scenario: 'a woman sending the wrong file to her team',
        action: 'admit the mistake quickly and apologize clearly',
        lesson: 'a sincere apology keeps relationships clean',
      },
      {
        title: 'Meninggalkan Tempat dalam Keadaan Bersih',
        scenario: 'someone finishing a reading session in a mosque corner',
        action: 'return the books and leave the area neat',
        lesson: 'clean spaces show care for the people who come after us',
      },
    ],
  },
  akhlak: {
    intro: 'Strong character appears in ordinary choices, not only in big moments.',
    topics: [
      {
        title: 'Kejujuran dalam Hal Kecil',
        scenario: 'a man accidentally breaking a glass while helping in the kitchen',
        action: 'tell the truth even before anyone asks',
        lesson: 'honesty is stronger than fear',
      },
      {
        title: 'Sabar Saat Keadaan Tidak Nyaman',
        scenario: 'a commuter being delayed on a rainy morning',
        action: 'stay calm and avoid harsh words',
        lesson: 'patience protects the heart when plans change',
      },
      {
        title: 'Ringan Tangan untuk Membantu',
        scenario: 'a woman noticing her colleague carrying many files',
        action: 'offer help before being asked',
        lesson: 'small help can ease another person’s burden',
      },
      {
        title: 'Mendahulukan Tanggung Jawab',
        scenario: 'a young man wanting to rest after work',
        action: 'finish his duty first before relaxing',
        lesson: 'discipline brings peace later',
      },
      {
        title: 'Membuat Orang Baru Merasa Diterima',
        scenario: 'a new employee joining the office team',
        action: 'welcome him with warm and simple words',
        lesson: 'good character makes people feel safe quickly',
      },
      {
        title: 'Mengembalikan yang Bukan Hak Kita',
        scenario: 'a cashier giving extra change after a purchase',
        action: 'return the money at once',
        lesson: 'integrity is seen in daily transactions',
      },
      {
        title: 'Bersikap Adil dalam Kebersamaan',
        scenario: 'friends dividing tasks for a community event',
        action: 'take a fair share and avoid giving the hard work to others',
        lesson: 'fairness protects brotherhood',
      },
      {
        title: 'Bekerja Sama Tanpa Mengeluh',
        scenario: 'neighbors cleaning a shared space on the weekend',
        action: 'work steadily without complaining',
        lesson: 'service feels lighter when the heart is sincere',
      },
      {
        title: 'Menahan Marah Saat Tersinggung',
        scenario: 'a person hearing an unfair comment in a meeting',
        action: 'pause, breathe, and answer with control',
        lesson: 'self-control keeps dignity in difficult moments',
      },
      {
        title: 'Mengutamakan Orang Lain',
        scenario: 'a crowded bus stopping near the station',
        action: 'offer the better seat to an older passenger',
        lesson: 'humility often appears through simple courtesy',
      },
      {
        title: 'Disiplin Tanpa Harus Diingatkan',
        scenario: 'a woman planning her study time after dinner',
        action: 'follow her schedule without waiting for a reminder',
        lesson: 'discipline grows when a person leads the self well',
      },
      {
        title: 'Berkata Jujur di Tengah Kelompok',
        scenario: 'a team reviewing a project mistake together',
        action: 'admit her own part clearly',
        lesson: 'truth builds stronger trust than excuses',
      },
    ],
  },
  righteous: {
    intro: 'Righteous habits often begin with quiet acts that bring benefit to others.',
    topics: [
      {
        title: 'Kebaikan yang Dimulai dari Hal Sederhana',
        scenario: 'a man bringing dates to a small study circle',
        action: 'share them before eating any for himself',
        lesson: 'simple generosity softens the heart',
      },
      {
        title: 'Menolong Tanpa Ingin Diperhatikan',
        scenario: 'a woman remaining in the prayer area after others leave',
        action: 'fold prayer garments and arrange the room quietly',
        lesson: 'hidden good deeds still carry great value',
      },
      {
        title: 'Menjaga yang Tua dengan Hormat',
        scenario: 'a young man meeting an elderly neighbor on the road',
        action: 'walk more slowly and accompany him home',
        lesson: 'mercy becomes visible through patient care',
      },
      {
        title: 'Menjenguk dengan Hati yang Lembut',
        scenario: 'friends hearing that a colleague is sick',
        action: 'visit with brief words, fruit, and sincere dua',
        lesson: 'care is stronger when it is gentle and sincere',
      },
      {
        title: 'Sedekah dari Apa yang Kita Bisa',
        scenario: 'a woman keeping a small jar near her desk',
        action: 'place a little money in it every week for charity',
        lesson: 'steady giving is more important than showing off',
      },
      {
        title: 'Mencintai Kebersihan sebagai Kebiasaan',
        scenario: 'a student finishing a study session in the library',
        action: 'leave the table neat for the next person',
        lesson: 'clean habits are a quiet service to others',
      },
      {
        title: 'Melayani Tamu dengan Tulus',
        scenario: 'guests arriving after asr at a family home',
        action: 'serve water and dates with a peaceful face',
        lesson: 'hospitality becomes beautiful when it is sincere',
      },
      {
        title: 'Peka terhadap Kebutuhan Orang Lain',
        scenario: 'a woman noticing a quiet colleague during lunch',
        action: 'invite her gently to join the table',
        lesson: 'righteous people pay attention to those who are overlooked',
      },
      {
        title: 'Membimbing dengan Sabar',
        scenario: 'an older brother helping a younger sibling read',
        action: 'correct mistakes kindly and without mockery',
        lesson: 'patient guidance can raise another person with dignity',
      },
      {
        title: 'Waktu yang Baik untuk Keluarga',
        scenario: 'a family visiting their grandmother on a free morning',
        action: 'sit, listen, and give her full attention',
        lesson: 'family care is part of righteous living',
      },
      {
        title: 'Jujur dalam Urusan Jual Beli',
        scenario: 'a young seller serving customers at a small stall',
        action: 'measure the goods fairly and speak honestly',
        lesson: 'barakah enters trade through honesty',
      },
      {
        title: 'Membersihkan Jalan Menuju Masjid',
        scenario: 'two friends seeing litter near the mosque path',
        action: 'remove it before people come for prayer',
        lesson: 'serving the public can also be an act of worship',
      },
    ],
  },
};

const translateThemes = {
  adab: [
    {
      title: 'Menjamu Tamu dengan Sikap yang Baik',
      sourceParagraphs: [
        'Setelah asar, tamu datang ke rumah sebuah keluarga kecil. Anak laki-laki di rumah itu berdiri, memberi salam, lalu mempersilakan tamu duduk dengan sopan. Ia tidak berbicara dengan suara keras, dan ia membantu membawa air minum tanpa menunggu disuruh.',
        'Ayahnya merasa senang karena adab yang baik terlihat dalam hal yang sederhana. Tamu pun merasa nyaman karena disambut dengan tenang, rapi, dan penuh hormat. Dari kebiasaan seperti ini, rumah menjadi tempat yang lebih hangat bagi siapa pun yang datang.',
      ],
      answerKeyParagraphs: [
        'After asr, a guest comes to the home of a small family. The boy in the house stands up, gives salam, and politely invites the guest to sit down. He does not speak in a loud voice, and he helps bring drinking water without waiting to be told.',
        'His father feels happy because good manners appear in a simple moment. The guest also feels comfortable because he is welcomed in a calm, neat, and respectful way. Through habits like this, a home becomes a warmer place for anyone who comes.',
      ],
    },
    {
      title: 'Mengetuk Pintu Sebelum Masuk',
      sourceParagraphs: [
        'Seorang pria pulang dari masjid dan ingin singgah ke rumah kakaknya. Walaupun ia sangat dekat dengan keluarganya, ia tetap mengetuk pintu dan menunggu jawaban. Ia tidak langsung masuk karena ia tahu setiap rumah memiliki hak untuk dijaga privasinya.',
        'Kakaknya membuka pintu dengan wajah tenang dan mempersilakannya masuk. Kebiasaan sederhana seperti ini membuat hubungan keluarga terasa lebih hormat. Adab yang benar bukan hanya untuk orang asing, tetapi juga untuk orang yang paling dekat dengan kita.',
      ],
      answerKeyParagraphs: [
        'A man returns from the mosque and wants to stop by his brother’s house. Even though he is very close to his family, he still knocks on the door and waits for an answer. He does not enter at once because he knows that every home has a right to privacy.',
        'His brother opens the door with a calm face and invites him inside. A simple habit like this makes family relationships feel more respectful. Proper manners are not only for strangers, but also for the people who are closest to us.',
      ],
    },
    {
      title: 'Menjaga Nada Bicara Saat Lelah',
      sourceParagraphs: [
        'Seorang wanita pulang kerja dalam keadaan letih. Di rumah, ibunya meminta bantuan kecil di dapur. Ia sebenarnya ingin langsung beristirahat, tetapi ia menjawab dengan suara lembut dan membantu lebih dulu sebelum duduk.',
        'Sikap seperti ini membuat rumah tetap tenang walaupun semua orang lelah. Kadang adab terlihat bukan saat keadaan mudah, tetapi saat tubuh capek dan hati ingin cepat selesai. Orang yang menjaga lisannya pada saat seperti itu sedang melatih dirinya dengan baik.',
      ],
      answerKeyParagraphs: [
        'A woman comes home from work in a tired condition. At home, her mother asks for a small help in the kitchen. She actually wants to rest at once, but she answers with a gentle voice and helps first before sitting down.',
        'A response like this keeps the home calm even when everyone is tired. Sometimes manners appear not when life is easy, but when the body is tired and the heart wants to finish quickly. A person who controls the tongue in that moment is training the self well.',
      ],
    },
    {
      title: 'Menghormati Orang Tua Setelah Pulang Kerja',
      sourceParagraphs: [
        'Seorang anak muda tinggal bersama kedua orang tuanya. Setelah pulang kerja, ia tidak langsung masuk kamar sambil memegang ponsel. Ia menghampiri ayah dan ibunya lebih dulu, memberi salam, lalu bertanya apakah ada yang perlu dibantu.',
        'Ia mungkin lelah, tetapi ia tahu bahwa perhatian kecil memiliki nilai besar di rumah. Sikap seperti ini membuat orang tua merasa dihargai. Hormat kepada orang tua tidak selalu berupa hadiah besar, kadang cukup hadir dengan wajah yang baik dan kata-kata yang lembut.',
      ],
      answerKeyParagraphs: [
        'A young man lives with both of his parents. After coming home from work, he does not go straight to his room while holding his phone. He first comes to his father and mother, gives salam, and asks whether there is anything he can help with.',
        'He may be tired, but he knows that small attention has great value at home. A response like this makes parents feel respected. Honor toward parents is not always shown through big gifts; sometimes it is enough to come with a good face and gentle words.',
      ],
    },
    {
      title: 'Mengucapkan Terima Kasih dalam Hal Sederhana',
      sourceParagraphs: [
        'Di kantor, seorang rekan kerja membantu mencetak dokumen ketika mesin sedang sibuk dipakai. Bantuan itu terlihat kecil, tetapi sangat memudahkan pekerjaan hari itu. Orang yang menerima bantuan tersebut tidak diam saja; ia mengucapkan terima kasih dengan jelas dan tulus.',
        'Ucapan yang baik membuat suasana kerja menjadi lebih ringan. Banyak hubungan menjadi kaku karena orang merasa kebaikannya tidak dihargai. Karena itu, membiasakan terima kasih dalam urusan kecil termasuk adab yang membuat lingkungan terasa lebih sehat.',
      ],
      answerKeyParagraphs: [
        'At the office, a coworker helps print a document when the machine is busy. The help looks small, but it makes the work much easier that day. The person who receives the help does not stay silent; he says thank you clearly and sincerely.',
        'Good words make the workplace feel lighter. Many relationships become stiff because people feel that their kindness is not appreciated. Because of that, making a habit of saying thank you in small matters is part of manners that make an environment healthier.',
      ],
    },
    {
      title: 'Sabar Saat Menunggu Giliran',
      sourceParagraphs: [
        'Beberapa orang berdiri di antrean klinik pada pagi hari. Semua ingin urusannya cepat selesai, tetapi tidak semua keadaan bisa berjalan sesuai keinginan. Seorang Muslim yang baik menunggu dengan tertib, tidak memotong antrean, dan tidak menunjukkan wajah marah kepada petugas.',
        'Sikap seperti ini terlihat sederhana, tetapi sangat penting di tempat umum. Kesabaran menjaga orang dari kata-kata kasar dan tindakan yang merugikan orang lain. Dari antrean pun seseorang bisa belajar bahwa adab yang baik harus tetap hidup dalam situasi yang lambat dan tidak nyaman.',
      ],
      answerKeyParagraphs: [
        'Several people stand in a clinic line in the morning. Everyone wants the process to finish quickly, but not every situation can move according to desire. A good Muslim waits in an orderly way, does not cut the line, and does not show an angry face to the staff.',
        'A response like this looks simple, but it is very important in public places. Patience protects a person from harsh words and actions that harm others. Even from a line, a person can learn that good manners must remain alive in slow and uncomfortable situations.',
      ],
    },
    {
      title: 'Mengembalikan Barang yang Dipinjam',
      sourceParagraphs: [
        'Seseorang meminjam buku dari temannya untuk beberapa hari. Setelah selesai membaca, ia tidak menunda untuk mengembalikannya. Ia membersihkan sampulnya, memastikan tidak ada halaman yang rusak, lalu menyerahkannya kembali dengan ucapan terima kasih.',
        'Tindakan seperti ini menunjukkan tanggung jawab yang baik. Barang pinjaman bukan milik kita, sehingga harus dijaga dengan amanah. Dari hal kecil seperti mengembalikan buku tepat waktu, seseorang sedang membangun kepercayaan dalam pertemanan.',
      ],
      answerKeyParagraphs: [
        'A person borrows a book from a friend for a few days. After finishing it, he does not delay returning it. He cleans the cover, makes sure that no page is damaged, and gives it back with words of thanks.',
        'An act like this shows good responsibility. A borrowed item is not our property, so it must be cared for as a trust. Through a small action like returning a book on time, a person is building trust in friendship.',
      ],
    },
    {
      title: 'Menjaga Adab di Masjid',
      sourceParagraphs: [
        'Seorang pemuda datang lebih awal ke masjid sebelum maghrib. Ia melihat ada beberapa orang sedang membaca Al-Quran. Karena itu, ia mematikan suara ponselnya, duduk dengan tenang, dan tidak mengobrol keras dengan temannya.',
        'Masjid adalah tempat ibadah, bukan tempat untuk membuat suasana gaduh. Saat seseorang menjaga langkah, suara, dan sikapnya di sana, ia sedang menghormati rumah Allah. Adab seperti ini membuat orang lain lebih mudah khusyuk dan merasa nyaman dalam ibadah.',
      ],
      answerKeyParagraphs: [
        'A young man comes early to the mosque before maghrib. He sees that some people are reading the Quran. Because of that, he turns off the sound on his phone, sits quietly, and does not talk loudly with his friend.',
        'A mosque is a place of worship, not a place to create noise. When a person controls the step, voice, and behavior there, he is honoring the house of Allah. Manners like this help other people stay focused and feel comfortable in worship.',
      ],
    },
    {
      title: 'Bertanya dengan Sopan',
      sourceParagraphs: [
        'Dalam kelas malam, seorang peserta belum memahami penjelasan ustaz. Ia tidak memotong pembicaraan di tengah-tengah. Ia menunggu sampai ada jeda, lalu bertanya dengan singkat, jelas, dan nada yang baik.',
        'Cara bertanya seperti ini menunjukkan adab sekaligus kesungguhan mencari ilmu. Ilmu lebih mudah diterima ketika seseorang datang dengan rendah hati. Bertanya dengan sopan juga membuat majelis terasa tertib dan nyaman bagi semua peserta.',
      ],
      answerKeyParagraphs: [
        'In an evening class, one participant does not yet understand the teacher’s explanation. He does not cut into the talk in the middle. He waits until there is a pause, then asks in a short, clear, and respectful tone.',
        'A way of asking like this shows manners as well as seriousness in seeking knowledge. Knowledge is easier to receive when a person comes with humility. Asking politely also keeps the gathering orderly and comfortable for all participants.',
      ],
    },
    {
      title: 'Mempersilakan Tamu Duduk dengan Baik',
      sourceParagraphs: [
        'Ketika tamu datang, seorang wanita tidak membiarkannya berdiri lama di dekat pintu. Ia segera menunjukkan tempat duduk yang rapi dan menawarkan air minum. Sikap ini sederhana, tetapi membuat tamu merasa diterima tanpa canggung.',
        'Adab menerima tamu adalah bagian penting dari kehidupan Muslim. Tamu tidak hanya butuh tempat duduk, tetapi juga butuh ketenangan dan rasa dihormati. Karena itu, perhatian kecil saat menerima tamu memiliki pengaruh besar pada suasana rumah.',
      ],
      answerKeyParagraphs: [
        'When a guest arrives, a woman does not leave him standing near the door for long. She quickly shows a neat seat and offers drinking water. This response is simple, but it makes the guest feel welcomed without awkwardness.',
        'The manners of receiving a guest are an important part of Muslim life. A guest does not only need a seat, but also calm and a feeling of respect. Because of that, small attention while receiving a guest has a strong effect on the atmosphere of a home.',
      ],
    },
    {
      title: 'Mengakui Kesalahan dengan Jelas',
      sourceParagraphs: [
        'Seorang pegawai mengirim file yang salah ke grup kerja. Ia bisa saja diam dan berharap orang lain tidak memperhatikan, tetapi ia memilih mengakui kesalahannya. Ia meminta maaf, lalu segera mengirim file yang benar tanpa mencari alasan panjang.',
        'Keberanian seperti ini menjaga kepercayaan di tempat kerja. Orang lain lebih mudah menghormati seseorang yang jujur tentang kesalahannya. Mengakui kesalahan bukan tanda lemah, tetapi tanda bahwa hati masih sehat dan siap memperbaiki diri.',
      ],
      answerKeyParagraphs: [
        'An employee sends the wrong file to the work group. She could stay silent and hope that nobody notices, but she chooses to admit the mistake. She apologizes and quickly sends the correct file without looking for long excuses.',
        'Courage like this protects trust in the workplace. Other people can respect someone more easily when the person is honest about a mistake. Admitting a mistake is not a sign of weakness, but a sign that the heart is healthy and ready to improve.',
      ],
    },
    {
      title: 'Menyebarkan Senyum dalam Interaksi Harian',
      sourceParagraphs: [
        'Dalam perjalanan pagi, seorang pria bertemu satpam, tetangga, dan penjual sarapan. Ia tidak banyak bicara, tetapi ia membiasakan wajah yang ramah dan ucapan yang baik. Sikap ringan seperti ini membuat pertemuan singkat terasa lebih menyenangkan.',
        'Senyum bukan sekadar kebiasaan sosial, tetapi juga bentuk kebaikan yang mudah dilakukan. Banyak orang sedang lelah dengan urusan hidupnya masing-masing. Karena itu, wajah yang tenang dan ramah bisa menjadi sebab hati orang lain merasa lebih ringan.',
      ],
      answerKeyParagraphs: [
        'On his morning trip, a man meets a security guard, a neighbor, and a breakfast seller. He does not speak much, but he keeps a friendly face and good words. A light response like this makes short meetings feel more pleasant.',
        'A smile is not only a social habit, but also a form of kindness that is easy to do. Many people are tired because of their own life matters. Because of that, a calm and friendly face can become a reason for another heart to feel lighter.',
      ],
    },
  ],
  akhlak: [
    {
      title: 'Kejujuran Saat Merugikan Diri Sendiri',
      sourceParagraphs: [
        'Seorang pria tanpa sengaja memecahkan gelas saat membantu di rumah. Tidak ada orang lain yang melihat kejadian itu. Ia tetap memilih mengatakan yang sebenarnya kepada ibunya, meskipun ia tahu hal itu bisa membuatnya malu.',
        'Kejujuran sering diuji saat seseorang punya kesempatan untuk bersembunyi. Namun hati yang baik lebih tenang ketika memilih benar daripada aman untuk sesaat. Dari kejadian kecil seperti ini, seseorang sedang melatih dirinya agar kuat dalam amanah yang lebih besar.',
      ],
      answerKeyParagraphs: [
        'A man accidentally breaks a glass while helping at home. No one else sees what happens. He still chooses to tell the truth to his mother, even though he knows that it may make him feel embarrassed.',
        'Honesty is often tested when a person has a chance to hide. But a good heart feels calmer when it chooses what is right instead of what feels safe for a short time. Through a small event like this, a person is training the self to be strong in bigger trusts.',
      ],
    },
    {
      title: 'Sabar Saat Rencana Tidak Berjalan Baik',
      sourceParagraphs: [
        'Seorang pekerja berangkat pagi, tetapi hujan deras membuat jalan sangat lambat. Ia mulai terlambat dan tubuhnya tidak nyaman. Meski begitu, ia menahan diri dari marah dan memilih tetap tenang sepanjang perjalanan.',
        'Kesabaran seperti ini tidak mengubah cuaca, tetapi menjaga hati agar tidak rusak. Banyak orang berbicara kasar saat rencana mereka terganggu. Orang yang sabar belajar menerima keadaan sambil tetap berusaha melakukan yang terbaik.',
      ],
      answerKeyParagraphs: [
        'A worker leaves early, but heavy rain makes the road very slow. He starts to be late and his body feels uncomfortable. Even so, he controls himself from anger and chooses to stay calm during the trip.',
        'Patience like this does not change the weather, but it protects the heart from damage. Many people speak harshly when their plans are disturbed. A patient person learns to accept the situation while still trying to do the best possible thing.',
      ],
    },
    {
      title: 'Membantu Sebelum Diminta',
      sourceParagraphs: [
        'Di kantor, seorang wanita melihat temannya membawa tumpukan dokumen dan botol minum sekaligus. Ia bisa saja tetap duduk dan fokus pada pekerjaannya sendiri. Namun ia berdiri, mengambil sebagian barang itu, dan membantunya sampai ke meja.',
        'Bantuan seperti ini mungkin hanya memakan waktu satu menit. Tetapi orang yang ditolong akan merasakan bahwa ia tidak sendirian. Akhlak yang baik sering terlihat dari kesediaan membantu sebelum ada permintaan langsung.',
      ],
      answerKeyParagraphs: [
        'At the office, a woman sees her friend carrying a stack of documents and a water bottle at the same time. She could stay seated and focus on her own work. Instead, she stands up, takes part of the items, and helps her friend reach the desk.',
        'A help like this may only take one minute. But the person who receives it will feel that she is not alone. Good character is often seen in the willingness to help before a direct request is made.',
      ],
    },
    {
      title: 'Menyelesaikan Tugas Sebelum Istirahat',
      sourceParagraphs: [
        'Seorang pemuda pulang dalam keadaan lelah dan ingin segera rebahan. Namun ia masih punya tanggung jawab kecil yang harus selesai malam itu. Ia memilih menuntaskannya lebih dulu agar hatinya tenang setelah itu.',
        'Disiplin seperti ini tidak selalu terlihat oleh orang lain, tetapi sangat penting untuk membangun diri. Banyak masalah menjadi besar karena seseorang terbiasa menunda hal yang sebenarnya mampu ia kerjakan. Akhlak yang kuat sering dimulai dari kemampuan menahan diri.',
      ],
      answerKeyParagraphs: [
        'A young man returns home in a tired condition and wants to lie down at once. But he still has a small duty that must be finished that night. He chooses to complete it first so that his heart can feel calm after that.',
        'Discipline like this is not always seen by other people, but it is very important for building the self. Many problems grow bigger because a person becomes used to delaying things that could actually be done. Strong character often begins with self-control.',
      ],
    },
    {
      title: 'Menyambut Orang Baru dengan Wajar dan Hangat',
      sourceParagraphs: [
        'Seorang pegawai baru masuk ke sebuah tim kecil. Suasananya masih canggung karena ia belum mengenal siapa pun. Salah satu rekan menyambutnya dengan kata-kata sederhana, menunjukkan tempat yang perlu ia tahu, dan membuatnya merasa lebih tenang.',
        'Sikap seperti ini terlihat biasa, tetapi pengaruhnya besar. Banyak orang merasa berat di tempat baru bukan karena pekerjaan, tetapi karena suasana yang dingin. Akhlak yang baik membuat orang lain merasa diterima tanpa harus banyak bicara.',
      ],
      answerKeyParagraphs: [
        'A new employee joins a small team. The atmosphere still feels awkward because he does not know anyone yet. One coworker welcomes him with simple words, shows the places that he needs to know, and helps him feel calmer.',
        'A response like this looks ordinary, but its effect is strong. Many people struggle in a new place not because of the work, but because of a cold atmosphere. Good character helps other people feel accepted without many words.',
      ],
    },
    {
      title: 'Mengembalikan Uang yang Bukan Milik Kita',
      sourceParagraphs: [
        'Setelah membeli kebutuhan kecil, seorang pelanggan menyadari bahwa kasir memberinya uang kembalian terlalu banyak. Ia bisa saja diam dan menganggap itu keuntungan kecil. Namun ia segera kembali dan menyerahkan uang itu dengan jujur.',
        'Perbuatan seperti ini menjaga hati dari kebiasaan mengambil yang bukan haknya. Kejujuran tidak hanya penting dalam urusan besar. Justru dalam transaksi kecil itulah seseorang sering menunjukkan kualitas akhlaknya yang sebenarnya.',
      ],
      answerKeyParagraphs: [
        'After buying a small need, a customer realizes that the cashier gives too much change. He could stay silent and see it as a small gain. Instead, he quickly returns and hands the money back honestly.',
        'An act like this protects the heart from the habit of taking what is not its right. Honesty is not only important in large matters. In fact, it is often in small transactions that a person shows the true quality of character.',
      ],
    },
    {
      title: 'Bersikap Adil Saat Bekerja Bersama',
      sourceParagraphs: [
        'Beberapa teman menyiapkan acara kecil di lingkungan mereka. Ada tugas yang ringan dan ada tugas yang berat. Salah satu dari mereka tidak memilih bagian yang paling mudah, tetapi mengambil tugas yang adil agar beban kerja tidak jatuh pada satu orang saja.',
        'Sikap adil seperti ini menjaga hati dari sifat egois. Banyak kerja sama rusak bukan karena kurang kemampuan, tetapi karena orang ingin nyaman sendiri. Akhlak yang baik membantu seseorang melihat hak orang lain dengan jernih.',
      ],
      answerKeyParagraphs: [
        'Several friends prepare a small event in their neighborhood. Some tasks are light and some are hard. One of them does not choose the easiest part, but takes a fair task so that the work does not fall on only one person.',
        'Fairness like this protects the heart from selfishness. Many forms of teamwork break down not because of lack of ability, but because people want comfort only for themselves. Good character helps a person see the rights of others clearly.',
      ],
    },
    {
      title: 'Bekerja Tanpa Banyak Keluhan',
      sourceParagraphs: [
        'Pada akhir pekan, beberapa tetangga membersihkan area bersama yang mulai kotor. Pekerjaan itu tidak sulit, tetapi cukup melelahkan. Salah satu dari mereka tetap bekerja dengan tenang tanpa mengeluh sepanjang waktu.',
        'Sikap seperti ini membuat suasana lebih ringan untuk semua orang. Keluhan yang berlebihan sering menyebarkan rasa malas ke orang lain. Orang yang baik tidak selalu bicara banyak; kadang ia hanya terus bekerja dengan niat yang bersih.',
      ],
      answerKeyParagraphs: [
        'On the weekend, several neighbors clean a shared area that has become dirty. The work is not hard, but it is tiring enough. One of them keeps working calmly without complaining all the time.',
        'A response like this makes the atmosphere lighter for everyone. Too much complaining often spreads laziness to other people. A good person does not always speak a lot; sometimes the person simply keeps working with a clean intention.',
      ],
    },
    {
      title: 'Menahan Marah Saat Dikritik',
      sourceParagraphs: [
        'Dalam rapat kecil, seorang pegawai menerima komentar yang tidak enak didengar. Ia merasa tersinggung, tetapi ia tidak langsung membalas dengan suara tinggi. Ia memilih diam sejenak, menarik napas, lalu menjawab dengan lebih teratur.',
        'Menahan marah seperti ini menjaga kehormatan diri. Tidak semua kritik disampaikan dengan cara terbaik, tetapi bukan berarti semua harus dibalas dengan emosi. Akhlak yang matang membantu seseorang tetap kokoh saat suasana sedang panas.',
      ],
      answerKeyParagraphs: [
        'In a small meeting, an employee receives a comment that is unpleasant to hear. He feels offended, but he does not answer at once with a loud voice. He chooses to stay silent for a moment, take a breath, and then respond in a more controlled way.',
        'Controlling anger like this protects personal dignity. Not every criticism is delivered in the best way, but that does not mean that everything must be answered with emotion. Mature character helps a person stay firm when the atmosphere becomes hot.',
      ],
    },
    {
      title: 'Mengutamakan yang Lebih Membutuhkan',
      sourceParagraphs: [
        'Saat bus penuh, seorang pria yang masih kuat berdiri melihat penumpang yang lebih tua masuk. Ia langsung mempersilakan kursinya tanpa menunggu diminta. Baginya, kenyamanan orang yang lebih membutuhkan lebih penting daripada duduk beberapa menit lagi.',
        'Akhlak seperti ini tumbuh dari hati yang tidak terlalu sibuk dengan dirinya sendiri. Mengalah dalam hal kecil kadang menjadi bentuk kemuliaan. Dari tindakan sederhana itu, suasana di tempat umum pun bisa menjadi lebih manusiawi.',
      ],
      answerKeyParagraphs: [
        'When a bus is full, a man who is still strong enough to stand sees an older passenger enter. He immediately offers his seat without waiting to be asked. For him, the comfort of the person who needs it more is more important than sitting for a few more minutes.',
        'Character like this grows from a heart that is not too busy with itself. Giving way in a small matter can become a form of nobility. Through a simple act like that, the atmosphere in a public place can also become more humane.',
      ],
    },
    {
      title: 'Menjaga Disiplin tanpa Pengawasan',
      sourceParagraphs: [
        'Seorang wanita punya target membaca dan belajar setiap malam setelah makan. Tidak ada yang memeriksa apakah ia melakukannya atau tidak. Namun ia tetap memegang jadwalnya karena ia tahu perkembangan diri tidak akan datang dari niat saja.',
        'Disiplin tanpa pengawasan adalah tanda bahwa seseorang mulai jujur kepada dirinya sendiri. Banyak orang rajin ketika dilihat, lalu longgar ketika sendirian. Akhlak yang baik membantu seseorang tetap lurus, baik saat diperhatikan maupun tidak.',
      ],
      answerKeyParagraphs: [
        'A woman has a target to read and study every night after eating. No one checks whether she does it or not. Even so, she keeps her schedule because she knows that personal growth will not come from intention alone.',
        'Discipline without supervision is a sign that a person is beginning to be honest with the self. Many people are diligent when they are seen, then become loose when they are alone. Good character helps a person remain upright whether watched or not.',
      ],
    },
    {
      title: 'Berani Jujur di Tengah Tim',
      sourceParagraphs: [
        'Sebuah tim membahas kesalahan pada hasil kerja mereka. Salah satu anggota tahu bahwa ada bagian yang berasal dari kelalaiannya. Ia bisa saja diam agar terlihat aman, tetapi ia memilih mengaku dan ikut memperbaiki masalah itu.',
        'Kejujuran seperti ini mungkin terasa berat pada awalnya, tetapi sangat penting untuk menjaga kepercayaan. Orang yang baik tidak hanya ingin tampak bersih di depan orang lain. Ia juga ingin benar-benar bersih dalam sikapnya di hadapan Allah.',
      ],
      answerKeyParagraphs: [
        'A team discusses a mistake in their work result. One member knows that part of the problem comes from his own negligence. He could stay silent so that he looks safe, but he chooses to admit it and help repair the problem.',
        'Honesty like this may feel hard at first, but it is very important for protecting trust. A good person does not only want to look clean before other people. He also wants to be truly clean in attitude before Allah.',
      ],
    },
  ],
  righteous: [
    {
      title: 'Kebaikan yang Tidak Perlu Ramai',
      sourceParagraphs: [
        'Di sebuah majelis kecil, seorang pria membawa kurma untuk dibagikan kepada teman-temannya. Ia tidak menjadikannya bahan cerita panjang, dan ia tidak ingin dipuji. Ia hanya ingin orang lain ikut merasakan manfaat dari apa yang ia bawa.',
        'Kebaikan seperti ini terlihat ringan, tetapi sangat menenangkan hati. Banyak amal saleh justru lebih indah ketika dilakukan tanpa mencari perhatian. Orang yang ikhlas lebih sibuk melihat manfaat bagi orang lain daripada memikirkan penilaian manusia.',
      ],
      answerKeyParagraphs: [
        'At a small study gathering, a man brings dates to share with his friends. He does not turn it into a long story, and he does not want praise. He only wants other people to receive benefit from what he has brought.',
        'A kindness like this looks light, but it brings calm to the heart. Many righteous deeds are more beautiful when they are done without seeking attention. A sincere person is more concerned with benefit for others than with human praise.',
      ],
    },
    {
      title: 'Menata Ruang Ibadah dengan Diam-Diam',
      sourceParagraphs: [
        'Setelah orang-orang pulang dari tempat salat, seorang wanita masih tinggal sebentar. Ia melipat perlengkapan yang masih berantakan dan merapikan sudut ruangan tanpa menarik perhatian siapa pun. Pekerjaan itu kecil, tetapi membuat orang berikutnya merasa nyaman.',
        'Amal seperti ini sering tidak terlihat, tetapi nilainya tidak kecil. Allah mengetahui pekerjaan yang dilakukan dengan hati yang bersih, meskipun tidak banyak orang sadar. Kebaikan tersembunyi justru sering lebih aman dari riya dan lebih kuat membentuk jiwa.',
      ],
      answerKeyParagraphs: [
        'After people leave the prayer place, a woman stays for a short time. She folds the items that are still messy and arranges the corner of the room without drawing anyone’s attention. The work is small, but it helps the next person feel comfortable.',
        'A deed like this is often unseen, but its value is not small. Allah knows the work that is done with a clean heart, even if many people do not notice it. Hidden goodness is often safer from showing off and stronger in shaping the soul.',
      ],
    },
    {
      title: 'Menemani Orang Tua dengan Sabar',
      sourceParagraphs: [
        'Di jalan menuju rumah, seorang pemuda bertemu tetangganya yang sudah tua. Langkah orang tua itu pelan dan tampak lelah. Ia pun menyesuaikan langkahnya, menemani sampai dekat rumah, dan memastikan beliau tidak kesulitan di jalan.',
        'Perhatian seperti ini mungkin hanya berlangsung beberapa menit, tetapi menunjukkan kasih sayang yang nyata. Orang saleh tidak hanya sibuk dengan urusannya sendiri. Ia juga peka terhadap kelemahan orang lain dan bersedia memperlambat langkah demi membantu.',
      ],
      answerKeyParagraphs: [
        'On the road home, a young man meets an elderly neighbor. The older person walks slowly and looks tired. So he adjusts his pace, accompanies him until near the house, and makes sure that he does not have difficulty on the way.',
        'Attention like this may only last a few minutes, but it shows real mercy. A righteous person is not only busy with personal matters. He is also sensitive to the weakness of others and is willing to slow down in order to help.',
      ],
    },
    {
      title: 'Menjenguk dengan Kehadiran yang Menenangkan',
      sourceParagraphs: [
        'Ketika mendengar seorang teman sakit, beberapa orang datang menjenguk dengan singkat. Mereka tidak membuat suasana ramai atau melelahkan. Mereka membawa buah, mendoakan yang baik, lalu memberi ruang agar temannya bisa kembali beristirahat.',
        'Sikap seperti ini menunjukkan bahwa perhatian tidak harus panjang untuk terasa tulus. Orang yang sedang lemah sering lebih butuh ketenangan daripada banyak percakapan. Menjenguk dengan adab yang baik membuat kasih sayang terasa ringan dan menyejukkan.',
      ],
      answerKeyParagraphs: [
        'When they hear that a friend is sick, several people visit for a short time. They do not make the atmosphere noisy or tiring. They bring fruit, make good dua, and then give space so that the friend can rest again.',
        'A response like this shows that care does not have to be long in order to feel sincere. A person who is weak often needs calm more than long conversation. Visiting with proper manners makes compassion feel light and soothing.',
      ],
    },
    {
      title: 'Sedekah yang Konsisten Meski Kecil',
      sourceParagraphs: [
        'Seorang wanita menaruh kotak kecil di dekat meja kerjanya. Setiap pekan, ia memasukkan sedikit uang ke dalamnya untuk sedekah. Jumlahnya tidak besar, tetapi ia menjaga kebiasaan itu dengan niat yang terus hidup.',
        'Kebiasaan seperti ini mengajarkan bahwa amal saleh tidak selalu harus menunggu keadaan sempurna. Banyak kebaikan lahir dari langkah kecil yang terus dijaga. Sedekah yang konsisten sering lebih baik daripada semangat besar yang cepat hilang.',
      ],
      answerKeyParagraphs: [
        'A woman places a small box near her work desk. Every week, she puts a little money into it for charity. The amount is not large, but she keeps the habit with a living intention.',
        'A habit like this teaches that righteous deeds do not always need to wait for perfect circumstances. Many good things grow from small steps that are carefully maintained. Consistent charity is often better than big enthusiasm that disappears quickly.',
      ],
    },
    {
      title: 'Merapikan Tempat untuk Orang Berikutnya',
      sourceParagraphs: [
        'Seseorang selesai belajar di perpustakaan atau ruang baca masjid. Sebelum pergi, ia merapikan kursi, menyusun kembali buku, dan memastikan meja dalam keadaan baik. Ia tahu bahwa orang berikutnya juga berhak mendapatkan tempat yang nyaman.',
        'Kebiasaan ini menunjukkan akhlak yang halus dan perhatian yang matang. Orang saleh tidak hanya memakai fasilitas dengan baik, tetapi juga meninggalkannya dalam keadaan yang baik. Dari sikap seperti ini, manfaat meluas tanpa perlu banyak kata.',
      ],
      answerKeyParagraphs: [
        'A person finishes studying in a library or a mosque reading room. Before leaving, he arranges the chair, returns the books to order, and makes sure that the table is in good condition. He knows that the next person also has the right to a comfortable place.',
        'This habit shows refined character and mature concern. A righteous person does not only use facilities well, but also leaves them in a good state. Through a response like this, benefit spreads without many words.',
      ],
    },
    {
      title: 'Melayani Tamu dengan Hati Lapang',
      sourceParagraphs: [
        'Tamu datang ke rumah setelah asar, sementara tuan rumah sedang cukup sibuk. Meski begitu, seorang anggota keluarga tetap menyambut dengan tenang, menyiapkan air, dan melayani tanpa wajah yang berat. Tamu pun merasa diterima dengan baik.',
        'Pelayanan seperti ini menunjukkan bahwa kemuliaan akhlak tidak bergantung pada suasana yang selalu mudah. Justru ketika waktu sempit, ketulusan lebih jelas terlihat. Tuan rumah yang baik membuat tamu merasa aman tanpa dibuat canggung.',
      ],
      answerKeyParagraphs: [
        'Guests arrive at a home after asr while the family is fairly busy. Even so, one family member still welcomes them calmly, prepares water, and serves without a heavy face. The guests feel that they are received well.',
        'A service like this shows that noble character does not depend on conditions always being easy. In fact, when time is tight, sincerity becomes easier to see. A good host helps guests feel safe without making them uncomfortable.',
      ],
    },
    {
      title: 'Peka terhadap yang Sering Terlewat',
      sourceParagraphs: [
        'Di waktu makan siang, seorang wanita melihat rekan barunya duduk sendiri dan tampak belum akrab dengan yang lain. Ia lalu mendekat, mengajak duduk bersama, dan membuka percakapan ringan agar suasana tidak terlalu kaku.',
        'Perhatian seperti ini kadang lebih berarti daripada bantuan yang besar. Banyak orang tidak membutuhkan banyak nasihat, mereka hanya butuh diterima dengan baik. Orang saleh biasanya cepat melihat siapa yang perlu dirangkul dengan cara yang lembut.',
      ],
      answerKeyParagraphs: [
        'At lunch time, a woman sees that a new coworker is sitting alone and still seems unfamiliar with the others. She comes closer, invites her to sit together, and opens a light conversation so that the atmosphere is not too stiff.',
        'Attention like this can be more meaningful than large help. Many people do not need much advice; they only need to be accepted well. A righteous person usually sees quickly who needs to be embraced in a gentle way.',
      ],
    },
    {
      title: 'Membimbing Tanpa Merendahkan',
      sourceParagraphs: [
        'Seorang kakak membantu adiknya membaca di rumah. Ketika adiknya salah, ia tidak mengejek atau menunjukkan wajah kesal. Ia memperbaiki dengan tenang, mengulang bila perlu, dan membuat adiknya tetap berani mencoba lagi.',
        'Bimbingan seperti ini sangat penting karena ilmu tidak tumbuh baik dalam suasana yang merendahkan. Orang yang sabar saat mengajar sedang menanamkan ilmu sekaligus akhlak. Dari cara membimbing pun seseorang bisa menunjukkan kualitas kesalehannya.',
      ],
      answerKeyParagraphs: [
        'An older sibling helps a younger one read at home. When the younger sibling makes a mistake, he does not mock or show an annoyed face. He corrects calmly, repeats when needed, and helps the younger one stay brave enough to try again.',
        'Guidance like this is very important because knowledge does not grow well in a humiliating atmosphere. A patient person who teaches is planting both knowledge and character. Even through a teaching style, a person can show the quality of righteousness.',
      ],
    },
    {
      title: 'Hadir Penuh untuk Keluarga',
      sourceParagraphs: [
        'Pada hari libur, sebuah keluarga mengunjungi nenek mereka. Mereka tidak datang hanya untuk formalitas singkat. Mereka duduk, mendengar cerita beliau, dan memberi perhatian yang utuh meskipun pembicaraan berlangsung pelan dan berulang.',
        'Sikap seperti ini menunjukkan bahwa silaturahmi bukan sekadar hadir secara fisik. Ada nilai besar dalam memberi waktu dan kesabaran kepada keluarga. Orang saleh tidak merasa rugi ketika melambat demi membahagiakan orang tuanya atau kerabatnya.',
      ],
      answerKeyParagraphs: [
        'On a free day, a family visits their grandmother. They do not come only for a short formality. They sit down, listen to her stories, and give full attention even though the talk is slow and repeated.',
        'A response like this shows that family ties are not only about physical presence. There is great value in giving time and patience to family. A righteous person does not feel a loss when slowing down in order to make parents or relatives happy.',
      ],
    },
    {
      title: 'Jujur dalam Jual Beli',
      sourceParagraphs: [
        'Seorang penjual muda melayani pembeli di warung kecil. Ia menimbang barang dengan benar dan tidak menutupi kekurangan yang ada pada dagangannya. Ia percaya bahwa rezeki yang baik tidak perlu dijaga dengan tipu daya.',
        'Kejujuran seperti ini membawa ketenangan ke dalam pekerjaan. Mungkin keuntungan terlihat lebih lambat, tetapi hati tetap bersih dan hubungan dengan pembeli lebih kuat. Orang saleh lebih memilih keberkahan yang tenang daripada hasil cepat yang meragukan.',
      ],
      answerKeyParagraphs: [
        'A young seller serves customers at a small stall. He weighs the goods correctly and does not hide the weaknesses in what he sells. He believes that good provision does not need to be protected by deceit.',
        'Honesty like this brings calm into work. Profit may look slower, but the heart stays clean and the relationship with buyers becomes stronger. A righteous person prefers peaceful blessing over quick results that are doubtful.',
      ],
    },
    {
      title: 'Membersihkan Jalan Menuju Masjid',
      sourceParagraphs: [
        'Dua sahabat berjalan menuju masjid dan melihat sampah kecil di tepi jalan. Mereka tidak menunggu orang lain melakukannya. Mereka mengambil sampah itu lalu melanjutkan langkah dengan perasaan ringan.',
        'Tindakan sederhana seperti ini menunjukkan bahwa kepedulian pada ruang bersama adalah bagian dari kesalehan. Jalan yang bersih memudahkan orang lain dan membuat lingkungan lebih baik. Kebaikan umum sering dimulai dari orang yang tidak merasa terlalu besar untuk tugas kecil.',
      ],
      answerKeyParagraphs: [
        'Two friends walk toward the mosque and see a small piece of litter at the side of the road. They do not wait for someone else to handle it. They pick it up and continue walking with a light feeling.',
        'A simple act like this shows that caring for a shared space is part of righteousness. A clean road helps other people and makes the environment better. Public good often begins with people who do not think they are too important for small tasks.',
      ],
    },
  ],
};

const countWords = (text) =>
  text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

const splitSentences = (text) => text.split(/(?<=[.?!])\s+/).filter(Boolean);

const splitIntoParagraphs = (text, paragraphCount) => {
  const sentences = splitSentences(text);
  const bucketSize = Math.ceil(sentences.length / paragraphCount);
  const paragraphs = [];
  for (let index = 0; index < sentences.length; index += bucketSize) {
    paragraphs.push(sentences.slice(index, index + bucketSize).join(' '));
  }
  return paragraphs;
};

const ensureRange = (label, text, min, max) => {
  const count = countWords(text);
  if (count < min || count > max) {
    throw new Error(`${label} has ${count} words. Expected ${min}-${max}.`);
  }
  return count;
};

const trimReadTextToRange = (text) => {
  let nextText = text;
  const removableSentences = [
    'A Muslim adult may face such moments at home, at work, on the road, or in the mosque.',
    'When the heart is awake, an ordinary situation becomes a chance to practice faith through behavior.',
    'A habit like this may look small, but it can build dignity over time.',
  ];

  for (const sentence of removableSentences) {
    if (countWords(nextText) <= 200) break;
    nextText = nextText.replace(` ${sentence}`, '');
  }

  return nextText;
};

const buildReadText = (themeIntro, topic, index) => {
  const openingVariants = [
    'The moment looks ordinary, but daily behavior still carries moral weight.',
    'At first, nothing dramatic happens, yet the situation still asks for a good response.',
    'It is a quiet moment, but quiet moments often show what kind of person we are becoming.',
    'This is the kind of moment many adults face, even if they do not think about it deeply.',
  ];
  const responseVariants = [
    'The response is not dramatic, but it changes the atmosphere in a healthy way.',
    'The choice feels simple, yet it quickly changes the tone of the situation.',
    'Nothing in the scene is loud, but one good action gives the moment a better direction.',
    'The action is small on the outside, but its effect reaches other people very quickly.',
  ];
  const socialVariants = [
    'Other people feel more respected and more ready to respond with goodness.',
    'People around the person often become calmer when they meet this kind of behavior.',
    'A steady attitude like this usually makes others feel safe and valued.',
    'Good manners often invite a better response from the people nearby.',
  ];
  const reflectionVariants = [
    'Manners and character are often tested in short daily moments.',
    'Many tests of character come in moments that look too small to matter.',
    'A person rarely builds character only in large events; it is usually built in short daily scenes.',
    'What looks ordinary can still become a meaningful test of manners and self-control.',
  ];
  const growthVariants = [
    'This discipline shapes the tongue, the attitude, and the relationship with other people.',
    'A habit like this slowly trains speech, behavior, and the way a person treats others.',
    'Over time, choices like this improve both self-control and human relationships.',
    'Repeated choices like this help form a calmer tongue and a steadier personality.',
  ];
  const regretVariants = [
    'It also protects a person from regret after harsh words or careless actions.',
    'It keeps a person away from the regret that often follows rushed speech.',
    'It helps the heart stay cleaner after a difficult or uncomfortable exchange.',
    'It reduces the chance of leaving a moment with shame, regret, or hurt feelings.',
  ];
  const peaceVariants = [
    'A peaceful life often begins with controlled speech and small acts of respect.',
    'Peace in daily life is often built through simple respect and a guarded tongue.',
    'Many calm relationships begin with words that are measured and actions that are considerate.',
    'A quieter heart and a healthier relationship often start from one controlled response.',
  ];

  const rawText = [
    `${topic.title} tells a simple story set around ${topic.scenario}.`,
    `${themeIntro}`,
    openingVariants[index % openingVariants.length],
    `So the person decides to ${topic.action}.`,
    responseVariants[index % responseVariants.length],
    socialVariants[index % socialVariants.length],
    reflectionVariants[index % reflectionVariants.length],
    `A Muslim adult may face such moments at home, at work, on the road, or in the mosque.`,
    `When the heart is awake, an ordinary situation becomes a chance to practice faith through behavior.`,
    growthVariants[index % growthVariants.length],
    regretVariants[index % regretVariants.length],
    peaceVariants[index % peaceVariants.length],
    `In the end, ${topic.lesson}.`,
    `A habit like this may look small, but it can build dignity over time.`,
  ].join(' ');

  const text = trimReadTextToRange(rawText);

  ensureRange(`${topic.title} read text`, text, 180, 200);
  return splitIntoParagraphs(text, 4);
};

const normalizeTranslateLength = (sourceParagraphs, answerKeyParagraphs) => {
  const sourceExtras = [
    'Kebiasaan seperti ini mungkin tampak ringan, tetapi pengaruhnya besar bagi suasana hati dan hubungan antarmanusia.',
    'Justru dari sikap yang kecil dan konsisten seperti inilah akhlak seseorang sering terlihat paling jelas.',
  ];
  const answerExtras = [
    'A habit like this may look light, but its effect is strong for the atmosphere of the heart and for human relationships.',
    'In fact, it is through small and consistent actions like this that a person’s character is often seen most clearly.',
  ];

  const nextSource = [...sourceParagraphs];
  const nextAnswer = [...answerKeyParagraphs];
  let extraIndex = 0;

  while (countWords(nextSource.join(' ')) < 90) {
    const sourceExtra = sourceExtras[Math.min(extraIndex, sourceExtras.length - 1)];
    const answerExtra = answerExtras[Math.min(extraIndex, answerExtras.length - 1)];
    nextSource[nextSource.length - 1] = `${nextSource[nextSource.length - 1]} ${sourceExtra}`;
    nextAnswer[nextAnswer.length - 1] = `${nextAnswer[nextAnswer.length - 1]} ${answerExtra}`;
    extraIndex += 1;
  }

  return { sourceParagraphs: nextSource, answerKeyParagraphs: nextAnswer };
};

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const writeJson = async (filePath, data) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

const toReadItem = (themeId, themeConfig, topic, index) => {
  const paragraphs = buildReadText(themeConfig.intro, topic, index);
  const body = paragraphs.join(' ');
  return {
    id: `reading-a1-${themeId}-read-${String(index + 1).padStart(2, '0')}`,
    mode: 'read',
    level: 'A1',
    themeId,
    title: topic.title,
    paragraphs,
    wordCount: countWords(body),
    tags: [themeId, 'a1', 'islamic', 'adult', 'batch-01'],
  };
};

const toTranslateItem = (themeId, topic, index) => {
  const normalized = normalizeTranslateLength(topic.sourceParagraphs, topic.answerKeyParagraphs);
  const sourceText = normalized.sourceParagraphs.join(' ');
  const answerKey = normalized.answerKeyParagraphs.join(' ');
  ensureRange(`${topic.title} translate source`, sourceText, 90, 120);

  return {
    id: `reading-a1-${themeId}-translate-${String(index + 1).padStart(2, '0')}`,
    mode: 'translate',
    level: 'A1',
    themeId,
    title: topic.title,
    paragraphs: normalized.sourceParagraphs,
    answerKey,
    wordCount: countWords(sourceText),
    sourceWordCount: countWords(sourceText),
    targetWordCount: countWords(answerKey),
    tags: [themeId, 'a1', 'islamic', 'adult', 'batch-01'],
  };
};

const buildBatch = () => {
  const output = { read: {}, translate: {} };

  for (const [themeId, themeConfig] of Object.entries(readThemes)) {
    output.read[themeId] = themeConfig.topics.map((topic, index) =>
      toReadItem(themeId, themeConfig, topic, index),
    );
  }

  for (const [themeId, topics] of Object.entries(translateThemes)) {
    output.translate[themeId] = topics.map((topic, index) =>
      toTranslateItem(themeId, topic, index),
    );
  }

  return output;
};

const main = async () => {
  const batch = buildBatch();

  for (const [themeId, items] of Object.entries(batch.read)) {
    await writeJson(
      path.join(rootDir, 'content-source', 'reading', 'read', 'A1', `${themeId}.batch-01.json`),
      { level: 'A1', themeId, mode: 'read', batch: 'batch-01', items },
    );
  }

  for (const [themeId, items] of Object.entries(batch.translate)) {
    await writeJson(
      path.join(rootDir, 'content-source', 'reading', 'translate', 'A1', `${themeId}.batch-01.json`),
      { level: 'A1', themeId, mode: 'translate', batch: 'batch-01', items },
    );
  }

  console.log('Reading batch 1 source files created.');
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
