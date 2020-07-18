import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Page } from 'src/app/_models/page';
import { DropService } from 'src/app/_providers/services/drop.service';
import { checkValidNumberic, checkNoWhiteSpace, checkAmount, checkValidPhone } from 'src/app/_providers/validators/validators';
import { Dropitem } from 'src/app/_models/dropitem';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/_providers/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { MDBModalService } from 'ng-uikit-pro-standard';
import { DropActionComponent } from '../drop-action/drop-action.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  modalRef: any;
  searchForm: FormGroup;
  acceptDeclineForm: FormGroup;
  page: Page = new Page();
  MAX_SIZE = 3;
  loading: boolean;
  itemStatuses: any[] = [{v: 'item_name', name: 'Item Name'}, {v: 'tag_number', name: 'Tag Number'}, {v: 'release_number', name: 'Release number'}, {v: '1', name: 'New Droppings'}, {v: '2', name: 'Dropped'}, {v: '3', name: 'Pick Request'}, {v: '4', name: 'Cancelled Droppings'}, {v: '5', name: 'Picked Items'}];
  searchFieldBy = {v: 'item_name', name: 'item name'};
  searchFieldValue: string = null;
  statuses: string = null;
  userId: string = null;
  shopNumber: string = null;
  routerPath: string;
  page_changed: boolean;
  is_shop_management: boolean;
  itemList: Dropitem[] = [];

  constructor(private _formBuilder: FormBuilder, private _dropService: DropService,
    private _userService: UserService, private _toastr: ToastrService, private _modalService: MDBModalService,
    private _router: Router, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log("ITEM LIST JERE")
    this.page.pageNumber = 0;
    this.routerPath = window.location.pathname.split("/").pop();
    this._dropService.setItemAction(null);
    this._dropService.setItemData(null);
    
    console.log("PATH ::: "+this.routerPath);
    this.searchForm = this._formBuilder.group({
      search_field:  ['', Validators.compose([Validators.required])],
      filter_criteria: ''
    });

    this.searchForm.get("search_field").valueChanges.pipe().subscribe(searchFieldValue => {
      this.page.pageNumber = 0;
      this.page_changed = false;
        if (this.searchForm.valid) {
          //search only when it is valid
          this.searchFieldValue = searchFieldValue;
          this.getItems();
        }
        else  {
          this.searchFieldValue = null;
          this.getItems();
        }
    });

    if(this.routerPath == 'list') {
      this.userId = this._userService.getAuthenticatedUser().id.toString();
    }
    else if(this.routerPath == 'items') {
      this.is_shop_management = true;
      //load items for the shop
      this.shopNumber = this._route.snapshot.paramMap.get('id');
      this.itemStatuses = [{v: 'item_name', name: 'Item Name'}, {v: 'tag_number', name: 'Tag Number'}, {v: 'release_number', name: 'Release number'}, {v: '1', name: 'New Droppings'}, {v: '2', name: 'Dropped'}, {v: '3', name: 'Pick Request'}, {v: '5', name: 'Picked Items'}];
      this._dropService.currentItemStatus.subscribe(s => {
        this.statuses = s;
      });
      if(this.statuses == null || this.statuses == '') {
        this.statuses = '1,2,3,5,7';
      }
      console.log("STATUSES :: "+this.statuses);
    }
    else {
      //go back to dashboard
      this._router.navigate(['/drop']);
    }
    this.getItems();
    
    this._modalService.closed.subscribe(() => this.getItems());

  }

  public isTouched(inputName: string): boolean {
    return this.searchForm.controls[inputName].touched;
  }

  public isInValid(inputName: string, error: string): boolean {
    return this.searchForm.controls[inputName].hasError(error);
  }

  get isInvalidFieldValue() {
    return (this.isInValid('search_field', 'required')) && this.isTouched('search_field');
  }

  onFilterCriteriaChange(value) {
    if(checkValidNumberic(value).validNumeric) {
      this.page.pageNumber = 0;
      //search by status
      console.log("SEARCH STATUS "+value);
      this.statuses = value;
      console.log(this.statuses);
      this.getItems();
    }
    else {
      //change the serch field
      this.searchFieldBy = {v: value, name: value.replace("_", " ")};
      console.log("SEARCH BY "+value);
      this.statuses = null;
      this.searchForm.controls.search_field.reset();
    }
  }

  itemNumber(index: number) {
    // console.log("PAGE NO : "+ this.page.pageNumber);
    // return (((this.page.pageNumber - 1) * this.page.size) + index) + 1;
    return this.page_changed ? ((((this.page.pageNumber - 1) * this.page.size) + index) + 1) : index + 1;
  }

  pageChanged(event: any) {
    console.log("EV PAGE :: "+event.page);
    console.log("PAGE NO :: "+this.page.pageNumber);
    this.page.pageNumber = event.page;
    console.log("PAGE NO :: "+this.page.pageNumber);
    this.page_changed = true;
    this.getItems()
  }

  getItems() {
    this.loading = true;
    this.itemList = [];
    this._dropService.getItems((this.page.pageNumber).toString(), (this.page.size).toString(), this.userId, null, this.searchFieldBy.v, this.searchFieldValue, this.statuses, this.shopNumber)
    .subscribe(res => {
      console.log(res);
      this.page.totalElements = res.meta.total_elements;
      this.page.totalPages = (res.meta.total_elements > 0 ? Math.ceil(res.meta.total_elements / this.page.size) : 0);

      this.itemList = res.data;
      console.log(this.itemList);
      this.loading = false;
    },
    error => {
      this.loading = false;
    });
  }

  viewItem(item){
    console.log(item);
    this._dropService.setItemData(item);
    // this._router.navigate(['/drop/item/view']);//viewPiProfile
    // this._router.navigate([''+ item.viewPiProfile +'/view'], {relativeTo: this.route});//
    console.log(this._route.url);
    this._router.navigate([item.item_drop_number], {relativeTo: this._route});
  }

  editItem(item) {
    this._dropService.setItemAction('edit');
    this._dropService.setItemData(item);
    this._router.navigate(['/drop/item']);    
  }

  applyAcceptFrmControlValidators(field: string, validators: any[]) {
    this.acceptDeclineForm.controls[field].setValidators(validators);
    this.acceptDeclineForm.controls[field].updateValueAndValidity();
  }

  disableAcceptFrmControlValidators(field: string) {
    this.acceptDeclineForm.controls[field].reset();
    this.acceptDeclineForm.controls[field].markAsUntouched();
    this.acceptDeclineForm.controls[field].clearValidators(); 
    this.acceptDeclineForm.controls[field].updateValueAndValidity();
  }

  openDropActionModal(action, item) {
    this.modalRef = this._modalService.show(DropActionComponent, 
      {
        backdrop: true, 
        ignoreBackdropClick: true,
        class: 'modal-md cascading-modal',
        data: {
          action: action,
          item: item
        }
      }
    );
  }


}

