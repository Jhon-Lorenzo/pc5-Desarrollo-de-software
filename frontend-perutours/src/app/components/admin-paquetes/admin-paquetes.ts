import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Session } from '../../services/session';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-paquetes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="margin-top: 40px;">
      <h2>Administración de Paquetes</h2>
      <p class="text-muted">Gestiona el catálogo de tours disponibles.</p>
      
      <button class="btn btn-primary" (click)="nuevoPaquete()" style="margin-bottom: 20px;">+ Nuevo Paquete</button>

      <div *ngIf="mostrarFormulario" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3>{{ editando ? 'Editar Paquete' : 'Crear Nuevo Paquete' }}</h3>
        
        <div class="form-group" style="margin-top: 15px;">
          <label>Nombre del Paquete</label>
          <input type="text" class="form-control" [(ngModel)]="paqueteActual.nombre">
        </div>
        
        <div class="form-group" style="margin-top: 15px;">
          <label>Días de duración</label>
          <input type="number" class="form-control" [(ngModel)]="paqueteActual.dias">
        </div>
        
        <div class="form-group" style="margin-top: 15px;">
          <label>Precio (USD)</label>
          <input type="number" class="form-control" [(ngModel)]="paqueteActual.precio">
        </div>

        <div class="form-group" style="margin-top: 15px;">
          <label>URL de Imagen</label>
          <input type="text" class="form-control" [(ngModel)]="paqueteActual.imagen" placeholder="https://...">
        </div>

        <div style="margin-top: 20px;">
          <button class="btn btn-primary" (click)="guardarPaquete()">Guardar</button>
          <button class="btn btn-danger" style="margin-left: 10px;" (click)="cancelar()">Cancelar</button>
        </div>
      </div>

      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #eee; text-align: left;">
              <th style="padding: 10px;">ID</th>
              <th style="padding: 10px;">Nombre</th>
              <th style="padding: 10px;">Días</th>
              <th style="padding: 10px;">Precio</th>
              <th style="padding: 10px;">Estado</th>
              <th style="padding: 10px;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (tour of paquetes; track tour.id) {
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">#{{ tour.id }}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ tour.nombre }}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ tour.dias }}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">$ {{ tour.precio }}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  <span [ngStyle]="{
                    'background': tour.activo ? '#d4edda' : '#f8d7da',
                    'color': tour.activo ? '#155724' : '#721c24'
                  }" style="padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">
                    {{ tour.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  <button class="btn btn-primary btn-sm" (click)="editarPaquete(tour)">Editar</button>
                  <button class="btn btn-danger btn-sm" style="margin-left: 5px;" *ngIf="tour.activo" (click)="iniciarDesactivar(tour)">Desactivar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modal Confirmar Desactivar -->
      <div *ngIf="paqueteADesactivar" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
        <div style="background: white; padding: 30px; border-radius: 8px; width: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          <h3 style="margin-top: 0; color: #dc3545;">Confirmar Acción</h3>
          <p>¿Estás seguro de desactivar el paquete <b>{{ paqueteADesactivar.nombre }}</b>?</p>
          <p class="text-muted" style="font-size: 0.9rem;">Dejará de aparecer en el catálogo de clientes, pero las reservas pasadas se mantendrán.</p>
          
          <div style="margin-top: 25px; display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn btn-secondary" (click)="paqueteADesactivar = null">Cancelar</button>
            <button class="btn btn-danger" (click)="confirmarDesactivar()">Desactivar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminPaquetes implements OnInit {
  paquetes: any[] = [];
  mostrarFormulario = false;
  editando = false;
  paqueteActual: any = {};
  paqueteADesactivar: any = null;

  private http = inject(HttpClient);
  private session = inject(Session);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    if (!this.session.isLoggedIn() || this.session.currentUser()?.rol?.nombre === 'Socio') {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.cargarPaquetes();
  }

  cargarPaquetes() {
    this.http.get<any[]>('https://e9a1-38-25-18-236.ngrok-free.app/api/tours/all').subscribe({
      next: (data) => {
        this.paquetes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  nuevoPaquete() {
    this.editando = false;
    this.paqueteActual = { nombre: '', dias: 1, precio: 0, imagen: '', activo: true };
    this.mostrarFormulario = true;
  }

  editarPaquete(tour: any) {
    this.editando = true;
    this.paqueteActual = { ...tour };
    this.mostrarFormulario = true;
  }

  cancelar() {
    this.mostrarFormulario = false;
  }

  guardarPaquete() {
    if (!this.paqueteActual.nombre || this.paqueteActual.precio <= 0) {
      this.toastService.error('Datos inválidos. Verifica el nombre y el precio.');
      return;
    }

    if (this.editando) {
      this.http.put(`https://e9a1-38-25-18-236.ngrok-free.app/api/tours/${this.paqueteActual.id}`, this.paqueteActual).subscribe({
        next: () => {
          this.toastService.success('Paquete actualizado exitosamente.');
          this.mostrarFormulario = false;
          this.cargarPaquetes();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.http.post('https://e9a1-38-25-18-236.ngrok-free.app/api/tours', this.paqueteActual).subscribe({
        next: () => {
          this.toastService.success('Nuevo paquete creado.');
          this.mostrarFormulario = false;
          this.cargarPaquetes();
        },
        error: (err) => console.error(err)
      });
    }
  }

  iniciarDesactivar(tour: any) {
    this.paqueteADesactivar = tour;
  }

  confirmarDesactivar() {
    if (this.paqueteADesactivar) {
      this.http.delete(`https://e9a1-38-25-18-236.ngrok-free.app/api/tours/${this.paqueteADesactivar.id}`).subscribe({
        next: () => {
          this.toastService.success('Paquete desactivado.');
          this.paqueteADesactivar = null;
          this.cargarPaquetes();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
