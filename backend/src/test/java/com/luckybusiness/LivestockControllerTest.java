package com.luckybusiness;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {
        "SPRING_DATASOURCE_URL=jdbc:h2:mem:livestock-test;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "SPRING_DATASOURCE_USERNAME=sa",
        "SPRING_DATASOURCE_PASSWORD=",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "ADMIN_KEY=test-admin-key",
        "ADMIN_PASSWORD=test-admin-password"
    }
)
class LivestockControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private LivestockRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void getAvailable_shouldReturnSavedListingsWithImageUrls() throws Exception {
        Livestock livestock = new Livestock();
        livestock.setTitle("Test Cow");
        livestock.setType("Cow");
        livestock.setBreed("HF");
        livestock.setMilkCapacityLiters(20.5);
        livestock.setAge(4);
        livestock.setPrice(85000L);
        livestock.setSellerName("Amit");
        livestock.setSellerPhone("9999999999");
        livestock.setLocation("Nashik");
        livestock.setImageUrls(java.util.List.of("/uploads/test.jpg"));
        repository.save(livestock);

        mockMvc.perform(get("/api/livestock"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].imageUrls[0]").value("/uploads/test.jpg"));
    }
}
