package com.Backend.demo.controller;

import com.Backend.demo.DTO.CreateGroupDTO;
import com.Backend.demo.entity.GroupEntity;
import com.Backend.demo.entity.GroupMemberEntity;
import com.Backend.demo.entity.MessageEntity;
import com.Backend.demo.services.GroupMemberService;
import com.Backend.demo.services.GroupService;
import com.Backend.demo.services.MessageService;
import org.checkerframework.checker.nullness.qual.EnsuresKeyFor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/group")
public class GroupController {
    @Autowired
    GroupMemberService groupMemberService;
    @Autowired
    GroupService groupService;
    @Autowired
    MessageService messageService;

    @PostMapping("/create")
    public GroupEntity createGroup(@RequestBody CreateGroupDTO dto , Principal principal){
        GroupEntity groupEntity=new GroupEntity(dto.getName(), principal.getName());
        groupService.save(groupEntity);
        for(String s: dto.getMembers()){
            GroupMemberEntity memberEntity=new GroupMemberEntity();
            memberEntity.setGroupId(groupEntity.getId());
            memberEntity.setGmail(s);
            groupMemberService.save(memberEntity);

        }
        return groupEntity;
    }
    @GetMapping
    public List<GroupEntity> findGroups(Principal principal){
        List<GroupMemberEntity> memberEntities=groupMemberService.getByGmail(principal.getName());
        List<Long> groupsId=new ArrayList<>();
        for(GroupMemberEntity entity:memberEntities){
            groupsId.add(entity.getGroupId());
        }
        return groupService.findAll(groupsId);
    }
    @GetMapping("/messages/{groupId}")
    public List<MessageEntity> getGroupMessages(@PathVariable long groupId){
        return messageService.getGroupMessages(groupId);
    }


}
