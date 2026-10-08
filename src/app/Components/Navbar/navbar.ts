import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PokemonTipoService } from '../../../Services/pokemonTipo.service';

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



    // ==========================================
    // ESTADO DO MENU MOBILE
    // ==========================================

    protected readonly menuAberto = signal(false);

    protected readonly tiposAberto = signal(false);

    protected readonly regioesAberto = signal(false);

    protected readonly formasRegionaisAberto = signal(false);

    protected readonly formasAlternativasAberto = signal(false);


    // ==========================================
    // ITENS DA NAVBAR
    // ==========================================

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


    // ==========================================
    // TIPOS DE POKÉMON
    // ==========================================

    tipos: string[] = [
        'normal',
        'fire',
        'water',
        'electric',
        'grass',
        'ice',
        'fighting',
        'poison',
        'ground',
        'flying',
        'psychic',
        'bug',
        'rock',
        'ghost',
        'dragon',
        'dark',
        'steel',
        'fairy'
    ];

    formasRegionais: string[] = [
        'Alola',
        'Galar',
        'Hisui',
        'Paldea'
    ];

    formasAlternativas = [
        {
            titulo: 'Mega Evolução',
            sufixo: '-mega'
        },
        {
            titulo: 'Gigantamax',
            sufixo: '-gmax'
        }
    ];

    private readonly pokemonTipoService = inject(PokemonTipoService);

    // ==========================================
    // MENU MOBILE
    // ==========================================

    protected alternarMenu(): void {
        this.menuAberto.update(
            (aberto) => !aberto
        );
    }

    protected fecharMenu(): void {
        this.menuAberto.set(false);
    }


    // ==========================================
    // MENU DE TIPOS
    // ==========================================

    protected alternarTiposMenu(): void {
        this.tiposAberto.update(
            (aberto) => !aberto
        );
    }

    protected alternarTipo(tipo: string): void {

        this.pokemonTipoService.tiposSelecionados.update((tipos) => {

            if (tipos.includes(tipo)) {

                return tipos.filter((item) => item !== tipo);

            } else {

                return [...tipos, tipo];

            }

        });

    }

    //=========================================
    // MENU REGIOES
    //========================================

    protected alternarRegioesMenu(): void {
        this.regioesAberto.update((aberto) => !aberto);

    }

    protected fecharRegioesMenu(): void {
        this.regioesAberto.set(false);

        window.scroll(0, 0);
    }

    //=========================================
    //MENU FORMAS REGIONAIS
    //=========================================

    protected alternarFormasRegionaisMenu(): void {
        this.formasRegionaisAberto.update((aberto) => !aberto);
    }

    protected fecharFormasRegionaisMenu(): void {
        this.formasRegionaisAberto.set(false);
    }

    //===========================================
    //MENU FORMAS ALTERNATIVAS
    //===========================================

    protected alternarFormasAlternativasMenu(): void {
        this.formasAlternativasAberto.update((aberto) => !aberto);

    }

    protected fecharFormasAlternativasMenu(): void {
        this.formasAlternativasAberto.set(false);
    }


}