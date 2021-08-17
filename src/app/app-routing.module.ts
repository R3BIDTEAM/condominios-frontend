import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFirmaComponent } from '@comp/login-firma/login-firma.component';
import { LoginComponent } from '@comp/login/login.component';
import { MainComponent } from '@comp/main/main.component';
import { GuardService } from '@serv/guard.service';
import { BandejaTareasComponent } from '@comp/bandeja-tareas/bandeja-tareas.component';
import { ConsultaExpedientesComponent } from '@comp/reportes/consulta-expedientes/consulta-expedientes.component';
import { BandejaEntradaComponent } from '@comp/bandeja-entrada/bandeja-entrada.component';
import { RevisionSolicitudesComponent } from '@comp/revision-solicitudes/revision-solicitudes.component';
import { SeguimientoSolicitudesComponent } from '@comp/seguimiento-solicitudes/seguimiento-solicitudes.component';
import { BusquedaCuentaPredialComponent } from '@comp/busqueda-cuenta-predial/busqueda-cuenta-predial.component';
import { ConsultaReportesComponent } from '@comp/consulta-reportes/consulta-reportes.component';
import { ConsultaReportesNoComponent } from '@comp/consulta-reportes-no/consulta-reportes-no.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
 // { path: '', component: LoginFirmaComponent },
  {
    path: 'main', component: MainComponent, canActivate: [GuardService],
    children: [
       // { path: '', component: , canActivate: [GuardService] }
       { path: 'bandeja-entrada', component: BandejaEntradaComponent, canActivate: [GuardService] },
       { path: 'revision-solicitudes', component: RevisionSolicitudesComponent, canActivate: [GuardService] },
       { path: 'seguimiento-solicitudes', component: SeguimientoSolicitudesComponent, canActivate: [GuardService] },
       { path: 'busqueda-cuenta-predial', component: BusquedaCuentaPredialComponent, canActivate: [GuardService] },
       { path: 'consulta-reportes', component: ConsultaReportesComponent, canActivate: [GuardService] },
       { path: 'consulta-reportes-no', component: ConsultaReportesNoComponent, canActivate: [GuardService] },
       { path: 'bandeja-tareas', component: BandejaTareasComponent, canActivate: [GuardService] },
       { path: 'consulta-expedientes', component: ConsultaExpedientesComponent, canActivate: [GuardService] },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
