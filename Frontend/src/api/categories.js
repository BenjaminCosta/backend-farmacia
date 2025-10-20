import apiClient from '../lib/axios';
/**
 * Obtener todas las categorías
 */
export const getCategories = async () => {
    const response = await apiClient.get('/categories');
    return response.data;
};
/**
 * Obtener una categoría por ID
 */
export const getCategoryById = async (id) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
};
/**
 * Crear nueva categoría (requiere rol PHARMACIST o ADMIN)
 */
export const createCategory = async (data) => {
    const response = await apiClient.post('/categories', data);
    return response.data;
};
/**
 * Actualizar categoría existente (requiere rol PHARMACIST o ADMIN)
 */
export const updateCategory = async (id, data) => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
};
/**
 * Eliminar categoría (requiere rol PHARMACIST o ADMIN)
 */
export const deleteCategory = async (id) => {
    await apiClient.delete(`/categories/${id}`);
};
