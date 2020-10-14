import { Component, OnInit } from '@angular/core';
import { HeaderService } from "../../../service/header.service";
@Component({
  selector: 'rev-item-makings',
  templateUrl: './item-makings.component.html',
  styleUrls: ['./item-makings.component.scss']
})
export class ItemMakingsComponent implements OnInit {
  public dataVersion;
  constructor(private header: HeaderService) { }

  ngOnInit() {
  }
  ngAfterContentChecked() {
    this.dataVersion = this.header.getHeaderVersion();
  }
}
