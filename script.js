let riwayatAntar = JSON.parse(localStorage.getItem("riwayatAntar")) || [];
let editIndex = -1; // Tambahan untuk fitur edit notes

// Fungsi format rupiah
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

  document.getElementById("dari").value = "";
  document.getElementById("ke").value = "";
  document.getElementById("ongkir").value = "";
  document.getElementById("modal").value = "";
  document.getElementById("bensin").value = "";
  document.getElementById("jajan").value = "";
  document.getElementById("target").value = "";

  document.getElementById("info-ongkir").innerText = "";
  document.getElementById("daftar-antar").innerHTML = "";
  document.getElementById("info-iuran").innerText = "";
  document.getElementById("info-operasional").innerText = "";
  document.getElementById("pendapatan-kotor").innerText = "";
  document.getElementById("pendapatan-bersih").innerText = "";
  document.getElementById("hasil-final").innerText = "";
  document.getElementById("motivasi").innerText = "";
  document.getElementById("uang-sekarang").innerText = "";
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem("riwayatAntar")) {
    riwayatAntar = JSON.parse(localStorage.getItem("riwayatAntar"));
    hitung();
  }

  // Notes Popup
  const popup = document.getElementById('notes-popup');
  const icon = document.getElementById('notes-icon');
  const minimizeBtn = document.getElementById('minimize-btn');
  const saveBtn = document.getElementById('save-note');
  const notesList = document.getElementById('notes-list');

  loadNotes();
  icon.classList.remove('hidden');

  minimizeBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
    icon.classList.remove('hidden');
  });

  icon.addEventListener('click', () => {
    popup.classList.remove('hidden');
    icon.classList.add('hidden');
  });

  saveBtn.addEventListener('click', () => {
    const nama = document.getElementById('nama').value.trim();
    const noWa = document.getElementById('no-wa').value.trim();
    const isi = document.getElementById('isi-catatan').value.trim();

    if (nama && noWa && isi) {
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const date = new Date().toLocaleDateString();

      if (editIndex === -1) {
        notes.push({ nama, noWa, isi, date });
      } else {
        notes[editIndex] = { nama, noWa, isi, date };
        editIndex = -1;
      }

      localStorage.setItem('notes', JSON.stringify(notes));

      document.getElementById('nama').value = '';
      document.getElementById('no-wa').value = '';
      document.getElementById('isi-catatan').value = '';
      loadNotes();
    } else {
      alert('Isi semua field ya!');
    }
  });
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
      <b>${note.nama}</b><br/>
      <a href="https://wa.me/${note.noWa}" target="_blank">${note.noWa}</a><br/>
      <p>${note.isi}</p>
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

  document.getElementById('nama').value = note.nama;
  document.getElementById('no-wa').value = note.noWa;
  document.getElementById('isi-catatan').value = note.isi;

  editIndex = index;
  document.getElementById('notes-popup').classList.remove('hidden');
  document.getElementById('notes-icon').classList.add('hidden');
};
