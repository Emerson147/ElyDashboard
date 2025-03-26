import { Component } from '@angular/core';
import { AppFloatingConfigurator } from '../../authentication/component/app.floatingconfigurator';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../core/services/auth.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [ForgotPasswordComponent ,DialogModule ,AppFloatingConfigurator, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, FloatLabelModule, Toast],
  providers: [MessageService],
  templateUrl: './auth-login.component.html'
})
export class AuthLoginComponent {

  email: string = '';
  password: string = '';
  visible: boolean = false;

  forgotVisible = false; // Controla la visibilidad del diálogo

  constructor(
    private messageService: MessageService,
    private authService:AuthService, 
    private router: Router
  ) {}

  onLogin(form: NgForm) {
    // Validando el formulario
    if(form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Porfavor complete el formulario correctamente'
      });
      return
    }
    
    // Preparando el objeto de login
    const newLogin = {
      email: this.email,
      password: this.password,
      message: this.messageService
    }
    
    
    //Realizar la llamada al backend
    this.authService.login(newLogin.email, newLogin.password).subscribe({
      next: (response) => {
        //Guarda token y rol
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.role);

        this.messageService.add({
          severity: 'success',
          summary: 'Login Exitoso',
          detail: 'Bienvenido'
        })
        setTimeout(() => {
          
          if(response.role === 'admin') {
            //Redirecciona al admin dashboard
            this.router.navigate(['/admin/dashboard'])
          } else {
            //Redirecciona al user dashboard
            this.router.navigate(['/user/dashboard'])
          }
        }, 2000
        )
      },
      error: (err) => {
        // Credenciales incorrectas
        if(err.status === 400) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de login',
            detail: 'Credenciales incorrectas'
          })
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de login',
            detail: err.error?.message || 'Ocurrio un problema al iniciar sesion'
          });
        }
      }
    })
  }
  
  openForgotPassword(event: Event): void {
    event.preventDefault();
    this.forgotVisible = true;
  }
}
