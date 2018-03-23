import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as firebase from 'firebase';
/**
 * Generated class for the ResetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {
  public resetPasswordForm: FormGroup;
  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController) {
    this.resetPasswordForm = formBuilder.group({
      email: ['',
        Validators.compose([Validators.required, Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpasswordPage');
  }
  resetPassword() {
    if (!this.resetPasswordForm.valid) {
      console.log(this.resetPasswordForm.value);
    } else {
      firebase.auth().sendPasswordResetEmail(this.resetPasswordForm.value.email)
        .then((user) => {
          let alert = this.alertCtrl.create({
            message: "We sent you a reset link to your email",
            buttons: [
              {
                text: "Ok",
                role: 'cancel',
                handler: () => { this.navCtrl.pop(); }
              }
            ]
          });
          alert.present();

        }, (error) => {
          var errorMessage: string = error.message;
          let errorAlert = this.alertCtrl.create({
            message: errorMessage,
            buttons: [{ text: "Ok", role: 'cancel' }]
          });
          errorAlert.present();
        });
    }
  }
}
