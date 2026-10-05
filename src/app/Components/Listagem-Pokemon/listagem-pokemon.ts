import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
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

    protected readonly pokemon = toSignal(
        this.route.paramMap.pipe(
            switchMap((params) => {
                const regiao = params.get('regiao');

                return this.pokemonService.obterPokemons(regiao ?? undefined);
            })
        ),
        {
            initialValue: [],
        }
    );

    protected paraTitleCase(texto: string): string {
        return texto
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase());
    }
}