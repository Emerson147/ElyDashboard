import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Table, TableModule} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { UserService } from '../service/user.service';
import { ToolbarModule } from 'primeng/toolbar';
import { firstValueFrom } from 'rxjs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';

interface User {
  id?: number;
  name: string;
  email: string;
  contactNumber?: string;
  password?: string;
  role: 'ADMIN' | 'USER';
  status: boolean;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    CardModule,
    TextareaModule,
    PasswordModule,
    SelectButtonModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  users: User[] = [];
  user: User = this.getEmptyUser();
  submitted = false;
  userDialog = false;
  editMode = false;
  selectedUsers: User[] = [];
  cols = [
    { field: 'name', header: 'Usuario' },
    { field: 'email', header: 'Email' },
    { field: 'contactNumber', header: 'Numero de contacto' },
    { field: 'status', header: 'Estado' },
    { field: 'role', header: 'Rol' }
  ];

  roles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Usuario', value: 'user' }
  ];

  getStatusLabel(status: boolean | string): string {
    // Convierte a booleano si es un string
    const boolStatus = typeof status === 'string' 
      ? status.toLowerCase() === 'true' 
      : status;
    
    return boolStatus ? 'Activo' : 'Inactivo';
  }
  
  getStatusSeverity(status: boolean | string): "success" | "danger" {
    // Convierte a booleano si es un string
    const boolStatus = typeof status === 'string' 
      ? status.toLowerCase() === 'true' 
      : status;
    
    return boolStatus ? "success" : "danger";
  }

  statusOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];


  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  private getEmptyUser(): User {
    return {
      name: '',
      email: '',
      contactNumber: '',
      role: 'USER',
      status: true
    };
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        console.log("Usuarios recibidos del backend:", data);
        console.log("Usuarios inactivos:", data.filter(user => user.status === false));
        this.users = data;
      },
      error: (error) => {
        this.showError('No se pudieron cargar los usuarios', error);
      }
    });
  }

  openNew(): void {
    this.user = this.getEmptyUser();
    this.submitted = false;
    this.userDialog = true;
    this.editMode = false;
  }

  hideDialog(): void {
    this.userDialog = false;
    this.submitted = false;
  }

  editUser(user: User): void {
    console.log('Usuario completo:', user);
    
    // Capturar 'contactnumber' con minúscula
    const contactNumber = (user as any).contactnumber || user.contactNumber || '';
  
    this.user = { 
      ...user, 
      password: '',
      contactNumber: contactNumber
    };
  
    console.log('Usuario después de editar:', this.user);
    
    this.editMode = true;
    this.userDialog = true;
  }

  saveUser(): void {
    
    this.submitted = true;

    console.log('Usuario antes de guardar:', this.user.status);


    if (!this.user.name || !this.user.email || (!this.editMode && !this.user.password)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    const userToSend: Partial<User> = {
      name: this.user.name,
      email: this.user.email,
      contactNumber: this.user.contactNumber || '',
      role: this.user.role,
      status: this.user.status
    };
    
    
    if (this.user.password) {
      userToSend.password = this.user.password;
    }

    if (this.editMode) {
      this.updateExistingUser(userToSend);
    } else {
      this.createNewUser(userToSend);
    }
  }

  private updateExistingUser(userToSend: Partial<User>): void {
    if (!this.user.id) return;

    this.userService.updateUser({ ...userToSend, id: this.user.id }).subscribe({
      next: (data: User) => {
        const index = this.findIndexById(this.user.id!);
        if (index !== -1) {
          this.users[index] = data;
        }
        this.showSuccess('Usuario actualizado');
        this.userDialog = false;
        this.loadUsers();
      },
      error: (error) => {
        this.showError('Error al actualizar usuario', error);
      }
    });
  }

  private createNewUser(userToSend: Partial<User>): void {
    this.userService.saveUser(userToSend).subscribe({
      next: (data: User) => {
        this.users.push(data);
        this.showSuccess('Usuario creado');
        this.userDialog = false;
        this.loadUsers();
      },
      error: (error) => {
        this.showError('Error al crear usuario', error);
      }
    });
  }

  deleteUser(user: User): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este usuario?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!user.id) return;
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.users = this.users.filter(val => val.id !== user.id);
            this.showSuccess('Usuario eliminado');
          },
          error: (error) => {
            this.showError('Error al eliminar usuario', error);
          }
        });
      }
    });
  }

  deleteSelectedUsers(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar los usuarios seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const deletionPromises = this.selectedUsers
            .filter(user => user.id)
            .map(user => firstValueFrom(this.userService.deleteUser(user.id!)));

          await Promise.all(deletionPromises);

          this.users = this.users.filter(
            val => !this.selectedUsers.some(sc => sc.id === val.id)
          );
          this.showSuccess('Usuarios eliminados');
          this.selectedUsers = [];
        } catch (error) {
          this.showError('Error al eliminar usuarios', error);
        }
      }
    });
  }

  private showSuccess(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail,
      life: 3000
    });
  }

  private showError(detail: string, error?: any): void {
    console.error(detail, error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error?.error?.message ? `${detail}: ${error.error.message}` : detail
    });
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  async exportCSV(): Promise<void> {
    try {
      const xlsx = await import('xlsx');
      const worksheet = xlsx.utils.json_to_sheet(this.users);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'usuarios');
    } catch (error) {
      this.showError('Error al exportar usuarios', error);
    }
  }

  private async saveAsExcelFile(buffer: any, fileName: string): Promise<void> {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const fileSaver = await import('file-saver');
    fileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  private findIndexById(id: number): number {
    return this.users.findIndex(user => user.id === id);
  }
}
