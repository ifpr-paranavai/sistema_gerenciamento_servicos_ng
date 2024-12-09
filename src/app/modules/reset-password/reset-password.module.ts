import { NgModule } from "@angular/core";
import { ResetPasswordComponent } from "./reset-password.component";
import { FloatLabelModule } from "primeng/floatlabel";
import { PasswordModule } from "primeng/password";
import { SharedModule } from "../../core/shared/shared.module";
import { AuthenticationRequest } from "../../core/requests/authentication/authentication.request";
import { ResetPasswordRoutingModule } from "./reset-password-routing.module";

@NgModule({
    imports: [
        ResetPasswordRoutingModule,
        SharedModule,
        FloatLabelModule,
        PasswordModule,
    ],
    declarations: [
        ResetPasswordComponent
    ],
    providers: [
        AuthenticationRequest,
    ],
})
export class ResetPasswordModule {}
