import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

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

        window.location.href = environment.backend + '/articles/' + result.url;
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
