import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, Toast, FloatLabelModule, InputTextModule],
  providers:[MessageService],
  templateUrl: './forgot-password.component.html',
  styles: ``
})
export class ForgotPasswordComponent {

  forgotEmail = '';      // Almacena el email ingresado en el diálogo

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}


  // Envía la solicitud de "forgot password"
  sendForgotPassword(form: NgForm): void {
    if (form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, ingresa un email valido.'
      });
      return;
    }

    //llamada al servicio para recuperar la contrasenia
    this.authService.forgotPassword(this.forgotEmail).subscribe({
      
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Revisa tu correo para restablecer la contraseña.'
        })
        setTimeout(() => {
          //Redirecciona al login
          this.router.navigate(['/login'])
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Credenciales invalidas, intente otra vez.'
        });
      }
    });
  }

}
