import { ShadowingTheme } from './shadowingData';

export const DAILY_ISLAMIC_ORIGINAL_THEMES: ShadowingTheme[] = [
  {
    id: "isl_salah",
    title: "Daily Salah & Prayer",
    category: "Islamic",
    icon: "fa-kaaba",
    description: "Practical phrases for daily prayers, mosque etiquette, and spiritual mindfulness.",
    tasks: [
      // Easy (5)
      { id: "salah_e1", title: "Checking Prayer Time", category: 'Islamic', difficulty: "Easy", text: "Do you have a prayer app? I'm not sure if Maghrib has entered yet.", translation: "Kamu punya aplikasi jadwal shalat? Saya kurang yakin apa sudah masuk Maghrib.", scenario: "Bertanya jadwal shalat pada teman." },
      { id: "salah_e2", title: "Inviting to Pray", category: 'Islamic', difficulty: "Easy", text: "I just heard the Adhan. Let's go to the prayer room together.", translation: "Saya baru dengar adzan. Ayo kita ke ruang shalat bareng.", scenario: "Mengajak teman shalat berjamaah." },
      { id: "salah_e3", title: "Asking for the Qibla", category: 'Islamic', difficulty: "Easy", text: "Excuse me, could you point me to the Qibla direction?", translation: "Permisi, bisa tolong tunjukkan arah kiblat?", scenario: "Bertanya arah kiblat di tempat asing." },
      { id: "salah_e4", title: "Making Wudu", category: 'Islamic', difficulty: "Easy", text: "Give me a second, I just need to renew my Wudhu real quick.", translation: "Tunggu sebentar ya, saya mau perbarui wudhu sebentar.", scenario: "Meminta izin untuk berwudhu." },
      { id: "salah_e5", title: "Joining Row", category: 'Islamic', difficulty: "Easy", text: "Is there enough room for me to squeeze in this row?", translation: "Apa masih ada ruang buat saya nyempil di barisan ini?", scenario: "Meminta izin masuk shaf shalat." },
      // Medium (5)
      { id: "salah_m1", title: "Turn Off Phone", category: 'Islamic', difficulty: "Medium", text: "Hey, don't forget to put your phone on silent before the Imam starts.", translation: "Hei, jangan lupa di-silent HP-nya sebelum Imam mulai.", scenario: "Mengingatkan teman menonaktifkan HP." },
      { id: "salah_m2", title: "Masjid Opening", category: 'Islamic', difficulty: "Medium", text: "Do you know if the mosque is open for Dhuhr during weekdays?", translation: "Kamu tahu nggak apa masjidnya buka buat shalat Dzuhur di hari kerja?", scenario: "Menanyakan jam operasional masjid lokal." },
      { id: "salah_m3", title: "Friday Sermon", category: 'Islamic', difficulty: "Medium", text: "That Khutbah was exactly what I needed to hear today.", translation: "Khutbah tadi benar-benar yang sedang saya butuhkan hari ini.", scenario: "Membahas khutbah Jumat sesudahnya." },
      { id: "salah_m4", title: "Sunnah Prayers", category: 'Islamic', difficulty: "Medium", text: "I'm trying to build a habit of praying the two Rakahs before Fajr.", translation: "Saya lagi nyoba bangun kebiasaan shalat dua rakaat sebelum Subuh.", scenario: "Menceritakan target ibadah harian." },
      { id: "salah_m5", title: "Maintaining Focus", category: 'Islamic', difficulty: "Medium", text: "My focus in Salah has been terrible lately. My mind keeps wandering.", translation: "Fokus shalat saya lagi jelek banget belakangan ini. Pikiran saya ke mana-mana.", scenario: "Curhat tentang susahnya khusyuk." },
      // Hard (5)
      { id: "salah_h1", title: "Tahajjud Struggle", category: 'Islamic', difficulty: "Hard", text: "I set five alarms for Tahajjud, but I still end up sleeping right through them.", translation: "Saya pasang lima alarm buat Tahajjud, tapi ujung-ujungnya tetap aja kebablasan tidur.", scenario: "Membahas susahnya bangun malam." },
      { id: "salah_h2", title: "Learning Recitation", category: 'Islamic', difficulty: "Hard", text: "I recently joined a Tajweed class to fix my pronunciation of Surah Al-Fatihah.", translation: "Saya baru aja ikut kelas Tajwid buat perbaiki pelafalan Surah Al-Fatihah saya.", scenario: "Bercerita tentang upaya memperbaiki bacaan." },
      { id: "salah_h3", title: "Prayer Apparel", category: 'Islamic', difficulty: "Hard", text: "Do you happen to have a clean prayer mat I could borrow for Asr?", translation: "Apa kamu kebetulan punya sajadah bersih yang bisa saya pinjam buat Ashar?", scenario: "Meminjam perlengkapan shalat dengan sopan." },
      { id: "salah_h4", title: "Dhikr Routine", category: 'Islamic', difficulty: "Hard", text: "Instead of rushing out, let's sit and do our post-prayer Dhikr for a minute.", translation: "Daripada buru-buru keluar, ayo duduk dan dzikir setelah shalat sebentar.", scenario: "Mengajak teman berzikir sejenak." },
      { id: "salah_h5", title: "Connecting with Allah", category: 'Islamic', difficulty: "Hard", text: "Whenever I feel overwhelmed with work, praying just resets my whole mindset.", translation: "Tiap kali saya merasa mumet dengan pekerjaan, shalat benar-benar me-reset pola pikir saya.", scenario: "Menjelaskan manfaat psikologis dari shalat." }
    ]
  },
  {
    id: "isl_ramadan",
    title: "Ramadan & Fasting",
    category: "Islamic",
    icon: "fa-moon",
    description: "Conversations about fasting, suhoor, iftar, and the spirit of Ramadan.",
    tasks: [
      // Easy (5)
      { id: "ramadan_e1", title: "Checking the Calendar", category: 'Islamic', difficulty: "Easy", text: "Can you believe Ramadan is only two weeks away?", translation: "Bisa percaya nggak Ramadan tinggal dua minggu lagi?", scenario: "Menyambut kedatangan bulan suci." },
      { id: "ramadan_e2", title: "Asking if Fasting", category: 'Islamic', difficulty: "Easy", text: "Oh sorry, I didn't mean to eat in front of you. Are you fasting?", translation: "Oh maaf, saya nggak bermaksud makan di depanmu. Kamu lagi puasa?", scenario: "Meminta maaf karena makan di depan orang puasa." },
      { id: "ramadan_e3", title: "Iftar Invitation", category: 'Islamic', difficulty: "Easy", text: "We're hosting an Iftar dinner this Saturday. You should definitely come!", translation: "Kami mau ngadain buka puasa bersama Sabtu ini. Kamu harus datang ya!", scenario: "Mengundang teman buka puasa." },
      { id: "ramadan_e4", title: "Suhoor Routine", category: 'Islamic', difficulty: "Easy", text: "I completely overslept and missed Suhoor this morning.", translation: "Saya benar-benar ketiduran dan kelewatan sahur pagi ini.", scenario: "Bercerita telat sahur." },
      { id: "ramadan_e5", title: "Breaking the Fast", category: 'Islamic', difficulty: "Easy", text: "Pass me the dates, please. I'm so ready to break my fast.", translation: "Tolong oper kurmanya dong. Saya udah siap banget buat buka puasa.", scenario: "Suasana menjelang adzan maghrib." },
      // Medium (5)
      { id: "ramadan_m1", title: "Ramadan Mubarak", category: 'Islamic', difficulty: "Medium", text: "Ramadan Mubarak! May Allah make fasting easy for you and your family.", translation: "Ramadan Mubarak! Semoga Allah mudahkan puasamu dan keluargamu.", scenario: "Ucapan selamat menyambut Ramadan." },
      { id: "ramadan_m2", title: "Taraweeh Prayer", category: 'Islamic', difficulty: "Medium", text: "Are we praying eight or twenty Rakahs for Taraweeh tonight?", translation: "Kita mau shalat Tarawih delapan atau dua puluh rakaat malam ini?", scenario: "Bertanya soal jumlah rakaat tarawih." },
      { id: "ramadan_m3", title: "Counting Down", category: 'Islamic', difficulty: "Medium", text: "Don't look at the clock, it only makes the fasting feel longer.", translation: "Jangan lihat jam terus, itu cuma bikin puasa terasa lebih lama.", scenario: "Menasihati teman yang nggak sabar nunggu maghrib." },
      { id: "ramadan_m4", title: "Staying Hydrated", category: 'Islamic', difficulty: "Medium", text: "Make sure you drink plenty of water at Suhoor so you don't get dehydrated.", translation: "Pastikan kamu minum banyak air pas sahur biar nggak dehidrasi.", scenario: "Mengingatkan tips puasa sehat." },
      { id: "ramadan_m5", title: "Potluck Planning", category: 'Islamic', difficulty: "Medium", text: "Let's do a potluck for Iftar. I'll bring the main dish, and you bring dessert.", translation: "Kita potluck aja buat buka puasa. Saya bawa makanan utama, kamu bawa dessert ya.", scenario: "Merencanakan buka puasa bersama." },
      // Hard (5)
      { id: "ramadan_h1", title: "Mindful Character", category: 'Islamic', difficulty: "Hard", text: "Fasting isn't just about food; I'm really trying to control my temper this month.", translation: "Puasa itu bukan cuma soal makanan; saya benar-benar lagi nyoba nahan emosi bulan ini.", scenario: "Membahas esensi menahan hawa nafsu." },
      { id: "ramadan_h2", title: "Sleep Schedule", category: 'Islamic', difficulty: "Hard", text: "My sleep schedule is completely messed up between Taraweeh and Suhoor.", translation: "Jadwal tidur saya benar-benar berantakan antara Tarawih dan Sahur.", scenario: "Mengeluhkan jadwal tidur selama Ramadan." },
      { id: "ramadan_h3", title: "Quran Goal", category: 'Islamic', difficulty: "Hard", text: "I'm trying to read one Juz a day so I can finish the Quran by Eid.", translation: "Saya nyoba baca satu Juz sehari biar bisa khatam Al-Quran pas Lebaran.", scenario: "Membahas target tadarus." },
      { id: "ramadan_h4", title: "Laylatul Qadr", category: 'Islamic', difficulty: "Hard", text: "Let's try to stay at the mosque until Fajr to catch Laylatul Qadr.", translation: "Ayo kita coba diam di masjid sampai Subuh untuk mencari Lailatul Qadar.", scenario: "Mengajak I'tikaf di malam ganjil." },
      { id: "ramadan_h5", title: "Charity Drive", category: 'Islamic', difficulty: "Hard", text: "We're collecting donations for the food bank to distribute before Eid.", translation: "Kami lagi ngumpulin donasi buat bank makanan untuk dibagikan sebelum Lebaran.", scenario: "Berdonasi di bulan suci." }
    ]
  },
  {
    id: "isl_hajj",
    title: "Hajj & Umrah Journey",
    category: "Islamic",
    icon: "fa-kaaba",
    description: "Practical discussions about going on pilgrimage, visas, and preparations.",
    tasks: [
      // Easy (5)
      { id: "hajj_e1", title: "Dreaming of Umrah", category: 'Islamic', difficulty: "Easy", text: "I'm saving up so I can take my parents for Umrah next year.", translation: "Saya lagi nabung biar bisa bawa orang tua saya pergi Umrah tahun depan.", scenario: "Niat menabung untuk ibadah Umrah." },
      { id: "hajj_e2", title: "Booking Tickets", category: 'Islamic', difficulty: "Easy", text: "Have you found any good travel agencies for the Umrah package?", translation: "Kamu udah nemu agen travel yang bagus buat paket Umrah?", scenario: "Mencari info biro perjalanan." },
      { id: "hajj_e3", title: "Ihram Attire", category: 'Islamic', difficulty: "Easy", text: "Where can I buy a good quality Ihram towel around here?", translation: "Di mana saya bisa beli kain Ihram yang kualitasnya bagus di sekitar sini?", scenario: "Mencari perlengkapan haji/umrah." },
      { id: "hajj_e4", title: "Kaaba First Look", category: 'Islamic', difficulty: "Easy", text: "I cried the first time I saw the Kaaba with my own eyes.", translation: "Saya menangis pertama kali melihat Ka'bah dengan mata kepala sendiri.", scenario: "Menceritakan momen mengharukan di Masjidil Haram." },
      { id: "hajj_e5", title: "Making Dua", category: 'Islamic', difficulty: "Easy", text: "Please keep me in your Duas when you're standing in front of the Kaaba.", translation: "Tolong sertakan saya dalam doamu saat kamu berdiri di depan Ka'bah ya.", scenario: "Meminta didoakan oleh teman yang akan berangkat." },
      // Medium (5)
      { id: "hajj_m1", title: "Zamzam Water", category: 'Islamic', difficulty: "Medium", text: "Could you bring back a small bottle of Zamzam water for my mom?", translation: "Bisa tolong bawakan sebotol kecil air Zamzam buat ibuku?", scenario: "Titip air Zamzam." },
      { id: "hajj_m2", title: "Walking for Sa-y", category: 'Islamic', difficulty: "Medium", text: "Make sure you wear comfortable shoes for the Sa'y, it's a lot of walking.", translation: "Pastikan pakai sepatu yang nyaman buat Sa'i, itu jalannya lumayan jauh lho.", scenario: "Saran praktis menghadapi rute Sa'i." },
      { id: "hajj_m3", title: "Pilgrim Status", category: 'Islamic', difficulty: "Medium", text: "My parents arrived safely in Madinah. They sent some pictures this morning.", translation: "Orang tua saya udah sampai dengan selamat di Madinah. Mereka kirim foto pagi ini.", scenario: "Memberi kabar keluarga di tanah suci." },
      { id: "hajj_m4", title: "Crowd Anxiety", category: 'Islamic', difficulty: "Medium", text: "I get super anxious in tight crowds, so I'm worried about doing the Tawaf.", translation: "Saya gampang panik di kerumunan padat, jadi saya agak khawatir pas Tawaf nanti.", scenario: "Kekhawatiran menghadapi lautan manusia." },
      { id: "hajj_m5", title: "Hajj Waitlist", category: 'Islamic', difficulty: "Medium", text: "The waitlist for Hajj in our country is almost ten years long now.", translation: "Daftar tunggu Haji di negara kita sekarang udah hampir sepuluh tahun.", scenario: "Membahas masalah antrean haji." },
      // Hard (5)
      { id: "hajj_h1", title: "Group Departure", category: 'Islamic', difficulty: "Hard", text: "Our flight leaves on Thursday, but the agency hasn't sent the final itinerary.", translation: "Penerbangan kita berangkat Kamis, tapi pihak agen belum kirim jadwal pastinya.", scenario: "Kendala komunikasi dengan biro travel." },
      { id: "hajj_h2", title: "The Heat Factor", category: 'Islamic', difficulty: "Hard", text: "The heat in Makkah is no joke. Bring an umbrella and stay hydrated.", translation: "Panas di Makkah itu bukan main-main. Bawa payung dan banyak minum air.", scenario: "Mengingatkan cuaca ekstrem di Saudi." },
      { id: "hajj_h3", title: "Inclusive Brotherhood", category: 'Islamic', difficulty: "Hard", text: "Seeing people from every country wearing the exact same white cloth is amazing.", translation: "Melihat orang dari berbagai negara memakai kain putih yang persis sama itu luar biasa.", scenario: "Kekaguman pada kesetaraan di tanah suci." },
      { id: "hajj_h4", title: "Staying Mindful", category: 'Islamic', difficulty: "Hard", text: "It's easy to get angry when someone pushes you, but you have to keep your patience.", translation: "Gampang banget marah pas ada yang dorong kamu, tapi kamu harus tahan sabar.", scenario: "Tantangan menjaga adab saat berdesakan." },
      { id: "hajj_h5", title: "Spiritual Reset", category: 'Islamic', difficulty: "Hard", text: "Coming back from Hajj feels like you have a completely clean slate.", translation: "Pulang dari Haji rasanya kayak kamu punya lembaran yang benar-benar bersih.", scenario: "Membahas makna haji yang mabrur." }
    ]
  },
  {
    id: "isl_akhlaq",
    title: "Islamic Manners (Akhlaq)",
    category: "Islamic",
    icon: "fa-heart",
    description: "Daily interactions focusing on honesty, kindness, and treating others well.",
    tasks: [
      // Easy (5)
      { id: "akhlaq_e1", title: "Greeting Others", category: 'Islamic', difficulty: "Easy", text: "Don't just say 'hi'. Saying 'Assalamu'alaikum' is much better.", translation: "Jangan cuma bilang 'hai'. Bilang 'Assalamu'alaikum' itu jauh lebih baik.", scenario: "Mengingatkan teman membiasakan salam." },
      { id: "akhlaq_e2", title: "Charity in a Smile", category: 'Islamic', difficulty: "Easy", text: "He's always smiling at everyone. It really brightens up the office.", translation: "Dia selalu tersenyum ke semua orang. Bikin suasana kantor jadi cerah.", scenario: "Memuji sikap ramah rekan kerja." },
      { id: "akhlaq_e3", title: "Keeping It Honest", category: 'Islamic', difficulty: "Easy", text: "I made a mistake on the report, and I need to come clean to the boss.", translation: "Saya buat kesalahan di laporan, dan saya harus jujur ke bos.", scenario: "Berani mengakui kesalahan di tempat kerja." },
      { id: "akhlaq_e4", title: "Lending a Hand", category: 'Islamic', difficulty: "Easy", text: "Let me help you carry those groceries to your car.", translation: "Biar saya bantu bawakan belanjaan itu ke mobilmu.", scenario: "Menawarkan bantuan fisik dengan sopan." },
      { id: "akhlaq_e5", title: "Respecting Elders", category: 'Islamic', difficulty: "Easy", text: "Please, take my seat. I don't mind standing.", translation: "Silakan, duduk di tempat saya saja. Saya nggak keberatan berdiri.", scenario: "Memberikan tempat duduk untuk orang yang lebih tua di bus/kereta." },
      // Medium (5)
      { id: "akhlaq_m1", title: "Starting with Bismillah", category: 'Islamic', difficulty: "Medium", text: "Say Bismillah before you start the car, just to be safe.", translation: "Ucapkan Bismillah sebelum kamu mulai nyetir, biar aman.", scenario: "Mengingatkan membaca doa sebelum beraktivitas." },
      { id: "akhlaq_m2", title: "Watch Your Words", category: 'Islamic', difficulty: "Medium", text: "I almost said something mean, but then I decided to just stay quiet.", translation: "Saya hampir bilang sesuatu yang jahat, tapi akhirnya saya putuskan diam saja.", scenario: "Keberhasilan menahan lisan dari perkataan buruk." },
      { id: "akhlaq_m3", title: "Neighborly Kindness", category: 'Islamic', difficulty: "Medium", text: "We baked some extra cookies. Do you want to drop them off at the neighbor's house?", translation: "Kita bikin kue kering lebih nih. Mau anterin ke rumah tetangga nggak?", scenario: "Mengamalkan adab bertetangga." },
      { id: "akhlaq_m4", title: "Anger Management", category: 'Islamic', difficulty: "Medium", text: "When you feel angry, just sit down or go make Wudhu to cool off.", translation: "Kalau kamu merasa marah, duduk saja atau pergi wudhu buat mendinginkan suasana.", scenario: "Saran praktis mengendalikan amarah." },
      { id: "akhlaq_m5", title: "Keeping Promises", category: 'Islamic', difficulty: "Medium", text: "I promised I'd help him move this weekend, so I can't back out now.", translation: "Saya udah janji mau bantu dia pindahan akhir pekan ini, jadi saya nggak bisa mundur.", scenario: "Memegang teguh janji pada teman." },
      // Hard (5)
      { id: "akhlaq_h1", title: "Benefit of Doubt", category: 'Islamic', difficulty: "Hard", text: "Maybe he didn't see your message. We should give him the benefit of the doubt.", translation: "Mungkin dia belum lihat pesanmu. Kita harus berprasangka baik padanya.", scenario: "Mengajak teman ber-Husnudzon." },
      { id: "akhlaq_h2", title: "Lowering Voice", category: 'Islamic', difficulty: "Hard", text: "There's no need to shout. We can solve this issue calmly.", translation: "Nggak perlu teriak-teriak. Kita bisa selesaikan masalah ini dengan tenang.", scenario: "Adab berdiskusi tanpa meninggikan suara." },
      { id: "akhlaq_h3", title: "Accepting Advice", category: 'Islamic', difficulty: "Hard", text: "Thank you for correcting me. I appreciate you looking out for me.", translation: "Terima kasih sudah mengoreksiku. Aku menghargai kepedulianmu.", scenario: "Menerima kritik/nasihat dengan lapang dada." },
      { id: "akhlaq_h4", title: "Covering Faults", category: 'Islamic', difficulty: "Hard", text: "If you know someone's secret, keep it to yourself. Don't expose them.", translation: "Kalau kamu tahu rahasia seseorang, simpan sendiri. Jangan permalukan mereka.", scenario: "Adab menjaga aib sesama Muslim." },
      { id: "akhlaq_h5", title: "Forgiving Others", category: 'Islamic', difficulty: "Hard", text: "It's hard to forgive him, but holding a grudge is only hurting my own heart.", translation: "Susah memang memaafkannya, tapi menyimpan dendam cuma menyakiti hatiku sendiri.", scenario: "Perjuangan memaafkan demi kebersihan hati." }
    ]
  },
  {
    id: "isl_quran",
    title: "Reading & Studying Quran",
    category: "Islamic",
    icon: "fa-book-open",
    description: "Conversations about memorizing, reciting, and understanding the Quran.",
    tasks: [
      // Easy (5)
      { id: "quran_e1", title: "Daily Reading", category: 'Islamic', difficulty: "Easy", text: "I try to read at least two pages of the Quran after Fajr every day.", translation: "Saya usahakan baca setidaknya dua halaman Al-Quran habis Subuh setiap hari.", scenario: "Menceritakan target rutinitas ngaji." },
      { id: "quran_e2", title: "Tajweed Class", category: 'Islamic', difficulty: "Easy", text: "Are you joining the Tajweed class on Zoom tonight?", translation: "Kamu ikut kelas Tajwid di Zoom nggak malam ini?", scenario: "Menanyakan jadwal kajian online." },
      { id: "quran_e3", title: "Beautiful Recitation", category: 'Islamic', difficulty: "Easy", text: "His recitation is so beautiful, it literally made me cry.", translation: "Bacaannya indah banget, sampai benar-benar bikin saya menangis.", scenario: "Mengomentari merdunya murattal Imam." },
      { id: "quran_e4", title: "Memorization", category: 'Islamic', difficulty: "Easy", text: "I finally memorized Surah Al-Mulk! Can you test me later?", translation: "Saya akhirnya hafal Surah Al-Mulk! Nanti bisa tolong tes hafalan saya?", scenario: "Berbagi kabar gembira soal hafalan." },
      { id: "quran_e5", title: "Favorite Surah", category: 'Islamic', difficulty: "Easy", text: "Surah Ar-Rahman is definitely my favorite. It's so comforting.", translation: "Surah Ar-Rahman pastinya favorit saya. Sangat menenangkan hati.", scenario: "Membahas surah favorit." },
      // Medium (5)
      { id: "quran_m1", title: "Understanding Meaning", category: 'Islamic', difficulty: "Medium", text: "I started reading the translation, and it completely changed how I pray.", translation: "Saya mulai baca terjemahannya, dan itu benar-benar mengubah cara saya shalat.", scenario: "Pentingnya membaca arti/tafsir Al-Quran." },
      { id: "quran_m2", title: "Tafsir Book", category: 'Islamic', difficulty: "Medium", text: "Do you have a good recommendation for a beginner-friendly Tafsir book?", translation: "Kamu punya rekomendasi buku Tafsir yang gampang dipahami pemula nggak?", scenario: "Meminta rujukan buku Tafsir." },
      { id: "quran_m3", title: "Correcting Pronunciation", category: 'Islamic', difficulty: "Medium", text: "You're pronouncing the letter 'Kha' slightly wrong. Let me show you.", translation: "Kamu mengucapkan huruf 'Kha' agak salah. Sini saya tunjukkan.", scenario: "Membantu memperbaiki Makhraj teman." },
      { id: "quran_m4", title: "Quran App", category: 'Islamic', difficulty: "Medium", text: "This new Quran app has word-by-word translation, which is super helpful.", translation: "Aplikasi Quran baru ini ada terjemahan perkata, sangat membantu banget.", scenario: "Rekomendasi aplikasi pendukung belajar." },
      { id: "quran_m5", title: "Reviewing Hafiz", category: 'Islamic', difficulty: "Medium", text: "If I don't review my memorization every week, I forget it so easily.", translation: "Kalau saya nggak muraja'ah hafalan tiap minggu, saya gampang banget lupanya.", scenario: "Kesulitan menjaga hafalan Quran." },
      // Hard (5)
      { id: "quran_h1", title: "Connecting Verses", category: 'Islamic', difficulty: "Hard", text: "It's amazing how this verse perfectly answers the problem I'm facing right now.", translation: "Luar biasa gimana ayat ini dengan sempurna menjawab masalah yang sedang saya hadapi.", scenario: "Menemukan jawaban hidup dari Al-Quran." },
      { id: "quran_h2", title: "Context of Revelation", category: 'Islamic', difficulty: "Hard", text: "Knowing the Asbab al-Nuzul (context of revelation) makes the verse make so much sense.", translation: "Mengetahui Asbabun Nuzul (konteks turunnya ayat) bikin ayatnya jadi sangat masuk akal.", scenario: "Membahas pentingnya sejarah turunnya ayat." },
      { id: "quran_h3", title: "Teaching Kids", category: 'Islamic', difficulty: "Hard", text: "Getting the kids to focus during their Quran lesson is a real challenge.", translation: "Bikin anak-anak fokus pas pelajaran ngaji mereka itu benar-benar tantangan.", scenario: "Keluhan orang tua soal mengajari anak ngaji." },
      { id: "quran_h4", title: "Applying the Rules", category: 'Islamic', difficulty: "Hard", text: "The theory of Tajweed is easy, but applying it while reading fast is hard.", translation: "Teori Tajwid itu gampang, tapi nerapinnya sambil baca cepat itu susah.", scenario: "Kendala dalam mempraktikkan hukum bacaan." },
      { id: "quran_h5", title: "Healing properties", category: 'Islamic', difficulty: "Hard", text: "Whenever I feel anxious, reciting the Quran acts like medicine for my chest.", translation: "Tiap kali saya merasa cemas, membaca Al-Quran bekerja seperti obat untuk dada saya.", scenario: "Al-Quran sebagai Syifa (penyembuh) hati." }
    ]
  },
  {
    id: "isl_prophet",
    title: "Prophet Muhammad's Life",
    category: "Islamic",
    icon: "fa-book",
    description: "Discussing the Seerah (biography) and Sunnah of the Prophet in daily context.",
    tasks: [
      // Easy (5)
      { id: "prophet_e1", title: "Reading Seerah", category: 'Islamic', difficulty: "Easy", text: "I just bought a new book about the life of the Prophet.", translation: "Saya baru aja beli buku baru tentang kisah hidup Nabi.", scenario: "Membeli buku sejarah Islam." },
      { id: "prophet_e2", title: "Sending Salawat", category: 'Islamic', difficulty: "Easy", text: "Don't forget to send Salawat upon the Prophet, especially on Fridays.", translation: "Jangan lupa bershalawat untuk Nabi, khususnya di hari Jumat.", scenario: "Mengingatkan anjuran ibadah Jumat." },
      { id: "prophet_e3", title: "Prophet's Kindness", category: 'Islamic', difficulty: "Easy", text: "The way the Prophet treated children was so gentle and playful.", translation: "Cara Nabi memperlakukan anak-anak itu sangat lembut dan penuh canda.", scenario: "Kagum pada akhlak Nabi pada anak." },
      { id: "prophet_e4", title: "Following Sunnah", category: 'Islamic', difficulty: "Easy", text: "Eating with three fingers is actually a Sunnah of the Prophet.", translation: "Makan pakai tiga jari itu sebenarnya Sunnah Nabi lho.", scenario: "Menjelaskan adab makan harian." },
      { id: "prophet_e5", title: "Mercy to Animals", category: 'Islamic', difficulty: "Easy", text: "The Prophet even cared deeply about how animals were treated.", translation: "Nabi bahkan sangat peduli tentang bagaimana hewan diperlakukan.", scenario: "Adab memperlakukan hewan." },
      // Medium (5)
      { id: "prophet_m1", title: "Patience in Ta'if", category: 'Islamic', difficulty: "Medium", text: "The story of his patience in Ta'if always makes me emotional.", translation: "Kisah kesabarannya di kota Tha'if selalu bikin saya emosional.", scenario: "Kesan mendalam dari kisah sejarah." },
      { id: "prophet_m2", title: "Husband Role Model", category: 'Islamic', difficulty: "Medium", text: "He used to help his wives with household chores. That's true masculinity.", translation: "Beliau dulu terbiasa membantu istrinya melakukan pekerjaan rumah. Itu maskulinitas sejati.", scenario: "Teladan Nabi sebagai suami dalam keluarga." },
      { id: "prophet_m3", title: "Trustworthiness", category: 'Islamic', difficulty: "Medium", text: "Even before revelation, people called him Al-Amin because he was so honest.", translation: "Bahkan sebelum wahyu turun, orang memanggilnya Al-Amin karena beliau sangat jujur.", scenario: "Membahas reputasi masa muda Nabi." },
      { id: "prophet_m4", title: "Smiling Habit", category: 'Islamic', difficulty: "Medium", text: "Did you know smiling is a Sunnah? The Prophet smiled all the time.", translation: "Tahu nggak senyum itu Sunnah? Nabi itu tersenyum sepanjang waktu.", scenario: "Menularkan energi positif." },
      { id: "prophet_m5", title: "Forgiving Enemies", category: 'Islamic', difficulty: "Medium", text: "When he conquered Makkah, he forgave all his enemies. That takes real strength.", translation: "Saat beliau menaklukkan Makkah, beliau memaafkan semua musuhnya. Itu butuh kekuatan nyata.", scenario: "Pelajaran tentang pemaafan tanpa batas." },
      // Hard (5)
      { id: "prophet_h1", title: "Applying Sunnah Today", category: 'Islamic', difficulty: "Hard", text: "It's hard to follow the Sunnah in a modern office, but we have to try.", translation: "Memang susah ngikutin Sunnah di kantor modern, tapi kita harus coba.", scenario: "Tantangan ber-Sunnah di zaman sekarang." },
      { id: "prophet_h2", title: "Defending the Prophet", category: 'Islamic', difficulty: "Hard", text: "We should defend his honor not by getting angry, but by showing his true character.", translation: "Kita harus membela kehormatannya bukan dengan marah-marah, tapi dengan menunjukkan akhlak aslinya.", scenario: "Cara elegan menanggapi hinaan terhadap Islam." },
      { id: "prophet_h3", title: "Authenticating Hadith", category: 'Islamic', difficulty: "Hard", text: "Before sharing that quote, we need to check if the Hadith is actually authentic.", translation: "Sebelum nge-share kutipan itu, kita harus cek apa Hadisnya benar-benar sahih.", scenario: "Kritis terhadap informasi agama di medsos." },
      { id: "prophet_h4", title: "Leadership Style", category: 'Islamic', difficulty: "Hard", text: "His leadership was based on consultation and humility, not dictatorship.", translation: "Gaya kepemimpinannya berdasar musyawarah dan kerendahan hati, bukan diktator.", scenario: "Diskusi gaya kepemimpinan ideal." },
      { id: "prophet_h5", title: "Yearning to Meet", category: 'Islamic', difficulty: "Hard", text: "Sometimes I just tear up thinking about wanting to meet him at the Hawdh (Cistern).", translation: "Kadang saya menangis sendiri membayangkan pengen banget ketemu beliau di Telaga (Al-Kautsar).", scenario: "Rasa cinta dan rindu mendalam umat pada Nabinya." }
    ]
  },
  {
    id: "isl_prophets_stories",
    title: "Stories of the Prophets",
    category: "Islamic",
    icon: "fa-scroll",
    description: "Extracting life lessons from the stories of various Prophets (Qisas al-Anbiya).",
    tasks: [
      // Easy (5)
      { id: "prophets_stories_e1", title: "Story of Nuh", category: 'Islamic', difficulty: "Easy", text: "Prophet Nuh preached for 950 years. Talk about patience!", translation: "Nabi Nuh berdakwah selama 950 tahun. Luar biasa ya sabarnya!", scenario: "Kekaguman pada kesabaran Nabi Nuh." },
      { id: "prophets_stories_e2", title: "Story of Yunus", category: 'Islamic', difficulty: "Easy", text: "The Dua of Prophet Yunus in the whale is perfect when you feel trapped.", translation: "Doa Nabi Yunus di dalam paus itu sempurna banget pas kamu merasa terjebak.", scenario: "Rekomendasi doa saat kena musibah." },
      { id: "prophets_stories_e3", title: "Story of Ibrahim", category: 'Islamic', difficulty: "Easy", text: "Prophet Ibrahim is considered the father of monotheism.", translation: "Nabi Ibrahim dianggap sebagai bapak tauhid (monoteisme).", scenario: "Fakta sejarah nabi." },
      { id: "prophets_stories_e4", title: "Story of Musa", category: 'Islamic', difficulty: "Easy", text: "I love the story of Musa parting the Red Sea. It's so epic.", translation: "Saya suka banget kisah Nabi Musa membelah Laut Merah. Epik banget.", scenario: "Membicarakan mukjizat besar." },
      { id: "prophets_stories_e5", title: "Story of Isa", category: 'Islamic', difficulty: "Easy", text: "Muslims love and respect Prophet Jesus too, we just don't view him as God.", translation: "Umat Muslim juga mencintai dan menghormati Nabi Isa, kita hanya tidak menganggapnya sebagai Tuhan.", scenario: "Menjawab pertanyaan teman non-Muslim." },
      // Medium (5)
      { id: "prophets_stories_m1", title: "Story of Yusuf", category: 'Islamic', difficulty: "Medium", text: "Surah Yusuf teaches us that jealousy can destroy a family.", translation: "Surah Yusuf mengajarkan kita bahwa rasa iri bisa menghancurkan keluarga.", scenario: "Hikmah dari kisah saudara-saudara Yusuf." },
      { id: "prophets_stories_m2", title: "Overcoming Grief", category: 'Islamic', difficulty: "Medium", text: "Prophet Yaqub's grief for Yusuf shows that it's okay to be sad, as long as you trust Allah.", translation: "Kesedihan Nabi Yaqub atas Yusuf menunjukkan bahwa boleh saja sedih, asalkan tetap percaya Allah.", scenario: "Pelajaran mengelola duka." },
      { id: "prophets_stories_m3", title: "Story of Ayyub", category: 'Islamic', difficulty: "Medium", text: "Whenever I get sick, I remember the immense patience of Prophet Ayyub.", translation: "Tiap kali saya sakit, saya ingat kesabaran luar biasa dari Nabi Ayyub.", scenario: "Motivasi saat menderita penyakit berat." },
      { id: "prophets_stories_m4", title: "Story of Dawud", category: 'Islamic', difficulty: "Medium", text: "Prophet Dawud would fast every alternate day. That's a very difficult Sunnah to follow.", translation: "Nabi Daud berpuasa selang-seling tiap hari. Itu sunnah yang sangat sulit diikuti.", scenario: "Membahas puasa Daud." },
      { id: "prophets_stories_m5", title: "Story of Sulaiman", category: 'Islamic', difficulty: "Medium", text: "Even with all his wealth and power, Prophet Sulaiman was incredibly grateful.", translation: "Meski punya segala kekayaan dan kekuasaan, Nabi Sulaiman sangat bersyukur.", scenario: "Tidak sombong dengan harta benda." },
      // Hard (5)
      { id: "prophets_stories_h1", title: "Facing Tyrants", category: 'Islamic', difficulty: "Hard", text: "Musa speaking truth to Pharaoh teaches us courage against oppressive leaders.", translation: "Musa yang bicara kebenaran pada Firaun mengajari kita keberanian melawan pemimpin zalim.", scenario: "Hikmah politik dari kisah nabi." },
      { id: "prophets_stories_h2", title: "Trusting the Plan", category: 'Islamic', difficulty: "Hard", text: "When Ibrahim left Hajar in the desert, her absolute trust in Allah is mind-blowing.", translation: "Saat Ibrahim meninggalkan Hajar di gurun, kepercayaan mutlaknya pada Allah benar-benar mencengangkan.", scenario: "Keyakinan total istri nabi pada takdir." },
      { id: "prophets_stories_h3", title: "Youth Independence", category: 'Islamic', difficulty: "Hard", text: "Ibrahim standing up against his father's idolatry shows we must prioritize truth over culture.", translation: "Ibrahim yang menentang kemusyrikan ayahnya menunjukkan kita harus memprioritaskan kebenaran di atas budaya.", scenario: "Memegang prinsip meski ditentang keluarga." },
      { id: "prophets_stories_h4", title: "The Fire Incident", category: 'Islamic', difficulty: "Hard", text: "The fire becoming cool for Ibrahim proves that physics submit to Allah's command.", translation: "Api yang menjadi dingin bagi Ibrahim membuktikan bahwa hukum fisika tunduk pada perintah Allah.", scenario: "Mendiskusikan mukjizat secara logis." },
      { id: "prophets_stories_h5", title: "Relatable Struggles", category: 'Islamic', difficulty: "Hard", text: "Reading these stories reminds us that even the best humans faced severe depression and anxiety.", translation: "Membaca kisah-kisah ini mengingatkan kita bahwa manusia terbaik pun menghadapi depresi dan kecemasan berat.", scenario: "Kisah nabi sebagai terapi mental (healing)." }
    ]
  },
  {
    id: "isl_eid",
    title: "Eid Celebrations",
    category: "Islamic",
    icon: "fa-gift",
    description: "Conversations around Eid al-Fitr, Eid al-Adha, Qurbani, and family gatherings.",
    tasks: [
      // Easy (5)
      { id: "eid_e1", title: "Eid Greetings", category: 'Islamic', difficulty: "Easy", text: "Eid Mubarak! Are you going back to your hometown this year?", translation: "Eid Mubarak! Kamu pulang kampung nggak tahun ini?", scenario: "Sapaan dan tanya rencana mudik." },
      { id: "eid_e2", title: "Eid Prayer", category: 'Islamic', difficulty: "Easy", text: "What time does the Eid prayer start at the central mosque?", translation: "Jam berapa shalat Ied mulai di masjid pusat?", scenario: "Bertanya jadwal shalat Ied." },
      { id: "eid_e3", title: "Eid Outfit", category: 'Islamic', difficulty: "Easy", text: "I finally bought my Eid outfit. I went with a dark blue Kurta this time.", translation: "Saya akhirnya beli baju Lebaran. Kali ini saya pilih Koko biru tua.", scenario: "Bercerita persiapan baju baru." },
      { id: "eid_e4", title: "Sweet Treats", category: 'Islamic', difficulty: "Easy", text: "My mom baked so many cookies. You have to come over and try some.", translation: "Ibu saya bikin banyak banget kue kering. Kamu harus mampir dan cobain ya.", scenario: "Menawarkan hidangan khas hari raya." },
      { id: "eid_e5", title: "Eid Money", category: 'Islamic', difficulty: "Easy", text: "The kids are so excited to get their Eid envelopes from the relatives.", translation: "Anak-anak semangat banget mau dapat amplop THR Lebaran dari kerabat.", scenario: "Budaya bagi-bagi uang THR." },
      // Medium (5)
      { id: "eid_m1", title: "Qurbani Preparations", category: 'Islamic', difficulty: "Medium", text: "Have you bought your sheep for the Qurbani yet? The prices are pretty high.", translation: "Kamu udah beli domba buat kurban belum? Harganya lumayan tinggi nih.", scenario: "Bahas persiapan kurban/Idul Adha." },
      { id: "eid_m2", title: "Fasting on Arafah", category: 'Islamic', difficulty: "Medium", text: "Don't forget to fast on the day of Arafah. It wipes away two years of sins.", translation: "Jangan lupa puasa di hari Arafah ya. Itu menghapus dosa dua tahun lho.", scenario: "Mengingatkan keutamaan puasa sunnah sebelum Idul Adha." },
      { id: "eid_m3", title: "Meat Distribution", category: 'Islamic', difficulty: "Medium", text: "We're going to distribute the Qurbani meat to the local shelter this afternoon.", translation: "Kami mau bagikan daging kurbannya ke tempat penampungan lokal siang ini.", scenario: "Rencana pembagian daging kurban." },
      { id: "eid_m4", title: "Traffic Jams", category: 'Islamic', difficulty: "Medium", text: "The traffic on the way to my grandma's house was absolutely insane.", translation: "Macet di jalan ke rumah nenek saya benar-benar gila-gilaan.", scenario: "Mengeluh kemacetan saat mudik/silaturahmi." },
      { id: "eid_m5", title: "Missing Family", category: 'Islamic', difficulty: "Medium", text: "This is my first Eid away from home, and it feels a bit lonely.", translation: "Ini Lebaran pertama saya jauh dari rumah, dan rasanya agak sepi.", scenario: "Curhat mahasiswa/pekerja rantau di hari raya." },
      // Hard (5)
      { id: "eid_h1", title: "Reconciling Ties", category: 'Islamic', difficulty: "Hard", text: "Eid is the perfect excuse to text that cousin you haven't spoken to in years.", translation: "Lebaran itu alasan yang pas buat nge-chat sepupu yang udah bertahun-tahun nggak kamu tegur.", scenario: "Momen menyambung kembali silaturahim yang putus." },
      { id: "eid_h2", title: "Overeating Guilt", category: 'Islamic', difficulty: "Hard", text: "I definitely overate today. My stomach is not used to eating lunch anymore.", translation: "Saya jelas makan berlebihan hari ini. Perut saya udah nggak terbiasa makan siang lagi.", scenario: "Efek samping balas dendam makan di hari Lebaran." },
      { id: "eid_h3", title: "Community Inclusion", category: 'Islamic', difficulty: "Hard", text: "We should invite the reverts in our community so they don't celebrate alone.", translation: "Kita harus undang para Mualaf di komunitas kita biar mereka nggak merayakan sendirian.", scenario: "Inisiatif merangkul mualaf agar tidak kesepian." },
      { id: "eid_h4", title: "Financial Burden", category: 'Islamic', difficulty: "Hard", text: "The pressure to buy expensive new clothes for Eid can be really stressful for some families.", translation: "Tekanan buat beli baju baru yang mahal pas Lebaran bisa bikin stres banget buat beberapa keluarga.", scenario: "Kritik sosial terhadap konsumerisme berkedok Lebaran." },
      { id: "eid_h5", title: "True Meaning", category: 'Islamic', difficulty: "Hard", text: "Eid isn't about showing off new clothes; it's about celebrating our obedience to Allah.", translation: "Lebaran itu bukan soal pamer baju baru; ini soal merayakan ketaatan kita pada Allah.", scenario: "Mengembalikan esensi sejati dari perayaan Idul Fitri." }
    ]
  }
];
