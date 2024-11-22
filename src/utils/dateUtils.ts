import { format } from 'date-fns';

export const isDateExpired = (dateStr: string): boolean => {
    const inputDate = new Date(dateStr);
    const currentDate = new Date();
    return inputDate < currentDate;
}

export const getOffsetDateTime = (offset = 0) => {
    const offsetDateTime = offset + +new Date();
    return format(offsetDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX");
}