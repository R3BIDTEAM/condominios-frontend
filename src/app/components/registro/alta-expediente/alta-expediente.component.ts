import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

export interface DataExpediente {
  IDTIPOTRAMITE: string;
  FECHAENTRADA: string;
  FECHATERMINO: string;
  OBSERVACIONES: string;
}
export interface DataPromoventeRepresentante {
  TIPOPERSONA: string;
  IDPERSONAAYC: number;
  NOMBRE: string;
  APELLIDOPATERNO: string;
  APELLIDOMATERNO: string;
  RFC: string;
  CURP: string;
  CLAVEIFE: string;
  IDDOCIDENTIF: number;
  OTROS: string;
  CELULAR: string;
  EMAIL: string;
  ACTIVPRINCIP: string;
  NOTIFICACION: boolean;
}
@Component({
  selector: 'app-alta-expediente',
  templateUrl: './alta-expediente.component.html',
  styleUrls: ['./alta-expediente.component.css'],
  providers: [DatePipe]
})
export class AltaExpedienteComponent implements OnInit {
  loadingTiposTramite = false;
  tiposTramite;
  loadingTiposPersona = false;
  tiposPersona;
  loadingTiposDocIdentif = false;
  tiposDocIdentif;
  documentosAportar = [1,1,1,1];
  documentosAportarColumns: string[] = ['conjunto_documental', 'documento', 'obligatorio', 'check'];
  hoy = new Date();
  isEdicionPromovente = false;
  isEdicionRepresentante = false;
  indexEdicionPromovente;
  indexEdicionRepresentante;
  tipoPersonaPromovente = 'FISICA';
  tipoPersonaRepresentante = 'FISICA';
  dataExpediente: DataExpediente = {} as DataExpediente;
  dataPromoventes: DataPromoventeRepresentante[] = [];
  dataRepresentante: DataPromoventeRepresentante[] = [];
  promoventeFisica: FormGroup;
  promoventeMoral: FormGroup;
  representanteFisica: FormGroup;
  representanteMoral: FormGroup;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getTiposTramite();
    this.getTiposPersona();
    this.getTiposDocIdentif();

    this.dataExpediente.IDTIPOTRAMITE = "";
    this.dataExpediente.FECHAENTRADA = "FEC_" + this.datePipe.transform(this.hoy, 'dd/MM/yyyy');
    this.dataExpediente.FECHATERMINO = "FEC_" + this.datePipe.transform(this.hoy, 'dd/MM/yyyy');
    
    this.promoventeFisica = this._formBuilder.group({
      NOMBRE: [null, [Validators.required]],
      APELLIDOPATERNO: [null, [Validators.required]],
      APELLIDOMATERNO: [null, []],
      RFC: [null, [Validators.required]],
      CURP: [null, [Validators.required]],
      CLAVEIFE: [null, []],
      IDDOCIDENTIF: ['', []],
      OTROS: [null, []],
      CELULAR: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      EMAIL: [null, [Validators.required, Validators.email]],
    });

    this.promoventeMoral = this._formBuilder.group({
      NOMBRE: [null, [Validators.required]],
      RFC: [null, [Validators.required]],
      ACTIVPRINCIP: [null, [Validators.required]],
    });

    this.representanteFisica = this._formBuilder.group({
      NOMBRE: [null, [Validators.required]],
      APELLIDOPATERNO: [null, [Validators.required]],
      APELLIDOMATERNO: [null, []],
      RFC: [null, [Validators.required]],
      CURP: [null, [Validators.required]],
      CLAVEIFE: [null, []],
      IDDOCIDENTIF: ['', []],
      OTROS: [null, []],
      CELULAR: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      EMAIL: [null, [Validators.required, Validators.email]],
    });

