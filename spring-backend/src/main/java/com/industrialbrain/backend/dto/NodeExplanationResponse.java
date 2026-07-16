package com.industrialbrain.backend.dto;

public class NodeExplanationResponse {

    private String explanation;

    public NodeExplanationResponse() {
    }

    public NodeExplanationResponse(String explanation) {
        this.explanation = explanation;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}