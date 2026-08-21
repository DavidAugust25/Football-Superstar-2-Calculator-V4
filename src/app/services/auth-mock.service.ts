import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthMockService {
  isAdmin = signal(false);

  toggleAdmin(): void {
    this.isAdmin.set(!this.isAdmin());
  }
}
