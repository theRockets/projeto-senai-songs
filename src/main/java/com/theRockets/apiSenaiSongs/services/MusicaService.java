package com.theRockets.apiSenaiSongs.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.theRockets.apiSenaiSongs.entities.Musica;
import com.theRockets.apiSenaiSongs.repositories.MusicaRepository;

@Service
public class MusicaService {

    @Autowired
    private MusicaRepository repository;

    public Musica salvarMusica(Musica musica) {
        return repository.save(musica);
    }

    public List<Musica> listarMusica() {
        return repository.findAll();
    }

    public Musica findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Musica atualizarMusica(Long id, Musica cNovo) {

        Musica cVelho = repository.findById(id).get();

        cVelho.setTituloMusica(cNovo.getTituloMusica());
        cVelho.setTempoDuracao(cNovo.getTempoDuracao());
        cVelho.setArtista(cNovo.getArtista());
        cVelho.setAnoLancamento(cNovo.getAnoLancamento());


        return repository.save(cVelho);

    }

    public void deletarMusica(Long id) {
        repository.deleteById(id);

    }

}