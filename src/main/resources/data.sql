insert ignore into tb_album (nome_album, artista_responsavel, url_capa) values
("qvvjfa", "Baco Exu do Blues", "https://pub-24ea3407a0f24c8394eadaa45a05aa0c.r2.dev/capas/91812/thumbnails/m_91812ca.jpg"),
("Castelos e Ruinas", "BK",  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4g3CkaR4ViF5tpq7e3GPbPizSD4WAGtRhCw&s"),
("O proprio", "Yago Oproprio", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFrmV804m9YJig46uoA4k-PbeDicBvX5v-ig&s"),
("1989", "Taylor Swift", "https://akamai.sscdn.co/uploadfile/letras/albuns/d/8/1/d/416201728294476.jpg");

insert ignore into tb_musicas (titulo_musica, tempo_duracao, artista, ano_lancamento, link_musica, genero, fk_album) values

-- Musicas do Album qvvjfa
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
("Samba in Paris", 266, "Baco Exu do Blues", 2022, "https://youtu.be/YjsgxGDPakk?si=R32b8AJZIciUNN7C", "MPB", 1),
("20 Ligações", 193, "Baco Exu do Blues", 2022,  "https://youtu.be/Qr-w5QZiN30?si=QTHbF0Es_g0x9XfQ", "MPB", 1),
("Sei Partir", 176, "Baco Exu do Blues", 2022, "https://youtu.be/ELdwY0MSWio?si=xpI29eNLVqb7Iz3x", "MPB", 1),
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Musicas do Album Castelos e Ruinas
 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
("Quadros", 309, "BK", 2016, "https://youtu.be/Lxaf6GZv_7U?si=NZgMCt4GkO9nxJD5", "RAP", 2),
("O próximo nascer do sol", 186, "BK", 2016, "https://youtu.be/390psB51gf8?si=gtjxJY4zTFtgC-e5", "RAP", 2),
("Pirâmide", 199, "BK", 2016, "https://youtu.be/_Tdo20F3Y3M?si=Ck48wliw9t8Z-xbN", "RAP", 2),
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Musicas do Album O proprio
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
("La noche", 284, "Yago Oproprio", 2024, "https://youtu.be/evwMiEh2u8Y?si=sa49MF-kQPsNzOd1", "RAP", 3),
("Melhor que Ontem", 181, "Yago Oproprio", 2024, "https://youtu.be/COPuxCqjdEE?si=fuIwggtLJkoTvLo5", "RAP", 3),
("Inofensiva", 261, "Yago Oproprio", 2024, "https://youtu.be/9LZDzPzJDK0?si=C_aTsHY_f-riwh3_", "RAP", 3),
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- Musicas do Album 1989
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
("Welcome To New York", 217, "Taylor Swift", 2014, "https://youtu.be/FsGdznlfE2U?si=p8VVS0_hVJ6hBaHd", "POP", 4),
("Bad Blodd", 244, "Taylor Swift", 2024, "https://youtu.be/QcIy9NiNbmo?si=sZmTtsah8Xt-7hK1", "POP", 4),
("Shake It Off", 241, "Taylor Swift", 2014, "https://youtu.be/nfWlot6h_JM?si=SK2Gab0fCqhw_5cP", "POP", 4); 


select * from tb_musicas;