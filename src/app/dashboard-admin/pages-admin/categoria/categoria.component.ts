import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    TableModule, 
    ButtonModule, 
    DialogModule, 
    ToastModule, 
    ConfirmDialogModule, 
    InputTextModule, 
    CardModule,
    ToolbarModule,
    FileUploadModule, 
    IconFieldModule, 
    InputIconModule,
    TextareaModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './categoria.component.html'
})

export class CategoriaComponent implements OnInit {
  categorias: any[] = [];
  categoria: any = {};
  categoriaForm!: FormGroup;
  submitted: boolean = false;
  categoriaDialog: boolean = false;
  editMode: boolean = false;
  filterValue: string = '';
  selectedCategories: any[] = [];
  cols: any[] = [
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Descripción' }
  ];

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadCategorias();
    this.initForm();
    this.cols = [
      { field: 'name', header: 'Nombre' },
      { field: 'description', header: 'Descripción' }
    ];
  }

  private initForm(): void {
    this.categoriaForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  loadCategorias() {
    this.categoryService.getAllCategory().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        this.showError('No se pudieron cargar las categorías', error);
      }
    });
  }

  openNew() {
    this.categoria = {};
    this.categoriaForm.reset();
    this.submitted = false;
    this.categoriaDialog = true;
    this.editMode = false;
  }

  editCategoria(categoria: any) {
    this.categoria = { ...categoria };
    this.categoriaForm.setValue({
      name: categoria.name,
      description: categoria.description || ''
    });
    this.editMode = true;
    this.categoriaDialog = true;
  }

  hideDialog() {
    this.categoriaDialog = false;
    this.submitted = false;
    this.categoriaForm.reset();
  }
 
  saveCategoria() {
    this.submitted = true;

    // Validar los campos requeridos
    if (this.categoriaForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    // Preparar el objeto de categoria para enviarlo al backend
    const categoriaToSend = {
      name: this.categoriaForm.value.name,
      description: this.categoriaForm.value.description
    };

    if (this.editMode) {
      const updatedCategory = {
        ...categoriaToSend,
        id: this.categoria.id
      };

      this.categoryService.updateCategory(updatedCategory).subscribe({
        next: (data) => {
          const index = this.findIndexById(this.categoria.id);
          if (index !== -1) {
            this.categorias[index] = data;
          }
          this.showSuccess('Categoría actualizada');
          this.categoriaDialog = false;
          this.loadCategorias();
        },
        error: (error) => {
          this.showError('Error al actualizar categoría', error);
        }
      });
    } else {
      this.categoryService.saveCategory(categoriaToSend).subscribe({
        next: (data) => {
          this.categorias.push(data);
          this.showSuccess('Categoría creada');
          this.categoriaDialog = false;
          this.loadCategorias();
        },
        error: (error) => {
          this.showError('Error al crear categoría', error);
        }
      });
    }
  }

  deleteCategoria(categoria: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar esta categoría?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService.deleteCategory(categoria.id).subscribe({
          next: () => {
            this.categorias = this.categorias.filter(val => val.id !== categoria.id);
            this.showSuccess('Categoría eliminada');
          },
          error: (error) => {
            this.showError('Error al eliminar categoría', error);
          }
        });
      }
    });
  }

  findIndexById(id: number): number {
    return this.categorias.findIndex(categoria => categoria.id === id);
  }
  
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value; 
  }

  get filteredCategorias() {
    if (!this.filterValue) {
      return this.categorias;
    }
    
    const filter = this.filterValue.toLowerCase();
    
    return this.categorias.filter(categoria => {
      const nameMatch = categoria.name?.toLowerCase().includes(filter) || false;
      const descriptionMatch = categoria.description?.toLowerCase().includes(filter) || false;
      return nameMatch || descriptionMatch;
    });
  }

  deleteSelectedCategories() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar las categorías seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try { 
          const deletionPromises = this.selectedCategories.map(categoria => 
            firstValueFrom(this.categoryService.deleteCategory(categoria.id))
          );
          
          await Promise.all(deletionPromises);
          
          this.categorias = this.categorias.filter(
            val => !this.selectedCategories.some(sc => sc.id === val.id)
          );
          this.showSuccess('Categorías eliminadas');
          this.selectedCategories = [];
        } catch (error) {
          this.showError('Error al eliminar algunas categorías', error);
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
      const worksheet = xlsx.utils.json_to_sheet(this.categorias);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'categorias');
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
}