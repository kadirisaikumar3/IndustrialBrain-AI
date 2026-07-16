package com.industrialbrain.backend.service;

import com.industrialbrain.backend.dto.Edge;
import com.industrialbrain.backend.dto.KnowledgeGraphResponse;
import com.industrialbrain.backend.dto.Node;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class KnowledgeGraphService {

    private final GeminiService geminiService;

    public KnowledgeGraphService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public KnowledgeGraphResponse generateGraph(String documentText) {

        String prompt = """
You are an Industrial AI Assistant.

Read the document carefully.

Extract relationships.

Return ONLY in this format.

Machine -> connected_to -> Motor

Motor -> drives -> Conveyor Belt

Sensor -> monitors -> Temperature

Valve -> controls -> Water Flow

Rules:

One relationship per line.

No numbering.

No explanation.

DOCUMENT:

""" + documentText;

        String result = geminiService.askGemini(prompt);

        Map<String, Node> nodeMap = new LinkedHashMap<>();

        Set<String> edgeSet = new HashSet<>();
        List<Edge> edges = new ArrayList<>();

        String[] lines = result.split("\\r?\\n");

        int maxRelationships = 120;
        int count = 0;

        for (String line : lines) {

            if (count >= maxRelationships) {
                break;
            }

            if (!line.contains("->")) {
                continue;
            }

            String[] parts = line.split("->");

            if (parts.length < 3) {
                continue;
            }

            String source = parts[0].trim();
            String target = parts[2].trim();

            nodeMap.putIfAbsent(
                    source,
                    new Node(source, source)
            );

            nodeMap.putIfAbsent(
                    target,
                    new Node(target, target)
            );

            String edgeKey = source + "->" + target;

            if (!edgeSet.contains(edgeKey)) {

                edgeSet.add(edgeKey);

                edges.add(
                        new Edge(source, target)
                );

                count++;
            }
        }

        return new KnowledgeGraphResponse(
                new ArrayList<>(nodeMap.values()),
                edges
        );
    }
}