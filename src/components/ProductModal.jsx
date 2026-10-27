import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Coleoptera',
  'Lepidoptera',
  'Hymenoptera',
  'Odonata',
  'Mantodea',
  'Arachnida',
];

const INITIAL_FORM = {
  commonName: '',
  scientificName: '',
  category: 'Coleoptera',
  location: '',
  image: '',
  description: '',
};

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (initialData) {
      setFormData({
        commonName: initialData.commonName || initialData.title || '',
        scientificName: initialData.scientificName || (initialData.scientific ? initialData.scientific.replace(/[()]/g, '') : ''),
        category: initialData.category || initialData.taxon || 'Coleoptera',
        location: initialData.location || '',
        image: initialData.image || '',
        description: initialData.description || '',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.commonName.trim()) return;
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 font-['Mulish']">
      <div className="w-full max-w-xl bg-[#161B18] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h3 className="text-white text-base font-bold">
                {initialData ? 'Editar Espécimen' : 'Crear Nuevo Espécimen'}
              </h3>
              <p className="text-zinc-400 text-xs">
                {initialData
                  ? 'Modifica los datos del registro taxonómico'
                  : 'Registra un nuevo avistamiento biológico en Insectopia'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            title="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 text-xs font-bold mb-1.5">
                Nombre Común *
              </label>
              <input
                type="text"
                name="commonName"
                required
                value={formData.commonName}
                onChange={handleChange}
                placeholder="Ej. Escarabajo de Plata"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition"
              />
            </div>

            <div>
              <label className="block text-zinc-300 text-xs font-bold mb-1.5">
                Nombre Científico
              </label>
              <input
                type="text"
                name="scientificName"
                value={formData.scientificName}
                onChange={handleChange}
                placeholder="Ej. Chrysina limbata"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder:text-zinc-600 text-sm italic outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 text-xs font-bold mb-1.5">
                Categoría (Orden) *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-100 text-sm outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-zinc-900 text-zinc-200">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 text-xs font-bold mb-1.5">
                Ubicación
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ej. Dosel de Oaxaca, MX"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 text-xs font-bold mb-1.5">
              URL de Fotografía
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition"
            />
            {formData.image && (
              <div className="mt-2 h-28 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <img
                  src={formData.image}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-zinc-300 text-xs font-bold mb-1.5">
              Descripción Biológica
            </label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Notas biológicas, observaciones de campo, cutícula, comportamiento..."
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition resize-none"
            />
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-lime-500 hover:bg-lime-400 active:scale-[0.98] text-lime-950 text-xs font-extrabold rounded-xl shadow-[0px_0px_12px_0px_rgba(133,196,46,0.25)] transition cursor-pointer disabled:opacity-60"
            >
              {isSubmitting
                ? 'Guardando...'
                : initialData
                ? 'Guardar Cambios'
                : 'Crear Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
