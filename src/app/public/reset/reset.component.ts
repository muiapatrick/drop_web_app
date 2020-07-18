import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_providers/services/auth.service';
import { LocalStoreService } from 'src/app/_providers/services/local-store.service';
import { UserService } from 'src/app/_providers/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Rawtoken } from 'src/app/_models/rawtoken';
import { passwordValidator, confirmPasswordValidator, confirmConfirmPasswordValidator } from 'src/app/_providers/validators/validators';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  loading: boolean;
  success: boolean;
  resetPwdForm: FormGroup;
  resetToken: string;

  constructor(private _router: Router, private _route: ActivatedRoute, private _formBuilder: FormBuilder, private _ls: LocalStoreService,
    private _authService: AuthService, private _userService: UserService, private _toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (!this._authService.authenticated) {
      this.resetToken = this._route.snapshot.queryParamMap.get('token');
      this._ls.clearLocalStorage();
      this._authService.authenticateApp().subscribe((token: Rawtoken) =>{
        // this._authService.authenticated = true;
        this._ls.setItem('access_token', token);
        this.confirmToken();
      }); 
    }
    this.resetPwdForm = this._formBuilder.group({
      'password': [null, Validators.compose([Validators.required, passwordValidator, confirmConfirmPasswordValidator])],
      'confirmPassword': [null, Validators.compose([Validators.required,  confirmPasswordValidator])]
    });
  }

  confirmToken() {
    this._userService.confirmToken(this.resetToken).subscribe(res => {
        this._ls.clearLocalStorage();
      },
      error => {
        this._ls.clearLocalStorage();
        this._toastr.error("Email link has expired or may be already used before. kindly use forgot password to receive new reset link.");
        this._router.navigate(['/login']);
      });
  }



  isTouched(inputName: string) : boolean {
    return this.resetPwdForm.controls[inputName].touched;
  }

  isInvalid(inputName: string, error: string): boolean {
    return this.resetPwdForm.controls[inputName].hasError(error);
  }

  get isPasswordInvalid() {
    return (this.isInvalid('password', 'required') || this.isInvalid('password', 'weak')) && this.isTouched('password');
  }

  get isNewPasswordRequired() {
    return this.isInvalid('password', 'required');
  }

  get isNewPasswordWeak() {
    return this.isInvalid('password', 'weak') && !this.isNewPasswordRequired;
  }

  get isConfirmPasswordInvalid() {
    return (this.isInvalid('confirmPassword', 'required') || this.isInvalid('confirmPassword', 'notmatch')) && this.isTouched('confirmPassword');
  }

  get isConfirmPasswordRequired() {
    return this.isInvalid('confirmPassword', 'required');
  }

  public get isPasswordNotMatch() {
    return (this.isInvalid('confirmPassword', 'notmatch')) && !this.isConfirmPasswordRequired;
  }

  resetPassword() {
    this.loading = true;
    if (!this._authService.authenticated) {
      this._ls.clearLocalStorage();
      this._authService.authenticateApp().subscribe((token: Rawtoken) =>{
        // this._authService.authenticated = true;
        this._ls.setItem('access_token', token);
        this.resetNowByToken();
      });
    }
    else{
      this.resetNow();
    }
  }

  resetNowByToken() {
    const credentials = {
      password: this.resetPwdForm.controls['password'].value,
      token: this.resetToken
    };

    console.log(credentials);

    this._userService.resetPasswordByToken(credentials)
      .subscribe(res => {
        this.success = true;
        this._ls.clearLocalStorage(); 
        this.loading = false;   
        this._toastr.success(res.api_code_description); 
        this._router.navigate(['/login']);   
      },
      error => {
        this._toastr.error(error.error.api_code_description);
        this.loading = false;
        this.resetPwdForm.reset();
      });
  }

  resetNow() {
    const credentials = {
      password: this.resetPwdForm.controls['password'].value,
    };

    console.log(credentials);

    this._userService.resetPassword(credentials)
      .subscribe(res => {
        this.success = true;
        this._ls.clearLocalStorage(); 
        this.loading = false;   
        this._toastr.success(res.api_code_description); 
        this._router.navigate(['/login']);   
      },
      error => {
        this._toastr.error(error.error.api_code_description);
        this.loading = false;
        this.resetPwdForm.reset();
      });
  }
}
