function formatteDate (date) {
  let formattedDay = date.getDate()<10? `0${date.getDate()}` : date.getDate()
  let formattedMonth = date.getMonth()+1<10? `0${date.getMonth()+1}` : date.getMonth()+1
  return `${formattedDay+'.'+formattedMonth+'.'+date.getFullYear()}`
}

export {formatteDate}