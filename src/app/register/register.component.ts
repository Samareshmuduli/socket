import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private dataService: DataService, private toastr: ToastrService) {}

  /**
   * @desc This function initializes the registration form with validation rules for username, password, and confirm password.
   * @Author - Samaresh
   * @date - Oct 07, 2024
   */
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { 
      validator: this.passwordMatchValidator 
    });
  }

  /**
   * @desc Custom validator to check if password and confirm password match.
   */
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
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
          this.toastr.success(registerResponse.message);
          this.router.navigate(['/login']);
        }, (error: any) => {
          console.log('Registration Error:', error);     
          this.toastr.error(error.error.message);    
        }
      );
    }
  }
}
