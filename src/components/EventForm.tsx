import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { Camera, X } from 'lucide-react';
import { EventSchema, Event } from '../types/event';
import { fileToBase64, isValidImageFile } from '../utils/imageUtils';

interface EventFormData {
  nombre: string;
  descripcion?: string;
  cantidad: number;
  fecha: string;
  tipo: 'ingreso' | 'egreso';
}

interface EventFormProps {
  initialEvent?: Event | null;
  onSubmit: (event: Event) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ initialEvent, onSubmit, onCancel }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  
  const isEditing = Boolean(initialEvent);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EventFormData>({
    resolver: zodResolver(EventSchema.omit({ id: true, adjunto: true })),
    defaultValues: {
      nombre: '',
      descripcion: '',
      cantidad: 0,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'ingreso',
    },
  });

  useEffect(() => {
    if (initialEvent) {
      reset({
        nombre: initialEvent.nombre,
        descripcion: initialEvent.descripcion || '',
        cantidad: initialEvent.cantidad,
        fecha: initialEvent.fecha.toISOString().split('T')[0],
        tipo: initialEvent.tipo,
      });
      setImagePreview(initialEvent.adjunto || null);
    } else {
      reset({
        nombre: '',
        descripcion: '',
        cantidad: 0,
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'ingreso',
      });
      setImagePreview(null);
    }
  }, [initialEvent, reset]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) {
      setImagePreview(null);
      return;
    }

    if (!isValidImageFile(file)) {
      setImageError('Por favor selecciona un archivo de imagen válido (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setImageError('La imagen debe ser menor a 5MB');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
    } catch (error) {
      setImageError('Error al procesar la imagen');
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageError(null);
  };

  const onFormSubmit = (data: EventFormData) => {
    const event: Event = {
      id: initialEvent?.id || uuidv4(),
      nombre: data.nombre,
      descripcion: data.descripcion || undefined,
      cantidad: data.cantidad,
      fecha: new Date(data.fecha),
      tipo: data.tipo,
      adjunto: imagePreview || undefined,
    };

    onSubmit(event);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Editar Evento' : 'Crear Evento'}
        </h2>
        <button
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre *
          </label>
          <input
            {...register('nombre')}
            type="text"
            id="nombre"
            maxLength={20}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Ej: Compra de café"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción
          </label>
          <textarea
            {...register('descripcion')}
            id="descripcion"
            maxLength={100}
            rows={3}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Descripción opcional del evento"
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.descripcion.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cantidad *
            </label>
            <input
              {...register('cantidad', { valueAsNumber: true })}
              type="number"
              id="cantidad"
              min="0"
              step="0.01"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
            />
            {errors.cantidad && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cantidad.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha *
            </label>
            <input
              {...register('fecha')}
              type="date"
              id="fecha"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.fecha && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fecha.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo *
          </label>
          <select
            {...register('tipo')}
            id="tipo"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
          {errors.tipo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tipo.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Imagen Adjunta
          </label>
          
          {!imagePreview && (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-500"
                >
                  Seleccionar imagen
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF hasta 5MB
              </p>
            </div>
          )}

          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {imageError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{imageError}</p>
          )}
        </div>


        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
          >
            {isEditing ? 'Actualizar Evento' : 'Crear Evento'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;