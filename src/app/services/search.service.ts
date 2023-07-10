import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) {}

  gibberish() {

    return this.httpClient.get<any>(
      environment.backend +
      '/magic/system/misc/gibberish?min=25&max=25');
  }

  search(prompt: string, channel: string, token: string) {

    return this.httpClient.get<any>(
      environment.backend +
      '/magic/modules/oracle/search?prompt=' + encodeURIComponent(prompt) + '&channel=' + channel + '&token=' + token);
  }

  recentAnswers(from: number = -1) {
    return this.httpClient.get<any[]>(environment.backend +
      '/magic/modules/oracle/recent-answers' +
      (from === -1 ? '' : ('?from=' + from)));
  }

  countAnswers() {
    return this.httpClient.get<any[]>(environment.backend + '/magic/modules/oracle/answers-count');
  }
}
