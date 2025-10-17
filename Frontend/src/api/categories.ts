import apiClient from '../lib/axios';

export interface CategoryRequest {
  name: string;
  description: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
}

/**
 * Obtener todas las categorías
 */
export const getCategories = async (): Promise<CategoryResponse[]> => {
  const response = await apiClient.get('/categories');
  return response.data;
};

/**
 * Obtener una categoría por ID
 */
export const getCategoryById = async (id: string): Promise<CategoryResponse> => {
  const response = await apiClient.get(`/categories/${id}`);
  return response.data;
};

/**
 * Crear nueva categoría (requiere rol PHARMACIST o ADMIN)
 */
export const createCategory = async (data: CategoryRequest): Promise<CategoryResponse> => {
  const response = await apiClient.post('/categories', data);
  return response.data;
};

/**
 * Actualizar categoría existente (requiere rol PHARMACIST o ADMIN)
 */
export const updateCategory = async (id: string, data: CategoryRequest): Promise<CategoryResponse> => {
  const response = await apiClient.put(`/categories/${id}`, data);
  return response.data;
};

/**
 * Eliminar categoría (requiere rol PHARMACIST o ADMIN)
 */
export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};
