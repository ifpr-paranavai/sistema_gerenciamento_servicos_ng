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

@NgModule({
    imports: [
        SharedModule,
        DialogModule,
        DropdownModule,
        CalendarModule,
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
