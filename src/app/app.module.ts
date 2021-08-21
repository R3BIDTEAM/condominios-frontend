import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { BnNgIdleService } from 'bn-ng-idle';
registerLocaleData(localeEsMx, 'es-Mx');
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardElevationDirective } from './card-elevation.directive';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { LoginFirmaComponent } from './components/login-firma/login-firma.component';
import { MainComponent } from './components/main/main.component';
import { ConsultaExpedientesComponent } from './components/reportes/consulta-expedientes/consulta-expedientes.component';
import { BandejaTareasComponent } from './components/bandeja-tareas/bandeja-tareas.component';
import { DialogsComponent, DialogsAlta, DialogsCuenta, DialogPropietarios, DialogsDatosPropietarios, DialogInstalaciones,
          DialogUnidadPrivativa, DialogDatosCondominio } from './components/dialogs/dialogs.component';
import { BandejaEntradaComponent } from './components/bandeja-entrada/bandeja-entrada.component';
import { RevisionSolicitudesComponent } from './components/revision-solicitudes/revision-solicitudes.component';
import { SeguimientoSolicitudesComponent } from './components/seguimiento-solicitudes/seguimiento-solicitudes.component';
import { BusquedaCuentaPredialComponent } from './components/busqueda-cuenta-predial/busqueda-cuenta-predial.component';
import { ConsultaReportesComponent } from './components/consulta-reportes/consulta-reportes.component';
import { ConsultaReportesNoComponent } from './components/consulta-reportes-no/consulta-reportes-no.component';
import { DatosGeneralesComponent } from './components/datos-generales/datos-generales.component';
import { DatosGeneralesEditarComponent } from './components/datos-generales-editar/datos-generales-editar.component';
import { DomicilioComponent, DialogMunicipios, DialogCiudad, DialogAsentamiento, DialogVia } from './components/domicilio/domicilio.component';

@NgModule({
  declarations: [
    AppComponent,
    CardElevationDirective,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    MenuComponent,
    LoginFirmaComponent,
    MainComponent,
    ConsultaExpedientesComponent,
    BandejaTareasComponent,
    DialogsComponent,
    DialogsAlta,
    BandejaEntradaComponent,
    DialogsCuenta,
    RevisionSolicitudesComponent,
    SeguimientoSolicitudesComponent,
    BusquedaCuentaPredialComponent,
    ConsultaReportesComponent,
    ConsultaReportesNoComponent,
    DatosGeneralesComponent,
    DatosGeneralesEditarComponent,
    DomicilioComponent,
    DialogMunicipios,
    DialogCiudad,
    DialogAsentamiento,
    DialogVia,
    DialogPropietarios,
    DialogsDatosPropietarios,
    DialogInstalaciones,
    DialogUnidadPrivativa,
    DialogDatosCondominio
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarModule,
    NgxMatFileInputModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Mx' },
    BnNgIdleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
