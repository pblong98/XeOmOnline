import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';
import { $ } from 'protractor';
import {APIService} from './API.service';
import { CookieService } from 'ngx-cookie-service';

declare var google;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  static ThisApp:AppComponent;

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
  public AllDriverPosMarker:any;

  public IsShowSignUpComponent;
  public IsShowSignInComponent;
  public IsShowMapComponent;
  public IsShowIndexComponent;
  public IsInDriverMode;
  public IsShowPassControlPanel;
  public IsShowDriverControlPanel;
  public IsShowDriverHistory;

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

  constructor(
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public APIService: APIService,
    private CookieService:CookieService
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
    
    this.ComponentShowControl("ind");
    AppComponent.ThisApp = this;
    this.ShowAllDriverMarker();
    this.CookieService.delete("token");
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

  public HideStartAndDestPoint()
  {
    this.IsShowDestLocation = false;
    this.IsShowStartLocation = false;
    this.from_latitude = null;
    this.from_longitude = null;
    this.to_latitude = null;
    this.to_longitude = null;
    this.MoveViewToPoint(this.latitude, this.longitude,-1)
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

  public MoveViewToCenterOf3Point()
  {
    this.latitude = (Number(this.from_latitude) + Number(this.to_latitude) + Number(this.current_latitude)) / 3;
    this.longitude = (Number(this.from_longitude) + Number(this.to_longitude) + Number(this.current_longitude)) / 3;
    this.zoom = 16 - Number(this.DistanceCalculate(this.from_latitude, this.from_longitude, this.to_latitude, this.to_longitude)) * 100;
    if(this.zoom < 11)
      this.zoom = 11;
  }

  public DistanceCalculate(absfrom_latitude, absfrom_longtitude, absto_latitude, absto_longtitude):Number
  {
    //alert('a');
    return Math.sqrt(Math.pow(absfrom_latitude - absto_latitude,2) + Math.pow(absfrom_longtitude - absto_longtitude,2));
  }

  public mapReady(map) {
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

  delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    });
  }

  ShowAllDriverMarker() {
    if(!this.IsInDriverMode)
    {
      this.APIService.GetAllDriverPos().subscribe(data =>{
        if(this.AllDriverPosMarker != null)
        {
          for(var i = 0; i < this.AllDriverPosMarker.length ; i++)
          {
            this.AllDriverPosMarker[i].setMap(null);
          }
        }
        else
        {
          this.AllDriverPosMarker = new Array();
        }
        
        var listOfDriver = Object.getOwnPropertyNames(data);
        // list of hardcoded positions markers 
        var LatLngList = {
          list : Array()   
        };
        
        for(var i = 0; i < listOfDriver.length; i++)
        {
          LatLngList.list.push(data[listOfDriver[i]]);
        }
  
        //console.log(LatLngList.list);
  
        //iterate latLng and add markers 
        for(const data of LatLngList.list){
          var marker = new google.maps.Marker({
              position: data,
              map: this.map,
              icon: this.icon2
          });
          this.AllDriverPosMarker.push(marker);
        }
        this.delay(1000)
        .then(() => {
          this.ShowAllDriverMarker();
        });     
      });
    }
  };

  public ComponentShowControl(comp)
  {
    switch(comp)
    {
      case "in":
        this.IsShowSignInComponent = true;
        this.IsShowSignUpComponent = false;
        this.IsShowMapComponent = false;
        this.IsShowIndexComponent = false;
        this.IsInDriverMode = true;
        this.IsShowPassControlPanel = false;
        this.IsShowDriverControlPanel = false;
        this.IsShowDriverHistory = false;
        break;
      case "up":
        this.IsShowSignInComponent = false;
        this.IsShowSignUpComponent = true;
        this.IsShowMapComponent = false;
        this.IsShowIndexComponent = false;
        this.IsInDriverMode = true;
        this.IsShowPassControlPanel = false;
        this.IsShowDriverControlPanel = false;
        this.IsShowDriverHistory = false;
        break;
      case "map":
        this.IsShowSignInComponent = false;
        this.IsShowSignUpComponent = false;
        this.IsShowMapComponent = true;
        this.IsShowIndexComponent = false;
        this.IsShowPassControlPanel = !this.IsInDriverMode;
        this.IsShowDriverControlPanel = this.IsInDriverMode;
        this.IsShowDriverHistory = false;
        break;
      case "ind":
        this.IsShowSignInComponent = false;
        this.IsShowSignUpComponent = false;
        this.IsShowMapComponent = false;
        this.IsShowIndexComponent = true;
        this.IsInDriverMode = false;
        this.IsShowPassControlPanel = false;
        this.IsShowDriverControlPanel = false;
        this.IsShowDriverHistory = false;
        break;
      case "his":
        this.IsShowSignInComponent = false;
        this.IsShowSignUpComponent = false;
        this.IsShowMapComponent = false;
        this.IsShowIndexComponent = false;
        this.IsInDriverMode = false;
        this.IsShowPassControlPanel = false;
        this.IsShowDriverControlPanel = false;
        this.IsShowDriverHistory = true;
        break;
    }
  }

  public ShowHistory()
  {
    this.ComponentShowControl("his");
  }

  public SignOut()
  {
    this.CookieService.deleteAll();
    this.ComponentShowControl("ind");
    //console.log("df");
  }
}
