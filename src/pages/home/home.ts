import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private backgroundMode: BackgroundMode) {
    this.trackPosition();
  }

  trackPosition() {

  }

}
