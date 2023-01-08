export default function formatteDate(date) {
  const formattedDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  const formattedMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  return `${formattedDay + '.' + formattedMonth + '.' + date.getFullYear()}`
}