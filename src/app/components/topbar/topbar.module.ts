import { NgModule } from "@angular/core";
import { AvatarModule } from 'primeng/avatar';
import { TopbarComponent } from "./topbar.component";
import { SharedModule } from "../../core/shared/shared.module";
import { SidebarModule } from "../sidebar/sidebar.module";
import { ProfileModalModule } from "../../core/modals/profile-modal/profile-modal.module";
import { UserPermissionsState } from "../../core/abstractions/user-permissions.state";


@NgModule({
    exports: [TopbarComponent],
    declarations: [TopbarComponent],
    imports: [
        SharedModule,
        AvatarModule,
        SidebarModule,
        ProfileModalModule,
    ],
    providers: [
        UserPermissionsState,
    ]
})
export class TopbarModule {}
