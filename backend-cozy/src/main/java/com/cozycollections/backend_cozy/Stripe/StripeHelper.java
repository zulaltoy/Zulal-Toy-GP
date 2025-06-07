package com.cozycollections.backend_cozy.Stripe;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component // This class is defined as a Spring Component, which means that Spring automatically recognizes and manages this class when the application starts.
public class StripeHelper {
    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct  //This annotation ensures that a method is executed immediately after the bean is created. So when an object of this class is created, init() runs automatically.
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }
}
