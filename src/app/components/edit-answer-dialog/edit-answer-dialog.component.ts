import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-edit-answer-dialog',
  templateUrl: './edit-answer-dialog.component.html',
  styleUrls: ['./edit-answer-dialog.component.scss']
})
export class EditAnswerDialogComponent implements OnInit {

  constructor(
    private snack: MatSnackBar,
    private searchService: SearchService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditAnswerDialogComponent>) { }

  ngOnInit() {

    this.searchService.getAnswer(this.data.article_id).subscribe({

      next: (result: any) => {
        
        this.data.content = result.content;
      },

      error: (error: any) => {

        this.snack.open(error.error, 'Ok', {
          duration: 5000,
        });
      }
    });
  }

  save() {

    this.searchService.updateAnswer({
      article_id: this.data.article_id,
      content: this.data.content,
    }).subscribe({

      next: () => {

        this.snack.open('Article successfully updated', 'Ok', {
          duration: 1000,
        });
      },

      error: (error: any) => {

        this.snack.open(error.error, 'Ok', {
          duration: 5000,
        });
      }
    });
    this.dialogRef.close();
  }

  close() {

    this.dialogRef.close();
  }
}
