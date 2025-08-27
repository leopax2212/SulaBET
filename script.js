// Estado da aplicação
let isLoginMode = true
let currentUser = null
let selectedBets = []
const matches = []

// Dados dos jogos
const matchesData = [
  {
    id: 1,
    homeTeam: "Flamengo",
    awayTeam: "Palmeiras",
    time: "Hoje 16:00",
    league: "Brasileirão",
    odds: {
      1: { label: "Flamengo", value: 2.1 },
      X: { label: "Empate", value: 3.2 },
      2: { label: "Palmeiras", value: 3.5 },
      "Over 2.5": { label: "Mais de 2.5 gols", value: 1.85 },
      "Under 2.5": { label: "Menos de 2.5 gols", value: 1.95 },
    },
  },
  {
    id: 2,
    homeTeam: "São Paulo",
    awayTeam: "Corinthians",
    time: "Hoje 18:30",
    league: "Brasileirão",
    odds: {
      1: { label: "São Paulo", value: 2.4 },
      X: { label: "Empate", value: 3.1 },
      2: { label: "Corinthians", value: 2.9 },
      "Over 2.5": { label: "Mais de 2.5 gols", value: 1.9 },
      "Under 2.5": { label: "Menos de 2.5 gols", value: 1.85 },
    },
  },
  {
    id: 3,
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    time: "Amanhã 16:00",
    league: "La Liga",
    odds: {
      1: { label: "Real Madrid", value: 2.2 },
      X: { label: "Empate", value: 3.4 },
      2: { label: "Barcelona", value: 3.1 },
      "Over 2.5": { label: "Mais de 2.5 gols", value: 1.75 },
      "Under 2.5": { label: "Menos de 2.5 gols", value: 2.05 },
    },
  },
]

// ===== FUNÇÕES DA PÁGINA DE LOGIN =====

// Inicializar dados demo se não existirem
function initializeDemoData() {
  const users = JSON.parse(localStorage.getItem("sulabet_users") || "[]")
  const demoUser = users.find((user) => user.email === "demo@sulabet.com")

  if (!demoUser) {
    users.push({
      email: "demo@sulabet.com",
      password: "123456",
      balance: 100,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem("sulabet_users", JSON.stringify(users))
  }
}

// Alternar entre login e registro
function toggleMode() {
  isLoginMode = !isLoginMode

  const registerFields = document.getElementById("registerFields")
  const submitBtn = document.getElementById("submitBtn")
  const toggleText = document.getElementById("toggleText")
  const toggleLink = document.getElementById("toggleLink")
  const messageDiv = document.getElementById("message")

  if (isLoginMode) {
    registerFields.style.display = "none"
    submitBtn.textContent = "Entrar"
    toggleText.textContent = "Não tem conta? "
    toggleLink.textContent = "Registrar-se"
  } else {
    registerFields.style.display = "block"
    submitBtn.textContent = "Registrar"
    toggleText.textContent = "Já tem conta? "
    toggleLink.textContent = "Fazer login"
  }

  messageDiv.innerHTML = ""
}

// Mostrar mensagem
function showMessage(message, type = "error") {
  const messageDiv = document.getElementById("message")
  messageDiv.innerHTML = `<div class="${type}">${message}</div>`
}

// Validar email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Fazer login
function login(email, password) {
  const users = JSON.parse(localStorage.getItem("sulabet_users") || "[]")
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    localStorage.setItem("sulabet_current_user", JSON.stringify(user))
    showMessage("Login realizado com sucesso!", "success")
    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1000)
    return true
  }

  showMessage("Email ou senha incorretos!")
  return false
}

