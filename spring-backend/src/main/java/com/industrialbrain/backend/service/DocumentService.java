package com.industrialbrain.backend.service;

import com.industrialbrain.backend.entity.Document;
import com.industrialbrain.backend.entity.User;
import com.industrialbrain.backend.repository.DocumentRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    // Save document
    public Document saveDocument(Document document) {
        return documentRepository.save(document);
    }

    // Existing method (keep for now)
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    // NEW: Get documents of a specific user
    public List<Document> getDocumentsByUser(User user) {
        return documentRepository.findByUser(user);
    }

    // Existing method (keep for now)
    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    // NEW: Get a document belonging to a specific user
    public Optional<Document> getDocumentByIdAndUser(Long id, User user) {
    return documentRepository.findByIdAndUser(id, user);
}

    // Load file as Resource
    public Resource loadFileAsResource(Path path) {

        try {

            File file = path.toFile();

            if (!file.exists()) {

                file = new File(
                        System.getProperty("user.dir")
                                + File.separator
                                + "uploads",
                        file.getName()
                );

            }

            Resource resource = new UrlResource(file.toURI());

            if (resource.exists()) {
                return resource;
            }

            throw new RuntimeException("File not found: " + file.getAbsolutePath());

        } catch (MalformedURLException e) {

            throw new RuntimeException("File not found.", e);

        }
    }

    // Delete document
    public boolean deleteDocument(Long id) {

        Optional<Document> optionalDocument = documentRepository.findById(id);

        if (optionalDocument.isEmpty()) {
            return false;
        }

        Document document = optionalDocument.get();

        File file = new File(document.getFilePath());

        if (file.exists()) {
            file.delete();
        }

        documentRepository.deleteById(id);

        return true;
    }
}