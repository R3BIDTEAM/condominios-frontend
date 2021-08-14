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

@Component({
    selector: 'app-bandeja-entrada',
    templateUrl: './bandeja-entrada.component.html',
    styleUrls: ['./bandeja-entrada.component.css']
})
export class BandejaEntradaComponent implements OnInit {
    httpOptions;
    fecha_inicio: Date;
    fecha_fin: Date;
    buscaFormGroup: FormGroup;
    @ViewChild('paginator') paginator: MatPaginator;

    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private auth: AuthService,
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: this.auth.getSession().token
            })
        };

        this.buscaFormGroup = this._formBuilder.group({
            region: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
            manzana: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
            lote: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
            fecha_inicio: [null],
            fecha_fin: [null]
          });
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
