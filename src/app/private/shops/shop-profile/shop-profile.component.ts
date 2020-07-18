import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Page } from 'src/app/_models/page';
import { ShopService } from 'src/app/_providers/services/shop.service';
import { Shop } from 'src/app/_models/shop';
import { MapsAPILoader } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { Marker } from 'src/app/_models/marker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MDBModalRef } from 'ng-uikit-pro-standard';
import { checkNoWhiteSpace, hasRoleForShop, getShopByShopNo } from 'src/app/_providers/validators/validators';
import { UserService } from 'src/app/_providers/services/user.service';
import { User } from 'src/app/_models/user';
import { OpenShopsService } from 'src/app/_providers/services/open-shops.service';

@Component({
  selector: 'app-shop-profile',
  templateUrl: './shop-profile.component.html',
  styleUrls: ['./shop-profile.component.scss']
})
export class ShopProfileComponent implements OnInit {
  @ViewChild('search', {static: false}) searchElementRef: ElementRef;
  shopForm: FormGroup;
  page: Page = new Page();
  loading: boolean;
  shopNumber: string;
  pathName: string;
  shop: Shop;
  pageAction: string = 'Shop Information';
  buttonActionLabel: string = 'Save';
  canEdit: boolean;
  action: string;
  currentLat: number;
  currentLong: number;
  zoom: number = 15;
  screenOptions: { position: 2};
  map: any;

  shopMarker: Marker;
  user: User;
  hasShopAdminRole: boolean;

  constructor(private _formBuilder: FormBuilder, private _mapsAPILoader: MapsAPILoader, private _ngZone: NgZone, private _route: ActivatedRoute, private _router: Router, 
    private _location: Location,
    private _shopService: ShopService,
    private _toastr: ToastrService, private _userService: UserService, private _openShopService: OpenShopsService) { }

