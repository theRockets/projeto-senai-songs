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
        if (!response.ok) throw new Error(await response.text() || `Erro ${response.status}`);
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error("Erro API:", error);
        return null;
    }
}

function formatTime(seconds) {
    if (!seconds && seconds !== 0) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

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
        const capa = album.urlCapa || "https://via.placeholder.com/150/222/fff?text=ALBUM";
        
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

function renderSongs(songs, targetDiv) {
    targetDiv.innerHTML = "";
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
            </div>
        `;
        targetDiv.appendChild(row);
    });
}

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
        document.getElementById("albumId").value = album.id;
        document.getElementById("albumName").value = album.nomeAlbum;
        document.getElementById("albumArtist").value = album.artistaResponsavel;
        document.getElementById("albumCover").value = album.urlCapa;
        openModal(refs.modalAlbum, "Editar Álbum");
    }
}

async function editMusic(id) {
    const songs = await apiRequest("/musica");
    const song = songs.find(s => s.id === id);
    if(song) {
        document.getElementById("musicId").value = song.id;
        document.getElementById("musicName").value = song.tituloMusica;
        document.getElementById("musicGenre").value = song.genero;
        document.getElementById("musicTime").value = song.tempoDuracao;
        refs.musicAlbumSelect.value = song.album ? song.album.id : "";
        openModal(refs.modalMusic, "Editar Música");
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
}