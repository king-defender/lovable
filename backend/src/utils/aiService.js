import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate React component from natural language description
 */
export const generateComponent = async (prompt, context = {}) => {
  try {
    const systemPrompt = `You are an expert React developer. Generate clean, modern React components based on user descriptions.

Guidelines:
- Use functional components with hooks
- Include proper JSX structure
- Add Tailwind CSS classes for styling
- Include prop validation when appropriate
- Make components responsive
- Add comments for complex logic
- Follow React best practices

Context: ${JSON.stringify(context)}

Return only the component code without explanations.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 4000,
      temperature: 0.7,
    });

    const generatedCode = response.choices[0].message.content;
    
    // Extract component name from code
    const componentNameMatch = generatedCode.match(/const\s+(\w+)\s*=/);
    const componentName = componentNameMatch ? componentNameMatch[1] : 'GeneratedComponent';
    
    // Analyze dependencies
    const dependencies = extractDependencies(generatedCode);
    
    return {
      component: componentName,
      code: generatedCode,
      dependencies,
      metadata: {
        prompt,
        context,
        generatedAt: new Date().toISOString(),
        model: process.env.OPENAI_MODEL || 'gpt-4',
        tokensUsed: response.usage?.total_tokens || 0
      }
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate component: ${error.message}`);
  }
};

/**
 * Refine existing component code based on feedback
 */
export const refineComponent = async (code, feedback, context = {}) => {
  try {
    const systemPrompt = `You are an expert React developer. Refine the given React component based on user feedback.

Guidelines:
- Maintain the existing component structure
- Apply requested changes carefully
- Improve code quality while preserving functionality
- Add comments for new or modified sections
- Ensure the component remains functional after changes

Original code:
${code}

Context: ${JSON.stringify(context)}

Apply the following feedback and return the improved component code:`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: feedback }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 4000,
      temperature: 0.5,
    });

    const refinedCode = response.choices[0].message.content;
    
    return {
      code: refinedCode,
      changes: extractChanges(code, refinedCode),
      metadata: {
        originalPrompt: feedback,
        context,
        refinedAt: new Date().toISOString(),
        model: process.env.OPENAI_MODEL || 'gpt-4',
        tokensUsed: response.usage?.total_tokens || 0
      }
    };
  } catch (error) {
    console.error('Component refinement error:', error);
    throw new Error(`Failed to refine component: ${error.message}`);
  }
};

/**
 * Extract dependencies from React component code
 */
const extractDependencies = (code) => {
  const dependencies = new Set(['react']);
  
  // Common patterns to detect dependencies
  const patterns = [
    /import.*from\s+['"]([^'"]+)['"]/g,
    /require\(['"]([^'"]+)['"]\)/g,
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      const dep = match[1];
      if (!dep.startsWith('./') && !dep.startsWith('../')) {
        dependencies.add(dep);
      }
    }
  });
  
  // Add common React ecosystem dependencies if patterns found
  if (code.includes('useState') || code.includes('useEffect')) {
    dependencies.add('react');
  }
  if (code.includes('className=')) {
    dependencies.add('tailwindcss');
  }
  if (code.includes('axios') || code.includes('fetch')) {
    dependencies.add('axios');
  }
  
  return Array.from(dependencies);
};

/**
 * Extract changes between original and refined code
 */
const extractChanges = (originalCode, refinedCode) => {
  // Simple diff - in production, use a proper diff library
  const changes = [];
  
  if (originalCode !== refinedCode) {
    changes.push('Component code has been updated');
    
    // Basic pattern detection for common changes
    if (refinedCode.length > originalCode.length * 1.1) {
      changes.push('Added new functionality');
    }
    if (refinedCode.includes('useState') && !originalCode.includes('useState')) {
      changes.push('Added state management');
    }
    if (refinedCode.includes('useEffect') && !originalCode.includes('useEffect')) {
      changes.push('Added side effects');
    }
  }
  
  return changes;
};