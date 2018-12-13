import { Injectable, ElementRef, Renderer2 } from '@angular/core';


@Injectable()
export class KindergartensTooltipService {
	parentNode: ElementRef;
	//dojo events
	tooltipEvent: any;

	// tooltip dom
	tooltip: any;

  constructor() { }

  addTooltip(view, mapView, element: ElementRef, rend: Renderer2, dataStore): void {
		this.parentNode = element;
    this.tooltip = rend.createElement('div');
    this.tooltipEvent = mapView.on("pointer-move", (event) => {
      const screenPoint = {
        // hitTest BUG, as browser fails to execute 'elementFromPoint' on 'Document'
        // FIXME bug with x coordinate value, when menu icon is in view, temp solution: change x value from 0 to any value
        x: event.x ? event.x : 600,
        y: event.y
      };

      if (this.tooltip.textContent.length > 0) {
        this.tooltip.textContent = '';
        rend.setStyle(this.tooltip, 'padding', '0px');
      };

      view.hitTest(screenPoint)
        .then(function(response) {
          if (response.results.length > 0) {
            if ((response.results[0].graphic.layer.id === 'feature-darzeliai') && (response.results[0].graphic.layer.id !== 'feature-area')) {
              const top = (event.y + 100) < window.innerHeight ? event.y + 10 + 'px' : event.y - 30 + 'px';
              const left = (event.x + 100) < window.innerWidth ? event.x + 20 + 'px' : (event.x - 110) + 'px';
              const values = response.results["0"];
              const filter = dataStore.mainInfo.filter(data => data.GARDEN_ID === values.graphic.attributes.Garden_Id);
              const textMsg = filter[0].LABEL;
              const text = rend.createText(textMsg);
              rend.appendChild(this.tooltip, text);
              rend.appendChild(element.nativeElement, this.tooltip);
              rend.addClass(this.tooltip, 'buldings-tooltip')
              rend.setStyle(this.tooltip, 'top', top);
              rend.setStyle(this.tooltip, 'left', left);
              rend.setStyle(this.tooltip, 'padding', '5px');
              rend.setProperty(document.body.style, 'cursor', 'pointer');
            } else {
              rend.setProperty(document.body.style, 'cursor', 'auto');
            }

          } else {
            rend.setProperty(document.body.style, 'cursor', 'auto');
          }

        });
    });
  }

	clearMemoryAndNodes(rend) {
		this.tooltipEvent.remove();
		rend.removeChild(this.parentNode, this.tooltip);
	}

}
