import { useState } from "react";
import { login, insertarEntradaSalida } from "./sqlConexion";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
    const [usuario, setUsuario] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState(false);
    const [captchaValido, setCaptchaValido] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaValido) {
            setError("Debes validar el captcha");
            return;
        }

        const result = await login(usuario, pass, captchaValido);

        if (!result.success) {
            setError("Usuario o contraseña incorrectos");
        } else {
            localStorage.setItem("idUsuario", result.user.Id);
            localStorage.setItem("NombreUsuario", result.user.NombreUsuario);
            localStorage.setItem("Rol", result.user.Rol);

            registro(localStorage.getItem("NombreUsuario"), "Ingreso");
            navigate("/inicio/estudiantes");
        }
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Ingrese su usuario..."
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className="w-70 px-4 py-3 rounded-full bg-[#58585a] text-white placeholder-gray-200 focus:outline-none"
                />
                <input
                    type="password"
                    placeholder="Ingrese su contraseña..."
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="w-70 px-4 py-3 rounded-full bg-[#58585a] text-white placeholder-gray-200 focus:outline-none"
                />

                {/* Captcha */}
                <ReCAPTCHA
                    sitekey="6LcHQdcrAAAAAAikrWgU03CRzXhoqy7hgXvkN3Pg" // <-- reemplaza con tu clave pública de Google reCAPTCHA
                    onChange={(token) => setCaptchaValido(token)} // guarda el token, no solo true
                    onExpired={() => setCaptchaValido(false)}
                />

                <button
                    type="submit"
                    className="w-70 py-3 text-white bg-[#f68b26] font-medium rounded-full"
                >
                    Iniciar Sesión
                </button>
                {error && (
                    <span className="text-red-600 underline text-sm">{error}</span>
                )}
            </form>
        </div>
    );
}

export default Login;
