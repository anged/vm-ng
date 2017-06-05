import { Component, OnInit, Input } from '@angular/core';

import { MapOptions } from '../options';

import  Print = require ('esri/widgets/Print');

@Component({
    selector: 'menu-tools',
    template : `
      <div>
        <p>Pasirinkite įrankį:</p>
        <a (click)="closeToggle()" class="button close animate" title="Uždaryti">✕</a>
        <div id="tools-measure"></div>
        <div id="tools-print">
          <button id="print-button" (click)="printActive = !printActive" [class.active]="printActive">
          <span class="svg-print">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
              <path style="text-indent:0;text-align:start;line-height:normal;text-transform:none;block-progression:tb;-inkscape-font-specification:Bitstream Vera Sans" d="M 9 4 L 9 5 L 9 11 L 7 11 C 5.3550302 11 4 12.35503 4 14 L 4 23 L 4 24 L 5 24 L 9 24 L 9 27 L 9 28 L 10 28 L 22 28 L 23 28 L 23 27 L 23 24 L 27 24 L 28 24 L 28 23 L 28 14 C 28 12.35503 26.64497 11 25 11 L 23 11 L 23 5 L 23 4 L 22 4 L 10 4 L 9 4 z M 11 6 L 21 6 L 21 11 L 11 11 L 11 6 z M 7 13 L 25 13 C 25.56503 13 26 13.43497 26 14 L 26 22 L 23 22 L 23 19 L 23 18 L 22 18 L 10 18 L 9 18 L 9 19 L 9 22 L 6 22 L 6 14 C 6 13.43497 6.4349698 13 7 13 z M 8 14 C 7.4477153 14 7 14.447715 7 15 C 7 15.552285 7.4477153 16 8 16 C 8.5522847 16 9 15.552285 9 15 C 9 14.447715 8.5522847 14 8 14 z M 11 20 L 21 20 L 21 26 L 11 26 L 11 20 z" color="#000" overflow="visible" font-family="Bitstream Vera Sans"></path>
          </svg>
          </span>
          Spausdinti</button>
        </div>

        <div id="tools-opacity" style="display: none">
          <span>Sluoksnių nepermatomumo valdymas:</span>
          <div id="tools-opacity-widget"></div>
        </div>
      </div>
      <div id="print-container">
        <div id="print-menu" class="print" [class.print-active]="printActive" [ng2-draggable]="true">
        <span id="close-print"
        (click)="printActive = !printActive" [class.print-active]="printActive"
        >
            <svg xml:space="preserve" xmlns:xlink="http://www.w3.org/1999/xlink" height="612px" id="Capa_1"  version="1.1" viewBox="0 0 612 612" width="612px" x="0px" xmlns="http://www.w3.org/2000/svg" y="0px">
            <g>
              <g id="cross">
                <g>
                  <polygon points="612,36.004 576.521,0.603 306,270.608 35.478,0.603 0,36.004 270.522,306.011 0,575.997 35.478,611.397      306,341.411 576.521,611.397 612,575.997 341.459,306.011    "></polygon>
                </g>
              </g>
            </g>
            </svg>
          </span>
        <span id="drag-print" [class.print-active]="printActive">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
              <path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" d="M 16 2.5859375 L 11.292969 7.2929688 L 12.707031 8.7070312 L 15 6.4140625 L 15 12 L 17 12 L 17 6.4140625 L 19.292969 8.7070312 L 20.707031 7.2929688 L 16 2.5859375 z M 7.2929688 11.292969 L 2.5859375 16 L 7.2929688 20.707031 L 8.7070312 19.292969 L 6.4140625 17 L 13 17 L 13 15 L 6.4140625 15 L 8.7070312 12.707031 L 7.2929688 11.292969 z M 24.707031 11.292969 L 23.292969 12.707031 L 25.585938 15 L 19 15 L 19 17 L 25.585938 17 L 23.292969 19.292969 L 24.707031 20.707031 L 29.414062 16 L 24.707031 11.292969 z M 15 19 L 15 25.585938 L 12.707031 23.292969 L 11.292969 24.707031 L 16 29.414062 L 20.707031 24.707031 L 19.292969 23.292969 L 17 25.585938 L 17 19 L 15 19 z"></path>
          </svg> <span title="Keiskite padėti pelės pagalba">- keiskite padėti</span>
          </span>
        </div>
      </div>
    `
})
export class MenuToolsComponent  implements OnInit {
  @Input() viewTools: any;
  printActive: false;

  initPrint(): Print {
    return new Print({
      view: this.viewTools,
       printServiceUrl: MapOptions.mapOptions.staticServices.printServiceUrl,
      container: "print-menu"
    });
  }

  ngOnInit() {
    this.initPrint();
  }

  closeToggle() {
    window.location.hash = "#";
  }

}
