import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Pokemon, PokemonListResponse, PokemonDetail, PokemonSpecies } from '../models/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  /**
   * Busca uma lista paginada de Pokémons
   */
  getPokemonList(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  /**
   * Busca detalhes de um Pokémon específico
   */
  getPokemonDetails(nameOrId: string | number): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }

  /**
   * Busca informações da espécie do Pokémon
   */
  getPokemonSpecies(nameOrId: string | number): Observable<PokemonSpecies> {
    return this.http.get<PokemonSpecies>(`${this.baseUrl}/pokemon-species/${nameOrId}`);
  }

  /**
   * Busca detalhes completos de um Pokémon incluindo informações da espécie
   */
  getCompletePokemonDetails(nameOrId: string | number): Observable<PokemonDetail> {
    return this.getPokemonDetails(nameOrId).pipe(
      switchMap(pokemon => {
        return this.getPokemonSpecies(pokemon.id).pipe(
          map(species => ({
            ...pokemon,
            species: species
          }))
        );
      })
    );
  }

  /**
   * Busca detalhes de múltiplos Pokémons
   */
  getMultiplePokemonDetails(pokemonList: Pokemon[]): Observable<PokemonDetail[]> {
    const requests = pokemonList.map(pokemon => 
      this.getPokemonDetails(this.extractIdFromUrl(pokemon.url))
    );
    return forkJoin(requests);
  }

  /**
   * Busca Pokémons por tipo
   */
  getPokemonByType(type: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/type/${type}`);
  }

  /**
   * Busca todos os tipos de Pokémon
   */
  getPokemonTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/type`);
  }

  /**
   * Extrai o ID do Pokémon da URL
   */
  private extractIdFromUrl(url: string): number {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }

  /**
   * Obtém a imagem principal do Pokémon
   */
  getPokemonImageUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  /**
   * Obtém a imagem alternativa do Pokémon
   */
  getPokemonSpriteUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }
}

