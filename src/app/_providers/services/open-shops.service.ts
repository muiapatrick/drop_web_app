import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { OpenShops } from 'src/app/_models/open-shops';
import { Observable, Subject } from 'rxjs';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import { GeoCollectionReference, GeoFirestore, GeoQuery, GeoQuerySnapshot } from 'geofirestore';

firebase.initializeApp(environment.firebase);

import * as geofirex from 'geofirex';
import { NearestShop } from 'src/app/_models/nearest-shop';
import { FirePoint, GeoQueryOptions } from 'geofirex';
import { ToastrService } from 'ngx-toastr';
const geo = geofirex.init(firebase);
const stores = firebase.firestore().collection("stores");

// const center = geo.point(40.1, -119.1);
const radius = 5; //KM
// const field = "position";
const geoQuery = geo.query('stores');

// geoQuery.within(center, radius, 'position')
//         .subscribe((hits) => console.log((hits)))

const firestore = firebase.firestore();
const geofirestore: GeoFirestore = new GeoFirestore(firestore);
const geocollection: GeoCollectionReference = geofirestore.collection('stores');
const queryOptions: GeoQueryOptions = {units: 'km', log: false};

@Injectable({
  providedIn: 'root'
})
export class OpenShopsService {
  
  shopsCountChange: Subject<NearestShop[]> = new Subject<NearestShop[]>();
  selectedShopId: Subject<string> = new Subject<string>();
  selectedId: string;
  currentPositionChange: Subject<any> = new Subject<any>();
  currentPosition: any = this.currentPositionChange.asObservable();

  constructor(private _toastr: ToastrService) {
    if('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.changeCurrentPosition(position.coords.latitude, position.coords.longitude);
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

  addStore(shopId: string, shopName: string, lat: number, long: number) {
    const position =  geo.point(lat, long);
    const geoPoint = new firebase.firestore.GeoPoint(lat  , long);
    const geoHash = position.geohash;
    const firepoint: FirePoint = {geohash: geoHash, geopoint: geoPoint}
    const nn = {shop_name: shopName, g: geoHash, l: geoPoint, position: firepoint};
    const docRef = stores.doc(shopId); //DocumentReference
    docRef.set(Object.assign({}, nn));
  }

  getOpenStoresAround(lat: number, long: number): Observable<any[]> {    
    // return geoQuery.within(geo.point(lat, long), radius, 'position').pipe();
    return geoQuery.within(geo.point(lat, long), radius, 'position', queryOptions).pipe();
  }

  getOpenShops(lat: number, long: number) {
    this.getOpenStoresAround(lat, long).subscribe((nearestShops: NearestShop[]) => {
      this.shopsCountChange.next(nearestShops);
    });
  }

  setSelectedShop(id: string) {
    this.selectedShopId.next(id);
  }

  changeCurrentPosition(lat: number, long: number) {
    this.currentPositionChange.next({lat, long});
    this.getOpenShops(lat, long);
  }


  getShopsNear(lat: number, long: number) {
    // Add a GeoDocument to a GeoCollection
    // geocollection.add({
    //   name: 'Geofirestore',
    //   score: 100,
    //   // The coordinates field must be a GeoPoint!
    //   coordinates: new firebase.firestore.GeoPoint(lat  , long)
    // })

    // const query: GeoQuery = 
    // return geocollection
    //   .near({ center: new firebase.firestore.GeoPoint(lat, long), radius: 1000 })
    //   .onSnapshot((s) => {
    //     console.log(s.docs);
    //   });
    const query: GeoQuery = geocollection.near({ center: new firebase.firestore.GeoPoint(40.7589, -73.9851), radius: 1000 });
    
    // Get query (as Promise)
    query.get().then((value: GeoQuerySnapshot) => {
      // All GeoDocument returned by GeoQuery, like the GeoDocument added above
      console.log("EHERE");
      console.log(value.docs);
    }).then((v) => {
      console.log("v");
      console.log(v);
    });
  }







  // geofirestore: GeoFirestore;
  // geocollection: GeoCollectionReference;
  // openShops: OpenShops[] = [];

  // constructor() {
  //   //inialize firebase SDK
  //   firebase.initializeApp(environment.firebase);
    
  //   //create firestore reference
  //   const firestore = firebase.firestore();

  //   //create Geofire reference
  //   this.geofirestore = new GeoFirestore(firestore);

  //   //create  a collection reference
  //   this.geocollection = this.geofirestore.collection("stores");

  // }

  // addStore() {
  //   this.geocollection.add({
  //     name: 'GeoFirestore',
  //     score: 100,
  //     //coordinates field must be GeoPoint
  //     coordinates: new firebase.firestore.GeoPoint(-1.2846, 36.6001)
  //   });
  // }

  // getOpenShopsNear() {
  //   const query: GeoQuery = this.geocollection.near({center: new firebase.firestore.GeoPoint(-1.2846, 36.6001), radius: 1000});
    
  //   query.onSnapshot((r) => {
  //     console.log(r.docs);
      
  //   });


  //   // query.onSnapshot((r) => {
  //   //   console.log(r.docs);
  //   // });
  //   // query.get().then((value: GeoQuerySnapshot) => {
  //   //   //All GeoDocument returned by GeoQuery 
  //   //   console.log(value.docs);
  //   // });
  // }

  // openShopsCollection: AngularFirestoreCollection<OpenShops>
  // openShopsObservable: Observable<OpenShops[]>;
  // geofirestore: GeoFirestore;

  // constructor( private geofireStore: GeoFirestore) {
    // this.openShopsCollection = this.db.collection<OpenShops>("open_shops");
    // this.openShopsObservable = this.openShopsCollection.valueChanges();

    // this.geofirestore = new GeoFirestore(db.firestore);

  // }
  
}
