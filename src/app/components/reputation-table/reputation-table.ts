import { Component, inject } from '@angular/core';
import { PlayerStatsService } from '../stat-inputs/player-stats.service';
import { LeagueSelectionService } from '../league-select/league-selection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reputation-table',
  imports: [CommonModule],
  templateUrl: './reputation-table.html',
  styleUrl: './reputation-table.css',
})
export class ReputationTable {
  protected stats = inject(PlayerStatsService);
  private leagueService = inject(LeagueSelectionService);
  
  years = Array.from({length: 23}, (_, i) => 2025 + i);
  
  allMonths = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];
  
  availableMonths = this.allMonths.filter(m => m.value >= 7);
  selectedMonth = 7;
  selectedYear = 2025;
  selectedWeek = 1;
  
  constructor() {
    this.updateWeeksRemaining();
  }
  
  onYearChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedYear = parseInt(target.value);
    this.updateAvailableMonths();
    this.updateWeeksRemaining();
  }
  
  onMonthChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedMonth = parseInt(target.value);
    this.updateWeeksRemaining();
  }
  
  onWeekChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedWeek = parseInt(target.value);
    this.updateWeeksRemaining();
  }

  onRoleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.stats.selectedRole.set(target.value);
  }
  
  updateAvailableMonths() {
    if (this.selectedYear === 2025) {
      this.availableMonths = this.allMonths.filter(m => m.value >= 7);
      if (this.selectedMonth < 7) {
        this.selectedMonth = 7;
      }
    } else if (this.selectedYear === 2047) {
      this.availableMonths = this.allMonths.filter(m => m.value <= 6);
      if (this.selectedMonth > 6) {
        this.selectedMonth = 6;
      }
    } else {
      this.availableMonths = [...this.allMonths];
    }
  }
  
  updateWeeksRemaining() {
    const monthsRemaining = (2047 - this.selectedYear) * 12 + (6 - this.selectedMonth);
    const weeksRemaining = monthsRemaining * 4 + (4 - this.selectedWeek);
    this.leagueService.weeksRemaining.set(weeksRemaining);
  }
}
