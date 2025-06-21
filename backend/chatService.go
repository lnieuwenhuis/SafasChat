package main

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type ChatService struct {
	db *sql.DB
}

type Chat struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Model     string    `json:"model"`
	UserID    string    `json:"userId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Message struct {
	ID          int       `json:"id"`
	ChatID      int       `json:"chatId"`
	Content     string    `json:"content"`
	Role        string    `json:"role"`
	IsStreaming bool      `json:"isStreaming"`
	Reasoning   string    `json:"reasoning"`
	Timestamp   time.Time `json:"timestamp"`
	CreatedAt   time.Time `json:"createdAt"`
}

type CreateChatRequest struct {
	Title  string `json:"title"`
	Model  string `json:"model"`
	UserID string `json:"userId"`
}

type CreateMessageRequest struct {
	ChatID      int    `json:"chatId"`
	Content     string `json:"content"`
	Role        string `json:"role"`
	IsStreaming bool   `json:"isStreaming"`
	Reasoning   string `json:"reasoning"`
}

type UpdateMessageRequest struct {
	Content     *string `json:"content,omitempty"`
	IsStreaming *bool   `json:"isStreaming,omitempty"`
	Reasoning   *string `json:"reasoning,omitempty"`
}

func NewChatService(db *sql.DB) *ChatService {
	return &ChatService{db: db}
}

// Create a new chat
func (cs *ChatService) CreateChat(c *gin.Context) {
	var req CreateChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate required fields
	if req.Title == "" {
		req.Title = "New Chat"
	}
	if req.Model == "" {
		req.Model = "openai/gpt-4o"
	}
	if req.UserID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	now := time.Now()
	query := `INSERT INTO chats (title, model, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
	result, err := cs.db.Exec(query, req.Title, req.Model, req.UserID, now, now)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create chat"})
		return
	}

	chatID, err := result.LastInsertId()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get chat ID"})
		return
	}

	chat := Chat{
		ID:        int(chatID),
		Title:     req.Title,
		Model:     req.Model,
		UserID:    req.UserID,
		CreatedAt: now,
		UpdatedAt: now,
	}

	c.JSON(http.StatusCreated, chat)
}

// Get all chats for a user
func (cs *ChatService) GetChats(c *gin.Context) {
	userID := c.Query("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	query := `SELECT id, title, model, user_id, created_at, updated_at FROM chats WHERE user_id = ? ORDER BY updated_at DESC`
	rows, err := cs.db.Query(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch chats"})
		return
	}
	defer rows.Close()

	var chats []Chat
	for rows.Next() {
		var chat Chat
		err := rows.Scan(&chat.ID, &chat.Title, &chat.Model, &chat.UserID, &chat.CreatedAt, &chat.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan chat"})
			return
		}
		chats = append(chats, chat)
	}

	if chats == nil {
		chats = []Chat{}
	}

	c.JSON(http.StatusOK, chats)
}

// Get a specific chat
func (cs *ChatService) GetChat(c *gin.Context) {
	chatIDStr := c.Param("id")
	chatID, err := strconv.Atoi(chatIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
		return
	}

	query := `SELECT id, title, model, user_id, created_at, updated_at FROM chats WHERE id = ?`
	var chat Chat
	err = cs.db.QueryRow(query, chatID).Scan(&chat.ID, &chat.Title, &chat.Model, &chat.UserID, &chat.CreatedAt, &chat.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Chat not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch chat"})
		}
		return
	}

	c.JSON(http.StatusOK, chat)
}

