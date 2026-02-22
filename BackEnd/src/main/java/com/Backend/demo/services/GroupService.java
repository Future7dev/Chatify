package com.Backend.demo.services;

import com.Backend.demo.entity.GroupEntity;
import com.Backend.demo.entity.GroupMemberEntity;
import com.Backend.demo.repositories.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {

    @Autowired
    GroupRepository groupRepository;

    public GroupEntity findById(long id){
        return groupRepository.findById(id).get();
    }
    public GroupEntity save(GroupEntity groupEntity){
        return  groupRepository.save(groupEntity);
    }
    public List<GroupEntity> findAll(List<Long> ids){
        return groupRepository.findAllById(ids);
    }
}
