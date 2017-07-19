import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { BackgroundMode } from '@ionic-native/background-mode';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  notificationAlreadyReceived = false;
  originalCoords;
  DISTANCE_TO_MOVE = 0.003069;

  constructor(
    public backgroundMode: BackgroundMode,
    public platform: Platform,
    public geolocation: Geolocation,
    public localNotifications: LocalNotifications) {

    platform.ready().then(() => {
      this.geolocation.getCurrentPosition()
        .then(position => {
          this.originalCoords= position.coords;
        })
        .catch((error) => {
          console.log('error', error);
        })

      this.backgroundMode.on('activate').subscribe((res) => {
        console.log('activated', res);
        setInterval(this.trackPosition, 2000);
      });

      this.backgroundMode.enable();
    })
  }

  trackPosition = () => {
    this.geolocation.getCurrentPosition()
      .then((position) => {
        this.handleMovement(position.coords);
      })
      .catch((error) => {
        console.log('error', error);
      })
  }

  handleMovement = (coords) =>  {
    const distanceMoved = this.getDistanceFromLatLonInKm(
      this.originalCoords.latitude,
      this.originalCoords.longitude,
      coords.latitude,
      coords.longitude)

    if (distanceMoved > this.DISTANCE_TO_MOVE && this.notificationAlreadyReceived === false) {
      this.showNotification();
    }
  }

  showNotification = () => {
    this.localNotifications.schedule({
      text: 'There is a legendary Pokemon near you'
    });

    this.notificationAlreadyReceived = true;
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
   }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }
}
