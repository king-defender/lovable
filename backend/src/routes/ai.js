import express from 'express';
import { generateComponent } from '../utils/aiService.js';
import { validatePrompt } from '../middleware/validation.js';

const router = express.Router();

/**
 * POST /api/ai/generate-component
 * Generate React component from natural language description
 */
router.post('/generate-component', validatePrompt, async (req, res) => {
  try {
    const { prompt, context = {} } = req.body;
    
    console.log('Generating component for prompt:', prompt);
    
    const result = await generateComponent(prompt, context);
    
    res.json({
      success: true,
      data: {
        component: result.component,
        code: result.code,
        dependencies: result.dependencies,
        metadata: result.metadata
      }
    });
  } catch (error) {
    console.error('Component generation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate component',
      message: error.message
    });
  }
});

/**
 * POST /api/ai/refine-component
 * Refine existing component based on feedback
 */
router.post('/refine-component', async (req, res) => {
  try {
    const { code, feedback, context = {} } = req.body;
    
    if (!code || !feedback) {
      return res.status(400).json({
        success: false,
        error: 'Both code and feedback are required'
      });
    }
    
    // TODO: Implement component refinement logic
    res.json({
      success: true,
      data: {
        refinedCode: code, // Placeholder
        changes: ['Updated styling', 'Added validation'],
        suggestions: ['Consider adding error handling', 'Add responsive design']
      }
    });
  } catch (error) {
    console.error('Component refinement failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refine component',
      message: error.message
    });
  }
});

/**
 * POST /api/ai/analyze-code
 * Analyze React code for improvements and suggestions
 */
router.post('/analyze-code', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required for analysis'
      });
    }
    
    // TODO: Implement code analysis logic
    res.json({
      success: true,
      data: {
        quality: 85,
        suggestions: [
          'Consider using TypeScript for better type safety',
          'Add error boundaries for better error handling',
          'Optimize component for better performance'
        ],
        issues: [],
        dependencies: ['react', 'react-dom']
      }
    });
  } catch (error) {
    console.error('Code analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze code',
      message: error.message
    });
  }
});

export default router;