import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[revGoTop]'
})
export class GoTopDirective {

  constructor(){}

  @HostBinding("style.display") display = "none";

  @HostListener("click",["$event"]) onClick(event){
      event.stopPropagation();
      event.preventDefault();
      let top = window.scrollY,count = 0;
      let timer = setInterval(()=>{
          if(top < 0){
              window.scroll(0,0);
              clearInterval(timer);
          }else{
              top -= 10*(++count) ;
              window.scroll(0,top);
          }
      },5)

  }

  @HostListener("window:scroll") winScroll(){
    if(window.scrollY > 300){
        this.display = "block";
    }else{
        this.display = "none";
    }
  }


}
