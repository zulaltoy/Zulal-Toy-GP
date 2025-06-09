package com.cozycollections.backend_cozy.data;

import com.cozycollections.backend_cozy.model.Role;
import com.cozycollections.backend_cozy.model.User;
import com.cozycollections.backend_cozy.repository.RoleRepository;
import com.cozycollections.backend_cozy.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Component
@Transactional
@RequiredArgsConstructor
public class RoleInitializer implements ApplicationListener<ApplicationReadyEvent> {
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent){
        seedRoles();
        seedAdminUser();

    }

    private void seedRoles() {
        Set<String> roles = Set.of("ROLE_ADMIN", "ROLE_USER");

        for (String roleName : roles) {
            if(roleRepository.findByName(roleName) == null) {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            }
        }
    }

    private void seedAdminUser() {
        String adminEmail = "admin@cozycollections.com";

        if(userRepository.existsByEmail(adminEmail)) {
            return;

        }
        Role adminRole = roleRepository.findByName("ROLE_ADMIN");
        if(adminRole == null) {
            throw new EntityNotFoundException("Role admin not found");

        }

        User admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("Cozy");
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setRoles(Set.of(adminRole));
        userRepository.save(admin);
    }
}
