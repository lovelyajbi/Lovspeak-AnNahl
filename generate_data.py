import json

idioms_data = [
    {
        "id": "id_isl_daily_struggles",
        "title": "Daily Faith Struggles",
        "category": "Idioms & Slang",
        "mainCategory": "Idioms",
        "subCategory": "Islamic",
        "icon": "fa-mountain",
        "description": "Idioms to express the daily efforts and challenges in maintaining faith.",
        "tasks": [
            ("Easy", "Rise and Shine", "It's hard to rise and shine for Fajr, but it sets the tone for the whole day.", "Susah memang bangun pagi untuk Subuh, tapi itu menentukan suasana sepanjang hari.", "Gunakan idiom ini untuk momen bangun pagi dengan semangat."),
            ("Easy", "Running on Fumes", "I'm running on fumes right now, but there's only an hour left until Iftar.", "Saya sudah kehabisan tenaga sekarang, tapi tinggal sejam lagi sampai buka puasa.", "Gunakan idiom ini saat energi benar-benar habis di sore hari puasa."),
            ("Easy", "A Piece of Cake", "Just helping him out was a piece of cake, but I hope it counts as Sadaqah.", "Bantuin dia itu gampang banget, tapi semoga dihitung sebagai sedekah.", "Gunakan idiom ini untuk perbuatan baik yang sangat mudah dilakukan."),
            ("Easy", "Lose One's Cool", "I almost lost my cool, but then I remembered we shouldn't get angry easily.", "Saya hampir hilang kesabaran, tapi saya ingat kita nggak boleh gampang marah.", "Gunakan idiom ini untuk kondisi kehilangan kesabaran atau hampir marah."),
            ("Easy", "Slip One's Mind", "It completely slipped my mind that I haven't prayed Asr yet.", "Saya benar-benar lupa kalau belum shalat Ashar.", "Gunakan idiom ini saat murni lupa akan suatu kewajiban."),
            ("Medium", "Burn the Midnight Oil", "He's been burning the midnight oil lately, spending hours in Tahajjud.", "Dia sering melek sampai larut malam belakangan ini, menghabiskan waktu berjam-jam untuk Tahajjud.", "Gunakan idiom ini untuk aktivitas ibadah atau belajar di larut malam."),
            ("Medium", "Turn a Blind Eye", "When they started gossiping, I just turned a blind eye and walked away.", "Saat mereka mulai bergosip, saya pura-pura tidak tahu dan pergi.", "Gunakan idiom ini untuk secara sengaja mengabaikan/menghindari perbuatan buruk."),
            ("Medium", "Make Ends Meet", "We're trying to make ends meet, but we always trust that Allah provides.", "Kami berusaha keras untuk mencukupi kebutuhan, tapi kami selalu yakin Allah memberi rezeki.", "Gunakan idiom ini saat menghadapi ujian finansial."),
            ("Medium", "Cold Turkey", "I decided to quit smoking cold turkey right before Ramadan started.", "Saya memutuskan untuk berhenti merokok secara total tepat sebelum awal Ramadan.", "Gunakan idiom ini untuk berhenti dari kebiasaan buruk secara mendadak."),
            ("Medium", "A Lot on One's Plate", "I have a lot on my plate right now, but making Dua keeps me grounded.", "Saya punya banyak urusan sekarang, tapi berdoa membuat saya tetap tenang.", "Gunakan idiom ini untuk tanggung jawab atau beban pikiran yang menumpuk."),
            ("Hard", "Bite the Bullet", "You have to bite the bullet and accept this hardship as a test of your Iman.", "Kamu harus tabah menghadapi ujian ini dan menerimanya sebagai tes keimananmu.", "Gunakan idiom ini saat harus menghadapi takdir/ujian yang sangat berat dengan tabah."),
            ("Hard", "An Uphill Battle", "Lowering your gaze in this modern world is definitely an uphill battle.", "Menjaga pandangan di dunia modern ini pastinya adalah perjuangan yang sangat berat.", "Gunakan idiom ini untuk menggambarkan perjuangan menahan hawa nafsu yang sulit."),
            ("Hard", "Litmus Test", "Keeping your intentions pure when you're alone is the real litmus test of sincerity.", "Menjaga niat tetap murni di saat sendirian adalah ujian ketulusan yang sesungguhnya.", "Gunakan idiom ini untuk indikator atau ujian sejati dari sebuah niat/Ikhlas."),
            ("Hard", "Swim Against the Tide", "Standing up for Islamic values often means you have to swim against the tide.", "Membela nilai-nilai Islam seringkali berarti kamu harus berenang melawan arus.", "Gunakan idiom ini saat memegang teguh prinsip di tengah lingkungan yang salah."),
            ("Hard", "Bury the Hatchet", "I swallowed my pride and reached out to him first to bury the hatchet before Eid.", "Saya membuang gengsi dan menghubunginya duluan untuk berdamai sebelum Lebaran.", "Gunakan idiom ini untuk proses memaafkan dan menyambung silaturahim kembali.")
        ]
    },
    {
        "id": "id_isl_social_manners",
        "title": "Social & Manners (Adab)",
        "category": "Idioms & Slang",
        "mainCategory": "Idioms",
        "subCategory": "Islamic",
        "icon": "fa-users",
        "description": "Expressing Islamic etiquette (Adab) in social relationships using native idioms.",
        "tasks": [
            ("Easy", "Lips are Sealed", "Don't worry, your secret is safe with me. My lips are sealed.", "Jangan khawatir, rahasiamu aman denganku. Mulutku tertutup rapat.", "Gunakan idiom ini untuk meyakinkan teman bahwa Anda akan menjaga aibnya."),
            ("Easy", "To Be Honest", "To be honest with you, I think we should just tell the Imam the truth.", "Sejujurnya, saya rasa kita harus mengatakan yang sebenarnya pada Imam.", "Gunakan idiom ini saat menekankan pentingnya kejujuran."),
            ("Easy", "Lend a Hand", "I can't go out tonight, I need to lend a hand to my mom in the kitchen.", "Saya nggak bisa keluar malam ini, saya harus bantu ibu di dapur.", "Gunakan idiom ini untuk tindakan berbakti (Birrul Walidain) dengan membantu secara fisik."),
            ("Easy", "Break the Ice", "I just wanted to break the ice, so I smiled and said Salam.", "Saya cuma mau mencairkan suasana, jadi saya senyum dan mengucap Salam.", "Gunakan idiom ini untuk memulai interaksi dengan ramah."),
            ("Easy", "Down to Earth", "Even though he's a famous scholar, he's totally down to earth.", "Meskipun dia ulama terkenal, dia benar-benar rendah hati.", "Gunakan idiom ini untuk mendeskripsikan sifat tawadhu (rendah hati)."),
            ("Medium", "Beat Around the Bush", "Stop beating around the bush and just tell me what happened honestly.", "Berhenti berbelit-belit dan katakan saja padaku apa yang terjadi dengan jujur.", "Gunakan idiom ini untuk menegur orang yang tidak bicara langsung (kurang adab)."),
            ("Medium", "Let Bygones be Bygones", "He made a mistake, but we should just let bygones be bygones and forgive.", "Dia memang berbuat salah, tapi kita harus melupakan yang lalu dan memaafkan.", "Gunakan idiom ini untuk konsep memaafkan kesalahan masa lalu sepenuhnya."),
            ("Medium", "All Ears", "When the Sheikh started giving advice, I was all ears.", "Saat Syekh mulai memberikan nasihat, saya mendengarkan dengan penuh perhatian.", "Gunakan idiom ini untuk menunjukkan adab mendengarkan ilmu/nasihat secara saksama."),
            ("Medium", "Give Your Word", "If you give your word to a brother, you have to follow through with it.", "Jika kamu berjanji pada saudaramu, kamu harus menepatinya.", "Gunakan idiom ini untuk kewajiban menjaga lisan dan menepati janji."),
            ("Medium", "Judge a Book by its Cover", "You shouldn't judge a book by its cover. Only Allah knows his heart.", "Kamu tidak boleh menilai orang dari luarnya saja. Hanya Allah yang tahu hatinya.", "Gunakan idiom ini untuk menghindari su'udzon (buruk sangka)."),
            ("Hard", "Add Fuel to the Fire", "Arguing back will just add fuel to the fire. It's better to stay silent.", "Membalas berdebat hanya akan memperkeruh suasana. Lebih baik diam.", "Gunakan idiom ini untuk mencegah perdebatan yang dilarang dalam adab Islami."),
            ("Hard", "Build Bridges", "It's time to build bridges with your relatives, not burn them.", "Ini saatnya memperbaiki hubungan dengan kerabatmu, bukan malah menghancurkannya.", "Gunakan idiom ini untuk konsep Silaturahim dan menyambung tali persaudaraan."),
            ("Hard", "Bite Someone's Head Off", "You don't need to bite his head off just because he made a simple mistake.", "Kamu tidak perlu memarahinya dengan kasar hanya karena dia membuat kesalahan sepele.", "Gunakan idiom ini untuk peringatan agar tidak berbicara kasar (Qaulan Karima)."),
            ("Hard", "Benefit of the Doubt", "I think we should give him the benefit of the doubt before accusing him.", "Saya rasa kita harus berprasangka baik padanya sebelum menuduhnya.", "Gunakan idiom ini sebagai penerapan konsep Husnudzon (prasangka baik)."),
            ("Hard", "Give the Shirt Off One's Back", "He would literally give you the shirt off his back for the sake of Allah.", "Dia rela memberikan apa saja yang dia miliki demi Allah kalau kamu butuh.", "Gunakan idiom ini untuk mendeskripsikan kedermawanan luar biasa (Itsar).")
        ]
    },
    {
        "id": "id_isl_community",
        "title": "Community & Brotherhood",
        "category": "Idioms & Slang",
        "mainCategory": "Idioms",
        "subCategory": "Islamic",
        "icon": "fa-mosque",
        "description": "Describing solidarity, Ummah, and mutual support using common English idioms.",
        "tasks": [
            ("Easy", "In the Same Boat", "As Muslims in this city, we're all in the same boat, so we must help each other.", "Sebagai Muslim di kota ini, kita semua bernasib sama, jadi kita harus saling membantu.", "Gunakan idiom ini untuk persatuan Ummah dalam satu keadaan atau tantangan."),
            ("Easy", "Show Up", "Whenever the mosque needs volunteers, he always shows up.", "Kapan pun masjid butuh sukarelawan, dia selalu hadir.", "Gunakan idiom ini untuk seseorang yang selalu bisa diandalkan kehadirannya."),
            ("Easy", "Have Someone's Back", "I've got your back, brother. Don't worry about the event logistics.", "Aku mendukungmu, saudaraku. Jangan khawatir soal logistik acaranya.", "Gunakan idiom ini untuk dukungan persaudaraan (Ukhuwah)."),
            ("Easy", "In No Time", "If we team up, we can finish cleaning the prayer hall in no time.", "Kalau kita bekerja sama, kita bisa selesai membersihkan ruang shalat dalam waktu singkat.", "Gunakan idiom ini untuk kerja sama komunitas yang membuahkan hasil cepat."),
            ("Easy", "Make Yourself at Home", "Come on in, make yourself at home! The Iftar is almost ready.", "Ayo masuk, anggap saja rumah sendiri! Buka puasanya hampir siap.", "Gunakan idiom ini untuk memuliakan tamu (adab bertamu)."),
            ("Medium", "Stand Shoulder to Shoulder", "We need to stand shoulder to shoulder during these tough times.", "Kita harus berdiri berdampingan saling mendukung di masa sulit ini.", "Gunakan idiom ini sebagai metafora persatuan, bagaikan merapatkan shaf shalat."),
            ("Medium", "Pitch In", "Everyone needs to pitch in if we want the charity drive to succeed.", "Semua orang harus ikut patungan/berkontribusi kalau kita mau acara amalnya sukses.", "Gunakan idiom ini untuk kontribusi bersama dalam sedekah atau acara komunitas."),
            ("Medium", "Get the Word Out", "Can you help me get the word out about the upcoming weekend halaqah?", "Bisa bantu sebarkan info soal halaqah akhir pekan ini?", "Gunakan idiom ini untuk mensyiarkan kajian atau menyebarkan dakwah."),
            ("Medium", "Drop By", "I haven't seen him at Jum'ah lately. I should drop by his place to check.", "Saya belum lihat dia di shalat Jumat belakangan ini. Saya harus mampir ke rumahnya.", "Gunakan idiom ini untuk menjenguk saudara yang absen (menunaikan hak muslim)."),
            ("Medium", "Clear the Air", "Let's sit down and clear the air before this misunderstanding splits the group.", "Mari duduk dan luruskan masalahnya sebelum kesalahpahaman ini memecah kelompok.", "Gunakan idiom ini untuk proses Tabayyun dalam komunitas."),
            ("Hard", "Through Thick and Thin", "True brotherhood means staying by someone's side through thick and thin.", "Persaudaraan sejati berarti tetap berada di sisi seseorang dalam suka dan duka.", "Gunakan idiom ini untuk Ukhuwah fillah yang tahan banting menghadapi segala ujian."),
            ("Hard", "Show the Ropes", "We need to show the new reverts the ropes gently and with patience.", "Kita perlu mengajari para mualaf dasar-dasarnya dengan lembut dan sabar.", "Gunakan idiom ini untuk mentransfer ilmu atau membimbing saudara seiman yang baru."),
            ("Hard", "Mend Fences", "It took months to mend fences after the argument divided our community.", "Butuh berbulan-bulan untuk memperbaiki hubungan setelah pertengkaran memecah komunitas kita.", "Gunakan idiom ini untuk rekonsiliasi atau Islah berskala besar."),
            ("Hard", "Under the Radar", "He donated a large sum under the radar because he feared showing off.", "Dia mendonasikan jumlah besar secara diam-diam karena takut pamer (riya).", "Gunakan idiom ini untuk sedekah sirriyyah (dilakukan secara sembunyi-sembunyi)."),
            ("Hard", "It Takes a Village", "It takes a village to raise a righteous child, and our community helps.", "Butuh peran satu komunitas untuk mendidik anak yang saleh, dan komunitas kita membantu itu.", "Gunakan idiom ini untuk menegaskan peran krusial Ummah dalam tarbiyah anak.")
        ]
    },
    {
        "id": "id_isl_life_death",
        "title": "Life, Death & Destiny",
        "category": "Idioms & Slang",
        "mainCategory": "Idioms",
        "subCategory": "Islamic",
        "icon": "fa-hourglass-half",
        "description": "Idioms reflecting the temporary nature of Dunya and trust in Qadar.",
        "tasks": [
            ("Easy", "Time Flies", "Time flies so fast. It feels like last Ramadan was just yesterday.", "Waktu berlalu sangat cepat. Rasanya Ramadan lalu baru saja kemarin.", "Gunakan idiom ini untuk menyadari cepatnya waktu di dunia (Dunya)."),
            ("Easy", "Let It Go", "You can't change the past Qadar, so just let it go and trust Allah.", "Kamu tak bisa mengubah takdir masa lalu, jadi relakan saja dan percayalah pada Allah.", "Gunakan idiom ini untuk menerima takdir (Ridha) atas apa yang sudah lewat."),
            ("Easy", "Everything Happens for a Reason", "I didn't get the job, but everything happens for a reason Allah knows.", "Saya tidak dapat pekerjaan itu, tapi segala sesuatu terjadi karena alasan yang Allah tahu.", "Gunakan idiom ini untuk mengekspresikan Tawakkal atas ketentuan Allah."),
            ("Easy", "Fresh Start", "After performing Umrah, he felt like he got a completely fresh start.", "Setelah menunaikan umrah, dia merasa mendapat lembaran yang benar-benar baru.", "Gunakan idiom ini untuk kondisi bersih dari dosa seperti bayi yang baru lahir."),
            ("Easy", "Kill Time", "Stop killing time on your phone and do some Dhikr instead.", "Berhenti membuang waktu main HP dan lakukan zikir saja.", "Gunakan idiom ini sebagai teguran untuk menghindari kelalaian (Ghaflah)."),
            ("Medium", "In the Blink of an Eye", "In the blink of an eye, this worldly life will be over.", "Dalam sekejap mata, kehidupan duniawi ini akan berakhir.", "Gunakan idiom ini untuk menggambarkan betapa singkatnya umur dan dunia ini."),
            ("Medium", "Silver Lining", "Every cloud has a silver lining; this trial might be a blessing in disguise.", "Selalu ada hikmah di balik musibah; ujian ini bisa jadi adalah berkah yang tersembunyi.", "Gunakan idiom ini untuk mengekspresikan Hikmah dari sebuah penderitaan."),
            ("Medium", "Reap What You Sow", "On Judgment Day, everyone will reap what they sow in this life.", "Di Hari Kiamat, semua orang akan menuai apa yang mereka tanam di kehidupan ini.", "Gunakan idiom ini untuk hukum sebab-akibat amal perbuatan di Akhirat."),
            ("Medium", "Go Down the Drain", "Don't let your youth go down the drain. Worship while you are strong.", "Jangan biarkan masa mudamu terbuang sia-sia. Beribadahlah selagi kamu kuat.", "Gunakan idiom ini untuk memperingatkan mubazirnya potensi masa muda."),
            ("Medium", "Up in the Air", "Our future is still up in the air, but we trust the Almighty's plan.", "Masa depan kita masih belum pasti, tapi kita percaya pada rencana Yang Maha Kuasa.", "Gunakan idiom ini saat tidak tahu apa yang akan terjadi dan menyerahkan pada Takdir."),
            ("Hard", "Like There's No Tomorrow", "People chase money like there's no tomorrow, forgetting the Akhirah.", "Orang mengejar uang seolah tak ada hari esok, melupakan akhirat.", "Gunakan idiom ini untuk menyindir sifat hubbuddunya (cinta dunia berlebihan)."),
            ("Hard", "Out of One's Hands", "The final outcome is out of our hands; we just trust Allah's decree.", "Hasil akhirnya ada di luar kendali kita; kita hanya percaya pada ketetapan Allah.", "Gunakan idiom ini untuk menerima Takdir setelah berusaha maksimal."),
            ("Hard", "Hit Rock Bottom", "Sometimes you have to hit rock bottom to realize you only have Allah.", "Terkadang kamu harus jatuh ke titik terendah untuk menyadari kamu hanya punya Allah.", "Gunakan idiom ini untuk momen hidayah yang datang setelah kejatuhan hidup yang besar."),
            ("Hard", "Pass the Torch", "Before he passed away, the scholar passed the torch to his students.", "Sebelum wafat, sang ulama menyerahkan tongkat estafet dakwah kepada murid-muridnya.", "Gunakan idiom ini untuk mewariskan tugas dakwah dari satu generasi ke generasi lain."),
            ("Hard", "The Final Curtain", "When the final curtain falls, the only thing left will be our righteous deeds.", "Saat kematian tiba, satu-satunya yang tersisa hanyalah amal saleh kita.", "Gunakan idiom ini sebagai metafora yang puitis untuk kematian (Ajal).")
        ]
    },
    {
        "id": "id_isl_mind_heart",
        "title": "Mind, Heart & Intention",
        "category": "Idioms & Slang",
        "mainCategory": "Idioms",
        "subCategory": "Islamic",
        "icon": "fa-brain",
        "description": "Native expressions for mental health, spiritual cleansing, and purifying intentions.",
        "tasks": [
            ("Easy", "Change of Heart", "I was going to skip the lecture, but I had a change of heart.", "Tadinya saya mau bolos kajian itu, tapi saya berubah pikiran ke arah yang baik.", "Gunakan idiom ini ketika hati tergerak menuju kebaikan secara tiba-tiba."),
            ("Easy", "Sleep On It", "Don't decide now. Pray Istikharah and sleep on it.", "Jangan putuskan sekarang. Shalat Istikharah saja dan pikirkan lagi besok pagi.", "Gunakan idiom ini saat menunda keputusan penting untuk memohon petunjuk (Istikharah)."),
            ("Easy", "Feeling Down", "I was feeling a bit down, so I listened to some Quran recitation.", "Saya lagi merasa agak sedih, jadi saya mendengarkan murattal Al-Quran.", "Gunakan idiom ini untuk mengekspresikan kesedihan ringan atau hati yang gundah."),
            ("Easy", "Keep Your Chin Up", "Keep your chin up, brother. Allah tests those He loves.", "Tetaplah tegar, saudaraku. Allah menguji orang-orang yang Dia cintai.", "Gunakan idiom ini untuk menyemangati seseorang agar tidak putus asa dari rahmat-Nya."),
            ("Easy", "Make Up One's Mind", "I need to make up my mind about joining the Hajj group this year.", "Saya harus segera mengambil keputusan soal ikut rombongan Haji tahun ini.", "Gunakan idiom ini untuk proses menetapkan hati dan tekad (Azam)."),
            ("Medium", "Clear One's Head", "I went to the mosque early just to clear my head and find peace.", "Saya pergi ke masjid lebih awal hanya untuk menjernihkan pikiran dan mencari ketenangan.", "Gunakan idiom ini untuk mencari ketenangan batin melalui itikaf atau ibadah sunnah."),
            ("Medium", "Goodness of One's Heart", "If you do it out of the goodness of your heart, Allah will reward you.", "Kalau kamu melakukannya dengan hati yang tulus ikhlas, Allah akan membalasmu.", "Gunakan idiom ini untuk mendeskripsikan niat Ikhlas tanpa pamrih atau riya."),
            ("Medium", "Fight the Urge", "He had to fight the urge to argue back when insulted.", "Dia harus melawan dorongan kuat untuk membalas berdebat saat dihina.", "Gunakan idiom ini saat berperang melawan was-was setan atau hawa nafsu."),
            ("Medium", "Hold a Grudge", "Holding a grudge against a Muslim brother will only darken your own heart.", "Menyimpan dendam pada saudara Muslim hanya akan menggelapkan hatimu sendiri.", "Gunakan idiom ini untuk sifat tercela (dendam/Hasad) yang mengotori hati."),
            ("Medium", "Lose One's Train of Thought", "I completely lost my train of thought during Salah because I was worried.", "Saya benar-benar kehilangan fokus pikiran saya saat shalat karena sedang khawatir.", "Gunakan idiom ini saat kehilangan kekhusyuan dalam beribadah."),
            ("Hard", "Peace of Mind", "Achieving true peace of mind is impossible without remembering the Creator.", "Mencapai ketenangan batin yang sejati adalah mustahil tanpa mengingat Sang Pencipta.", "Gunakan idiom ini sebagai representasi dari jiwa yang tenang (Mutma'innah)."),
            ("Hard", "Weigh Heavily on One's Conscience", "The unpaid debt has been weighing heavily on his conscience.", "Hutang yang belum dibayar itu telah sangat membebani nuraninya.", "Gunakan idiom ini untuk perasaan bersalah atau takut dosa yang memicu taubat."),
            ("Hard", "Run on Empty", "I feel like I'm running on empty spiritually; I really need a faith boost.", "Rasanya baterai spiritual saya benar-benar habis; saya butuh dorongan iman.", "Gunakan idiom ini untuk kondisi futur (iman sedang turun drastis)."),
            ("Hard", "Own Up To", "You need to own up to your past mistakes and make sincere Tawbah.", "Kamu harus berani mengakui kesalahan masa lalumu dan melakukan taubat nasuha.", "Gunakan idiom ini untuk keberanian mengakui dosa di hadapan Allah tanpa alasan."),
            ("Hard", "Set in Stone", "Despite the modern challenges, his Islamic principles remain set in stone.", "Meskipun ada tantangan modern, prinsip-prinsip keislamannya tetap tak tergoyahkan.", "Gunakan idiom ini untuk menggambarkan akidah atau tauhid yang sangat kokoh (Tsabat).")
        ]
    }
]

