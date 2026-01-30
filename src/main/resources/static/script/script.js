// ==========================================
// CONFIGURAÇÕES E ESTADO GLOBAL
// ==========================================
const API_URL = "http://localhost:8080"; 
let currentAlbums = []; // Armazena os álbuns na memória para acesso rápido

// ==========================================
// ELEMENTOS DO DOM
// ==========================================
const refs = {
    modalAlbum: document.getElementById("modalAlbum"),
    modalMusic: document.getElementById("modalMusic"),
    formAlbum: document.getElementById("formAlbum"),
    formMusic: document.getElementById("formMusic"),
    albumListDiv: document.getElementById("albumList"),
    allSongsListDiv: document.getElementById("allSongsList"),
    albumPage: document.getElementById("albumPage"),
    mainPage: document.getElementById("mainPage"), // Container da lista de álbuns
    searchInput: document.getElementById("searchInput"),
    musicAlbumSelect: document.getElementById("musicAlbum"),
    // Textos da página do álbum interno
    viewAlbumName: document.getElementById("viewAlbumName"),
    viewAlbumArtist: document.getElementById("viewAlbumArtist"),
    viewTotalSongs: document.getElementById("viewTotalSongs"),
    albumSongsDiv: document.getElementById("albumSongs")
};

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    loadInitialData();
    setupEventListeners();
});

async function loadInitialData() {
    await fetchAlbums();
    await fetchAllSongs();
}

// ==========================================
// FUNÇÕES AUXILIARES (API & FORMATAÇÃO)
// ==========================================

