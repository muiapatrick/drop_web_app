import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Page } from 'src/app/_models/page';
import { NearestShop } from 'src/app/_models/nearest-shop';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShopService } from 'src/app/_providers/services/shop.service';
import { OpenShopsService } from 'src/app/_providers/services/open-shops.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DropService } from 'src/app/_providers/services/drop.service';
import { checkNoWhiteSpace, checkValidPhone } from 'src/app/_providers/validators/validators';
import { Dropitem } from 'src/app/_models/dropitem';

@Component({
  selector: 'app-drop-item',
  templateUrl: './drop-item.component.html',
  styleUrls: ['./drop-item.component.scss']
})
export class DropItemComponent implements OnInit {
  page = new Page();
  MAX_SIZE = 3;
  loading: boolean;
  shopSelected: boolean;

  selection = new SelectionModel<NearestShop>(false, []);

  nearestShops: NearestShop[] = [];

  itemInfoForm: FormGroup;
  reactiveForm: FormGroup;
  searchForm: FormGroup;

  search: boolean;
  searchName: string;
  openShops: NearestShop[] = [];
  shopId: string;
  openShopsIds: string = '';
  itemTypes: any[] = ['Envelope', 'Electronic','Computer','Other'];
  itemSizes: any[] = ['Larger Eg Large Box', 'Medium E.g Medium Sized box','Small Eg. Envelopes'];
  otherToPick: boolean;
  submitting: boolean;
  page_changed: boolean;
  item_action: string;
  search_shop_label: string = 'Search Shop by location';
  item: Dropitem = null;

  // private today: Date = new Date();

  // pickDateOptions: IMyOptions= {
  //   minYear: this.today.getFullYear(), 
  //   disableUntil: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() - 1}
  // };

  constructor(private _formBuilder: FormBuilder, private _shopService: ShopService,
      private _openShopService: OpenShopsService, private _router: Router, private _dropService: DropService,
      private _toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.otherToPick = false;
    this.itemInfoForm = this._formBuilder.group({
      item_name: ['', Validators.compose([Validators.required, checkNoWhiteSpace])],
      item_type: ['', Validators.compose([Validators.required])],
      item_size: ['', Validators.compose([Validators.required])],
      other_info: '',
      // pick_date: ['', Validators.compose([Validators.required])],
      other_person_name: '',
      other_person_phone: '',
      other_person_pick: ''
    });
    this.searchForm = this._formBuilder.group({
      shop_name: ['', Validators.compose([Validators.required])]
    });

    this.searchForm.get("shop_name").valueChanges.pipe().subscribe(shopName => {
      this.page.pageNumber = 0;
      this.page_changed = false;
        if (this.searchForm.valid) {
          //search only when it is valid
          this.loading = true;
          this.nearestShops = [];
          this.searchName = shopName;
          this.getShops();
        }
        else  {
          this.searchName = "";
          this.getShops();
        }
    });

    this.search = false;
    this.searchName = "";
    this.page.pageNumber = 0;

    this._shopService.shopId.subscribe(shopId => {
      this.shopId = shopId;
    });

    this._dropService.currentItemAction.subscribe(action => {
      this.item_action = action == null || action == undefined ? null : action;
    });

    this._dropService.currentItemData.subscribe(item => {
      console.log("ITEM TO EDIT");
      console.log(item);
      this.item = item;
    });

    this._shopService.nearOpenShop.subscribe(openShops => {
      this.openShops = openShops;

      if (this.openShops == null || this.openShops.length <= 0) {
        if(this.item_action == null) {
          this._router.navigate(['/drop/item/near-shops']);
        }
        else {
          let itemShop = {
            id: this.item.shop.id.toString(), shop_name: this.item.shop.shop_name,
            shop_location: this.item.shop.shop_location,
            phone_number:this.item.shop.phone_number,
            latitude: this.item.shop.latitude, longitude:this.item.shop.longitude, 
            is_open: this.item.shop.is_open
          }
          this.nearestShops.push(itemShop);
          this.checkboxLabel(itemShop);
        }
      }
      else {
        
        //extract the ids
        // if (this.openShops != null) {
          this.openShops.forEach(element => {
            this.openShopsIds += element.id + ",";
          });

          //get the open shops
          this.getShops();
        // }
      }
      if(this.item_action == 'edit' && this.item != null) {
        //edit action, populate the info
        this.search_shop_label = 'Change Shop';

        this.itemInfoForm.get('item_name').setValue(this.item.item_name);
        this.itemInfoForm.get('item_type').setValue(this.item.item_type);
        this.itemInfoForm.get('item_size').setValue(this.item.item_size);
        this.itemInfoForm.get('other_info').setValue(this.item.item_description);
        this.itemInfoForm.get('other_person_pick').setValue(this.item.is_other_pick);
        this.checkboxToPick({checked: this.item.is_other_pick});
        this.itemInfoForm.get('other_person_name').setValue(this.item.other_person_name);
        this.itemInfoForm.get('other_person_phone').setValue(this.item.other_person_phone);
      }
    });
  }

