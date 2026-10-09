import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { PokemonService } from '../../../Services/pokemon.service';
import { Pokemon } from '../Listagem-Pokemon/listagem-pokemon';
import { FavoritosService } from '../../../Services/pokemonFavorito.service';
import { TitleCasePipe } from '@angular/common';

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
    imports: [RouterLink, TitleCasePipe],
    templateUrl: './dados-pokemon.html',
})
export class DadosPokemon {

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router)
    private readonly pokemonService = inject(PokemonService);
    private readonly favoritosService = inject(FavoritosService);

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

    private readonly idPokemonAtual = computed(
        () => this.pokemon()?.id ?? null
    );

    protected readonly pokemonAnterior = toSignal(
        toObservable(this.idPokemonAtual).pipe(
            distinctUntilChanged(),
            switchMap((id) => {
                if (id === null || id <= 1) {
                    return of(null);
                }

                return this.pokemonService.obterDadosPokemons(
                    String(id - 1)
                );
            })
        ),
        { initialValue: null }
    );

    protected readonly pokemonProximo = toSignal(
        toObservable(this.idPokemonAtual).pipe(
            distinctUntilChanged(),
            switchMap((id) => {
                if (id === null) {
                    return of(null);
                }

                return this.pokemonService.obterDadosPokemons(
                    String(id + 1)
                );
            })
        ),
        { initialValue: null }
    );

    protected alternarShiny(): void {
        this.shiny.update((valor) => !valor);

    }

    protected alternarArtWork(): void {
        this.artwork.update((valor) => !valor);
    }

    protected ehFavorito(id: number): boolean {
        return this.favoritosService.verificarFavorito(id);
    }

    protected alternarFavorito(): void {
        const dadosPokemon = this.pokemon();

        if (!dadosPokemon) {
            return;
        }

        this.favoritosService.alternarFavorito({
            id: dadosPokemon.id,
            nome: dadosPokemon.name,
            spriteUrl: dadosPokemon.sprite
        });
    }



    protected verAnterior(id: number): void {
        if (id <= 1) {
            return;
        }

        this.router.navigate(['/pokedex/pokemon', id - 1]);

    }

    protected verProximo(id: number): void {

        this.router.navigate(['/pokedex/pokemon', id + 1]);


    }
}