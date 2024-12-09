import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { ResetPasswordComponent } from "./reset-password.component";

const routes: Route[] = [
    {
        path: "",
        component: ResetPasswordComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
})
export class ResetPasswordRoutingModule { }
