'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '@/schemas/loginSchema';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: email || '',
            token: token || '',
            novaSenha: '',
            confirmarSenha: '',
        }
    });

    useEffect(() => {
        if (email) setValue('email', email);
        if (token) setValue('token', token);
    }, [email, token, setValue]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await authService.resetPassword({
                email: data.email,
                token: data.token,
                novaSenha: data.novaSenha
            });
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao redefinir senha. O link pode ter expirado.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="text-center space-y-4">
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                    Link de redefinição inválido ou incompleto. Por favor, solicite um novo link.
                </div>
                <Button asChild className="w-full bg-cnh-primary">
                    <Link href="/esqueci-senha">Solicitar novo link</Link>
                </Button>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle2 size={32} />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-cnh-text-primary">Senha alterada!</h1>
                    <p className="text-cnh-text-secondary text-sm">
                        Sua senha foi redefinida com sucesso. Você será redirecionado para o login em breve.
                    </p>
                </div>
                <Button asChild className="w-full bg-cnh-primary hover:bg-cnh-primary-dark">
                    <Link href="/login">Ir para Login agora</Link>
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-cnh-text-primary">Nova Senha</h1>
                <p className="text-cnh-text-secondary text-sm">
                    Crie uma nova senha segura para sua conta.
                </p>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-1.5">
                <Label htmlFor="novaSenha">Nova Senha</Label>
                <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" />
                    <Input
                        id="novaSenha"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${errors.novaSenha ? 'border-cnh-error' : ''}`}
                        {...register('novaSenha')}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cnh-text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.novaSenha && <p className="text-xs text-cnh-error mt-1">{errors.novaSenha.message}</p>}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" />
                    <Input
                        id="confirmarSenha"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${errors.confirmarSenha ? 'border-cnh-error' : ''}`}
                        {...register('confirmarSenha')}
                    />
                </div>
                {errors.confirmarSenha && <p className="text-xs text-cnh-error mt-1">{errors.confirmarSenha.message}</p>}
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-cnh-primary hover:bg-cnh-primary-dark font-semibold"
            >
                {isSubmitting ? 'Alterando...' : 'Redefinir Senha'}
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cnh-bg-base p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <Suspense fallback={<div className="text-center py-10 animate-pulse text-cnh-text-muted">Carregando formulário...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
