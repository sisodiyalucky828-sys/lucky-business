package com.luckybusiness;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class LivestockControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private LivestockRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
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
