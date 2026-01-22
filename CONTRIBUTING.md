# Contributing to Budget Tracker 2026

First off, thank you for considering contributing to Budget Tracker! It's people like you that make this tool better for everyone.

## How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected to see
- **Include screenshots** if possible
- **Note your browser version and OS**

### Suggesting Enhancements 💡

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests 🔧

1. Fork the repo and create your branch from `main`
2. If you've added code, test it thoroughly
3. Ensure your code follows the existing style
4. Write clear, descriptive commit messages
5. Update the README.md if needed

#### Code Style Guidelines

- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and small
- Follow the existing formatting patterns
- Use ES6+ JavaScript features

#### JavaScript Guidelines

```javascript
// Good
function calculateTotalAssets(assets) {
    return Object.values(assets).reduce((sum, val) => sum + val, 0);
}

// Bad
function calc(a) {
    let s = 0;
    for(let i in a) s += a[i];
    return s;
}
```

#### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/budget-tracker-2026.git
cd budget-tracker-2026
```

2. Open `index.html` in your browser or start a local server:
```bash
python -m http.server 8000
```

3. Make your changes

4. Test thoroughly in multiple browsers

### Testing Checklist

Before submitting a PR, ensure:

- [ ] All existing features still work
- [ ] New features work as expected
- [ ] Tested in Chrome, Firefox, and Safari
- [ ] No console errors
- [ ] LocalStorage saving/loading works
- [ ] All modals open and close properly
- [ ] Calculations are accurate
- [ ] Responsive design still works

## Project Structure

```
budget-app/
├── index.html       # Main entry point
├── css/
│   └── styles.css   # All styles (consider splitting in future)
├── js/
│   ├── app.js       # Main application logic
│   └── storage.js   # LocalStorage utilities
└── README.md
```

## Future Improvements

Areas where we'd love contributions:

1. **Export/Import Features**: CSV, JSON, Excel export
2. **Reporting**: Charts and graphs for spending trends
3. **Mobile Optimization**: Better mobile UX
4. **Keyboard Shortcuts**: Power user features
5. **Theme Support**: Dark mode, custom colors
6. **Multi-currency**: Support for different currencies
7. **Recurring Transactions**: Auto-populate regular expenses
8. **Budget Categories**: More flexible categorization
9. **Search/Filter**: Find transactions quickly
10. **Backup to Cloud**: Optional cloud sync

## Questions?

Feel free to open an issue with the "question" label if you need clarification on anything!

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or identity.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully  
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment, trolling, or discriminatory language
- Personal attacks or political arguments
- Publishing others' private information
- Other conduct which could be considered inappropriate

Thank you for contributing! 🎉
