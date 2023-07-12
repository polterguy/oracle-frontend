
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {

  username: string = '';
  password: string = '';

  constructor(private dialogRef: MatDialogRef<LoginDialogComponent>) { }

  login() {

    this.dialogRef.close({
      username: this.username,
      password: this.password,
    })
  }
}
