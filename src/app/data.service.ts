import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  private selectedUserSource = new Subject<string>();
  selectedUser$ = this.selectedUserSource.asObservable(); 
    /**
   * @desc Sends the selected user to other components by updating the Subject.
   * @param user :string - ID of the selected user
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  sendSelectedUser(user: string) {
    console.log("==============",user);
    // this.get(user).subscribe(
    //   (response:any) => {
    //     console.log("User data retrieved:", response);
    //     localStorage.setItem("reciverId",response._id)
      
    //   });
    this.selectedUserSource.next(user);
   
  }

  usersUrl='http://localhost:3000/users';
  Url="http://localhost:3000/message";
  constructor(private http:HttpClient) { }


  /**
   * @desc Logs in a user by sending a POST request to the server.
   * @param user :any - Login details (username, password)
   * @returns Observable containing the server response
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  loginUser(user:any): Observable<any> {
      
    console.log('user------ aaaa:', user);
      return this.http.post(`${this.usersUrl}/login`, user);
    }
    /**
   * @desc Registers a new user by sending a POST request to the server.
   * @param user :any - User details (username, password)
   * @returns Observable containing the server response
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
    saveUser(user:any): Observable<any> {
      
      console.log('user------ :', user);
        return this.http.post(`${this.usersUrl}/register`, user);
      }
   /**
   * @desc Retrieves a list of users by sending a POST request.
   * @param user :any - Current user ID to exclude from the list
   * @returns Observable containing the list of users
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */    
  getUsers(user: any, searchTerm: String | undefined): Observable<any>{
      console.log('user------11 :', {"_id" :user});

      return this.http.post(`${this.usersUrl}/getAllUsers`,{"_id" :user, searchTerm: searchTerm});
  }
   /**
   * @desc Sends a message to the server using Socket.IO.
   * @param message :any - The message to be sent
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  public sendMessage(message: any,) {
    console.log('sendMessage: ', message)
    let socket = io('http://localhost:3000',{
      query: {
        userId: localStorage.getItem('id')
      }
    });
    // let datatToSend = {
    //   name: 'Samaresh',
    //   message
    // }
    // socket.emit('message', datatToSend);
  }
  
  /**
   * @desc Listens for new messages from the server using Socket.IO.
   * @returns Observable emitting new messages
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  public getNewMessage = () => {
    console.log("logogogogog");
    
    let socket = io('http://localhost:3000',{
      query: {
        userId: localStorage.getItem('id')
      }
    });

    socket.on('message', (message) =>{
      console.log('messagesssssssssssssss', message)
      this.message$.next(message);
      console.log('hello recive',message)
    });

    return this.message$.asObservable();
  };
    /**
   * @desc Retrieves the selected user from the selectedUserSource Subject.
   * @returns Observable containing the selected user data
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  getselectedUsers(){
    return this.selectedUser$;
    // console.log("------",this.selectedUser$)
    // return this.http.post(`${this.usersUrl}getAUser`, this.selectedUser$);
  }  
  // get(user:any): Observable<any>{
  //   console.log(user,"gettt");
    
  //   localStorage.removeItem('reciverId')
  //   console.log("api",`${this.usersUrl}getAUser`)
  //       return this.http.post(`${this.usersUrl}getAUser`, {user});
  // }
  // sendreciverId(newMessage: string, senderId: string | null, reciverId: string | null){
  //   const data={newMessage,senderId,reciverId}
  //   console.log('data----', data)
  //   return this.http.post(`${this.Url}/getdata`,data);
  // }
   /**
   * @desc Retrieves messages between two users based on their sender and receiver IDs.
   * @param senderId :string | null - ID of the sender
   * @param reciverId :string | null - ID of the receiver
   * @returns Observable containing the message data
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  getMessagesUsingReciverid(senderId: string | null, reciverId: string | null): Observable<any>{
    const data={senderId,reciverId}
    // console.log('reciverId', reciverId)
  //  console.log("url route", `${this.Url}/showdata/${reciverId}`);
    return this.http.post(`${this.Url}/showdata`,data);
  }
}


