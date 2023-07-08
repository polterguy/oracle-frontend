import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) {}

  search(prompt: string) {

    return this.httpClient.get<any>(
      environment.backend +
      '/magic/modules/oracle-backend/search?prompt=' + encodeURIComponent(prompt));
  }
}
