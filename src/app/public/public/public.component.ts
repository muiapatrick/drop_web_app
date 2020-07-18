import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {
  @ViewChild('staticTabs', {static: false}) staticTabs;
  @ViewChild('loginModal', {static: false}) loginModal;
  @ViewChild('signupModal', {static: false}) signupModal;
  

  public loginForm : FormGroup;
  public signupForm : FormGroup;

  constructor(private _router: Router, private _formBuilder: FormBuilder) { 
    this.loginForm = _formBuilder.group({
      'username' : ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      'password' : ['', Validators.compose([Validators.required, Validators.maxLength(255)])]
    });

    this.signupForm = _formBuilder.group({
      'first_name' : ['', Validators.compose([Validators.required,  Validators.maxLength(255)])],
      'last_name' : ['', Validators.compose([Validators.required,  Validators.maxLength(255)])],
      'other_name' : [''],
      'mobile_number' : ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      'email_address' : ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(255)])],
      'identity_number' : ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(255)])],
    });
  }

  ngOnInit() {
  }

  goHome() {
  }

  singIn() {
    console.log('Login In');
    this.loginForm.reset();
    this.loginModal.show();
    // this.goToLoginTab();
    // this._router.navigate(['login']);
  }

  signUp() {
    this.loginForm.reset();
    this.signupModal.show();
    // this.goToSignupTab();
  } 

  goToSignupTab() {
    this.staticTabs.setActiveTab(2);
  }

  goToLoginTab() {
    this.staticTabs.setActiveTab(1);
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

  get isInvalidFirstName() {
    return (this.isInvalid('password', 'required') && this.isTouched('password'));
  }

  get isInvalidLastName() {
    return (this.isInvalid('password', 'required') && this.isTouched('password'));
  }

  get isInvalidMobileNo() {
    return (this.isInvalid('password', 'required') && this.isTouched('password'));
  }

  get isInvalidEmail() {
    return (this.isInvalid('password', 'required') && this.isTouched('password'));
  }

  get isInvalidIdNo() {
    return (this.isInvalid('password', 'required') && this.isTouched('password'));
  }


}


