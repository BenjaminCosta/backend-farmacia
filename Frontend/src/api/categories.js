import client from './client';

/**
 * Obtener todas las categorías
 */
export const getCategories = async () => {
    const response = await client.get('/api/v1/categories');
    return response.data;
};
/**
 * Obtener una categoría por ID
 */
export const getCategoryById = async (id) => {
    const response = await client.get(`/api/v1/categories/${id}`);
    return response.data;
};
/**
 * Crear nueva categoría (requiere rol PHARMACIST o ADMIN)
 */
export const createCategory = async (data) => {
    const response = await client.post('/api/v1/categories', data);
    return response.data;
};
/**
 * Actualizar categoría existente (requiere rol PHARMACIST o ADMIN)
 */
export const updateCategory = async (id, data) => {
    const response = await client.put(`/api/v1/categories/${id}`, data);
    return response.data;
};
/**
 * Eliminar categoría (requiere rol PHARMACIST o ADMIN)
 */
export const deleteCategory = async (id) => {
    await client.delete(`/api/v1/categories/${id}`);
};
