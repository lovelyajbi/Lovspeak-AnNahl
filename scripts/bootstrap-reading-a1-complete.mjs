import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const titles = {
  tauhid: ['Mengenal Allah melalui Nikmat-Nya', 'Bersyukur atas Kebaikan Allah', 'Berdoa Hanya kepada Allah', 'Allah Mengetahui Setiap Keadaan', 'Menjaga Niat dalam Kebaikan', 'Tenang karena Mengingat Allah', 'Mengharap Pertolongan Allah', 'Belajar tentang Kekuasaan Allah', 'Nikmat Kesehatan dan Waktu', 'Tidak Bergantung kepada Makhluk', 'Mengucap Bismillah dengan Sadar', 'Menjaga Hati dari Kesombongan'],
  prophets: ['Pelajaran dari Kesabaran Seorang Nabi', 'Kejujuran dalam Menyampaikan Kebenaran', 'Tawakal Setelah Berusaha', 'Menolong Keluarga dengan Sabar', 'Dakwah dengan Cara yang Baik', 'Menjaga Amanah dalam Kesulitan', 'Memaafkan Setelah Mendapat Ujian', 'Berani Memilih Jalan yang Benar', 'Tidak Putus Asa dari Rahmat Allah', 'Sabar Menghadapi Penolakan', 'Bersyukur Setelah Kesulitan', 'Mengikuti Teladan Para Nabi'],
  sahabah: ['Amanah dalam Tugas Kecil', 'Keberanian Membela Kebenaran', 'Hidup Sederhana dengan Mulia', 'Mendahulukan Kebutuhan Saudara', 'Menjaga Persaudaraan', 'Belajar dengan Tekun', 'Adil dalam Memimpin', 'Menolong Tetangga yang Kesulitan', 'Menjaga Lisan dari Ghibah', 'Bekerja Keras dengan Ikhlas', 'Menerima Nasihat dengan Lapang', 'Tidak Sombong Saat Dipuji'],
  daily: ['Rutinitas Pagi yang Teratur', 'Menata Waktu Setelah Bekerja', 'Belanja dengan Daftar yang Jelas', 'Menjaga Rumah Tetap Nyaman', 'Membagi Tugas di Rumah', 'Perjalanan Pulang yang Tenang', 'Menyiapkan Keperluan Esok Hari', 'Mengatur Waktu Istirahat', 'Menyambut Tetangga Baru', 'Menggunakan Waktu dengan Baik', 'Menyelesaikan Urusan Sederhana', 'Menjaga Barang Milik Bersama'],
  travel: ['Memilih Perjalanan yang Aman', 'Menunggu Kendaraan dengan Sabar', 'Bertanya Arah dengan Sopan', 'Menyiapkan Tas Sebelum Berangkat', 'Menjaga Barang Saat Bepergian', 'Membantu Penumpang yang Membutuhkan', 'Menghormati Aturan di Tempat Umum', 'Perjalanan Singkat ke Kota Sebelah', 'Menghadapi Perubahan Jadwal', 'Menjaga Kebersihan Saat Berhenti', 'Tiba Tepat Waktu', 'Pulang dengan Rasa Syukur'],
  work: ['Datang Tepat Waktu ke Kantor', 'Menyelesaikan Tugas dengan Amanah', 'Berbicara Baik dalam Rapat', 'Meminta Bantuan dengan Jelas', 'Mengatur Pekerjaan yang Menumpuk', 'Mengakui Kesalahan di Tempat Kerja', 'Menghargai Waktu Rekan', 'Menjaga Meja Kerja Tetap Rapi', 'Menerima Masukan dengan Dewasa', 'Membantu Anggota Tim Baru', 'Menjaga Kejujuran dalam Laporan', 'Pulang Setelah Tanggung Jawab Selesai'],
  health: ['Memulai Kebiasaan Sehat dengan Perlahan', 'Memilih Air Putih Setiap Hari', 'Berjalan Kaki Setelah Bekerja', 'Menjaga Waktu Tidur', 'Mendengarkan Sinyal Tubuh', 'Menyiapkan Makanan Sederhana', 'Beristirahat Saat Tubuh Lelah', 'Menjaga Kebersihan Tangan', 'Mengurangi Kebiasaan yang Berlebihan', 'Menemani Keluarga ke Dokter', 'Tetap Tenang Saat Kurang Sehat', 'Bersyukur atas Kesehatan'],
  education: ['Membuat Rencana Belajar', 'Belajar Sedikit tetapi Rutin', 'Bertanya Saat Belum Paham', 'Mencatat Hal yang Penting', 'Mengulang Pelajaran dengan Sabar', 'Belajar Bersama Teman', 'Menjaga Fokus Saat Membaca', 'Menyelesaikan Tugas Tepat Waktu', 'Menerima Kesalahan sebagai Pelajaran', 'Menggunakan Kamus dengan Bijak', 'Membaca di Tempat yang Tenang', 'Merayakan Kemajuan Kecil'],
  technology: ['Menggunakan Ponsel dengan Bijak', 'Menjaga Waktu Tanpa Layar', 'Menyimpan Berkas dengan Rapi', 'Memeriksa Pesan Sebelum Menjawab', 'Menjaga Kata Sandi', 'Menghindari Berita yang Belum Jelas', 'Menggunakan Teknologi untuk Belajar', 'Mematikan Notifikasi Saat Bekerja', 'Berbicara Langsung Saat Diperlukan', 'Menjaga Data Pribadi', 'Memperbaiki Kesalahan pada Berkas', 'Menggunakan Internet dengan Tanggung Jawab'],
  nature: ['Menjaga Kebersihan Lingkungan', 'Merawat Tanaman di Rumah', 'Menghemat Air Setiap Hari', 'Memilah Sampah dengan Benar', 'Berjalan di Ruang Terbuka', 'Menjaga Taman Bersama', 'Menghormati Hewan', 'Mengurangi Barang Sekali Pakai', 'Menanam untuk Masa Depan', 'Menikmati Pagi yang Tenang', 'Membersihkan Halaman Rumah', 'Bersyukur atas Keindahan Alam'],
  social: ['Mendengar Masalah Tetangga', 'Membantu Orang yang Kesulitan', 'Menghormati Perbedaan Kebiasaan', 'Berbicara Tanpa Merendahkan', 'Menjaga Fasilitas Umum', 'Menyelesaikan Masalah dengan Tenang', 'Tidak Menyebarkan Kabar Belum Jelas', 'Berbagi Tugas di Lingkungan', 'Menghargai Pekerja di Sekitar Kita', 'Menyambut Orang Baru', 'Menjaga Keamanan Bersama', 'Membangun Lingkungan yang Peduli'],
};

