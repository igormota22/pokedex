import { Injectable, signal } from "@angular/core";



@Injectable({
    providedIn: 'root'
})
export class PokemonTipoService {

    readonly tiposSelecionados = signal<string[]>([]);

}