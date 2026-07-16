package com.industrialbrain.backend.dto;

public class NodeExplanationRequest {

    private String topic;

    public NodeExplanationRequest() {
    }

    public NodeExplanationRequest(String topic) {
        this.topic = topic;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }
}