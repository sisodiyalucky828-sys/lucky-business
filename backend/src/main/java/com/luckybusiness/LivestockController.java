package com.luckybusiness;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/livestock")
public class LivestockController {
    private final LivestockRepository repository;
    private final Path uploadDirectory;
    private final String adminKey;
    private final String adminPhone;
    private final String adminPassword;

    public LivestockController(LivestockRepository repository, @Value("${app.upload-dir:uploads}") String uploadDir, @Value("${app.admin.key}") String adminKey, @Value("${app.admin.phone}") String adminPhone, @Value("${app.admin.password}") String adminPassword) throws IOException {
        this.repository = repository;
        this.uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.adminKey = adminKey;
        this.adminPhone = adminPhone;
        this.adminPassword = adminPassword;
        Files.createDirectories(uploadDirectory);
    }

    @GetMapping
    public List<Livestock> getAvailable(@RequestParam(required = false) String search, @RequestParam(required = false) String type, @RequestParam(required = false) Double minMilk, @RequestParam(required = false) Long minPrice, @RequestParam(required = false) Long maxPrice) {
        return repository.findByStatusOrderByCreatedAtDesc(Livestock.Status.AVAILABLE).stream()
            .filter(item -> search == null || (item.getTitle() + " " + item.getBreed() + " " + item.getLocation()).toLowerCase().contains(search.toLowerCase()))
            .filter(item -> type == null || type.isBlank() || type.equalsIgnoreCase(item.getType()))
            .filter(item -> minMilk == null || item.getMilkCapacityLiters() >= minMilk)
            .filter(item -> minPrice == null || item.getPrice() >= minPrice)
            .filter(item -> maxPrice == null || item.getPrice() <= maxPrice).toList();
    }

    @GetMapping("/admin-check")
    public void checkAdmin(@RequestHeader(value = "X-Admin-Key", required = false) String key) {
        requireAdmin(key);
    }

    @PostMapping("/admin-login")
    public AdminLoginResponse login(@RequestBody AdminLoginRequest credentials) {
        if (credentials == null || !adminPhone.equals(credentials.phone()) || !adminPassword.equals(credentials.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin credentials");
        }
        return new AdminLoginResponse(adminKey);
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public Livestock upload(@RequestParam(value = "title", required = false) String title, @RequestParam("type") String type, @RequestParam("breed") String breed, @RequestParam("milkCapacityLiters") Double milkCapacityLiters, @RequestParam("age") Integer age, @RequestParam("price") Long price, @RequestParam("sellerName") String sellerName, @RequestParam("sellerPhone") String sellerPhone, @RequestParam("location") String location, @RequestParam(value = "description", required = false) String description, @RequestPart(value = "images", required = false) List<MultipartFile> images, @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        Livestock item = new Livestock(); item.setTitle(title != null && !title.isBlank() ? title : breed + " " + type); item.setType(type); item.setBreed(breed); item.setMilkCapacityLiters(milkCapacityLiters); item.setAge(age); item.setPrice(price); item.setSellerName(sellerName); item.setSellerPhone(sellerPhone); item.setLocation(location); item.setDescription(description);
        List<MultipartFile> files = images == null ? new ArrayList<>() : new ArrayList<>(images);
        if (files.isEmpty() && image != null) files.add(image);
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            String extension = file.getOriginalFilename() != null && file.getOriginalFilename().contains(".") ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.')) : ".jpg";
            String filename = UUID.randomUUID() + extension.toLowerCase();
            Files.copy(file.getInputStream(), uploadDirectory.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            imageUrls.add("/uploads/" + filename);
        }
        item.setImageUrls(imageUrls);
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public Livestock update(@PathVariable Long id, @RequestBody @Valid Livestock changes, @RequestHeader(value = "X-Admin-Key", required = false) String key) { requireAdmin(key); Livestock item = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)); item.setTitle(changes.getTitle()); item.setType(changes.getType()); item.setBreed(changes.getBreed()); item.setMilkCapacityLiters(changes.getMilkCapacityLiters()); item.setAge(changes.getAge()); item.setPrice(changes.getPrice()); item.setSellerName(changes.getSellerName()); item.setSellerPhone(changes.getSellerPhone()); item.setLocation(changes.getLocation()); item.setStatus(changes.getStatus()); return repository.save(item); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @RequestHeader(value = "X-Admin-Key", required = false) String key) { requireAdmin(key); repository.deleteById(id); }

    private void requireAdmin(String key) { if (!adminKey.equals(key)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin key required"); }

    public record AdminLoginRequest(String phone, String password) {}
    public record AdminLoginResponse(String adminKey) {}
}
