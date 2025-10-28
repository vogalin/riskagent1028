import { useState, useEffect } from 'react';

// 侧边栏状态的localStorage键
const SIDEBAR_COLLAPSED_KEY = 'riskagent_sidebar_collapsed';

/**
 * 侧边栏状态管理Hook
 * @param defaultCollapsed 默认收起状态
 * @returns 收起状态和切换函数
 */
export function useSidebar(defaultCollapsed: boolean = false) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    // 从localStorage恢复用户偏好
    try {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      return saved !== null ? saved === 'true' : defaultCollapsed;
    } catch {
      return defaultCollapsed;
    }
  });

  // 保存状态到localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, isCollapsed.toString());
    } catch (error) {
      console.warn('无法保存侧边栏状态:', error);
    }
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  const collapse = () => {
    setIsCollapsed(true);
  };

  const expand = () => {
    setIsCollapsed(false);
  };

  return {
    isCollapsed,
    toggleCollapse,
    collapse,
    expand,
    setIsCollapsed
  };
}

/**
 * 侧边栏内容区域的边距计算Hook
 * @param isCollapsed 侧边栏是否收起
 * @returns 主内容区域应该应用的margin-left类名
 */
export function useSidebarMargin(isCollapsed: boolean) {
  return isCollapsed ? 'ml-16' : 'ml-64';
}

/**
 * 监听侧边栏状态变化的Hook
 * @param onCollapse 收起时的回调
 * @param onExpand 展开时的回调
 */
export function useSidebarEvents(
  onCollapse?: () => void,
  onExpand?: () => void
) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      const collapsed = event.detail?.collapsed;
      setIsCollapsed(collapsed);

      if (collapsed && onCollapse) {
        onCollapse();
      } else if (!collapsed && onExpand) {
        onExpand();
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle as EventListener);

    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    };
  }, [onCollapse, onExpand]);

  return isCollapsed;
}

/**
 * 触发侧边栏状态变化事件
 * @param collapsed 是否收起
 */
export function emitSidebarToggle(collapsed: boolean) {
  window.dispatchEvent(new CustomEvent('sidebarToggle', {
    detail: { collapsed }
  }));
}
