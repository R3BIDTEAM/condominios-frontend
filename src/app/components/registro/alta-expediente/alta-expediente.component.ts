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
export interface DataCuentaCatastral {
  REGION: string;
  MANZANA: string;
  LOTE: string;
  UNIDADPRIVATIVA: string;
}
export interface DataDomicilioNotificacion {
  IDDOMICILIONOTIFICACIONES: number;
  CODTIPOSVIA: number;
  IDVIA: number;
  VIA: string;
  NUMEROEXTERIOR: string;
  ENTRECALLE1: string;
  ENTRECALLE2: string;
  ANDADOR: string;
  EDIFICIO: string;
  SECCION: string;
  ENTRADA: string;
  CODTIPOSLOCALIDAD: number;
  NUMEROINTERIOR: string;
  CODTIPOSASENTAMIENTO: number;
  IDCOLONIA: number;
  CODASENTAMIENTO: number;
  COLONIA: string;
  CODIGOPOSTAL: string;
  CODCIUDAD: number;
  CIUDAD: string;
  IDDELEGACION: number;
  CODMUNICIPIO: number;
  DELEGACION: string;
  TELEFONO: string;
  CODESTADO: number;
  INDICACIONESADICIONALES: string;
  IDCHS_MTODESDE: number;
  CODTIPOSDIRECCION: string;
  CODTIPOSDIRECCI: string;
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
  loadingTiposVia = false;
  tiposVia;
  loadingTiposLocalidad = false;
  tiposLocalidad;
  loadingDelegaciones= false;
  delegaciones;
  documentosAportar = [1,1,1,1];
  documentosAportarColumns: string[] = ['conjunto_documental', 'documento', 'obligatorio', 'check'];
  hoy = new Date();
  idpersona;
  isEdicionPromovente = false;
  isEdicionRepresentante = false;
  indexEdicionPromovente;
  indexEdicionRepresentante;
  tipoPersonaPromovente = 'FISICA';
  tipoPersonaRepresentante = 'FISICA';
  dataExpediente: DataExpediente = {} as DataExpediente;
  dataPromoventes: DataPromoventeRepresentante[] = [];
  dataRepresentantes: DataPromoventeRepresentante[] = [];
  dataCuentasCatastrales: DataCuentaCatastral[] = [];
  dataDomicilioNotificacion: DataDomicilioNotificacion = {} as DataDomicilioNotificacion;
  promoventeFisica: FormGroup;
  promoventeMoral: FormGroup;
  representanteFisica: FormGroup;
  representanteMoral: FormGroup;
  cuentaCatastral: FormGroup;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getTiposTramite();
    this.getTiposPersona();
    this.getTiposDocIdentif();
    this.getTiposVia();
    this.getTiposLocalidad();
    this.getDelegaciones();

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

