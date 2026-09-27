package com.localinternetinterview.backend.dto;

public class AiAnalysisResponse {

    private String intent;
    private String topic;
    private String location;
    private String urgency;

    public AiAnalysisResponse() {
    }

    public AiAnalysisResponse(
            String intent,
            String topic,
            String location,
            String urgency) {

        this.intent = intent;
        this.topic = topic;
        this.location = location;
        this.urgency = urgency;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }
}