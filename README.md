# **Projeto Senai Songs – Plataforma de Músicas**

### *Trabalho acadêmico — Desenvolvimento Full Stack (Frontend + Backend + Banco + Documentação)*

Este repositório contém todas as etapas, artefatos, códigos e documentações produzidas durante o desenvolvimento do sistema de plataforma de músicas, seguindo o cronograma de 4 dias de entregas.

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

```
Para executar o projeto da nossa plataforma de músicas em Spring Boot na sua máquina, siga os passos abaixo:
    1.    Instale as ferramentas necessárias
É preciso ter o Java 17 ou superior instalado, além de uma IDE (como IntelliJ ou Eclipse) e o Maven.
    2.    Clone o repositório do projeto
Baixe o projeto usando o comando:

git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

Depois abra o projeto na sua IDE.

    3.    Configure o banco de dados
No arquivo application.properties, ajuste as informações do seu banco (como usuário, senha e URL).
O sistema cria as tabelas automaticamente quando iniciado.
    4.    Execute o projeto
Na IDE, abra a classe principal (a que contém @SpringBootApplication) e clique em Run.
Ou então, no terminal, execute:

mvn spring-boot:run

5.    Acesse a API
Quando o servidor iniciar, a API ficará disponível em:

http://localhost:8080

Pronto! Agora você já consegue testar os endpoints usando ferramentas como Postman ou Insomnia.

````

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

### **🎭 Album**

```json

--- entrada (post)

{
  "nomeAlbum": "Blonde",
  "urlCapa": "https://akamai.sscdn.co/uploadfile/letras/albuns/2/3/9/0/528311701950316.jpg",
  "artistaResponsavel": "Frank Ocean"
}

--- saída

{
  "id": 9,
  "nomeAlbum": "Blonde",
  "urlCapa": "https://akamai.sscdn.co/uploadfile/letras/albuns/2/3/9/0/528311701950316.jpg",
  "artistaResponsavel": "Frank Ocean",
  "musicas": null
}

```

### **🎬 Musica**

```json

--- entrada (post)

{
  "tituloMusica": "Pink White",
  "tempoDuracao": 184,
  "artista": "Frank Ocean",
  "anoLancamento": 2017,
  "linkMusica": "https://www.youtube.com/watch?v=uzS3WG6__G4",
  "genero": "RAP",
  "album": {
      "id": 5
  }
}

--- saída

{
  "tituloMusica": "Pink White",
  "tempoDuracao": 184,
  "artista": "Frank Ocean",
  "anoLancamento": 2017,
  "linkMusica": "https://www.youtube.com/watch?v=uzS3WG6__G4",
  "genero": "RAP",
  "id": 25
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

### **POST /album**

```json
{
  "nomeAlbum": "Blonde",
  "urlCapa": "https://akamai.sscdn.co/uploadfile/letras/albuns/2/3/9/0/528311701950316.jpg",
  "artistaResponsavel": "Frank Ocean"
}

```
### **POST /musica**

```json
{
  "tituloMusica": "Pink White",
  "tempoDuracao": 184,
  "artista": "Frank Ocean",
  "anoLancamento": 2017,
  "linkMusica": "https://www.youtube.com/watch?v=uzS3WG6__G4",
  "genero": "RAP",
  "album": {
      "id": 25
  }
}

```
### **PUT /musica**

```json
{
  "tituloMusica": "Pink + White",
  "tempoDuracao": 184,
  "artista": "Frank Ocean ft. Beyonce",
  "anoLancamento": 2017,
  "linkMusica": "https://www.youtube.com/watch?v=uzS3WG6__G4",
  "genero": "RAP",
  "album": {
      "id": 5
  }
}

```

### **PUT /album/2**

```json
{
  "nomeAlbum": "Castelos e Ruínas",
  "urlCapa": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4g3CkaR4ViF5tqp7e3GPBPizSD4WAGtRhCw&s",
  "artistaResponsavel": "Abebe Bikila"
  }
}

```

### **DELETE /musica/25**

```json
  "A música com a ID 25 foi removida."
```

### **DELETE /album/6**

```json
  "O álbum com a ID 6 foi removido."
```

### **GET /album -- exemplo**

```json

  {
        "id": 2,
        "nomeAlbum": "Castelos e Ruinas",
        "urlCapa": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4g3CkaR4ViF5tpq7e3GPbPizSD4WAGtRhCw&s",
        "artistaResponsavel": "BK",
        "musicas": [
            {
                "tituloMusica": "Quadros",
                "tempoDuracao": 309,
                "artista": "BK",
                "anoLancamento": 2016,
                "linkMusica": "https://youtu.be/Lxaf6GZv_7U?si=NZgMCt4GkO9nxJD5",
                "genero": "RAP",
                "id": 4
            }

```

### **GET /musica -- exemplo**

```json

   {
        "tituloMusica": "Samba in Paris",
        "tempoDuracao": 266,
        "artista": "Baco Exu do Blues",
        "anoLancamento": 2022,
        "linkMusica": "https://youtu.be/YjsgxGDPakk?si=R32b8AJZIciUNN7C",
        "genero": "RAP",
        "id": 1
    }

```
---

# 📎 **Links Importantes**

🔗 **Trello:** [(https://trello.com/b/WHNa3oHH/projeto-final)]

🔗 **Figma:** [(https://www.figma.com/design/QpYR5ImKxj5yMRHrraH4HT/Senai-Songs---Prot%C3%B3tipo?node-id=0-1&p=f&m=draw)]
