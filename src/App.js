import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Página principal (lista de posts) */}
                <Route path="/" element={<Home />} />

                {/* Ruta genérica por si en futuro hay 404 */}
                <Route path="*" element={<h2 className="text-center mt-5">404 — Página no encontrada</h2>} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
