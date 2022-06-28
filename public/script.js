const socket = io('/')
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '8001'
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})
// socket.emit('join-room', ROOM_ID, 6)

socket.on('user-connected', userId => {
  console.log('user conected to:  ', userId)
})