import { Component, inject, computed, signal, effect } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { LeagueSelectionService } from '../league-select/league-selection.service';
import { PlayerStatsService } from '../stat-inputs/player-stats.service';
import { ClubDatasetService, ClubDataset } from '../../services/club-dataset.service';
import { ClubEvaluationService } from '../../services/club-evaluation.service';
import { AnimationSettingsService } from '../../services/animation-settings.service';

export interface DisplayRow {
  quality: string;
  name: string;
  avg: string;
  isPlaceholder: boolean;
}

const SCRAMBLE_CHARS =
  '@#$%&*!?+<>=/|^~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

@Component({
  selector: 'app-club-display',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './club-display.html',
  styleUrl: './club-display.css',
})
export class ClubDisplay {
  private selectionService = inject(LeagueSelectionService);
  private stats = inject(PlayerStatsService);
  private datasetService = inject(ClubDatasetService);
  private evaluator = inject(ClubEvaluationService);
  private animationSettings = inject(AnimationSettingsService);

  private dataset = signal<ClubDataset | null>(null);

  // Display text for each row's name cell, driven by the scramble animation
  displayNames = signal<string[]>(Array(22).fill(''));
  private scrambleTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.datasetService
        .load()
        .then((ds) => this.dataset.set(ds))
        .catch(() => {});
    }

    effect(() => {
      const rows = this.displayedRows();
      // Also read the toggle so turning it off cancels/reveals immediately
      const enabled = this.animationSettings.scrambleEnabled();
      this.animateNames(rows.map((r) => r.name), enabled);
    });
  }

  // Evaluated clubs for the active role, country, league and user reputation
  evaluatedClubs = computed(() => {
    const ds = this.dataset();
    if (!ds) {
      return [];
    }
    return this.evaluator.evaluate(
      ds,
      this.stats.selectedRole(),
      this.stats.averageRating(),
      this.selectionService.selectedCountry(),
      this.selectionService.selectedLeague()
    );
  });

  // Dynamically computes rows to display (at least 22 rows: either actual clubs or empty placeholders)
  displayedRows = computed<DisplayRow[]>(() => {
    const clubs = this.evaluatedClubs();
    const rows: DisplayRow[] = [];

    if (clubs.length > 0) {
      for (const club of clubs) {
        rows.push({
          quality: this.formatPercent(club.playPercent),
          name: club.name,
          avg: club.avgReputation.toFixed(1),
          isPlaceholder: false
        });
      }
    } else {
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

  // Dynamically computes the best club in the active league (highest XP-Score)
  bestClub = computed<string>(() => {
    const clubs = this.evaluatedClubs();
    return clubs.length > 0 ? clubs[0].name : '';
  });

  private formatPercent(pct: number): string {
    const rounded = Math.round(pct * 100) / 100;
    return rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  }

  private animateNames(target: string[], enabled: boolean): void {
    if (this.scrambleTimer) {
      clearInterval(this.scrambleTimer);
      this.scrambleTimer = null;
    }

    if (!enabled) {
      this.displayNames.set(target);
      return;
    }

    const start = Date.now();
    const duration = 400;
    this.displayNames.set(target.map((n) => this.scramble(n, 0)));
    const timer = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / duration);
      this.displayNames.set(target.map((n) => this.scramble(n, p)));
      if (p >= 1) {
        clearInterval(timer);
        this.scrambleTimer = null;
        this.displayNames.set(target);
      }
    }, 25);
    this.scrambleTimer = timer;
  }

  private scramble(text: string, progress: number): string {
    const resolved = Math.floor(text.length * progress);
    let out = '';
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        out += ' ';
      } else if (i < resolved) {
        out += text[i];
      } else {
        out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }
    return out;
  }
}
