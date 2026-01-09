class HelperFunctions {

    static startOfDay(date: string) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    static endOfDay(date: string) {
        const d = new Date(date);
        d.setHours(23, 59, 59, 999);
        return d;
    }

}
export default HelperFunctions;
