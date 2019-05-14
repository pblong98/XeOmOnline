import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  //Toa do GPS
  latitude = 0;
  longitude = 0;

  //Toa do nguoi dung muon di toi
  toLatitude = 10.76196756499401;
  toLongitude = 106.67907434893209;

  //
  isShowTargetPlaceBtn = false;

  title = 'FrontendApplication';

  zoom = 17;

  icon = {
    url: "./assets/userMarker.png",
    scaledSize: {
      width: 25,
      height: 35
    }
  }

  icon2 = {
    url: "./assets/driverIcon.png",
    scaledSize: {
      width: 35,
      height: 35
    }
  }
  
  ngOnInit(){
    if(window.navigator.geolocation){
        window.navigator.geolocation.getCurrentPosition(this.getLocation.bind(this));
    };
  }

  getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    } else {
        alert("Thiết bị của bạn không hỗ trợ hoặc không bật GPS !");
    }
  }

  showPosition(position) {
    this.isShowTargetPlaceBtn = true;
    this.latitude = position.coords.latitude;
    this.longitude =  position.coords.longitude; 
  }

  public origin = { lat: this.latitude, lng: this.longitude };
  public destination  = { lat: this.toLatitude, lng: this.toLongitude };

  getDirection() {
    this.origin = { lat: this.latitude, lng: this.longitude };
    this.destination = { lat: this.toLatitude, lng: this.toLongitude };
  
  }


  onMapClicked(event) {
    this.toLatitude = event.coords.lat;
    this.toLongitude = event.coords.lng;
    this.getDirection();
  }
} 


// public lat: Number = 24.799448;
// public lng: Number = 120.979021;
 
// public origin: any;
// public destination: any;
 
// ngOnInit() {
//   this.getDirection();
// }
 
// getDirection() {
//   this.origin = { lat: 24.799448, lng: 120.979021 };
//   this.destination = { lat: 24.799524, lng: 120.975017 };
 
//   // this.origin = 'Taipei Main Station';
//   // this.destination = 'Taiwan Presidential Office';
// }
// }
