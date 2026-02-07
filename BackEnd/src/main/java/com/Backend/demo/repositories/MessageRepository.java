package com.Backend.demo.repositories;

import com.Backend.demo.entity.MessageEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity,Long> {

    @Query("""
        SELECT m FROM MessageEntity m
        WHERE (m.sender = :user1 AND m.receiver = :user2)
           OR (m.sender = :user2 AND m.receiver = :user1)
        ORDER BY m.timeStamp
    """)
    public List<MessageEntity> findChatHistory(
            @Param("user1") String user1,
            @Param("user2") String user2
    );
    @Query("""
        SELECT m FROM MessageEntity m
        WHERE (m.sender = :user OR m.receiver = :user)
        ORDER BY m.timeStamp
    """)
    public List<MessageEntity>  findContacts(@Param("user") String user);
    @Transactional
    @Modifying
    @Query("""
    UPDATE MessageEntity m
    SET m.isRead = true
    WHERE m.sender = :sender
    AND m.receiver = :receiver
    AND m.isRead = false
    """)
    public void markAsRead(String sender,String receiver);

    @Query("""
    SELECT m.sender, COUNT(m)
    FROM MessageEntity m
    WHERE m.receiver = :me
    AND m.isRead = false
    GROUP BY m.sender
    """)
    public List<Object[]> getUnread(String me);

    @Query("""
    SELECT m
    FROM MessageEntity m
    WHERE m.receiver = :me OR m.sender = :me
    ORDER BY m.timeStamp DESC
    """)
    public List<MessageEntity> getLastMessages(String me);

}
