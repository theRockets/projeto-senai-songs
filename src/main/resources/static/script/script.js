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

// --- REQUISIÇÕES API (AJAX/FETCH) ---

// Função genérica para chamar o Backend
async function apiRequest(endpoint, method = "GET", body = null) {
    try {
        const options = {
            method: method,
            headers: { "Content-Type": "application/json" }
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(`${API_URL}${endpoint}`, options);

        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
        
        // Retorna JSON se houver conteúdo, senão null
        const text = await response.text();
        return text ? JSON.parse(text) : null;

    } catch (error) {
        console.error("Erro API:", error);
        alert("Erro ao conectar com o servidor. Verifique se o Spring Boot está rodando.");
        return null;
    }
}

// 1. Carregar Álbuns
async function fetchAlbums() {
    const albums = await apiRequest("/albums"); // GET /albums
    if (albums) renderAlbums(albums);
}

// 2. Carregar Músicas
async function fetchSongs() {
    const songs = await apiRequest("/musics"); // GET /musics
    if (songs) renderSongs(songs);
}

// --- RENDERIZAÇÃO NA TELA ---

function renderAlbums(albums) {
    albumListDiv.innerHTML = "";
    musicAlbumSelect.innerHTML = "<option value=''>Selecione um álbum</option>";

    albums.forEach(album => {
        // Popula o select do modal de música
        const option = document.createElement("option");
        option.value = album.id;
        option.textContent = album.name;
        musicAlbumSelect.appendChild(option);

        // Cria o card do álbum
        const card = document.createElement("div");
        card.className = "album-card";
        card.innerHTML = `
            <div class="album-options">
                <button class="btn-icon" onclick="editAlbum(${album.id}, event)">✎</button>
                <button class="btn-icon" onclick="deleteAlbum(${album.id}, event)">✕</button>
            </div>
            <img src="${album.coverUrl || 'img/default-cover.png'}" class="album-cover" alt="Capa">
            <div class="album-info">
                <h3>${album.name}</h3>
                <p>${album.artist} • ${album.year || ''}</p>
            </div>
        `;
        // Ao clicar no card (fora dos botões), abre detalhes
        card.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON") openAlbumPage(album);
        });

        albumListDiv.appendChild(card);
    });
}

function renderSongs(songs, targetDiv = allSongsListDiv) {
    targetDiv.innerHTML = "";
    
    if(songs.length === 0) {
        targetDiv.innerHTML = "<p style='text-align:center; color:#666;'>Nenhuma música encontrada.</p>";
        return;
    }

    songs.forEach(song => {
        const row = document.createElement("div");
        row.className = "song-row";
        
        // Tenta pegar a capa do álbum associado, se disponível no objeto song
        const cover = song.album && song.album.coverUrl ? song.album.coverUrl : 'img/default-music.png';
        const albumName = song.album ? song.album.name : 'Single';

        row.innerHTML = `
            <div class="song-left">
                <img src="${cover}" class="song-cover">
                <div class="song-info">
                    <p class="song-name">${song.name}</p>
                    <p class="song-genre">${song.genre} • ${albumName}</p>
                </div>
            </div>
            <div class="song-actions">
                <span style="font-size:12px; color:#aaa; margin-right:10px;">${song.duration || '--:--'}</span>
                <button class="btn-small" onclick="editMusic(${song.id})">Editar</button>
                <button class="btn-small btn-delete" onclick="deleteMusic(${song.id})">Excluir</button>
            </div>
        `;
        targetDiv.appendChild(row);
    });
}

// --- FUNÇÕES DE NAVEGAÇÃO ---

function showMainPage() {
    albumPage.style.display = "none";
    mainPage.style.display = "block";
    fetchAlbums(); // Recarrega dados
    fetchSongs();
}

function openAlbumPage(album) {
    mainPage.style.display = "none";
    albumPage.style.display = "block";

    // Preenche cabeçalho
    document.getElementById("viewAlbumName").textContent = album.name;
    document.getElementById("viewAlbumArtist").textContent = album.artist;
    document.getElementById("viewAlbumYear").textContent = album.year || "N/A";

    // Configura botão "Adicionar música neste álbum" para abrir modal já com o ID
    const btnInside = document.getElementById("btnAddMusicInside");
    btnInside.onclick = () => {
        openModal(modalMusic);
        document.getElementById("formMusic").reset();
        document.getElementById("musicId").value = "";
        musicAlbumSelect.value = album.id; // Pré-seleciona
    };

    // Carrega músicas deste álbum específico
    // Assumindo endpoint: GET /albums/{id}/musics OU filtrar no front
    loadAlbumSongs(album.id); 
}

