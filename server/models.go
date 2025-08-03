package main

import (
	"time"
)

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Username  string    `gorm:"unique;not null" json:"username"`
	Password  string    `gorm:"not null" json:"-"`
	Token     string    `gorm:"unique" json:"-"`
	CartID    *uint     `json:"cart_id,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type Item struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}

type CartItem struct {
	CartID   uint `gorm:"primaryKey"`
	ItemID   uint `gorm:"primaryKey"`
	Quantity uint
	Item     Item `gorm:"foreignKey:ItemID"`
}

type Cart struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	UserID    uint       `gorm:"not null" json:"user_id"`
	User      User       `gorm:"foreignKey:UserID" json:"-"`
	Items     []CartItem `gorm:"foreignKey:CartID" json:"items"`
	Status    string     `json:"status"`
	CreatedAt time.Time  `json:"created_at"`
}

type Order struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CartID    uint      `gorm:"unique;not null" json:"cart_id"`
	Cart      Cart      `gorm:"foreignKey:CartID" json:"cart"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user"`
	CreatedAt time.Time `json:"created_at"`
}