  public isTouched(inputName: string): boolean {
    return this.searchForm.controls[inputName].touched;
  }

  public isInValid(inputName: string, error: string): boolean {
    return this.searchForm.controls[inputName].hasError(error);
  }

  public isInValidItemFormisInValid(inputName: string, error: string): boolean {
    return this.searchForm.controls[inputName].hasError(error);
  }

  get isInvalidShopName() {
    return (this.isInValid('shop_name', 'required')) && this.isTouched('shop_name');
  }

  public isTouchedItemForm(inputName: string): boolean {
    return this.itemInfoForm.controls[inputName].touched;
  }

  public isInValidItemForm(inputName: string, error: string): boolean {
    return this.itemInfoForm.controls[inputName].hasError(error);
  }

  get isInvalidItemName() {
    return (this.isInValidItemForm('item_name', 'required') || this.isInValidItemForm('item_name', 'hasWhiteSpace')) && this.isTouchedItemForm('item_name');
  }

  // get isInvalidPickDate() {
  //   return (this.isInValidItemForm('pick_date', 'required')) && this.isTouchedItemForm('pick_date');
  // }

  get isInvalidItemType() {
    return (this.isInValidItemForm('item_type', 'required')) && this.isTouchedItemForm('item_type');
  }

  get isInvalidItemSize() {
    return (this.isInValidItemForm('item_size', 'required')) && this.isTouchedItemForm('item_size');
  }

  get isInvalidOtherName() {
    return (this.isInValidItemForm('other_person_name', 'required') || this.isInValidItemForm('other_person_name', 'hasWhiteSpace')) && this.isTouchedItemForm('other_person_name');
  }

  get isInvalidOtherPhone() {
    return (this.isInValidItemForm('other_person_phone', 'required') || this.isInValidItemForm('other_person_phone', 'hasWhiteSpace') || this.isInValidItemForm('other_person_phone', 'invalidPhone')) && this.isTouchedItemForm('other_person_phone');
  }
  

  goNext(stepper: any) {
    stepper.next();
  }

  getShops() {
    this.shopSelected = false;
    this.loading = true;
    this.nearestShops = [];

    this._shopService.getShops((this.page.pageNumber).toString(), (this.page.size).toString(), null, this.openShopsIds, this.searchName)
      .subscribe(res => {
        console.log(res);
        this.page.totalElements = res.meta.total_elements;

        this.page.totalPages = this.search ? this.page.totalPages : (res.meta.total_elements > 0 ? Math.ceil(res.meta.total_elements / this.page.size) : 0);
        this.nearestShops = res.data;
        this.loading = false;

        if(this.shopId != null && this.shopId !=undefined) {
          console.log("SHOP ID SEL : "+this.shopId);
          this.nearestShops.forEach(element => {
            if (element.id==this.shopId) {
              this.checkboxLabel(element);
            }
          });
        }
      },
      error => {
        this.loading = false;
      });
  }

