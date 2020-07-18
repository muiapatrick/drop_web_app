import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OpenShopsService } from 'src/app/_providers/services/open-shops.service';
import { OpenShops } from 'src/app/_models/open-shops';
import { NearestShop } from 'src/app/_models/nearest-shop';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Marker } from 'src/app/_models/marker';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/_providers/services/shop.service';
import { DropService } from 'src/app/_providers/services/drop.service';
import { ShopLocation } from 'src/app/_models/shop-location';

@Component({
  selector: 'app-drop',
  templateUrl: './drop.component.html',
  styleUrls: ['./drop.component.scss']
})
export class DropComponent implements OnInit {
  @ViewChild('search', {static: false}) searchElementRef: ElementRef;

  currentLat: number;
  currentLong: number;
  zoom: number = 15;
  screenOptions: { position: 2};

  markers: Marker[] = []
  openShops: NearestShop[] = [];
  origin: any;
  destination: any;
  show_path: boolean;
  selectedShopId: string;
  
  map: any;
  message: string;
  selectedLocation: ShopLocation;
  item_action: string;

  constructor(private _mapsAPILoader: MapsAPILoader, private _ngZone: NgZone, private _openShopsService: OpenShopsService, private _toastr: ToastrService, private _router: Router,
    private _shopService: ShopService, private _dropService: DropService) {
    this._openShopsService.shopsCountChange.subscribe((value) => {
      this.selectedShopId = null;
        this.openShops = value;
        //remove all the markers other than the current position
        this.removeMarkers();
        //add the current position marker
        this.markers.push({lat: this.currentLat, lng: this.currentLong, draggable: true, clickable: false, label: 'Drag the Red marker to Place you want to See shops around.', animation: 'BOUNCE', title: 'My Position'});        
        // console.log(value);
        this.openShops.forEach(n => {
          this.markers.push({lat: n.position.geopoint.latitude, lng: n.position.geopoint.longitude, draggable: false, clickable: true, icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', title: n.shop_name, shop_id: n.id});
        });
      });
  }

  ngOnInit(): void {
    console.log("FROM DROP ITEM");
    this._dropService.selectedShopLoc.subscribe(loc => {
      this.selectedLocation = loc;
      console.log(loc);
    });
    this._dropService.currentItemAction.subscribe(action => {
      this.item_action = action;
      console.log(action);
    });
    this._mapsAPILoader.load().then(() => {
      this.setCurrentLocation();

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', ()=> {
        this._ngZone.run(()=> {
          this.show_path = false;
          this.selectedShopId = null;

          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          
          //verify result
          if(place.geometry === undefined || place.geometry === null) {
            return;
          }
          console.log("Place LAT : "+place.geometry.location.lat());
          console.log("Place LONG : "+place.geometry.location.lng());
          this.currentLat = place.geometry.location.lat();
          this.currentLong = place.geometry.location.lng();

          this._openShopsService.changeCurrentPosition(this.currentLat, this.currentLong);
          
        });
      });
    });
  }

  setCurrentLocation() {
    if('geolocation' in navigator) {
      if(this.item_action == 'edit' && this.selectedLocation != null) {
        this.currentLat = this.selectedLocation.lat;
        this.currentLong = this.selectedLocation.long;
        this.markers.push({lat: this.currentLat, lng: this.currentLong, draggable: true, clickable: false, label: 'Drag the Red marker to Place you want to See shops around.', animation: 'BOUNCE', title: this.selectedLocation.shop_name});

        this._openShopsService.changeCurrentPosition(this.currentLat, this.currentLong);

      }
      else {
        navigator.geolocation.getCurrentPosition((position) => {
          this.currentLat = position.coords.latitude;
          this.currentLong = position.coords.longitude;
          this.markers.push({lat: this.currentLat, lng: this.currentLong, draggable: true, clickable: false, label: 'Drag the Red marker to Place you want to See shops around.', animation: 'BOUNCE', title: 'My Position'});

          this._openShopsService.changeCurrentPosition(this.currentLat, this.currentLong);


        },
        error => {
          this._toastr.error("Unable to access your current location")
          //go to list of shops open

        });
    }
    }
    else {
      alert("Geolocation not supported!!");
      //go to list of shops open

    }
  }

