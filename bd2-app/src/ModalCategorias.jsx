import { useState, useEffect } from 'react';
import { categorias, insertarCategoria, obtenerCategoria, actualizarCategoria } from "./sqlConexion";
import { useToast } from './assets/ToastProvider';
import Select from 'react-select';

export default function ModalFormulario({ visible, onClose, onGuardado }) {
  const { addToast } = useToast();
  const [error, setError] = useState("");
  
  const [categoriaSeleccionado, setCategoriaSeleccionado] = useState('');
  const [formData, setFormData] = useState({
    categoria: ''
  });

  const [categoriasList, setCategoriasList] = useState([]);

  const [errores, setErrores] = useState({
    general: ''
  });

  // Cargar listas al inicio
  useEffect(() => {
    if(visible){
        setCategoriaSeleccionado('');

        setFormData({
            categoria: ''
        });

        setErrores({ ...errores, general: ""});

        const cargarDatos = async () => {
            const result = await categorias();

            if (!result.success) {
                setError(result.message || "Error desconocido");
            } else {
                setError("");

                const category = (result.data || []).map((p) => ({
                    value: p.IdCategoria,
                    label: `${p.Categoria} `,
                }));
                setCategoriasList(category);
            }
        };

      cargarDatos();
    }
  }, [visible]);

  // Cuando se selecciona un estudiante cargar sus datos
  useEffect(() => {
    const obtenerDatosCategoria = async () => {
      if (!categoriaSeleccionado) {
        setFormData({
          categoria: ''
        });
        return;
      }

      const result = await obtenerCategoria(categoriaSeleccionado);

      if (!result.success) {
        setErrores({ general: result.message || "Error al cargar categoria" });
      } else {
        setFormData({
          categoria: result.data.Categoria
        });
        setErrores({ general: ""});
      }
    };

    obtenerDatosCategoria();
  }, [categoriaSeleccionado]);

  const handleGuardar = async (crear = true) => {
    if(crear){
      const result = await insertarCategoria(formData);

        if (!result.success) {
            setErrores({ general: result.message || "Error desconocido" });
            addToast(result.message || "Error al guardar", "error");
        } else {
            setErrores({ general: ""});
            addToast("Categoría guardada con éxito", "success");
            onGuardado(); // refresca la lista en el padre
            onClose();    // cierra el modal
        }
    }else{
      const result = await actualizarCategoria({ idCategoria: categoriaSeleccionado, ...formData });

        if (!result.success) {
            setErrores({ general: result.message || "Error desconocido" });
            addToast(result.message || "Error al guardar", "error");
        } else {
            setErrores({ general: ""});
            addToast("Categoría editada con éxito", "success");
            onGuardado(); // refresca la lista en el padre
            onClose();    // cierra el modal
        }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#58585a] text-white rounded-2xl w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto p-8 scrollbar-thin">
        <h2 className="text-2xl text-center mb-6">CREAR / EDITAR CATEGORÍA</h2>

        {/* Selección de CATEGORÍA */}
        <div className="mb-4">
          <label className="block uppercase text-sm mb-1">Seleccione una categoría existente (opcional):</label>
          <Select
            options={categoriasList}
            value={categoriasList.find(op => op.value === categoriaSeleccionado) || null}
            onChange={(opcion) => setCategoriaSeleccionado(opcion ? opcion.value : '')}
            placeholder="--- Nueva Categoría ---"
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

        {/* Nombres */}
          <div>
            <label className="block uppercase text-sm mb-1">Nombre de la categoría:</label>
            <input
              type="text"
              maxLength={50}
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
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
