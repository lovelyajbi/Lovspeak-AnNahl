import json

themes_data = [
    {
        "id": "isl_salah",
        "title": "Daily Salah & Prayer",
        "category": "Islamic",
        "icon": "fa-kaaba",
        "description": "Practical phrases for daily prayers, mosque etiquette, and spiritual mindfulness.",
        "tasks": [
            ("Easy", "Checking Prayer Time", "Do you have a prayer app? I'm not sure if Maghrib has entered yet.", "Kamu punya aplikasi jadwal shalat? Saya kurang yakin apa sudah masuk Maghrib.", "Bertanya jadwal shalat pada teman."),
            ("Easy", "Inviting to Pray", "I just heard the Adhan. Let's go to the prayer room together.", "Saya baru dengar adzan. Ayo kita ke ruang shalat bareng.", "Mengajak teman shalat berjamaah."),
            ("Easy", "Asking for the Qibla", "Excuse me, could you point me to the Qibla direction?", "Permisi, bisa tolong tunjukkan arah kiblat?", "Bertanya arah kiblat di tempat asing."),
            ("Easy", "Making Wudu", "Give me a second, I just need to renew my Wudhu real quick.", "Tunggu sebentar ya, saya mau perbarui wudhu sebentar.", "Meminta izin untuk berwudhu."),
            ("Easy", "Joining Row", "Is there enough room for me to squeeze in this row?", "Apa masih ada ruang buat saya nyempil di barisan ini?", "Meminta izin masuk shaf shalat."),
            ("Medium", "Turn Off Phone", "Hey, don't forget to put your phone on silent before the Imam starts.", "Hei, jangan lupa di-silent HP-nya sebelum Imam mulai.", "Mengingatkan teman menonaktifkan HP."),
            ("Medium", "Masjid Opening", "Do you know if the mosque is open for Dhuhr during weekdays?", "Kamu tahu nggak apa masjidnya buka buat shalat Dzuhur di hari kerja?", "Menanyakan jam operasional masjid lokal."),
            ("Medium", "Friday Sermon", "That Khutbah was exactly what I needed to hear today.", "Khutbah tadi benar-benar yang sedang saya butuhkan hari ini.", "Membahas khutbah Jumat sesudahnya."),
            ("Medium", "Sunnah Prayers", "I'm trying to build a habit of praying the two Rakahs before Fajr.", "Saya lagi nyoba bangun kebiasaan shalat dua rakaat sebelum Subuh.", "Menceritakan target ibadah harian."),
            ("Medium", "Maintaining Focus", "My focus in Salah has been terrible lately. My mind keeps wandering.", "Fokus shalat saya lagi jelek banget belakangan ini. Pikiran saya ke mana-mana.", "Curhat tentang susahnya khusyuk."),
            ("Hard", "Tahajjud Struggle", "I set five alarms for Tahajjud, but I still end up sleeping right through them.", "Saya pasang lima alarm buat Tahajjud, tapi ujung-ujungnya tetap aja kebablasan tidur.", "Membahas susahnya bangun malam."),
            ("Hard", "Learning Recitation", "I recently joined a Tajweed class to fix my pronunciation of Surah Al-Fatihah.", "Saya baru aja ikut kelas Tajwid buat perbaiki pelafalan Surah Al-Fatihah saya.", "Bercerita tentang upaya memperbaiki bacaan."),
            ("Hard", "Prayer Apparel", "Do you happen to have a clean prayer mat I could borrow for Asr?", "Apa kamu kebetulan punya sajadah bersih yang bisa saya pinjam buat Ashar?", "Meminjam perlengkapan shalat dengan sopan."),
            ("Hard", "Dhikr Routine", "Instead of rushing out, let's sit and do our post-prayer Dhikr for a minute.", "Daripada buru-buru keluar, ayo duduk dan dzikir setelah shalat sebentar.", "Mengajak teman berzikir sejenak."),
            ("Hard", "Connecting with Allah", "Whenever I feel overwhelmed with work, praying just resets my whole mindset.", "Tiap kali saya merasa mumet dengan pekerjaan, shalat benar-benar me-reset pola pikir saya.", "Menjelaskan manfaat psikologis dari shalat.")
        ]
    },
    {
        "id": "isl_ramadan",
        "title": "Ramadan & Fasting",
        "category": "Islamic",
        "icon": "fa-moon",
        "description": "Conversations about fasting, suhoor, iftar, and the spirit of Ramadan.",
        "tasks": [
            ("Easy", "Checking the Calendar", "Can you believe Ramadan is only two weeks away?", "Bisa percaya nggak Ramadan tinggal dua minggu lagi?", "Menyambut kedatangan bulan suci."),
            ("Easy", "Asking if Fasting", "Oh sorry, I didn't mean to eat in front of you. Are you fasting?", "Oh maaf, saya nggak bermaksud makan di depanmu. Kamu lagi puasa?", "Meminta maaf karena makan di depan orang puasa."),
            ("Easy", "Iftar Invitation", "We're hosting an Iftar dinner this Saturday. You should definitely come!", "Kami mau ngadain buka puasa bersama Sabtu ini. Kamu harus datang ya!", "Mengundang teman buka puasa."),
            ("Easy", "Suhoor Routine", "I completely overslept and missed Suhoor this morning.", "Saya benar-benar ketiduran dan kelewatan sahur pagi ini.", "Bercerita telat sahur."),
            ("Easy", "Breaking the Fast", "Pass me the dates, please. I'm so ready to break my fast.", "Tolong oper kurmanya dong. Saya udah siap banget buat buka puasa.", "Suasana menjelang adzan maghrib."),
            ("Medium", "Ramadan Mubarak", "Ramadan Mubarak! May Allah make fasting easy for you and your family.", "Ramadan Mubarak! Semoga Allah mudahkan puasamu dan keluargamu.", "Ucapan selamat menyambut Ramadan."),
            ("Medium", "Taraweeh Prayer", "Are we praying eight or twenty Rakahs for Taraweeh tonight?", "Kita mau shalat Tarawih delapan atau dua puluh rakaat malam ini?", "Bertanya soal jumlah rakaat tarawih."),
            ("Medium", "Counting Down", "Don't look at the clock, it only makes the fasting feel longer.", "Jangan lihat jam terus, itu cuma bikin puasa terasa lebih lama.", "Menasihati teman yang nggak sabar nunggu maghrib."),
            ("Medium", "Staying Hydrated", "Make sure you drink plenty of water at Suhoor so you don't get dehydrated.", "Pastikan kamu minum banyak air pas sahur biar nggak dehidrasi.", "Mengingatkan tips puasa sehat."),
            ("Medium", "Potluck Planning", "Let's do a potluck for Iftar. I'll bring the main dish, and you bring dessert.", "Kita potluck aja buat buka puasa. Saya bawa makanan utama, kamu bawa dessert ya.", "Merencanakan buka puasa bersama."),
            ("Hard", "Mindful Character", "Fasting isn't just about food; I'm really trying to control my temper this month.", "Puasa itu bukan cuma soal makanan; saya benar-benar lagi nyoba nahan emosi bulan ini.", "Membahas esensi menahan hawa nafsu."),
            ("Hard", "Sleep Schedule", "My sleep schedule is completely messed up between Taraweeh and Suhoor.", "Jadwal tidur saya benar-benar berantakan antara Tarawih dan Sahur.", "Mengeluhkan jadwal tidur selama Ramadan."),
            ("Hard", "Quran Goal", "I'm trying to read one Juz a day so I can finish the Quran by Eid.", "Saya nyoba baca satu Juz sehari biar bisa khatam Al-Quran pas Lebaran.", "Membahas target tadarus."),
            ("Hard", "Laylatul Qadr", "Let's try to stay at the mosque until Fajr to catch Laylatul Qadr.", "Ayo kita coba diam di masjid sampai Subuh untuk mencari Lailatul Qadar.", "Mengajak I'tikaf di malam ganjil."),
            ("Hard", "Charity Drive", "We're collecting donations for the food bank to distribute before Eid.", "Kami lagi ngumpulin donasi buat bank makanan untuk dibagikan sebelum Lebaran.", "Berdonasi di bulan suci.")
        ]
    },
    {
        "id": "isl_hajj",
        "title": "Hajj & Umrah Journey",
        "category": "Islamic",
        "icon": "fa-kaaba",
        "description": "Practical discussions about going on pilgrimage, visas, and preparations.",
        "tasks": [
            ("Easy", "Dreaming of Umrah", "I'm saving up so I can take my parents for Umrah next year.", "Saya lagi nabung biar bisa bawa orang tua saya pergi Umrah tahun depan.", "Niat menabung untuk ibadah Umrah."),
            ("Easy", "Booking Tickets", "Have you found any good travel agencies for the Umrah package?", "Kamu udah nemu agen travel yang bagus buat paket Umrah?", "Mencari info biro perjalanan."),
            ("Easy", "Ihram Attire", "Where can I buy a good quality Ihram towel around here?", "Di mana saya bisa beli kain Ihram yang kualitasnya bagus di sekitar sini?", "Mencari perlengkapan haji/umrah."),
            ("Easy", "Kaaba First Look", "I cried the first time I saw the Kaaba with my own eyes.", "Saya menangis pertama kali melihat Ka'bah dengan mata kepala sendiri.", "Menceritakan momen mengharukan di Masjidil Haram."),
            ("Easy", "Making Dua", "Please keep me in your Duas when you're standing in front of the Kaaba.", "Tolong sertakan saya dalam doamu saat kamu berdiri di depan Ka'bah ya.", "Meminta didoakan oleh teman yang akan berangkat."),
            ("Medium", "Zamzam Water", "Could you bring back a small bottle of Zamzam water for my mom?", "Bisa tolong bawakan sebotol kecil air Zamzam buat ibuku?", "Titip air Zamzam."),
            ("Medium", "Walking for Sa-y", "Make sure you wear comfortable shoes for the Sa'y, it's a lot of walking.", "Pastikan pakai sepatu yang nyaman buat Sa'i, itu jalannya lumayan jauh lho.", "Saran praktis menghadapi rute Sa'i."),
            ("Medium", "Pilgrim Status", "My parents arrived safely in Madinah. They sent some pictures this morning.", "Orang tua saya udah sampai dengan selamat di Madinah. Mereka kirim foto pagi ini.", "Memberi kabar keluarga di tanah suci."),
            ("Medium", "Crowd Anxiety", "I get super anxious in tight crowds, so I'm worried about doing the Tawaf.", "Saya gampang panik di kerumunan padat, jadi saya agak khawatir pas Tawaf nanti.", "Kekhawatiran menghadapi lautan manusia."),
            ("Medium", "Hajj Waitlist", "The waitlist for Hajj in our country is almost ten years long now.", "Daftar tunggu Haji di negara kita sekarang udah hampir sepuluh tahun.", "Membahas masalah antrean haji."),
            ("Hard", "Group Departure", "Our flight leaves on Thursday, but the agency hasn't sent the final itinerary.", "Penerbangan kita berangkat Kamis, tapi pihak agen belum kirim jadwal pastinya.", "Kendala komunikasi dengan biro travel."),
            ("Hard", "The Heat Factor", "The heat in Makkah is no joke. Bring an umbrella and stay hydrated.", "Panas di Makkah itu bukan main-main. Bawa payung dan banyak minum air.", "Mengingatkan cuaca ekstrem di Saudi."),
            ("Hard", "Inclusive Brotherhood", "Seeing people from every country wearing the exact same white cloth is amazing.", "Melihat orang dari berbagai negara memakai kain putih yang persis sama itu luar biasa.", "Kekaguman pada kesetaraan di tanah suci."),
            ("Hard", "Staying Mindful", "It's easy to get angry when someone pushes you, but you have to keep your patience.", "Gampang banget marah pas ada yang dorong kamu, tapi kamu harus tahan sabar.", "Tantangan menjaga adab saat berdesakan."),
            ("Hard", "Spiritual Reset", "Coming back from Hajj feels like you have a completely clean slate.", "Pulang dari Haji rasanya kayak kamu punya lembaran yang benar-benar bersih.", "Membahas makna haji yang mabrur.")
        ]
    },
    {
        "id": "isl_akhlaq",
        "title": "Islamic Manners (Akhlaq)",
        "category": "Islamic",
        "icon": "fa-heart",
        "description": "Daily interactions focusing on honesty, kindness, and treating others well.",
        "tasks": [
            ("Easy", "Greeting Others", "Don't just say 'hi'. Saying 'Assalamu'alaikum' is much better.", "Jangan cuma bilang 'hai'. Bilang 'Assalamu'alaikum' itu jauh lebih baik.", "Mengingatkan teman membiasakan salam."),
            ("Easy", "Charity in a Smile", "He's always smiling at everyone. It really brightens up the office.", "Dia selalu tersenyum ke semua orang. Bikin suasana kantor jadi cerah.", "Memuji sikap ramah rekan kerja."),
            ("Easy", "Keeping It Honest", "I made a mistake on the report, and I need to come clean to the boss.", "Saya buat kesalahan di laporan, dan saya harus jujur ke bos.", "Berani mengakui kesalahan di tempat kerja."),
            ("Easy", "Lending a Hand", "Let me help you carry those groceries to your car.", "Biar saya bantu bawakan belanjaan itu ke mobilmu.", "Menawarkan bantuan fisik dengan sopan."),
            ("Easy", "Respecting Elders", "Please, take my seat. I don't mind standing.", "Silakan, duduk di tempat saya saja. Saya nggak keberatan berdiri.", "Memberikan tempat duduk untuk orang yang lebih tua di bus/kereta."),
            ("Medium", "Starting with Bismillah", "Say Bismillah before you start the car, just to be safe.", "Ucapkan Bismillah sebelum kamu mulai nyetir, biar aman.", "Mengingatkan membaca doa sebelum beraktivitas."),
            ("Medium", "Watch Your Words", "I almost said something mean, but then I decided to just stay quiet.", "Saya hampir bilang sesuatu yang jahat, tapi akhirnya saya putuskan diam saja.", "Keberhasilan menahan lisan dari perkataan buruk."),
            ("Medium", "Neighborly Kindness", "We baked some extra cookies. Do you want to drop them off at the neighbor's house?", "Kita bikin kue kering lebih nih. Mau anterin ke rumah tetangga nggak?", "Mengamalkan adab bertetangga."),
            ("Medium", "Anger Management", "When you feel angry, just sit down or go make Wudhu to cool off.", "Kalau kamu merasa marah, duduk saja atau pergi wudhu buat mendinginkan suasana.", "Saran praktis mengendalikan amarah."),
            ("Medium", "Keeping Promises", "I promised I'd help him move this weekend, so I can't back out now.", "Saya udah janji mau bantu dia pindahan akhir pekan ini, jadi saya nggak bisa mundur.", "Memegang teguh janji pada teman."),
            ("Hard", "Benefit of Doubt", "Maybe he didn't see your message. We should give him the benefit of the doubt.", "Mungkin dia belum lihat pesanmu. Kita harus berprasangka baik padanya.", "Mengajak teman ber-Husnudzon."),
            ("Hard", "Lowering Voice", "There's no need to shout. We can solve this issue calmly.", "Nggak perlu teriak-teriak. Kita bisa selesaikan masalah ini dengan tenang.", "Adab berdiskusi tanpa meninggikan suara."),
            ("Hard", "Accepting Advice", "Thank you for correcting me. I appreciate you looking out for me.", "Terima kasih sudah mengoreksiku. Aku menghargai kepedulianmu.", "Menerima kritik/nasihat dengan lapang dada."),
            ("Hard", "Covering Faults", "If you know someone's secret, keep it to yourself. Don't expose them.", "Kalau kamu tahu rahasia seseorang, simpan sendiri. Jangan permalukan mereka.", "Adab menjaga aib sesama Muslim."),
            ("Hard", "Forgiving Others", "It's hard to forgive him, but holding a grudge is only hurting my own heart.", "Susah memang memaafkannya, tapi menyimpan dendam cuma menyakiti hatiku sendiri.", "Perjuangan memaafkan demi kebersihan hati.")
        ]
    },
    {
        "id": "isl_quran",
        "title": "Reading & Studying Quran",
        "category": "Islamic",
        "icon": "fa-book-open",
        "description": "Conversations about memorizing, reciting, and understanding the Quran.",
        "tasks": [
            ("Easy", "Daily Reading", "I try to read at least two pages of the Quran after Fajr every day.", "Saya usahakan baca setidaknya dua halaman Al-Quran habis Subuh setiap hari.", "Menceritakan target rutinitas ngaji."),
            ("Easy", "Tajweed Class", "Are you joining the Tajweed class on Zoom tonight?", "Kamu ikut kelas Tajwid di Zoom nggak malam ini?", "Menanyakan jadwal kajian online."),
            ("Easy", "Beautiful Recitation", "His recitation is so beautiful, it literally made me cry.", "Bacaannya indah banget, sampai benar-benar bikin saya menangis.", "Mengomentari merdunya murattal Imam."),
            ("Easy", "Memorization", "I finally memorized Surah Al-Mulk! Can you test me later?", "Saya akhirnya hafal Surah Al-Mulk! Nanti bisa tolong tes hafalan saya?", "Berbagi kabar gembira soal hafalan."),
            ("Easy", "Favorite Surah", "Surah Ar-Rahman is definitely my favorite. It's so comforting.", "Surah Ar-Rahman pastinya favorit saya. Sangat menenangkan hati.", "Membahas surah favorit."),
            ("Medium", "Understanding Meaning", "I started reading the translation, and it completely changed how I pray.", "Saya mulai baca terjemahannya, dan itu benar-benar mengubah cara saya shalat.", "Pentingnya membaca arti/tafsir Al-Quran."),
            ("Medium", "Tafsir Book", "Do you have a good recommendation for a beginner-friendly Tafsir book?", "Kamu punya rekomendasi buku Tafsir yang gampang dipahami pemula nggak?", "Meminta rujukan buku Tafsir."),
            ("Medium", "Correcting Pronunciation", "You're pronouncing the letter 'Kha' slightly wrong. Let me show you.", "Kamu mengucapkan huruf 'Kha' agak salah. Sini saya tunjukkan.", "Membantu memperbaiki Makhraj teman."),
            ("Medium", "Quran App", "This new Quran app has word-by-word translation, which is super helpful.", "Aplikasi Quran baru ini ada terjemahan perkata, sangat membantu banget.", "Rekomendasi aplikasi pendukung belajar."),
            ("Medium", "Reviewing Hafiz", "If I don't review my memorization every week, I forget it so easily.", "Kalau saya nggak muraja'ah hafalan tiap minggu, saya gampang banget lupanya.", "Kesulitan menjaga hafalan Quran."),
            ("Hard", "Connecting Verses", "It's amazing how this verse perfectly answers the problem I'm facing right now.", "Luar biasa gimana ayat ini dengan sempurna menjawab masalah yang sedang saya hadapi.", "Menemukan jawaban hidup dari Al-Quran."),
            ("Hard", "Context of Revelation", "Knowing the Asbab al-Nuzul (context of revelation) makes the verse make so much sense.", "Mengetahui Asbabun Nuzul (konteks turunnya ayat) bikin ayatnya jadi sangat masuk akal.", "Membahas pentingnya sejarah turunnya ayat."),
            ("Hard", "Teaching Kids", "Getting the kids to focus during their Quran lesson is a real challenge.", "Bikin anak-anak fokus pas pelajaran ngaji mereka itu benar-benar tantangan.", "Keluhan orang tua soal mengajari anak ngaji."),
            ("Hard", "Applying the Rules", "The theory of Tajweed is easy, but applying it while reading fast is hard.", "Teori Tajwid itu gampang, tapi nerapinnya sambil baca cepat itu susah.", "Kendala dalam mempraktikkan hukum bacaan."),
            ("Hard", "Healing properties", "Whenever I feel anxious, reciting the Quran acts like medicine for my chest.", "Tiap kali saya merasa cemas, membaca Al-Quran bekerja seperti obat untuk dada saya.", "Al-Quran sebagai Syifa (penyembuh) hati.")
        ]
    },
    {
        "id": "isl_prophet",
        "title": "Prophet Muhammad's Life",
        "category": "Islamic",
        "icon": "fa-book",
        "description": "Discussing the Seerah (biography) and Sunnah of the Prophet in daily context.",
        "tasks": [
            ("Easy", "Reading Seerah", "I just bought a new book about the life of the Prophet.", "Saya baru aja beli buku baru tentang kisah hidup Nabi.", "Membeli buku sejarah Islam."),
            ("Easy", "Sending Salawat", "Don't forget to send Salawat upon the Prophet, especially on Fridays.", "Jangan lupa bershalawat untuk Nabi, khususnya di hari Jumat.", "Mengingatkan anjuran ibadah Jumat."),
            ("Easy", "Prophet's Kindness", "The way the Prophet treated children was so gentle and playful.", "Cara Nabi memperlakukan anak-anak itu sangat lembut dan penuh canda.", "Kagum pada akhlak Nabi pada anak."),
            ("Easy", "Following Sunnah", "Eating with three fingers is actually a Sunnah of the Prophet.", "Makan pakai tiga jari itu sebenarnya Sunnah Nabi lho.", "Menjelaskan adab makan harian."),
            ("Easy", "Mercy to Animals", "The Prophet even cared deeply about how animals were treated.", "Nabi bahkan sangat peduli tentang bagaimana hewan diperlakukan.", "Adab memperlakukan hewan."),
            ("Medium", "Patience in Ta'if", "The story of his patience in Ta'if always makes me emotional.", "Kisah kesabarannya di kota Tha'if selalu bikin saya emosional.", "Kesan mendalam dari kisah sejarah."),
            ("Medium", "Husband Role Model", "He used to help his wives with household chores. That's true masculinity.", "Beliau dulu terbiasa membantu istrinya melakukan pekerjaan rumah. Itu maskulinitas sejati.", "Teladan Nabi sebagai suami dalam keluarga."),
            ("Medium", "Trustworthiness", "Even before revelation, people called him Al-Amin because he was so honest.", "Bahkan sebelum wahyu turun, orang memanggilnya Al-Amin karena beliau sangat jujur.", "Membahas reputasi masa muda Nabi."),
            ("Medium", "Smiling Habit", "Did you know smiling is a Sunnah? The Prophet smiled all the time.", "Tahu nggak senyum itu Sunnah? Nabi itu tersenyum sepanjang waktu.", "Menularkan energi positif."),
            ("Medium", "Forgiving Enemies", "When he conquered Makkah, he forgave all his enemies. That takes real strength.", "Saat beliau menaklukkan Makkah, beliau memaafkan semua musuhnya. Itu butuh kekuatan nyata.", "Pelajaran tentang pemaafan tanpa batas."),
            ("Hard", "Applying Sunnah Today", "It's hard to follow the Sunnah in a modern office, but we have to try.", "Memang susah ngikutin Sunnah di kantor modern, tapi kita harus coba.", "Tantangan ber-Sunnah di zaman sekarang."),
            ("Hard", "Defending the Prophet", "We should defend his honor not by getting angry, but by showing his true character.", "Kita harus membela kehormatannya bukan dengan marah-marah, tapi dengan menunjukkan akhlak aslinya.", "Cara elegan menanggapi hinaan terhadap Islam."),
            ("Hard", "Authenticating Hadith", "Before sharing that quote, we need to check if the Hadith is actually authentic.", "Sebelum nge-share kutipan itu, kita harus cek apa Hadisnya benar-benar sahih.", "Kritis terhadap informasi agama di medsos."),
            ("Hard", "Leadership Style", "His leadership was based on consultation and humility, not dictatorship.", "Gaya kepemimpinannya berdasar musyawarah dan kerendahan hati, bukan diktator.", "Diskusi gaya kepemimpinan ideal."),
            ("Hard", "Yearning to Meet", "Sometimes I just tear up thinking about wanting to meet him at the Hawdh (Cistern).", "Kadang saya menangis sendiri membayangkan pengen banget ketemu beliau di Telaga (Al-Kautsar).", "Rasa cinta dan rindu mendalam umat pada Nabinya.")
        ]
    },
    {
        "id": "isl_prophets_stories",
        "title": "Stories of the Prophets",
        "category": "Islamic",
        "icon": "fa-scroll",
        "description": "Extracting life lessons from the stories of various Prophets (Qisas al-Anbiya).",
        "tasks": [
            ("Easy", "Story of Nuh", "Prophet Nuh preached for 950 years. Talk about patience!", "Nabi Nuh berdakwah selama 950 tahun. Luar biasa ya sabarnya!", "Kekaguman pada kesabaran Nabi Nuh."),
            ("Easy", "Story of Yunus", "The Dua of Prophet Yunus in the whale is perfect when you feel trapped.", "Doa Nabi Yunus di dalam paus itu sempurna banget pas kamu merasa terjebak.", "Rekomendasi doa saat kena musibah."),
            ("Easy", "Story of Ibrahim", "Prophet Ibrahim is considered the father of monotheism.", "Nabi Ibrahim dianggap sebagai bapak tauhid (monoteisme).", "Fakta sejarah nabi."),
            ("Easy", "Story of Musa", "I love the story of Musa parting the Red Sea. It's so epic.", "Saya suka banget kisah Nabi Musa membelah Laut Merah. Epik banget.", "Membicarakan mukjizat besar."),
            ("Easy", "Story of Isa", "Muslims love and respect Prophet Jesus too, we just don't view him as God.", "Umat Muslim juga mencintai dan menghormati Nabi Isa, kita hanya tidak menganggapnya sebagai Tuhan.", "Menjawab pertanyaan teman non-Muslim."),
            ("Medium", "Story of Yusuf", "Surah Yusuf teaches us that jealousy can destroy a family.", "Surah Yusuf mengajarkan kita bahwa rasa iri bisa menghancurkan keluarga.", "Hikmah dari kisah saudara-saudara Yusuf."),
            ("Medium", "Overcoming Grief", "Prophet Yaqub's grief for Yusuf shows that it's okay to be sad, as long as you trust Allah.", "Kesedihan Nabi Yaqub atas Yusuf menunjukkan bahwa boleh saja sedih, asalkan tetap percaya Allah.", "Pelajaran mengelola duka."),
            ("Medium", "Story of Ayyub", "Whenever I get sick, I remember the immense patience of Prophet Ayyub.", "Tiap kali saya sakit, saya ingat kesabaran luar biasa dari Nabi Ayyub.", "Motivasi saat menderita penyakit berat."),
            ("Medium", "Story of Dawud", "Prophet Dawud would fast every alternate day. That's a very difficult Sunnah to follow.", "Nabi Daud berpuasa selang-seling tiap hari. Itu sunnah yang sangat sulit diikuti.", "Membahas puasa Daud."),
            ("Medium", "Story of Sulaiman", "Even with all his wealth and power, Prophet Sulaiman was incredibly grateful.", "Meski punya segala kekayaan dan kekuasaan, Nabi Sulaiman sangat bersyukur.", "Tidak sombong dengan harta benda."),
            ("Hard", "Facing Tyrants", "Musa speaking truth to Pharaoh teaches us courage against oppressive leaders.", "Musa yang bicara kebenaran pada Firaun mengajari kita keberanian melawan pemimpin zalim.", "Hikmah politik dari kisah nabi."),
            ("Hard", "Trusting the Plan", "When Ibrahim left Hajar in the desert, her absolute trust in Allah is mind-blowing.", "Saat Ibrahim meninggalkan Hajar di gurun, kepercayaan mutlaknya pada Allah benar-benar mencengangkan.", "Keyakinan total istri nabi pada takdir."),
            ("Hard", "Youth Independence", "Ibrahim standing up against his father's idolatry shows we must prioritize truth over culture.", "Ibrahim yang menentang kemusyrikan ayahnya menunjukkan kita harus memprioritaskan kebenaran di atas budaya.", "Memegang prinsip meski ditentang keluarga."),
            ("Hard", "The Fire Incident", "The fire becoming cool for Ibrahim proves that physics submit to Allah's command.", "Api yang menjadi dingin bagi Ibrahim membuktikan bahwa hukum fisika tunduk pada perintah Allah.", "Mendiskusikan mukjizat secara logis."),
            ("Hard", "Relatable Struggles", "Reading these stories reminds us that even the best humans faced severe depression and anxiety.", "Membaca kisah-kisah ini mengingatkan kita bahwa manusia terbaik pun menghadapi depresi dan kecemasan berat.", "Kisah nabi sebagai terapi mental (healing).")
        ]
    },
    {
        "id": "isl_eid",
        "title": "Eid Celebrations",
        "category": "Islamic",
        "icon": "fa-gift",
        "description": "Conversations around Eid al-Fitr, Eid al-Adha, Qurbani, and family gatherings.",
        "tasks": [
            ("Easy", "Eid Greetings", "Eid Mubarak! Are you going back to your hometown this year?", "Eid Mubarak! Kamu pulang kampung nggak tahun ini?", "Sapaan dan tanya rencana mudik."),
            ("Easy", "Eid Prayer", "What time does the Eid prayer start at the central mosque?", "Jam berapa shalat Ied mulai di masjid pusat?", "Bertanya jadwal shalat Ied."),
            ("Easy", "Eid Outfit", "I finally bought my Eid outfit. I went with a dark blue Kurta this time.", "Saya akhirnya beli baju Lebaran. Kali ini saya pilih Koko biru tua.", "Bercerita persiapan baju baru."),
            ("Easy", "Sweet Treats", "My mom baked so many cookies. You have to come over and try some.", "Ibu saya bikin banyak banget kue kering. Kamu harus mampir dan cobain ya.", "Menawarkan hidangan khas hari raya."),
            ("Easy", "Eid Money", "The kids are so excited to get their Eid envelopes from the relatives.", "Anak-anak semangat banget mau dapat amplop THR Lebaran dari kerabat.", "Budaya bagi-bagi uang THR."),
            ("Medium", "Qurbani Preparations", "Have you bought your sheep for the Qurbani yet? The prices are pretty high.", "Kamu udah beli domba buat kurban belum? Harganya lumayan tinggi nih.", "Bahas persiapan kurban/Idul Adha."),
            ("Medium", "Fasting on Arafah", "Don't forget to fast on the day of Arafah. It wipes away two years of sins.", "Jangan lupa puasa di hari Arafah ya. Itu menghapus dosa dua tahun lho.", "Mengingatkan keutamaan puasa sunnah sebelum Idul Adha."),
            ("Medium", "Meat Distribution", "We're going to distribute the Qurbani meat to the local shelter this afternoon.", "Kami mau bagikan daging kurbannya ke tempat penampungan lokal siang ini.", "Rencana pembagian daging kurban."),
            ("Medium", "Traffic Jams", "The traffic on the way to my grandma's house was absolutely insane.", "Macet di jalan ke rumah nenek saya benar-benar gila-gilaan.", "Mengeluh kemacetan saat mudik/silaturahmi."),
            ("Medium", "Missing Family", "This is my first Eid away from home, and it feels a bit lonely.", "Ini Lebaran pertama saya jauh dari rumah, dan rasanya agak sepi.", "Curhat mahasiswa/pekerja rantau di hari raya."),
            ("Hard", "Reconciling Ties", "Eid is the perfect excuse to text that cousin you haven't spoken to in years.", "Lebaran itu alasan yang pas buat nge-chat sepupu yang udah bertahun-tahun nggak kamu tegur.", "Momen menyambung kembali silaturahim yang putus."),
            ("Hard", "Overeating Guilt", "I definitely overate today. My stomach is not used to eating lunch anymore.", "Saya jelas makan berlebihan hari ini. Perut saya udah nggak terbiasa makan siang lagi.", "Efek samping balas dendam makan di hari Lebaran."),
            ("Hard", "Community Inclusion", "We should invite the reverts in our community so they don't celebrate alone.", "Kita harus undang para Mualaf di komunitas kita biar mereka nggak merayakan sendirian.", "Inisiatif merangkul mualaf agar tidak kesepian."),
            ("Hard", "Financial Burden", "The pressure to buy expensive new clothes for Eid can be really stressful for some families.", "Tekanan buat beli baju baru yang mahal pas Lebaran bisa bikin stres banget buat beberapa keluarga.", "Kritik sosial terhadap konsumerisme berkedok Lebaran."),
            ("Hard", "True Meaning", "Eid isn't about showing off new clothes; it's about celebrating our obedience to Allah.", "Lebaran itu bukan soal pamer baju baru; ini soal merayakan ketaatan kita pada Allah.", "Mengembalikan esensi sejati dari perayaan Idul Fitri.")
        ]
    }
]

def generate_file_content(data):
    out = "import { ShadowingTheme } from './shadowingData';\n\n"
    out += "export const DAILY_ISLAMIC_ORIGINAL_THEMES: ShadowingTheme[] = [\n"
    
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

with open('/Users/nurliafebriani/Downloads/lovspeak6/src/constants/shadowing_daily_islamic_original_1.ts', 'w') as f:
    f.write(generate_file_content(themes_data))

print("Part 1 generated successfully.")
