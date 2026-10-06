import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface ItemNavbar {
    titulo: string;
    link: string;
}

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.html',
})
export class NavbarComponent {

    protected readonly menuAberto = signal(false);

    itens: ItemNavbar[] = [
        {
            titulo: 'Todos',
            link: '/pokedex'
        },

        {
            titulo: 'Kanto',
            link: '/pokedex/kanto'
        },
        {
            titulo: 'Johto',
            link: '/pokedex/johto'
        },
        {
            titulo: 'Hoenn',
            link: '/pokedex/hoenn'
        },
        {

            titulo: 'Sinnoh',
            link: '/pokedex/sinnoh'
        },
        {
            titulo: 'Unova',
            link: '/pokedex/unova'
        },
        {
            titulo: 'Kalos',
            link: '/pokedex/kalos'
        },
        {
            titulo: 'Alola',
            link: '/pokedex/alola'
        },
        {
            titulo: 'Galar',
            link: '/pokedex/galar'
        },
        {
            titulo: 'Paldea',
            link: '/pokedex/paldea'
        }
    ];

    protected alternarMenu(): void {
        this.menuAberto.update(
            (aberto) => !aberto
        );
    }

    protected fecharMenu(): void {
        this.menuAberto.set(false);
    }
}