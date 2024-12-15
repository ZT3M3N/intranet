import { useState, useEffect } from "react";

interface Comment {
  _id: string;
  name: string;
  area: string;
  comment: string;
  approved: boolean;
}

interface CommentModerationProps {
  announcementId: string;
  onCommentUpdate?: () => void;
}

export default function CommentModeration({
  announcementId,
  onCommentUpdate,
}: CommentModerationProps) {
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchPendingComments = async () => {
    try {
      const response = await fetch(
        `/api/announcements/${announcementId}/comments/moderate`
      );

      if (!response.ok) {
        throw new Error("Error al obtener comentarios");
      }

      const data = await response.json();
      setPendingComments(data.filter((comment: Comment) => !comment.approved));
    } catch (error) {
      console.error("Error en fetchPendingComments:", error);
      setError("Error al cargar los comentarios pendientes");
    }
  };

  const approveComment = async (commentId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/announcements/${announcementId}/comments/moderate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentId,
            action: "approve",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al aprobar el comentario");
      }

      // Actualizar la lista de comentarios pendientes
      setPendingComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );

      setMessage("Comentario aprobado correctamente");

      if (onCommentUpdate) {
        await onCommentUpdate();
      }

      // Recargar los comentarios pendientes
      await fetchPendingComments();
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Error al aprobar el comentario"
      );
    } finally {
      setLoading(false);
    }
  };

  const rejectComment = async (commentId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/announcements/${announcementId}/comments/moderate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentId,
            action: "reject",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al rechazar el comentario");
      }

      setPendingComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );

      setMessage("Comentario rechazado correctamente");
      if (onCommentUpdate) {
        onCommentUpdate();
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error al rechazar el comentario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingComments();
  }, [announcementId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Moderación de Comentarios
      </h3>

      {message && (
        <div
          className={`p-3 rounded ${
            message.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {loading && <div className="text-white">Cargando...</div>}

      {pendingComments.length === 0 ? (
        <p className="text-white">No hay comentarios pendientes</p>
      ) : (
        <div className="space-y-4">
          {pendingComments.map((comment) => (
            <div key={comment._id} className="bg-white p-4 rounded-lg">
              <p className="font-semibold">Usuario: {comment.name}</p>
              <p className="text-gray-600">Área: {comment.area}</p>
              <p className="mt-2">{comment.comment}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => approveComment(comment._id)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => rejectComment(comment._id)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