  mapReady(event: any) {
    this.map = event;
    this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('btn-drop-control'));
    this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('btn-pick-control'));
    this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('btn-hover-control'));
  }

  removeMarkers() {
    let markersSize = this.markers.length
    let removedMks = this.markers.splice(0, markersSize);
  }

  markerDragEnd(m: Marker, event: any) {
    this.currentLat = event.coords.lat;
    this.currentLong = event.coords.lng;
    this._openShopsService.changeCurrentPosition(this.currentLat, this.currentLong);
  }

  clickedMarker(label: string, index: number) {
    let clickedMarker: Marker = this.markers[index];
    if (clickedMarker.clickable) { 
      this.show_path = true;
      // console.log(`clicked the marker: ${label || index}`)
      this.origin = {lat: this.currentLat, lng: this.currentLong};
      this.destination = {lat: clickedMarker.lat, lng: clickedMarker.lng}
      this.selectedShopId = clickedMarker.shop_id;
    }
  }

  dropItem() {
    if (this.openShops === undefined ||  this.openShops.length <= 0) {
      this._toastr.error("The are not shops around you.", "No Open Shops");
      return;
    }
    this._openShopsService.setSelectedShop(this.selectedShopId)
    this._shopService.changeShopId(this.selectedShopId);
    this._shopService.changeOpenShops(this.openShops)
    this._router.navigate(['drop/item']);
  }

  pickItem() {
    console.log("Pick Item");
  }



  
}

  

  


  // @ViewChild('mapContainer', {static: false}) gmap: ElementRef;
  // @ViewChild('search', {static: false}) searchElement: ElementRef;

  // map: google.maps.Map;
  // currentLat = -1.2841;
  // currentLong = 36.8155;
  // isTracking: boolean;
  // mylocationFound: boolean;

  // zoom = 15;
  // center: google.maps.LatLngLiteral;
  // coordinates = new google.maps.LatLng(this.currentLat, this.currentLong);

  // mapOptions: google.maps.MapOptions = {
  //   zoomControl: true,
  //   scrollwheel: false,
  //   streetViewControl: false,
  //   disableDoubleClickZoom: true,
  //   mapTypeControl: false,
  //   center: this.coordinates,
  //   maxZoom: 15,
  //   minZoom: 7,
  //   zoom: this.zoom,
  // };

  // myLocationMarker: any;

  // markers =  [];

  // openShops: OpenShops[] = [];
  // openShops: NearestShop[] = [];


  // constructor(private _toastr: ToastrService, private _openShopsService: OpenShopsService, private ngZone: NgZone) {
  //   this._openShopsService.shopsCountChange.subscribe((value) => {
  //     this.openShops = value;
  //     //remove all the markers other than the current position
  //     this.removeMarkers();
  //     //add the current position marker
  //     this.addMyLocationMarker(this.currentLat, this.currentLong);

  //     console.log(value);
  //     this.openShops.forEach(n => {
  //       this.addMarker(n.position.geopoint.latitude, n.position.geopoint.longitude, n.shop_name);
  //     });

  //   });
  //  }

  // ngOnInit(): void {  
  // }

  // ngAfterViewInit() {
  //   //check if it is possible to get the current position
  //   this.getCurrentPosition();
  // }

  // getCurrentPosition() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       //initialize the map
  //       this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

  //       let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement);
  //       autocomplete.addListener('place_changed', ()=> {
  //         this.ngZone.run(()=> {
  //           //get the place result
  //           let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            
  //           //verify result
  //           if(place.geometry === undefined || place.geometry === null) {
  //             return;
  //           }
            
  //           //set latitude, longitude and zoom
  //           // this.latitude = place.geometry.location.lat();
  //           // this.longitude = place.geometry.location.lng();
  //           // this.zoom = 12;
  //           // this.getAddress(this.latitude, this.longitude);
  //         });
  //       });

  //       //set marker for current position
  //       this.shopPosition(position);

  //       //get open shops
  //       // this.getOpenShops(this.currentLat, this.currentLong);
  //       this._openShopsService.getOpenShops(this.currentLat, this.currentLong);

  //     }, 
  //     error => {
  //       this._toastr.error("Unable to access your current location")
  //       //go to list of shops open

  //     }, 
  //     {timeout: 10000});
  //   }
  //   else {
  //     alert("Geolocation is not supported by this browser!");
  //     //go to list of shops open

  //   }
  // }

  // shopPosition(position) {
  //   this.mylocationFound = true;
  //   this.currentLat = (position.coords.latitude); //+ 0.0118149
  //   this.currentLong = (position.coords.longitude); //-0.0616294
  //   let location = new google.maps.LatLng(this.currentLat, this.currentLong);
  //   this.map.panTo(location);

  //   if (!this.myLocationMarker) {
  //     this.addMyLocationMarker(this.currentLat, this.currentLong);
  //   }
  //   else {
  //     this.myLocationMarker.setPosition(location);
  //   }
  // }

  // // getOpenShops(lat: number, long: number) {
  // //   console.log("Current Lat :: "+lat);
  // //   console.log("Current Long :: "+long);
  // //   // this._openShopsService.addStore('10', 'Shop 1', -1.2889, 36.7020);
  // //   this._openShopsService.getOpenStoresAround(lat, long).subscribe((openShops: NearestShop[]) => {
  // //     if (this.markers.length > 0 && openShops.length > 0) {
  // //       //remove all the markers other than the current position
  // //       let markersSize = this.markers.length
  // //       let removedMks = this.markers.splice(0, markersSize);
  // //       this.removeMarkers(removedMks);

  // //       //add the current position marker
  // //       this.addMyLocationMarker(this.currentLat, this.currentLong);
  // //     }

  // //     this.openShops = openShops;
  // //     console.log(openShops);
  // //     this.openShops.forEach(n => {
  // //       this.addMarker(n.position.geopoint.latitude, n.position.geopoint.longitude, n.shop_name);
  // //     });    
  // //   });
  // // }



  // addMarker(lat: number, long: number, title: string) {
  //   let location = new google.maps.LatLng(lat, long);
  //   let marker = new google.maps.Marker({position: location, map: this.map, title: title,
  //      icon: {url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'}           
  //     });
  //   const infoWindow = new google.maps.InfoWindow({ content: marker.getTitle() });
  //   marker.addListener("click", () => { infoWindow.open(marker.getMap(), marker) });
  //   marker.setMap(this.map);
  //   this.markers.push(marker);
  //   // console.log("MARKERS :: "+this.markers.length);
  // }

  // addMyLocationMarker(lat: number, long: number) {
  //   let location = new google.maps.LatLng(lat, long);
  //   let marker = new google.maps.Marker({position: location, map: this.map, title: 'My Location',
  //      draggable: true,
  //      label: 'Drag the Red marker to Place you want to See shops around.',
  //      animation: google.maps.Animation.BOUNCE,
           
  //     });
  //   const infoWindow = new google.maps.InfoWindow({ content: marker.getTitle() });
  //   marker.addListener("click", () => { infoWindow.open(marker.getMap(), marker) });
  //   marker.addListener("dragend", (event) => {
  //     // console.log("DRAG LAT"+event.latLng.lat());
  //     // console.log("DRAG LONG"+event.latLng.lng());
  //     this.currentLat = event.latLng.lat();
  //     this.currentLong = event.latLng.lng();
  //     // this.getOpenShops(this.currentLat, this.currentLong);
  //     this._openShopsService.getOpenShops(this.currentLat, this.currentLong);
  //   });

  //   marker.setMap(this.map);
  //   this.markers.push(marker);
  // }

  // removeMarkers() {
  //   let markersSize = this.markers.length
  //   let removedMks = this.markers.splice(0, markersSize);
  //   if (removedMks != null && removedMks.length > 0) {
  //     removedMks.forEach(m => {
  //       m.setMap(null);
  //     });
  //   }
  // }















  // // ngAfterViewInit1() {
  // //   this.mapInitializer();
  // //   this.findMe();
  // // }

  // // mapInitializer() {  
  // //   this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
  // //   this.loadAllMarkers();
  // //   this.showOpenShops();
  // // }

  // // loadAllMarkers(): void {
  // //   console.log("MARKERS :: "+this.markers.length);

  // //   this.markers.forEach(markerInfo => {
  // //     const marker = new google.maps.Marker(markerInfo);
  // //     const infoWindow = new google.maps.InfoWindow({ content: marker.getTitle() });
  // //     marker.addListener("click", () => { infoWindow.open(marker.getMap(), marker) });
  // //     marker.setMap(this.map);
  // //     console.log("ADD MARKER");
  // //   });
  // // }  

  // // showOpenShops() {
  // //   // this._openShopsService.openShopsObservable.subscribe((res: OpenShops[]) => {
  // //   //   this.openShops = res;
  // //   //   console.log("OPEN SHOPS::"+this.openShops.length);

  // //   //   this.openShops.forEach(o=> {
  // //   //     let location = new google.maps.LatLng(o.lat, o.long);
  // //   //     const shopLoc = new google.maps.Marker({position: location, map: this.map, title: o.name})
  // //   //     const infoWindow = new google.maps.InfoWindow({ content: shopLoc.getTitle() });
  // //   //     shopLoc.addListener("click", () => { infoWindow.open(shopLoc.getMap(), shopLoc) });
  // //   //     this.markers.push(shopLoc);
  // //   //   });
  // //   // });
  // // }

  // // zoomIn() {
  // //   if (this.zoom < this.mapOptions.maxZoom) this.zoom++
  // // }

  // // zoomOut() {
  // //   if (this.zoom > this.mapOptions.minZoom) this.zoom--
  // // }

  // // findMe() {
  // //   if (navigator.geolocation) {
  // //     navigator.geolocation.getCurrentPosition((position) => {
  // //       this.shopPosition(position);
  // //     }, 
  // //     error => {
  // //       console.log("ERROR");
  // //       console.log(error);
  // //       this._toastr.error("Unable to access your current location")
  // //     }, 
  // //     {timeout: 10000});
  // //   }
  // //   else {
  // //     alert("Geolocation is not supported by this browser!");
  // //   }
  // // }

  // // trackMe() {
  // //   // if (navigator.geolocation) {
  // //   //   this.isTracking = true;
  // //   //   navigator.geolocation.watchPosition((position) => {
  // //   //     this.showTrackingPosition(position);
  // //   //   },
  // //   //   error => {
  // //   //     console.log("ERROR");
  // //   //     console.log(error);
  // //   //     this._toastr.error("Unable to access your current location")
  // //   //   }, 
  // //   //   {timeout: 10000});
  // //   // } else {
  // //   //   alert("Geolocation is not supported by this browser!");
  // //   // }
  // // }

  // // // shopPosition(position) {
  // // //   // this.mylocationFound = true;
  // // //   // this.currentLat = position.coords.latitude;
  // // //   // this.currentLong = position.coords.longitude;
  // // //   // console.log(this.currentLat);
  // // //   // console.log(this.currentLong);
  // // //   // let location = new google.maps.LatLng(this.currentLat, this.currentLong);
  // // //   // this.map.panTo(location);

  // // //   // if (!this.myLocationMarker) {
  // // //   //   this.myLocationMarker = new google.maps.Marker({position: location, map: this.map, title: 'My Location'})
  // // //   // }
  // // //   // else {
  // // //   //   this.myLocationMarker.setPosition(location);
  // // //   // }
  // // // }

  // // showTrackingPosition(position) {
  // //   console.log('tracking position: ${position.coords.latitude} - ${position.coords.longitude}');
  // //   this.currentLat = position.coords.latitude;
  // //   this.currentLong = position.coords.longitude;

  // //   let location = new google.maps.LatLng(this.currentLat, this.currentLong);

  // //   this.map.panTo(location);
  // //   if (!this.myLocationMarker) {
  // //     this.myLocationMarker = new google.maps.Marker({position: location, map: this.map, title: "My Location"});
  // //   }
  // //   else {
  // //     this.myLocationMarker.setPosition(location);
  // //   }
  // // }
// }
