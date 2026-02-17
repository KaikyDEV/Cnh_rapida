import { z } from "zod";

export const agendamentoSchema = z.object({
    tipoAula: z.enum(["Diurna", "Noturna", "Baliza", "Simulado"], {
        message: "Selecione o tipo de aula"
    }),
    instrutorId: z.string().optional(),
    data: z.string().refine(val => {
        const date = new Date(val);
        return date > new Date();
    }, "Selecione uma data futura"),
    horario: z.string().regex(/^\d{2}:\d{2}$/, "Selecione um horário"),
    quantidadeHoras: z.number().min(2, "Mínimo de 2 horas")
});

export type AgendamentoFormData = z.infer<typeof agendamentoSchema>;
