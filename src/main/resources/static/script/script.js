const API_URL = "http://localhost:8080"; 
let currentAlbums = []; 

const refs = {
    modalAlbum: document.getElementById("modalAlbum"),
    modalMusic: document.getElementById("modalMusic"),
    formAlbum: document.getElementById("formAlbum"),
    formMusic: document.getElementById("formMusic"),
    albumListDiv: document.getElementById("albumList"),
    allSongsListDiv: document.getElementById("allSongsList"),
    albumPage: document.getElementById("albumPage"),
    mainPage: document.getElementById("mainPage"),
    searchInput: document.getElementById("searchInput"),
    musicAlbumSelect: document.getElementById("musicAlbum"),
    viewAlbumName: document.getElementById("viewAlbumName"),
    viewAlbumArtist: document.getElementById("viewAlbumArtist"),
    viewTotalSongs: document.getElementById("viewTotalSongs"),
    albumSongsDiv: document.getElementById("albumSongs")
};

document.addEventListener("DOMContentLoaded", () => {
    loadInitialData();
    setupEventListeners();
});

async function loadInitialData() {
    await fetchAlbums();
    await fetchAllSongs();
}

async function apiRequest(endpoint, method = "GET", body = null) {
    try {
        const options = {
            method,
            headers: { "Content-Type": "application/json" }
        };
        if (body) options.body = JSON.stringify(body);
        const response = await fetch(`${API_URL}${endpoint}`, options);
        
        const text = await response.text();
        if (!response.ok) throw new Error(text || `Erro ${response.status}`);
        
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error("Erro API:", error);
        return null;
    }
}

