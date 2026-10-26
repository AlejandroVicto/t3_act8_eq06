import { Search, Plus, Bell, LogOut, ChevronDown } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Navbar({
  user,
  onLogout,
  searchTerm = '',
  onSearchChange,
  selectedCategory = '',
  onCategoryChange,
  categories = [],
  onOpenCreateModal,
}) {
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.username || 'Usuario1';
  const displayHandle = user?.username ? `@${user.username}` : '@prueba';
  const avatarUrl = user?.image || 'https://dummyjson.com/icon/emilys/128';

  return (
    <header className="w-full px-6 py-2.5 bg-neutral-900/95 border-b border-zinc-800 backdrop-blur-sm sticky top-0 z-30 font-['Mulish']">
      <div className="w-full max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Izquierda: Logo + Insectopia */}
        <div className="flex items-center gap-3 min-w-[180px] select-none">
          <img
            src={logoImg}
            alt="Insectopia Logo"
            className="size-10 object-contain"
          />
          <span className="text-zinc-100 text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-8">
            Insectopia
          </span>
        </div>

        {/* Centro: Filtro de Categorías + Buscador */}
        <div className="flex-1 max-w-[720px] h-10 bg-neutral-900/90 rounded-xl outline outline-1 outline-offset-[-1px] outline-lime-500/30 flex items-center overflow-hidden shadow-sm">
          
          {/* Selector de Categorías */}
          <div className="relative h-full bg-zinc-900 border-r border-zinc-800 flex items-center">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
              className="h-full pl-3.5 pr-8 bg-transparent text-zinc-300 text-xs font-semibold outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-zinc-900 text-zinc-200">
                Todas las categorías
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-zinc-900 text-zinc-200">
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="size-3.5 text-lime-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Input de Búsqueda */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Buscar en Insectopia (especies, publicaciones, taxones...)"
            className="flex-1 h-full px-3.5 bg-transparent text-zinc-100 placeholder:text-zinc-500 text-sm outline-none"
          />

          {/* Botón verde de Lupa */}
          <button
            type="button"
            className="h-full px-4 bg-lime-500 hover:bg-lime-400 border-l border-lime-500/30 flex items-center justify-center transition cursor-pointer"
            title="Buscar"
          >
            <Search className="size-4 text-zinc-950 stroke-[2.5]" />
          </button>
        </div>

        {/* Derecha: Crear Post + Notificaciones + Perfil de Usuario + Cerrar Sesión */}
        <div className="flex items-center gap-3.5">
          {/* Botón + Crear Post */}
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-lime-500 hover:bg-lime-400 active:scale-[0.98] rounded-full shadow-[0px_0px_15px_0px_rgba(133,196,46,0.30)] flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="size-3.5 text-lime-950 stroke-[3]" />
            <span className="text-lime-950 text-xs font-bold leading-5">
              Crear Post
            </span>
          </button>

          {/* Campana de Notificaciones */}
          <button
            type="button"
            className="p-2 relative rounded-full hover:bg-zinc-800/70 transition cursor-pointer"
            title="Notificaciones"
          >
            <Bell className="size-5 text-neutral-400" />
            <span className="size-2 right-1.5 top-1.5 absolute bg-lime-500 rounded-full ring-2 ring-[#161E19]" />
          </button>

          {/* Datos del Usuario Autenticado (Requisito Fase 2) */}
          <div className="pl-3 border-l border-zinc-800 flex items-center gap-2.5">
            <img
              src={avatarUrl}
              alt={displayName}
              className="size-8 rounded-full object-cover bg-zinc-800 ring-1 ring-[#29382E]"
            />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-zinc-100 text-xs font-bold">
                {displayName}
              </span>
              <span className="text-neutral-400 text-[11px] font-normal">
                {displayHandle}
              </span>
            </div>

            {/* Botón Cerrar Sesión (Requisito Fase 2) */}
            <button
              type="button"
              onClick={onLogout}
              className="ml-2 px-2.5 py-1.5 bg-zinc-800/80 hover:bg-red-500/20 border border-zinc-700 hover:border-red-500/40 text-zinc-300 hover:text-red-400 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}