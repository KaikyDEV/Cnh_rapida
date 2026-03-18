'use client';

import { useEffect, useRef, useState } from 'react';
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
    const [renderError, setRenderError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

        console.log('[GoogleAuth] Initializing with Client ID:', clientId);
        console.log('[GoogleAuth] Current Origin:', currentOrigin);

        if (!clientId) {
            const msg = 'Google Client ID not found in environment variables';
            console.error(msg);
            setRenderError(msg);
            setIsLoading(false);
            return;
        }

        const handleCredentialResponse = async (response: any) => {
            console.log('[GoogleAuth] Credential received');
            try {
                const { usuario, perfilIncompleto } = await googleLogin(response.credential);
                
                if (perfilIncompleto) {
                    toast.info('Complete seu cadastro para continuar');
                    router.push('/completar-perfil');
                    return;
                }

                toast.success('Login com Google realizado!');
                
                if (usuario.role === 'Admin') router.push('/admin/documentos');
                else if (usuario.role === 'Instrutor') router.push('/instrutor');
                else if (usuario.role === 'AutoEscola') router.push('/auto-escola');
                else router.push('/aluno');
                
            } catch (error) {
                console.error('[GoogleAuth] Login error:', error);
                toast.error('Falha ao autenticar com o Google');
            }
        };

        const renderButton = () => {
            if (window.google) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: handleCredentialResponse,
                        auto_select: false,
                        cancel_on_tap_outside: true,
                    });
                    
                    if (googleButtonRef.current) {
                        window.google.accounts.id.renderButton(
                            googleButtonRef.current,
                            { 
                                theme: "outline", 
                                size: "large",
                                text: "continue_with",
                                shape: "rectangular",
                                logo_alignment: "left",
                                width: googleButtonRef.current.offsetWidth
                            }
                        );
                        console.log('[GoogleAuth] Button rendered successfully');
                        setIsLoading(false);
                    }
                } catch (err) {
                    console.error('[GoogleAuth] Render error:', err);
                    setRenderError('Erro ao renderizar o botão do Google');
                    setIsLoading(false);
                }
            }
        };

        const loadGoogleScript = () => {
            if (document.getElementById('google-gsi-client')) {
                if (window.google) {
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
                console.log('[GoogleAuth] Script loaded');
                renderButton();
            };
            script.onerror = () => {
                const msg = 'Falha ao carregar o script do Google. Verifique sua conexão ou se há bloqueios.';
                console.error(msg);
                setRenderError(msg);
                setIsLoading(false);
            };
            document.body.appendChild(script);
        };

        loadGoogleScript();

        // Timeout de segurança: se o script carregar mas o botão não aparecer
        const timeout = setTimeout(() => {
            if (isLoading && !renderError && googleButtonRef.current?.innerHTML === '') {
                console.warn('[GoogleAuth] Render timeout reached. Check console for "Origin not allowed"');
                setRenderError('O botão do Google demorou para carregar. Certifique-se de que a origem está autorizada e você está usando HTTPS.');
                setIsLoading(false);
            }
        }, 5000);

        return () => clearTimeout(timeout);
    }, [googleLogin, router, role, isLoading, renderError]);

    return (
        <div className="w-full flex flex-col items-center py-2 space-y-2">
            <div ref={googleButtonRef} className="w-full min-h-[40px]"></div>
            
            {isLoading && !renderError && (
                <p className="text-xs text-slate-500 animate-pulse">Carregando botão do Google...</p>
            )}
            
            {renderError && (
                <div className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-200 text-center">
                    <p>{renderError}</p>
                    <p className="mt-1 font-semibold text-[10px] uppercase">Dica: Adicione http://72.62.15.46.nip.io às origens autorizadas no Console do Google.</p>
                </div>
            )}
        </div>
    );
}
