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
  filtro = {FILTER: ""};
  catTiposTramite = environment.endpointCatalogos + 'ADYCON_CATTIPOSTRAMITE';
  loadingTiposTramite = false;
  tiposTramite;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getTiposTramite();
  }

  getTiposTramite(): void {
    console.log(this.filtro);
    this.loadingTiposTramite = true;
    this.http.post(this.catTiposTramite, this.filtro).subscribe(
      (res: any) => {
        this.loadingTiposTramite = false;
        this.tiposTramite = res;
      },
      (error) => {
        this.loadingTiposTramite = false;
      }
    );
  }

}
