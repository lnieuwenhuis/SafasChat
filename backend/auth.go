package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type AuthService struct {
	db           *sql.DB
	googleConfig *oauth2.Config
}

type User struct {
	ID          string    `json:"id"`
	Email       string    `json:"email"`
	Name        string    `json:"name"`
	Image       *string   `json:"image"`
	DisplayName *string   `json:"displayName"`
	Avatar      *string   `json:"avatar"`
	CreatedAt   time.Time `json:"createdAt"`
	LastLoginAt time.Time `json:"lastLoginAt"`
}

type Session struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId"`
	ExpiresAt time.Time `json:"expiresAt"`
	CreatedAt time.Time `json:"createdAt"`
}

type GoogleUserInfo struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

func NewAuthService(db *sql.DB) *AuthService {
	googleConfig := &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  "http://localhost:3000/api/auth/callback/google",
		Scopes:       []string{"openid", "email", "profile"},
		Endpoint:     google.Endpoint,
	}

	return &AuthService{
		db:           db,
		googleConfig: googleConfig,
	}
}

func (a *AuthService) SignInSocial(c *gin.Context) {
	var req struct {
		Provider    string `json:"provider"`
		CallbackURL string `json:"callbackURL"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if req.Provider != "google" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported provider"})
		return
	}

	// Store callback URL in session/state
	state := uuid.New().String()
	url := a.googleConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)

	c.JSON(http.StatusOK, gin.H{
		"url": url,
	})
}

func (a *AuthService) GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No code provided"})
		return
	}

	// Exchange code for token
	token, err := a.googleConfig.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange token"})
		return
	}

	// Get user info from Google
	client := a.googleConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info"})
		return
	}
	defer resp.Body.Close()

	var googleUser GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode user info"})
		return
	}

	// Create or update user
	user, err := a.createOrUpdateUser(googleUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Create session
	session, err := a.createSession(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
		return
	}

	// Set session cookie
	c.SetCookie("session_id", session.ID, int(time.Hour*24*7/time.Second), "/", "localhost", false, true)

	// Redirect to frontend chats
	c.Redirect(http.StatusFound, "http://localhost:5173/chats")
}

func (a *AuthService) GetSession(c *gin.Context) {
	sessionID, err := c.Cookie("session_id")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"data": nil})
		return
	}

	user, err := a.getUserBySessionID(sessionID)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"data": nil})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"user": user,
			"session": gin.H{
				"id": sessionID,
			},
		},
	})
}

func (a *AuthService) SignOut(c *gin.Context) {
	sessionID, err := c.Cookie("session_id")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"success": true})
		return
	}

	// Delete session from database
	_, err = a.db.Exec("DELETE FROM sessions WHERE id = ?", sessionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete session"})
		return
	}

	// Clear cookie
	c.SetCookie("session_id", "", -1, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func (a *AuthService) createOrUpdateUser(googleUser GoogleUserInfo) (*User, error) {
	userID := uuid.New().String()
	now := time.Now()

	// Try to find existing user
	var existingUser User
	err := a.db.QueryRow(
		"SELECT id, email, name, image, display_name, avatar, created_at, last_login_at FROM users WHERE email = ?",
		googleUser.Email,
	).Scan(&existingUser.ID, &existingUser.Email, &existingUser.Name, &existingUser.Image, &existingUser.DisplayName, &existingUser.Avatar, &existingUser.CreatedAt, &existingUser.LastLoginAt)

	if err == sql.ErrNoRows {
		// Create new user
		_, err = a.db.Exec(
			"INSERT INTO users (id, email, name, image, display_name, avatar, created_at, last_login_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			userID, googleUser.Email, googleUser.Name, googleUser.Picture, googleUser.Name, googleUser.Picture, now, now,
		)
		if err != nil {
			return nil, err
		}

		return &User{
			ID:          userID,
			Email:       googleUser.Email,
			Name:        googleUser.Name,
			Image:       &googleUser.Picture,
			DisplayName: &googleUser.Name,
			Avatar:      &googleUser.Picture,
			CreatedAt:   now,
			LastLoginAt: now,
		}, nil
	} else if err != nil {
		return nil, err
	}

	// Update existing user's last login
	_, err = a.db.Exec("UPDATE users SET last_login_at = ? WHERE id = ?", now, existingUser.ID)
	if err != nil {
		return nil, err
	}

	existingUser.LastLoginAt = now
	return &existingUser, nil
}

func (a *AuthService) createSession(userID string) (*Session, error) {
	sessionID := uuid.New().String()
	expiresAt := time.Now().Add(time.Hour * 24 * 7) // 7 days
	now := time.Now()

	_, err := a.db.Exec(
		"INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
		sessionID, userID, expiresAt, now,
	)
	if err != nil {
		return nil, err
	}

	return &Session{
		ID:        sessionID,
		UserID:    userID,
		ExpiresAt: expiresAt,
		CreatedAt: now,
	}, nil
}

func (a *AuthService) getUserBySessionID(sessionID string) (*User, error) {
	var user User
	err := a.db.QueryRow(`
		SELECT u.id, u.email, u.name, u.image, u.display_name, u.avatar, u.created_at, u.last_login_at
		FROM users u
		JOIN sessions s ON u.id = s.user_id
		WHERE s.id = ? AND s.expires_at > NOW()
	`, sessionID).Scan(
		&user.ID, &user.Email, &user.Name, &user.Image, &user.DisplayName, &user.Avatar, &user.CreatedAt, &user.LastLoginAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}
