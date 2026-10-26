import { Home, Search, Bell, MessageSquare, User } from 'lucide-react';

export default function Sidebar({ activeTab = 'inicio', onSelectTab }) {
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell, badge: 5 },
    { id: 'mensajes', label: 'Mensajes', icon: MessageSquare },
    { id: 'perfil', label: 'Mi Perfil', icon: User },
  ];

  return (
    <aside className="w-52 min-w-[208px] bg-neutral-900 border-r border-zinc-800 flex flex-col justify-between p-3.5 font-['Mulish'] select-none shrink-0">
      {/* Menú de navegación */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab && onSelectTab(item.id)}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition cursor-pointer ${
                isActive
                  ? 'bg-neutral-800 shadow-[inset_0px_1px_0px_1px_rgba(133,196,46,0.15)] outline outline-1 outline-offset-[-1px] outline-lime-500/20 text-lime-500 font-bold'
                  : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-zinc-200 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`size-4 ${
                    isActive ? 'text-lime-500' : 'text-neutral-400'
                  }`}
                />
                <span className="text-xs leading-5">{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 bg-lime-500/20 rounded-full outline outline-1 outline-offset-[-1px] outline-lime-500/30 text-lime-500 text-xs font-bold leading-4">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Pie del Sidebar */}
      <div className="pt-3 border-t border-zinc-800">
        <p className="text-neutral-400/80 text-xs font-normal leading-4">
          © 2026 Insectopia
        </p>
      </div>
    </aside>
  );
}