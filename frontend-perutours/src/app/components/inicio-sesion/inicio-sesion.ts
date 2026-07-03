import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Session } from '../../services/session';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css',
})
export class InicioSesion implements OnInit {
  loginForm: FormGroup;
  errorMsg: string = '';
  loading: boolean = false;

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private sessionService = inject(Session);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.sessionService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  iniciarSesion() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';
    
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMsg = response.message || 'Credenciales incorrectas. Verifique su correo y contraseña.';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error de conexión:', err);
        this.errorMsg = 'No se pudo conectar con el servidor. Verifica que los microservicios estén corriendo en el puerto 8080.';
      }
    });
  }
}
