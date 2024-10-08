import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../data.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private dataService: DataService,private router:Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
   /**
   * @desc Handles form submission when the user clicks the login button.
   *       It checks if the form is valid, and if so, calls the DataService to log in the user.
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  onSubmit() {
    if (this.loginForm.valid) {
      this.dataService.loginUser(this.loginForm.value).subscribe(
        (registerResponse: any) => {
          console.log('Register Response:', registerResponse);
          this.router.navigate(['/dashboard']);
          localStorage.setItem('id',registerResponse.user._id);
          localStorage.setItem('username',registerResponse.user.username);

        },
        (error: any) => {
          console.log('Registration Error:', error);     
              
        }
      );
    } else {
    
      console.error('Form is invalid');
    }

    console.log('User Data:', this.loginForm.value);
  }
}

