import { Component, ElementRef, ViewChild, HostListener, Input, OnInit, AfterViewChecked } from '@angular/core';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']  // Fixed the styleUrl to style**s**Url
})
export class MessageBoxComponent  {
  messageList: any = [];
  message: any;
  newMessage: string = '';
  selectedUser: any; 
  currentUserId: any; 
  currentUserName:String | null=localStorage.getItem("username"); 
  socket = io('http://localhost:3000');
  isCallOfferReceived: boolean = false;
  currentReceiverId: any;
  flag:boolean=false;
  mess:string='';
  // @ViewChild('messagesContainer') private messagesContainer!: ElementRef; // Get reference to the message container

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('localVideo') localVideo!: ElementRef; // Reference for local video
  @ViewChild('remoteVideo') remoteVideo!: ElementRef; // Reference for remote video
  peerConnection: RTCPeerConnection | null = null; // WebRTC peer connection
  isCallActive: boolean = false; // Call status

  constructor(private dataService: DataService) {}
    /**
   * @desc This function initializes the component, sets the current user ID and receiver ID from localStorage, and subscribes to selected users and new messages.
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  ngOnInit(): void {
    this.currentUserId = localStorage.getItem('id');
    this.currentReceiverId = localStorage.getItem('reciverId');
    
    this.dataService.getselectedUsers().subscribe((user: any) => {
      
      if (user) {
        this.flag=true;
        console.log('Selected User:', user);
        this.selectedUser = user;

        this.dataService.getMessagesUsingReciverid(this.selectedUser._id, this.currentUserId).subscribe(data => {
          if (data) {
            this.messageList = data?.data;
            console.log('Received data:', data);
            this.scrollToBottom();  // Scroll to bottom after loading messages
          }
        });
      }
     
    });

    this.dataService.getNewMessage().subscribe((messages: any) => {
       this.mess=messages.message;
      if (messages) {
        this.getNotification()
        console.log('New message:', messages);
        if (messages.senderId == this.selectedUser._id) {
          this.messageList.push(messages);
          this.scrollToBottom();  // Scroll to bottom after receiving a new message
        }
      }
    });

    
    //  this.abc()
    // Socket events for video call signaling
    // this.socket.on('offer', (offer: RTCSessionDescriptionInit) => {
    //   this.handleOffer(offer);
    // });
    // this.dataService.getNewMessage().subscribe((messages: any) => {
// Listening for ICE candidate
// this.socket.on('ice-candidate', (data) => {
//   console.log('Received ICE candidate from socket:', data);
//   this.handleNewICECandidate(data.candidate);
// });
  }

  async getNotification() {
    const permission = await Notification.requestPermission();
    console.log('permissionnn', permission)
    if (permission === 'granted') {
      const notification = new Notification('title', {
        // icon: icon,
        body: this.mess,
      });

      notification.onclick = () => {
        window.open('http://localhost:4200/dashboard');
      };
    }
  }

  abc(){
    let socket = io('http://localhost:3000',{
      query: {
        userId: localStorage.getItem('id')
      }
    });
    
    this.socket.on('offer', (data: { offer: RTCSessionDescriptionInit, receiverid: string }) => {
      this.currentReceiverId = data.receiverid;
     
      this.handleOffer(data.offer);
      console.log('data.offer==================', data.offer)
    });
   
    this.socket.on('answer', (data: { answer: RTCSessionDescriptionInit; receiverid: string }) => {
      // Adjust this line to get the receiverId if needed
      this.currentReceiverId = data.receiverid; // Optional: if you want to keep track of receiverId
      this.handleAnswer(data.answer); // Pass the answer to handleAnswer method
      console.log('data.answer===================', data.answer)
    });
    
    this.socket.on('ice-candidate', (data: { candidate: RTCIceCandidateInit; receiverid: string }) => {
      // Optional: if you want to keep track of receiverId
      console.log('Received ICE candidate from socket:', data);
      this.currentReceiverId = data.receiverid; 
      this.handleNewICECandidate(data.candidate); // Pass the candidate to handleNewICECandidate method
      console.log('data.candidate===============', data.candidate)
    });
  }
 /**
   * @desc This function is called after the view has been checked. It ensures the message list is scrolled to the bottom.
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  // ngAfterViewChecked() {
  //   // this.scrollToBottom(); // Scroll after every view check to ensure it's at the bottom
  // }
   /**
   * @desc This function scrolls the message container to the bottom.
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  public scrollToBottom(): void {
    // try {
    //   setTimeout(() => {
    //     this.messagesContainer.nativeElement.scrollToBottom = this.messagesContainer.nativeElement.scrollHeight;
    //   }, 100);  // Delay the scrolling by 100ms to ensure DOM is updated
    // } catch (err) {
    //   console.error('Error scrolling to bottom:', err);
    // }
    setTimeout(() => {
      let scrollDiv = document.getElementById('scrollContent')
      if(scrollDiv){
        console.log('scrollDiv', scrollDiv)
        scrollDiv.scrollTo({
          top: scrollDiv.scrollHeight,
          // behavior: 'smooth'
        })
      }
    }, 500);
  }

   // Function to accept the call offer
   acceptCall() {
    this.isCallOfferReceived = false; // Hide the modal
    this.startCall(); // Start the call after accepting
  }

  // Function to decline the call offer
  declineCall() {
    this.isCallOfferReceived = false; // Hide the modal
    this.socket.emit('call-declined', { receiverId: this.currentReceiverId }); // Inform sender
  }
// ============================================================================= call from sender side
// Handles video/audio call initiation
async startCall() {
  this.isCallActive = true;
  this.peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // STUN server
  });

  // Get user media (audio and video)
  const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  this.localVideo.nativeElement.srcObject = localStream;

  // Add local stream to peer connection
  localStream.getTracks().forEach(track => this.peerConnection!.addTrack(track, localStream));

  // Create offer
  let offer = await this.peerConnection.createOffer();
  await this.peerConnection.setLocalDescription(offer);
  console.log('offer---', offer)
  // offer={...offer,'receiverid':this.currentReceiverId}
  // this.socket.emit('offer', offer);
  const offerPayload = { 
   
    offer: offer, 
    receiverid: this.currentReceiverId 
  };
  console.log('offerPayload---------------', offerPayload)
  this.socket.emit('offer', offerPayload);

  // Handle remote stream
  this.peerConnection.ontrack = (event) => {
    this.remoteVideo.nativeElement.srcObject = event.streams[0];
  };

  // ICE candidate handling
  this.peerConnection.onicecandidate = (event) => {
    if (event.candidate && this.peerConnection) {
      console.log('Sending ICE candidate:', event.candidate);
      this.socket.emit('ice-candidate', { candidate: event.candidate, receiverId: this.currentReceiverId });
    }
  };
}
// ===========================================================================================receiver side call handel
// Handles incoming offers reseiver side 
private async handleOffer(offer: RTCSessionDescriptionInit) {
  console.log('offer===========', offer)
  this.peerConnection = new RTCPeerConnection({

    iceServers: [{ urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
    ] // STUN server
  });

  await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  // Get user media
  // const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  // .catch((error) => {
  //   console.error('Error accessing media devices:', error);
  //   alert('Please allow camera and microphone access.');
  // })
  ;
  this.localVideo.nativeElement.srcObject = localStream;
  localStream.getTracks().forEach(track => this.peerConnection!.addTrack(track, localStream));
  
  

  // Create answer
  let answer = await this.peerConnection.createAnswer();
  await this.peerConnection.setLocalDescription(answer);
  
  // answer =  {...answer, "recieverID": this.currentReceiverId};

  const answerPayload = {
    answer: answer,
    receiverId: this.currentReceiverId // Include receiverId
  };
  this.socket.emit('answer', answerPayload);

  this.peerConnection.ontrack = (event) => {
    this.remoteVideo.nativeElement.srcObject = event.streams[0];
  };

  this.peerConnection.onicecandidate = (event) => {
   
    if (event.candidate) {
      console.log('event.candidate+++', event.candidate)

      this.socket.emit('ice-candidate', { candidate: event.candidate, receiverId: this.currentReceiverId });
    }
  };
}

// ===================================================================sender side answer handel
// Handles incoming answers
private async handleAnswer(answer: RTCSessionDescriptionInit) {
  if (this.peerConnection) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }
}

// Handles new ICE candidates
// private async handleNewICECandidate(candidate: RTCIceCandidateInit) {
//   console.log('Received ICE candidate:------', candidate);
//   if (this.peerConnection) {
//     await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//   }
// }



// ================================================================================== handel:===Make sure both sides are correctly adding the ICE candidates.
private async handleNewICECandidate(candidate: RTCIceCandidateInit) {
  console.log('Received ICE candidate:', candidate);
  if (this.peerConnection) {
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      .then(() => console.log('ICE candidate added successfully'))
      .catch(error => console.error('Error adding ICE candidate:', error));
  }
}

  /**
   * @desc This function is triggered when the Enter key is pressed to send a message.
   * @param event : KeyboardEvent
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  onKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 13) {  // Enter key
      this.sendMessage();
    }
  }
 /**
   * @desc This function sends a new message and emits the message data via the Socket.IO client.
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  sendMessage() {
    let datatToSend = {
      receieverId: this.selectedUser._id,
      senderId: localStorage.getItem('id'),
      message: this.newMessage
    };

    this.messageList.push(datatToSend);
    this.socket.emit('message', datatToSend);
    this.newMessage = '';
    this.scrollToBottom();  // Scroll to bottom after sending the message
  }

  // dataStore() {
  //   const senderId = localStorage.getItem('id');
  //   const reciverId = localStorage.getItem('reciverId');
  //   this.dataService.sendreciverId(this.newMessage, senderId, reciverId)?.subscribe(
  //     (res: any) => {},
  //     (error: any) => {
  //       console.error('Error storing data:', error);
  //     }
  //   );
  // }

  endCall() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
      this.isCallActive = false;
      this.localVideo.nativeElement.srcObject = null;
      this.remoteVideo.nativeElement.srcObject = null;
    }
  }

}