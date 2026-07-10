import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { LeagueSelectionService } from './league-selection.service';

@Component({
  selector: 'app-league-select',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './league-select.html',
  styleUrls: ['./league-select.css'],
})
export class LeagueSelect {
  private selectionService = inject(LeagueSelectionService);

  get selectedCountry(): string {
    return this.selectionService.selectedCountry();
  }
  set selectedCountry(val: string) {
    this.selectionService.selectedCountry.set(val);
  }

  get selectedLeague(): string {
    return this.selectionService.selectedLeague();
  }
  set selectedLeague(val: string) {
    this.selectionService.selectedLeague.set(val);
  }

  leaguesByCountry: Record<string, string[]> = {
    austria: ['Bundesliga', '2. Liga'],
    croatia: ['NHS', 'Prva'],
    england: ['Premier League', 'Championship'],
    france: ['Ligue 1', 'Ligue 2'],
    germany: ['Bundesliga', '2. Bundesliga'],
  };

  constructor() {
    this.onCountryChange();
  }

  get availableLeagues(): string[] {
    return this.leaguesByCountry[this.selectedCountry] || [];
  }

  onCountryChange(country: string = this.selectedCountry): void {
    this.selectedCountry = country;
    const leagues = this.availableLeagues;
    this.selectedLeague = leagues.length > 0 ? leagues[0] : '';
    console.log(`[LeagueSelect] Country changed to: "${country}". Available leagues:`, leagues);
    console.log(`[LeagueSelect] Selected league defaulted to: "${this.selectedLeague}"`);
  }

  onLeagueChange(league: string): void {
    this.selectedLeague = league;
    console.log(`[LeagueSelect] League changed to: "${league}"`);
  }

  trackByLeague(index: number, league: string): string {
    return league;
  }
}
