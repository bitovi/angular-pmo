import { createReducer, on } from '@ngrx/store';
import { begin, cancel, complete, updateContact, updateItems } from './order.actions';
import { Order } from '../order/order.model';


export const initialState: Readonly<Partial<Order>> = { status: 'uninitialized' };

export const orderReducer = createReducer(
  initialState,
  on(begin, (state, { restaurant }): Partial<Order> => ({ ...state, status: 'started', restaurant })),
  on(updateContact, (state, { contactInfo }): Partial<Order> => ({ ...state, ...contactInfo })),
  on(updateItems, (state, { items }): Partial<Order> => ({ ...state, items })),
  on(cancel, (): Partial<Order> => ({ status: 'uninitialized' })),
  on(complete, (state): Order => ({ ...state, status: 'new' } as Order))
);

