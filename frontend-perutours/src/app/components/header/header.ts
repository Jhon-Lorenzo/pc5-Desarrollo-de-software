import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Session } from '../../services/session';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  session = inject(Session);

  logout() {
    this.session.clearSession();
  }
}
