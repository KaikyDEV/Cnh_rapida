'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary] Erro capturado:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h2 className="text-lg font-bold text-cnh-text-primary mb-2">
                        Algo deu errado
                    </h2>
                    <p className="text-sm text-cnh-text-secondary mb-6 max-w-md">
                        Ocorreu um erro inesperado nesta seção. Tente recarregar a página ou voltar mais tarde.
                    </p>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details className="mb-4 max-w-lg text-left">
                            <summary className="text-xs text-cnh-text-muted cursor-pointer hover:text-cnh-text-secondary">
                                Detalhes técnicos
                            </summary>
                            <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs overflow-auto max-h-40 text-red-600">
                                {this.state.error.message}
                                {'\n'}
                                {this.state.error.stack}
                            </pre>
                        </details>
                    )}
                    <button
                        onClick={this.handleRetry}
                        className="px-6 py-2 bg-cnh-primary text-white rounded-lg hover:bg-cnh-primary-dark transition-colors text-sm font-medium"
                    >
                        Tentar Novamente
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
