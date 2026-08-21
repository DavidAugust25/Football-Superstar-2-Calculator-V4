import { Component, ElementRef, inject } from '@angular/core';
import { PlayerStatsService } from './player-stats.service';

@Component({
  selector: 'app-stat-inputs',
  imports: [],
  templateUrl: './stat-inputs.html',
  styleUrl: './stat-inputs.css',
})
export class StatInputs {
  private stats = inject(PlayerStatsService);
  private el = inject(ElementRef);

  onRatingBlur(): void {
    const inputs = this.el.nativeElement.querySelectorAll('input.statInput') as HTMLInputElement[];
    const ratings: number[] = [];

    inputs.forEach((input, i) => {
      if (i % 2 === 0) {
        ratings.push(Number(input.value));
      }
    });

    this.stats.updateRatings(ratings);
  }

  onStarInput(): void {
    const inputs = this.el.nativeElement.querySelectorAll('input.statInput') as HTMLInputElement[];
    const stars: number[] = [];

    inputs.forEach((input, i) => {
      if (i % 2 !== 0) {
        stars.push(Number(input.value));
      }
    });

    this.stats.updateStars(stars);
  }

  onEnter(event: Event): void {
    const target = event.target as HTMLInputElement;
    const inputs = this.el.nativeElement.querySelectorAll('input.statInput') as HTMLInputElement[];
    const index = Array.prototype.indexOf.call(inputs, target);
    if (index === -1) {
      return;
    }
    event.preventDefault();
    const next = inputs[index + 2];
    if (next) {
      next.focus();
      next.select();
    }
  }
}
