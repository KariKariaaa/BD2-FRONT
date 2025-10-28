import { useState, useEffect } from "react";
import { estudiantes, eliminarEstudiante } from "./sqlConexion";
import { useNavigate } from 'react-router-dom';
import { useToast } from './assets/ToastProvider';
import { FaTrash, FaPlus} from 'react-icons/fa';
import ModalFormulario from './ModalEstudiantes';

function Inicio() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [mostrarModal, setMostrarModal] = useState(false);

    const [estudiantesList, setEstudiantesList] = useState([]);
    const [error, setError] = useState("");

    const [idRol, setIdRol] = useState(null);

    useEffect(() => {
        const idUsuario = localStorage.getItem("idUsuario");
        const nombreUsuario = localStorage.getItem("NombreUsuario");
        const rol = localStorage.getItem('Rol');
        setIdRol(parseInt(rol)); // Asegura que sea número

        // Si no está logueado → redirigir
        if (!idUsuario || !nombreUsuario || !rol) {
            navigate("/");
            return;
        } else {
            traerEstudiantes();
        }
    }, []);

    const traerEstudiantes = async () => {
        const result = await estudiantes();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setEstudiantesList(result.data);
        }
    };

    const eliminarEstudiantes = async (idEstudiante) => {
        const result = await eliminarEstudiante(idEstudiante);

        if (!result.success) {
            addToast(result.message || "Error desconocido", "error");
            setError(result.message || "Error desconocido");
        } else {
            addToast(result.message, "success");
            setError("");
            traerEstudiantes();
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
                    CREAR/EDITAR ESTUDIANTE <FaPlus />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <span className='text-sm whitespace-nowrap'>ESTUDIANTES:</span>
            </div>

            {/* Tabla con scroll */}
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-3 text-center font-medium">CARNET</th>
                            <th className="p-3 text-center font-medium">NOMBRES</th>
                            <th className="p-3 text-center font-medium">APELLIDOS</th>
                            <th className="p-3 text-center font-medium">CORREO</th>
                            <th className="p-3 text-center font-medium">TELÉFONO</th>
                            <th className="p-3 text-center font-medium">FECHA DE REGISTRO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantesList.map((p, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 text-center">{p.Carnet}</td>
                                <td className="p-3 text-center">{p.Nombres}</td>
                                <td className="p-3 text-center">{p.Apellidos}</td>
                                <td className="p-3 text-center">{p.Correo}</td>
                                <td className="p-3 text-center">{p.Telefono}</td>
                                <td className="p-3 text-center">{p.FechaRegistro}</td>
                                <td className="p-3 text-center">
                                {/* Solo mostrar si idRol es 1*/}
                                { idRol === 1  && (
                                    <>
                                    <button onClick={() => eliminarEstudiantes(p.idEstudiante)} className="text-red-700 hover:text-[#58585a]">
                                        <FaTrash size={30} />
                                    </button>
                                    </>
                                )}  
                                {/* Solo mostrar si idRol es 1*/}
                                { idRol === 2  && (
                                    <>
                                    <button onClick={() => addToast("No tienes permiso para realizar esta acción")} className="text-red-700 hover:text-[#58585a]">
                                        <FaTrash size={30} />
                                    </button>
                                    </>
                                )}  
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {estudiantesList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay estudiantes registrados
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
                await traerEstudiantes();
                }}
            />
        </div>
    );
}

export default Inicio;
