import { Routes } from '@angular/router';

import { DadosPokemon } from './Components/Dados-Pokemon/dados-pokemon';

export const routes: Routes = [
    {
        path: 'pokedex',
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
        path: '',
        redirectTo: 'pokedex',
        pathMatch: 'full'
    }
];