import { Component, inject } from '@angular/core';
import { AnimationSettingsService } from '../../services/animation-settings.service';
import { AuthMockService } from '../../services/auth-mock.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private animationSettings = inject(AnimationSettingsService);
  private authMock = inject(AuthMockService);

  scrambleEnabled = this.animationSettings.scrambleEnabled;
  isAdmin = this.authMock.isAdmin;

  toggleScramble(): void {
    this.animationSettings.toggleScramble();
  }

  toggleAdmin(): void {
    this.authMock.toggleAdmin();
  }
}
