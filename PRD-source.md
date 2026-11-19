# Product Requirements Document (PRD): GuillotineVote
**Target Kompetisi:** Kiroween 2026 (Devpost)  
**Kategori:** Costume Contest  
**Bentuk Produk:** Interactive Web Directory & Reverse-Voting Website (100% Client-Side HTML/CSS/JS)  
**Batas Waktu URL Aktif:** Wajib hidup & gratis minimal sampai 29 Januari 2027  

---

## 1. Materi Wajib Devpost (Siap Copy-Paste dalam Bahasa Inggris)

### A. Elevator Pitch (Maksimal 200 Karakter)
> Kill the "Up to you!" curse. A horror-themed reverse-voting website where groups take turns executing their most hated options on the guillotine until one survivor remains. *(173 karakter)*

### B. Category Description (Wajib Menyebut Nama Kategori di Awal Kalimat)
> **Costume Contest** — GuillotineVote transforms group decision-making into a medieval execution stage where the horror theme directly powers the core functionality: instead of voting for what they like, participants take turns dropping the guillotine blade on options they hate, complete with a 10-second Idle Executioner timer, a single Royal Pardon shield, and a public Graveyard of eliminated choices with their execution verdicts.

---

## 2. Latar Belakang Masalah & Konsep Inti

### Masalah Nyata
Saat grup pertemanan, mahasiswa kerja kelompok, atau rekan kerja harus memilih satu keputusan (tempat makan malam, lokasi nongkrong, film yang mau ditonton, atau topik tugas), diskusi selalu buntu karena dua hal:
1. Semua orang menjawab **"Terserah"**, tapi langsung menolak ketika satu pilihan diusulkan.
2. *Polling* biasa berakhir **seri** (misal: 4 orang memilih 4 makanan berbeda sehingga skornya $1-1-1-1$).

### Solusi GuillotineVote ( kenapa Tidak Pasaran )
Manusia sering kesulitan menentukan apa yang paling mereka sukai, tetapi **sangat cepat tahu apa yang paling mereka benci**. 
GuillotineVote membalik cara kerja *polling*: semua pilihan disejajarkan di bawah pisau *Guillotine*. Anggota grup bergantian **memenggal 1 pilihan yang paling tidak mereka inginkan** beserta alasannya, sampai tersisa **1 pilihan terakhir yang selamat** dan disepakati bersama.

---

## 3. Struktur Halaman Website (Dari Atas ke Bawah)

Supaya terasa seperti **website utuh yang kaya secara visual** (bukan sekadar satu kotak aplikasi kosong), halaman web dibagi menjadi 4 bagian (*sections*) yang mengalir saat di-*scroll*:

### Bagian 1: Header & Katalog Skenario Cepat (*The Courtroom Landing*)
* **Visual:** Judul besar bergaya poster klasik abad pertengahan/horor dengan latar gelap elegan dan ilustrasi pisau *Guillotine*.
* **Fungsi:** Penjelasan 1 kalimat tentang aturan main, diikuti **4 Tombol Paket Siap Pakai (1-Click Presets)** agar juri tidak perlu mengetik manual:
  1. *Dinner Dilemma* (Sushi, Ramen, Burger, Nasi Padang, Bakso, Pizza)
  2. *Friday Movie Night* (Horror, Sci-Fi, Action, Comedy, Documentary)
  3. *Team Hangout Spot* (Board Game Cafe, Karaoke, Bowling, Coffee Shop, Park)
  4. *Campus Project Topic* (E-Commerce, Health Tracker, EdTech, FinTech, Game)
* Tersedia juga kolom input sederhana jika pengunjung ingin mengetik daftar pilihan dan nama pemain sendiri.

### Bagian 2: Panggung Eksekusi (*The Chopping Block*)
* **Indikator Giliran & Timer Algojo:** Menampilkan siapa yang sedang memegang tuas (misal: *"Giliran: Budi"*) dan hitung mundur **10 detik**.
* **Deretan Kartu Tawanan:** Pilihan yang masih hidup ditampilkan sebagai kartu karakter di bawah bayang-bayang pisau *Guillotine*.
* **Tombol Alasan Tebas (*Execution Verdict*):** Sebelum menjatuhkan pisau pada satu pilihan, pemain mengklik alasan cepat: `Too Expensive` (Kemahalan), `Too Far` (Kejauhan), `Boring` (Bosan), atau `Not Today` (Lagi Gak Mood).
* **Koin Pengampunan (*Royal Pardon*):** Satu tombol perisai emas yang hanya bisa dipakai **1 kali dalam satu permainan** untuk menyelamatkan pilihan yang hendak dipenggal teman.

