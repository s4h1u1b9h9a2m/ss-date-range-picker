export const getUTCDate = date => {
    let selectedDate = new Date(date)
    return Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
}