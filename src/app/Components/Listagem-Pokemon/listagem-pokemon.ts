import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, switchMap } from 'rxjs';
import { PokemonService } from '../../../Services/pokemon.service';
import { PokemonTipoService } from '../../../Services/pokemonTipo.service';

export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    sprite: string | null;
}

@Component({
    selector: 'app-listagem-pokemon',
    imports: [RouterLink],
    templateUrl: './listagem-pokemon.html',
})
export class ListagemPokemon {

    private readonly route = inject(ActivatedRoute);

    private readonly pokemonService = inject(PokemonService);

    private readonly offset = signal(0);

    private readonly pokemonTipoService = inject(PokemonTipoService);

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


}