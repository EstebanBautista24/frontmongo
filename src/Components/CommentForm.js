import { useState } from "react";
import axios from "axios";
import { Button, Form, InputGroup } from "react-bootstrap";
import { SendFill, PersonCircle } from "react-bootstrap-icons";

export default function CommentForm({ postId, onComment }) {
    const [text, setText] = useState("");
    const [author, setAuthor] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!text.trim() || !author.trim()) {
            alert("Por favor, ingresa tu nombre y un comentario.");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:8080/api/comments", {
                postId,
                text,
                author,
            });
            setText("");
            // No limpiar authorId para conveniencia del usuario si va a comentar varias veces
            onComment(); // Recarga los posts (y, por lo tanto, la lista de comentarios)
        } catch (error) {
            console.error("Error al publicar el comentario:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form className="mt-3 p-3 border rounded bg-white shadow-sm">
            <h6 className="mb-3 text-primary">Deja tu comentario</h6>

            <Form.Group className="mb-2">
                <InputGroup size="sm">
                    <InputGroup.Text><PersonCircle /></InputGroup.Text>
                    <Form.Control
                        placeholder="Tu nombre / Nick"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        disabled={loading}
                    />
                </InputGroup>
            </Form.Group>

            <Form.Group className="mb-2">
                <Form.Control
                    as="textarea"
                    placeholder="Escribe tu comentario..."
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={loading}
                />
            </Form.Group>

            <Button
                size="sm"
                variant="primary"
                onClick={submit}
                className="mt-2 w-100"
                disabled={loading || !text.trim() || !author.trim()}
            >
                {loading ? 'Publicando...' : <><SendFill className="me-1" /> Publicar Comentario</>}
            </Button>
        </Form>
    );
}