import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from './services/search.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  prompt: string = '';
  searching: boolean = false;
  hubConnection?: HubConnection;
  messages: any[] = [];
  hasFocus: boolean = false;
  answers: any[] = [];
  count: number = 0;
  hasMore: boolean = true;

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private searchService: SearchService,
    private snack: MatSnackBar) { }

  ngOnInit() {

    // Retrieving 10 most recent answers.
    this.searchService.recentAnswers().subscribe({

      next: (result: any[]) => {

        this.answers = result || [];
      },

      error: (error: any) => {

        this.snack.open(error.error, 'Ok', {
          duration: 5000,
        });
      }
    });

    // Counting answers.
    this.searchService.countAnswers().subscribe({

      next: (result: any) => {

        this.count = result.count;
      },

      error: (error: any) => {

        this.snack.open(error.error, 'Ok', {
          duration: 5000,
        });
      }
    });
  }

  ngOnDestroy() {

    this.hubConnection?.stop();
  }

  getUrl(url: string) {

    return environment.backend + '/articles/' + url;
  }

  more() {

    this.searchService.recentAnswers(this.answers[this.answers.length - 1].article_id).subscribe({

      next: (result: any[]) => {

        this.answers = this.answers.concat(result || []);
        this.hasMore = result.length >= 10;
      },

      error: (error: any) => {

        this.snack.open(error.error, 'Ok', {
          duration: 5000,
        });
      }
    });
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

  dotDotDot() {

    if (!this.searching || this.messages.length === 0) {
      return;
    }

    this.messages[this.messages.length - 1].message += '.';
    setTimeout(() => this.dotDotDot(), 1000);
  }

  submit() {

    this.searching = true;
    this.messages = [];

    this.messages.push({
      message: 'Client side validation of reCAPTCHA'
    });
    setTimeout(() => this.dotDotDot(), 1000);

    this.recaptchaV3Service.execute('formSubmission').subscribe({

      next: (token: any) => {

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
        
              this.searchService.search(this.prompt, result.gibberish, token).subscribe({
        
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

          error: () => {

            this.snack.open('Not able to verify create a secure channel', 'Ok', {
              duration: 5000,
            });
          }
        });
      },

      error: () => {

        this.snack.open('Not able to verify reCAPTCHA key', 'Ok', {
          duration: 5000,
        });
      }
    });
  }
}
