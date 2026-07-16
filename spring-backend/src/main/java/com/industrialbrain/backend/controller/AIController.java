package com.industrialbrain.backend.controller;

import com.industrialbrain.backend.dto.ChatRequest;
import com.industrialbrain.backend.dto.ChatResponse;
import com.industrialbrain.backend.entity.Document;
import com.industrialbrain.backend.service.DocumentService;
import com.industrialbrain.backend.service.GeminiService;
import com.industrialbrain.backend.service.PDFService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard")
public class AIController {

    private final DocumentService documentService;
    private final PDFService pdfService;
    private final GeminiService geminiService;

    public AIController(
            DocumentService documentService,
            PDFService pdfService,
            GeminiService geminiService) {

        this.documentService = documentService;
        this.pdfService = pdfService;
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request) {

        Optional<Document> optionalDocument =
                documentService.getDocumentById(request.getDocumentId());

        if (optionalDocument.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Document document = optionalDocument.get();

        String pdfText =
                pdfService.extractText(document.getFilePath());

        String prompt = """
                You are an AI assistant.

                Below is the content of a PDF document.

                -------------------------
                %s
                -------------------------

                User Question:
                %s

                Answer the question only using the PDF content.
                If the answer is not found in the PDF,
                say:
                "The answer is not available in the uploaded document."
                """.formatted(
                        pdfText,
                        request.getQuestion()
                );

        String answer =
                geminiService.askGemini(prompt);

        return ResponseEntity.ok(
                new ChatResponse(answer)
        );
    }

}