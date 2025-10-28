/**
 * 侧边栏工具函数库
 * 提供通用的侧边栏相关功能函数
 */

// 全局登录状态管理键
export const STORAGE_KEYS = {
  IS_LOGGED_IN: 'riskagent_is_logged_in',
  USERNAME: 'riskagent_username',
  SIDEBAR_COLLAPSED: 'riskagent_sidebar_collapsed'
} as const;

/**
 * 获取存储的登录状态
 */
export const getStoredLoginState = () => {
  try {
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    const username = localStorage.getItem(STORAGE_KEYS.USERNAME) || '';
    return { isLoggedIn, username };
  } catch (error) {
    console.error('获取登录状态失败:', error);
    return { isLoggedIn: false, username: '' };
  }
};

/**
 * 保存登录状态
 */
export const saveLoginState = (isLoggedIn: boolean, username: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn.toString());
    localStorage.setItem(STORAGE_KEYS.USERNAME, username);
  } catch (error) {
    console.error('保存登录状态失败:', error);
  }
};

/**
 * 清除登录状态
 */
export const clearLoginState = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
  } catch (error) {
    console.error('清除登录状态失败:', error);
  }
};

/**
 * 格式化会话时间戳
 * @param timestamp 时间戳
 * @returns 格式化后的时间字符串
 */
export const formatSessionTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return timestamp.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

/**
 * 触发登录事件
 * @param source 触发来源
 * @param agent 可选的Agent信息
 */
export const triggerLoginEvent = (source: string, agent?: any) => {
  window.dispatchEvent(new CustomEvent('needLogin', {
    detail: { source, agent }
  }));
};

/**
 * 触发登出事件
 */
export const triggerLogoutEvent = () => {
  window.dispatchEvent(new CustomEvent('userLogout'));
};

/**
 * 触发Agent切换事件
 * @param agent Agent信息
 */
export const triggerAgentSwitch = (agent: any) => {
  window.dispatchEvent(new CustomEvent('switchAgent', {
    detail: agent
  }));
};

/**
 * 触发Agent广场导航事件
 */
export const triggerNavigateToAgentMarketplace = () => {
  window.dispatchEvent(new CustomEvent('navigateToAgentMarketplace'));
};

/**
 * 获取侧边栏收起状态
 */
export const getSidebarCollapsedState = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
    return saved === 'true';
  } catch {
    return false;
  }
};

/**
 * 保存侧边栏收起状态
 */
export const saveSidebarCollapsedState = (collapsed: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed.toString());
  } catch (error) {
    console.error('保存侧边栏状态失败:', error);
  }
};

/**
 * 生成通用的侧边栏样式类名
 * @param isCollapsed 是否收起
 * @param customClasses 自定义类名
 */
export const getSidebarClassNames = (isCollapsed: boolean, customClasses: string = '') => {
  return `fixed left-0 top-0 h-screen bg-gray-800/90 backdrop-blur-xl border-r border-gray-700/50 z-10 transition-all duration-300 ease-in-out shadow-xl flex flex-col ${
    isCollapsed ? 'w-16' : 'w-64'
  } ${customClasses}`.trim();
};

/**
 * 生成主内容区域的边距类名
 * @param isCollapsed 侧边栏是否收起
 */
export const getMainContentMargin = (isCollapsed: boolean): string => {
  return isCollapsed ? 'ml-16' : 'ml-64';
};

/**
 * 生成按钮的条件样式类名
 * @param isCollapsed 是否收起
 * @param isActive 是否激活
 */
export const getNavButtonClasses = (isCollapsed: boolean, isActive: boolean = false) => {
  const baseClasses = 'group relative flex items-center w-full rounded-xl transition-all duration-200 hover:scale-105';
  const activeClasses = isActive
    ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-400 border border-blue-600/50 shadow-sm'
    : 'text-gray-200 hover:bg-blue-900/30 hover:text-blue-400';
  const sizeClasses = isCollapsed ? 'justify-center p-3' : 'px-4 py-3';

  return `${baseClasses} ${activeClasses} ${sizeClasses}`.trim();
};

/**
 * 生成图标的条件样式类名
 * @param isCollapsed 是否收起
 */
export const getIconClasses = (isCollapsed: boolean) => {
  return `flex-shrink-0 transition-all duration-200 ${
    isCollapsed ? 'h-5 w-5' : 'h-5 w-5 mr-3'
  }`.trim();
};

/**
 * 验证侧边栏配置的完整性
 * @param config 侧边栏配置
 * @returns 验证结果
 */
export const validateSidebarConfig = (config: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config) {
    errors.push('配置对象不能为空');
    return { valid: false, errors };
  }

  if (!Array.isArray(config.navItems)) {
    errors.push('navItems必须是数组');
  } else if (config.navItems.length === 0) {
    errors.push('navItems不能为空数组');
  }

  if (config.showCommonAgents && !Array.isArray(config.commonAgents)) {
    errors.push('当showCommonAgents为true时，commonAgents必须是数组');
  }

  if (config.showHistorySessions && !Array.isArray(config.historySessions)) {
    errors.push('当showHistorySessions为true时，historySessions必须是数组');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * 深度合并侧边栏配置
 * @param defaultConfig 默认配置
 * @param userConfig 用户配置
 */
export const mergeSidebarConfig = (defaultConfig: any, userConfig: any) => {
  return {
    ...defaultConfig,
    ...userConfig,
    navItems: userConfig.navItems || defaultConfig.navItems,
    commonAgents: userConfig.commonAgents || defaultConfig.commonAgents,
    historySessions: userConfig.historySessions || defaultConfig.historySessions
  };
};
