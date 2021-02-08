import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMaterialListComponent } from './add-material-list.component';
import { SearchBarModule } from "../../components/search-bar/search-bar.module";
import { SwitchTabModule } from "../../components/switch-tab/switch-tab.module";
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
@NgModule({
  declarations: [AddMaterialListComponent],
  imports: [
    CommonModule,
    NzTableModule,
    SwitchTabModule,
    SearchBarModule,
    NzButtonModule
  ],
  exports: [AddMaterialListComponent],
})
export class AddMaterialListModule { }
