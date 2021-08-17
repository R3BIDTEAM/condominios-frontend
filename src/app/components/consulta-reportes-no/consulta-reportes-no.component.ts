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
    selector: 'app-consulta-reportes-no',
    templateUrl: './consulta-reportes-no.component.html',
    styleUrls: ['./consulta-reportes-no.component.css']
})
export class ConsultaReportesNoComponent implements OnInit {
    httpOptions;
    fecha_inicio: Date;
    fecha_fin: Date;
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

}
