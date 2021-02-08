import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


export interface IRadio {
  key: string;
  label: string;
  selected: boolean;
}

@Component({
  selector: 'app-switch-tab',
  template: `
    <nz-radio-group [(ngModel)]="radio" nzButtonStyle="solid" (ngModelChange)="modelChange($event)">
      <ng-container *ngFor="let switch of switches">  
        <label nz-radio-button [nzValue]="switch.key" >{{switch.label}}</label>
      </ng-container>
    </nz-radio-group>
  `,
  styleUrls: ['./switch-tab.component.less']
})
export class SwitchTabComponent implements OnInit {

  @Input() switches: Array<IRadio> = [];

  @Output() handleSwitch: EventEmitter<any> = new EventEmitter<any>();

  public radio: any;

  constructor() {
  }

  ngOnInit(): void {
    if(this.switches && this.switches.length > 0){
      const radio = this.switches.find(s => s.selected);
      this.radio = radio && radio.key;
    }
  }

  ngOnChanges() {
    if (this.switches && this.switches.length > 0) {
      const radio = this.switches.find(s => s.selected);
      this.radio = radio && radio.key;
    }
  }

  modelChange(key: any) {
    this.handleSwitch.emit({
      key: key
    });
  }

}
