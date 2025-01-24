package config

import (
	"log"
	"os"

	"github.com/streadway/amqp"
)

func ConnectRabbitMq() (*amqp.Connection, *amqp.Channel) {
	conn, err := amqp.Dial(os.Getenv("RABBITMQ_URL"))
	if err != nil {
		log.Fatalf("Erro ao conectar ao RabbitMQ: %v", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Erro ao abrir o canal do RabbitMQ: %v", err)
	}

	return conn, ch
}
