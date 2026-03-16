'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Calendar, CreditCard, Home, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const completPerilSchema = z.object({
    nomeCompleto: z.string().min(3, 'Nome muito curto').max(200),
    dataNascimento: z.string().min(10, 'Data inválida (DD/MM/AAAA)'),
    cpf: z.string().length(11, 'CPF deve ter exatamente 11 dígitos numéricos').regex(/^\d+$/, 'Apenas números'),
    estado: z.string().min(2, 'Informe seu estado'),
    tipoConta: z.enum(['Aluno', 'Instrutor', 'AutoEscola']),
    nomeFantasia: z.string().optional(),
    razaoSocial: z.string().optional(),
    cnpj: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.tipoConta === 'AutoEscola') {
        if (!data.nomeFantasia || data.nomeFantasia.length < 3) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Nome fantasia obrigatório', path: ['nomeFantasia'] });
        }
        if (!data.razaoSocial || data.razaoSocial.length < 3) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Razão social obrigatória', path: ['razaoSocial'] });
        }
        if (!data.cnpj || !/^\d{14}$/.test(data.cnpj)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CNPJ deve ter 14 números', path: ['cnpj'] });
        }
    }
});

type CompletarPerfilFormData = z.infer<typeof completPerilSchema>;

export default function CompletarPerfilForm() {
    const { usuario, role } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<CompletarPerfilFormData>({
        resolver: zodResolver(completPerilSchema),
        defaultValues: {
            nomeCompleto: usuario?.nomeCompleto || '',
            dataNascimento: '',
            cpf: '',
            estado: '',
            tipoConta: 'Aluno',
            nomeFantasia: '',
            razaoSocial: '',
            cnpj: '',
        },
    });

    useEffect(() => {
        if (usuario?.nomeCompleto) {
            setValue('nomeCompleto', usuario.nomeCompleto);
        }
    }, [usuario, setValue]);

    const tipoContaWatch = watch('tipoConta');

    const onSubmit = async (data: CompletarPerfilFormData) => {
        setIsSubmitting(true);
        try {
            const response = await authApi.post('/api/auth/completar-perfil', {
                ...data,
                // Converter data para formato ISO se necessário, mas o backend aceita DateTime
                dataNascimento: new Date(data.dataNascimento.split('/').reverse().join('-')).toISOString()
            });

            const newToken = response.data.token;
            const newRole = response.data.role;

            if (newToken && typeof window !== 'undefined') {
                localStorage.setItem('cnhrapido_token', newToken);
                const updatedUser = { ...usuario, role: newRole, perfilIncompleto: false };
                localStorage.setItem('cnhrapido_user', JSON.stringify(updatedUser));
            }

            toast.success('Perfil atualizado com sucesso!');
            
            // Força o reload para recarregar o contexto inteiro
            if (newRole === 'Admin') window.location.href = '/admin/documentos';
            else if (newRole === 'Instrutor') window.location.href = '/instrutor';
            else if (newRole === 'AutoEscola') window.location.href = '/auto-escola';
            else window.location.href = '/aluno';
            
        } catch (error: any) {
            console.error('Erro ao completar perfil:', error);
            const message = error.response?.data?.message || 'Erro ao atualizar perfil';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Nome */}
            <div className="space-y-1.5">
                <Label htmlFor="nomeCompleto" className="text-sm font-medium text-cnh-text-primary">
                    Nome Completo
                </Label>
                <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" />
                    <Input
                        id="nomeCompleto"
                        placeholder="Seu nome completo"
                        className={`pl-10 h-11 rounded-lg border ${errors.nomeCompleto ? 'border-cnh-error focus-visible:ring-cnh-error' : 'border-cnh-border'}`}
                        {...register('nomeCompleto')}
                    />
                </div>
                {errors.nomeCompleto && <p className="text-xs text-cnh-error mt-1">{errors.nomeCompleto.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CPF */}
                <div className="space-y-1.5">
                    <Label htmlFor="cpf" className="text-sm font-medium text-cnh-text-primary">
                        CPF (apenas números)
                    </Label>
                    <div className="relative">
                        <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" />
                        <Input
                            id="cpf"
                            placeholder="00000000000"
                            maxLength={11}
                            className={`pl-10 h-11 rounded-lg border ${errors.cpf ? 'border-cnh-error focus-visible:ring-cnh-error' : 'border-cnh-border'}`}
                            {...register('cpf')}
                        />
                    </div>
                    {errors.cpf && <p className="text-xs text-cnh-error mt-1">{errors.cpf.message}</p>}
                </div>

                {/* Data Nascimento */}
                <div className="space-y-1.5">
                    <Label htmlFor="dataNascimento" className="text-sm font-medium text-cnh-text-primary">
                        Data de Nascimento
                    </Label>
                    <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" />
                        <Input
                            id="dataNascimento"
                            placeholder="DD/MM/AAAA"
                            className={`pl-10 h-11 rounded-lg border ${errors.dataNascimento ? 'border-cnh-error focus-visible:ring-cnh-error' : 'border-cnh-border'}`}
                            {...register('dataNascimento')}
                            onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, '');
                                if (val.length > 8) val = val.slice(0, 8);
                                if (val.length > 4) val = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4);
                                else if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                                e.target.value = val;
                                register('dataNascimento').onChange(e);
                            }}
                        />
                    </div>
                    {errors.dataNascimento && <p className="text-xs text-cnh-error mt-1">{errors.dataNascimento.message}</p>}
                </div>
            </div>

            {/* Estado */}
            <div className="space-y-1.5">
                <Label htmlFor="estado" className="text-sm font-medium text-cnh-text-primary">
                    Estado
                </Label>
                <div className="relative">
                    <Home size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cnh-text-muted" />
                    <Input
                        id="estado"
                        placeholder="Ex: São Paulo"
                        className={`pl-10 h-11 rounded-lg border ${errors.estado ? 'border-cnh-error focus-visible:ring-cnh-error' : 'border-cnh-border'}`}
                        {...register('estado')}
                    />
                </div>
                {errors.estado && <p className="text-xs text-cnh-error mt-1">{errors.estado.message}</p>}
            </div>

            {/* Tipo de Conta */}
            <div className="space-y-1.5">
                <Label className="text-sm font-medium text-cnh-text-primary">
                    O que você é?
                </Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                    <label className={`
                        flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all
                        ${tipoContaWatch === 'Aluno' ? 'border-cnh-primary bg-cnh-primary/5 text-cnh-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'}
                    `}>
                        <input type="radio" value="Aluno" className="sr-only" {...register('tipoConta')} />
                        <span className="font-semibold text-sm">Aluno</span>
                    </label>
                    <label className={`
                        flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all
                        ${tipoContaWatch === 'Instrutor' ? 'border-cnh-primary bg-cnh-primary/5 text-cnh-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'}
                    `}>
                        <input type="radio" value="Instrutor" className="sr-only" {...register('tipoConta')} />
                        <span className="font-semibold text-sm">Instrutor</span>
                    </label>
                    <label className={`
                        flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all
                        ${tipoContaWatch === 'AutoEscola' ? 'border-cnh-primary bg-cnh-primary/5 text-cnh-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'}
                    `}>
                        <input type="radio" value="AutoEscola" className="sr-only" {...register('tipoConta')} />
                        <span className="font-semibold text-sm text-center">Auto Escola</span>
                    </label>
                </div>
                {errors.tipoConta && <p className="text-xs text-cnh-error mt-1">{errors.tipoConta.message}</p>}
            </div>

            {/* Campos Condicionais: Auto Escola */}
            {tipoContaWatch === 'AutoEscola' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="nomeFantasia" className="text-sm font-medium text-cnh-text-primary">Nome Fantasia</Label>
                        <Input id="nomeFantasia" placeholder="Nome da Auto Escola" className={`h-11 rounded-lg border ${errors.nomeFantasia ? 'border-cnh-error focus-visible:ring-cnh-error' : 'border-cnh-border'}`} {...register('nomeFantasia')} />
                         {errors.nomeFantasia && <p className="text-xs text-cnh-error mt-1">{errors.nomeFantasia.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="razaoSocial" className="text-sm font-medium text-cnh-text-primary">Razão Social</Label>
                        <Input id="razaoSocial" placeholder="Razão Social" className={`h-11 rounded-lg border ${errors.razaoSocial ? 'border-cnh-error focus-visible:ring-cnh-error' : 'border-cnh-border'}`} {...register('razaoSocial')} />
                        {errors.razaoSocial && <p className="text-xs text-cnh-error mt-1">{errors.razaoSocial.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="cnpj" className="text-sm font-medium text-cnh-text-primary">CNPJ (apenas números)</Label>
                        <Input id="cnpj" maxLength={14} placeholder="00000000000000" className={`h-11 rounded-lg border ${errors.cnpj ? 'border-cnh-error focus-visible:ring-cnh-error' : 'border-cnh-border'}`} {...register('cnpj')} />
                        {errors.cnpj && <p className="text-xs text-cnh-error mt-1">{errors.cnpj.message}</p>}
                    </div>
                </div>
            )}

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-cnh-primary hover:bg-cnh-primary-dark text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cnh-primary/20 flex items-center justify-center gap-2 mt-4"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Salvando...
                    </>
                ) : (
                    'Concluir Cadastro'
                )}
            </Button>
        </form>
    );
}
