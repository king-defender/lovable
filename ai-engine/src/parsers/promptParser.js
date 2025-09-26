/**
 * Natural Language Prompt Parser
 * Analyzes user prompts to extract component requirements
 */
export class PromptParser {
  constructor() {
    this.componentTypes = [
      'button', 'form', 'input', 'card', 'modal', 'navbar', 'footer', 
      'sidebar', 'table', 'list', 'grid', 'chart', 'gallery'
    ];
    
    this.styleKeywords = [
      'responsive', 'mobile', 'desktop', 'dark', 'light', 'colorful',
      'minimal', 'modern', 'classic', 'rounded', 'shadow'
    ];
    
    this.functionalityKeywords = [
      'click', 'hover', 'submit', 'validate', 'search', 'filter',
      'sort', 'toggle', 'dropdown', 'animation', 'loading'
    ];
  }

  /**
   * Parse natural language prompt into structured requirements
   */
  async parse(prompt, context = {}) {
    const requirements = {
      componentType: this.extractComponentType(prompt),
      features: this.extractFeatures(prompt),
      styling: this.extractStyling(prompt),
      interactions: this.extractInteractions(prompt),
      props: this.extractProps(prompt),
      complexity: this.assessComplexity(prompt),
      context
    };

    return requirements;
  }

  /**
   * Extract the main component type from prompt
   */
  extractComponentType(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    for (const type of this.componentTypes) {
      if (lowerPrompt.includes(type)) {
        return type;
      }
    }
    
    // Fallback: try to infer from common patterns
    if (lowerPrompt.includes('show') || lowerPrompt.includes('display')) {
      return 'display';
    }
    if (lowerPrompt.includes('collect') || lowerPrompt.includes('enter')) {
      return 'form';
    }
    if (lowerPrompt.includes('navigate') || lowerPrompt.includes('menu')) {
      return 'navigation';
    }
    
    return 'generic';
  }

  /**
   * Extract feature requirements
   */
  extractFeatures(prompt) {
    const features = [];
    const lowerPrompt = prompt.toLowerCase();

    // Form features
    if (lowerPrompt.includes('validation')) features.push('validation');
    if (lowerPrompt.includes('required')) features.push('required-fields');
    if (lowerPrompt.includes('email')) features.push('email-validation');
    
    // Interactive features
    if (lowerPrompt.includes('search')) features.push('search');
    if (lowerPrompt.includes('filter')) features.push('filter');
    if (lowerPrompt.includes('sort')) features.push('sorting');
    if (lowerPrompt.includes('pagination')) features.push('pagination');
    
    // Data features
    if (lowerPrompt.includes('api') || lowerPrompt.includes('fetch')) features.push('api-integration');
    if (lowerPrompt.includes('database')) features.push('database-connection');
    
    // UI features
    if (lowerPrompt.includes('responsive')) features.push('responsive');
    if (lowerPrompt.includes('animation')) features.push('animations');
    if (lowerPrompt.includes('loading')) features.push('loading-states');
    
    return features;
  }

  /**
   * Extract styling requirements
   */
  extractStyling(prompt) {
    const styling = {
      theme: 'light',
      colors: [],
      layout: 'default',
      size: 'medium'
    };

    const lowerPrompt = prompt.toLowerCase();

    // Theme
    if (lowerPrompt.includes('dark')) styling.theme = 'dark';
    
    // Colors
    const colorRegex = /(red|blue|green|yellow|purple|pink|orange|gray|black|white)/g;
    const colors = prompt.match(colorRegex);
    if (colors) styling.colors = [...new Set(colors)];

    // Size
    if (lowerPrompt.includes('small') || lowerPrompt.includes('compact')) {
      styling.size = 'small';
    } else if (lowerPrompt.includes('large') || lowerPrompt.includes('big')) {
      styling.size = 'large';
    }

    // Layout hints
    if (lowerPrompt.includes('grid')) styling.layout = 'grid';
    if (lowerPrompt.includes('flex') || lowerPrompt.includes('horizontal')) {
      styling.layout = 'flex';
    }
    if (lowerPrompt.includes('vertical') || lowerPrompt.includes('column')) {
      styling.layout = 'column';
    }

    return styling;
  }

  /**
   * Extract interaction requirements
   */
  extractInteractions(prompt) {
    const interactions = [];
    const lowerPrompt = prompt.toLowerCase();

    // Click interactions
    if (lowerPrompt.includes('click') || lowerPrompt.includes('button')) {
      interactions.push('onClick');
    }
    
    // Form interactions
    if (lowerPrompt.includes('submit')) interactions.push('onSubmit');
    if (lowerPrompt.includes('change') || lowerPrompt.includes('input')) {
      interactions.push('onChange');
    }
    
    // Hover effects
    if (lowerPrompt.includes('hover')) interactions.push('onHover');
    
    // Focus states
    if (lowerPrompt.includes('focus')) interactions.push('onFocus');

    return interactions;
  }

  /**
   * Extract potential props from prompt
   */
  extractProps(prompt) {
    const props = {};
    
    // Extract quoted strings as potential prop values
    const quotedStrings = prompt.match(/"([^"]+)"|'([^']+)'/g);
    if (quotedStrings) {
      props.title = quotedStrings[0]?.replace(/['"]/g, '');
    }

    // Extract numbers
    const numbers = prompt.match(/\b\d+\b/g);
    if (numbers) {
      props.count = parseInt(numbers[0]);
    }

    // Extract boolean-like words
    if (prompt.toLowerCase().includes('disabled')) props.disabled = true;
    if (prompt.toLowerCase().includes('required')) props.required = true;
    if (prompt.toLowerCase().includes('loading')) props.loading = true;

    return props;
  }

  /**
   * Assess the complexity of the requested component
   */
  assessComplexity(prompt) {
    let complexity = 1; // Base complexity
    
    // Add complexity for features
    if (prompt.includes('validation')) complexity += 1;
    if (prompt.includes('api') || prompt.includes('fetch')) complexity += 2;
    if (prompt.includes('animation')) complexity += 1;
    if (prompt.includes('responsive')) complexity += 1;
    
    // Add complexity for multiple components
    const componentCount = (prompt.match(/\band\b/g) || []).length;
    complexity += componentCount;
    
    // Word count as complexity indicator
    const wordCount = prompt.split(' ').length;
    if (wordCount > 30) complexity += 1;
    if (wordCount > 50) complexity += 2;

    return Math.min(complexity, 10); // Cap at 10
  }
}