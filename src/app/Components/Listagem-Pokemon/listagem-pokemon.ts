import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map, switchMap } from 'rxjs';

import { FormaPokemon, PokemonService } from '../../../Services/pokemon.service';
import { PokemonTipoService } from '../../../Services/pokemonTipo.service';

// ======================================================
// MODELOS
// ======================================================

export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    sprite: string | null;
    spriteShiny: string | null;
    artwork: string | null;
    artworkShiny: string | null;
    formas: FormaPokemon[];
}

interface DadosFormaSelecionada {
    sprite: string | null;
    tipos: string[];
}

// ======================================================
// COMPONENTE
// ======================================================

@Component({
    selector: 'app-listagem-pokemon',
    imports: [RouterLink],
    templateUrl: './listagem-pokemon.html',
})
export class ListagemPokemon {

    // ==================================================
    // DEPENDÊNCIAS
    // ==================================================

    private readonly route = inject(ActivatedRoute);
    private readonly pokemonService = inject(PokemonService);
    private readonly pokemonTipoService = inject(PokemonTipoService);

    // ==================================================
    // ESTADO INTERNO
    // ==================================================

    private readonly offset = signal(0);

    private readonly formasSelecionadas =
        signal<Record<number, number>>({});

    private readonly dadosFormaSelecionada =
        signal<Record<string, DadosFormaSelecionada>>({});

    // ==================================================
    // PARÂMETROS DA ROTA
    // ==================================================

    protected readonly regiao = toSignal(
        this.route.paramMap.pipe(
            map((params) => params.get('regiao'))
        ),
        { initialValue: null }
    );

    protected readonly formaRegional = toSignal(
        this.route.paramMap.pipe(
            map((params) => params.get('formaRegional'))
        )
    );

    protected readonly formaAlternativa = toSignal(
        this.route.paramMap.pipe(
            map((params) => params.get('formaAlternativa'))
        )
    );

    // ==================================================
    // LISTAGEM DE POKÉMON
    // ==================================================

    protected readonly pokemon = toSignal(
        combineLatest([
            this.route.paramMap,
            toObservable(this.offset),
            toObservable(this.pokemonTipoService.tiposSelecionados),
        ]).pipe(
            switchMap(([params, offset, tipos]) => {
                const regiao = params.get('regiao');
                const formaRegional = params.get('formaRegional');
                const formaAlternativa = params.get('formaAlternativa');

                return this.pokemonService.obterPokemons(
                    regiao ?? undefined,
                    offset,
                    tipos,
                    formaRegional ?? undefined,
                    formaAlternativa ?? undefined
                );
            })
        ),
        { initialValue: [] }
    );

    protected readonly pokemonsFiltrados = computed(() => {
        const pokemons = this.pokemon();
        const tipos = this.pokemonTipoService.tiposSelecionados();

        if (tipos.length === 0 || !this.regiao()) {
            return pokemons;
        }

        return pokemons.filter((pokemon) =>
            tipos.some((tipo) => pokemon.types.includes(tipo))
        );
    });

    // ==================================================
    // PAGINAÇÃO
    // ==================================================

    protected proximaPagina(): void {
        this.offset.update((valor) => valor + 32);
        window.scrollTo(0, 0);
    }

    protected paginaAnterior(): void {
        this.offset.update((valor) => Math.max(0, valor - 32));
        window.scrollTo(0, 0);
    }

    // ==================================================
    // FORMATAÇÃO
    // ==================================================

    protected paraTitleCase(texto: string): string {
        return texto
            .toLowerCase()
            .replace(/\b\w/g, (letra) => letra.toUpperCase());
    }

    // ==================================================
    // FORMAS DOS POKÉMON
    // ==================================================

    protected alterarFormaPokemon(
        pokemon: Pokemon,
        direcao: number
    ): void {
        const indiceAtual = this.formasSelecionadas()[pokemon.id] ?? 0;
        const novoIndice = indiceAtual + direcao;
        const forma = pokemon.formas[novoIndice];

        if (!forma) {
            return;
        }

        this.formasSelecionadas.update((formas) => ({
            ...formas,
            [pokemon.id]: novoIndice,
        }));

        this.pokemonService
            .obterDadosPokemons(forma.nome)
            .subscribe((dados) => {
                this.dadosFormaSelecionada.update((formas) => ({
                    ...formas,
                    [forma.nome]: {
                        sprite: dados.sprite,
                        tipos: dados.types,
                    },
                }));
            });
    }
}