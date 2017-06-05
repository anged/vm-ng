import { Component, Input, OnInit } from '@angular/core';

import { MapOptions } from '../options';
import { MapService } from '../map.service';

@Component({
  selector: 'menu-map',
  templateUrl: './app/menu/menu.component.html'
})
export class MenuComponent implements OnInit {
  @Input() view: any;

  mobileActive: boolean = false;
  //get all anchor elements and run hash
  //create array from array-like object
  aTagList: any;

  themeName: string;

  options = MapOptions;

  //Hash toggle, get all anchor elements
  constructor(private mapService: MapService) {
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

  ngOnInit(): void {
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
  }
}
