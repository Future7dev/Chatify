package com.Backend.demo.repositories;

import com.Backend.demo.entity.GroupMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMemberEntity,Long> {
    public List<GroupMemberEntity> findByGroupId(long groupId);
    public List<GroupMemberEntity> findByGmail(String gmail);
}
