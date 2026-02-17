import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    lembrarMe: z.boolean().optional()
});

export type LoginFormData = z.infer<typeof loginSchema>;
