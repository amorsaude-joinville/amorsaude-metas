// SCRIPT DE LIMPEZA — usar apenas uma vez via console
// Carregar via: const s=document.createElement('script');s.src='./limpeza-temp.js';document.head.appendChild(s);

async function limparAbril2026() {
  if (!confirm('⚠️ Vai APAGAR os 16 dias de ABRIL/2026 da coleção faturamentoDiario. Tem certeza?')) return;
  if (!confirm('Última confirmação: APAGAR DEFINITIVAMENTE abril/2026?')) return;

  const docs = await db.collection('faturamentoDiario')
    .where('mes', '==', 4)
    .where('ano', '==', 2026)
    .get();

  console.log(`Encontrados ${docs.size} documentos de abril/2026`);
  const batch = db.batch();
  docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
  console.log('✅ Abril/2026 apagado de faturamentoDiario');
}

async function limparTodosLancamentos() {
  if (!confirm('⚠️ Vai APAGAR TODOS os lançamentos de TODAS as recepcionistas/callcenter de TODOS os meses. Tem certeza?')) return;
  if (!confirm('Última confirmação: APAGAR DEFINITIVAMENTE todos os lançamentos individuais?')) return;
  if (!confirm('TERCEIRA confirmação: você está apagando dados que não voltam mais. Confirma?')) return;

  const docs = await db.collection('lancamentos').get();
  console.log(`Encontrados ${docs.size} lançamentos no total`);

  // Firestore batch suporta até 500 ops, dividir em lotes
  const ops = docs.docs;
  for (let i = 0; i < ops.length; i += 400) {
    const batch = db.batch();
    ops.slice(i, i + 400).forEach(d => batch.delete(d.ref));
    await batch.commit();
    console.log(`Lote ${Math.floor(i/400) + 1} apagado (${Math.min(i + 400, ops.length)} de ${ops.length})`);
  }
  console.log('✅ Todos os lançamentos apagados');
}

console.log('Funções carregadas:');
console.log('- limparAbril2026()  → apaga só abril/2026 do faturamentoDiario');
console.log('- limparTodosLancamentos()  → apaga TODOS os lançamentos individuais');
console.log('Execute uma de cada vez no console quando quiser.');
