import { NgModule } from "@angular/core";

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../core/shared/shared.module";
import { AppointmentsRoutingModule } from "./appointment-routing.module";
import { AppointmentComponent } from "./appointment.component";
import { AppointmentsListComponent } from "./appointment-list/appointments-list.component";

@NgModule({
    imports: [
        AppointmentsRoutingModule,
        SharedModule,
        TableModule,
        TagModule,
        FormsModule,
        RatingModule,
        CheckboxModule,
        ButtonModule
    ],
    exports: [],
    declarations: [
        AppointmentComponent,
        AppointmentsListComponent
    ],
    providers: [],
})
export class AppointmentsModule {}
