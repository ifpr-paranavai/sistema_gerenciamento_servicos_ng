// review.component.ts
import { ChangeDetectionStrategy, Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, EMPTY, take } from 'rxjs';
import { IAppointmentResponse } from '../../../core/interfaces/appointment-response.interface';
import { ToastService } from '../../../core/requests/toastr/toast.service';
import { AuthenticationRequest } from '../../../core/requests/authentication/authentication.request';
import { ReviewService } from '../../requests/review/review.request';

@Component({
    selector: 'sgs-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewComponent implements OnInit {
    @Input() appointment!: IAppointmentResponse;

    dialogVisible: WritableSignal<boolean> = signal(false);
    loading: WritableSignal<boolean> = signal(false);
    isClient: WritableSignal<boolean> = signal(false);
    currentRating: WritableSignal<number> = signal(0);

    reviewForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private reviewService: ReviewService,
        private toastService: ToastService,
        private authRequest: AuthenticationRequest
    ) {
        this.reviewForm = this.fb.group({
            rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
            comment: ['']
        });
    }

    ngOnInit() {
        this.isClient.set(this.authRequest.currentUserValue?.user.role?.role_type === 'client');
        this.currentRating.set(this.appointment.rating || 0);

        if (this.appointment.review) {
            this.reviewForm.patchValue({
                rating: this.appointment.review.rating,
                comment: this.appointment.review.comment
            });
        }
    }

    onRatingSelect(value: number): void {
        if (!this.isClient()) return;

        this.currentRating.set(value);
        this.reviewForm.patchValue({ rating: value });

        // Se já existe review, abre modal para edição
        if (this.appointment.review) {
            this.dialogVisible.set(true);
            return;
        }

        // Salva rating inicial
        this.saveInitialReview(value);
    }

    private saveInitialReview(rating: number) {
        if (this.loading()) return;

        this.loading.set(true);

        const reviewData = {
            appointment: this.appointment.id,
            rating: rating,
            comment: ''
        };

        this.reviewService.createReview(reviewData).pipe(
            take(1),
            catchError(error => {
                console.error('Error saving review:', error);
                this.toastService.error('Erro', 'Não foi possível salvar a avaliação');
                this.loading.set(false);
                return EMPTY;
            })
        ).subscribe({
            next: (response) => {
                this.toastService.success('Sucesso', 'Avaliação inicial salva com sucesso');
                this.dialogVisible.set(true);
                this.loading.set(false);
            }
        });
    }

    onSubmitReview() {
        if (this.loading() || this.reviewForm.invalid) return;

        this.loading.set(true);

        const reviewData = {
            rating: this.reviewForm.get('rating')?.value,
            comment: this.reviewForm.get('comment')?.value
        };

        const request$ = this.appointment.review
            ? this.reviewService.updateReview(this.appointment.review.id, reviewData)
            : this.reviewService.createReview({
                ...reviewData,
                appointment: this.appointment.id
            });

        request$.pipe(
            take(1),
            catchError(error => {
                console.error('Error with review:', error);
                this.toastService.error('Erro', 'Não foi possível salvar a avaliação');
                this.loading.set(false);
                return EMPTY;
            })
        ).subscribe({
            next: (response) => {
                this.currentRating.set(response.rating);
                this.dialogVisible.set(false);
                this.toastService.success('Sucesso', 'Avaliação salva com sucesso');
                this.loading.set(false);
            }
        });
    }

    closeDialog() {
        this.dialogVisible.set(false);
    }

    showDialog() {
        this.dialogVisible.set(true);
    }

    hideDialog() {
        this.dialogVisible.set(false);
    }

    onDialogVisibleChange(visible: boolean) {
        this.dialogVisible.set(visible);
    }
}