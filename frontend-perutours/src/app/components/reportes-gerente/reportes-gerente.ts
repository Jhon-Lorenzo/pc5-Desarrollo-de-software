import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Session } from '../../services/session';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportes-gerente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" style="margin-top: 40px;">
      <h2>Panel de Gerencia - Reportes y Estadísticas</h2>
      <p class="text-muted">Análisis en tiempo real de ingresos y estado de cotizaciones.</p>
      
      <!-- Grid de Métricas -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 25px;">
        <div style="background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <span style="font-size: 0.9rem; text-transform: uppercase; opacity: 0.8;">Total Ingresos</span>
          <h3 style="font-size: 2.2rem; margin: 10px 0 0 0;">$ {{ totalVentas }}</h3>
        </div>
        
        <div style="background: linear-gradient(135deg, #2e7d32, #4caf50); color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <span style="font-size: 0.9rem; text-transform: uppercase; opacity: 0.8;">Cotizaciones Aceptadas</span>
          <h3 style="font-size: 2.2rem; margin: 10px 0 0 0;">{{ countAceptadas }}</h3>
        </div>
        
        <div style="background: linear-gradient(135deg, #f57c00, #ffb74d); color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <span style="font-size: 0.9rem; text-transform: uppercase; opacity: 0.8;">Cotizaciones Pendientes</span>
          <h3 style="font-size: 2.2rem; margin: 10px 0 0 0;">{{ countPendientes }}</h3>
        </div>
      </div>

      <!-- Tabla de Control de Auditoría -->
      <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-top: 30px;">
        <h4 style="margin-bottom: 20px; font-size: 1.2rem;">Historial de Transacciones (Auditoría)</h4>
        
        @if (solicitudes && solicitudes.length > 0) {
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #eee; text-align: left;">
                <th style="padding: 10px;">ID</th>
                <th style="padding: 10px;">Cliente (Socio)</th>
                <th style="padding: 10px;">Destino</th>
                <th style="padding: 10px;">Costo</th>
                <th style="padding: 10px;">Estado</th>
              </tr>
            </thead>
            <tbody>
              @for (sol of solicitudes; track sol.id) {
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">#{{ sol.id }}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ sol.usuarioCorreo }}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ sol.destino }}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">$ {{ sol.montoTotal }}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <span [ngStyle]="{
                      'background': sol.estado?.toUpperCase() === 'PENDIENTE' ? '#fff3cd' : (sol.estado?.toUpperCase() === 'ACEPTADO' || sol.estado?.toUpperCase() === 'PAGADO' ? '#d4edda' : '#f8d7da'),
                      'color': sol.estado?.toUpperCase() === 'PENDIENTE' ? '#856404' : (sol.estado?.toUpperCase() === 'ACEPTADO' || sol.estado?.toUpperCase() === 'PAGADO' ? '#155724' : '#721c24')
                    }" style="padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">
                      {{ sol.estado }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <p class="text-center text-muted" style="padding: 20px 0;">No hay cotizaciones registradas en el sistema.</p>
        }
      </div>
    </div>
  `
})
export class ReportesGerente implements OnInit {
  solicitudes: any[] = [];
  totalVentas: number = 0;
  countAceptadas: number = 0;
  countPendientes: number = 0;

  private http = inject(HttpClient);
  private session = inject(Session);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    const user = this.session.currentUser();
    if (!user || user.rol.nombre !== 'Gerente') {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.cargarDatos();
  }

  cargarDatos() {
    this.http.get<any[]>('https://920d-38-25-18-236.ngrok-free.app/api/solicitudes').subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.calcularMetricas();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al obtener cotizaciones para gerencia:', err)
    });
  }

  calcularMetricas() {
    this.totalVentas = this.solicitudes
      .filter(s => s.estado?.toUpperCase() === 'ACEPTADO' || s.estado?.toUpperCase() === 'PAGADO')
      .reduce((sum, s) => sum + s.montoTotal, 0);

    this.countAceptadas = this.solicitudes.filter(s => s.estado?.toUpperCase() === 'ACEPTADO' || s.estado?.toUpperCase() === 'PAGADO').length;
    this.countPendientes = this.solicitudes.filter(s => s.estado?.toUpperCase() === 'PENDIENTE').length;
  }
}
