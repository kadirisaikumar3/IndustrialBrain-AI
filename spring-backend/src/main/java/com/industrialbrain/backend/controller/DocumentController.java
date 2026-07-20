package com.industrialbrain.backend.controller;

import com.industrialbrain.backend.entity.Document;
import com.industrialbrain.backend.service.ChunkService;
import com.industrialbrain.backend.service.DocumentService;
import com.industrialbrain.backend.service.GeminiService;
import com.industrialbrain.backend.service.PDFService;
import com.industrialbrain.backend.service.TextChunkService;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import com.industrialbrain.backend.dto.KnowledgeGraphResponse;
import com.industrialbrain.backend.service.KnowledgeGraphService;

import com.industrialbrain.backend.entity.User;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.industrialbrain.backend.entity.User;


@RestController
@RequestMapping("/api/dashboard")
public class DocumentController {

    private final DocumentService documentService;
    private final PDFService pdfService;
    private final GeminiService geminiService;
    private final ChunkService chunkService;
    private final TextChunkService textChunkService;
    private final KnowledgeGraphService knowledgeGraphService;

    public DocumentController(
        DocumentService documentService,
        PDFService pdfService,
        GeminiService geminiService,
        ChunkService chunkService,
        TextChunkService textChunkService,
        KnowledgeGraphService knowledgeGraphService) {

    this.documentService = documentService;
    this.pdfService = pdfService;
    this.geminiService = geminiService;
    this.chunkService = chunkService;
    this.textChunkService = textChunkService;
    this.knowledgeGraphService = knowledgeGraphService;
}


    @GetMapping("/documents")
public List<Document> getAllDocuments(Authentication authentication) {

    User user = (User) authentication.getPrincipal();

    return documentService.getDocumentsByUser(user);
}


    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadDocument(
            @PathVariable Long id) throws Exception {

        Authentication authentication =
        org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication();

User user = (User) authentication.getPrincipal();

Optional<Document> optionalDocument =
        documentService.getDocumentByIdAndUser(id, user);

if (optionalDocument.isEmpty()) {
    return ResponseEntity.status(404)
            .body("Document not found.");
}

Document document = optionalDocument.get();

        if (document.getFilePath().startsWith("http")) {

            URL url = new URL(document.getFilePath());

var connection = url.openConnection();

String contentType = connection.getContentType();

InputStream inputStream = connection.getInputStream();

byte[] fileBytes = inputStream.readAllBytes();

inputStream.close();

return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType))
        .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "inline; filename=\"" +
                        document.getFileName() + "\""
        )
        .body(new ByteArrayResource(fileBytes));
        }

        Path path = Paths.get(document.getFilePath());

        Resource resource =
                documentService.loadFileAsResource(path);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                document.getFileName() + "\""
                )
                .header(
                        HttpHeaders.CONTENT_TYPE,
                        document.getFileType()
                )
                .body(resource);
    }



    @GetMapping("/preview/{id}")
public ResponseEntity<?> previewDocument(@PathVariable Long id) throws Exception {

    Authentication authentication =
        SecurityContextHolder.getContext().getAuthentication();

User user = (User) authentication.getPrincipal();

Optional<Document> optionalDocument =
        documentService.getDocumentByIdAndUser(id, user);

if (optionalDocument.isEmpty()) {
    return ResponseEntity.status(404).build();
}

Document document = optionalDocument.get();

    if (document.getFilePath().startsWith("http")) {

        URL url = new URL(document.getFilePath());

        var connection = url.openConnection();

        String contentType = connection.getContentType();

        InputStream inputStream = connection.getInputStream();

        byte[] fileBytes = inputStream.readAllBytes();

        inputStream.close();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + document.getFileName() + "\""
                )
                .body(new ByteArrayResource(fileBytes));
    }

    Path path = Paths.get(document.getFilePath());

    Resource resource = documentService.loadFileAsResource(path);

    return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(document.getFileType()))
            .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "inline; filename=\"" + document.getFileName() + "\""
            )
            .body(resource);
}



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDocument(
            @PathVariable Long id) {

        boolean deleted =
                documentService.deleteDocument(id);

        if (!deleted) {

            return ResponseEntity.status(404)
                    .body("Document not found.");
        }

        return ResponseEntity.ok(
                "Document deleted successfully."
        );
    }



