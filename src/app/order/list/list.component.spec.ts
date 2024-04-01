import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListComponent } from './list.component';
import { provideHttpClient } from '@angular/common/http';

describe('ListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderListComponent],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