### Bagian 3: Kuburan Pilihan Gugur (*The Graveyard*)
* Setiap pilihan yang dipenggal langsung turun ke bagian bawah website dan berubah menjadi **Batu Nisan (Headstone)**.
* Di setiap batu nisan tertulis riwayat kematiannya, contoh:  
  > **RIP Sushi**  
  > *Dipenggal oleh Raka pada Putaran ke-2*  
  > *Alasan: "Too Expensive"*

### Bagian 4: Dekrit Pemenang & Bagikan Link (*The Survivor's Decree*)
* Ketika tersisa $1$ pilihan terakhir, layar menampilkan pengumuman pemenang lengkap dengan ringkasan sejarah eksekusi.
* Tombol **Copy Shareable Link**: menghasilkan URL khusus (contoh: `guillotinevote.vercel.app/?winner=Bakso&dead=Sushi,Ramen`) yang bisa dibuka siapa saja untuk melihat halaman hasil akhir dan kuburannya tanpa butuh database.

---

## 4. Batasan Fitur MVP (2–3 Minggu Pengerjaan)

### Fitur yang WAJIB MASUK (In-Scope)
1. **4 Paket Preset Siap Klik** + form tambah pilihan/pemain manual.
2. **Mesin Giliran & Eliminasi (`engine.js`)**: menghitung giliran pemain dan menyisakan 1 pemenang dari $N$ pilihan awal ($N \ge 2$).
3. **Timer Algojo Otomatis (10 Detik)**: jika waktu habis karena pemain bilang "terserah"/diam saja, pisau jatuh memenggal 1 pilihan secara acak.
4. **Fitur 1x *Royal Pardon***: membatalkan eksekusi pada giliran tersebut dan langsung lanjut ke pemain berikutnya.
5. **Animasi CSS & Efek Suara Web Audio**: animasi pisau turun (`transform: translateY`), efek layar bergetar (`@keyframes shake`), dan bunyi tebasan sintetis dari *Web Audio API* (tanpa perlu file MP3 besar).
6. **Bagian Kuburan (*Graveyard*) & Share via URL Parameter**.

### Fitur yang SENGAJA DIBUANG (Out-of-Scope)
1. **TIDAK ADA Login / Buat Akun / Password** (menghindari hambatan saat juri mencoba).
2. **TIDAK ADA Database Backend (Supabase/Firebase/MySQL)** (semua data berjalan di browser & URL agar 100% gratis dan anti-mati sampai Januari 2027).
3. **TIDAK ADA Multiplayer Beda HP via WebSocket** (cukup dipakai bersama di 1 layar laptop/HP saat kumpul atau lewat *share screen* Zoom/Discord).
4. **TIDAK ADA Paid AI/LLM API** (mencegah error kuota habis saat dinilai juri).

---

## 5. Rencana Konkret Pemakaian Kiro (Rahasia Skor 20% Tech Implementation)

Folder `/.kiro` di *root* repository GitHub tidak boleh kosong atau sekadar formalitas. Berikut isi konkret yang akan kita bangun:

### A. Spec-Driven Development (`/.kiro/specs/guillotine-engine/`)
Buat 3 file spesifikasi sebelum membuat kode logika:
* `requirements.md`: Mendefinisikan aturan bisnis dalam format *EARS (Easy Approach to Requirements Syntax)*:
  * *WHEN* jumlah pilihan hidup $> 1$ dan pemain memilih opsi + alasan, *THE SYSTEM SHALL* mengubah status opsi menjadi `dead`, mencatat pelaku & alasan ke *Graveyard*, dan memindahkan giliran ke pemain berikutnya.
  * *IF* timer 10 detik mencapai $0$, *THEN THE SYSTEM SHALL* memilih 1 opsi hidup secara acak dan mengeksekusinya dengan alasan `"Executed by Idle Hangman"`.
  * *WHEN* tombol *Royal Pardon* ditekan, *THE SYSTEM SHALL* membatalkan pemenggalan pada giliran itu dan menonaktifkan koin *Royal Pardon* untuk sisa permainan.
