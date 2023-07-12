import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Authenticates you towards backend.
   */
  login(username: string, password: string) {

    return this.httpClient.get<any>(
      environment.backend +
      '/magic/system/auth/authenticate?username=' +
      encodeURIComponent(username) +
      '&password=' +
      encodeURIComponent(password));
  }

  /**
   * Returns random string of 25 charactes to use for socket channel.
   */
  gibberish() {

    return this.httpClient.get<any>(
      environment.backend +
      '/magic/system/misc/gibberish?min=25&max=25');
  }

  /**
   * Searches for the answer to your question.
   */
  search(prompt: string, channel: string, token: string) {

    return this.httpClient.get<any>(
      environment.backend +
      '/magic/modules/oracle/search?prompt=' +
      encodeURIComponent(prompt) +
      '&channel=' +
      channel +
      '&token=' +
      encodeURIComponent(token));
  }

  /**
   * Returns recent answers, optionally offsetting from the specified 'from' argument,
   * which is the ID of the last seen answer you want to start retrieving answers from.
   */
  recentAnswers(from: number = -1) {

    return this.httpClient.get<any[]>(
      environment.backend +
      '/magic/modules/oracle/recent-answers' +
      (from === -1 ? '' : ('?from=' + from)));
  }

  /**
   * Returns the numberof answers in total in system.
   */
  countAnswers() {

    return this.httpClient.get<any>(
      environment.backend +
      '/magic/modules/oracle/answers-count');
  }

  /**
   * Deletes the specified article from backend.
   */
  deleteAnswer(id: number) {

    return this.httpClient.delete<any>(
      environment.backend +
      '/magic/modules/oracle/articles?article_id=' +
      encodeURIComponent(id), {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('ticket')
        }
      });
  }
}
