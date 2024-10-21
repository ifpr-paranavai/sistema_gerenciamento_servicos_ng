import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppointmentComponent } from "./appointment.component";

const routes: Routes = [
    {
        path: "",
        component: AppointmentComponent,
        canActivate: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppointmentsRoutingModule {}
