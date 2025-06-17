import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pokemon, PokemonDetail } from '../models/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'pokemon-favorites';
  private favoritesSubject = new BehaviorSubject<PokemonDetail[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFavorites();
  }

  /**
   * Carrega os favoritos do localStorage
   */
  private loadFavorites(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const favorites = JSON.parse(stored);
        this.favoritesSubject.next(favorites);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      this.favoritesSubject.next([]);
    }
  }

  /**
   * Salva os favoritos no localStorage
   */
  private saveFavorites(favorites: PokemonDetail[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      this.favoritesSubject.next(favorites);
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }

  /**
   * Adiciona um Pokémon aos favoritos
   */
  addToFavorites(pokemon: PokemonDetail): void {
    const currentFavorites = this.favoritesSubject.value;
    const isAlreadyFavorite = currentFavorites.some(fav => fav.id === pokemon.id);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...currentFavorites, pokemon];
      this.saveFavorites(updatedFavorites);
    }
  }

  /**
   * Remove um Pokémon dos favoritos
   */
  removeFromFavorites(pokemonId: number): void {
    const currentFavorites = this.favoritesSubject.value;
    const updatedFavorites = currentFavorites.filter(fav => fav.id !== pokemonId);
    this.saveFavorites(updatedFavorites);
  }

  /**
   * Verifica se um Pokémon está nos favoritos
   */
  isFavorite(pokemonId: number): boolean {
    return this.favoritesSubject.value.some(fav => fav.id === pokemonId);
  }

  /**
   * Obtém todos os favoritos
   */
  getFavorites(): PokemonDetail[] {
    return this.favoritesSubject.value;
  }

  /**
   * Obtém o número de favoritos
   */
  getFavoritesCount(): number {
    return this.favoritesSubject.value.length;
  }

  /**
   * Limpa todos os favoritos
   */
  clearFavorites(): void {
    this.saveFavorites([]);
  }

  /**
   * Alterna o status de favorito de um Pokémon
   */
  toggleFavorite(pokemon: PokemonDetail): void {
    if (this.isFavorite(pokemon.id)) {
      this.removeFromFavorites(pokemon.id);
    } else {
      this.addToFavorites(pokemon);
    }
  }
}

