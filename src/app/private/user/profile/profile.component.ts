import { Component, OnInit } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { getShopByShopNo, hasRoleForShop } from 'src/app/_providers/validators/validators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MDBModalService } from 'ng-uikit-pro-standard';
import { UserService } from 'src/app/_providers/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/_models/user';
import { Role } from 'src/app/_models/role';
import { Shop } from 'src/app/_models/shop';
import { Page } from 'src/app/_models/page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  modalRef: any;
  userInfoForm: FormGroup;
  loading: boolean;
  page: Page = new Page();
  userNumber: string;
  shopNumber: string;
  user: User = new User();  
  shop: Shop = null;
  roleList: Role[] = [];
  hasShopAdminRole: boolean;
  isUserProfile: boolean;

  constructor(private _formBuilder: FormBuilder, private _route: ActivatedRoute, private _router: Router,
    private _modalService: MDBModalService,
    private _userService: UserService) { }

  ngOnInit(): void {
    this.userNumber = this._route.snapshot.paramMap.get('user_id');
    this.shopNumber = this._route.snapshot.paramMap.get('id');
    let pathname = window.location.pathname.split("/").pop();

    this.userInfoForm = this._formBuilder.group({
      first_name: '',
      last_name: '',
      other_name: '',
      active_user: '',
      phone_number: '',
      email_address: ''
    });

    if(pathname == 'profile') {
      this.isUserProfile = true;
      this.user = this._userService.getAuthenticatedUser();
      this.roleList = [];
      
      //load user roles
      this.user.roles.forEach(role => {
        if(role.shop_id == null || role.shop_id == undefined){
          this.roleList.push({id: role.id, name: role.name, description: role.description});
          this.roleList.slice();
        }
      });

      console.log(this.user.shops)
      //load user shop roles
      this.user.shops.forEach(s => {
        console.log("SHOP ID : "+s.id)
        this.user.roles.forEach(r => {
          console.log("ROLE SHOP ID : "+r.shop_id)

          if(s.id == r.shop_id) {
            this.roleList.push({id: r.id, name: r.name, description: r.description, shop_name: s.shop_name});
            this.roleList.slice();
          }
        });
      });
    }
    else if(this.userNumber == null || this.userNumber == undefined) {
      this._router.navigate(['/drop/shops']);
    }
    else {
      this.getUserDetails();
      this._modalService.closed.subscribe(() => this.getUserDetails());
    }
  }

  getUserDetails() {
    this.roleList = [];
    this.loading = true;
    this._userService.getUsers((this.page.pageNumber).toString(), '1', null, null, null, null, null, null, this.userNumber)
      .subscribe(res => {
        console.log(res);
        this.user = res.data[0];
        console.log(this.user);
        this.shop = getShopByShopNo(this.user.shops, this.shopNumber);
        this.hasShopAdminRole = hasRoleForShop(this.user.roles, 3, this.shop.id);

        //set user shop
        console.log(this.user.shops);
        if(this.shopNumber != null && this.shopNumber != undefined) {
          this.user.shops.forEach(s => {
            if(s.shop_number == this.shopNumber) {
              this.shop = s;
            }
          });
        }

        //load user roles
        this.user.roles.forEach(role => {
          if(role.shop_id == this.shop.id){
            this.roleList.push({id: role.id, name: role.name, description: role.description});
            this.roleList.slice();
          }
        });

        this.loading = false;
      },
      error => {
        this.loading = false;
    });
  }

  openEditUserModal() {
    this.modalRef = this._modalService.show(UserFormComponent, 
      {
        backdrop: true, 
        ignoreBackdropClick: true,
        class: 'modal-lg',
        data: {
          isEdit: true,
          user: this.user,
          userShop: this.shop
        }
      }
    );
  }

  resetPassword() {
    this.modalRef = this._modalService.show(ResetPasswordComponent, 
      {
        backdrop: true, 
        ignoreBackdropClick: true,
        class: 'modal-md',
        data: {
          // isEdit: true,
          // user: this.user,
          // userShop: this.shop
        }
      }
    );
  }

}
