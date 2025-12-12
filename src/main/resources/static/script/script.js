const LS_KEY = "music_platform_v1";
let albums = JSON.parse(localStorage.getItem(LS_KEY) || "null") || [];

const $id = (id) => document.getElementById(id);
const $ = (sel) => document.querySelector(sel);

const albumListEl = $id("albumList");
const allSongsListEl = $id("allSongsList");
const btnAddAlbum = $id("btnAddAlbum");
const btnAddMusic = $id("btnAddMusic");
const searchInput = $id("searchInput");

const modalAlbum = $id("modalAlbum");
const modalMusic = $id("modalMusic");

const formAlbum = $id("formAlbum");
const formMusic = $id("formMusic");

const musicAlbumSelect = $id("musicAlbum");

const albumPage = $id("albumPage");
const viewAlbumName = $id("viewAlbumName");
const viewAlbumArtist = $id("viewAlbumArtist");
const viewTotalSongs = $id("viewTotalSongs");
const albumSongsContainer = $id("albumSongs");
const btnBackAlbums = $id("btnBackAlbums");
const btnAddMusicInside = $id("btnAddMusicInside");

const albumEditIndexInput = $id("albumEditIndex");
const musicEditAlbumInput = $id("musicEditAlbum");
const musicEditIndexInput = $id("musicEditIndex");

function save() {
    localStorage.setItem(LS_KEY, JSON.stringify(albums));
}

// Tradução dos caracteres especiais
function escapeHtml(str = "") {
    return String(str)
}

// Limpa e coloca novas opções
function reloadAlbumSelect() {
    musicAlbumSelect.innerHTML = "";
    albums.forEach((a, idx) => {
        const op = document.createElement("option");
        op.value = idx;
        op.textContent = `${a.name} — ${a.artist}`;
        musicAlbumSelect.appendChild(op);
    });
}

// Atualiza a lista de albuns
function updateAlbums() {
    albumListEl.innerHTML = "";

    if (!albums.length) {
        albumListEl.innerHTML = `<div style="color:#cfcfcf; padding:12px;">Nenhum álbum criado ainda.</div>`;
        return;
    }

    // mostra os 5 recentes
    const showLimit = 5;
    const sorted = [...albums].sort((a, b) => b.createdAt - a.createdAt);
    const toShow = sorted.slice(0, showLimit);

    toShow.forEach((album) => {
        const index = albums.indexOf(album);
        const card = document.createElement("div");
        card.className = "album-card";
        const cover = album.cover || "https://via.placeholder.com/300x200?text=Capa";

        card.innerHTML = `
            <img src="${escapeHtml(cover)}" class="album-cover" alt="capa">
            <div class="album-info">
                <h3>${escapeHtml(album.name)}</h3>
                <p>${escapeHtml(album.artist)}</p>
            </div>
            <div class="album-options">
                <button data-action="edit-album" data-index="${index}" title="Editar">✏️</button>
                <button data-action="delete-album" data-index="${index}" title="Excluir">🗑️</button>
            </div>
        `;

        // abre o album quando clicado
        card.addEventListener("click", (e) => {
            if (e.target.closest("button")) return;
            openAlbumSongs(index);
        });

        albumListEl.appendChild(card);
    });

    // se tiver mais de 5 albuns aparece o ver mais
    if (albums.length > showLimit) {
        const viewAllCard = document.createElement("div");
        viewAllCard.className = "album-card view-all";
        viewAllCard.innerHTML = `<div>Ver mais<br><small style="opacity:.8">${albums.length} álbuns</small></div>`;
        viewAllCard.addEventListener("click", () => {
            openAllAlbumsView();
        });
        albumListEl.appendChild(viewAllCard);
    }
}

