import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function PromedioGrafico({ promedioList }) {
  // Transformamos los datos: convertimos "hh:mm:ss" a minutos totales para graficar
  const data = promedioList.map((p) => {
    return {
      Usuario: p.Producto,
      Tiempo: p.TotalComprado, // valor numérico
      TiempoTexto: p.TotalComprado + "U - Q"+p.MontoTotal, // para mostrar en el tooltip
    };
  });

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Usuario" />
          <YAxis label={{ value: "Cantidad", angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(value, name, props) =>
              [`${props.payload.TiempoTexto}`, "Promedio"]
            }
          />
          <Legend />
          <Bar dataKey="Tiempo" fill="#f68b26" name="Promedio (cantidad)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PromedioGrafico;
