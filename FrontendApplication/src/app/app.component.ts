// /// <reference types="@types/googlemaps" />
// import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
// import { MapsAPILoader } from '@agm/core';
// import { FormControl } from "@angular/forms";
// declare let google: any;

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })

// export class AppComponent implements OnInit {

//   //Toa do GPS
//   latitude = 0;
//   longitude = 0;

//   //Toa do nguoi dung muon di toi
//   toLatitude = 10.76196756499401;
//   toLongitude = 106.67907434893209;

//   //
//   isShowTargetPlaceBtn = false;

//   title = 'FrontendApplication';

//   zoom = 17;

//   icon = {
//     url: "./assets/userMarker.png",
//     scaledSize: {
//       width: 25,
//       height: 35
//     }
//   }

//   icon2 = {
//     url: "./assets/driverIcon.png",
//     scaledSize: {
//       width: 35,
//       height: 35
//     }
//   }

//   @ViewChild("search")
//   public searchElementRef: ElementRef;
//   public searchControl: FormControl;

//   constructor(
//     public mapsAPILoader: MapsAPILoader,
//     public ngZone: NgZone
//   ) {}

//   ngOnInit() {
//     //create search FormControl
//     this.searchControl = new FormControl();

//     //load Places Autocomplete
//     this.mapsAPILoader.load().then(() => {
//       let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
//         types: ["address"]
//       });
//       autocomplete.addListener("place_changed", () => {
//         this.ngZone.run(() => {
//           //get the place result
//           let place: google.maps.places.PlaceResult = autocomplete.getPlace();

//           //verify result
//           if (place.geometry === undefined || place.geometry === null) {
//             return;
//           }

//           //set latitude, longitude and zoom
//           this.latitude = place.geometry.location.lat();
//           this.longitude = place.geometry.location.lng();
//           this.zoom = 12;
//         });
//       });
//     });

//     if (window.navigator.geolocation) {
//       window.navigator.geolocation.getCurrentPosition(this.getLocation.bind(this));
//     };
//   }


//   getLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
//     } else {
//       alert("Thiết bị của bạn không hỗ trợ hoặc không bật GPS !");
//     }
//   }

//   showPosition(position) {
//     this.isShowTargetPlaceBtn = true;
//     this.latitude = position.coords.latitude;
//     this.longitude = position.coords.longitude;
//   }

//   public origin = { lat: this.latitude, lng: this.longitude };
//   public destination = { lat: this.toLatitude, lng: this.toLongitude };

//   GetDirection() {
//     this.origin = { lat: this.latitude, lng: this.longitude };
//     this.destination = { lat: this.toLatitude, lng: this.toLongitude };

//   }


//   OnMapClicked(event) {
//     this.toLatitude = event.coords.lat;
//     this.toLongitude = event.coords.lng;
//     this.GetDirection();
//   }
// }


// // public lat: Number = 24.799448;
// // public lng: Number = 120.979021;

// // public origin: any;
// // public destination: any;

// // ngOnInit() {
// //   this.GetDirection();
// // }

// // GetDirection() {
// //   this.origin = { lat: 24.799448, lng: 120.979021 };
// //   this.destination = { lat: 24.799524, lng: 120.975017 };

// //   // this.origin = 'Taipei Main Station';
// //   // this.destination = 'Taiwan Presidential Office';
// // }
// // }


import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';

