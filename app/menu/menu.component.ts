import { Component, Input, OnInit } from '@angular/core';

import { MapOptions } from '../options';
import { MapService } from '../map.service';
import { MapDefaultService } from '../themes/default/map-default.service';
import { MenuService } from './menu.service';

import { Subscription } from 'rxjs/Subscription';

import watchUtils = require("esri/core/watchUtils");

@Component({
  selector: 'menu-map',
  templateUrl: './app/menu/menu.component.html'
})
export class MenuComponent implements OnInit {
  @Input() view: any;
  @Input() allLayerslayer: any;

  mobileActive: boolean = false;
  subLayersActive: any = false;
  subListSubscribtion: Subscription;
  //get all anchor elements and run hash
  //create array from array-like object
  aTagList: any;

  themeName: string;

  visibleSubLayerNumber: number;
  //state if we want to disable help box
  componentsVisibleSubLayerNumberState: number = 1;

  options = MapOptions;

  //Hash toggle, get all anchor elements
  constructor(private mapService: MapService, private menuService: MenuService, private mapDefaultService: MapDefaultService) {
    //temporary: Hash toggle, reload, new page,
    window.location.hash = '#';
  }

  //activate mobile nav menu
  activateMenuBtn(e) {
    this.mobileActive = !this.mobileActive;
    window.location.hash = '#';
    let el = document.getElementById('menu-top');
    //activation on mobile devices
    if (this.mobileActive) {
      setTimeout(() => { el.className += " menu-active" }, 200);
    } else {
      el.classList.remove("menu-active");
    }
  }

  //activate mobile nav menu
  activateMenuBtnOnDesktopMode() {
    this.mobileActive = !this.mobileActive;
    let el = document.getElementById('menu-top');
    //activation on mobile devices
    if (this.mobileActive) {
      setTimeout(() => { el.className += " menu-active" }, 200);
    } else {
      el.classList.remove("menu-active");
    }
    //console.log("TAGS", this.mobileActive)
  }

  hash(e) {
    if (window.location.hash === e.currentTarget.getAttribute('href')) {
      window.location.hash = '#closed';
      e.preventDefault();  // AG for JQuery same as": return false (in this case, prevents event handlers after click event)
    }
  }

  closeToggle() {
    window.location.hash = "#";
  }

  //init target pseudo clas on menu
  targetTheme() {
    window.location.hash === "#theme" ? window.location.hash = "#" : window.location.hash = "#theme";
  }
  targetLayers() {
    window.location.hash === "#layers" ? window.location.hash = "#" : window.location.hash = "#layers";
  }
  targetLegend() {
    window.location.hash === "#legend" ? window.location.hash = "#" : window.location.hash = "#legend";
  }
  targetTools() {
    window.location.hash === "#tools" ? window.location.hash = "#" : window.location.hash = "#tools";
  }
  targetOpenData() {
    window.location.hash === "#open-data" ? window.location.hash = "#" : window.location.hash = "#open-data";
  }


  watchLayers() {
    watchUtils.whenTrue(this.view, "updating", (b) => {
      //console.log("b", b);
      this.componentsVisibleSubLayerNumberState = this.menuService.getVisibleSubLayerNumberState();
      //check if help box is enabled with componentsVisibleSubLayerNumberState
      if (this.componentsVisibleSubLayerNumberState) {
        this.getVisibleSubLayerNumber();
      }
    });
  }

  getVisibleSubLayerNumber() {
    this.mapService.returnThemeName() === "projektai" ?  this.visibleSubLayerNumber = this.mapService.getVisibleSubLayerNumber(this.view) : this.visibleSubLayerNumber = this.mapDefaultService.getVisibleSubLayerNumber(this.view);
  }

  closeSubListHelp() {
    this.visibleSubLayerNumber = null;
    this.componentsVisibleSubLayerNumberState = this.menuService.setVisibleSubLayerNumberState(0);
  }

  toggleSubState() {
    this.menuService.toggleSubListState();
  }

  ngOnInit(): void {
    //load message about sublayers if they are visible on Init
    //add count, as view emits layerview-create on every layer
    let count = 0;
    this.view.on("layerview-create", (event) => {
      let map = this.mapService.returnMap();
      let allLayersLayer = map.findLayerById("allLayers");
      count === 0 ? allLayersLayer.on("layerview-create", (event) => {
        // The LayerView for the layer that emitted this event
        this.getVisibleSubLayerNumber();
      }) : "";
      count +=1;
    });

    this.watchLayers();

    //get all anchor elements and run hash
    //create array from array-like object
    this.aTagList = Array.from(document.getElementsByTagName('a'));
    this.aTagList.map(a => a.addEventListener('click', this.hash, false));
    this.themeName = this.mapService.returnThemeName();
    //activate mobile nav menu as well when clicking close buttons or clicking any anchor which closes menu container on desktop mode
    // let closeList = Array.from(document.getElementsByClassName('close'));
    // closeList.map(a => a.addEventListener('click', this.activateMenuBtnOnDesktopMode, false));
    // console.log("CLOSE TAGS", closeList)
    //console.log("END");

    //subscribe to sub layer list button activation
    this.subListSubscribtion = this.menuService.subLayersActivation.subscribe(activeState => {
      this.subLayersActive = activeState;
      //get state after subscribe, if help box is closed initiate it
      if ((!this.menuService.getVisibleSubLayerNumberState()) && activeState) {
        this.componentsVisibleSubLayerNumberState = this.menuService.setVisibleSubLayerNumberState(1);
        this.getVisibleSubLayerNumber();
      }
    })
  }
}
