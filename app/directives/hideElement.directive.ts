import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[hideElement]'
})
export class HideElementseDirective {
	@HostListener('click', ['$event'])
	onClick() {
		this.el.nativeElement.style.display = 'none';
 	}

	parent: ElementRef;

  constructor(private el: ElementRef) { }
}
