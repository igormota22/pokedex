
import { Injectable, signal } from '@angular/core';

interface PokemonFavorito {
    id: number;
    nome: string;
    spriteUrl: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class FavoritosService {

    private readonly _favoritos = signal<PokemonFavorito[]>(
        this.carregarFavoritos()
    );

    readonly favoritos = this._favoritos.asReadonly();

    private carregarFavoritos(): PokemonFavorito[] {
        return JSON.parse(
            localStorage.getItem('favoritos') ?? '[]'
        );
    }

    private salvarFavoritos(): void {
        localStorage.setItem(
            'favoritos',
            JSON.stringify(this._favoritos())
        );
    }

    alternarFavorito(pokemon: PokemonFavorito): void {
        this._favoritos.update((favoritosAtuais) => {

            const jaFavoritado = favoritosAtuais.some(
                (favorito) => favorito.id === pokemon.id
            );

            if (jaFavoritado) {
                return favoritosAtuais.filter(
                    (favorito) => favorito.id !== pokemon.id
                );
            }

            return [...favoritosAtuais, pokemon];
        });

        this.salvarFavoritos();
    }

    verificarFavorito(id: number): boolean {
        return this._favoritos().some(
            (favorito) => favorito.id === id
        );
    }
}