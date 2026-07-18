package com.industrialbrain.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class KnowledgeGraphRepairService {

    private final ObjectMapper mapper = new ObjectMapper();

    public String repair(String json) {

        try {

            JsonNode root = mapper.readTree(json);

            System.out.println("========== REPAIR SERVICE ==========");
System.out.println(json.substring(0, Math.min(json.length(), 500)));

            ArrayNode nodes =
                    (ArrayNode) root.get("nodes");

            ArrayNode edges =
                    (ArrayNode) root.get("edges");

            if (nodes == null || edges == null) {
                return json;
            }

            //------------------------------------------------
            // Collect all node ids
            //------------------------------------------------

            Set<String> nodeIds = new HashSet<>();

            for (JsonNode node : nodes) {

                nodeIds.add(
                        node.get("id").asText()
                );
            }

            //------------------------------------------------
            // Find all child nodes
            //------------------------------------------------

            Set<String> childNodes = new HashSet<>();

            for (JsonNode edge : edges) {

                childNodes.add(
                        edge.get("target").asText()
                );
            }

            //------------------------------------------------
            // Find roots
            //------------------------------------------------

            List<String> roots = new ArrayList<>();

            for (String id : nodeIds) {

                if (!childNodes.contains(id)) {

                    roots.add(id);
                }
            }

            //------------------------------------------------
            // Already one root
            //------------------------------------------------

            if (roots.size() <= 1) {

                System.out.println("========== ROOTS ==========");
System.out.println(roots);

System.out.println("Root count = " + roots.size());

System.out.println("Nodes after repair = " + nodes.size());
System.out.println("Edges after repair = " + edges.size());

                return mapper.writerWithDefaultPrettyPrinter()
                        .writeValueAsString(root);
            }

            //------------------------------------------------
            // Create Super Root
            //------------------------------------------------

            String superRoot = "Document";

            ObjectNode rootNode = mapper.createObjectNode();

            rootNode.put("id", superRoot);
            rootNode.put("label", superRoot);

            nodes.add(rootNode);

System.out.println("Added Document node");

            //------------------------------------------------
            // Connect every root to Document
            //------------------------------------------------

            for (String r : roots) {

                ObjectNode edge =
                        mapper.createObjectNode();

                edge.put("source", superRoot);
                edge.put("target", r);

                edges.add(edge);

                System.out.println("Connected Document -> " + r);
            }

            System.out.println("FINAL NODE COUNT = " + nodes.size());
System.out.println("FINAL EDGE COUNT = " + edges.size());
System.out.println("========== REPAIR COMPLETE ==========");

            return mapper.writerWithDefaultPrettyPrinter()
                    .writeValueAsString(root);

        }

        catch (Exception e) {

            e.printStackTrace();

            return json;

        }

    }

}