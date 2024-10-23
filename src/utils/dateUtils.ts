export const isDateExpired = (dateStr: string): boolean => {
    const inputDate = new Date(dateStr);
    const currentDate = new Date();
    return inputDate < currentDate;
}

// Example usage:
// const dateStr = "2023-10-22"; // YYYY-MM-DD format
// console.log(isDateExpired(dateStr)); // Output: true or false