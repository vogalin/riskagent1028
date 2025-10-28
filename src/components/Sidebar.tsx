import React, { ReactNode } from 'react';
import { MessageSquare, Grid3X3, User, LogOut, Menu, X } from 'lucide-react';

// 全局登录状态管理
const STORAGE_KEYS = {
  IS_LOGGED_IN: 'riskagent_is_logged_in',
  USERNAME: 'riskagent_username'
};

// 获取存储的登录状态
const getStoredLoginState = () => {
  try {
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    const username = localStorage.getItem(STORAGE_KEYS.USERNAME) || '';
    return { isLoggedIn, username };
  } catch (error) {
    return { isLoggedIn: false, username: '' };
  }
};

// 导航项接口
export interface NavItem {
  id: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  tooltip?: string;
}

// 侧边栏配置接口
export interface SidebarConfig {
  logoSrc?: string;
  logoText?: string;
  onLogoClick?: () => void;
  navItems: NavItem[];
  showCommonAgents?: boolean;
  commonAgents?: CommonAgent[];
  onAgentClick?: (agent: CommonAgent) => void;
  showHistorySessions?: boolean;
  historySessions?: HistorySession[];
  onSessionClick?: (session: HistorySession) => void;
  onSessionMenuAction?: (sessionId: string, action: 'rename' | 'share' | 'delete') => void;
  customContent?: ReactNode;
}

// 常用Agent接口
export interface CommonAgent {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  gradient: string;
}

// 历史会话接口
export interface HistorySession {
  id: string;
  title: string;
  agentName: string;
  timestamp: Date;
  isActive: boolean;
  messages: any[];
  type: 'chat' | 'agent-chat';
}

// 侧边栏组件Props
export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  config: SidebarConfig;
}

export default function Sidebar({ isCollapsed, onToggleCollapse, config }: SidebarProps) {
  const { isLoggedIn, username } = getStoredLoginState();

  const handleLogin = () => {
    window.dispatchEvent(new CustomEvent('needLogin', {
      detail: { source: 'sidebar' }
    }));
  };

  const handleLogout = () => {
    window.dispatchEvent(new CustomEvent('userLogout'));
  };

  const formatSessionTime = (timestamp: Date) => {
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

  return (
    <div className={`fixed left-0 top-0 h-screen bg-gray-800/90 backdrop-blur-xl border-r border-gray-700/50 z-10 transition-all duration-300 ease-in-out shadow-xl flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Toggle Button */}
        <div className={`flex items-center justify-center pt-4 pb-2 ${
          isCollapsed ? 'px-3' : 'px-6'
        }`}>
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
            className="w-8 h-8 bg-gray-700/90 backdrop-blur-sm border border-gray-600/50 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 hover:bg-gray-600/90"
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4 text-gray-300" />
            ) : (
              <X className="h-4 w-4 text-gray-300" />
            )}
          </button>
        </div>

        <div className={`transition-all duration-300 ${
          isCollapsed ? 'px-3 pb-6' : 'px-6 pb-6'
        }`}>
          {/* Logo区域 */}
          {(config.logoSrc || config.logoText) && (
            <div
              className={`flex items-center mb-6 cursor-pointer hover:opacity-80 transition-opacity ${
                isCollapsed ? 'justify-center' : ''
              }`}
              onClick={config.onLogoClick}
              title={isCollapsed ? config.logoText || 'RiskAgent - 返回首页' : '返回首页'}
            >
              {config.logoSrc && (
                <img
                  src={config.logoSrc}
                  alt="Logo"
                  className={`transition-all duration-300 ${
                    isCollapsed ? 'w-8 h-8' : 'w-10 h-10 mr-3'
                  }`}
                />
              )}
              {!isCollapsed && config.logoText && (
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  {config.logoText}
                </span>
              )}
            </div>
          )}

          {/* 功能按钮区 */}
          <nav className="space-y-2">
            {config.navItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                title={isCollapsed ? (item.tooltip || item.label) : ''}
                className={`group relative flex items-center w-full rounded-xl transition-all duration-200 hover:scale-105 ${
                  item.isActive
                    ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-400 border border-blue-600/50 shadow-sm'
                    : 'text-gray-200 hover:bg-blue-900/30 hover:text-blue-400'
                } ${
                  isCollapsed ? 'justify-center p-3' : 'px-4 py-3'
                }`}
              >
                <div className={`flex-shrink-0 transition-all duration-200 ${
                  isCollapsed ? 'h-5 w-5' : 'h-5 w-5 mr-3'
                }`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* 常用Agent */}
        {!isCollapsed && config.showCommonAgents && config.commonAgents && config.commonAgents.length > 0 && (
          <div className="px-6 pb-6">
            <div className="mt-8 transition-opacity duration-300">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">常用Agent</h3>
              <div className="space-y-2">
                {config.commonAgents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => config.onAgentClick?.(agent)}
                    className="flex items-center px-4 py-3 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-pink-900/30 hover:to-purple-900/30 hover:text-pink-400 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                  >
                    <div className={`w-4 h-4 bg-gradient-to-r ${agent.gradient} rounded-full mr-3 shadow-sm flex-shrink-0`}></div>
                    <span className="truncate">{agent.category}-{agent.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 历史会话 */}
        {!isCollapsed && config.showHistorySessions && config.historySessions && config.historySessions.length > 0 && (
          <div className="px-6 pb-6">
            <div className="mt-8 transition-opacity duration-300">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">历史会话</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {config.historySessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => config.onSessionClick?.(session)}
                    className={`group relative px-4 py-3 text-sm rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                      session.isActive
                        ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-400 border border-blue-600/50 shadow-sm'
                        : 'text-gray-200 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{session.title}</div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center space-x-2">
                          <span className="truncate">{session.agentName}</span>
                          <span>·</span>
                          <span>{formatSessionTime(session.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 自定义内容 */}
        {!isCollapsed && config.customContent}
      </div>

      {/* User Info Section - Sticky Bottom */}
      <div className="flex-shrink-0 border-t border-gray-700/50 bg-gray-800/95 backdrop-blur-sm">
        <div className={`transition-all duration-300 ${
          isCollapsed ? 'p-3' : 'p-6'
        }`}>
          {isLoggedIn ? (
            <div className="transition-opacity duration-300">
              {isCollapsed ? (
                <button
                  onClick={handleLogout}
                  title={`${username || '用户'} - 点击退出登录`}
                  className="w-full aspect-square flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg hover:scale-105 transition-all duration-200 hover:shadow-xl hover:from-blue-600 hover:to-purple-700"
                >
                  <User className="h-5 w-5 text-white flex-shrink-0" />
                </button>
              ) : (
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg flex-shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{username || '用户'}</div>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium inline-flex items-center space-x-1 mt-1 group"
                    >
                      <LogOut className="h-3 w-3 group-hover:scale-110 transition-transform" />
                      <span>退出登录</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              title={isCollapsed ? '点击登录' : ''}
              className={`w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg font-medium ${
                isCollapsed ? 'aspect-square p-3' : 'px-4 py-3'
              }`}
            >
              <User className={`flex-shrink-0 ${
                isCollapsed ? 'h-5 w-5' : 'h-5 w-5 mr-2'
              }`} />
              {!isCollapsed && <span className="truncate">登录</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
