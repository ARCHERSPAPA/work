import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rev-app-permission',
  templateUrl: './app-permission.component.html',
  styleUrls: ['./app-permission.component.scss']
})
export class AppPermissionComponent implements OnInit {
  public project: string = '仅参与项目';
  public projectList = [{ 'id': 1, 'name': '仅参与项目' }, { 'id': 2, 'name': '参与和子部门项目' }, { 'id': 3, 'name': '参与和所在部门及子部门项目' }]
  constructor() { }

  ngOnInit() {

  }
  selectProject(e) {

    this.project = e;
  }
  close() {
    history.back()
  }
  submit() {
    console.log( this.project)
  }
}
 