package com.example.demo.api.controller;

import com.example.demo.api.dto.NovelRequest;
import com.example.demo.service.OpenAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/novel")
@CrossOrigin(origins = "*")
public class NovelController {
    private final OpenAiService openAiService;

    public NovelController(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @PostMapping
    public Mono<ResponseEntity<String>> generateNovel(@RequestBody NovelRequest request) {
        List<String> words = request.getWords();

        return openAiService.generateNovel(words)
                .map(ResponseEntity::ok)

                // 429 에러(Too Many Requests)일 때만 별도 처리
                .onErrorResume(WebClientResponseException.TooManyRequests.class, ex ->
                        Mono.just(ResponseEntity
                                .status(429)
                                .body("요청량이 많습니다. 잠시 후 다시 시도해 주세요."))
                )

                // 그 외 모든 오류는 500 처리
                .onErrorResume(ex ->
                        Mono.just(ResponseEntity
                                .status(500)
                                .body("소설 생성 중 오류가 발생했습니다."))
                );
    }
}
