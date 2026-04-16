'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { BookingState, BookingAction, bookingReducer, initialState } from './types';

const BookingContext = createContext<{
    state: BookingState;
    dispatch: React.Dispatch<BookingAction>;
} | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    return (
        <BookingContext.Provider value={{ state, dispatch }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}
