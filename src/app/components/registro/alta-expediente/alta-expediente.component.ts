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
  documentosAportar = [1,1,1,1];
  documentosAportarColumns: string[] = ['conjunto_documental', 'documento', 'obligatorio', 'check'];
  hoy = new Date();
  tipoPersona = 'F';
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
    this.dataExpediente.IDTIPOTRAMITE = "";
    this.dataExpediente.FECHAENTRADA = "FEC_" + this.datePipe.transform(this.hoy, 'dd/MM/yyyy');
    this.dataExpediente.FECHATERMINO = "FEC_" + this.datePipe.transform(this.hoy, 'dd/MM/yyyy');
    
    this.promoventeFisica = this._formBuilder.group({
      NOMBRE: [null, [Validators.required]],
      APELLIDOPATERNO: [null, [Validators.required]],
      APELLIDOMATERNO: [null, []],
      RFC: [null, [Validators.required, Validators.pattern('^([A-ZÑ&]{4})?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$')]],
      CURP: [null, [Validators.required, Validators.pattern('^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$')]],
      CLAVEIFE: [null, []],
      IDDOCIDENTIF: ['', []],
      OTROS: [null, []],
      CELULAR: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      EMAIL: [null, [Validators.required, Validators.email]],
    });

    this.promoventeMoral = this._formBuilder.group({
      NOMBRE: [null, [Validators.required]],
      ACTIVPRINCIP: [null, [Validators.required]],
      RFC: [null, [Validators.required, Validators.pattern('^([A-ZÑ&]{3})?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$')]],
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

}
