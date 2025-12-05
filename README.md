# **Projeto Senai Songs – Plataforma de Músicas**

### *Trabalho acadêmico — Desenvolvimento Full Stack (Frontend + Backend + Banco + Documentação)*

Este repositório contém todas as etapas, artefatos, códigos e documentações produzidas durante o desenvolvimento do sistema de catálogo de filmes, seguindo o cronograma de 4 dias de entregas.

O projeto foi desenvolvido como integrador entre as disciplinas desenvolvidas no 2º Semestre do Curso de Desenvolvimento de Sistemas no SENAI Gaspar Ricardo Junior - CFP 402 - Sorocaba/SP

Professor Instrutor: [Vedilson Prado](https://github.com/vedilsonprado)

---
# 🧑‍💻 **Desenvolvedores:**
Nome Dev 01: [Laís Sabrina Zamboni Silva](https://github.com/z4mbon1)
Nome Dev 02: [Laura da Cruz Reis](https://github.com/laucruzreisss)
Nome Dev 03: [Maria Eduarda Vitorino da Silva](https://github.com/MariaVitorino09)
Nome Dev 04: [Murilo Lustosa de Castro](https://github.com/dev-murilo-castro)
Nome Dev 05: [Rodrigo Andrade Silva](https://github.com/r-andrade77)
Nome Dev 06: [Vinícius Leite Fogaça](https://github.com/ViniFogaca)
---

## 🛠️ Tecnologias e Ferramentas
![Java](https://skillicons.dev/icons?i=java,spring,js,html,css,mysql)
---

# 📁 **Estrutura do Repositório**

```
📦 projeto-senai-songs
├── backend/
│   ├── src/main/java/
│        |__com.theRockets.apiSenaiSongs/
│            |__ ProjetoCatalogoSenaisongsApplication.java
│        |__com.theRockets.apiSenaiSongs.config/
│            |__ CorsConfig.java
│        |__com.theRockets.apiSenaiSongs.controllers/
│            |__ AlbumController.java
│            |__ MusicaController.java
│        |__com.theRockets.apiSenaiSongs.entities/
│            |__ Album.java
│            |__ Musica.java
│        |__com.theRockets.apiSenaiSongs.enums/
│            |__ Genero.java
│        |__com.theRockets.apiSenaiSongs.repositories/
│            |__ AlbumRepository.java
│            |__ MusicaRepository.java
│        |__com.theRockets.apiSenaiSongs.services/
│            |__ AlbumService.java
│            |__ MusicaService.java
│   ├── src/main/resources/
│         ├── static/
│             ├── css/
│                 |__ style.css
│             ├── script/
│                 |__ script.js
│             ├── index.html
│         ├── application.properties
│         ├── data.sql
│   ├── src/test/java/
│         |__ com.theRockets.apiSenaiSongs/
│               |__ ProjetoCatalogoSenaisongsApplicationTests.java
│   ├── JRE System Library
│   ├── Maven Dependencies
│   ├── src/
│        ├── main
│        ├── test
│   ├── target
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
|
├── frontend/
│   ├── css/
│        ├── paginaInicial.css
│        ├── style.css
│   ├── img/
│        ├── logo.png
│   ├── pages/
│        ├── paginaInicial.html
│   ├── script/
│        ├── paginaInicial.js
│        ├── script.js
│   └── index.html
|
├── docs/
│   ├── requisitos.docx
│   ├── uml/
│   ├── der/
│   ├── prototipos/
│   └── banco.sql
└── README.md
```

---

# 🛠️ **Guia de Instalação e Execução**

## **Backend (Spring Boot)**

### **1. Configurar banco no `application.properties`**

```
spring.application.name=projeto-senai-songs
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/db_senai_songs?useSSL=false
spring.datasource.username=root
spring.datasource.password=12345
spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.MySQLDialect
spring.jpa.defer-datasource-initialization=true
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.hibernate.ddl-auto=update
spring.sql.init.mode = always
```

### **2. Rodar o backend**

---

# 🌐 **Documentação da API**

## **Entidades**

### **🎭 Gênero**

```json
{
  "id": 1,
  "name": "Ação"
}
```

### **🎬 Filme**

```json
{
  "id": 1,
  "title": "Matrix",
  "year": 1999,
  "director": "Wachowski",
  "coverUrl": "https://...jpg",
  "genre": {
    "id": 1,
    "name": "Ação"
  }
}
```

---

# 📡 **Endpoints**

## **Album**

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | /album | Lista todos os álbuns cadastrados |
| POST | /album | Cria um novo álbum |
| PUT | /album/{id} | Atualiza um álbum existente pela sua id |
| DELETE | /album/{id} | Remove um álbum cadastrado pela sua id |

## **Musica**

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | /musica | Lista todas as músicas cadastradas |
| POST | /musica | Cria uma nova música|
| PUT | /musica/{id} | Atualiza uma música existente pela sua id |
| DELETE | /musica/{id} | Remove uma música cadastrada pela sua id |

---

# 🖥️ **Exemplos de Requisição**

### **POST /filmes**

```json
{
  "title": "Matrix",
  "year": 1999,
  "director": "Wachowski",
  "coverUrl": "https://imagem.jpg",
  "genre": { "id": 1 }
}
```

---

# 📎 **Links Importantes**

🔗 **Trello:** [(https://trello.com/b/WHNa3oHH/projeto-final)]

🔗 **Figma:** *adicionar*
