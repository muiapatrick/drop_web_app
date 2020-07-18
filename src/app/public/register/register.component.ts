import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_providers/services/auth.service';
import { error } from 'protractor';
import { UserService } from 'src/app/_providers/services/user.service';
import { LocalStoreService } from 'src/app/_providers/services/local-store.service';
import { Rawtoken } from 'src/app/_models/rawtoken';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { checkValidPhone, checkNoWhiteSpace } from 'src/app/_providers/validators/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('signupSuccessModal', {static: false}) signupSuccessfuleModal: ModalDirective;
  loading: boolean;
  signedup: boolean;
  signupForm: FormGroup;
  phoneNumber: string;
  emailAddress: string;

  constructor(private _router: Router, private _formBuilder: FormBuilder, private _authService: AuthService,
      private _userService: UserService, private _ls : LocalStoreService, private _toastr: ToastrService) { 
    this.signupForm = _formBuilder.group({
      'first_name' : ['', Validators.compose([Validators.required, checkNoWhiteSpace,  Validators.maxLength(255)])],
      'last_name' : [null, Validators.compose([Validators.required, checkNoWhiteSpace,  Validators.maxLength(255)])],
      'other_name' : [null],
      'phone_number' : [null, Validators.compose([Validators.required, checkValidPhone, Validators.maxLength(255)])],
      'email_address' : [null, Validators.compose([Validators.required, checkNoWhiteSpace, Validators.email, Validators.maxLength(255)])],
      'identity_number' : [null, Validators.compose([Validators.required, checkNoWhiteSpace, Validators.minLength(5), Validators.maxLength(255)])],
    });
  }

  ngOnInit(): void {
  }

  isTouched(inputName: string) : boolean {
    return this.signupForm.controls[inputName].touched;
  }

  isInvalid(inputName: string, error: string): boolean {
    return this.signupForm.controls[inputName].hasError(error);
  }

  get isInvalidFirstName() {
    return (this.isInvalid('first_name', 'required') || this.isInvalid('first_name', 'hasWhiteSpace')) && this.isTouched('first_name');
  }

  get isInvalidLastName() {
    return (this.isInvalid('last_name', 'required') || this.isInvalid('last_name', 'hasWhiteSpace')) && this.isTouched('last_name');
  }

  get isInvalidPhoneNo() {
    return (this.isInvalid('phone_number', 'required') || this.isInvalid('phone_number', 'invalidPhone')) && this.isTouched('phone_number');
  }

  get isInvalidEmail() {
    return (this.isInvalid('email_address', 'required') || this.isInvalid('email_address', 'email'))  && this.isTouched('email_address');
  }

  get isInvalidIdNo() {
    return (this.isInvalid('identity_number', 'required') || this.isInvalid('identity_number', 'hasWhiteSpace')) && this.isTouched('identity_number');
  }

  signup() {
    console.log("Sigining up");
    this.loading = true;
    this._ls.clearLocalStorage();

    //authenticate first
    this._authService.authenticateApp().subscribe((token: Rawtoken) =>{
      console.log('ACCESS TOKEN : '+token.access_token);
      this._authService.authenticated = true;
      this._ls.setItem('access_token', token);
      //send the registration data
      this.sendSignupData();
    });
  }

  sendSignupData() {
    console.log("Posting signup data : ");
    this._userService.register(this.signupForm.value)
      .subscribe(res => {
        this.signedup = true;
        this.emailAddress = this.signupForm.controls['email_address'].value;
        this.phoneNumber = this.signupForm.controls['phone_number'].value;
        this._ls.clearLocalStorage();  
        this.loading = false;      
      },
      error => {
        if (error.status == 400) {
          this._toastr.error("Invalid Request Parameters not permitted");
        }
        if (error.status == 409) {
          this._toastr.error(error.error.api_code_description);
        }
        console.log(error);
        this.loading = false;
      });
  }
}
