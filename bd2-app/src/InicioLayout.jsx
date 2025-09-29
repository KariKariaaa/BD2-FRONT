import Menu from './Menu';
import { Outlet } from "react-router-dom";

export default function Inicio() {
  return (
    <div className="flex h-screen">
      <Menu />
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        <Outlet />
      </div>
    </div>
  );
}