import Logo from '@/components/layout/Logo';
import LoginForm from '@/components/auth/LoginForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left side — Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24 bg-white">
                <div className="w-full max-w-[420px] mx-auto">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <Logo size="lg" />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-[28px] font-bold text-cnh-text-primary text-center mb-2">
                        Bem-vindo de volta
                    </h1>
                    <p className="text-cnh-text-secondary text-center mb-8">
                        Entre para agendar suas aulas práticas
                    </p>

                    {/* Form */}
                    <LoginForm />

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-cnh-border"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-cnh-text-muted">Ou continue com</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <GoogleLoginButton />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side — Visual (hidden on mobile) */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-cnh-primary-dark via-cnh-primary to-cnh-primary-light relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full"
                        style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col items-center justify-center w-full px-12 text-white relative z-10">
                    <Logo size="xl" className="mb-8" />
                    <h2 className="text-2xl font-bold mb-3 text-center">
                        Sistema de Agendamento de Aulas
                    </h2>
                    <p className="text-white/80 text-center max-w-md leading-relaxed">
                        Gerencie suas aulas práticas de forma simples e eficiente.
                        Acompanhe seu progresso rumo à sua CNH.
                    </p>

                    {/* Feature bullets */}
                    <div className="mt-10 space-y-4 text-white/90">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span>
                            <span>Agendamento Flexível</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span>
                            <span>Instrutores Certificados DETRAN</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</span>
                            <span>Acompanhamento em Tempo Real</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
