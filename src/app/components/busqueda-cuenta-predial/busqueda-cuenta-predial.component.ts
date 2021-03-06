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
    selector: 'app-busqueda-cuenta-predial',
    templateUrl: './busqueda-cuenta-predial.component.html',
    styleUrls: ['./busqueda-cuenta-predial.component.css']
})
export class BusquedaCuentaPredialComponent implements OnInit {
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
     * @param event detecta cuando se presiona una tecla, esta funcion s??lo permite que se tecleen valores alfanum??ricos, los dem??s son bloqueados
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
     * Genera un salto autom??tico de un input al siguiente una vez que la longitud m??xima del input ha sido alcanzada
     */
    focusNextInput(event, input) {
        if(event.srcElement.value.length === event.srcElement.maxLength){
            input.focus();
        }
    }

}
