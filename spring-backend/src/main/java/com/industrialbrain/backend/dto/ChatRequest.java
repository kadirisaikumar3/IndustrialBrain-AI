package com.industrialbrain.backend.dto;

public class ChatRequest {

    private Long documentId;
    private String question;

    public ChatRequest() {
    }

    public ChatRequest(Long documentId, String question) {
        this.documentId = documentId;
        this.question = question;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}