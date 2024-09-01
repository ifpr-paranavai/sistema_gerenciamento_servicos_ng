import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, signal } from "@angular/core";

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: "sgs-services-list",
    templateUrl: "./services-list.component.html",
    styleUrls: ["./services-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesListComponent implements OnInit {
    products!: any[];

    cols!: Column[];

    constructor() { }

    ngOnInit() {
        this.products = [
            {
                id: '1000',
                description: 'Bamboo Watch',
                inventoryStatus: 'CONCLUÍDO',
                price: 65,
                rating: 5
            },
            {
                id: '1000',
                description: 'Bamboo Watch',
                inventoryStatus: 'CONCLUÍDO',
                price: 65,
                rating: 5
            },
            {
                id: '1000',
                description: 'Bamboo Watch',
                inventoryStatus: 'CONCLUÍDO',
                price: 65,
                rating: 5
            },
            {
                id: '1000',
                description: 'Bamboo Watch',
                inventoryStatus: 'CONCLUÍDO',
                price: 65,
                rating: 5
            },
        ];

        this.cols = [
            { field: 'description', header: 'Descrição' },
            { field: 'price', header: 'Valor' },
            { field: 'inventoryStatus', header: 'Status' },
            { field: 'rating', header: 'Avaliação' }
        ];
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'success';
        }
    }
}
