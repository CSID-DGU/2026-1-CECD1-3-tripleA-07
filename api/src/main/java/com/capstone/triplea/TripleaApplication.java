package com.capstone.triplea;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class TripleaApplication {

    public static void main(String[] args) {
        SpringApplication.run(TripleaApplication.class, args);
    }

}
