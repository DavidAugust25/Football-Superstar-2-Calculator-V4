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
    belgium: ['Jupiler Pro League', 'Challenger Pro League', '1ste Nationale VV'],
    croatia: ['SuperSport HNL', 'Prva Nogometna Liga'],
    cyprus: ['Cyprus League'],
    czech: ['Chance Liga', 'Chance Narodni Liga'],
    denmark: ['Superliga', '1.Division', '2.Division'],
    england: ['Premier League', 'Championship', 'League One', 'League Two', 'National League'],
    france: ['Ligue 1', 'Ligue 2', 'Championnat National'],
    germany: ['Bundesliga', '2. Bundesliga', '3. Liga'],
    greece: ['Super League 1'],
    hungary: ['Nemzeti Bajnoksag', 'Nemzeti Bajnoksag II'],
    ireland: ['Premier Division', 'First Division'],
    italy: ['Serie A', 'Serie B'],
    netherlands: ['Eredivisie', 'Keuken Kampioen Divisie', 'Tweede Divisie'],
    northern_ireland: ['Premiership', 'Championship'],
    norway: ['Eliteserien', 'OBOS-ligaen'],
    poland: ['PKO Ekstraklasa', '1 Liga', '2 Liga'],
    portugal: ['Liga Portugal', 'Liga Portugal 2'],
    romania: ['Superliga', 'Liga 2'],
    russia: ['Premier Liga', '1.Division'],
    scotland: ['Premiership', 'Championship', 'League One', 'League Two'],
    serbia: ['Super Liga Srbije', 'Prva liga Srbije'],
    spain: ['LaLiga', 'LaLiga'],
    sweden: ['Allsvenskan', 'Superettan'],
    switzerland: ['Super League', 'Challenge League', 'Promotion League'],
    turkey: ['Super Lig', '1.Lig'],
    ukraine: ['Premier Liga', 'Persha Liga'],
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
