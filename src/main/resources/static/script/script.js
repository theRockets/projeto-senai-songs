const LS_KEY = "music_platform_v1";
let albums = JSON.parse(localStorage.getItem(LS_KEY)) || [];

const $ = (sel) => document.querySelector(sel);
const $id = (id) => document.getElementById(id);

// elementos principais
const albumListEl = $id("albumList") || $id("album-list") || $(".album-grid");
const btnAddAlbum = $id("btnAddAlbum") || $id("btnAddAlbumBtn") || $("[data-open='album']");
const btnAddMusic = $id("btnAddMusic") || $("[data-open='music']");
const searchInput = $id("searchInput") || $id("search") || $id("searchInputHeader") || $("header input");

// modais (por id)
const modalAlbum = $id("modalAlbum") || $id("modal-album") || $("[data-modal='album']");
const modalMusic = $id("modalMusic") || $id("modal-music") || $("[data-modal='music']");

const formAlbum = $id("formAlbum") || $("[data-form='album']");
const formMusic = $id("formMusic") || $("[data-form='music']");


const musicAlbumSelect = $id("musicAlbum") || $id("musicAlbumSelect") || $("[name='musicAlbum']");

function getPossibleFileInput() {
  return $id("musicFile") || $id("musicFileUrl") || $id("musicFileUrlInput") || $id("musicCover") || $id("file") || $("[name='musicFile']");
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
  Object.keys(props).forEach(k => {
    if (k === "class") el.className = props[k];
    else if (k === "html") el.innerHTML = props[k];
    else el.setAttribute(k, props[k]);
  });
  return el;
}


