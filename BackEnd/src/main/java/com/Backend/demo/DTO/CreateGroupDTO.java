package com.Backend.demo.DTO;

import java.util.List;

public class CreateGroupDTO {
    String name;
    List<String> members;

    public CreateGroupDTO(){}

    public CreateGroupDTO(String name, List<String> members) {
        this.name = name;
        this.members = members;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }
}
