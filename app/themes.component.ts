import { Component, OnInit } from '@angular/core';

import { MapService } from './map.service';
import { MapOptions } from './options';
import { themesTransition } from './animations/themes-transition'

import domConstruct = require('dojo/dom-construct');

import values from 'lodash-es/values';

@Component({
  selector: 'themes-map',
	animations:  [themesTransition],
  styles: [`
		h2 {
			width: 100%;
	    display: inline-block;
	    padding: 40px 30px 40px;
			margin-bottom: 0;
			font-size: 28px;
	    line-height: 1.6;
		}
		.border-line {
			width: 100%;
	    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		}
    .row.themes-component {
      margin: 0;
      text-align: center;
      color: #dadada;
    }
    .row.themes-component h1 {
			display: none;
			float: left;
			width: 180px;
      padding: 8px 10px 0;
			margin-top: 0;
      margin-left: 0;
			font-size: 14px;
			letter-spacing: -0.4px;
      text-align: left;
      font-weight: 600;
			color: #dadada;
			line-height: 1.4;
    }
    .themes-page-logo {
			padding-top: 15px;
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
      font-size: 14px;
      font-weight: 800;
      position: relative;
      top: 5px;
			color: #fff;
    }
    .row.themes-component .themes-page-logo img  {
      margin: 0 auto;
      width: 90px;
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
		@media only screen and (min-width: 480px) {
			.row.themes-component h1 {
				display: none;
			}
			.row.themes-component .themes-page-logo img  {
				float: left;
				margin-left: 20px;
	      width: 90px;
	    }
			.themes-page-logo span {
	      top: 25px;
			}
		}
  `],
  template: `
  <div class="row themes-component" id="themes-container" @themesTransition>
    <div class="themes-page-logo">
      <img src="./app/img/vilnius_logo.png" alt="Vilniaus miesto interaktyvūs žemėlapiai" class="anim-trigger" border="0">
      <h1>Vilniaus miesto interaktyvūs žemėlapiai</h1>
      <span class="anim-trigger">Pasirinkite temą</span>
    </div>
		<h2 class="anim-trigger">Pagrindinės temos</h2>
		<div class="border-line line-animation"></div>
    <div *ngFor="let theme of themes; let i=index; let odd=odd">
      <div *ngIf="theme.production && !theme.hide  && !theme.external && !theme.custom" class="col-xs-6 col-sm-3 animate themes-row">
        <a *ngIf="!theme.url && !theme.custom" [routerLink]="[theme.id]">
          <img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
          <p>{{theme.name}}</p>
        </a>
      </div>
    </div>
		<h2>Papildomo funkcionalumo temos</h2>
		<div class="border-line"></div>
    <div *ngFor="let theme of themes; let i=index; let odd=odd">
      <div *ngIf="theme.production && !theme.hide && !theme.external && theme.custom" class="col-xs-6 col-sm-3 animate themes-row">
        <a *ngIf="!theme.url && !theme.custom" routerLink="/{{theme.id}}">
          <img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
          <p>{{theme.name}}</p>
        </a>
				<a *ngIf="theme.url" [href]="theme.url">
					<img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
					<p>{{theme.name}}</p>
				</a>
				<a *ngIf="!theme.url && theme.custom" routerLink="/{{theme.id}}">
					<img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
					<p>{{theme.name}}</p>
				</a>
      </div>
    </div>
		<h2>Kiti žemėlapiai</h2>
		<div class="border-line"></div>
    <div *ngFor="let theme of themes; let i=index; let odd=odd">
      <div *ngIf="theme.production && !theme.hide && theme.external" class="col-xs-6 col-sm-3 animate themes-row">
        <a *ngIf="theme.url" rel="noopener noreferrer" target="_blank" [href]="theme.url">
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

  constructor(private _mapService: MapService) {}

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
		this.themes = values(MapOptions.themes);
  }
}
