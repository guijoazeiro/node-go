package pdf

import (
	"fmt"
	"image"
	"image/color"
	"image/png"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/boombuler/barcode"
	"github.com/boombuler/barcode/code128"
	"github.com/google/uuid"
	"github.com/guijoazeiro/node-go/internal/models"
	"github.com/jung-kurt/gofpdf"
)

func convertTo8Bit(img image.Image) *image.NRGBA {
	bounds := img.Bounds()
	nrgba := image.NewNRGBA(bounds)
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			nrgba.Set(x, y, color.NRGBAModel.Convert(img.At(x, y)).(color.NRGBA))
		}
	}
	return nrgba
}

func generateBarcode(code string) (string, error) {
	barcodeFile := fmt.Sprintf("barcode_%s.png", code)

	bc, err := code128.Encode(code)
	if err != nil {
		return "", fmt.Errorf("erro ao gerar código de barras: %w", err)
	}

	scaledBC, err := barcode.Scale(bc, 475, 100)
	if err != nil {
		return "", fmt.Errorf("erro ao redimensionar código de barras: %w", err)
	}

	file, err := os.Create(barcodeFile)
	if err != nil {
		return "", fmt.Errorf("erro ao criar arquivo de código de barras: %w", err)
	}
	defer file.Close()

	convertedImage := convertTo8Bit(scaledBC)

	err = png.Encode(file, convertedImage)
	if err != nil {
		return "", fmt.Errorf("erro ao salvar código de barras: %w", err)
	}

	return barcodeFile, nil
}

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
	pdf.Cell(0, 10, fmt.Sprintf("Nome: %s", data.User.Name))
	pdf.Ln(6)
	pdf.Cell(0, 10, fmt.Sprintf("Endereço: %s", data.User.Address))
	pdf.Ln(6)
	pdf.Cell(0, 10, fmt.Sprintf("Telefone: %s", data.User.Phone))
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

	pdf.SetFont("Roboto", "B", 12)
	pdf.Cell(0, 10, "Resumo do Pagamento")
	pdf.Ln(6)
	pdf.SetFont("Roboto", "", 12)
	pdf.Ln(6)
	pdf.Cell(0, 10, fmt.Sprintf("Valor Total: R$ %s", data.Order.Total))
	pdf.Ln(6)
	pdf.Cell(0, 10, fmt.Sprintf("Data de Vencimento: %s", data.Order.CreatedAt.Format("2006-01-02")))
	pdf.Ln(12)

	rand.Seed(time.Now().UnixNano())
	uniqueCode := fmt.Sprintf("%s-%d", uuid.New().String(), rand.Intn(1000))

	barcodePath, err := generateBarcode(uniqueCode)
	if err != nil {
		log.Printf("Erro ao gerar código de barras: %v", err)
		return err
	}

	pdf.SetFont("Roboto", "B", 14)
	pdf.Cell(0, 10, "Código de Barras:")
	pdf.SetFont("Roboto", "", 12)
	pdf.Ln(12)
	pdf.Image(barcodePath, 50, pdf.GetY(), 120, 25, false, "", 0, "")

	output := fmt.Sprintf("boleto-%d.pdf", data.Order.ID)
	err = pdf.OutputFileAndClose(output)
	if err != nil {
		log.Printf("Erro ao gerar o PDF: %v", err)
		return err
	}

	err = os.Remove(barcodePath)
	if err != nil {
		log.Printf("Erro ao remover imagem do código de barras: %v", err)
	} else {
		log.Println("Imagem do código de barras removida com sucesso.")
	}

	log.Println("PDF do boleto gerado com sucesso!")
	return nil
}
