import { Component } from '@angular/core';
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
import { LoginPage } from '../login/login';
import { Geolocation } from '@ionic-native/geolocation';
import * as firebase from 'firebase';
import 'firebase/firestore';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: GoogleMap;
  public dbShipers = firebase.firestore().collection('Shipers');
  public dbOrders = firebase.firestore().collection('Orders');
  public arrayOrder = [{ nameUser: 'dwad', address: 'dwadaw' }];

  public loginParams;
  constructor(public navCtrl: NavController, private geolocation: Geolocation, public toastCtrl: ToastController
    , public http: Http, public navParams: NavParams, public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    if (firebase.auth().currentUser) {
      this.loginParams = firebase.auth().currentUser.uid;
      console.log("LoginPagrams: " + this.loginParams);
      // this.arrayOrder = this.loadOrder();
      // console.log("arrayOrder:" + this.arrayOrder);
      this.arrayOrder = [{ nameUser: 'dwad', address: 'dwadaw' }];

      this.loadMap();
    }
    else {
      this.navCtrl.push('LoginPage');
    }

  }
  loadOrder(): any {

    var orders = [];
    this.dbOrders.where("idShiper", "==", this.loginParams).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        //return doc.data();
        this.arrayOrder.push(doc.data());
      });

    });
    console.log(orders);
    //this.arrayOrder = orders;
    return orders;
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
        tilt: 30
      }
    };



    this.map = GoogleMaps.create('map_canvas', mapOptions);
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
          title: 'Ionic',
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: 43.0741904,
            lng: -89.3809802
          }
        })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });
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