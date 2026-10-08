import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { PokemonService } from '../../../Services/pokemon.service';
import { Pokemon } from '../Listagem-Pokemon/listagem-pokemon';

export interface DadosPokemonResponse extends Pokemon {
    stats: {
        nome: string;
        valor: number;
    }[];
    peso: number;
    altura: number;
    habilidades: string[];
    audio: string;
}

@Component({
    selector: 'app-dados-pokemon',
    imports: [RouterLink],
    templateUrl: './dados-pokemon.html',
})
export class DadosPokemon {

    private readonly route = inject(ActivatedRoute);
    private readonly pokemonService = inject(PokemonService);

    private readonly shiny = signal(false);
    private readonly artwork = signal(false);

    protected readonly pokemon = toSignal(
        this.route.paramMap.pipe(
            map((params) => params.get('nome')),
            switchMap((nomePokemon) =>
                this.pokemonService.obterDadosPokemons(
                    nomePokemon ?? undefined
                )
            )
        ),
        {
            initialValue: null
        }
    );

    protected alternarShiny(): void {
        this.shiny.update((valor) => !valor);

    }

    protected alternarArtWork(): void {
        this.artwork.update((valor) => !valor);
    }
}