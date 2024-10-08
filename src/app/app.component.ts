import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatService } from './chat.service';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { LoginComponent } from './login/login.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'socket';

//   newMessage = '';
//   messageList: string[] = [];
// message: any;

//   constructor(private chatService: ChatService){

//   }

//   ngOnInit(){
//     this.chatService.getNewMessage().subscribe((message: string) => {
//       this.messageList.push(message);
//     })
//   }

//   sendMessage() {
//     this.chatService.sendMessage(this.newMessage);
//     this.newMessage = '';
//   }
}