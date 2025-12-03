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

import com.theRockets.apiSenaiSongs.entities.Musica;
import com.theRockets.apiSenaiSongs.services.MusicaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/musica")
@CrossOrigin(origins = "*")
public class MusicaController {

	@Autowired
	private MusicaService service;

	@PostMapping
	public Musica cadastrarMusica(@Valid @RequestBody Musica musica) {
		return service.salvarMusica(musica);
	}

	@GetMapping
	public List<Musica> listarTodos() {
		return service.listarMusica();
	}

	@PutMapping("/{id}")
	public Musica atualizarMusica(@PathVariable Long id, @RequestBody Musica musica) {
		musica.setId(id);
		return service.atualizarMusica(id, musica);
	}

	@GetMapping("/{id}")
	public Musica buscarPorId(@PathVariable Long id) {
		return service.findById(id);
	}

	@DeleteMapping("/{id}")
	public String excluirMusica(@PathVariable Long id) {
		service.deletarMusica(id);
		return "A música com a ID " + id + " foi removida.";

	}

}