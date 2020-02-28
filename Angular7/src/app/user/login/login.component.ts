import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  logInFormModel: FormGroup;
  signInFormModel: FormGroup;

  constructor(public userService: UserService,
              private router: Router,
              private toasterService: ToastrService,
              private fb: FormBuilder,
              private elementRef: ElementRef) { }

  ngOnInit() {
    if (localStorage.getItem('token') != null) {
      this.router.navigateByUrl('/home');
     }
    this.createlogInForm();
    this.createSignInForm();
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.querySelector('.img__btn')
                                 .addEventListener('click', this.onClickSignInUp.bind(this));
  }

  onClickSignInUp() {
    this.elementRef.nativeElement.querySelector('.cont').classList.toggle('s--signup');
  }

  logIn() {
    const logInModel = {
      UserName: this.logInFormModel.value.userName,
      Password: this.logInFormModel.value.password
    };

    this.userService.logIn(logInModel).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        this.logInFormModel.reset();
        this.router.navigateByUrl('/home');
      });
  }

  signIn() {
    const signInModel = {
      UserName: this.signInFormModel.value.userName,
      Email: this.signInFormModel.value.email,
      FullName: this.signInFormModel.value.fullName,
      Password: this.signInFormModel.value.passwords.password,
      Confirmpassword: this.signInFormModel.value.passwords.confirmPassword
    };

    this.userService.register(signInModel).subscribe(
      (res: any) => {
        if (res.Succeeded) {
          this.toasterService.success('Registration successfully', 'Test Project;)');
          this.signInFormModel.reset();
          // TODO check redirect after registration!
          this.router.navigateByUrl('/home');
        }
      });
  }

  private createlogInForm(): void {
    this.logInFormModel = this.fb.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  private createSignInForm(): void {
    this.signInFormModel = this.fb.group({
      userName: ['', Validators.required],
      email: ['', Validators.email],
      fullName: [''],
      passwords: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required]
      }, {validator: this.userService.comparePasswords})
    });
  }
}
