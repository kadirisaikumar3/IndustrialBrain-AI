package com.industrialbrain.backend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

@Service
public class GeminiKnowledgeGraphService {

    private final GeminiClientProvider provider;

    private static final String MODEL = "gemini-3.5-flash";

    public GeminiKnowledgeGraphService(GeminiClientProvider provider) {
        this.provider = provider;
    }

    public String generateKnowledgeGraph(String text) {

        String prompt = """
You are an expert AI Knowledge Graph Generator.

Your task is to analyze the document and generate ONE connected hierarchical knowledge graph.

Return ONLY VALID JSON.

Never use markdown.
Never use ```json.
Never explain anything.
Never return any text outside the JSON.

Return EXACTLY this structure:

{
  "nodes":[
    {
      "id":"Programming",
      "label":"Programming"
    }
  ],
  "edges":[
    {
      "source":"Programming",
      "target":"Java"
    }
  ]
}

==================================================
GRAPH STRUCTURE RULES
==================================================

1. Create EXACTLY ONE root node.

2. The root node MUST represent the complete document.

Examples:

Java
Operating System
Computer Networks
Machine Learning
DBMS

3. Every node MUST be reachable from the root node.

4. The graph MUST be ONE connected tree.

5. Never create disconnected components.

6. Never create orphan nodes.

7. Every node except the root MUST have exactly ONE parent.

8. Never create cycles.

9. Never create two-way relationships.

10. Every edge source MUST exist in nodes.

11. Every edge target MUST exist in nodes.

12. Verify before returning JSON that there is exactly ONE root node.

==================================================
HIERARCHY RULES
==================================================

Build a deep hierarchy.

BAD:

Java
├── int
├── String
├── JVM
├── Thread
├── Collections
└── File

GOOD:

Java
├── History
│   ├── James Gosling
│   ├── Oak
│   └── Sun Microsystems
│
├── JVM
│   ├── Bytecode
│   ├── JIT Compiler
│   └── Garbage Collection
│
├── Data Types
│   ├── Primitive
│   │   ├── int
│   │   ├── float
│   │   └── boolean
│   │
│   └── Non Primitive
│       ├── String
│       ├── Array
│       └── Object
│
├── OOP
│   ├── Class
│   ├── Object
│   ├── Inheritance
│   ├── Polymorphism
│   └── Abstraction
│
└── Collections
    ├── List
    ├── ArrayList
    ├── LinkedList
    ├── Set
    ├── HashSet
    ├── TreeSet
    ├── Map
    ├── HashMap
    └── TreeMap

Every major topic should have multiple child nodes.

Every child should have its own children whenever possible.

Prefer 3–6 hierarchy levels.

Never connect everything directly to the root.

==================================================
HOW TO BUILD THE TREE
==================================================

Think like a textbook author.

First identify the major sections of the document.

Then create topics under each section.

Then create subtopics.

Then create detailed concepts.

The hierarchy should always follow this pattern:

Document
→ Section
→ Topic
→ Subtopic
→ Detail

Do NOT connect detailed concepts directly to the root.

Balance the hierarchy.

Every major section should contain multiple topics.

Every topic should contain multiple concepts whenever possible.

Avoid long single chains.

Avoid one node having dozens of direct children.

The graph should look like a textbook table of contents.

==================================================
CONTENT RULES
==================================================

Generate between 100 and 200 nodes whenever enough information exists.

Extract:

• Topics
• Subtopics
• Definitions
• Interview concepts
• APIs
• Keywords
• Frameworks
• Classes
• Algorithms
• Best practices
• Examples
• Important facts
• Commands
• Tools

Do not generate duplicate nodes.

Ignore:

• Page numbers
• Headers
• Footers
• Copyright
• Question numbers
• Easy/Medium/Hard labels

Keep labels concise (2-5 words).

Return ONLY valid JSON.

==================================================
DOCUMENT
==================================================

""" + text.substring(0, Math.min(text.length(), 15000));

        try {

            GenerateContentResponse response = null;

            int attempt = 1;

for (String apiKey : provider.getApiKeys()) {

    System.out.println("================================");
    System.out.println("Trying Gemini API Key #" + attempt);

    try {

        Client client = provider.getClient(apiKey);

        response = client.models.generateContent(
        MODEL,
        prompt,
        null
        );

        if (response != null && response.text() != null) {

            System.out.println("SUCCESS using key #" + attempt);
            break;
        }

    } catch (Exception e) {

        System.out.println("FAILED key #" + attempt);
        System.out.println(e.getMessage());

    }

    attempt++;
}

            if (response == null || response.text() == null) {
                return """
{
  "error":"All Gemini API keys have exhausted their quota."
}
""";
            }

            String result = response.text();

            result = result.replace("```json", "");
            result = result.replace("```", "");
            result = result.trim();

            int start = result.indexOf("{");
            int end = result.lastIndexOf("}");

            if (start >= 0 && end > start) {
                result = result.substring(start, end + 1);
            } else {
                return "{}";
            }

            if (!result.contains("\"nodes\"") ||
                !result.contains("\"edges\"")) {
                return "{}";
            }

            return result;

        } catch (Exception e) {

            e.printStackTrace();

            return """
{
  "error":"Unable to generate knowledge graph."
}
""";
        }
    }
}