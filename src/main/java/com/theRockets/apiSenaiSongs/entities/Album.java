package com.theRockets.apiSenaiSongs.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
	private String nomeAlbum;
	
	@NotBlank(message = "O nome do album é obrigatório")
	@Column(name = "quantidade_musicas")
	private int qtdMusica;
	
	public Album( ) {}
	
	public Album(String nomeAlbum, int qtdMusica) {
		this.nomeAlbum = nomeAlbum;
		this.qtdMusica = qtdMusica;
	}

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

	public int getQtdMusica() {
		return qtdMusica;
	}

	public void setQtdMusica(int qtdMusica) {
		this.qtdMusica = qtdMusica;
	}
	
	
	
}
