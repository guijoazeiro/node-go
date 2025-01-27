package pdf

import (
	"fmt"
	"log"

	"github.com/guijoazeiro/node-go/internal/models"
	"github.com/jung-kurt/gofpdf"
)

func GenerateBoletoPDF(data *models.BoletoMessage) error {
	pdf := gofpdf.New("P", "mm", "A4", "")

	pdf.AddUTF8Font("Roboto", "", "./fonts/Roboto.ttf")
	pdf.AddUTF8Font("Roboto", "B", "./fonts/Roboto-Bold.ttf")
	pdf.SetFont("Roboto", "", 12)

	pdf.AddPage()

	pdf.SetXY(50, 10)
	pdf.Cell(0, 10, "Banco XYZ - 1234")
	pdf.Ln(10)
	pdf.SetFont("Roboto", "B", 14)
	pdf.Cell(0, 10, "Boleto de Cobrança")
	pdf.Ln(15)

	pdf.SetFont("Roboto", "", 12)
	pdf.Cell(0, 10, "Beneficiário: Empresa Exemplo S.A.")
	pdf.Ln(6)
	pdf.Cell(0, 10, "CNPJ: 12.345.678/0001-99")
	pdf.Ln(6)
	pdf.Cell(0, 10, "Agência/Código Beneficiário: 1234 / 56789-0")
	pdf.Ln(12)

	pdf.SetFont("Roboto", "B", 12)
	pdf.Cell(0, 10, "Dados do Pagador")
	pdf.Ln(6)
	pdf.SetFont("Roboto", "", 12)
	pdf.Cell(0, 10, fmt.Sprintf("Nome: %s", data.User.Name))
	pdf.Ln(6)
	pdf.Cell(0, 10, fmt.Sprintf("Endereço: %s", data.User.Address))
	pdf.Ln(6)
	pdf.Cell(0, 10, fmt.Sprintf("Telefone: %s", data.User.Phone))
	pdf.Ln(12)

	pdf.SetFont("Roboto", "B", 12)
	pdf.Cell(0, 10, "Resumo do Pagamento")
	pdf.Ln(6)
	pdf.SetFont("Roboto", "", 12)
	pdf.Cell(0, 10, fmt.Sprintf("Número do Boleto: %d", data.Order.ID))
	pdf.Ln(6)
	pdf.Cell(0, 10, fmt.Sprintf("Valor Total: R$ %s", data.Order.Total))
	pdf.Ln(6)
	pdf.Cell(0, 10, fmt.Sprintf("Data de Vencimento: %s", data.Order.CreatedAt.Format("2006-01-02")))
	pdf.Ln(12)

	pdf.SetFont("Roboto", "B", 12)
	pdf.Cell(0, 10, "Itens do Pedido")
	pdf.Ln(6)
	pdf.SetFont("Roboto", "", 12)
	for _, item := range data.Items {
		pdf.Cell(0, 10, fmt.Sprintf(
			"Produto ID: %d | Qtd: %d | Unitário: R$ %.2f | Subtotal: R$ %.2f",
			item.ProductID, item.Quantity, item.UnitPrice, item.Subtotal,
		))

		pdf.Ln(6)
	}
	pdf.Ln(12)

	pdf.SetFont("Roboto", "B", 14)
	pdf.Cell(0, 10, "Código de Barras:")
	pdf.Ln(12)
	pdf.SetFont("Courier", "", 12)
	pdf.Cell(0, 10, "34191.79001 01043.510047 91020.150008 7 12340000045000") // Simulado
	pdf.Ln(12)

	err := pdf.OutputFileAndClose("boleto.pdf")
	if err != nil {
		log.Printf("Erro ao gerar o PDF: %v", err)
		return err
	}

	log.Println("PDF do boleto gerado com sucesso!")
	return nil
}
