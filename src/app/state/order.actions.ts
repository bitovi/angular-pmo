import { createAction, props } from '@ngrx/store';
import { Item, OrderContactInfo } from '../order/order.model';

export const begin = createAction('[Order] Begin Order', props<{ restaurant: string }>());
export const updateContact = createAction('[Order] Update Contact Info]', props<{ contactInfo: Partial<OrderContactInfo>}>());
export const updateItems = createAction('[Order] Update Items', props<{ items: Item[] }>());
export const complete = createAction('[Order] Complete Order');
export const cancel = createAction('[Order] Cancel Order');

