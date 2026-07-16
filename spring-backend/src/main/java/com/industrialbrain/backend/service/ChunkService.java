package com.industrialbrain.backend.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChunkService {

    private static final int CHUNK_SIZE = 1000;

    public List<String> splitIntoChunks(String text) {

        List<String> chunks = new ArrayList<>();

        if (text == null || text.isBlank()) {
            return chunks;
        }

        for (int i = 0; i < text.length(); i += CHUNK_SIZE) {

            int end = Math.min(i + CHUNK_SIZE, text.length());

            chunks.add(text.substring(i, end));
        }

        return chunks;
    }

    public String getRelevantChunks(String text, String question) {

        List<String> chunks = splitIntoChunks(text);

        if (chunks.isEmpty()) {
            return "";
        }

        String[] keywords = question
                .toLowerCase()
                .replaceAll("[^a-zA-Z0-9 ]", "")
                .split("\\s+");

        Map<String, Integer> scores = new HashMap<>();

        for (String chunk : chunks) {

            int score = 0;

            String lowerChunk = chunk.toLowerCase();

            for (String keyword : keywords) {

                if (keyword.length() < 2) {
                    continue;
                }

                if (lowerChunk.contains(keyword)) {
                    score++;
                }
            }

            scores.put(chunk, score);
        }

        List<Map.Entry<String, Integer>> sorted =
                new ArrayList<>(scores.entrySet());

        sorted.sort((a, b) -> b.getValue().compareTo(a.getValue()));

        StringBuilder result = new StringBuilder();

        int count = 0;

        for (Map.Entry<String, Integer> entry : sorted) {

            if (entry.getValue() == 0) {
                continue;
            }

            result.append(entry.getKey())
                  .append("\n\n--------------------------\n\n");

            count++;

            if (count == 3) {
                break;
            }
        }

        if (result.isEmpty()) {

            return chunks.get(0);
        }

        return result.toString();
    }
}