// Sem essa função o ver mais não funciona - os albuns a mais não aparecem
function openAllAlbumsView() {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "12px";
    wrapper.innerHTML = `<button class="btn-back">⬅ Voltar</button><h3>Todos os álbuns</h3>`;

    albums
        .slice().sort((a, b) => b.createdAt - a.createdAt)
        .forEach((album, idx) => {
            const row = document.createElement("div");
            row.className = "song-row";
            row.style.cursor = "pointer";
            const cover = album.cover || "https://via.placeholder.com/100";
            row.innerHTML = `
                <div style="display:flex;align-items:center;gap:12px">
                    <img src="${escapeHtml(cover)}" style="width:58px;height:58px;border-radius:8px;object-fit:cover;">
                    <div>
                        <div style="font-weight:700">${escapeHtml(album.name)}</div>
                        <div style="color:#cfcfcf;font-size:13px">${escapeHtml(album.artist)}</div>
                    </div>
                </div>
                <div style="display:flex;gap:8px;align-items:center">
                    <button data-action="open-album" data-index="${albums.indexOf(album)}">Abrir</button>
                    <button data-action="edit-album" data-index="${albums.indexOf(album)}">Editar</button>
                    <button data-action="delete-album" data-index="${albums.indexOf(album)}">Excluir</button>
                </div>
            `;
            wrapper.appendChild(row);
        });

    // funções de editar, voltar, excluir, etc...
    albumListEl.innerHTML = "";
    const back = wrapper.querySelector(".btn-back");
    back.addEventListener("click", updateAlbums);
    wrapper.querySelectorAll("button[data-action]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const action = btn.dataset.action;
            const idx = Number(btn.dataset.index);
            if (action === "open-album") openAlbumSongs(idx);
            if (action === "edit-album") openEditAlbum(idx);
            if (action === "delete-album") {
                if (confirm("Excluir álbum?")) {
                    albums.splice(idx, 1);
                    save();
                    updateAlbums();
                    renderAllSongs();
                }
            }
        });
    });
    albumListEl.appendChild(wrapper);
}

// Função de abrir o Album e mostrar suas músicas
function openAlbumSongs(index) {
    const album = albums[index];
    if (!album) return;

    viewAlbumName.textContent = album.name;
    viewAlbumArtist.textContent = album.artist;
    viewTotalSongs.textContent = album.songs.length;

    albumPage.style.display = "block";
    $(".content main").scrollIntoView({ behavior: "smooth" }); // Faz abrir o album

    renderAlbumSongs(index); // Chama a função de baixo para listar as músicas
}

// Função para criar a lista de músicas de um álbum
function renderAlbumSongs(albumIndex) {
    albumSongsContainer.innerHTML = "";
    const album = albums[albumIndex];
    album.songs
        .slice()
        .sort((a, b) => a.createdAt - b.createdAt)
        .forEach((song, sIdx) => {
            const row = document.createElement("div");
            row.className = "song-row";

            const cover = album.cover || "https://via.placeholder.com/100";

            row.innerHTML = `
                <div class="song-left">
                    <div class="song-index">${sIdx + 1}</div>
                    <img src="${escapeHtml(cover)}" class="song-cover" />
                    <div class="song-info">
                        <p class="song-name">${escapeHtml(song.name)}</p>
                        <p class="song-genre">${escapeHtml(song.genre)}</p>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:12px;">
                    <div class="song-time">${song.time || "-"}</div>
                    <div class="song-more">
                        <button class="more-btn">⋮</button>
                        <div class="more-menu">
                            <button data-action="edit-song" data-album="${albumIndex}" data-song="${album.songs.indexOf(song)}">Editar</button>
                            <button data-action="remove-song" data-album="${albumIndex}" data-song="${album.songs.indexOf(song)}">Excluir</button>
                        </div>
                    </div>
                </div>
            `;

            const moreBtn = row.querySelector(".more-btn");
            const menu = row.querySelector(".more-menu");
            moreBtn.addEventListener("click", (e) => {
                menu.classList.toggle("show");
                e.stopPropagation();
            });

            albumSongsContainer.appendChild(row);
        });

    // fechar menu ao clicar fora
    document.addEventListener("click", () => {
        document.querySelectorAll(".more-menu").forEach(m => m.classList.remove("show"));
    });

    // vincular ações dos botões dentro das more-menus (delegation)
    albumSongsContainer.querySelectorAll(".more-menu button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const action = btn.dataset.action;
            const a = Number(btn.dataset.album);
            const s = Number(btn.dataset.song);
            if (action === "edit-song") openEditSong(a, s);
            if (action === "remove-song") {
                if (confirm("Excluir música?")) {
                    albums[a].songs.splice(s, 1);
                    save();
                    renderAlbumSongs(a);
                    renderAllSongs();
                    viewTotalSongs.textContent = albums[a].songs.length;
                }
            }
        });
    });

    viewTotalSongs.textContent = album.songs.length; // atualiza o numero de músicas
}