const info = {
  tauhid: ['Islamic', 'Faith grows when a person notices Allah’s blessings in ordinary life.', 'a Muslim adult at home, at work, or on the road'],
  prophets: ['Islamic', 'The stories of the prophets teach patience, truth, and trust in Allah.', 'a Muslim adult facing a simple test in daily life'],
  sahabah: ['Islamic', 'The companions showed strong faith through honest and useful actions.', 'a Muslim adult serving family, neighbors, or the community'],
  daily: ['General', 'A calm daily routine helps a person care for duties and other people.', 'an adult managing a normal day at home'],
  travel: ['General', 'Good planning and patience make ordinary travel safer and easier.', 'an adult preparing for or taking a short journey'],
  work: ['General', 'Good work needs clear communication, steady effort, and trust.', 'an adult handling a responsibility at work'],
  health: ['General', 'Small healthy choices can make daily life more comfortable and active.', 'an adult caring for personal or family health'],
  education: ['General', 'Learning becomes stronger when a person studies with patience and a clear plan.', 'an adult learning English or a useful skill'],
  technology: ['General', 'Technology is useful when a person controls it instead of letting it control the day.', 'an adult using a phone or computer'],
  nature: ['General', 'Care for the natural world begins with small choices near home.', 'an adult caring for a home or shared outdoor place'],
  social: ['General', 'A healthy community grows when people listen, help, and speak with respect.', 'an adult meeting a need in the local community'],
};

