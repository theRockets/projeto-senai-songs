// ---------- CONFIG ----------
const API_BASE = "http://localhost:8080"; // ajuste se necessário
const ALBUMS = `${API_BASE}/album`;
const MUSIC = `${API_BASE}/musica`;

// ---------- HELPERS ----------
const $ = s => document.querySelector(s);
const $id = id => document.getElementById(id);
const esc = v => String(v ?? "");
const toSec = t => { if (!t) return 0; const p = t.split(':'); return p.length === 2 ? (+p[0] * 60 + +p[1]) : (+t || 0); };
const toMMSS = s => (!s ? "-" : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`);

// ---------- STATE ----------
let albums = [];
const refs = {
    albumList: $id("albumList"),
    allSongsList: $id("allSongsList"),
    btnAddAlbum: $id("btnAddAlbum"),
    btnAddMusic: $id("btnAddMusic"),
    searchInput: $id("searchInput"),
    modalAlbum: $id("modalAlbum"),
    modalMusic: $id("modalMusic"),
    formAlbum: $id("formAlbum"),
    formMusic: $id("formMusic"),
    musicAlbum: $id("musicAlbum"),
    albumPage: $id("albumPage"),
    viewAlbumName: $id("viewAlbumName"),
    viewAlbumArtist: $id("viewAlbumArtist"),
    viewTotalSongs: $id("viewTotalSongs"),
    albumSongs: $id("albumSongs"),
    btnBackAlbums: $id("btnBackAlbums"),
    btnAddMusicInside: $id("btnAddMusicInside"),
    albumEditIndex: $id("albumEditIndex"),
    musicEditAlbum: $id("musicEditAlbum"),
    musicEditIndex: $id("musicEditIndex")
};

// ---------- API ----------
async function apiGET(url) { const r = await fetch(url); if (!r.ok) throw r; return r.json(); }
async function apiPOST(url, p) { const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) }); if (!r.ok) throw r; return r.json(); }
async function apiPUT(url, p) { const r = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) }); if (!r.ok) throw r; return r.json(); }
async function apiDEL(url) { const r = await fetch(url, { method: "DELETE" }); if (!r.ok) throw r; return; }

// ---------- LOAD / NORMALIZE ----------
async function loadAlbums() {
    try {
        const data = await apiGET(ALBUMS);
        albums = (Array.isArray(data) ? data : []);
        // normalize: ensure fields for UI
        albums = albums.map(a => ({
            id: a.id,
            nomeAlbum: a.nomeAlbum || a.name || "",
            artistaResponsavel: a.artistaResponsavel || a.artist || "",
            urlCapa: a.urlCapa || a.cover || "",
            musicas: (a.musicas || a.musicas === null ? (a.musicas || []) : (a.songs || []))
        }));
        // create ui-friendly songs array inside each album
        albums.forEach(a => {
            a.songs = (a.musicas || []).map(m => ({
                id: m.id,
                tituloMusica: m.tituloMusica || m.name || "",
                genero: m.genero || m.genre || "POP",
                tempoDuracao: m.tempoDuracao || 0,
                timeLabel: toMMSS(m.tempoDuracao || 0),
                __raw: m
            }));
        });
    } catch (e) {
        console.error(e);
        alert("Erro ao carregar álbuns. Veja console.");
        albums = [];
    }
}

// ---------- RENDER ----------
function reloadAlbumSelect() {
    const sel = refs.musicAlbum; sel.innerHTML = "";
    albums.forEach((a, idx) => sel.appendChild(Object.assign(document.createElement("option"), { value: idx, textContent: `${a.nomeAlbum} — ${a.artistaResponsavel}` })));
}
function updateAlbumsView() {
    const root = refs.albumList; root.innerHTML = "";
    if (!albums.length) { root.innerHTML = `<div style="color:#cfcfcf;padding:12px">Nenhum álbum criado ainda.</div>`; return; }
    const showLimit = 5;
    const sorted = [...albums].sort((x, y) => (y.id || 0) - (x.id || 0));
    sorted.slice(0, showLimit).forEach(a => {
        const idx = albums.indexOf(a);
        const cover = a.urlCapa || "https://via.placeholder.com/300x200?text=Capa";
        const card = document.createElement("div"); card.className = "album-card";
        card.innerHTML = `<img src="${esc(cover)}" class="album-cover"><div class="album-info"><h3>${esc(a.nomeAlbum)}</h3><p>${esc(a.artistaResponsavel)}</p></div>
      <div class="album-options"><button data-action="edit-album" data-index="${idx}">✏️</button><button data-action="delete-album" data-index="${idx}">🗑️</button></div>`;
        card.addEventListener("click", e => { if (e.target.closest("button")) return; openAlbum(idx); });
        root.appendChild(card);
    });
    if (albums.length > showLimit) {
        const more = document.createElement("div"); more.className = "album-card view-all"; more.innerHTML = `<div>Ver mais<br><small style="opacity:.8">${albums.length} álbuns</small></div>`;
        more.addEventListener("click", openAllAlbumsView); root.appendChild(more);
    }
}
function openAllAlbumsView() {
    const wrapper = document.createElement("div"); wrapper.style.display = "flex"; wrapper.style.flexDirection = "column"; wrapper.style.gap = "12px";
    wrapper.innerHTML = `<button class="btn-back">⬅ Voltar</button><h3>Todos os álbuns</h3>`;
    albums.slice().sort((a, b) => (b.id || 0) - (a.id || 0)).forEach(a => {
        const row = document.createElement("div"); row.className = "song-row"; row.style.cursor = "pointer";
        const cover = a.urlCapa || "https://via.placeholder.com/100";
        row.innerHTML = `<div style="display:flex;align-items:center;gap:12px"><img src="${esc(cover)}" style="width:58px;height:58px;border-radius:8px;object-fit:cover;"><div><div style="font-weight:700">${esc(a.nomeAlbum)}</div><div style="color:#cfcfcf;font-size:13px">${esc(a.artistaResponsavel)}</div></div></div>
      <div style="display:flex;gap:8px;align-items:center"><button data-action="open-album" data-index="${albums.indexOf(a)}">Abrir</button><button data-action="edit-album" data-index="${albums.indexOf(a)}">Editar</button><button data-action="delete-album" data-index="${albums.indexOf(a)}">Excluir</button></div>`;
        wrapper.appendChild(row);
    });
    refs.albumList.innerHTML = ""; wrapper.querySelector(".btn-back").addEventListener("click", updateAlbumsView);
    wrapper.querySelectorAll("button[data-action]").forEach(b => b.addEventListener("click", async e => {
        const action = b.dataset.action, idx = Number(b.dataset.index);
        if (action === "open-album") openAlbum(idx);
        if (action === "edit-album") openEditAlbum(idx);
        if (action === "delete-album") { if (!confirm("Excluir álbum?")) return; try { await apiDEL(`${ALBUMS}/${albums[idx].id}`); await refreshAll(); } catch (err) { alert("Erro: " + err); } }
    }));
    refs.albumList.appendChild(wrapper);
}
function renderAlbumSongs(ai) {
    const album = albums[ai]; if (!album) return;
    refs.viewAlbumName.textContent = album.nomeAlbum; refs.viewAlbumArtist.textContent = album.artistaResponsavel;
    refs.albumPage.style.display = "block";
    refs.albumSongs.innerHTML = "";
    album.songs.slice().sort((x, y) => (x.__raw?.id || 0) - (y.__raw?.id || 0)).forEach((s, si) => {
        const row = document.createElement("div"); row.className = "song-row";
        const cover = album.urlCapa || "https://via.placeholder.com/100";
        row.innerHTML = `<div class="song-left"><div class="song-index">${si + 1}</div><img src="${esc(cover)}" class="song-cover"/><div class="song-info"><p class="song-name">${esc(s.tituloMusica)}</p><p class="song-genre">${esc(s.genero)}</p></div></div>
      <div style="display:flex;align-items:center;gap:12px;"><div class="song-time">${esc(s.timeLabel)}</div><div class="song-more"><button class="more-btn">⋮</button><div class="more-menu"><button data-action="edit-song" data-album="${ai}" data-song="${si}">Editar</button><button data-action="remove-song" data-album="${ai}" data-song="${si}">Excluir</button></div></div></div>`;
        refs.albumSongs.appendChild(row);
    });
    refs.viewTotalSongs.textContent = album.songs.length;
    // delegate menu actions
    refs.albumSongs.querySelectorAll(".more-menu button").forEach(b => {
        b.addEventListener("click", async e => {
            const a = Number(b.dataset.album), s = Number(b.dataset.song);
            if (b.dataset.action === "edit-song") openEditSong(a, s);
            if (b.dataset.action === "remove-song") { if (!confirm("Excluir música?")) return; try { await apiDEL(`${MUSIC}/${albums[a].songs[s].id}`); await refreshAll(); if (refs.albumPage.style.display === "block" && refs.viewAlbumName.textContent === albums[a].nomeAlbum) renderAlbumSongs(a); } catch (err) { alert("Erro: " + err); } }
        });
    });
}
function renderAllSongs() {
    refs.allSongsList.innerHTML = "";
    const flat = [];
    albums.forEach((a, ai) => a.songs.forEach((s, si) => flat.push({ albumIndex: ai, songIndex: si, albumName: a.nomeAlbum, albumCover: a.urlCapa, artist: a.artistaResponsavel, song: s })));
    flat.sort((x, y) => (x.song.__raw?.id || 0) - (y.song.__raw?.id || 0));
    if (!flat.length) { refs.allSongsList.innerHTML = `<div style="color:#cfcfcf;padding:12px">Nenhuma música cadastrada.</div>`; return; }
    flat.forEach((o, idx) => {
        const r = document.createElement("div"); r.className = "song-row";
        r.innerHTML = `<div class="song-left"><div class="song-index">${idx + 1}</div><img src="${esc(o.albumCover || 'https://via.placeholder.com/100')}" class="song-cover"><div class="song-info"><p class="song-name">${esc(o.song.tituloMusica)}</p><p class="song-genre">${esc(o.song.genero)} · ${esc(o.albumName)}</p></div></div>
    <div style="display:flex;align-items:center;gap:12px;"><div class="song-time">${esc(o.song.timeLabel)}</div><div class="song-more"><button class="more-btn">⋮</button><div class="more-menu"><button data-action="goto-album" data-album="${o.albumIndex}" data-song="${o.songIndex}">Abrir álbum</button><button data-action="edit-song" data-album="${o.albumIndex}" data-song="${o.songIndex}">Editar</button><button data-action="remove-song" data-album="${o.albumIndex}" data-song="${o.songIndex}">Excluir</button></div></div></div>`;
        r.querySelectorAll(".more-menu button").forEach(b => b.addEventListener("click", async () => {
            const a = Number(b.dataset.album), s = Number(b.dataset.song), act = b.dataset.action;
            if (act === "goto-album") openAlbum(a);
            if (act === "edit-song") openEditSong(a, s);
            if (act === "remove-song") { if (!confirm("Excluir música?")) return; try { await apiDEL(`${MUSIC}/${albums[a].songs[s].id}`); await refreshAll(); } catch (err) { alert("Erro: " + err); } }
        }));
        refs.allSongsList.appendChild(r);
    });
}

// ---------- UI ACTIONS ----------
function openAlbum(index) { renderAlbumSongs(index); }
function openEditAlbum(index) {
    const a = albums[index]; if (!a) return;
    refs.albumEditIndex.value = index;
    $id("modalAlbumTitle").textContent = "Editar Álbum";
    $id("albumName").value = a.nomeAlbum;
    $id("albumArtist").value = a.artistaResponsavel;
    $id("albumCover").value = a.urlCapa || "";
    openModal(refs.modalAlbum);
}
function openModal(m) { m.style.display = "flex"; document.body.style.overflow = "hidden"; }
function closeModal(m) { m.style.display = "none"; document.body.style.overflow = ""; }
document.querySelectorAll(".close").forEach(c => c.addEventListener("click", e => closeModal(document.getElementById(c.dataset.close || c.parentElement.id))));
document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => closeModal(document.getElementById(b.dataset.close))));

refs.btnAddAlbum.addEventListener("click", () => { refs.albumEditIndex.value = -1; $id("modalAlbumTitle").textContent = "Criar Álbum"; $id("albumName").value = ""; $id("albumArtist").value = ""; $id("albumCover").value = ""; openModal(refs.modalAlbum); });

refs.albumList.addEventListener("click", async e => {
    const btn = e.target.closest("button"); if (!btn) return;
    const action = btn.dataset.action, idx = Number(btn.dataset.index);
    if (action === "delete-album") { if (!confirm("Excluir álbum e todas as músicas?")) return; try { await apiDEL(`${ALBUMS}/${albums[idx].id}`); await refreshAll(); } catch (err) { alert("Erro: " + err); } }
    if (action === "edit-album") openEditAlbum(idx);
});

refs.btnAddMusic.addEventListener("click", () => { reloadAlbumSelect(); refs.musicEditAlbum.value = -1; refs.musicEditIndex.value = -1; $id("modalMusicTitle").textContent = "Adicionar Música"; openModal(refs.modalMusic); });

refs.btnAddMusicInside.addEventListener("click", () => { const alName = refs.viewAlbumName.textContent; const idx = albums.findIndex(a => a.nomeAlbum === alName); reloadAlbumSelect(); if (idx >= 0) refs.musicAlbum.value = idx; refs.musicEditAlbum.value = -1; refs.musicEditIndex.value = -1; $id("modalMusicTitle").textContent = "Adicionar Música"; openModal(refs.modalMusic); });

function openEditSong(ai, si) {
    const s = albums[ai]?.songs[si]; if (!s) return;
    reloadAlbumSelect(); refs.musicAlbum.value = ai; refs.musicEditAlbum.value = ai; refs.musicEditIndex.value = si;
    $id("modalMusicTitle").textContent = "Editar Música";
    $id("musicName").value = s.tituloMusica;
    $id("musicGenre").value = s.genero || "POP";
    $id("musicTime").value = s.timeLabel || "";
    openModal(refs.modalMusic);
}

refs.btnBackAlbums.addEventListener("click", () => { refs.albumPage.style.display = "none"; updateAlbumsView(); renderAllSongs(); });

refs.searchInput.addEventListener("input", () => {
    const q = refs.searchInput.value.trim().toLowerCase();
    document.querySelectorAll("#albumList .album-card").forEach(card => card.style.display = card.textContent.toLowerCase().includes(q) ? "" : "none");
    document.querySelectorAll("#allSongsList .song-row").forEach(row => {
        const name = row.querySelector(".song-name")?.textContent.toLowerCase() || "";
        const meta = row.querySelector(".song-genre")?.textContent.toLowerCase() || "";
        row.style.display = (name + " " + meta).includes(q) ? "" : "none";
    });
});

// ---------- FORM SUBMITS ----------
refs.formAlbum.addEventListener("submit", async e => {
    e.preventDefault();
    const idx = Number(refs.albumEditIndex.value);
    const nome = $id("albumName").value.trim();
    const artista = $id("albumArtist").value.trim();
    const cover = $id("albumCover").value.trim();
    if (!nome || !artista) { alert("Preencha nome e artista."); return; }
    try {
        if (idx >= 0 && albums[idx] && albums[idx].id) {
            await apiPUT(`${ALBUMS}/${albums[idx].id}`, { nomeAlbum: nome, artistaResponsavel: artista, urlCapa: cover });
        } else {
            await apiPOST(ALBUMS, { nomeAlbum: nome, artistaResponsavel: artista, urlCapa: cover });
        }
        closeModal(refs.modalAlbum); refs.formAlbum.reset(); refs.albumEditIndex.value = -1; await refreshAll();
    } catch (err) { alert("Erro ao salvar álbum: " + err); }
});

refs.formMusic.addEventListener("submit", async e => {
    e.preventDefault();
    const albumIdx = Number(refs.musicAlbum.value);
    const name = $id("musicName").value.trim();
    const genre = $id("musicGenre").value || "POP";
    const time = $id("musicTime").value.trim();
    const editAlbum = Number(refs.musicEditAlbum.value);
    const editSong = Number(refs.musicEditIndex.value);
    if (isNaN(albumIdx) || !albums[albumIdx]) { alert("Selecione um álbum válido."); return; }
    if (!name) { alert("Digite o nome da música."); return; }
    try {
        if (editAlbum >= 0 && albums[editAlbum] && editSong >= 0) {
            const musicObj = albums[editAlbum].songs[editSong];
            if (!musicObj?.id) { alert("Música sem id no servidor."); return; }
            await apiPUT(`${MUSIC}/${musicObj.id}`, { tituloMusica: name, tempoDuracao: toSec(time), genero: genre.toUpperCase(), album: { id: albums[albumIdx].id } });
        } else {
            await apiPOST(MUSIC, { tituloMusica: name, tempoDuracao: toSec(time), genero: genre.toUpperCase(), album: { id: albums[albumIdx].id } });
        }
        closeModal(refs.modalMusic); refs.formMusic.reset(); refs.musicEditAlbum.value = -1; refs.musicEditIndex.value = -1; await refreshAll();
    } catch (err) { alert("Erro ao salvar música: " + err); }
});

// ---------- REFRESH ----------
async function refreshAll() { await loadAlbums(); reloadAlbumSelect(); updateAlbumsView(); renderAllSongs(); }

// ---------- INIT ----------
(async function init() { try { await refreshAll(); } catch (e) { console.error(e); } })();
