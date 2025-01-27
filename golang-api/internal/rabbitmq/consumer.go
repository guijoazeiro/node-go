package rabbitmq

import (
	"encoding/json"
	"log"

	"github.com/guijoazeiro/node-go/internal/models"
	"github.com/guijoazeiro/node-go/internal/pdf"
	"github.com/streadway/amqp"
)

func ConsumeMessages(ch *amqp.Channel) {
	q, err := ch.QueueDeclare("order", true, false, false, false, nil)
	if err != nil {
		log.Fatalf("Erro ao declarar a fila: %v", err)
	}

	msgs, err := ch.Consume(q.Name, "", true, false, false, false, nil)
	if err != nil {
		log.Fatalf("Erro ao consumir mensagens: %v", err)
	}

	for msg := range msgs {
		log.Printf("Mensagem recebida: %s", string(msg.Body))
		var boletoMessage models.BoletoMessage
		if err := json.Unmarshal(msg.Body, &boletoMessage); err != nil {
			log.Printf("Erro ao deserializar a mensagem: %v", err)
			continue
		}

		if err := pdf.GenerateBoletoPDF(&boletoMessage); err != nil {
			log.Printf("Erro ao gerar o PDF: %v", err)
		}
	}
}