// Lista de todas as músicas juntas
function renderAllSongs() {
    allSongsListEl.innerHTML = "";
    const all = [];
    albums.forEach((a, ai) => {
        a.songs.forEach((s, si) => {
            all.push({
                albumIndex: ai,
                songIndex: si,
                albumName: a.name,
                albumCover: a.cover,
                artist: a.artist,
                song: s
            });
        });
    });

    all.sort((x, y) => (x.song.createdAt || 0) - (y.song.createdAt || 0));

    if (!all.length) {
        allSongsListEl.innerHTML = `<div style="color:#cfcfcf; padding:12px;">Nenhuma música cadastrada.</div>`;
        return;
    }

    all.forEach((obj, idx) => {
        const s = obj.song;
        const row = document.createElement("div");
        row.className = "song-row";
        row.innerHTML = `
            <div class="song-left">
                <div class="song-index">${idx + 1}</div>
                <img src="${escapeHtml(obj.albumCover || 'https://via.placeholder.com/100')}" class="song-cover">
                <div class="song-info">
                    <p class="song-name">${escapeHtml(s.name)}</p>
                    <p class="song-genre">${escapeHtml(s.genre)} · ${escapeHtml(obj.albumName)}</p>
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
                <div class="song-time">${s.time || "-"}</div>
                <div class="song-more">
                    <button class="more-btn">⋮</button>
                    <div class="more-menu">
                        <button data-action="goto-album" data-album="${obj.albumIndex}" data-song="${obj.songIndex}">Abrir álbum</button>
                        <button data-action="edit-song" data-album="${obj.albumIndex}" data-song="${obj.songIndex}">Editar</button>
                        <button data-action="remove-song" data-album="${obj.albumIndex}" data-song="${obj.songIndex}">Excluir</button>
                    </div>
                </div>
            </div>
        `;

        row.querySelector(".more-btn").addEventListener("click", (e) => {
            const menu = row.querySelector(".more-menu");
            menu.classList.toggle("show");
            e.stopPropagation();
        });

        row.querySelectorAll(".more-menu button").forEach(btn => {
            btn.addEventListener("click", () => {
                const a = Number(btn.dataset.album);
                const sIdx = Number(btn.dataset.song);
                const action = btn.dataset.action;
                if (action === "goto-album") openAlbumSongs(a);
                if (action === "edit-song") openEditSong(a, sIdx);
                if (action === "remove-song") {
                    if (confirm("Excluir música?")) {
                        albums[a].songs.splice(sIdx, 1);
                        save();
                        renderAllSongs();
                        if (albumPage.style.display === "block" && viewAlbumName.textContent === albums[a].name) { // atualiza a página ao fazer alteração
                            renderAlbumSongs(a);
                            viewTotalSongs.textContent = albums[a].songs.length;
                        }
                    }
                }
            });
        });

        allSongsListEl.appendChild(row);
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".more-menu").forEach(m => m.classList.remove("show"));
    });
}

// Funções para abrir e fechar modals
function openModal(modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}
function closeModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
}

// Configura o BOTÃO de fechar
document.querySelectorAll(".close").forEach(c => {
    c.addEventListener("click", (e) => {
        const id = c.dataset.close || c.parentElement.id;
        closeModal(document.getElementById(id));
    });
});
document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.close;
        closeModal(document.getElementById(id));
    });
});

// Controlador do formulário de criar/editar álbuns.
formAlbum.addEventListener("submit", (e) => {
    e.preventDefault();
    const idx = Number(albumEditIndexInput.value);
    const name = $id("albumName").value.trim();
    const artist = $id("albumArtist").value.trim();
    const cover = $id("albumCover").value.trim();

    if (!name || !artist) {
        alert("Preencha nome e artista.");
        return;
    }

    if (idx >= 0 && albums[idx]) {
        // editar
        albums[idx].name = name;
        albums[idx].artist = artist;
        albums[idx].cover = cover;
    } else {
        // criar
        albums.push({
            name,
            artist,
            cover,
            createdAt: Date.now(),
            songs: []
        });
    }

    save();
    closeModal(modalAlbum);
    formAlbum.reset();
    albumEditIndexInput.value = -1;
    reloadAlbumSelect();
    updateAlbums();
    renderAllSongs();
});

// abrir modal criar
btnAddAlbum.addEventListener("click", () => {
    albumEditIndexInput.value = -1;
    $id("modalAlbumTitle").textContent = "Criar Álbum";
    $id("albumName").value = "";
    $id("albumArtist").value = "";
    $id("albumCover").value = "";
    openModal(modalAlbum);
});

