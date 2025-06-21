package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("No .env file found")
	}

	// Initialize database
	db, err := InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Initialize services
	authService := NewAuthService(db)
	chatService := NewChatService(db)

	// Setup Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "Cookie"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Auth routes
	auth := r.Group("/api/auth")
	{
		auth.GET("/session", authService.GetSession)
		auth.POST("/sign-in/social", authService.SignInSocial)
		auth.GET("/callback/google", authService.GoogleCallback)
		auth.POST("/sign-out", authService.SignOut)
	}

	// Chat routes
	api := r.Group("/api")
	{
		// Chat endpoints
		api.POST("/chats", chatService.CreateChat)
		api.GET("/chats", chatService.GetChats)
		api.GET("/chats/:id", chatService.GetChat)
		api.PUT("/chats/:id", chatService.UpdateChat)
		api.DELETE("/chats/:id", chatService.DeleteChat)
		api.GET("/chats/:id/messages", chatService.GetMessages)

		// Message endpoints
		api.POST("/messages", chatService.CreateMessage)
		api.PUT("/messages/:id", chatService.UpdateMessage)
		
		// Sync endpoint
		api.POST("/sync", chatService.SyncChatData)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}