import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-users',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css'] // Fixed the property name from styleUrl to styleUrls
})
export class ShowUsersComponent implements OnInit {
  currentUser: string | null = localStorage.getItem("username");
  users: any[] = [];
  selectedUser: any;
  user: any = localStorage.getItem("id");
  searchTerm: string | undefined;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // Fetch initial users with an empty search term
    this.fetchUsers();
  }

  /**
   * @desc This function fetches the list of users from the service based on the current search term and user ID.
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  fetchUsers(): void {
    this.dataService.getUsers(this.user, this.searchTerm).subscribe((data) => {
      console.log("Fetched users:", data);
      this.users = data;
    });
  }

  /**
   * @desc This function is called when the search term changes. It fetches the users based on the new search term.
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  onSearchChange(): void {
    this.fetchUsers(); 
  }

  /**
   * @desc This function is called when a user is selected. It stores the selected user's ID in localStorage and sends the selected user to the service.
   * @param data : any - The user data selected from the list
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  selectUser(data: any): void {
    localStorage.setItem("reciverId", data._id);
    this.selectedUser = data;
    console.log(this.selectedUser, "Selected user");
    this.dataService.sendSelectedUser(this.selectedUser);
    
    // Uncomment if you want to fetch messages for the selected user
    // this.dataService.getMessagesUsingReciverid(this.selectedUser._id).subscribe(
    //   data => {
    //     console.log('Received data:', data);
    //   }
    // );
  }
}
