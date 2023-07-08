import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  prompt: string = '';
  searching: boolean = false;

  constructor(
    private searchService: SearchService,
    private snack: MatSnackBar) {}

  submit() {

    this.searching = true;
    this.searchService.search(this.prompt).subscribe({

      next: (result: any) => {

        console.log(result);
      },

      error: (error: any) => {

        this.searching = false;
        this.snack.open(error.error, 'Ok', {
          duration: 5000,
        });
      }
    });
  }
}
