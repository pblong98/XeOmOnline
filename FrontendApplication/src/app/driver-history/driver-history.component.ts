import { Component, OnInit } from '@angular/core';
import {APIService} from '../API.service';
import { CookieService } from 'ngx-cookie-service';
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-driver-history',
  templateUrl: './driver-history.component.html',
  styleUrls: ['./driver-history.component.css']
})

export class DriverHistoryComponent implements OnInit {

  scr:Array<Object> = new Array<Object>();

  constructor(private Api:APIService, private CookieService:CookieService) { }

  ngOnInit() {
    this.Api.DriverGetAllHistory(this.CookieService.get('token')).subscribe(_data=>{
      var _:any = _data;
      var data = _.data;
      var listItemId = Object.getOwnPropertyNames(data);
      for(var i = 0; i < listItemId.length; i++)
      {
        this.scr.push({flat:data[listItemId[i]].start.lat.substring(0,6), flng:data[listItemId[i]].start.lng.substring(0,6), tlat:data[listItemId[i]].dest.lat.substring(0,6), tlng:data[listItemId[i]].dest.lng.substring(0,6), distance: String(data[listItemId[i]].Distance).substring(0,6), price: String(data[listItemId[i]].Price).substring(0, String(data[listItemId[i]].Price).lastIndexOf('.'))});
      }
    });
  }

  back(){
    AppComponent.ThisApp.IsInDriverMode = true;
    AppComponent.ThisApp.ComponentShowControl("map");
  }

}
