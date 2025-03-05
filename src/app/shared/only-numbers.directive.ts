import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[pmoOnlyNumbers]',
})
export class OnlyNumbersDirective {
  private elementRef = inject(ElementRef);

  private allowedKeys: string[] = ['Backspace', 'ArrowLeft', 'ArrowRight'];
  private regExp = new RegExp(/^[0-9]*$/g);

  @HostListener('keydown', ['$event'])
  onKeyDown(keyboardEvent: KeyboardEvent) {
    if (this.allowedKeys.indexOf(keyboardEvent.key) !== -1) {
      return;
    }
    const inputNativeElementValue = this.elementRef.nativeElement.value;
    const next = `${inputNativeElementValue}${keyboardEvent.key}`;
    if (next && !next.match(this.regExp)) {
      keyboardEvent.preventDefault();
    }
  }
}