// Update a chat
func (cs *ChatService) UpdateChat(c *gin.Context) {
	chatIDStr := c.Param("id")
	chatID, err := strconv.Atoi(chatIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
		return
	}

	var req struct {
		Title *string `json:"title,omitempty"`
		Model *string `json:"model,omitempty"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Build dynamic update query
	updateFields := []string{}
	args := []interface{}{}

	if req.Title != nil {
		updateFields = append(updateFields, "title = ?")
		args = append(args, *req.Title)
	}
	if req.Model != nil {
		updateFields = append(updateFields, "model = ?")
		args = append(args, *req.Model)
	}

	if len(updateFields) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields to update"})
		return
	}

	updateFields = append(updateFields, "updated_at = ?")
	args = append(args, time.Now())
	args = append(args, chatID)

	query := `UPDATE chats SET ` + updateFields[0]
	for i := 1; i < len(updateFields); i++ {
		query += ", " + updateFields[i]
	}
	query += " WHERE id = ?"

	_, err = cs.db.Exec(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update chat"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Chat updated successfully"})
}

// Delete a chat
func (cs *ChatService) DeleteChat(c *gin.Context) {
	chatIDStr := c.Param("id")
	chatID, err := strconv.Atoi(chatIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
		return
	}

	// Delete messages first (foreign key constraint)
	_, err = cs.db.Exec("DELETE FROM messages WHERE chat_id = ?", chatID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete messages"})
		return
	}

	// Delete chat
	_, err = cs.db.Exec("DELETE FROM chats WHERE id = ?", chatID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete chat"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Chat deleted successfully"})
}

// Create a new message
func (cs *ChatService) CreateMessage(c *gin.Context) {
	var req CreateMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate required fields
	if req.ChatID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Chat ID is required"})
		return
	}
	if req.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Content is required"})
		return
	}
	if req.Role == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Role is required"})
		return
	}

	now := time.Now()
	query := `INSERT INTO messages (chat_id, content, role, isStreaming, reasoning, timestamp, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
	result, err := cs.db.Exec(query, req.ChatID, req.Content, req.Role, req.IsStreaming, req.Reasoning, now, now)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create message"})
		return
	}

	messageID, err := result.LastInsertId()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get message ID"})
		return
	}

	message := Message{
		ID:          int(messageID),
		ChatID:      req.ChatID,
		Content:     req.Content,
		Role:        req.Role,
		IsStreaming: req.IsStreaming,
		Reasoning:   req.Reasoning,
		Timestamp:   now,
		CreatedAt:   now,
	}

	c.JSON(http.StatusCreated, message)
}

// Get messages for a chat
func (cs *ChatService) GetMessages(c *gin.Context) {
	chatIDStr := c.Param("id")  // Changed from "chatId" to "id"
	chatID, err := strconv.Atoi(chatIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid chat ID"})
		return
	}

	query := `SELECT id, chat_id, content, role, isStreaming, reasoning, timestamp, created_at FROM messages WHERE chat_id = ? ORDER BY timestamp ASC`
	rows, err := cs.db.Query(query, chatID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch messages"})
		return
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var message Message
		err := rows.Scan(&message.ID, &message.ChatID, &message.Content, &message.Role, &message.IsStreaming, &message.Reasoning, &message.Timestamp, &message.CreatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan message"})
			return
		}
		messages = append(messages, message)
	}

	if messages == nil {
		messages = []Message{}
	}

	c.JSON(http.StatusOK, messages)
}

// Update a message
func (cs *ChatService) UpdateMessage(c *gin.Context) {
	messageIDStr := c.Param("id")
	messageID, err := strconv.Atoi(messageIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message ID"})
		return
	}

	var req UpdateMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Build dynamic update query
	updateFields := []string{}
	args := []interface{}{}

	if req.Content != nil {
		updateFields = append(updateFields, "content = ?")
		args = append(args, *req.Content)
	}
	if req.IsStreaming != nil {
		updateFields = append(updateFields, "isStreaming = ?")
		args = append(args, *req.IsStreaming)
	}
	if req.Reasoning != nil {
		updateFields = append(updateFields, "reasoning = ?")
		args = append(args, *req.Reasoning)
	}

	if len(updateFields) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields to update"})
		return
	}

	args = append(args, messageID)

	query := `UPDATE messages SET ` + updateFields[0]
	for i := 1; i < len(updateFields); i++ {
		query += ", " + updateFields[i]
	}
	query += " WHERE id = ?"

	_, err = cs.db.Exec(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message updated successfully"})
}

type SyncRequest struct {
	Chat     Chat      `json:"chat"`
	Messages []Message `json:"messages"`
}

// Sync chat and messages from frontend to backend
func (cs *ChatService) SyncChatData(c *gin.Context) {
	var req SyncRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Start transaction
	tx, err := cs.db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}
	defer tx.Rollback()

	// Upsert chat (insert or update)
	chatQuery := `INSERT INTO chats (id, title, model, user_id, created_at, updated_at) 
					VALUES (?, ?, ?, ?, ?, ?) 
					ON DUPLICATE KEY UPDATE 
					title = VALUES(title), model = VALUES(model), updated_at = VALUES(updated_at)`
	
	_, err = tx.Exec(chatQuery, req.Chat.ID, req.Chat.Title, req.Chat.Model, 
		req.Chat.UserID, req.Chat.CreatedAt, req.Chat.UpdatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sync chat"})
		return
	}

	// Upsert messages
	for _, message := range req.Messages {
		msgQuery := `INSERT INTO messages (id, chat_id, content, role, isStreaming, reasoning, timestamp, created_at) 
					VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
					ON DUPLICATE KEY UPDATE 
					content = VALUES(content), role = VALUES(role), 
					isStreaming = VALUES(isStreaming), reasoning = VALUES(reasoning)`
		
		_, err = tx.Exec(msgQuery, message.ID, message.ChatID, message.Content, 
			message.Role, message.IsStreaming, message.Reasoning, 
			message.Timestamp, message.CreatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sync message"})
			return
		}
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Data synced successfully"})
}