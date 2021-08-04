import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';

export interface DataExpediente {
  IDTIPOTRAMITE: string;
  FECHAENTRADA: string;
  FECHATERMINO: string;
  OBSERVACIONES: string;
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
  dataExpediente: DataExpediente = {} as DataExpediente;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getTiposTramite();
    this.dataExpediente.IDTIPOTRAMITE = "";
    this.dataExpediente.FECHAENTRADA = "FEC_" + this.datePipe.transform(this.hoy, 'dd/MM/yyyy');
    this.dataExpediente.FECHATERMINO = "FEC_" + this.datePipe.transform(this.hoy, 'dd/MM/yyyy');
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
