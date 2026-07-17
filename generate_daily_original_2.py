import json

themes_data = [
    {
        "id": "isl_mosque",
        "title": "Mosque & Community Life",
        "category": "Islamic",
        "icon": "fa-mosque",
        "description": "Phrases for engaging with your local mosque, attending halaqahs, and community service.",
        "tasks": [
            ("Easy", "Finding a Mosque", "Is there a mosque or a prayer room anywhere near the mall?", "Apa ada masjid atau ruang shalat di dekat mall ini?", "Mencari tempat shalat saat bepergian."),
            ("Easy", "Jum'ah Parking", "Parking for Friday prayers is always a nightmare. Let's go early.", "Parkir buat shalat Jumat itu selalu susah banget. Ayo berangkat awal.", "Mengingatkan teman agar datang lebih awal."),
            ("Easy", "Shoe Rack", "Just leave your shoes on the rack outside before entering the carpet area.", "Taruh aja sepatumu di rak luar sebelum masuk area karpet.", "Memberi tahu aturan di masjid pada teman."),
            ("Easy", "Mosque Announcement", "Did you hear the announcement about the community BBQ this weekend?", "Kamu dengar pengumuman soal acara BBQ komunitas akhir pekan ini nggak?", "Membahas acara masjid."),
            ("Easy", "Donation Box", "Do you have any small change? I want to put something in the donation box.", "Kamu punya uang receh nggak? Saya mau masukin sesuatu ke kotak amal.", "Bersedekah di masjid."),
            ("Medium", "Joining Halaqah", "Are you going to the Tafsir class after Maghrib tonight?", "Kamu mau ikut kajian Tafsir habis Maghrib nanti malam nggak?", "Mengajak teman ikut kajian rutin."),
            ("Medium", "Volunteering", "The mosque committee needs volunteers to help clean the carpets on Sunday.", "Takmir masjid butuh relawan buat bantu bersihin karpet hari Minggu.", "Mengajak kerja bakti di masjid."),
            ("Medium", "Meeting Imam", "I have a quick meeting with the Imam to ask him a question about Zakat.", "Saya ada janjian singkat dengan Imam buat nanya soal Zakat.", "Konsultasi agama dengan ustaz."),
            ("Medium", "Kids at Mosque", "It's okay if the kids are a bit noisy, they need to feel welcome at the mosque.", "Nggak apa-apa kalau anak-anak agak ribut, mereka harus merasa disambut di masjid.", "Bersikap toleran pada anak-anak di masjid."),
            ("Medium", "Community Support", "If anyone knows a brother looking for a job, let me know. My company is hiring.", "Kalau ada yang tahu saudara kita yang lagi cari kerja, kasih tahu saya ya. Perusahaan saya lagi buka lowongan.", "Saling bantu urusan duniawi di komunitas."),
            ("Hard", "Resolving Disputes", "The community leaders are trying to mediate the dispute between the two families.", "Para tokoh masyarakat sedang mencoba memediasi perselisihan antara dua keluarga itu.", "Peran masjid sebagai tempat islah (damai)."),
            ("Hard", "Inclusive Space", "We really need to make the sisters' prayer section larger and more comfortable.", "Kita benar-benar harus bikin area shalat akhwat jadi lebih luas dan nyaman.", "Mengkritik dan memberi saran perbaikan fasilitas."),
            ("Hard", "Youth Engagement", "If we don't create programs for the youth, they'll stop coming to the mosque entirely.", "Kalau kita nggak bikin program buat anak muda, mereka bakal berhenti datang ke masjid sama sekali.", "Tantangan dakwah anak muda."),
            ("Hard", "Mosque Board", "Running for the mosque board requires a lot of patience because people complain a lot.", "Mencalonkan diri jadi pengurus masjid itu butuh banyak sabar karena orang sering komplain.", "Realita menjadi pengurus/takmir masjid."),
            ("Hard", "Building Bridges", "Our mosque is hosting an open house to invite the neighbors and clear up misconceptions.", "Masjid kita ngadain 'open house' buat ngundang warga sekitar dan meluruskan salah paham.", "Dakwah ke masyarakat umum di sekitar masjid.")
        ]
    },
    {
        "id": "isl_sahaba",
        "title": "The Companions (Sahaba)",
        "category": "Islamic",
        "icon": "fa-users",
        "description": "Discussing the inspiring lives and sacrifices of the Prophet's companions.",
        "tasks": [
            ("Easy", "Abu Bakr's Loyalty", "Abu Bakr believed the Prophet instantly, without a single doubt.", "Abu Bakar langsung mempercayai Nabi, tanpa ragu sedikit pun.", "Membahas keimanan Abu Bakar As-Siddiq."),
            ("Easy", "Umar's Justice", "Umar was so strict but he was also incredibly just and fair to everyone.", "Umar itu sangat keras tapi beliau juga luar biasa adil ke semua orang.", "Mengagumi kepemimpinan Umar bin Khattab."),
            ("Easy", "Uthman's Modesty", "Even the angels felt shy around Uthman because he was so modest.", "Bahkan malaikat pun merasa malu di dekat Utsman karena beliau sangat pemalu/sopan.", "Mengingat sifat malu Utsman bin Affan."),
            ("Easy", "Ali's Bravery", "Ali sleeping in the Prophet's bed on the night of migration was so brave.", "Ali yang tidur di kasur Nabi pada malam hijrah itu berani banget.", "Kisah keberanian Ali bin Abi Thalib."),
            ("Easy", "Bilal's Voice", "I can't imagine how beautiful the Adhan must have sounded coming from Bilal.", "Saya nggak bisa ngebayangin seindah apa suara azan dari Bilal dulu.", "Membayangkan azan pertama Bilal."),
            ("Medium", "Khadijah's Support", "Khadijah was the first person to ever accept Islam. Her support was everything.", "Khadijah adalah orang pertama yang menerima Islam. Dukungannya adalah segalanya.", "Peran sentral Khadijah di awal kenabian."),
            ("Medium", "Aisha's Knowledge", "Aisha narrated so many Hadiths. She was a brilliant scholar at such a young age.", "Aisyah meriwayatkan banyak banget Hadis. Beliau adalah ulama cerdas di usia yang sangat muda.", "Membahas kecerdasan Aisyah r.a."),
            ("Medium", "Khalid's Strategy", "Khalid bin Walid was a military genius. He never lost a single battle.", "Khalid bin Walid adalah jenius militer. Beliau tidak pernah kalah dalam satu pertempuran pun.", "Kekaguman pada taktik perang Pedang Allah."),
            ("Medium", "Salman's Idea", "Digging the trench was actually Salman Al-Farsi's idea. The Prophet loved it.", "Menggali parit itu sebenarnya ide Salman Al-Farisi. Nabi sangat menyukainya.", "Sejarah Perang Khandaq."),
            ("Medium", "Abdurrahman's Wealth", "Abdurrahman bin Auf was super rich, but he spent almost all of it for Islam.", "Abdurrahman bin Auf itu super kaya, tapi dia menghabiskan hampir semuanya untuk Islam.", "Inspirasi pengusaha Muslim yang dermawan."),
            ("Hard", "Mus'ab's Sacrifice", "Mus'ab left a life of extreme luxury just to follow the Prophet and died with nothing.", "Mus'ab meninggalkan kehidupan sangat mewah hanya demi ikut Nabi dan wafat tanpa harta.", "Kisah pengorbanan mengharukan Mus'ab bin Umair."),
            ("Hard", "Humanity of Sahaba", "They weren't perfect angels; they made mistakes too, but their repentance was immediate.", "Mereka bukan malaikat sempurna; mereka juga buat salah, tapi taubat mereka sangat cepat.", "Memahami Sahabat sebagai manusia biasa yang bertakwa."),
            ("Hard", "Brotherhood in Madinah", "The way the Ansar shared half their wealth with the Muhajirun is just unprecedented in history.", "Cara kaum Ansar membagi separuh harta mereka dengan kaum Muhajirin itu belum pernah ada dalam sejarah.", "Solidaritas puncak di Madinah."),
            ("Hard", "Standing Firm", "Under unimaginable torture, Bilal just kept repeating 'Ahad, Ahad' (One, One).", "Di bawah siksaan yang tak terbayangkan, Bilal terus saja mengulang 'Ahad, Ahad' (Satu, Satu).", "Kekuatan akidah di tengah ujian berat."),
            ("Hard", "The Righteous Caliphs", "Studying the era of the Rightly Guided Caliphs teaches us the blueprint for a just society.", "Mempelajari era Khulafaur Rasyidin mengajarkan kita cetak biru untuk masyarakat yang adil.", "Relevansi sejarah untuk sistem politik modern.")
        ]
    },
    {
        "id": "isl_art",
        "title": "Islamic Art & History",
        "category": "Islamic",
        "icon": "fa-palette",
        "description": "Appreciating calligraphy, architecture, and the rich history of the Islamic world.",
        "tasks": [
            ("Easy", "Calligraphy Class", "I signed up for an Arabic calligraphy workshop this weekend.", "Saya daftar workshop kaligrafi Arab akhir pekan ini.", "Mencoba hobi baru bernuansa Islam."),
            ("Easy", "Mosque Design", "The dome and the minarets of this mosque look absolutely stunning.", "Kubah dan menara masjid ini kelihatan cantik banget.", "Memuji desain masjid."),
            ("Easy", "Museum Visit", "We saw some beautiful old Quran manuscripts at the museum today.", "Kami lihat beberapa manuskrip Al-Quran kuno yang indah di museum hari ini.", "Kunjungan ke pameran seni Islam."),
            ("Easy", "Geometric Patterns", "I love how Islamic art uses geometric patterns instead of drawing people.", "Saya suka gimana seni Islam pakai pola geometris alih-alih menggambar orang.", "Kekaguman pada ciri khas seni Islam."),
            ("Easy", "Historical Trip", "I really want to visit Andalusia in Spain to see the Islamic architecture there.", "Saya pengen banget ke Andalusia di Spanyol buat lihat arsitektur Islam di sana.", "Rencana liburan sejarah."),
            ("Medium", "The Alhambra", "The details in the Alhambra palace show how advanced their architecture was.", "Detail di istana Alhambra menunjukkan betapa majunya arsitektur mereka dulu.", "Mendiskusikan kejayaan Islam di Spanyol."),
            ("Medium", "Avoiding Pictures", "We avoid hanging pictures with faces in the house, so we use calligraphy art instead.", "Kami menghindari pajang foto berwajah di rumah, jadi kami pakai seni kaligrafi.", "Menerapkan adab menghias rumah Islami."),
            ("Medium", "Ottoman Mosques", "The mosques built by the Ottomans in Turkey are just on another level.", "Masjid-masjid yang dibangun Kesultanan Utsmaniyah di Turki itu benar-benar levelnya beda.", "Kekaguman pada arsitek Mimar Sinan."),
            ("Medium", "Reading History", "If you don't know your history, you won't understand why the Middle East is like this today.", "Kalau kamu nggak tahu sejarahmu, kamu nggak bakal paham kenapa Timur Tengah jadi seperti ini sekarang.", "Pentingnya belajar sejarah kekhalifahan."),
            ("Medium", "Salahuddin's Chivalry", "Even his European enemies respected Salahuddin because he was so honorable in war.", "Bahkan musuh Eropanya menghormati Salahuddin karena beliau sangat terhormat dalam perang.", "Membahas tokoh pahlawan Islam."),
            ("Hard", "Art as Devotion", "For Muslim artists back then, writing the Quran beautifully was an act of worship, not just art.", "Bagi seniman Muslim dulu, menulis Al-Quran dengan indah adalah bentuk ibadah, bukan sekadar seni.", "Makna filosofis kaligrafi."),
            ("Hard", "The Fall of Baghdad", "The Mongols destroying the library in Baghdad was a devastating loss for human knowledge.", "Mongol yang menghancurkan perpustakaan di Baghdad adalah kerugian luar biasa bagi ilmu pengetahuan manusia.", "Mengenang tragedi runtuhnya Baitul Hikmah."),
            ("Hard", "Preserving Heritage", "We need to do a better job of preserving our historical sites before they turn into hotels.", "Kita harus lebih baik dalam menjaga situs sejarah kita sebelum semuanya berubah jadi hotel.", "Kritik terhadap penghancuran situs bersejarah di tanah suci."),
            ("Hard", "Cultural Blending", "You can see how Islamic architecture blended with local cultures in places like China and Mali.", "Kamu bisa lihat gimana arsitektur Islam berpadu dengan budaya lokal di tempat seperti China dan Mali.", "Bukti universalitas Islam."),
            ("Hard", "Learning from the Past", "History isn't just dates; it's learning how past empires fell when they abandoned justice.", "Sejarah bukan cuma soal tanggal; ini soal belajar gimana kerajaan masa lalu runtuh saat mereka meninggalkan keadilan.", "Mengambil ibrah (pelajaran) dari kejatuhan umat terdahulu.")
        ]
    },
    {
        "id": "isl_finance",
        "title": "Halal Finance & Business",
        "category": "Islamic",
        "icon": "fa-coins",
        "description": "Navigating modern life while avoiding Riba (interest) and earning Halal income.",
        "tasks": [
            ("Easy", "Halal Income", "I turned down the job because the company sells alcohol. I want my income to be halal.", "Saya tolak pekerjaan itu karena perusahaannya jual alkohol. Saya ingin penghasilan saya halal.", "Menolak tawaran kerja karena prinsip agama."),
            ("Easy", "Paying Zakat", "Don't forget we have to calculate and pay our Zakat before the end of the year.", "Jangan lupa kita harus ngitung dan bayar Zakat kita sebelum akhir tahun.", "Mengingatkan kewajiban Zakat Maal."),
            ("Easy", "Avoiding Riba", "I'm saving up cash to buy a car because I really want to avoid car loans with interest.", "Saya nabung uang tunai buat beli mobil karena saya benar-benar ingin menghindari kredit mobil berbunga.", "Prinsip menghindari riba dalam cicilan."),
            ("Easy", "Honest Business", "The Prophet said an honest merchant will be with the prophets on Judgment Day.", "Nabi bersabda pedagang yang jujur akan bersama para nabi di Hari Kiamat.", "Prinsip kejujuran dalam berdagang."),
            ("Easy", "Charity Habit", "Try to set aside a small percentage of your salary for charity every month.", "Coba sisihkan persentase kecil dari gajimu untuk sedekah setiap bulan.", "Kebiasaan sedekah rutin."),
            ("Medium", "Halal Mortgage", "Do you know any Islamic banks that offer genuine halal mortgages around here?", "Kamu tahu bank syariah yang nawarin KPR halal sungguhan di sekitar sini nggak?", "Mencari opsi pembiayaan rumah bebas riba."),
            ("Medium", "Student Loans", "Taking out student loans with interest is a huge dilemma for Muslim students right now.", "Mengambil pinjaman mahasiswa berbunga itu dilema besar buat mahasiswa Muslim sekarang.", "Tantangan biaya pendidikan bagi Muslim."),
            ("Medium", "Stock Investment", "I use an app that screens my stock portfolio to make sure I only invest in halal companies.", "Saya pakai aplikasi yang menyaring portofolio saham saya untuk memastikan saya cuma investasi di perusahaan halal.", "Investasi saham syariah."),
            ("Medium", "Paying Debts", "I need to pay off my debts first before I can save up for the Umrah trip.", "Saya harus lunasin utang-utang saya dulu sebelum bisa nabung buat perjalanan Umrah.", "Prioritas melunasi utang."),
            ("Medium", "Fair Wages", "Paying your employees on time and fairly is an Islamic obligation, not just good business.", "Membayar karyawanmu tepat waktu dan adil itu kewajiban Islam, bukan sekadar bisnis yang bagus.", "Etika menggaji karyawan (Qabul Amal)."),
            ("Hard", "Credit Card Trap", "I strictly pay off my credit card in full every month so I never get hit with late fees and interest.", "Saya ketat melunasi kartu kredit saya penuh tiap bulan agar tidak pernah kena denda keterlambatan dan bunga.", "Strategi memakai kartu kredit tanpa kena riba."),
            ("Hard", "Inheritance Law", "Dividing the inheritance strictly by Shariah law caused some tension, but it's the right thing to do.", "Membagi warisan ketat sesuai hukum Syariat menyebabkan sedikit ketegangan, tapi itu hal yang benar untuk dilakukan.", "Sensitivitas pembagian warisan (Faraid)."),
            ("Hard", "Islamic Banking Critique", "Some people argue that Islamic banks are just doing conventional banking disguised with Arabic terms.", "Sebagian orang berargumen bahwa bank syariah cuma melakukan perbankan konvensional yang disamarkan dengan istilah Arab.", "Kritis terhadap praktik perbankan syariah."),
            ("Hard", "Cryptocurrency Debate", "Scholars are still debating whether trading cryptocurrencies is considered halal or a form of gambling.", "Para ulama masih berdebat apakah trading mata uang kripto itu dianggap halal atau bentuk perjudian (Gharar).", "Membahas hukum aset digital modern."),
            ("Hard", "Barakah in Wealth", "A smaller income with Barakah (blessing) goes much further than a huge salary earned through haram means.", "Gaji kecil yang ada Barakah-nya jauh lebih awet daripada gaji besar yang didapat dari jalan haram.", "Konsep keberkahan dalam rezeki.")
        ]
    },
    {
        "id": "isl_dawah",
        "title": "Dawah & Sharing Islam",
        "category": "Islamic",
        "icon": "fa-bullhorn",
        "description": "Explaining Islam to non-Muslim friends and correcting misconceptions respectfully.",
        "tasks": [
            ("Easy", "Answering Questions", "My coworker asked why I don't eat pork, so I explained it to him over lunch.", "Teman kerjaku tanya kenapa aku nggak makan babi, jadi aku jelaskan ke dia pas makan siang.", "Menjawab pertanyaan sederhana dari non-Muslim."),
            ("Easy", "Giving a Gift", "I gave my neighbor an English translation of the Quran as a gift.", "Saya kasih tetangga saya terjemahan Al-Quran bahasa Inggris sebagai hadiah.", "Membagikan Al-Quran terjemahan."),
            ("Easy", "Open Mosque Day", "Our local mosque is having an open day for non-Muslims to come and ask questions.", "Masjid lokal kita ngadain 'open day' buat non-Muslim datang dan bertanya.", "Mengundang warga ke acara masjid."),
            ("Easy", "Leading by Example", "The best Dawah is just being a good person and showing excellent manners.", "Dakwah terbaik itu ya dengan menjadi orang baik dan menunjukkan akhlak luar biasa.", "Prinsip dakwah bil hal (melalui perbuatan)."),
            ("Easy", "Clarifying Fasting", "No, not even water. That's usually the first thing people ask about fasting.", "Nggak, bahkan air pun nggak boleh. Itu biasanya hal pertama yang orang tanyakan soal puasa.", "Menjelaskan aturan puasa ke teman kantor."),
            ("Medium", "Discussing Jesus", "Many Christians are surprised when I tell them how much Muslims love and revere Jesus.", "Banyak orang Kristen kaget saat saya kasih tahu seberapa besar Muslim mencintai dan menghormati Yesus (Nabi Isa).", "Membangun jembatan dialog lintas agama."),
            ("Medium", "Hijab Misconception", "I had to explain that wearing the hijab is my own choice and not a sign of oppression.", "Saya harus jelaskan bahwa memakai hijab itu pilihan saya sendiri dan bukan tanda penindasan.", "Meluruskan stigma tentang jilbab."),
            ("Medium", "Handling Hate", "When someone makes an Islamophobic comment, getting angry usually just proves their stereotype right.", "Saat ada yang bikin komentar Islamofobia, marah-marah biasanya cuma membenarkan stereotip mereka.", "Cara elegan merespon kebencian/Islamofobia."),
            ("Medium", "Inviting to Iftar", "I invited my non-Muslim classmates to Iftar so they could experience the vibe.", "Saya undang teman sekelas yang non-Muslim ke buka puasa biar mereka bisa rasakan suasananya.", "Menggunakan momen Ramadan untuk dakwah."),
            ("Medium", "Explaining Tawheed", "It's all about pure monotheism. We believe God has no partners and no son.", "Ini murni soal monoteisme murni. Kami percaya Tuhan tidak punya sekutu dan tidak punya anak.", "Menjelaskan konsep inti Tauhid."),
            ("Hard", "Debating Gently", "You can win a debate but lose a heart. We must argue with wisdom and beautiful preaching.", "Kamu bisa menang debat tapi kehilangan hati orangnya. Kita harus berdebat dengan hikmah dan tutur kata yang baik.", "Mengingatkan adab dalam berdebat agama."),
            ("Hard", "Supporting Reverts", "When someone converts to Islam, they often lose their family support. The community needs to step in.", "Saat seseorang masuk Islam, mereka sering kehilangan dukungan keluarga. Komunitas harus turun tangan.", "Tanggung jawab merawat Mualaf."),
            ("Hard", "Media Stereotypes", "It's exhausting having to constantly apologize for the actions of extremists that have nothing to do with Islam.", "Sangat melelahkan harus terus-menerus minta maaf atas tindakan ekstremis yang sama sekali nggak ada hubungannya dengan Islam.", "Keluhan Muslim minoritas melawan framing media."),
            ("Hard", "The Status of Women", "Actually, Islam gave women the right to own property and seek divorce centuries before Europe did.", "Sebenarnya, Islam memberi wanita hak memiliki harta dan meminta cerai berabad-abad sebelum Eropa melakukannya.", "Menjelaskan sejarah hak-hak perempuan dalam Islam."),
            ("Hard", "Firm Boundaries", "I respect your beliefs, but please don't disrespect the Prophet in front of me.", "Saya menghormati keyakinanmu, tapi tolong jangan merendahkan Nabi di depan saya.", "Memberi batasan tegas saat agama dihina.")
        ]
    },
    {
        "id": "isl_environment",
        "title": "Environment & Nature",
        "category": "Islamic",
        "icon": "fa-leaf",
        "description": "Discussions on eco-friendliness, avoiding waste, and our duty as stewards of Earth.",
        "tasks": [
            ("Easy", "Wasting Water", "Don't leave the tap running while you make Wudhu. That's wasting water.", "Jangan biarkan kerannya nyala terus pas kamu wudhu. Itu buang-buang air.", "Mengingatkan agar hemat air saat wudhu."),
            ("Easy", "Planting Trees", "The Prophet said planting a tree is considered an ongoing charity (Sadaqah Jariyah).", "Nabi bilang menanam pohon itu dianggap sebagai sedekah jariyah.", "Motivasi menanam pohon/berkebun."),
            ("Easy", "Littering", "Please throw that in the trash. Keeping the environment clean is part of faith.", "Tolong buang itu di tempat sampah. Menjaga kebersihan lingkungan itu sebagian dari iman.", "Menegur teman yang buang sampah sembarangan."),
            ("Easy", "Food Waste", "Take only what you can eat. Throwing away food is a sin.", "Ambil secukupnya saja. Membuang-buang makanan itu dosa.", "Peringatan saat mengambil makanan prasmanan."),
            ("Easy", "Enjoying Nature", "Looking at the mountains always makes me say Subhanallah.", "Melihat gunung selalu bikin saya refleks bilang Subhanallah.", "Mentadabburi ciptaan Allah di alam bebas."),
            ("Medium", "Eco-Friendly Mosque", "Our mosque just installed solar panels to reduce the electricity bill and be more eco-friendly.", "Masjid kita baru pasang panel surya buat ngurangin tagihan listrik dan lebih ramah lingkungan.", "Inovasi hijau di fasilitas umum umat."),
            ("Medium", "Plastic Waste", "I started bringing my own bag to the grocery store. We use way too much plastic.", "Saya mulai bawa tas sendiri ke swalayan. Kita pakai terlalu banyak plastik.", "Kesadaran mengurangi sampah plastik."),
            ("Medium", "Animal Rights", "A woman went to hell for starving a cat. Islam takes animal rights very seriously.", "Seorang wanita masuk neraka karena menelantarkan kucing. Islam sangat serius soal hak hewan.", "Mengingatkan adab pada binatang peliharaan."),
            ("Medium", "Ramadan Waste", "The amount of food wasted during Iftar buffets is honestly heartbreaking.", "Jumlah makanan yang dibuang saat prasmanan buka puasa itu sejujurnya sangat menyedihkan.", "Kritik terhadap budaya mubazir saat puasa."),
            ("Medium", "Steward of Earth", "Allah made us Khalifah (stewards) of the Earth, which means we have to protect it.", "Allah menjadikan kita Khalifah (pengurus) di bumi, yang berarti kita harus melindunginya.", "Mengingatkan fungsi manusia memakmurkan bumi."),
            ("Hard", "Overconsumption", "The modern culture of buying things we don't need totally contradicts Islamic moderation.", "Budaya modern membeli barang yang nggak kita butuh itu benar-benar bertentangan dengan kesederhanaan Islam.", "Mengkritik gaya hidup konsumtif."),
            ("Hard", "Climate Change", "If the ice caps melt and cities flood, the poorest communities will suffer the most, which is an injustice we must fight.", "Kalau es mencair dan kota-kota banjir, komunitas termiskin yang paling menderita, yang mana itu ketidakadilan yang harus kita lawan.", "Diskusi kepedulian perubahan iklim dari kacamata keadilan."),
            ("Hard", "Green Zakat", "Some charities are now using Zakat money to dig wells and install water purifiers in remote villages.", "Beberapa lembaga amal sekarang pakai uang Zakat buat gali sumur dan pasang penjernih air di desa terpencil.", "Membahas pemanfaatan dana umat untuk isu krisis air."),
            ("Hard", "Ethical Meat", "I'm trying to eat less meat, and when I do, I make sure the animal was raised ethically, not just slaughtered halal.", "Saya nyoba kurangi makan daging, dan kalau makan, saya pastikan hewannya diternak dengan etis (tayyib), bukan cuma disembelih halal.", "Konsep Halalan Thayyiban pada industri daging massal."),
            ("Hard", "Balance of Nature", "The Quran talks about the 'Mizan' or balance; human greed is destroying the natural balance Allah created.", "Al-Quran bahas soal 'Mizan' atau keseimbangan; keserakahan manusia sedang menghancurkan keseimbangan alam yang Allah ciptakan.", "Tafsir ayat keseimbangan alam (ekologi).")
        ]
    },
    {
        "id": "isl_science_legacy",
        "title": "Muslim Science Legacy",
        "category": "Islamic",
        "icon": "fa-microscope",
        "description": "Chatting about the historical contributions of Muslims to science and technology.",
        "tasks": [
            ("Easy", "Algebra Roots", "I hated Algebra in school, until I found out a Muslim scholar named Al-Khwarizmi invented it.", "Saya benci Aljabar di sekolah, sampai saya tahu ternyata ulama Muslim bernama Al-Khawarizmi yang menemukannya.", "Candaan ringan tentang penemu matematika."),
            ("Easy", "Coffee Origin", "If scholars in Yemen didn't invent coffee to stay up for night prayers, how would we survive Mondays?", "Kalau ulama di Yaman nggak nemuin kopi buat begadang shalat malam, gimana kita bisa selamat lewat hari Senin?", "Fakta sejarah yang nyambung ke kehidupan ngantor."),
            ("Easy", "Surgical Tools", "It's crazy that many surgical tools doctors use today were designed by a Muslim surgeon a thousand years ago.", "Gila ya, banyak alat bedah yang dipakai dokter hari ini didesain sama ahli bedah Muslim seribu tahun lalu.", "Kekaguman pada Ibnu Sina / Al-Zahrawi."),
            ("Easy", "First University", "Did you know the oldest existing university in the world was founded by a Muslim woman in Morocco?", "Tahu nggak universitas tertua di dunia yang masih ada itu didirikan oleh wanita Muslim di Maroko?", "Membahas Fatima al-Fihri dan pentingnya pendidikan wanita."),
            ("Easy", "Optics", "Without Ibn al-Haytham studying how light works, we wouldn't have cameras today.", "Tanpa Ibnu al-Haytham yang belajar cara kerja cahaya, kita nggak bakal punya kamera hari ini.", "Menyadari peran penemu kamera (Kamera Obscura)."),
            ("Medium", "House of Wisdom", "Imagine reading books at the House of Wisdom in Baghdad back in the day. Must have been awesome.", "Bayangin baca buku di Baitul Hikmah di Baghdad zaman dulu. Pasti keren banget.", "Bicara soal masa keemasan Islam."),
            ("Medium", "Medical Canon", "Ibn Sina's medical book was the standard textbook in Europe for hundreds of years. That's insane.", "Buku kedokteran Ibnu Sina jadi buku teks standar di Eropa selama ratusan tahun. Itu gila sih.", "Mendiskusikan pengaruh kitab Qanun fi At-Tibb."),
            ("Medium", "Aviation Pioneer", "The Wright brothers are famous, but Abbas ibn Firnas tried to fly centuries before them in Spain.", "Wright bersaudara memang terkenal, tapi Abbas bin Firnas mencoba terbang berabad-abad sebelum mereka di Spanyol.", "Membahas pionir penerbangan pertama."),
            ("Medium", "Hygiene Focus", "While Europe was in the Dark Ages, Muslims were building public baths because cleanliness is half of faith.", "Saat Eropa di Abad Pertengahan, umat Muslim membangun pemandian umum karena kebersihan adalah sebagian iman.", "Hubungan antara syariat wudhu dan sanitasi publik."),
            ("Medium", "Sociology Father", "I'm reading Ibn Khaldun's Muqaddimah. The guy basically invented sociology and economics.", "Saya lagi baca Muqaddimah Ibnu Khaldun. Orang ini pada dasarnya yang nemuin sosiologi dan ekonomi.", "Membahas bapak ilmu sosial."),
            ("Hard", "Faith and Science", "Back then, studying science wasn't seen as opposite to religion; it was a way to understand God's creation.", "Zaman dulu, belajar sains nggak dilihat bertentangan dengan agama; itu adalah cara untuk memahami ciptaan Tuhan.", "Diskusi integrasi ilmu dan agama."),
            ("Hard", "Lost History", "It's sad how our school history books completely skip over the Islamic Golden Age.", "Sedih rasanya gimana buku sejarah sekolah kita benar-benar melompati Masa Keemasan Islam.", "Mengeluhkan kurikulum sejarah yang Euro-sentris."),
            ("Hard", "Astrolabe Tech", "Muslims perfected the astrolabe not just for navigation, but to accurately determine prayer times and the Qibla.", "Umat Muslim menyempurnakan astrolab bukan cuma buat navigasi, tapi untuk menentukan waktu shalat dan arah kiblat dengan akurat.", "Dorongan ibadah yang memicu penemuan teknologi."),
            ("Hard", "Intellectual Decline", "Why did the scientific output in the Muslim world decline? Was it politics, or did we lose the passion for knowledge?", "Kenapa hasil karya sains di dunia Muslim menurun? Apa karena politik, atau kita yang hilang hasrat akan ilmu?", "Diskusi berat tentang kemunduran intelektual umat."),
            ("Hard", "Reviving the Spirit", "We don't need to just brag about the past; we need to revive that spirit of innovation in the modern Ummah.", "Kita nggak perlu cuma pamer masa lalu; kita harus membangkitkan kembali semangat inovasi itu di Umat modern.", "Kesimpulan motivasi ke depan.")
        ]
    },
    {
        "id": "isl_family_first",
        "title": "Family & Household",
        "category": "Islamic",
        "icon": "fa-home",
        "description": "Conversations about marriage, raising kids, and treating parents with respect.",
        "tasks": [
            ("Easy", "Greeting Parents", "Always kiss your mother's hand before you leave the house.", "Selalu cium tangan ibumu sebelum kamu keluar rumah.", "Adab harian pada orang tua."),
            ("Easy", "Helping at Home", "The Prophet used to mend his own clothes. Helping out at home is Sunnah, guys.", "Nabi dulu biasa menjahit bajunya sendiri. Bantuin kerjaan rumah itu Sunnah lho, teman-teman.", "Mengingatkan suami/anak laki-laki untuk mandiri."),
            ("Easy", "Eating Together", "Let's all sit down and eat dinner together. Food eaten together is more blessed.", "Ayo semuanya duduk dan makan malam bareng. Makanan yang dimakan bersama itu lebih berkah.", "Membangun kehangatan meja makan keluarga."),
            ("Easy", "Saying I Love You", "Don't be shy to tell your parents you love them. Time is short.", "Jangan malu bilang ke orang tuamu kalau kamu sayang mereka. Waktu itu singkat.", "Menasihati teman agar mengekspresikan kasih sayang."),
            ("Easy", "Waking for Fajr", "Can you wake me up for Fajr tomorrow? Splash some water on me if you have to.", "Bisa bangunin aku buat Subuh besok nggak? Cipratin air aja ke aku kalau terpaksa.", "Saling bantu bangun shalat antar saudara/suami-istri."),
            ("Medium", "Spouse Support", "Marriage is a partnership. The Quran says spouses are like garments for each other.", "Pernikahan itu kemitraan. Al-Quran bilang pasangan suami istri itu seperti pakaian bagi satu sama lain.", "Membahas konsep saling melengkapi dan melindungi dalam rumah tangga."),
            ("Medium", "Screen Time for Kids", "We try to limit the kids' iPad time and make them listen to Quran stories instead.", "Kami nyoba batasi waktu main iPad anak-anak dan nyuruh mereka dengar kisah Quran sebagai gantinya.", "Aturan parenting digital."),
            ("Medium", "Patience with Elderly", "Taking care of sick parents is exhausting, but it's a direct ticket to Jannah.", "Merawat orang tua yang sakit itu melelahkan, tapi itu tiket langsung ke Surga.", "Penyemangat bagi yang merawat orang tua sepuh (Birrul Walidain)."),
            ("Medium", "Resolving Fights", "Don't go to sleep angry at your husband. Resolve it before the day ends.", "Jangan tidur dalam keadaan marah pada suamimu. Selesaikan sebelum hari berakhir.", "Nasihat meredam konflik rumah tangga."),
            ("Medium", "Choosing a Name", "We want to name the baby something meaningful, maybe after a Sahaba.", "Kami mau kasih nama bayi sesuatu yang bermakna, mungkin nama salah satu Sahabat Nabi.", "Bicara persiapan kelahiran anak."),
            ("Hard", "Answering Kids' Questions", "When my son asks 'Where is Allah?', I have to answer him carefully using simple logic.", "Saat anak cowokku nanya 'Allah di mana?', aku harus jawab hati-hati pakai logika sederhana.", "Tantangan menanamkan tauhid pada balita."),
            ("Hard", "In-Law Boundaries", "It's important to respect your in-laws, but the couple also needs their own private space.", "Penting menghormati mertua, tapi pasangan juga butuh ruang pribadi mereka sendiri.", "Membahas isu sensitif batasan dengan mertua."),
            ("Hard", "Divorce Stigma", "We need to stop treating divorced sisters like outcasts in the community.", "Kita harus berhenti memperlakukan janda seperti orang buangan di komunitas.", "Kritik budaya yang menyudutkan perceraian."),
            ("Hard", "Balancing Work and Family", "Providing halal food is important, but if you're never home, you're failing as a father.", "Menyediakan makanan halal itu penting, tapi kalau kamu nggak pernah di rumah, kamu gagal sebagai ayah.", "Peringatan agar tidak gila kerja (workaholic)."),
            ("Hard", "Toxic Relatives", "Silaturahim is an obligation, but you are allowed to keep a safe distance from toxic relatives to protect your mental health.", "Silaturahim itu wajib, tapi kamu diizinkan menjaga jarak aman dari kerabat yang toxic demi melindungi kesehatan mentalmu.", "Fiqih menyambung tali silaturahim dengan kerabat yang menyakiti.")
        ]
    }
]

def generate_file_content(data):
    out = "import { ShadowingTheme } from './shadowingData';\n\n"
    out += "export const DAILY_ISLAMIC_ORIGINAL_THEMES_2: ShadowingTheme[] = [\n"
    
    for i, theme in enumerate(data):
        out += "  {\n"
        out += f"    id: {json.dumps(theme['id'])},\n"
        out += f"    title: {json.dumps(theme['title'])},\n"
        out += f"    category: {json.dumps(theme['category'])},\n"
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
                tid = f"{theme['id'].replace('isl_', '')}_{diff[0].lower()}{counter}"
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

with open('/Users/nurliafebriani/Downloads/lovspeak6/src/constants/shadowing_daily_islamic_original_2.ts', 'w') as f:
    f.write(generate_file_content(themes_data))

print("Part 2 generated successfully.")
