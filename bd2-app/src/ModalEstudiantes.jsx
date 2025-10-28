import { useState, useEffect } from 'react';
import { estudiantes, insertarEstudiante, obtenerEstudiante, actualizarEstudiante } from "./sqlConexion";
import { useToast } from './assets/ToastProvider';
import Select from 'react-select';

export default function ModalFormulario({ visible, onClose, onGuardado }) {
  const { addToast } = useToast();
  const [error, setError] = useState("");
  
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');
  const [formData, setFormData] = useState({
    carnet: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: ''
  });

  const [estudiantesList, setEstudiantesList] = useState([]);

  const [errores, setErrores] = useState({
    general: '',
    correo: ''
  });

  // Cargar listas al inicio
  useEffect(() => {
    if(visible){
        setEstudianteSeleccionado('');

        setFormData({
            carnet: '',
            nombres: '',
            apellidos: '',
            correo: '',
            telefono: ''
        });

        setErrores({ ...errores, general: "", correo: ""});

        const cargarDatos = async () => {
            const result = await estudiantes();

            if (!result.success) {
                setError(result.message || "Error desconocido");
            } else {
                setError("");

                const estudent = (result.data || []).map((p) => ({
                    value: p.idEstudiante,
                    label: `${p.Carnet} - ${p.Nombres} ${p.Apellidos}`,
                }));
                setEstudiantesList(estudent);
            }
        };

      cargarDatos();
    }
  }, [visible]);

  // Cuando se selecciona un estudiante cargar sus datos
  useEffect(() => {
    const obtenerDatosEstudiante = async () => {
      if (!estudianteSeleccionado) {
        setFormData({
          carnet: '',
          nombres: '',
          apellidos: '',
          correo: '',
          telefono: ''
        });
        return;
      }

      console.log("Estudiante: " + estudianteSeleccionado);
      const result = await obtenerEstudiante(estudianteSeleccionado);

      if (!result.success) {
        setErrores({ general: result.message || "Error al cargar estudiante" });
      } else {
        setFormData({
          carnet: result.data.Carnet,
          nombres: result.data.Nombres,
          apellidos: result.data.Apellidos,
          correo: result.data.Correo,
          telefono: result.data.Telefono
        });
        setErrores({ general: "" , correo: ""});
      }
    };

    obtenerDatosEstudiante();
  }, [estudianteSeleccionado]);

  const handleGuardar = async (crear = true) => {
    if(crear){
      const result = await insertarEstudiante(formData);

        if (!result.success) {
            setErrores({ general: result.message || "Error desconocido" });
            addToast(result.message || "Error al guardar", "error");
        } else {
            setErrores({ general: "" , correo: ""});
            addToast("Estudiante guardado con éxito", "success");
            onGuardado(); // refresca la lista en el padre
            onClose();    // cierra el modal
        }
    }else{
      const result = await actualizarEstudiante({ idEstudiante: estudianteSeleccionado, ...formData });

        if (!result.success) {
            setErrores({ general: result.message || "Error desconocido" });
            addToast(result.message || "Error al guardar", "error");
        } else {
            setErrores({ general: "" , correo: ""});
            addToast("Estudiante editado con éxito", "success");
            onGuardado(); // refresca la lista en el padre
            onClose();    // cierra el modal
        }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#58585a] text-white rounded-2xl w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto p-8 scrollbar-thin">
        <h2 className="text-2xl text-center mb-6">CREAR / EDITAR ESTUDIANTE</h2>

        {/* Selección de Estudiante */}
        <div className="mb-4">
          <label className="block uppercase text-sm mb-1">Seleccione un estudiante existente (opcional):</label>
          <Select
            options={estudiantesList}
            value={estudiantesList.find(op => op.value === estudianteSeleccionado) || null}
            onChange={(opcion) => setEstudianteSeleccionado(opcion ? opcion.value : '')}
            placeholder="--- Nuevo Estudiante ---"
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
                border: `2px solid ${state.isFocused ? '#ff9f47' : '#58585a'}`, // 🟠 Cambia color cuando está enfocado
                boxShadow: 'none', // elimina glow azul
                '&:hover': {
                  borderColor: '#ff9f47' // 🟡 color al pasar el mouse
                }
              }),
              singleValue: (provided) => ({
                ...provided,
                color: '#000' // texto negro
              }),
              placeholder: (provided) => ({
                ...provided,
                color: '#444' // color placeholder
              }),
              menu: (provided) => ({
                ...provided,
                borderRadius: '1rem'
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused ? '#ff9f47' : '#fff',
                color: state.isFocused ? '#000' : '#000',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              })
            }}
          />
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* Carnet */}
          <div>
            <label className="block uppercase text-sm mb-1">Carnet del estudiante:</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={9}
              value={formData.carnet}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/\D/g, ""); // elimina todo lo que no sea dígito
                setFormData({ ...formData, carnet: soloNumeros });
              }}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

        {/* Nombres */}
          <div>
            <label className="block uppercase text-sm mb-1">Nombre del estudiante:</label>
            <input
              type="text"
              maxLength={50}
              value={formData.nombres}
              onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

        {/* Apellidos */}
          <div>
            <label className="block uppercase text-sm mb-1">Apellido del estudiante:</label>
            <input
              type="text"
              maxLength={50}
              value={formData.apellidos}
              onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

        {/* telefono */}
          <div>
            <label className="block uppercase text-sm mb-1">Teléfono del estudiante:</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={formData.telefono}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/\D/g, ""); // elimina todo lo que no sea dígito
                setFormData({ ...formData, telefono: soloNumeros });
              }}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>
        
        </div>
        
        {/* correo */}
          <div>
            <label className="block uppercase text-sm mb-1">Correo del estudiante:</label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => {
                const correo = e.target.value;
                setFormData({ ...formData, correo });
                const esValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
                setErrores({ ...errores, correo: esValido || correo === '' ? '' : 'Correo no válido' });
              }}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

        {errores.general && (
          <span className="text-red-400 text-center uppercase text-sm">{errores.general}</span>
        )}

        {/* Botones */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="bg-[#f68b26] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
            onClick={() => handleGuardar(true)}
          >
            GUARDAR
          </button>
          <button className="bg-[#f68b26] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
            onClick={() => handleGuardar(false)}
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
