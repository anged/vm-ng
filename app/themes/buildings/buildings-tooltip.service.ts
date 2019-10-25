import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { EventEmitter } from 'events';
import { Observable, fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class BuildingsTooltipService {
  //dojo events
  tooltipEvent: any;
  // tooltip dom
  tooltip: any;
  unsubsribe$: Subject<void>;
  parentNode: ElementRef;
  private clear = false;
  constructor() { }

  addTooltip(view, mapView, element: ElementRef, rend: Renderer2) {
    const tooltip = rend.createElement('div');
    this.tooltip = tooltip;
    this.parentNode = element;
    this.clear = false;
    rend.appendChild(element.nativeElement, this.tooltip);
    const requestAnimationFrame = window.requestAnimationFrame.bind(window)
    let stop = true;

    this.unsubsribe$ = new Subject<void>();

    fromEvent(document, 'pointermove').pipe(
      takeUntil(this.unsubsribe$)
    ).subscribe((e) => {
      if ((e.target as Element).tagName === 'CANVAS') {
        stop = false;
      } else {
        stop = true;
      }
    });

    this.tooltipEvent = mapView.on("pointer-move", (event) => {
      const screenPoint = {
        // hitTest BUG, as browser fails to execute 'elementFromPoint' on 'Document'
        // FIXME bug with x coordinate value, when menu icon is in view, temp solution: change x value from 0 to any value
        x: event.x ? event.x : 600,
        y: event.y
      };

      if (tooltip.textContent.length > 0) {
        tooltip.textContent = '';
        rend.setStyle(tooltip, 'padding', '0px');
      };

      let response;
      view.hitTest(screenPoint)
        .then((response) => {
          // TEMP use address atribute for temp condition by showing only tooltip on buildings layer
          if (response.results.length > 0 && response.results[0].graphic.attributes.ADRESAS) {
            const newRsponse = response.results[0].graphic.attributes.ADRESAS;
            stop = false;
            if (response !== newRsponse) {
              drawTooltip(response, event);
            }

            response = newRsponse;
          } else {
            stop = true;
            rend.setProperty(document.body.style, 'cursor', 'auto');
          }
        });
    });

    let x = 0;
    let y = 0;

    const self = this;

    function drawTooltip(response, event) {
      function draw() {
        rend.setProperty(document.body.style, 'cursor', 'pointer');

        if (stop || self.clear) {
          rend.setStyle(tooltip, 'display', 'none');
          return;
        }

        const top = (event.y + 100) < window.innerHeight ? window.innerHeight - event.y + 10 + 'px' : window.innerHeight - event.y - 30 + 'px';
        const left = (event.x + 100) < window.innerWidth ? event.x + 20 + 'px' : (event.x - 110) + 'px';
        // using 2 feature layers with different attributes
        const values = response.results[0] ? response.results[0]: response.results[1];
        // don't add tooltip in case of stop variable
        // or in case we hit graphic object with no attributes
        if (!stop && values.graphic.attributes) {
          // using 2 feature layers with different attributes
          const textMsg = values.graphic.attributes.ADRESAS ? `${values.graphic.attributes.ADRESAS}` : `${values.graphic.attributes.Pavad}`;
          
          tooltip.innerHTML = textMsg;
          rend.addClass(tooltip, 'buldings-tooltip');
          rend.setStyle(tooltip, 'transform', "translate3d(" + left + ", -" + top + ", 0)");
          rend.setStyle(tooltip, 'padding', '5px');
          rend.setStyle(tooltip, 'display', 'block');
        }

        requestAnimationFrame(draw);
      }

      requestAnimationFrame(draw);
    }
 
  }

  clearMemoryAndNodes(rend) {
    this.clear = true;
		if (this.tooltipEvent) {
			this.tooltipEvent.remove();
    }
    
    this.unsubsribe$.next();
    this.unsubsribe$.complete();
    this.unsubsribe$ = null;

    rend.removeChild(this.parentNode, this.tooltip);
  }

}
