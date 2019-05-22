// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { AgmCoreModule } from '@agm/core';
// import { AgmDirectionModule } from 'agm-direction';
// import { SignUpSignInComponent } from './sign-up-sign-in/sign-up-sign-in.component';

// @NgModule({
//   declarations: [
//     AppComponent,
//     SignUpSignInComponent
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     AgmCoreModule.forRoot({
//       apiKey: "AIzaSyDyXwCLnVOMKu-VFr8vwHAfruzhahv7Gxw",
//       libraries: ["places"]
//     }),
//     AgmDirectionModule      
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

import { AppComponent } from './app.component';

@NgModule({
  imports:      [ 
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDyXwCLnVOMKu-VFr8vwHAfruzhahv7Gxw',
      libraries: ["places"]
    }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AgmDirectionModule
   ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

