import { useState, useEffect } from 'react';
import { productos, insertarProducto, obtenerProducto, actualizarProducto, categorias, asociarProductoconCategoria, desasociarProductoconCategoria, obtenerCategoriasProducto } from "./sqlConexion";
import { useToast } from './assets/ToastProvider';
import Select from 'react-select';

export default function ModalFormulario({ visible, onClose, onGuardado }) {
  const { addToast } = useToast();
  const [error, setError] = useState("");
  
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [selectedCategorias, setSelectedCategorias] = useState([]); // nombres de categorías seleccionadas

  const [estadosList, setEstadosList] = useState([
      { value: "Disponible", label: "Disponible" },
      { value: "No Disponible", label: "No Disponible" }
    ]);
  

  const [formData, setFormData] = useState({
    sku: '',
    producto: '',
    stock: '',
    precio: '',
    precioVenta: '',
    descuento: '',
    estado: ''
  });

  const [productosList, setProductosList] = useState([]);

  const [categoriasList, setCategoriasList] = useState([]);

  const [errores, setErrores] = useState({
    general: '',
    correo: ''
  });

  // Cargar listas al inicio
  useEffect(() => {
    if(visible){
        setProductoSeleccionado('');
        setSelectedCategorias([]);

        setFormData({
            sku: '',
            producto: '',
            stock: '',
            precio: '',
            precioVenta: '',
            descuento: '',
            estado: ''
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

        const traerCategorias = async () => {
          const result = await categorias();
        
          if (!result.success) {
              setError(result.message || "Error desconocido");
          } else {
              setError("");
              setCategoriasList(result.data);
          }
        };

      cargarDatos();
      traerCategorias();
    }
  }, [visible]);

  // Cuando se selecciona un estudiante cargar sus datos
  useEffect(() => {
    const obtenerDatosProducto = async () => {
      if (!productoSeleccionado) {
        setFormData({ sku: '', producto: '', stock: '', precio: '', precioVenta: '', descuento: '', estado: ''});
        setSelectedCategorias([]); // limpiar selección
        return;
      }

      const result = await obtenerProducto(productoSeleccionado);
      if (!result.success) {
        setErrores({ general: result.message || "Error al cargar producto" });
        return;
      }

      setFormData({
        sku: result.data.SKU,
        producto: result.data.Producto,
        stock: result.data.Stock,
        precio: result.data.PrecioCosto,
        precioVenta: result.data.PrecioVenta,
        descuento: result.data.Descuento,
        estado: result.data.Estado
      });
      setErrores({ general: "" });

      // 🔹 Ahora traemos sus categorías
      const cats = await obtenerCategoriasProducto(result.data.SKU);
      if (cats.success && cats.data) {
        const lista = Array.isArray(cats.data)
          ? cats.data.map(c => c.Categoria)
          : [cats.data.Categoria];
        setSelectedCategorias(lista);
      } else {
        setSelectedCategorias([]);
      }
    };

    obtenerDatosProducto();
  }, [productoSeleccionado]);

  const handleGuardar = async (crear = true) => {
    if (crear) {
      const result = await insertarProducto(formData);

      if (!result.success) {
        setErrores({ general: result.message || "Error desconocido" });
        addToast(result.message || "Error al guardar", "error");
        return;
      }

      // 🔹 Asociar categorías seleccionadas
      for (const categoria of selectedCategorias) {
        await asociarProductoconCategoria(formData.sku, categoria);
      }

      addToast("Producto guardado con éxito", "success");
      onGuardado();
      onClose();
    } else {
      const result = await actualizarProducto({ idProducto: productoSeleccionado, ...formData });

      if (!result.success) {
        setErrores({ general: result.message || "Error desconocido" });
        addToast(result.message || "Error al editar", "error");
        return;
      }

      // 🔹 Traemos las categorías anteriores
      const prevCatsRes = await obtenerCategoriasProducto(formData.sku);
      const prevCats = (prevCatsRes.success && prevCatsRes.data)
        ? (Array.isArray(prevCatsRes.data)
          ? prevCatsRes.data.map(c => c.Categoria)
          : [prevCatsRes.data.Categoria])
        : [];

      // 🔹 Detectar diferencias
      const nuevas = selectedCategorias.filter(c => !prevCats.includes(c));
      const eliminadas = prevCats.filter(c => !selectedCategorias.includes(c));

      // 🔹 Asociar nuevas
      for (const cat of nuevas) {
        await asociarProductoconCategoria(formData.sku, cat);
      }

      // 🔹 Desasociar eliminadas
      for (const cat of eliminadas) {
        await desasociarProductoconCategoria(formData.sku, cat);
      }

      addToast("Producto editado con éxito", "success");
      onGuardado();
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#58585a] text-white rounded-2xl w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto p-8 scrollbar-thin">
        <h2 className="text-2xl text-center mb-6">CREAR / EDITAR PRODUCTO</h2>

        {/* Selección de Producto */}
        <div className="mb-4">
          <label className="block uppercase text-sm mb-1">Seleccione un producto existente (opcional):</label>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* Nombres */}
          <div>
            <label className="block uppercase text-sm mb-1">SKU:</label>
            <input
              type="text"
              maxLength={10}
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

        {/* Apellidos */}
          <div>
            <label className="block uppercase text-sm mb-1">Nombre del Producto:</label>
            <input
              type="text"
              maxLength={50}
              value={formData.producto}
              onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

        {/* precio */}
          <div>
            <label className="block uppercase text-sm mb-1">Stock:</label>
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

          {/* precio */}
          <div>
            <label className="block uppercase text-sm mb-1">Descuento:</label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.descuento}
              onChange={(e) => {
                let valor = e.target.value;

                // 🔹 Permitir solo números y un punto
                valor = valor.replace(/[^0-9.]/g, "");

                // 🔹 Evitar más de un punto decimal
                const partes = valor.split(".");
                if (partes.length > 2) valor = partes[0] + "." + partes[1];
                setFormData({ ...formData, descuento: valor });
              }}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

          {/* telefono */}
          <div>
            <label className="block uppercase text-sm mb-1">Precio Costo:</label>
            <input
              type="text"
              inputMode="decimal"
              value={formData.precio}
              onChange={(e) => {
                let valor = e.target.value;

                // 🔹 Permitir solo números y un punto
                valor = valor.replace(/[^0-9.]/g, "");

                // 🔹 Evitar más de un punto decimal
                const partes = valor.split(".");
                if (partes.length > 2) valor = partes[0] + "." + partes[1];

                setFormData({ ...formData, precio: valor });
              }}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

          {/* telefono */}
          <div>
            <label className="block uppercase text-sm mb-1">Precio Venta:</label>
            <input
              type="text"
              inputMode="decimal"
              value={formData.precioVenta}
              onChange={(e) => {
                let valor = e.target.value;

                // 🔹 Permitir solo números y un punto
                valor = valor.replace(/[^0-9.]/g, "");

                // 🔹 Evitar más de un punto decimal
                const partes = valor.split(".");
                if (partes.length > 2) valor = partes[0] + "." + partes[1];

                setFormData({ ...formData, precioVenta: valor });
              }}
              className="w-full bg-white text-black rounded-2xl px-3 py-2"
            />
          </div>

          {/* Estado */}
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
                    border: `2px solid ${state.isFocused ? '#ff9f47' : '#58585a'}`,
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#ff9f47'
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
                    backgroundColor: state.isFocused ? '#ff9f47' : '#fff',
                    color: '#000',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  })
                }}
              />
            </div>
        
        </div>

        {errores.general && (
          <span className="text-red-400 text-center uppercase text-sm">{errores.general}</span>
        )}

        {/* Categorías */}
        <div>
          <label className="block uppercase text-sm mb-1">
            Seleccione las Categorías a las que pertenece este Producto:
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {categoriasList.map((p, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cat-${i}`}
                  checked={selectedCategorias.includes(p.Categoria)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategorias([...selectedCategorias, p.Categoria]);
                    } else {
                      setSelectedCategorias(selectedCategorias.filter(c => c !== p.Categoria));
                    }
                  }}
                  className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300"
                />
                <label htmlFor={`cat-${i}`} className="ms-2 text-sm text-white">
                  {p.Categoria}
                </label>
              </div>
            ))}
          </div>
        </div>

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
