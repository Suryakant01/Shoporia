package main

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"time"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// POST /users
func CreateUser(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := User{Username: input.Username, Password: hashedPassword}
	if result := DB.Create(&user); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully", "user": user})
}

// GET /users
func ListUsers(c *gin.Context) {
	var users []User
	DB.Find(&users)
	c.JSON(http.StatusOK, gin.H{"data": users})
}

// POST /users/login
func Login(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	if err := DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	if !CheckPasswordHash(input.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create token"})
		return
	}

	DB.Model(&user).Update("token", tokenString)

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

// POST /items
func CreateItem(c *gin.Context) {
	var input Item
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	DB.Create(&input)
	c.JSON(http.StatusCreated, gin.H{"data": input})
}

// GET /items
func ListItems(c *gin.Context) {
	var items []Item
	DB.Find(&items)
	c.JSON(http.StatusOK, gin.H{"data": items})
}

// POST /carts
func AddToCart(c *gin.Context) {
	userID, _ := c.Get("userId")

	var input struct {
		ItemID uint `json:"item_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find the user
	var user User
	DB.First(&user, userID)

	var cart Cart
	if user.CartID == nil {
		cart = Cart{UserID: user.ID, Status: "active"}
		DB.Create(&cart)
		DB.Model(&user).Update("CartID", cart.ID)
	} else {
		DB.First(&cart, *user.CartID)
	}

	var cartItem CartItem
	err := DB.Where("cart_id = ? AND item_id = ?", cart.ID, input.ItemID).First(&cartItem).Error

	if err == nil {
		cartItem.Quantity++
		DB.Save(&cartItem)
	} else {
		if err := DB.First(&Item{}, input.ItemID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Item not found"})
			return
		}
		newCartItem := CartItem{
			CartID:   cart.ID,
			ItemID:   input.ItemID,
			Quantity: 1,
		}
		DB.Create(&newCartItem)
	}

	var updatedCart Cart
	DB.Preload("Items.Item").First(&updatedCart, cart.ID)

	c.JSON(http.StatusOK, gin.H{"message": "Item added to cart", "cart": updatedCart})
}

// GET /carts (for a specific user, identified by token)
func GetUserCart(c *gin.Context) {
	userID, _ := c.Get("userId")

	var user User
	DB.First(&user, userID)

	if user.CartID == nil {
		c.JSON(http.StatusOK, gin.H{"message": "User does not have an active cart", "cart": nil})
		return
	}

	var cart Cart
	DB.Preload("Items.Item").First(&cart, *user.CartID)
	c.JSON(http.StatusOK, gin.H{"data": cart})
}

// GET /carts (lists all carts for admin purposes)
func ListCarts(c *gin.Context) {
	var carts []Cart
	DB.Preload("Items").Find(&carts)
	c.JSON(http.StatusOK, gin.H{"data": carts})
}

// POST /orders
func CreateOrder(c *gin.Context) {
	userID, _ := c.Get("userId")

	var user User
	DB.First(&user, userID)

	if user.CartID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User has no active cart to order"})
		return
	}

	cartID := *user.CartID

	// Create order from the cart
	order := Order{CartID: cartID, UserID: user.ID}
	if result := DB.Create(&order); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	DB.Model(&Cart{}).Where("id = ?", cartID).Update("status", "ordered")
	DB.Model(&user).Update("CartID", nil)

	c.JSON(http.StatusCreated, gin.H{"message": "Order created successfully", "order": order})
}

// GET /orders (for a specific user)
func GetUserOrders(c *gin.Context) {
	userID, _ := c.Get("userId")
	var orders []Order

	if err := DB.Preload("User").Preload("Cart.Items.Item").Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve orders"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orders})
}

// GET /orders (lists all orders for admin purposes)
func ListOrders(c *gin.Context) {
	var orders []Order
	DB.Find(&orders)
	c.JSON(http.StatusOK, gin.H{"data": orders})
}

func RemoveFromCart(c *gin.Context) {
	userID, _ := c.Get("userId")
	itemID := c.Param("itemId")

	// Find the user's active cart
	var user User
	if err := DB.First(&user, userID).Error; err != nil || user.CartID == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Active cart not found"})
		return
	}
	cartID := *user.CartID

	var cartItem CartItem
	if err := DB.Where("cart_id = ? AND item_id = ?", cartID, itemID).First(&cartItem).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found in cart"})
		return
	}

	if cartItem.Quantity > 1 {
		cartItem.Quantity--
		DB.Save(&cartItem)
	} else {
		DB.Delete(&cartItem)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item updated in cart"})
}
