const BOT_TOKEN = "7633053355:AAHWtCVc-pDNzfk3fBjRU-JWN3jjMbMf75w";
const CHAT_ID = "-1002514484079"; 


function previewName() {
    const file = document.getElementById("foto").files[0];
    document.getElementById("fileName").innerText = file ? file.name : "Tidak ada file dipilih";
}

async function kirim() {
    const nama = document.getElementById("nama").value.trim();
    const telepon = document.getElementById("telepon").value.trim();
    const pesan = document.getElementById("pesan").value.trim();
    const fotoFile = document.getElementById("foto").files[0];

    if (!nama || !pesan) {
        Swal.fire("Error", "Nama dan pesan tidak boleh kosong!", "error");
        return;
    }

    const caption = 
`📩 *Request/Laporan*

👤 Nama
>${nama}

📞 Telepon
>${telepon || "-"}

💬 Pesan:
${pesan}
`;

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("caption", caption);
    form.append("parse_mode", "Markdown");

    let photoUrl =
        fotoFile
            ? fotoFile
            : `https://fathurweb.qzz.io/api/canvas/ngl?title=Dari%20${encodeURIComponent(nama)}&text=${encodeURIComponent(pesan)}`;

    
    form.append("photo", photoUrl);

    Swal.fire({
        title: "Mengirim...",
        text: "Sedang mengirim request ke admin...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
    });

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

    try {
        const res = await fetch(url, {
            method: "POST",
            body: form
        });

        const result = await res.json();

        if (result.ok) {
            Swal.fire("Berhasil!", "Request berhasil dikirim.", "success");

            document.getElementById("nama").value = "";
            document.getElementById("telepon").value = "";
            document.getElementById("pesan").value = "";
            document.getElementById("foto").value = "";
            previewName();

        } else {
            Swal.fire("Gagal!", result.description, "error");
        }

    } catch (err) {
        Swal.fire("Error", "Terjadi kesalahan saat mengirim.", "error");
    }
}
