import { Injectable } from '@angular/core';

const DATASET_URL = '/ClubDataset.json.gz';

export interface ClubDatasetMeta {
  game: string;
  version: string;
  season: number;
  totalPlayers: number;
  totalClubs: number;
  totalLeagues: number;
  totalCountries: number;
  totalNationalities: number;
  positions: string[];
  note: string;
}

export interface Manager {
  firstName: string;
  surname: string;
  age: string;
  position: string;
  reputation: number;
  nationality: string;
}

export interface Player {
  firstName: string;
  surname: string;
  age: string;
  position: string;
  reputation: number;
  nationality: string;
  club: string;
  league: string;
  country: string;
}

export interface Club {
  name: string;
  code: string;
  opponentBonus: number;
  stadium: string;
  capacity: string;
  manager: Manager | null;
  players: Player[];
}

export interface League {
  name: string;
  gamesPerSeason: number;
  competitionBonus: number;
  clubs: Club[];
}

export interface Country {
  code: string;
  name: string;
  leagues: League[];
}

export interface ClubDataset {
  meta: ClubDatasetMeta;
  countries: Country[];
}

@Injectable({
  providedIn: 'root',
})
export class ClubDatasetService {
  private dataset: Promise<ClubDataset> | null = null;

  load(): Promise<ClubDataset> {
    if (this.dataset === null) {
      this.dataset = this.fetchAndDecompress();
    }
    return this.dataset;
  }

  private async fetchAndDecompress(): Promise<ClubDataset> {
    if (typeof window === 'undefined') {
      throw new Error('ClubDatasetService.load() can only run in the browser');
    }

    const response = await fetch(DATASET_URL);
    if (!response.ok) {
      throw new Error(`Failed to load dataset: HTTP ${response.status}`);
    }

    let buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
      const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'));
      buffer = await new Response(stream).arrayBuffer();
    }
    const dataset = JSON.parse(new TextDecoder().decode(buffer)) as ClubDataset;
    return this.normalize(dataset);
  }

  private normalize(dataset: ClubDataset): ClubDataset {
    for (const country of dataset.countries) {
      for (const league of country.leagues) {
        for (const club of league.clubs) {
          if (club.manager) {
            club.manager.reputation = parseFloat(String(club.manager.reputation));
          }
          for (const player of club.players) {
            player.reputation = parseFloat(String(player.reputation));
          }
        }
      }
    }
    return dataset;
  }
}
