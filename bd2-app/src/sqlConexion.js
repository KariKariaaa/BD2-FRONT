// sqlConexion.js

export async function login(usuario, pass, captcha) {
  try {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Usuario: usuario,
        Contraseña: pass,
        Captcha: captcha
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en login:", err);
    return { success: false, error: "Error en cliente" };
  }
}

export async function comprarProducto(idProducto, stock, idUsuario, idRol, nuevoPrecio) {
  try {
    const response = await fetch("http://localhost:4000/comprarProducto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idProducto: idProducto,
        stock: stock,
        idUsuario: idUsuario,
        idRol: idRol,
        nuevoPrecio: nuevoPrecio
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en descontarExistencias:", err);
    return { success: false, error: "Error en cliente descontarExistencias" };
  }
}

export async function reporteInventario(fecha1, fecha2, idUsuario, idCategoria) {
  try {
    const response = await fetch("http://localhost:4000/reporteInventario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha1: fecha1,
        fecha2: fecha2,
        idUsuario: idUsuario,
        idCategoria: idCategoria
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en vender:", err);
    return { success: false, error: "Error en cliente vender" };
  }
}

export async function reporteIngresos(modo, año, mes) {
  try {
    const response = await fetch("http://localhost:4000/reporteIngresos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ modo, año, mes }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en reporteIngresos:", err);
    return { success: false, error: "Error en cliente reporteIngresos" };
  }
}


export async function reporteCompras(fecha1, fecha2) {
  try {
    const response = await fetch("http://localhost:4000/reporteCompras", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha1: fecha1,
        fecha2: fecha2
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en vender:", err);
    return { success: false, error: "Error en cliente vender" };
  }
}

export async function vender(idProducto, stock, idUsuario, idRol) {
  try {
    const response = await fetch("http://localhost:4000/vender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idProducto: idProducto,
        stock: stock,
        idUsuario: idUsuario,
        idRol: idRol
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en vender:", err);
    return { success: false, error: "Error en cliente vender" };
  }
}

export async function agregarExistencias(idProducto, stock) {
  try {
    const response = await fetch("http://localhost:4000/agregarExistencias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idProducto: idProducto,
        stock: stock
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en agregarExistencias:", err);
    return { success: false, error: "Error en cliente agregarExistencias" };
  }
}

export async function descontarExistencias(idProducto, stock) {
  try {
    const response = await fetch("http://localhost:4000/descontarExistencias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idProducto: idProducto,
        stock: stock
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en descontarExistencias:", err);
    return { success: false, error: "Error en cliente descontarExistencias" };
  }
}

export async function asociarProductoconCategoria(sku, categoria) {
  try {
    const response = await fetch("http://localhost:4000/asociarProductoconCategoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sku: sku,
        categoria: categoria
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en asociarProductoconCategoria:", err);
    return { success: false, error: "Error en cliente asociarProductoconCategoria" };
  }
}

export async function desasociarProductoconCategoria(sku, categoria) {
  try {
    const response = await fetch("http://localhost:4000/desasociarProductoconCategoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sku: sku,
        categoria: categoria
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en desasociarProductoconCategoria:", err);
    return { success: false, error: "Error en cliente desasociarProductoconCategoria" };
  }
}

export async function actualizarCategoria(categoria) {
  try {
    const response = await fetch("http://localhost:4000/actualizarCategoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en actualizarCategoria:", err);
    return { success: false, error: "Error en cliente actualizarCategoria" };
  }
}

export async function obtenerCategoria(idCategoria) {
  try {
    const response = await fetch("http://localhost:4000/obtenerCategoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idCategoria }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en obtenerCategoria:", err);
    return { success: false, error: "Error en cliente obtenerCategoria" };
  }
}

export async function eliminarCategoria(categoria) {
  try {
    const response = await fetch("http://localhost:4000/eliminarCategoria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoria }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en eliminarCategoria:", err);
    return { success: false, error: "Error en cliente eliminarCategoria" };
  }
}

export async function eliminarProducto(producto) {
  try {
    const response = await fetch("http://localhost:4000/eliminarProducto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en eliminarCategoria:", err);
    return { success: false, error: "Error en cliente eliminarProducto" };
  }
}

export async function insertarCategoria(formData) {
  try {
    const response = await fetch("http://localhost:4000/insertarCategoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en insertarCategoria:", err);
    return { success: false, error: "Error en cliente insertarCategoria" };
  }
}

export async function productosmasvendidos() {
  try {
    const response = await fetch("http://localhost:4000/productosmasvendidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en ventas:", err);
    return { success: false, error: "Error en cliente ventas" };
  }
}

export async function reporteinventarioactual() {
  try {
    const response = await fetch("http://localhost:4000/reporteinventarioactual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en ventas:", err);
    return { success: false, error: "Error en cliente ventas" };
  }
}

export async function ventas() {
  try {
    const response = await fetch("http://localhost:4000/ventas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en ventas:", err);
    return { success: false, error: "Error en cliente ventas" };
  }
}

export async function categorias() {
  try {
    const response = await fetch("http://localhost:4000/categorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en categorias:", err);
    return { success: false, error: "Error en cliente categorias" };
  }
}

export async function actualizarProducto(producto) {
  try {
    const response = await fetch("http://localhost:4000/actualizarProducto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en actualizarProducto:", err);
    return { success: false, error: "Error en cliente actualizarProducto" };
  }
}

export async function insertarProducto(formData) {
  try {
    const response = await fetch("http://localhost:4000/insertarProducto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en insertarProducto:", err);
    return { success: false, error: "Error en cliente insertarProducto" };
  }
}


export async function obtenerProducto(idProducto) {
  try {
    const response = await fetch("http://localhost:4000/obtenerProducto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idProducto }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en obtenerCategoria:", err);
    return { success: false, error: "Error en cliente obtenerProducto" };
  }
}

export async function obtenerCategoriasProducto(SKU) {
  try {
    const response = await fetch("http://localhost:4000/obtenerCategoriasProducto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ SKU }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en obtenerCategoria:", err);
    return { success: false, error: "Error en cliente obtenerCategoriasProducto" };
  }
}

export async function productos() {
  try {
    const response = await fetch("http://localhost:4000/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en categorias:", err);
    return { success: false, error: "Error en cliente productos" };
  }
}

export async function insertarEntradaSalida(usuario, tipoOperacion) {
  try {
    const response = await fetch("http://localhost:4000/insertarEntradaSalida", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Usuario: usuario,
        TipoOperacion: tipoOperacion
      }),
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en insertarEntradaSalida:", err);
    return { success: false, error: "Error en cliente insertarEntradaSalida" };
  }
}

export async function roles() {
  try {
    const response = await fetch("http://localhost:4000/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en roles:", err);
    return { success: false, error: "Error en cliente roles" };
  }
}

export async function ultimoIngresoUsuario() {
  try {
    const response = await fetch("http://localhost:4000/ultimoIngresoUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en roles:", err);
    return { success: false, error: "Error en cliente ultimoIngresoUsuario" };
  }
}

export async function promedioTiempoUso() {
  try {
    const response = await fetch("http://localhost:4000/promedioTiempoUso", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en roles:", err);
    return { success: false, error: "Error en cliente promedioTiempoUso" };
  }
}

export async function bitacoraEstudiantes() {
  try {
    const response = await fetch("http://localhost:4000/bitacoraEstudiantes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en roles:", err);
    return { success: false, error: "Error en cliente bitacoraEstudiantes" };
  }
}

export async function bitacoraUsuarios() {
  try {
    const response = await fetch("http://localhost:4000/bitacoraUsuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en roles:", err);
    return { success: false, error: "Error en cliente bitacoraUsuarios" };
  }
}

export async function bitacoraContra() {
  try {
    const response = await fetch("http://localhost:4000/bitacoraContra", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en roles:", err);
    return { success: false, error: "Error en cliente bitacoraContra" };
  }
}


export async function accesos(filtros) {
  try {
    const response = await fetch("http://localhost:4000/bitacoraAccesos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filtros), // 👈 aquí mandas el formData
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en bitacoraAccesos:", err);
    return { success: false, error: "Error en cliente bitacoraAccesos" };
  }
}

export async function usuarios() {
  try {
    const response = await fetch("http://localhost:4000/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en usuarios:", err);
    return { success: false, error: "Error en cliente usuarios" };
  }
}

export async function insertarUsuario(formData) {
  try {
    const response = await fetch("http://localhost:4000/insertarUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en insertarUsuario:", err);
    return { success: false, error: "Error en cliente insertarUsuario" };
  }
}

export async function actualizarContraseña(forms) {
  try {
    const response = await fetch("http://localhost:4000/actualizarContra", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(forms),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en actualizarContraseña:", err);
    return { success: false, error: "Error en cliente actualizarContraseña" };
  }
}

export async function solicitarRecuperacion(correo) {
  console.log("SQLCONEXION.js" + correo)
  try {
    const response = await fetch("http://localhost:4000/solicitarRecuperacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo }),
    });

    return await response.json();
  } catch (err) {
    console.error("Error en solicitarRecuperacion:", err);
    return { success: false, message: "Error en cliente solicitarRecuperacion" };
  }
}


export async function estudiantes() {
  try {
    const response = await fetch("http://localhost:4000/estudiantes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en estudiantes:", err);
    return { success: false, error: "Error en cliente estudiantes" };
  }
}

export async function obtenerUsuario(idUsuario) {
  try {
    const response = await fetch("http://localhost:4000/obtenerUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idUsuario }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en obtenerUsuario:", err);
    return { success: false, error: "Error en cliente obtenerUsuario" };
  }
}

export async function actualizarUsuario(usuario) {
  try {
    const response = await fetch("http://localhost:4000/actualizarUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en actualizarUsuario:", err);
    return { success: false, error: "Error en cliente actualizarUsuario" };
  }
}

export async function eliminarUsuario(usuario) {
  try {
    const response = await fetch("http://localhost:4000/eliminarUsuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en eliminarUsuario:", err);
    return { success: false, error: "Error en cliente eliminarUsuario" };
  }
}

export async function eliminarEstudiante(idEstudiante) {
  try {
    const response = await fetch("http://localhost:4000/eliminarEstudiante", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idEstudiante }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en eliminarEstudiante:", err);
    return { success: false, error: "Error en cliente eliminarEstudiante" };
  }
}

export async function obtenerEstudiante(idEstudiante) {
  try {
    const response = await fetch("http://localhost:4000/obtenerEstudiante", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idEstudiante }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en obtenerEstudiante:", err);
    return { success: false, error: "Error en cliente obtenerEstudiante" };
  }
}

export async function insertarEstudiante(formData) {
  try {
    const response = await fetch("http://localhost:4000/insertarEstudiante", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en insertarEstudiante:", err);
    return { success: false, error: "Error en cliente insertarEstudiante" };
  }
}

export async function actualizarEstudiante(estudiante) {
  try {
    const response = await fetch("http://localhost:4000/actualizarEstudiante", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(estudiante),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en actualizarEstudiante:", err);
    return { success: false, error: "Error en cliente actualizarEstudiante" };
  }
}