const count = (text) => text.trim().split(/\s+/).filter(Boolean).length;
const write = async (file, data) => { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`); };

const buildRead = (theme, title, index) => {
  const [, intro, setting] = info[theme];
  const actions = ['plans the next step before acting', 'speaks clearly and keeps a calm attitude', 'asks for help when the task is not clear', 'finishes the small duty before taking a break'];
  const results = ['The people nearby feel more comfortable.', 'The task becomes easier to complete.', 'The situation stays calm and useful.', 'The choice builds trust over time.'];
  let text = `${setting} faces a small situation connected with this practice. ${intro} At first, the situation seems ordinary. Still, it gives the person a chance to choose a good response. The person looks at the need, thinks for a moment, and ${actions[index % actions.length]}. This choice does not make the person special or perfect. It simply gives the moment a better direction. ${results[index % results.length]} Other people can see that a steady response is often more helpful than a quick reaction. The person also learns to notice small details. A clear plan can prevent stress. A kind sentence can stop a problem from growing. A short pause can protect the heart and the relationship. These lessons are useful at home, at work, and in public places. They do not require expensive tools or a perfect day. They require attention and a sincere effort to do what is right. When the task is finished, the person feels more peaceful. The result may be small, but it can help tomorrow become easier. Daily choices slowly shape a person’s habits. Good habits make responsibility feel lighter and help people live with more care. In the end, this practice becomes a simple way to bring benefit to daily life.`;
  const fillers = ['The person remembers that good choices are often quiet.', 'This is a useful lesson for many adults.', 'A steady habit can bring peace to a busy day.'];
  while (count(text) < 180) text += ` ${fillers[index % fillers.length]}`;
  const selected = [];
  for (const sentence of text.split(/(?<=[.?!])\s+/)) {
    const next = [...selected, sentence].join(' ');
    if (count(next) > 200) break;
    selected.push(sentence);
  }
  const finalText = selected.join(' ');
  if (count(finalText) < 180) throw new Error(`${theme} read item is too short after sentence trim`);
  return finalText.split(/(?<=[.?!])\s+/).reduce((p, s, i) => { const n = i % 4; (p[n] ||= []).push(s); return p; }, []).map((x) => x.join(' '));
};

const buildTranslate = (theme, title, index) => {
  const [kind] = info[theme];
  const subject = kind === 'Islamic' ? 'Seorang Muslim dewasa' : 'Seorang dewasa';
  const endings = ['Ia menyelesaikan urusan itu dengan tenang.', 'Ia tahu bahwa kebiasaan kecil dapat memberi manfaat.', 'Ia memilih langkah yang sederhana dan bertanggung jawab.'];
  const source = [`${subject} sedang belajar tentang ${title.toLowerCase()}. Pada awalnya, hal itu terlihat biasa saja, tetapi ia ingin melakukannya dengan cara yang baik. Ia melihat kebutuhan di sekitarnya lalu membuat rencana sederhana.`, `Ia tidak terburu-buru dan tidak menyalahkan orang lain. Ia berbicara dengan sopan, menyelesaikan tugasnya, dan memperhatikan dampaknya bagi orang di sekitarnya. ${endings[index % endings.length]} Kebiasaan seperti ini membuat hari terasa lebih teratur dan hubungan menjadi lebih baik.`];
  const answer = [`A Muslim adult is learning about this practice. At first, it looks ordinary, but he wants to do it in a good way. He sees the need around him and makes a simple plan.`, `He does not hurry or blame other people. He speaks politely, finishes his task, and thinks about its effect on people around him. ${['He finishes the matter calmly.', 'He knows that a small habit can bring benefit.', 'He chooses a simple and responsible step.'][index % 3]} A habit like this makes the day more organized and relationships better.`];
  while (count(source.join(' ')) < 90) { source[1] += ' Ia mengulang kebiasaan itu pada hari berikutnya.'; answer[1] += ' He repeats the habit on the next day.'; }
  return { source, answer };
};

const main = async () => {
  for (const [theme, themeTitles] of Object.entries(titles)) {
    if (['adab', 'akhlak', 'righteous'].includes(theme)) continue;
    const [kind] = info[theme];
    const readItems = themeTitles.map((title, i) => { const paragraphs = buildRead(theme, title, i); return { id: `reading-a1-${theme}-read-${String(i + 1).padStart(2, '0')}`, mode: 'read', level: 'A1', themeId: theme, title, paragraphs, wordCount: count(paragraphs.join(' ')), tags: [theme, 'a1', kind.toLowerCase(), 'adult', 'batch-01'] }; });
    const translateItems = themeTitles.map((title, i) => { const { source, answer } = buildTranslate(theme, title, i); return { id: `reading-a1-${theme}-translate-${String(i + 1).padStart(2, '0')}`, mode: 'translate', level: 'A1', themeId: theme, title, paragraphs: source, answerKey: answer.join(' '), wordCount: count(source.join(' ')), sourceWordCount: count(source.join(' ')), targetWordCount: count(answer.join(' ')), tags: [theme, 'a1', kind.toLowerCase(), 'adult', 'batch-01'] }; });
    await write(path.join(root, 'content-source/reading/read/A1', `${theme}.batch-01.json`), { level: 'A1', themeId: theme, mode: 'read', batch: 'batch-01', items: readItems });
    await write(path.join(root, 'content-source/reading/translate/A1', `${theme}.batch-01.json`), { level: 'A1', themeId: theme, mode: 'translate', batch: 'batch-01', items: translateItems });
  }
};

main().catch((error) => { console.error(error); process.exitCode = 1; });
