package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "openai")
public class OpenAiProperties {
    /** application.yml 에서 openai.api-key 에 대응 */
    private String apiKey;
    /** application.yml 에서 openai.endpoint 에 대응 */
    private String endpoint;
}
