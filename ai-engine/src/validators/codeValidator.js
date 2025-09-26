import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import prettier from 'prettier';

/**
 * Code Validator
 * Validates and analyzes generated React code
 */
export class CodeValidator {
  constructor() {
    this.rules = {
      // Syntax rules
      syntaxValid: true,
      hasReactImport: false,
      hasDefaultExport: false,
      
      // Best practices
      usesFunctionalComponent: false,
      hasProperNaming: false,
      hasTypeScript: false,
      hasAccessibility: false,
      
      // Performance
      hasUnnecessaryRerenders: false,
      hasMemoryLeaks: false,
      
      // Security
      hasDangerousHTML: false,
      hasUnsafeProps: false
    };
  }

  /**
   * Validate React component code
   */
  async validate(code) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
      score: 0,
      details: { ...this.rules }
    };

    try {
      // Parse the code
      const ast = this.parseCode(code);
      
      // Run validation checks
      this.checkSyntax(ast, validation);
      this.checkReactPatterns(ast, validation);
      this.checkBestPractices(code, validation);
      this.checkAccessibility(code, validation);
      this.checkPerformance(code, validation);
      this.checkSecurity(code, validation);
      
      // Calculate overall score
      validation.score = this.calculateScore(validation);
      
      // Format code if valid
      if (validation.isValid) {
        validation.formattedCode = await this.formatCode(code);
      }
      
    } catch (error) {
      validation.isValid = false;
      validation.errors.push(`Syntax error: ${error.message}`);
    }

    return validation;
  }

  /**
   * Analyze code quality and provide suggestions
   */
  async analyze(code) {
    const analysis = {
      quality: 'good',
      complexity: 'medium',
      maintainability: 'high',
      performance: 'good',
      security: 'secure',
      suggestions: [],
      metrics: {
        linesOfCode: 0,
        cyclomaticComplexity: 0,
        dependencies: [],
        components: 0
      }
    };

    try {
      const ast = this.parseCode(code);
      
      // Analyze metrics
      analysis.metrics = this.analyzeMetrics(code, ast);
      
      // Assess quality
      analysis.quality = this.assessQuality(analysis.metrics);
      analysis.complexity = this.assessComplexity(analysis.metrics);
      analysis.maintainability = this.assessMaintainability(code, ast);
      analysis.performance = this.assessPerformance(code, ast);
      analysis.security = this.assessSecurity(code);
      
      // Generate suggestions
      analysis.suggestions = this.generateSuggestions(code, ast, analysis);
      
    } catch (error) {
      analysis.quality = 'poor';
      analysis.suggestions.push(`Fix syntax errors: ${error.message}`);
    }

    return analysis;
  }

  /**
   * Parse JavaScript/TypeScript code into AST
   */
  parseCode(code) {
    return parse(code, {
      sourceType: 'module',
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      plugins: [
        'jsx',
        'typescript',
        'decorators-legacy',
        'classProperties',
        'objectRestSpread',
        'functionBind',
        'exportDefaultFrom',
        'dynamicImport'
      ]
    });
  }

  /**
   * Check basic syntax validity
   */
  checkSyntax(ast, validation) {
    try {
      // If we got here, basic parsing succeeded
      validation.details.syntaxValid = true;
    } catch (error) {
      validation.isValid = false;
      validation.errors.push(`Syntax error: ${error.message}`);
      validation.details.syntaxValid = false;
    }
  }

  /**
   * Check React-specific patterns
   */
  checkReactPatterns(ast, validation) {
    let hasReactImport = false;
    let hasDefaultExport = false;
    let usesFunctionalComponent = false;
    let hasProperNaming = false;

    traverse(ast, {
      ImportDeclaration(path) {
        if (path.node.source.value === 'react') {
          hasReactImport = true;
        }
      },
      
      ExportDefaultDeclaration(path) {
        hasDefaultExport = true;
      },
      
      FunctionDeclaration(path) {
        const name = path.node.id?.name;
        if (name && /^[A-Z]/.test(name)) {
          usesFunctionalComponent = true;
          hasProperNaming = true;
        }
      },
      
      VariableDeclarator(path) {
        if (path.node.init?.type === 'ArrowFunctionExpression') {
          const name = path.node.id?.name;
          if (name && /^[A-Z]/.test(name)) {
            usesFunctionalComponent = true;
            hasProperNaming = true;
          }
        }
      }
    });

    validation.details.hasReactImport = hasReactImport;
    validation.details.hasDefaultExport = hasDefaultExport;
    validation.details.usesFunctionalComponent = usesFunctionalComponent;
    validation.details.hasProperNaming = hasProperNaming;

    if (!hasReactImport) {
      validation.warnings.push('Missing React import');
    }
    if (!hasDefaultExport) {
      validation.warnings.push('Missing default export');
    }
    if (!usesFunctionalComponent) {
      validation.suggestions.push('Consider using functional components');
    }
  }

  /**
   * Check best practices
   */
  checkBestPractices(code, validation) {
    // TypeScript check
    const hasTypeScript = code.includes('interface') || code.includes(': React.FC');
    validation.details.hasTypeScript = hasTypeScript;
    
    if (!hasTypeScript) {
      validation.suggestions.push('Consider adding TypeScript for better type safety');
    }

    // Props validation
    if (!code.includes('interface') && !code.includes('PropTypes')) {
      validation.suggestions.push('Add prop validation with TypeScript interfaces or PropTypes');
    }

    // Key prop in lists
    if (code.includes('.map(') && !code.includes('key=')) {
      validation.warnings.push('Missing key prop in list items');
    }
  }

  /**
   * Check accessibility
   */
  checkAccessibility(code, validation) {
    let hasAccessibility = false;

    // Check for ARIA attributes
    if (code.includes('aria-') || code.includes('role=')) {
      hasAccessibility = true;
    }

    // Check for semantic HTML
    const semanticTags = ['button', 'form', 'label', 'input', 'nav', 'main', 'section', 'article'];
    semanticTags.forEach(tag => {
      if (code.includes(`<${tag}`)) {
        hasAccessibility = true;
      }
    });

    validation.details.hasAccessibility = hasAccessibility;

    if (!hasAccessibility) {
      validation.suggestions.push('Consider adding accessibility attributes (ARIA labels, semantic HTML)');
    }

    // Check for button accessibility
    if (code.includes('<div') && code.includes('onClick') && !code.includes('role="button"')) {
      validation.warnings.push('Use button element or add role="button" for clickable divs');
    }
  }

  /**
   * Check performance issues
   */
  checkPerformance(code, validation) {
    // Check for inline functions in JSX
    if (code.includes('onClick={() =>') || code.includes('onChange={() =>')) {
      validation.warnings.push('Avoid inline functions in JSX for better performance');
      validation.suggestions.push('Extract event handlers to useCallback or component methods');
    }

    // Check for missing dependencies in useEffect
    if (code.includes('useEffect') && !code.includes('// eslint-disable-next-line')) {
      validation.suggestions.push('Ensure useEffect dependencies are correctly specified');
    }

    // Check for unnecessary re-renders
    if (code.includes('useState') && !code.includes('useMemo') && !code.includes('useCallback')) {
      validation.suggestions.push('Consider using useMemo/useCallback for expensive operations');
    }
  }

  /**
   * Check security issues
   */
  checkSecurity(code, validation) {
    // Check for dangerouslySetInnerHTML
    if (code.includes('dangerouslySetInnerHTML')) {
      validation.warnings.push('Avoid dangerouslySetInnerHTML to prevent XSS attacks');
      validation.details.hasDangerousHTML = true;
    }

    // Check for eval usage
    if (code.includes('eval(')) {
      validation.errors.push('Avoid using eval() - security risk');
      validation.isValid = false;
    }

    // Check for direct DOM manipulation
    if (code.includes('document.') || code.includes('window.')) {
      validation.warnings.push('Minimize direct DOM manipulation in React components');
    }
  }

  /**
   * Calculate overall validation score
   */
  calculateScore(validation) {
    let score = 100;

    // Deduct for errors
    score -= validation.errors.length * 20;
    
    // Deduct for warnings
    score -= validation.warnings.length * 5;
    
    // Add points for good practices
    if (validation.details.hasReactImport) score += 5;
    if (validation.details.hasDefaultExport) score += 5;
    if (validation.details.usesFunctionalComponent) score += 10;
    if (validation.details.hasTypeScript) score += 15;
    if (validation.details.hasAccessibility) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Analyze code metrics
   */
  analyzeMetrics(code, ast) {
    const metrics = {
      linesOfCode: code.split('\n').length,
      cyclomaticComplexity: 1,
      dependencies: [],
      components: 0
    };

    traverse(ast, {
      ImportDeclaration(path) {
        metrics.dependencies.push(path.node.source.value);
      },
      
      FunctionDeclaration(path) {
        if (path.node.id?.name && /^[A-Z]/.test(path.node.id.name)) {
          metrics.components++;
        }
      },
      
      // Count complexity
      IfStatement() { metrics.cyclomaticComplexity++; },
      WhileStatement() { metrics.cyclomaticComplexity++; },
      ForStatement() { metrics.cyclomaticComplexity++; },
      SwitchCase() { metrics.cyclomaticComplexity++; },
      ConditionalExpression() { metrics.cyclomaticComplexity++; }
    });

    return metrics;
  }

  /**
   * Assess code quality
   */
  assessQuality(metrics) {
    if (metrics.cyclomaticComplexity > 10) return 'poor';
    if (metrics.cyclomaticComplexity > 5) return 'fair';
    if (metrics.linesOfCode > 200) return 'fair';
    return 'good';
  }

  /**
   * Assess complexity
   */
  assessComplexity(metrics) {
    if (metrics.cyclomaticComplexity > 8) return 'high';
    if (metrics.cyclomaticComplexity > 4) return 'medium';
    return 'low';
  }

  /**
   * Assess maintainability
   */
  assessMaintainability(code, ast) {
    // Simple heuristics
    if (code.includes('interface') && code.includes('// ')) return 'high';
    if (code.includes('// ') || code.includes('/* ')) return 'medium';
    return 'low';
  }

  /**
   * Assess performance
   */
  assessPerformance(code, ast) {
    if (code.includes('useMemo') || code.includes('useCallback')) return 'excellent';
    if (code.includes('onClick={() =>')) return 'fair';
    return 'good';
  }

  /**
   * Assess security
   */
  assessSecurity(code) {
    if (code.includes('dangerouslySetInnerHTML') || code.includes('eval(')) return 'vulnerable';
    return 'secure';
  }

  /**
   * Generate improvement suggestions
   */
  generateSuggestions(code, ast, analysis) {
    const suggestions = [];

    if (analysis.quality === 'poor') {
      suggestions.push('Refactor to reduce complexity');
    }
    
    if (analysis.complexity === 'high') {
      suggestions.push('Break down into smaller components');
    }
    
    if (!code.includes('interface')) {
      suggestions.push('Add TypeScript interfaces for better type safety');
    }
    
    if (analysis.performance !== 'excellent') {
      suggestions.push('Optimize performance with memoization');
    }

    return suggestions;
  }

  /**
   * Format code using Prettier
   */
  async formatCode(code) {
    try {
      return await prettier.format(code, {
        parser: 'typescript',
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5'
      });
    } catch (error) {
      return code; // Return original if formatting fails
    }
  }
}