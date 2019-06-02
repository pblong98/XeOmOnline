import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-start-app',
  templateUrl: './start-app.component.html',
  styleUrls: ['./start-app.component.css']
})
export class StartAppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  LoginBtnClicked()
  {
    AppComponent.ThisApp.ComponentShowControl("in");
  }

  PassengerBtnClicked()
  {
    AppComponent.ThisApp.ComponentShowControl("map");
  }

}
