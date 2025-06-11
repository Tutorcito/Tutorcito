'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const { email, password, name } = formData;

    // Se hacen validaciones simples
    if (!email || !password || !name) {
      setError('Por favor completá todos los campos.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    const { data, error } = await auth.signUp(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Se guarda el perfil en tabla "profiles"
    const userId = data?.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: name,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Error al guardar perfil:", profileError);
        setError("El registro fue exitoso, pero hubo un problema al guardar tu perfil.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setSuccessMessage('Registro exitoso. Revisá tu correo para confirmar tu cuenta.');

    // Si se quiere redirigir directamente:
    // router.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-2">
          Creá tu cuenta en <span className="text-blue-600">Tutorcito</span>
        </h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Accedé a ayuda personalizada, de estudiante a estudiante.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && (
            <p className="text-green-600 text-sm text-center">{successMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          ¿Ya tenés cuenta?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Iniciá sesión acá
          </a>
        </p>
      </div>
    </div>
  );
}
