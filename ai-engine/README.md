# Lovable AI Engine

AI processing engine for natural language to React component generation.

## Features

- **Natural Language Processing**: Parse user prompts into structured requirements
- **Component Generation**: Create React components using OpenAI GPT-4
- **Code Validation**: Analyze and validate generated code
- **Component Templates**: Pre-built templates for common components
- **Performance Analysis**: Code quality and performance assessment

## Components

### Prompt Parser
Analyzes natural language prompts to extract:
- Component type (button, form, modal, etc.)
- Features and functionality requirements
- Styling preferences
- Interaction patterns
- Props and configuration

### Component Generator
Generates React components using:
- OpenAI GPT-4 integration
- Template-based generation
- Context-aware code generation
- TypeScript interface generation
- Tailwind CSS styling

### Code Validator
Validates generated code for:
- Syntax correctness
- React best practices
- Performance optimization
- Accessibility compliance
- Security issues

## Getting Started

### Prerequisites
- Node.js 18+
- OpenAI API key

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp ../.env.example .env
   # Add your OpenAI API key
   ```

3. Test the engine:
   ```bash
   npm run dev test "Create a login form with email and password fields"
   ```

## Available Scripts

- `npm start` - Start the AI engine service
- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Usage

### Basic Component Generation

```javascript
import { aiEngine } from './src/index.js';

const result = await aiEngine.processPrompt(
  "Create a responsive contact form with name, email, and message fields",
  { 
    projectType: 'landing-page',
    stylePreference: 'modern'
  }
);

console.log(result.data.code);
```

### Component Refinement

```javascript
const refinedResult = await aiEngine.refineComponent(
  existingCode,
  "Make the form validation more user-friendly",
  { preserveFeatures: ['responsive', 'accessibility'] }
);
```

### Code Analysis

```javascript
const analysis = await aiEngine.analyzeCode(componentCode);
console.log(analysis.data.suggestions);
```

## Prompt Parsing

The prompt parser extracts structured requirements from natural language:

```javascript
import { PromptParser } from './src/parsers/promptParser.js';

const parser = new PromptParser();
const requirements = await parser.parse(
  "Create a dark theme navigation bar with dropdown menus"
);

// Output:
// {
//   componentType: 'navbar',
//   features: ['dropdown'],
//   styling: { theme: 'dark' },
//   complexity: 5
// }
```

## Component Templates

Pre-built templates for common components:

- **Button**: Basic button with variants
- **Form**: Form with validation
- **Card**: Content card layout
- **Modal**: Modal dialog
- **Generic**: Base template for custom components

## Code Validation Rules

The validator checks for:

### Syntax & Structure
- Valid JavaScript/TypeScript syntax
- Proper React component structure
- Correct import/export statements

### Best Practices
- Functional components with hooks
- Proper naming conventions
- TypeScript interfaces
- Accessibility attributes

### Performance
- Optimized re-rendering
- Proper dependency arrays
- Memory leak prevention

### Security
- Safe HTML rendering
- Input sanitization
- XSS prevention

## Configuration

Environment variables:

- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_MODEL` - GPT model (default: gpt-4)
- `OPENAI_MAX_TOKENS` - Maximum tokens per request

## API Reference

### AIEngine.processPrompt(prompt, context)
Process natural language prompt and generate component.

**Parameters:**
- `prompt` (string): Natural language description
- `context` (object): Additional context and preferences

**Returns:**
- Promise resolving to generation result

### AIEngine.refineComponent(code, feedback, context)
Refine existing component based on feedback.

**Parameters:**
- `code` (string): Existing component code
- `feedback` (string): Refinement instructions
- `context` (object): Refinement context

**Returns:**
- Promise resolving to refined component

### AIEngine.analyzeCode(code)
Analyze component code quality and provide suggestions.

**Parameters:**
- `code` (string): Component code to analyze

**Returns:**
- Promise resolving to analysis results

## Contributing

1. Follow existing code patterns
2. Add tests for new features
3. Update documentation
4. Ensure prompt parsing accuracy