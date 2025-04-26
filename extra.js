// Toggle Dark/Light Mode
const toggle = document.getElementById('toggle-mode');
const modeText = document.getElementById('mode-text');

toggle.addEventListener('change', function () {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    modeText.innerText = 'Dark Mode';
  } else {
    modeText.innerText = 'Light Mode';
  }
});

// Format angka ke Rupiah
function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

// Ganti semua outputan angka di script.js kamu
// Contoh: document.getElementById("info-ongkir").innerText = `Total Ongkir: ${formatRupiah(totalOngkir)}`;