slang_data = [
    {
        "id": "sl_isl_social_media",
        "title": "Muslim Social Media",
        "category": "Idioms & Slang",
        "mainCategory": "Slang",
        "subCategory": "Islamic",
        "icon": "fa-hashtag",
        "description": "Slang used by young Muslims on social media platforms and chats.",
        "tasks": [
            ("Easy", "Flex", "Posting your Sadaqah receipt online is such a flex, check your intentions.", "Mengepos bukti sedekahmu secara online itu pamer banget, cek lagi niatmu.", "Slang untuk menunjukkan tindakan pamer harta atau amal (Riya)."),
            ("Easy", "Low-Key", "He's super knowledgeable about the Deen, but he keeps it very low-key.", "Dia sangat berilmu tentang agama, tapi dia tetap sangat rendah hati/nggak pamer.", "Slang untuk sifat diam-diam, tidak mencolok, atau Tawadhu."),
            ("Easy", "Cringe", "That debate in the Islamic video comments section was so cringe.", "Perdebatan di kolom komentar video Islam itu bikin malu/merinding banget.", "Slang untuk sesuatu yang membuat malu, canggung, atau tidak pantas."),
            ("Easy", "Big Mood", "That reminder about needing more patience was totally relatable. Big mood.", "Nasihat tentang butuh lebih banyak kesabaran itu sangat 'relatable'. Setuju banget.", "Slang untuk mengekspresikan persetujuan kuat atau merasakan hal yang persis sama."),
            ("Easy", "Hyped", "I'm so hyped for the upcoming youth Halaqah this weekend!", "Saya semangat banget buat Halaqah pemuda akhir pekan ini!", "Slang untuk antusiasme tinggi menyambut acara Islami atau hal seru."),
            ("Medium", "Clout Chasing", "Please don't share that controversial video; it's just clout chasing.", "Tolong jangan bagikan video kontroversial itu; itu cuma cari sensasi (pansos).", "Slang untuk orang yang sengaja mencari popularitas lewat cara negatif (Fitnah)."),
            ("Medium", "Doomscrolling", "I spent hours doomscrolling instead of reading my daily Quran portion.", "Saya menghabiskan berjam-jam scroll berita buruk alih-alih membaca tilawah harian saya.", "Slang untuk kebiasaan buruk membuang waktu membaca berita negatif di medsos."),
            ("Medium", "Hit Different", "That Khutbah hit different today. It exactly addressed my current struggles.", "Khutbah hari ini rasanya beda banget (sangat mengena). Pas banget bahas masalahku.", "Slang saat sebuah pengalaman/nasihat terasa jauh lebih berdampak dari biasanya."),
            ("Medium", "Cancel", "You can't just cancel someone online without doing proper Tabayyun first.", "Kamu nggak bisa memboikot seseorang di internet tanpa melakukan Tabayyun dulu.", "Slang untuk tren memboikot orang di internet, seringkali tanpa bukti jelas."),
            ("Medium", "Ghosted", "He was asking too many inappropriate questions, so I just ghosted him.", "Dia terlalu banyak tanya soal yang tidak pantas, jadi saya abaikan saja pesannya.", "Slang untuk tindakan memutus komunikasi tanpa kabar demi menjaga batasan."),
            ("Hard", "Touch Grass", "The comment section is toxic. You need to touch grass and remember real life.", "Kolom komentarnya sangat beracun. Kamu perlu keluar rumah dan ingat kehidupan nyata.", "Slang teguran untuk menyuruh seseorang berhenti main internet dan kembali ke realita."),
            ("Hard", "Be a Sheep", "Don't just be a sheep and follow every TikTok trend blindly.", "Jangan cuma jadi pengikut buta (kambing) dan ikut-ikutan semua tren TikTok.", "Slang untuk fenomena Taqlid buta pada tren atau opini massa yang salah."),
            ("Hard", "Endgame", "People act like wealth is the endgame, but Jannah is the real goal.", "Orang bertingkah seolah kekayaan adalah tujuan akhir, padahal Surga adalah tujuan asli.", "Slang untuk menyebut tujuan final atau target utama dari sesuatu."),
            ("Hard", "Fake Vibes", "He acts so pious online, but in real life it's totally giving fake vibes.", "Dia bertingkah sangat alim di internet, tapi di dunia nyata rasanya palsu banget.", "Slang untuk intuisi atau firasat bahwa seseorang sedang munafik/berpura-pura."),
            ("Hard", "Mind-Blowing", "The way the Sheikh explained the concept of Tawheed was absolutely mind-blowing.", "Cara Syekh menjelaskan konsep Tauhid itu benar-benar luar biasa mencengangkan.", "Slang untuk kekaguman luar biasa saat mendapat ilmu atau pemahaman baru.")
        ]
    },
    {
        "id": "sl_isl_ramadan_eid",
        "title": "Ramadan & Eid Vibes",
        "category": "Idioms & Slang",
        "mainCategory": "Slang",
        "subCategory": "Islamic",
        "icon": "fa-moon",
        "description": "Slang associated with fasting, breaking the fast, and Eid celebrations.",
        "tasks": [
            ("Easy", "Starving", "I'm literally starving. I can't wait to hear the Maghrib Adhan.", "Saya benar-benar kelaparan. Nggak sabar mau dengar azan Maghrib.", "Slang hiperbola untuk rasa lapar yang amat sangat saat puasa."),
            ("Easy", "Stuffed My Face", "I stuffed my face with samosas at Iftar and now I can barely stand for Taraweeh.", "Saya makan samosa terlalu banyak pas buka dan sekarang hampir nggak bisa berdiri buat Tarawih.", "Slang untuk kebiasaan makan berlebih/rakus saat berbuka puasa."),
            ("Easy", "Wiped Out", "I'm totally wiped out, I could sleep for a whole week after Suhoor.", "Saya benar-benar tepar, rasanya bisa tidur seminggu penuh setelah Sahur.", "Slang untuk mengekspresikan rasa sangat lelah atau kehabisan energi di bulan puasa."),
            ("Easy", "Fire", "Bro, your new Eid outfit is fire! Where did you buy it?", "Bro, baju Lebaran barumu keren abis! Beli di mana?", "Slang untuk memuji sesuatu yang sangat bagus, keren, atau menarik perhatian."),
            ("Easy", "Packed", "The local mosque was completely packed last night for the 27th night of Taraweeh.", "Masjid lokal penuh sesak semalam untuk malam ke-27 Tarawih.", "Slang untuk keramaian yang sangat padat hingga tidak ada ruang tersisa."),
            ("Medium", "Food Coma", "I ate way too much biryani, now I'm in a total food coma.", "Saya makan biryani terlalu banyak, sekarang saya ngantuk berat (kekenyangan).", "Slang untuk rasa ngantuk ekstrem dan lemas akibat makan berlebihan saat Iftar."),
            ("Medium", "Clutch", "Waking up exactly two minutes before the Suhoor deadline was so clutch.", "Bangun tepat dua menit sebelum batas waktu Sahur itu benar-benar penyelamat.", "Slang untuk sesuatu yang berhasil dilakukan di momen krusial/terakhir."),
            ("Medium", "Extra", "My mom is being so extra with the Eid decorations this year.", "Ibu saya heboh/totalitas banget dengan dekorasi Lebaran tahun ini.", "Slang untuk sikap yang berlebihan, heboh, atau melakukan sesuatu lebih dari yang wajar."),
            ("Medium", "Tweaking", "The lack of morning coffee during Ramadan has got me tweaking all day.", "Gara-gara nggak ngopi pagi selama Ramadan, saya jadi uring-uringan/gelisah seharian.", "Slang untuk bertingkah aneh, gelisah, atau panik (misal karena efek putus kafein)."),
            ("Medium", "Pull an All-Nighter", "I'm going to pull an all-nighter at the Masjid seeking Laylatul Qadr.", "Saya akan begadang semalaman suntuk di Masjid untuk mencari Lailatul Qadar.", "Slang untuk tidak tidur semalaman penuh demi melakukan ibadah (Qiyam)."),
            ("Hard", "Burnout", "It's hard to keep up the momentum; a lot of people face post-Ramadan burnout.", "Susah menjaga semangat; banyak orang mengalami kelelahan ekstrem pasca Ramadan.", "Slang untuk kelelahan mental/fisik akut, merujuk pada penurunan ibadah (Futur)."),
            ("Hard", "Salty", "Eid is great, but getting asked about marriage by relatives makes me salty.", "Lebaran itu menyenangkan, tapi ditanya soal nikah sama kerabat bikin saya jengkel.", "Slang untuk perasaan kesal, pahit, atau sedikit marah karena hal sepele."),
            ("Hard", "Unreal", "Standing in front of the Kaaba for the first time felt absolutely unreal.", "Berdiri di depan Ka'bah untuk pertama kalinya terasa sangat tidak nyata (luar biasa).", "Slang untuk pengalaman spiritual yang sangat mendalam bagaikan mimpi."),
            ("Hard", "Rough", "Juggling university exams and fasting long hours is pretty rough, ngl.", "Menyeimbangkan ujian kampus dan puasa berjam-jam itu lumayan berat, sejujurnya.", "Slang untuk sesuatu yang sulit, keras, atau tidak menyenangkan."),
            ("Hard", "Bussin'", "My mom's rendang for the Eid feast is absolutely bussin', no cap.", "Rendang buatan ibu saya untuk hidangan Lebaran ini benar-benar lezat luar biasa, sungguh.", "Slang untuk makanan yang rasanya sangat lezat tiada tara.")
        ]
    },
    {
        "id": "sl_isl_relationships",
        "title": "Marriage & Friendship",
        "category": "Idioms & Slang",
        "mainCategory": "Slang",
        "subCategory": "Islamic",
        "icon": "fa-ring",
        "description": "Slang related to Taaruf, marriage (Nikah), and building halal relationships.",
        "tasks": [
            ("Easy", "Cuffed", "He's officially cuffed now; the Nikah was just last weekend.", "Dia resmi menikah/terikat sekarang; akad nikahnya baru akhir pekan lalu.", "Slang (dari kata borgol) yang berarti sudah resmi menikah atau menjalin ikatan komitmen."),
            ("Easy", "Catching Feelings", "I think he's catching feelings for her, but he's keeping it Halal.", "Kayaknya dia mulai naksir perempuan itu, tapi dia tetap menjaga batasan Halal.", "Slang untuk mulai timbul rasa suka atau cinta (biasanya menuju proses Taaruf)."),
            ("Easy", "Bestie", "She's my Muslimah bestie; we always attend Islamic classes together.", "Dia sahabat Muslimahku; kami selalu ikut kelas kajian Islam bareng.", "Slang untuk sahabat yang sangat dekat (Akhi/Ukhti)."),
            ("Easy", "Chilling", "We're just chilling at the halal cafe after Jum'ah prayers.", "Kami cuma nyantai nongkrong di kafe halal setelah shalat Jumat.", "Slang untuk waktu bersantai bersama teman tanpa melakukan hal berat."),
            ("Easy", "Dumped", "They broke it off because it wasn't a Halal relationship, so he got dumped.", "Mereka mengakhirinya karena itu bukan hubungan halal, jadi dia diputuskan.", "Slang untuk diputuskan hubungannya oleh pihak lain (misal mengakhiri pacaran)."),
            ("Medium", "Relationship Goals", "That elderly couple reading Quran together is pure relationship goals.", "Pasangan lansia yang baca Quran bareng itu benar-benar panutan pasangan ideal.", "Slang untuk pasangan suami istri yang menginspirasi dan ingin ditiru."),
            ("Medium", "Red Flag", "He treats his parents poorly; to me, that's a massive red flag for marriage.", "Dia memperlakukan orang tuanya dengan buruk; bagiku itu tanda bahaya besar untuk menikah.", "Slang penanda sifat buruk atau peringatan dini tentang calon pasangan."),
            ("Medium", "Friend-Zoned", "I thought it was a serious Taaruf, but I completely got friend-zoned.", "Saya kira itu proses Taaruf yang serius, tapi ternyata saya cuma dianggap teman.", "Slang saat niat/harapan menikah ditolak secara halus dan hanya dijadikan teman."),
            ("Medium", "Shoot Your Shot", "If you think she is a righteous spouse, you should shoot your shot and talk to her Wali.", "Kalau kamu merasa dia pasangan yang salihah, kamu harus berani bertindak dan bicara ke walinya.", "Slang untuk mengambil peluang atau berani melamar walau ada risiko ditolak."),
            ("Medium", "Vibing", "The meeting with her family went well, everyone was just vibing.", "Pertemuan dengan keluarganya berjalan lancar, semua orang asyik/cocok satu sama lain.", "Slang untuk merasa cocok, santai, dan nyambung dalam mengobrol (Khitbah)."),
            ("Hard", "Locked In", "After signing the marriage contract, they are officially locked in for life.", "Setelah menandatangani buku nikah, mereka resmi terikat seumur hidup.", "Slang untuk komitmen penuh yang tidak bisa diganggu gugat (Mithaqan Ghaliza)."),
            ("Hard", "Flaked", "The potential match flaked on the family meeting at the last minute.", "Calon pasangan itu membatalkan pertemuan keluarga secara sepihak di menit terakhir.", "Slang untuk orang yang mengingkari janji atau tiba-tiba membatalkan rencana."),
            ("Hard", "Ghosting", "Instead of saying he wasn't interested, he resorted to ghosting her.", "Alih-alih bilang dia tidak tertarik, dia malah menghilang tanpa kabar.", "Slang untuk tindakan memutus komunikasi sepihak (tidak beradab dalam Taaruf)."),
            ("Hard", "Ride or Die", "A true Muslim spouse is your ride or die through this life and the Akhirah.", "Pasangan Muslim sejati adalah teman setia sehidup semati di dunia dan akhirat.", "Slang untuk pasangan atau sahabat yang sangat setia dalam kondisi apapun."),
            ("Hard", "The Ick", "When he disrespected the waiter, it immediately gave me the ick.", "Saat dia tidak sopan pada pelayan, itu langsung bikin saya ilfeel/jijik.", "Slang untuk perasaan tiba-tiba jijik atau kehilangan ketertarikan karena tingkah aneh.")
        ]
    },
    {
        "id": "sl_isl_work_study",
        "title": "Work, Study & Hustle",
        "category": "Idioms & Slang",
        "mainCategory": "Slang",
        "subCategory": "Islamic",
        "icon": "fa-briefcase",
        "description": "Slang for seeking Halal Rizq, studying, and dealing with daily grinds.",
        "tasks": [
            ("Easy", "Grind", "Back to the daily grind of seeking Halal provision for my family.", "Kembali ke rutinitas kerja keras harian untuk mencari rezeki Halal bagi keluarga.", "Slang untuk kerja keras atau rutinitas pekerjaan yang melelahkan setiap hari."),
            ("Easy", "Hustle", "I respect his hustle; he works two jobs to pay for his Islamic studies.", "Saya salut dengan perjuangannya; dia kerja dua tempat untuk bayar studi Islamnya.", "Slang untuk perjuangan keras mencari uang atau meraih kesuksesan."),
            ("Easy", "Secure the Bag", "Just finished the freelance project. Time to secure the bag, Alhamdulillah.", "Baru saja menyelesaikan proyek lepas. Waktunya terima bayaran, Alhamdulillah.", "Slang untuk berhasil mendapatkan uang atau meraih kesepakatan finansial."),
            ("Easy", "Tryhard", "He's such a tryhard in Arabic class, always answering before everyone else.", "Dia ambisius banget di kelas bahasa Arab, selalu menjawab duluan sebelum yang lain.", "Slang untuk orang yang berusaha terlalu keras untuk terlihat hebat/pintar."),
            ("Easy", "Slacking Off", "You can't be slacking off when finals are just a week away.", "Kamu nggak boleh bermalas-malasan saat ujian akhir tinggal seminggu lagi.", "Slang untuk bersantai-santai atau menghindari pekerjaan/kewajiban."),
            ("Medium", "Nailed It", "I was nervous about the Quran recitation test, but I absolutely nailed it.", "Saya gugup soal ujian hafalan Quran, tapi saya berhasil melakukannya dengan sempurna.", "Slang untuk melakukan sesuatu dengan sangat sukses dan sempurna."),
            ("Medium", "Flunked", "I didn't study the Tajweed rules properly, so I totally flunked the quiz.", "Saya tidak belajar hukum Tajwid dengan benar, jadi saya benar-benar gagal kuisnya.", "Slang untuk gagal total dalam ujian atau tes."),
            ("Medium", "Cramming", "I spent the whole night cramming the Hadith narrators for tomorrow's exam.", "Saya menghabiskan sepanjang malam kebut semalam menghafal perawi Hadis untuk ujian besok.", "Slang untuk belajar dengan sistem SKS (Sistem Kebut Semalam) menjelang ujian."),
            ("Medium", "Busted", "He got busted cheating on the test, which is totally un-Islamic.", "Dia ketahuan menyontek saat ujian, yang mana itu sangat tidak Islami.", "Slang untuk tertangkap basah melakukan sesuatu yang salah."),
            ("Medium", "Aced It", "MashaAllah, she aced her entrance exam for the Islamic University.", "MasyaAllah, dia lulus dengan nilai sempurna di ujian masuk Universitas Islam.", "Slang untuk mendapatkan nilai tertinggi (A) atau lulus dengan sangat gemilang."),
            ("Hard", "No-Brainer", "Taking the Halal job offer with a slightly lower salary was a no-brainer.", "Menerima tawaran kerja Halal dengan gaji sedikit lebih rendah itu pilihan yang sangat jelas.", "Slang untuk keputusan atau pilihan yang sangat mudah dan tidak perlu dipikirkan lagi."),
            ("Hard", "In the Zone", "I was completely in the zone while writing my thesis on Islamic history.", "Saya sangat fokus/tenggelam saat menulis tesis tentang sejarah Islam.", "Slang untuk kondisi mental yang sangat fokus dan produktif tanpa gangguan."),
            ("Hard", "On Point", "The Imam's explanation of the Tafsir was absolutely on point today.", "Penjelasan Imam tentang Tafsir hari ini benar-benar pas dan akurat.", "Slang untuk sesuatu yang sempurna, akurat, atau tepat sasaran."),
            ("Hard", "Sick", "Did you see the architecture of the new mosque? It looks sick!", "Kamu lihat arsitektur masjid baru itu? Keren banget/Gila!", "Slang (berlawanan dengan arti asli sakit) yang berarti sangat keren atau luar biasa."),
            ("Hard", "GOAT", "When it comes to compiling Hadith, Imam Bukhari is definitely the GOAT.", "Kalau bicara soal kompilasi Hadis, Imam Bukhari jelas adalah yang Terbaik Sepanjang Masa.", "Slang singkatan dari Greatest Of All Time (Terbaik sepanjang masa).")
        ]
    },
    {
        "id": "sl_isl_youth_identity",
        "title": "Muslim Youth & Identity",
        "category": "Idioms & Slang",
        "mainCategory": "Slang",
        "subCategory": "Islamic",
        "icon": "fa-user-graduate",
        "description": "Slang about identity, style, and attitude for modern young Muslims.",
        "tasks": [
            ("Easy", "Glow Up", "Her spiritual glow up since she started wearing the Hijab is beautiful.", "Perubahan positif spiritualnya sejak mulai memakai Hijab itu sangat indah.", "Slang untuk transformasi atau peningkatan drastis ke arah yang jauh lebih baik."),
            ("Easy", "FOMO", "I got major FOMO when seeing everyone's pictures at the Umrah trip.", "Saya merasa takut tertinggal saat melihat foto semua orang di perjalanan Umrah.", "Slang singkatan Fear Of Missing Out (takut ketinggalan momen seru)."),
            ("Easy", "Woke", "He thinks he's so woke, but his opinions completely contradict the Sunnah.", "Dia merasa sangat kritis/sadar isu sosial, tapi opininya sangat bertentangan dengan Sunnah.", "Slang untuk merasa sangat peduli pada isu sosial/politik (kadang berkonotasi negatif)."),
            ("Easy", "Lit", "The community Iftar gathering at the park yesterday was absolutely lit.", "Acara kumpul buka puasa bersama di taman kemarin benar-benar seru abis.", "Slang untuk pesta atau acara yang sangat menyenangkan dan luar biasa ramai."),
            ("Easy", "Savage", "The way the scholar dismantled the atheist's argument was just savage.", "Cara ulama itu mematahkan argumen ateis itu benar-benar kejam/keren banget.", "Slang untuk tindakan yang berani, brutal, atau tidak peduli pendapat orang secara keren."),
            ("Medium", "Slay", "Sister, your Abaya matches your shoes perfectly. You totally slay!", "Saudari, Abayamu sangat cocok dengan sepatumu. Kamu tampil menawan banget!", "Slang untuk melakukan sesuatu dengan sangat baik atau tampil sangat memukau."),
            ("Medium", "Shook", "I was completely shook when I learned the linguistic miracles of the Quran.", "Saya benar-benar kaget/terpukau saat mempelajari mukjizat linguistik Al-Quran.", "Slang untuk merasa sangat terkejut, kagum, atau tidak bisa berkata-kata."),
            ("Medium", "Sus", "That investment scheme guaranteeing halal returns looks really sus.", "Skema investasi yang menjamin keuntungan halal itu terlihat sangat mencurigakan.", "Slang singkatan dari Suspicious (mencurigakan atau patut diwaspadai)."),
            ("Medium", "Bet", "You want to memorize Surah Al-Mulk together this week? Bet.", "Kamu mau menghafal Surah Al-Mulk bareng minggu ini? Tentu/Ayo.", "Slang untuk mengatakan 'Oke', 'Setuju', atau menerima tantangan dengan percaya diri."),
            ("Medium", "Cap / No Cap", "The food at the mosque's bazaar was the best in town, no cap.", "Makanan di bazar masjid itu yang paling enak di kota ini, serius/nggak bohong.", "Slang di mana 'Cap' berarti bohong, dan 'No Cap' berarti jujur/sungguhan."),
            ("Hard", "Drip", "He showed up to Eid prayers with some serious traditional drip.", "Dia datang ke shalat Ied dengan gaya pakaian tradisional yang sangat keren.", "Slang untuk pakaian, perhiasan, atau gaya busana yang sangat keren dan trendi."),
            ("Hard", "Rent-Free", "That powerful verse from Surah Taha has been living in my head rent-free.", "Ayat kuat dari Surah Taha itu terus terngiang-ngiang di kepalaku (tanpa bayar sewa).", "Slang untuk sesuatu yang tidak bisa berhenti dipikirkan terus-menerus."),
            ("Hard", "Valid", "Your frustration about finding Halal food is totally valid, bro.", "Rasa frustrasimu soal mencari makanan Halal itu sangat bisa dimaklumi, bro.", "Slang untuk sesuatu yang masuk akal, bisa dibenarkan, atau dapat diterima."),
            ("Hard", "Periodt", "Modesty is not just about clothes, it's about behavior too. Periodt.", "Kesopanan bukan cuma soal pakaian, tapi soal perilaku juga. Titik.", "Slang (penekanan dari kata Period) untuk mengakhiri perdebatan karena argumen sudah mutlak."),
            ("Hard", "Gatekeeping", "Stop gatekeeping the knowledge; Islam encourages us to share beneficial resources.", "Berhenti menyembunyikan ilmu; Islam mendorong kita untuk berbagi sumber yang bermanfaat.", "Slang untuk tindakan mengontrol atau menyembunyikan akses informasi dari orang lain.")
        ]
    }
]

