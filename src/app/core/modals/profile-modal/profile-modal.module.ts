import { NgModule } from "@angular/core";
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from "../../shared/shared.module";
import { ProfileModalComponent } from "./profile-modal.component";
import { DropdownModule } from "primeng/dropdown";
import { UserState } from "../../abstractions/user.state";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";

@NgModule({
    imports: [
        SharedModule,
        DialogModule,
        DropdownModule,
        NgxMaskDirective,
        NgxMaskPipe,
    ],
    exports: [ProfileModalComponent],
    declarations: [ProfileModalComponent],
    providers: [
        UserState,
        provideNgxMask(),
    ]
})
export class ProfileModalModule { }
