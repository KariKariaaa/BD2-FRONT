import { useState, useEffect } from "react";
import { accesos, ultimoIngresoUsuario, promedioTiempoUso, bitacoraEstudiantes, bitacoraUsuarios, bitacoraContra } from "./sqlConexion";
import { useNavigate } from 'react-router-dom';
import { FaFilePdf, FaCaretDown, FaFileExcel} from 'react-icons/fa';
import PromedioGrafico from './Grafico';
import { exportTablePDF } from './ExportPdf';
import { exportTableExcel } from './ExportExcel';
import { exportLog } from './ExportLog';
import Select from 'react-select';

function Inicio() {
    const navigate = useNavigate();
    const [accesosList, setAccesosList] = useState([]);
    const [accesosFallidosList, setAccesosFallidosList] = useState([]);
    const [operacionesUsuariosList, setOperacionesUsuariosList] = useState([]);
    const [operacionesContraseñasList, setOperacionesContraseñasList] = useState([]);
    const [operacionesEstudiantesList, setOperacionesEstudiantesList] = useState([]);
    const [operacionesInicioList, setOperacionesInicioList] = useState([]);
    const [promedioList, setPromedioList] = useState([]);
    const [error, setError] = useState("");

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

    const [estadosList, setEstadosList] = useState([
        { value: "Exito", label: "Exito" },
        { value: "Fallo", label: "Fallo" }
    ]);

    useEffect(() => {
        const idUsuario = localStorage.getItem("idUsuario");
        const nombreUsuario = localStorage.getItem("NombreUsuario");
        const rol = localStorage.getItem('Rol');

        // Si no está logueado → redirigir
        if (!idUsuario || !nombreUsuario || !rol) {
            navigate("/");
            return;
        } else {
            traerAccesos();
            traerAccesosFallidos();
            traerUltimosAccesos();
            traerPromedio();
            traerBitacoraEstudiantes();
            traerBitacoraUsuarios();
            traerBitacoraContra();
        }
    }, []);

    useEffect(() => {
            traerAccesos();
    }, [formData]);

    const traerAccesos = async () => {
        const result = await accesos(formData);

        if (!result.success) {
            setError(result.message || "Error desconocido");
            setAccesosList([]);
        } else {
            setError("");
            setAccesosList(result.data);
        }
    };

    const traerAccesosFallidos = async () => {
        const result = await accesos({...formData, estado: 'Fallo'});

        if (!result.success) {
            setError(result.message || "Error desconocido");
            setAccesosList([]);
        } else {
            setError("");
            setAccesosFallidosList(result.data);
        }
    }

    const traerUltimosAccesos = async () => {
        const result = await ultimoIngresoUsuario();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setOperacionesInicioList(result.data);
        }
    };

    const traerPromedio = async () => {
        const result = await promedioTiempoUso();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setPromedioList(result.data);
        }
    };

    const traerBitacoraEstudiantes = async () => {
        const result = await bitacoraEstudiantes();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setOperacionesEstudiantesList(result.data);
        }
    };

    const traerBitacoraUsuarios = async () => {
        const result = await bitacoraUsuarios();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setOperacionesUsuariosList(result.data);
        }
    };

    const traerBitacoraContra = async () => {
        const result = await bitacoraContra();

        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
            setOperacionesContraseñasList(result.data);
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

            <div className="flex items-center gap-2">
                <button
                    onClick={() => cambiarUno()}
                    className="flex items-center gap-2 bg-gray-600 text-white rounded-full px-4 py-2 font-semibold"
                >
                    ÚLTIMO INICIO DE SESIÓN <FaCaretDown />
                </button>
                <button
                    onClick={() =>
                        exportTablePDF(
                        "ÚLTIMO INICIO DE SESIÓN POR USUARIO", localStorage.getItem('NombreUsuario'),
                        ["ID", "NOMBRE DE USUARIO", "FECHA Y HORA"], // columnas
                        operacionesInicioList.map((p) => [
                            p.idUsuario,
                            p.Usuario,
                            formatear(p.UltimoRegistro)
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
                        "ÚLTIMO INICIO DE SESIÓN POR USUARIO", localStorage.getItem('NombreUsuario'),
                        ["ID", "NOMBRE DE USUARIO", "FECHA Y HORA"], // columnas
                        operacionesInicioList.map((p) => [
                            p.idUsuario,
                            p.Usuario,
                            formatear(p.UltimoRegistro)
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
                        <th className="p-3 text-center font-medium">ID</th>
                        <th className="p-3 text-center font-medium">NOMBRE DE USUARIO</th>
                        <th className="p-3 text-center font-medium">FECHA Y HORA</th>
                        </tr>
                    </thead>
                <tbody>
                    {operacionesInicioList.map((p, i) => {
                    return (
                        <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3 text-center">{p.idUsuario}</td>
                            <td className="p-3 text-center">{p.Usuario}</td>
                            <td className="p-3 text-center">{formatear(p.UltimoRegistro)}</td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>

                {operacionesInicioList.length === 0 && !error && (
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
                    TIEMPO PROMEDIO POR USUARIOS <FaCaretDown />
                </button>
                <button
                    onClick={() =>
                        exportTablePDF(
                        "TIEMPO PROMEDIO DE USO DEL SISTEMA", localStorage.getItem('NombreUsuario'),
                        ["ID", "NOMBRE DE USUARIO", "HORAS", "MINUTOS", "TIEMPO EXACTO"], // columnas
                        promedioList.map((p) => [
                            p.idUsuario,
                            p.Usuario,
                            p.PromedioHoras,
                            p.PromedioMinutos,
                            p.Promedio_hhmmss
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
                        "TIEMPO PROMEDIO DE USO DEL SISTEMA", localStorage.getItem('NombreUsuario'),
                        ["ID", "NOMBRE DE USUARIO", "HORAS", "MINUTOS", "TIEMPO EXACTO"], // columnas
                        promedioList.map((p) => [
                            p.idUsuario,
                            p.Usuario,
                            p.PromedioHoras,
                            p.PromedioMinutos,
                            p.Promedio_hhmmss
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
                            <th className="p-3 text-center font-medium">ID</th>
                            <th className="p-3 text-center font-medium">NOMBRE DE USUARIO</th>
                            <th className="p-3 text-center font-medium">HORAS</th>
                            <th className="p-3 text-center font-medium">MINUTOS</th>
                            <th className="p-3 text-center font-medium">TIEMPO EXACTO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promedioList.map((p, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 text-center">{p.idUsuario}</td>
                                <td className="p-3 text-center">{p.Usuario}</td>
                                <td className="p-3 text-center">{p.PromedioHoras}</td>
                                <td className="p-3 text-center">{p.PromedioMinutos}</td>
                                <td className="p-3 text-center">{p.Promedio_hhmmss}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {promedioList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay accesos registrados
                    </p>
                )}
            </div>

            <PromedioGrafico promedioList={promedioList} />
            </>)}

            <div className="flex items-center gap-2 mt-10">
                <button
                    onClick={() => cambiarTres()}
                    className="flex items-center gap-2 bg-gray-600 text-white rounded-full px-4 py-2 font-semibold"
                >
                    INTENTOS DE INICIOS DE SESIÓN <FaCaretDown />
                </button>
                <button
                    onClick={() =>
                        exportTablePDF(
                        "INTENTOS DE INICIOS DE SESIÓN", localStorage.getItem('NombreUsuario'),
                        ["NOMBRE DE USUARIO", "FECHA Y HORA", "ESTADO", "MOTIVO"], // columnas
                        accesosList.map((p) => [
                            p.Usuario,
                            formatear(p.FechaAcceso),
                            p.Estado,
                            p.Motivo
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
                        "INTENTOS DE INICIOS DE SESIÓN",
                        localStorage.getItem("NombreUsuario"),
                        ["NOMBRE DE USUARIO", "FECHA Y HORA", "ESTADO", "MOTIVO"], // columnas
                        accesosList.map((p) => [
                            p.Usuario,
                            formatear(p.FechaAcceso),
                            p.Estado,
                            p.Motivo,
                        ])
                        )
                    }
                    className="flex items-center gap-2 bg-green-800 text-white rounded-full px-4 py-2 font-semibold"
                    >
                    <FaFileExcel size={25} />
                </button>
                <button
                    onClick={() =>
                        exportLog(
                        "AccesosFallidos.log",
                        accesosFallidosList.map((p) => [
                            `[${formatear(p.FechaAcceso)}] Usuario: ${p.Usuario} | Estado: ${p.Estado} | Motivo: ${p.Motivo}`
                        ])
                        )
                    }
                    className="flex items-center gap-2 bg-gray-600 text-white rounded-full px-4 py-2 font-semibold"
                    >
                    LOGS FALLIDOS
                </button>
            </div>

            {/* Tabla con scroll */}
            {tres && (
            <>
            <div className="flex items-center gap-2 mt-5"> {/* FILTROS */}
                <div>
                    <label className="block uppercase text-sm mb-1">Usuario:</label>
                    <input
                        type="text"
                        maxLength={50}
                        value={formData.usuario}
                        onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                        className="w-full bg-white border-2 border-[#4a5565] text-black rounded-2xl px-3 py-2"
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
                    <label className="block uppercase text-sm mb-1">Estado:</label>
                    <Select
                        options={estadosList}
                        value={estadosList.find(op => op.value === formData.estado) || null}
                        onChange={(opcion) =>
                        setFormData({ ...formData, estado: opcion ? opcion.value : '' })
                        }
                        placeholder="Seleccione un Estado"
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
                            <th className="p-3 text-center font-medium">NOMBRE DE USUARIO</th>
                            <th className="p-3 text-center font-medium">FECHA Y HORA</th>
                            <th className="p-3 text-center font-medium">ESTADO</th>
                            <th className="p-3 text-center font-medium">MOTIVO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accesosList.map((p, i) => {
                            return (
                                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 text-center">{p.Usuario}</td>
                                <td className="p-3 text-center">{formatear(p.FechaAcceso)}</td>
                                <td
                                    className={`p-3 text-center ${
                                    p.Estado === "Exito" ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {p.Estado}
                                </td>
                                <td className="p-3 text-center">{p.Motivo}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {accesosList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay accesos registrados
                    </p>
                )}
            </div>
            </>)}

            <div className="flex items-center gap-2 mt-10">
                <button
                    onClick={() => cambiarCuatro()}
                    className="flex items-center gap-2 bg-gray-600 text-white rounded-full px-4 py-2 font-semibold"
                >
                    BITÁCORA DE USUARIOS <FaCaretDown />
                </button>
                <button
                    onClick={() =>
                        exportTablePDF(
                        "BITÁCORA DE USUARIOS", localStorage.getItem('NombreUsuario'),
                        ["ID", "NOMBRE DE USUARIO", "TIPO DE OPERACIÓN", "FECHA Y HORA"], // columnas
                        operacionesUsuariosList.map((p) => [
                            p.idUsuario,
                            p.Usuario,
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
                        "BITÁCORA DE USUARIOS", localStorage.getItem('NombreUsuario'),
                        ["ID", "NOMBRE DE USUARIO", "TIPO DE OPERACIÓN", "FECHA Y HORA"], // columnas
                        operacionesUsuariosList.map((p) => [
                            p.idUsuario,
                            p.Usuario,
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
            {cuatro && (
            <>
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-3 text-center font-medium">ID</th>
                            <th className="p-3 text-center font-medium">NOMBRE DE USUARIO</th>
                            <th className="p-3 text-center font-medium">TIPO DE OPERACIÓN</th>
                            <th className="p-3 text-center font-medium">FECHA Y HORA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operacionesUsuariosList.map((p, i) => {
                            return (
                                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-3 text-center">{p.idUsuario}</td>
                                    <td className="p-3 text-center">{p.Usuario}</td>
                                    <td className="p-3 text-center">{p.TipoOperacion}</td>
                                    <td className="p-3 text-center">{formatear(p.FechaOperacion)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {operacionesUsuariosList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay operaciones registradas
                    </p>
                )}
            </div>
            </>)}

            <div className="flex items-center gap-2 mt-10">
                <button
                    onClick={() => cambiarCinco()}
                    className="flex items-center gap-2 bg-gray-600 text-white rounded-full px-4 py-2 font-semibold"
                >
                    BITÁCORA DE CONTRASEÑAS <FaCaretDown />
                </button>
                <button
                    onClick={() =>
                        exportTablePDF(
                        "BITÁCORA DE CONTRASEÑAS", localStorage.getItem('NombreUsuario'),
                        ["ID", "NOMBRE DE USUARIO", "FECHA Y HORA"], // columnas
                        operacionesContraseñasList.map((p) => [
                            p.idUsuario,
                            p.Usuario,
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
                        "BITÁCORA DE CONTRASEÑAS", localStorage.getItem('NombreUsuario'),
                        ["ID", "NOMBRE DE USUARIO", "FECHA Y HORA"], // columnas
                        operacionesContraseñasList.map((p) => [
                            p.idUsuario,
                            p.Usuario,
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
            {cinco&& (
            <>
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-3 text-center font-medium">ID</th>
                            <th className="p-3 text-center font-medium">NOMBRE DE USUARIO</th>
                            <th className="p-3 text-center font-medium">FECHA Y HORA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operacionesContraseñasList.map((p, i) => {
                            return (
                                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-3 text-center">{p.idUsuario}</td>
                                    <td className="p-3 text-center">{p.Usuario}</td>
                                    <td className="p-3 text-center">{formatear(p.FechaOperacion)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {operacionesContraseñasList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay cambios de contraseñas registradas
                    </p>
                )}
            </div>
            </>)}

            <div className="flex items-center gap-2 mt-10">
                <button
                    onClick={() => cambiarSeis()}
                    className="flex items-center gap-2 bg-gray-600 text-white rounded-full px-4 py-2 font-semibold"
                >
                    BITÁCORA DE ESTUDIANTES <FaCaretDown />
                </button>
                <button
                    onClick={() =>
                        exportTablePDF(
                        "BITÁCORA DE ESTUDIANTES", localStorage.getItem('NombreUsuario'),
                        ["ID", "CARNET", "TIPO DE OPERACIÓN", "FECHA Y HORA"], // columnas
                        operacionesEstudiantesList.map((p) => [
                            p.idEstudiante,
                            p.Carnet,
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
                        "BITÁCORA DE ESTUDIANTES", localStorage.getItem('NombreUsuario'),
                        ["ID", "CARNET", "TIPO DE OPERACIÓN", "FECHA Y HORA"], // columnas
                        operacionesEstudiantesList.map((p) => [
                            p.idEstudiante,
                            p.Carnet,
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
            {seis && (
            <>
            <div className="overflow-auto max-h-[400px] border-gray-400 mb-10 mt-6">
                <table className="min-w-full text-left">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b-2 border-gray-300">
                            <th className="p-3 text-center font-medium">ID</th>
                            <th className="p-3 text-center font-medium">CARNET</th>
                            <th className="p-3 text-center font-medium">TIPO DE OPERACIÓN</th>
                            <th className="p-3 text-center font-medium">FECHA Y HORA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operacionesEstudiantesList.map((p, i) => {
                            return (
                                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-3 text-center">{p.idEstudiante}</td>
                                    <td className="p-3 text-center">{p.Carnet}</td>
                                    <td className="p-3 text-center">{p.TipoOperacion}</td>
                                    <td className="p-3 text-center">{formatear(p.FechaOperacion)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {operacionesEstudiantesList.length === 0 && !error && (
                    <p className="text-center text-gray-600 underline mt-5 text-sm">
                        No hay operaciones registradas
                    </p>
                )}
            </div>
            </>)}
        </div>
    );
}

export default Inicio;
