import { api } from './api';

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/products - Listar productos con filtros
    getProducts: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        
        if (params.categoryId) searchParams.append('categoryId', params.categoryId);
        if (params.rx !== undefined) {
          searchParams.append('rx', params.rx);
        }
        if (params.q) searchParams.append('q', params.q);
        if (params.inStock !== undefined) {
          searchParams.append('inStock', params.inStock);
        }
        
        const queryString = searchParams.toString();
        return `/api/v1/products${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product', id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // GET /api/v1/products/:id - Obtener producto por ID
    getProduct: builder.query({
      query: (id) => `/api/v1/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // POST /api/v1/products - Crear producto
    createProduct: builder.mutation({
      query: (body) => ({
        url: '/api/v1/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    // PUT /api/v1/products/:id - Actualizar producto
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/v1/products/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // DELETE /api/v1/products/:id - Eliminar producto
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/v1/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    // GET /api/v1/products/:id/images - Listar imágenes de un producto
    getProductImages: builder.query({
      query: (productId) => `/api/v1/products/${productId}/images`,
      providesTags: (result, error, productId) => [
        { type: 'Image', id: `PRODUCT_${productId}` },
      ],
    }),

    // POST /api/v1/products/:id/images - Subir imágenes
    uploadProductImages: builder.mutation({
      query: ({ productId, files }) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });

        return {
          url: `/api/v1/products/${productId}/images`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Image', id: `PRODUCT_${productId}` },
      ],
    }),

    // DELETE /api/v1/products/:productId/images/:imageId - Eliminar imagen
    deleteProductImage: builder.mutation({
      query: ({ productId, imageId }) => ({
        url: `/api/v1/products/${productId}/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Image', id: `PRODUCT_${productId}` },
      ],
    }),

    // PUT /api/v1/products/:productId/images/:imageId/primary - Marcar como principal
    setProductImagePrimary: builder.mutation({
      query: ({ productId, imageId }) => ({
        url: `/api/v1/products/${productId}/images/${imageId}/primary`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Image', id: `PRODUCT_${productId}` },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductImagesQuery,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
  useSetProductImagePrimaryMutation,
} = productsApi;
