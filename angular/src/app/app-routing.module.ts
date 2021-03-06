import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {RevComponent} from './rev/rev.component';
import {ErrorComponent} from './rev/error/error.component';
import {ViewComponent} from './view/view.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
    },
    {
        path: 'user',
        loadChildren: './user/user.module#UserModule'
    },
    {
        path: 'rev',
        component: RevComponent,
        loadChildren: './rev/rev.module#RevModule',
        data: {
            breadcrumb: '首页'
        }
    },
    {
        path: 'view',
        component: ViewComponent,
        loadChildren: './view/view.module#ViewModule'
    },
    {
        path: 'error',
        component: ErrorComponent
    }
];


@NgModule({
    imports: [
        RouterModule.forRoot(routes, {useHash: false})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
