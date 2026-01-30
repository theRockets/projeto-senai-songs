// URL base da sua API Java Spring Boot
const API_URL = "http://localhost:8080"; 

// --- ELEMENTOS DO DOM ---
const modalAlbum = document.getElementById("modalAlbum");
const modalMusic = document.getElementById("modalMusic");
const formAlbum = document.getElementById("formAlbum");
const formMusic = document.getElementById("formMusic");
const albumListDiv = document.getElementById("albumList");
const allSongsListDiv = document.getElementById("allSongsList");
const albumPage = document.getElementById("albumPage");
const mainPage = document.getElementById("mainPage");
const searchInput = document.getElementById("searchInput");
const musicAlbumSelect = document.getElementById("musicAlbum");

// --- INICIALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
    fetchAlbums();
    fetchSongs();
    setupEventListeners();
});

// --- FUNÇÃO DE API (AJAX/FETCH) ---
async function apiRequest(endpoint, method = "GET", body = null) {
    try {
        const options = {
            method: method,
            headers: { "Content-Type": "application/json" }
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(`${API_URL}${endpoint}`, options);

        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
        
        const text = await response.text();
        try {
            // Se for JSON, converte. Se for a mensagem de texto do Delete, retorna a string.
            return text ? JSON.parse(text) : null;
        } catch (e) {
            return text; 
        }
    } catch (error) {
        console.error("Erro API:", error);
        return null;
    }
}

// --- CARREGAMENTO DE DADOS ---

async function fetchAlbums() {
    const albums = await apiRequest("/album"); 
    if (albums) renderAlbums(albums);
}

async function fetchSongs() {
    const songs = await apiRequest("/musica"); 
    if (songs) renderSongs(songs);
}

// --- RENDERIZAÇÃO ---

function renderAlbums(albums) {
    albumListDiv.innerHTML = "";
    musicAlbumSelect.innerHTML = "<option value=''>Selecione um álbum</option>";

    albums.forEach(album => {
        // Preenche o select do modal de música
        const option = document.createElement("option");
        option.value = album.id;
        option.textContent = album.nomeAlbum;
        musicAlbumSelect.appendChild(option);

        // Cria o card do álbum
        const card = document.createElement("div");
        card.className = "album-card";
        card.innerHTML = `
            <div class="album-options">
                <button class="btn-icon" onclick="editAlbum(${album.id}, event)">✎</button>
                <button class="btn-icon" onclick="deleteAlbum(${album.id}, event)">✕</button>
            </div>
            <img src="${album.urlCapa || 'img/default-cover.png'}" class="album-cover">
            <div class="album-info">
                <h3>${album.nomeAlbum}</h3>
                <p>${album.artistaResponsavel}</p>
            </div>
        `;
        card.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON") openAlbumPage(album);
        });

        albumListDiv.appendChild(card);
    });
}

function renderSongs(songs, targetDiv = allSongsListDiv) {
    targetDiv.innerHTML = "";
    if(!songs || songs.length === 0) {
        targetDiv.innerHTML = "<p style='text-align:center; color:#666;'>Nenhuma música encontrada.</p>";
        return;
    }

    songs.forEach(song => {
        const row = document.createElement("div");
        row.className = "song-row";
        const cover = song.album && song.album.urlCapa ? song.album.urlCapa : 'img/default-music.png';
        const albumName = song.album ? song.album.nomeAlbum : 'Single';

        row.innerHTML = `
            <div class="song-left">
                <img src="${cover}" class="song-cover">
                <div class="song-info">
                    <p class="song-name">${song.tituloMusica}</p>
                    <p class="song-genre">${song.genero} • ${albumName}</p>
                </div>
            </div>
            <div class="song-actions">
                <span style="font-size:12px; color:#aaa; margin-right:10px;">${song.tempoDuracao} min</span>
                <button class="btn-small" onclick="editMusic(${song.id})">Editar</button>
                <button class="btn-small btn-delete" onclick="deleteMusic(${song.id})">Excluir</button>
            </div>
        `;
        targetDiv.appendChild(row);
    });
}

// --- CRUD ÁLBUNS ---

async function handleAlbumSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("albumId").value;
    
    // Nomes dos campos sincronizados com a classe Album do Java
    const albumData = {
        nomeAlbum: document.getElementById("albumName").value,
        artistaResponsavel: document.getElementById("albumArtist").value,
        urlCapa: document.getElementById("albumCover").value
    };

    const endpoint = id ? `/album/${id}` : "/album";
    const method = id ? "PUT" : "POST";
    const result = await apiRequest(endpoint, method, albumData);

    if (result) {
        modalAlbum.classList.remove("show");
        fetchAlbums();
    }
}

