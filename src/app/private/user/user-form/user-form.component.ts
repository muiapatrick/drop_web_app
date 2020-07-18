import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from 'src/app/_models/role';
import { UserService } from 'src/app/_providers/services/user.service';
import { User } from 'src/app/_models/user';
import { Shop } from 'src/app/_models/shop';
import { ShopService } from 'src/app/_providers/services/shop.service';
import { ShopOperator } from 'src/app/_models/shop-operator';
import { ToastrService } from 'ngx-toastr';
import { checkNoWhiteSpace, checkValidPhone } from 'src/app/_providers/validators/validators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userDetailsForm: FormGroup;
  userShopRoles: Role[] = [];
  systemRoles: Role[] = [];
  roleList: Role[] = [];
  selectedValue = null;
  user: User;
  userShop: Shop = null;
  isEdit: boolean;
  userShopRoleIds: string[] = [];
  submitting: boolean;

  constructor(public modalRef: MDBModalRef, private _toastr: ToastrService, private _formBuilder: FormBuilder, private _userService: UserService, private _shopService: ShopService) { }

  ngOnInit(): void {
    this.userDetailsForm = this._formBuilder.group({
      first_name: ['', Validators.compose([Validators.required, checkNoWhiteSpace])],
      last_name: ['', Validators.compose([Validators.required, checkNoWhiteSpace])],
      other_name: '',
      email_address: ['', Validators.compose([Validators.required, checkNoWhiteSpace, Validators.email ])],
      phone_number: [null, Validators.compose([Validators.required, checkValidPhone ])],
      select_role: '',
      enabled: ''

    });
    this.userDetailsForm.controls['select_role'].setValue(null);
    
    if(this.user !== undefined && this.user != null) {
      this.userDetailsForm.controls['first_name'].setValue(this.user.first_name);
      this.userDetailsForm.controls['last_name'].setValue(this.user.last_name);
      this.userDetailsForm.controls['other_name'].setValue(this.user.other_name);
      this.userDetailsForm.controls['email_address'].setValue(this.user.email_address);
      this.userDetailsForm.controls['phone_number'].setValue(this.user.phone_number);
      this.userDetailsForm.controls['enabled'].setValue(this.user.enabled);

    }
    this.getSystemRoles();

  }

  isTouched(inputName: string) : boolean {
    return this.userDetailsForm.controls[inputName].touched;
  }

  isInvalid(inputName: string, error: string): boolean {
    return this.userDetailsForm.controls[inputName].hasError(error);
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

  getSystemRoles() {
    this.roleList = [];
    this.systemRoles = [];

    this._userService.getSystemRoles('2')
      .subscribe(res => {
        this.systemRoles = res.data.slice();
        console.log("SYSTEM ROLES ")
        console.log(this.systemRoles);

        this.roleList = res.data.slice();

        if(this.user !== undefined && this.user != null) {
          console.log("ALL USER ROLES")
          console.log(this.user.roles);

          this.applyUserRoles();
        } 
      },
      error => {
      });

  }

  applyUserRoles() {
    //filter roles for this shop
    this.user.roles.forEach(role => {
        if(role.shop_id == this.userShop.id){
          this.userShopRoleIds.push(role.id);
          this.userShopRoleIds.slice();
        }
    });

    console.log("SHOP USER ROLES")
    console.log(this.userShopRoleIds)
    
    this.userShopRoleIds.forEach(roleId => {
      let roleObj = null;
      this.systemRoles.find(
        (element, indexElement) => {
          if(element.id.toString() == roleId){
            roleObj = {id:indexElement, val:element};
          }
        }
      );

      if(roleObj != undefined || roleObj != null) {
        this.userShopRoles.push(roleObj.val);
        this.userShopRoles.sort((a, b) => (a.name > b.name) ? 1 : -1);
        this.systemRoles.splice(roleObj.id, 1);
        this.systemRoles = this.systemRoles.slice();
      }      
    });

    console.log("CURRENT USER SHOP ROLES TO DISPLAY ")
    console.log(this.userShopRoles);
    
  }

  onSelectRoleChange(){
    let selectedRole = this.userDetailsForm.get('select_role').value;

    if (selectedRole != undefined || selectedRole != null) {
      
      this.userShopRoles.push(selectedRole);
      this.userShopRoles.sort((a, b) => (a.name > b.name) ? 1 : -1);
      this.userShopRoles = this.userShopRoles.slice();
      const removeIndex = this.systemRoles.map((item) => item.id).indexOf(selectedRole.id);
      this.systemRoles.splice(removeIndex, 1);
      this.systemRoles = this.systemRoles.slice();
      this.userDetailsForm.get('select_role').patchValue([]);

      this.userShopRoleIds.push(selectedRole.id);
      this.userShopRoleIds.slice();

    }

    console.log("NEW USER ROLES  AFTER ADD :: ")
    console.log(this.userShopRoleIds);
  }

  deleteRole(role: any) {
    if(role != undefined || role != null) {
      const obj = this.roleList.find(o => o.id === role.id);
        this.systemRoles.push(obj);
        this.systemRoles = this.systemRoles.slice();
        this.systemRoles.sort((a, b) => (a.name > b.name) ? 1 : -1);
        const removeIndex = this.userShopRoles.map((item) => item.id).indexOf(role.id);
        this.userShopRoles.splice(removeIndex, 1);
        this.userShopRoles = this.userShopRoles.slice();

        const roleIdIndex = this.userShopRoleIds.map((item) => item).indexOf(role.id);
        this.userShopRoleIds.splice(roleIdIndex, 1);
        this.userShopRoleIds.slice();
    }
  }

  itemNumber(index: number) {
    return index + 1;
  }


  onStep1Next(e) {
    console.log(e);
  }

  updateUserDetails() {
    console.log("NEW USER ROLES ");
    console.log(this.userShopRoleIds);
    this.submitting = true;
    let operatorInfo: ShopOperator = {
      shop_id: this.userShop.id.toString(),
      is_active: this.userDetailsForm.get('enabled').value,
      first_name: this.userDetailsForm.get('first_name').value,
      last_name: this.userDetailsForm.get('last_name').value,
      other_name: this.userDetailsForm.get('other_name').value,
      phone_number: this.userDetailsForm.get('phone_number').value,
      email_address: this.userDetailsForm.get('email_address').value,
      roles: this.userShopRoleIds
    };

    if(this.isEdit) {
      this._userService.updateShopOperator(this.user.id.toString(), operatorInfo)
      .subscribe(res => {
        this._toastr.success("User Details updated successful", "SUCCESSFULL");
        this.submitting = false;
        this.userDetailsForm.reset();
        this.modalRef.hide();
      },error => {
          console.log(error)
          if (error.status == 400) {
            this._toastr.error("Invalid Request Parameters not permitted");
          }
          if (error.status == 409) {
            this._toastr.error(error.error.api_code_description);
          }
          console.log(error);
          this.submitting = false;
      });
    }
    else {
      console.log("CREATE NEW")
      this._userService.createShopOperator(operatorInfo)
        .subscribe(res => {
          this._toastr.success("Shop Operator added successful", "SUCCESSFULL");
          this.submitting = false;
          this.userDetailsForm.reset();
          this.modalRef.hide();
        },error => {
            console.log(error)
            if (error.status == 400) {
              this._toastr.error("Invalid Request Parameters not permitted");
            }
            if (error.status == 409) {
              this._toastr.error(error.error.api_code_description);
            }
            console.log(error);
            this.submitting = false;
      });
    }
  }

  closeModal() {
    this.modalRef.hide();
  }
}
