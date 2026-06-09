package com.bloodbank;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import java.security.Security;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class BloodBankApplication {

    // Registers Bouncy Castle before Hibernate or HikariCP tries to read the PEM file
    static {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(BloodBankApplication.class, args);
    }
}