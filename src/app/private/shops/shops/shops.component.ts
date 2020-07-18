import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Page } from 'src/app/_models/page';
import { ShopService } from 'src/app/_providers/services/shop.service';
import { Shop } from 'src/app/_models/shop';
import { Router, ActivatedRoute } from '@angular/router';
import { MDBModalService } from 'ng-uikit-pro-standard';
import { ShopProfileComponent } from '../shop-profile/shop-profile.component';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_providers/services/user.service';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {
  modalRef: any;
  searchForm: FormGroup;
  loading: boolean;
  page: Page = new Page();
  MAX_SIZE = 3;
  page_changed: boolean;
  searchName: string;
  
  shopsList: Shop[] = [];
  user: User;
  

  constructor(private _formBuilder: FormBuilder, private _userService: UserService, private _shopService: ShopService, private _router: Router, private _route: ActivatedRoute,
    private _modalService: MDBModalService) { }

  ngOnInit(): void {
    this.user = this._userService.getAuthenticatedUser();
    this.page.pageNumber = 0;
    this.searchName = "";
    this.searchForm = this._formBuilder.group({
      shop_name: ['', Validators.compose([Validators.required])]
    });

    this.searchForm.get("shop_name").valueChanges.pipe().subscribe(shopName => {
      this.page.pageNumber = 0;
      this.page_changed = false;
        if (this.searchForm.valid) {
          this.loading = true;
          this.searchName = shopName;
          this.getShops();
        }
        else  {
          this.searchName = "";
          this.getShops();
        }
    });

    this.getShops();
  }

  public isTouched(inputName: string): boolean {
    return this.searchForm.controls[inputName].touched;
  }

  public isInValid(inputName: string, error: string): boolean {
    return this.searchForm.controls[inputName].hasError(error);
  }

  get isInvalidShopName() {
    return (this.isInValid('shop_name', 'required')) && this.isTouched('shop_name');
  }

  itemNumber(index: number) {
    return this.page_changed ? ((((this.page.pageNumber - 1) * this.page.size) + index) + 1) : index + 1;
  }

  pageChanged(event: any) {
    this.page.pageNumber = event.page;
    this.page_changed = true;
    this.getShops()
  }

  getShops() {
    this.loading = true;
    this.shopsList = [];
    
    this._shopService.getShops((this.page.pageNumber).toString(), (this.page.size).toString(), this.user.id.toString(), null, this.searchName)
      .subscribe(res => {
        console.log(res);
        this.page.totalElements = res.meta.total_elements;

        this.page.totalPages = (res.meta.total_elements > 0 ? Math.ceil(res.meta.total_elements / this.page.size) : 0);
        this.shopsList = res.data;
        this.loading = false;
      },
      error => {
        this.loading = false;
      });
  }

  viewShop(shop){
    // this._dropService.setItemData(item);
    // this._router.navigate(['/drop/item/view']);//viewPiProfile
    // this._router.navigate([''+ item.viewPiProfile +'/view'], {relativeTo: this.route});//
    this._router.navigate([shop.shop_number], {relativeTo: this._route});
    // this._router.navigate(['drop/shops/'+shop.shop_number]);
  }

  addShop() {
    this._router.navigate(['add'], {relativeTo: this._route});
  }

}
