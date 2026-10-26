import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logoImg from '../assets/logo.png';
import authService from '../services/authService';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() && !password.trim()) {
      setErrorMessage('Por favor ingresa tu usuario y contraseña.');
      return;
    }

    if (!username.trim()) {
      setErrorMessage('Por favor ingresa tu usuario (ej. emilys).');
      return;
    }

    if (!password) {
      setErrorMessage('Por favor ingresa tu contraseña.');
      return;
    }

    try {
      setIsLoading(true);
      const userData = await authService.login({
        username: username.trim(),
        password,
      });

      if (onLogin) {
        onLogin(userData);
      }
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Usuario o contraseña incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#121614] font-['Mulish'] p-4">
      <div className="w-full max-w-[1200px] min-h-[620px] grid grid-cols-1 md:grid-cols-12 bg-[#161B18] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Panel Izquierdo - Logo e Identidad */}
        <div className="hidden md:flex md:col-span-7 flex-col items-center justify-center bg-[#161B18] border-r border-white/15 p-12 select-none">
          <img
            src={logoImg}
            alt="Insectopia Logo"
            className="w-80 h-80 object-contain mb-2 drop-shadow-lg"
          />
          <h1 className="text-white text-5xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-normal">
            Insectopia
          </h1>
        </div>

        {/* Panel Derecho - Formulario */}
        <div className="col-span-1 md:col-span-5 flex flex-col justify-center px-8 py-12 sm:px-14 bg-[#161B18]">
          
          {/* Logo en Móvil */}
          <div className="flex md:hidden flex-col items-center mb-8">
            <img
              src={logoImg}
              alt="Insectopia Logo"
              className="w-28 h-28 object-contain mb-2"
            />
            <span className="text-white text-2xl font-extrabold font-['Plus_Jakarta_Sans']">
              Insectopia
            </span>
          </div>

          <h2 className="text-white text-4xl font-normal font-['Mulish'] text-center mb-10">
            Bienvenido
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Campo Usuario / Correo */}
            <div>
              <label
                htmlFor="username-input"
                className="block text-white/90 text-sm font-bold mb-2 pl-3"
              >
                Correo
              </label>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu correo o usuario (ej. emilys)"
                className="w-full h-13 py-3.5 bg-[#E8ECEA] rounded-md px-5 text-sm text-gray-900 placeholder:text-black/50 placeholder:font-bold font-bold outline-none focus:ring-2 focus:ring-lime-500 transition"
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-2 pl-3 pr-1">
                <label
                  htmlFor="password-input"
                  className="text-white/90 text-sm font-bold"
                >
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-xs font-bold text-white/90 hover:text-lime-400 transition"
                >
                  Has olvidado tu contraseña?
                </button>
              </div>

              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full h-13 py-3.5 bg-[#E8ECEA] rounded-md pl-5 pr-12 text-sm text-gray-900 placeholder:text-black/50 placeholder:font-bold font-bold outline-none focus:ring-2 focus:ring-lime-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black transition"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mensaje de Error */}
            {errorMessage && (
              <div className="bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-bold rounded-md p-3 text-center">
                {errorMessage}
              </div>
            )}

            {/* Botón Iniciar Sesión */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 py-3.5 bg-gradient-to-r from-[#84cc16] to-[#3f6212] hover:opacity-95 active:scale-[0.99] text-white text-sm font-bold rounded-md shadow-md transition flex items-center justify-center cursor-pointer disabled:opacity-60"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Separador */}
          <div className="my-7 text-center text-xs text-white/90 font-bold">
            O inicia sesión con
          </div>

          {/* Botones Sociales con los íconos exactos de tu Figma */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              className="h-12 bg-[#E8ECEA] hover:bg-white text-black/70 text-sm font-bold rounded-md flex items-center justify-center gap-2.5 transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 15.65 5 12c0-3.65 3.36-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="h-12 bg-[#E8ECEA] hover:bg-white text-black/70 text-sm font-bold rounded-md flex items-center justify-center gap-2.5 transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Pie de registro */}
          <p className="mt-10 text-center text-xs font-bold text-white/90">
            No tienes una cuenta?{' '}
            <button type="button" className="text-[#84cc16] font-bold hover:underline cursor-pointer">
              Crea una ahora
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}