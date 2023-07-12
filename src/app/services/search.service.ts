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
  recentAnswers(permalinks: boolean = false, from: number = -1) {

    let filter = '';
    if (from !== -1) {
      filter += 'from=' + from
    }
    if (permalinks) {
      if (filter !== '') {
        filter += '&permalinks=true'
      } else {
        filter = 'permalinks=true'
      }
    }
    if (filter !== '') {
      filter = '?' + filter;
    }

    return this.httpClient.get<any[]>(
      environment.backend +
      '/magic/modules/oracle/recent-answers' + filter);
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

  /**
   * Updates the specified article in our backend.
   */
  updateAnswer(article: any) {

    return this.httpClient.put<any>(
      environment.backend +
      '/magic/modules/oracle/articles', article, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('ticket')
        }
      });
  }
}
