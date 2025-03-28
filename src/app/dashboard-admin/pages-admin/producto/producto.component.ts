import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Table, TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from "primeng/card";
import { MessageService } from "primeng/api";
import { ConfirmationService } from "primeng/api";
import { ProductsService } from "../service/products.service";
import { CategoryService } from "../service/category.service";
import { WarehouseService } from "../service/warehouse.service";
import { ToolbarModule } from "primeng/toolbar";
import { firstValueFrom } from "rxjs";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { TextareaModule } from "primeng/textarea";
import { SelectButtonModule } from "primeng/selectbutton";
import { TagModule } from "primeng/tag";
import { SelectModule } from "primeng/select";
import { InputNumberModule } from "primeng/inputnumber";
import { catchError, throwError } from "rxjs";

interface Product {
  id?: number;
  codigo?: string;
  name: string;
  description: string;
  price: number;
  status: string;
  serie?: string;
  stock: number;
  categoryId?: number;
  warehouseId?: number;
}

@Component({
  selector: "app-productos",
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
    SelectButtonModule,
    TagModule,
    InputNumberModule,
    SelectModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: "./producto.component.html",
})
export class ProductoComponent implements OnInit {
  products: Product[] = [];
  product: Product = this.getEmptyProduct();
  submitted = false;
  productDialog = false;
  editMode = false;
  selectedProducts: Product[] = []; // Renamed from filteredProducts for clarity

  cols = [
    { field: "codigo", header: "Código" },
    { field: "name", header: "Nombre" },
    { field: "description", header: "Descripción" },
    { field: "price", header: "Precio" },
    { field: "stock", header: "Stock" },
    { field: "status", header: "Estado" },
  ];

  statusOptions = [
    { label: "Stock", value: true },
    { label: "No Stock", value: false },
  ];

  categories: any[] = [];
  warehouses: any[] = [];

  getStatusLabel(status: boolean | string): string {
    const boolStatus =
      typeof status === "string" ? status.toLowerCase() === "true" : status;
    return boolStatus ? "Stock" : "No Stock";
  }

  getStatusSeverity(status: boolean | string): "success" | "danger" {
    const boolStatus =
      typeof status === "string" ? status.toLowerCase() === "true" : status;
    return boolStatus ? "success" : "danger";
  }

  constructor(
    private productsService: ProductsService,
    private categoryService: CategoryService,
    private warehouseService: WarehouseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  private getEmptyProduct(): Product {
    return {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      status: 'true', // Cambiar a booleano
      codigo: '',
      serie: '',
      categoryId: undefined,
      warehouseId: undefined
    };
  }
  
  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadWarehouses();
  }

  loadProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error) => {
        this.showError("No se pudieron cargar los productos", error);
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategory().subscribe({
      next: (data: any[]) => {
        this.categories = data.map((category) => ({
          label: category.name,
          value: {
            id: category.id,
            name: category.name
          }
        }));
      },
      error: (error) => {
        this.showError("No se pudieron cargar las categorías", error);
      },
    });
  }
  
  loadWarehouses(): void {
    this.warehouseService.getAllWarehouse().subscribe({
      next: (data: any[]) => {
        this.warehouses = data.map((warehouse) => ({
          label: warehouse.name,
          value: {
            id: warehouse.id,
            name: warehouse.name
          }
        }));
      },
      error: (error) => {
        this.showError("No se pudieron cargar los almacenes", error);
      },
    });
  }

  openNew(): void {
    this.product = this.getEmptyProduct();
    this.submitted = false;
    this.editMode = false;
    this.productDialog = true;
  }

  hideDialog(): void {
    this.productDialog = false;
    this.submitted = false;
  }

  editProduct(product: Product): void {
    this.product = {
      ...product,
      categoryId: product.categoryId,
      warehouseId: product.warehouseId
    };
    this.editMode = true;
    this.productDialog = true;
  }

  saveProduct(): void {
    this.submitted = true;

    const errors: string[] = [];

    if (!this.product.codigo?.trim()) errors.push('Código');
    if (!this.product.name?.trim()) errors.push('Nombre');
    if (!this.product.serie?.trim()) errors.push('Serie');
    if (!this.product.categoryId) errors.push('Categoría');
    if (!this.product.warehouseId) errors.push('Almacén');
    if (!this.product.description?.trim()) errors.push('Descripción');
    if (this.product.price <= 0) errors.push('Precio');
    if (this.product.stock <= 0) errors.push('Stock');
    if (!this.product.status) errors.push('Estado');

    if (errors.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: `Por favor complete los siguientes campos: ${errors.join(', ')}`
      });
      return;
    }

    const requestData = {
      name: this.product.name,
      codigo: this.product.codigo,
      description: this.product.description,
      serie: this.product.serie,
      price: this.product.price,
      stock: this.product.stock,
      status: this.product.status,
      categoryId: typeof this.product.categoryId === 'object' 
        ? (this.product.categoryId as any).id 
        : this.product.categoryId,
      warehouseId: typeof this.product.warehouseId === 'object' 
        ? (this.product.warehouseId as any).id 
        : this.product.warehouseId
    };

    if (this.editMode) {
      this.updateExistingProduct(requestData);
    } else {
      this.createNewProduct(requestData);
    }
  }

  private updateExistingProduct(productToSend: Partial<Product>): void {
    if (!this.product.id) return;

    this.productsService.updateProduct(productToSend as Product).subscribe({
      next: (data: Product) => {
        const index = this.findIndexById(this.product.id!);
        if (index !== -1) {
          this.products[index] = data;
        }
        this.showSuccess("Producto actualizado");
        this.productDialog = false;
        this.loadProducts();
      },
      error: (error) => {
        this.showError("Error al actualizar producto", error);
      },
    });
  }

  private createNewProduct(productToSend: Partial<Product>): void {
    this.productsService.createProduct(productToSend).subscribe({
        next: (data: Product) => {
          this.products.push(data);
          this.showSuccess('Producto creado');
          this.productDialog = false;
          this.loadProducts();
        },
        error: (error) => {
          this.showError('Error al crear usuario', error)
        }
      });
  }

  deleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: "¿Está seguro que desea eliminar este producto?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        if (!product.id) return;
        this.productsService.deleteProduct(product.id).subscribe({
          next: () => {
            this.products = this.products.filter(
              (val) => val.id !== product.id,
            );
            this.showSuccess("Producto eliminado");
          },
          error: (error) => {
            this.showError("Error al eliminar producto", error);
          },
        });
      },
    });
  }

  deleteSelectedProducts(): void {
    this.confirmationService.confirm({
      message: "¿Está seguro que desea eliminar los productos seleccionados?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          const deletionPromises = this.selectedProducts
            .filter((product) => product.id)
            .map((product) =>
              firstValueFrom(this.productsService.deleteProduct(product.id!)),
            );

          await Promise.all(deletionPromises);

          this.products = this.products.filter(
            (val) => !this.selectedProducts.some((sc) => sc.id === val.id),
          );
          this.showSuccess("Productos eliminados");
          this.selectedProducts = [];
        } catch (error) {
          this.showError("Error al eliminar productos", error);
        }
      },
    });
  }

  private showSuccess(detail: string): void {
    this.messageService.add({
      severity: "success",
      summary: "Éxito",
      detail,
      life: 3000,
    });
  }

  private showError(detail: string, error?: any): void {
    console.error(detail, error);
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: error?.error?.message
        ? `${detail}: ${error.error.message}`
        : detail,
    });
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, "contains");
  }

  async exportCSV(): Promise<void> {
    try {
      const xlsx = await import("xlsx");
      const worksheet = xlsx.utils.json_to_sheet(this.products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      this.saveAsExcelFile(excelBuffer, "productos");
    } catch (error) {
      this.showError("Error al exportar productos", error);
    }
  }

  private async saveAsExcelFile(buffer: any, fileName: string): Promise<void> {
    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const fileSaver = await import("file-saver");
    fileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION,
    );
  }

  private findIndexById(id: number): number {
    return this.products.findIndex((product) => product.id === id);
  }

}
