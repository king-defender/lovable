import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Database service for Lovable application
 */
export class DatabaseService {
  constructor() {
    this.client = supabase;
  }

  // User methods
  async createUser(userData) {
    const { data, error } = await this.client
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserById(id) {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUser(id, updates) {
    const { data, error } = await this.client
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Project methods
  async createProject(projectData) {
    const { data, error } = await this.client
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getProjectsByUserId(userId) {
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getProjectById(id) {
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateProject(id, updates) {
    const { data, error } = await this.client
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteProject(id) {
    const { error } = await this.client
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Component methods
  async createComponent(componentData) {
    const { data, error } = await this.client
      .from('components')
      .insert([componentData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getComponentsByProjectId(projectId) {
    const { data, error } = await this.client
      .from('components')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');
    
    if (error) throw error;
    return data;
  }

  async updateComponent(id, updates) {
    const { data, error } = await this.client
      .from('components')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteComponent(id) {
    const { error } = await this.client
      .from('components')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // AI Generation tracking
  async logAIGeneration(generationData) {
    const { data, error } = await this.client
      .from('ai_generations')
      .insert([generationData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAIGenerationHistory(userId, limit = 50) {
    const { data, error } = await this.client
      .from('ai_generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  // Deployment methods
  async createDeployment(deploymentData) {
    const { data, error } = await this.client
      .from('deployments')
      .insert([deploymentData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getDeploymentsByProjectId(projectId) {
    const { data, error } = await this.client
      .from('deployments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async updateDeployment(id, updates) {
    const { data, error } = await this.client
      .from('deployments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Template methods
  async getPublicTemplates() {
    const { data, error } = await this.client
      .from('templates')
      .select('*')
      .eq('is_public', true)
      .order('downloads', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getTemplateById(id) {
    const { data, error } = await this.client
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Usage tracking
  async trackUsage(usageData) {
    const { data, error } = await this.client
      .from('usage_tracking')
      .insert([usageData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserUsage(userId, startDate, endDate) {
    let query = this.client
      .from('usage_tracking')
      .select('*')
      .eq('user_id', userId);

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Real-time subscriptions
  subscribeToProject(projectId, callback) {
    return this.client
      .channel(`project-${projectId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'components',
        filter: `project_id=eq.${projectId}`
      }, callback)
      .subscribe();
  }

  subscribeToUserProjects(userId, callback) {
    return this.client
      .channel(`user-projects-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }
}

export const db = new DatabaseService();