import { useState } from 'react';
import { Trash2, Star, Upload as UploadIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  useGetProductImagesQuery,
  useDeleteProductImageMutation,
  useSetProductImagePrimaryMutation,
} from '../services/products';
import ProductImageUploader from './ProductImageUploader';

const ProductImageManager = ({ productId }) => {
  const { data: images = [], isLoading } = useGetProductImagesQuery(productId);
  const [deleteProductImage] = useDeleteProductImageMutation();
  const [setProductImagePrimary] = useSetProductImagePrimaryMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const getImageUrl = (imageId, width = null) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4002';
    if (width) {
      return `${baseUrl}/images/${imageId}?w=${width}`;
    }
    return `${baseUrl}/images/${imageId}`;
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await setProductImagePrimary({ productId, imageId }).unwrap();
    } catch (error) {
      console.error('Error marcando como principal:', error);
    }
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;

    try {
      await deleteProductImage({ productId, imageId: imageToDelete }).unwrap();
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    } catch (error) {
      console.error('Error eliminando imagen:', error);
    }
  };

  const openDeleteDialog = (imageId) => {
    setImageToDelete(imageId);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">Cargando imágenes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Uploader */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Subir nuevas imágenes</h3>
        <ProductImageUploader productId={productId} />
      </div>

      {/* Lista de imágenes */}
      <Card>
        <CardHeader>
          <CardTitle>Imágenes actuales ({images.length}/10)</CardTitle>
          <CardDescription>
            Gestiona las imágenes del producto. Marca una como principal para mostrarla en el catálogo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No hay imágenes para este producto</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Imagen */}
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={getImageUrl(image.id, 320)}
                      alt={`Imagen ${image.id}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Badge Primary */}
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Principal
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-2 bg-white">
                    <div className="text-xs text-gray-500 mb-2">
                      {image.width}×{image.height} • {(image.sizeBytes / 1024).toFixed(0)} KB
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2">
                      {!image.isPrimary && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => handleSetPrimary(image.id)}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Marcar
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => openDeleteDialog(image.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La imagen será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductImageManager;
