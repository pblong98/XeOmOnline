

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

import { AppComponent } from './app.component';
import { DriverRegisterComponent } from './driver-register/driver-register.component';
import { BorderComponent } from './border/border.component';
import { DriverLoginComponent } from './driver-login/driver-login.component';

import { HttpClientModule } from '@angular/common/http'
import { APIService } from './API.service';
import { CookieService } from 'ngx-cookie-service';
import { StartAppComponent } from './start-app/start-app.component';
import { PassControlPanelComponent } from './pass-control-panel/pass-control-panel.component';
import { DriverControlPanelComponent } from './driver-control-panel/driver-control-panel.component';

@NgModule({
  imports:      [ 
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDyXwCLnVOMKu-VFr8vwHAfruzhahv7Gxw',
      libraries: ["places"]
    }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AgmDirectionModule,
    HttpClientModule
   ],
  declarations: [ AppComponent, DriverRegisterComponent, AppComponent, BorderComponent, DriverLoginComponent, StartAppComponent, PassControlPanelComponent, DriverControlPanelComponent  ],
  providers:    [APIService, CookieService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

