import { z } from "zod";

export const cadastroSchema = z.object({
    nomeCompleto: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
    email: z.string().email("E-mail inválido"),
    phoneNumber: z.string()
        .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido. Use (11) 99999-9999"),
    tipoConta: z.enum(["Aluno", "Instrutor", "AutoEscola"], { error: "Selecione o tipo de conta" }),
    estado: z.string().min(2, "Selecione um estado"),
    dataNascimento: z.string().optional(),
    cpf: z.string().optional(),
    
    // Novos campos para Auto Escola
    nomeFantasia: z.string().optional(),
    razaoSocial: z.string().optional(),
    cnpj: z.string().optional(),

    senha: z.string().min(8, "Senha deve ter pelo menos 8 caracteres")
        .regex(/[A-Z]/, "Deve conter ao menos uma letra maiúscula")
        .regex(/[0-9]/, "Deve conter ao menos um número"),
    confirmarSenha: z.string()
}).refine(data => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"]
}).refine(data => {
    if (data.tipoConta === 'Aluno' || data.tipoConta === 'Instrutor') {
        return !!data.cpf && /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(data.cpf);
    }
    return true;
}, {
    message: "CPF inválido",
    path: ["cpf"]
}).refine(data => {
    if (data.tipoConta === 'AutoEscola') {
        return !!data.cnpj && /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(data.cnpj);
    }
    return true;
}, {
    message: "CNPJ inválido",
    path: ["cnpj"]
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;
