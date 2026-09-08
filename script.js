const playlist = [
    { title: "Kisah Klasik", artist: "Sheila On 7", src: "lagu1.mp3" },
    { title: "Tujuh Belas", artist: "Tulus", src: "lagu2.mp3" },
    { title: "Anak Sekolah", artist: "Chrisye", src: "lagu3.mp3" }
];

let currentTrack = 0;
const audio = document.getElementById('audioPlayer');

function toggleMusicModal() {
    const modal = document.getElementById('musicModal');
    modal.classList.toggle('show');
}

function playTrack(index) {
    currentTrack = index;
    audio.src = playlist[index].src;
    document.getElementById('currentTitle').innerText = playlist[index].title;
    document.getElementById('currentArtist').innerText = playlist[index].artist;
    
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, i) => {
        if(i === index) item.classList.add('active');
        else item.classList.remove('active');
    });

    audio.play();
    document.getElementById('mainPlayBtn').innerText = '❚❚';
}

function playPauseAudio() {
    if (audio.paused) {
        audio.play();
        document.getElementById('mainPlayBtn').innerText = '❚❚';
    } else {
        audio.pause();
        document.getElementById('mainPlayBtn').innerText = '▶';
    }
}

function nextSong() {
    currentTrack = (currentTrack + 1) % playlist.length;
    playTrack(currentTrack);
}

function prevSong() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    playTrack(currentTrack);
}
/* ================= KEUANGAN KELAS LOGIC ================= */
const initialFinanceData = [
  { no: 1, date: "22 Juli 2026", desc: "Pemasukan Kas Awal", type: "masuk", amount: 150000, balance: 150000 },
  { no: 2, date: "22 Juli 2026", desc: "Pembelian Buku Kas", type: "keluar", amount: 15000, balance: 135000 },
  { no: 3, date: "23 Juli 2026", desc: "Fotocopy Data Siswa", type: "keluar", amount: 19000, balance: 116000 },
  { no: 4, date: "23 Agustus 2026", desc: "Pemasukan Iuran Kas Kelas", type: "masuk", amount: 384000, balance: 500000 },
  { no: 5, date: "23 Agustus 2026", desc: "Iuran Swadaya Lomba", type: "keluar", amount: 20000, balance: 480000 },
  { no: 6, date: "31 Agustus 2026", desc: "Pemasukan Iuran Kas Kelas", type: "masuk", amount: 217000, balance: 697000 },
  { no: 7, date: "31 Agustus 2026", desc: "Iuran Swadaya Pilketos", type: "keluar", amount: 7000, balance: 690000 },
  { no: 8, date: "1 September 2026", desc: "Pemasukan Iuran Kas Kelas", type: "masuk", amount: 142000, balance: 832000 },
  { no: 9, date: "1 September 2026", desc: "Pembelian Spidol", type: "keluar", amount: 17000, balance: 815000 }
];

let financeData = JSON.parse(localStorage.getItem('kartini4_finance')) || initialFinanceData;
let isBendaharaLoggedIn = false;

function formatRupiah(number) {
  return 'Rp ' + number.toLocaleString('id-ID');
}

