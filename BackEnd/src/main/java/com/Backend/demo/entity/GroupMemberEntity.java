package com.Backend.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "group_members")
public class GroupMemberEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private long groupId;

    private String gmail;

    public GroupMemberEntity(){}

    public GroupMemberEntity(long groupId, String gmail) {
        this.groupId = groupId;
        this.gmail = gmail;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getGroupId() {
        return groupId;
    }

    public void setGroupId(long groupId) {
        this.groupId = groupId;
    }

    public String getGmail() {
        return gmail;
    }

    public void setGmail(String gmail) {
        this.gmail = gmail;
    }
}
