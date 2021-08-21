import { Component, OnInit, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from '@env/environment'
import { AuthService } from '@serv/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogPropietarios, DialogInstalaciones, DialogUnidadPrivativa } from '@comp/dialogs/dialogs.component'
import { DomicilioComponent } from '@comp/domicilio/domicilio.component';

@Component({
    selector: 'app-datos-generales-editar',
    templateUrl: './datos-generales-editar.component.html',
    styleUrls: ['./datos-generales-editar.component.css']
})
export class DatosGeneralesEditarComponent implements OnInit {
    httpOptions;
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
    }

    openDomicilio(){
        const dialogRef = this.dialog.open(DomicilioComponent, {
            width: '700px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){}
        });
    }

    openPropietarios(){
        const dialogRef = this.dialog.open(DialogPropietarios, {
            width: '700px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){}
        });
    }

    openInstalaciones(){
        const dialogRef = this.dialog.open(DialogInstalaciones, {
            width: '700px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){}
        });
    }

    openDetalleUnidad(){
        const dialogRef = this.dialog.open(DialogInstalaciones, {
            width: '700px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){}
        });
    }

    openDatosCondominios(){
        const dialogRef = this.dialog.open(DialogUnidadPrivativa, {
            width: '700px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){}
        });
    }
}
