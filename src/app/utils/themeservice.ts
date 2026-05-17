import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Themeservice {
  initTheme() {
    const savedTheme: string = localStorage.getItem('theme') ?? '';

    if (savedTheme === 'dark') this.enableDark();
  }

  toggleTheme() {
    if (this.isDark()) {
      this.disableDark();
    } else {
      this.enableDark();
    }
  }

  isDark(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  enableDark() {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }

  disableDark() {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}
