
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder,private router:Router,private dataService:DataService) {}
   /**
   * @desc This function initializes the registration form with validation rules for username and password.
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  /**
   * @desc This function handles form submission, validates the form, and sends the data to the service to save the user.
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Form Submitted', this.registerForm.value);
      this.dataService.saveUser(this.registerForm.value).subscribe(
        (registerResponse: any) => {
          console.log('Register Response:', registerResponse);
          this.router.navigate(['login']);
        });
  }
}
}