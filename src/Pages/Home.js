import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PostCard from "../Components/PostCard";
import CreatePostModal from "../Components/CreatePostModal";
import { Button, Pagination, Form, InputGroup } from "react-bootstrap";
import { ArrowLeft, ArrowRight, PlusLg, PinAngleFill, Search } from "react-bootstrap-icons";

// ⭐️ CONSTANTE: Cuántos posts mostrar por página en el frontend
const POSTS_PER_PAGE = 5;

export default function Home() {
    // ⭐️ 1. Estado para almacenar TODOS los posts cargados del backend
    const [allPosts, setAllPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    // ⭐️ 2. Función para cargar TODOS los posts (sin paginación en la URL)
    const loadAllPosts = async () => {
        try {
            // Nota: Aquí ASUMIMOS que el endpoint devuelve TODOS los posts
            // Si el backend SIEMPRE pagina, necesitas modificar el backend para que devuelva todos.
            // Para simplificar, asumimos que el endpoint base devuelve todo o una página muy grande.
            const res = await axios.get("http://localhost:8080/api/posts?size=1000"); // Pedimos una página muy grande
            setAllPosts(res.data.content);
            setPage(0); // Reiniciar la paginación al cargar nuevos datos
        } catch (error) {
            console.error("Error al cargar los posts:", error);
        }
    };

    useEffect(() => {
        loadAllPosts();
    }, []);

    // ⭐️ 3. Lógica de FILTRADO y PAGINACIÓN (usando useMemo para optimizar)
    const filteredAndPagedPosts = useMemo(() => {
        // --- Paso A: Filtrar ---
        let filtered = allPosts;
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();

        if (normalizedSearchTerm) {
            filtered = allPosts.filter(post =>
                // Filtra si el término está en el título O en el contenido (case-insensitive)
                post.title.toLowerCase().includes(normalizedSearchTerm) ||
                post.content.toLowerCase().includes(normalizedSearchTerm)
            );
        }

        // --- Paso B: Paginación ---
        const start = page * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE;

        return {
            posts: filtered.slice(start, end),
            totalPages: Math.ceil(filtered.length / POSTS_PER_PAGE),
            totalFilteredPosts: filtered.length
        };
    }, [allPosts, searchTerm, page]); // Dependencias: recalcular solo si estas cambian

    const { posts, totalPages, totalFilteredPosts } = filteredAndPagedPosts;

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    // Al buscar, simplemente reiniciamos la página a 0
    const handleSearch = () => {
        setPage(0);
    };


    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h2 className="fw-bolder text-primary">
                    <PinAngleFill className="me-2" />
                    Foro de Discusión General
                </h2>
                <Button variant="primary" onClick={() => setShowModal(true)} className="d-flex align-items-center">
                    <PlusLg className="me-2" /> Crear Post
                </Button>
            </div>

            {/* ⭐️ BARRA DE BÚSQUEDA (El botón ahora solo fuerza un recálculo) */}
            <InputGroup className="mb-4">
                <Form.Control
                    placeholder="Buscar por título o contenido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                />
                <Button variant="primary" onClick={handleSearch}>
                    <Search className="me-1" /> Buscar
                </Button>
                {/* Indicador de resultados */}
                {searchTerm && (
                    <InputGroup.Text className="text-muted">
                        Resultados: {totalFilteredPosts}
                    </InputGroup.Text>
                )}
            </InputGroup>

            {/* Mostrar los posts filtrados y paginados */}
            {posts.map((post) => (
                <PostCard key={post.id} post={post} onUpdate={loadAllPosts} />
            ))}

            {/* Componente de Paginación */}
            <div className="d-flex justify-content-center mt-4">
                <Pagination>
                    <Pagination.Prev
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                    >
                        <ArrowLeft /> Anterior
                    </Pagination.Prev>

                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index === page}
                            onClick={() => handlePageChange(index)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}

                    <Pagination.Next
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages - 1}
                    >
                        Siguiente <ArrowRight />
                    </Pagination.Next>
                </Pagination>
            </div>


            <CreatePostModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                onCreate={loadAllPosts} // Al crear, recargamos la lista completa
            />
        </div>
    );
}