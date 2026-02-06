const API_URL = "http://localhost:8080"; 
let currentAlbums = []; 

<<<<<<< Updated upstream
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
=======
// --- ELEMENTOS DO DOM ---
const modalAlbum = document.getElementById("modalAlbum");
const modalMusic = document.getElementById("modalMusic");
const formAlbum = document.getElementById("formAlbum");
const formMusic = document.getElementById("formMusic");

const albumListDiv = document.getElementById("albumList");
const allSongsListDiv = document.getElementById("allSongsList");
const albumPage = document.getElementById("albumPage");
const mainPage = document.getElementById("mainPage");

// Select do álbum dentro do modal de música
const musicAlbumSelect = document.getElementById("musicAlbum");
>>>>>>> Stashed changes

document.addEventListener("DOMContentLoaded", () => {
    loadInitialData();
    setupEventListeners();
});

<<<<<<< Updated upstream
async function loadInitialData() {
    await fetchAlbums();
    await fetchAllSongs();
}

=======
// --- FUNÇÃO DE COMUNICAÇÃO (FETCH) ---
>>>>>>> Stashed changes
async function apiRequest(endpoint, method = "GET", body = null) {
    try {
        const options = {
            method,
            headers: { "Content-Type": "application/json" }
        };
        if (body) options.body = JSON.stringify(body);
        const response = await fetch(`${API_URL}${endpoint}`, options);
<<<<<<< Updated upstream
        if (!response.ok) throw new Error(await response.text() || `Erro ${response.status}`);
        const text = await response.text();
        return text ? JSON.parse(text) : null;
=======
        
        // Se a resposta não for OK (ex: 400, 500), lança erro
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Erro API [${method} ${endpoint}]:`, response.status, errorText);
            alert(`Erro ao salvar! \nO servidor respondeu: ${response.status}\nDetalhes: ${errorText}`);
            return null;
        }
        
        // Tenta ler o JSON, se for vazio retorna null
        const text = await response.text();
        return text ? JSON.parse(text) : {};

>>>>>>> Stashed changes
    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Erro de conexão! Verifique se o Backend (Java) está rodando.");
        return null;
    }
}

<<<<<<< Updated upstream
function formatTime(seconds) {
    if (!seconds && seconds !== 0) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

=======
// --- CARREGAR DADOS ---
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
function renderAlbums(albums) {
    refs.albumListDiv.innerHTML = "";
    albums.forEach(album => {
        const card = document.createElement("div");
        card.className = "album-card";
        card.dataset.search = `${album.nomeAlbum} ${album.artistaResponsavel}`.toLowerCase();
        const capa = album.urlCapa || "https://via.placeholder.com/150/222/fff?text=ALBUM";
        
=======
// --- RENDERIZAR NA TELA ---
function renderAlbums(albums) {
    albumListDiv.innerHTML = "";
    
    // Limpa e popula o SELECT de álbuns no modal de música
    musicAlbumSelect.innerHTML = "<option value=''>Selecione um álbum...</option>";

    if (!Array.isArray(albums)) return; 

    albums.forEach(album => {
        // 1. Adiciona opção no select do modal
        const option = document.createElement("option");
        option.value = album.id;
        option.textContent = album.nomeAlbum;
        musicAlbumSelect.appendChild(option);

        // 2. Cria o card visual do álbum
        const card = document.createElement("div");
        card.className = "album-card";
        
        const cover = album.urlCapa ? album.urlCapa : 'https://via.placeholder.com/200/333/fff?text=No+Cover';

>>>>>>> Stashed changes
        card.innerHTML = `
            <div class="album-options">
                <button class="btn-icon" onclick="event.stopPropagation(); editAlbum(${album.id})">✎</button>
                <button class="btn-icon" onclick="event.stopPropagation(); deleteAlbum(${album.id})">✕</button>
            </div>
<<<<<<< Updated upstream
            <img src="${capa}" class="album-cover">
=======
            <img src="${cover}" class="album-cover" onerror="this.src='https://via.placeholder.com/200/333/fff?text=Erro'">
>>>>>>> Stashed changes
            <div class="album-info">
                <h3>${album.nomeAlbum}</h3>
                <p>${album.artistaResponsavel}</p>
            </div>
        `;
<<<<<<< Updated upstream
        card.onclick = () => openAlbumPage(album.id);
        refs.albumListDiv.appendChild(card);
=======
        
        // Clique no card abre a página do álbum (exceto se clicar nos botões)
        card.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON") openAlbumPage(album);
        });
        
        albumListDiv.appendChild(card);
>>>>>>> Stashed changes
    });
}

function renderSongs(songs, targetDiv) {
    targetDiv.innerHTML = "";
<<<<<<< Updated upstream
    songs.forEach((song, index) => {
        const row = document.createElement("div");
        row.className = "song-row";
        
        const nomeMusica = song.tituloMusica || "Sem Título";
        const genero = song.genero || "";
        const duracao = formatTime(song.tempoDuracao);
        const nomeAlbum = (song.album && song.album.nomeAlbum) ? song.album.nomeAlbum : "Single";
        const capaAlbum = (song.album && song.album.urlCapa) ? song.album.urlCapa : "https://via.placeholder.com/60"; 

        row.dataset.search = `${nomeMusica} ${genero} ${nomeAlbum}`.toLowerCase();

        row.innerHTML = `
            <div class="song-left">
                <div class="song-index">${index + 1}</div>
                <img src="${capaAlbum}" class="song-cover-square">
                <div class="song-info">
                    <p class="song-name">${nomeMusica}</p>
                    <p class="song-meta">${genero} • ${nomeAlbum}</p>
                </div>
            </div>
            <div class="song-actions">
                <span class="song-time">${duracao}</span>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editMusic(${song.id})">Editar</button>
                    <button class="btn-delete" onclick="deleteMusic(${song.id})">Excluir</button>
                </div>
=======
    if(!songs || songs.length === 0) {
        targetDiv.innerHTML = "<p style='padding: 20px; color: gray;'>Nenhuma música encontrada.</p>";
        return;
    }

    songs.forEach(song => {
        const row = document.createElement("div");
        row.className = "song-row";
        
        let cover = 'https://via.placeholder.com/40/333/fff?text=M';
        let artistName = song.artista || 'Artista Desconhecido';
        
        // Verifica se tem álbum vinculado para pegar a capa e o artista
        if (song.album) {
            if(song.album.urlCapa) cover = song.album.urlCapa;
            if(song.album.artistaResponsavel) artistName = song.album.artistaResponsavel;
        }
        
        row.innerHTML = `
            <div class="song-left">
                <img src="${cover}" class="song-cover" onerror="this.src='https://via.placeholder.com/40'">
                <div class="song-info">
                    <p class="song-name">${song.tituloMusica}</p>
                    <p class="song-genre">${song.genero} • ${artistName}</p>
                </div>
            </div>
            <div class="song-actions">
                <span>${song.tempoDuracao} seg</span>
                <button class="btn-small" onclick="editMusic(${song.id})">Editar</button>
                <button class="btn-small btn-delete" onclick="deleteMusic(${song.id})">✕</button>
>>>>>>> Stashed changes
            </div>
        `;
        targetDiv.appendChild(row);
    });
}

<<<<<<< Updated upstream
function setupEventListeners() {
    document.getElementById("btnBackAlbums").onclick = () => {
        refs.albumPage.style.display = "none";
        refs.mainPage.style.display = "block";
        fetchAlbums(); fetchAllSongs();
    };

    refs.searchInput.oninput = (e) => {
        const term = e.target.value.toLowerCase().trim();
        document.querySelectorAll(".album-card").forEach(card => card.style.display = card.dataset.search.includes(term) ? "block" : "none");
        document.querySelectorAll(".song-row").forEach(row => row.style.display = row.dataset.search.includes(term) ? "flex" : "none");
    };

    document.getElementById("btnAddAlbum").onclick = () => openModal(refs.modalAlbum, "Criar Álbum");
    document.getElementById("btnAddMusic").onclick = () => {
        if(refs.albumPage.style.display === "block") refs.musicAlbumSelect.value = refs.viewAlbumName.dataset.currentId;
        openModal(refs.modalMusic, "Adicionar Música");
    };
    document.querySelectorAll(".close, .btn-cancel").forEach(b => b.onclick = () => closeModal());
}

function openAlbumPage(albumId) {
    const album = currentAlbums.find(a => a.id === albumId);
    if (!album) return;
    refs.mainPage.style.display = "none";
    refs.albumPage.style.display = "block";
    refs.viewAlbumName.textContent = album.nomeAlbum;
    refs.viewAlbumName.dataset.currentId = album.id;
    refs.viewAlbumArtist.textContent = album.artistaResponsavel;
    renderSongs(album.musicas || [], refs.albumSongsDiv);
    refs.viewTotalSongs.textContent = `${(album.musicas || []).length} músicas`;
}

function openModal(modal, title) { 
    modal.querySelector("h3").innerText = title;
    modal.style.display = "flex"; 
}
function closeModal() { 
    refs.modalAlbum.style.display = "none"; 
    refs.modalMusic.style.display = "none"; 
    refs.formAlbum.reset(); refs.formMusic.reset();
    document.getElementById("albumId").value = "";
    document.getElementById("musicId").value = "";
}

async function editAlbum(id) {
    const album = currentAlbums.find(a => a.id === id);
    if(album) {
=======
// --- LOGICA DE SALVAR ÁLBUM ---
async function handleAlbumSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("albumId").value;
    
    const albumData = {
        nomeAlbum: document.getElementById("albumName").value,
        artistaResponsavel: document.getElementById("albumArtist").value,
        urlCapa: document.getElementById("albumCover").value
    };

    const method = id ? "PUT" : "POST";
    const endpoint = id ? `/album/${id}` : "/album";
    
    const result = await apiRequest(endpoint, method, albumData);
    if (result) {
        closeModals();
        fetchAlbums(); // Atualiza a lista
    }
}

// --- LOGICA DE SALVAR MÚSICA (CORRIGIDA) ---
async function handleMusicSubmit(e) {
    e.preventDefault();

    // 1. Pega IDs e valores
    const id = document.getElementById("musicId").value;
    const albumId = document.getElementById("musicAlbum").value;
    const nome = document.getElementById("musicName").value;
    const genero = document.getElementById("musicGenre").value;
    const duracao = document.getElementById("musicTime").value;

    // 2. Validação básica
    if (!albumId) {
        alert("Por favor, selecione um álbum!");
        return;
    }

    // 3. Monta o objeto (Ajustado para o Java)
    const musicData = {
        tituloMusica: nome,
        genero: genero, // Deve ser igual ao Enum (ex: HIP_HOP)
        tempoDuracao: parseInt(duracao) || 0,
        anoLancamento: 2025,
        album: { id: parseInt(albumId) } // Envia objeto album com ID
    };

    console.log("Enviando música:", musicData); // Para debug

    const method = id ? "PUT" : "POST";
    const endpoint = id ? `/musica/${id}` : "/musica";

    const result = await apiRequest(endpoint, method, musicData);
    
    if (result) {
        closeModals();
        fetchSongs(); // Atualiza lista geral
        
        // Se estiver dentro da página do álbum, atualiza ela também
        if(albumPage.style.display === "block") {
            loadAlbumSongs(albumId);
        }
    }
}

// --- FUNÇÕES DE NAVEGAÇÃO E MODAIS ---

// Abrir modal de edição de Álbum
window.editAlbum = async (id, e) => {
    if(e) e.stopPropagation();
    const album = await apiRequest(`/album/${id}`);
    if (album) {
>>>>>>> Stashed changes
        document.getElementById("albumId").value = album.id;
        document.getElementById("albumName").value = album.nomeAlbum;
        document.getElementById("albumArtist").value = album.artistaResponsavel;
        document.getElementById("albumCover").value = album.urlCapa;
<<<<<<< Updated upstream
        openModal(refs.modalAlbum, "Editar Álbum");
    }
}

async function editMusic(id) {
    const songs = await apiRequest("/musica");
    const song = songs.find(s => s.id === id);
    if(song) {
=======
        openModal(modalAlbum);
    }
};

// Abrir modal de edição de Música
window.editMusic = async (id) => {
    const song = await apiRequest(`/musica/${id}`);
    if (song) {
>>>>>>> Stashed changes
        document.getElementById("musicId").value = song.id;
        document.getElementById("musicName").value = song.tituloMusica;
        document.getElementById("musicGenre").value = song.genero; // O select deve ter o value igual
        document.getElementById("musicTime").value = song.tempoDuracao;
<<<<<<< Updated upstream
        refs.musicAlbumSelect.value = song.album ? song.album.id : "";
        openModal(refs.modalMusic, "Editar Música");
=======
        
        // Seleciona o álbum correto no dropdown
        if(song.album) {
            musicAlbumSelect.value = song.album.id;
        }
        
        openModal(modalMusic);
>>>>>>> Stashed changes
    }
}

async function deleteAlbum(id) {
    if(confirm("Excluir álbum?")) { await apiRequest(`/album/${id}`, "DELETE"); fetchAlbums(); fetchAllSongs(); }
}

async function deleteMusic(id) {
    if(confirm("Excluir música?")) { await apiRequest(`/musica/${id}`, "DELETE"); fetchAllSongs(); if(refs.albumPage.style.display === "block") openAlbumPage(parseInt(refs.viewAlbumName.dataset.currentId)); }
}

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

<<<<<<< Updated upstream
refs.formMusic.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById("musicId").value;
    const payload = {
        tituloMusica: document.getElementById("musicName").value,
        genero: document.getElementById("musicGenre").value,
        tempoDuracao: parseInt(document.getElementById("musicTime").value),
        album: { id: parseInt(refs.musicAlbumSelect.value) }
    };
    await apiRequest(id ? `/musica/${id}` : "/musica", id ? "PUT" : "POST", payload);
    closeModal(); fetchAllSongs();
};

function updateAlbumSelect() {
    refs.musicAlbumSelect.innerHTML = '<option value="">Selecione...</option>';
    currentAlbums.forEach(a => { refs.musicAlbumSelect.innerHTML += `<option value="${a.id}">${a.nomeAlbum}</option>`; });
=======
// Deletar Álbum
window.deleteAlbum = async (id, e) => { 
    e.stopPropagation(); 
    if(confirm("Tem certeza? Isso apagará o álbum e todas as suas músicas.")) { 
        await apiRequest(`/album/${id}`, "DELETE"); 
        fetchAlbums(); 
        fetchSongs(); 
        if(albumPage.style.display === "block") showMainPage();
    } 
};

// Deletar Música
window.deleteMusic = async (id) => { 
    if(confirm("Deseja realmente excluir esta música?")) { 
        await apiRequest(`/musica/${id}`, "DELETE"); 
        fetchSongs(); 
        
        // Se estiver na página de detalhes, atualiza só a lista local
        if(albumPage.style.display === "block") {
             // Precisamos descobrir o ID do álbum atual para recarregar
             // Hack rápido: pegamos do título ou recarregamos a página
             const currentAlbumName = document.getElementById("viewAlbumName").textContent;
             // Como não temos o ID fácil, vamos apenas remover a linha visualmente 
             // ou recarregar a lista geral.
             // O ideal é passar o ID do album na função, mas vamos simplificar:
             const backBtn = document.getElementById("btnBackAlbums");
             if(backBtn) backBtn.click(); // Volta pra home para evitar erro
        }
    } 
};

// Abrir página de detalhes do álbum
function openAlbumPage(album) {
    mainPage.style.display = "none";
    albumPage.style.display = "block";
    document.getElementById("viewAlbumName").textContent = album.nomeAlbum;
    document.getElementById("viewAlbumArtist").textContent = album.artistaResponsavel;
    loadAlbumSongs(album.id);
}

// Carregar músicas de um álbum específico
async function loadAlbumSongs(albumId) {
    const allSongs = await apiRequest("/musica");
    if(allSongs && Array.isArray(allSongs)) {
        const albumSongs = allSongs.filter(s => s.album && Number(s.album.id) === Number(albumId));
        renderSongs(albumSongs, document.getElementById("albumSongs"));
    }
}

// Voltar para Home
function showMainPage() { 
    albumPage.style.display = "none"; 
    mainPage.style.display = "block"; 
    fetchAlbums(); 
    fetchSongs();
}

// Controle dos Modais
function openModal(modal) { modal.classList.add("show"); }

function closeModals() { 
    modalAlbum.classList.remove("show"); 
    modalMusic.classList.remove("show"); 
}

// Setup dos botões
function setupEventListeners() {
    // Botão criar Álbum
    document.getElementById("btnAddAlbum").onclick = () => { 
        formAlbum.reset(); 
        document.getElementById("albumId").value = ""; 
        openModal(modalAlbum); 
    };

    // Botão criar Música
    document.getElementById("btnAddMusic").onclick = () => { 
        formMusic.reset(); 
        document.getElementById("musicId").value = ""; 
        openModal(modalMusic); 
    };
    
    // Botões de fechar (X e Cancelar)
    document.querySelectorAll(".close, .btn-cancel").forEach(el => el.onclick = closeModals);
    
    // Botão voltar da página de álbum
    document.getElementById("btnBackAlbums").onclick = showMainPage;
    
    // Submits dos formulários
    formAlbum.addEventListener("submit", handleAlbumSubmit);
    formMusic.addEventListener("submit", handleMusicSubmit);
>>>>>>> Stashed changes
}