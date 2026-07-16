package com.industrialbrain.backend.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class KeywordService {

    // Common English words to ignore
    private static final Set<String> STOP_WORDS = Set.of(
            "the","and","is","in","of","to","a","an","for",
            "on","with","that","this","are","was","were",
            "be","by","as","at","or","it","from","into",
            "about","can","will","your","you","their","they",
            "his","her","its","our","ours","have","has","had"
    );

    public List<String> extractKeywords(String text) {

        Map<String, Integer> frequency = new HashMap<>();

        Pattern pattern = Pattern.compile("[A-Za-z][A-Za-z0-9+-]{2,}");

        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {

            String word = matcher.group().toLowerCase();

            if (STOP_WORDS.contains(word)) {
                continue;
            }

            frequency.put(
                    word,
                    frequency.getOrDefault(word, 0) + 1
            );
        }

        List<Map.Entry<String, Integer>> list =
                new ArrayList<>(frequency.entrySet());

        list.sort((a, b) ->
                b.getValue().compareTo(a.getValue()));

        List<String> keywords = new ArrayList<>();

        int limit = Math.min(30, list.size());

        for (int i = 0; i < limit; i++) {

            String keyword = list.get(i).getKey();

            keywords.add(
                    Character.toUpperCase(keyword.charAt(0))
                            + keyword.substring(1)
            );

        }

        return keywords;

    }

}