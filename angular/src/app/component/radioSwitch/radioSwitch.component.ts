import { Component, OnInit, Input, EventEmitter,  Output  } from '@angular/core';

@Component({
  selector: 'radio-switch',
  templateUrl: './radioSwitch.component.html',
  styleUrls: ['./radioSwitch.component.scss']
})
export class RadioSwitchComponent implements OnInit {
  @Input() radioSwitch:Array<any>;

    /**
     * 设置默认值时用
     */
  @Input() defaultRadioSwitch:any;

  @Output() handleSwitch = new EventEmitter<any>();


  public radioValue:number;
  constructor(){}

  ngOnInit(){
    this.radioValue = this.defaultRadioSwitch?this.defaultRadioSwitch.key:this.radioSwitch[0].key
  }


  handleClick(){
    this.handleSwitch.emit(this.radioValue)
  }
}
