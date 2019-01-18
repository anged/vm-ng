import { Component, Input, OnInit } from '@angular/core';

//import ScaleBar = require ("esri/widgets/ScaleBar");

import { loadModules } from 'esri-loader';
import esri = __esri;

@Component({
    selector: 'scale-map',
    template: `
      <div id="vilnius-logo"><img src="assets/img/vilnius_logo_r.png" border="0"></div>
      <div id="scale-map"></div>
    `
})

export class ScaleAndLogoComponent implements OnInit {
  @Input() view: any;

  async ngOnInit() {
		const [ScaleBar] = await loadModules([
			'esri/widgets/ScaleBar'
		]);
    let scaleBar = new ScaleBar({
      view: this.view,
      unit: 'dual'
    });

    this.view.ui.add(scaleBar, {
      position: "bottom-left"
    });
  }
}
