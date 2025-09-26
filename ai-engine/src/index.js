import dotenv from 'dotenv';
import { PromptParser } from './parsers/promptParser.js';
import { ComponentGenerator } from './generators/componentGenerator.js';
import { CodeValidator } from './validators/codeValidator.js';

// Load environment variables
dotenv.config();

/**
 * Main AI Engine class
 */
class AIEngine {
  constructor() {
    this.promptParser = new PromptParser();
    this.componentGenerator = new ComponentGenerator();
    this.codeValidator = new CodeValidator();
  }

  /**
   * Process natural language prompt and generate React component
   */
  async processPrompt(prompt, context = {}) {
    try {
      console.log('🤖 Processing prompt:', prompt);

      // 1. Parse and analyze the prompt
      const parsedPrompt = await this.promptParser.parse(prompt, context);
      console.log('📝 Parsed prompt:', parsedPrompt);

      // 2. Generate component based on parsed requirements
      const generatedComponent = await this.componentGenerator.generate(parsedPrompt);
      console.log('⚛️ Generated component:', generatedComponent.name);

      // 3. Validate the generated code
      const validation = await this.codeValidator.validate(generatedComponent.code);
      console.log('✅ Validation result:', validation.isValid ? 'PASSED' : 'FAILED');

      // 4. Return complete result
      return {
        success: true,
        data: {
          ...generatedComponent,
          validation,
          metadata: {
            processedAt: new Date().toISOString(),
            prompt: parsedPrompt,
            context
          }
        }
      };
    } catch (error) {
      console.error('❌ AI Engine error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Refine existing component based on feedback
   */
  async refineComponent(code, feedback, context = {}) {
    try {
      console.log('🔧 Refining component with feedback:', feedback);

      // Parse feedback
      const parsedFeedback = await this.promptParser.parse(feedback, { 
        ...context, 
        existingCode: code 
      });

      // Generate refined version
      const refinedComponent = await this.componentGenerator.refine(code, parsedFeedback);

      // Validate refined code
      const validation = await this.codeValidator.validate(refinedComponent.code);

      return {
        success: true,
        data: {
          ...refinedComponent,
          validation,
          metadata: {
            refinedAt: new Date().toISOString(),
            feedback: parsedFeedback,
            context
          }
        }
      };
    } catch (error) {
      console.error('❌ Component refinement error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Analyze code quality and provide suggestions
   */
  async analyzeCode(code) {
    try {
      console.log('🔍 Analyzing code quality...');

      const analysis = await this.codeValidator.analyze(code);

      return {
        success: true,
        data: analysis
      };
    } catch (error) {
      console.error('❌ Code analysis error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }
}

// Export singleton instance
export const aiEngine = new AIEngine();

// CLI interface for testing
if (process.argv[2] === 'test') {
  const testPrompt = process.argv[3] || 'Create a simple button component';
  
  aiEngine.processPrompt(testPrompt)
    .then(result => {
      console.log('\n🎉 Result:', JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error('\n💥 Error:', error);
    });
}

export default AIEngine;