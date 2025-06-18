import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonBackButton,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonBadge,
  IonProgressBar,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline, arrowBack, statsChart, information, images } from 'ionicons/icons';
import { Subject, takeUntil } from 'rxjs';

import { PokemonService } from '../services/pokemon.service';
import { FavoritesService } from '../services/favorites.service';
import { PokemonDetail, FlavorTextEntry } from '../models/pokemon.interface';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.page.html',
  styleUrls: ['./pokemon-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonBadge,
    IonProgressBar,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonToast
  ],
})
export class PokemonDetailPage implements OnInit, OnDestroy {
  pokemon: PokemonDetail | null = null;
  pokemonId: number = 0;
  isLoading: boolean = true;
  selectedSegment: string = 'about';
  showToast: boolean = false;
  toastMessage: string = '';
  pokemonDescription: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService
  ) {
    addIcons({ heart, heartOutline, arrowBack, statsChart, information, images });
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.pokemonId = +params['id'];
      if (this.pokemonId) {
        this.loadPokemonDetails();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadPokemonDetails() {
    this.isLoading = true;
    
    try {
      this.pokemon = await this.pokemonService.getCompletePokemonDetails(this.pokemonId).toPromise();
      
      if (this.pokemon?.species?.flavor_text_entries) {
        this.pokemonDescription = this.getDescription(this.pokemon.species.flavor_text_entries);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do Pokémon:', error);
      this.showToastMessage('Erro ao carregar detalhes do Pokémon');
    } finally {
      this.isLoading = false;
    }
  }

  private getDescription(flavorTexts: FlavorTextEntry[]): string {
    // Busca por descrição em português primeiro, depois inglês
    const ptDescription = flavorTexts.find(entry => 
      entry.language.name === 'pt' || entry.language.name === 'pt-BR'
    );
    
    if (ptDescription) {
      return ptDescription.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
    }

    const enDescription = flavorTexts.find(entry => entry.language.name === 'en');
    if (enDescription) {
      return enDescription.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
    }

    return 'Descrição não disponível.';
  }

  getPokemonImageUrl(): string {
    if (!this.pokemon) return '';
    return this.pokemon.sprites?.other?.['official-artwork']?.front_default ||
           this.pokemon.sprites?.front_default ||
           this.pokemonService.getPokemonImageUrl(this.pokemon.id);
  }

  getPokemonTypes(): string[] {
    return this.pokemon?.types?.map(type => type.type.name) || [];
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

  getStatName(statName: string): string {
    const statNames: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defesa',
      'special-attack': 'Atq. Esp.',
      'special-defense': 'Def. Esp.',
      'speed': 'Velocidade'
    };
    return statNames[statName] || statName;
  }

  getStatColor(statValue: number): string {
    if (statValue >= 100) return 'success';
    if (statValue >= 70) return 'warning';
    return 'danger';
  }

  isFavorite(): boolean {
    return this.pokemon ? this.favoritesService.isFavorite(this.pokemon.id) : false;
  }

  toggleFavorite() {
    if (this.pokemon) {
      this.favoritesService.toggleFavorite(this.pokemon);
      
      const message = this.isFavorite() 
        ? `${this.pokemon.name} adicionado aos favoritos!`
        : `${this.pokemon.name} removido dos favoritos!`;
      
      this.showToastMessage(message);
    }
  }

  goBack() {
    this.router.navigate(['/tabs/tab1']);
  }

  onSegmentChange(event: any) {
    this.selectedSegment = event.detail.value;
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }

  getPokemonSprites() {
    if (!this.pokemon?.sprites) return [];
    
    const sprites = [];
    
    if (this.pokemon.sprites.front_default) {
      sprites.push({
        url: this.pokemon.sprites.front_default,
        label: 'Frente'
      });
    }
    
    if (this.pokemon.sprites.back_default) {
      sprites.push({
        url: this.pokemon.sprites.back_default,
        label: 'Costas'
      });
    }
    
    if (this.pokemon.sprites.front_shiny) {
      sprites.push({
        url: this.pokemon.sprites.front_shiny,
        label: 'Shiny Frente'
      });
    }
    
    if (this.pokemon.sprites.back_shiny) {
      sprites.push({
        url: this.pokemon.sprites.back_shiny,
        label: 'Shiny Costas'
      });
    }

    if (this.pokemon.sprites.other?.dream_world?.front_default) {
      sprites.push({
        url: this.pokemon.sprites.other.dream_world.front_default,
        label: 'Dream World'
      });
    }
    
    return sprites;
  }
}
