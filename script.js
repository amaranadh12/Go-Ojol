let riwayatAntar = JSON.parse(localStorage.getItem("riwayatAntar")) || [];
let daftarBarang = [];
let editIndex = -1;

function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

function tambahOngkir() {
  const dari = document.getElementById("dari").value.trim();
  const ke = document.getElementById("ke").value.trim();
  const ongkir = parseInt(document.getElementById("ongkir").value);

  if (dari && ke && !isNaN(ongkir)) {
    riwayatAntar.push({ dari, ke, ongkir });
    localStorage.setItem("riwayatAntar", JSON.stringify(riwayatAntar));

    document.getElementById("dari").value = "";
    document.getElementById("ke").value = "";
    document.getElementById("ongkir").value = "";

    alert("Antar ditambahkan!");
    hitung();
  } else {
    alert("Lengkapi semua data antar & isi ongkir dengan benar.");
  }
}

function hitung() {
  const modal = parseInt(document.getElementById("modal").value) || 0;
  const bensin = parseInt(document.getElementById("bensin").value) || 0;
  const jajan = parseInt(document.getElementById("jajan").value) || 0;
  const target = parseInt(document.getElementById("target").value) || 0;

  const totalOngkir = riwayatAntar.reduce((a, b) => a + b.ongkir, 0);
  const totalOrder = riwayatAntar.length;
  const totalIuran = totalOrder * 1000;
  const totalOperasional = bensin + jajan;
  const pendapatanBersih = totalOngkir - totalOperasional;
  const uangSekarang = modal + pendapatanBersih;

  document.getElementById("info-ongkir").innerText = `Total Ongkir: ${formatRupiah(totalOngkir)}`;

  let daftarHTML = "";
  riwayatAntar.forEach((item, index) => {
    daftarHTML += `<li>${index + 1}) Dari ${item.dari} ke ${item.ke} - ${formatRupiah(item.ongkir)}</li>`;
  });
  document.getElementById("daftar-antar").innerHTML = daftarHTML;

  document.getElementById("info-iuran").innerText = `Total Iuran (Rp1.000 x ${totalOrder} order): ${formatRupiah(totalIuran)}`;
  document.getElementById("info-operasional").innerText = `Total Pengeluaran Operasional: ${formatRupiah(totalOperasional)}`;
  document.getElementById("pendapatan-kotor").innerText = `Pendapatan Kotor: ${formatRupiah(totalOngkir)}`;
  document.getElementById("pendapatan-bersih").innerText = `Pendapatan Bersih: ${formatRupiah(pendapatanBersih)}`;
  document.getElementById("uang-sekarang").innerText = `Perkiraan Uang Sekarang: ${formatRupiah(uangSekarang)}`;

  let hasil = "";
  let motivasi = "";

  if (pendapatanBersih >= 0) {
    hasil = "Keren! Pengeluaran tertutupi. Modal tidak terpakai.";
    if (target && pendapatanBersih >= target) {
      motivasi = "Target penghasilan bersih tercapai! Gas terus!";
    } else if (target) {
      const kurang = target - pendapatanBersih;
      motivasi = `Kurang ${formatRupiah(kurang)} lagi untuk capai target. Masih bisa dikejar!`;
    }
  } else {
    hasil = `Pengeluaran tidak tertutupi, memakai ${formatRupiah(Math.abs(pendapatanBersih))} dari modal.`;
    motivasi = "Yuk semangat, besok bisa lebih baik!";
  }

  document.getElementById("hasil-final").innerText = hasil;
  document.getElementById("motivasi").innerText = motivasi;
}

function reset() {
  riwayatAntar = [];
  localStorage.removeItem("riwayatAntar");
  document.querySelectorAll('input').forEach(input => input.value = '');
  document.querySelectorAll('p').forEach(p => p.innerText = '');
  document.getElementById('daftar-antar').innerHTML = '';
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem("riwayatAntar")) {
    riwayatAntar = JSON.parse(localStorage.getItem("riwayatAntar"));
    hitung();
  }

  const popup = document.getElementById('notes-popup');
  const icon = document.getElementById('notes-icon');
  const minimizeBtn = document.getElementById('minimize-btn');

  loadNotes();
  icon.classList.remove('hidden');

  minimizeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    icon.classList.remove('hidden');
  });

  icon.addEventListener('click', () => {
    popup.style.display = 'block';
    icon.classList.add('hidden');
  });
});

// NOTE SYSTEM
document.getElementById('tambah-barang').addEventListener('click', () => {
  const namaBarang = document.getElementById('nama-barang').value.trim();
  const hargaBarang = parseInt(document.getElementById('harga-barang').value);

  if (namaBarang && !isNaN(hargaBarang)) {
    daftarBarang.push({ nama: namaBarang, harga: hargaBarang });
    document.getElementById('nama-barang').value = '';
    document.getElementById('harga-barang').value = '';
    renderBarangList();
  } else {
    alert('Isi nama barang dan harga dengan benar.');
  }
});

function renderBarangList() {
  const barangList = document.getElementById('barang-list');
  barangList.innerHTML = daftarBarang.map((b, i) => 
    `<div>${i+1}. ${b.nama} - ${formatRupiah(b.harga)} 
     <button onclick="hapusBarang(${i})" style="color:red;">Hapus</button></div>`).join('');
}

function hapusBarang(index) {
  daftarBarang.splice(index, 1);
  renderBarangList();
}

document.getElementById('save-note').addEventListener('click', () => {
  const catatanTambahan = document.getElementById('catatan-tambahan').value.trim();
  if (daftarBarang.length === 0) {
    alert('Minimal masukkan 1 barang.');
    return;
  }

  const totalHarga = daftarBarang.reduce((sum, b) => sum + b.harga, 0);
  const date = new Date().toLocaleString('id-ID');

  const notes = JSON.parse(localStorage.getItem('notes') || '[]');

  const newNote = {
    barang: daftarBarang,
    totalHarga,
    catatanTambahan,
    date
  };

  if (editIndex === -1) {
    notes.push(newNote);
  } else {
    notes[editIndex] = newNote;
    editIndex = -1;
  }

  localStorage.setItem('notes', JSON.stringify(notes));
  daftarBarang = [];
  document.getElementById('catatan-tambahan').value = '';
  renderBarangList();
  loadNotes();
});

function loadNotes() {
  const notesList = document.getElementById('notes-list');
  notesList.innerHTML = '';
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');

  notes.forEach((note, index) => {
    const div = document.createElement('div');
    div.className = 'note-item';
    div.innerHTML = `
      <small><b>${note.date}</b></small><br/>
      <ul>${note.barang.map(b => `<li>${b.nama} - ${formatRupiah(b.harga)}</li>`).join('')}</ul>
      <b>Total: ${formatRupiah(note.totalHarga)}</b><br/>
      ${note.catatanTambahan ? `<i>Catatan: ${note.catatanTambahan}</i><br/>` : ''}
      <button class="edit-note" onclick="editNote(${index})">Edit</button>
      <button class="delete-note" onclick="deleteNote(${index})">&times;</button>
    `;
    notesList.appendChild(div);
  });
}

window.deleteNote = function(index) {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  loadNotes();
};

window.editNote = function(index) {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  const note = notes[index];
  daftarBarang = note.barang;
  document.getElementById('catatan-tambahan').value = note.catatanTambahan;
  renderBarangList();
  editIndex = index;
};
