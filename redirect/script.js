// --- CONFIGURASI HARGA ---
const rates = {
    likeIndo: 22,
    likeGlobal: 2.5,
    view: 0.15,
    follIndo: 60,
    follGlobal: 8
};

let likeType = 'Global';
let follType = 'Global';
let paymentMethod = 'QRIS';

// --- SIDEBAR LOGIC ---
function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    sb.classList.toggle('-translate-x-full');
}

// --- ADJUST NOMINAL BUTTONS ---
function adjust(id, amount) {
    const input = document.getElementById(id);
    let currentVal = parseInt(input.value) || 0;
    let newVal = Math.max(0, currentVal + amount);
    input.value = newVal;
    calculate(); // Hitung ulang setiap kali tombol diklik
}

// --- SWITCH TYPE LOGIC ---
function setLikeType(type) {
    likeType = type;
    document.getElementById('likeGlobalBtn').className = type === 'Global' ? 'px-6 py-2 rounded-xl bg-purple-600 font-bold text-xs shadow-lg' : 'px-6 py-2 rounded-xl text-gray-500 font-bold text-xs';
    document.getElementById('likeIndoBtn').className = type === 'Indo' ? 'px-6 py-2 rounded-xl bg-purple-600 font-bold text-xs shadow-lg' : 'px-6 py-2 rounded-xl text-gray-500 font-bold text-xs';
    document.getElementById('txtLikeType').innerText = type;
    calculate();
}

function setFollType(type) {
    follType = type;
    document.getElementById('follGlobalBtn').className = type === 'Global' ? 'px-6 py-2 rounded-xl bg-purple-600 font-bold text-xs shadow-lg' : 'px-6 py-2 rounded-xl text-gray-500 font-bold text-xs';
    document.getElementById('follIndoBtn').className = type === 'Indo' ? 'px-6 py-2 rounded-xl bg-purple-600 font-bold text-xs shadow-lg' : 'px-6 py-2 rounded-xl text-gray-500 font-bold text-xs';
    document.getElementById('txtFollType').innerText = type;
    calculate();
}

// --- CALCULATION LOGIC ---
function calculate() {
    const lQty = parseInt(document.getElementById('likeQty').value) || 0;
    const vQty = parseInt(document.getElementById('viewQty').value) || 0;
    const fQty = parseInt(document.getElementById('follQty').value) || 0;

    const lp = lQty * (likeType === 'Indo' ? rates.likeIndo : rates.likeGlobal);
    const vp = vQty * rates.view;
    const fp = fQty * (follType === 'Indo' ? rates.follIndo : rates.follGlobal);

    // Update di dalam kartu form
    document.getElementById('priceDisplayLike').innerText = `Rp ${lp.toLocaleString('id-ID')}`;
    document.getElementById('priceDisplayView').innerText = `Rp ${vp.toLocaleString('id-ID')}`;
    document.getElementById('priceDisplayFoll').innerText = `Rp ${fp.toLocaleString('id-ID')}`;

    // Update di bagian ringkasan total
    document.getElementById('resLike').innerText = `Rp ${lp.toLocaleString('id-ID')}`;
    document.getElementById('resView').innerText = `Rp ${vp.toLocaleString('id-ID')}`;
    document.getElementById('resFoll').innerText = `Rp ${fp.toLocaleString('id-ID')}`;
    
    const total = lp + vp + fp;
    document.getElementById('grandTotal').innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

// --- PAYMENT MODAL LOGIC ---
function setPayment(method) {
    paymentMethod = method;
    document.getElementById('qrisBtn').className = method === 'QRIS' ? 'flex-1 py-2 rounded-xl bg-purple-600 font-bold text-xs transition-all shadow-lg' : 'flex-1 py-2 rounded-xl text-gray-500 font-bold text-xs transition-all';
    document.getElementById('ewalletBtn').className = method === 'E-Wallet' ? 'flex-1 py-2 rounded-xl bg-purple-600 font-bold text-xs transition-all shadow-lg' : 'flex-1 py-2 rounded-xl text-gray-500 font-bold text-xs transition-all';
    
    const content = document.getElementById('paymentContent');
    if(method === 'QRIS') {
        content.innerHTML = `<div class="bg-white p-2 rounded-2xl shadow-xl shadow-purple-500/10"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INSTABOOST_PAY" class="w-32 h-32"></div>`;
    } else {
        content.innerHTML = `<div class="text-center"><p class="text-[10px] text-gray-500 font-bold uppercase mb-1">DANA / GOPAY</p><p class="text-2xl font-black text-white italic">08812345678</p><p class="text-[9px] text-purple-400 mt-1">a.n Admin InstaBoost</p></div>`;
    }
}

function openModal() {
    const now = new Date();
    const date = now.toLocaleDateString('id-ID', {day:'2-digit', month:'long', year:'numeric'});
    const time = now.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}) + " WIB";
    
    const text = `Halo, Saya mau pesan\n\nPesanan:\n- Like (${likeType}) : ${document.getElementById('likeQty').value || 0} - ${document.getElementById('resLike').innerText}\n- Views : ${document.getElementById('viewQty').value || 0} - ${document.getElementById('resView').innerText}\n- Followers (${follType}) : ${document.getElementById('follQty').value || 0} - ${document.getElementById('resFoll').innerText}\n\nTotal:\n- ${document.getElementById('grandTotal').innerText}\n\nKonfirmasi Pembayaran:\nMetode : ${paymentMethod}\n\nTanggal : ${date}\nWaktu : ${time}\n`;
    
    document.getElementById('waPreview').innerText = text;
    setPayment('QRIS');
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() { document.getElementById('modal').classList.add('hidden'); }

function sendWA() {
    const text = encodeURIComponent(document.getElementById('waPreview').innerText);
    window.open(`https://wa.me/62895404774374?text=${text}`);
}

