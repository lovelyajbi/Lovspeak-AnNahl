import json

daily_data = [
    {
        "id": "di_worship_routine",
        "title": "Daily Worship & Routine",
        "category": "Daily Conversations",
        "mainCategory": "Daily Conversations",
        "subCategory": "Islamic",
        "icon": "fa-pray",
        "description": "Everyday conversations related to prayers, wudhu, reciting Quran, and maintaining spiritual habits.",
        "tasks": [
            ("Easy", "Waking Up for Fajr", "Assalamu'alaikum. It's time for Fajr. Let's wake up and pray.", "Assalamu'alaikum. Sudah waktu Subuh. Ayo bangun dan shalat.", "Sapaan dan ajakan santai untuk bangun shalat Subuh di rumah."),
            ("Easy", "Making Wudhu", "Wait a minute, I need to make Wudhu before we leave the house.", "Tunggu sebentar, saya harus wudhu dulu sebelum kita berangkat.", "Menyampaikan rutinitas menjaga wudhu sebelum beraktivitas."),
            ("Easy", "Reminding the Adhan", "Quiet down for a moment, the Adhan is playing. Let's listen to it.", "Tolong diam sebentar, azan sedang berkumandang. Mari kita dengarkan.", "Mengingatkan adab untuk mendengarkan dan menjawab azan."),
            ("Easy", "Daily Dhikr", "I like to do my morning Dhikr while driving to work. It brings me peace.", "Saya suka berzikir pagi sambil menyetir ke tempat kerja. Itu memberiku ketenangan.", "Menceritakan kebiasaan zikir pagi dalam perjalanan."),
            ("Easy", "Quran Portion", "Have you finished your daily Quran portion today? I'm currently on Surah Al-Kahf.", "Apakah kamu sudah menyelesaikan tilawah harianmu hari ini? Saya sedang di Surah Al-Kahf.", "Saling mengingatkan tentang target tilawah Al-Quran."),
            ("Medium", "Catching the Jamaah", "Hurry up! We don't want to miss the first Rak'ah in congregation.", "Cepatlah! Kita tidak mau ketinggalan rakaat pertama berjamaah.", "Ajakan bersegera menuju masjid untuk mendapat keutamaan shalat berjamaah."),
            ("Medium", "Renewing Intention", "Before we start this project, let's renew our intentions purely for the sake of Allah.", "Sebelum kita memulai proyek ini, mari kita perbarui niat murni karena Allah.", "Mengingatkan kolega untuk meluruskan niat (Tajdidun Niyah)."),
            ("Medium", "Night Prayers", "I've been trying to wake up for Tahajjud recently, but my sleep schedule is a mess.", "Belakangan ini saya mencoba bangun untuk Tahajjud, tapi jadwal tidur saya berantakan.", "Berbagi kendala dalam menjalankan ibadah sunnah malam."),
            ("Medium", "Fasting Monday Thursday", "I'd love to join you for lunch, but I'm actually fasting today. It's Monday.", "Saya ingin sekali ikut makan siang, tapi saya sedang puasa hari ini. Ini hari Senin.", "Menolak ajakan makan dengan halus karena sedang puasa sunnah."),
            ("Medium", "Memorization Review", "Could you listen to me recite? I need to review the Surah I memorized last week.", "Bisa tolong dengarkan bacaanku? Saya perlu muraja'ah surah yang saya hafal minggu lalu.", "Meminta bantuan teman untuk menyimak hafalan (Muraja'ah)."),
            ("Hard", "Combining Prayers", "Since we are traveling a long distance today, we can combine and shorten our prayers.", "Karena kita menempuh jarak jauh hari ini, kita bisa menjamak dan mengqashar shalat kita.", "Menjelaskan rukhsah (keringanan) dalam safar/perjalanan."),
            ("Hard", "Overcoming Futur", "I've been experiencing a dip in my faith lately. Do you have any advice on overcoming it?", "Belakangan ini iman saya sedang turun. Apakah kamu punya nasihat untuk mengatasinya?", "Meminta nasihat spiritual saat mengalami futur (lemah iman)."),
            ("Hard", "Consistency over Quantity", "The Prophet said the most beloved deeds to Allah are those done consistently, even if they are small.", "Nabi bersabda amal yang paling dicintai Allah adalah yang berkesinambungan, meski kecil.", "Menyampaikan hadis tentang pentingnya istiqamah dalam amal ibadah."),
            ("Hard", "Seeking Forgiveness", "No matter how many mistakes you make, never despair of Allah's mercy. Keep repenting.", "Sebanyak apa pun kesalahanmu, jangan pernah putus asa dari rahmat Allah. Teruslah bertaubat.", "Memberikan motivasi untuk senantiasa melakukan Taubat Nasuha."),
            ("Hard", "Guarding the Gaze", "In this era of social media, guarding our gaze and protecting our hearts has become a constant struggle.", "Di era media sosial ini, menjaga pandangan dan melindungi hati telah menjadi perjuangan terus-menerus.", "Mendiskusikan tantangan menjaga iffah (kesucian diri) di zaman modern.")
        ]
    },
    {
        "id": "di_social_manners",
        "title": "Social Etiquette & Manners",
        "category": "Daily Conversations",
        "mainCategory": "Daily Conversations",
        "subCategory": "Islamic",
        "icon": "fa-users",
        "description": "Practical expressions for daily interactions, maintaining Islamic manners (Adab) in society.",
        "tasks": [
            ("Easy", "Greeting Etiquette", "Assalamu'alaikum warahmatullah. How are your parents doing?", "Assalamu'alaikum warahmatullah. Bagaimana kabar orang tuamu?", "Sapaan standar dengan mendoakan kesehatan keluarga."),
            ("Easy", "Saying InshaAllah", "I'll send you the document by tomorrow morning, InshaAllah.", "Saya akan mengirim dokumennya besok pagi, InsyaAllah.", "Mengaitkan janji manusia dengan kehendak Allah."),
            ("Easy", "Expressing Gratitude", "Jazakallahu khairan for helping me carry these heavy boxes.", "Jazakallahu khairan (Semoga Allah membalasmu dengan kebaikan) karena telah membantuku membawa kotak berat ini.", "Ucapan terima kasih Islami kepada sesama."),
            ("Easy", "Sneezing Adab", "Alhamdulillah. Oh, excuse me.", "Alhamdulillah. Oh, permisi.", "Adab ketika bersin di tempat umum dengan mengucapkan tahmid."),
            ("Easy", "Replying to Sneeze", "Yarhamukallah. May Allah have mercy on you.", "Yarhamukallah. Semoga Allah merahmatimu.", "Merespons teman yang mengucapkan Alhamdulillah setelah bersin (Tasymit)."),
            ("Medium", "Visiting the Sick", "I heard you weren't feeling well. May Allah grant you a speedy recovery, Syafakallah.", "Saya dengar kamu sedang sakit. Semoga Allah memberimu kesembuhan yang cepat, Syafakallah.", "Mendoakan teman yang sedang sakit (Adab menjenguk)."),
            ("Medium", "Avoiding Backbiting", "Let's change the topic. We shouldn't be talking about him when he's not here.", "Mari ganti topik. Kita tidak seharusnya membicarakannya saat dia tidak ada.", "Mencegah perbuatan ghibah di tengah obrolan santai."),
            ("Medium", "Admitting Fault", "Astaghfirullah, that was completely my fault. Please forgive my negligence.", "Astaghfirullah, itu sepenuhnya kesalahanku. Tolong maafkan kelalaianku.", "Adab meminta maaf dengan lapang dada tanpa mencari alasan."),
            ("Medium", "Respecting Elders", "Please, go ahead first. You are older and deserve more respect.", "Silakan, maju duluan. Anda lebih tua dan pantas mendapat penghormatan lebih.", "Mendahulukan orang yang lebih tua saat mengantre atau masuk ruangan."),
            ("Medium", "Returning Items", "Thank you for lending me this book. I made sure to return it in good condition.", "Terima kasih sudah meminjamkan buku ini. Saya pastikan mengembalikannya dalam kondisi baik.", "Adab meminjam dan menjaga amanah barang milik orang lain."),
            ("Hard", "Comforting the Bereaved", "Inna lillahi wa inna ilayhi raji'un. I am so deeply sorry for your loss; may Allah grant you patience.", "Inna lillahi wa inna ilayhi raji'un. Saya sangat berduka atas kehilanganmu; semoga Allah memberimu kesabaran.", "Memberikan ucapan takziah/belasungkawa Islami yang mendalam."),
            ("Hard", "Respectful Disagreement", "I respect your perspective, but from an Islamic standpoint, we are taught to approach this with compassion.", "Saya menghargai sudut pandangmu, tapi dari sisi Islam, kita diajarkan mendekati hal ini dengan kasih sayang.", "Berbeda pendapat (Ikhtilaf) dengan tetap menjaga ukhuwah dan kesopanan."),
            ("Hard", "Guarding Secrets", "Whatever you share with me in confidence remains between us. I won't disclose your private matters.", "Apa pun yang kamu ceritakan padaku secara rahasia akan tetap di antara kita. Aku tidak akan membuka urusan pribadimu.", "Menegaskan komitmen untuk menjaga aib dan rahasia sesama Muslim."),
            ("Hard", "Giving Honest Advice", "As your brother in Islam, I have to tell you the truth even if it's hard to hear.", "Sebagai saudaramu seiman, aku harus mengatakan yang sebenarnya walau sulit didengar.", "Memberikan nasihat dengan hikmah meskipun pahit (Amar Ma'ruf)."),
            ("Hard", "Handling Provocation", "I choose not to respond to insults. The Quran teaches us to reply to ignorance with peace.", "Saya memilih untuk tidak menanggapi hinaan. Al-Quran mengajarkan kita membalas kebodohan dengan salam perdamaian.", "Adab menghadapi provokasi (Ibadurrahman) tanpa tersulut emosi.")
        ]
    },
    {
        "id": "di_halal_lifestyle",
        "title": "Halal Lifestyle & Ethics",
        "category": "Daily Conversations",
        "mainCategory": "Daily Conversations",
        "subCategory": "Islamic",
        "icon": "fa-leaf",
        "description": "Conversations regarding halal food, ethical business, modesty, and Islamic lifestyle choices.",
        "tasks": [
            ("Easy", "Asking Halal Status", "Excuse me, is the meat served in this restaurant halal-certified?", "Permisi, apakah daging yang disajikan di restoran ini bersertifikat halal?", "Pertanyaan wajib saat makan di luar untuk memastikan kehalalan."),
            ("Easy", "Checking Ingredients", "I need to check the ingredients list to make sure there's no alcohol or gelatin.", "Saya harus mengecek daftar komposisi untuk memastikan tidak ada alkohol atau gelatin.", "Kebiasaan membaca label makanan di supermarket."),
            ("Easy", "Declining Alcohol", "I don't drink alcohol for religious reasons, but I'd love a glass of orange juice.", "Saya tidak minum alkohol karena alasan agama, tapi saya mau segelas jus jeruk.", "Menolak tawaran minuman keras dengan sopan di acara sosial."),
            ("Easy", "Lowering the Gaze", "Let's sit somewhere else. The screen over there is showing inappropriate content.", "Ayo duduk di tempat lain. Layar di sana menampilkan konten yang tidak pantas.", "Inisiatif menjaga pandangan (Ghadul Basar) di tempat umum."),
            ("Easy", "Modest Dressing", "I prefer wearing clothes that are loose-fitting and comfortable.", "Saya lebih suka memakai pakaian yang longgar dan nyaman.", "Menjelaskan preferensi gaya berpakaian yang menutup aurat."),
            ("Medium", "Explaining Hijab", "For me, the hijab is a personal commitment to modesty and a reflection of my faith.", "Bagi saya, hijab adalah komitmen pribadi terhadap kesopanan dan cerminan iman saya.", "Menjelaskan makna hijab kepada non-Muslim yang bertanya dengan sopan."),
            ("Medium", "Business Honesty", "I have to inform you about a minor defect in this product before you buy it.", "Saya harus memberitahu Anda tentang sedikit cacat pada produk ini sebelum Anda membelinya.", "Kejujuran dalam jual beli, meniru adab berdagang Rasulullah."),
            ("Medium", "Avoiding Interest", "I'm looking for an Islamic bank account because I want to avoid dealing with Riba (interest).", "Saya mencari rekening bank syariah karena saya ingin menghindari berurusan dengan Riba (bunga).", "Diskusi mengenai prinsip keuangan yang bersih dari bunga."),
            ("Medium", "Fair Payment", "We must pay our workers their wages before their sweat dries, as the Prophet advised.", "Kita harus membayar upah pekerja kita sebelum keringat mereka kering, seperti anjuran Nabi.", "Mengingatkan pentingnya etika kerja dan hak pekerja dalam Islam."),
            ("Medium", "Ethical Consumption", "I try to boycott brands that are known for unethical practices or supporting oppression.", "Saya berusaha memboikot merek yang dikenal dengan praktik tidak etis atau mendukung penindasan.", "Mendiskusikan kesadaran konsumsi yang sejalan dengan nilai keadilan Islam."),
            ("Hard", "Explaining Halal Slaughter", "Halal slaughter isn't just a ritual; it's designed to minimize the animal's suffering and ensure hygiene.", "Penyembelihan halal bukan sekadar ritual; ia dirancang untuk meminimalkan penderitaan hewan dan memastikan kebersihan.", "Memberikan edukasi logis tentang hikmah penyembelihan secara Islam."),
            ("Hard", "Declining Shaking Hands", "I apologize, but I don't shake hands with the opposite gender due to my religious beliefs.", "Saya minta maaf, tapi saya tidak bersalaman dengan lawan jenis karena keyakinan agama saya.", "Menolak jabat tangan dengan sopan tanpa menyinggung perasaan di lingkungan profesional."),
            ("Hard", "Navigating Mortgages", "Buying a house is challenging for Muslims here since finding a genuinely interest-free mortgage is difficult.", "Membeli rumah adalah tantangan bagi Muslim di sini karena mencari KPR yang benar-benar tanpa bunga sangat sulit.", "Mengeluhkan tantangan ekonomi umat Islam di negara mayoritas non-Muslim."),
            ("Hard", "Workplace Prayer Accommodations", "Could we possibly schedule our afternoon meetings around my prayer times? It would only take ten minutes.", "Bisakah kita menjadwalkan rapat sore kita menyesuaikan waktu shalat saya? Hanya butuh sepuluh menit.", "Melakukan negosiasi hak beribadah dengan atasan di tempat kerja."),
            ("Hard", "Opposing Corruption", "I cannot sign this document. My faith prohibits bribery and deceit under any circumstances.", "Saya tidak bisa menandatangani dokumen ini. Keyakinan saya melarang suap dan penipuan dalam keadaan apa pun.", "Pendirian tegas menolak korupsi (Risywah) di lingkungan profesional.")
        ]
    },
    {
        "id": "di_family_home",
        "title": "Family & Home Life",
        "category": "Daily Conversations",
        "mainCategory": "Daily Conversations",
        "subCategory": "Islamic",
        "icon": "fa-home",
        "description": "Expressions related to Tarbiyah, honoring parents (Birrul Walidain), and maintaining a peaceful Islamic household.",
        "tasks": [
            ("Easy", "Greeting Parents", "Assalamu'alaikum, Mom and Dad. How was your day?", "Assalamu'alaikum, Ibu dan Ayah. Bagaimana hari kalian?", "Sapaan wajib ketika pulang ke rumah kepada orang tua."),
            ("Easy", "Eating Together", "Bismillah. Let's start eating. Remember to use your right hand.", "Bismillah. Ayo mulai makan. Ingat untuk menggunakan tangan kananmu.", "Mengingatkan adab makan sederhana kepada adik atau anak."),
            ("Easy", "Helping Around", "Mom, sit down and relax. I will wash the dishes for you tonight.", "Ibu, duduk dan bersantailah. Aku yang akan mencuci piring malam ini.", "Tindakan sederhana Birrul Walidain di rumah."),
            ("Easy", "Leaving Home", "Bismillahi tawakkaltu 'alallah. I'm leaving for school now, please pray for me.", "Bismillahi tawakkaltu 'alallah. Saya berangkat ke sekolah sekarang, tolong doakan saya.", "Membaca doa keluar rumah dan meminta doa restu."),
            ("Easy", "Sleeping Adab", "Don't forget to dust your bed and recite the 3 Quls before you sleep.", "Jangan lupa mengibaskan tempat tidurmu dan membaca 3 Qul sebelum tidur.", "Mengingatkan sunnah sebelum tidur kepada anggota keluarga."),
            ("Medium", "Apologizing to Parents", "I'm sorry for raising my voice earlier. I shouldn't have spoken to you that way.", "Maafkan saya karena meninggikan suara tadi. Saya tidak seharusnya berbicara seperti itu pada kalian.", "Berani meminta maaf saat melanggar adab kepada orang tua."),
            ("Medium", "Teaching Patience", "I know it's frustrating, but we have to teach the kids patience through our own actions.", "Saya tahu ini membuat frustrasi, tapi kita harus mengajarkan kesabaran pada anak-anak melalui tindakan kita sendiri.", "Diskusi suami istri tentang metode Tarbiyah anak."),
            ("Medium", "Resolving Conflicts", "Let's not go to sleep angry. The Prophet encouraged spouses to make peace quickly.", "Mari kita tidak tidur dalam keadaan marah. Nabi menganjurkan pasangan suami istri untuk cepat berdamai.", "Menyelesaikan pertengkaran rumah tangga sesuai tuntunan Sunnah."),
            ("Medium", "Screen Time Rules", "We need to limit their screen time and spend more time reading stories of the Prophets together.", "Kita perlu membatasi waktu layar mereka dan menghabiskan lebih banyak waktu membaca kisah para Nabi bersama.", "Mengatur aktivitas keluarga untuk lebih religius dan bermanfaat."),
            ("Medium", "Family Consultation", "Let's have a family meeting to decide on our vacation plans. Islam teaches us Shura (consultation).", "Mari kita adakan rapat keluarga untuk menentukan rencana liburan kita. Islam mengajarkan kita Musyawarah.", "Menerapkan sistem musyawarah dalam mengambil keputusan keluarga."),
            ("Hard", "Caring for Elderly", "Taking care of our elderly parents is a privilege and a direct path to Jannah, not a burden.", "Merawat orang tua kita yang sudah lanjut usia adalah sebuah kehormatan dan jalan langsung menuju Surga, bukan beban.", "Nasihat mendalam tentang merawat orang tua yang sepuh."),
            ("Hard", "Discussing Inheritance", "We must distribute the inheritance strictly according to the Shariah laws to maintain justice among the siblings.", "Kita harus membagikan warisan ini ketat sesuai hukum Syariat untuk menjaga keadilan di antara saudara kandung.", "Pembicaraan sensitif mengenai keadilan hukum waris Islam (Faraid)."),
            ("Hard", "Answering Tough Questions", "When children ask about Allah, we shouldn't dismiss them; we must answer with simple, age-appropriate logic.", "Saat anak bertanya tentang Allah, kita jangan mengabaikan mereka; kita harus menjawab dengan logika sederhana yang sesuai umurnya.", "Tantangan Tarbiyah dalam menjawab pertanyaan kritis anak."),
            ("Hard", "Supporting Relatives", "Silaturahim means maintaining ties even with relatives who have cut you off. We should invite them.", "Silaturahim berarti menyambung ikatan bahkan dengan kerabat yang telah memutusnya denganmu. Kita harus mengundang mereka.", "Prinsip berat namun mulia tentang menyambung tali persaudaraan yang retak."),
            ("Hard", "Spousal Support", "A righteous spouse acts as a garment for the other, covering their flaws and protecting their dignity.", "Pasangan yang saleh bertindak sebagai pakaian bagi yang lain, menutupi kekurangannya dan melindungi martabatnya.", "Mendiskusikan fungsi perlindungan pernikahan sesuai metafora Al-Quran.")
        ]
    },
    {
        "id": "di_community_dawah",
        "title": "Community & Dawah",
        "category": "Daily Conversations",
        "mainCategory": "Daily Conversations",
        "subCategory": "Islamic",
        "icon": "fa-hands-helping",
        "description": "Discussions on volunteering, advising others, attending Halaqah, and engaging with the community.",
        "tasks": [
            ("Easy", "Inviting to Halaqah", "Are you free this weekend? There's a great lecture about the Seerah at our local mosque.", "Apakah kamu luang akhir pekan ini? Ada kajian bagus tentang Sirah Nabawiyah di masjid kita.", "Mengajak teman untuk menghadiri majelis ilmu (Halaqah)."),
            ("Easy", "Volunteering", "I signed up to volunteer for the community Iftar cleanup tomorrow.", "Saya mendaftar jadi sukarelawan untuk bersih-bersih setelah buka puasa bersama besok.", "Berpartisipasi aktif dalam kegiatan masjid."),
            ("Easy", "Giving Charity", "Let's chip in some money for the orphans' fund. Every little bit counts.", "Ayo kita patungan sedikit uang untuk dana anak yatim. Sekecil apa pun sangat berarti.", "Mengajak teman untuk bersedekah bersama."),
            ("Easy", "Greeting Neighbors", "Good morning! We just moved next door and brought some sweets for you.", "Selamat pagi! Kami baru pindah ke sebelah dan membawakan sedikit manisan untuk Anda.", "Memuliakan tetangga, yang merupakan anjuran kuat dalam Islam."),
            ("Easy", "Checking Up", "I haven't seen brother Ali at Fajr lately. Let's send him a message to see if he's okay.", "Saya tidak melihat saudara Ali di shalat Subuh akhir-akhir ini. Ayo kirim pesan untuk melihat apakah dia baik-baik saja.", "Perhatian terhadap sesama anggota jamaah masjid."),
            ("Medium", "Advising Gently", "Brother, I noticed a small mistake in your Wudhu. Can I show you the correct way?", "Saudaraku, saya melihat sedikit kesalahan dalam wudhumu. Bolehkah saya tunjukkan cara yang benar?", "Memberikan nasihat/koreksi ibadah dengan sangat lembut dan tidak menggurui."),
            ("Medium", "Organizing Events", "We need a team to manage the crowd during Eid prayers to ensure everyone's safety.", "Kita butuh tim untuk mengatur kerumunan selama shalat Ied untuk memastikan keselamatan semua orang.", "Diskusi kepanitiaan acara hari raya Islam."),
            ("Medium", "Dawah to Non-Muslims", "Instead of arguing, we should show them the beauty of Islam through our excellent character.", "Daripada berdebat, kita seharusnya menunjukkan pada mereka keindahan Islam melalui akhlak kita yang luar biasa.", "Pendekatan dakwah bil hal (dengan perbuatan) kepada non-Muslim."),
            ("Medium", "Collecting Donations", "The mosque roof is leaking. We're running a campaign to collect funds for the repairs.", "Atap masjid bocor. Kami sedang menjalankan kampanye untuk mengumpulkan dana perbaikan.", "Menggalang dana untuk fasilitas ibadah umum."),
            ("Medium", "Supporting Reverts", "Being a new Muslim can be lonely. We should invite him to our family dinner.", "Menjadi Mualaf baru bisa sangat sepi. Kita harus mengundangnya ke makan malam keluarga kita.", "Kepedulian komunitas terhadap saudara baru yang butuh dukungan sosial."),
            ("Hard", "Mediator Role", "We need to sit down with both parties and mediate this conflict strictly based on Islamic justice.", "Kita perlu duduk bersama kedua belah pihak dan memediasi konflik ini ketat berdasarkan keadilan Islam.", "Berperan sebagai pendamai (Islah) dalam perselisihan warga/komunitas."),
            ("Hard", "Correcting Innovations", "It's difficult to speak out against common cultural practices that contradict the Sunnah without offending people.", "Sulit untuk angkat bicara menentang praktik budaya umum yang bertentangan dengan Sunnah tanpa menyinggung orang.", "Tantangan berdakwah meluruskan bid'ah dengan hikmah."),
            ("Hard", "Interfaith Dialogue", "During the interfaith panel, we must clearly define Tawheed while maintaining an atmosphere of mutual respect.", "Selama panel lintas agama, kita harus mendefinisikan Tauhid dengan jelas sambil menjaga suasana saling menghormati.", "Tugas berat menjelaskan akidah di ranah publik/lintas agama."),
            ("Hard", "Enjoining Good", "Enjoining good and forbidding evil is an obligation, but it must be done with knowledge and gentleness, not harshness.", "Menyuruh pada kebaikan dan mencegah kemungkaran adalah kewajiban, tapi harus dilakukan dengan ilmu dan kelembutan, bukan kekerasan.", "Menjelaskan prinsip Amr Ma'ruf Nahi Munkar sesuai manhaj yang benar."),
            ("Hard", "Community Defense", "When facing Islamophobia, our community needs to remain united, legally informed, and spiritually resilient.", "Saat menghadapi Islamofobia, komunitas kita harus tetap bersatu, paham hukum, dan tangguh secara spiritual.", "Diskusi strategis melindungi hak dan martabat umat Islam di tempat minoritas.")
        ]
    }
]

def generate_file_content(data):
    out = "import { ShadowingTheme } from './shadowingData';\n\n"
    out += "export const DAILY_ISLAMIC_THEMES: ShadowingTheme[] = [\n"
    
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
                tid = f"{theme['id']}_{diff[0].lower()}{counter}"
                out += f"      {{ id: {json.dumps(tid)}, title: {json.dumps(t[1])}, category: 'Daily Conversations', difficulty: {json.dumps(t[0])}, text: {json.dumps(t[2])}, translation: {json.dumps(t[3])}, scenario: {json.dumps(t[4])} }},\n"
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

with open('/Users/nurliafebriani/Downloads/lovspeak6/src/constants/shadowing_daily_islamic.ts', 'w') as f:
    f.write(generate_file_content(daily_data))

print("Daily Islamic generated successfully.")
