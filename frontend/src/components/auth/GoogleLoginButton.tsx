'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

declare global {
    interface Window {
        google?: any;
    }
}

export default function GoogleLoginButton() {
    const { googleLogin, role } = useAuth();
    const router = useRouter();
    const googleButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

        if (!clientId) {
            console.error('Google Client ID not found in environment variables');
            return;
        }

        const handleCredentialResponse = async (response: any) => {
            try {
                const { usuario, perfilIncompleto } = await googleLogin(response.credential);
                
                if (perfilIncompleto) {
                    toast.info('Complete seu cadastro para continuar');
                    router.push('/completar-perfil');
                    return;
                }

                toast.success('Login com Google realizado!');
                
                // Redirecionar baseado no role do usuário retornado
                if (usuario.role === 'Admin') router.push('/admin/documentos');
                else if (usuario.role === 'Instrutor') router.push('/instrutor');
                else if (usuario.role === 'AutoEscola') router.push('/auto-escola');
                else router.push('/aluno');
                
            } catch (error) {
                console.error('Erro no login Google:', error);
                toast.error('Falha ao autenticar com o Google');
            }
        };

        const loadGoogleScript = () => {
            // Se o script já existe, não adiciona de novo
            if (document.getElementById('google-gsi-client')) {
                if (window.google && googleButtonRef.current) {
                    renderButton();
                }
                return;
            }

            const script = document.createElement('script');
            script.id = 'google-gsi-client';
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                renderButton();
            };
            document.body.appendChild(script);
        };

        const renderButton = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                });
                
                if (googleButtonRef.current) {
                    window.google.accounts.id.renderButton(
                        googleButtonRef.current,
                        { 
                            theme: "outline", 
                            size: "large",
                            text: "continue_with",
                            shape: "rectangular",
                            logo_alignment: "left"
                        }
                    );
                }
            }
        };

        loadGoogleScript();

        return () => {
            // Limpeza opcional
        };
    }, [googleLogin, router, role]);

    return (
        <div className="w-full flex justify-center py-2">
            <div ref={googleButtonRef} className="w-full"></div>
        </div>
    );
}
