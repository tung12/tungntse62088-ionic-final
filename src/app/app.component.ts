import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { OrderPage, TabAll, TabStarting } from '../pages/order/order';
import { ShiperPage } from '../pages/shiper/shiper';
import { MapPage } from '../pages/map/map';
import { ProfilePage } from '../pages/profile/profile';
import { ListPage } from '../pages/list/list';
import * as firebase from 'firebase';
import 'firebase/firestore';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    // firebase.auth().onAuthStateChanged((user) => {
    //   if (!user) {
    //     this.rootPage = LoginPage;
    //   } else {
    //     this.rootPage = HomePage;
    //   }
    // });
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Shiper', component: ShiperPage },
      { title: 'Order', component: OrderPage },
      { title: 'ProfilePage', component: ProfilePage },
      { title: 'List', component: ListPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
