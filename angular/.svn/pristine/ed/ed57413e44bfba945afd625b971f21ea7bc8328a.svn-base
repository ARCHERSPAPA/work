import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'rev-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./../steps.component.scss']
})
export class StepOneComponent implements OnInit {

  constructor(private router:Router,
              private activatedRoute:ActivatedRoute) { }

  public isOpen:boolean = true;

  ngOnInit() {

  }


    openTimer($e){
        // console.log($e);
    }

    closeTimer($e){
        if(!$e){
            this.isOpen = false;
        }
    }

  read(){
    this.router.navigate(["./../two"],{relativeTo:this.activatedRoute,skipLocationChange:true})
  }

}
