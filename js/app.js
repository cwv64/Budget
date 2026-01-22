// Import Firebase modules
import { initAuth, loadUserBudget, logOut, getCurrentUser } from './auth.js';
import Storage from './storage.js';

// Initialize budget data
let budget = {
    currentAssets: {
        regions: 0,
        stocks: 0,
        venmo: 0,
        cash: 0,
        outstandingCredit: 0
    },
    otherAccounts: {
        rothIRA: 0,
        incomeRemaining: 0
    },
    outstandingEntries: [],
    journalEntries: [],
    monthlyExpenses: [],
    seasonalExpenses: [],
    nextExpenseId: 1,
    nextOutstandingId: 1
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let currentSeasonForModal = '';
let editingOutstandingEntryId = null;
let currentUser = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase auth
    initAuth(
        // On user logged in
        async (user) => {
            currentUser = user;
            console.log('User logged in:', user.email);
            
            // Load user's budget data
            const result = await loadUserBudget(user.uid);
            if (result.success && result.data) {
                budget = result.data;
            }
            
            // Show user email in header
            displayUserInfo(user);
            
            // Initialize the app
            initializeApp();
        },
        // On user logged out
        () => {
            // Redirect to login page
            window.location.href = 'login.html';
        }
    );
});

function displayUserInfo(user) {
    const header = document.querySelector('.header');
    const userInfo = document.createElement('div');
    userInfo.style.cssText = 'display: flex; align-items: center; gap: 15px;';
    userInfo.innerHTML = `
        <div style="text-align: right;">
            <div style="font-size: 0.85em; color: #7f8c8d;">Logged in as</div>
            <div style="font-weight: 600; color: #2c3e50;">${user.email}</div>
        </div>
        <button onclick="handleLogout()" style="padding: 8px 16px; font-size: 0.9em; background: #e74c3c;">
            Logout
        </button>
    `;
    
    // Find the header flex container and add user info
    const headerFlex = header.querySelector('div');
    if (headerFlex) {
        headerFlex.appendChild(userInfo);
    }
}

window.handleLogout = async function() {
    if (confirm('Are you sure you want to logout?')) {
        await logOut();
        window.location.href = 'login.html';
    }
};

function initializeApp() {
    // Initialize date inputs
    document.getElementById('entryDate').valueAsDate = new Date();
    document.getElementById('newOutstandingDate').valueAsDate = new Date();
    
    // Add event listeners
    document.getElementById('debitAccount').addEventListener('change', function() {
        const selectGroup = document.getElementById('outstandingEntrySelectGroup');
        if (this.value === 'outstandingEntries') {
            selectGroup.style.display = 'block';
            updateOutstandingEntrySelects();
        } else {
            selectGroup.style.display = 'none';
        }
    });

    document.getElementById('creditAccount').addEventListener('change', function() {
        const selectGroup = document.getElementById('outstandingEntryCreditSelectGroup');
        if (this.value === 'outstandingEntries') {
            selectGroup.style.display = 'block';
            updateOutstandingEntrySelects();
        } else {
            selectGroup.style.display = 'none';
        }
    });
    
    updateDisplay();
}

// Save data whenever it changes
async function saveData() {
    if (currentUser) {
        await Storage.save(budget);
    }
}