declare var google;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public latitude: number;
  public longitude: number;
  public searchFromControl: FormControl;
  public searchToControl: FormControl;
  public zoom: number;

  public current_latitude: number;
  public current_longitude: number;

  public from_latitude: number;
  public from_longitude: number;
  public IsShowStartLocation: boolean;

  public to_latitude: number;
  public to_longitude: number;
  public IsShowDestLocation: boolean;

  public origin = { lat: this.from_latitude, lng: this.from_longitude };
  public destination = { lat: this.to_latitude, lng: this.to_longitude };
  protected map: any;

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

  @ViewChild("searchFrom")
  public searchFromElementRef: ElementRef;

  @ViewChild("searchTo")
  public searchToElementRef: ElementRef;

  constructor(
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone
  ) { }

  ngOnInit() {
    //set google maps defaults
    this.zoom = 17;
    this.IsShowDestLocation = false;
    this.IsShowStartLocation = false;
    //create search FormControl
    this.searchFromControl = new FormControl();
    this.searchToControl = new FormControl();

    //set current position
    this.SetStartUpLocation();
    
    //load from place Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchFromElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.SetStartLocation(place.geometry.location.lat(), place.geometry.location.lng());

        });
      });
    });

    //load to place Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchToElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.SetDestLocation(place.geometry.location.lat(), place.geometry.location.lng());
        });
      });
    });

    
  }

  public SetStartLocation(lat, lng) {
    this.from_latitude = lat;
    this.from_longitude = lng;
    this.MoveViewToPoint(lat, lng);
    this.zoom = 15;
    this.IsShowStartLocation = true;
    this.GetDirection();
  }

  public SetDestLocation(lat, lng) {
    this.to_latitude = lat;
    this.to_longitude = lng;
    this.MoveViewToPoint(lat, lng);
    this.zoom = 15;
    this.IsShowDestLocation = true;
    this.GetDirection();
  }

  public QuickSelectLocaltion(event, options) {
    var latlng = event.target.value;
    var lat = latlng.substring(0,latlng.lastIndexOf(','));
    var lng = latlng.substring(latlng.lastIndexOf(',')+1);
    //console.log(latlng + "   " + lat + "   " + lng);
    switch (options) {
      case "from":
        this.SetStartLocation(lat, lng);
        break;
      case "to":
        this.SetDestLocation(lat, lng);
        break;
    }
  }

  //Lấy tọa độ GPS và hiện lên bản đồ
  public SetStartUpLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.current_latitude = position.coords.latitude;
        this.current_longitude = position.coords.longitude;
        this.latitude = this.current_latitude;
        this.longitude = this.current_longitude;
        this.zoom = 17;
      });
    }
  }

  //Chi chuyển view của bản đồ tới một điểm khác
  public MoveViewToPoint(lat, lng)
  {
    setTimeout(()=>{
      if(this.IsShowDestLocation && this.IsShowStartLocation)
      {
        this.latitude = (Number(this.from_latitude) + Number(this.to_latitude)) / 2;
        this.longitude = (Number(this.from_longitude) + Number(this.to_longitude)) / 2;
        this.zoom = 16 - Number(this.DistanceCalculate(this.from_latitude, this.from_longitude, this.to_latitude, this.to_longitude)) * 100;
        if(this.zoom < 11)
          this.zoom = 11;
        //console.log(16 - Number(this.DistanceCalculate(this.from_latitude, this.from_longitude, this.to_latitude, this.to_longitude)) * 100);
      }
      else
      {
        this.latitude = Number(lat);
        this.longitude = Number(lng);
      }
    });
  }

  public DistanceCalculate(absfrom_latitude, absfrom_longtitude, absto_latitude, absto_longtitude):Number
  {
    return Math.sqrt(Math.pow(absfrom_latitude - absto_latitude,2) + Math.pow(absfrom_longtitude - absto_longtitude,2));
  }

  protected mapReady(map) {
    this.map = map;
  }

  public OnMapClicked(event) {
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    console.log(this.latitude);
    console.log(this.longitude);
    this.GetDirection();
  }

  //Tìm quãng đường ngắn nhất giữa hai điểm đã được chọn
  public GetDirection() {
    if (this.IsShowDestLocation && this.IsShowStartLocation) {
      this.origin = { lat: Number(this.from_latitude), lng: Number(this.from_longitude) };
      this.destination = {lat: Number(this.to_latitude), lng: Number(this.to_longitude) };
    }
  }

}

