# 🔴 Pokédex

Uma Pokédex desenvolvida com **Angular**, inspirada na interface e na experiência dos jogos clássicos de Pokémon, especialmente *Pokémon FireRed*.

O projeto consome dados da [PokéAPI](https://pokeapi.co/) para apresentar informações sobre os Pokémon, permitindo explorar diferentes regiões, consultar formas alternativas e filtrar os resultados.

## ✨ Funcionalidades

- **Listagem de Pokémon:** exibição de Pokémon com sprites, tipos e informações visuais.
- **Paginação:** navegação entre páginas com quantidade limitada de Pokémon por página.
- **Pesquisa:** busca por nome ou número do Pokémon.
- **Filtro por tipo:** filtragem por um ou mais tipos de Pokémon.
- **Regiões:** navegação pelas regiões de Kanto, Johto e Hoenn.
- **Formas regionais:** consulta de formas de Alola, Galar, Hisui e Paldea.
- **Formas alternativas:** navegação entre diferentes formas de um Pokémon.
- **Sprites e artes oficiais:** exibição de imagens nas versões normal e shiny, quando disponíveis.
- **Interface responsiva:** adaptação para diferentes tamanhos de tela.
- **Identidade visual retrô:** interface inspirada na estética dos jogos clássicos de Pokémon.

## 🛠️ Tecnologias utilizadas

- [Angular](https://angular.dev/)
- TypeScript
- HTML5
- SCSS
- [Bootstrap](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [PokéAPI](https://pokeapi.co/)

## 🚀 Como executar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- npm
- Angular CLI

### Instalação

Clone o repositório:

```bash
git clone https://github.com/igormota22/pokedex.git
```

Entre na pasta do projeto:

```bash
cd pokedex
```

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
ng serve
```

Acesse no navegador:

```text
http://localhost:4200
```

## 🌐 API utilizada

Os dados são obtidos por meio da [PokéAPI](https://pokeapi.co/docs/v2), uma API pública que disponibiliza informações sobre Pokémon, espécies, tipos, sprites e outras características.

O projeto utiliza esses dados para montar as listagens e permitir a navegação pelas funcionalidades da Pokédex.

## 📦 Build de produção

Para gerar os arquivos de produção:

```bash
ng build
```

Os arquivos compilados são gerados no diretório de saída configurado pelo Angular.

## 🎯 Objetivo do projeto

Este projeto tem como objetivo praticar e aprofundar conhecimentos em desenvolvimento frontend com Angular, consumo de APIs REST, programação reativa, gerenciamento de estado, roteamento e construção de interfaces responsivas.

Também busca recriar parte da experiência de uma Pokédex clássica, combinando funcionalidades modernas com uma identidade visual retrô.

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de portfólio.

Pokémon e suas respectivas marcas e personagens pertencem aos seus titulares. Este projeto é um trabalho independente, sem afiliação oficial com a Nintendo, Game Freak ou The Pokémon Company.

Os dados são fornecidos pela PokéAPI, conforme suas condições de uso.
