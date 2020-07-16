import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {UserInfoComponent} from './user-info/user-info.component';
import {UserCompanyComponent} from './user-company/user-company.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'info',
        component: UserInfoComponent,
        loadChildren: './user-info/user-info.module#UserInfoModule'
    },
    {
        path: 'company',
        component: UserCompanyComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
