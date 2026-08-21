import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlayerStatsService {
  readonly STAT_COUNT = 30;

  ratings = signal<number[]>(Array(this.STAT_COUNT).fill(50));
  stars = signal<number[]>(Array(this.STAT_COUNT).fill(0));
  selectedRole = signal<string>('AT');

  averageRating = computed(() => {
    const r = this.ratings();
    return Math.round(r.reduce((a, b) => a + b, 0) / r.length * 100) / 100;
  });

  starCounts = computed(() => {
    const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    this.stars().forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  });

  updateRatings(ratings: number[]): void {
    this.ratings.set(ratings);
  }

  updateStars(stars: number[]): void {
    this.stars.set(stars);
  }
}
