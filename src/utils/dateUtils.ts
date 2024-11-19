export const isDateExpired = (dateStr: string): boolean => {
    const inputDate = new Date(dateStr);
    const currentDate = new Date();
    return inputDate < currentDate;
}