function formatTime(seconds) {
    if (!seconds && seconds !== 0) return "--:--";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// ==========================================
// RENDERIZAÇÃO MELHORADA
// ==========================================

async function fetchAlbums() {
    const data = await apiRequest("/album");
    currentAlbums = Array.isArray(data) ? data : [];
    renderAlbums(currentAlbums);
    updateAlbumSelect();
}

async function fetchAllSongs() {
    const data = await apiRequest("/musica");
    if (Array.isArray(data)) renderSongs(data, refs.allSongsListDiv);
}

function renderAlbums(albums) {
    refs.albumListDiv.innerHTML = "";
    albums.forEach(album => {
        const card = document.createElement("div");
        card.className = "album-card";
        card.dataset.search = `${album.nomeAlbum} ${album.artistaResponsavel}`.toLowerCase();

        const capa = album.urlCapa || "https://via.placeholder.com/150/222/fff?text=CD";
        card.innerHTML = `
            <div class="album-options">
                <button class="btn-icon" onclick="event.stopPropagation(); editAlbum(${album.id})">✎</button>
                <button class="btn-icon" onclick="event.stopPropagation(); deleteAlbum(${album.id})">✕</button>
            </div>
            <img src="${capa}" class="album-cover">
            <div class="album-info">
                <h3>${album.nomeAlbum}</h3>
                <p>${album.artistaResponsavel}</p>
            </div>
        `;
        card.onclick = () => openAlbumPage(album.id);
        refs.albumListDiv.appendChild(card);
    });
}

/**
 * @param {Array} songs - Lista de músicas
 * @param {HTMLElement} targetDiv - Onde renderizar
 * @param {Object} albumContext - (Opcional) Dados do álbum se estivermos dentro de uma página de álbum
 */
function renderSongs(songs, targetDiv, albumContext = null) {
    targetDiv.innerHTML = "";
    
    songs.forEach((song, index) => {
        const row = document.createElement("div");
        row.className = "song-row";
        
        // Prioriza os dados do álbum contexto (página do álbum) ou do objeto da música (busca geral)
        const nomeAlbum = albumContext ? albumContext.nomeAlbum : (song.album ? song.album.nomeAlbum : "Single");
        const capaUrl = albumContext ? albumContext.urlCapa : (song.album ? song.album.urlCapa : "");
        const finalCapa = capaUrl && capaUrl.trim() !== "" ? capaUrl : "https://cdn-icons-png.flaticon.com/512/109/109602.png";

        // Índice de busca robusto
        row.setAttribute("data-search", `${song.tituloMusica} ${song.genero} ${nomeAlbum}`.toLowerCase());

        row.innerHTML = `
            <div class="song-left">
                <div class="song-index">${index + 1}</div>
                <div class="disc-wrapper">
                    <img src="${finalCapa}" class="song-cover" onerror="this.src='https://cdn-icons-png.flaticon.com/512/109/109602.png'">
                </div>
                <div class="song-info">
                    <p class="song-name">${song.tituloMusica || "Sem Título"}</p>
                    <p class="song-genre">${song.genero || "Geral"} • ${nomeAlbum}</p>
                </div>
            </div>
            <div class="song-actions">
                <span class="song-time">${formatTime(song.tempoDuracao)}</span>
                <div class="action-buttons">
                    <button class="btn-small" onclick="editMusic(${song.id})">Editar</button>
                    <button class="btn-small btn-delete" onclick="deleteMusic(${song.id})">Excluir</button>
                </div>
            </div>
        `;
        targetDiv.appendChild(row);
    });
}

// ==========================================
// NAVEGAÇÃO
// ==========================================

function openAlbumPage(albumId) {
    const album = currentAlbums.find(a => a.id === albumId);
    if (!album) return;

    refs.mainPage.style.display = "none";
    refs.albumPage.style.display = "block";

    refs.viewAlbumName.textContent = album.nomeAlbum;
    refs.viewAlbumName.dataset.currentId = album.id;
    refs.viewAlbumArtist.textContent = album.artistaResponsavel;
    
    // IMPORTANTE: Passamos o objeto 'album' como contexto para as músicas herdarem a imagem e o nome
    renderSongs(album.musicas || [], refs.albumSongsDiv, album);
    
    refs.viewTotalSongs.textContent = `${(album.musicas || []).length} músicas`;
}

function setupEventListeners() {
    document.getElementById("btnBackAlbums").onclick = () => {
        refs.albumPage.style.display = "none";
        refs.mainPage.style.display = "block";
        refs.searchInput.value = "";
        fetchAllSongs();
    };

    refs.searchInput.oninput = (e) => {
        const term = e.target.value.toLowerCase().trim();
        
        document.querySelectorAll(".album-card").forEach(card => {
            card.style.display = card.dataset.search.includes(term) ? "block" : "none";
        });
        
        document.querySelectorAll(".song-row").forEach(row => {
            row.style.display = row.getAttribute("data-search").includes(term) ? "flex" : "none";
        });
    };

    document.getElementById("btnAddAlbum").onclick = () => openModal(refs.modalAlbum, "Criar Álbum");
    document.getElementById("btnAddMusic").onclick = () => {
        if(refs.albumPage.style.display === "block") {
            refs.musicAlbumSelect.value = refs.viewAlbumName.dataset.currentId;
        }
        openModal(refs.modalMusic, "Adicionar Música");
    };
    
    document.querySelectorAll(".close, .btn-cancel").forEach(b => b.onclick = () => closeModal());
}

// ==========================================
// CRUD E MODAIS (Ajustado para evitar erros de JSON)
// ==========================================

function openModal(modal, title) { 
    modal.querySelector("h2").innerText = title;
    modal.style.display = "flex"; 
}

function closeModal() { 
    refs.modalAlbum.style.display = "none"; 
    refs.modalMusic.style.display = "none"; 
    refs.formAlbum.reset(); refs.formMusic.reset();
    document.getElementById("albumId").value = "";
    document.getElementById("musicId").value = "";
}

window.editAlbum = (id) => {
    const album = currentAlbums.find(a => a.id === id);
    if(album) {
        document.getElementById("albumId").value = album.id;
        document.getElementById("albumName").value = album.nomeAlbum;
        document.getElementById("albumArtist").value = album.artistaResponsavel;
        document.getElementById("albumCover").value = album.urlCapa;
        openModal(refs.modalAlbum, "Editar Álbum");
    }
};

window.editMusic = async (id) => {
    const song = await apiRequest(`/musica/${id}`);
    if(song) {
        document.getElementById("musicId").value = song.id;
        document.getElementById("musicName").value = song.tituloMusica;
        document.getElementById("musicGenre").value = song.genero;
        document.getElementById("musicTime").value = song.tempoDuracao;
        if(song.album) refs.musicAlbumSelect.value = song.album.id;
        openModal(refs.modalMusic, "Editar Música");
    }
};

window.deleteAlbum = async (id) => {
    if(confirm("Excluir álbum e suas músicas?")) {
        await apiRequest(`/album/${id}`, "DELETE");
        fetchAlbums(); fetchAllSongs();
    }
};

window.deleteMusic = async (id) => {
    if(confirm("Excluir música?")) {
        await apiRequest(`/musica/${id}`, "DELETE");
        if(refs.albumPage.style.display === "block") {
            const currentId = parseInt(refs.viewAlbumName.dataset.currentId);
            await fetchAlbums();
            openAlbumPage(currentId);
        } else {
            fetchAllSongs();
        }
    }
};

refs.formAlbum.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("albumId").value;
    const payload = {
        nomeAlbum: document.getElementById("albumName").value,
        artistaResponsavel: document.getElementById("albumArtist").value,
        urlCapa: document.getElementById("albumCover").value
    };
    await apiRequest(id ? `/album/${id}` : "/album", id ? "PUT" : "POST", payload);
    closeModal(); fetchAlbums();
};

refs.formMusic.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("musicId").value;
    const albumId = refs.musicAlbumSelect.value;
    const payload = {
        tituloMusica: document.getElementById("musicName").value,
        genero: document.getElementById("musicGenre").value,
        tempoDuracao: parseInt(document.getElementById("musicTime").value),
        album: { id: parseInt(albumId) }
    };
    await apiRequest(id ? `/musica/${id}` : "/musica", id ? "PUT" : "POST", payload);
    closeModal(); 
    if(refs.albumPage.style.display === "block") {
        await fetchAlbums();
        openAlbumPage(parseInt(albumId));
    } else {
        fetchAllSongs();
    }
};

function updateAlbumSelect() {
    refs.musicAlbumSelect.innerHTML = '<option value="">Selecione um álbum</option>';
    currentAlbums.forEach(a => {
        refs.musicAlbumSelect.innerHTML += `<option value="${a.id}">${a.nomeAlbum}</option>`;
    });
}