# Instruções — Amor Saúde Metas

---

## 1. Criar o projeto Firebase (gratuito)

1. Acesse https://console.firebase.google.com
2. Clique em **"Adicionar projeto"**
3. Nome: `amorsaude-metas` → Próximo → desative Google Analytics (opcional) → **Criar projeto**
4. No menu lateral, clique em **Firestore Database** → **Criar banco de dados**
   - Escolha **"Iniciar no modo de teste"** (permite leitura/gravação por 30 dias — depois configure as regras)
   - Região: `southamerica-east1` (São Paulo) → **Ativar**

---

## 2. Copiar as credenciais Firebase

1. No console Firebase, clique na engrenagem ⚙️ → **Configurações do projeto**
2. Role até **"Seus aplicativos"** → clique em **`</>`** (Web)
3. Apelido: `metas-web` → **Registrar app**
4. Copie o bloco `firebaseConfig` que aparecer, por exemplo:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "amorsaude-metas.firebaseapp.com",
     projectId: "amorsaude-metas",
     storageBucket: "amorsaude-metas.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

---

## 3. Colar as credenciais no index.html

Abra o arquivo `index.html` num editor de texto (Notepad, VS Code, etc.).

Localize este trecho no início do `<script>` (linha ~270):

```js
const firebaseConfig = {
  apiKey:            "COLE_SUA_API_KEY_AQUI",
  authDomain:        "SEU_PROJETO.firebaseapp.com",
  projectId:         "SEU_PROJETO_ID",
  ...
};
```

Substitua pelos seus dados reais copiados no passo anterior. Salve o arquivo.

---

## 4. Configurar regras do Firestore (segurança básica)

No console Firebase → Firestore → aba **Regras**, cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ Isso permite acesso aberto (adequado para uso interno da clínica). Para produção com mais segurança, adicione autenticação numa sessão futura.

---

## 5. Criar índice no Firestore (necessário para o filtro do listener)

Ao abrir o app pela primeira vez, o console do navegador (F12) pode mostrar um erro com link para criar um índice composto. Clique nesse link e confirme.

O índice necessário é:
- Coleção: `lancamentos`
- Campos: `usuario_nome` (Crescente) + `mes_ano` (Crescente) + `data_hora` (Decrescente)

---

## 6. Publicar no GitHub Pages

### Passo a passo:

1. **Crie uma conta** em https://github.com (se ainda não tiver)

2. **Crie um repositório novo**:
   - Clique em **"New repository"**
   - Nome: `amorsaude-metas`
   - Deixe como **Public**
   - Clique em **"Create repository"**

3. **Faça o upload do arquivo**:
   - Na página do repositório, clique em **"uploading an existing file"**
   - Arraste o arquivo `index.html` para a área de upload
   - Clique em **"Commit changes"**

4. **Ative o GitHub Pages**:
   - Vá em **Settings** (aba do repositório)
   - No menu lateral, clique em **Pages**
   - Em "Source", selecione **Deploy from a branch**
   - Branch: **main** | Pasta: **/ (root)**
   - Clique em **Save**

5. **Aguarde ~2 minutos** e acesse o link que aparecer:
   ```
   https://SEU_USUARIO.github.io/amorsaude-metas/
   ```

---

## 7. Testando o sistema

| Usuária  | Perfil        | Senha     |
|----------|---------------|-----------|
| Eduarda  | Gestora       | amor2026  |
| Dara     | Líder         | amor2026  |
| Bianca   | Líder         | amor2026  |
| Dawilla  | Recepcionista | amor2026  |
| Suélen   | Recepcionista | amor2026  |
| Graziele | Recepcionista | amor2026  |
| Thamyres | Recepcionista | amor2026  |
| Tuane    | Recepcionista | amor2026  |
| Raiane   | Recepcionista | amor2026  |
| Erielly  | Call Center   | amor2026  |
| Júlia    | Call Center   | amor2026  |

---

## Próximas sessões (o que falta construir)

- [ ] **Dashboard da Gestora/Líder** — visão consolidada de todas as colaboradoras, gráficos, totais por produto/prescritor
- [ ] **Ranking completo** — tabela com todas as posições visível para gestora/líder
- [ ] **Configuração de metas** — tela para a gestora definir meta_caixa_recepcao, meta_credito_recepcao, meta_caixa_callcenter, dias_uteis por mês
- [ ] **Autenticação Firebase** — substituir login simples por autenticação real
- [ ] **Filtros e relatórios** — filtrar lançamentos por período, exportar para Excel
- [ ] **Histórico de meses anteriores** — navegação entre meses
