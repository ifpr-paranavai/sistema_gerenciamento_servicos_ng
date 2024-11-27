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
import { AppointmentModalModule } from "../../core/modals/appointment-modal/appointment-modal.module";
import { SplitButtonModule } from 'primeng/splitbutton';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ReviewModule } from "../../core/modals/review-modal/review.module";


@NgModule({
    imports: [
        AppointmentsRoutingModule,
        SharedModule,
        TableModule,
        TagModule,
        FormsModule,
        RatingModule,
        CheckboxModule,
        AppointmentModalModule,
        CommonModule,
        ButtonModule,
        SplitButtonModule,
        MenuModule,
        ReviewModule
    ],
    exports: [],
    declarations: [
        AppointmentComponent,
        AppointmentsListComponent
    ],
    providers: [],
})
export class AppointmentsModule {}