// abrir editar album
function openEditAlbum(index) {
    const a = albums[index];
    if (!a) return;
    albumEditIndexInput.value = index;
    $id("modalAlbumTitle").textContent = "Editar Álbum";
    $id("albumName").value = a.name;
    $id("albumArtist").value = a.artist;
    $id("albumCover").value = a.cover || "";
    openModal(modalAlbum);
}

// Deletar album com event delegation - quando clicar nisso vc roda tal função (listener)
albumListEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const action = btn.dataset.action;
    const idx = Number(btn.dataset.index);
    if (action === "delete-album") {
        if (!albums[idx]) return;
        if (!confirm("Excluir álbum e todas as músicas?")) return;
        albums.splice(idx, 1);
        save();
        updateAlbums();
        renderAllSongs();
    }
    if (action === "edit-album") {
        openEditAlbum(idx);
    }
});

// Controlador do formulário de criar/editar musica
formMusic.addEventListener("submit", (e) => {
    e.preventDefault();
    const albumIdx = Number(musicAlbumSelect.value);
    const name = $id("musicName").value.trim();
    const genre = $id("musicGenre").value;
    const time = $id("musicTime").value.trim();
    const editAlbum = Number(musicEditAlbumInput.value);
    const editSong = Number(musicEditIndexInput.value);

    if (isNaN(albumIdx) || !albums[albumIdx]) {
        alert("Selecione um álbum válido.");
        return;
    }
    if (!name) {
        alert("Digite o nome da música.");
        return;
    }

    if (editAlbum >= 0 && albums[editAlbum] && editSong >= 0) {
        // editar
        albums[editAlbum].songs[editSong].name = name;
        albums[editAlbum].songs[editSong].genre = genre;
        albums[editAlbum].songs[editSong].time = time;
    } else {
        // criar
        const song = {
            name,
            genre,
            time,
            createdAt: Date.now()
        };
        albums[albumIdx].songs.push(song);
    }

    save();
    closeModal(modalMusic);
    formMusic.reset();
    musicEditAlbumInput.value = -1;
    musicEditIndexInput.value = -1;

    renderAllSongs();
    updateAlbums();
});

// botão para abrir modal adicionar musica
btnAddMusic.addEventListener("click", () => {
    reloadAlbumSelect();
    musicEditAlbumInput.value = -1;
    musicEditIndexInput.value = -1;
    $id("modalMusicTitle").textContent = "Adicionar Música";
    openModal(modalMusic);
});

// botão para add música dentro do album
btnAddMusicInside.addEventListener("click", () => {
    const alName = viewAlbumName.textContent;
    const idx = albums.findIndex(a => a.name === alName);
    reloadAlbumSelect();
    if (idx >= 0) musicAlbumSelect.value = idx;
    musicEditAlbumInput.value = -1;
    musicEditIndexInput.value = -1;
    $id("modalMusicTitle").textContent = "Adicionar Música";
    openModal(modalMusic);
});

// abre o modal de música já preenchido para edição
function openEditSong(albumIndex, songIndex) {
    const a = albums[albumIndex];
    if (!a || !a.songs[songIndex]) return;
    const s = a.songs[songIndex];

    reloadAlbumSelect();
    musicAlbumSelect.value = albumIndex;
    musicEditAlbumInput.value = albumIndex;
    musicEditIndexInput.value = songIndex;
    $id("modalMusicTitle").textContent = "Editar Música";
    $id("musicName").value = s.name;
    $id("musicGenre").value = s.genre || "Pop";
    $id("musicTime").value = s.time || "";
    openModal(modalMusic);
}

// Esconde a seção do album individual
btnBackAlbums.addEventListener("click", () => {
    albumPage.style.display = "none";
    updateAlbums();
    renderAllSongs();
});

// Ativa a pesquisa de albuns e músicas
searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();

    document.querySelectorAll("#albumList .album-card").forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? "" : "none";
    });

    document.querySelectorAll("#allSongsList .song-row").forEach(row => {
        const name = row.querySelector(".song-name")?.textContent.toLowerCase() || "";
        const meta = row.querySelector(".song-genre")?.textContent.toLowerCase() || "";
        row.style.display = (name + " " + meta).includes(q) ? "" : "none";
    });
});

// prepara tudo quando a página é carregada.
function init() {
    albums.forEach(a => {
        if (!a.createdAt) a.createdAt = Date.now();
        a.songs = a.songs || [];
        a.songs.forEach(s => { if (!s.createdAt) s.createdAt = Date.now(); });
    });

    reloadAlbumSelect();
    updateAlbums();
    renderAllSongs();
}

init();