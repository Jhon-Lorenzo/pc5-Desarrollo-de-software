import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Session } from '../../services/session';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  destinos: any[] = [];
  session = inject(Session);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.http.get<any[]>('https://920d-38-25-18-236.ngrok-free.app/api/tours').subscribe({
      next: (data) => {
        this.destinos = data;
        this.cdr.detectChanges();
      },
      error: () => {
        // Fallback en caso de que el microservicio esté apagado
        this.destinos = [
          { nombre: 'Cusco - Machu Picchu', imagen: 'assets/images/cusco.jpg', precio: 450, dias: 4 },
          { nombre: 'Paracas e Ica', imagen: 'assets/images/paracas.jpg', precio: 150, dias: 2 },
          { nombre: 'Arequipa y Colca', imagen: 'assets/images/arequipa.jpg', precio: 320, dias: 3 }
        ];
        this.cdr.detectChanges();
      }
    });
  }
}
