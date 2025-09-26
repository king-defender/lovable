import { Octokit } from '@octokit/rest';

/**
 * GitHub integration service for Lovable
 * Handles version control and deployment integration
 */
export class GitHubService {
  constructor(accessToken = process.env.GITHUB_ACCESS_TOKEN) {
    if (!accessToken) {
      throw new Error('GitHub access token is required');
    }

    this.octokit = new Octokit({
      auth: accessToken
    });
  }

  /**
   * Create a new repository for a project
   */
  async createRepository(name, description, isPrivate = true) {
    try {
      const repository = await this.octokit.repos.createForAuthenticatedUser({
        name,
        description,
        private: isPrivate,
        auto_init: true,
        gitignore_template: 'Node'
      });

      return repository.data;
    } catch (error) {
      throw new Error(`Failed to create repository: ${error.message}`);
    }
  }

  /**
   * Create or update a file in repository
   */
  async createOrUpdateFile(owner, repo, path, content, message, sha = null) {
    try {
      const params = {
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64')
      };

      if (sha) {
        params.sha = sha;
      }

      const response = await this.octokit.repos.createOrUpdateFileContents(params);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create/update file: ${error.message}`);
    }
  }

  /**
   * Get file content from repository
   */
  async getFileContent(owner, repo, path) {
    try {
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path
      });

      if (response.data.type === 'file') {
        return {
          content: Buffer.from(response.data.content, 'base64').toString(),
          sha: response.data.sha
        };
      }

      throw new Error('Path is not a file');
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw new Error(`Failed to get file content: ${error.message}`);
    }
  }

  /**
   * Create a commit with multiple files
   */
  async createCommit(owner, repo, message, files, parentSha) {
    try {
      // Create tree with all files
      const tree = await this.octokit.git.createTree({
        owner,
        repo,
        base_tree: parentSha,
        tree: files.map(file => ({
          path: file.path,
          mode: '100644',
          type: 'blob',
          content: file.content
        }))
      });

      // Create commit
      const commit = await this.octokit.git.createCommit({
        owner,
        repo,
        message,
        tree: tree.data.sha,
        parents: [parentSha]
      });

      // Update reference
      await this.octokit.git.updateRef({
        owner,
        repo,
        ref: 'heads/main',
        sha: commit.data.sha
      });

      return commit.data;
    } catch (error) {
      throw new Error(`Failed to create commit: ${error.message}`);
    }
  }

  /**
   * Deploy to GitHub Pages
   */
  async deployToPages(owner, repo, buildFiles) {
    try {
      // Create or update gh-pages branch
      let pagesBranchSha;
      
      try {
        const branchRef = await this.octokit.git.getRef({
          owner,
          repo,
          ref: 'heads/gh-pages'
        });
        pagesBranchSha = branchRef.data.object.sha;
      } catch (error) {
        // Branch doesn't exist, create it
        const mainRef = await this.octokit.git.getRef({
          owner,
          repo,
          ref: 'heads/main'
        });
        
        await this.octokit.git.createRef({
          owner,
          repo,
          ref: 'refs/heads/gh-pages',
          sha: mainRef.data.object.sha
        });
        
        pagesBranchSha = mainRef.data.object.sha;
      }

      // Create commit with build files
      const tree = await this.octokit.git.createTree({
        owner,
        repo,
        tree: buildFiles.map(file => ({
          path: file.path,
          mode: '100644',
          type: 'blob',
          content: file.content
        }))
      });

      const commit = await this.octokit.git.createCommit({
        owner,
        repo,
        message: 'Deploy to GitHub Pages',
        tree: tree.data.sha,
        parents: [pagesBranchSha]
      });

      await this.octokit.git.updateRef({
        owner,
        repo,
        ref: 'heads/gh-pages',
        sha: commit.data.sha
      });

      // Enable GitHub Pages if not already enabled
      try {
        await this.octokit.repos.createPagesSite({
          owner,
          repo,
          source: {
            branch: 'gh-pages',
            path: '/'
          }
        });
      } catch (error) {
        // Pages might already be enabled
        if (error.status !== 409) {
          console.warn('Failed to enable GitHub Pages:', error.message);
        }
      }

      return {
        success: true,
        url: `https://${owner}.github.io/${repo}`,
        commit: commit.data
      };
    } catch (error) {
      throw new Error(`Failed to deploy to GitHub Pages: ${error.message}`);
    }
  }

  /**
   * Get repository information
   */
  async getRepository(owner, repo) {
    try {
      const response = await this.octokit.repos.get({
        owner,
        repo
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get repository: ${error.message}`);
    }
  }

  /**
   * List user repositories
   */
  async listRepositories(type = 'owner', sort = 'updated') {
    try {
      const response = await this.octokit.repos.listForAuthenticatedUser({
        type,
        sort,
        direction: 'desc',
        per_page: 100
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to list repositories: ${error.message}`);
    }
  }

  /**
   * Create a webhook for deployment notifications
   */
  async createWebhook(owner, repo, webhookUrl, events = ['push']) {
    try {
      const webhook = await this.octokit.repos.createWebhook({
        owner,
        repo,
        name: 'web',
        active: true,
        events,
        config: {
          url: webhookUrl,
          content_type: 'json',
          secret: process.env.GITHUB_WEBHOOK_SECRET
        }
      });

      return webhook.data;
    } catch (error) {
      throw new Error(`Failed to create webhook: ${error.message}`);
    }
  }

  /**
   * Get latest commit SHA
   */
  async getLatestCommitSha(owner, repo, branch = 'main') {
    try {
      const response = await this.octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${branch}`
      });

      return response.data.object.sha;
    } catch (error) {
      throw new Error(`Failed to get latest commit: ${error.message}`);
    }
  }

  /**
   * Generate project files for GitHub deployment
   */
  generateProjectFiles(projectData, components) {
    const files = [];

    // Package.json
    files.push({
      path: 'package.json',
      content: JSON.stringify({
        name: projectData.name.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        },
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        },
        devDependencies: {
          '@vitejs/plugin-react': '^4.0.3',
          vite: '^4.4.5'
        }
      }, null, 2)
    });

    // Vite config
    files.push({
      path: 'vite.config.js',
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/${projectData.name}/'
})`
    });

    // HTML template
    files.push({
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${projectData.name}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`
    });

    // Main React file
    files.push({
      path: 'src/main.jsx',
      content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
    });

    // App component
    files.push({
      path: 'src/App.jsx',
      content: `import React from 'react'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>${projectData.name}</h1>
      <p>Generated by Lovable</p>
    </div>
  )
}

export default App`
    });

    // Add component files
    components.forEach((component, index) => {
      files.push({
        path: `src/components/${component.name}.jsx`,
        content: component.code
      });
    });

    return files;
  }
}

// Export singleton instance
export const githubService = new GitHubService();