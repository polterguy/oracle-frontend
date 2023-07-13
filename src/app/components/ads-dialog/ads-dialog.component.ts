
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ads-dialog',
  templateUrl: './ads-dialog.component.html',
  styleUrls: ['./ads-dialog.component.scss']
})
export class AdsDialogComponent {

  constructor(private dialogRef: MatDialogRef<AdsDialogComponent>) { }

  close() {

    this.dialogRef.close();
  }
}
