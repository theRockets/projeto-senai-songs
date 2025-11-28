# **Projeto Senai Songs – Sistema de Catálogo de Músicas**

### *Trabalho acadêmico — Desenvolvimento Full Stack (Frontend + Backend + Banco + Documentação)*

Este repositório contém todas as etapas, artefatos, códigos e documentações produzidas durante o desenvolvimento do sistema de catálogo de filmes, seguindo o cronograma de 4 dias de entregas.

O projeto foi desenvolvido como integrador entre as disciplinas desenvolvidas no 2º Semestre do Curso de Desenvolvimento de Sistemas no SENAI Gaspar Ricardo Junior - CFP 402 - Sorocaba/SP

Professor Instrutor: [Vedilson Prado](https://github.com/vedilsonprado)

---
# 🧑‍💻 **Desenvolvedores:**
Nome Dev 01: [Laís Sabrina Zamboni Silva](https://github.com/vedilsonprado)
Nome Dev 02: [Laura da Cruz Reis](https://github.com/vedilsonprado)
Nome Dev 03: [Maria Eduarda Vitorino da Silva](https://github.com/vedilsonprado)
Nome Dev 04: [Murilo Lustosa de Castro](https://github.com/vedilsonprado)
Nome Dev 05: [Rodrigo Andrade Silva](https://github.com/vedilsonprado)
Nome Dev 06: [Vinícius Leite Fogaça](https://github.com/vedilsonprado)
---

## 🛠️ Tecnologias e Ferramentas
![Java](https://skillicons.dev/icons?i=java,spring,js,html,css,mysql)
---

# 📁 **Estrutura do Repositório**

```
📦 projeto-filmes
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── application.properties
├── frontend/
│   ├── index.html
│   ├── filmes.html
│   └── scripts/
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
spring.datasource.url=jdbc:mysql://localhost:3306/filmes
spring.datasource.username=root
spring.datasource.password=senha
spring.jpa.hibernate.ddl-auto=update

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

## **Gêneros**

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | /generos | Lista todos |
| POST | /generos | Cria novo |
| PUT | /generos/{id} | Atualiza |
| DELETE | /generos/{id} | Remove |

## **Filmes**

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | /filmes | Lista todos |
| POST | /filmes | Cria |
| PUT | /filmes/{id} | Atualiza |
| DELETE | /filmes/{id} | Remove |

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

🔗 **Trello:** *adicionar*

🔗 **Figma:** *adicionar*