import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-position-move-simulator',
  templateUrl: './position-move-simulator.component.html',
  styleUrls: ['./position-move-simulator.component.css']
})
export class PositionMoveSimulatorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isActive = false;
  isOn = false;
  onoff = "ON";

  delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    });
  }

  switch()
  {
    this.isOn = !this.isOn;
    AppComponent.ThisApp.IsInSimulatorMode = !this.isOn;
    if(this.isOn)
    {
      this.onoff = "OFF";
    }
    else
    {
      this.onoff = "ON";
    }
  }

  up()
  {
    this.isActive = true;
    this.change("up");
  }

  _up()
  {
    this.isActive = false;
  }

  down()
  {
    this.isActive = true;
    this.change("down");
  }

  _down()
  {
    this.isActive = false;
  }

  left()
  {
    this.isActive = true;
    this.change("left");
  }

  _left()
  {
    this.isActive = false;
  }

  right()
  {
    this.isActive = true;
    this.change("right");
  }

  _right()
  {
    this.isActive = false;
  }

  private change(dir)
  {
    if(!this.isOn)
    {
      return;
    }
    if(this.isActive)
    {
      switch (dir) {
        case "right":
          AppComponent.ThisApp.current_longitude+=0.0001;
          break;
        case "left":
        AppComponent.ThisApp.current_longitude-=0.0001;
          break;
        case "up":
        AppComponent.ThisApp.current_latitude+=0.0001;
          break;
        case "down":
        AppComponent.ThisApp.current_latitude-=0.0001;
          break;
        default:
          break;
      }
      this.delay(100).then(()=>{
        this.change(dir);
      });
      
    }
  }

}
