import { Component, inject, signal, effect } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Payload } from '../../core/interfaces/payload/payload-structure.interface';
import { Themeservice } from '../../utils/themeservice';

@Component({
  selector: 'app-navbar',
  imports: [ToolbarModule, ButtonModule, RouterLink, AsyncPipe, TitleCasePipe],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService = inject(AuthService);

  token = signal<string | null>(localStorage.getItem('token'));
  dark = signal<string>('');
  name = signal<string | null>(null);

  constructor(
    public themeService: Themeservice,
    private router: Router,
  ) {
    this.dark.set(localStorage.getItem('dark') ?? '');
    effect(() => {
      const token = this.token();
      if (token) {
        const payload: Payload = jwtDecode(this.token()!);
        this.name.set(payload.userName);
        console.log(payload);
      }

      if (token) {
        this.scheduleLogout(token);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.token.set(null);
  }

  scheduleLogout(token: string) {
    const payload = jwtDecode<{ exp: number }>(token);
    const now = Math.floor(Date.now() / 1000);

    const delay = (payload.exp - now) * 1000;

    if (delay <= 0) {
      this.authService.logout();
    } else {
      setTimeout(() => this.authService.logout(), delay);
    }
  }

  changeLang(lang: string) {
    const currentPath = window.location.pathname;

    const pathWithoutLang = currentPath.replace(/^\/(es|en-US)/, '');

    window.location.href = `/${lang}${pathWithoutLang}`;
  }
}
