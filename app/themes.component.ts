import { Component, OnInit } from '@angular/core';

import { MapService } from './map.service';
import { MapOptions } from './options';

import domConstruct = require('dojo/dom-construct');

import values from 'lodash-es/values';

@Component({
  selector: 'themes-map',
  styles: [`
    .row.themes-component {
      margin: 0;
      text-align: center;
      color: #dadada;
    }
    .row.themes-component h1 {
      color: #dadada;
      line-height: 1.4;
      padding: 8px 10px 0;
      font-size: 14px;
      letter-spacing: -0.4px;
      float: left;
      margin-left: 0;
      width: 180px;
      text-align: left;
      font-weight: 600;
    }
    .themes-page-logo {
      padding-top: 30px;
      padding-bottom: 30px;
      background: #464646;
      margin-bottom: 0;
      min-height: 110px;
    }
    .themes-page-logo span {
      text-transform: uppercase;
      letter-spacing: 3px;
      word-spacing: 6px;
      font-size: 14px;
      font-weight: 400;
      position: relative;
      top: 15px;
    }
    .row.themes-component .themes-page-logo img  {
      float: left;
      margin-left: 20px;
      width: 60px;
    }
    .row.themes-component {
      margin: 0;
      text-align: center;
      width: 100%;
      height: 100%;
      background-color: #3a3a3a;
      position: fixed;
      overflow-x: auto;
    }
  `],
  template: `
  <div class="row themes-component" id="themes-container">
    <div class="themes-page-logo">
      <img src="./app/img/vilnius_logo_r.png" border="0">
      <h1>Vilniaus miesto interaktyvūs žemėlapiai</h1>
      <span>Pasirinkite temą</span>
    </div>
    <div *ngFor="let theme of themes; let i=index; let odd=odd">
      <div *ngIf="theme.production && !theme.hide" class="col-xs-6 col-sm-3 animate themes-row">
        <a *ngIf="!theme.url && !theme.custom" [routerLink]="[theme.id]">
          <img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
          <p>{{theme.name}}</p>
        </a>
        <a *ngIf="theme.url" [href]="theme.url">
          <img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
          <p>{{theme.name}}</p>
        </a>
        <a *ngIf="!theme.url && theme.custom" [href]="theme.id">
          <img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
          <p>{{theme.name}}</p>
        </a>
      </div>
    </div>
  </div>
  `
})
export class ThemesComponent implements OnInit {

  themes: any[];

  constructor(private _mapService: MapService) {
    this.themes = values(MapOptions.themes);
  }

  createThemeDom() {
    const themesObj = MapOptions.themes;
    let count = 1;
    for (let theme in themesObj) {
      if (themesObj.hasOwnProperty(theme)) {
        let divTag, aTag, pTag, imgTag, alignClass, urlTag;
        divTag = aTag = pTag = imgTag = alignClass = urlTag = null;
        if (themesObj.hasOwnProperty(theme) && (themesObj[theme].production) && (!themesObj[theme].hide)) {
          count++;
          let countMod;
          countMod = count % 2 > 0 ? alignClass = "themes-row" : alignClass = "themes-row";
          divTag = domConstruct.create("div", { id: themesObj[theme].id, class: "col-xs-6 col-sm-3 animate " + alignClass, style: "" }, "themes-container", "last"); //AG static width in px, because we're using overflow-y: auto in main div
          urlTag = !themesObj[theme].url
            ?
            //("./?theme=" + themesObj[theme].id)
            //add id string to url path
            ("./" + themesObj[theme].id)
            :
            (themesObj[theme].url); //check if theme has url defined
          aTag = domConstruct.create("a", { href: urlTag }, divTag);
          imgTag = domConstruct.create("img", { src: themesObj[theme].imgUrl, alt: themesObj[theme].imgAlt }, aTag);
          pTag = domConstruct.create("p", { innerHTML: themesObj[theme].name }, aTag);
        }
      }
    }
  }

  ngOnInit() {
    //this.createThemeDom();
    //console.log(this.themes);
  }
}
