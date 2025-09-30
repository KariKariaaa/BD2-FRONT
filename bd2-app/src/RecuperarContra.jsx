import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function RecuperarContra() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [pass, setPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:4000/recuperarContra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, pass, passconfirm: passConfirm }),
    });

    const data = await response.json();
    if (!data.success) {
      setError(data.message);
    } else {
      setOk("Contraseña cambiada con éxito");
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-xl font-bold mb-4">Recuperar Contraseña</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={passConfirm}
          onChange={(e) => setPassConfirm(e.target.value)}
          className="border p-2 rounded"
        />
        <button className="bg-orange-500 text-white py-2 rounded">
          Cambiar Contraseña
        </button>
        {error && <p className="text-red-600">{error}</p>}
        {ok && <p className="text-green-600">{ok}</p>}
      </form>
    </div>
  );
}
