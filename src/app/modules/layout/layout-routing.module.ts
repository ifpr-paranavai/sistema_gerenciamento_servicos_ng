import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { HomeComponent } from "../home/home.component";
import { DiagramClassComponent } from "../diagram-class/diagram-class.component";

const routes: Routes = [
    {
        path: "auth",
        canActivate: [],
        loadChildren: () =>
            import("../login/login.module").then(
                (m) => m.LoginModule,
            ),
    },
    {
        path: "app",
        component: LayoutComponent,
        canActivate: [],
        children: [
            {
                path: "home",
                component: HomeComponent
            },
            {
                path: "diagrama-classe-uml",
                component: DiagramClassComponent
            },
            {
                path: "**",
                redirectTo: "home"
            }
        ]
    },
    {
        path: "**",
        redirectTo: "app/home",
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutRoutingModule { }
