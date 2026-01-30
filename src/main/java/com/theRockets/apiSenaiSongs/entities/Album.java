package com.theRockets.apiSenaiSongs.entities;

import java.util.List;
import java.util.ArrayList; // Importante para inicializar a lista

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty; // Opcional, para renomear o JSON

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType; // Importante
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "tb_album")
public class Album {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "O nome do album é obrigatório")
    @Column(name = "nome_album")
    // DICA: @JsonProperty faz o JSON sair como "nome" para o JS, mesmo que a variavel seja "nomeAlbum"
    // Se não usar isso, você tem que mudar no seu JavaScript para "album.nomeAlbum"
    private String nomeAlbum;
    
    @Column(name = "url_capa", columnDefinition="TEXT")
    private String urlCapa;

    @NotBlank(message = "O album deve ter um artista da mídia")
    @Column(name = "artista_responsavel", nullable = false, length = 120)
    private String artistaResponsavel;
    
    @JsonManagedReference
    // ADICIONADO: fetch = FetchType.EAGER (Carrega as músicas junto com o álbum imediatamente)
    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Musica> musicas = new ArrayList<>(); // Boa prática: inicializar a lista vazia

        
    public Album() {}
    
    public Album(Long id, String nomeAlbum, String urlCapa, String artistaResponsavel) {
    	this.id = id;
    	this.nomeAlbum = nomeAlbum;
    	this.urlCapa = urlCapa;
    	this.artistaResponsavel = artistaResponsavel;
    }

    // Getters e Setters (Mantive os seus, estão corretos)
	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getArtistaResponsavel() { return artistaResponsavel; }
	public void setArtistaResponsavel(String artistaResponsavel) { this.artistaResponsavel = artistaResponsavel; }
	public String getNomeAlbum() { return nomeAlbum; }
	public void setNomeAlbum(String nomeAlbum) { this.nomeAlbum = nomeAlbum; }
	public List<Musica> getMusicas() { return musicas; }
	public void setMusicas(List<Musica> musicas) { this.musicas = musicas; }
	public String getUrlCapa() { return urlCapa; }
	public void setUrlCapa(String urlCapa) { this.urlCapa = urlCapa; }
}