import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FrontendApplication';
  latitude = 10.765382548101503;
  longitude = 106.68175655794698;
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

  onMapClicked(event)
  {
    this.longitude = event.coords.lng;
    this.latitude = event.coords.lat;
    console.log(event);
  }
} 
