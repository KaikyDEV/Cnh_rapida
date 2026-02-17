'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BlockScheduleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function BlockScheduleModal({ open, onOpenChange }: BlockScheduleModalProps) {
    const [data, setData] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFim, setHoraFim] = useState('');
    const [motivo, setMotivo] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!data) {
            newErrors.data = 'Selecione uma data';
        } else if (new Date(data) < new Date(new Date().toDateString())) {
            newErrors.data = 'Data não pode ser no passado';
        }

        if (!horaInicio) newErrors.horaInicio = 'Selecione o horário inicial';
        if (!horaFim) newErrors.horaFim = 'Selecione o horário final';

        if (horaInicio && horaFim && horaFim <= horaInicio) {
            newErrors.horaFim = 'Horário final deve ser após o inicial';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 600));
        console.log('Bloqueado:', { data, horaInicio, horaFim, motivo });
        setIsSubmitting(false);

        // Reset and close
        setData('');
        setHoraInicio('');
        setHoraFim('');
        setMotivo('');
        setErrors({});
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Bloquear Horário</DialogTitle>
                    <DialogDescription className="text-sm text-cnh-text-secondary">
                        Selecione o horário que deseja bloquear para folgas ou compromissos pessoais.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Data */}
                    <div className="space-y-1.5">
                        <Label htmlFor="block-data">Data</Label>
                        <Input
                            id="block-data"
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            className={`h-11 rounded-lg ${errors.data ? 'border-cnh-error' : ''}`}
                        />
                        {errors.data && <p className="text-xs text-cnh-error">{errors.data}</p>}
                    </div>

                    {/* Horários */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="block-inicio" className="text-cnh-primary text-sm font-medium">Horário Inicial</Label>
                            <Input
                                id="block-inicio"
                                type="time"
                                value={horaInicio}
                                onChange={(e) => setHoraInicio(e.target.value)}
                                className={`h-11 rounded-lg ${errors.horaInicio ? 'border-cnh-error' : ''}`}
                            />
                            {errors.horaInicio && <p className="text-xs text-cnh-error">{errors.horaInicio}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="block-fim" className="text-cnh-primary text-sm font-medium">Horário Final</Label>
                            <Input
                                id="block-fim"
                                type="time"
                                value={horaFim}
                                onChange={(e) => setHoraFim(e.target.value)}
                                className={`h-11 rounded-lg ${errors.horaFim ? 'border-cnh-error' : ''}`}
                            />
                            {errors.horaFim && <p className="text-xs text-cnh-error">{errors.horaFim}</p>}
                        </div>
                    </div>

                    {/* Motivo */}
                    <div className="space-y-1.5">
                        <Label htmlFor="block-motivo">Motivo (opcional)</Label>
                        <Textarea
                            id="block-motivo"
                            placeholder="Ex: Almoço, Compromisso pessoal..."
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            className="rounded-lg resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-cnh-primary hover:bg-cnh-primary-dark text-white btn-press"
                    >
                        {isSubmitting ? 'Bloqueando...' : 'Bloquear'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
