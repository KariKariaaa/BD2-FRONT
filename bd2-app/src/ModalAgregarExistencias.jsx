import { useState, useEffect } from 'react';
import { productos, obtenerProducto, agregarExistencias } from "./sqlConexion";
import { useToast } from './assets/ToastProvider';
import Select from 'react-select';

export default function ModalFormulario({ visible, onClose, onGuardado }) {
  const { addToast } = useToast();
  const [error, setError] = useState("");
  
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  
  const [formData, setFormData] = useState({
    stock: ''
  });

  const [productosList, setProductosList] = useState([]);

  const [errores, setErrores] = useState({
    general: '',
    correo: ''
  });

  // Cargar listas al inicio
  useEffect(() => {
    if(visible){
        setProductoSeleccionado('');

        setFormData({
            stock: ''
        });

        setErrores({ ...errores, general: "", correo: ""});

        const cargarDatos = async () => {
            const result = await productos();

            if (!result.success) {
                setError(result.message || "Error desconocido");
            } else {
                setError("");

                const product = (result.data || []).map((p) => ({
                    value: p.IdProducto,
                    label: `${p.SKU} - ${p.Producto}`,
                }));
                setProductosList(product);
            }
        };

      cargarDatos();
    }
  }, [visible]);

  // Cuando se selecciona un estudiante cargar sus datos
  useEffect(() => {
    const obtenerDatosProducto = async () => {
      if (!productoSeleccionado) {
        setFormData({ stock: ''});
        return;
      }

      const result = await obtenerProducto(productoSeleccionado);
      if (!result.success) {
        setErrores({ general: result.message || "Error al cargar producto" });
        return;
      }

      setFormData({
        stock: result.data.Stock
      });
      setErrores({ general: "" });
    };

    obtenerDatosProducto();
  }, [productoSeleccionado]);

  const handleGuardar = async () => {
    if (productoSeleccionado) {
      const result = await agregarExistencias(productoSeleccionado, formData.stock);

      if (!result.success) {
        setErrores({ general: result.message || "Error desconocido" });
        addToast(result.message || "Error al guardar", "error");
        return;
      }

      addToast("Stock actualizado con éxito", "success");
      onGuardado();
      onClose();
    } else {
      setErrores({ general: "Seleccione un producto" });
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#58585a] text-white rounded-2xl w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto p-8 scrollbar-thin">
        <h2 className="text-2xl text-center mb-6">AGREGAR EXISTENCIAS</h2>

        {/* Selección de Producto */}
        <div className="mb-4">
          <label className="block uppercase text-sm mb-1">Seleccione un producto existente:</label>
          <Select
            options={productosList}
            value={productosList.find(op => op.value === productoSeleccionado) || null}
            onChange={(opcion) => setProductoSeleccionado(opcion ? opcion.value : '')}
            placeholder="--- Nuevo Producto ---"
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
        {/* precio */}
          <div>
            <label className="block uppercase text-sm mb-1">Indique la cantidad que desea agregar:</label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.stock}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/\D/g, ""); // elimina todo lo que no sea dígito
                setFormData({ ...formData, stock: soloNumeros });
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
            onClick={() => handleGuardar()}
          >
            GUARDAR
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
