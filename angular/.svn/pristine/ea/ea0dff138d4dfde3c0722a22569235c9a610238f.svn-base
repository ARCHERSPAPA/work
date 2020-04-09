import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule,Routes} from '@angular/router';
import {StatsOverallComponent} from "./stats-overall/stats-overall.component";
import {GuardService} from "../../service/guard.service";
import {StatsSketchComponent} from "./stats-sketch/stats-sketch.component";

const routes:Routes = [
    {
        path:"",
        redirectTo:"overall",
        pathMatch:"full"
    },
    {
        path:"overall",
        component:StatsOverallComponent,
        canActivate:[GuardService],
        data:{
            breadcrumb:"整体概况"
        }
    },
    {
        path:"sketch",
        component:StatsSketchComponent,
        canActivate:[GuardService],
        data:{
            breadcrumb:"工地概况"
        }
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class StatsRoutingModule { }
