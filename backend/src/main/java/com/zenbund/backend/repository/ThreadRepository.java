package com.zenbund.backend.repository;

import com.zenbund.backend.entity.Thread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ThreadRepository extends JpaRepository<Thread, Long> {

    /**
     * Find a thread by its name.
     * Used for checking uniqueness or searching threads by name.
     *
     * @param name the thread name
     * @return an Optional containing the thread if found
     */
    Optional<Thread> findByName(String name);
}
