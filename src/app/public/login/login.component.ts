import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_providers/services/auth.service';
import { LocalStoreService } from 'src/app/_providers/services/local-store.service';
import { UserService } from 'src/app/_providers/services/user.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading: boolean;
  user: User;

  loginForm: FormGroup;
  basicInfoForm : FormGroup;

  constructor(private _router: Router, private _formBuilder: FormBuilder,
    private _authService: AuthService, private _localStoreServie: LocalStoreService,
    private _userService: UserService) {
    this.loginForm = this._formBuilder.group({
      'username' : ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      'password' : ['', Validators.compose([Validators.required, Validators.maxLength(255)])]
    });
    this.basicInfoForm = _formBuilder.group({});
    
   }

  ngOnInit(): void {
    this.loginForm.reset();
  }
  
  isTouched(inputName: string) : boolean {
    return this.loginForm.controls[inputName].touched;
  }

  isInvalid(inputName: string, error: string): boolean {
    return this.loginForm.controls[inputName].hasError(error);
  }

  get isInvalidUsername() {
    return (this.isInvalid('username', 'required') && this.isTouched('username'));
  }

  get isInvalidPassword() {
    return (this.isInvalid('password', 'required') && this.isTouched('password'));
  }

  login() {
    console.log("Loggin in..........");
      this.loading = true;
      this._authService.login(this.loginForm.value)
        .subscribe(res => {
          this.loading = false;
          this._authService.authenticated = true;
          this._localStoreServie.setItem('access_token', res);

          this.user = this._userService.getAuthenticatedUser();
          console.log(this.user);
          console.log(this.user.reset_password);

          // this._router.navigate([this.user.reset_password ? '/reset' : 'drop']);
          this._router.navigate([this.user.reset_password ? '/reset' : 'drop']);
        },
        error => {
          console.log("Eroor : "+error);
          this.loading = false;
      });
  }

}
