export class DateUtil {

    static formatDateToISO(date: Date | string): string {
        const parsedDate = typeof date === "string" ? new Date(date) : date;

        if (isNaN(parsedDate.getTime())) {
            return "Invalid date format. Use ISO format (YYYY-MM-DDTHH:mm:ss)";
        }

        return parsedDate.toISOString().split(".")[0];
    }
}
