
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, from, map, mergeMap, Observable, switchMap, toArray } from 'rxjs';

import { Pokemon } from '../app/Components/Listagem-Pokemon/listagem-pokemon';
import {
    DadosPokemonResponse,
} from '../app/Components/Dados-Pokemon/dados-pokemon';

// ======================================================
// MODELOS DAS RESPOSTAS DA POKEAPI
// ======================================================

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

interface PokemonPorTipoRespostaHttp {
    readonly pokemon: {
        readonly pokemon: ResultadoObjetoHttp;
    }[];
}

interface PokemonSpeciesRespostaHttp {
    readonly varieties: {
        readonly is_default: boolean;
        readonly pokemon: {
            readonly name: string;
            readonly url: string;
        };
    }[];
}

interface PokemonRespostaHttp {
    readonly id: number;
    readonly name: string;

    readonly types: TipoPokemonRespostaHttp[];

    readonly species: {
        readonly name: string;
        readonly url: string;
    };

    readonly sprites: {
        readonly front_default: string | null;
        readonly front_shiny: string | null;

        readonly other: {
            readonly 'official-artwork': {
                readonly front_default: string | null;
                readonly front_shiny: string | null;
            };
        };
    };

    readonly stats: EstatisticaPokemonRespostaHttp[];
    readonly weight: number;
    readonly height: number;
    readonly abilities: HabilidadePokemonRespostaHttp[];
    readonly cries: SomPokemonRespostaHttp;
}

interface Regiao {
    nome: string;
    inicio: number;
    quantidade: number;
}

export interface FormaPokemon {
    nome: string;
}

interface PokemonComEspecie {
    detalhe: PokemonRespostaHttp;
    species: PokemonSpeciesRespostaHttp;
}

// ======================================================
// REGIÕES
// ======================================================

const regioes: Regiao[] = [
    { nome: 'Kanto', inicio: 1, quantidade: 151 },
    { nome: 'Johto', inicio: 152, quantidade: 100 },
    { nome: 'Hoenn', inicio: 252, quantidade: 135 },
    { nome: 'Sinnoh', inicio: 387, quantidade: 108 },
    { nome: 'Unova', inicio: 495, quantidade: 155 },
    { nome: 'Kalos', inicio: 650, quantidade: 72 },
    { nome: 'Alola', inicio: 722, quantidade: 88 },
    { nome: 'Galar', inicio: 810, quantidade: 96 },
    { nome: 'Paldea', inicio: 906, quantidade: 120 },
];

// ======================================================
// SERVIÇO
// ======================================================

