'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/schemas/loginSchema';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await authService.forgotPassword(data.email);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao processar solicitação');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cnh-bg-base p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle2 size={32} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-cnh-text-primary">E-mail enviado!</h1>
                        <p className="text-cnh-text-secondary text-sm">
                            Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha em instantes.
                        </p>
                    </div>
                    <Button asChild className="w-full bg-cnh-primary hover:bg-cnh-primary-dark">
                        <Link href="/login">Voltar para o Login</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-cnh-bg-base p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8">
                <div className="space-y-2">
                    <Link href="/login" className="inline-flex items-center gap-2 text-sm text-cnh-text-secondary hover:text-cnh-primary transition-colors mb-4">
                        <ArrowLeft size={16} />
                        Voltar para o login
                    </Link>
                    <h1 className="text-2xl font-bold text-cnh-text-primary">Recuperar Senha</h1>
                    <p className="text-cnh-text-secondary text-sm">
                        Informe seu e-mail cadastrado e enviaremos um link para você criar uma nova senha.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium text-cnh-text-primary">E-mail</Label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                className={`pl-10 h-11 ${errors.email ? 'border-cnh-error' : ''}`}
                                {...register('email')}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-cnh-error mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 bg-cnh-primary hover:bg-cnh-primary-dark text-white font-semibold rounded-lg"
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
