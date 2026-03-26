import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    lembrarMe: z.boolean().optional()
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
});

export const resetPasswordSchema = z.object({
    email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
    token: z.string().min(1, "Token é obrigatório"),
    novaSenha: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirme a nova senha"),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
