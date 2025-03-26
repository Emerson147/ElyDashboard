import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, CardModule, CommonModule, TableModule, DropdownModule, ReactiveFormsModule],
  templateUrl: './ventas.component.html',
  styles: ``
})
export class VentasComponent  {
  


}
