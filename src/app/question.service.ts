import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) {}

  public getAllQuestionsFromServer() {
    return this.http.get(environment.readAQuestionURL);
  }

  public getQuestionFromServer(id: number) {
    return this.http.get(environment.readAQuestionURL + id);
  }

  public getQuestionsSize() {
    return this.http.get(environment.getQuestionsSizeURL);
  }
}
