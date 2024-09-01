import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "cpfPipe",
})
export class CpfPipe implements PipeTransform {
    // eslint-disable-next-line
    transform(value: string, ...args: unknown[]): unknown {
        let valueFormated = value + "";

        valueFormated = valueFormated
            .padStart(11, "0")
            .substring(0, 11)
            .replace(/([^\d])+/gim, "")
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        return valueFormated;
    }
}