// Registrar usuário
function register(email, password, confirmPassword) {
  if (!isValidEmail(email)) {
    showMessage("Email inválido!")
    return false
  }

  if (password.length < 6) {
    showMessage("Senha deve ter pelo menos 6 caracteres!")
    return false
  }

  if (password !== confirmPassword) {
    showMessage("Senhas não coincidem!")
    return false
  }

  const users = JSON.parse(localStorage.getItem("sulabet_users") || "[]")

  if (users.find((u) => u.email === email)) {
    showMessage("Email já cadastrado!")
    return false
  }

  const newUser = {
    email,
    password,
    balance: 100, // Saldo inicial
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem("sulabet_users", JSON.stringify(users))
  localStorage.setItem("sulabet_current_user", JSON.stringify(newUser))

  showMessage("Conta criada com sucesso! Redirecionando...", "success")
  setTimeout(() => {
    window.location.href = "dashboard.html"
  }, 1000)

  return true
}

// Verificar se já está logado
function checkAuth() {
  const currentUser = localStorage.getItem("sulabet_current_user")
  if (currentUser && window.location.pathname.includes("index.html")) {
    window.location.href = "dashboard.html"
  } else if (!currentUser && window.location.pathname.includes("dashboard.html")) {
    window.location.href = "index.html"
  }
}

// ===== FUNÇÕES DA PÁGINA DO DASHBOARD =====

// Inicialização do dashboard
function initDashboard() {
  checkAuth()
  loadUser()
  renderMatches()
  updateBalance()
  setupEventListeners()
  loadBetHistory()
  updateStats()
}

// Carregar dados do usuário
function loadUser() {
  const users = JSON.parse(localStorage.getItem("sulabet_users") || "[]")
  const user = users.find((u) => u.email === currentUser.email)
  if (user) {
    currentUser = user
    localStorage.setItem("sulabet_current_user", JSON.stringify(currentUser))
  }
}

// Atualizar saldo
function updateBalance() {
  const balanceElement = document.getElementById("userBalance")
  if (balanceElement) {
    balanceElement.textContent = `R$ ${currentUser.balance.toFixed(2)}`
  }
}

// Renderizar jogos
function renderMatches() {
  const matchesList = document.getElementById("matchesList")
  if (!matchesList) return

  matchesList.innerHTML = ""

  matchesData.forEach((match) => {
    const matchCard = document.createElement("div")
    matchCard.className = "match-card"

    const oddsHtml = Object.entries(match.odds)
      .map(
        ([key, odd]) => `
            <div class="odd-btn" data-match-id="${match.id}" data-bet-type="${key}" data-odd="${odd.value}">
                <div class="odd-label">${odd.label}</div>
                <div class="odd-value">${odd.value}</div>
            </div>
        `,
      )
      .join("")

    matchCard.innerHTML = `
            <div class="match-header">
                <div class="match-teams">${match.homeTeam} vs ${match.awayTeam}</div>
                <div class="match-time">${match.time}</div>
            </div>
            <div class="odds-container">
                ${oddsHtml}
            </div>
        `

    matchesList.appendChild(matchCard)
  })
}

// Adicionar aposta
function addBet(matchId, betType, odd) {
  const match = matchesData.find((m) => m.id === matchId)
  if (!match) return

  const betId = `${matchId}-${betType}`

  // Remover aposta existente do mesmo jogo/tipo
  selectedBets = selectedBets.filter((bet) => bet.id !== betId)

  // Adicionar nova aposta
  selectedBets.push({
    id: betId,
    matchId,
    match: `${match.homeTeam} vs ${match.awayTeam}`,
    betType,
    label: match.odds[betType].label,
    odd: Number.parseFloat(odd),
    stake: 10,
  })

  updateBettingSlip()
  updateOddButtons()
}

// Remover aposta
function removeBet(betId) {
  selectedBets = selectedBets.filter((bet) => bet.id !== betId)
  updateBettingSlip()
  updateOddButtons()
}

// Atualizar cupom de apostas
function updateBettingSlip() {
  const slipContent = document.getElementById("bettingSlipContent")
  if (!slipContent) return

  if (selectedBets.length === 0) {
    slipContent.innerHTML = '<div class="empty-slip"><p>Selecione uma aposta para começar</p></div>'
    return
  }

  const betsHtml = selectedBets
    .map(
      (bet) => `
        <div class="bet-item">
            <button class="remove-bet" onclick="removeBet('${bet.id}')">&times;</button>
            <div class="bet-details">
                <strong>${bet.match}</strong><br>
                ${bet.label} <span class="bet-odd">${bet.odd}</span>
            </div>
            <input type="number" class="stake-input" value="${bet.stake}" min="1" step="0.01" 
                   onchange="updateStake('${bet.id}', this.value)">
        </div>
    `,
    )
    .join("")

  const totalOdd = selectedBets.reduce((acc, bet) => acc * bet.odd, 1)
  const totalStake = selectedBets.reduce((acc, bet) => acc + bet.stake, 0)
  const potentialReturn = totalStake * totalOdd

  slipContent.innerHTML = `
        ${betsHtml}
        <div class="slip-summary">
            <div class="summary-row">
                <span>Total Apostado:</span>
                <span>R$ ${totalStake.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Odd Total:</span>
                <span>${totalOdd.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Retorno Potencial:</span>
                <span>R$ ${potentialReturn.toFixed(2)}</span>
            </div>
            <button class="place-bet-btn" onclick="placeBet()" 
                    ${totalStake > currentUser.balance ? "disabled" : ""}>
                ${totalStake > currentUser.balance ? "Saldo Insuficiente" : "Fazer Aposta"}
            </button>
        </div>
    `
}

// Atualizar valor da aposta
function updateStake(betId, value) {
  const bet = selectedBets.find((b) => b.id === betId)
  if (bet) {
    bet.stake = Number.parseFloat(value) || 0
    updateBettingSlip()
  }
}

// Atualizar botões de odds
function updateOddButtons() {
  document.querySelectorAll(".odd-btn").forEach((btn) => {
    const matchId = Number.parseInt(btn.dataset.matchId)
    const betType = btn.dataset.betType
    const betId = `${matchId}-${betType}`

    if (selectedBets.find((bet) => bet.id === betId)) {
      btn.classList.add("selected")
    } else {
      btn.classList.remove("selected")
    }
  })
}

// Fazer aposta
function placeBet() {
  const totalStake = selectedBets.reduce((acc, bet) => acc + bet.stake, 0)

  if (totalStake > currentUser.balance) {
    alert("Saldo insuficiente!")
    return
  }

  // Deduzir do saldo
  currentUser.balance -= totalStake
  updateUserData()

  const bet = {
    id: Date.now(),
    bets: [...selectedBets],
    totalStake,
    totalOdd: selectedBets.reduce((acc, bet) => acc * bet.odd, 1),
    potentialReturn: totalStake * selectedBets.reduce((acc, bet) => acc * bet.odd, 1),
    status: "pending",
    date: new Date().toISOString(),
    userEmail: currentUser.email, // Adicionar email do usuário para histórico individual
  }

  const betHistory = JSON.parse(localStorage.getItem("sulabet_bet_history") || "[]")
  betHistory.push(bet)
  localStorage.setItem("sulabet_bet_history", JSON.stringify(betHistory))

  // Simular resultado após 3 segundos
  setTimeout(() => simulateBetResult(bet.id), 3000)

  // Limpar cupom
  selectedBets = []
  updateBettingSlip()
  updateOddButtons()

  alert("Aposta realizada com sucesso!")
}

// Simular resultado da aposta
function simulateBetResult(betId) {
  const betHistory = JSON.parse(localStorage.getItem("sulabet_bet_history") || "[]")
  const bet = betHistory.find((b) => b.id === betId)

  if (!bet) return

  // 40% de chance de ganhar
  const won = Math.random() < 0.4
  bet.status = won ? "won" : "lost"

  if (won) {
    currentUser.balance += bet.potentialReturn
    updateUserData()
  }

  localStorage.setItem("sulabet_bet_history", JSON.stringify(betHistory))

  const historySection = document.getElementById("historySection")
  if (historySection && historySection.classList.contains("active")) {
    loadBetHistory()
    updateStats()
  }
}

// Atualizar dados do usuário
function updateUserData() {
  const users = JSON.parse(localStorage.getItem("sulabet_users") || "[]")
  const userIndex = users.findIndex((u) => u.email === currentUser.email)
  if (userIndex !== -1) {
    users[userIndex] = currentUser
    localStorage.setItem("sulabet_users", JSON.stringify(users))
    localStorage.setItem("sulabet_current_user", JSON.stringify(currentUser))
  }
  updateBalance()
}

// Carregar histórico de apostas
function loadBetHistory() {
  const betHistory = JSON.parse(localStorage.getItem("sulabet_bet_history") || "[]")
  const userBetHistory = betHistory.filter((bet) => bet.userEmail === currentUser.email)
  const historyList = document.getElementById("betHistoryList")

  if (!historyList) return

  if (userBetHistory.length === 0) {
    historyList.innerHTML = "<p>Nenhuma aposta realizada ainda.</p>"
    return
  }

  historyList.innerHTML = userBetHistory
    .reverse()
    .map(
      (bet) => `
        <div class="bet-history-item">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="bet-status ${bet.status}">${getStatusText(bet.status)}</span>
                <span>${new Date(bet.date).toLocaleString("pt-BR")}</span>
            </div>
            <div style="margin-bottom: 0.5rem;">
                ${bet.bets.map((b) => `<div>${b.match} - ${b.label} (${b.odd})</div>`).join("")}
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Apostado: R$ ${bet.totalStake.toFixed(2)}</span>
                <span>Odd: ${bet.totalOdd.toFixed(2)}</span>
                <span>Retorno: R$ ${bet.potentialReturn.toFixed(2)}</span>
            </div>
        </div>
    `,
    )
    .join("")
}

// Obter texto do status
function getStatusText(status) {
  switch (status) {
    case "won":
      return "Ganhou"
    case "lost":
      return "Perdeu"
    case "pending":
      return "Pendente"
    default:
      return "Desconhecido"
  }
}

// Atualizar estatísticas
function updateStats() {
  const betHistory = JSON.parse(localStorage.getItem("sulabet_bet_history") || "[]")
  const userBetHistory = betHistory.filter((bet) => bet.userEmail === currentUser.email)

  const totalBets = userBetHistory.length
  const totalStaked = userBetHistory.reduce((acc, bet) => acc + bet.totalStake, 0)
  const wonBets = userBetHistory.filter((bet) => bet.status === "won").length
  const winRate = totalBets > 0 ? (wonBets / totalBets) * 100 : 0
  const totalReturns = userBetHistory
    .filter((bet) => bet.status === "won")
    .reduce((acc, bet) => acc + bet.potentialReturn, 0)
  const netProfit = totalReturns - totalStaked

  const totalBetsEl = document.getElementById("totalBets")
  const totalStakedEl = document.getElementById("totalStaked")
  const winRateEl = document.getElementById("winRate")
  const netProfitEl = document.getElementById("netProfit")

  if (totalBetsEl) totalBetsEl.textContent = totalBets
  if (totalStakedEl) totalStakedEl.textContent = `R$ ${totalStaked.toFixed(2)}`
  if (winRateEl) winRateEl.textContent = `${winRate.toFixed(1)}%`
  if (netProfitEl) {
    netProfitEl.textContent = `R$ ${netProfit.toFixed(2)}`
    netProfitEl.style.color = netProfit >= 0 ? "#28a745" : "#dc3545"
  }
}

// Event listeners
function setupEventListeners() {
  // Navegação entre abas
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      if (e.target.id === "walletBtn") {
        openWalletModal()
        return
      }

      const tabName = e.target.dataset.tab
      if (!tabName) return

      // Atualizar abas ativas
      document.querySelectorAll(".nav-tab").forEach((t) => t.classList.remove("active"))
      e.target.classList.add("active")

      // Mostrar seção correspondente
      document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.remove("active")
      })
      const targetSection = document.getElementById(tabName + "Section")
      if (targetSection) {
        targetSection.classList.add("active")
      }

      if (tabName === "history") {
        loadBetHistory()
        updateStats()
      }
    })
  })

  // Cliques em odds
  document.addEventListener("click", (e) => {
    if (e.target.closest(".odd-btn")) {
      const btn = e.target.closest(".odd-btn")
      const matchId = Number.parseInt(btn.dataset.matchId)
      const betType = btn.dataset.betType
      const odd = btn.dataset.odd

      addBet(matchId, betType, odd)
    }
  })

  // Logout
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("sulabet_current_user")
      window.location.href = "index.html"
    })
  }

  // Modal da carteira
  const closeWalletModalBtn = document.getElementById("closeWalletModal")
  if (closeWalletModalBtn) {
    closeWalletModalBtn.addEventListener("click", closeWalletModal)
  }

  // Abas da carteira
  document.querySelectorAll(".wallet-tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const tabName = e.target.dataset.walletTab

      document.querySelectorAll(".wallet-tab").forEach((t) => t.classList.remove("active"))
      e.target.classList.add("active")

      document.querySelectorAll(".wallet-content").forEach((content) => {
        content.classList.remove("active")
      })
      const targetContent = document.getElementById(tabName + "Content")
      if (targetContent) {
        targetContent.classList.add("active")
      }

      if (tabName === "transactions") {
        loadTransactions()
      }
    })
  })

  // Valores rápidos
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("quick-amount")) {
      const amount = e.target.dataset.amount
      const activeInput = document.querySelector(".wallet-content.active .amount-input")
      if (activeInput) {
        activeInput.value = amount
      }
    }
  })

  // Depósito
  const depositBtn = document.getElementById("depositBtn")
  if (depositBtn) {
    depositBtn.addEventListener("click", () => {
      const amount = Number.parseFloat(document.getElementById("depositAmount").value)
      if (!amount || amount < 10) {
        alert("Valor mínimo para depósito é R$ 10,00")
        return
      }

      currentUser.balance += amount
      updateUserData()

      // Salvar transação
      saveTransaction("deposit", amount)

      alert(`Depósito de R$ ${amount.toFixed(2)} realizado com sucesso!`)
      document.getElementById("depositAmount").value = ""
      closeWalletModal()
    })
  }

  // Saque
  const withdrawBtn = document.getElementById("withdrawBtn")
  if (withdrawBtn) {
    withdrawBtn.addEventListener("click", () => {
      const amount = Number.parseFloat(document.getElementById("withdrawAmount").value)
      if (!amount || amount < 10) {
        alert("Valor mínimo para saque é R$ 10,00")
        return
      }

      if (amount > currentUser.balance) {
        alert("Saldo insuficiente!")
        return
      }

      currentUser.balance -= amount
      updateUserData()

      // Salvar transação
      saveTransaction("withdraw", amount)

      alert(`Saque de R$ ${amount.toFixed(2)} realizado com sucesso!`)
      document.getElementById("withdrawAmount").value = ""
      closeWalletModal()
    })
  }
}

