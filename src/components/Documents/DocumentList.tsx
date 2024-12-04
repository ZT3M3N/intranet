import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UploadDocumentForm } from "./UploadDocumentForm";
import { useToast } from "@/hooks/use-toast";
import { FileIcon, Trash2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [categories, setCategories] = useState([
    "General",
    "RH",
    "Finanzas",
    "Operaciones",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.2);
  const { toast } = useToast();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // Función para verificar si el archivo es un PDF
  const isPDF = (contentType: string) => {
    return contentType === "application/pdf";
  };

  const handleViewDocument = async (id: string, contentType: string) => {
    try {
      const response = await fetch(`/api/documents/${id}/download`);
      if (!response.ok) throw new Error("Error al visualizar el documento");

      const blob = await response.blob();

      if (isPDF(contentType)) {
        // Si es PDF, mostrar en el visor
        const url = URL.createObjectURL(blob);
        setSelectedDocument(url);
      } else {
        // Si no es PDF, abrir en una nueva pestaña
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo visualizar el documento",
        variant: "destructive",
      });
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este documento?"))
      return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el documento");
      }

      const data = await response.json();

      toast({
        title: "Éxito",
        description: data.message || "Documento eliminado correctamente",
      });

      // Actualizar la lista de documentos
      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el documento",
        variant: "destructive",
      });
    }
  };

  const filteredDocuments =
    selectedCategory === "all"
      ? documents
      : documents.filter((doc) => doc.category === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Documentos</h2>
        <Button onClick={() => setShowUploadForm(true)}>Subir documento</Button>
      </div>

      <div className="flex gap-2 mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {showUploadForm && (
        <div className="bg-white p-4 rounded-lg shadow">
          <UploadDocumentForm
            onUploadSuccess={() => {
              setShowUploadForm(false);
              fetchDocuments();
            }}
            onCancel={() => setShowUploadForm(false)}
            categories={categories}
          />
        </div>
      )}

      <div className="grid gap-4">
        {filteredDocuments.map((doc) => (
          <div
            key={doc._id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              <FileIcon className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">{doc.title}</h3>
                <p className="text-sm text-gray-500">{doc.description}</p>
                <p className="text-xs text-gray-400">
                  Categoría: {doc.category} | Subido por: {doc.uploadedBy}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDocument(doc._id, doc.contentType)}
              >
                Ver
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteDocument(doc._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
                >
                  Reducir
                </Button>
                <span>{Math.round(scale * 100)}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScale((prev) => Math.min(prev + 0.1, 2))}
                >
                  Aumentar
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedDocument(null);
                  setNumPages(null);
                }}
                className="text-red-500 hover:text-red-700"
              >
                Cerrar
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="flex justify-center">
                <Document
                  file={selectedDocument}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center h-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  }
                  error={
                    <div className="text-red-500">
                      Error al cargar el documento
                    </div>
                  }
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="mb-4">
                      <Page
                        pageNumber={index + 1}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        loading={
                          <div className="flex items-center justify-center h-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                          </div>
                        }
                      />
                    </div>
                  ))}
                </Document>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
