package com.industrialbrain.backend.controller;

import com.industrialbrain.backend.entity.Document;
import com.industrialbrain.backend.service.DocumentService;
import com.industrialbrain.backend.service.GeminiKnowledgeGraphService;
import com.industrialbrain.backend.service.KnowledgeGraphRepairService;
import com.industrialbrain.backend.service.PDFService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard")
public class KnowledgeGraphController {

    private final DocumentService documentService;
    private final PDFService pdfService;
    private final GeminiKnowledgeGraphService knowledgeGraphService;
    private final KnowledgeGraphRepairService repairService;

    public KnowledgeGraphController(
            DocumentService documentService,
            PDFService pdfService,
            GeminiKnowledgeGraphService knowledgeGraphService,
            KnowledgeGraphRepairService repairService) {

        this.documentService = documentService;
        this.pdfService = pdfService;
        this.knowledgeGraphService = knowledgeGraphService;
        this.repairService = repairService;
    }

    @GetMapping("/graph/{id}")
    public ResponseEntity<String> generateGraph(@PathVariable Long id) {

        Optional<Document> optionalDocument =
                documentService.getDocumentById(id);

        if (optionalDocument.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Document document = optionalDocument.get();

        String text = pdfService.extractText(document.getFilePath());

        if (text == null ||
                text.isBlank() ||
                text.startsWith("Error")) {

            return ResponseEntity.badRequest()
                    .body("{\"error\":\"Unable to extract text.\"}");
        }

        String graph =
                knowledgeGraphService.generateKnowledgeGraph(text);

        // Repair disconnected graphs
        graph = repairService.repair(graph);

        return ResponseEntity.ok(graph);
    }
}