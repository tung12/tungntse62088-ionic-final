import { Component, ChangeDetectorRef } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, AngularFirestoreCollection } from 'angularfire2/firestore';
import { LoadingController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
@Component({
  template: `
    <ion-tabs>
      <ion-tab tabIcon="heart" [root]="tab1"></ion-tab>
      <ion-tab tabIcon="star" [root]="tab2"></ion-tab>
    </ion-tabs>`
})
export class OrderPage {

  tab1: any;
  tab2: any;

  constructor() {
    this.tab1 = TabStarting;
    this.tab2 = TabAll;
  }
}

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Shipping</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
  <ion-list>
  <ion-item *ngFor="let order of arrayOrders ">
    <h2 >{{order.detail.nameUser}}</h2>
    <p >{{order.detail.address}}</p>
    <button ion-button clear item-end *ngIf="order.detail.assigned == true" disabled>Starting</button>
    <button ion-button clear item-end *ngIf="order.detail.assigned == false" (click)="setOrderToStart(order)">Start</button>
    <button ion-button clear item-end (click)="completeConfirm(order)">Complete</button>
    <button ion-button clear item-end>Detail</button>
  </ion-item>
</ion-list>
</ion-content>`
})
export class TabStarting {
  public arrayOrders: any[];
  public arrayOrder: Observable<DocumentChangeAction[]>;
  // public dbShipers = firebase.firestore().collection('Shipers');
  // public dbOrders = firebase.firestore().collection('Orders');
  collection: AngularFirestoreCollection<any>;
  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController, public ref: ChangeDetectorRef, private db: AngularFirestore) {
    this.collection = db.collection('Orders', ref => ref.where("idShiper", "==", "1hRCHEtOoiUPSzEVHOLU5CCTbMD3"));
    this.arrayOrder = db.collection('Orders', ref => ref.where("idShiper", "==", "1hRCHEtOoiUPSzEVHOLU5CCTbMD3").where("status", "==", false)).snapshotChanges();
    this.arrayOrder.subscribe(arr => {
      var tmp = [];
      arr.forEach(snap => {
        tmp.push({ id: snap.payload.doc.id, detail: snap.payload.doc.data() });
      });
      this.arrayOrders = tmp;
      console.log(this.arrayOrders);
    });
  }


  ionViewDidLoad() {
    // if (firebase.auth().currentUser) {
    // this.loginParams = firebase.auth().currentUser.uid;
    // console.log("LoginPagrams: " + this.loginParams);
    // this.loadOrder().then((data: any) => {
    //   this.arrayOrder = data;
    //   console.log("arrayOrder:" + this.arrayOrder[0]);

    // })
    //   .catch((error: any) => {
    //     console.log(error.message);
    //   });;

    //this.calculateAndDisplayRoute();
    // }
    // else {
    //   this.navCtrl.push('LoginPage');
    // }

  }
  completeConfirm(order) {
    let alert = this.alertCtrl.create({
      title: 'Confirm complete',
      message: 'Do you want to complete this book?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Complete',
          handler: () => {
            this.setOrderToComplete(order);

          }
        }
      ]
    });
    alert.present();
  }
  continuousFunction() {

  }
  continuousConfirm(order) {
    let alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'Do you want to complete this book?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Complete',
          handler: () => {
            this.setOrderToComplete(order);

          }
        }
      ]
    });
    alert.present();
  }
  setOrderToComplete(order) {
    var loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    //console.log(order);





    // var tmp = this.db.collection('Orders', ref => ref.where("idShiper", "==", "1hRCHEtOoiUPSzEVHOLU5CCTbMD3").where("assigned", "==", true)).snapshotChanges();
    // var uid;   
    this.db.doc('Orders/' + order.id).update({ assigned: false, status: true });
    loader.dismiss();

  }
  setOrderToStart(order) {
    var loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    //console.log(order);





    var tmp = this.db.collection('Orders', ref => ref.where("idShiper", "==", "1hRCHEtOoiUPSzEVHOLU5CCTbMD3").where("assigned", "==", true)).snapshotChanges();
    var uid;

    tmp.subscribe(data => {
      data.map(da => {
        //console.log(da.payload.doc.id);
        uid = da.payload.doc.id;
        console.log(uid);
        this.db.doc('Orders/' + uid).update({ assigned: false });

      });

    }).unsubscribe();
    this.db.doc('Orders/' + order.id).update({ assigned: true });
    loader.dismiss();





    //console.log(data.forEach);





    // }

    //  loadOrder(): Observable<any[]> {

    //     return this.db.

    //   return
    //   this.dbOrders.where("idShiper", "==", "1hRCHEtOoiUPSzEVHOLU5CCTbMD3").get().then(function (querySnapshot) {
    //     var orders = [];
    //     querySnapshot.forEach(function (doc) {
    //       // doc.data() is never undefined for query doc snapshots
    //       //console.log(doc.id, " => ", doc.data());
    //       //return doc.data();

    //       orders.push({ id: doc.id, detail: doc.data() });

    //     });

    //   });


  }
}
@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>All</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>Tab 2</ion-content>`
})
export class TabAll { }