* `design.md`: Skema data state JSON (`options`, `players`, `currentTurnIndex`, `pardonUsed`, `graveyardLog`) dan diagram alur perubahan status.
* `tasks.md`: Daftar langkah implementasi bertahap dari pembuatan fungsi murni di `src/engine.js`, pengujian otomatis, hingga penyambungan ke tampilan HTML/CSS.

### B. Kiro Steering (`/.kiro/steering/`)
Buat 3 file pengarah gaya koding untuk Kiro:
* `product.md`: Menjelaskan bahwa semua teks antarmuka website wajib menggunakan bahasa Inggris dengan kosakata pengadilan abad pertengahan (*The Accused*, *Drop the Blade*, *Royal Pardon*, *The Graveyard*).
* `tech.md`: Memerintahkan Kiro untuk menggunakan **Vanilla HTML, CSS, dan ES Modules JavaScript murni** tanpa ketergantungan server, serta memisahkan logika aturan main di `src/engine.js` dari manipulasi tampilan di `src/ui.js`.
* `horror-ux.md`: Aturan desain visual kategori *Costume Contest* (kontras tinggi, warna merah darah `#dc2626`, emas kuno `#d97706`, latar belakang gelap `#0f0f12`, serta tombol yang mudah diakses).

### C. Agent Hooks (`/.kiro/hooks/`)
Buat 2 otomatisasi *hook* di Kiro:
* `test-on-save.json`: Setiap kali file `src/engine.js` disimpan, Kiro otomatis menjalankan *Property-Based Testing* (`npm test`) untuk memastikan tidak ada aturan permainan yang rusak.
* `validate-presets.json`: Setiap kali daftar paket contoh di `src/presets.js` diubah, Kiro memeriksa agar setiap paket memiliki minimal 4 pilihan dan tidak ada nama pilihan yang kembar.

### D. Property-Based Testing / PBT (`tests/engine.property.test.js`)
Gunakan library ringan **`fast-check`** (hanya untuk testing di lokal/GitHub) guna menguji ratusan kombinasi acak pada `src/engine.js`. Tiga sifat mutlak (*properties*) yang diuji:
1. **Invarian Pemenang Tunggal:** Untuk daftar pilihan awal sebanyak $N$ (di mana $2 \le N \le 50$), setelah dilakukan tepat $N - 1$ kali eksekusi sah, jumlah pilihan yang berstatus `alive` **pasti selalu tepat $1$** dan jumlah batu nisan di `graveyard` **pasti tepat $N - 1$**.
2. **Invarian Royal Pardon:** Jika `useRoyalPardon()` dipanggil pada giliran ke-$k$, jumlah pilihan `alive` sebelum dan sesudah giliran ke-$k$ harus tetap sama, dan pemanggilan `useRoyalPardon()` kedua kalinya dalam sesi yang sama harus selalu ditolak (*return error/false*).
3. **Invarian Share URL (Round-Trip):** Mengubah hasil akhir permainan menjadi parameter URL (`encodeShareState`) lalu membacanya kembali (`decodeShareState`) harus selalu menghasilkan nama pemenang dan daftar batu nisan yang 100% identik.

---

## 6. Storyboard Video Demo YouTube (< 3 Menit, Detik demi Detik)

*Semua teks di layar dan narasi suara/subtitle menggunakan Bahasa Inggris.*

* **0:00 – 0:25 | Masalah & Halaman Utama Website**
  * Tampilkan layar website **GuillotineVote** yang sudah di-hosting publik.
  * Narasi singkat: *"Group polls always end in a tie, and everyone says 'Up to you!' until you suggest something they hate. Welcome to GuillotineVote—where you don't vote for what you want, you execute what you hate."*
