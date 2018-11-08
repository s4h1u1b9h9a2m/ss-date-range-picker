const { DateTime } = require('luxon');
export const getUTCDate = date => {
    let selectedDate = new Date(date)
    return Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
}

export const getLocaleDateString = date => {
    return new Date(date).toLocaleDateString('sv-SE')
}

export const getLocaleDateStringDateMed = datets => {
    return DateTime.fromMillis(datets).toLocaleString(DateTime.DATE_MED)
}