  shopNumber(index: number) {
    // console.log("PAGE NO : "+ this.page.pageNumber);
    // return (((this.page.pageNumber - 1) * this.page.size) + index) + 1;
    return this.page_changed ? ((((this.page.pageNumber - 1) * this.page.size) + index) + 1) : index + 1;
  }

  pageChanged(event: any) {
    this.page.pageNumber = event.page;
    this.page_changed = true;
    this.getShops()
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(shop?: NearestShop) {
    this.shopId = '';
    this.selection.toggle(shop);
    console.log(shop);
    let selShop = this.selection.selected;
    console.log(selShop);
    this.shopSelected = this.selection.selected.length == 0 ? false : true;
    return `${this.selection.isSelected(shop) ? 'deselect' : 'select'} shop ${shop.position + 1}`;
  }

  checkboxToPick(event) {
    console.log("CHECK CHECKBOX");
    console.log(event);
    this.otherToPick = event.checked;
    if(this.otherToPick) {
      this.itemInfoForm.controls['other_person_name'].setValidators([Validators.compose([Validators.required, checkNoWhiteSpace])]);
      this.itemInfoForm.controls['other_person_phone'].setValidators([Validators.compose([Validators.required, checkNoWhiteSpace, checkValidPhone])]);
    }
    else {
      this.itemInfoForm.controls['other_person_name'].reset();
      this.itemInfoForm.controls['other_person_phone'].reset();
      this.itemInfoForm.controls['other_person_name'].markAsUntouched();
      this.itemInfoForm.controls['other_person_phone'].markAsUntouched();
      this.itemInfoForm.controls['other_person_name'].clearValidators();  
      this.itemInfoForm.controls['other_person_phone'].clearValidators();  
    }
    this.itemInfoForm.controls["other_person_name"].updateValueAndValidity();
    this.itemInfoForm.controls["other_person_phone"].updateValueAndValidity();
  }

  dropItemNow() {
    console.log("DROP NOW!");
    //check if shop is selected
    console.log("SHOP SELECTED ? : "+this.shopSelected);
    this.submitting = true;

    const itemInfo = {
      item_name: this.itemInfoForm.controls.item_name.value,
      item_description: this.itemInfoForm.controls.other_info.value,
      item_type: this.itemInfoForm.controls.item_type.value,
      item_size: this.itemInfoForm.controls.item_size.value,
      other_person_name: this.itemInfoForm.controls.other_person_name.value,
      other_person_phone: this.itemInfoForm.controls.other_person_phone.value,
      shop_id: this.selection.selected[0].id,
      other_pick: this.otherToPick
    };

    if(this.item_action == 'edit') {
      this._dropService.updateItem(this.item.id.toString(), itemInfo)
        .subscribe(res => {
          this._toastr.success("Item Updated successfuly.", "SUCCESSFULL DROP");
          this.submitting = false; 
          
          this._router.navigate(['/drop/item/list']);
        
        },error => {
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
      this._dropService.dropItem(itemInfo)
        .subscribe(res => {
          this._toastr.success("Item Dropped successfuly.", "SUCCESSFULL DROP");
          this.submitting = false; 
          this._router.navigate(['/drop/item/list']);
        },
        error => {
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

  changeShop() {
    if(this.item_action == 'edit') {
      this._dropService.setShopLocation({lat: this.item.shop.latitude, long: this.item.shop.longitude, shop_name: this.item.shop.shop_name});
      this._router.navigate(['/drop/item/near-shops']);
    }
    else {
      this._router.navigate(['/drop/item/near-shops']);
    }
  }

  // resetObservableData() {
  //   this._shopService.changeShopId(null);
  //   this._dropService.setItemAction(null);
  //   this._dropService.setItemData(null);
  //   this._shopService.changeOpenShops(null);
  // }

}