@GetMapping("/extract/{id}")
public ResponseEntity<String> extractText(
        @PathVariable Long id) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    User user = (User) authentication.getPrincipal();

    Optional<Document> optionalDocument =
            documentService.getDocumentByIdAndUser(id, user);

    if (optionalDocument.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Document document = optionalDocument.get();

    String text =
            pdfService.extractText(document.getFilePath());

    return ResponseEntity.ok(text);
}



    @GetMapping("/summarize/{id}")
    public ResponseEntity<String> summarizeDocument(
            @PathVariable Long id) {

        Authentication authentication =
        SecurityContextHolder.getContext().getAuthentication();

User user = (User) authentication.getPrincipal();

Optional<Document> optionalDocument =
        documentService.getDocumentByIdAndUser(id, user);

if (optionalDocument.isEmpty()) {
    return ResponseEntity.status(404).build();
}

Document document = optionalDocument.get();

        String extractedText =
                pdfService.extractText(document.getFilePath());

        if (extractedText == null ||
                extractedText.startsWith("Error")) {

            return ResponseEntity.badRequest()
                    .body("Failed to extract text from the document.");
        }

        if (extractedText.isBlank()) {

            return ResponseEntity.badRequest().body("""
This document contains no selectable text.

It appears to be a scanned PDF or image-based document.

OCR (Optical Character Recognition) is required.
""");
        }

        List<String> chunks =
                textChunkService.splitIntoChunks(extractedText);

        StringBuilder summaryText = new StringBuilder();

        int limit = Math.min(3, chunks.size());

        for (int i = 0; i < limit; i++) {
            summaryText.append(chunks.get(i)).append("\n\n");
        }

        String prompt = """
You are an Industrial AI Assistant.

Summarize the uploaded document professionally.

Provide:

• Main topic
• Key concepts
• Important points
• Conclusions

Use short bullet points.

Do not add information that is not present in the document.

DOCUMENT:

""" + summaryText;

        String summary =
                geminiService.askGemini(prompt);

        return ResponseEntity.ok(summary);
    }



    @PostMapping("/ask/{id}")
    public ResponseEntity<String> askDocument(
            @PathVariable Long id,
            @RequestBody String question) {

        Authentication authentication =
        SecurityContextHolder.getContext().getAuthentication();

User user = (User) authentication.getPrincipal();

System.out.println("Looking up document ID: " + id);



Optional<Document> optionalDocument =
        documentService.getDocumentByIdAndUser(id, user);

        System.out.println("Document found: " + optionalDocument.isPresent());

if (optionalDocument.isEmpty()) {
    return ResponseEntity.status(404).build();
}

Document document = optionalDocument.get();


System.out.println("Owner ID: " + document.getUser().getId());
System.out.println("File Path: " + document.getFilePath());

        String extractedText =
                pdfService.extractText(document.getFilePath());

                System.out.println("Extracted text length: " + extractedText.length());
System.out.println(extractedText.substring(0, Math.min(200, extractedText.length())));

        if (extractedText == null ||
                extractedText.startsWith("Error")) {

            return ResponseEntity.badRequest()
                    .body("Failed to extract text from the document.");
        }

        if (extractedText.isBlank()) {

            return ResponseEntity.badRequest().body("""
This document contains no selectable text.

It appears to be a scanned PDF or image-based document.

OCR (Optical Character Recognition) is required.
""");
        }

        String relevantText =
                chunkService.getRelevantChunks(
                        extractedText,
                        question
                );

        String prompt = """
You are IndustrialBrain AI, an intelligent document assistant.

The document is divided into pages using markers like:

========== PAGE 1 ==========
========== PAGE 2 ==========
========== PAGE 3 ==========

Follow these rules strictly:

1. Answer ONLY using the uploaded document.

2. Never use outside knowledge.

3. If the answer is found on one page, end your answer with:
Source: Page X

Example:
Java was developed by Sun Microsystems.
Source: Page 2

4. If the answer comes from multiple pages, write:
Source: Pages 2, 3

5. If the information is partially available,
clearly mention that it is incomplete.

6. If the answer is not present anywhere in the document, reply exactly:

The answer is not available in the uploaded document. Please ask a question related to the uploaded PDF.

7. Keep the answer concise and professional.

DOCUMENT:

""" + relevantText +

"""

QUESTION:

""" + question;

        String answer =
                geminiService.askGemini(prompt);

        return ResponseEntity.ok(answer);
    }



@GetMapping("/knowledge-graph/{id}")
public ResponseEntity<KnowledgeGraphResponse> getKnowledgeGraph(
        @PathVariable Long id) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    User user = (User) authentication.getPrincipal();

    Optional<Document> optionalDocument =
            documentService.getDocumentByIdAndUser(id, user);

    if (optionalDocument.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Document document = optionalDocument.get();

    String extractedText =
            pdfService.extractText(document.getFilePath());

    if (extractedText == null ||
            extractedText.isBlank() ||
            extractedText.startsWith("Error")) {

        return ResponseEntity.badRequest().build();
    }

    KnowledgeGraphResponse graph =
            knowledgeGraphService.generateGraph(extractedText);

    return ResponseEntity.ok(graph);
}

}