import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

export interface DialogData {
    animal: string;
    name: string;
}

@Component({
    selector: 'app-dialogs',
    templateUrl: './dialogs.component.html',
    styles: [
    ]
})

export class DialogsComponent implements OnInit {

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { 
        dialogRef.disableClose = true;
        console.log(data);
    }

    ngOnInit(): void {
    }

}

@Component({
    selector: 'app-prueba',
    templateUrl: 'prueba.html',
})
export class DialogsAlta {

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogsAlta>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        dialogRef.disableClose = true;
    }

    ngOnInit(): void {
    }

}

////////////////////////////////////////// CUENTA PREDIAL ///////////////////////////////////////////////////
@Component({
    selector: 'dialog-cuenta',
    templateUrl: 'dialog-cuenta.html',
})
export class DialogsCuenta {
    buscaFormGroup: FormGroup;
    constructor(
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<DialogsCuenta>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        dialogRef.disableClose = true;
    }

    ngOnInit(): void {
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
}

//////////////////////////////////////////////////// PROPIETARIOS ////////////////////////////////////////////////////
@Component({
    selector: 'dialog-propietarios',
    templateUrl: 'dialog-propietarios.html',
})
export class DialogPropietarios {

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogPropietarios>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        dialogRef.disableClose = true;
    }

    ngOnInit(): void {
    }

    openDatosPropietario(){
        const dialogRef = this.dialog.open(DialogsDatosPropietarios, {
            width: '700px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){}
        });
    }
}

//////////////////////////////////////////////////// DATOS DEL PROPIETARIO ///////////////////////////////////////////////
@Component({
    selector: 'dialogs-datos-propietarios',
    templateUrl: 'dialogs-datos-propietarios.html',
})
export class DialogsDatosPropietarios {
    fisicaFormGroup: FormGroup;
    moralFormGroup: FormGroup;
    tipoPersona = 'F';

    constructor(
        private _formBuilder: FormBuilder,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogsDatosPropietarios>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        dialogRef.disableClose = true;
        this.fisicaFormGroup = this._formBuilder.group({
            nombre: [null, [Validators.required]],
            apaterno: [null, [Validators.required]],
            amaterno: [null, []],
            rfc: [null, []],
            curp: [null, []],
            ine: [null, []],
        });
    
        this.moralFormGroup = this._formBuilder.group({
            nombre: [null, [Validators.required]],
            rfc: [null, [Validators.required]],
            actividad: [null, []],
        });
    }

    ngOnInit(): void {
    }

    personaTipo(){

    }
}


/////////////////////////////////////////////// INSTALACIONES ESPECIALES ////////////////////////////////////////
@Component({
    selector: 'dialog-instalaciones',
    templateUrl: 'dialog-instalaciones.html',
})
export class DialogInstalaciones {

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogInstalaciones>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        dialogRef.disableClose = true;
    }

    ngOnInit(): void {
    }

}

/////////////////////////////////////////////// UNIDADAES PRIVATIVAS ////////////////////////////////////////
@Component({
    selector: 'dialog-unidad-privativa',
    templateUrl: 'dialog-unidad-privativa.html',
})
export class DialogUnidadPrivativa {

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogUnidadPrivativa>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        dialogRef.disableClose = true;
    }

    ngOnInit(): void {
    }

    openDatosCondominios(){
        const dialogRef = this.dialog.open(DialogDatosCondominio, {
            width: '700px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){}
        });
    }

}

/////////////////////////////////////////////// DATOS CONDOMINIOS ////////////////////////////////////////
@Component({
    selector: 'dialog-datos-condominio',
    templateUrl: 'dialog-datos-condominio.html',
})
export class DialogDatosCondominio {

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogDatosCondominio>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        dialogRef.disableClose = true;
    }

    ngOnInit(): void {
    }

}