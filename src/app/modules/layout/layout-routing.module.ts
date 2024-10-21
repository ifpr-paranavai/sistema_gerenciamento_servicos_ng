import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { HomeComponent } from "../home/home.component";
import { DiagramClassComponent } from "../diagram-class/diagram-class.component";
import { authGuard } from "../../core/guards/auth.guard";
import { loginGuard } from "../../core/guards/login.guard";

const routes: Routes = [
    {
        path: "auth",
        canActivate: [loginGuard],
        loadChildren: () =>
            import("../login/login.module").then(
                (m) => m.LoginModule,
            ),
    },
    {
        path: "app",
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: "home",
                component: HomeComponent
            },
            {
                path: "diagram-class-uml",
                component: DiagramClassComponent
            },
            {
                path: "appointments",
                loadChildren: () =>
                    import("../appointments/appointment.module").then(
                        (m) => m.AppointmentsModule,
                    ),
            },
            {
                path: "services",
                loadChildren: () =>
                    import("../services/services.module").then(
                        (m) => m.ServicesModule,
                    ),
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
