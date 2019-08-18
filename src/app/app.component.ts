import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionService } from './question.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'Simple Questionnaire';
  status: any;

  question: any;
  answers: any;
  questionID: number;
  lastQuestionIndex: number;
  totalPoint: number;
  radioSelected: any;

  showResult: boolean;

  constructor(
    private http: HttpClient,
    private service: QuestionService
  ) {
    this.status = 'Couldn\'t connect to server';
    this.questionID = 1; // Get the first question as default
    this.lastQuestionIndex = -1;
    this.totalPoint = 0;
    this.showResult = false;
    sessionStorage.clear(); // clear all variables in the session storage
  }

  ngOnInit(): void {
    this.getQuestion();
  }

  getPrevQuestion() {
    this.questionID -= 1;
    this.getQuestion();
    this.setValueFromSessionStorage(this.questionID);
  }

  getNextQuestion() {
    this.questionID += 1;
    this.getQuestion();
    this.setValueFromSessionStorage(this.questionID);
  }

  private getQuestion() {
    // Get the first question as default
    this.service.getQuestionFromServer(this.questionID).subscribe( (resp: any) => {
      if (resp.length > 0) { this.status = 'OK'; }
      this.question = resp[0];
      this.answers = this.question.answers;

      if (this.lastQuestionIndex === -1) { // first initial
        this.service.getQuestionsSize().subscribe((size: number) => {
          this.setInitialValuesInSession(size);
          this.lastQuestionIndex = size;
        });
      }
    });
  }

  private selectAnswer(radioSelected: any) {
    sessionStorage.setItem('answer_' + this.questionID, radioSelected); // set selected value

    // calculate total
    let count = 1;
    let points = 0;
    do {
      const point = Number.parseInt(sessionStorage.getItem('answer_' + count), 10); // convert string to number
      count ++;
      if (point === -1) { continue; } // dismiss initial value
      points += point;
    }while (count <= this.lastQuestionIndex);

    this.totalPoint = points;
  }

  private setInitialValuesInSession(size: number) {
    for (let i = 1; i <= size; i++) {
      if (sessionStorage.getItem('answer_' + i) === null) {
        sessionStorage.setItem('answer_' + i, '-1'); // set initial value
      }
    }
  }

  private setValueFromSessionStorage(questionId: number) {
    if (sessionStorage.getItem('answer_' + questionId) !== null) {
      this.radioSelected =  Number.parseInt(sessionStorage.getItem('answer_' + questionId), 10); // convert string to number
    }
  }
}
