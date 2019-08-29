package org.greatpisces.support;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@EnableWebMvc
public class SupportApplication {
    public static void main(String...args) {
        SpringApplication.run(SupportApplication.class, args);
    }
}
