import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryComponent } from './history.component';

describe('OrderHistoryComponent', () => {
  let component: OrderHistoryComponent;
  let fixture: ComponentFixture<OrderHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderHistoryComponent],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
