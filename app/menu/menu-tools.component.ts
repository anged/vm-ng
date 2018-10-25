import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MapOptions } from '../options';
import { Symbols } from './symbols';
import { MapService } from '../map.service';
import { MenuToolsService } from './menu-tools.service';

import Draw = require('esri/views/2d/draw/Draw');
import Graphic = require('esri/Graphic');
import Polygon = require('esri/geometry/Polygon');
import geometryEngine = require('esri/geometry/geometryEngine');
import BufferParameters = require('esri/tasks/support/BufferParameters');


import forOwn from 'lodash-es/forOwn';

@Component({
  selector: 'menu-tools',
  templateUrl: './app/menu/menu-tools.component.html',
  providers: [MenuToolsService]
})

export class MenuToolsComponent {
  //set  toolsActive to false in parent component and get back menu wrapper for mobile
  @Output() close: EventEmitter<any> = new EventEmitter();

  closeToggle() {
    window.location.hash = "#";
    //emit close event
    this.close.emit(false);
  }

}
