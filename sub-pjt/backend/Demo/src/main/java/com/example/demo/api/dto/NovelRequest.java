package com.example.demo.api.dto;

import java.util.List;

public class NovelRequest {
    private List<String> words;

    public List<String> getWords() {
        return words;
    }
    public void setWords(List<String> words) {
        this.words = words;
    }
}
