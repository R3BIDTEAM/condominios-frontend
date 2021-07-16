import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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