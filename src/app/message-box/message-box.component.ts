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
  currentReceiverId: any;
  flag:boolean=false;
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef; // Get reference to the message container

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
      if (messages) {
        console.log('New message:', messages);
        if (messages.senderId == this.selectedUser._id) {
          this.messageList.push(messages);
          this.scrollToBottom();  // Scroll to bottom after receiving a new message
        }
      }
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
}
