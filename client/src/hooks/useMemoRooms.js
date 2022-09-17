import { useMemo } from "react"
import formatteDate from '../utils/helpers/formatteDates'

export const useMemoRooms = (rooms,searchValue)=> {
  let sortedRooms = useSortRooms(rooms)

  let sortedAndFoundRooms = useMemo(()=> {
  let arr = []

  sortedRooms.forEach(room => {
    if (room.lastMessage && room.name.toLowerCase().includes(searchValue.toLowerCase())) {
      arr.push({
        id:room.id,
        image: room.image,
        name:room.name, 
        messageText: room.lastMessage.message, 
        date: formatteDate(new Date (room.lastMessage.time)),
        sender: room.lastMessage.username
      })
    } else if (room.name.toLowerCase().includes(searchValue.toLowerCase())){
      arr.push({
        id:room.id, 
        image: room.image,
        name:room.name, 
        messageText: '', 
        date: '',
        sender: 'No messages yet',
        })
      }
    });

  return arr
  },[sortedRooms, searchValue])

  return sortedAndFoundRooms
}

const useSortRooms = (rooms)=> useMemo(()=> { 
  return rooms.sort((a,b)=> Number(b.lastMessage?.time)-Number(a.lastMessage?.time))
},[rooms])