window.editAlbum = async (id, e) => {
    if(e) e.stopPropagation();
    const album = await apiRequest(`/album/${id}`);
    if (album) {
        document.getElementById("albumId").value = album.id;
        document.getElementById("albumName").value = album.nomeAlbum;
        document.getElementById("albumArtist").value = album.artistaResponsavel; // A correção crucial
        document.getElementById("albumCover").value = album.urlCapa;
        
        document.getElementById("modalAlbumTitle").innerText = "Editar Álbum";
        openModal(modalAlbum);
    }
};

window.deleteAlbum = async (id, e) => {
    e.stopPropagation();
    if(confirm("Deseja realmente excluir este álbum?")) {
        await apiRequest(`/album/${id}`, "DELETE");
        fetchAlbums();
    }
};

// --- CRUD MÚSICAS ---

async function handleMusicSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("musicId").value;
    const albumId = document.getElementById("musicAlbum").value;
    
    const musicData = {
        tituloMusica: document.getElementById("musicName").value,
        genero: document.getElementById("musicGenre").value,
        tempoDuracao: parseInt(document.getElementById("musicTime").value) || 0,
        artista: "Vários", 
        anoLancamento: 2024,
        album: { id: parseInt(albumId) } 
    };

    const endpoint = id ? `/musica/${id}` : "/musica";
    const method = id ? "PUT" : "POST";
    const result = await apiRequest(endpoint, method, musicData);

    if (result) {
        modalMusic.classList.remove("show");
        fetchSongs();
    }
}

window.editMusic = async (id) => {
    const song = await apiRequest(`/musica/${id}`);
    if (song) {
        document.getElementById("musicId").value = song.id;
        document.getElementById("musicName").value = song.tituloMusica;
        document.getElementById("musicGenre").value = song.genero;
        document.getElementById("musicTime").value = song.tempoDuracao;
        if(song.album) musicAlbumSelect.value = song.album.id;

        document.getElementById("modalMusicTitle").innerText = "Editar Música";
        openModal(modalMusic);
    }
};

window.deleteMusic = async (id) => {
    if(confirm("Excluir música?")) {
        await apiRequest(`/musica/${id}`, "DELETE");
        fetchSongs();
    }
};

// --- NAVEGAÇÃO E EVENTOS ---

function setupEventListeners() {
    // Abrir modais
    document.getElementById("btnAddAlbum").onclick = () => {
        formAlbum.reset();
        document.getElementById("albumId").value = "";
        document.getElementById("modalAlbumTitle").innerText = "Criar Álbum";
        openModal(modalAlbum);
    };

    document.getElementById("btnAddMusic").onclick = () => {
        formMusic.reset();
        document.getElementById("musicId").value = "";
        document.getElementById("modalMusicTitle").innerText = "Adicionar Música";
        openModal(modalMusic);
    };

    // Fechar modais
    document.querySelectorAll(".close, .btn-cancel").forEach(el => {
        el.onclick = () => {
            modalAlbum.classList.remove("show");
            modalMusic.classList.remove("show");
        };
    });

    document.getElementById("btnBackAlbums").onclick = showMainPage;

    // Busca (Filtro Visual)
    searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll(".album-card");
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(term) ? "block" : "none";
        });
    });

    formAlbum.addEventListener("submit", handleAlbumSubmit);
    formMusic.addEventListener("submit", handleMusicSubmit);
}

function openModal(modal) { modal.classList.add("show"); }

function showMainPage() {
    albumPage.style.display = "none";
    mainPage.style.display = "block";
    fetchAlbums();
    fetchSongs();
}

function openAlbumPage(album) {
    mainPage.style.display = "none";
    albumPage.style.display = "block";
    document.getElementById("viewAlbumName").textContent = album.nomeAlbum;
    document.getElementById("viewAlbumArtist").textContent = album.artistaResponsavel;
    loadAlbumSongs(album.id); 
}

async function loadAlbumSongs(albumId) {
    const allSongs = await apiRequest("/musica");
    if(allSongs) {
        const albumSongs = allSongs.filter(s => s.album && s.album.id === albumId);
        renderSongs(albumSongs, document.getElementById("albumSongs"));
    }
}