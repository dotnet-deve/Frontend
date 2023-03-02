import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { validateForms } from 'src/app/helpers/validateForms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';

  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService
  ) {}
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onSignup() {
    if (this.signupForm.valid) {
      //return data and add obj to database
      this.auth.signUp(this.signupForm.value).subscribe({
        next: (res) => {
          this.toast.success({detail:"SUCCESS", summary:res.message, duration: 3000});
          this.signupForm.reset();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toast.error({detail:"ERROR", summary:err?.error.message, duration:3000});
        },
      });
    } else {
      //throws an toastr error
      validateForms.validateAllFormFields(this.signupForm);
      this.toast.error({detail:"ERROR", summary:"form is invalid", duration:3000});
    }
  }
}
