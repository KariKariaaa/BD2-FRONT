import { useState, useEffect } from 'react';
import { useToast } from './assets/ToastProvider';
import { actualizarContraseña } from "./sqlConexion";

export default function ModalFormulario({ visible, onClose, onGuardado }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    passante: '',
    pass: '',
    passconfirm: ''
  });

  const [errores, setErrores] = useState({
    general: ''
  });

useEffect(() => {
    if(visible){
      setErrores({general: ''});

      setFormData(
        {passante: '', pass: '', passconfirm: ''}
      )
    }
}, [visible]);

const handleResetPassword = async () => {
    const nombreUsuario = localStorage.getItem('NombreUsuario');
    const result = await actualizarContraseña({ usuario: nombreUsuario, ...formData });
  
    if (!result.success) {
        setErrores({ general: result.message || "Error desconocido" });
        addToast(result.message || "Error al guardar", "error");
    } else {
        setErrores({ general: ""});
        addToast("Contraseña Editada con éxito", "success");
        onGuardado(); // refresca la lista en el padre
        onClose();    // cierra el modal
    }
};



  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#58585a] text-white rounded-2xl w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto p-8 scrollbar-thin">
        <h2 className="text-2xl text-center mb-6">EDITAR CONTRASEÑA</h2>

        {/* Formulario */}

        <div className='mb-4'>
            <label className="block uppercase text-sm text-center mb-1">Contraseña Anterior:</label>
            <input
            type="password"
            placeholder="Ingresa tu contraseña anterior"
            onChange={(e) => setFormData({ ...formData, passante: e.target.value })}
            className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block uppercase text-sm text-center mb-1">Nueva Contraseña:</label>
                <input
                type="password"
                placeholder="Ingresa tu nueva contraseña"
                onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                className="w-full bg-white text-black rounded-2xl px-3 py-2"
                />
            </div>

            <div>
                <label className="block uppercase text-sm text-center mb-1">Confirmar Contraseña:</label>
                <input
                type="password"
                placeholder="Confirma tu nueva contraseña"
                onChange={(e) => setFormData({ ...formData, passconfirm: e.target.value })}
                className="w-full bg-white text-black rounded-2xl px-3 py-2"
                />
            </div>
        </div>

        {errores.general && (
            <span className="text-red-400 text-center text-sm">{errores.general}</span>
            )}

        {/* Botones */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="bg-[#f68b26] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
            onClick={handleResetPassword}
          >
            EDITAR
          </button>
          <button
            onClick={onClose}
            className="bg-[#f68b26] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}
