import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-alta-expediente',
  templateUrl: './alta-expediente.component.html',
  styleUrls: ['./alta-expediente.component.css']
})
export class AltaExpedienteComponent implements OnInit {
  httpOptions;
  filtro = "{\n    \"FILTER\": \"\"\n}";
  catTiposTramite = environment.endpoint + '?action=getCatalogo&table=ADYCON_CATTIPOSTRAMITE';
  loadingTiposTramite = false;
  tiposTramite;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    this.getTiposTramite();
  }

  getTiposTramite(): void {
    this.loadingTiposTramite = true;
    console.log(this.filtro);
    this.http.post(this.catTiposTramite, this.filtro, this.httpOptions).subscribe(
      (res: any) => {
        this.loadingTiposTramite = false;
        this.tiposTramite = res;
        console.log(res);
      },
      (error) => {
        this.loadingTiposTramite = false;
        console.log(error);
      }
    );
  }

}
