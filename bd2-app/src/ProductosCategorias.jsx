import { useState, useEffect } from "react";
import { categorias, eliminarCategoria, productos, obtenerCategoriasProducto, eliminarProducto } from "./sqlConexion";
import { useNavigate } from 'react-router-dom';
import { useToast } from './assets/ToastProvider';
import { FaTrash, FaPlus} from 'react-icons/fa';
import ModalFormulario from './ModalCategorias';
import ModalFormulario2 from './ModalProductos';

function Inicio() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModal2, setMostrarModal2] = useState(false);

    const [categoriasList, setCategoriasList] = useState([]);
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
            traerCategorias();
            traerProductos();
        }
    }, []);

    const traerCategorias = async () => {
        const result = await categorias();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setCategoriasList(result.data);
        }
    };

    const eliminarCategorias = async (idCategoria) => {
        const result = await eliminarCategoria(idCategoria);

        if (!result.success) {
            addToast(result.message || "Error desconocido", "error");
            setError(result.message || "Error desconocido");
        } else {
            addToast(result.message, "success");
            setError("");
            traerCategorias();
        }
    };

    const traerProductos = async () => {
        const result = await productos();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setProductosList(result.data);

            // 🔸 Traer las categorías de cada producto en paralelo
            for (const p of result.data) {
            await traerCategoriasProducto(p.SKU);
            }
        }
    };

    const traerCategoriasProducto = async (sku) => {
        const result = await obtenerCategoriasProducto(sku);

        if (!result.success) {
            console.error(result.message || "Error desconocido");
            return;
        }

        // result.data puede ser un solo registro o varios, ajustemos:
        const categorias = Array.isArray(result.data)
            ? result.data.map(c => c.Categoria)
            : [result.data.Categoria];

        setCategoriasPorProducto(prev => ({
            ...prev,
            [sku]: categorias, // guarda por SKU
        }));
    };


    const eliminarProductos = async (idProducto, estado) => {
        if(estado == "Disponible"){
            addToast("El producto sigue disponible, así que no puede ser eliminado", "success");
        }else{
            const result = await eliminarProducto(idProducto);

            if (!result.success) {
                addToast(result.message || "Error desconocido", "error");
                setError(result.message || "Error desconocido");
            } else {
                addToast(result.message, "success");
                setError("");
                traerProductos();
            }
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
                    CREAR/EDITAR CATEGORÍAS <FaPlus />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <span className='text-sm whitespace-nowrap'>CATEGORÍAS:</span>
            </div>

            {/* Tabla con scroll */}
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-3 text-center font-medium">CATEGORÍA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoriasList.map((p, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 text-center">{p.Categoria}</td>
                                <td className="p-3 text-center">
                                {/* Solo mostrar si idRol es 1*/}
                                { idRol === 1  && (
                                    <>
                                    <button onClick={() => eliminarCategorias(p.Categoria)} className="text-red-700 hover:text-[#58585a]">
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

                {categoriasList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay categorías registradas
                    </p>
                )}
            </div>

            {error && <span className="text-red-600 underline text-sm">{error}</span>}

            {/* Botón a la derecha en pantallas grandes */}
            <div className="md:ml-auto mr-50">
                <button
                    onClick={() => setMostrarModal2(true)}
                    className="flex items-center gap-2 bg-[#f68b26] text-white rounded-full px-4 py-2 font-semibold"
                >
                    CREAR/EDITAR PRODUCTOS <FaPlus />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <span className='text-sm whitespace-nowrap'>PRODUCTOS:</span>
            </div>

            {/* Tabla con scroll */}
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-3 text-center font-medium">SKU</th>
                            <th className="p-3 text-center font-medium">PRODUCTO</th>
                            <th className="p-3 text-center font-medium">STOCK</th>
                            <th className="p-3 text-center font-medium">PRECIO COSTO</th>
                            <th className="p-3 text-center font-medium">PRECIO VENTA</th>
                            <th className="p-3 text-center font-medium">DESCUENTO</th>
                            <th className="p-3 text-center font-medium">ESTADO</th>
                            <th className="p-3 text-center font-medium">CATEGORÍAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosList.map((p, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 text-center">{p.SKU}</td>
                                <td className="p-3 text-center">{p.Producto}</td>
                                <td className="p-3 text-center">{p.Stock}</td>
                                <td className="p-3 text-center">{p.PrecioCosto}</td>
                                <td className="p-3 text-center">{p.PrecioVenta}</td>
                                <td className="p-3 text-center">{p.Descuento*100}%</td>
                                <td className="p-3 text-center">{p.Estado}</td>
                                <td className="p-3 text-center">
                                    {categoriasPorProducto[p.SKU]
                                    ? categoriasPorProducto[p.SKU].join(", ")
                                    : "Cargando..."}
                                </td>
                                <td className="p-3 text-center">
                                {/* Solo mostrar si idRol es 1*/}
                                { idRol === 1  && (
                                    <>
                                    <button onClick={() => eliminarProductos(p.IdProducto, p.Estado)} className="text-red-700 hover:text-[#58585a]">
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

                {productosList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay productos registrados
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
                await traerCategorias();
                }}
            />

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
