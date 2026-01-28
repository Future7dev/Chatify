package com.Backend.demo.repositories;

import com.Backend.demo.entity.UserEntity;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Long> {
     Optional<UserEntity> findByGmail(String gmail);
}
