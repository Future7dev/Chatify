package com.Backend.demo.repositories;

import com.Backend.demo.entity.GroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<GroupEntity,Long> {
}
