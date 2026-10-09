import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: 'pokedex',
        loadComponent: () =>
            import('./Components/Listagem-Pokemon/listagem-pokemon')
                .then(m => m.ListagemPokemon)
    },
    {
        path: 'pokedex/formas/:formaRegional',
        loadComponent: () =>
            import('./Components/Listagem-Pokemon/listagem-pokemon')
                .then(m => m.ListagemPokemon)
    },
    {
        path: 'pokedex/formas-alternativas/:formaAlternativa',
        loadComponent: () =>
            import('./Components/Listagem-Pokemon/listagem-pokemon')
                .then(m => m.ListagemPokemon)
    },
    {
        path: 'pokedex/:regiao',
        loadComponent: () =>
            import('./Components/Listagem-Pokemon/listagem-pokemon')
                .then(m => m.ListagemPokemon)
    },
    {
        path: 'pokedex/pokemon/:nome',
        loadComponent: () =>
            import('./Components/Dados-Pokemon/dados-pokemon')
                .then(m => m.DadosPokemon)
    },
    {
        path: 'favoritos',
        loadComponent: () =>
            import('./Components/Favoritos/favoritos')
                .then(m => m.FavoritosComponent)
    },
    {
        path: '',
        redirectTo: 'pokedex',
        pathMatch: 'full'
    }
];