function updateAlbums() {
  if (!albumListEl) return;
  albumListEl.innerHTML = "";

  if (albums.length === 0) {
    const empty = createEl("p", { html: "Nenhum álbum criado. Use <b>📀 Criar Álbum</b>." });
    albumListEl.appendChild(empty);
    return;
  }

  albums.forEach((album, albumIndex) => {
    const card = createEl("div", { class: "album-card" });

    const coverSrc = album.cover || "https://via.placeholder.com/400x300?text=No+Cover";
    card.innerHTML = `
      <img src="${coverSrc}" alt="Capa do álbum" />
      <h3>${escapeHtml(album.name)}</h3>
      <p>👤 ${escapeHtml(album.artist)}</p>
      <p style="margin-top:8px;"><b>Músicas (${album.songs.length}):</b></p>
    `;

    // lista de músicas
    album.songs.forEach((s, songIndex) => {
      const song = createEl("div", { class: "music-item" });

    
      let songHtml = <p>🎵 <b>${escapeHtml(s.name)}</b></p>;
      songHtml += <p>🎼 ${escapeHtml(s.genre || "—")}</p>;
      if (s.file) {
     
        songHtml += <audio controls src="${escapeAttr(s.file)}"></audio>;
      }
      // botões editar/excluir 
      songHtml += `<div style="margin-top:8px; display:flex; gap:8px;">
            <button class="btn-small" data-action="remove-song" data-album="${albumIndex}" data-song="${songIndex}">Remover</button>
            <button class="btn-small" data-action="edit-song" data-album="${albumIndex}" data-song="${songIndex}">Editar</button>
          </div>`;

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


function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}
function escapeAttr(s = "") {
  return String(s).replace(/"/g, '&quot;');
}


if (formAlbum) {
  formAlbum.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = ( $id("albumName") || $("[name='albumName']") )?.value?.trim() || "";
    const artist = ( $id("albumArtist") || $("[name='albumArtist']") )?.value?.trim() || "";
    const cover = ( $id("albumCover") || $("[name='albumCover']") )?.value?.trim() || "";

    if (!name || !artist) {
      alert("Preencha nome e artista do álbum.");
      return;
    }

    albums.push({ name, artist, cover, songs: [] });
    save();
    updateAlbums();

   
    e.target.reset();
    closeModal(modalAlbum);
  });
}


function reloadAlbumSelect() {
  const sel = musicAlbumSelect;
  if (!sel) return;
  sel.innerHTML = "";

  albums.forEach((a, i) => {
    const op = createEl("option");
    op.value = i;
    op.textContent = ${a.name} — ${a.artist};
    sel.appendChild(op);
  });
}


// criar música

if (formMusic) {
  formMusic.addEventListener("submit", (e) => {
    e.preventDefault();

    const albumIndex = (musicAlbumSelect && musicAlbumSelect.value !== undefined) ? Number(musicAlbumSelect.value) : 0;
    if (!albums[albumIndex]) {
      alert("Selecione um álbum (ou crie um álbum primeiro).");
      return;
    }

    const name = ( $id("musicName") || $("[name='musicName']") )?.value?.trim() || "";
    const genre = ( $id("musicGenre") || $("[name='musicGenre']") )?.value?.trim() || "";
    const fileInput = getPossibleFileInput();
    const fileVal = fileInput ? (fileInput.value || "").trim() : "";

    if (!name) {
      alert("Digite o nome da música.");
      return;
    }

    const song = { name, genre, file: fileVal };
    albums[albumIndex].songs.push(song);
    save();
    updateAlbums();

    e.target.reset();
    closeModal(modalMusic);
  });
}


//remover, editar, add

if (albumListEl) {
  albumListEl.addEventListener("click", (ev) => {
    const btn = ev.target.closest("button");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    if (!action) return;

    if (action === "remove-album") {
      const idx = Number(btn.getAttribute("data-index"));
      if (Number.isFinite(idx) && albums[idx]) {
        if (confirm(Excluir álbum "${albums[idx].name}"?)) {
          albums.splice(idx, 1);
          save();
          updateAlbums();
        }
      }
    }

    if (action === "add-to-album") {
      const idx = Number(btn.getAttribute("data-index"));
      
      if (modalMusic) {
        reloadAlbumSelect();
        
        setTimeout(() => {
          if (musicAlbumSelect) musicAlbumSelect.value = String(idx);
        }, 0);
        openModal(modalMusic);
      } else {
        alert("Modal de adicionar música não encontrado.");
      }
    }

    if (action === "remove-song") {
      const a = Number(btn.getAttribute("data-album"));
      const s = Number(btn.getAttribute("data-song"));
      if (albums[a] && albums[a].songs[s]) {
        if (confirm(Excluir música "${albums[a].songs[s].name}" do álbum "${albums[a].name}"?)) {
          albums[a].songs.splice(s, 1);
          save();
          updateAlbums();
        }
      }
    }

    if (action === "edit-song") {
      const a = Number(btn.getAttribute("data-album"));
      const s = Number(btn.getAttribute("data-song"));
      if (!(albums[a] && albums[a].songs[s])) return;
    
      const current = albums[a].songs[s];
      const newName = prompt("Editar nome da música:", current.name) || current.name;
      const newGenre = prompt("Editar gênero:", current.genre) || current.genre;
      const newFile = prompt("URL do arquivo (deixe em branco para não alterar):", current.file || "") || current.file;
      albums[a].songs[s] = { name: newName, genre: newGenre, file: newFile };
      save();
      updateAlbums();
    }
  });
}


// Abrir/fechar modais por botão superior

if (btnAddAlbum) {
  btnAddAlbum.addEventListener("click", () => {
    openModal(modalAlbum);
  });
}
if (btnAddMusic) {
  btnAddMusic.addEventListener("click", () => {
    if (albums.length === 0) {
      alert("Crie um álbum primeiro.");
      return;
    }
    reloadAlbumSelect();
    openModal(modalMusic);
  });
}


// Fechar modais com os elementos .close (que tenham data-close apontando para id)

document.querySelectorAll(".close").forEach(el => {
  el.addEventListener("click", () => {
    const id = el.getAttribute("data-close");
    if (id && $id(id)) closeModal($id(id));
    else {
      
      const modalParent = el.closest(".modal");
      if (modalParent) closeModal(modalParent);
    }
  });
});

// fechar modal ao clicar no fundo (se a estrutura do modal tiver a classe modal)
document.addEventListener("click", (ev) => {
  const modalEls = document.querySelectorAll(".modal");
  modalEls.forEach(m => {
    if (m.style.display === "flex" && ev.target === m) {
      closeModal(m);
    }
  });
});

// Busca (se houver input)
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    // filtrar cards por texto
    const cards = document.querySelectorAll(".album-card");
    cards.forEach(c => {
      const text = c.textContent.toLowerCase();
      c.style.display = text.includes(q) ? "" : "none";
    });
  });
}


reloadAlbumSelect();
updateAlbums();