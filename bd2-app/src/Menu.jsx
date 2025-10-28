import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaUserCircle, FaArrowCircleRight, FaCog, FaLock, FaEnvelope} from 'react-icons/fa';
import { insertarEntradaSalida } from "./sqlConexion";
import ModalFormulario from './ModalPass';

function Sidebar() {
  const navigate = useNavigate();
  const [idRol, setIdRol] = useState(null);
  const [nombre, setNombre] = useState('Usuario');

  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const rol = localStorage.getItem('Rol');
    const nombre = localStorage.getItem('NombreUsuario');
    setIdRol(parseInt(rol)); // Asegura que sea número
    setNombre(nombre);
  }, []);

  const handleLogout = async () => {
    registro(nombre, 'Salida');
    localStorage.clear();
    navigate('/');
  };

  const registro = async (usuario, tipoOperacion) => {
        const result = await insertarEntradaSalida(usuario, tipoOperacion);
    
        if (!result.success) {
            setError(result.message || "Error desconocido");
        } else {
            setError("");
        }
    };

  return (
    <aside className="w-50 bg-[#f68b26] text-white flex flex-col justify-between p-4">
      <div>
        <nav className="flex flex-col items-center mt-10 space-y-8">
          {/* Solo mostrar si idRol es 2 */}
          { idRol === 2 && (
            <>
              <Link to="/inicio/estudiantes" className="block hover:font-bold">INICIO</Link>
            </>
          )}

          {/* Solo mostrar si idRol es 1*/}
          { idRol === 1  && (
            <>
              <Link to="/inicio/estudiantes" className="block hover:font-bold">INICIO</Link>
              <Link to="/inicio/usuarios" className="block hover:font-bold">USUARIOS</Link>
              <Link to="/inicio/reportes" className="block hover:font-bold">REPORTES</Link>
              <Link to="/inicio/productosCategorias" className="block hover:font-bold">PRODUCTOS/CATEGORÍAS</Link>
              <Link to="/inicio/inventario" className="block hover:font-bold">INVENTARIO</Link>
              <Link to="/inicio/ventas" className="block hover:font-bold">VENTAS</Link>
              <Link to="/inicio/reporteventas" className="block hover:font-bold">REPORTES</Link>
            </>
          )}

        </nav>
      </div>

      <div className="flex flex-col items-center mt-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-[#58585a]">
          <FaUserCircle size={90} />
        </div>
        <p className="text-sm text-center mt-2 uppercase">{nombre}</p>
        {idRol == 1 && (
          <p className="text-sm text-center mt-2 uppercase">Administrador</p>
        )}
        {idRol == 2 && (
          <p className="text-sm text-center mt-2 uppercase">Secretaria</p>
        )}
        <div className="flex mt-4 gap-4 text-2xl">
          <button onClick={() => setMostrarModal(true)} className="text-[#58585a] hover:text-[white] w-7">
            <FaCog size={30} />
          </button> 
          <button onClick={handleLogout} className="text-[#58585a] hover:text-[white] w-7">
            <FaArrowCircleRight size={30} />
          </button> 
        </div>
      </div>

      {/* Modal */}
      <ModalFormulario 
        visible={mostrarModal} 
        onClose={() => setMostrarModal(false)} 
        onGuardado={async () => {
          setMostrarModal(false);
        }}
      />

    </aside>
  );
}

export default Sidebar;