// Abrir modal da carteira
function openWalletModal() {
  const modal = document.getElementById("walletModal")
  if (modal) {
    modal.classList.add("active")
  }
}

// Fechar modal da carteira
function closeWalletModal() {
  const modal = document.getElementById("walletModal")
  if (modal) {
    modal.classList.remove("active")
  }
}

// Salvar transação
function saveTransaction(type, amount) {
  const transactions = JSON.parse(localStorage.getItem("sulabet_transactions") || "[]")
  transactions.push({
    type,
    amount,
    date: new Date().toISOString(),
    userEmail: currentUser.email,
  })
  localStorage.setItem("sulabet_transactions", JSON.stringify(transactions))
}

// Carregar transações
function loadTransactions() {
  const transactions = JSON.parse(localStorage.getItem("sulabet_transactions") || "[]")
  const userTransactions = transactions.filter((t) => t.userEmail === currentUser.email)
  const transactionsList = document.getElementById("transactionsList")

  if (!transactionsList) return

  if (userTransactions.length === 0) {
    transactionsList.innerHTML = "<p>Nenhuma transação encontrada.</p>"
    return
  }

  transactionsList.innerHTML = userTransactions
    .reverse()
    .map(
      (transaction) => `
        <div class="transaction-item">
            <div>
                <div class="transaction-type">${transaction.type === "deposit" ? "Depósito" : "Saque"}</div>
                <div style="font-size: 0.8rem; color: #666;">${new Date(transaction.date).toLocaleString("pt-BR")}</div>
            </div>
            <div class="transaction-amount ${transaction.type === "deposit" ? "positive" : "negative"}">
                ${transaction.type === "deposit" ? "+" : "-"}R$ ${transaction.amount.toFixed(2)}
            </div>
        </div>
    `,
    )
    .join("")
}

// ===== INICIALIZAÇÃO =====

// Inicializar aplicação baseado na página atual
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar dados demo
  initializeDemoData()

  // Verificar autenticação
  const storedUser = localStorage.getItem("sulabet_current_user")
  if (storedUser) {
    currentUser = JSON.parse(storedUser)
  }

  // Configurar página baseado no arquivo atual
  if (window.location.pathname.includes("dashboard.html")) {
    document.body.classList.add("dashboard-page")
    if (currentUser) {
      initDashboard()
    }
  } else {
    document.body.classList.add("login-page")
    checkAuth()

    // Event listeners da página de login
    const toggleLink = document.getElementById("toggleLink")
    if (toggleLink) {
      toggleLink.addEventListener("click", toggleMode)
    }

    const authForm = document.getElementById("authForm")
    if (authForm) {
      authForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const email = document.getElementById("email").value.trim()
        const password = document.getElementById("password").value

        if (!email || !password) {
          showMessage("Preencha todos os campos!")
          return
        }

        if (isLoginMode) {
          login(email, password)
        } else {
          const confirmPassword = document.getElementById("confirmPassword").value
          register(email, password, confirmPassword)
        }
      })
    }
  }
})
