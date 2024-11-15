import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ProfileModalComponent } from "../../core/modals/profile-modal/profile-modal.component";
import { UserPermissionsState } from "../../core/abstractions/user-permissions.state";
import { AuthenticationRequest } from "../../core/requests/authentication/authentication.request";
import { IFeature } from "../../core/interfaces/feature.interface";
import { FrontPermissionsConstants } from "../../core/constants/front-permissions.constants";

@Component({
    selector: 'sgs-topbar',
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent implements OnInit, OnDestroy {
    @ViewChild(ProfileModalComponent) profileModal?: ProfileModalComponent;
    userPermissions: string[] = [];
    frontPermissions = FrontPermissionsConstants;

    constructor(
        private userPermissionsState: UserPermissionsState,
        private authenticationRequest: AuthenticationRequest,
    ) { }

    ngOnInit(): void {
        this.recoverPermissions();
    }

    ngOnDestroy(): void {
        this.userPermissionsState.update(null);
    }

    recoverPermissions(): void {
        this.userPermissions = this.authenticationRequest.getUserFeatures().map((feature: IFeature) => feature.name);
        this.userPermissionsState.update(this.userPermissions);
    }

    openProfileModal(): void {
        if (!this.profileModal) throw new Error("Profile modal not found!");

        this.profileModal.openDialog();
    }
}
