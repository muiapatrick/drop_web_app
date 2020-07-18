import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import { Dropitem } from 'src/app/_models/dropitem';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { checkNoWhiteSpace, checkValidPhone, checkAmount } from 'src/app/_providers/validators/validators';
import { ToastrService } from 'ngx-toastr';
import { DropService } from 'src/app/_providers/services/drop.service';

@Component({
  selector: 'app-drop-action',
  templateUrl: './drop-action.component.html',
  styleUrls: ['./drop-action.component.scss']
})
export class DropActionComponent implements OnInit {
  action: string = null;
  item: Dropitem = null;
  
  dropActionForm: FormGroup;
  is_paid: boolean;
  valid_release_number: boolean;
  item_payment_required: boolean;
  is_enough_amount: boolean = true;
  payment_required_msg: string = 'Payment Required before Item is released!!';
  amount_err_msg: string = 'Please enter valid amount';
  insufficient_wallet_balance: boolean;
  show_mpesa_instructions: boolean;
  insufficient_wallet_balance_msg: string = '';
  pay_mode: number;
  mpesa_phoneno: string;

  constructor(public modalRef: MDBModalRef, private _formBuilder: FormBuilder, private _toastr: ToastrService,
    private _dropService: DropService) { }

  ngOnInit(): void {
    console.log(this.action);
    console.log(this.item);

    this.dropActionForm = this._formBuilder.group({
      is_paid: '',
      paid_amount: '',
      payment_mode: '',
      mpesa_phone: '',
      release_number: '',
    });

    this.dropActionForm.get('is_paid').setValue(false);
    this.dropActionForm.get('payment_mode').setValue(1);
    if(this.action == 'release') {
      this.item_payment_required = this.item.payment_required;
      this.applyAcceptFrmControlValidators('release_number', [Validators.required, checkNoWhiteSpace]);
    }

    this.dropActionForm.controls['release_number'].valueChanges.subscribe((value) => {
      if(value == this.item.release_number) {
        this.valid_release_number = true;
      }
      else {
        this.valid_release_number = false;
      }
    });

    this.dropActionForm.controls['is_paid'].valueChanges.subscribe((state) => {
      this.is_paid = state == null || undefined ? false : state;
      if(this.is_paid) {
        this.applyAcceptFrmControlValidators('paid_amount', [Validators.required, checkNoWhiteSpace, checkAmount]);       
      }
      else {
        this.disableAcceptFrmControlValidators('paid_amount');
      }
    });

    this.dropActionForm.controls['paid_amount'].valueChanges.subscribe((amount) => {
      if(this.action == 'release' && amount != null && amount < this.item.total_cost_unpaid) {
        this.is_enough_amount = false;
        this.item_payment_required = true;
        this.payment_required_msg = 'Enough payment amount required';
        this.amount_err_msg = this.payment_required_msg;
      }
      else if(this.action == 'release' && amount != null && amount >= this.item.total_cost_unpaid) {
        this.is_enough_amount = true;
        this.item_payment_required = false;
        this.payment_required_msg = '';
        this.amount_err_msg = '';
      }
    });

    this.dropActionForm.controls['payment_mode'].valueChanges.subscribe((state) => {
      console.log(state);
      this.pay_mode = state == null || undefined ? 1 : state;
      if(this.pay_mode == 2) {
        //MPESA
        this.applyAcceptFrmControlValidators('mpesa_phone', [Validators.required, checkNoWhiteSpace, checkValidPhone]);
      }
      else {
        this.disableAcceptFrmControlValidators('mpesa_phone');
      }
    });

  }

  public isAcceptFormTouched(inputName: string): boolean {
    return this.dropActionForm.controls[inputName].touched;
  }

  public isAcceptFormInValid(inputName: string, error: string): boolean {
    return this.dropActionForm.controls[inputName].hasError(error);
  }

