import { AlertTriangle, AlertCircle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar Acción',
  message = '¿Estás seguro de que deseas continuar con esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = false,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 font-['Mulish']">
      <div className="w-full max-w-md bg-[#161B18] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div
              className={`size-9 rounded-xl flex items-center justify-center ${
                isDanger
                  ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                  : 'bg-lime-500/15 border border-lime-500/30 text-lime-400'
              }`}
            >
              {isDanger ? <AlertCircle className="size-5" /> : <AlertTriangle className="size-5" />}
            </div>
            <h3 className="text-white text-base font-bold">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            title="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-zinc-300 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="px-6 py-4 bg-neutral-900/40 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer disabled:opacity-60 ${
              isDanger
                ? 'bg-red-500 hover:bg-red-400 text-white shadow-[0px_0px_12px_0px_rgba(239,68,68,0.30)]'
                : 'bg-lime-500 hover:bg-lime-400 text-lime-950 shadow-[0px_0px_12px_0px_rgba(133,196,46,0.30)]'
            }`}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
