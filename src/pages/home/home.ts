import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController, NavParams, ModalController, ViewController } from 'ionic-angular';
// import {
//   GoogleMaps,
//   GoogleMap,
//   GoogleMapsEvent,
//   GoogleMapOptions,
//   CameraPosition,
//   MarkerOptions,
//   Marker
// } from '@ionic-native/google-maps';
import { Http } from '@angular/http';
import { LoginPage } from '../login/login';
import { Geolocation } from '@ionic-native/geolocation';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { visitRootRenderNodes } from '@angular/core/src/view/util';
declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  start = 'chicago, il';
  end = 'joplin, mo';

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  infoWindow = new google.maps.InfoWindow;
  public dbShipers = firebase.firestore().collection('Shipers');
  public dbOrders = firebase.firestore().collection('Orders');
  public arrayOrder = [];

  public loginParams;
  constructor(public navCtrl: NavController, private geolocation: Geolocation, public toastCtrl: ToastController
    , public http: Http, public navParams: NavParams, public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    // if (firebase.auth().currentUser) {
    // this.loginParams = firebase.auth().currentUser.uid;
    // console.log("LoginPagrams: " + this.loginParams);
    this.loadOrder().then((data: any) => {
      this.arrayOrder = data;
      console.log("arrayOrder:" + this.arrayOrder[0]);

      this.loadMap();
      console.log(data[0]);
      console.log(data[0].location.lat + "  " + data[0].location.long);

      this.addMaker(parseFloat(data[0].location.lat), parseFloat(data[0].location.long));
      this.calculateAndDisplayRoute();
    })
      .catch((error: any) => {
        console.log(error.message);
      });;

    //this.calculateAndDisplayRoute();
    // }
    // else {
    //   this.navCtrl.push('LoginPage');
    // }

  }
  calculateAndDisplayRoute() {
    this.geolocation.getCurrentPosition().then((resp) => {
      var pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      var myLocation = {
        lat: this.arrayOrder[0].location.lat,
        lng: this.arrayOrder[0].location.long
      }
      this.directionsService.route({
        origin: pos,
        destination: myLocation,
        travelMode: 'DRIVING'
      }, (response, status) => {
        if (status === 'OK') {
          console.log(status);
          console.log(response);

          this.directionsDisplay.setDirections(response);
          console.log(response.routes[0].legs[0].distance.value);
          this.arrayOrder[0].distance = response.routes[0].legs[0].distance.text;
          this.arrayOrder[0].duration = response.routes[0].legs[0].duration
            .text;
          console.log(this.arrayOrder[0]);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });

    }).catch((error) => {
      alert('Error getting location' + error);
    });

  }
  loadOrder(): Promise<any> {



    return new Promise((resolve, reject) => {
      this.dbOrders.where("idShiper", "==", "1hRCHEtOoiUPSzEVHOLU5CCTbMD3").get().then(function (querySnapshot) {
        var orders = [];
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          //return doc.data();
          orders.push(doc.data());

        });
        resolve(orders);
      });
    });



  }
  openModal(order: any) {

    let myModal = this.modalCtrl.create(InformationOrderModal, { order: order });
    myModal.present();
  }
  logEvent() {
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   // resp.coords.latitude
    //   // resp.coords.longitude
    //   let position: CameraPosition<any> = {
    //     target: {
    //       lat: resp.coords.latitude,
    //       lng: resp.coords.longitude
    //     },
    //     zoom: 18,
    //     tilt: 30
    //   }
    //   this.map.moveCamera(position);
    // }).catch((error) => {
    //   alert('Error getting location' + error);
    // });
  }
  addMaker(lat, lng): any {
    new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: { lat: lat, lng: lng }
    });
  }
  myloc = new google.maps.Marker({
    clickable: false,
    icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
      new google.maps.Size(22, 22),
      new google.maps.Point(0, 18),
      new google.maps.Point(11, 11)),
    shadow: null,
    zIndex: 999,
    map: this.map
  });
  loadOrderLocation() {

  }
  loadMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 }
    });
    console.log(this.map);
    this.directionsDisplay.setMap(this.map);

    var pos;
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      console.log(pos);
      // this.infoWindow.setPosition(pos);
      // this.infoWindow.setContent('Location found.');
      // this.infoWindow.open(this.map);
      this.map.setCenter(pos);
      this.addMaker(pos.lat, pos.lng);

    }).catch((error) => {
      alert('Error getting location' + error);
    });

    // let mapOptions: GoogleMapOptions = {
    //   camera: {
    //     target: {
    //       lat: 43.0741904,
    //       lng: -89.3809802
    //     },
    //     zoom: 18,
    //     tilt: 30
    //   }
    // };



    // this.map = GoogleMaps.create('map_canvas', mapOptions);
    // this.map.one(GoogleMapsEvent.MAP_READY)
    //   .then(() => {
    //     console.log('Map is ready!');
    //     this.map.setCompassEnabled(true);
    //     this.map.setMyLocationButtonEnabled(true);
    //     this.map.setMyLocationEnabled(true);
    //     this.map.setTrafficEnabled(true);
    //     this.map.setAllGesturesEnabled(true);
    //     this.directionsDisplay.setMap(this.map);
    //     this.geolocation.getCurrentPosition().then((resp) => {
    //       let pos: CameraPosition<any> = {
    //         target: {
    //           lat: resp.coords.latitude,
    //           lng: resp.coords.longitude
    //         },
    //         zoom: 12,
    //         tilt: 0
    //       };
    //       this.map.animateCamera(pos);
    //     });


    //   });
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