  get isInvalidAmount() {
    return (this.isAcceptFormInValid('paid_amount', 'required')  || this.isAcceptFormInValid('paid_amount', 'hasWhiteSpace') || this.isAcceptFormInValid('paid_amount', 'invalidAmount') || !this.is_enough_amount) && this.isAcceptFormTouched('paid_amount');
  }

  get isInvalidReleaseNumber() {
    return (this.isAcceptFormInValid('release_number', 'required')  || this.isAcceptFormInValid('release_number', 'hasWhiteSpace') || !this.valid_release_number) && this.isAcceptFormTouched('release_number');
  }

  get isInvalidPhoneNumber() {
    return (this.isAcceptFormInValid('mpesa_phone', 'required') || this.isAcceptFormInValid('mpesa_phone', 'hasWhiteSpace') || this.isAcceptFormInValid('mpesa_phone', 'invalidPhone')) && this.isAcceptFormTouched('mpesa_phone');
  }

  applyAcceptFrmControlValidators(field: string, validators: any[]) {
    this.dropActionForm.controls[field].setValidators(validators);
    this.dropActionForm.controls[field].updateValueAndValidity();
  }

  disableAcceptFrmControlValidators(field: string) {
    this.dropActionForm.controls[field].reset();
    this.dropActionForm.controls[field].markAsUntouched();
    this.dropActionForm.controls[field].clearValidators(); 
    this.dropActionForm.controls[field].updateValueAndValidity();
  }

  closeModal() {
    this.dropActionForm.reset();
    this.modalRef.hide();
  }

  updateItemStatus(status: string, statusAction: string) {
    console.log("STATUS :: "+status);
    console.log("PAYMNET REQUIRED :: "+this.item.payment_required)

    if(status == '3' && this.item.payment_required) {
      this.makePayment(statusAction);
    }
    else {
      let statusInfo = {
        status_id:status, 
        is_paid: this.dropActionForm.get('is_paid').value,
        amount_paid: this.dropActionForm.get('paid_amount').value
      };

      this._dropService.updateItemStatus(this.item.id.toString(), statusInfo)
          .subscribe(res => {
            this._toastr.success("Item "+ statusAction + " successful", "SUCCESSFULL");
            this.closeModal();          
            // window.location.reload();

          },error => {
            console.log("RES STATUS :: "+error.status);
              if (error.status == 400) {
                this._toastr.error("Invalid Request Parameters not permitted");
              }
              if (error.status == 409) {
                this._toastr.error(error.error.api_code_description);
              }
              console.log(error);
          });
      }
  }

  makePayment(statusAction: string) {
    //picking and payment required
    let payInfo = {
      amount: this.item.total_cost_unpaid.toString(), 
      payment_modeid: this.dropActionForm.get('payment_mode').value, 
      mpesa_phone: this.dropActionForm.get('mpesa_phone').value
    };

    this._dropService.payItem(this.item.id.toString(), payInfo)
    .subscribe(res => {
      this._toastr.success("Item "+ statusAction + " successful", "SUCCESSFULL");
      this.insufficient_wallet_balance = false;
      this.insufficient_wallet_balance_msg = '';

      if( this.dropActionForm.get('payment_mode').value == 2) {
        //MPESA
        this.show_mpesa_instructions = true;
        this.mpesa_phoneno = this.dropActionForm.get('mpesa_phone').value;
      } 
      else {
        this.show_mpesa_instructions = false;
        this.mpesa_phoneno = null;
        this.closeModal();
      }
    },error => {
        if (error.status == 400) {
          this._toastr.error("Invalid Request Parameters not permitted");
        }
        if (error.status == 409) {
          this._toastr.error(error.error.api_code_description);
        }
        if (error.status == 402) {
          this.insufficient_wallet_balance = true;
          this.insufficient_wallet_balance_msg = error.error.api_code_description;
          this._toastr.error(error.error.api_code_description);
        }
        console.log(error);
    });
  }
}
