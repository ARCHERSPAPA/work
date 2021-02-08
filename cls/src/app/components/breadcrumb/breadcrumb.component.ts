import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET} from '@angular/router';
import {filter} from 'rxjs/operators';
import {startWith} from 'rxjs/internal/operators/startWith';
import {StorageService} from "../../services/storage.service";
import {EStorage} from "../../enums/e-storage.enum";

interface IBreadcrumb {
  label: string;
  url: string;
  params: Params;
  key: string,
  color: string | null
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.less']
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumbs: IBreadcrumb[];
  //16进制的颜色
  public color: string | null | undefined;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private storageService: StorageService) {
    this.breadcrumbs = [];
    this.color = null;
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      startWith(true)
    ).subscribe(event => {
      const root: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(root);
      const findColor = this.breadcrumbs.find(b => !!b.color);
      this.color = findColor && findColor.color;

    })

  }

  getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = "customBreadcrumb";
    const ROUTE_DATA_KEY = "key";
    const ROUTE_DATA_COLOR = "color";

    if (route.children.length === 0) {
      return breadcrumbs;
    }
    for (let child of route.children) {
      if (child.outlet === PRIMARY_OUTLET) {
        const routeURL: string = child.snapshot.url
          .map(seg => seg.path)
          .join("/");

        const nextURL = url + `/${routeURL}`;
        const label = child.snapshot.data[ROUTE_DATA_BREADCRUMB];
        if (routeURL && label) {
          const breadcrumb = {
            label: label,
            params: child.snapshot.params,
            url: nextURL.replace('//', '/'),
            key: child.snapshot.data[ROUTE_DATA_KEY],
            color: child.snapshot.data[ROUTE_DATA_COLOR]
          }
          breadcrumbs.push(breadcrumb);
        }
        return this.getBreadcrumbs(child, nextURL, breadcrumbs);
      }
    }
    return [];
  }


  todo(bread: IBreadcrumb) {
    this.storageService.setStorage(EStorage.CLICK_MENU, bread.key);
    this.router.navigate([bread.url], {
      queryParams: bread.params
    })
  }

}
