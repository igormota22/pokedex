import { Component, signal } from '@angular/core';
import { NavbarComponent } from './Components/Navbar/navbar';
import { ListagemPokemon } from './Components/Listagem-Pokemon/listagem-pokemon';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [NavbarComponent, ListagemPokemon, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('pokedex');
}
