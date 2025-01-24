package pdf

import (
	"fmt"
	"log"

	"github.com/guijoazeiro/node-go/internal/models"
	"github.com/jung-kurt/gofpdf"
)

func GeneratePDF(data models.BoletoMessage) error {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)

	pdf.Cell(40, 10, "Boleto")
	pdf.Ln(12)

	pdf.SetFont("Arial", "", 12)
	pdf.Cell(40, 10, fmt.Sprintf("Order ID: %d", data.Order.ID))
	pdf.Ln(8)
	pdf.Cell(40, 10, fmt.Sprintf("Total: %s", data.Order.Total))
	pdf.Ln(8)

	pdf.Cell(40, 10, fmt.Sprintf("Nome: %s", data.User.Name))
	pdf.Ln(8)
	pdf.Cell(40, 10, fmt.Sprintf("Email: %s", data.User.Email))
	pdf.Ln(8)
	pdf.Cell(0, 10, fmt.Sprintf("Telefone: %s", data.User.Phone))
	pdf.Ln(8)
	pdf.Cell(0, 10, fmt.Sprintf("Endereço: %s", data.User.Address))
	pdf.Ln(8)

	for _, item := range data.Items {
		pdf.Cell(0, 10, fmt.Sprintf(
			"Produto ID: %d, Quantidade: %d, Preço Unitário: %.2f, Subtotal: %.2f",
			item.ProductID, item.Quantity, item.UnitPrice, item.Subtotal,
		))
		pdf.Ln(8)
	}

	output := fmt.Sprintf("boleto-%d.pdf", data.Order.ID)
	err := pdf.OutputFileAndClose(output)
	if err != nil {
		log.Printf("Erro ao gerar PDF: %v", err)
		return err
	}

	log.Printf("PDF gerado com sucesso: %s", output)
	return nil
}
