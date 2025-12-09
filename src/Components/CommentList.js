import { useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, Alert } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";

export default function CommentList({ postId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/comments/post/${postId}`);
            setComments(res.data);
        } catch (error) {
            console.error("Error al cargar comentarios:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    if (loading) {
        return <p className="text-center text-muted">Cargando comentarios...</p>;
    }

    return (
        <div className="mb-3">
            <h5 className="mb-2 text-primary">Comentarios ({comments.length})</h5>

            {comments.length === 0 ? (
                <Alert variant="info" className="p-2 text-center">
                    Sé el primero en comentar.
                </Alert>
            ) : (
                <ListGroup variant="flush" className="border rounded shadow-sm">
                    {comments.map(c => (
                        <ListGroup.Item key={c.id} className="d-flex flex-column">
                            <div className="d-flex align-items-center mb-1">
                                <PersonCircle className="me-2 text-secondary" size={20} />
                                <strong className="text-dark me-2">{c.author || "Anónimo"}</strong>
                                <small className="text-muted ms-auto">
                                    {/* Opcional: Si el backend devuelve la fecha del comentario */}
                                    {c.publicationDate ? new Date(c.publicationDate).toLocaleTimeString() : ''}
                                </small>
                            </div>
                            <p className="mb-0 ms-4 text-break">{c.text}</p>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
}