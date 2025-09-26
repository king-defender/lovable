import OpenAI from 'openai';

/**
 * OpenAI integration service for Lovable
 */
export class OpenAIService {
  constructor(apiKey = process.env.OPENAI_API_KEY) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({ apiKey });
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
    this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS) || 4000;
  }

  /**
   * Generate React component from natural language description
   */
  async generateComponent(prompt, context = {}) {
    try {
      const systemPrompt = this.buildSystemPrompt('component');
      const userPrompt = this.buildComponentPrompt(prompt, context);

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.7,
      });

      return this.processResponse(response, prompt, context);
    } catch (error) {
      throw new Error(`OpenAI component generation failed: ${error.message}`);
    }
  }

  /**
   * Refine existing component based on feedback
   */
  async refineComponent(code, feedback, context = {}) {
    try {
      const systemPrompt = this.buildSystemPrompt('refinement');
      const userPrompt = this.buildRefinementPrompt(code, feedback, context);

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.5,
      });

      return this.processResponse(response, feedback, context);
    } catch (error) {
      throw new Error(`OpenAI component refinement failed: ${error.message}`);
    }
  }

  /**
   * Generate CSS styles for component
   */
  async generateStyles(componentCode, styleRequirements) {
    try {
      const systemPrompt = this.buildSystemPrompt('styling');
      const userPrompt = `Generate Tailwind CSS classes for this React component based on requirements:

Component:
\`\`\`jsx
${componentCode}
\`\`\`

Style Requirements: ${styleRequirements}

Return only the updated component code with improved Tailwind classes.`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.3,
      });

      return this.processResponse(response, styleRequirements, {});
    } catch (error) {
      throw new Error(`OpenAI style generation failed: ${error.message}`);
    }
  }

  /**
   * Analyze component code and provide suggestions
   */
  async analyzeComponent(code) {
    try {
      const systemPrompt = `You are a React expert. Analyze the given component code and provide:
1. Code quality assessment
2. Performance optimizations
3. Accessibility improvements
4. Best practice recommendations
5. Security considerations

Return your analysis in JSON format.`;

      const userPrompt = `Analyze this React component:

\`\`\`jsx
${code}
\`\`\``;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.2,
      });

      const analysis = response.choices[0].message.content;
      
      try {
        return JSON.parse(analysis);
      } catch {
        return { analysis, raw: true };
      }
    } catch (error) {
      throw new Error(`OpenAI code analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate test cases for component
   */
  async generateTests(componentCode, testingFramework = 'jest') {
    try {
      const systemPrompt = `You are a testing expert. Generate comprehensive test cases for React components using ${testingFramework} and React Testing Library.

Include tests for:
- Component rendering
- Props handling
- User interactions
- Edge cases
- Accessibility

Return only the test code without explanations.`;

      const userPrompt = `Generate tests for this component:

\`\`\`jsx
${componentCode}
\`\`\``;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.3,
      });

      return {
        tests: response.choices[0].message.content,
        framework: testingFramework,
        tokensUsed: response.usage?.total_tokens || 0
      };
    } catch (error) {
      throw new Error(`OpenAI test generation failed: ${error.message}`);
    }
  }

  /**
   * Build system prompt for different tasks
   */
  buildSystemPrompt(taskType) {
    const basePrompt = `You are an expert React developer with deep knowledge of modern web development practices.`;

    const taskPrompts = {
      component: `${basePrompt}

Generate clean, functional, and production-ready React components based on user descriptions.

Guidelines:
- Use functional components with hooks
- Include TypeScript interfaces for props
- Apply Tailwind CSS for styling
- Ensure accessibility (ARIA labels, semantic HTML)
- Make components responsive
- Include proper error handling
- Follow React best practices
- Add meaningful comments for complex logic
- Ensure code is maintainable and scalable

Return only the component code without markdown formatting or explanations.`,

      refinement: `${basePrompt}

Refine existing React components based on user feedback while maintaining functionality.

Guidelines:
- Preserve existing component structure when possible
- Apply requested changes carefully
- Improve code quality
- Enhance performance where applicable
- Maintain or improve accessibility
- Keep changes minimal but effective
- Add comments for new or modified sections

Return only the improved component code.`,

      styling: `${basePrompt}

Enhance React components with better Tailwind CSS styling based on design requirements.

Guidelines:
- Use Tailwind utility classes effectively
- Ensure responsive design
- Apply consistent color schemes
- Create visually appealing interfaces
- Maintain accessibility standards
- Use appropriate spacing and typography
- Consider dark mode compatibility

Return only the updated component code with improved styling.`
    };

    return taskPrompts[taskType] || taskPrompts.component;
  }

  /**
   * Build component generation prompt
   */
  buildComponentPrompt(prompt, context) {
    let fullPrompt = `Create a React component: ${prompt}`;

    if (context.projectType) {
      fullPrompt += `\n\nProject type: ${context.projectType}`;
    }

    if (context.designSystem) {
      fullPrompt += `\n\nDesign system: ${context.designSystem}`;
    }

    if (context.existingComponents) {
      fullPrompt += `\n\nExisting components to integrate with: ${context.existingComponents.join(', ')}`;
    }

    if (context.requirements) {
      fullPrompt += `\n\nAdditional requirements: ${JSON.stringify(context.requirements)}`;
    }

    return fullPrompt;
  }

  /**
   * Build refinement prompt
   */
  buildRefinementPrompt(code, feedback, context) {
    let prompt = `Refine this React component based on the feedback:

Current component:
\`\`\`jsx
${code}
\`\`\`

Feedback: ${feedback}`;

    if (context.preserveFeatures) {
      prompt += `\n\nPreserve these features: ${context.preserveFeatures.join(', ')}`;
    }

    if (context.focusAreas) {
      prompt += `\n\nFocus on these areas: ${context.focusAreas.join(', ')}`;
    }

    return prompt;
  }

  /**
   * Process API response
   */
  processResponse(response, originalPrompt, context) {
    const generatedCode = response.choices[0].message.content;
    const componentName = this.extractComponentName(generatedCode);
    
    return {
      code: generatedCode,
      componentName,
      tokensUsed: response.usage?.total_tokens || 0,
      model: this.model,
      metadata: {
        originalPrompt,
        context,
        generatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Extract component name from generated code
   */
  extractComponentName(code) {
    const matches = code.match(/(?:const|function)\s+(\w+)\s*[=\(]/);
    return matches ? matches[1] : 'GeneratedComponent';
  }

  /**
   * Estimate token count for prompt
   */
  estimateTokens(text) {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Check if prompt is within token limits
   */
  validatePromptLength(prompt) {
    const estimatedTokens = this.estimateTokens(prompt);
    const maxPromptTokens = this.maxTokens * 0.7; // Leave room for response
    
    if (estimatedTokens > maxPromptTokens) {
      throw new Error(`Prompt too long: ${estimatedTokens} tokens (max: ${maxPromptTokens})`);
    }
    
    return true;
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();