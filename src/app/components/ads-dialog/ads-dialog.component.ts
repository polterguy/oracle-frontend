
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-ads-dialog',
  templateUrl: './ads-dialog.component.html',
  styleUrls: ['./ads-dialog.component.scss']
})
export class AdsDialogComponent implements OnInit {

  ads: any[] = [];
  displayedColumns: string[] = [
    'content',
  ];

  constructor(
    private snack: MatSnackBar,
    private searchService: SearchService,
    private dialogRef: MatDialogRef<AdsDialogComponent>) { }

  ngOnInit() {

    // Retrieving all ads from backend.
    this.searchService.ads().subscribe({

      next: (result: any[]) => {

        // Binding to grid.
        this.ads = result || [];
      },

      error: (error: any) => {

        this.snack.open(error.error, 'Ok', {
          duration: 5000,
        });
      }
    });
  }

  deleteAd(ad: any) {

    console.log(ad);
  }

  newAd() {

    const data = this.ads.filter(x => true);
    data.push({

      content: 'Content of ad here ...'
    });
    this.ads = data;
  }

  saveAd(ad: any) {

    if (ad.ad_id) {

      this.searchService.updateAd(ad).subscribe({

        next: () => {

          this.snack.open('Ad successfully saved', 'Ok', {
            duration: 2000,
          });
        },

        error: (error: any) => {

          this.snack.open(error.error, 'Ok', {
            duration: 5000,
          });
        }
      });

    } else {

      this.searchService.createAd(ad).subscribe({

        next: (result: any) => {

          this.snack.open('Ad successfully saved', 'Ok', {
            duration: 2000,
          });
          ad.ad_id = result.id;
        },

        error: (error: any) => {

          this.snack.open(error.error, 'Ok', {
            duration: 5000,
          });
        }
      });
    }
  }

  close() {

    this.dialogRef.close();
  }
}
