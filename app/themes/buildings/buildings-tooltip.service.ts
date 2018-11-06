import { Injectable, ElementRef, Renderer2 } from '@angular/core';

@Injectable()
export class BuildingsTooltipService {

  constructor() { }

  addTooltip(view, mapView, element: ElementRef, rend: Renderer2) {
		const tooltip = rend.createElement('div');
		rend.appendChild(element.nativeElement, tooltip);
		const requestAnimationFrame = window.requestAnimationFrame.bind(window)
    //const tooltip = rend.createElement('div');
		//rend.appendChild(element.nativeElement, tooltip);
		let stop = true;
    const tooltipEvent = mapView.on("pointer-move", (event) => {
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

      view.hitTest(screenPoint)
        .then((response) => {

					if (response.results.length > 0) {
						//rend.appendChild(element.nativeElement, tooltip);
						stop = false;
						drawTooltip(response, event)
					} else {
						stop = true;
						rend.setProperty(document.body.style, 'cursor', 'auto');
						//rend.setProperty(document.body.style, 'cursor', 'auto');
						//rend.removeChild(element.nativeElement, tooltip);
					}
				});
    });

		let moveRaFTimer;
		let x = 0;
		let y = 0;
		let textAddress: string;

    function drawTooltip(response, event) {
      //console.log("hittest",  x, event.x, Math.abs(x - event.x ));
			// const values = response.results["0"];
			// const textMsg = `${values.graphic.attributes.ADRESAS}`;
			// const text = rend.createText(textMsg);
			if (stop) {
				return;
			}
			function draw(now) {

				//console.log("frame timstamp", now);
				//const top = (event.y + 100) < window.innerHeight ? event.y + 10 + 'px' : event.y - 30 + 'px';
				//const left = (event.x + 100) < window.innerWidth ? event.x + 20 + 'px' : (event.x - 110) + 'px';
				const top = (event.y + 100) < window.innerHeight ? window.innerHeight - event.y + 10 + 'px' : window.innerHeight - event.y - 30 + 'px';
				const left = (event.x + 100) < window.innerWidth ? event.x + 20 + 'px' : (event.x - 110) + 'px';
				const values = response.results["0"];
				x += (event.x - x) * 0.5;
				y += (event.y - y)  * 0.5;

				// don't add tooltip in case of stop variable
				// or in case we hit graphic object with no attributes
				if (!stop && values.graphic.attributes) {
					const textMsg = `${values.graphic.attributes.ADRESAS}`;
					const text = rend.createText(textMsg);
					tooltip.innerHTML  = textMsg;
					//rend.appendChild(tooltip, text);
					// rend.appendChild(element.nativeElement, tooltip);
					rend.addClass(tooltip, 'buldings-tooltip');
					//rend.setStyle(tooltip, 'top', top);
					//rend.setStyle(tooltip, 'left', left);
					rend.setStyle(tooltip, 'transform', "translate3d(" + left + ", -" + top + ", 0)");
					rend.setStyle(tooltip, 'padding', '5px');
					rend.setStyle(tooltip, 'display', 'block');
					rend.setProperty(document.body.style, 'cursor', 'pointer');
					if (((Math.abs(x - event.x ) < 1) && (Math.abs(y - event.y ) < 1))) {
						x = event.x;
						y = event.y;
						//console.log("XY 2",  x, y, Math.abs(x - event.x ),Math.abs(y - event.y));
					} else {
						moveRaFTimer = null;
						//console.log("XY 3",  x, y, Math.abs(x - event.x ),Math.abs(y - event.y));
						moveRaFTimer = requestAnimationFrame(draw);
					}
					//rend.removeChild(tooltip, text);
					//rend.removeChild(element.nativeElement, tooltip);
				}
			}
			if (!0) {
				moveRaFTimer = requestAnimationFrame(draw);
			}
    }

    return [tooltipEvent, tooltip];
  }

}
