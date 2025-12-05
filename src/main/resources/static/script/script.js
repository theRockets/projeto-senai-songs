const LS_KEY = "music_platform_v1";
let albums = JSON.parse(localStorage.getItem(LS_KEY)) || [];

const $ = (sel) => document.querySelector(sel);
const $id = (id) => document.getElementById(id);

// ELEMENTOS
const albumListEl = $id("albumList");
const btnAddAlbum = $id("btnAddAlbum");
const btnAddMusic = $id("btnAddMusic");
const searchInput = $id("searchInput");

const modalAlbum = $id("modalAlbum");
const modalMusic = $id("modalMusic");

const formAlbum = $id("formAlbum");
const formMusic = $id("formMusic");

const musicAlbumSelect = $id("musicAlbum");

// --------------------------------------------------

function getPossibleFileInput() {
    return (
        $id("musicFile") ||
        $id("musicFileUrl") ||
        $id("musicCover") ||
        $("[name='musicFile']")
    );
}

function save() {
    localStorage.setItem(LS_KEY, JSON.stringify(albums));
}

function openModal(modal) {
    if (!modal) return;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeModal(modal) {
    if (!modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "";
}

function createEl(tag, props = {}) {
    const el = document.createElement(tag);
    Object.keys(props).forEach((k) => {
        if (k === "class") el.className = props[k];
        else if (k === "html") el.innerHTML = props[k];
        else el.setAttribute(k, props[k]);
    });
    return el;
}

function escapeHtml(str = "") {
    return String(str).replace(/[&<>"']/g, (m) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[m]));
}

function escapeAttr(s = "") {
    return String(s).replace(/"/g, "&quot;");
}

// --------------------------------------------------
// RENDER DOS ÁLBUNS
function updateAlbums() {
    if (!albumListEl) return;
    albumListEl.innerHTML = "";

    if (albums.length === 0) {
        const empty = createEl("p", {
            html: 'Nenhum álbum criado. Use <b>📀 Criar Álbum</b>.',
        });
        albumListEl.appendChild(empty);
        return;
    }

    albums.forEach((album, albumIndex) => {
        const card = createEl("div", { class: "album-card" });

        const coverSrc =
            album.cover || "https://via.placeholder.com/400x300?text=No+Cover";

        card.innerHTML = `
            <img src="${coverSrc}" alt="Capa do álbum" />
            <h3>${escapeHtml(album.name)}</h3>
            <p>👤 ${escapeHtml(album.artist)}</p>
            <p style="margin-top:8px;"><b>Músicas (${album.songs.length}):</b></p>
        `;

        // LISTA DE MÚSICAS
        album.songs.forEach((s, songIndex) => {
            const song = createEl("div", { class: "music-item" });

            let songHtml = `
                <p>🎵 <b>${escapeHtml(s.name)}</b></p>
                <p>🎼 ${escapeHtml(s.genre || "—")}</p>
            `;

            if (s.file) {
                songHtml += `
                    <audio controls src="${escapeAttr(s.file)}"></audio>
                `;
            }

            songHtml += `
                <div style="margin-top:8px; display:flex; gap:8px;">
                    <button class="btn-small" data-action="remove-song" data-album="${albumIndex}" data-song="${songIndex}">Remover</button>
                    <button class="btn-small" data-action="edit-song" data-album="${albumIndex}" data-song="${songIndex}">Editar</button>
                </div>
            `;

            song.innerHTML = songHtml;
            card.appendChild(song);
        });

        const controls = createEl("div", { class: "album-controls" });
        controls.style.marginTop = "12px";

        controls.innerHTML = `
            <button data-action="add-to-album" data-index="${albumIndex}">➕ Adicionar música</button>
            <button data-action="remove-album" data-index="${albumIndex}" class="btn-danger">Excluir Álbum</button>
        `;

        card.appendChild(controls);
        albumListEl.appendChild(card);
    });
}



function reloadAlbumSelect() {
    if (!musicAlbumSelect) return;
    musicAlbumSelect.innerHTML = "";

    albums.forEach((a, i) => {
        const op = createEl("option");
        op.value = i;
        op.textContent = `${a.name} — ${a.artist}`;
        musicAlbumSelect.appendChild(op);
    });
}

// -------------------------------------------------- FORM ÁLBUM
if (formAlbum) {
    formAlbum.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = $id("albumName").value.trim();
        const artist = $id("albumArtist").value.trim();
        const cover = $id("albumCover").value.trim();

        if (!name || !artist) {
            alert("Preencha nome e artista do álbum.");
            return;
        }

        albums.push({ name, artist, cover, songs: [] });
        save();
        updateAlbums();

        formAlbum.reset();
        closeModal(modalAlbum);
    });
}

// --------------------------------------------------  FORM MÚSICA
if (formMusic) {
    formMusic.addEventListener("submit", (e) => {
        e.preventDefault();

        const albumIndex = Number(musicAlbumSelect.value);
        if (!albums[albumIndex]) {
            alert("Selecione um álbum.");
            return;
        }

        const name = $id("musicName").value.trim();
        const genre = $id("musicGenre").value.trim();
        const fileInput = getPossibleFileInput();
        const fileVal = fileInput ? (fileInput.value || "").trim() : "";

        if (!name) {
            alert("Digite o nome da música.");
            return;
        }

        albums[albumIndex].songs.push({
            name,
            genre,
            file: fileVal,
        });

        save();
        updateAlbums();

        formMusic.reset();
        closeModal(modalMusic);
    });
}

// --------------------------------------------------
// EVENTOS EM LISTA
if (albumListEl) {
    albumListEl.addEventListener("click", (ev) => {
        const btn = ev.target.closest("button");
        if (!btn) return;

        const action = btn.dataset.action;

        if (action === "remove-album") {
            const idx = Number(btn.dataset.index);

            if (confirm(`Excluir álbum "${albums[idx].name}"?`)) {
                albums.splice(idx, 1);
                save();
                updateAlbums();
            }
        }

        if (action === "add-to-album") {
            const idx = Number(btn.dataset.index);

            reloadAlbumSelect();
            musicAlbumSelect.value = idx;

            openModal(modalMusic);
        }

        if (action === "remove-song") {
            const a = Number(btn.dataset.album);
            const s = Number(btn.dataset.song);

            if (
                confirm(
                    `Excluir música "${albums[a].songs[s].name}" do álbum "${albums[a].name}"?`
                )
            ) {
                albums[a].songs.splice(s, 1);
                save();
                updateAlbums();
            }
        }

        if (action === "edit-song") {
            const a = Number(btn.dataset.album);
            const s = Number(btn.dataset.song);

            const current = albums[a].songs[s];

            const newName = prompt("Editar nome:", current.name) || current.name;
            const newGenre = prompt("Editar gênero:", current.genre) || current.genre;
            const newFile =
                prompt("Editar arquivo:", current.file || "") || current.file;

            albums[a].songs[s] = {
                name: newName,
                genre: newGenre,
                file: newFile,
            };

            save();
            updateAlbums();
        }
    });
}

// --------------------------------------------------
// ABRIR / FECHAR MODAIS
if (btnAddAlbum) {
    btnAddAlbum.addEventListener("click", () => openModal(modalAlbum));
}

if (btnAddMusic) {
    btnAddMusic.addEventListener("click", () => {
        if (albums.length === 0) return alert("Crie um álbum primeiro.");
        reloadAlbumSelect();
        openModal(modalMusic);
    });
}

document.querySelectorAll(".close").forEach((el) => {
    el.addEventListener("click", () => {
        const id = el.dataset.close;
        closeModal($id(id));
    });
});

document.addEventListener("click", (ev) => {
    document.querySelectorAll(".modal").forEach((m) => {
        if (m.style.display === "flex" && ev.target === m) closeModal(m);
    });
});

// --------------------------------------------------
// BUSCA
if (searchInput) {
    searchInput.addEventListener("input", () => {
        const q = searchInput.value.trim().toLowerCase();
        const cards = document.querySelectorAll(".album-card");

        cards.forEach((c) => {
            c.style.display = c.textContent.toLowerCase().includes(q)
                ? ""
                : "none";
        });
    });
}

reloadAlbumSelect();
updateAlbums();