package com.theRockets.apiSenaiSongs.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.theRockets.apiSenaiSongs.enums.Genero;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "tb_musicas")
public class Musica {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "titulo_musica", nullable = false, length = 120)
	@NotBlank(message = "O campo titulo deve ser preenchido!")
	@Size(min = 2, max = 120, message = "O campo titulo deve ser preenchido com no minimo 2 e maximo 120")
	private String tituloMusica; 

	@Column(name = "tempo_duracao", nullable = false)
	private int tempoDuracao;
	
	@Column(name = "artista", length = 120)
	private String artista;
	
	@NotNull(message = "O gênero deve ser preenchido!")
    @Column(name = "genero", nullable = false, length = 100)
    @Enumerated(EnumType.STRING)
    private Genero genero;
		
	@Column(name = "ano_lancamento")
	@Min(value = 1900, message = "Ano de nascimento deve ser posterior a 1900")
	@Max(value = 2100, message = "Ano de nascimento deve ser anterior a 2100")
	private int anoLancamento;
	
	@Column(name = "link_musica", columnDefinition="TEXT") // Opcional: define nome da coluna no banco
	private String linkMusica;
	
	@ManyToOne
	@JoinColumn(name = "fk_album")
	@JsonBackReference
	private Album album;

	public Musica() {}
	
	public Musica(String tituloMusica, int tempoDuracao, String artista,  int anoLancamento, Album album, String linkMusica) {
		this.tituloMusica = tituloMusica;
		this.tempoDuracao = tempoDuracao;
		this.artista = artista;
		this.anoLancamento = anoLancamento;
		this.album = album;
		this.linkMusica = linkMusica;
	}  

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTituloMusica() {
		return tituloMusica;
	}

	public void setTituloMusica(String tituloMusica) {
		this.tituloMusica = tituloMusica;
	}

	public int getTempoDuracao() {
		return tempoDuracao;
	}

	public void setTempoDuracao(int tempoDuracao) {
		this.tempoDuracao = tempoDuracao;
	}

	public String getArtista() {
		return artista;
	}

	public void setArtista(String artista) {
		this.artista = artista;
	}

	public int getAnoLancamento() {
		return anoLancamento;
	}

	public void setAnoLancamento(int anoLancamento) {
		this.anoLancamento = anoLancamento;
	}

	public Album getAlbum() {
		return album;
	}

	public void setAlbum(Album album) {
		this.album = album;
	}

	public Genero getGenero() {
		return genero;
	}

	public void setGenero(Genero genero) {
		this.genero = genero;
	}

	public String getUrlCapa() {
		return linkMusica;
	}

	public void setLinkMusica(String linkMusica) {
		this.linkMusica = linkMusica;
	}

	

}
