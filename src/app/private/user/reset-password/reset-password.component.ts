import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import { passwordValidator, confirmConfirmPasswordValidator, confirmPasswordValidator } from 'src/app/_providers/validators/validators';
import { UserService } from 'src/app/_providers/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStoreService } from 'src/app/_providers/services/local-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPwdForm: FormGroup;
  loading: boolean;
  success: boolean;

  constructor(public modalRef: MDBModalRef, private _formBuilder: FormBuilder, private _userService: UserService,
    private _toastr: ToastrService, private _ls: LocalStoreService, private _router: Router) { }

  ngOnInit(): void {
    this.resetPwdForm = this._formBuilder.group({
      // current_password: ['', Validators.compose([Validators.required ])],
      password: ['', Validators.compose([Validators.required, passwordValidator, confirmConfirmPasswordValidator ])],
      confirmPassword: ['', Validators.compose([Validators.required,  confirmPasswordValidator ])]
    });

  }

  isTouched(inputName: string) : boolean {
    return this.resetPwdForm.controls[inputName].touched;
  }

  isInvalid(inputName: string, error: string): boolean {
    return this.resetPwdForm.controls[inputName].hasError(error);
  }

  // get isCurrentPwdInvalid() {
  //   return (this.isInvalid('current_password', 'required')) && this.isTouched('current_password');
  // }

  get isNewPasswordInvalid() {
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
        this.resetPwdForm.reset();
        this.modalRef.hide();
        this._router.navigate(['/login']);   
      },
      error => {
        this._toastr.error(error.error.api_code_description);
        this.loading = false;
        this.resetPwdForm.reset();
      });
  }

  closeModal() {
    this.modalRef.hide();
  }

}
