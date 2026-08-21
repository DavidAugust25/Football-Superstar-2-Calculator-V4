import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnimationSettingsService {
  scrambleEnabled = signal(true);

  toggleScramble(): void {
    this.scrambleEnabled.set(!this.scrambleEnabled());
  }
}
