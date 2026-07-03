import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Session } from '../../services/session';

@Component({
  selector: 'app-catalogo-paquetes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" style="margin-top: 40px;">
      <h2>Catálogo de Paquetes</h2>
      <p class="text-muted">Explora nuestros paquetes turísticos disponibles y solicita el tuyo.</p>
      
      <div class="dashboard-grid" style="margin-top: 30px;">
        @for (tour of paquetes; track tour.id) {
          <div class="card" style="padding: 0; overflow: hidden;">
            <img [src]="tour.imagen || 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=60'" 
                 alt="{{ tour.nombre }}" style="width: 100%; height: 200px; object-fit: cover;">
            <div style="padding: 20px;">
              <h3>{{ tour.nombre }}</h3>
              <p style="color: #666; margin-bottom: 5px;">⏳ {{ tour.dias }} días</p>
              <p style="font-size: 1.25rem; font-weight: 600; color: #2c3e50; margin-bottom: 15px;">
                $ {{ tour.precio }}
              </p>
              <button class="btn btn-primary" style="width: 100%" (click)="solicitar(tour)">Solicitar</button>
            </div>
          </div>
        }
      </div>
      
      @if (paquetes.length === 0) {
        <p class="text-center text-muted" style="padding: 40px;">No hay paquetes disponibles en este momento.</p>
      }
    </div>
  `
})
export class CatalogoPaquetes implements OnInit {
  paquetes: any[] = [];
  
  private http = inject(HttpClient);
  private router = inject(Router);
  private session = inject(Session);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.http.get<any[]>('https://920d-38-25-18-236.ngrok-free.app/api/tours').subscribe({
      next: (data) => {
        this.paquetes = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar tours:', err);
      }
    });
  }

  solicitar(tour: any) {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    // Almacenamos temporalmente el tour seleccionado para pre-llenar la solicitud
    localStorage.setItem('selected_tour', tour.nombre);
    this.router.navigate(['/solicitud']);
  }
}
