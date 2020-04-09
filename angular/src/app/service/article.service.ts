import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private articleSetNumber:number = 0;

  constructor() { }


  setArticleSetNumber(as:number){
      this.articleSetNumber = as;
  }

  getArticleSetNumber(){
      return this.articleSetNumber;
  }

}
