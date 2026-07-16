package com.industrialbrain.backend.service;

import com.google.genai.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class GeminiClientProvider {

    private final String[] apiKeys;

    // Index of the API key to start with
    private final AtomicInteger currentKeyIndex = new AtomicInteger(0);

    // Stores cooldown expiry time for each API key
    private final Map<Integer, Long> cooldownMap = new ConcurrentHashMap<>();

    public GeminiClientProvider(
            @Value("${gemini.api.keys}") String keys) {

        this.apiKeys = keys.split(",");

        System.out.println("Loaded " + apiKeys.length + " Gemini API keys");
    }

    public String[] getApiKeys() {
        return apiKeys;
    }

    public Client getClient(String apiKey) {
        return Client.builder()
                .apiKey(apiKey.trim())
                .build();
    }

    public int getCurrentKeyIndex() {
        return currentKeyIndex.get();
    }

    public void setCurrentKeyIndex(int index) {
        currentKeyIndex.set(index);
    }

    /**
     * Put an API key on cooldown.
     *
     * @param index Index of API key
     * @param milliseconds Cooldown duration
     */
    public void putOnCooldown(int index, long milliseconds) {
        cooldownMap.put(index, System.currentTimeMillis() + milliseconds);
    }

    /**
     * Returns true if the API key is currently on cooldown.
     */
    public boolean isOnCooldown(int index) {

        Long expiresAt = cooldownMap.get(index);

        if (expiresAt == null) {
            return false;
        }

        // Cooldown expired
        if (System.currentTimeMillis() >= expiresAt) {
            cooldownMap.remove(index);
            return false;
        }

        return true;
    }

    /**
     * Returns remaining cooldown time in milliseconds.
     */
    public long getRemainingCooldown(int index) {

        Long expiresAt = cooldownMap.get(index);

        if (expiresAt == null) {
            return 0;
        }

        return Math.max(0, expiresAt - System.currentTimeMillis());
    }
}