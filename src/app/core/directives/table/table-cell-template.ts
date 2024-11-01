import { Directive, TemplateRef } from "@angular/core";
/**
 * @usedBy TableComponent
 *
 * @description
 *
 * Esta diretiva permite que seja possível alterar o conteúdo das células de uma coluna,
 * para que os valores possam ser exibidos
 *
 * Em seu uso, deve-se apenas adicionar a diretiva **p-table-cell-template** à tag `ng-template`.
 *
 * Retorno:
 *  - `column`: valor da coluna.
 *  - `row`: valor da linha que é o objeto de dados passado para ele.
 *  - `rowFullData`: valor completo da linha.
 *
 * Modo de uso:
 *
 * <y-table
 *   [columns]="columns"
 *   [value]="items">
 *     <ng-template p-table-cell-template let-column="column" let-row="row">
 *      <div *ngIf="column.property === 'status'">
          <p-tag [severity]="row === 'ativo' ? 'success' : 'danger'" [value]="row" [rounded]="true"></p-tag>
        </div>
 *      <div *ngIf="column.property === 'status2'">Conteúdo do status 2</div>
 *      <div *ngIf="column.property === 'status3'">Conteúdo do status 3</div>
 *    </ng-template>
 *
 * Observação: Sempre adicionar o **type** da coluna que deseja manipular com a directiva como `cellTemplate`
 **/
@Directive({
  selector: "[appTableCellTemplate]",
})
export class TableCellTemplateDirective {
  // Necessário manter templateRef para o funcionamento do cell template.
  constructor(public templateRef: TemplateRef<unknown>) {}
}
