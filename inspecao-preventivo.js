// Script de INSPEÇÃO — não modifica nada. Conta lançamentos com Preventivo em Maio/2026.
// Uso no console (logada na app):
//   const s=document.createElement('script');s.src='./inspecao-preventivo.js';document.head.appendChild(s);
// Depois:
//   await inspecionarPreventivos();

window.inspecionarPreventivos = async function() {
  const MES_ANO = "2026-05";
  const DT_INI  = new Date("2026-05-01T00:00:00");
  const DT_FIM  = new Date("2026-05-31T23:59:59");

  console.log(`[inspeção] Buscando lançamentos de ${MES_ANO}...`);
  const snap = await db.collection("lancamentos").where("mes_ano","==",MES_ANO).get();
  console.log(`[inspeção] ${snap.size} docs no mês — filtrando por Preventivo + intervalo + ehDocPago...`);

  // Filtra: pago, não excluído, dentro do intervalo de Maio, e com algum procedimento "Preventivo".
  const docs = [];
  snap.forEach(d => {
    const l = { id: d.id, ...d.data() };
    if(l.excluido === true) return;
    // Replica a lógica de ehDocPago (entrada com status pago, ou legacy sem status)
    if(l.tipo === "saida") return; // não interessa nesta análise
    const status = l.status || "pago";
    if(status !== "pago") return;

    // Intervalo de data
    const ts = l.data_hora;
    const dt = ts?.toDate ? ts.toDate() : (ts ? new Date(ts) : null);
    if(!dt || dt < DT_INI || dt > DT_FIM) return;

    // Tem Preventivo? (case-insensitive, valor > 0)
    const procs = Array.isArray(l.procedimentos) ? l.procedimentos : [];
    const preventivos = procs.filter(p => {
      const tipo = (p?.tipo || "").toString().toLowerCase().trim();
      return tipo === "preventivo" && (Number(p?.valor) || 0) > 0;
    });
    if(preventivos.length === 0) return;

    docs.push({ l, dt, preventivos });
  });

  // Estatísticas
  const total = docs.length;
  let valorTotalPreventivo = 0;
  let puros = 0, mistos = 0;
  const exemplos = [];

  docs.forEach(({ l, dt, preventivos }) => {
    const valorPrev = preventivos.reduce((s,p) => s + (Number(p.valor) || 0), 0);
    valorTotalPreventivo += valorPrev;

    const lab        = Number(l.laboratorio) || 0;
    const img        = Number(l.imagem)      || 0;
    const consultas  = Number(l.consultas)   || 0;
    const outrosProc = (l.procedimentos || [])
      .filter(p => (p?.tipo || "").toString().toLowerCase().trim() !== "preventivo")
      .reduce((s,p) => s + (Number(p.valor) || 0), 0);

    // "Puro" = SÓ tem o(s) preventivo(s); zero em todas as outras categorias
    const ehPuro = lab === 0 && img === 0 && consultas === 0 && outrosProc === 0;
    if(ehPuro) puros++; else mistos++;

    if(exemplos.length < 10) {
      exemplos.push({
        data: `${String(dt.getDate()).padStart(2,"0")}/${String(dt.getMonth()+1).padStart(2,"0")} ${String(dt.getHours()).padStart(2,"0")}:${String(dt.getMinutes()).padStart(2,"0")}`,
        paciente: l.paciente_nome || "—",
        recepcionista: l.usuario_nome || "—",
        laboratorio: lab,
        imagem: img,
        consultas: consultas,
        outros_procedimentos: outrosProc,
        valor_preventivo: valorPrev,
        valor_total_doc: Number(l.valor) || 0,
        tipo_misto_ou_puro: ehPuro ? "puro" : "misto",
      });
    }
  });

  // Output
  console.log("");
  console.log("═══════════════════════════════════════════════");
  console.log("  📊 PREVENTIVOS — Maio/2026");
  console.log("═══════════════════════════════════════════════");
  console.log(`  Total de lançamentos com Preventivo:  ${total}`);
  console.log(`  Valor total dos Preventivos:          R$ ${valorTotalPreventivo.toLocaleString("pt-BR", {minimumFractionDigits:2})}`);
  console.log(`  PUROS  (só Preventivo, nada mais):    ${puros}`);
  console.log(`  MISTOS (Preventivo + outras):         ${mistos}`);
  console.log("═══════════════════════════════════════════════");
  console.log("");
  console.log("📋 Até 10 exemplos:");
  console.table(exemplos);

  return { total, valorTotalPreventivo, puros, mistos, exemplos };
};

console.log("Script de inspeção Preventivo carregado. Execute: await inspecionarPreventivos()");
