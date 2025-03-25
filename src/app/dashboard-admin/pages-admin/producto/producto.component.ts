import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ProductsService } from '../service/products.service';
import { CategoryService } from '../service/category.service';
import { WarehouseService } from '../service/warehouse.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [
    ToolbarModule, 
    ButtonModule, 
    TableModule, 
    DialogModule, 
    ConfirmDialogModule, 
    InputTextModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    ToastModule,
    FileUploadModule,
    IconFieldModule,
    InputIconModule,
    TextareaModule,
    TagModule,
    RatingModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './producto.component.html',
})
export class ProductoComponent implements OnInit {
  products: any[] = [];
  product: any = {};
  productForm!: FormGroup;
  submitted: boolean = false;
  productDialog: boolean = false;
  editMode: boolean = false;
  filterValue: string = '';
  selectedProducts: any[] = [];
  cols: any[] = [];
  statuses: any[] = [
    { label: 'In Stock', value: 'true' },
    { label: 'Out of Stock', value: 'false' }
  ];
  categories: any[] = [];
  warehouses: any[] = [];


  constructor(
    private productsService: ProductsService,
    private categoryService: CategoryService,
    private warehouseService: WarehouseService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.loadCategories();
    this.loadWarehouses();
  }

  private initForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      warehouse: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required],
      discount: ['', Validators.required],
      rating: ['', Validators.required]
    });
  }

  loadProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los productos'
        });
        console.error('Error al cargar productos:', error);
      }
    });
  }

  loadCategories() {
    this.categoryService.getAllCategory().subscribe({
      next: (data) => {
        // Transformar las categorías al formato que espera el dropdown
        this.categories = data.map((category: any) => ({
          label: category.name,
          value: category.id
        }));
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las categorías'
        });
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  loadWarehouses() {
    this.warehouseService.getAllWarehouse().subscribe({
      next: (data) => {
        // Transformar los almacenes al formato que espera el dropdown
        this.warehouses = data.map((warehouse: any) => ({
          label: warehouse.name,
          value: warehouse.id
        }));
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los almacenes'
        });
        console.error('Error al cargar almacenes:', error);
      }
    });
  }

  openNew() {
    this.product = {};
    this.productForm.reset();
    this.submitted = false;
    this.productDialog = true;
    this.editMode = false;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.productForm.reset();
  }

  get filteredProducts() {
    if (!this.filterValue) {
      return this.products;
    }
    
    const filter = this.filterValue.toLowerCase();
    
    return this.products.filter(product => {
      const nameMatch = product.name?.toLowerCase().includes(filter) || false;
      const descriptionMatch = product.description?.toLowerCase().includes(filter) || false;
      return nameMatch || descriptionMatch;
    });
  }


  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar los productos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          const deletionPromises = this.selectedProducts.map(product => 
            firstValueFrom(this.productsService.deleteProduct(product.id))
          );
          
          await Promise.all(deletionPromises);
          
          this.products = this.products.filter(
            val => !this.selectedProducts.some(sc => sc.id === val.id)
          );
          this.showSuccess('Productos eliminados');
          this.selectedProducts = [];
        } catch (error) {
          this.showError('Error al eliminar algunos productos', error);
        }
      }
    });
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  exportCSV() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.products);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'productos');
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

  editProduct(product: any) {
    this.product = { ...product };
    this.productDialog = true;
    this.editMode = true;
  }

  deleteProduct(product: any) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el producto ${product.name}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService.deleteProduct(product.id).subscribe({
          next: () => {
            this.products = this.products.filter(val => val.id !== product.id);
            this.showSuccess(`Producto ${product.name} eliminado`);
          },
          error: (error) => {
            this.showError('Error al eliminar el producto', error);
          }
        });
      }
    });
  }

  saveProduct() {
    this.submitted = true;

    // Validar campos requeridos
    if (!this.product.name || !this.product.description || !this.product.price || 
        !this.product.stock || !this.product.category || !this.product.warehouse) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    // Preparar el objeto producto para enviarlo al backend
    const productToSend = {
      name: this.product.name,
      description: this.product.description,
      price: typeof this.product.price === 'object' ? this.product.price.value : this.product.price,
      stock: typeof this.product.stock === 'object' ? this.product.stock.value : this.product.stock,
      serie: this.product.serie || '',
      codigo: this.product.codigo || '',
      categoryId: this.product.category, // Enviamos el ID de la categoría
      warehouseId: this.product.warehouse, // Enviamos el ID del almacén
      status: this.product.inventoryStatus === 'true' // Convertimos a booleano
    };

    console.log('Enviando producto al backend:', productToSend);

    if (this.editMode) {
      // Añadir el ID si estamos en modo edición
      const productToUpdate = {
        ...productToSend,
        id: this.product.id
      };

      this.productsService.updateProduct(productToUpdate).subscribe({
        next: (response) => {
          this.loadProducts(); // Recargar la lista completa
          this.productDialog = false;
          this.showSuccess(`Producto ${this.product.name} actualizado correctamente`);
          this.product = {};
        },
        error: (error) => {
          this.showError('Error al actualizar el producto', error);
        }
      });
    } else {
      this.productsService.createProduct(productToSend).subscribe({
        next: (response) => {
          this.loadProducts(); // Recargar la lista completa
          this.productDialog = false;
          this.showSuccess(`Producto ${this.product.name} creado correctamente`);
          this.product = {};
        },
        error: (error) => {
          this.showError('Error al crear el producto', error);
        }
      });
    }
  }

  getSeverity(status: string) {
    switch (status) {
      case 'true':
        return 'success';
      case 'false':
        return 'danger';
      default:
        return 'info';
    }
  }
}
