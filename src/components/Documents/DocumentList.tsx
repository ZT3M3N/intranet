// src/components/Documents/DocumentList.tsx
import { FileText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Documents } from "@/types";

interface DocumentListProps {
  documents: Documents;
}

export function DocumentList({ documents }: DocumentListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Documentos</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Documentos importantes</AccordionTrigger>
          <AccordionContent>
            {documents.important.map((doc, index) => (
              <div key={index} className="flex items-center space-x-2 py-1">
                <FileText className="h-5 w-5 text-primary" />
                <a href={doc.url} className="text-accent hover:underline">
                  {doc.name}
                </a>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        {/* Repeat for other document categories */}
      </Accordion>
    </div>
  );
}