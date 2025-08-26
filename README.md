# SulaBET - Sistema de Apostas Esportivas

![SulaBET Logo](https://img.shields.io/badge/SulaBET-Sports%20Betting-green?style=for-the-badge)

Um sistema completo de apostas esportivas focado em futebol, desenvolvido com HTML, CSS e JavaScript. Interface limpa e profissional inspirada no design da Bet365.

## 🚀 Funcionalidades

### 🔐 Autenticação
- Sistema de login e registro
- Validação de dados
- Sessão persistente com localStorage

### ⚽ Apostas Esportivas
- Jogos de futebol brasileiro e internacional
- Odds dinâmicas e competitivas
- Cupom de apostas com cálculo automático

### 💰 Sistema Financeiro
- Carteira digital integrada
- Depósitos via PIX
- Saques via PIX
- Histórico de transações
- Validação de saldo em tempo real

### 📊 Histórico e Estatísticas
- Histórico completo de apostas
- Estatísticas do usuário
- Taxa de acerto
- Lucro/Prejuízo total
- Status das apostas (Pendente/Ganha/Perdida)

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização e responsividade
- **JavaScript ES6+** - Lógica de negócio
- **localStorage** - Persistência de dados
- **Responsive Design** - Compatível com mobile e desktop

## 📁 Estrutura do Projeto

\`\`\`
sulabet-system/
├── index.html         # Página de login/registro
├── dashboard.html     # Dashboard principal
├── style.css          # Estilos globais
├── script.js          # Lógica JavaScript
└── README.md          # Documentação
\`\`\`

## 🚀 Como Executar

### Método 1: Servidor Local
\`\`\`bash
# Clone ou baixe o projeto
# Navegue até a pasta do projeto

# Usando Python (se instalado)
python -m http.server 8000

# Usando Node.js (se instalado)
npx serve .

# Acesse: http://localhost:8000
\`\`\`

### Método 2: Abrir Diretamente
1. Baixe todos os arquivos
2. Abra o arquivo `index.html` no navegador
3. O sistema funcionará offline

**Ou crie uma nova conta:**
- Qualquer email válido
- Senha mínima de 6 caracteres
- Saldo inicial automático de R$ 100,00

## 🎮 Como Usar

### 1. Login/Registro
- Acesse `index.html`
- Use a conta demo ou crie uma nova conta
- Faça login para acessar o sistema

### 2. Navegação
- **Apostas:** Visualize jogos e faça apostas
- **Carteira:** Gerencie seu saldo
- **Histórico:** Veja suas apostas anteriores

### 3. Fazendo Apostas
1. Escolha um jogo na lista
2. Selecione o mercado desejado
3. A aposta aparecerá no cupom lateral
4. Defina o valor da aposta
5. Confirme a aposta

### 4. Gerenciando Carteira
1. Clique em "Carteira" no header
2. Escolha "Depositar" ou "Sacar"
3. Insira o valor e dados do PIX
4. Confirme a transação

## 🎨 Design

O sistema segue o padrão visual da Bet365 com:
- **Cores principais:** Verde (#1e7e34) e Amarelo (#ffc107)
- **Tipografia:** Fontes system-ui para melhor legibilidade
- **Layout responsivo:** Funciona em desktop, tablet e mobile
- **Interface intuitiva:** Navegação simples e clara

## 📱 Responsividade

- **Desktop:** Layout completo com sidebar
- **Tablet:** Layout adaptado com navegação otimizada
- **Mobile:** Interface compacta com menu hambúrguer

## 🔒 Segurança

- Validação de dados no frontend
- Sanitização de inputs
- Verificação de saldo antes das apostas
- Sessão segura com localStorage

## 📈 Dados de Exemplo

O sistema inclui:
- **20+ jogos** de futebol brasileiro e internacional
- **Múltiplos mercados** por jogo
- **Odds realistas** baseadas no mercado
- **Times reais** com logos e informações

## 🐛 Resolução de Problemas

### Problema: Dados não salvam
**Solução:** Verifique se o localStorage está habilitado no navegador

### Problema: Layout quebrado
**Solução:** Certifique-se de que todos os arquivos (HTML, CSS, JS) estão na mesma pasta

### Problema: Apostas não funcionam
**Solução:** Verifique se há saldo suficiente na conta

## 🤝 Contribuição

Este é um projeto educacional. Sugestões de melhorias são bem-vindas!

## 📄 Licença

Este projeto é para fins educacionais e demonstrativos.

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou verifique o código-fonte comentado.

---

**SulaBET** - Sua casa de apostas esportivas! ⚽💚
