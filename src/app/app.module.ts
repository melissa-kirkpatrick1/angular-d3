import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsMapComponent } from './us-map/us-map.component';
import { WorldMapComponent } from './world-map/world-map.component';
import {CheckboxModule} from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {PackedBubbleChartService} from './services/packed-bubble-chart.service';

@NgModule({
  declarations: [
    AppComponent,
    UsMapComponent,
    WorldMapComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    CheckboxModule,
    DialogModule,
    BrowserAnimationsModule,
  ],
  providers: [PackedBubbleChartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
