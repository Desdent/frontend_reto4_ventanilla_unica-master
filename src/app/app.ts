import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Themeservice } from './utils/themeservice';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayout],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ventanilla_unica_frontend');

  constructor(private themeService: Themeservice) {}

  ngOnInit() {
    this.themeService.initTheme();
  }
}
