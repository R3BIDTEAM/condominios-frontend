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
export interface DataPromovente {
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
  tipoPersona = 'FISICA';
  dataExpediente: DataExpediente = {} as DataExpediente;
  dataPromoventes: DataPromovente[] = [];
  promoventeFisica: FormGroup;
  promoventeMoral: FormGroup;

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

    console.log(this.dataExpediente);
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
  }

  addPromoventeFisica(): void {
    let promovente = {} as DataPromovente; 
    promovente.TIPOPERSONA = this.tipoPersona;
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

    this.dataPromoventes.push(promovente);
    this.clearFormPromovente();
    console.log(this.dataPromoventes);
  }

  addPromoventeMoral(): void {
    let promovente = {} as DataPromovente; 
    promovente.TIPOPERSONA = this.tipoPersona;
    promovente.IDPERSONAAYC = 0;
    promovente.NOMBRE = this.promoventeMoral.value.NOMBRE;
    promovente.RFC = this.promoventeMoral.value.RFC;
    promovente.ACTIVPRINCIP = this.promoventeMoral.value.ACTIVPRINCIP;

    this.dataPromoventes.push(promovente);
    this.clearFormPromovente();
    console.log(this.dataPromoventes);
  }

  deletePromovente(index): void{
    this.dataPromoventes.splice(index, 1);
  }

}
