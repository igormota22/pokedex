import { ActivatedRoute } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, switchMap } from 'rxjs';
import { PokemonService } from '../../../Services/pokemon.service';

export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    sprite: string | null;
}

@Component({
    selector: 'app-listagem-pokemon',
    imports: [],
    templateUrl: './listagem-pokemon.html',
})
export class ListagemPokemon {

    private readonly route = inject(ActivatedRoute);

    private readonly pokemonService = inject(PokemonService);

    private readonly offset = signal(0);

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

    protected readonly pokemon = toSignal(
        combineLatest([
            this.route.paramMap,
            toObservable(this.offset)
        ]).pipe(
            switchMap(([params, offset]) => {

                //============================================================
                //PARAMETRO QUE DEFINE SE HAVERA ALGUM FILTRO NA LISTAGEM
                //==============================================================
                const regiao = params.get('regiao');

                return this.pokemonService.obterPokemons(
                    regiao ?? undefined,
                    offset
                );
            })
        ),
        {
            initialValue: [],
        }
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