import { NgModule } from "@angular/core";
import { SidebarComponent } from "./sidebar.component";
import { SidebarModule as PrimeNgSidebarModule } from 'primeng/sidebar';
import { SharedModule } from "../../core/shared/shared.module";
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { StyleClassModule } from 'primeng/styleclass';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from "@angular/router";
import { UserState } from "../../core/abstractions/user.state";


@NgModule({
    exports: [SidebarComponent],
    declarations: [SidebarComponent],
    imports: [
        PrimeNgSidebarModule, 
        SharedModule,
        AvatarModule,
        AvatarGroupModule,
        StyleClassModule,
        RippleModule,
        RouterModule
    ],
    providers: [UserState]
})
export class SidebarModule {}
