import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LeagueSelectionService {
  selectedCountry = signal<string>('austria');
  selectedLeague = signal<string>('Bundesliga');
}
