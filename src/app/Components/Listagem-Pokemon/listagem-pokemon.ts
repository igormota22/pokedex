import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, switchMap } from 'rxjs';
import { FormaPokemon, PokemonService } from '../../../Services/pokemon.service';
import { PokemonTipoService } from '../../../Services/pokemonTipo.service';

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

@Component({
    selector: 'app-listagem-pokemon',
    imports: [RouterLink],
    templateUrl: './listagem-pokemon.html',
})
export class ListagemPokemon {

    private readonly route = inject(ActivatedRoute);

    private readonly pokemonService = inject(PokemonService);

    private readonly pokemonTipoService = inject(PokemonTipoService);

    private readonly offset = signal(0);

    private readonly formasSelecionadas = signal<Record<number, number>>({});

    private readonly dadosFormaSelecionada = signal<Record<string, DadosFormaSelecionada>>({});

    protected readonly pokemonsFiltrados = computed(() => {

        const tipos = this.pokemonTipoService.tiposSelecionados();

        if (tipos.length === 0) {
            return this.pokemon();
        }

        if (!this.regiao()) {
            return this.pokemon();
        }

        return this.pokemon().filter((pokemon) =>
            tipos.some((tipo) => pokemon.types.includes(tipo))
        );
    });

    //=========================================
    //EXPOE A REGIAO PARA O COMPONENTE HTML
    //=========================================
    protected readonly regiao = toSignal(
        this.route.paramMap.pipe(
            map((params) => params.get('regiao'))
        ),
        {
            initialValue: null
        }
    );

    protected readonly formaRegional = toSignal(
        this.route.paramMap.pipe(
            map((params) => params.get('formaRegional'))
        )
    )

    protected readonly formaAlternativa = toSignal(
        this.route.paramMap.pipe(
            map((params) => params.get('formaAlternativa'))
        )
    )

    protected readonly pokemon = toSignal(
        combineLatest([
            this.route.paramMap,
            toObservable(this.offset),
            toObservable(this.pokemonTipoService.tiposSelecionados)
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

    protected proximaPagina(): void {
        this.offset.update(
            (valor) => valor + 32
        );

        window.scrollTo(0, 0);
    }

    protected paginaAnterior(): void {
        this.offset.update(
            (valor) => valor - 32
        );

        window.scrollTo(0, 0);
    }

    protected paraTitleCase(texto: string): string {
        return texto
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase());
    }

    protected alterarFormaPokemon(
        pokemon: Pokemon,
        direcao: number
    ): void {

        const indiceAtual =
            this.formasSelecionadas()[pokemon.id] ?? 0;

        const novoIndice = indiceAtual + direcao;

        const forma =
            pokemon.formas[novoIndice];

        if (!forma) {
            return;
        }

        this.formasSelecionadas.update((formas) => ({
            ...formas,
            [pokemon.id]: novoIndice
        }));

        this.pokemonService
            .obterDadosPokemons(forma.nome)
            .subscribe((dados) => {

                this.dadosFormaSelecionada.update((formas) => ({
                    ...formas,
                    [forma.nome]: {
                        sprite: dados.sprite,
                        tipos: dados.types
                    }
                }));

            });
    }
}