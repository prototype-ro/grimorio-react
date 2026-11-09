# Grimório: Pokédex de Magic

Atividade 03 (React + Vite). A Pokédex foi adaptada para cartas de **Magic: The Gathering**, com autorização do professor.

## Autores

Dupla, em Pair Programming:

- [prototype-ro](https://github.com/prototype-ro)
- [JTeixeiraz](https://github.com/JTeixeiraz)

## Como executar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173` no navegador. Para gerar o build: `npm run build`.

## Adaptação Pokémon → Magic

| Pokédex | Grimório |
| --- | --- |
| Pokémon | Carta (53 cartas de Commander) |
| Número/ID | Número sequencial `#001` (ordem alfabética) |
| Tipo | Cor (Branco, Azul, Preto, Vermelho, Verde, Incolor) |
| HP / Attack / Defense / Sp. / Speed | Poder, Resistência, Custo de mana e Popularidade (rank EDHREC); só criaturas têm Poder/Resistência, as demais mostram `—` |
| Treinadores | Decks Commander (comandante + cartas) |
| Insígnias | Número de cores da identidade de cor do comandante |

## Funcionalidades

- Lista de cartas com número, nome, cores, custo de mana, poder, resistência e CMC
- Pesquisa por nome ou número, atualizada a cada tecla
- Filtro por cor
- Detalhes em modal: imagem, tipo, texto, raridade, set e barras de atributos
- Seção Decks: 12 decks, com comandante, insígnias e cartas relacionadas (clique abre os detalhes da carta)
- Mensagem quando nenhuma carta é encontrada
- Extras: favoritos (salvos no `localStorage`), ordenação, carta aleatória, tema claro/escuro, layout responsivo

## Conceitos de React usados

Componentes funcionais, props, `useState`, `useEffect`, `useMemo` (estado derivado da lista filtrada), hook próprio (`useLocalStorage`), `map()` com `key`, eventos, renderização condicional.

## Organização

```text
src/
├── components/   CardItem, CardList, CardDetails, SearchBar, ColorFilter, DeckList, StatBar, ManaCost, ColorBadges
├── css/          App.css (estilos dos componentes)
├── data/         cards-data.json (cartas e decks)
├── hooks/        useLocalStorage.js
├── utils/        colors.js, format.js
├── App.jsx
├── main.jsx
└── index.css     (tokens de tema)
scripts/fetch-data.mjs   gera cards-data.json a partir do Scryfall
```

## Dados e imagens

Os dados estão em `src/data/cards-data.json`, gerado uma vez com `node scripts/fetch-data.mjs` a partir da API pública do [Scryfall](https://scryfall.com/docs/api). A aplicação funciona só com esse arquivo; as imagens são carregadas por URL do CDN do Scryfall (exigem internet).

Magic: The Gathering e as imagens das cartas pertencem à Wizards of the Coast. Projeto acadêmico sem fins lucrativos.