function renderFinanceTable() {
  const tbody = document.getElementById('finance-table-body');
  if(!tbody) return;

  let totalMasuk = 0;
  let totalKeluar = 0;
  let runningBalance = 0;

  let html = '';
  financeData.forEach((item, index) => {
    let masukStr = '-';
    let keluarStr = '-';

    if(item.type === 'masuk') {
      totalMasuk += item.amount;
      runningBalance += item.amount;
      masukStr = formatRupiah(item.amount);
    } else {
      totalKeluar += item.amount;
      runningBalance -= item.amount;
      keluarStr = formatRupiah(item.amount);
    }
    item.balance = runningBalance;

    html += `
      <tr>
        <td style="text-align:center;">${index + 1}</td>
        <td>${escapeHtml(item.date)}</td>
        <td><strong>${escapeHtml(item.desc)}</strong></td>
        <td style="color: #047857;">${masukStr}</td>
        <td style="color: #B91C1C;">${keluarStr}</td>
        <td style="font-weight:600;">${formatRupiah(item.balance)}</td>
        <td class="action-col" style="text-align:center;">
          ${isBendaharaLoggedIn ? `<button class="btn-delete" onclick="deleteTx(${index})">🗑️ Hapus</button>` : '-'}
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;

  // Update ringkasan atas
  document.getElementById('total-pemasukan').textContent = formatRupiah(totalMasuk);
  document.getElementById('total-pengeluaran').textContent = formatRupiah(totalKeluar);
  document.getElementById('total-saldo').textContent = formatRupiah(runningBalance);

  // Update footer tabel
  document.getElementById('footer-total-masuk').textContent = formatRupiah(totalMasuk);
  document.getElementById('footer-total-keluar').textContent = formatRupiah(totalKeluar);
  document.getElementById('footer-total-saldo').textContent = formatRupiah(runningBalance);

  // Update Tanggal pada Tanda Tangan PDF
  const lastDate = financeData.length > 0 ? financeData[financeData.length - 1].date : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('pdf-current-date').textContent = `Pekalongan, ${lastDate}`;

  localStorage.setItem('kartini4_finance', JSON.stringify(financeData));
}

window.deleteTx = function(index) {
  if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
    financeData.splice(index, 1);
    renderFinanceTable();
  }
};

renderFinanceTable();

/* Bendahara PIN Authentication */
const bendaharaLoginBtn = document.getElementById('bendahara-login-btn');
const bendaharaPinInput = document.getElementById('bendahara-pin-input');
const bendaharaPinError = document.getElementById('bendahara-pin-error');
const bendaharaAuth = document.getElementById('bendahara-auth');
const bendaharaFormContainer = document.getElementById('bendahara-form-container');

if (bendaharaLoginBtn) {
  bendaharaLoginBtn.addEventListener('click', () => {
    if (bendaharaPinInput.value.trim() === 'XK4123') {
      isBendaharaLoggedIn = true;
      bendaharaAuth.style.display = 'none';
      bendaharaFormContainer.style.display = 'block';
      bendaharaPinError.style.display = 'none';
      renderFinanceTable();
    } else {
      bendaharaPinError.style.display = 'block';
    }
  });
}

const addTxBtn = document.getElementById('add-tx-btn');
if (addTxBtn) {
  addTxBtn.addEventListener('click', () => {
    const dateVal = document.getElementById('tx-date').value;
    const typeVal = document.getElementById('tx-type').value;
    const descVal = document.getElementById('tx-desc').value.trim();
    const amountVal = parseFloat(document.getElementById('tx-amount').value);

    if (!descVal || isNaN(amountVal) || amountVal <= 0) {
      alert("Harap isi deskripsi dan jumlah transaksi dengan benar!");
      return;
    }

    let dateFormatted = dateVal ? new Date(dateVal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    financeData.push({
      no: financeData.length + 1,
      date: dateFormatted,
      desc: descVal,
      type: typeVal,
      amount: amountVal,
      balance: 0
    });

    renderFinanceTable();

    document.getElementById('tx-desc').value = '';
    document.getElementById('tx-amount').value = '';
    alert("Transaksi kas berhasil ditambahkan!");
  });
}

/* Ekspor Keuangan ke PDF */
const downloadPdfBtn = document.getElementById('download-pdf-btn');
if (downloadPdfBtn) {
  downloadPdfBtn.addEventListener('click', () => {
    const element = document.getElementById('pdf-report-area');
    
    // Sembunyikan kolom aksi sementara sebelum mengunduh PDF
    document.querySelectorAll('.action-col').forEach(col => col.style.display = 'none');

    const opt = {
      margin:       [0.3, 0.3, 0.3, 0.3],
      filename:     'Laporan_Kas_Bendahara_X_Kartini_4.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Tampilkan kembali kolom aksi setelah selesai mengunduh
      document.querySelectorAll('.action-col').forEach(col => col.style.display = '');
    });
  });
}
