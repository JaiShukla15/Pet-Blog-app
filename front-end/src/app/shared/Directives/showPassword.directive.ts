import { Directive, ElementRef} from '@angular/core';
@Directive({
  selector: '[showPassword]'
})
export class ShowPasswordDirective {
 private _shown = false;
constructor(private el: ElementRef) {
    this.setup();
  }
toggle(span: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = 'Hide password';
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML = 'Show password';
    }
  }
setup() {
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('div');
    span.textContent = `Show password`;
    span.className="btn btn-light"
    span.addEventListener('click', (event) => {
      this.toggle(span);
    });
    parent.appendChild(span);
  }
}