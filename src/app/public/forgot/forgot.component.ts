import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStoreService } from 'src/app/_providers/services/local-store.service';
import { AuthService } from 'src/app/_providers/services/auth.service';
import { Rawtoken } from 'src/app/_models/rawtoken';
import { UserService } from 'src/app/_providers/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  loading: boolean;
  success: boolean;
  forgotPwdForm: FormGroup;
  nonWhitespaceRegExp: RegExp = new RegExp('\\S');

  constructor(private _router: Router, private _formBuilder: FormBuilder, private _ls: LocalStoreService,
    private _authService: AuthService, private _userService: UserService, private _toastr: ToastrService) {
    this.forgotPwdForm = _formBuilder.group({
      'username': ['', Validators.compose([Validators.required, Validators.pattern(this.nonWhitespaceRegExp)])]
    });
   }

  ngOnInit(): void {
  }

  isTouched(inputName: string) : boolean {
    return this.forgotPwdForm.controls[inputName].touched;
  }

  isInvalid(inputName: string, error: string): boolean {
    return this.forgotPwdForm.controls[inputName].hasError(error);
  }

  get isValidUsername() {
    return (this.isInvalid('username', 'required') || this.isInvalid('username', 'pattern')) && this.isTouched('username');
  }

  forgotPassword() {
    this.loading = true;
    this._ls.clearLocalStorage();

    //authenticate first
    this._authService.authenticateApp().subscribe((token: Rawtoken) =>{
      this._authService.authenticated = true;
      this._ls.setItem('access_token', token);
      //send the resert request
      this.sendRequestNow();
    });
  }

  sendRequestNow() {
    this._userService.forgotPassword(this.forgotPwdForm.controls['username'].value)
      .subscribe(res => {
        this.success = true;
        this._ls.clearLocalStorage(); 
        this.loading = false;       
      },
      error => {
        if (error.status == 400) {
          this._toastr.error("Invalid Request Parameters not permitted");
        }
        if (error.status == 404) {
          this._toastr.error(error.error.api_code_description);
        }
        this.loading = false;
      });
  }

  
}
