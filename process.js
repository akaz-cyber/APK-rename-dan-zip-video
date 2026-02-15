function confirmProcess() {
  const fileInput = document.getElementById("videoInput");
  if (fileInput.files.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Tolong pilih video terlebih dahulu!",
    });
    return;
  }

  // Ambil start number untuk konfirmasi (opsional, agar user tahu)
  const startNumInput = document.getElementById("startNumber").value;
  const startNum = startNumInput ? parseInt(startNumInput) : 1;

  Swal.fire({
    title: "Apakah anda yakin?",
    text: `Anda akan memproses ${fileInput.files.length} video. Penamaan dimulai dari nomor ${startNum}.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, Proses!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      executeProcess();
    }
  });
}

function executeProcess() {
  const fileInput = document.getElementById("videoInput");
  const categorySelect = document.getElementById("category");
  // Ambil elemen input nomor awal
  const startNumberInput = document.getElementById("startNumber");

  const statusDiv = document.getElementById("status");
  const previewDiv = document.getElementById("preview");
  const processBtn = document.getElementById("processBtn");

  processBtn.disabled = true;
  processBtn.innerText = "⏳ Sedang Memproses...";
  statusDiv.innerText = "Sedang mengompres data... mohon tunggu.";
  previewDiv.innerHTML = "";

  const files = fileInput.files;
  const prefix = categorySelect.value;
  const zip = new JSZip();

  let currentNum = parseInt(startNumberInput.value);
  if (isNaN(currentNum) || currentNum < 0) {
    currentNum = 1;
  }

  const startSequence = currentNum;

  let listHTML = "<strong>Preview Nama Baru:</strong><br/><ul>";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const extension = file.name.slice(
      ((file.name.lastIndexOf(".") - 1) >>> 0) + 2
    );

    const newName = `${prefix}${currentNum + i}.${extension}`;

    zip.file(newName, file);
    listHTML += `<li>${file.name} ➡️ <strong>${newName}</strong></li>`;
  }
  listHTML += "</ul>";
  previewDiv.innerHTML = listHTML;

  const endSequence = startSequence + files.length - 1;

  const zipFilename = `${prefix} ${startSequence}-${endSequence}.zip`;

  zip
    .generateAsync({ type: "blob" })
    .then(function (content) {
      saveAs(content, zipFilename);

      statusDiv.innerText = `Berhasil! File ✅ "${zipFilename}" sedang didownload.`;
      processBtn.disabled = false;
      processBtn.innerText = "🚀 Proses & Download ZIP";
      Swal.fire({
        icon: "success",
        title: "Selesai!",
        text: `File ZIP "${zipFilename}" berhasil dibuat.`,
        timer: 2000,
        showConfirmButton: false,
      });
    })
    .catch(function (err) {
      statusDiv.innerText = "❌ Terjadi kesalahan: " + err;
      processBtn.disabled = false;
      processBtn.innerText = "Coba Lagi";

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat membuat ZIP.",
      });
    });
}
