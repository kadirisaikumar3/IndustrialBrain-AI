package com.industrialbrain.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.industrialbrain.backend.entity.Document;
import com.industrialbrain.backend.entity.User;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    // Get all documents of a user
    List<Document> findByUser(User user);

    // Get a specific document that belongs to a user
    Optional<Document> findByIdAndUser(Long id, User user);

}