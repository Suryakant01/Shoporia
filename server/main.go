package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func main() {
	ConnectDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	// Public routes
	r.POST("/users", CreateUser)
	r.POST("/users/login", Login)
	r.POST("/items", CreateItem)
	r.GET("/items", ListItems)

	// Admin routes
	r.GET("/users", ListUsers)
	r.GET("/carts", ListCarts)
	r.GET("/orders", ListOrders)

	// Protected routes
	authorized := r.Group("/")
	authorized.Use(AuthMiddleware())
	{
		authorized.POST("/carts", AddToCart)
		authorized.GET("/my-cart", GetUserCart)
		authorized.DELETE("/carts/items/:itemId", RemoveFromCart)
		authorized.POST("/orders", CreateOrder)
		authorized.GET("/my-orders", GetUserOrders)
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "i'm alive!"})
	})

	r.Run(":8080")
}
