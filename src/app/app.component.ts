import { Component, OnDestroy } from '@angular/core';
import { SearchService } from './services/search.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  prompt: string = '';
  searching: boolean = false;
  hubConnection?: HubConnection;
  messages: any[] = [];
  hasFocus: boolean = false;

  constructor(
    private searchService: SearchService,
    private snack: MatSnackBar) { }

  ngOnDestroy() {

    this.hubConnection?.stop();
  }

  focused() {

    this.hasFocus = true;
  }

  blurred() {

    this.hasFocus = false;
  }

  valid() {

    return this.prompt.length >= 5 && this.prompt.length <= 250 && this.prompt.endsWith('?');
  }

  submit() {

    this.searching = true;

    this.messages.push({
      message: 'Opening up feedback channel'
    });
    this.searchService.gibberish().subscribe({

      next: (result: any) => {

        let builder = new HubConnectionBuilder();
        this.hubConnection = builder.withUrl(environment.backend + '/sockets', {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        }).build();
    
        this.hubConnection.on('oracle.message.' + result.gibberish, (args) => {
    
          this.messages.push(JSON.parse(args));
        });
    
        this.hubConnection.start().then(() => {
    
          this.searchService.search(this.prompt, result.gibberish).subscribe({
    
            next: (result: any) => {
    
              this.hubConnection?.stop();
              window.location.href = environment.backend + '/articles/' + result.url;
            },
    
            error: (error: any) => {
    
              this.searching = false;
              this.hubConnection?.stop();
              this.snack.open(error.error, 'Ok', {
                duration: 5000,
              });
            }
          });
        });
      },

      error: (error: any) => {}
    });
  }
}
