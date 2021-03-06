import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from 'src/app/service/user.service';

@Component({
  selector: 'rev-user-company',
  templateUrl: './user-company.component.html',
  styleUrls: ['./user-company.component.scss']
})
export class UserCompanyComponent implements OnInit {

  public companys: any;
  constructor(private router: Router,
              private user: UserService) { }

  ngOnInit() {
      this.companys = [
          {
              id: 1,
              img: 'http://tqiniu.madrock.com.cn/rev/imgs/67d70eee-df66-02ac-3cc5-4290933ca566.png',
              name: '鑫佰利装饰公司'
          },
          {
              id: 2,
              img: 'http://tqiniu.madrock.com.cn/rev/imgs/6970e657-7503-29bc-8bf4-355d7c1e3aaa.png',
              name: '山顶装饰公司'
          },
          {
              id: 3,
              img: 'http://tqiniu.madrock.com.cn/rev/imgs/0a16293d-e07e-1970-adda-cb008acc6fed.png',
              name: '美画天下装饰公司'
          },
          {
              id: 4,
              img: 'http://tqiniu.madrock.com.cn/rev/imgs/67d70eee-df66-02ac-3cc5-4290933ca566.png',
              name: '城市人家装饰工程有限公司'
          },
          {
              id: 5,
              img: 'http://tqiniu.madrock.com.cn/rev/imgs/6970e657-7503-29bc-8bf4-355d7c1e3aaa.png',
              name: '大彩设计工程有限责任公司'
          },
          {
              id: 6,
              img: 'http://tqiniu.madrock.com.cn/rev/imgs/0a16293d-e07e-1970-adda-cb008acc6fed.png',
              name: '惠龙世纪五彩斑斓一品天下之大成者装饰工程有限公司'
          },
          {
              id: 7,
              img: 'http://tqiniu.madrock.com.cn/rev/imgs/6970e657-7503-29bc-8bf4-355d7c1e3aaa.png',
              name: '泰安装饰有限公司'
          },
          {
              id: 8,
              img: 'http://tqiniu.madrock.com.cn/rev/imgs/0a16293d-e07e-1970-adda-cb008acc6fed.png',
              name: '浩瀚装饰设计工程有限公司'
          }
      ];
  }

  selectCompany(c: any) {
      console.log(c);
      if (!this.user.getId()) {
          this.router.navigate(['/user/info/find'], {queryParams: {cid: c.id}});
      } else {
          this.router.navigate(['/rev/merchant']);
      }
  }

}
