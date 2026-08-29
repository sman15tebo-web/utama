function maskNip(nip) {
    if (!nip || nip === '-') return '-';
    var str = nip.toString().trim();
    if (str.length <= 8) return '********';
    var visible = str.length - 8;
    return str.substring(0, visible) + '********';
}

function amankanTeks(str) { if (!str) return ''; var map = { '&': '&', '<': '<', '>': '>', '"': '"', "'": "'" }; return str.toString().replace(/[&<>"']/g, function (m) { return map[m]; }); }

function getValidImg(url, fallback) { if (!url) return fallback; var id = ""; if (url.indexOf('/file/d/') !== -1) { id = url.split('/file/d/')[1].split('/')[0]; } else if (url.indexOf('id=') !== -1) { id = url.split('id=')[1].split('&')[0]; } if (id) return 'https://drive.google.com/uc?export=view&id=' + encodeURIComponent(id); return amankanTeks(url); }

function formatTanggal(tglStr) { if (!tglStr) return ''; if (tglStr.indexOf('-') !== -1 && tglStr.length === 10) return tglStr; if (tglStr.indexOf('/') !== -1) { var parts = tglStr.split('/'); if (parts.length === 3) return parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0'); } try { var d = new Date(tglStr); if (!isNaN(d.getTime())) { var y = d.getFullYear(); var m = ('0' + (d.getMonth() + 1)).slice(-2); var day = ('0' + d.getDate()).slice(-2); return y + '-' + m + '-' + day; } } catch (e) { } return ''; }

function cekUrlParameter() { try { var urlParams = new URLSearchParams(window.location.search); if (urlParams.has('article') && dbGlobal.berita) { var idBerita = urlParams.get('article'); var sudahDibuka = sessionStorage.getItem('baca_link_' + idBerita); if (!sudahDibuka) { sessionStorage.setItem('baca_link_' + idBerita, 'true'); bukaBerita(idBerita); try { window.history.replaceState(null, null, window.location.pathname); } catch (e) { } } } } catch (e) { } }

function getVal(k, arrData) { if (!arrData) return ''; for (var i = arrData.length - 1; i >= 0; i--) { if (arrData[i].key && arrData[i].key.toString().toLowerCase().trim() === k.toLowerCase()) { return arrData[i].value; } } return ''; }

function setTextAman(id, teks) { var el = document.getElementById(id); if (el) el.innerText = teks; }

function setHTMLAman(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; }

function setValAman(id, teks) { var el = document.getElementById(id); if (el) el.value = teks; }

function setLinkAman(id, url) { var el = document.getElementById(id); if (el) { el.href = amankanTeks(url) || '#'; if (!url || url === '#') el.classList.add('hidden'); else el.classList.remove('hidden'); } }
