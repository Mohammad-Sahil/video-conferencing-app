const socket = io('/')
const videoGrid = document.getElementById('video-grid');

const myPeer = new Peer(undefined, {
  // path: '/',
  host: '/',
  port: '8001'
})

const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream);
  console.log('first code executed')
  myPeer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    console.log('this code executed')
  })

  socket.on('user-connected', userId => {
    // connectToNewUser(userId, stream)
    setTimeout(connectToNewUser,1000,userId,stream)
  })
})

// socket.on('user-disconnected', userId => {
//   connectToNewUser(userId, stream)
// })

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})


socket.on('user-connected', userId => {
  console.log('user conected to:  ', userId)
})

const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream);
    console.log(`${stream} and ${userId}`)
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      console.log('connectToNewUser','on','stream')
      addVideoStream(video, userVideoStream)
    });
    
    call.on('close', () => {
      video.remove()
    })
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video)
}