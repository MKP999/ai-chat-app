<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>页面未找到</h1>
      <p>抱歉，您访问的页面不存在或已被移除。</p>
      <div class="actions">
        <router-link to="/" class="btn btn-primary">返回首页</router-link>
        <router-link to="/chat" class="btn btn-secondary">开始对话</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// 无需额外逻辑
</script>

<style lang="scss">
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--bg-color);
  padding: var(--spacing-lg);
}

.not-found-content {
  text-align: center;
  max-width: 500px;
  
  .error-code {
    font-size: 8rem;
    font-weight: 700;
    color: var(--primary-color);
    line-height: 1;
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
  }
  
  p {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
  }
  
  .actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    
    .btn {
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-md);
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
      
      &.btn-primary {
        background-color: var(--primary-color);
        color: white;
        
        &:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
        }
      }
      
      &.btn-secondary {
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        
        &:hover {
          background-color: var(--divider-color);
          transform: translateY(-2px);
        }
      }
    }
    
    @media (max-width: 480px) {
      flex-direction: column;
    }
  }
}
</style> 