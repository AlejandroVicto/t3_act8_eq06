import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Globe,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Menu,
  X,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
  Clock,
  MapPin,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductModal from '../components/ProductModal';
import ConfirmModal from '../components/ConfirmModal';
import productsService from '../services/productsService';

const INSECT_CATEGORIES = [
  'Coleoptera',
  'Lepidoptera',
  'Hymenoptera',
  'Odonata',
  'Mantodea',
  'Arachnida',
];


export default function DashboardPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('galeria');
  const [feedMode, setFeedMode] = useState('parati');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [specimens, setSpecimens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limitParam = parseInt(searchParams.get('limit') || '10', 10);
  const itemsPerPage = [10, 20, 40, 50].includes(limitParam) ? limitParam : 10;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSpecimen, setEditingSpecimen] = useState(null);
  const [pendingEditData, setPendingEditData] = useState(null);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);
  const [deletingSpecimen, setDeletingSpecimen] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!searchParams.has('page') || !searchParams.has('limit')) {
      const next = new URLSearchParams(searchParams);
      if (!next.has('page')) next.set('page', '1');
      if (!next.has('limit')) next.set('limit', '10');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const fetchSpecimens = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await productsService.getAll();
      setSpecimens(data);
    } catch (err) {
      setErrorMessage(err.message || 'No se pudieron conectar los especímenes de iNaturalist.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecimens();
  }, []);

  const updatePagination = (page, limit = itemsPerPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    next.set('limit', String(limit));
    setSearchParams(next);
  };

  const handlePageChange = (newPage) => updatePagination(newPage);
  const handleLimitChange = (newLimit) => updatePagination(1, newLimit);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    updatePagination(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    updatePagination(1);
  };

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' });
  };

  const filteredSpecimens = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return specimens.filter((item) => {
      const matchesSearch =
        !q ||
        item.commonName?.toLowerCase().includes(q) ||
        item.scientificName?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);

      const matchesCategory = selectedCategory
        ? item.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          item.taxon?.toLowerCase() === selectedCategory.toLowerCase()
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [specimens, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredSpecimens.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSpecimens = filteredSpecimens.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const createdItem = await productsService.create(formData);
      setSpecimens((prev) => [createdItem, ...prev]);
      setIsCreateModalOpen(false);
      updatePagination(1);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (specimen) => setEditingSpecimen(specimen);
  const handleStartDelete = (specimen) => {
    setDeletingSpecimen(specimen);
    setIsDeleteConfirmOpen(true);
  };

  const handleEditFormSubmit = (formData) => {
    setPendingEditData(formData);
    setIsEditConfirmOpen(true);
  };

  const handleConfirmEdit = async () => {
    if (!editingSpecimen || !pendingEditData) return;
    try {
      setIsSubmitting(true);
      const updatedItem = await productsService.update(editingSpecimen.id, pendingEditData);
      setSpecimens((prev) =>
        prev.map((s) => (s.id === editingSpecimen.id ? { ...s, ...updatedItem } : s))
      );
      setIsEditConfirmOpen(false);
      setEditingSpecimen(null);
      setPendingEditData(null);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSpecimen) return;
    try {
      setIsSubmitting(true);
      await productsService.remove(deletingSpecimen.id);
      setSpecimens((prev) => prev.filter((s) => s.id !== deletingSpecimen.id));
      setIsDeleteConfirmOpen(false);
      setDeletingSpecimen(null);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121614] text-zinc-100 flex flex-col font-['Mulish']">
      {/* Navbar Superior */}
      <div className="flex items-center bg-neutral-900/95 border-b border-zinc-800 sticky top-0 z-30">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="ml-4 p-2 rounded-lg bg-zinc-800 text-lime-400 hover:bg-zinc-700 transition cursor-pointer"
          title={isSidebarOpen ? 'Ocultar menú lateral' : 'Mostrar menú lateral'}
        >
          {isSidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <div className="flex-1">
          <Navbar
            user={user}
            onLogout={onLogout}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={INSECT_CATEGORIES}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        </div>
      </div>

      <div className="flex-1 max-w-[1600px] w-full mx-auto flex overflow-hidden">
        {/* Sidebar Izquierdo */}
        {isSidebarOpen && (
          <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        )}

        {/* Columna Central */}
        <main className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
          {activeTab !== 'galeria' ? (
            <div className="flex-1 flex items-center justify-center py-16 px-4">
              <div className="w-full max-w-md bg-neutral-900 rounded-2xl outline outline-1 outline-zinc-800 p-8 shadow-xl flex flex-col items-center text-center gap-4">
                <div className="size-12 rounded-xl bg-zinc-800/80 outline outline-1 outline-lime-500/20 flex items-center justify-center text-lime-400">
                  <Clock className="size-6 text-lime-400" />
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-neutral-800 rounded-full outline outline-1 outline-lime-500/30">
                    <span className="size-1.5 bg-lime-500 rounded-full" />
                    <span className="text-lime-400 text-[10px] font-extrabold uppercase tracking-wide">
                      Módulo en desarrollo
                    </span>
                  </div>
                  <h2 className="text-white text-lg font-bold mt-1">
                    Próximamente
                  </h2>
                  <p className="text-zinc-400 text-xs leading-relaxed max-w-xs">
                    Esta sección estará disponible en una próxima actualización de Insectopia.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Selector Para ti / Global */}
              <div className="w-full px-3.5 py-2.5 bg-neutral-900/90 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedMode('parati')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      feedMode === 'parati'
                        ? 'bg-lime-500 text-lime-950 shadow-sm'
                        : 'bg-zinc-900 text-neutral-400 outline outline-1 outline-zinc-800'
                    }`}
                  >
                    <span className="size-2 bg-lime-950 rounded-full" />
                    Para ti
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedMode('global')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      feedMode === 'global'
                        ? 'bg-lime-500 text-lime-950 shadow-sm'
                        : 'bg-zinc-900 text-neutral-400 outline outline-1 outline-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <Globe className="size-3.5" />
                    Global
                  </button>
                </div>
              </div>

              {/* Encabezado */}
              <div className="pt-1 flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-white text-lg font-bold leading-7">
                    Galería de Observaciones y Taxones
                  </h1>
                  {/* Badge dinámico */}
                  <span className="px-2.5 py-0.5 bg-neutral-800 rounded-full outline outline-1 outline-lime-500/30 text-lime-400 text-xs font-semibold">
                    {filteredSpecimens.length} en vitrina • {specimens.length} total
                  </span>
                </div>
                <p className="text-zinc-400 text-xs">
                  Avistamientos fotográficos validados por la comunidad taxonómica de iNaturalist
                </p>
              </div>

              {/* Estados de Carga y Error */}
              {isLoading && (
                <div className="w-full py-20 flex flex-col items-center justify-center gap-3 bg-neutral-900/40 rounded-2xl border border-zinc-800/80">
                  <Loader2 className="size-9 text-lime-400 animate-spin" />
                  <p className="text-lime-400 text-sm font-semibold tracking-wide animate-pulse">
                    Cargando especímenes de iNaturalist...
                  </p>
                </div>
              )}

              {!isLoading && errorMessage && (
                <div className="w-full p-5 bg-red-950/40 border border-red-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="size-6 text-red-400 shrink-0" />
                    <div>
                      <h4 className="text-red-300 font-bold text-sm">Error de conexión</h4>
                      <p className="text-zinc-400 text-xs">{errorMessage}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={fetchSpecimens}
                    className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {/* Carrusel Horizontal de las publicaciones sin barra de scroll visual */}
              {!isLoading && !errorMessage && (
                <div className="relative px-6">
                  {filteredSpecimens.length === 0 ? (
                    <div className="py-16 text-center text-zinc-400 bg-neutral-900/50 rounded-2xl border border-zinc-800">
                      <p className="text-sm">No se encontraron especímenes con los filtros seleccionados.</p>
                    </div>
                  ) : (
                    <div
                      ref={scrollRef}
                      className="flex gap-4 overflow-x-hidden pb-4 pt-1 scroll-smooth"
                    >
                      {currentSpecimens.map((item) => (
                        <div
                          key={item.id}
                          className="w-[320px] min-w-[320px] bg-neutral-900 rounded-2xl outline outline-1 outline-zinc-800 flex flex-col justify-between overflow-hidden shadow-md shrink-0"
                        >
                          <div>
                            <div className="relative h-48 bg-zinc-900 overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title || item.commonName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80';
                                }}
                              />
                              <span className="px-1.5 py-0.5 left-2.5 top-2.5 absolute bg-lime-500 rounded-sm text-zinc-950 text-[10px] font-extrabold max-w-[80px] truncate">
                                #{item.id}
                              </span>
                              <span
                                className={`px-2 py-0.5 right-2.5 top-2.5 absolute bg-neutral-950/90 rounded-md outline outline-1 backdrop-blur-sm text-xs font-semibold ${item.taxonColor}`}
                              >
                                {item.taxon || item.category}
                              </span>
                              <span className="px-2 py-0.5 left-2.5 bottom-2.5 absolute bg-neutral-950/90 rounded-md backdrop-blur-sm text-zinc-300 text-[10px] max-w-[210px] truncate flex items-center gap-1">
                                <MapPin className="size-3 text-lime-400 shrink-0" />
                                <span className="truncate">{item.location}</span>
                              </span>
                            </div>

                            <div className="p-3.5 flex flex-col gap-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <div className="truncate mr-2">
                                  <span className="text-zinc-300 font-medium">{item.author} </span>
                                  <span className="text-zinc-500 font-medium">{item.handle}</span>
                                </div>
                                <span className="text-zinc-400 shrink-0">{item.time || item.timeAgo}</span>
                              </div>

                              <div className="text-sm leading-5">
                                <span className="text-white font-bold">{item.commonName || item.title} </span>
                                <span className="text-zinc-300 font-normal italic">
                                  {item.scientific || (item.scientificName ? `(${item.scientificName})` : '')}
                                </span>
                              </div>

                              <p className="text-zinc-400 text-xs leading-4 line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Pie de la tarjeta con acciones CRUD discretas (Pencil y Trash2) */}
                          <div className="px-3.5 py-2 bg-zinc-900/60 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
                            <div className="flex items-center gap-1">
                              <span className="text-lime-500 font-bold">▲</span> {item.likes || item.upvotes}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(item)}
                                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-lime-400 transition cursor-pointer"
                                title="Editar espécimen"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStartDelete(item)}
                                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                                title="Eliminar espécimen"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Flechas circulares laterales para scroll horizontal */}
                  <button
                    type="button"
                    onClick={handleScrollLeft}
                    className="size-11 left-0 top-1/2 -translate-y-1/2 absolute bg-neutral-900/95 rounded-full outline outline-2 outline-lime-500/40 flex items-center justify-center text-lime-400 shadow-xl cursor-pointer hover:bg-neutral-800 z-20"
                    title="Desplazar a la izquierda"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleScrollRight}
                    className="size-11 right-0 top-1/2 -translate-y-1/2 absolute bg-lime-500 rounded-full outline outline-2 outline-white/20 flex items-center justify-center text-zinc-950 shadow-xl cursor-pointer hover:bg-lime-400 z-20"
                    title="Desplazar a la derecha"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </div>
              )}

              {/* Barra de Paginación Inferior Sincronizada con la URL (?page=1&limit=10) */}
              <div className="px-4 py-3 bg-neutral-900 rounded-2xl outline outline-1 outline-zinc-800 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-2 bg-lime-400 rounded-full" />
                    <div className="text-xs leading-4">
                      <span className="text-zinc-400">Mostrando </span>
                      <span className="text-white font-bold">
                        {filteredSpecimens.length === 0
                          ? 0
                          : startIndex + 1}
                        -
                        {Math.min(startIndex + itemsPerPage, filteredSpecimens.length)}
                      </span>
                      <span className="text-zinc-400"> de </span>
                      <span className="text-lime-400 font-bold">{filteredSpecimens.length}</span>
                      <span className="text-zinc-400"> especímenes</span>
                    </div>
                  </div>

                  {/* Selector compacto de cantidad de registros por página */}
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 border-l border-zinc-800 pl-3">
                    <span className="hidden sm:inline">Por página:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleLimitChange(Number(e.target.value))}
                      className="bg-zinc-900 text-lime-400 font-bold border border-zinc-700 rounded-lg px-2 py-1 outline-none focus:border-lime-500 cursor-pointer text-xs"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={40}>40</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                {/* Botones numéricos de página */}
                <div className="p-1 bg-zinc-900/60 rounded-xl outline outline-1 outline-zinc-800 flex items-center gap-1 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={`size-7 rounded-lg text-xs flex items-center justify-center cursor-pointer transition ${
                        currentPage === p
                          ? 'bg-lime-500 text-zinc-950 font-bold shadow'
                          : 'text-zinc-300 hover:bg-zinc-800 font-medium'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Botones Anterior / Siguiente */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage <= 1}
                    className="px-3 py-1.5 bg-zinc-900 rounded-lg outline outline-1 outline-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-zinc-800 disabled:opacity-40"
                  >
                    <ChevronLeft className="size-3.5 text-lime-400" />
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage >= totalPages}
                    className="px-3.5 py-1.5 bg-lime-500 rounded-lg text-zinc-950 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-lime-400 disabled:opacity-40"
                  >
                    Siguiente
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Columna Derecha (Sugerencias y Tendencias) */}
        <aside className="hidden xl:flex w-72 min-w-[288px] bg-neutral-900 border-l border-zinc-800 p-4 flex-col gap-4 shrink-0">
          <div className="p-3.5 bg-zinc-900 rounded-xl outline outline-1 outline-zinc-800 flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 bg-lime-500 rounded-full" />
              <span className="text-zinc-100 text-[10px] font-extrabold uppercase tracking-wide">
                Sugerencias
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Adelina', info: '@AdNieto • Arácnidos', following: false },
                { name: 'Magali', info: '@TinkyW • Escarabajos', following: false },
                { name: 'Ale', info: '@Alezz • Hormigas', following: true },
              ].map((person) => (
                <div key={person.name} className="p-1 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-lime-400 ring-1 ring-lime-500/30">
                      {person.name[0]}
                    </div>
                    <div className="leading-tight">
                      <div className="text-zinc-100 text-xs font-bold">{person.name}</div>
                      <div className="text-neutral-400 text-[10px]">{person.info}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                      person.following
                        ? 'bg-lime-500 text-lime-950'
                        : 'bg-neutral-800 text-neutral-400 outline outline-1 outline-zinc-700 hover:text-white'
                    }`}
                  >
                    {person.following ? 'Siguiendo' : 'Seguir'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-zinc-900 rounded-xl outline outline-1 outline-zinc-800 flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-lime-400" />
              <span className="text-zinc-100 text-[10px] font-extrabold uppercase tracking-wide">
                Especies en tendencia
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { rank: '#1', name: 'Chrysina limbata', count: '1.2k registros', highlight: true },
                { rank: '#2', name: 'Lucanus cervus', count: '890 registros', highlight: false },
                { rank: '#3', name: 'Atta mexicana', count: '640 registros', highlight: false },
              ].map((sp) => (
                <div key={sp.rank} className="p-2 bg-neutral-800 rounded-lg outline outline-1 outline-zinc-800 flex items-center gap-2.5">
                  <span className={`text-xs font-extrabold ${sp.highlight ? 'text-lime-500' : 'text-neutral-400'}`}>{sp.rank}</span>
                  <div className="leading-tight">
                    <div className="text-zinc-100 text-xs font-semibold italic">{sp.name}</div>
                    <div className="text-neutral-400 text-[10px]">{sp.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <ProductModal
        isOpen={isCreateModalOpen || Boolean(editingSpecimen)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingSpecimen(null);
          setPendingEditData(null);
        }}
        onSubmit={editingSpecimen ? handleEditFormSubmit : handleCreateSubmit}
        initialData={editingSpecimen}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={isEditConfirmOpen}
        onClose={() => setIsEditConfirmOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar Edición"
        message="¿Confirmas que deseas guardar los cambios en este espécimen?"
        confirmText="Guardar Cambios"
        cancelText="Volver a editar"
        isLoading={isSubmitting}
      />

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setDeletingSpecimen(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Espécimen"
        message="¿Estás seguro de que deseas eliminar este avistamiento de forma permanente?"
        confirmText="Eliminar"
        isDanger
        isLoading={isSubmitting}
      />
    </div>
  );
}