import { useState, useEffect } from 'react';
import { useToast } from './assets/ToastProvider';
import { solicitarRecuperacion } from "./sqlConexion";

export default function ModalFormulario({ visible, onClose, onGuardado }) {
  const { addToast } = useToast();

  const [correo, setCorreo] = useState("");

useEffect(() => {
    if(visible){
      setCorreo("");
    }
}, [visible]);

const handleResetPassword = async () => {
    console.log(correo)
  const result = await solicitarRecuperacion(correo);

  if (!result.success) {
    addToast(result.message || "Error al enviar correo", "error");
  } else {
    addToast("Correo enviado, revisa tu bandeja", "success");
    onGuardado();
    onClose();
  }
};

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#58585a] text-white rounded-2xl w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto p-8 scrollbar-thin">
        <h2 className="text-2xl text-center mb-6">RECUPERAR CONTRASEÑA</h2>

        {/* Formulario */}

        <div className='mb-4'>
            <label className="block uppercase text-sm text-center mb-1">Ingresa tu correo electrónico:</label>
            <input
            type="text"
            placeholder="Ingresa tu correo electrónico"
            value = {correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="bg-[#f68b26] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
            onClick={handleResetPassword}
          >
            ENVIAR CORREO
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
