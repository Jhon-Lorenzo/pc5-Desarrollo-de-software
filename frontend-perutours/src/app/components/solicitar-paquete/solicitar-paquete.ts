import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Session } from '../../services/session';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-solicitar-paquete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="margin-top: 40px;">
      <h2>Solicitar Paquete</h2>
      <p class="text-muted">Arma tu paquete turístico a medida y guárdalo en la base de datos real.</p>
      
      <div class="form-group" style="margin-top: 20px;">
        <label>Destino de interés</label>
        <select class="form-control" [(ngModel)]="destinoSeleccionado" (change)="calcularTotal()">
          <option *ngFor="let tour of tours" [ngValue]="tour">{{ tour.nombre }} ($ {{ tour.precio }})</option>
        </select>
      </div>

      <div class="form-group" style="margin-top: 20px;">
        <label>Fecha de Viaje</label>
        <input type="date" class="form-control" [(ngModel)]="fechaViaje" [min]="minFecha" [max]="maxFecha">
      </div>

      <div class="form-group" style="margin-top: 20px;">
        <label>Número de Personas</label>
        <input type="number" class="form-control" [(ngModel)]="cantidadPersonas" min="1" (change)="calcularTotal()" (keyup)="calcularTotal()">
      </div>

      <div style="margin-top: 20px; font-size: 1.2rem; font-weight: bold;">
        Monto Total Estimado: <span style="color: #28a745;">$ {{ montoTotal }}</span>
      </div>
      
      <button class="btn btn-primary" style="margin-top: 20px;" (click)="enviar()">Enviar Solicitud</button>
    </div>
  `
})
export class SolicitarPaquete implements OnInit {
  tours: any[] = [];
  destinoSeleccionado: any = null;
  fechaViaje: string = '';
  cantidadPersonas: number = 1;
  montoTotal: number = 0;
  minFecha: string = '';
  maxFecha: string = '';

  private router = inject(Router);
  private http = inject(HttpClient);
  private session = inject(Session);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    const today = new Date();
    this.minFecha = this.formatDate(today);

    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);
    this.maxFecha = this.formatDate(oneYearLater);

    // Cargar los tours dinámicamente
    this.http.get<any[]>('https://920d-38-25-18-236.ngrok-free.app/api/tours').subscribe({
      next: (data) => {
        // Filtrar activos
        this.tours = data.filter(t => t.activo);
        
        // Seleccionar por defecto o desde localstorage
        const selectedName = localStorage.getItem('selected_tour');
        if (selectedName) {
          const found = this.tours.find(t => t.nombre === selectedName);
          if (found) this.destinoSeleccionado = found;
          localStorage.removeItem('selected_tour');
        } else if (this.tours.length > 0) {
          this.destinoSeleccionado = this.tours[0];
        }
        
        this.calcularTotal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando destinos', err);
        this.toastService.error('No se pudieron cargar los destinos.');
      }
    });
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  calcularTotal() {
    if (this.destinoSeleccionado && this.cantidadPersonas > 0) {
      this.montoTotal = this.destinoSeleccionado.precio * this.cantidadPersonas;
    } else {
      this.montoTotal = 0;
    }
  }

  enviar() {
    const user = this.session.currentUser();
    if (!user) {
      this.toastService.error('Debe iniciar sesión para solicitar un paquete.');
      return;
    }

    if (!this.destinoSeleccionado || !this.fechaViaje || this.cantidadPersonas < 1) {
      this.toastService.error('Por favor complete todos los campos correctamente.');
      return;
    }

    if (this.fechaViaje < this.minFecha || this.fechaViaje > this.maxFecha) {
      this.toastService.error('La fecha de viaje debe estar entre hoy y máximo 1 año en el futuro.');
      return;
    }

    const payload = {
      usuarioCorreo: user.correo,
      destino: this.destinoSeleccionado.nombre,
      fechaViaje: this.fechaViaje,
      cantidadPersonas: this.cantidadPersonas,
      montoTotal: this.montoTotal
    };

    this.http.post('https://920d-38-25-18-236.ngrok-free.app/api/solicitudes', payload).subscribe({
      next: (res) => {
        this.toastService.success('¡Solicitud enviada con éxito!');
        this.router.navigate(['/mis-solicitudes']);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Hubo un error al enviar tu solicitud.');
      }
    });
  }
}
