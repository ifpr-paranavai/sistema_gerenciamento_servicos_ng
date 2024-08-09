import { ChangeDetectionStrategy, Component, ViewChild, WritableSignal, signal } from "@angular/core";
import { Sidebar } from "primeng/sidebar";

@Component({
    selector: 'sgs-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
    @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    closeCallback(e: any): void {
        this.sidebarRef.close(e);
    }

    public sidebarVisible: WritableSignal<boolean> = signal(false);

}