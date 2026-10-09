
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritosService } from '../../../Services/pokemonFavorito.service';
import { TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-favoritos',
    standalone: true,
    imports: [RouterLink, TitleCasePipe],
    templateUrl: './favoritos.html',
})
export class FavoritosComponent {

    private readonly favoritosService = inject(FavoritosService);

    protected readonly favoritos = this.favoritosService.favoritos;
}