import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {ScheduleStayComponent} from './schedule-stay/schedule-stay.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'stay',
        pathMatch: 'full'
    },
    {
        path: 'stay',
        component: ScheduleStayComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ScheduleRoutingModule {
}
