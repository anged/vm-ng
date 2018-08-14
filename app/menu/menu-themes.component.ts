import { Component, OnInit } from '@angular/core';

import { MapOptions } from '../options';

import  domConstruct = require ('dojo/dom-construct');

import values from 'lodash-es/values';

@Component({
    selector: 'menu-themes',
    template: `
      <div class="menu-header">
        <p>Pasirinkite temą:</p>
        <a (click)="closeToggle()" class="button close animate" title="Uždaryti">✕</a>

				<h2>Pagrindinės temos</h2>
				<div *ngFor="let theme of themes; let i=index; let odd=odd">
					<div *ngIf="theme.production && !theme.hide  && !theme.external && !theme.custom" class="sub-theme" [class.align-left]="!odd" [class.align-right]="odd" [class.current-theme]="theme.id===currentThemeName">
						<a *ngIf="!theme.url && !theme.custom" routerLink="/{{theme.id}}">
							<img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
						</a>
						<a *ngIf="theme.url" [href]="theme.url">
							<img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
						</a>
						<a *ngIf="!theme.url && theme.custom" [href]="theme.id">
							<img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
						</a>
						<p>{{theme.name}}</p>
					</div>
				</div>

				<h2>Papildomo funkcionalumo temos</h2>
				<div *ngFor="let theme of themes; let i=index; let odd=odd">
					<div *ngIf="theme.production && !theme.hide && !theme.external && theme.custom" class="sub-theme" [class.align-left]="!odd" [class.align-right]="odd" [class.current-theme]="theme.id===currentThemeName">
						<a *ngIf="!theme.url && !theme.custom" routerLink="/{{theme.id}}">
							<img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
						</a>
						<a *ngIf="theme.url" [href]="theme.url">
							<img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
						</a>
						<a *ngIf="!theme.url && theme.custom" [href]="theme.id">
							<img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
						</a>
						<p>{{theme.name}}</p>
					</div>
				</div>

				<h2>3 šalių aplikacijos</h2>
				<div *ngFor="let theme of themes; let i=index; let odd=odd">
					<div *ngIf="theme.production && !theme.hide && theme.external" class="sub-theme" [class.align-left]="!odd" [class.align-right]="odd" [class.current-theme]="theme.id===currentThemeName">
						<a *ngIf="theme.url" rel="noopener noreferrer" target="_blank" [href]="theme.url">
							<img [src]="theme.imgUrl" [alt]="theme.imgAlt"/>
						</a>
						<p>{{theme.name}}</p>
					</div>
				</div>
      </div>
    `
})
export class MenuThemesComponent  implements OnInit {
	themes: any[];
	currentThemeName: string;

  _getUrlQueryName(name, url='') {
    if (!url) url = window.location.href;
    url = url.toLowerCase(); // avoid case sensitiveness
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  currentTheme() {
    return this._getUrlQueryName("theme");
  }

  closeToggle() {
    window.location.hash = "#";
  }

  currenthemeLabel() {
    var theme = this.currentTheme();
    var themeDom = document.getElementById("theme");
    var themeDomDivs = themeDom.getElementsByTagName("div");
    for (var i = 0; i < themeDomDivs.length; i++) {
      //TODO refactor current-theme method as logic changed
      if ((themeDomDivs[i].id === theme) || (themeDomDivs[i].id === window.location.pathname.slice(1))) {
        themeDomDivs[i].className += " current-theme";
      } else {
        //TODO remove temp solution for itv oprojects
        if (window.location.pathname === "/projektai") {
            document.getElementById("projektai") ? document.getElementById("projektai").className += " current-theme" : "";
        }
        //AG else: remove class from element TODO: check if class exists
        themeDomDivs[i].className = themeDomDivs[i].className.replace( /(?:^|\s)current-theme(?!\S)/g , '' );
        //AG TEMP default theme #buildings
        if ((!theme) && (window.location.pathname === "/maps_vilnius/")) {
          document.getElementById("theme-buildings").className += " current-theme";
        }
      }
    }
  }

  createThemeDom() {
    var themesObj = MapOptions.themes;
    var count = 1;
    for (var theme in themesObj) {
      if (themesObj.hasOwnProperty(theme)) {
        var divTag, aTag, pTag, imgTag, alignClass, urlTag;
        divTag = aTag = pTag = imgTag = alignClass = urlTag = null;
        if (themesObj.hasOwnProperty(theme)&&(themesObj[theme].production)&&(!themesObj[theme].hide)) {
          count ++;
          var countMod;
          countMod = count % 2 > 0 ? alignClass = "align-right" : alignClass = "align-left" ;
          divTag = domConstruct.create("div", {id: themesObj[theme].id, class: "sub-theme " + alignClass, style: ""}, "theme", "last"); //AG static width in px, because we're using overflow-y: auto in main div
          urlTag = !themesObj[theme].url
            ?
              //("./?theme=" + themesObj[theme].id)
              //add id string to url path
              ("./" +themesObj[theme].id)
            :
              (themesObj[theme].url); //check if theme has url defined
          aTag = domConstruct.create("a", {href: urlTag}, divTag);
          imgTag = domConstruct.create("img", {src: themesObj[theme].imgUrl, alt: themesObj[theme].imgAlt}, aTag);
          pTag = domConstruct.create("p", {innerHTML: themesObj[theme].name}, divTag);
        }
      }
    }
  }

  ngOnInit() {
		this.themes = values(MapOptions.themes);
		this.currentThemeName = window.location.pathname.slice(1);
		//console.log('Current theme', this.currentThemeName);
  }
}
