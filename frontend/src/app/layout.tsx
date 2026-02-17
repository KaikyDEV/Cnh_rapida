import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins-family",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CNH Rápido — Agendamento de Aulas Práticas",
  description:
    "Plataforma de agendamento de aulas práticas para obtenção de CNH. Agende suas aulas, acompanhe seu progresso e gerencie seu processo de habilitação.",
  keywords: ["CNH", "aulas práticas", "auto escola", "habilitação", "DETRAN"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${nunito.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