function formatCurrency(amount) {
    const sign = amount < 0 ? '-' : '';
    const absAmount = Math.abs(amount);
    return sign + '$' + absAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function calculateMetrics() {
    // Total Current Assets
    const totalCurrentAssets = Object.values(budget.currentAssets).reduce((sum, val) => sum + val, 0);
    
    // Outstanding Entries Total
    const outstandingTotal = budget.outstandingEntries.reduce((sum, entry) => sum + entry.amount, 0);
    
    // Total Fixed Expenses Remaining
    const totalMonthlyExpenses = budget.monthlyExpenses.reduce((sum, exp) => {
        const monthsRemaining = 12 - exp.paidMonths.length;
        return sum + (exp.amount * monthsRemaining);
    }, 0);
    
    // Discretionary Spending Remaining
    const totalSeasonalExpenses = budget.seasonalExpenses
        .filter(exp => !exp.paid)
        .reduce((sum, exp) => sum + exp.amount, 0);
    
    // Total Current Net Worth
    const totalNetWorth = totalCurrentAssets + outstandingTotal + budget.otherAccounts.rothIRA;
    
    // Current Assets End of Year
    const currentAssetsEOY = totalCurrentAssets + outstandingTotal + 
        budget.otherAccounts.incomeRemaining - totalMonthlyExpenses - totalSeasonalExpenses;

    return {
        totalCurrentAssets,
        outstandingTotal,
        totalMonthlyExpenses,
        totalSeasonalExpenses,
        totalNetWorth,
        currentAssetsEOY
    };
}

function updateOutstandingEntrySelects() {
    const debitSelect = document.getElementById('outstandingEntrySelect');
    const creditSelect = document.getElementById('outstandingEntryCreditSelect');
    
    const optionsHTML = budget.outstandingEntries.map(entry => 
        `<option value="${entry.id}">${entry.description} (${formatCurrency(entry.amount)})</option>`
    ).join('');
    
    debitSelect.innerHTML = optionsHTML || '<option value="">No outstanding entries</option>';
    creditSelect.innerHTML = optionsHTML || '<option value="">No outstanding entries</option>';
}

function updateExpenseDropdowns() {
    // Update monthly expenses in debit dropdown
    const monthlyDebitGroup = document.getElementById('monthlyExpensesDebitGroup');
    monthlyDebitGroup.innerHTML = budget.monthlyExpenses.map(exp => 
        `<option value="monthly_${exp.id}">${exp.name}</option>`
    ).join('');

    // Update seasonal expenses in debit dropdown
    const seasonalDebitGroup = document.getElementById('seasonalExpensesDebitGroup');
    seasonalDebitGroup.innerHTML = budget.seasonalExpenses.map(exp => 
        `<option value="seasonal_${exp.id}">${exp.name} (${exp.season})</option>`
    ).join('');
}

function updateDisplay() {
    const metrics = calculateMetrics();

    // Update metrics
    document.getElementById('totalCurrentAssets').textContent = formatCurrency(metrics.totalCurrentAssets);
    document.getElementById('currentAssetsEOY').textContent = formatCurrency(metrics.currentAssetsEOY);
    document.getElementById('totalNetWorth').textContent = formatCurrency(metrics.totalNetWorth);
    document.getElementById('outstandingTotal').textContent = formatCurrency(metrics.outstandingTotal);

    // Update current assets
    document.getElementById('regionsBalance').textContent = formatCurrency(budget.currentAssets.regions);
    document.getElementById('stocksBalance').textContent = formatCurrency(budget.currentAssets.stocks);
    document.getElementById('venmoBalance').textContent = formatCurrency(budget.currentAssets.venmo);
    document.getElementById('cashBalance').textContent = formatCurrency(budget.currentAssets.cash);
    document.getElementById('outstandingCreditBalance').textContent = formatCurrency(budget.currentAssets.outstandingCredit);
    
    // Update other accounts
    document.getElementById('rothBalance').textContent = formatCurrency(budget.otherAccounts.rothIRA);
    document.getElementById('incomeBalance').textContent = formatCurrency(budget.otherAccounts.incomeRemaining);

    // Update outstanding entries list
    const outstandingList = document.getElementById('outstandingEntriesList');
    outstandingList.innerHTML = budget.outstandingEntries.length === 0 
        ? '<p style="color: #999;">No outstanding entries</p>'
        : budget.outstandingEntries
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(entry => `
                <div class="entry-item outstanding">
                    <div class="entry-date">${new Date(entry.date).toLocaleDateString()}</div>
                    <div>${entry.description}</div>
                    <div class="entry-details">
                        <span class="entry-amount ${entry.amount >= 0 ? 'positive' : 'negative'}">
                            ${formatCurrency(entry.amount)}
                        </span>
                        <div>
                            <button class="secondary" style="padding: 5px 10px; font-size: 0.85em; margin-right: 5px;" onclick="editOutstandingEntry(${entry.id})">Edit</button>
                            <button class="delete-btn" onclick="deleteOutstandingEntry(${entry.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');

    // Update outstanding entry selects and expense dropdowns
    updateOutstandingEntrySelects();
    updateExpenseDropdowns();

    // Update journal entries
    const journalList = document.getElementById('journalEntriesList');
    journalList.innerHTML = budget.journalEntries.length === 0 
        ? '<p style="color: #999;">No journal entries yet</p>'
        : budget.journalEntries
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(entry => `
                <div class="entry-item">
                    <div class="entry-date">${new Date(entry.date).toLocaleDateString()}</div>
                    <div><strong>${entry.description}</strong></div>
                    <div style="font-size: 0.9em; color: #666; margin-top: 5px;">
                        DR: ${entry.debitAccount} | CR: ${entry.creditAccount}
                    </div>
                    <div class="entry-details">
                        <span class="entry-amount">${formatCurrency(entry.amount)}</span>
                        <button class="delete-btn" onclick="deleteJournalEntry(${entry.id})">Delete</button>
                    </div>
                </div>
            `).join('');

    // Update monthly expenses table
    const monthlyTable = document.getElementById('monthlyExpensesTable');
    monthlyTable.innerHTML = budget.monthlyExpenses.map(exp => {
        const monthCells = months.map((month, idx) => {
            const isPaid = exp.paidMonths.includes(idx + 1);
            return `<td class="${isPaid ? 'month-paid' : 'month-unpaid'}">${isPaid ? '✓' : ''}</td>`;
        }).join('');
        return `
            <tr>
                <td>${exp.name}</td>
                ${monthCells}
                <td style="font-weight: bold;">${formatCurrency(exp.amount)}/mo</td>
                <td><button class="delete-btn" onclick="deleteMonthlyExpense(${exp.id})">Remove</button></td>
            </tr>
        `;
    }).join('');
    document.getElementById('totalMonthlyExpenses').textContent = formatCurrency(metrics.totalMonthlyExpenses);

    // Update seasonal expenses by season
    ['Winter', 'Spring', 'Summer', 'Fall'].forEach(season => {
        const seasonExpenses = budget.seasonalExpenses.filter(e => e.season === season);
        const listId = season.toLowerCase() + 'ExpensesList';
        const listElement = document.getElementById(listId);
        
        listElement.innerHTML = seasonExpenses.length === 0
            ? '<p style="color: #999; font-size: 0.9em;">No expenses</p>'
            : seasonExpenses.map(exp => `
                <div class="season-expense-item ${exp.paid ? 'paid' : ''}">
                    <div>
                        <div style="font-weight: 600;">${exp.name}</div>
                        <div style="font-size: 0.85em; color: #666;">${formatCurrency(exp.amount)}</div>
                    </div>
                    <button class="delete-btn" onclick="deleteSeasonalExpense(${exp.id})">Remove</button>
                </div>
            `).join('');
    });
    
    document.getElementById('totalSeasonalExpenses').textContent = formatCurrency(metrics.totalSeasonalExpenses);
    
    // Save data after update
    saveData();
}

function addJournalEntry() {
    const date = document.getElementById('entryDate').value;
    const description = document.getElementById('entryDescription').value;
    const amount = parseFloat(document.getElementById('entryAmount').value);
    const debitAccount = document.getElementById('debitAccount').value;
    const creditAccount = document.getElementById('creditAccount').value;

    if (!date || !description || !amount || amount <= 0) {
        alert('Please fill in all fields with valid values');
        return;
    }

    const accountMap = {
        regions: 'regions',
        stocks: 'stocks',
        venmo: 'venmo',
        cash: 'cash',
        outstandingCredit: 'outstandingCredit'
    };

    let outstandingEntryId = null;
    let outstandingEntryCreditId = null;

    // Handle DEBIT side (increase asset or record expense)
    if (accountMap[debitAccount]) {
        budget.currentAssets[accountMap[debitAccount]] += amount;
    } else if (debitAccount === 'outstandingEntries') {
        // Debit to outstanding entry means INCREASING that entry
        const entryId = parseInt(document.getElementById('outstandingEntrySelect').value);
        outstandingEntryId = entryId;
        const entry = budget.outstandingEntries.find(e => e.id === entryId);
        if (entry) {
            entry.amount += amount;
            if (Math.abs(entry.amount) < 0.01) {
                budget.outstandingEntries = budget.outstandingEntries.filter(e => e.id !== entryId);
            }
        }
    } else if (debitAccount.startsWith('monthly_')) {
        // Monthly expense
        const expenseId = parseInt(debitAccount.replace('monthly_', ''));
        const expense = budget.monthlyExpenses.find(e => e.id === expenseId);
        if (expense) {
            for (let month = 1; month <= 12; month++) {
                if (!expense.paidMonths.includes(month)) {
                    expense.paidMonths.push(month);
                    break;
                }
            }
        }
    } else if (debitAccount.startsWith('seasonal_')) {
        // Seasonal expense
        const expenseId = parseInt(debitAccount.replace('seasonal_', ''));
        const expense = budget.seasonalExpenses.find(e => e.id === expenseId);
        if (expense) {
            expense.paid = true;
        }
    }

    // Handle CREDIT side (decrease asset or income)
    if (accountMap[creditAccount]) {
        budget.currentAssets[accountMap[creditAccount]] -= amount;
    } else if (creditAccount === 'income') {
        budget.otherAccounts.incomeRemaining -= amount;
    } else if (creditAccount === 'outstandingEntries') {
        // Credit to outstanding entry means DECREASING that entry
        const entryId = parseInt(document.getElementById('outstandingEntryCreditSelect').value);
        outstandingEntryCreditId = entryId;
        const entry = budget.outstandingEntries.find(e => e.id === entryId);
        if (entry) {
            entry.amount -= amount;
            if (Math.abs(entry.amount) < 0.01) {
                budget.outstandingEntries = budget.outstandingEntries.filter(e => e.id !== entryId);
            }
        }
    }

    // Add to journal
    budget.journalEntries.push({
        id: Date.now(),
        date: date,
        description: description,
        amount: amount,
        debitAccount: debitAccount,
        creditAccount: creditAccount,
        outstandingEntryId: outstandingEntryId,
        outstandingEntryCreditId: outstandingEntryCreditId
    });

    // Clear form
    document.getElementById('entryDescription').value = '';
    document.getElementById('entryAmount').value = '';

    updateDisplay();
}

function deleteOutstandingEntry(id) {
    if (confirm('Are you sure you want to delete this outstanding entry?')) {
        budget.outstandingEntries = budget.outstandingEntries.filter(e => e.id !== id);
        updateDisplay();
    }
}

function showAddOutstandingEntry() {
    document.getElementById('addOutstandingEntryModal').classList.add('active');
}

function addOutstandingEntryDirect() {
    const date = document.getElementById('newOutstandingDate').value;
    const description = document.getElementById('newOutstandingDescription').value;
    const amount = parseFloat(document.getElementById('newOutstandingAmount').value);

    if (!date || !description || !amount) {
        alert('Please fill in all fields');
        return;
    }

    budget.outstandingEntries.push({
        id: budget.nextOutstandingId++,
        date: date,
        description: description,
        amount: amount,
        type: 'outstanding'
    });

    closeModal('addOutstandingEntryModal');
    updateDisplay();
}

function editOutstandingEntry(id) {
    const entry = budget.outstandingEntries.find(e => e.id === id);
    if (!entry) return;

    editingOutstandingEntryId = id;
    document.getElementById('editOutstandingDate').value = entry.date;
    document.getElementById('editOutstandingDescription').value = entry.description;
    document.getElementById('editOutstandingAmount').value = entry.amount;
    document.getElementById('editOutstandingEntryModal').classList.add('active');
}

function saveOutstandingEntryEdit() {
    const entry = budget.outstandingEntries.find(e => e.id === editingOutstandingEntryId);
    if (!entry) return;

    entry.date = document.getElementById('editOutstandingDate').value;
    entry.description = document.getElementById('editOutstandingDescription').value;
    entry.amount = parseFloat(document.getElementById('editOutstandingAmount').value);

    closeModal('editOutstandingEntryModal');
    updateDisplay();
}

function deleteJournalEntry(id) {
    if (confirm('Are you sure you want to delete this journal entry? This will reverse all accounting effects.')) {
        const entry = budget.journalEntries.find(e => e.id === id);
        if (!entry) return;

        const amount = entry.amount;
        const debitAccount = entry.debitAccount;
        const creditAccount = entry.creditAccount;

        const accountMap = {
            regions: 'regions',
            stocks: 'stocks',
            venmo: 'venmo',
            cash: 'cash',
            outstandingCredit: 'outstandingCredit'
        };

        // REVERSE the DEBIT side (subtract what was added)
        if (accountMap[debitAccount]) {
            budget.currentAssets[accountMap[debitAccount]] -= amount;
        } else if (debitAccount === 'outstandingEntries' && entry.outstandingEntryId) {
            // Original debit INCREASED an outstanding entry, so reverse by subtracting
            const outEntry = budget.outstandingEntries.find(e => e.id === entry.outstandingEntryId);
            if (outEntry) {
                outEntry.amount -= amount;
                if (Math.abs(outEntry.amount) < 0.01) {
                    budget.outstandingEntries = budget.outstandingEntries.filter(e => e.id !== entry.outstandingEntryId);
                }
            } else {
                // Entry was deleted (went to zero), need to recreate it
                budget.outstandingEntries.push({
                    id: entry.outstandingEntryId,
                    date: entry.date,
                    description: 'Restored from deleted journal entry',
                    amount: -amount,
                    type: 'outstanding'
                });
            }
        } else if (debitAccount.startsWith('monthly_')) {
            // Reverse monthly expense payment
            const expenseId = parseInt(debitAccount.replace('monthly_', ''));
            const expense = budget.monthlyExpenses.find(e => e.id === expenseId);
            if (expense && expense.paidMonths.length > 0) {
                // Remove the last paid month
                expense.paidMonths.pop();
            }
        } else if (debitAccount.startsWith('seasonal_')) {
            // Reverse seasonal expense payment
            const expenseId = parseInt(debitAccount.replace('seasonal_', ''));
            const expense = budget.seasonalExpenses.find(e => e.id === expenseId);
            if (expense) {
                expense.paid = false;
            }
        }

        // REVERSE the CREDIT side (add back what was subtracted)
        if (accountMap[creditAccount]) {
            budget.currentAssets[accountMap[creditAccount]] += amount;
        } else if (creditAccount === 'income') {
            budget.otherAccounts.incomeRemaining += amount;
        } else if (creditAccount === 'outstandingEntries' && entry.outstandingEntryCreditId) {
            // Original credit DECREASED an outstanding entry, so reverse by adding
            const outEntry = budget.outstandingEntries.find(e => e.id === entry.outstandingEntryCreditId);
            if (outEntry) {
                outEntry.amount += amount;
            } else {
                // Entry was deleted, recreate it with the amount
                budget.outstandingEntries.push({
                    id: entry.outstandingEntryCreditId,
                    date: entry.date,
                    description: 'Restored from deleted journal entry',
                    amount: amount,
                    type: 'outstanding'
                });
            }
        }

        // Remove the journal entry
        budget.journalEntries = budget.journalEntries.filter(e => e.id !== id);
        updateDisplay();
    }
}

// Modal management
function showAddMonthlyExpense() {
    document.getElementById('addMonthlyExpenseModal').classList.add('active');
}

function showAddSeasonalExpense(season) {
    currentSeasonForModal = season;
    document.getElementById('seasonalExpenseSeason').textContent = season;
    document.getElementById('addSeasonalExpenseModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    // Clear inputs
    if (modalId === 'addMonthlyExpenseModal') {
        document.getElementById('newMonthlyExpenseName').value = '';
        document.getElementById('newMonthlyExpenseAmount').value = '';
    } else if (modalId === 'addSeasonalExpenseModal') {
        document.getElementById('newSeasonalExpenseName').value = '';
        document.getElementById('newSeasonalExpenseAmount').value = '';
    } else if (modalId === 'addOutstandingEntryModal') {
        document.getElementById('newOutstandingDescription').value = '';
        document.getElementById('newOutstandingAmount').value = '';
        document.getElementById('newOutstandingDate').valueAsDate = new Date();
    } else if (modalId === 'editOutstandingEntryModal') {
        editingOutstandingEntryId = null;
    }
}

function addMonthlyExpense() {
    const name = document.getElementById('newMonthlyExpenseName').value;
    const amount = parseFloat(document.getElementById('newMonthlyExpenseAmount').value);

    if (!name || !amount || amount <= 0) {
        alert('Please enter a valid name and amount');
        return;
    }

    budget.monthlyExpenses.push({
        id: budget.nextExpenseId++,
        name: name,
        amount: amount,
        paidMonths: []
    });

    closeModal('addMonthlyExpenseModal');
    updateDisplay();
}

function addSeasonalExpense() {
    const name = document.getElementById('newSeasonalExpenseName').value;
    const amount = parseFloat(document.getElementById('newSeasonalExpenseAmount').value);

    if (!name || !amount || amount <= 0) {
        alert('Please enter a valid name and amount');
        return;
    }

    budget.seasonalExpenses.push({
        id: budget.nextExpenseId++,
        name: name,
        amount: amount,
        season: currentSeasonForModal,
        paid: false
    });

    closeModal('addSeasonalExpenseModal');
    updateDisplay();
}

function deleteMonthlyExpense(id) {
    if (confirm('Are you sure you want to remove this monthly expense?')) {
        budget.monthlyExpenses = budget.monthlyExpenses.filter(e => e.id !== id);
        updateDisplay();
    }
}

function deleteSeasonalExpense(id) {
    if (confirm('Are you sure you want to remove this seasonal expense?')) {
        budget.seasonalExpenses = budget.seasonalExpenses.filter(e => e.id !== id);
        updateDisplay();
    }
}

// Settings functionality
window.openSettings = function() {
    // Populate settings form with current values
    document.getElementById('settingsRegions').value = budget.currentAssets.regions;
    document.getElementById('settingsStocks').value = budget.currentAssets.stocks;
    document.getElementById('settingsVenmo').value = budget.currentAssets.venmo;
    document.getElementById('settingsCash').value = budget.currentAssets.cash;
    document.getElementById('settingsOutstandingCredit').value = budget.currentAssets.outstandingCredit;
    document.getElementById('settingsRothIRA').value = budget.otherAccounts.rothIRA;
    document.getElementById('settingsIncomeRemaining').value = budget.otherAccounts.incomeRemaining;
    
    document.getElementById('settingsModal').classList.add('active');
}

window.saveSettings = function() {
    // Update budget with new values
    budget.currentAssets.regions = parseFloat(document.getElementById('settingsRegions').value) || 0;
    budget.currentAssets.stocks = parseFloat(document.getElementById('settingsStocks').value) || 0;
    budget.currentAssets.venmo = parseFloat(document.getElementById('settingsVenmo').value) || 0;
    budget.currentAssets.cash = parseFloat(document.getElementById('settingsCash').value) || 0;
    budget.currentAssets.outstandingCredit = parseFloat(document.getElementById('settingsOutstandingCredit').value) || 0;
    budget.otherAccounts.rothIRA = parseFloat(document.getElementById('settingsRothIRA').value) || 0;
    budget.otherAccounts.incomeRemaining = parseFloat(document.getElementById('settingsIncomeRemaining').value) || 0;
    
    closeModal('settingsModal');
    updateDisplay();
}

// Make all onClick functions available globally
window.addJournalEntry = addJournalEntry;
window.deleteOutstandingEntry = deleteOutstandingEntry;
window.showAddOutstandingEntry = showAddOutstandingEntry;
window.addOutstandingEntryDirect = addOutstandingEntryDirect;
window.editOutstandingEntry = editOutstandingEntry;
window.saveOutstandingEntryEdit = saveOutstandingEntryEdit;
window.deleteJournalEntry = deleteJournalEntry;
window.showAddMonthlyExpense = showAddMonthlyExpense;
window.showAddSeasonalExpense = showAddSeasonalExpense;
window.closeModal = closeModal;
window.addMonthlyExpense = addMonthlyExpense;
window.addSeasonalExpense = addSeasonalExpense;
window.deleteMonthlyExpense = deleteMonthlyExpense;
window.deleteSeasonalExpense = deleteSeasonalExpense;
