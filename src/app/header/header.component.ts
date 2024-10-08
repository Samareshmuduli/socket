import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] // Fixed typo here
})
export class HeaderComponent {
  constructor(private router: Router, private toastr: ToastrService) {}

  /**
   * @desc This function handles the logout functionality. 
   *       It clears all the data from localStorage and navigates the user to the login page.
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  logout() {
    localStorage.clear();
    // this.toastr.success('Logout Successful', 'Success'); // This should now work
    this.router.navigate(['/login']);
  }
}
