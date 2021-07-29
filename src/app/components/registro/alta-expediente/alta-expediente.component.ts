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
  filtro = "{\n    \"FILTER\": \"\"\n}";
  catTiposTramite = environment.endpoint + '?action=getCatalogo&table=ADYCON_CATTIPOSTRAMITE';
  loadingTiposTramite = false;
  tiposTramite;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getTiposTramite();
  }

  getTiposTramite(): void {
    this.loadingTiposTramite = true;
    this.http.post(this.catTiposTramite, this.filtro).subscribe(
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
