import { api } from './http';

export const adminApi = {
  updateRole: (id: string, data: unknown) => api(`/admin/users/${id}`, 'PATCH', data),
  deleteUser: (id: string) => api(`/admin/users/${id}`, 'DELETE'),
  saveContent: (kind: string, id: string | undefined, data: unknown) =>
    api(`/admin/${kind}${id ? '/' + id : ''}`, id ? 'PUT' : 'POST', data),
  deleteContent: (kind: string, id: string) => api(`/admin/${kind}/${id}`, 'DELETE'),
};
