import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RichTextService {

  private materialTitle:string
  private richText:string

  constructor() { }

  setMaterialTitle(title:string){
    this.materialTitle = title;
  }

  getMaterialTitle(){
    return this.materialTitle
  }

  setRichText(content:string){
    this.richText = content;
  }

  getRichText(){
    return this.richText
  }



}
