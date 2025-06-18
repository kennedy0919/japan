package com.example.demo.service;

import com.example.demo.config.OpenAiProperties;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class OpenAiService {
    private final WebClient client;
    private final OpenAiProperties props;

    public OpenAiService(OpenAiProperties props) {
        this.props = props;
        System.out.println("API 키: " + props.getApiKey());
        this.client = WebClient.builder()
                .baseUrl(props.getEndpoint())
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + props.getApiKey())
                .build();
    }

    /**
     * 선택된 단어 목록을 받아,
     * “이 단어들로 짧은 소설을 써 달라”는 프롬프트를 만들어
     * OpenAI API를 호출하고, 생성된 텍스트를 Mono<String> 으로 리턴.
     */
    public Mono<String> generateNovel(List<String> words) {
        String prompt =
                "約2000字程度の長編小説の冒頭を、以下の単語を使って現代の日常系で書いてください：\n" +
                        String.join("、", words) +
                        "\n\n小説：";

        Map<String, Object> body = Map.of(
                "model", "gpt-3.5-turbo",
                "max_tokens", 3000,                           // ★ 충분히 크게 설정
                "temperature", 0.7,                           // 스타일 조정용
                "messages", List.of(
                        Map.of("role", "system", "content", "舞台は2025年の現在\n" +
                                "主人公は「私」という存在とする\n" +
                                "与えられた単語をもとに、「私」という存在の物語を構築すること\n" +
                                "言語は日本語で執筆すること\n" +
                                "右上から左下へ読む縦書き形式で書くこと."),
                        Map.of("role", "user",   "content", prompt)
                )
        );

        return client.post()
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(root -> root
                        .path("choices").get(0)
                        .path("message").path("content")
                        .asText()
                );
    }
}
