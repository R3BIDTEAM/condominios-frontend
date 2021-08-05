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

  clearFormRepresentante(): void {
    this.representanteFisica.reset();
    this.representanteMoral.reset();
    this.isEdicionRepresentante = false;
    this.indexEdicionRepresentante = undefined;
  }

  addPromoventeFisica(): void {
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
  }

  savePromoventeFisica(): void {
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
  }

  addPromoventeMoral(): void {
    let promovente = {} as DataPromoventeRepresentante; 
    promovente.TIPOPERSONA = this.tipoPersonaPromovente;
    promovente.IDPERSONAAYC = 0;
    promovente.NOMBRE = this.promoventeMoral.value.NOMBRE;
    promovente.RFC = this.promoventeMoral.value.RFC;
    promovente.ACTIVPRINCIP = this.promoventeMoral.value.ACTIVPRINCIP;
    promovente.NOTIFICACION = false;

    this.dataPromoventes.push(promovente);
    this.clearFormPromovente();
  }

  savePromoventeMoral(): void {
    this.dataPromoventes[this.indexEdicionPromovente].TIPOPERSONA = this.tipoPersonaPromovente;
    this.dataPromoventes[this.indexEdicionPromovente].IDPERSONAAYC = 0;
    this.dataPromoventes[this.indexEdicionPromovente].NOMBRE = this.promoventeMoral.value.NOMBRE;
    this.dataPromoventes[this.indexEdicionPromovente].RFC = this.promoventeMoral.value.RFC;
    this.dataPromoventes[this.indexEdicionPromovente].ACTIVPRINCIP = this.promoventeMoral.value.ACTIVPRINCIP;
    this.dataPromoventes[this.indexEdicionPromovente].NOTIFICACION = false;

    this.clearFormPromovente();
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
  }

}
