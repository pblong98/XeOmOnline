import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';
import { $ } from 'protractor';

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

  public QuickSelectedFrom = -1;
  public QuickSelectedTo = -1;

  public origin = { lat: this.from_latitude, lng: this.from_longitude };
  public destination = { lat: this.to_latitude, lng: this.to_longitude };
  public center = {lat: this.latitude, lng: this.longitude };
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

  icon3 = {
    url: "./assets/start.png",
    scaledSize: {
      width: 25,
      height: 35
    }
  }

  icon4 = {
    url: "./assets/des.png",
    scaledSize: {
      width: 25,
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
    this.MoveViewToPoint(lat, lng, 0);
    this.zoom = 15;
    this.IsShowStartLocation = true;
    this.GetDirection();
  }

  public SetDestLocation(lat, lng) {
    this.to_latitude = lat;
    this.to_longitude = lng;
    this.MoveViewToPoint(lat, lng, 0);
    this.zoom = 15;
    this.IsShowDestLocation = true;
    this.GetDirection();
  }

  public QuickSelectLocaltion(event, options) {
    var latlng = event.target.value;
    if(latlng == '-1')
        return;
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
  //mode = 1: chiếu tới điểm giữa của điểm tới và điểm bắt đầu (để nhìn thấy đc một lúc 2 điểm)
  //mode = 0: chiếu trực tiếp tới lat vs lng
  //mode = -1: chiếu về điểm đang đứng
  public MoveViewToPoint(lat, lng, mode)
  {
   // alert(lat +"  " + lng + "  " + mode)
    this.latitude += 0.0001;
    this.longitude += 0.0001;
    setTimeout(()=>{
      if(mode == -1)
      {
        
        this.latitude = this.current_latitude;
        this.longitude = this.current_longitude;
      }
      else if(this.IsShowDestLocation && this.IsShowStartLocation)
      {
        this.latitude = (Number(this.from_latitude) + Number(this.to_latitude)) / 2;
        this.longitude = (Number(this.from_longitude) + Number(this.to_longitude)) / 2;
        this.zoom = 16 - Number(this.DistanceCalculate(this.from_latitude, this.from_longitude, this.to_latitude, this.to_longitude)) * 100;
        if(this.zoom < 11)
          this.zoom = 11;
        //console.log(16 - Number(this.DistanceCalculate(this.from_latitude, this.from_longitude, this.to_latitude, this.to_longitude)) * 100);
      }
      else if(mode == 0)
      {
        //alert(lat +"  " + lng + "  " + mode)
        this.latitude = Number(lat);
        this.longitude = Number(lng);
      }
    });
  }

  public DistanceCalculate(absfrom_latitude, absfrom_longtitude, absto_latitude, absto_longtitude):Number
  {
    //alert('a');
    return Math.sqrt(Math.pow(absfrom_latitude - absto_latitude,2) + Math.pow(absfrom_longtitude - absto_longtitude,2));
  }

  protected mapReady(map) {
    this.map = map;
  }

  
  public OnMapClicked(event) {
    this.QuickSelectedFrom = -1;
    this.QuickSelectedTo = -1;
    if(!this.IsShowStartLocation && !this.IsShowDestLocation)
    {
      this.SetStartLocation(event.coords.lat, event.coords.lng);
      return;
    }
    if(this.IsShowStartLocation && !this.IsShowDestLocation)
    {
      this.SetDestLocation(event.coords.lat, event.coords.lng);
      return;
    }
    if(this.IsShowStartLocation && this.IsShowDestLocation)
    {
      this.IsShowDestLocation = false;
      this.IsShowStartLocation = false;
      return;
    }
  }

  //Tìm quãng đường ngắn nhất giữa hai điểm đã được chọn
  public GetDirection() {
    if (this.IsShowDestLocation && this.IsShowStartLocation) {
      this.origin = { lat: Number(this.from_latitude), lng: Number(this.from_longitude) };
      this.destination = {lat: Number(this.to_latitude), lng: Number(this.to_longitude) };
    }
  }

}

