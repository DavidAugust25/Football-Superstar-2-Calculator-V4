import { Component, inject, computed } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { LeagueSelectionService } from '../league-select/league-selection.service';
import { CLUBS_BY_COUNTRY_LEAGUE, DisplayRow } from './clubs.data';

@Component({
  selector: 'app-club-display',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './club-display.html',
  styleUrl: './club-display.css',
})
export class ClubDisplay {
  private selectionService = inject(LeagueSelectionService);

  // Dynamically computes rows to display (exactly 22 rows: either actual clubs or empty placeholders)
  displayedRows = computed<DisplayRow[]>(() => {
    const country = this.selectionService.selectedCountry();
    const league = this.selectionService.selectedLeague();
    const key = `${country}:${league}`;
    const allClubs = CLUBS_BY_COUNTRY_LEAGUE[key] || [];

    // Filter by availability and sort by quality descending
    const availableClubs = allClubs
      .filter(club => club.availability)
      .sort((a, b) => b.quality - a.quality);

    const rows: DisplayRow[] = [];

    if (availableClubs.length > 0) {
      // Map available clubs to rows
      for (const club of availableClubs) {
        rows.push({
          quality: `${club.quality}%`,
          name: club.name,
          avg: club.averageRating.toString(),
          isPlaceholder: false
        });
      }
    } else {
      // Row 1: No clubs available
      rows.push({
        quality: '0',
        name: 'No clubs available',
        avg: '0',
        isPlaceholder: false
      });
    }

    // Pad table with placeholder rows up to 22 total items
    while (rows.length < 22) {
      rows.push({
        quality: '.',
        name: '',
        avg: '',
        isPlaceholder: true
      });
    }

    return rows;
  });

  // Dynamically computes the best club in the active league
  bestClub = computed<string>(() => {
    const country = this.selectionService.selectedCountry();
    const league = this.selectionService.selectedLeague();
    const key = `${country}:${league}`;
    const allClubs = CLUBS_BY_COUNTRY_LEAGUE[key] || [];

    const availableClubs = allClubs
      .filter(club => club.availability)
      .sort((a, b) => b.quality - a.quality);

    return availableClubs.length > 0 ? availableClubs[0].name : '';
  });
}
