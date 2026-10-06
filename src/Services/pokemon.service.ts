import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, switchMap } from 'rxjs';
import { Pokemon } from '../app/Components/Listagem-Pokemon/listagem-pokemon';


interface ResultadoObjetoHttp {
    name: string;
    url: string;
}

interface ObjetoRespostaHttp {
    count: number;
    next: string | null;
    previous: string | null;
    results: ResultadoObjetoHttp[];
}

interface TipoPokemonRespostaHttp {
    type: {
        name: string;
    };
}

interface PokemonRespostaHttp {
    id: number;
    name: string;
    types: TipoPokemonRespostaHttp[];
    sprites: {
        front_default: string | null;
    };
}


export interface Regiao {
    nome: string,
    inicio: number,
    quantidade: number
}

const regioes: Regiao[] = [
    {
        nome: 'Kanto',
        inicio: 1,
        quantidade: 151
    },
    {
        nome: 'Johto',
        inicio: 152,
        quantidade: 100
    },
    {
        nome: 'Hoenn',
        inicio: 252,
        quantidade: 135
    },
    {
        nome: 'Sinnoh',
        inicio: 387,
        quantidade: 108
    },
    {
        nome: 'Unova',
        inicio: 495,
        quantidade: 155
    },
    {
        nome: 'Kalos',
        inicio: 650,
        quantidade: 72
    },
    {
        nome: 'Alola',
        inicio: 722,
        quantidade: 88
    },
    {
        nome: 'Galar',
        inicio: 810,
        quantidade: 96
    },
    {
        nome: 'Paldea',
        inicio: 906,
        quantidade: 120
    }
];

@Injectable({
    providedIn: 'root',
})


export class PokemonService {

    private readonly http = inject(HttpClient);

    obterPokemons(nome?: string, offset = 0) {

        let url: string;

        if (!nome) {
            url =
                `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=32`;
        } else {

            const regiao = regioes.find(
                (regiao) =>
                    regiao.nome.toLowerCase() === nome.toLowerCase()
            );

            if (!regiao) {
                throw new Error('Região não encontrada.');
            }

            url =
                `https://pokeapi.co/api/v2/pokemon?offset=${regiao.inicio - 1}&limit=${regiao.quantidade}`;
        }

        return this.http.get<ObjetoRespostaHttp>(url).pipe(

            switchMap((resposta) => {

                const requisicoes = resposta.results.map(
                    (pokemon) =>
                        this.http.get<PokemonRespostaHttp>(pokemon.url)
                );

                return forkJoin(requisicoes);
            }),

            map((detalhes) =>
                detalhes.map((detalhe): Pokemon => ({
                    id: detalhe.id,
                    name: detalhe.name,
                    types: detalhe.types.map(
                        (item) => item.type.name
                    ),
                    sprite: detalhe.sprites.front_default,
                }))
            )
        );
    }
}