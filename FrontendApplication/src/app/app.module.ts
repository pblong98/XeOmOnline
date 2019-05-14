import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDyXwCLnVOMKu-VFr8vwHAfruzhahv7Gxw"
    }),
    AgmDirectionModule      
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
