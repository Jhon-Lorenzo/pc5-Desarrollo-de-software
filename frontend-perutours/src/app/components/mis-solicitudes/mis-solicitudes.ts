import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Session } from '../../services/session';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="margin-top: 40px;">
      <h2>Mis Solicitudes</h2>
      <p class="text-muted">Estado en tiempo real de tus solicitudes registradas en el microservicio.</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-top: 20px;">
        @if (solicitudes && solicitudes.length > 0) {
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #eee; text-align: left;">
                <th style="padding: 10px;">ID</th>
                <th style="padding: 10px;">Destino</th>
                <th style="padding: 10px;">Fecha Solicitud</th>
                <th style="padding: 10px;">Costo</th>
                <th style="padding: 10px;">Estado</th>
                <th style="padding: 10px;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (sol of solicitudes; track sol.id) {
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">#{{ sol.id }}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    {{ sol.destino }}
                    <br>
                    <small class="text-muted" *ngIf="sol.fechaViaje">{{ sol.fechaViaje }} ({{ sol.cantidadPersonas }} pax)</small>
                  </td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ sol.fechaSolicitud }}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">$ {{ sol.montoTotal }}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <span [ngStyle]="{
                      'background': sol.estado?.toUpperCase() === 'PENDIENTE' ? '#fff3cd' : (sol.estado?.toUpperCase() === 'ACEPTADO' ? '#d1ecf1' : (sol.estado?.toUpperCase() === 'PAGADO' ? '#d4edda' : '#f8d7da')),
                      'color': sol.estado?.toUpperCase() === 'PENDIENTE' ? '#856404' : (sol.estado?.toUpperCase() === 'ACEPTADO' ? '#0c5460' : (sol.estado?.toUpperCase() === 'PAGADO' ? '#155724' : '#721c24'))
                    }" style="padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">
                      {{ sol.estado }}
                    </span>
                    <div *ngIf="sol.estado?.toUpperCase() === 'RECHAZADO' && sol.comentarioRechazo" style="margin-top: 5px; font-size: 0.8rem; color: #721c24;">
                      <b>Motivo:</b> {{ sol.comentarioRechazo }}
                    </div>
                  </td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <button *ngIf="sol.estado?.toUpperCase() === 'ACEPTADO'" class="btn btn-primary btn-sm" (click)="iniciarPago(sol)">Pagar Ahora</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <p class="text-center text-muted" style="padding: 20px 0;">No tienes solicitudes registradas aún en el microservicio.</p>
        }
      </div>

      <!-- Modal Modal de Pago -->
      <div *ngIf="solicitudAPagar" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
        <div style="background: white; padding: 30px; border-radius: 8px; width: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          <h3 style="margin-top: 0;">Pago de Paquete</h3>
          <p>Destino: <b>{{ solicitudAPagar.destino }}</b></p>
          <p>Total a pagar: <b>$ {{ solicitudAPagar.montoTotal }}</b></p>
          
          <div class="form-group" style="margin-top: 15px;">
            <label>Número de Tarjeta</label>
            <input type="text" class="form-control" placeholder="0000 0000 0000 0000" [(ngModel)]="tarjeta">
          </div>
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <div class="form-group" style="flex: 1;">
              <label>Vencimiento</label>
              <input type="text" class="form-control" placeholder="MM/YY" [(ngModel)]="vencimiento">
            </div>
            <div class="form-group" style="flex: 1;">
              <label>CVV</label>
              <input type="password" class="form-control" placeholder="123" [(ngModel)]="cvv">
            </div>
          </div>
          
          <div style="margin-top: 25px; display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn btn-danger" (click)="cancelarPago()">Cancelar</button>
            <button class="btn btn-primary" (click)="procesarPago()">Confirmar Pago</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MisSolicitudes implements OnInit {
  solicitudes: any[] = [];
  
  solicitudAPagar: any = null;
  tarjeta: string = '';
  vencimiento: string = '';
  cvv: string = '';

  private http = inject(HttpClient);
  private session = inject(Session);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    const user = this.session.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<any[]>(`https://e9a1-38-25-18-236.ngrok-free.app/api/solicitudes/usuario/${user.correo}`).subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener solicitudes:', err);
      }
    });
  }

  iniciarPago(solicitud: any) {
    this.solicitudAPagar = solicitud;
    this.tarjeta = '';
    this.vencimiento = '';
    this.cvv = '';
  }

  cancelarPago() {
    this.solicitudAPagar = null;
  }

  procesarPago() {
    if (!this.tarjeta || !this.vencimiento || !this.cvv) {
      this.toastService.error('Complete los datos de la tarjeta para continuar.');
      return;
    }

    this.http.put(`https://e9a1-38-25-18-236.ngrok-free.app/api/solicitudes/${this.solicitudAPagar.id}/estado?nuevoEstado=Pagado`, {}).subscribe({
      next: () => {
        this.toastService.success('¡Pago procesado con éxito!');
        this.solicitudAPagar = null;
        this.cargarSolicitudes();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Error al procesar el pago.');
      }
    });
  }
}
