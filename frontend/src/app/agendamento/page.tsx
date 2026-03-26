'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import StepIndicator from '@/components/shared/StepIndicator';
import Step1TipoAula from '@/components/booking/steps/Step1TipoAula';
import Step2Instrutor from '@/components/booking/steps/Step2Instrutor';
import Step3Data from '@/components/booking/steps/Step3Data';
import Step4Horario from '@/components/booking/steps/Step4Horario';
import Step5Confirmacao from '@/components/booking/steps/Step5Confirmacao';
import { Button } from '@/components/ui/button';
import { agendamentoService } from '@/services/agendamentoService';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { TipoAula } from '@/types';

const steps = ['Tipo de Aula', 'Instrutor', 'Data', 'Horário', 'Confirmação'];

interface BookingData {
    tipoAula: TipoAula | null;
    instrutorId: string | null;
    instrutorNome: string | null;
    data: string | null;
    horario: string | null;
}

function BookingWizardContent() {
    const searchParams = useSearchParams();
    const tipoParam = searchParams.get('tipo') as TipoAula | null;
    const instrutorParam = searchParams.get('instrutor');

    const [currentStep, setCurrentStep] = useState(tipoParam ? 2 : 1);
    const [bookingData, setBookingData] = useState<BookingData>({
        tipoAula: tipoParam || null,
        instrutorId: instrutorParam || null,
        instrutorNome: null,
        data: null,
        horario: null,
    });

    const { usuario, isLoading } = useAuth();

    // Proteção de Rota - Aluno sem documentosAprovados volta pros documentos
    if (!isLoading && usuario?.role === 'Aluno' && !usuario?.documentosAprovados) {
        if (typeof window !== 'undefined') {
            window.location.href = '/documentos';
        }
        return null;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cnh-bg-base">
                <div className="w-10 h-10 border-3 border-cnh-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const goNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const goBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const updateBooking = (updates: Partial<BookingData>) => {
        setBookingData(prev => ({ ...prev, ...updates }));
    };

    return (
        <div className="min-h-screen bg-cnh-bg-base">
            {/* Header */}
            <div className="bg-white border-b border-cnh-border px-4 py-3">
                <div className="max-w-3xl mx-auto">
                    <Link href="/aluno" className="inline-flex items-center gap-1.5 text-sm text-cnh-text-secondary hover:text-cnh-primary transition-colors">
                        <ArrowLeft size={16} />
                        Voltar
                    </Link>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="bg-white border-b border-cnh-border px-4 py-2">
                <StepIndicator currentStep={currentStep} steps={steps} />
            </div>

            {/* Step Content */}
            <div className="max-w-3xl mx-auto px-4 py-6 pb-24 lg:pb-6">
                <div className="animate-fade-in-up">
                    {currentStep === 1 && (
                        <Step1TipoAula
                            selected={bookingData.tipoAula}
                            onSelect={(tipo) => {
                                updateBooking({ tipoAula: tipo });
                                goNext();
                            }}
                        />
                    )}
                    {currentStep === 2 && (
                        <Step2Instrutor
                            selected={bookingData.instrutorId}
                            onSelect={(id, nome) => {
                                updateBooking({ instrutorId: id, instrutorNome: nome });
                                goNext();
                            }}
                            onSkip={() => {
                                updateBooking({ instrutorId: null, instrutorNome: 'Atribuição automática' });
                                goNext();
                            }}
                        />
                    )}
                    {currentStep === 3 && (
                        <Step3Data
                            selected={bookingData.data}
                            onSelect={(data) => {
                                updateBooking({ data });
                                goNext();
                            }}
                        />
                    )}
                    {currentStep === 4 && (
                        <Step4Horario
                            selected={bookingData.horario}
                            onSelect={(horario) => {
                                updateBooking({ horario });
                                goNext();
                            }}
                        />
                    )}
                    {currentStep === 5 && (
                        <Step5Confirmacao
                            bookingData={bookingData}
                            onBack={goBack}
                            onConfirm={async () => {
                                try {
                                    await agendamentoService.confirmarAgendamento(
                                        `${bookingData.data}T${bookingData.horario}:00`,
                                        2, // Mínimo de 2 horas como definido na regra de negócio
                                        bookingData.instrutorId
                                    );
                                    alert('Aula agendada com sucesso! 🎉');
                                    window.location.href = '/aluno';
                                } catch (error: any) {
                                    const msg = error?.response?.data?.message || 'Erro ao agendar aula. Tente novamente.';
                                    alert(msg);
                                }
                            }}
                        />
                    )}
                </div>

                {/* Back button (steps 2-4) */}
                {currentStep >= 2 && currentStep <= 4 && (
                    <div className="mt-6">
                        <Button variant="outline" onClick={goBack} className="border-cnh-border">
                            <ArrowLeft size={16} className="mr-1" /> Voltar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AgendamentoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-cnh-bg-base">
                <div className="w-10 h-10 border-3 border-cnh-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <BookingWizardContent />
        </Suspense>
    );
}
