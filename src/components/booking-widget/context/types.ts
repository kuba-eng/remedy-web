export type WidgetStep = 'service' | 'staff' | 'date' | 'details' | 'confirm' | 'success';

export interface BookingState {
    step: WidgetStep;
    serviceId: string | null;
    staffId: string | null; // 'any' or specific ID
    date: Date | null;
    slot: { start: string; end: string } | null;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        notes: string;
    };
}

export type BookingAction =
    | { type: 'SET_STEP'; payload: WidgetStep }
    | { type: 'SELECT_SERVICE'; payload: string }
    | { type: 'SELECT_STAFF'; payload: string }
    | { type: 'SELECT_SLOT'; payload: { date: Date; slot: { start: string; end: string } } }
    | { type: 'UPDATE_CUSTOMER'; payload: Partial<BookingState['customer']> }
    | { type: 'RESET' };

export const initialState: BookingState = {
    step: 'service',
    serviceId: null,
    staffId: null,
    date: null,
    slot: null,
    customer: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: ''
    }
};

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
    switch (action.type) {
        case 'SET_STEP':
            return { ...state, step: action.payload };
        case 'SELECT_SERVICE':
            return { ...state, serviceId: action.payload, step: 'staff' };
        case 'SELECT_STAFF':
            return { ...state, staffId: action.payload, step: 'date' };
        case 'SELECT_SLOT':
            return {
                ...state,
                date: action.payload.date,
                slot: action.payload.slot,
                step: 'details'
            };
        case 'UPDATE_CUSTOMER':
            return { ...state, customer: { ...state.customer, ...action.payload } };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}
