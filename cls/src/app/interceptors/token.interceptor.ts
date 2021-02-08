import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mergeMap, catchError} from 'rxjs/operators';
import {Base} from "../configs/base";
import {Router, ActivatedRoute} from '@angular/router';
import {StorageService} from "../services/storage.service";
import {EStorage} from "../enums/e-storage.enum";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private storageService: StorageService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

    //自定义拦截器的，添加请求地址版本信息
    // const req = request.clone({url: request.url + '?v=' + Base.version});
    let req: any = null;
    if (this.storageService.getStorage(EStorage.REFRESH_STATE)) {
      this.storageService.clearStorage(EStorage.REFRESH_STATE);
      const refreshToken = this.storageService.getStorage(EStorage.REFRESH_TOKEN);
      if (refreshToken) {
        req = request.clone({
          setHeaders: {
            "refresh-token": refreshToken
          },
          url: request.url + "?v=" + Base.version
        });
      } else {
        this.router.navigate(["./"], {
          relativeTo: this.activatedRoute
        });
      }

    } else {
      req = request.clone({
        url: request.url + "?v=" + Base.version
      });
    }


    return next.handle(req).pipe(mergeMap((event: any) => {
      if (event instanceof HttpResponse && event.status === 200) {
        if (event.body.code) {
          switch (event.body.code) {
            case 200:
              const headers = event.headers;
              if (headers && headers.get("access-token")) {
                this.storageService.setStorage(EStorage.ACCESS_TOKEN, headers.get("access-token"));
              }
              if (headers && headers.get("refresh-token")) {
                this.storageService.setStorage(EStorage.REFRESH_TOKEN, headers.get("refresh-token"));
              }

              break;
            case 112:
              this.router.navigate(["./"], {
                relativeTo: this.activatedRoute
              });
              break;
            case 113:
              this.storageService.setStorage(EStorage.REFRESH_STATE, true);
              return this.intercept(request, next);
            case 114:
              this.router.navigate(["./"], {
                relativeTo: this.activatedRoute
              });
              break;
            // case 404:
            //   this.renderRouter(404);
            //   break;
            // case 500:
            //   this.renderRouter(500);
            //   break;
            default:
              // this.router.navigate(["./"], {
              //   relativeTo: this.activatedRoute
              // });
              break;
          }

        }
      } else if (event instanceof HttpResponse && event.status === 404) {
        this.renderRouter(404);
      } else if (event instanceof HttpResponse && event.status === 500) {
        this.renderRouter(500);
      }
      return Observable.create((observer: any) => observer.next(event));
    }));
  }

  renderRouter(code: number) {
    this.router.navigate(["/views/error"], {
      queryParams: {code: code},
      relativeTo: this.activatedRoute,
      skipLocationChange: true
    })
  }
}
