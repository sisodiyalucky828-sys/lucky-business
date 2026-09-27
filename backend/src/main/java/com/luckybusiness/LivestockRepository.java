package com.luckybusiness;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LivestockRepository extends JpaRepository<Livestock, Long> {
    List<Livestock> findByStatusOrderByCreatedAtDesc(Livestock.Status status);
}
