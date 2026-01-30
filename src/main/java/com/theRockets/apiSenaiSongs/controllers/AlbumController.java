package com.theRockets.apiSenaiSongs.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.theRockets.apiSenaiSongs.entities.Album;
import com.theRockets.apiSenaiSongs.services.AlbumService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/album")
@CrossOrigin(origins = "*")
public class AlbumController {

	@Autowired
	private AlbumService service;

	@PostMapping
	public Album salvarAlbum(@Valid @RequestBody Album album) {
		return service.salvarAlbum(album);
	}

	// 
	@GetMapping
	public List<Album> listarAlbum() {
		return service.listarAlbum();
	}
	
	
	@PutMapping("/{id}")
	public Album atualizarAlbum(@PathVariable Long id, @RequestBody Album album) {
		album.setId(id);
		return service.atualizarAlbum(id, album);
	}

	@GetMapping("/{id}")
	public Album buscarPorId(@PathVariable Long id) {
		return service.buscarPorId(id);
	}

	@DeleteMapping("/{id}")
	public String excluirAlbum(@PathVariable Long id) {
		service.deletarAlbum(id);
		return "O album com a ID " + id + " foi removido.";
	}

}