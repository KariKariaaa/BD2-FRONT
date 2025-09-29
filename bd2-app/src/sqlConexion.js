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
        Captcha: captcha // 👈 añadimos el captcha token
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en login:", err);
    return { success: false, error: "Error en cliente" };
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