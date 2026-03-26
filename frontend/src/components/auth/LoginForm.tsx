'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas/loginSchema';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            senha: '',
            lembrarMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        setIsSubmitting(true);
        try {
            const result = await login(data);
            if (result.usuario.role === 'Admin') router.push('/admin/documentos');
            else if (result.usuario.role === 'Instrutor') router.push('/instrutor');
            else if (result.usuario.role === 'AutoEscola') router.push('/auto-escola');
            else router.push('/home');
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('E-mail ou senha incorretos. Por favor, tente novamente.');
            } else {
                setError(err instanceof Error ? err.message : 'Erro ao fazer login');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Error alert */}
            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
                    {error}
                </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-cnh-text-primary">
                    E-mail
                </Label>
                <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className={`pl-10 h-11 rounded-lg border ${errors.email ? 'border-cnh-error focus-visible:ring-cnh-error' : 'border-cnh-border'}`}
                        {...register('email')}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                </div>
                {errors.email && (
                    <p id="email-error" className="text-xs text-cnh-error mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <Label htmlFor="senha" className="text-sm font-medium text-cnh-text-primary">
                    Senha
                </Label>
                <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" />
                    <Input
                        id="senha"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 h-11 rounded-lg border ${errors.senha ? 'border-cnh-error focus-visible:ring-cnh-error' : 'border-cnh-border'}`}
                        {...register('senha')}
                        aria-describedby={errors.senha ? 'senha-error' : undefined}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cnh-text-muted hover:text-cnh-text-secondary transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.senha && (
                    <p id="senha-error" className="text-xs text-cnh-error mt-1">{errors.senha.message}</p>
                )}
            </div>

            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="lembrarMe"
                        checked={watch('lembrarMe')}
                        onCheckedChange={(checked) => setValue('lembrarMe', !!checked)}
                    />
                    <Label htmlFor="lembrarMe" className="text-sm text-cnh-text-secondary cursor-pointer">
                        Lembrar de mim
                    </Label>
                </div>
                <Link href="/esqueci-senha" className="text-sm text-cnh-primary hover:text-cnh-primary-dark transition-colors font-medium">
                    Esqueceu a senha?
                </Link>
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-cnh-primary hover:bg-cnh-primary-dark text-white font-semibold rounded-lg transition-all duration-150 btn-press"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Entrando...
                    </span>
                ) : (
                    'Entrar'
                )}
            </Button>

            {/* Register link */}
            <p className="text-center text-sm text-cnh-text-secondary mt-4">
                Não tem uma conta?{' '}
                <Link href="/cadastro" className="text-cnh-primary hover:text-cnh-primary-dark font-semibold transition-colors">
                    Criar conta
                </Link>
            </p>
        </form>
    );
}
