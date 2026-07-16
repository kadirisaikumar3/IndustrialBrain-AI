package com.industrialbrain.backend.controller;

import com.industrialbrain.backend.dto.NodeExplanationRequest;
import com.industrialbrain.backend.dto.NodeExplanationResponse;
import com.industrialbrain.backend.entity.Document;
import com.industrialbrain.backend.service.DocumentService;
import com.industrialbrain.backend.service.GeminiExplanationService;
import com.industrialbrain.backend.service.GeminiKnowledgeGraphService;
import com.industrialbrain.backend.service.KeywordService;
import com.industrialbrain.backend.service.PDFService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard")
public class GraphController {

    private final DocumentService documentService;
    private final PDFService pdfService;
    private final KeywordService keywordService;
    private final GeminiKnowledgeGraphService geminiKnowledgeGraphService;
    private final GeminiExplanationService geminiExplanationService;

    public GraphController(
            DocumentService documentService,
            PDFService pdfService,
            KeywordService keywordService,
            GeminiKnowledgeGraphService geminiKnowledgeGraphService,
            GeminiExplanationService geminiExplanationService) {

        this.documentService = documentService;
        this.pdfService = pdfService;
        this.keywordService = keywordService;
        this.geminiKnowledgeGraphService = geminiKnowledgeGraphService;
        this.geminiExplanationService = geminiExplanationService;
    }

    @GetMapping("/keywords/{id}")
    public List<String> getKeywords(@PathVariable Long id) {


        Optional<Document> optionalDocument =
                documentService.getDocumentById(id);

        if (optionalDocument.isEmpty()) {
            throw new RuntimeException("Document not found.");
        }

        Document document = optionalDocument.get();

        String text =
                pdfService.extractText(document.getFilePath());

        return keywordService.extractKeywords(text);
    }

    @GetMapping("/gemini/{id}")
    public String generateKnowledgeGraph(@PathVariable Long id) {

        Optional<Document> optionalDocument =
                documentService.getDocumentById(id);

        if (optionalDocument.isEmpty()) {
            throw new RuntimeException("Document not found.");
        }

        Document document = optionalDocument.get();

        String text =
                pdfService.extractText(document.getFilePath());

        return geminiKnowledgeGraphService
                .generateKnowledgeGraph(text);
    }

    @PostMapping("/explain")
    public NodeExplanationResponse explainNode(
            @RequestBody NodeExplanationRequest request) {

        String explanation =
                geminiExplanationService.explainTopic(
                        request.getTopic()
                );

        return new NodeExplanationResponse(explanation);
    }
}