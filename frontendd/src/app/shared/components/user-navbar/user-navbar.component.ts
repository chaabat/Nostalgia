import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/auth/auth.selectors';
import { AuthActions } from '../../../store/auth/auth.actions';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './user-navbar.component.html',
})
export class UserNavbarComponent {
  user$ = this.store.select(selectUser);
  
  navItems = [
    { path: '/user/home', label: 'Home' },
    { path: '/user/library', label: 'Library' }
  ];

  constructor(private store: Store) {}

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }
} 