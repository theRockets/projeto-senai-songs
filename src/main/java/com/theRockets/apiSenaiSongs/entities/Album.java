package com.theRockets.apiSenaiSongs.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "tb_album")
public class Album {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "O nome do album é obrigatório")
    @Column(name = "nome_album")
    private String nomeAlbum;
    
    @Column(name = "url_capa", columnDefinition="TEXT") // Opcional: define nome da coluna no banco
    private String urlCapa;

    @NotNull(message = "O album deve ter um artista registrado")
    @Column(name = "artista_responsavel", nullable = false, length = 100)
    private String artistaResponsavel;
    
    @JsonManagedReference
    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL)
    private List<Musica> musicas;

        
    public Album() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNomeAlbum() {
		return nomeAlbum;
	}

	public void setNomeAlbum(String nomeAlbum) {
		this.nomeAlbum = nomeAlbum;
	}

	public List<Musica> getMusicas() {
		return musicas;
	}

	public void setMusicas(List<Musica> musicas) {
		this.musicas = musicas;
	}

	public String getUrlCapa() {
		return urlCapa;
	}

	public void setUrlCapa(String urlCapa) {
		this.urlCapa = urlCapa;
	}

}