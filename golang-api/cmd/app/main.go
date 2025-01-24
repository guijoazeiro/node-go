package main

import (
	"log"
	"os"

	"github.com/guijoazeiro/node-go/internal/config"
	"github.com/guijoazeiro/node-go/internal/rabbitmq"
)

func main() {
	os.Setenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")

	conn, ch := config.ConnectRabbitMq()
	defer conn.Close()
	defer ch.Close()

	log.Println("Consumindo mensagens...")
	rabbitmq.ConsumeMessages(ch)
}