// Função Genérica para chamadas API
async function apiRequest(endpoint, method = "GET", body = null) {
    try {
        const options = {
            method: method,
            headers: { "Content-Type": "application/json" }
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(`${API_URL}${endpoint}`, options);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Erro ${response.status}`);
        }
        
        // Tenta ler JSON, se falhar (ex: delete retorna vazio), retorna null
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error("Erro API:", error);
        alert("Erro na operação: " + error.message);
        return null;
    }
}

// Converte segundos (ex: 130) para "2:10"
function formatTime(seconds) {
    if (!seconds && seconds !== 0) return "--:--";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// ==========================================
// CARREGAMENTO E RENDERIZAÇÃO
// ==========================================

async function fetchAlbums() {
    const data = await apiRequest("/album");
    if (data) {
        currentAlbums = Array.isArray(data) ? data : [];
        renderAlbums(currentAlbums);
        updateAlbumSelect();
    }
}

async function fetchAllSongs() {
    const data = await apiRequest("/musica");
    if (data) {
        renderSongs(data, refs.allSongsListDiv);
    }
}

// Renderiza os Cards dos Álbuns
function renderAlbums(albums) {
    refs.albumListDiv.innerHTML = "";
    
    if (albums.length === 0) {
        refs.albumListDiv.innerHTML = "<p style='color:#ccc; padding:20px'>Nenhum álbum cadastrado.</p>";
        return;
    }

    albums.forEach(album => {
        const card = document.createElement("div");
        card.className = "album-card";
        
        // Capa com fallback caso venha vazia
        const capa = album.urlCapa || "https://via.placeholder.com/150?text=Album";

        card.innerHTML = `
            <div class="album-options">
                <button class="btn-icon" data-action="edit" data-id="${album.id}">✎</button>
                <button class="btn-icon" data-action="delete" data-id="${album.id}">✕</button>
            </div>
            <img src="${capa}" class="album-cover">
            <div class="album-info">
                <h3>${album.nomeAlbum}</h3>
                <p>${album.artistaResponsavel}</p>
            </div>
        `;

        // Evento de clique no card (exceto botões)
        card.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON") openAlbumPage(album.id);
            // Delegação de eventos para os botões
            if (e.target.dataset.action === "edit") editAlbum(album.id);
            if (e.target.dataset.action === "delete") deleteAlbum(album.id);
        });

        refs.albumListDiv.appendChild(card);
    });
}

// Renderiza lista de músicas (genérica: serve para 'Todas' e para 'Álbum Específico')
function renderSongs(songs, targetDiv) {
    targetDiv.innerHTML = "";
    
    if (!songs || songs.length === 0) {
        targetDiv.innerHTML = "<p style='padding:15px; color:#888;'>Nenhuma música encontrada.</p>";
        return;
    }

    songs.forEach((song, index) => {
        const row = document.createElement("div");
        row.className = "song-row";
        
        // Proteção contra dados nulos
        const nomeMusica = song.tituloMusica || "Sem Título";
        const genero = song.genero || "-";
        const duracao = formatTime(song.tempoDuracao);
        const nomeAlbum = song.album ? song.album.nomeAlbum : "Single";
        const capaAlbum = song.album && song.album.urlCapa ? song.album.urlCapa : "https://via.placeholder.com/40";

        row.innerHTML = `
            <div class="song-left">
                <div class="song-index">${index + 1}</div>
                <img src="${capaAlbum}" class="song-cover" style="width:40px; height:40px; border-radius:4px; object-fit:cover; margin-right:10px;">
                <div class="song-info">
                    <p class="song-name">${nomeMusica}</p>
                    <p class="song-genre">${genero} • ${nomeAlbum}</p>
                </div>
            </div>
            <div class="song-actions">
                <span style="font-size:12px; color:#aaa; margin-right:10px;">${duracao}</span>
                <button class="btn-small" onclick="editMusic(${song.id})">Editar</button>
                <button class="btn-small btn-delete" onclick="deleteMusic(${song.id})">Excluir</button>
            </div>
        `;
        targetDiv.appendChild(row);
    });
}

// Atualiza o <select> do modal de música com os álbuns atuais
function updateAlbumSelect() {
    refs.musicAlbumSelect.innerHTML = "<option value=''>Selecione um álbum</option>";
    currentAlbums.forEach(alb => {
        const opt = document.createElement("option");
        opt.value = alb.id;
        opt.textContent = alb.nomeAlbum;
        refs.musicAlbumSelect.appendChild(opt);
    });
}

// ==========================================
// LÓGICA DE PÁGINAS (NAVEGAÇÃO)
// ==========================================

function openAlbumPage(albumId) {
    // Busca o álbum na memória (pois carregamos EAGER no Java)
    const album = currentAlbums.find(a => a.id === albumId);
    if (!album) return;

    // Troca a visualização
    refs.mainPage.style.display = "none";
    refs.albumPage.style.display = "block";

    // Preenche cabeçalho
    refs.viewAlbumName.textContent = album.nomeAlbum;
    refs.viewAlbumName.dataset.currentId = album.id; // Salva ID para uso posterior
    refs.viewAlbumArtist.textContent = album.artistaResponsavel;
    
    // Lista de músicas (Vem direto do objeto álbum)
    const songs = album.musicas || [];
    refs.viewTotalSongs.textContent = `${songs.length} músicas`;
    
    renderSongs(songs, refs.albumSongsDiv);
}

function showMainPage() {
    refs.albumPage.style.display = "none";
    refs.mainPage.style.display = "block"; // Ou 'grid', dependendo do seu CSS
    fetchAlbums(); // Recarrega para garantir dados frescos
    fetchAllSongs();
}

// ==========================================
// CRUD - ÁLBUNS
// ==========================================

refs.formAlbum.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("albumId").value;
    
    const payload = {
        nomeAlbum: document.getElementById("albumName").value,
        artistaResponsavel: document.getElementById("albumArtist").value,
        urlCapa: document.getElementById("albumCover").value
    };

    const url = id ? `/album/${id}` : "/album";
    const method = id ? "PUT" : "POST";

    const res = await apiRequest(url, method, payload);
    if (res) {
        closeModal(refs.modalAlbum);
        fetchAlbums();
    }
});

window.editAlbum = (id) => {
    const album = currentAlbums.find(a => a.id === id);
    if (album) {
        document.getElementById("albumId").value = album.id;
        document.getElementById("albumName").value = album.nomeAlbum;
        document.getElementById("albumArtist").value = album.artistaResponsavel;
        document.getElementById("albumCover").value = album.urlCapa;
        
        document.getElementById("modalAlbumTitle").innerText = "Editar Álbum";
        openModal(refs.modalAlbum);
    }
};

window.deleteAlbum = async (id) => {
    if (confirm("ATENÇÃO: Excluir este álbum apagará todas as músicas dele. Continuar?")) {
        await apiRequest(`/album/${id}`, "DELETE");
        fetchAlbums();
        fetchAllSongs();
    }
};

// ==========================================
// CRUD - MÚSICAS
// ==========================================

refs.formMusic.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("musicId").value;
    const albumId = refs.musicAlbumSelect.value;

    if (!albumId) { alert("Selecione um álbum!"); return; }

    const payload = {
        tituloMusica: document.getElementById("musicName").value,
        genero: document.getElementById("musicGenre").value,
        tempoDuracao: parseInt(document.getElementById("musicTime").value) || 0,
        // Campos fixos ou opcionais (ajuste conforme seu HTML tiver esses inputs ou não)
        artista: "Vários", 
        anoLancamento: 2024,
        linkMusica: "",
        album: { id: parseInt(albumId) } // Relacionamento JPA
    };

    const url = id ? `/musica/${id}` : "/musica";
    const method = id ? "PUT" : "POST";

    const res = await apiRequest(url, method, payload);
    if (res) {
        closeModal(refs.modalMusic);
        
        // Lógica inteligente de refresh
        // Se estiver dentro de um álbum, recarrega só ele. Se estiver na home, recarrega tudo.
        if (refs.albumPage.style.display === "block") {
            await fetchAlbums(); // Atualiza memória global
            const currentId = Number(refs.viewAlbumName.dataset.currentId);
            openAlbumPage(currentId);
        } else {
            fetchAllSongs();
        }
    }
});

window.editMusic = async (id) => {
    // Busca detalhes da música (GET individual para garantir dados completos)
    const song = await apiRequest(`/musica/${id}`);
    if (song) {
        document.getElementById("musicId").value = song.id;
        document.getElementById("musicName").value = song.tituloMusica;
        document.getElementById("musicGenre").value = song.genero;
        document.getElementById("musicTime").value = song.tempoDuracao;
        
        if (song.album) {
            refs.musicAlbumSelect.value = song.album.id;
        }

        document.getElementById("modalMusicTitle").innerText = "Editar Música";
        openModal(refs.modalMusic);
    }
};

window.deleteMusic = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta música?")) {
        await apiRequest(`/musica/${id}`, "DELETE");
        
        if (refs.albumPage.style.display === "block") {
            await fetchAlbums();
            const currentId = Number(refs.viewAlbumName.dataset.currentId);
            openAlbumPage(currentId);
        } else {
            fetchAllSongs();
        }
    }
};

// ==========================================
// MODAIS E UTILITÁRIOS
// ==========================================

function setupEventListeners() {
    // Botão Voltar
    document.getElementById("btnBackAlbums").addEventListener("click", showMainPage);

    // Botões Abrir Modal
    document.getElementById("btnAddAlbum").onclick = () => {
        refs.formAlbum.reset();
        document.getElementById("albumId").value = "";
        document.getElementById("modalAlbumTitle").innerText = "Criar Álbum";
        openModal(refs.modalAlbum);
    };

    document.getElementById("btnAddMusic").onclick = () => {
        refs.formMusic.reset();
        document.getElementById("musicId").value = "";
        document.getElementById("modalMusicTitle").innerText = "Adicionar Música";
        
        // Se estiver dentro de um álbum, já seleciona ele automaticamente
        if (refs.albumPage.style.display === "block") {
            const currentId = refs.viewAlbumName.dataset.currentId;
            refs.musicAlbumSelect.value = currentId;
        }
        
        openModal(refs.modalMusic);
    };

    // Fechar Modais (Botão X e Cancelar)
    document.querySelectorAll(".close, .btn-cancel").forEach(el => {
        el.addEventListener("click", () => {
            closeModal(refs.modalAlbum);
            closeModal(refs.modalMusic);
        });
    });

    // Busca rápida no front-end
    refs.searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        
        // Filtra álbuns
        document.querySelectorAll(".album-card").forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(term) ? "block" : "none";
        });
        
        // Filtra músicas (se estiver visível)
        document.querySelectorAll(".song-row").forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(term) ? "flex" : "none";
        });
    });
}

function openModal(modal) {
    modal.classList.add("show");
    modal.style.display = "flex"; // Fallback caso não use classe CSS show
}

function closeModal(modal) {
    modal.classList.remove("show");
    modal.style.display = "none";
}