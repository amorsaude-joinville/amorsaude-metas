// Script de INSPEÇÃO — não modifica nada. Conta documentos por mês.
// Uso no console (logada):
//   const s=document.createElement('script');s.src='./inspecao-lancamentos.js';document.head.appendChild(s);
// Depois:
//   await inspecionarLancamentos();

window.inspecionarLancamentos = async function() {
  const meses = ["2026-01","2026-02","2026-03","2026-04"];
  const resumo = [];

  for(const mes of meses) {
    const snap = await db.collection("lancamentos").where("mes_ano","==",mes).get();
    let semCaixa = 0, semCredito = 0, semValor = 0, comFP1 = 0, semFP1 = 0;
    let totalEntrada = 0, totalSaida = 0;

    snap.docs.forEach(d => {
      const x = d.data();
      if(x.tipo === "entrada") totalEntrada++;
      else if(x.tipo === "saida") totalSaida++;
      if(x.caixa   === undefined) semCaixa++;
      if(x.credito === undefined) semCredito++;
      if(x.valor   === undefined) semValor++;
      if(x.forma_pagamento_1)    comFP1++;
      else                        semFP1++;
    });

    resumo.push({
      mes, total: snap.size,
      entradas: totalEntrada, saidas: totalSaida,
      sem_caixa: semCaixa, sem_credito: semCredito, sem_valor: semValor,
      com_fp1: comFP1, sem_fp1: semFP1,
    });
  }

  console.table(resumo);
  console.log("Legenda:");
  console.log(" • sem_caixa/sem_credito/sem_valor: docs onde o campo está undefined");
  console.log(" • com_fp1: docs com forma_pagamento_1 (schema novo, criados via aba Orçamento)");
  console.log(" • sem_fp1: docs do schema legacy (criados via aba Lançamentos antiga ou histórico)");
  return resumo;
};

console.log("Script de inspeção carregado. Execute: await inspecionarLancamentos()");
