import { adminApi } from './api';

export const adminService = {
    // ----- MÓDULO: Exames Teóricos ----- //

    async getExamesTeoricosPendentes() {
        const response = await adminApi.get('/api/admin/exame-teorico/pendentes');
        return response.data;
    },

    async aprovarExameTeorico(id: number) {
        const response = await adminApi.post(`/api/admin/exame-teorico/aprovar/${id}`);
        return response.data;
    },

    async reprovarExameTeorico(id: number) {
        const response = await adminApi.post(`/api/admin/exame-teorico/reprovar/${id}`);
        return response.data;
    },

    async getHistoricoExamesTeoricos(params?: { busca?: string; status?: string; dataInicio?: string; dataFim?: string }) {
        const response = await adminApi.get('/api/admin/exame-teorico/historico', { params });
        return response.data;
    },

    // ----- MÓDULO: Exames Médicos ----- //

    async getExamesMedicosPendentes() {
        const response = await adminApi.get('/api/admin/exames/pendentes');
        return response.data;
    },

    async aprovarExamesMedicos(id: number) {
        const response = await adminApi.post(`/api/admin/exames/aprovar/${id}`);
        return response.data;
    },

    async rejeitarExamesMedicos(id: number) {
        const response = await adminApi.post(`/api/admin/exames/rejeitar/${id}`);
        return response.data;
    },

    async getHistoricoExamesMedicos(params?: { busca?: string; status?: string; dataInicio?: string; dataFim?: string }) {
        const response = await adminApi.get('/api/admin/exames/historico', { params });
        return response.data;
    }
};