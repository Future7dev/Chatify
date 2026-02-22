package com.Backend.demo.services;

import com.Backend.demo.entity.GroupMemberEntity;
import com.Backend.demo.repositories.GroupMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupMemberService {
    @Autowired
    GroupMemberRepository groupMemberRepository;

    public List<GroupMemberEntity> getById(long id){
        return groupMemberRepository.findByGroupId(id);
    }
    public List<GroupMemberEntity> getByGmail(String gmail){
        return groupMemberRepository.findByGmail(gmail);
    }
    public GroupMemberEntity save(GroupMemberEntity groupMemberEntity){
        return groupMemberRepository.save(groupMemberEntity);
    }
}
