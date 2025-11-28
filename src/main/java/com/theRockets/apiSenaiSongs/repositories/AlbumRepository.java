package com.theRockets.apiSenaiSongs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.theRockets.apiSenaiSongs.entities.Album;

public interface AlbumRepository extends JpaRepository <Album, Long>{

}
