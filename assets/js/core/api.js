function startTimer() {
    var t = 3; var el = document.getElementById('loader-timer'); if (el) el.innerText = t;
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
    var pureBase64 = base64Data;
    if (base64Data.indexOf(',') !== -1) {
        pureBase64 = base64Data.split(',')[1];
    }
    try {
        const res = await callAPI('proxyImgBB', { base64Data: pureBase64 });
        if (res.status === 'success') return res.url;
        else throw new Error(res.message || "Gagal upload gambar ke ImgBB via Proxy");
    } catch (e) {
        throw new Error("Gagal upload gambar: " + e.message);
    }
}

function refreshHalamanLunak() { localStorage.removeItem('edupro_cache_v4'); document.getElementById('loader-text').innerHTML = "Menyegarkan Data...<br><span class='text-xs text-gray-500 font-normal mt-2'>Menarik info terbaru dari server</span>"; document.getElementById('loader').style.display = 'flex'; startTimer(); muatDataServer(); }

async function muatDataServer() {
    var cachedData = localStorage.getItem('edupro_cache_v4');
    var localTime = localStorage.getItem('edupro_time');

    if (cachedData) {
        clearTimeout(tFailsafe); stopTimer(); document.getElementById('loader').style.display = 'none';
        setTimeout(function () { try { dbGlobal = JSON.parse(cachedData); renderSemuaData(dbGlobal); cekUrlParameter(); try { if (typeof AOS !== 'undefined') AOS.refresh(); } catch (e) { } } catch(e) { console.error(e); localStorage.removeItem('edupro_cache_v4'); refreshHalamanLunak(); } }, 50);
        callAPI('getServerTime').then(res => { if (res && res.time && res.time !== localTime) { localStorage.removeItem('edupro_cache_v4'); refreshHalamanLunak(); } }).catch(() => { });
    } else {
        document.getElementById('loader').style.display = 'flex'; startTimer();
        try {
            var resStr;
            if (curToken && (curRole === 'admin' || curRole === 'guru' || curRole === 'tu')) {
                var resAdmin = await callAPI('getAdminData', { token: curToken });
                if (resAdmin && resAdmin.status === 'success') {
                    resStr = JSON.stringify(resAdmin);
                } else {
                    var getUrl = GAS_URL + "?action=getAllData&nocache=" + new Date().getTime();
                    var response = await fetch(getUrl); resStr = await response.text();
                }
            } else {
                var getUrl = GAS_URL + "?action=getAllData&nocache=" + new Date().getTime();
                var response = await fetch(getUrl); resStr = await response.text(); 
            }
            clearTimeout(tFailsafe);
            var lt = document.getElementById('loader-text'); if (lt) lt.innerHTML = "Download Selesai!<br><span class='text-xs font-normal mt-2'>Merakit tampilan web...</span>";
            
            setTimeout(function () {
                try {
                    var parsedData;
                    try {
                        parsedData = typeof resStr === 'string' ? JSON.parse(resStr) : resStr;
                    } catch (errParse) {
                        throw new Error("Data dari server tidak valid (Bukan JSON). Server mungkin mengembalikan halaman error HTML. Respons: " + resStr.substring(0, 50));
                    }
                    
                    dbGlobal = parsedData;
                    if (dbGlobal.status === 'error') { 
                        stopTimer(); document.getElementById('loader').style.display = 'none'; 
                        Swal.fire('Error Database', dbGlobal.message, 'error');
                        return;
                    }
                    
                    localStorage.setItem('edupro_cache_v4', typeof resStr === 'string' ? resStr : JSON.stringify(dbGlobal));
                    callAPI('getServerTime').then(resT => { if (resT && resT.status === 'success') localStorage.setItem('edupro_time', resT.time); }).catch(()=>{});
                    
                    try { batalEditSemua(); } catch(e){} 
                    renderSemuaData(dbGlobal);
                    cekUrlParameter(); 
                    try { if (typeof AOS !== 'undefined') AOS.refresh(); } catch (e) { }
                    
                    document.getElementById('loader').style.display = 'none'; stopTimer();
                } catch(errRender) {
                    stopTimer(); document.getElementById('loader').style.display = 'none';
                    Swal.fire('Error Tampilan', errRender.toString(), 'error');
                    console.error("Critical error in UI pipeline:", errRender);
                }
            }, 100);
        } catch (e) { clearTimeout(tFailsafe); stopTimer(); document.getElementById('loader').style.display = 'none'; Swal.fire('Koneksi Gagal', 'Gagal memuat data dari Google: ' + e.toString(), 'error'); }
    }
}
