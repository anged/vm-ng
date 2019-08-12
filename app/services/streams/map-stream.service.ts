import { Injectable } from '@angular/core';
import { MapService } from '../../map.service';

import StreamLayer = require('esri/layers/StreamLayer');
import Renderer = require('esri/renderers/Renderer');

@Injectable()
export class MapStreamService extends MapService {

  addStream(url: string) {
    // create stream layer 
    const streamLayer = new StreamLayer({
      url: url,
    });

    streamLayer.renderer = {
      type: "simple",  // autocasts as new SimpleRenderer()
      symbol: {
        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
        size: 6,
        color: "black",
        outline: {  // autocasts as new SimpleLineSymbol()
          width: 0.5,
          color: "white"
        }
      } 
    } as any as Renderer;
    
    return streamLayer;

  }

}