package com.industrialbrain.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GraphRepairService {

    private final ObjectMapper mapper = new ObjectMapper();

    public String repair(String json) {

        try {

            JsonNode root = mapper.readTree(json);

            if (!root.has("nodes") || !root.has("edges")) {
                return json;
            }

            ArrayNode nodes = (ArrayNode) root.get("nodes");
            ArrayNode edges = (ArrayNode) root.get("edges");

            Map<String, JsonNode> nodeMap = new LinkedHashMap<>();

            for (JsonNode node : nodes) {
                nodeMap.put(node.get("id").asText(), node);
            }

            Map<String, Integer> parentCount = new HashMap<>();

            for (String id : nodeMap.keySet()) {
                parentCount.put(id, 0);
            }

            Set<String> edgeSet = new LinkedHashSet<>();

            ArrayNode cleanEdges = mapper.createArrayNode();

            for (JsonNode edge : edges) {

                String source = edge.get("source").asText();
                String target = edge.get("target").asText();

                if (!nodeMap.containsKey(source) || !nodeMap.containsKey(target)) {
                    continue;
                }

                String key = source + "->" + target;

                if (edgeSet.contains(key)) {
                    continue;
                }

                edgeSet.add(key);

                cleanEdges.add(edge);

                parentCount.put(
                        target,
                        parentCount.getOrDefault(target, 0) + 1
                );
            }

                        // -----------------------------
            // Find Root
            // -----------------------------

            String rootId = null;

            for (String id : nodeMap.keySet()) {

                if (parentCount.get(id) == 0) {

                    if (rootId == null) {
                        rootId = id;
                    }

                    // Prefer Java if present
                    if (id.equalsIgnoreCase("Java")) {
                        rootId = id;
                        break;
                    }
                }
            }

            if (rootId == null && !nodeMap.isEmpty()) {
                rootId = nodeMap.keySet().iterator().next();
            }

            // -----------------------------
            // Attach Orphan Nodes
            // -----------------------------

            for (String id : nodeMap.keySet()) {

                if (id.equals(rootId)) {
                    continue;
                }

                if (parentCount.get(id) == 0) {

                    ObjectNode edge = mapper.createObjectNode();

                    edge.put("source", rootId);
                    edge.put("target", id);

                    cleanEdges.add(edge);
                }
            }

            // -----------------------------
            // Build Final JSON
            // -----------------------------

            ObjectNode output = mapper.createObjectNode();

            output.set("nodes", nodes);
            output.set("edges", cleanEdges);

            return mapper.writerWithDefaultPrettyPrinter()
                    .writeValueAsString(output);

        }
        catch (Exception e) {

            e.printStackTrace();

            return json;
        }
    }
}