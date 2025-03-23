<template>
  <div class="home-container">
    <header class="home-header">
      <div class="logo">
        <img src="../assets/images/logo.svg" alt="AI Chat Logo" />
        <h1>AI智能助手</h1>
      </div>
      
      <nav class="nav-links">
        <router-link to="/chat" class="nav-link">开始对话</router-link>
        <router-link to="/settings" class="nav-link">设置</router-link>
      </nav>
    </header>
    
    <main class="home-content">
      <section class="hero-section">
        <div class="hero-content">
          <h2>随时随地，与AI对话</h2>
          <p>AI智能助手让您体验先进的人工智能对话，解答问题，激发创意，提高效率。</p>
          <router-link to="/chat" class="btn btn-primary">
            开始对话
            <icon-carbon-arrow-right />
          </router-link>
        </div>
        
        <div class="hero-image">
          <img src="../assets/images/hero-image.svg" alt="AI对话展示" />
        </div>
      </section>
      
      <section class="features-section">
        <h3>主要功能</h3>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <icon-carbon-chat-bot />
            </div>
            <h4>智能对话</h4>
            <p>基于先进AI大语言模型，提供自然、流畅的对话体验</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <icon-carbon-document />
            </div>
            <h4>多种任务</h4>
            <p>从回答问题到创作内容，满足您的各种需求</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <icon-carbon-security />
            </div>
            <h4>隐私保护</h4>
            <p>注重用户隐私，确保您的对话数据安全</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <icon-carbon-app-connectivity />
            </div>
            <h4>跨平台支持</h4>
            <p>随时随地，在任何设备上使用AI助手</p>
          </div>
        </div>
      </section>
      
      <section class="cta-section">
        <h3>准备好开始使用了吗？</h3>
        <p>立即开始与AI智能助手对话，探索无限可能</p>
        <router-link to="/chat" class="btn btn-primary">立即开始</router-link>
      </section>
    </main>
    
    <footer class="home-footer">
      <p>&copy; 2023 AI智能助手 - 版权所有</p>
      <div class="footer-links">
        <a href="#" @click.prevent>隐私政策</a>
        <a href="#" @click.prevent>使用条款</a>
        <a href="#" @click.prevent>关于我们</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
// 无状态组件，不需要特殊逻辑
</script>

<style lang="scss">
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  overflow-y: auto;
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--card-bg);
  box-shadow: var(--shadow-sm);
  
  .logo {
    display: flex;
    align-items: center;
    
    img {
      width: 40px;
      height: 40px;
      margin-right: var(--spacing-sm);
    }
    
    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
    }
  }
  
  .nav-links {
    display: flex;
    gap: var(--spacing-md);
    
    .nav-link {
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      text-decoration: none;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: var(--bg-secondary);
      }
      
      &.router-link-active {
        color: var(--primary-color);
        font-weight: 500;
      }
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    
    .logo {
      margin-bottom: var(--spacing-sm);
    }
  }
}

.home-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
}

.hero-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  min-height: 60vh;
  
  .hero-content {
    flex: 1;
    
    h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: var(--spacing-md);
      line-height: 1.2;
    }
    
    p {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-bottom: var(--spacing-lg);
      line-height: 1.6;
      max-width: 500px;
    }
    
    .btn-primary {
      display: inline-flex;
      align-items: center;
      background-color: var(--primary-color);
      color: white;
      font-size: 1.1rem;
      font-weight: 500;
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: var(--primary-dark);
        transform: translateY(-2px);
      }
      
      svg {
        margin-left: var(--spacing-xs);
        width: 16px;
        height: 16px;
      }
    }
  }
  
  .hero-image {
    flex: 1;
    display: flex;
    justify-content: center;
    
    img {
      max-width: 100%;
      height: auto;
      max-height: 400px;
    }
  }
  
  @media (max-width: 968px) {
    flex-direction: column;
    text-align: center;
    
    .hero-content {
      p {
        margin-left: auto;
        margin-right: auto;
      }
    }
  }
}

.features-section {
  margin-bottom: var(--spacing-xl);
  
  h3 {
    text-align: center;
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-lg);
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .feature-card {
    background-color: var(--card-bg);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-md);
    }
    
    .feature-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background-color: rgba(99, 102, 241, 0.1);
      border-radius: var(--radius-full);
      margin-bottom: var(--spacing-md);
      
      svg {
        width: 30px;
        height: 30px;
        color: var(--primary-color);
      }
    }
    
    h4 {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--spacing-sm);
    }
    
    p {
      color: var(--text-secondary);
      line-height: 1.6;
    }
  }
}

.cta-section {
  text-align: center;
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  
  h3 {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .btn-primary {
    display: inline-flex;
    align-items: center;
    background-color: var(--primary-color);
    color: white;
    font-size: 1.1rem;
    font-weight: 500;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
}

.home-footer {
  border-top: 1px solid var(--divider-color);
  padding: var(--spacing-lg);
  text-align: center;
  
  p {
    color: var(--text-tertiary);
    margin-bottom: var(--spacing-sm);
  }
  
  .footer-links {
    display: flex;
    justify-content: center;
    gap: var(--spacing-lg);
    
    a {
      color: var(--text-secondary);
      text-decoration: none;
      
      &:hover {
        color: var(--primary-color);
      }
    }
  }
  
  @media (max-width: 768px) {
    .footer-links {
      flex-direction: column;
      gap: var(--spacing-sm);
    }
  }
}
</style> 