import { useState, useEffect } from "react";
import { ventas, eliminarProducto } from "./sqlConexion";
import { useNavigate } from 'react-router-dom';
import { useToast } from './assets/ToastProvider';
import { FaTrash, FaPlus} from 'react-icons/fa';
import ModalFormulario2 from './ModalVenderProducto';

function Inicio() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [mostrarModal2, setMostrarModal2] = useState(false);

    const [productosList, setProductosList] = useState([]);
    const [categoriasPorProducto, setCategoriasPorProducto] = useState({});

    const [error, setError] = useState("");

    const [idRol, setIdRol] = useState(null);

    const [formData, setFormData] = useState({
            categoria: '',
            producto: ''
        });

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
            traerProductos();
        }
    }, []);

    const traerProductos = async () => {
        const result = await ventas();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setProductosList(result.data)
        }
    };

    const formatear = (fecha) => {
        if (!fecha) return '';

        const fechaDate = new Date(fecha);

        const fechaFormateada = fechaDate.toLocaleString("es-ES", {
            timeZone: "UTC",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        return fechaFormateada;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">

            {/* Botón a la derecha en pantallas grandes */}
            <div className="flex items-center gap-2 mb-20">
                <button
                    onClick={() => setMostrarModal2(true)}
                    className="flex items-center gap-2 bg-[#f68b26] text-white rounded-full px-4 py-2 font-semibold"
                >
                    AGREGAR VENTA <FaPlus />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <span className='text-sm whitespace-nowrap'>VENTAS:</span>
            </div>

            {/* Tabla con scroll */}
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-3 text-center font-medium">PRODUCTO</th>
                            <th className="p-3 text-center font-medium">USUARIO</th>
                            <th className="p-3 text-center font-medium">ROL</th>
                            <th className="p-3 text-center font-medium">CANTIDAD</th>
                            <th className="p-3 text-center font-medium">PRECIO UNITARIO</th>
                            <th className="p-3 text-center font-medium">FECHA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosList.map((p, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 text-center">{p.Producto}</td>
                                <td className="p-3 text-center">{p.Usuario}</td>
                                <td className="p-3 text-center">{p.Rol}</td>
                                <td className="p-3 text-center">{p.Cantidad}</td>
                                <td className="p-3 text-center">{p.PrecioUnitario}</td>
                                <td className="p-3 text-center">{formatear(p.Fecha)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {productosList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay productos registrados
                    </p>
                )}
            </div>

            {error && <span className="text-red-600 underline text-sm">{error}</span>}

            {/* Modal */}
            <ModalFormulario2 
                visible={mostrarModal2} 
                onClose={() => setMostrarModal2(false)} 
                onGuardado={async () => {
                setMostrarModal2(false);
                await traerProductos();
                }}
            />
        </div>
    );
}

export default Inicio;
