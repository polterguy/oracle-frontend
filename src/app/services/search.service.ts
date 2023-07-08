import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) {}

  search(prompt: string) {

    return this.httpClient.get<any>('/magic/modules/oracle/search?prompt=' + encodeURIComponent(prompt));
  }
}
