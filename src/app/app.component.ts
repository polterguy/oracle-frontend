import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  prompt: string = '';
  searching: boolean = false;

  submit() {

    this.searching = true;
  }
}
