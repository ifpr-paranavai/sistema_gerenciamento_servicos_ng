import { NgModule } from "@angular/core";
import { AppointmentModalComponent } from "./appointment-modal.component";
import { ServiceRequest } from "../../requests/services/service.request";
import { AppointmentsRequest } from "../../requests/appointments/appointments.request";
import { SharedModule } from "../../shared/shared.module";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { AuthenticationRequest } from "../../requests/authentication/authentication.request";
import { ProviderRequest } from "../../requests/providers/providers.request";
import { ClientRequest } from "../../requests/clients/clients.request";
import { CalendarModule } from "primeng/calendar";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
        DropdownModule,
        CalendarModule,
        InputTextareaModule,
        ButtonModule,
        TableModule,
        TagModule,
        ProgressSpinnerModule
    ],
    exports: [
        AppointmentModalComponent
    ],
    declarations: [
        AppointmentModalComponent
    ],
    providers: [
        ServiceRequest,
        AppointmentsRequest,
        AuthenticationRequest,
        ProviderRequest,
        ClientRequest
    ],
})
export class AppointmentModalModule { }
