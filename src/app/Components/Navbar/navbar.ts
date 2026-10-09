
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PokemonTipoService } from '../../../Services/pokemonTipo.service';
import { PokemonService } from '../../../Services/pokemon.service';

// ==========================================
// MODELOS
// ==========================================

interface ItemNavbar {
    titulo: string;
    link: string;
}

interface FormaAlternativa {
    titulo: string;
    sufixo: string;
}

// ==========================================
// COMPONENTE
// ==========================================

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, FormsModule],
    templateUrl: './navbar.html',
})
export class NavbarComponent {

    private readonly pokemonTipoService = inject(PokemonTipoService);
    private readonly pokemonService = inject(PokemonService);

    // ==========================================
    // ESTADOS DOS MENUS
    // ==========================================

    protected readonly menuAberto = signal(false);
    protected readonly tiposAberto = signal(false);
    protected readonly regioesAberto = signal(false);
    protected readonly formasRegionaisAberto = signal(false);
    protected readonly formasAlternativasAberto = signal(false);
    protected readonly listagemFavoritos = signal(false);



    // ==========================================
    // DADOS DA NAVEGAÇÃO
    // ==========================================

    protected readonly itens: ItemNavbar[] = [
        { titulo: 'Todos', link: '/pokedex' },
        { titulo: 'Kanto', link: '/pokedex/kanto' },
        { titulo: 'Johto', link: '/pokedex/johto' },
        { titulo: 'Hoenn', link: '/pokedex/hoenn' },
        { titulo: 'Sinnoh', link: '/pokedex/sinnoh' },
        { titulo: 'Unova', link: '/pokedex/unova' },
        { titulo: 'Kalos', link: '/pokedex/kalos' },
        { titulo: 'Alola', link: '/pokedex/alola' },
        { titulo: 'Galar', link: '/pokedex/galar' },
        { titulo: 'Paldea', link: '/pokedex/paldea' }
    ];

    protected readonly tipos: string[] = [
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

    protected readonly formasRegionais: string[] = [
        'Alola',
        'Galar',
        'Hisui',
        'Paldea'
    ];

    protected readonly formasAlternativas: FormaAlternativa[] = [
        { titulo: 'Mega Evolução', sufixo: '-mega' },
        { titulo: 'Gigantamax', sufixo: '-gmax' }
    ];

    // ==========================================
    // MENU MOBILE
    // ==========================================

    protected alternarMenu(): void {
        this.menuAberto.update(aberto => !aberto);
    }

    protected fecharMenu(): void {
        this.menuAberto.set(false);
    }

    // ==========================================
    // MENU DE TIPOS
    // ==========================================

    protected alternarTiposMenu(): void {
        this.tiposAberto.update(aberto => !aberto);
    }

    protected alternarTipo(tipo: string): void {
        this.pokemonTipoService.tiposSelecionados.update(tipos => {
            if (tipos.includes(tipo)) {
                return tipos.filter(item => item !== tipo);
            }

            return [...tipos, tipo];
        });
    }

    // ==========================================
    // MENU DE REGIÕES
    // ==========================================

    protected alternarRegioesMenu(): void {
        this.regioesAberto.update(aberto => !aberto);
    }

    protected fecharRegioesMenu(): void {
        this.regioesAberto.set(false);

    }

    // ==========================================
    // MENU DE FORMAS REGIONAIS
    // ==========================================

    protected alternarFormasRegionaisMenu(): void {
        this.formasRegionaisAberto.update(aberto => !aberto);
    }

    protected fecharFormasRegionaisMenu(): void {
        this.formasRegionaisAberto.set(false);
    }

    // ==========================================
    // MENU DE FORMAS ALTERNATIVAS
    // ==========================================

    protected alternarFormasAlternativasMenu(): void {
        this.formasAlternativasAberto.update(aberto => !aberto);
    }

    protected fecharFormasAlternativasMenu(): void {
        this.formasAlternativasAberto.set(false);
    }

    //=====================================================
    // BARRA DE PESQUISA
    //=====================================================

    pesquisa = '';

    protected pesquisar(): void {
        this.pokemonService.pesquisarPokemons(this.pesquisa);
    }
}