import Logo from '@/components/layout/Logo';
import CompletarPerfilForm from '@/components/auth/CompletarPerfilForm';

export default function CompletarPerfilPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cnh-bg-base px-4 py-8">
            <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-xl shadow-cnh-primary/5 border border-cnh-border p-8 sm:p-12">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <Logo size="lg" className="mb-6" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-cnh-text-primary text-center">
                        Já quase lá! 🏁
                    </h1>
                    <p className="text-cnh-text-secondary text-center mt-2">
                        Precisamos de mais algumas informações para habilitar seu acesso completo ao sistema.
                    </p>
                </div>

                {/* Info Card */}
                <div className="bg-cnh-primary/5 border border-cnh-primary/10 rounded-2xl p-4 mb-8 flex items-start gap-3">
                    <span className="text-xl">✨</span>
                    <p className="text-sm text-cnh-primary-dark font-medium leading-relaxed">
                        Seus dados serão usados para vincular seus agendamentos ao DETRAN e garantir sua identificação correta.
                    </p>
                </div>

                {/* Form */}
                <CompletarPerfilForm />
                
                {/* Help */}
                <p className="text-center text-xs text-cnh-text-muted mt-8">
                    Problemas com o cadastro? <span className="text-cnh-primary font-medium cursor-pointer hover:underline">Fale com o suporte</span>
                </p>
            </div>
        </div>
    );
}
