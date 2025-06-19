import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
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
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline, search, grid, list } from 'ionicons/icons';
import { Subject, takeUntil } from 'rxjs';

import { FavoritesService } from '../services/favorites.service';
import { PokemonDetail } from '../models/pokemon.interface';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
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
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonToast
  ],
})
export class Tab2Page implements OnInit, OnDestroy {
  favorites: PokemonDetail[] = [];
  filteredFavorites: PokemonDetail[] = [];
  searchTerm: string = '';
  viewMode: string = 'grid';
  selectedType: string = 'all';
  availableTypes: string[] = [];
  showToast: boolean = false;
  toastMessage: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private favoritesService: FavoritesService,
    private router: Router
  ) {
    addIcons({ heart, heartOutline, search, grid, list });
  }

  ngOnInit() {
    this.loadFavorites();
    this.subscribeToFavorites();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToFavorites() {
    this.favoritesService.favorites$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(favorites => {
      this.favorites = favorites;
      this.updateAvailableTypes();
      this.filterFavorites();
    });
  }

  private loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();
    this.updateAvailableTypes();
    this.filterFavorites();
  }

  private updateAvailableTypes() {
    const types = new Set<string>();
    this.favorites.forEach(pokemon => {
      pokemon.types?.forEach(type => {
        types.add(type.type.name);
      });
    });
    this.availableTypes = Array.from(types).sort();
  }

  onSearchInput(event: any) {
    this.searchTerm = event.target.value;
    this.filterFavorites();
  }

  onTypeChange(event: any) {
    this.selectedType = event.detail.value;
    this.filterFavorites();
  }

  onViewModeChange(event: any) {
    this.viewMode = event.detail.value;
  }

  private filterFavorites() {
    let filtered = [...this.favorites];

    // Filtrar por busca
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pokemon.id.toString().includes(this.searchTerm)
      );
    }

    // Filtrar por tipo
    if (this.selectedType !== 'all') {
      filtered = filtered.filter(pokemon =>
        pokemon.types?.some(type => type.type.name === this.selectedType)
      );
    }

    this.filteredFavorites = filtered;
  }

  getPokemonImageUrl(pokemon: PokemonDetail): string {
    return pokemon.sprites?.other?.['official-artwork']?.front_default ||
           pokemon.sprites?.front_default ||
           `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
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

  removeFromFavorites(pokemon: PokemonDetail, event: Event) {
    event.stopPropagation();
    this.favoritesService.removeFromFavorites(pokemon.id);
    this.showToastMessage(`${pokemon.name} removido dos favoritos!`);
  }

  goToPokemonDetail(pokemon: PokemonDetail) {
    this.router.navigate(['/pokemon-detail', pokemon.id]);
  }

  clearAllFavorites() {
    if (this.favorites.length > 0) {
      this.favoritesService.clearFavorites();
      this.showToastMessage('Todos os favoritos foram removidos!');
    }
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