async function loadAlbumSongs(albumId) {
    // Opção 1: Backend filtra (Ideal) -> apiRequest(`/musics?albumId=${albumId}`)
    // Opção 2: Front filtra (Usado aqui para garantir funcionamento simples)
    const allSongs = await apiRequest("/musics");
    if(allSongs) {
        // Filtra músicas onde o ID do álbum bate (ajuste conforme seu JSON de retorno)
        const albumSongs = allSongs.filter(s => s.album && s.album.id === albumId);
        renderSongs(albumSongs, document.getElementById("albumSongs"));
    }
}

// --- MODAIS ---

function setupEventListeners() {
    // Abrir modais
    document.getElementById("btnAddAlbum").onclick = () => {
        document.getElementById("formAlbum").reset();
        document.getElementById("albumId").value = ""; // Limpa ID para criar novo
        document.getElementById("modalAlbumTitle").innerText = "Criar Álbum";
        openModal(modalAlbum);
    };

    document.getElementById("btnAddMusic").onclick = () => {
        document.getElementById("formMusic").reset();
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

    // Botão Voltar
    document.getElementById("btnBackAlbums").onclick = showMainPage;

    // Pesquisa
    searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        // Filtra visualmente os cards (melhoria: fazer busca no backend)
        const cards = document.querySelectorAll(".album-card");
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(term) ? "block" : "none";
        });
    });

    // Submit Forms
    formAlbum.addEventListener("submit", handleAlbumSubmit);
    formMusic.addEventListener("submit", handleMusicSubmit);
}

function openModal(modal) {
    modal.classList.add("show");
}

// --- CRUD: ÁLBUNS ---

async function handleAlbumSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("albumId").value;
    const albumData = {
        name: document.getElementById("albumName").value,
        artist: document.getElementById("albumArtist").value,
        year: document.getElementById("albumYear").value,
        coverUrl: document.getElementById("albumCover").value
    };

    let result;
    if (id) {
        // Editar (PUT)
        result = await apiRequest(`/albums/${id}`, "PUT", albumData);
    } else {
        // Criar (POST)
        result = await apiRequest("/albums", "POST", albumData);
    }

    if (result) {
        modalAlbum.classList.remove("show");
        fetchAlbums(); // Atualiza lista
    }
}

window.deleteAlbum = async function(id, event) {
    if(event) event.stopPropagation(); // Evita abrir o álbum ao clicar em excluir
    if (confirm("Tem certeza que deseja excluir este álbum?")) {
        await apiRequest(`/albums/${id}`, "DELETE");
        fetchAlbums();
    }
};

window.editAlbum = async function(id, event) {
    if(event) event.stopPropagation();
    
    // Busca dados atuais (ou pega do DOM/Array local)
    // Aqui farei um fetch para garantir dados frescos
    const album = await apiRequest(`/albums/${id}`);
    
    if (album) {
        document.getElementById("albumId").value = album.id;
        document.getElementById("albumName").value = album.name;
        document.getElementById("albumArtist").value = album.artist;
        document.getElementById("albumYear").value = album.year;
        document.getElementById("albumCover").value = album.coverUrl;
        
        document.getElementById("modalAlbumTitle").innerText = "Editar Álbum";
        openModal(modalAlbum);
    }
};

// --- CRUD: MÚSICAS ---

async function handleMusicSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("musicId").value;
    const albumId = document.getElementById("musicAlbum").value;
    
    const musicData = {
        name: document.getElementById("musicName").value,
        genre: document.getElementById("musicGenre").value,
        duration: document.getElementById("musicTime").value,
        // Backend Spring geralmente espera o objeto Album ou o ID
        album: { id: albumId } 
    };

    let result;
    if (id) {
        result = await apiRequest(`/musics/${id}`, "PUT", musicData);
    } else {
        result = await apiRequest("/musics", "POST", musicData);
    }

    if (result) {
        modalMusic.classList.remove("show");
        fetchSongs(); // Atualiza lista geral
        if(albumPage.style.display === 'block') loadAlbumSongs(albumId); // Atualiza página interna se aberta
    }
}

window.deleteMusic = async function(id) {
    if (confirm("Excluir esta música?")) {
        await apiRequest(`/musics/${id}`, "DELETE");
        fetchSongs();
        // Se estiver dentro da página de um álbum, recarrega a lista dele também
        // (Lógica simplificada: recarrega main page e se tiver album ID salvo, recarrega ele)
    }
};

window.editMusic = async function(id) {
    const song = await apiRequest(`/musics/${id}`);
    if (song) {
        document.getElementById("musicId").value = song.id;
        document.getElementById("musicName").value = song.name;
        document.getElementById("musicGenre").value = song.genre;
        document.getElementById("musicTime").value = song.duration;
        if(song.album) document.getElementById("musicAlbum").value = song.album.id;

        document.getElementById("modalMusicTitle").innerText = "Editar Música";
        openModal(modalMusic);
    }
};