import { Component, OnInit, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from '@env/environment'
import { AuthService } from '@serv/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogsCuenta } from '@comp/dialogs/dialogs.component'
import * as moment from 'moment';

export interface Filtros {
    fecha_ini: Date;
    fecha_fin: Date;
    region: string;
    manzana: string;
    lote: string;
    estado: string;
  }
@Component({
    selector: 'app-bandeja-entrada',
    templateUrl: './bandeja-entrada.component.html',
    styleUrls: ['./bandeja-entrada.component.css']
})
export class BandejaEntradaComponent implements OnInit {
    isBusqueda;
    loadingPaginado = false;
    pagina = 1;
    total = 0;
    pageSize = 10;
    dataSource = [1, 1, 1, 1, 1, 1, 1];
    dataResponse = [];
    displayedColumns: string[] = ['solicitud', 'notario', 'fecha_recepcion', 'region', 'manzana', 'lote', 'estado'];
    @ViewChild('paginator') paginator: MatPaginator;
    httpOptions;
    filtroSelected;
    canSearch = false;
    filtros: Filtros = {} as Filtros;
    inputsFiltros: Array<{isSelected: boolean, isError: boolean, errorMessage: string}> = 
                        [{isSelected: false, isError: false, errorMessage: ''},
                        {isSelected: false, isError: false, errorMessage: 'Requerido'}];

    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private auth: AuthService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: this.auth.getSession().token
            })
        };
    }

    /**
     * 
     */
    getData(): void {
        this.isBusqueda = true;
    }

    /**
     * * @param event Indica cual es el filtro sobre el cual se realizará la búsqueda
     * */
    getFiltroSelected(event): void {
        this.filtroSelected = event.value;
        this.filtros = {} as Filtros;
        this.inputsFiltros.map(i => i.isSelected = false);
        this.canSearch = false;
        
        switch(this.filtroSelected) {
            case '0': {
                this.inputsFiltros[0].isSelected = true;
                this.filtros.fecha_ini = new Date((new Date().getTime() - 2592000000));
                this.filtros.fecha_fin = new Date((new Date().getTime()));
                this.canSearch = true;
                break; 
            }
            case '1': {
                this.inputsFiltros[1].isSelected = true;
                break;
            }
            default: {
                break;
            }
        }
    }

    /**
     * *  Valida que la fecha inicial no sea mayor a la fecha final y visceversa
     * */
    validateDate(){
        if(!this.filtros.fecha_ini || !this.filtros.fecha_fin)
        {
            this.inputsFiltros[0].isError = true;
            this.inputsFiltros[0].errorMessage = 'Las fechas son requeridas.';
            this.canSearch = false;
        } else {
            if(moment(this.filtros.fecha_ini).format('YYYY-MM-DD') > moment(this.filtros.fecha_fin).format('YYYY-MM-DD'))
            {
                this.inputsFiltros[0].isError = true;
                this.inputsFiltros[0].errorMessage = 'La fecha fin tiene que ser mayor a la inicial.';
                this.canSearch = false;
            } else {
                this.inputsFiltros[0].isError = false;
                this.inputsFiltros[0].errorMessage = '';
                this.canSearch = true;
            }
        }
    }
     /**
     * Verifica que se cumplen ciertas condiciones para habilitar el botón que realiza la búsqueda
     */
    validateSearch(){
        switch(this.filtroSelected) {
            case '1': {
                this.canSearch = (this.filtros.region && this.filtros.manzana && this.filtros.lote) ? true : false;
                break; 
            }
            default: {
                this.canSearch = false;
                break; 
            } 
        }
    }
     /**
     * Limpia los valores del paginado
     */
    clean(): void{
        this.isBusqueda = false;
    }

    /** 
     * @param event detecta cuando se presiona una tecla, esta funcion sólo permite que se tecleen valores alfanuméricos, los demás son bloqueados
     */
    keyPressAlphaNumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    /** 
     * Genera un salto automático de un input al siguiente una vez que la longitud máxima del input ha sido alcanzada
     */
    focusNextInput(event, input) {
        if(event.srcElement.value.length === event.srcElement.maxLength){
            input.focus();
        }
    }

    openSolicitud(){
        const dialogRef = this.dialog.open(DialogsCuenta, {
            width: '700px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result === true){

            }else{

            }
        });
    }
}
