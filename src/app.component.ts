import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService, Tab } from './services/store.service';
import { HomeComponent } from './components/home/home.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StatsComponent } from './components/stats/stats.component';
import { MomentsComponent } from './components/moments/moments.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HomeComponent, RewardsComponent, ProfileComponent, StatsComponent, MomentsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  store = inject(StoreService);

  setTab(tab: Tab) {
    this.store.activeTab.set(tab);
  }
}