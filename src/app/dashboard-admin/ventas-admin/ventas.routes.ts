import { Component } from "@angular/core"
import { Routes } from "@angular/router"
import { ClientesComponent } from "./clientes/clientes.component"
import { ReportesComponent } from "./reportes/reportes.component"
import { VentasComponent } from "./ventas/ventas.component"
import { BusquedaComponent } from "./busqueda/busqueda.component"


export default [
  { path: 'clientes', component: ClientesComponent},
  { path: 'reportes', component: ReportesComponent},
  { path: 'ventas', component: VentasComponent},
  { path: 'busqueda', component: BusquedaComponent}
] as Routes;