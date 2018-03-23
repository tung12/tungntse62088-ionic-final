import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SignupPage } from '../pages/signup/signup';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';
import { OrderPage } from '../pages/order/order';
import { ShiperPage } from '../pages/shiper/shiper';
import { ProfilePage } from '../pages/profile/profile';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { environment } from '../enviroments/enviroment';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps
} from '@ionic-native/google-maps';
import { HttpModule } from '@angular/http';
firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage, OrderPage, ShiperPage, ProfilePage, SignupPage, ResetpasswordPage, MapPage
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage, OrderPage, ShiperPage, ProfilePage, SignupPage, ResetpasswordPage, MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen, Geolocation, GoogleMaps,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
