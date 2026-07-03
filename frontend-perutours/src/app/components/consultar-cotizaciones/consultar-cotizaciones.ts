import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Session } from '../../services/session';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consultar-cotizaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="margin-top: 40px;">
      <h2>Consultar Cotizaciones</h2>
      <p class="text-muted">Vista de {{ userRole }} para gestionar las solicitudes en tiempo real.</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-top: 20px;">
        @if (solicitudes && solicitudes.length > 0) {
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #eee; text-align: left;">
                <th style="padding: 10px;">ID</th>
                <th style="padding: 10px;">Cliente (Socio)</th>
                <th style="padding: 10px;">Destino</th>
                <th style="padding: 10px;">Fecha Solicitud</th>
                <th style="padding: 10px;">Monto Total</th>
                <th style="padding: 10px;">Estado</th>
                <th style="padding: 10px; text-align: center;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (sol of solicitudes; track sol.id) {
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">#{{ sol.id }}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ sol.usuarioCorreo }}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ sol.destino }}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ sol.fechaSolicitud }}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">$ {{ sol.montoTotal }}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <span [ngStyle]="{
                      'background': sol.estado?.toUpperCase() === 'PENDIENTE' ? '#fff3cd' : (sol.estado?.toUpperCase() === 'ACEPTADO' || sol.estado?.toUpperCase() === 'PAGADO' ? '#d4edda' : '#f8d7da'),
                      'color': sol.estado?.toUpperCase() === 'PENDIENTE' ? '#856404' : (sol.estado?.toUpperCase() === 'ACEPTADO' || sol.estado?.toUpperCase() === 'PAGADO' ? '#155724' : '#721c24')
                    }" style="padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">
                      {{ sol.estado }}
                    </span>
                    <div *ngIf="sol.estado?.toUpperCase() === 'RECHAZADO' && sol.comentarioRechazo" style="margin-top: 5px; font-size: 0.8rem; color: #721c24;">
                      <b>Motivo:</b> {{ sol.comentarioRechazo }}
                    </div>
                  </td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                    @if (sol.estado?.toUpperCase() === 'PENDIENTE') {
                      <button class="btn btn-primary btn-sm" style="margin-right: 5px; background: #28a745; border-color: #28a745;" (click)="aceptarSolicitud(sol.id)">Aceptar</button>
                      <button class="btn btn-accent btn-sm" style="background: #dc3545; border-color: #dc3545;" (click)="iniciarRechazo(sol.id)">Rechazar</button>
                    } @else {
                      <span class="text-muted" style="font-size: 0.9rem;">Gestionado</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <p class="text-center text-muted" style="padding: 20px 0;">No hay cotizaciones pendientes en el sistema de Booking.</p>
        }
      </div>

      <!-- Modal de Rechazo -->
      <div *ngIf="solicitudARechazar" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
        <div style="background: white; padding: 30px; border-radius: 8px; width: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          <h3 style="margin-top: 0; color: #dc3545;">Rechazar Solicitud #{{ solicitudARechazar }}</h3>
          <p>Por favor, ingrese el motivo del rechazo para notificar al socio.</p>
          
          <div class="form-group" style="margin-top: 15px;">
            <textarea class="form-control" rows="4" placeholder="Ej. No hay disponibilidad para esa fecha..." [(ngModel)]="motivoRechazo"></textarea>
          </div>
          
          <div style="margin-top: 25px; display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn btn-secondary" (click)="cancelarRechazo()">Cancelar</button>
            <button class="btn btn-danger" (click)="confirmarRechazo()">Confirmar Rechazo</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConsultarCotizaciones implements OnInit {
  solicitudes: any[] = [];
  userRole: string = '';

  solicitudARechazar: number | null = null;
  motivoRechazo: string = '';

  private http = inject(HttpClient);
  private session = inject(Session);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  ngOnInit() {
    const user = this.session.currentUser();
    if (!user || user.rol.nombre === 'Socio') {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.userRole = user.rol.nombre;
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.http.get<any[]>('https://920d-38-25-18-236.ngrok-free.app/api/solicitudes').subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al obtener cotizaciones:', err)
    });
  }

  aceptarSolicitud(id: number) {
    this.http.put(`https://920d-38-25-18-236.ngrok-free.app/api/solicitudes/${id}/estado?nuevoEstado=Aceptado`, {}).subscribe({
      next: () => {
        this.toastService.success(`Solicitud #${id} ha sido aceptada.`);
        this.cargarSolicitudes();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Error al actualizar el estado de la cotización.');
      }
    });
  }

  iniciarRechazo(id: number) {
    this.solicitudARechazar = id;
    this.motivoRechazo = '';
  }

  cancelarRechazo() {
    this.solicitudARechazar = null;
  }

  confirmarRechazo() {
    if (!this.motivoRechazo.trim()) {
      this.toastService.error('Debe ingresar un motivo para el rechazo.');
      return;
    }

    const params = new URLSearchParams();
    params.append('nuevoEstado', 'Rechazado');
    params.append('comentarioRechazo', this.motivoRechazo);

    this.http.put(`https://920d-38-25-18-236.ngrok-free.app/api/solicitudes/${this.solicitudARechazar}/estado?${params.toString()}`, {}).subscribe({
      next: () => {
        this.toastService.success(`Solicitud #${this.solicitudARechazar} ha sido rechazada.`);
        this.solicitudARechazar = null;
        this.cargarSolicitudes();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Error al actualizar el estado de la cotización.');
      }
    });
  }
}
