package com.luckybusiness;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "livestock")
public class Livestock {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank private String title;
    @NotBlank private String type;
    @NotBlank private String breed;
    @Column(name = "milk_capacity_liters") @JsonProperty("milkCapacityLiters") @PositiveOrZero private Double milkCapacityLiters;
    @PositiveOrZero private Integer age;
    @PositiveOrZero private Long price;
    @Column(name = "seller_name") private String sellerName;
    @Column(name = "seller_phone") private String sellerPhone;
    private String location;
    @Column(length = 1000) private String description;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "livestock_images", joinColumns = @JoinColumn(name = "livestock_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();
    @Enumerated(EnumType.STRING) private Status status = Status.AVAILABLE;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();

    public enum Status { AVAILABLE, SOLD }
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getTitle(){return title;} public void setTitle(String v){title=v;}
    public String getType(){return type;} public void setType(String v){type=v;}
    public String getBreed(){return breed;} public void setBreed(String v){breed=v;}
    public Double getMilkCapacityLiters(){return milkCapacityLiters;} public void setMilkCapacityLiters(Double v){milkCapacityLiters=v;}
    public Integer getAge(){return age;} public void setAge(Integer v){age=v;}
    public Long getPrice(){return price;} public void setPrice(Long v){price=v;}
    public String getSellerName(){return sellerName;} public void setSellerName(String v){sellerName=v;}
    public String getSellerPhone(){return sellerPhone;} public void setSellerPhone(String v){sellerPhone=v;}
    public String getLocation(){return location;} public void setLocation(String v){location=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public List<String> getImageUrls(){return imageUrls;} public void setImageUrls(List<String> v){imageUrls=v;}
    public Status getStatus(){return status;} public void setStatus(Status v){status=v;}
    public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
}
