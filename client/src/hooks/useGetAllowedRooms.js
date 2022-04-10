import { useMemo } from "react"

function getLastMessage(array) {
  let lastMessage = array[0]
  console.log(lastMessage)
  const date = new Date (lastMessage.time)
  const dateOfLastMesssage = `${date.getDate() +'.'+date.getMonth()+'.'+date.getFullYear()}`
  return {text:lastMessage.message, date:dateOfLastMesssage, sender: lastMessage.username}
}

export const useGetAllowedRooms = (rooms, userRooms)=> useMemo(()=> {
  let arr = []
  rooms.forEach(room => {
    if(userRooms.includes(room.id)) {

      let lastMessage = getLastMessage(room.messages)
      arr.push({
        id:room.id, 
        name:room.name, 
        lastMessage:lastMessage.text, 
        date: lastMessage.date,
        sender: lastMessage.sender
      })
    }
  });
  // for (let room in rooms) {        //if rooms must be obj type
  //   if(userRooms.includes(rooms[room].id)) {
  //     arr.push({id:rooms[room].id, name:rooms[room].name})
  //   }
  // }
  return arr
},[rooms])
