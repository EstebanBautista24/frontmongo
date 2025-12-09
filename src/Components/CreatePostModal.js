import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { Save, XLg } from "react-bootstrap-icons";

export default function CreatePostModal({ show, handleClose, onCreate }) {
    const [title, setTitle] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [content, setContent] = useState("");
    // ⭐️ NUEVO ESTADO PARA EL ENLACE DE LA IMAGEN
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const save = async () => {
        setLoading(true);
        try {
            await axios.post("http://localhost:8080/api/posts", {
                title,
                content,
                authorId,
                // ⭐️ ENVIAR EL NUEVO CAMPO AL BACKEND
                imageUrl
            });
            onCreate();
            handleClose();
            // Limpiar estados
            setTitle("");
            setContent("");
            setAuthorId("");
            setImageUrl(""); // ⭐️ LIMPIAR EL CAMPO DE LA IMAGEN
        } catch (error) {
            console.error("Error al crear el post:", error);
            alert("Hubo un error al guardar el post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>📝 Crear Nueva Discusión</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Título del Post</Form.Label>
                        <Form.Control
                            placeholder="Ej: Mi proyecto de jardinería urbana"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Tu nombre/Nick</Form.Label>
                        <Form.Control
                            placeholder="Tu nombre (obligatorio)"
                            value={authorId}
                            onChange={(e) => setAuthorId(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Contenido</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Escribe el contenido completo de tu post aquí..."
                            rows={5}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>

                    {/* ⭐️ NUEVO CAMPO PARA LA URL DE LA IMAGEN */}
                    <Form.Group className="mb-3 border p-3 rounded bg-light">
                        <Form.Label className="fw-bold">Enlace de la Imagen (Opcional)</Form.Label>
                        <Form.Control
                            placeholder="Pega el enlace directo a la imagen (URL)"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Asegúrate que sea un enlace directo a la imagen, p.ej. "https://ejemplo.com/foto.jpg".
                        </Form.Text>
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                    <XLg className="me-1" /> Cancelar
                </Button>
                <Button variant="primary" onClick={save} disabled={loading || !title || !content || !authorId}>
                    {loading ? 'Guardando...' : <><Save className="me-1" /> Guardar Post</>}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}