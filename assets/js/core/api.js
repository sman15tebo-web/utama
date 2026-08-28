function startTimer() {
    var t = 15; var el = document.getElementById('loader-timer'); if (el) el.innerText = t;
    clearInterval(loadingInterval);
    loadingInterval = setInterval(function () {
        t--;
        if (t > 0) { if (el) el.innerText = t; }
        else { clearInterval(loadingInterval); if (el) el.innerText = '0'; var lt = document.getElementById('loader-text'); if (lt) lt.innerHTML = "Sedikit lagi...<br><span class='text-xs font-normal mt-2'>Prosesor sedang merakit visual.</span>"; }
    }, 1000);
}

function stopTimer() { clearInterval(loadingInterval); }

async function callAPI(action, payload = {}) {
    if (!GAS_URL || GAS_URL === "ISI_URL_EXEC_ANDA_DISINI") { Swal.fire('Error', 'Anda belum memasukkan GAS_URL di script.js.', 'error'); throw new Error('URL Missing'); }
    payload.action = action;
    try { const res = await fetch(GAS_URL, { redirect: "follow", method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) }); const text = await res.text(); try { return JSON.parse(text); } catch (e) { return text; } } catch (e) { throw e; }
}

async function uploadKeImgBB(base64Data) {
    if (!IMGBB_API_KEY) throw new Error("API Key ImgBB belum diisi di app.js. Silakan daftar di imgbb.com dan masukkan API Key-nya.");
    var pureBase64 = base64Data;
    if (base64Data.indexOf(',') !== -1) {
        pureBase64 = base64Data.split(',')[1];
    }
    var formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", pureBase64);
    try {
        const res = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) return data.data.url;
        else throw new Error(data.error ? data.error.message : "Gagal upload gambar ke ImgBB");
    } catch (e) {
        throw new Error("Gagal upload gambar ke ImgBB: " + e.message);
    }
}

function refreshHalamanLunak() { localStorage.removeItem('edupro_cache_v4'); document.getElementById('loader-text').innerHTML = "Menyegarkan Data...<br><span class='text-xs text-gray-500 font-normal mt-2'>Menarik info terbaru dari server</span>"; document.getElementById('loader').style.display = 'flex'; startTimer(); muatDataServer(); }

async function muatDataServer() {
    var cachedData = localStorage.getItem('edupro_cache_v4');
    var localTime = localStorage.getItem('edupro_time');

    if (cachedData) {
        clearTimeout(tFailsafe); stopTimer(); document.getElementById('loader').style.display = 'none';
        setTimeout(function () { dbGlobal = JSON.parse(cachedData); try { renderSemuaData(dbGlobal); } catch(e) { console.error('renderSemuaData error (cache)', e); document.getElementById('loader').style.display='none'; } cekUrlParameter(); try { if (typeof AOS !== 'undefined') AOS.refresh(); } catch (e) { } }, 50);
        callAPI('getServerTime').then(res => { if (res && res.time && res.time !== localTime) { localStorage.removeItem('edupro_cache_v4'); refreshHalamanLunak(); } }).catch(() => { });
    } else {
        document.getElementById('loader').style.display = 'flex'; startTimer();
        try {
            var getUrl = GAS_URL + "?action=getAllData&nocache=" + new Date().getTime();

            var response = await fetch(getUrl); var resStr = await response.text(); clearTimeout(tFailsafe);
            var lt = document.getElementById('loader-text'); if (lt) lt.innerHTML = "Download Selesai!<br><span class='text-xs font-normal mt-2'>Merakit tampilan web...</span>";
            setTimeout(function () {
                dbGlobal = typeof resStr === 'string' ? JSON.parse(resStr) : resStr;
                if (dbGlobal.status === 'error') { stopTimer(); document.getElementById('loader').style.display = 'none'; return Swal.fire('Error Database', dbGlobal.message, 'error'); }
                localStorage.setItem('edupro_cache_v4', typeof resStr === 'string' ? resStr : JSON.stringify(dbGlobal));
                callAPI('getServerTime').then(resT => { if (resT.status === 'success') localStorage.setItem('edupro_time', resT.time); });
                try { batalEditSemua(); } catch(e){ console.error('batalEditSemua error', e); } try { renderSemuaData(dbGlobal); } catch(e){ console.error('renderSemuaData error', e); document.getElementById('loader').style.display='none'; } cekUrlParameter(); try { if (typeof AOS !== 'undefined') AOS.refresh(); } catch (e) { }
                document.getElementById('loader').style.display = 'none'; stopTimer();
            }, 100);
        } catch (e) { clearTimeout(tFailsafe); stopTimer(); document.getElementById('loader').style.display = 'none'; Swal.fire('Koneksi Gagal', 'Gagal memuat data dari Google. Pastikan URL benar.', 'error'); }
    }
}