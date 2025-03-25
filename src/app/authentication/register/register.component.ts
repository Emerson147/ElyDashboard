import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/services/auth.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, InputTextModule, PasswordModule, ButtonModule, RouterModule, FloatLabelModule, ToastModule, ProgressSpinnerModule],
  providers: [MessageService],
  templateUrl: './register.component.html',

})

export class RegisterComponent {
  name = '';
  contactNumber = '';
  email = '';
  password!: string;
  confirmPassword!: string;
  loading = false;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(form: NgForm) {
    // Validación del formulario
    if (form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos correctamente'
      });
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.password !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden'
      });
      return;
    }

    // Validar que el nombre solo contenga letras y espacios
    if (!/^[A-Za-z\s]+$/.test(this.name)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre solo puede contener letras y espacios'
      });
      return;
    }

    // Validar que el número de teléfono tenga exactamente 9 dígitos
    if (!/^\d{9}$/.test(this.contactNumber)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El número de teléfono debe tener exactamente 9 dígitos'
      });
      return;
    }

     
    

    // Preparar objeto de usuario
    const newUser = {
      name: this.name,
      contactNumber: this.contactNumber,
      email: this.email,
      password: this.password
    };

    this.loading = true; // Activamos el spinner

    // Realizar la llamada al backend
    this.authService.register(newUser).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario registrado exitosamente'
        });
        // Esperamos 3 segundos para redireccionar
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        //Verifica  si el error  es por el email ya registrado
        if (err.status === 400 || err.error?.messagge === "Email already exists") {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al registro',
            detail: 'El email ya existe, porfavor usar otro correo'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de registro',
            detail: err.error?.messagge || 'Ocurrio un error al registro'
          })
        }
      }
    });
  }
}
