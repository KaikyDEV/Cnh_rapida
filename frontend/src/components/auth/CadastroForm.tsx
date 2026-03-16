'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cadastroSchema, CadastroFormData } from '@/schemas/cadastroSchema';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const estadosBrasileiros = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// Máscara de telefone: (XX) XXXXX-XXXX
function maskPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : '';
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

// Máscara de CPF: XXX.XXX.XXX-XX
function maskCPF(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

// Máscara de CNPJ: XX.XXX.XXX/XXXX-XX
function maskCNPJ(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

// Avaliação de força da senha
function getPasswordStrength(password: string): { level: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: 'Fraca', color: 'bg-cnh-error' };
    if (score <= 2) return { level: 2, label: 'Média', color: 'bg-cnh-warning' };
    return { level: 3, label: 'Forte', color: 'bg-cnh-success' };
}

export default function CadastroForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { cadastro } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
        trigger,
    } = useForm<CadastroFormData>({
        resolver: zodResolver(cadastroSchema),
        mode: 'onChange',
        defaultValues: {
            nomeCompleto: '',
            email: '',
            phoneNumber: '',
            tipoConta: undefined,
            estado: '',
            dataNascimento: '',
            cpf: '',
            nomeFantasia: '',
            razaoSocial: '',
            cnpj: '',
            senha: '',
            confirmarSenha: '',
        },
    });

    const senha = watch('senha');
    const passwordStrength = senha ? getPasswordStrength(senha) : null;

    const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const masked = maskPhone(e.target.value);
        setValue('phoneNumber', masked, { shouldValidate: true });
    }, [setValue]);

    const handleCPFChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const masked = maskCPF(e.target.value);
        setValue('cpf', masked, { shouldValidate: true });
    }, [setValue]);

    const handleCNPJChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const masked = maskCNPJ(e.target.value);
        setValue('cnpj', masked, { shouldValidate: true });
    }, [setValue]);

    const onSubmit = async (data: CadastroFormData) => {
        setError(null);
        setIsSubmitting(true);
        try {
            await cadastro(data);
            router.push('/home');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar conta');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
                    {error}
                </div>
            )}

            {/* Nome Completo */}
            <div className="space-y-1.5">
                <Label htmlFor="nomeCompleto">Nome Completo</Label>
                <Input
                    id="nomeCompleto"
                    placeholder="Seu nome completo"
                    className={`h-11 rounded-lg ${errors.nomeCompleto ? 'border-cnh-error' : ''}`}
                    {...register('nomeCompleto')}
                />
                {errors.nomeCompleto && <p className="text-xs text-cnh-error">{errors.nomeCompleto.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
                <Label htmlFor="cadastro-email">E-mail</Label>
                <Input
                    id="cadastro-email"
                    type="email"
                    placeholder="seu@email.com"
                    className={`h-11 rounded-lg ${errors.email ? 'border-cnh-error' : ''}`}
                    {...register('email')}
                />
                {errors.email && <p className="text-xs text-cnh-error">{errors.email.message}</p>}
            </div>

            {/* Phone + CPF/CNPJ row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="phoneNumber">Telefone</Label>
                    <Input
                        id="phoneNumber"
                        placeholder="(11) 99999-9999"
                        className={`h-11 rounded-lg ${errors.phoneNumber ? 'border-cnh-error' : ''}`}
                        value={watch('phoneNumber')}
                        onChange={handlePhoneChange}
                    />
                    {errors.phoneNumber && <p className="text-xs text-cnh-error">{errors.phoneNumber.message}</p>}
                </div>
                {watch('tipoConta') !== 'AutoEscola' ? (
                    <div className="space-y-1.5">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                            id="cpf"
                            placeholder="000.000.000-00"
                            className={`h-11 rounded-lg ${errors.cpf ? 'border-cnh-error' : ''}`}
                            value={watch('cpf')}
                            onChange={handleCPFChange}
                        />
                        {errors.cpf && <p className="text-xs text-cnh-error">{errors.cpf.message}</p>}
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                            id="cnpj"
                            placeholder="00.000.000/0000-00"
                            className={`h-11 rounded-lg ${errors.cnpj ? 'border-cnh-error' : ''}`}
                            value={watch('cnpj')}
                            onChange={handleCNPJChange}
                        />
                        {errors.cnpj && <p className="text-xs text-cnh-error">{errors.cnpj.message}</p>}
                    </div>
                )}
            </div>

            {/* Estado + Data Nascimento / Razão Social */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                        onValueChange={(value) => {
                            setValue('estado', value, { shouldValidate: true });
                        }}
                    >
                        <SelectTrigger id="estado" className={`h-11 rounded-lg ${errors.estado ? 'border-cnh-error' : ''}`}>
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            {estadosBrasileiros.map((uf) => (
                                <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.estado && <p className="text-xs text-cnh-error">{errors.estado.message}</p>}
                </div>
                
                {watch('tipoConta') !== 'AutoEscola' ? (
                    <div className="space-y-1.5">
                        <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                        <Input
                            id="dataNascimento"
                            type="date"
                            className={`h-11 rounded-lg ${errors.dataNascimento ? 'border-cnh-error' : ''}`}
                            {...register('dataNascimento')}
                        />
                        {errors.dataNascimento && <p className="text-xs text-cnh-error">{errors.dataNascimento.message}</p>}
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        <Label htmlFor="razaoSocial">Razão Social</Label>
                        <Input
                            id="razaoSocial"
                            placeholder="Nome da empresa"
                            className={`h-11 rounded-lg ${errors.razaoSocial ? 'border-cnh-error' : ''}`}
                            {...register('razaoSocial')}
                        />
                        {errors.razaoSocial && <p className="text-xs text-cnh-error">{errors.razaoSocial.message}</p>}
                    </div>
                )}
            </div>

            {/* Nome Fantasia (Só para Auto Escola) */}
            {watch('tipoConta') === 'AutoEscola' && (
                <div className="space-y-1.5">
                    <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                    <Input
                        id="nomeFantasia"
                        placeholder="Nome como sua Auto Escola é conhecida"
                        className={`h-11 rounded-lg ${errors.nomeFantasia ? 'border-cnh-error' : ''}`}
                        {...register('nomeFantasia')}
                    />
                    {errors.nomeFantasia && <p className="text-xs text-cnh-error">{errors.nomeFantasia.message}</p>}
                </div>
            )}

            {/* Tipo de Conta — Radio Cards */}
            <div className="space-y-1.5">
                <Label>Tipo de Conta</Label>
                <div className="grid grid-cols-3 gap-3">
                    {(['Aluno', 'Instrutor', 'AutoEscola'] as const).map((tipo) => {
                        const isSelected = watch('tipoConta') === tipo;
                        const icon = tipo === 'Aluno' ? '🎓' : tipo === 'Instrutor' ? '🚗' : '🏢';
                        const label = tipo === 'AutoEscola' ? 'Auto Escola' : tipo;
                        
                        return (
                            <button
                                key={tipo}
                                type="button"
                                onClick={() => {
                                    setValue('tipoConta', tipo, { shouldValidate: true });
                                    trigger(['tipoConta', 'cpf', 'cnpj', 'dataNascimento', 'razaoSocial', 'nomeFantasia']);
                                }}
                                className={`
                  p-3 rounded-xl border-2 text-center transition-all duration-150 flex flex-col items-center justify-center
                  ${isSelected
                                        ? 'border-cnh-primary bg-cnh-primary/5 shadow-sm'
                                        : 'border-cnh-border hover:border-cnh-primary/40'
                                    }
                `}
                            >
                                <span className="text-xl block mb-1">{icon}</span>
                                <span className={`text-[10px] font-semibold leading-tight ${isSelected ? 'text-cnh-primary' : 'text-cnh-text-primary'}`}>
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {errors.tipoConta && <p className="text-xs text-cnh-error">{errors.tipoConta.message}</p>}
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
                <Label htmlFor="cadastro-senha">Senha</Label>
                <div className="relative">
                    <Input
                        id="cadastro-senha"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`h-11 rounded-lg pr-10 ${errors.senha ? 'border-cnh-error' : ''}`}
                        {...register('senha')}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cnh-text-muted hover:text-cnh-text-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {/* Password strength indicator */}
                {senha && passwordStrength && (
                    <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                style={{ width: `${(passwordStrength.level / 3) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-cnh-text-muted">{passwordStrength.label}</span>
                    </div>
                )}
                {errors.senha && <p className="text-xs text-cnh-error">{errors.senha.message}</p>}
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-1.5">
                <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                <div className="relative">
                    <Input
                        id="confirmarSenha"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`h-11 rounded-lg pr-10 ${errors.confirmarSenha ? 'border-cnh-error' : ''}`}
                        {...register('confirmarSenha')}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cnh-text-muted hover:text-cnh-text-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.confirmarSenha && <p className="text-xs text-cnh-error">{errors.confirmarSenha.message}</p>}
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full h-11 bg-cnh-primary hover:bg-cnh-primary-dark text-white font-semibold rounded-lg transition-all duration-150 btn-press mt-2"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Criando conta...
                    </span>
                ) : (
                    'Criar Conta'
                )}
            </Button>

            <p className="text-center text-xs text-cnh-text-muted mt-3">
                Ao criar sua conta, você concorda com os{' '}
                <Link href="#" className="text-cnh-primary hover:underline">Termos de Uso</Link>
            </p>

            <p className="text-center text-sm text-cnh-text-secondary">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-cnh-primary hover:text-cnh-primary-dark font-semibold transition-colors">
                    Entrar
                </Link>
            </p>
        </form>
    );
}
