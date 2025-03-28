import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { WarehouseService } from '../service/warehouse.service';
import { ToolbarModule } from 'primeng/toolbar';
import { firstValueFrom } from 'rxjs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-almacen',
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
    TextareaModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './almacen.component.html'
})
export class AlmacenComponent implements OnInit {
  warehouses: any[] = [];
  warehouse: any = {};
  submitted: boolean = false;
  warehouseDialog: boolean = false;
  editMode: boolean = false;
  filterValue: string = '';
  selectedWarehouses: any[] = [];
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
    { field: 'location', header: 'Ubicación' },
    { field: 'description', header: 'Descripción' }
  ];
  
  constructor(
    private warehouseService: WarehouseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadWarehouses();
  }

  loadWarehouses() {
    this.warehouseService.getAllWarehouse().subscribe({
      next: (data) => {
        this.warehouses = data;
      },
      error: (error) => {
        this.showError('No se pudieron cargar los almacenes', error);
      }
    });
  }

  openNew() {
    this.warehouse = {};
    this.submitted = false;
    this.warehouseDialog = true;
    this.editMode = false;
  }

  hideDialog() {
    this.warehouseDialog = false;
    this.submitted = false;
  }

  editWarehouse(warehouse: any) {
    this.warehouse = {...warehouse};
    this.editMode = true;
    this.warehouseDialog = true;
  }

  saveWarehouse() {
    this.submitted = true;
    
    // Validar campos requeridos
    if (!this.warehouse.name || !this.warehouse.location) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
      return;
    }
    
    // Preparar el objeto almacén para enviarlo al backend
    const warehouseToSend = {
      name: this.warehouse.name,
      location: this.warehouse.location,
      description: this.warehouse.description || ''
    };

    if (this.editMode) {
      const updatedWarehouse = {
        ...warehouseToSend,
        id: this.warehouse.id
      };

      this.warehouseService.updateWarehouse(updatedWarehouse).subscribe({
        next: (data) => {
          const index = this.findIndexById(this.warehouse.id);
          if (index !== -1) {
            this.warehouses[index] = data;
          }
          this.showSuccess('Almacén actualizado');
          this.warehouseDialog = false;
          this.loadWarehouses();
        },
        error: (error) => {
          this.showError('Error al actualizar almacén', error);
        }
      });
    } else {
      this.warehouseService.saveWarehouse(warehouseToSend).subscribe({
        next: (data) => {
          this.warehouses.push(data);
          this.showSuccess('Almacén creado');
          this.warehouseDialog = false;
          this.loadWarehouses();
        },
        error: (error) => {
          this.showError('Error al crear almacén', error);
        }
      });
    }
  }

  deleteWarehouse(warehouse: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este almacén?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.warehouseService.deleteWarehouse(warehouse.id).subscribe({
          next: () => {
            this.warehouses = this.warehouses.filter(val => val.id !== warehouse.id);
            this.showSuccess('Almacén eliminado');
          },
          error: (error) => {
            this.showError('Error al eliminar almacén', error);
          }
        });
      }
    });
  }

  deleteSelectedWarehouses() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar los almacenes seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const deletionPromises = this.selectedWarehouses.map(warehouse => 
            firstValueFrom(this.warehouseService.deleteWarehouse(warehouse.id))
          );
          
          await Promise.all(deletionPromises);
          
          this.warehouses = this.warehouses.filter(
            val => !this.selectedWarehouses.some(sc => sc.id === val.id)
          );
          this.showSuccess('Almacenes eliminados');
          this.selectedWarehouses = [];
        } catch (error) {
          this.showError('Error al eliminar almacenes', error);
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
    if (error) {
      console.error(detail, error);
    } 
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error?.error?.message ? `${detail}: ${error.error.message}` : detail
    });
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  exportCSV() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.warehouses);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'almacenes');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(module => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      module.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }


  findIndexById(id: number): number {
    return this.warehouses.findIndex(warehouse => warehouse.id === id);
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value; 
  }

  get filteredWarehouses() {
    if (!this.filterValue) {
      return this.warehouses;
    }

    const filter = this.filterValue.toLowerCase();

    return this.warehouses.filter(warehouse => {
      // Verificar si name existe antes de llamar a toLowerCase
      const nameMatch = warehouse.name ? 
        warehouse.name.toLowerCase().includes(filter) : 
        false;
      
      // Verificar si location existe antes de llamar a toLowerCase
      const locationMatch = warehouse.location ? 
        warehouse.location.toLowerCase().includes(filter) : 
        false;
        
      // Verificar si description existe antes de llamar a toLowerCase
      const descriptionMatch = warehouse.description ? 
        warehouse.description.toLowerCase().includes(filter) : 
        false;
        
      return nameMatch || locationMatch || descriptionMatch;
    })

  }


}