  ngOnInit(): void {
    this.shopNumber = this._route.snapshot.paramMap.get('id');
    this.pathName = window.location.pathname.split("/").pop();
    this.user = this._userService.getAuthenticatedUser();

    this.shopForm = this._formBuilder.group({
      shop_name: ['', Validators.compose([Validators.required, checkNoWhiteSpace])],
      phone_number: ['', Validators.compose([Validators.required, checkNoWhiteSpace])],
      shop_location: ['', Validators.compose([Validators.required, checkNoWhiteSpace])],
      open_status: [''],
      search_control: ['']
    });

    if(this.shopNumber != null || this.shopNumber != undefined) {
      this.shop = getShopByShopNo(this.user.shops, this.shopNumber);
      if(this.shop != null){
        this.hasShopAdminRole = hasRoleForShop(this.user.roles, 3, this.shop.id) || this.shop.user_id == this.user.id ? true : false;
        this.currentLat = this.shop.latitude;
        this.currentLong = this.shop.longitude;
        this.shopMarker = {lat: this.currentLat, lng: this.currentLong, draggable: true, clickable: false, label: 'Current shop location(Drag to Change)', animation: 'BOUNCE', title: this.shop.shop_name.toUpperCase() + ' - ' + this.shop.shop_location };
        this.buttonActionLabel = 'Save Changes';
        this.setShopFormValues();
      }
      else {
        //get the shop details
        this.getShopDetails();
        this.buttonActionLabel = 'Save Changes';
      }
    }
    this.canEdit = this.pathName == 'add' || this.hasShopAdminRole ? true : false;
    this._mapsAPILoader.load().then(() => {
      if(this.action == 'new') {
        this.setCurrentLocation();
      }
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', ()=> {
        this._ngZone.run(()=> {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if(place.geometry === undefined || place.geometry === null) {
            return;
          }
          place.geometry.location
          this.currentLat = place.geometry.location.lat();
          this.currentLong = place.geometry.location.lng();
          this.shopMarker = {lat: this.currentLat, lng: this.currentLong, draggable: true, clickable: false, label: 'Current shop location(Drag to Change)', animation: 'BOUNCE', title: 'Your Shop is located at '+place.name};   
        });
      });
    });
  }

  getShopDetails() {
    //get the authenticated user
    this.loading = true;
    this._userService.
    getUsers((this.page.pageNumber).toString(), '1', this.user.id.toString(), null, this.shopNumber, null, null, null)
      .subscribe(res => {
        this.user = res.data[0];
        
        this.shop = getShopByShopNo(this.user.shops, this.shopNumber);
        this.hasShopAdminRole = hasRoleForShop(this.user.roles, 3, this.shop.id) || this.shop.user_id == this.user.id ? true : false;        this.setShopFormValues();
        this.currentLat = this.shop.latitude;
        this.currentLong = this.shop.longitude;
        this.shopMarker = {lat: this.currentLat, lng: this.currentLong, draggable: true, clickable: false, label: 'Current shop location(Drag to Change)', animation: 'BOUNCE', title: this.shop.shop_name.toUpperCase() + ' - ' + this.shop.shop_location };
        this.setShopFormValues();
        this.loading = false;
      },
      error => {
        this.loading = false;
    });
  }

  setShopFormValues() {
    this.canEdit = this.pathName == 'add' || this.hasShopAdminRole ? true : false;
    this.pageAction = this.pathName == 'add' ? "Add New Shop" : this.pageAction;
    if(this.shop != null) {
      this.shopForm.get("shop_name").setValue(this.shop.shop_name);
      this.shopForm.get("phone_number").setValue(this.shop.phone_number);
      this.shopForm.get("shop_location").setValue(this.shop.shop_location);
      this.shopForm.get("open_status").setValue(this.shop.is_open);
      this.enableDisableFormFields();
    }
  }

  enableDisableFormFields() {
    if(this.canEdit) {
      this.shopForm.get("shop_name").enable();
      this.shopForm.get("phone_number").enable();
      this.shopForm.get("shop_location").enable();
      this.shopForm.get("open_status").enable();
      this.shopForm.get("search_control").enable();
    }
    else {
      this.shopForm.get("shop_name").disable();
      this.shopForm.get("phone_number").disable();
      this.shopForm.get("shop_location").disable();
      this.shopForm.get("open_status").disable();
      this.shopForm.get("search_control").disable();
    }
  }

  setCurrentLocation() {
    if('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLat = position.coords.latitude;
        this.currentLong = position.coords.longitude;
        this.shopMarker = {lat: this.currentLat, lng: this.currentLong, draggable: true, clickable: false, label: 'Drag the Red marker to where your shop is located.', animation: 'BOUNCE', title: 'My Position'};
      },
      error => {
        this._toastr.error("Unable to access your current location")
        //go to list of shops open

      });
    }
    else {
      alert("Geolocation not supported!!");
      //go to list of shops open

    }
  }

  mapReady(event: any) {
    this.map = event;
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('search-control'));
  }

  markerDragEnd (m: Marker, event: any) {
    this.currentLat = event.coords.lat;
    this.currentLong = event.coords.lng;
    this.shopMarker = {lat: this.currentLat, lng: this.currentLong, draggable: true, clickable: false, label: 'Drag the Red marker to where your shop is located.', animation: 'BOUNCE', title: 'Customers will see your shop here'};   

  }

  postShop() {
    let shopInfo = {
      is_open: this.shopForm.get("open_status").value,
      phone_number: this.shopForm.get("phone_number").value,
      shop_name: this.shopForm.get("shop_name").value,
      shop_location: this.shopForm.get("shop_location").value,
      latitude: this.shopMarker.lat,
      longitude: this.shopMarker.lng
    };

    console.log(shopInfo);

    if(this.pathName == 'add') {
      //create new shop
      this._shopService.createShop(shopInfo)
        .subscribe(res => {
          //add shop to firebase
          let addedShop: Shop = res.data;
          this._openShopService.addStore(addedShop.id.toString(), addedShop.shop_name, addedShop.latitude, addedShop.longitude)
          this._toastr.success("Shop added successful", "SUCCESSFULL");
          this.shopForm.reset();
          this.setCurrentLocation();
          this._location.back();
        },error => {
            console.log(error)

            if (error.status == 400) {
              this._toastr.error("Invalid Request Parameters not permitted");
            }
            if (error.status == 409) {
              this._toastr.error(error.error.api_code_description);
            }
            console.log(error);
      });
    }
    else {
      this._shopService.updateShop(this.shop.id.toString(), shopInfo)
      .subscribe(res => {
        let addedShop: Shop = res.data;
        this._openShopService.addStore(addedShop.id.toString(), addedShop.shop_name, addedShop.latitude, addedShop.longitude)
        this._toastr.success("Shop Details updated successful", "SUCCESSFULL");
        this.shopForm.reset();
        this.setCurrentLocation();
        this._location.back();
      },error => {
          console.log(error)
          if (error.status == 400) {
            this._toastr.error("Invalid Request Parameters not permitted");
          }
          console.log(error);
      });
    }
  }

}
