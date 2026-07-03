import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ToastContainer } from './components/toast-container/toast-container';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, ToastContainer],
  template: `
    <app-header></app-header>
    <main style="min-height: 80vh;">
      <router-outlet></router-outlet>
    </main>
    <app-toast-container></app-toast-container>
    <app-footer></app-footer>
  `,
  styleUrl: './app.css'
})
export class App {
  title = 'frontend-perutours';
}
