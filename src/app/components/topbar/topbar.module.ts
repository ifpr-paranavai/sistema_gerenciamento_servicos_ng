import { NgModule } from "@angular/core";
import { AvatarModule } from 'primeng/avatar';
import { TopbarComponent } from "./topbar.component";
import { SharedModule } from "../../core/shared/shared.module";
import { SidebarModule } from "../sidebar/sidebar.module";


@NgModule({
    exports: [TopbarComponent],
    declarations: [TopbarComponent],
    imports: [
        SharedModule,
        AvatarModule,
        SidebarModule,
    ],
})
export class TopbarModule {}
