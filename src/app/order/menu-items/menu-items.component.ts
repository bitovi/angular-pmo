import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Item, Menu } from '../../restaurant/restaurant';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'pmo-menu-items',
  templateUrl: './menu-items.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MenuItemsComponent),
      multi: true,
    },
  ],
  imports: [TabsModule, CurrencyPipe],
})
export class MenuItemsComponent implements ControlValueAccessor {
  readonly menu = input<Menu>();
  private value: Item[] = [];

  onChange: (value: Item[]) => void = () => {};
  onTouched: () => void = () => {};

  registerOnChange(fn: (value: Item[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: Item[]): void {
    this.value = value;
  }

  toggleItem(item: Item) {
    const selected = this.value.indexOf(item) !== -1;
    if (selected) {
      this.value = this.value.filter((i) => i._id !== item._id);
    } else {
      this.value = [...this.value, item];
    }
    this.onChange(this.value);
    this.onTouched();
  }
}
