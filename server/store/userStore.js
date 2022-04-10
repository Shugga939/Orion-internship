
class userController {
  constructor() {
    this.id = '',
    this.allowRooms = []
  }

  getId () {
    return this.id
  }

  getAllowedRooms () {
    return this.allowRooms
  }

   setId (id) {
     this.id = id
   }

   setAllowedRooms (rooms) {
    this.allowRooms = rooms
  }
}

export default new userController ()