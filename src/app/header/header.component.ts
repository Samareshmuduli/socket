import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router:Router){}
    /**
   * @desc This function handles the logout functionality. 
   *       It clears all the data from localStorage and navigates the user to the login page.
    * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
