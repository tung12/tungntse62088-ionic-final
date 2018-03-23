import { Component, Injectable, OnInit } from '@angular/core';
import { NavController, ToastController, NavParams, ModalController, ViewController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage implements OnInit {
  map: GoogleMap;
  public dbShipers = firebase.firestore().collection('Shipers');
  public dbOrders = firebase.firestore().collection('Orders');
  public arrayOrder = [];

  public loginParams;
  constructor(public navCtrl: NavController, private geolocation: Geolocation, public toastCtrl: ToastController
    , public http: Http, public navParams: NavParams, public modalCtrl: ModalController) {
    //this.loadMap();

  }
  public ngOnInit(): void {
    
    //console.log(this.loginParams);
    if(firebase.auth().currentUser === null){
        this.navCtrl.push(LoginPage);
    }
    else{
      this.loginParams = firebase.auth().currentUser.uid;
      console.log("LoginPagrams: " + this.loginParams);
      this.loadOrder();
      console.log("arrayOrder:" + this.arrayOrder);
    }
   
    
  }
  ionViewDidLoad() {
    this.loadMap();
  }
  loadOrder() {

    var orders = [];
    this.dbOrders.where("idShiper", "==", this.loginParams).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        //return doc.data();
        orders.push(doc.data());
      });

    });
    this.arrayOrder = orders;
  }
  openModal(order: any) {

    let myModal = this.modalCtrl.create(InformationOrderModal, { order: order });
    myModal.present();
  }
  logEvent() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      let position: CameraPosition<any> = {
        target: {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        },
        zoom: 18,
        tilt: 30
      }
      this.map.moveCamera(position);
    }).catch((error) => {
      alert('Error getting location' + error);
    });
  }
  loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 0,

      }
    };
    console.log(this.navParams.get('uid'));
    firebase.firestore().collection('Orders').onSnapshot(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id);
      });

    });
    firebase.firestore().collection('Orders').get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id);
      });

    }).catch(function (error) {
      console.log("Error getting documents: ", error);
    });
    this.map = GoogleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {

        this.map.setAllGesturesEnabled(true);

        this.map.setMyLocationEnabled(true);
        this.map.setTrafficEnabled(true);
        this.map.setCompassEnabled(true);
        this.map.setIndoorEnabled(true);
        this.map.setVisible(true);


        console.log('Map is ready!');
        this.geolocation.getCurrentPosition().then((resp) => {
          let pos: CameraPosition<any> = {
            target: {
              lat: resp.coords.latitude,
              lng: resp.coords.longitude
            },
            zoom: 12,
            tilt: 0
          };
          this.map.animateCamera(pos);
        });

        // let watch = this.geolocation.watchPosition();
        // watch.subscribe((data) => {
        //   // data can be a set of coordinates, or an error (if an error occurred).
        //   // data.coords.latitude
        //   // data.coords.longitude
        //   let toast = this.toastCtrl.create({
        //     message: data.coords.latitude+ ' and '+ data.coords.longitude,
        //     duration: 3000
        //   });
        //   toast.present();
        // });
        // Now you can use all methods safely.
        // this.map.addMarker({
        //   title: 'Ionic',
        //   icon: 'blue',
        //   animation: 'DROP',
        //   position: {
        //     lat: 43.0741904,
        //     lng: -89.3809802
        //   }
        // })
        //   .then(marker => {
        //     marker.on(GoogleMapsEvent.MARKER_CLICK)
        //       .subscribe(() => {
        //         alert('clicked');
        //       });
        //   });

      }).catch(function (reason) {
        // rejection
        alert(reason);
      }
      );


  }

}


@Component({
  selector: 'page-information',
  templateUrl: 'informationmodal.html'
})
export class InformationOrderModal {
  order: any = this.navParams.get('order');
  constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    console.log('order', navParams.get('order'));

  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
}