    this.representanteMoral = this._formBuilder.group({
      NOMBRE: [null, [Validators.required]],
      RFC: [null, [Validators.required]],
      ACTIVPRINCIP: [null, [Validators.required]],
    });
  }

  getTiposTramite(): void {
    let catTiposTramite = environment.endpoint + '?action=getCatalogo&table=ADYCON_CATTIPOSTRAMITE';
    let filtro = "{\n    \"FILTER\": \"\"\n}";
    this.loadingTiposTramite = true;
    this.http.post(catTiposTramite, filtro).subscribe(
      (res: any) => {
        this.loadingTiposTramite = false;
        if(res.error.code === 0)
        {
          this.tiposTramite = res.data.result;
        } else {
          this.snackBar.open(res.error.message, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      },
      (error) => {
        this.loadingTiposTramite = false;
        this.snackBar.open(error.message, 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    );
  }

  getTiposPersona(): void {
    let catTipoPersona = environment.endpoint + '?action=getCatalogo&table=ADYCON_CATTIPOPEERSONA';
    let filtro = "{\n    \"FILTER\": \"\"\n}";
    this.loadingTiposPersona = true;
    this.http.post(catTipoPersona, filtro).subscribe(
      (res: any) => {
        this.loadingTiposPersona = false;
        if(res.error.code === 0)
        {
          this.tiposPersona = res.data.result;
        } else {
          this.snackBar.open(res.error.message, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      },
      (error) => {
        this.loadingTiposPersona = false;
        this.snackBar.open(error.message, 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    );
  }

  getTiposDocIdentif(): void {
    let catDocIdentif = environment.endpoint + '?action=getCatalogo&table=RCON_CATDOCIDENTIF';
    let filtro = "{\n    \"FILTER\": \"\"\n}";
    this.loadingTiposDocIdentif = true;
    this.http.post(catDocIdentif, filtro).subscribe(
      (res: any) => {
        this.loadingTiposDocIdentif = false;
        if(res.error.code === 0)
        {
          this.tiposDocIdentif = res.data.result;
        } else {
          this.snackBar.open(res.error.message, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      },
      (error) => {
        this.loadingTiposDocIdentif = false;
        this.snackBar.open(error.message, 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    );
  }

  clearFormPromovente(): void {
    this.promoventeFisica.reset();
    this.promoventeMoral.reset();
    this.isEdicionPromovente = false;
    this.indexEdicionPromovente = undefined;
  }

  addPromoventeFisica(): void {
    if(this.validatePromoventeRepresentante(this.promoventeFisica.value.RFC)){
      let promovente = {} as DataPromoventeRepresentante; 
      promovente.TIPOPERSONA = this.tipoPersonaPromovente;
      promovente.IDPERSONAAYC = 0;
      promovente.NOMBRE = this.promoventeFisica.value.NOMBRE;
      promovente.APELLIDOPATERNO = this.promoventeFisica.value.APELLIDOPATERNO;
      promovente.APELLIDOMATERNO = (this.promoventeFisica.value.APELLIDOMATERNO) ? this.promoventeFisica.value.APELLIDOMATERNO : null;
      promovente.RFC = this.promoventeFisica.value.RFC;
      promovente.CURP = this.promoventeFisica.value.CURP;
      promovente.CLAVEIFE = (this.promoventeFisica.value.CLAVEIFE) ? this.promoventeFisica.value.CLAVEIFE : null;
      promovente.IDDOCIDENTIF = (this.promoventeFisica.value.IDDOCIDENTIF) ? this.promoventeFisica.value.IDDOCIDENTIF : 0;
      promovente.OTROS = (this.promoventeFisica.value.OTROS) ? this.promoventeFisica.value.OTROS : null;
      promovente.CELULAR = this.promoventeFisica.value.CELULAR;
      promovente.EMAIL = this.promoventeFisica.value.EMAIL;
      promovente.NOTIFICACION = false;

      this.dataPromoventes.push(promovente);
      this.clearFormPromovente();
    } else {
      this.snackBar.open("No puede agregar como promovente una persona que ya esta como representante", 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } 
  }

  savePromoventeFisica(): void {
    if(this.validatePromoventeRepresentante(this.promoventeFisica.value.RFC)){
      this.dataPromoventes[this.indexEdicionPromovente].TIPOPERSONA = this.tipoPersonaPromovente;
      this.dataPromoventes[this.indexEdicionPromovente].IDPERSONAAYC = 0;
      this.dataPromoventes[this.indexEdicionPromovente].NOMBRE = this.promoventeFisica.value.NOMBRE;
      this.dataPromoventes[this.indexEdicionPromovente].APELLIDOPATERNO = this.promoventeFisica.value.APELLIDOPATERNO;
      this.dataPromoventes[this.indexEdicionPromovente].APELLIDOMATERNO = (this.promoventeFisica.value.APELLIDOMATERNO) ? this.promoventeFisica.value.APELLIDOMATERNO : null;
      this.dataPromoventes[this.indexEdicionPromovente].RFC = this.promoventeFisica.value.RFC;
      this.dataPromoventes[this.indexEdicionPromovente].CURP = this.promoventeFisica.value.CURP;
      this.dataPromoventes[this.indexEdicionPromovente].CLAVEIFE = (this.promoventeFisica.value.CLAVEIFE) ? this.promoventeFisica.value.CLAVEIFE : null;
      this.dataPromoventes[this.indexEdicionPromovente].IDDOCIDENTIF = (this.promoventeFisica.value.IDDOCIDENTIF) ? this.promoventeFisica.value.IDDOCIDENTIF : 0;
      this.dataPromoventes[this.indexEdicionPromovente].OTROS = (this.promoventeFisica.value.OTROS) ? this.promoventeFisica.value.OTROS : null;
      this.dataPromoventes[this.indexEdicionPromovente].CELULAR = this.promoventeFisica.value.CELULAR;
      this.dataPromoventes[this.indexEdicionPromovente].EMAIL = this.promoventeFisica.value.EMAIL;
      this.dataPromoventes[this.indexEdicionPromovente].NOTIFICACION = false;

      this.clearFormPromovente();
    } else {
      this.snackBar.open("No puede agregar como promovente una persona que ya esta como representante", 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } 
  }

  addPromoventeMoral(): void {
    if(this.validatePromoventeRepresentante(this.promoventeMoral.value.RFC)){
      let promovente = {} as DataPromoventeRepresentante; 
      promovente.TIPOPERSONA = this.tipoPersonaPromovente;
      promovente.IDPERSONAAYC = 0;
      promovente.NOMBRE = this.promoventeMoral.value.NOMBRE;
      promovente.RFC = this.promoventeMoral.value.RFC;
      promovente.ACTIVPRINCIP = this.promoventeMoral.value.ACTIVPRINCIP;
      promovente.NOTIFICACION = false;

      this.dataPromoventes.push(promovente);
      this.clearFormPromovente();
    } else {
      this.snackBar.open("No puede agregar como promovente una persona que ya esta como representante", 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } 
  }

  savePromoventeMoral(): void {
    if(this.validatePromoventeRepresentante(this.promoventeMoral.value.RFC)){
      this.dataPromoventes[this.indexEdicionPromovente].TIPOPERSONA = this.tipoPersonaPromovente;
      this.dataPromoventes[this.indexEdicionPromovente].IDPERSONAAYC = 0;
      this.dataPromoventes[this.indexEdicionPromovente].NOMBRE = this.promoventeMoral.value.NOMBRE;
      this.dataPromoventes[this.indexEdicionPromovente].RFC = this.promoventeMoral.value.RFC;
      this.dataPromoventes[this.indexEdicionPromovente].ACTIVPRINCIP = this.promoventeMoral.value.ACTIVPRINCIP;
      this.dataPromoventes[this.indexEdicionPromovente].NOTIFICACION = false;

      this.clearFormPromovente();
    } else {
      this.snackBar.open("No puede agregar como promovente una persona que ya esta como representante", 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } 
  }

  editPromovente(index): void {
    this.tipoPersonaPromovente = this.dataPromoventes[index].TIPOPERSONA;
    if(this.tipoPersonaPromovente == 'FISICA'){
      this.promoventeFisica.controls['NOMBRE'].setValue(this.dataPromoventes[index].NOMBRE);
      this.promoventeFisica.controls['APELLIDOPATERNO'].setValue(this.dataPromoventes[index].APELLIDOPATERNO);
      this.promoventeFisica.controls['APELLIDOMATERNO'].setValue(this.dataPromoventes[index].APELLIDOMATERNO);
      this.promoventeFisica.controls['RFC'].setValue(this.dataPromoventes[index].RFC);
      this.promoventeFisica.controls['CURP'].setValue(this.dataPromoventes[index].CURP);
      this.promoventeFisica.controls['CLAVEIFE'].setValue(this.dataPromoventes[index].CLAVEIFE);
      this.promoventeFisica.controls['IDDOCIDENTIF'].setValue(this.dataPromoventes[index].IDDOCIDENTIF);
      this.promoventeFisica.controls['OTROS'].setValue(this.dataPromoventes[index].OTROS);
      this.promoventeFisica.controls['CELULAR'].setValue(this.dataPromoventes[index].CELULAR);
      this.promoventeFisica.controls['EMAIL'].setValue(this.dataPromoventes[index].EMAIL);
    } else {
      this.promoventeMoral.controls['NOMBRE'].setValue(this.dataPromoventes[index].NOMBRE);
      this.promoventeMoral.controls['RFC'].setValue(this.dataPromoventes[index].RFC);
      this.promoventeMoral.controls['ACTIVPRINCIP'].setValue(this.dataPromoventes[index].ACTIVPRINCIP);
    }
    
    this.isEdicionPromovente = true;
    this.indexEdicionPromovente = index;
  }

  deletePromovente(index): void {
    this.dataPromoventes.splice(index, 1);
    this.isEdicionPromovente = false;
  }

  validatePromoventeRepresentante(rfc): boolean {
    let response = true;
    if(this.dataRepresentante.length > 0){
      for(let i = 0; i < this.dataRepresentante.length; i++) {
        if(this.dataRepresentante[i].RFC === rfc){
          response = false;
        }
      }
    } else {
      response = true;
    }
    return response;
  }

  clearFormRepresentante(): void {
    this.representanteFisica.reset();
    this.representanteMoral.reset();
    this.isEdicionRepresentante = false;
    this.indexEdicionRepresentante = undefined;
  }
  
  addRepresentanteFisica(): void {
    let representante = {} as DataPromoventeRepresentante; 
    representante.TIPOPERSONA = this.tipoPersonaRepresentante;
    representante.IDPERSONAAYC = 0;
    representante.NOMBRE = this.representanteFisica.value.NOMBRE;
    representante.APELLIDOPATERNO = this.representanteFisica.value.APELLIDOPATERNO;
    representante.APELLIDOMATERNO = (this.representanteFisica.value.APELLIDOMATERNO) ? this.representanteFisica.value.APELLIDOMATERNO : null;
    representante.RFC = this.representanteFisica.value.RFC;
    representante.CURP = this.representanteFisica.value.CURP;
    representante.CLAVEIFE = (this.representanteFisica.value.CLAVEIFE) ? this.representanteFisica.value.CLAVEIFE : null;
    representante.IDDOCIDENTIF = (this.representanteFisica.value.IDDOCIDENTIF) ? this.representanteFisica.value.IDDOCIDENTIF : 0;
    representante.OTROS = (this.representanteFisica.value.OTROS) ? this.representanteFisica.value.OTROS : null;
    representante.CELULAR = this.representanteFisica.value.CELULAR;
    representante.EMAIL = this.representanteFisica.value.EMAIL;
    representante.NOTIFICACION = false;

    this.dataRepresentante.push(representante);
    this.clearFormRepresentante();
  }

  saveRepresentanteFisica(): void {
    this.dataRepresentante[this.indexEdicionRepresentante].TIPOPERSONA = this.tipoPersonaRepresentante;
    this.dataRepresentante[this.indexEdicionRepresentante].IDPERSONAAYC = 0;
    this.dataRepresentante[this.indexEdicionRepresentante].NOMBRE = this.representanteFisica.value.NOMBRE;
    this.dataRepresentante[this.indexEdicionRepresentante].APELLIDOPATERNO = this.representanteFisica.value.APELLIDOPATERNO;
    this.dataRepresentante[this.indexEdicionRepresentante].APELLIDOMATERNO = (this.representanteFisica.value.APELLIDOMATERNO) ? this.representanteFisica.value.APELLIDOMATERNO : null;
    this.dataRepresentante[this.indexEdicionRepresentante].RFC = this.representanteFisica.value.RFC;
    this.dataRepresentante[this.indexEdicionRepresentante].CURP = this.representanteFisica.value.CURP;
    this.dataRepresentante[this.indexEdicionRepresentante].CLAVEIFE = (this.representanteFisica.value.CLAVEIFE) ? this.representanteFisica.value.CLAVEIFE : null;
    this.dataRepresentante[this.indexEdicionRepresentante].IDDOCIDENTIF = (this.representanteFisica.value.IDDOCIDENTIF) ? this.representanteFisica.value.IDDOCIDENTIF : 0;
    this.dataRepresentante[this.indexEdicionRepresentante].OTROS = (this.representanteFisica.value.OTROS) ? this.representanteFisica.value.OTROS : null;
    this.dataRepresentante[this.indexEdicionRepresentante].CELULAR = this.representanteFisica.value.CELULAR;
    this.dataRepresentante[this.indexEdicionRepresentante].EMAIL = this.representanteFisica.value.EMAIL;
    this.dataRepresentante[this.indexEdicionRepresentante].NOTIFICACION = false;

    this.clearFormRepresentante();
  }

  addRepresentanteMoral(): void {
    let representante = {} as DataPromoventeRepresentante; 
    representante.TIPOPERSONA = this.tipoPersonaRepresentante;
    representante.IDPERSONAAYC = 0;
    representante.NOMBRE = this.representanteMoral.value.NOMBRE;
    representante.RFC = this.representanteMoral.value.RFC;
    representante.ACTIVPRINCIP = this.representanteMoral.value.ACTIVPRINCIP;
    representante.NOTIFICACION = false;

    this.dataRepresentante.push(representante);
    this.clearFormRepresentante();
  }

  saveRepresentanteMoral(): void {
    this.dataRepresentante[this.indexEdicionRepresentante].TIPOPERSONA = this.tipoPersonaRepresentante;
    this.dataRepresentante[this.indexEdicionRepresentante].IDPERSONAAYC = 0;
    this.dataRepresentante[this.indexEdicionRepresentante].NOMBRE = this.representanteMoral.value.NOMBRE;
    this.dataRepresentante[this.indexEdicionRepresentante].RFC = this.representanteMoral.value.RFC;
    this.dataRepresentante[this.indexEdicionRepresentante].ACTIVPRINCIP = this.representanteMoral.value.ACTIVPRINCIP;
    this.dataRepresentante[this.indexEdicionRepresentante].NOTIFICACION = false;

    this.clearFormRepresentante();
  }

  editRepresentante(index): void {
    this.tipoPersonaRepresentante = this.dataRepresentante[index].TIPOPERSONA;
    if(this.tipoPersonaRepresentante == 'FISICA'){
      this.representanteFisica.controls['NOMBRE'].setValue(this.dataRepresentante[index].NOMBRE);
      this.representanteFisica.controls['APELLIDOPATERNO'].setValue(this.dataRepresentante[index].APELLIDOPATERNO);
      this.representanteFisica.controls['APELLIDOMATERNO'].setValue(this.dataRepresentante[index].APELLIDOMATERNO);
      this.representanteFisica.controls['RFC'].setValue(this.dataRepresentante[index].RFC);
      this.representanteFisica.controls['CURP'].setValue(this.dataRepresentante[index].CURP);
      this.representanteFisica.controls['CLAVEIFE'].setValue(this.dataRepresentante[index].CLAVEIFE);
      this.representanteFisica.controls['IDDOCIDENTIF'].setValue(this.dataRepresentante[index].IDDOCIDENTIF);
      this.representanteFisica.controls['OTROS'].setValue(this.dataRepresentante[index].OTROS);
      this.representanteFisica.controls['CELULAR'].setValue(this.dataRepresentante[index].CELULAR);
      this.representanteFisica.controls['EMAIL'].setValue(this.dataRepresentante[index].EMAIL);
    } else {
      this.representanteMoral.controls['NOMBRE'].setValue(this.dataRepresentante[index].NOMBRE);
      this.representanteMoral.controls['RFC'].setValue(this.dataRepresentante[index].RFC);
      this.representanteMoral.controls['ACTIVPRINCIP'].setValue(this.dataRepresentante[index].ACTIVPRINCIP);
    }
    
    this.isEdicionRepresentante = true;
    this.indexEdicionRepresentante = index;
  }

  deleteRepresentante(index): void {
    this.dataRepresentante.splice(index, 1);
    this.isEdicionRepresentante = false;
  }

}
