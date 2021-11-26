import { observable, action } from 'mobx';

export type QuestionType = {
  id: string;
  text: string;
  isFirst: boolean,
  answers: {
    text: string;
    next: string;
  }[];
}

export class QuizStore {
  @observable question: QuestionType | undefined;
  @observable questions: QuestionType[] = [];

  @action
  public addQuestions(questions: QuestionType[]) {
    this.questions = questions;
  }

  @action
  public addQuestion(question: QuestionType | undefined) {
    this.question = question;
  }
}