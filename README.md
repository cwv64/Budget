# Budget Tracker 2026 💰

A comprehensive, double-entry accounting-style budget tracking application built with vanilla JavaScript. Track your income, expenses, assets, and financial goals with a clean, modern interface.

![Budget Tracker](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features ✨

### Core Functionality
- **Double-Entry Accounting**: Every transaction requires both a debit and credit account, ensuring balanced books
- **Journal Entries Log**: Complete audit trail of all financial transactions
- **Outstanding Entries**: Track money owed to/from you separately from main accounts
- **Real-time Metrics**: Instant calculation of net worth, end-of-year projections, and more

### Account Management
- **Current Assets**: Regions/Debit, Stocks, Venmo, Cash, Outstanding Credit
- **Other Accounts**: Roth IRA, Income Remaining
- **Settings Panel**:  Easily adjust account balances via the settings gear icon

### Expense Tracking
- **Monthly Expenses**: Track recurring monthly bills with a visual 12-month calendar
- **Seasonal Expenses**: Organize expenses by season (Winter, Spring, Summer, Fall)
- **Dynamic Expense Lists**: Add, remove, and mark expenses as paid
- **Automatic Calculations**: Total fixed and discretionary spending calculated automatically

### Data Persistence
- **LocalStorage**: All data automatically saved to browser
- **Import/Export**: Backup and restore your data (coming soon)

## Getting Started 🚀

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/budget-tracker-2026.git
cd budget-tracker-2026
```

2. Open `index.html` in your web browser:
```bash
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

Or use a local server:
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

### File Structure
```
budget-tracker-2026/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling
├── js/
│   ├── app.js          # Main application logic
│   └── storage.js      # LocalStorage management
└── README.md           # Documentation
```

## Usage Guide 📖

### Adding a Journal Entry

1. Select a date for the transaction
2. Enter a description (e.g., "Paid rent for January")
3. Enter the amount
4. Choose the **Debit Account** (where money is going or what expense is recorded)
5. Choose the **Credit Account** (where money is coming from)
6. Click "Add Entry"

**Example**: Paying $500 rent with your Regions checking account
- Debit: Rent
- Credit: Regions/Debit
- Amount: $500

### Managing Outstanding Entries

Outstanding entries are perfect for tracking:
- Money friends owe you
- Birthday gifts you haven't deposited yet
- Debts you need to pay back

**Adding an outstanding entry:**
1. Click "+ Add Outstanding Entry"
2. Enter the date, description, and amount
3. Use positive amounts for money coming to you, negative for debts you owe

**Using outstanding entries in journal entries:**
When someone pays you back:
- Debit: Venmo (or wherever you received the money)
- Credit: Outstanding Entries → Select the specific entry
- Amount: The amount they paid

### Working with Expenses

#### Monthly Expenses
- Track recurring monthly bills (rent, utilities, internet, etc.)
- Visual calendar shows which months have been paid (✓ = paid, yellow = unpaid)
- Add new monthly expenses with the "+ Add Monthly Expense" button
- When you pay a monthly expense, it marks the next unpaid month as paid

#### Seasonal Expenses
- Organize one-time or seasonal expenses by season
- Each season has its own section (Winter, Spring, Summer, Fall)
- Add expenses specific to each season
- Mark as paid when the expense is complete

### Using Settings ⚙️

Click the gear icon in the header to:
- Adjust current asset balances (Regions, Stocks, Venmo, Cash, Outstanding Credit)
- Update Roth IRA balance
- Modify total income remaining for the year

**Use this when:**
- Setting up your initial balances
- Making corrections to account values
- Updating your Roth IRA after contributions

### Understanding the Metrics

**Total Current Assets**: Sum of all liquid assets (Regions + Stocks + Venmo + Cash + Outstanding Credit)

**Current Assets End of Year**: Projected assets at year-end
```
Formula: Current Assets + Outstanding Entries + Income Remaining - Fixed Expenses - Seasonal Expenses
```

**Total Current Net Worth**: Assets including retirement accounts
```
Formula: Current Assets + Outstanding Entries + Roth IRA
```

**Outstanding Entries Total**: Net amount of money in outstanding entries (positive = owed to you, negative = you owe)

## Advanced Features 🔧

### Editing vs Deleting

**Outstanding Entries**: 
- ✅ Can be edited (date, description, amount)
- ✅ Can be deleted

**Journal Entries**:
- ❌ Cannot be edited (immutable for audit trail)
- ✅ Can be deleted (reverses all accounting effects)

### Accounting Rules

The app follows proper double-entry accounting:

**Debit (DR)**:
- Increases asset accounts (Regions, Cash, Venmo, Stocks)
- Records expenses (Rent, Utilities, Golf, etc.)
- Increases outstanding entries (moves toward $0 if negative, or increases if positive)

**Credit (CR)**:
- Decreases asset accounts
- Decreases outstanding entries
- Decreases income remaining

**Example Transactions**:

1. **Friend pays you back $100 via Venmo:**
   - DR: Venmo (+$100)
   - CR: Outstanding Entry "Friend money" (-$100)

2. **Pay $50 cash debt:**
   - DR: Outstanding Entry "Owe friend" (+$50, from -$50 to $0)
   - CR: Cash (-$50)

3. **Receive $10,000 income:**
   - DR: Regions (+$10,000)
   - CR: Income Remaining (-$10,000)

## Data Management 💾

### Automatic Saving
All changes are automatically saved to your browser's localStorage. Your data persists between sessions.

### Clearing Data
To start fresh:
1. Open browser developer tools (F12)
2. Go to Application/Storage → LocalStorage
3. Find the `budgetTrackerData` key and delete it
4. Refresh the page

### Future Features (Roadmap)
- [ ] Export to CSV/JSON
- [ ] Import from file
- [ ] Recurring transaction templates
- [ ] Budget vs Actual reporting
- [ ] Multi-year support
- [ ] Category-based budgeting
- [ ] Mobile app version

## Browser Compatibility 🌐

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

Having issues? Please open an issue on GitHub with:
- A description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and version

## Acknowledgments 🙏

Built with vanilla JavaScript - no frameworks, just clean code.

---

**Made with ❤️ for better financial management**
