import { useState, useEffect } from "react";
import { usuarios, eliminarUsuario, accesos} from "./sqlConexion";
import { useNavigate } from 'react-router-dom';
import { useToast } from './assets/ToastProvider';
import { FaTrash, FaPlus} from 'react-icons/fa';
import ModalFormulario from './ModalUsuarios';

function Inicio() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [mostrarModal, setMostrarModal] = useState(false);

    const [usuariosList, setUsuariosList] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const idUsuario = localStorage.getItem("idUsuario");
        const nombreUsuario = localStorage.getItem("NombreUsuario");
        const rol = localStorage.getItem('Rol');

        // Si no está logueado → redirigir
        if (!idUsuario || !nombreUsuario || !rol) {
            navigate("/");
            return;
        } else {
            traerUsuarios();
        }
    }, []);

    const traerUsuarios = async () => {
        const result = await usuarios();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setUsuariosList(result.data);
        }
    };
  
    const eliminarUsuarios = async (usuario) => {
        const result = await eliminarUsuario(usuario);

        if (!result.success) {
            addToast(result.message || "Error desconocido", "error");
            setError(result.message || "Error desconocido");
        } else {
            addToast(result.message, "success");
            setError("");
            traerUsuarios();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">

            {/* Botón a la derecha en pantallas grandes */}
            <div className="md:ml-auto mr-50">
                <button
                    onClick={() => setMostrarModal(true)}
                    className="flex items-center gap-2 bg-[#f68b26] text-white rounded-full px-4 py-2 font-semibold"
                >
                    CREAR/EDITAR USUARIO <FaPlus />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <span className='text-sm whitespace-nowrap'>USUARIOS:</span>
            </div>

            {/* Tabla con scroll */}
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-3 text-center font-medium">NOMBRE DE USUARIO</th>
                            <th className="p-3 text-center font-medium">CORREO</th>
                            <th className="p-3 text-center font-medium">ROL</th>
                            <th className="p-3 text-center font-medium">ESTADO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosList.map((p, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 text-center">{p.Usuario}</td>
                                <td className="p-3 text-center">{p.Correo}</td>
                                <td className="p-3 text-center">{p.Rol}</td>
                                <td className="p-3 text-center">{p.Estado}</td>
                                <td className="p-3 text-center">
                                    <button onClick={() => eliminarUsuarios(p.Usuario)} className="text-red-700 hover:text-[#58585a]">
                                    <FaTrash size={30} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {usuariosList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay usuarios registrados
                    </p>
                )}
            </div>

            {error && <span className="text-red-600 underline text-sm">{error}</span>}

            {/* Modal */}
            <ModalFormulario 
                visible={mostrarModal} 
                onClose={() => setMostrarModal(false)} 
                onGuardado={async () => {
                setMostrarModal(false);
                await traerUsuarios();
                }}
            />
        </div>
    );
}

export default Inicio;
