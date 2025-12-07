const endpointBase = 'https://api.nekolabs.web.id/downloader/tiktok?url=';
const $ = s => document.querySelector(s);
const urlInput = $('#urlInput');
const fetchBtn = $('#fetchBtn');
const clearBtn = $('#clearBtn');
const result = $('#result');
const mediaArea = $('#mediaArea');
const titleEl = $('#title');
const authorName = $('#authorName');
const authorUsername = $('#authorUsername');
const authorAvatar = $('#authorAvatar');
const statsEl = $('#stats');
const jsonPre = $('#jsonPre');
const rawResponse = $('#rawResponse');

function showLoading(state){
  fetchBtn.disabled = state;
  fetchBtn.textContent = state ? 'Loading...' : 'Download';
}

function clearResult(){
  result.classList.add('hidden');
  mediaArea.innerHTML = '';
  titleEl.textContent = '';
  authorName.textContent = '';
  authorUsername.textContent = '';
  authorAvatar.src = '';
  statsEl.textContent = '';
  jsonPre.textContent = '';
}

function safeText(s){ return s || '' }

function makeDownloadLink(url, filename){
  // create an <a> and click it to trigger download; fallback to open in new tab
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || '';
  // some CDNs block cross-origin download; try click and fallback
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function formatNumber(str){
  return String(str).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderSlide(res){
  const r = res.result;
  authorName.textContent = safeText(r.author?.name || r.author?.nickname || 'Unknown');
  authorUsername.textContent = safeText(r.author?.username || '');
  authorAvatar.src = r.author?.avatar || '';
  titleEl.textContent = r.title || '';
  statsEl.textContent = '';

  mediaArea.innerHTML = '';
  const images = r.images || [];
  if(images.length === 0){
    mediaArea.innerHTML = '<div class="media-card"><div class="caption">No images found</div></div>';
  }

  images.forEach((imgUrl, idx) => {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.innerHTML = `
      <img src="${imgUrl}" alt="slide-${idx}" loading="lazy" />
      <div class="caption">Photo ${idx+1}</div>
      <div class="actions">
        <button class="small-btn" data-url="${imgUrl}" data-fn="photo-${idx+1}.jpeg">Download</button>
        <a class="small-btn" href="${imgUrl}" target="_blank" rel="noopener">Preview</a>
      </div>
    `;
    mediaArea.appendChild(card);
  });

  // attach handlers
  mediaArea.querySelectorAll('button.small-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const url = btn.dataset.url;
      const fn = btn.dataset.fn;
      makeDownloadLink(url, fn);
    });
  });
}

function renderVideo(res){
  const r = res.result;
  authorName.textContent = safeText(r.author?.name || r.author?.nickname || 'Unknown');
  authorUsername.textContent = safeText(r.author?.username || '');
  authorAvatar.src = r.author?.avatar || '';
  titleEl.textContent = r.title || '';
  statsEl.textContent = r.stats ? `▶ ${formatNumber(r.stats.play)} • ❤️ ${formatNumber(r.stats.like)}` : '';

  mediaArea.innerHTML = '';
  // show cover
  const cover = r.cover || '';
  const videoUrl = r.videoUrl || r.video || '';

  const card = document.createElement('div');
  card.className = 'media-card';
  card.innerHTML = `
    <img src="${cover}" alt="cover" loading="lazy" />
    <div class="caption">Video</div>
    <div class="actions">
      <button id="downloadVideoBtn" class="small-btn">Download Video</button>
      <a class="small-btn" href="${videoUrl}" target="_blank" rel="noopener">Open Source</a>
    </div>
  `;
  mediaArea.appendChild(card);

  const dlBtn = document.getElementById('downloadVideoBtn');
  dlBtn.addEventListener('click', () => {
    if(!videoUrl){
      alert('No video URL found');
      return;
    }
    // to force download
    makeDownloadLink(videoUrl, 'tiktok-video.mp4');
  });
}

async function fetchTikTok(inputUrl){
  clearResult();
  result.classList.remove('hidden');
  showLoading(true);
  rawResponse.classList.add('hidden');

  try{
    const full = endpointBase + encodeURIComponent(inputUrl.trim());
    const resp = await fetch(full);
    if(!resp.ok) throw new Error('Network response not ok: ' + resp.status);
    const data = await resp.json();

    // show raw optional
    jsonPre.textContent = JSON.stringify(data, null, 2);
    rawResponse.classList.remove('hidden');

    if(!data.success || !data.result){
      titleEl.textContent = 'No result';
      mediaArea.innerHTML = '<div class="media-card"><div class="caption">Cannot fetch data.</div></div>';
      return;
    }

    // detect if it's slide (images) or video
    const isSlide = Array.isArray(data.result.images) && data.result.images.length > 0;
    const isVideo = !!(data.result.videoUrl || data.result.video);

    if(isSlide){
      renderSlide(data);
    } else if(isVideo){
      renderVideo(data);
    } else {
      // fallback: show whatever media fields exist
      mediaArea.innerHTML = '<div class="media-card"><div class="caption">No media found in response</div></div>';
    }

  }catch(err){
    clearResult();
    result.classList.remove('hidden');
    titleEl.textContent = 'Error';
    mediaArea.innerHTML = '<div class="media-card"><div class="caption">'+(err.message||err)+'</div></div>';
    console.error(err);
  }finally{
    showLoading(false);
  }
}

fetchBtn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  if(!url){ alert('Please paste a TikTok URL'); return }
  fetchTikTok(url);
});

clearBtn.addEventListener('click', () => { urlInput.value=''; clearResult(); });

// allow Enter
urlInput.addEventListener('keydown', e => { if(e.key === 'Enter') fetchBtn.click(); });

// small UX: example sample
urlInput.placeholder = 'https://vt.tiktok.com/Example or https://www.tiktok.com/@user/video/123...';