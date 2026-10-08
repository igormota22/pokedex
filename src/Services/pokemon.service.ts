import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, switchMap } from 'rxjs';
import { Pokemon } from '../app/Components/Listagem-Pokemon/listagem-pokemon';
import { DadosPokemon, DadosPokemonResponse } from '../app/Components/Dados-Pokemon/dados-pokemon';


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

export interface SomPokemonRespostaHttp {
    readonly latest: string | null;
    readonly legacy: string | null;
}

export interface HabilidadePokemonRespostaHttp {
    readonly ability: {
        readonly name: string;
    };
}

export interface EstatisticaPokemonRespostaHttp {
    readonly base_stat: number;
    readonly stat: {
        readonly name: string;
    };
}

interface TipoPokemonRespostaHttp {
    type: {
        name: string;
    };
}


interface PokemonRespostaHttp {
    readonly id: number;
    readonly name: string;

    readonly types: TipoPokemonRespostaHttp[];

    readonly sprites: {
        readonly front_default: string | null;
    };

    readonly stats: EstatisticaPokemonRespostaHttp[];

    readonly weight: number;

    readonly abilities: HabilidadePokemonRespostaHttp[];

    readonly cries: SomPokemonRespostaHttp;

}



interface Regiao {
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
    obterPokemons(
        nome?: string,
        offset = 0,
        tipos?: string[],
        formaRegional?: string,
        formaAlternativa?: string
    ) {

        let url: string;

        // FORMA REGIONAL
        if (formaRegional) {

            url = 'https://pokeapi.co/api/v2/pokemon?limit=100000';

            return this.http.get<ObjetoRespostaHttp>(url).pipe(

                map((resposta) =>
                    resposta.results.filter((pokemon) =>
                        pokemon.name.endsWith(
                            `-${formaRegional.toLowerCase()}`
                        )
                    )
                ),

                switchMap((pokemons) => {

                    const requisicoes = pokemons.map(
                        (pokemon) =>
                            this.http.get<PokemonRespostaHttp>(
                                pokemon.url
                            )
                    );

                    return forkJoin(requisicoes);
                }),

                map((detalhes) => {

                    let pokemons = detalhes;

                    if (tipos && tipos.length > 0) {
                        pokemons = pokemons.filter((pokemon) =>
                            pokemon.types.some((item) =>
                                tipos.includes(item.type.name)
                            )
                        );
                    }

                    return pokemons.map((detalhe): Pokemon => ({
                        id: detalhe.id,
                        name: detalhe.name,
                        types: detalhe.types.map(
                            (item) => item.type.name
                        ),
                        sprite: detalhe.sprites.front_default,
                    }));
                })
            );
        }

        // FORMA ALTERNATIVA
        if (formaAlternativa) {

            url = 'https://pokeapi.co/api/v2/pokemon?limit=100000';

            return this.http.get<ObjetoRespostaHttp>(url).pipe(

                map((resposta) =>
                    resposta.results.filter((pokemon) => {

                        if (formaAlternativa === 'mega') {
                            return pokemon.name.includes('-mega');
                        }

                        return pokemon.name.endsWith(
                            `-${formaAlternativa.toLowerCase()}`
                        );
                    })
                ),

                switchMap((pokemons) => {

                    const requisicoes = pokemons.map(
                        (pokemon) =>
                            this.http.get<PokemonRespostaHttp>(
                                pokemon.url
                            )
                    );

                    return forkJoin(requisicoes);
                }),

                map((detalhes) => {

                    let pokemons = detalhes;

                    if (tipos && tipos.length > 0) {
                        pokemons = pokemons.filter((pokemon) =>
                            pokemon.types.some((item) =>
                                tipos.includes(item.type.name)
                            )
                        );
                    }

                    return pokemons.map((detalhe): Pokemon => ({
                        id: detalhe.id,
                        name: detalhe.name,
                        types: detalhe.types.map(
                            (item) => item.type.name
                        ),
                        sprite: detalhe.sprites.front_default,
                    }));
                })
            );
        }

        // REGIÃO
        if (nome) {

            const regiao = regioes.find(
                (regiao) =>
                    regiao.nome.toLowerCase() === nome.toLowerCase()
            );

            if (!regiao) {
                throw new Error('Região não encontrada.');
            }

            url =
                `https://pokeapi.co/api/v2/pokemon?offset=${regiao.inicio - 1}&limit=${regiao.quantidade}`;

        } else {

            // LISTAGEM NORMAL
            if (tipos && tipos.length > 0) {
                url =
                    'https://pokeapi.co/api/v2/pokemon?limit=100000';
            } else {
                url =
                    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=32`;
            }
        }

        return this.http.get<ObjetoRespostaHttp>(url).pipe(

            switchMap((resposta) => {

                const requisicoes = resposta.results.map(
                    (pokemon) =>
                        this.http.get<PokemonRespostaHttp>(
                            pokemon.url
                        )
                );

                return forkJoin(requisicoes);
            }),

            map((detalhes) => {

                let pokemons = detalhes;

                if (tipos && tipos.length > 0) {
                    pokemons = pokemons.filter((pokemon) =>
                        pokemon.types.some((item) =>
                            tipos.includes(item.type.name)
                        )
                    );

                    // Paginação depois do filtro
                    if (!nome) {
                        pokemons = pokemons.slice(
                            offset,
                            offset + 32
                        );
                    }
                }

                return pokemons.map((detalhe): Pokemon => ({
                    id: detalhe.id,
                    name: detalhe.name,
                    types: detalhe.types.map(
                        (item) => item.type.name
                    ),
                    sprite: detalhe.sprites.front_default,
                }));
            })
        );
    }

    obterDadosPokemons(nome?: string) {

        const url = `https://pokeapi.co/api/v2/pokemon/${nome}`;

        return this.http.get<PokemonRespostaHttp>(url).pipe(

            map((detalhe): DadosPokemonResponse => ({
                id: detalhe.id,
                name: detalhe.name,
                types: detalhe.types.map(item => item.type.name),
                sprite: detalhe.sprites.front_default,

                stats: detalhe.stats.map(stat => ({
                    nome: stat.stat.name,
                    valor: stat.base_stat
                })),

                peso: detalhe.weight,

                habilidades: detalhe.abilities.map(
                    habilidade => habilidade.ability.name
                ),

                audio: detalhe.cries.latest ?? ''
            }))
        );
    }
}
