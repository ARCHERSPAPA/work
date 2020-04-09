import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {RequestService} from "../../service/request.service";
import {Router, ActivatedRoute} from '@angular/router';
import { NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd';

@Component({
  selector: 'permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  constructor(
    private request:RequestService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  @ViewChild('treeCom') treeCom;

  @Output() handleGetCheckedNodeList = new EventEmitter<string>();

  private pid: number;
  public nodes;
  ngOnInit(): void {
    let self = this;

    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.item) {
        let items = JSON.parse(params.item);
        self.pid = items["id"];
        if (self.pid) {
          this.loadRoleList(self.pid)
        }
        console.log(self.pid)
        // that.pname = items["name"];
        // that.queryDepartType = items["departmentQueryType"];
      } else {
        self.router.navigate(["./../"], {relativeTo: self.activatedRoute});
      }
    })

    // setTimeout(() => {
    //   console.log(this.treeCom.getTreeNodes(), this.treeCom.getCheckedNodeList(), this.treeCom.getSelectedNodeList());
    // }, 500);
  }

  loadRoleList(pid){

    const self = this

    this.request.doPost({
      url:"getCatalogs",
      data:{id:pid},
      success:(res =>{
        if(res && res.code == 200){
          self.nodes = self.recursionRole(res.data)
          console.log(self.nodes)
        }
      })
    })
  }

  recursionRole(item){
    for(let i=0;i<item.length;i++){
      item[i]['title'] = item[i].catalogName;
      item[i]['key'] = item[i].id;

      if(item[i].catalogs) {
        item[i]['children'] = item[i].catalogs
        this.recursionRole(item[i].catalogs)
      }else{
        if(item[i].largePermissions.length > 0){
          const largePermissionsData = item[i].largePermissions
          for(let j=0;j<largePermissionsData.length;j++){
            largePermissionsData[j]['title'] = largePermissionsData[j].name;
            largePermissionsData[j]['key'] = largePermissionsData[j].id;
            largePermissionsData[j].isLeaf = true
            largePermissionsData[j].isExpanded = true
            largePermissionsData[j].origin = "dfdsf"
          }
          item[i]['children'] = largePermissionsData
        }else{
          item[i].isLeaf = true
        }
      }
    }
    console.log(item)
    return item
  }

  // deepRecursionRole(item){
  //   for(let i=0;i<item.length;i++){
  //       console.log(item[i])
  //   }
  // }

  nzClick(event: NzFormatEmitEvent): void {
    console.log(event, event.selectedKeys, event.keys, event.nodes, this.treeCom.getSelectedNodeList());
  }

  nzCheck(event: NzFormatEmitEvent): void {
    console.log(event, event.checkedKeys, event.keys, event.nodes);
  }

  getCheckedNode(){
    console.log()
  }

  // nzSelectedKeys change
  nzSelect(keys: string[]): void {
    console.log(keys, this.treeCom.getSelectedNodeList());
  }


}
