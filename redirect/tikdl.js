document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('tiktokUrl');
    const downloadBtn = document.getElementById('downloadBtn');
    const resultContainer = document.getElementById('resultContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');

    const API_ENDPOINT = 'https://api.nekolabs.web.id/downloader/tiktok?url=';

    downloadBtn.addEventListener('click', handleDownload);

    // Fungsi utama untuk menangani proses unduh
    async function handleDownload() {
        const url = urlInput.value.trim();

        if (!url) {
            alert('Mohon masukkan tautan video TikTok terlebih dahulu.');
            return;
        }

        // Tampilkan loading, sembunyikan hasil sebelumnya, dan nonaktifkan tombol
        loadingIndicator.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        resultContainer.innerHTML = '';
        downloadBtn.disabled = true;

        try {
            // Encode URL untuk dimasukkan ke parameter query
            const encodedUrl = encodeURIComponent(url);
            const fullApiUrl = API_ENDPOINT + encodedUrl;

            const response = await fetch(fullApiUrl);
            const data = await response.json();

            if (data.success && data.result) {
                displayResult(data.result);
            } else {
                alert('Gagal memproses tautan. Pastikan tautan valid dan publik.');
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Terjadi kesalahan saat menghubungi API. Coba lagi nanti.');
        } finally {
            // Sembunyikan loading dan aktifkan kembali tombol
            loadingIndicator.classList.add('hidden');
            downloadBtn.disabled = false;
        }
    }

    // Fungsi untuk menampilkan hasil
    function displayResult(result) {
        const { title, author, images, videoUrl, cover } = result;

        let htmlContent = `
            <div class="author-info">
                <img src="${author.avatar}" alt="${author.name} Avatar">
                <div>
                    <h3>${author.name}</h3>
                    <p>${author.username}</p>
                </div>
            </div>
            <div class="content-details">
                <h4>Caption:</h4>
                <p>${title || 'Tidak ada deskripsi.'}</p>
            </div>
        `;

        // Cek apakah ini Video atau Slide (berdasarkan ketersediaan 'images')
        if (images && images.length > 0) {
            // --- Tampilan untuk TikTok Slide (Foto) ---
            htmlContent += `
                <h3>📸 TikTok Slide Ditemukan</h3>
                <div class="slide-images-container">
            `;
            
            images.forEach((imageUrl, index) => {
                htmlContent += `
                    <div class="slide-item">
                        <img src="${imageUrl}" alt="Slide Image ${index + 1}">
                        <a href="${imageUrl}" download="tiktok_slide_${index + 1}.jpeg">Unduh Foto ${index + 1}</a>
                    </div>
                `;
            });

            htmlContent += `</div>`;
            
        } else if (videoUrl) {
            // --- Tampilan untuk TikTok Video ---
            htmlContent += `
                <h3>🎬 TikTok Video Ditemukan</h3>
                <div id="video-result">
                    <video controls poster="${cover}">
                        <source src="${videoUrl}" type="video/mp4">
                        Browser Anda tidak mendukung tag video.
                    </video>
                    <a href="${videoUrl}" download="tiktok_video_nowatermark.mp4" id="finalDownloadBtn" class="download-button" target="_blank" style="display:block; text-align:center; padding: 15px; margin-top: 20px; background-color: var(--primary-color); color: white; border-radius: 8px; text-decoration: none; font-weight: 700;">
                        KLIK UNTUK UNDUH VIDEO (Tanpa Watermark)
                    </a>
                </div>
            `;
        } else {
            // Jika API tidak mengembalikan images maupun videoUrl
             htmlContent += `
                <p style="color: red;">⚠️ Tipe konten tidak dikenali atau tautan unduhan tidak tersedia.</p>
             `;
        }

        resultContainer.innerHTML = htmlContent;
        resultContainer.classList.remove('hidden');
    }
});
