import { Component, signal } from '@angular/core';
import { NavbarComponent } from './Components/Navbar/navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [NavbarComponent, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('pokedex');
}
