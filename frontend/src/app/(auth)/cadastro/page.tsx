import Logo from '@/components/layout/Logo';
import CadastroForm from '@/components/auth/CadastroForm';

export default function CadastroPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left side — Form */}
            <div className="flex-1 flex flex-col justify-start px-6 py-8 sm:px-12 lg:px-16 xl:px-24 bg-white overflow-y-auto">
                <div className="w-full max-w-[480px] mx-auto">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Logo size="lg" />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-[28px] font-bold text-cnh-text-primary text-center mb-2">
                        Criar sua conta
                    </h1>
                    <p className="text-cnh-text-secondary text-center mb-6">
                        Preencha seus dados para começar
                    </p>

                    {/* Form */}
                    <CadastroForm />
                </div>
            </div>

            {/* Right side — Visual (hidden on mobile) */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-cnh-primary-dark via-cnh-primary to-cnh-primary-light relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full"
                        style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>

                <div className="flex flex-col items-center justify-center w-full px-12 text-white relative z-10">
                    <Logo size="xl" className="mb-8" />
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Por que escolher a CNH Rápido?
                    </h2>

                    <div className="space-y-5 text-white/90 max-w-md">
                        <div className="flex items-start gap-4">
                            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base shrink-0">✅</span>
                            <div>
                                <p className="font-semibold">Agendamento Flexível</p>
                                <p className="text-sm text-white/70">Escolha seus horários e instrutores preferidos</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base shrink-0">✅</span>
                            <div>
                                <p className="font-semibold">Instrutores Certificados DETRAN</p>
                                <p className="text-sm text-white/70">Profissionais qualificados e bem avaliados</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base shrink-0">✅</span>
                            <div>
                                <p className="font-semibold">Acompanhamento em Tempo Real</p>
                                <p className="text-sm text-white/70">Seu progresso sempre disponível no painel</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
