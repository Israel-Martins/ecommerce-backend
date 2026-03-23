class FreteController {
  static async calcular(req, res) {
    
    try {
      const response = await fetch("https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer  ${process.env.MELHOR_ENVIO_TOKEN}` // ← TOKEN NO .ENV
        },
        body: JSON.stringify(
          {
            from: {
              postal_code: "01001000" // <--- CEP DA SUA LOJA (Fixo no Back)
            },
            to: {
              postal_code: req.body.cep.replace(/\D/g, "") // Limpa o CEP vindo do front
            },
            products: req.body.products.map(p => ({
              id: String(p.id),
              width: Number(p.width),
              height: Number(p.height),
              length: Number(p.length),
              weight: Number(p.weight),
              insurance_value: Number(p.insurance_value),
              quantity: Number(p.quantity)
            }))
          }
        )
      });

      const fretes = await response.json();


      if (!response.ok) {
        return res.status(response.status).json(fretes);
      }

      res.json(fretes);
    } catch (error) {
      console.error("Erro no cálculo de frete:", error);
      res.status(500).json({
        erro: "Erro ao calcular frete",
        detalhes: error.message
      });
    }
  }
}

module.exports = FreteController;