* **0:25 – 0:55 | Klik Preset & Masuk ke Panggung Eksekusi**
  * Klik tombol preset **"Dinner Dilemma"** (6 pilihan makanan langsung muncul di panggung di bawah pisau *Guillotine*).
  * Tunjukkan giliran Pemain 1: pilih kartu **Sushi**, klik alasan **"Too Expensive"**, lalu tekan tombol merah **"DROP THE BLADE"**.
  * Pisau turun dengan suara tebasan, layar bergetar, dan **Sushi** jatuh ke bagian bawah halaman menjadi batu nisan di *The Graveyard*.
* **0:55 – 1:35 | Fitur Unggulan: *Royal Pardon* & *Idle Executioner***
  * Giliran Pemain 2: mencoba memenggal **Bakso**, tetapi Pemain 3 menekan tombol emas **"ROYAL PARDON"**—perisai muncul menahan pisau, **Bakso** selamat!
  * Giliran Pemain 3: biarkan kursor diam selama 10 detik untuk memamerkan timer. Saat angka mencapai $0$, **Algojo Otomatis** menjatuhkan pisau secara acak ke **Pizza** karena pemain terlalu lama berpikir.
* **1:35 – 2:10 | Pemenang Terakhir, Kuburan, & Bukti Link Share**
  * Tebas pilihan tersisa hingga **Bakso** keluar sebagai *Sole Survivor*.
  * *Scroll* halaman ke bawah untuk memperlihatkan deretan Batu Nisan lengkap dengan catatan siapa yang memenggal setiap makanan, lalu klik **Copy Share Link** dan buka di tab baru untuk membuktikan hasilnya tersimpan di URL.
* **2:10 – 2:50 | Pamer Kekuatan Kiro (`/.kiro`)**
  * Tampilkan layar VS Code/Kiro selama 40 detik: perlihatkan struktur folder `/.kiro/specs`, `/.kiro/steering`, `/.kiro/hooks`, dan jalankan perintah `npm test` di terminal yang menampilkan ratusan skenario *Property-Based Testing (PBT)* lulus sempurna (centang hijau).

---

## 7. Tiga Risiko Terbesar & Cara Menurunkannya

| Risiko | Dampak pada Penilaian | Cara Menurunkan Risiko (Mitigasi) |
| :--- | :--- | :--- |
| **1. Juri malas mengetik pilihan saat menguji URL website** | Juri menutup website sebelum melihat fitur utamanya. | Letakkan **4 tombol Preset Sekali Klik** tepat di bagian paling atas halaman utama sehingga juri bisa langsung menjatuhkan pisau *Guillotine* dalam 3 detik pertama. |
| **2. Efek suara tidak keluar karena diblokir browser** | Suasana horor terasa kurang hidup. | Gunakan *Web Audio API Synthesizer* yang otomatis aktif tepat saat pengguna mengeklik tombol pertama (*Preset* atau *Start*), ditambah tombol *Mute/Unmute* di pojok kanan atas. |
| **3. Dianggap terlalu sederhana secara teknis oleh juri** | Skor *Technological Implementation* (20%) rendah. | Pisahkan seluruh logika permainan ke dalam modul murni `src/engine.js` dan tulis pengujian **Property-Based Testing (`fast-check`)** + spesifikasi EARS lengkap di dalam folder `/.kiro`. |

---

## 8. Rencana Kerja Santai 2–3 Minggu

* **Minggu 1 (Fondasi & Kiro Specs):**
  * Buat folder `/.kiro/steering` dan `/.kiro/specs`.
  * Bangun logika murni `src/engine.js` (fungsi tambah opsi, tebas opsi, *Royal Pardon*, timer acak, dan pembuat link URL) + pengujian PBT.
* **Minggu 2 (Desain Website HTML/CSS & Animasi):**
  * Bangun tata letak 4 bagian halaman website (Landing Preset, Panggung Guillotine, Kuburan Batu Nisan, Dekrit Pemenang).
  * Tambahkan animasi pisau turun, getaran layar CSS, dan efek suara tebasan.
* **Minggu 3 (Deploy, Cek Aturan, & Rekaman Video):**
  * Unggah ke **Vercel** atau **GitHub Pages** (pastikan repo publik, ada lisensi MIT, dan folder `/.kiro` ikut ter-upload, bukan masuk `.gitignore`).
  * Rekam video demo $< 3$ menit dan lengkapi halaman pengumpulan Devpost.