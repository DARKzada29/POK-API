import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonBadge,
  IonButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline, search } from 'ionicons/icons';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { PokemonService } from '../services/pokemon.service';
import { FavoritesService } from '../services/favorites.service';
import { Pokemon, PokemonDetail } from '../models/pokemon.interface';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonBadge,
    IonButton,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonToast
  ],
})
export class Tab1Page implements OnInit, OnDestroy {
  pokemons: PokemonDetail[] = [];
  filteredPokemons: PokemonDetail[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  currentOffset: number = 0;
  limit: number = 20;
  hasMoreData: boolean = true;
  showToast: boolean = false;
  toastMessage: string = '';

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {
    addIcons({ heart, heartOutline, search });
    this.setupSearch();
  }

  ngOnInit() {
    this.loadPokemons();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.filterPokemons(searchTerm);
    });
  }

  async loadPokemons(event?: any) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    try {
      const response = await this.pokemonService.getPokemonList(this.limit, this.currentOffset).toPromise();
      
      if (response) {
        const pokemonDetails = await this.pokemonService.getMultiplePokemonDetails(response.results).toPromise();
        
        if (pokemonDetails) {
          this.pokemons = [...this.pokemons, ...pokemonDetails];
          this.filterPokemons(this.searchTerm);
          this.currentOffset += this.limit;
          this.hasMoreData = response.next !== null;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar Pokémons:', error);
      this.showToastMessage('Erro ao carregar Pokémons. Tente novamente.');
    } finally {
      this.isLoading = false;
      if (event) {
        event.target.complete();
      }
    }
  }

  async doRefresh(event: any) {
    this.pokemons = [];
    this.filteredPokemons = [];
    this.currentOffset = 0;
    this.hasMoreData = true;
    
    await this.loadPokemons();
    event.target.complete();
  }

  onSearchInput(event: any) {
    const searchTerm = event.target.value;
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  private filterPokemons(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredPokemons = [...this.pokemons];
    } else {
      this.filteredPokemons = this.pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toString().includes(searchTerm)
      );
    }
  }

  getPokemonImageUrl(pokemon: PokemonDetail): string {
    return pokemon.sprites?.other?.['official-artwork']?.front_default ||
           pokemon.sprites?.front_default ||
           this.pokemonService.getPokemonImageUrl(pokemon.id);
  }

  getPokemonTypes(pokemon: PokemonDetail): string[] {
    return pokemon.types?.map(type => type.type.name) || [];
  }

  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return typeColors[type] || '#68A090';
  }

  isFavorite(pokemonId: number): boolean {
    return this.favoritesService.isFavorite(pokemonId);
  }

  toggleFavorite(pokemon: PokemonDetail, event: Event) {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(pokemon);
    
    const message = this.isFavorite(pokemon.id) 
      ? `${pokemon.name} adicionado aos favoritos!`
      : `${pokemon.name} removido dos favoritos!`;
    
    this.showToastMessage(message);
  }

  goToPokemonDetail(pokemon: PokemonDetail) {
    this.router.navigate(['/pokemon-detail', pokemon.id]);
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }

  trackByPokemonId(index: number, pokemon: PokemonDetail): number {
    return pokemon.id;
  }
}