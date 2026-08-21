import { Component, inject, signal, computed } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthMockService } from '../../services/auth-mock.service';
import { LeagueSelectionService } from '../../components/league-select/league-selection.service';

const START_AGE_WEEKS = 16 * 48 + 0 * 4 + 1; // 16y 0m 1w in raw weeks (48 weeks/year)
const START_WEEKS_LEFT = 1055;

@Component({
  selector: 'app-character-creator',
  imports: [NgIf],
  templateUrl: './character-creator.html',
  styleUrl: './character-creator.css',
})
export class CharacterCreator {
  private authMock = inject(AuthMockService);
  private selectionService = inject(LeagueSelectionService);

  menuOpen = signal(false);

  isAdmin = this.authMock.isAdmin;

  faceImage = computed(() => this.isAdmin() ? '/Nick.jpg' : '/Character/Face/default.png');

  playerName = computed(() => this.isAdmin() ? 'I like gay dudes' : 'P. Layer');

  playerAge = computed(() => {
    if (this.isAdmin()) return '22 yrs 4 mth 1 wks';
    const weeksPassed = START_WEEKS_LEFT - this.selectionService.weeksRemaining();
    const totalWeeks = START_AGE_WEEKS + weeksPassed;
    const years = Math.floor(totalWeeks / 48);
    const remaining = totalWeeks % 48;
    const months = Math.floor(remaining / 4);
    const weeks = remaining % 4;
    return `${years} yrs ${months} mth ${weeks} wks`;
  });

  playerCountry = computed(() => this.isAdmin() ? 'Brazil' : 'Afghanistan');
  playerCountryCode = computed(() => this.isAdmin() ? 'bra' : 'afg');
  playerPosition = computed(() => this.isAdmin() ? 'Position: 69' : 'Striker');
  playerPositionIcon = computed(() => this.isAdmin() ? '' : 'ic_at');

  toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