def generate_file_content(data, is_idiom):
    name = "IDIOMS_ISLAMIC_THEMES" if is_idiom else "SLANG_ISLAMIC_THEMES"
    out = "import { ShadowingTheme } from './shadowingData';\n\n"
    out += f"export const {name}: ShadowingTheme[] = [\n"
    
    for i, theme in enumerate(data):
        out += "  {\n"
        out += f"    id: {json.dumps(theme['id'])},\n"
        out += f"    title: {json.dumps(theme['title'])},\n"
        out += f"    category: {json.dumps(theme['category'])},\n"
        out += f"    mainCategory: {json.dumps(theme['mainCategory'])},\n"
        out += f"    subCategory: {json.dumps(theme['subCategory'])},\n"
        out += f"    icon: {json.dumps(theme['icon'])},\n"
        out += f"    description: {json.dumps(theme['description'])},\n"
        out += "    tasks: [\n"
        
        diffs = {"Easy": [], "Medium": [], "Hard": []}
        for task in theme['tasks']:
            diffs[task[0]].append(task)
            
        counter = 1
        for diff, tasks in diffs.items():
            out += f"      // {diff} (5)\n"
            for t in tasks:
                tid = f"{theme['id'].replace('id_isl_', '').replace('sl_isl_', '')}_{diff[0].lower()}{counter}"
                out += f"      {{ id: {json.dumps(tid)}, title: {json.dumps(t[1])}, category: 'Islamic', difficulty: {json.dumps(t[0])}, text: {json.dumps(t[2])}, translation: {json.dumps(t[3])}, scenario: {json.dumps(t[4])} }},\n"
                counter += 1
            counter = 1
            
        out = out.rstrip(",\n") + "\n"
        out += "    ]\n"
        if i == len(data) - 1:
            out += "  }\n"
        else:
            out += "  },\n"
        
    out += "];\n"
    return out

with open('/Users/nurliafebriani/Downloads/lovspeak6/src/constants/shadowing_idioms_islamic.ts', 'w') as f:
    f.write(generate_file_content(idioms_data, True))

with open('/Users/nurliafebriani/Downloads/lovspeak6/src/constants/shadowing_slang_islamic.ts', 'w') as f:
    f.write(generate_file_content(slang_data, False))

print("Files generated successfully with json.dumps()")
