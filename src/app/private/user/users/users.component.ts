import { Component, OnInit } from '@angular/core';
import { Shop } from 'src/app/_models/shop';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from 'src/app/_providers/services/shop.service';
import { Page } from 'src/app/_models/page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_providers/services/user.service';
import { checkValidPhone, checkValidPhoneNumber } from 'src/app/_providers/validators/validators';
import { MDBModalService } from 'ng-uikit-pro-standard';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  modalRef: any;
  searchForm: FormGroup;
  loading: boolean;
  page: Page = new Page();
  MAX_SIZE = 3;
  page_changed: boolean;
  shopNumber: string;
  shop: Shop = new Shop();
  userList: User[] = [];
  searchValue: string;
  searchField: string;
  first_name: string = 'Joel00';

  constructor(private _formBuilder: FormBuilder, private _route: ActivatedRoute, private _router: Router, private _modalService: MDBModalService, private _shopService: ShopService, private _userService: UserService) { }

  ngOnInit(): void {
        // this.shopNumber = window.location.pathname.split("/").pop();

    this.shopNumber = this._route.snapshot.paramMap.get('id');

    console.log(("SHOP NUMBER :: "+this.shopNumber));

    this.searchForm = this._formBuilder.group({
      search_value: ['', Validators.compose([Validators.required])]
    });

    this.searchForm.get("search_value").valueChanges.pipe().subscribe(value => {
      this.page.pageNumber = 0;
      this.page_changed = false;
        if (this.searchForm.valid && value != null && value != undefined && value != '') {
          this.loading = true;
          this.searchValue = value;
          if(checkValidPhoneNumber(this.searchValue).validPhone) {
            this.searchField = 'phone_number';
          }
          else {
            this.searchField = 'name';
          }
          this.getUsers();
        }
        else  {
          this.searchField = null;
          this.searchValue = null;
          this.getUsers();
        }
    });

    if(this.shopNumber == null || this.shopNumber == undefined) {
      this._router.navigate(['/drop/shops']);
    }
    else {
      this.getShopDetails();
    }

    this._modalService.closed.subscribe(() => this.getShopDetails());

  }

  public isTouched(inputName: string): boolean {
    return this.searchForm.controls[inputName].touched;
  }

  public isInValid(inputName: string, error: string): boolean {
    return this.searchForm.controls[inputName].hasError(error);
  }

  get isInvalidSearchValue() {
    return (this.isInValid('search_value', 'required')) && this.isTouched('search_value');
  }

  getShopDetails() {
    this.loading = true;
    this._shopService.getShops((this.page.pageNumber).toString(), '1', null, null, null, this.shopNumber)
      .subscribe(res => {
        console.log(res);
        this.shop = res.data[0];
        console.log(this.shop);

        //get the drop requests for this shop
        this.getUsers();
      },
      error => {
        this.loading = false;
    });
  }

  getUsers() {
    this.loading = true;
    this.userList = [];
    
    this._userService.getUsers((this.page.pageNumber).toString(), (this.page.size).toString(), 
      null, this.shop.id.toString(), this.shopNumber, null, null, null, null, this.searchField, this.searchValue)
      .subscribe(res => {
        console.log(res);
        this.userList = res.data;
        console.log(this.userList);
        this.loading = false;
      },
      error => {
        this.loading = false;
    });
  }

  itemNumber(index: number) {
    return this.page_changed ? ((((this.page.pageNumber - 1) * this.page.size) + index) + 1) : index + 1;
  }

  pageChanged(event: any) {
    console.log("EV PAGE :: "+event.page);
    console.log("PAGE NO :: "+this.page.pageNumber);
    this.page.pageNumber = event.page;
    console.log("PAGE NO :: "+this.page.pageNumber);
    this.page_changed = true;
    this.getUsers()
  }

  viewUser(user: User) {
    console.log(user);
    console.log(user.user_number);
    this._router.navigate([user.user_number], {relativeTo: this._route});
  }

  openUserModal() {
    this.modalRef = this._modalService.show(UserFormComponent, 
      {
        backdrop: true, 
        ignoreBackdropClick: true,
        class: 'modal-lg',
        data: {
          isEdit: false,
          userShop: this.shop
        }
      }
    );
  }



}
