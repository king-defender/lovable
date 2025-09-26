# Contributing to Lovable

Thank you for your interest in contributing to Lovable! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new features and improvements
- **Code Contributions**: Submit bug fixes and new features
- **Documentation**: Improve docs, tutorials, and examples
- **Testing**: Help test new features and report issues
- **Community Support**: Help other users in discussions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Basic knowledge of React, Node.js, and TypeScript
- API keys for development (see .env.example)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/lovable.git
   cd lovable
   ```

2. **Install Dependencies**
   ```bash
   # Backend dependencies
   cd backend && npm install

   # Frontend dependencies
   cd ../frontend && npm install

   # AI engine dependencies
   cd ../ai-engine && npm install

   # Return to root
   cd ..
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Fill in your API keys and configuration
   ```

4. **Start Development Servers**
   ```bash
   # Start all services
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write descriptive commit messages
- Add JSDoc comments for functions and classes
- Use meaningful variable and function names

### Code Structure
- **Frontend**: Follow React best practices, use hooks, and maintain component modularity
- **Backend**: Use Express.js patterns, implement proper error handling
- **AI Engine**: Keep AI logic separate and testable
- **Database**: Use migrations for schema changes

### Testing
- Write unit tests for new features
- Test API endpoints with integration tests
- Test React components with React Testing Library
- Ensure all tests pass before submitting PR

## 🔄 Contribution Workflow

### 1. Issue First
- Check existing issues before creating new ones
- Describe the problem or feature clearly
- Include steps to reproduce for bugs
- Add relevant labels and assign yourself

### 2. Branch Naming
Use descriptive branch names:
- `feature/ai-prompt-parser`
- `fix/database-connection-issue`
- `docs/api-documentation`
- `refactor/component-structure`

### 3. Development Process
1. Create a feature branch from `main`
2. Make your changes following our guidelines
3. Write or update tests as needed
4. Run linting and tests locally
5. Commit with clear, descriptive messages
6. Push to your fork

### 4. Pull Request Process
1. **Create PR**: Use our PR template
2. **Description**: Clearly describe what you've changed and why
3. **Testing**: Describe how you tested your changes
4. **Screenshots**: Include screenshots for UI changes
5. **Documentation**: Update docs if needed

### 5. Code Review
- Address feedback promptly and respectfully
- Make requested changes in separate commits
- Keep discussions focused and constructive
- Be patient - reviews take time

## 🧪 Testing Guidelines

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# AI engine tests
cd ai-engine && npm test

# Integration tests
npm run test:integration
```

### Writing Tests
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and workflows
- **E2E Tests**: Test complete user journeys
- **AI Tests**: Test prompt parsing and code generation

## 📚 Documentation

### Code Documentation
- Add JSDoc comments to functions and classes
- Include examples in documentation
- Document complex algorithms and business logic
- Keep README files updated

### API Documentation
- Document all API endpoints
- Include request/response examples
- Document error codes and messages
- Use OpenAPI/Swagger specifications

## 🐛 Bug Reports

### Include This Information
- **Environment**: OS, Node version, browser
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Console Logs**: Any error messages

### Template
```
**Bug Description**
A clear description of the bug.

**To Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
```

## 💡 Feature Requests

### Include This Information
- **Problem**: What problem does this solve?
- **Solution**: Describe your proposed solution
- **Alternatives**: Any alternative solutions considered
- **Use Cases**: How would this be used?
- **Priority**: How important is this feature?

## 🏷 Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority-high`: High priority issue
- `priority-low`: Low priority issue
- `frontend`: Frontend-related issue
- `backend`: Backend-related issue
- `ai-engine`: AI-related issue

## 📋 Commit Message Guidelines

### Format
```
type(scope): description

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples
```
feat(ai): add natural language parsing for components

fix(frontend): resolve responsive layout issues on mobile

docs(api): update authentication endpoint documentation

refactor(backend): improve database query performance
```

## 🎉 Recognition

We appreciate all contributions! Contributors will be:
- Listed in our Contributors section
- Mentioned in release notes for significant contributions
- Invited to our contributor Discord channel
- Eligible for contributor swag (when available)

## 📞 Getting Help

- **GitHub Discussions**: General questions and discussions
- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Real-time chat with the community
- **Email**: For security issues, contact security@lovable.com

## 📄 Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

Thank you for contributing to Lovable! 🚀