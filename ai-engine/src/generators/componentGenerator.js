import OpenAI from 'openai';

/**
 * React Component Generator
 * Generates React components based on parsed requirements
 */
export class ComponentGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.templates = {
      button: this.getButtonTemplate(),
      form: this.getFormTemplate(),
      card: this.getCardTemplate(),
      modal: this.getModalTemplate(),
      generic: this.getGenericTemplate()
    };
  }

  /**
   * Generate React component from parsed requirements
   */
  async generate(requirements) {
    try {
      const template = this.getTemplate(requirements.componentType);
      const prompt = this.buildGenerationPrompt(requirements, template);
      
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: this.getSystemPrompt() },
          { role: 'user', content: prompt }
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 4000,
        temperature: 0.7,
      });

      const generatedCode = response.choices[0].message.content;
      const componentName = this.extractComponentName(generatedCode);
      
      return {
        name: componentName,
        code: generatedCode,
        dependencies: this.extractDependencies(generatedCode),
        props: this.extractPropsFromCode(generatedCode),
        metadata: {
          requirements,
          generatedAt: new Date().toISOString(),
          tokensUsed: response.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      throw new Error(`Component generation failed: ${error.message}`);
    }
  }

  /**
   * Refine existing component based on feedback
   */
  async refine(existingCode, requirements) {
    try {
      const prompt = this.buildRefinementPrompt(existingCode, requirements);
      
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: this.getSystemPrompt() },
          { role: 'user', content: prompt }
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 4000,
        temperature: 0.5,
      });

      const refinedCode = response.choices[0].message.content;
      const componentName = this.extractComponentName(refinedCode);
      
      return {
        name: componentName,
        code: refinedCode,
        dependencies: this.extractDependencies(refinedCode),
        changes: this.identifyChanges(existingCode, refinedCode),
        metadata: {
          requirements,
          refinedAt: new Date().toISOString(),
          tokensUsed: response.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      throw new Error(`Component refinement failed: ${error.message}`);
    }
  }

  /**
   * Get system prompt for AI
   */
  getSystemPrompt() {
    return `You are an expert React developer. Generate clean, modern, and functional React components.

Guidelines:
- Use functional components with hooks
- Include proper TypeScript interfaces when appropriate
- Apply Tailwind CSS for styling
- Ensure components are accessible (ARIA labels, semantic HTML)
- Make components responsive by default
- Include proper error handling
- Add meaningful prop validation
- Use modern React patterns and best practices
- Include helpful comments for complex logic
- Ensure code is production-ready

Always return only the component code without explanations or markdown formatting.`;
  }

  /**
   * Build generation prompt from requirements
   */
  buildGenerationPrompt(requirements, template) {
    let prompt = `Create a React ${requirements.componentType} component with the following requirements:\n\n`;
    
    // Add features
    if (requirements.features.length > 0) {
      prompt += `Features: ${requirements.features.join(', ')}\n`;
    }
    
    // Add styling requirements
    if (requirements.styling) {
      prompt += `Styling: ${JSON.stringify(requirements.styling)}\n`;
    }
    
    // Add interactions
    if (requirements.interactions.length > 0) {
      prompt += `Interactions: ${requirements.interactions.join(', ')}\n`;
    }
    
    // Add props
    if (Object.keys(requirements.props).length > 0) {
      prompt += `Props: ${JSON.stringify(requirements.props)}\n`;
    }
    
    // Add context if available
    if (requirements.context && Object.keys(requirements.context).length > 0) {
      prompt += `\nContext: ${JSON.stringify(requirements.context)}\n`;
    }
    
    // Add template as reference
    if (template) {
      prompt += `\nUse this as a starting template but customize based on requirements:\n${template}`;
    }
    
    return prompt;
  }

  /**
   * Build refinement prompt
   */
  buildRefinementPrompt(existingCode, requirements) {
    let prompt = `Refine the following React component based on these requirements:\n\n`;
    prompt += `Current code:\n\`\`\`jsx\n${existingCode}\n\`\`\`\n\n`;
    prompt += `Requirements: ${JSON.stringify(requirements, null, 2)}\n\n`;
    prompt += `Please improve the component while maintaining its core functionality.`;
    
    return prompt;
  }

  /**
   * Get template for component type
   */
  getTemplate(componentType) {
    return this.templates[componentType] || this.templates.generic;
  }

  /**
   * Extract component name from generated code
   */
  extractComponentName(code) {
    const matches = code.match(/(?:const|function)\s+(\w+)\s*[=\(]/);
    return matches ? matches[1] : 'GeneratedComponent';
  }

  /**
   * Extract dependencies from code
   */
  extractDependencies(code) {
    const dependencies = new Set(['react']);
    
    // React hooks
    if (code.includes('useState')) dependencies.add('react');
    if (code.includes('useEffect')) dependencies.add('react');
    
    // Common libraries
    if (code.includes('className')) dependencies.add('tailwindcss');
    if (code.includes('axios')) dependencies.add('axios');
    if (code.includes('motion.')) dependencies.add('framer-motion');
    
    return Array.from(dependencies);
  }

  /**
   * Extract props interface from generated code
   */
  extractPropsFromCode(code) {
    const props = {};
    
    // Extract TypeScript interface
    const interfaceMatch = code.match(/interface\s+\w+Props\s*\{([^}]+)\}/s);
    if (interfaceMatch) {
      const propsString = interfaceMatch[1];
      // Basic parsing - in production, use a proper TypeScript parser
      const propLines = propsString.split('\n').filter(line => line.trim());
      propLines.forEach(line => {
        const match = line.match(/(\w+)(\?)?:\s*(\w+)/);
        if (match) {
          props[match[1]] = {
            type: match[3],
            optional: !!match[2]
          };
        }
      });
    }
    
    return props;
  }

  /**
   * Identify changes between original and refined code
   */
  identifyChanges(originalCode, refinedCode) {
    const changes = [];
    
    if (originalCode !== refinedCode) {
      if (refinedCode.length > originalCode.length * 1.1) {
        changes.push('Added new functionality');
      }
      if (refinedCode.includes('useState') && !originalCode.includes('useState')) {
        changes.push('Added state management');
      }
      if (refinedCode.includes('useEffect') && !originalCode.includes('useEffect')) {
        changes.push('Added side effects');
      }
      if (refinedCode.includes('interface') && !originalCode.includes('interface')) {
        changes.push('Added TypeScript interfaces');
      }
    }
    
    return changes;
  }

  // Component Templates
  getButtonTemplate() {
    return `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
    >
      {children}
    </button>
  );
};

export default Button;`;
  }

  getFormTemplate() {
    return `import React, { useState } from 'react';

interface FormData {
  [key: string]: string;
}

interface FormProps {
  onSubmit: (data: FormData) => void;
  fields: Array<{ name: string; label: string; type?: string; required?: boolean }>;
}

const Form: React.FC<FormProps> = ({ onSubmit, fields }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormData>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormData = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = \`\${field.label} is required\`;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={field.type || 'text'}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;`;
  }

  getCardTemplate() {
    return `import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', onClick }) => {
  return (
    <div
      className={\`bg-white rounded-lg shadow-lg p-6 \${className} \${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow duration-200' : ''}\`}
      onClick={onClick}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;`;
  }

  getModalTemplate() {
    return `import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {title && (
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;`;
  }

  getGenericTemplate() {
    return `import React from 'react';

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({ className = '', children }) => {
  return (
    <div className={\`\${className}\`}>
      {children}
    </div>
  );
};

export default Component;`;
  }
}