import { useState, useEffect } from "react";
import { productosmasvendidos, categorias, reporteinventarioactual, reporteInventario, usuarios, reporteCompras, reporteIngresos } from "./sqlConexion";
import { useNavigate } from 'react-router-dom';
import { FaFilePdf, FaCaretDown, FaFileExcel} from 'react-icons/fa';
import { exportTablePDF } from './ExportPdf';
import { exportTableExcel } from './ExportExcel';
import Select from 'react-select';
import PromedioGrafico from './GraficoTop';

function Inicio() {
    const navigate = useNavigate();
    const [productosMasVendidosList, setProductosMasVendidosList] = useState([]);
    const [inventarioActualList, setInventarioaActualList] = useState([]);
    const [categoriasList, setCategoriasList] = useState([]);
    const [usuariosList, setUsuariosList] = useState([]);
    const [reportesList, setReportesList] = useState([]);
    const [reportesComprasList, setReportesComprasList] = useState([]);
    const [error, setError] = useState("");

    const [modo, setModo] = useState("MES");
    const [año, setAño] = useState("");
    const [mes, setMes] = useState("");
    const [data, setData] = useState([]);

    const [uno, setUno] = useState(false);
    const [dos, setDos] = useState(false);
    const [tres, setTres] = useState(false);
    const [cuatro, setCuatro] = useState(false);
    const [cinco, setCinco] = useState(false);
    const [seis, setSeis] = useState(false);

    const [formData, setFormData] = useState({
        usuario: '',
        fecha1: '',
        fecha2: '',
        estado: ''
    });

    const [formData2, setFormData2] = useState({
        fecha1: '',
        fecha2: ''
    });

    useEffect(() => {
        const idUsuario = localStorage.getItem("idUsuario");
        const nombreUsuario = localStorage.getItem("NombreUsuario");
        const rol = localStorage.getItem('Rol');

        // Si no está logueado → redirigir
        if (!idUsuario || !nombreUsuario || !rol) {
            navigate("/");
            return;
        } else {
            traerInventarioActual();
            traerCategorias();
            traerUsuarios();
            traerReporte();
            traerProductosMasVendidos();
            traerReporteCompras();
        }
    }, []);

    useEffect(() => {
        traerReporte();
    }, [formData]);

    useEffect(() => {
        traerReporteCompras();
    }, [formData2]);

    const traerReporteIngresos = async () => {
        const result = await reporteIngresos(modo, parseInt(año) || null, parseInt(mes) || null);

        if (!result.success) {
        setError(result.message || "Error al obtener ingresos");
        } else {
        setError("");
        setData(result.data);
        }
    };

    useEffect(() => {
        traerReporteIngresos();
    }, [modo, año, mes]);

    const traerInventarioActual = async () => {
        const result = await reporteinventarioactual();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setInventarioaActualList(result.data);
        }
    };

    const traerProductosMasVendidos = async () => {
        const result = await productosmasvendidos();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setProductosMasVendidosList(result.data);
        }
    };

    const traerReporte = async () => {
        const result = await reporteInventario(formData.fecha1, formData.fecha2, formData.usuario, formData.estado)
        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setReportesList(result.data);
        }
    }

    const traerReporteCompras = async () => {
        const result = await reporteCompras(formData2.fecha1, formData2.fecha2)
        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setReportesComprasList(result.data);
        }
    }

    const traerCategorias = async () => {
        const result = await categorias();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");

            const product = (result.data || []).map((p) => ({
                value: p.IdCategoria,
                label: `${p.Categoria}`,
            }));
            setCategoriasList(product);
        }
    };

    const traerUsuarios = async () => {
        const result = await usuarios();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");

            const product = (result.data || []).map((p) => ({
                value: p.idUsuario,
                label: `${p.Usuario}`,
            }));
            setUsuariosList(product);
        }
    };

    const cambiarUno = () => setUno(!uno);
    const cambiarDos = () => setDos(!dos);
    const cambiarTres = () => setTres(!tres);
    const cambiarCuatro = () => setCuatro(!cuatro);
    const cambiarCinco = () => setCinco(!cinco);
    const cambiarSeis = () => setSeis(!seis);

    const formatear = (fecha) => {
        if (!fecha) return '';

        const fechaDate = new Date(fecha);

        const fechaFormateada = fechaDate.toLocaleString("es-ES", {
            timeZone: "UTC",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });

        return fechaFormateada;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">

            <div className="flex items-center gap-2 mt-10">
                <button
                    onClick={() => cambiarTres()}
                    className="flex items-center gap-2 bg-gray-600 text-white rounded-full px-4 py-2 font-semibold"
                >
                    REPORTE DE VENTAS <FaCaretDown />
                </button>
                <button
                    onClick={() =>
                        exportTablePDF(
                        "REPORTE DE VENTAS", localStorage.getItem('NombreUsuario'),
                        ["PRODUCTO", "USUARIO", "ROL", "CANTIDAD VENDIDA", "TOTAL VENDIDO", "# DE TRANSACCIONES", "PRIMERA VENTA", "ÚLTIMA VENTA"], // columnas
                        reportesList.map((p) => [
                            p.Producto,
                            p.Usuario,
                            p.Rol,
                            p.TotalCantidadVendida,
                            p.TotalVendido,
                            p.NumeroTransacciones,
                            formatear(p.PrimeraVenta),
                            formatear(p.UltimaVenta)
                        ])
                        )
                    }
                    className="flex items-center gap-2 bg-red-800 text-white rounded-full px-4 py-2 font-semibold"
                    >
                    <FaFilePdf size={25} />
                </button>
                <button
                    onClick={() =>
                        exportTableExcel(
                        "REPORTE DE VENTAS", localStorage.getItem('NombreUsuario'),
                        ["PRODUCTO", "USUARIO", "ROL", "CANTIDAD VENDIDA", "TOTAL VENDIDO", "# DE TRANSACCIONES", "PRIMERA VENTA", "ÚLTIMA VENTA"], // columnas
                        reportesList.map((p) => [
                            p.Producto,
                            p.Usuario,
                            p.Rol,
                            p.TotalCantidadVendida,
                            p.TotalVendido,
                            p.NumeroTransacciones,
                            formatear(p.PrimeraVenta),
                            formatear(p.UltimaVenta)
                        ])
                        )
                    }
                    className="flex items-center gap-2 bg-green-800 text-white rounded-full px-4 py-2 font-semibold"
                    >
                    <FaFileExcel size={25} />
                </button>
            </div>

            {/* Tabla con scroll */}
            {tres && (
            <>
            <div className="flex items-center gap-2 mt-5"> {/* FILTROS */}
                <div>
                    <label className="block uppercase text-sm mb-1">Usuario:</label>
                    <Select
                        options={usuariosList}
                        value={usuariosList.find(op => op.value === formData.usuario) || null}
                        onChange={(opcion) =>
                        setFormData({ ...formData, usuario: opcion ? opcion.value : '' })
                        }
                        placeholder="Seleccione una Usuario"
                        isClearable
                        className="text-black"
                        styles={{
                        control: (provided, state) => ({
                            ...provided,
                            borderRadius: '1rem',
                            paddingBottom: '2px',
                            paddingTop: '2px',
                            paddingLeft: '3px',
                            paddingRight: '3px',
                            backgroundColor: 'white',
                            border: `2px solid ${state.isFocused ? 'black' : '#4a5565'}`,
                            boxShadow: 'none',
                            '&:hover': {
                            borderColor: '#4a5565'
                            }
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            color: '#000'
                        }),
                        placeholder: (provided) => ({
                            ...provided,
                            color: '#444'
                        }),
                        menu: (provided) => ({
                            ...provided,
                            borderRadius: '1rem'
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused ? '#4a5565' : '#fff',
                            color: '#000',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                        })
                        }}
                    />
                    <label className="block uppercase text-sm mb-1">Fecha Inicio:</label>
                    <input
                        type="date"
                        value={formData.fecha1}
                        onChange={(e) => setFormData({ ...formData, fecha1: e.target.value })}
                        className="w-full bg-white border-2 border-[#4a5565] text-black rounded-2xl px-3 py-2"
                        />
                </div>
                
                <div>
                    <label className="block uppercase text-sm mb-1">Categoría:</label>
                    <Select
                        options={categoriasList}
                        value={categoriasList.find(op => op.value === formData.estado) || null}
                        onChange={(opcion) =>
                        setFormData({ ...formData, estado: opcion ? opcion.value : '' })
                        }
                        placeholder="Seleccione una Categoría"
                        isClearable
                        className="text-black"
                        styles={{
                        control: (provided, state) => ({
                            ...provided,
                            borderRadius: '1rem',
                            paddingBottom: '2px',
                            paddingTop: '2px',
                            paddingLeft: '3px',
                            paddingRight: '3px',
                            backgroundColor: 'white',
                            border: `2px solid ${state.isFocused ? 'black' : '#4a5565'}`,
                            boxShadow: 'none',
                            '&:hover': {
                            borderColor: '#4a5565'
                            }
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            color: '#000'
                        }),
                        placeholder: (provided) => ({
                            ...provided,
                            color: '#444'
                        }),
                        menu: (provided) => ({
                            ...provided,
                            borderRadius: '1rem'
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused ? '#4a5565' : '#fff',
                            color: '#000',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                        })
                        }}
                    />
                    <label className="block uppercase text-sm mb-1">Fecha Final:</label>
                    <input
                        type="date"
                        value={formData.fecha2}
                        onChange={(e) => setFormData({ ...formData, fecha2: e.target.value })}
                        className="w-full bg-white border-2 border-[#4a5565] text-black rounded-2xl px-3 py-2"
                    />
                </div>
            </div>
            
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-3 text-center font-medium">PRODUCTO</th>
                            <th className="p-3 text-center font-medium">USUARIO</th>
                            <th className="p-3 text-center font-medium">ROL</th>
                            <th className="p-3 text-center font-medium">CANTIDAD</th>
                            <th className="p-3 text-center font-medium">TOTAL</th>
                            <th className="p-3 text-center font-medium">NÚMERO DE TRANSACCIONES</th>
                            <th className="p-3 text-center font-medium">PRIMERA VENTA</th>
                            <th className="p-3 text-center font-medium">ÚLTIMA VENTA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportesList.map((p, i) => {
                            return (
                                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 text-center">{p.Producto}</td>
                                <td className="p-3 text-center">{p.Usuario}</td>
                                <td className="p-3 text-center">{p.Rol}</td>
                                <td className="p-3 text-center">{p.TotalCantidadVendida}</td>
                                <td className="p-3 text-center">{p.TotalVendido}</td>
                                <td className="p-3 text-center">{p.NumeroTransacciones}</td>
                                <td className="p-3 text-center">{formatear(p.PrimeraVenta)}</td>
                                <td className="p-3 text-center">{formatear(p.UltimaVenta)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {reportesList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay accesos registrados
                    </p>
                )}
            </div>
            </>)}

        <div className="flex items-center gap-2 mt-10">
                <button
                    onClick={() => cambiarUno()}
                    className="flex items-center gap-2 bg-gray-600 text-white rounded-full px-4 py-2 font-semibold"
                >
                    INVENTARIO <FaCaretDown />
                </button>
                <button
                    onClick={() =>
                        exportTablePDF(
                        "REPORTE DEL INVENTARIO ACTUAL", localStorage.getItem('NombreUsuario'),
                        ["ID", "PRODUCTO", "STOCK", "ESTADO", "TIPO DE OPERACIÓN", "FECHA DE OPERACIÓN"], // columnas
                        inventarioActualList.map((p) => [
                            p.IdProducto,
                            p.Producto,
                            p.Stock,
                            p.Estado,
                            p.TipoOperacion,
                            formatear(p.FechaOperacion)
                        ])
                        )
                    }
                    className="flex items-center gap-2 bg-red-800 text-white rounded-full px-4 py-2 font-semibold"
                    >
                    <FaFilePdf size={25} />
                </button>
                <button
                    onClick={() =>
                        exportTableExcel(
                        "REPORTE DEL INVENTARIO ACTUAL", localStorage.getItem('NombreUsuario'),
                        ["ID", "PRODUCTO", "STOCK", "ESTADO", "TIPO DE OPERACIÓN", "FECHA DE OPERACIÓN"], // columnas
                        inventarioActualList.map((p) => [
                            p.IdProducto,
                            p.Producto,
                            p.Stock,
                            p.Estado,
                            p.TipoOperacion,
                            formatear(p.FechaOperacion)
                        ])
                        )
                    }
                    className="flex items-center gap-2 bg-green-800 text-white rounded-full px-4 py-2 font-semibold"
                    >
                    <FaFileExcel size={25} />
                </button>
            </div>

            {/* Tabla con scroll */}
            {uno && (
            <>
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">   
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                        <th className="p-3 text-center font-medium">PRODUCTO</th>
                        <th className="p-3 text-center font-medium">STOCK</th>
                        <th className="p-3 text-center font-medium">ESTADO</th>
                        <th className="p-3 text-center font-medium">TIPO DE OPERACIÓN</th>
                        <th className="p-3 text-center font-medium">FECHA</th>
                        </tr>
                    </thead>
                <tbody>
                    {inventarioActualList.map((p, i) => {
                    return (
                        <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3 text-center">{p.Producto}</td>
                            <td className="p-3 text-center">{p.Stock}</td>
                            <td className="p-3 text-center">{p.Estado}</td>
                            <td className="p-3 text-center">{p.TipoOperacion}</td>
                            <td className="p-3 text-center">{formatear(p.FechaOperacion)}</td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>

                {inventarioActualList.length === 0 && !error && (
                <p className="text-center text-gray-600 underline mt-5 text-sm">
                    No hay accesos registrados
                </p>
                )}
                
            </div>
            </>
            )}

        <div className="flex items-center gap-2 mt-10">
                <button
                    onClick={() => cambiarDos()}
                    className="flex items-center gap-2 bg-gray-600 text-white rounded-full px-4 py-2 font-semibold"
                >
                    10 PRODUCTOS MÁS VENDIDOS <FaCaretDown />
                </button>
                <button
                    onClick={() =>
                        exportTablePDF(
                        "REPORTE DE PRODUCTOS MÁS VENDIDOS", localStorage.getItem('NombreUsuario'),
                        ["ID", "PRODUCTO", "CANTIDAD", "TOTAL"], // columnas
                        inventarioActualList.map((p) => [
                            p.IdProducto,
                            p.Producto,
                            p.TotalComprado,
                            p.MontoTotal
                        ])
                        )
                    }
                    className="flex items-center gap-2 bg-red-800 text-white rounded-full px-4 py-2 font-semibold"
                    >
                    <FaFilePdf size={25} />
                </button>
                <button
                    onClick={() =>
                        exportTableExcel(
                        "REPORTE DE PRODUCTOS MÁS VENDIDOS", localStorage.getItem('NombreUsuario'),
                        ["ID", "PRODUCTO", "CANTIDAD", "TOTAL"], // columnas
                        inventarioActualList.map((p) => [
                            p.IdProducto,
                            p.Producto,
                            p.TotalComprado,
                            p.MontoTotal
                        ])
                        )
                    }
                    className="flex items-center gap-2 bg-green-800 text-white rounded-full px-4 py-2 font-semibold"
                    >
                    <FaFileExcel size={25} />
                </button>
            </div>

            {/* Tabla con scroll */}
            {dos && (
            <>
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">   
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                        <th className="p-3 text-center font-medium">PRODUCTO</th>
                        <th className="p-3 text-center font-medium">CANTIDAD VENDIDA</th>
                        <th className="p-3 text-center font-medium">TOTAL</th>
                        </tr>
                    </thead>
                <tbody>
                    {productosMasVendidosList.map((p, i) => {
                    return (
                        <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3 text-center">{p.Producto}</td>
                            <td className="p-3 text-center">{p.TotalComprado}</td>
                            <td className="p-3 text-center">Q{p.MontoTotal}</td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>

                {productosMasVendidosList.length === 0 && !error && (
                <p className="text-center text-gray-600 underline mt-5 text-sm">
                    No hay accesos registrados
                </p>
                )}
                
            </div>

            <PromedioGrafico promedioList={productosMasVendidosList} />
            </>
            )}

            <div className="flex items-center gap-2 mt-10">
                <button
                    onClick={() => cambiarCuatro()}
                    className="flex items-center gap-2 bg-gray-600 text-white rounded-full px-4 py-2 font-semibold"
                >
                    REPORTE DE COMPRAS <FaCaretDown />
                </button>
                <button
                    onClick={() =>
                        exportTablePDF(
                        "REPORTE DE VENTAS", localStorage.getItem('NombreUsuario'),
                        ["PRODUCTO", "USUARIO", "ROL", "CANTIDAD VENDIDA", "TOTAL VENDIDO", "# DE TRANSACCIONES", "PRIMERA VENTA", "ÚLTIMA VENTA"], // columnas
                        reportesList.map((p) => [
                            p.Producto,
                            p.Usuario,
                            p.Rol,
                            p.TotalCantidadVendida,
                            p.TotalVendido,
                            p.NumeroTransacciones,
                            formatear(p.PrimeraVenta),
                            formatear(p.UltimaVenta)
                        ])
                        )
                    }
                    className="flex items-center gap-2 bg-red-800 text-white rounded-full px-4 py-2 font-semibold"
                    >
                    <FaFilePdf size={25} />
                </button>
                <button
                    onClick={() =>
                        exportTableExcel(
                        "REPORTE DE VENTAS", localStorage.getItem('NombreUsuario'),
                        ["PRODUCTO", "USUARIO", "ROL", "CANTIDAD VENDIDA", "TOTAL VENDIDO", "# DE TRANSACCIONES", "PRIMERA VENTA", "ÚLTIMA VENTA"], // columnas
                        reportesList.map((p) => [
                            p.Producto,
                            p.Usuario,
                            p.Rol,
                            p.TotalCantidadVendida,
                            p.TotalVendido,
                            p.NumeroTransacciones,
                            formatear(p.PrimeraVenta),
                            formatear(p.UltimaVenta)
                        ])
                        )
                    }
                    className="flex items-center gap-2 bg-green-800 text-white rounded-full px-4 py-2 font-semibold"
                    >
                    <FaFileExcel size={25} />
                </button>
            </div>

            {/* Tabla con scroll */}
            {cuatro && (
            <>
            <div className="flex items-center gap-2 mt-5"> {/* FILTROS */}
                <div>
                    <label className="block uppercase text-sm mb-1">Fecha Inicio:</label>
                    <input
                        type="date"
                        value={formData2.fecha1}
                        onChange={(e) => setFormData2({ ...formData2, fecha1: e.target.value })}
                        className="w-full bg-white border-2 border-[#4a5565] text-black rounded-2xl px-3 py-2"
                        />
                </div>
                
                <div>
                    <label className="block uppercase text-sm mb-1">Fecha Final:</label>
                    <input
                        type="date"
                        value={formData2.fecha2}
                        onChange={(e) => setFormData2({ ...formData2, fecha2: e.target.value })}
                        className="w-full bg-white border-2 border-[#4a5565] text-black rounded-2xl px-3 py-2"
                    />
                </div>
            </div>
            
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-3 text-center font-medium">PRODUCTO</th>
                            <th className="p-3 text-center font-medium">ID USUARIO</th>
                            <th className="p-3 text-center font-medium">ID ROL</th>
                            <th className="p-3 text-center font-medium">CANTIDAD</th>
                            <th className="p-3 text-center font-medium">PRECIO UNITARIO</th>
                            <th className="p-3 text-center font-medium">TOTAL</th>
                            <th className="p-3 text-center font-medium">FECHA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportesComprasList.map((p, i) => {
                            return (
                                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 text-center">{p.Producto}</td>
                                <td className="p-3 text-center">{p.idUsuario}</td>
                                <td className="p-3 text-center">{p.idRol}</td>
                                <td className="p-3 text-center">{p.Cantidad}</td>
                                <td className="p-3 text-center">Q{p.PrecioUnitario}</td>
                                <td className="p-3 text-center">Q{p.Total}</td>
                                <td className="p-3 text-center">{formatear(p.FechaCompra)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {reportesComprasList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay compras registradas
                    </p>
                )}
            </div>
            </>)}

            <div className="flex items-center gap-2 mt-10">
                <button
                    onClick={() => cambiarCinco()}
                    className="flex items-center gap-2 bg-gray-600 text-white rounded-full px-4 py-2 font-semibold"
                >
                    REPORTE DE INGRESOS <FaCaretDown />
                </button>
                <button
                    onClick={() =>
                        exportTablePDF(
                        "REPORTE DE INGRESOS",
                        localStorage.getItem("NombreUsuario"),
                        modo === "MES"
                            ? ["AÑO", "MES", "INGRESO TOTAL"]
                            : ["AÑO", "INGRESO TOTAL"],
                        modo === "MES"
                            ? data.map((d) => [d.Año, d.Mes, d.IngresoTotal])
                            : data.map((d) => [d.Año, d.IngresoTotal])
                        )
                    }
                    className="flex items-center gap-2 bg-red-800 text-white rounded-full px-4 py-2 font-semibold"
                    >
                    <FaFilePdf size={25} />
                </button>
                <button
                    onClick={() =>
                        exportTableExcel(
                        "REPORTE DE INGRESOS",
                        localStorage.getItem("NombreUsuario"),
                        modo === "MES"
                            ? ["AÑO", "MES", "INGRESO TOTAL"]
                            : ["AÑO", "INGRESO TOTAL"],
                        modo === "MES"
                            ? data.map((d) => [d.Año, d.Mes, d.IngresoTotal])
                            : data.map((d) => [d.Año, d.IngresoTotal])
                        )
                    }
                    className="flex items-center gap-2 bg-green-800 text-white rounded-full px-4 py-2 font-semibold"
                    >
                    <FaFileExcel size={25} />
                </button>
            </div>

            {/* Tabla con scroll */}
            {cinco && (
            <>
            <div className="flex items-center gap-2 mt-5"> {/* FILTROS */}
                <div>
                            <select
          value={modo}
          onChange={(e) => setModo(e.target.value)}
          className="border p-2 rounded-xl"
        >
          <option value="MES">Por Mes</option>
          <option value="AÑO">Por Año</option>
        </select>

        <input
          type="number"
          placeholder="Año"
          value={año}
          onChange={(e) => setAño(e.target.value)}
          className="border p-2 rounded-xl w-24"
        />

        {modo === "MES" && (
          <input
            type="number"
            placeholder="Mes"
            min="1"
            max="12"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="border p-2 rounded-xl w-20"
          />
        )}
                </div>
            </div>
            
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-3 text-center font-medium">AÑO</th>
                            {modo === "MES" && <th className="p-3 text-center font-medium">MES</th>}
                            <th className="p-3 text-center font-medium">INGRESO TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d, i) => {
                            return (
                                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 text-center">{d.Año}</td>
                                {modo === "MES" && <td className="p-3 text-center">{d.Mes}</td>}
                                <td className="p-3 text-center">Q{d.IngresoTotal}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {data.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay compras registradas
                    </p>
                )}
            </div>
            </>)}

        </div>
    );
}

export default Inicio;
