package main

import (
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func ConnectDatabase() {
	database, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database!", err)
	}

	err = database.AutoMigrate(&User{}, &Item{}, &Cart{}, &Order{}, &CartItem{})
	if err != nil {
		log.Fatal("Failed to migrate database!", err)
	}

	DB = database
}