@Injectable({
    providedIn: 'root',
})
export class PokemonService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl = 'https://pokeapi.co/api/v2';

    private readonly quantidadePorPagina = 32;

    // ==================================================
    // LISTAGEM DE POKÉMON
    // ==================================================

    obterPokemons(
        nome?: string,
        offset = 0,
        tipos?: string[],
        formaRegional?: string,
        formaAlternativa?: string
    ) {
        if (formaRegional || formaAlternativa) {
            return this.obterPokemonsPorForma(
                tipos,
                formaRegional,
                formaAlternativa
            );
        }

        // Pesquisa diretamente os Pokémon dos tipos selecionados
        if (!nome && tipos && tipos.length > 0) {
            return forkJoin(
                tipos.map((tipo) =>
                    this.http.get<PokemonPorTipoRespostaHttp>(
                        `${this.apiUrl}/type/${tipo}`
                    )
                )
            ).pipe(
                map((respostas) => {
                    const unicos = new Map<string, ResultadoObjetoHttp>();

                    respostas.forEach((resposta) =>
                        resposta.pokemon.forEach(({ pokemon }) =>
                            unicos.set(pokemon.name, pokemon)
                        )
                    );

                    return [...unicos.values()]
                        .sort((a, b) => {
                            const idA = Number(a.url.split('/').filter(Boolean).at(-1));
                            const idB = Number(b.url.split('/').filter(Boolean).at(-1));

                            return idA - idB;
                        })
                        .slice(offset, offset + this.quantidadePorPagina);
                }),

                switchMap((resultados) =>
                    from(resultados).pipe(
                        mergeMap(
                            (resultado) =>
                                this.buscarPokemonsComEspecie([resultado]).pipe(
                                    map((pokemons) => pokemons[0])
                                ),
                            6
                        ),
                        toArray()
                    )
                ),

                map((pokemons) =>
                    pokemons
                        .filter((pokemon) =>
                            pokemon.detalhe.types.some((item) =>
                                tipos.includes(item.type.name)
                            )
                        )
                        .sort((a, b) => a.detalhe.id - b.detalhe.id)
                        .map((pokemon) => this.converterParaPokemon(pokemon))
                )
            );
        }

        // Listagem normal ou por região
        const url = this.obterUrlListagem(nome, offset, tipos);

        return this.http.get<ObjetoRespostaHttp>(url).pipe(
            switchMap((resposta) =>
                from(resposta.results).pipe(
                    mergeMap(
                        (resultado) =>
                            this.buscarPokemonsComEspecie([resultado]).pipe(
                                map((pokemons) => pokemons[0])
                            ),
                        6
                    ),
                    toArray()
                )
            ),

            map((pokemons) => {
                const resultado = this.filtrarPorTipo(pokemons, tipos);

                return resultado.map((pokemon) =>
                    this.converterParaPokemon(pokemon)
                );
            })
        );
    }

    // ==================================================
    // CONSTRUÇÃO DA URL DA LISTAGEM
    // ==================================================

    private obterUrlListagem(
        nome?: string,
        offset = 0,
        tipos?: string[]
    ): string {
        if (nome) {
            const regiao = regioes.find(
                (item) =>
                    item.nome.toLowerCase() === nome.toLowerCase()
            );

            if (!regiao) {
                throw new Error('Região não encontrada.');
            }

            return (
                `${this.apiUrl}/pokemon` +
                `?offset=${regiao.inicio - 1}` +
                `&limit=${regiao.quantidade}`
            );
        }

        // Para filtrar por tipo, precisamos buscar a lista completa
        if (tipos && tipos.length > 0) {
            return `${this.apiUrl}/pokemon?limit=100000`;
        }

        return (
            `${this.apiUrl}/pokemon` +
            `?offset=${offset}` +
            `&limit=${this.quantidadePorPagina}`
        );
    }

    // ==================================================
    // LISTAGEM DE FORMAS REGIONAIS E ALTERNATIVAS
    // ==================================================

    private obterPokemonsPorForma(
        tipos?: string[],
        formaRegional?: string,
        formaAlternativa?: string
    ) {
        const url = `${this.apiUrl}/pokemon?limit=100000`;

        return this.http.get<ObjetoRespostaHttp>(url).pipe(
            map((resposta) =>
                resposta.results.filter((pokemon) =>
                    this.correspondeAForma(
                        pokemon.name,
                        formaRegional,
                        formaAlternativa
                    )
                )
            ),

            switchMap((pokemons) =>
                this.buscarPokemonsComEspecie(pokemons)
            ),

            map((pokemons) =>
                this.filtrarPorTipo(pokemons, tipos).map((pokemon) =>
                    this.converterParaPokemon(pokemon)
                )
            )
        );
    }

    private correspondeAForma(
        nome: string,
        formaRegional?: string,
        formaAlternativa?: string
    ): boolean {
        if (formaRegional) {
            return nome.endsWith(
                `-${formaRegional.toLowerCase()}`
            );
        }

        if (formaAlternativa === 'mega') {
            return nome.includes('-mega');
        }

        if (formaAlternativa) {
            return nome.endsWith(
                `-${formaAlternativa.toLowerCase()}`
            );
        }

        return false;
    }

    //====================================================
    //PESQUISA DE POKEMON POR NOME E NUMERO
    //====================================================
    termoPesquisa = signal('');

    pesquisarPokemons(termo: string): void {

        this.termoPesquisa.set(
            termo.trim().toLowerCase()
        );
    }

    obterPesquisa(): Observable<Pokemon[]> {
        const url = `${this.apiUrl}/pokemon?limit=100000`;

        return this.http.get<ObjetoRespostaHttp>(url).pipe(
            map((resposta) =>
                resposta.results.filter((pokemon) => {
                    const termo = this.termoPesquisa();

                    return (
                        pokemon.name.includes(termo) ||
                        pokemon.url.split('/').filter(Boolean).at(-1)?.includes(termo)
                    );
                })
            ),

            switchMap((resultados) =>
                from(resultados).pipe(
                    mergeMap(
                        (resultado) =>
                            this.http.get<PokemonRespostaHttp>(resultado.url),
                        6
                    ),
                    map((detalhe) => ({
                        id: detalhe.id,
                        name: detalhe.name,
                        types: detalhe.types.map((tipo) => tipo.type.name),
                        sprite: detalhe.sprites.front_default,
                        spriteShiny: detalhe.sprites.front_shiny,
                        artwork: detalhe.sprites.other['official-artwork'].front_default,
                        artworkShiny: detalhe.sprites.other['official-artwork'].front_shiny,
                        formas: [],
                    } satisfies Pokemon)),
                    toArray(),
                    map((pokemons) => pokemons.sort((a, b) => a.id - b.id))
                )
            )
        );
    }

    // ==================================================
    // BUSCA DOS DADOS COMPLETOS DOS POKÉMON
    // ==================================================

    private buscarPokemonsComEspecie(
        pokemons: ResultadoObjetoHttp[]
    ) {
        return forkJoin(
            pokemons.map((pokemon) =>
                this.http.get<PokemonRespostaHttp>(pokemon.url).pipe(
                    switchMap((detalhe) =>
                        this.http
                            .get<PokemonSpeciesRespostaHttp>(
                                detalhe.species.url
                            )
                            .pipe(
                                map((species) => ({
                                    detalhe,
                                    species,
                                }))
                            )
                    )
                )
            )
        );
    }

    // ==================================================
    // FILTRO POR TIPO
    // ==================================================

    private filtrarPorTipo(
        pokemons: PokemonComEspecie[],
        tipos?: string[]
    ): PokemonComEspecie[] {
        if (!tipos || tipos.length === 0) {
            return pokemons;
        }

        return pokemons.filter((pokemon) =>
            pokemon.detalhe.types.some((item) =>
                tipos.includes(item.type.name)
            )
        );
    }

    // ==================================================
    // CONVERSÃO PARA O MODELO DA APLICAÇÃO
    // ==================================================

    private converterParaPokemon(
        pokemon: PokemonComEspecie
    ): Pokemon {
        const detalhe = pokemon.detalhe;

        return {
            id: detalhe.id,
            name: detalhe.name,

            types: detalhe.types.map(
                (item) => item.type.name
            ),

            sprite: detalhe.sprites.front_default,
            spriteShiny: detalhe.sprites.front_shiny,

            artwork:
                detalhe.sprites.other['official-artwork'].front_default,

            artworkShiny:
                detalhe.sprites.other['official-artwork'].front_shiny,

            formas: pokemon.species.varieties
                .filter((variedade) =>
                    this.ehFormaBaseOuVariedadePermitida(
                        variedade.pokemon.name
                    )
                )
                .map((variedade) => ({
                    nome: variedade.pokemon.name,
                })),
        };
    }

    private ehFormaBaseOuVariedadePermitida(nome: string): boolean {
        return (
            !nome.includes('-alola') &&
            !nome.includes('-galar') &&
            !nome.includes('-hisui') &&
            !nome.includes('-paldea') &&
            !nome.includes('-mega') &&
            !nome.endsWith('-gmax')
        );
    }

    // ==================================================
    // DETALHES DE UM POKÉMON
    // ==================================================

    obterDadosPokemons(nome?: string) {
        const url = `${this.apiUrl}/pokemon/${nome}`;

        return this.http.get<PokemonRespostaHttp>(url).pipe(
            switchMap((detalhe) =>
                this.http
                    .get<PokemonSpeciesRespostaHttp>(
                        detalhe.species.url
                    )
                    .pipe(
                        map((species) => ({
                            detalhe,
                            species,
                        }))
                    )
            ),

            map(({ detalhe, species }): DadosPokemonResponse => ({
                ...this.converterParaPokemon({
                    detalhe,
                    species,
                }),

                stats: detalhe.stats.map((stat) => ({
                    nome: stat.stat.name,
                    valor: stat.base_stat,
                })),

                peso: detalhe.weight,
                altura: detalhe.height,

                habilidades: detalhe.abilities.map(
                    (habilidade) => habilidade.ability.name
                ),

                audio: detalhe.cries.latest ?? '',
            }))
        );
    }
}
