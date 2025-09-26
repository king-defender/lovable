import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

/**
 * POST /api/deploy/:projectId
 * Deploy a project to production
 */
router.post('/:projectId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const { domain, environment = 'production' } = req.body;
    
    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();
    
    if (projectError || !project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    // TODO: Implement actual deployment logic
    // This would integrate with hosting providers like Vercel, Netlify, etc.
    
    const deploymentId = `dep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const deploymentUrl = domain || `${project.name.toLowerCase().replace(/\s+/g, '-')}-${deploymentId}.lovable-apps.com`;
    
    // Create deployment record
    const { data: deployment, error: deployError } = await supabase
      .from('deployments')
      .insert([{
        id: deploymentId,
        project_id: projectId,
        user_id: userId,
        environment,
        url: `https://${deploymentUrl}`,
        status: 'pending',
        config: {
          domain: deploymentUrl,
          build_command: 'npm run build',
          output_directory: 'dist'
        }
      }])
      .select()
      .single();
    
    if (deployError) throw deployError;
    
    // Simulate deployment process
    setTimeout(async () => {
      await supabase
        .from('deployments')
        .update({ 
          status: 'deployed',
          deployed_at: new Date().toISOString()
        })
        .eq('id', deploymentId);
      
      // Update project status
      await supabase
        .from('projects')
        .update({ 
          status: 'deployed',
          deployment_url: `https://${deploymentUrl}`
        })
        .eq('id', projectId);
    }, 5000);
    
    res.status(202).json({
      success: true,
      data: deployment,
      message: 'Deployment started successfully'
    });
  } catch (error) {
    console.error('Deployment failed:', error);
    res.status(500).json({
      success: false,
      error: 'Deployment failed',
      message: error.message
    });
  }
});

/**
 * GET /api/deploy/:projectId/status
 * Get deployment status for a project
 */
router.get('/:projectId/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    
    const { data: deployments, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: deployments
    });
  } catch (error) {
    console.error('Failed to fetch deployment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch deployment status',
      message: error.message
    });
  }
});

/**
 * DELETE /api/deploy/:deploymentId
 * Delete/rollback a deployment
 */
router.delete('/:deploymentId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const deploymentId = req.params.deploymentId;
    
    // Verify deployment ownership
    const { data: deployment, error: deployError } = await supabase
      .from('deployments')
      .select('*')
      .eq('id', deploymentId)
      .eq('user_id', userId)
      .single();
    
    if (deployError || !deployment) {
      return res.status(404).json({
        success: false,
        error: 'Deployment not found'
      });
    }
    
    // Update deployment status
    const { error: updateError } = await supabase
      .from('deployments')
      .update({ 
        status: 'deleted',
        deleted_at: new Date().toISOString()
      })
      .eq('id', deploymentId);
    
    if (updateError) throw updateError;
    
    res.json({
      success: true,
      message: 'Deployment deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete deployment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete deployment',
      message: error.message
    });
  }
});

/**
 * GET /api/deploy/domains/available
 * Check domain availability
 */
router.get('/domains/available', authenticateToken, async (req, res) => {
  try {
    const { domain } = req.query;
    
    if (!domain) {
      return res.status(400).json({
        success: false,
        error: 'Domain parameter is required'
      });
    }
    
    // Check if domain is already taken
    const { data: existingDeployment } = await supabase
      .from('deployments')
      .select('id')
      .eq('config->domain', domain)
      .eq('status', 'deployed')
      .single();
    
    const isAvailable = !existingDeployment;
    
    res.json({
      success: true,
      data: {
        domain,
        available: isAvailable,
        suggestions: isAvailable ? [] : [
          `${domain}-1`,
          `${domain}-app`,
          `${domain}-web`
        ]
      }
    });
  } catch (error) {
    console.error('Domain check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Domain check failed',
      message: error.message
    });
  }
});

export default router;