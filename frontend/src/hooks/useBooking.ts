'use client';

import { useState } from 'react';
import { TipoAula } from '@/types';

interface BookingState {
    tipoAula: TipoAula | null;
    instrutorId: string | null;
    instrutorNome: string | null;
    data: string | null;
    horario: string | null;
    currentStep: number;
}

export function useBooking(initialTipo?: TipoAula, initialInstrutor?: string) {
    const [state, setState] = useState<BookingState>({
        tipoAula: initialTipo || null,
        instrutorId: initialInstrutor || null,
        instrutorNome: null,
        data: null,
        horario: null,
        currentStep: initialTipo ? 2 : 1,
    });

    const goNext = () => setState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 5) }));
    const goBack = () => setState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));

    const updateBooking = (updates: Partial<BookingState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const reset = () => {
        setState({
            tipoAula: null,
            instrutorId: null,
            instrutorNome: null,
            data: null,
            horario: null,
            currentStep: 1,
        });
    };

    return {
        ...state,
        goNext,
        goBack,
        updateBooking,
        reset,
    };
}
