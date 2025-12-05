package com.theRockets.apiSenaiSongs.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.theRockets.apiSenaiSongs.entities.Album;
import com.theRockets.apiSenaiSongs.repositories.AlbumRepository;

@Service
public class AlbumService {
    
    @Autowired
    private AlbumRepository repository;
    
    public Album salvarAlbum(Album album) {
        return repository.save(album);
    }
    
    public List<Album> listarAlbum() {
        return repository.findAll();
    }
    
    public Album buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }
    
    public void deletarAlbum(Long id) {
        repository.deleteById(id);
    }
    
    public Album atualizarAlbum(Long id, Album novosDados) {
        Album existente = repository.findById(id).orElse(null);
        existente.setNomeAlbum(novosDados.getNomeAlbum());

        return repository.save(existente);
    }
}
