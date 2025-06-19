import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonChip,
  IonAvatar,
  IonImg
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  logoGithub, 
  logoLinkedin, 
  mail, 
  globe, 
  heart, 
  code, 
  phone,
  star,
  rocket,
  shield,
  refresh
} from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonChip,
    IonAvatar,
    IonImg
  ],
})
export class Tab3Page {
  appVersion = '1.0.0';
  buildDate = new Date().toLocaleDateString('pt-BR');
  
  technologies = [
    { name: 'Ionic', version: '7.x', color: 'primary' },
    { name: 'Angular', version: '17.x', color: 'danger' },
    { name: 'TypeScript', version: '5.x', color: 'warning' },
    { name: 'Capacitor', version: '5.x', color: 'success' }
  ];

  features = [
    {
      icon: 'search',
      title: 'Busca Avançada',
      description: 'Encontre Pokémons por nome ou número com busca em tempo real'
    },
    {
      icon: 'heart',
      title: 'Sistema de Favoritos',
      description: 'Salve seus Pokémons favoritos com persistência local'
    },
    {
      icon: 'phone',
      title: 'Design Responsivo',
      description: 'Interface adaptável para dispositivos móveis e desktop'
    },
    {
      icon: 'refresh',
      title: 'Paginação Infinita',
      description: 'Carregamento otimizado com scroll infinito'
    },
    {
      icon: 'star',
      title: 'Informações Detalhadas',
      description: 'Stats, habilidades, tipos e galeria de imagens'
    },
    {
      icon: 'shield',
      title: 'Offline Ready',
      description: 'Favoritos funcionam mesmo sem conexão'
    }
  ];

  constructor() {
    addIcons({ 
      logoGithub, 
      logoLinkedin, 
      mail, 
      globe, 
      heart, 
      code, 
      phone,
      star,
      rocket,
      shield,
      refresh
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  openEmail() {
    window.open('mailto:contato@pokedex.app', '_blank');
  }
}