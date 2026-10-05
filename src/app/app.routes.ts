import { Routes } from '@angular/router';
import { ListagemPokemon } from './Components/Listagem-Pokemon/listagem-pokemon';
export const routes: Routes = [
    {
        path: 'pokedex',
        component: ListagemPokemon
    },
    {
        path: 'pokedex/:regiao',
        component: ListagemPokemon
    },
    {
        path: '',
        redirectTo: 'pokedex',
        pathMatch: 'full'
    }
];