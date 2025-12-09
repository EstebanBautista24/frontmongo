import axios from "axios";
import { useState } from "react";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { Card, Button, Badge } from "react-bootstrap";
import { HandThumbsUpFill, HandThumbsDownFill, ChatLeftTextFill, CalendarFill } from "react-bootstrap-icons";

export default function PostCard({ post, onUpdate }) {
    const [showComments, setShowComments] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);

    const formattedDate = new Date(post.createdAt || Date.now()).toLocaleDateString("es-ES", {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // --- FUNCIONES DE VOTACIÓN ---
    const handleVote = async (type) => {
        try {
            // El endpoint PUT espera un path variable /api/posts/{id}/like o /dislike
            await axios.put(`http://localhost:8080/api/posts/${post.id}/${type}`);

            // ⭐️ Importante: Llama a onUpdate para recargar la lista y actualizar contadores
            onUpdate();
        } catch (error) {
            console.error(`Error al votar (${type}):`, error);
        }
    };

    const handleLike = () => handleVote('like');
    const handleDislike = () => handleVote('dislike');
    // ----------------------------

    // ⭐️ Cálculo del conteo de comentarios (Mejora #2)
    const commentCount = post.commentIds ? post.commentIds.length : 0;


    return (
        <Card className="mb-4 shadow-lg border-0">
            {/* ⭐️ CONDICIÓN DE IMAGEN: Solo si existe la URL y no ha fallado la carga */}
            {post.imageUrl && !imageLoadError && (
                <div
                    className="p-3 bg-white"
                    style={{ borderTopLeftRadius: '0.25rem', borderTopRightRadius: '0.25rem' }}
                >
                    <Card.Img
                        variant="top"
                        src={post.imageUrl}
                        alt={post.title}
                        style={{
                            width: '100%',
                            maxHeight: '350px',
                            objectFit: 'contain',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '5px'
                        }}
                        onError={() => setImageLoadError(true)}
                    />
                </div>
            )}

            {/* Mensaje de error de carga opcional */}
            {post.imageUrl && imageLoadError && (
                <div className="alert alert-warning text-center m-3 p-2">
                    🖼️ No se pudo cargar la imagen. Revisa el enlace.
                </div>
            )}


            <Card.Body>
                {/* Metadatos (Fecha y Autor) */}
                <div className="d-flex justify-content-between align-items-center mb-3 text-muted border-bottom pb-2">
                    <small>
                        <CalendarFill className="me-1 text-info" />
                        Publicado el: **{formattedDate}**
                    </small>
                    <Badge bg="secondary">
                        Autor: **{post.author || "Anónimo"}**
                    </Badge>
                </div>

                {/* Título y Contenido */}
                <Card.Title className="fw-bolder text-dark mb-3">{post.title}</Card.Title>
                <Card.Text className="text-break">{post.content}</Card.Text>

                <hr />

                {/* ⭐️ SECCIÓN DE INTERACCIÓN (Botones de Voto y Comentarios) */}
                <div className="d-flex justify-content-start align-items-center gap-3">

                    {/* Botón de LIKE */}
                    <Button
                        variant="outline-success"
                        size="sm"
                        onClick={handleLike}
                        className="d-flex align-items-center"
                    >
                        <HandThumbsUpFill className="me-1" /> {post.likes}
                    </Button>

                    {/* Botón de DISLIKE */}
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleDislike}
                        className="d-flex align-items-center"
                    >
                        <HandThumbsDownFill className="me-1" /> {post.dislikes}
                    </Button>

                    {/* Botón de COMENTARIOS */}
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowComments(!showComments)}
                        className="d-flex align-items-center"
                    >
                        <ChatLeftTextFill className="me-1" /> {commentCount} Comentarios
                    </Button>

                </div>

                {/* ⭐️ SECCIÓN DE COMENTARIOS (Mostrar/Ocultar) */}
                {showComments && (
                    <div className="mt-4 border-top pt-3">
                        {/* 1. Lista de Comentarios */}
                        <CommentList postId={post.id} />

                        {/* 2. Formulario para agregar un Comentario */}
                        <CommentForm
                            postId={post.id}
                            // Al crear un comentario, recargamos el post para actualizar el contador
                            onCreate={() => {
                                onUpdate();
                                // Opcional: mantener abiertos los comentarios
                                setShowComments(true);
                            }}
                        />
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}