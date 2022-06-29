const socket = io('/')
const videoGrid = document.getElementById('video-grid');

const myPeer = new Peer(undefined, {
  // path: '/',
  host: '/',
  port: '8001'
})

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {}

let myVideoStream;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);


  // answer the incoming user call
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

socket.on('user-disconnected', userId => {
  if(peers[userId]){
    peers[userId].close()
  }
})

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
    peers[userId] = call;
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video)
}




let msg = $('input')

// using jQuery to send message
$('html').keydown((e) => {
  // on press of ENTER KEY send message
  // clear the message as soon as ENTER is pressed
  if(e.which == 13 && msg.val().length !== 0) {
    console.log(msg.val())
    socket.emit('message', msg.val());
    msg.val('')
  }
});

// receive message from server
socket.on('createMessage', message => {
  console.log('this is another message', message)
  $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`);
  // scrollMessages()
})
 
// const scrollMessages = () => {
//   var d = $('.main__chat_window');
//   d.scrollMessages(d.prop("scrollHeight"))
// }

// Mute Our Video
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if(enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  }
  else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML=html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML=html;
} 

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if(enabled) {
    myVideoStream.getVideoTracks()[0].enabled=false;
    setPlayVideo()
  }
  else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled=true;
  }
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector(".main__video_button").innerHTML=html;
}

const setPlayVideo = () => {
  const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector(".main__video_button").innerHTML=html;
}