    this.cuentaCatastral = this._formBuilder.group({
      REGION: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      MANZANA: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      LOTE: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      UNIDADPRIVATIVA: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    });
  }

  //////////CATALOGOS///////////
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

  getTiposVia(): void {
    let catTiposVia = environment.endpoint + '?action=getCatalogo&table=CAS_CATTIPOSVIA';
    let filtro = "{\n    \"FILTER\": \"\"\n}";
    this.loadingTiposVia = true;
    this.http.post(catTiposVia, filtro).subscribe(
      (res: any) => {
        this.loadingTiposVia = false;
        if(res.error.code === 0)
        {
          this.tiposVia = res.data.result;
        } else {
          this.snackBar.open(res.error.message, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      },
      (error) => {
        this.loadingTiposVia = false;
        this.snackBar.open(error.message, 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    );
  }

  getTiposLocalidad(): void {
    let catTiposLocalidad = environment.endpoint + '?action=getCatalogo&table=CAS_CATTIPOSLOCALIDAD';
    let filtro = "{\n    \"FILTER\": \"\"\n}";
    this.loadingTiposLocalidad = true;
    this.http.post(catTiposLocalidad, filtro).subscribe(
      (res: any) => {
        this.loadingTiposLocalidad = false;
        if(res.error.code === 0)
        {
          this.tiposLocalidad = res.data.result;
        } else {
          this.snackBar.open(res.error.message, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      },
      (error) => {
        this.loadingTiposLocalidad = false;
        this.snackBar.open(error.message, 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    );
  }

  getDelegaciones(): void {
    let catDelegacion = environment.endpoint + '?action=getCatalogo&table=CAS_DELEGACION';
    let filtro = "{\n    \"FILTER\": \"\"\n}";
    this.loadingDelegaciones = true;
    this.http.post(catDelegacion, filtro).subscribe(
      (res: any) => {
        this.loadingDelegaciones = false;
        if(res.error.code === 0)
        {
          this.delegaciones = res.data.result;
        } else {
          this.snackBar.open(res.error.message, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      },
      (error) => {
        this.loadingDelegaciones = false;
        this.snackBar.open(error.message, 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    );
  }
  //////////CATALOGOS///////////

  //////////FUNCIONES PROMOVENTES///////////
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
      promovente.IDPERSONAAYC = (this.idpersona) ? this.idpersona : 0;
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

      this.idpersona = undefined;
      this.dataPromoventes.push(promovente);
      this.clearFormPromovente();

      if(this.dataPromoventes.length == 1){
        this.dataPromoventes[0].NOTIFICACION = true;
      }
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
      promovente.IDPERSONAAYC = (this.idpersona) ? this.idpersona : 0;
      promovente.NOMBRE = this.promoventeMoral.value.NOMBRE;
      promovente.RFC = this.promoventeMoral.value.RFC;
      promovente.ACTIVPRINCIP = this.promoventeMoral.value.ACTIVPRINCIP;
      promovente.NOTIFICACION = false;

      this.idpersona = undefined;
      this.dataPromoventes.push(promovente);
      this.clearFormPromovente();

      if(this.dataPromoventes.length == 1){
        this.dataPromoventes[0].NOTIFICACION = true;
      }
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
    if(this.dataPromoventes.length == 0){
      this.dataRepresentantes = [];
    }
    if(this.dataPromoventes.length == 1){
      this.dataPromoventes[0].NOTIFICACION = true;
    }
  }

  validatePromoventeRepresentante(rfc): boolean {
    let response = true;
    if(this.dataRepresentantes.length > 0){
      for(let i = 0; i < this.dataRepresentantes.length; i++) {
        if(this.dataRepresentantes[i].RFC === rfc){
          response = false;
        }
      }
    } else {
      response = true;
    }
    return response;
  }

  openDialogSearchPromovente(): void {
    const dialogRef = this.dialog.open(DialogSearchPromoventeRepresentante, {
      width: '700px',
      data: {tiposDocIdentif: this.tiposDocIdentif, action: 'getPromovente'},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.tipoPersonaPromovente = result.TIPOPERSONA;
        if(this.tipoPersonaPromovente == 'FISICA'){
          this.promoventeFisica.controls['NOMBRE'].setValue(result.NOMBRE);
          this.promoventeFisica.controls['APELLIDOPATERNO'].setValue(result.APELLIDOPATERNO);
          this.promoventeFisica.controls['APELLIDOMATERNO'].setValue(result.APELLIDOMATERNO);
          this.promoventeFisica.controls['RFC'].setValue(result.RFC);
          this.promoventeFisica.controls['CURP'].setValue(result.CURP);
          this.promoventeFisica.controls['CLAVEIFE'].setValue(result.CLAVEIFE);
          this.promoventeFisica.controls['IDDOCIDENTIF'].setValue(result.IDDOCIDENTIF);
          this.promoventeFisica.controls['OTROS'].setValue(result.OTROS);
          this.promoventeFisica.controls['CELULAR'].setValue(result.CELULAR);
          this.promoventeFisica.controls['EMAIL'].setValue(result.EMAIL);
        } else {
          this.promoventeMoral.controls['NOMBRE'].setValue(result.NOMBRE);
          this.promoventeMoral.controls['RFC'].setValue(result.RFC);
          this.promoventeMoral.controls['ACTIVPRINCIP'].setValue(result.ACTIVPRINCIP);
        }

        this.idpersona = result.IDPERSONAAYC;
        this.isEdicionPromovente = false;
      }
    });
  }

  setDatosNotificacionPromovente(index): void {
    for(let i = 0; i < this.dataPromoventes.length; i++) {
      if(i != index){
        this.dataPromoventes[i].NOTIFICACION = false;
      }
    }
    if(this.dataRepresentantes.length > 0){
      for(let i = 0; i < this.dataRepresentantes.length; i++) {
        this.dataRepresentantes[i].NOTIFICACION = false;
      }
    }
  }
  //////////FUNCIONES PROMOVENTES///////////

  //////////FUNCIONES REPRESENTANTES///////////
  clearFormRepresentante(): void {
    this.representanteFisica.reset();
    this.representanteMoral.reset();
    this.isEdicionRepresentante = false;
    this.indexEdicionRepresentante = undefined;
  }
  
  addRepresentanteFisica(): void {
    if(this.validateRepresentantePromovente(this.representanteFisica.value.RFC)){
      let representante = {} as DataPromoventeRepresentante; 
      representante.TIPOPERSONA = this.tipoPersonaRepresentante;
      representante.IDPERSONAAYC = (this.idpersona) ? this.idpersona : 0;
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

      this.idpersona = undefined;
      this.dataRepresentantes.push(representante);
      this.clearFormRepresentante();
    } else {
      this.snackBar.open("No puede agregar como representante una persona que ya esta como promovente", 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } 
  }

  saveRepresentanteFisica(): void {
    if(this.validateRepresentantePromovente(this.representanteFisica.value.RFC)){
      this.dataRepresentantes[this.indexEdicionRepresentante].TIPOPERSONA = this.tipoPersonaRepresentante;
      this.dataRepresentantes[this.indexEdicionRepresentante].NOMBRE = this.representanteFisica.value.NOMBRE;
      this.dataRepresentantes[this.indexEdicionRepresentante].APELLIDOPATERNO = this.representanteFisica.value.APELLIDOPATERNO;
      this.dataRepresentantes[this.indexEdicionRepresentante].APELLIDOMATERNO = (this.representanteFisica.value.APELLIDOMATERNO) ? this.representanteFisica.value.APELLIDOMATERNO : null;
      this.dataRepresentantes[this.indexEdicionRepresentante].RFC = this.representanteFisica.value.RFC;
      this.dataRepresentantes[this.indexEdicionRepresentante].CURP = this.representanteFisica.value.CURP;
      this.dataRepresentantes[this.indexEdicionRepresentante].CLAVEIFE = (this.representanteFisica.value.CLAVEIFE) ? this.representanteFisica.value.CLAVEIFE : null;
      this.dataRepresentantes[this.indexEdicionRepresentante].IDDOCIDENTIF = (this.representanteFisica.value.IDDOCIDENTIF) ? this.representanteFisica.value.IDDOCIDENTIF : 0;
      this.dataRepresentantes[this.indexEdicionRepresentante].OTROS = (this.representanteFisica.value.OTROS) ? this.representanteFisica.value.OTROS : null;
      this.dataRepresentantes[this.indexEdicionRepresentante].CELULAR = this.representanteFisica.value.CELULAR;
      this.dataRepresentantes[this.indexEdicionRepresentante].EMAIL = this.representanteFisica.value.EMAIL;
      this.dataRepresentantes[this.indexEdicionRepresentante].NOTIFICACION = false;

      this.clearFormRepresentante();
    } else {
      this.snackBar.open("No puede agregar como representante una persona que ya esta como promovente", 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } 
  }

  addRepresentanteMoral(): void {
    if(this.validateRepresentantePromovente(this.representanteMoral.value.RFC)){
      let representante = {} as DataPromoventeRepresentante; 
      representante.TIPOPERSONA = this.tipoPersonaRepresentante;
      representante.IDPERSONAAYC = (this.idpersona) ? this.idpersona : 0;
      representante.NOMBRE = this.representanteMoral.value.NOMBRE;
      representante.RFC = this.representanteMoral.value.RFC;
      representante.ACTIVPRINCIP = this.representanteMoral.value.ACTIVPRINCIP;
      representante.NOTIFICACION = false;

      this.idpersona = undefined;
      this.dataRepresentantes.push(representante);
      this.clearFormRepresentante();
    } else {
      this.snackBar.open("No puede agregar como representante una persona que ya esta como promovente", 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } 
  }

  saveRepresentanteMoral(): void {
    if(this.validateRepresentantePromovente(this.representanteMoral.value.RFC)){
      this.dataRepresentantes[this.indexEdicionRepresentante].TIPOPERSONA = this.tipoPersonaRepresentante;
      this.dataRepresentantes[this.indexEdicionRepresentante].NOMBRE = this.representanteMoral.value.NOMBRE;
      this.dataRepresentantes[this.indexEdicionRepresentante].RFC = this.representanteMoral.value.RFC;
      this.dataRepresentantes[this.indexEdicionRepresentante].ACTIVPRINCIP = this.representanteMoral.value.ACTIVPRINCIP;
      this.dataRepresentantes[this.indexEdicionRepresentante].NOTIFICACION = false;

      this.clearFormRepresentante();
    } else {
      this.snackBar.open("No puede agregar como representante una persona que ya esta como promovente", 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } 
  }

  editRepresentante(index): void {
    this.tipoPersonaRepresentante = this.dataRepresentantes[index].TIPOPERSONA;
    if(this.tipoPersonaRepresentante == 'FISICA'){
      this.representanteFisica.controls['NOMBRE'].setValue(this.dataRepresentantes[index].NOMBRE);
      this.representanteFisica.controls['APELLIDOPATERNO'].setValue(this.dataRepresentantes[index].APELLIDOPATERNO);
      this.representanteFisica.controls['APELLIDOMATERNO'].setValue(this.dataRepresentantes[index].APELLIDOMATERNO);
      this.representanteFisica.controls['RFC'].setValue(this.dataRepresentantes[index].RFC);
      this.representanteFisica.controls['CURP'].setValue(this.dataRepresentantes[index].CURP);
      this.representanteFisica.controls['CLAVEIFE'].setValue(this.dataRepresentantes[index].CLAVEIFE);
      this.representanteFisica.controls['IDDOCIDENTIF'].setValue(this.dataRepresentantes[index].IDDOCIDENTIF);
      this.representanteFisica.controls['OTROS'].setValue(this.dataRepresentantes[index].OTROS);
      this.representanteFisica.controls['CELULAR'].setValue(this.dataRepresentantes[index].CELULAR);
      this.representanteFisica.controls['EMAIL'].setValue(this.dataRepresentantes[index].EMAIL);
    } else {
      this.representanteMoral.controls['NOMBRE'].setValue(this.dataRepresentantes[index].NOMBRE);
      this.representanteMoral.controls['RFC'].setValue(this.dataRepresentantes[index].RFC);
      this.representanteMoral.controls['ACTIVPRINCIP'].setValue(this.dataRepresentantes[index].ACTIVPRINCIP);
    }
    
    this.isEdicionRepresentante = true;
    this.indexEdicionRepresentante = index;
  }

  deleteRepresentante(index): void {
    this.dataRepresentantes.splice(index, 1);
    this.isEdicionRepresentante = false;
    if(this.dataRepresentantes.length == 0){
      this.dataPromoventes[0].NOTIFICACION = true;
    }
  }

  validateRepresentantePromovente(rfc): boolean {
    let response = true;
    if(this.dataPromoventes.length > 0){
      for(let i = 0; i < this.dataPromoventes.length; i++) {
        if(this.dataPromoventes[i].RFC === rfc){
          response = false;
        }
      }
    } else {
      response = true;
    }
    return response;
  }

  openDialogSearchRepresentante(): void {
    const dialogRef = this.dialog.open(DialogSearchPromoventeRepresentante, {
      width: '700px',
      data: {tiposDocIdentif: this.tiposDocIdentif, action: 'getRepresentante'},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.tipoPersonaRepresentante = result.TIPOPERSONA;
        if(this.tipoPersonaRepresentante == 'FISICA'){
          this.representanteFisica.controls['NOMBRE'].setValue(result.NOMBRE);
          this.representanteFisica.controls['APELLIDOPATERNO'].setValue(result.APELLIDOPATERNO);
          this.representanteFisica.controls['APELLIDOMATERNO'].setValue(result.APELLIDOMATERNO);
          this.representanteFisica.controls['RFC'].setValue(result.RFC);
          this.representanteFisica.controls['CURP'].setValue(result.CURP);
          this.representanteFisica.controls['CLAVEIFE'].setValue(result.CLAVEIFE);
          this.representanteFisica.controls['IDDOCIDENTIF'].setValue(result.IDDOCIDENTIF);
          this.representanteFisica.controls['OTROS'].setValue(result.OTROS);
          this.representanteFisica.controls['CELULAR'].setValue(result.CELULAR);
          this.representanteFisica.controls['EMAIL'].setValue(result.EMAIL);
        } else {
          this.representanteMoral.controls['NOMBRE'].setValue(result.NOMBRE);
          this.representanteMoral.controls['RFC'].setValue(result.RFC);
          this.representanteMoral.controls['ACTIVPRINCIP'].setValue(result.ACTIVPRINCIP);
        }

        this.idpersona = result.IDPERSONAAYC;
        this.isEdicionRepresentante = false;
      }
    });
  }

  setDatosNotificacionRepresentante(index): void {
    for(let i = 0; i < this.dataRepresentantes.length; i++) {
      if(i != index){
        this.dataRepresentantes[i].NOTIFICACION = false;
      }
    }
    if(this.dataPromoventes.length > 0){
      for(let i = 0; i < this.dataPromoventes.length; i++) {
        this.dataPromoventes[i].NOTIFICACION = false;
      }
    }
  }
  //////////FUNCIONES REPRESENTANTES///////////

  //////////FUNCIONES CUENTAS CATASTRALES///////////
  clearFormCuentaCatastral(): void {
    this.cuentaCatastral.reset();
  }

  addCuentaCatastral(): void {
    let cuentaCatastral = {} as DataCuentaCatastral; 
    cuentaCatastral.REGION = this.cuentaCatastral.value.REGION;
    cuentaCatastral.MANZANA = this.cuentaCatastral.value.MANZANA;
    cuentaCatastral.LOTE = this.cuentaCatastral.value.LOTE;
    cuentaCatastral.UNIDADPRIVATIVA = this.cuentaCatastral.value.UNIDADPRIVATIVA;

    this.dataCuentasCatastrales.push(cuentaCatastral);
    this.clearFormCuentaCatastral();
  }
  
  deleteCuentaCatastral(index): void {
    this.dataCuentasCatastrales.splice(index, 1);
  }
  //////////FUNCIONES CUENTAS CATASTRALES///////////

  //////////FUNCIONES DIRECCION NOTIFICACION///////////
  openDialogAddDireccionNotificacion(): void {
    const dialogRef = this.dialog.open(DialogAddDomicilioNotificacion, {
      width: '700px',
      data: {tiposVia: this.tiposVia, tiposLocalidad: this.tiposLocalidad, delegaciones: this.delegaciones},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }
    });
  }
  //////////FUNCIONES DIRECCION NOTIFICACION///////////

}

//////////BUSQUEDA PROMOVENTES REPRESENTANTES///////////
export interface FiltroDatosPersonales {
  nombre: string;
  apaterno: string;
  amaterno: string;
}
export interface FiltroDatosIdentificativos {
  rfc: string;
  curp: string;
  ife: string;
  otro: string;
}
@Component({
  selector: 'app-dialog-search-promovente-representante',
  templateUrl: 'app-dialog-search-promovente-representante.html',
})
export class DialogSearchPromoventeRepresentante {
  tiposDocIdentif;
  action;
  isBusqueda;
  loadingPaginado = false;
  pagina = 1;
  total = 0;
  pageSize = 5;
  dataSource = [];
  dataResponse = [];
  displayedColumns: string[] = ['nombre', 'datos_identificativos', 'select'];
  @ViewChild('paginator') paginator: MatPaginator;
  filtroDatosPersonales: FiltroDatosPersonales = {} as FiltroDatosPersonales;
  filtroDatosIdentificativos: FiltroDatosIdentificativos = {} as FiltroDatosIdentificativos;
  dataPromoventeRepresentante: DataPromoventeRepresentante = {} as DataPromoventeRepresentante;
  promoventeRepresentante;
  input;
  tipoDatos;
  tipoPersona;
  
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogSearchPromoventeRepresentante>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;

      this.tiposDocIdentif = data.tiposDocIdentif;
      this.action = data.action;
    }
  
  clearDatos(input, tipoDatos): void {
    this.tipoDatos = tipoDatos;
    if(tipoDatos === 'personales'){
      this.filtroDatosIdentificativos = {} as FiltroDatosIdentificativos;
    } else {
      this.input = input;
      this.filtroDatosPersonales = {} as FiltroDatosPersonales;
      switch(input) {
        case 'rfc': {
          this.filtroDatosIdentificativos.curp = undefined;
          this.filtroDatosIdentificativos.ife = undefined;
          this.filtroDatosIdentificativos.otro = undefined;
          break;
        }
        case 'curp': {
          this.filtroDatosIdentificativos.rfc = undefined;
          this.filtroDatosIdentificativos.ife = undefined;
          this.filtroDatosIdentificativos.otro = undefined;
          break;
        }
        case 'ife': {
          this.filtroDatosIdentificativos.rfc = undefined;
          this.filtroDatosIdentificativos.curp = undefined;
          this.filtroDatosIdentificativos.otro = undefined;
          break;
        }
        case 'otro': {
          this.filtroDatosIdentificativos.rfc = undefined;
          this.filtroDatosIdentificativos.curp = undefined;
          this.filtroDatosIdentificativos.ife = undefined;
          break;
        }
        default: {
          break;
        }
      } 
    }
  }

  getData(): void {
    this.isBusqueda = true;
    this.loadingPaginado = true;
    this.pagina = 1;
    let filtro = {};
    let get = environment.endpoint + '?action=' + this.action;

    if(this.tipoDatos === 'personales'){
      filtro = '{\n    \"NOMBRE_COMPLETO\": \"'+((this.filtroDatosPersonales.nombre) ? (this.filtroDatosPersonales.nombre + " ") : "") + ((this.filtroDatosPersonales.apaterno) ? (this.filtroDatosPersonales.apaterno + " ") : "") + ((this.filtroDatosPersonales.amaterno) ? (this.filtroDatosPersonales.amaterno) : "")+'\",\n    \"IDENTIFICADOR\": \"\"\n}';
    } else {
      filtro = '{\n    \"NOMBRE_COMPLETO\": \"\",\n    \"IDENTIFICADOR\": \"'+this.filtroDatosIdentificativos[this.input]+'\"\n}';
    }

    this.http.post(get, filtro).subscribe(
      (res: any) => {
        this.loadingPaginado = false;
        if(res.error.code === 0)
        {
          if(res.data.ADYCON_PERSONAFISICAAYC.length > 0){
            this.dataResponse = res.data.ADYCON_PERSONAFISICAAYC;
            this.dataSource = this.paginate(this.dataResponse, this.pageSize, this.pagina);
            this.total = this.dataResponse.length;
            this.paginator.pageIndex = 0;
            this.tipoPersona = 'FISICA';
          } else if(res.data.ADYCON_PERSONAMORALAYC.length > 0){
            this.dataResponse = res.data.ADYCON_PERSONAMORALAYC;
            this.dataSource = this.paginate(this.dataResponse, this.pageSize, this.pagina);
            this.total = this.dataResponse.length;
            this.paginator.pageIndex = 0;
            this.tipoPersona = 'MORAL';
          } else {
            this.dataResponse = [];
            this.dataSource = [];
            this.total = 0;
            this.paginator.pageIndex = 0;
            this.promoventeRepresentante = undefined;
            this.tipoPersona = undefined;
          }
        } else {
          this.snackBar.open(res.error.message, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      },
      (error) => {
        this.loadingPaginado = false;
        this.snackBar.open(error.message, 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    );
  }

  paginado(evt): void{
    this.pagina = evt.pageIndex + 1;
    this.dataSource = this.paginate(this.dataResponse, this.pageSize, this.pagina);
  }

  paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  promoventeRepresentanteSelected(promoventeRepresentante): void {
    this.dataPromoventeRepresentante = promoventeRepresentante;
    this.dataPromoventeRepresentante.TIPOPERSONA = this.tipoPersona;
  }
}
//////////BUSQUEDA PROMOVENTES REPRESENTANTES///////////

//////////AGREGAR DIRECCION NOTIFICACION///////////
@Component({
  selector: 'app-dialog-add-domicilio-notificacion',
  templateUrl: 'app-dialog-add-domicilio-notificacion.html',
})
export class DialogAddDomicilioNotificacion {
  tiposVia;
  tiposLocalidad;
  delegaciones;
  domicilio: FormGroup;
  dataDomicilioNotificacion: DataDomicilioNotificacion = {} as DataDomicilioNotificacion;

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogAddDomicilioNotificacion>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;

      this.tiposVia = data.tiposVia;
      this.tiposLocalidad = data.tiposLocalidad;
      this.delegaciones = data.delegaciones;

      this.dataDomicilioNotificacion.CODESTADO = 10;
      this.dataDomicilioNotificacion.IDCOLONIA = 10;
      this.dataDomicilioNotificacion.CODCIUDAD = 10;
      this.dataDomicilioNotificacion.CODTIPOSASENTAMIENTO = 10;
      this.dataDomicilioNotificacion.CODASENTAMIENTO = 10;
      this.dataDomicilioNotificacion.CIUDAD = "VARCHAR2";
      this.dataDomicilioNotificacion.CODTIPOSDIRECCION = "CHAR";
      this.dataDomicilioNotificacion.CODTIPOSDIRECCI = "CHAR";

      this.domicilio = this._formBuilder.group({
        ESTADO: ['Ciudad de México'],
        IDDELEGACION: ['', [Validators.required]],
        COLONIA: [null, [Validators.required]],
        CODIGOPOSTAL: [null, [Validators.minLength(5), Validators.maxLength(5)]],
        CODTIPOSVIA: ['', [Validators.required]],
        VIA: [null, [Validators.required]],
        CODTIPOSLOCALIDAD: [''],
        NUMEROEXTERIOR: [null, [Validators.required]],
        NUMEROINTERIOR: [null],
        ANDADOR: [null],
        EDIFICIO: [null],
        ENTRADA: [null],
        SECCION: [null],
        TELEFONO: [null],
        ENTRECALLE1: [null],
        ENTRECALLE2: [null],
        INDICACIONESADICIONALES: [null],


        /*
       IDDOMICILIONOTIFICACIONES: number;
  IDVIA: number;
  ENTRECALLE1: string;
  ENTRECALLE2: string;
  ANDADOR: string;
  EDIFICIO: string;
  SECCION: string;
  ENTRADA: string;
  CODMUNICIPIO: number;
  TELEFONO: string;
  INDICACIONESADICIONALES: string;
     */
      });
    }
  
  getNombreDelegacion(event): void {
    this.dataDomicilioNotificacion.DELEGACION = event.source.triggerValue;
    this.dataDomicilioNotificacion.IDCHS_MTODESDE = this.delegaciones.find(element => element.NOMBRE === this.dataDomicilioNotificacion.DELEGACION).IDCHS_MTODESDE;
  }
}
//////////AGREGAR DIRECCION NOTIFICACION///////////