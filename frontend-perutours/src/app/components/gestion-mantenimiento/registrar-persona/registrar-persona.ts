import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { Session } from '../../../services/session';

@Component({
  selector: 'app-registrar-persona',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './registrar-persona.html',
  styleUrl: './registrar-persona.css',
})
export class RegistrarPersona implements OnInit {
  step = 1;
  
  // Modelo del formulario
  usuario = {
    nombres: '',
    apellidos: '',
    correo: '',
    password: ''
  };
  confirmarPassword = '';
  dni = '';
  telefono = '';
  direccion = '';

  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private sessionService = inject(Session);

  ngOnInit() {
    if (this.sessionService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  nextStep() {
    if (!this.usuario.nombres.trim() || !this.usuario.apellidos.trim()) {
      this.toastService.error('Debe completar sus nombres y apellidos.');
      return;
    }
    if (!this.dni.trim() || this.dni.length !== 8 || isNaN(Number(this.dni))) {
      this.toastService.error('El DNI debe tener exactamente 8 números.');
      return;
    }
    this.step = 2;
  }

  prevStep() {
    this.step = 1;
  }

  registrar() {
    if (!this.usuario.correo.trim()) {
      this.toastService.error('Por favor, ingrese su correo electrónico.');
      return;
    }
    if (!this.usuario.password || this.usuario.password.length < 6) {
      this.toastService.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (this.usuario.password !== this.confirmarPassword) {
      this.toastService.error('Las contraseñas no coinciden.');
      return;
    }

    this.http.post<any>('https://920d-38-25-18-236.ngrok-free.app/api/auth/registro', this.usuario).subscribe({
      next: (response) => {
        this.toastService.success('¡Registro exitoso! Ya puede iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error(err.error?.message || 'Error al registrar el usuario.');
      }
    });
  }
}
