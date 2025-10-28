/**
 * 侧边栏使用示例
 * 展示如何在不同页面中使用通用侧边栏组件
 */

import React from 'react';
import { MessageSquare, Grid3X3, Home, Settings } from 'lucide-react';
import Sidebar, { SidebarConfig, NavItem } from '../components/Sidebar';
import { useSidebar, useSidebarMargin } from '../hooks/useSidebar';

/**
 * 示例1: 基础侧边栏（仅导航项）
 */
export function BasicSidebarExample() {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const marginClass = useSidebarMargin(isCollapsed);

  const navItems: NavItem[] = [
    {
      id: 'home',
      icon: <Home className="h-5 w-5" />,
      label: '首页',
      onClick: () => console.log('返回首页'),
      isActive: false
    },
    {
      id: 'chat',
      icon: <MessageSquare className="h-5 w-5" />,
      label: '新会话',
      onClick: () => console.log('新建会话'),
      isActive: true
    },
    {
      id: 'marketplace',
      icon: <Grid3X3 className="h-5 w-5" />,
      label: 'Agent广场',
      onClick: () => console.log('打开Agent广场'),
      isActive: false
    }
  ];

  const config: SidebarConfig = {
    logoSrc: '/Vector copy.png',
    logoText: 'RiskAgent',
    onLogoClick: () => console.log('Logo clicked'),
    navItems
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        config={config}
      />
      <div className={`min-h-screen transition-all duration-300 ${marginClass} p-8`}>
        <h1 className="text-3xl text-white">基础侧边栏示例</h1>
        <p className="text-gray-300 mt-4">这是一个仅包含导航项的基础侧边栏示例</p>
      </div>
    </div>
  );
}

/**
 * 示例2: 带常用Agent的侧边栏
 */
export function SidebarWithAgentsExample() {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const marginClass = useSidebarMargin(isCollapsed);

  const navItems: NavItem[] = [
    {
      id: 'chat',
      icon: <MessageSquare className="h-5 w-5" />,
      label: '新会话',
      onClick: () => console.log('新建会话')
    },
    {
      id: 'marketplace',
      icon: <Grid3X3 className="h-5 w-5" />,
      label: 'Agent广场',
      onClick: () => console.log('打开Agent广场'),
      isActive: true
    }
  ];

  const commonAgents = [
    {
      id: '1',
      name: '小店追单',
      description: '帮助用户高效分析广告主下单速度风险',
      category: '流量质量',
      author: '反作弊算法',
      gradient: 'from-pink-400 to-purple-500'
    },
    {
      id: '2',
      name: '联盟媒体',
      description: '深度分析联盟媒体流量质量',
      category: '流量质量',
      author: '反作弊算法',
      gradient: 'from-blue-400 to-purple-500'
    }
  ];

  const config: SidebarConfig = {
    logoSrc: '/Vector copy.png',
    logoText: 'RiskAgent',
    onLogoClick: () => console.log('Logo clicked'),
    navItems,
    showCommonAgents: true,
    commonAgents,
    onAgentClick: (agent) => console.log('Agent clicked:', agent.name)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        config={config}
      />
      <div className={`min-h-screen transition-all duration-300 ${marginClass} p-8`}>
        <h1 className="text-3xl text-white">带常用Agent的侧边栏</h1>
        <p className="text-gray-300 mt-4">这个侧边栏包含常用Agent快捷入口</p>
      </div>
    </div>
  );
}

/**
 * 示例3: 完整功能侧边栏（导航 + Agent + 历史会话）
 */
export function FullFeaturedSidebarExample() {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const marginClass = useSidebarMargin(isCollapsed);

  const navItems: NavItem[] = [
    {
      id: 'chat',
      icon: <MessageSquare className="h-5 w-5" />,
      label: '新会话',
      onClick: () => console.log('新建会话')
    },
    {
      id: 'marketplace',
      icon: <Grid3X3 className="h-5 w-5" />,
      label: 'Agent广场',
      onClick: () => console.log('打开Agent广场'),
      isActive: true
    }
  ];

  const commonAgents = [
    {
      id: '1',
      name: '小店追单',
      description: '风险预测分析',
      category: '流量质量',
      author: '反作弊算法',
      gradient: 'from-pink-400 to-purple-500'
    }
  ];

  const historySessions = [
    {
      id: 'session-1',
      title: '分析最近的流量异常',
      agentName: '流量分析助手',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
      isActive: false,
      messages: [],
      type: 'chat' as const
    },
    {
      id: 'session-2',
      title: '团组关系查询',
      agentName: '政策团组关系',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
      isActive: true,
      messages: [],
      type: 'agent-chat' as const
    }
  ];

  const config: SidebarConfig = {
    logoSrc: '/Vector copy.png',
    logoText: 'RiskAgent',
    onLogoClick: () => console.log('Logo clicked'),
    navItems,
    showCommonAgents: true,
    commonAgents,
    onAgentClick: (agent) => console.log('Agent clicked:', agent.name),
    showHistorySessions: true,
    historySessions,
    onSessionClick: (session) => console.log('Session clicked:', session.title)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        config={config}
      />
      <div className={`min-h-screen transition-all duration-300 ${marginClass} p-8`}>
        <h1 className="text-3xl text-white">完整功能侧边栏</h1>
        <p className="text-gray-300 mt-4">
          这个侧边栏包含所有功能：导航、常用Agent和历史会话
        </p>
      </div>
    </div>
  );
}

/**
 * 示例4: 自定义内容侧边栏
 */
export function CustomContentSidebarExample() {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const marginClass = useSidebarMargin(isCollapsed);

  const navItems: NavItem[] = [
    {
      id: 'settings',
      icon: <Settings className="h-5 w-5" />,
      label: '设置',
      onClick: () => console.log('打开设置')
    }
  ];

  const customContent = (
    <div className="px-6 pb-6">
      <div className="mt-8 p-4 bg-blue-900/20 border border-blue-600/30 rounded-xl">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">提示</h4>
        <p className="text-xs text-gray-300">
          这是一个自定义内容区域，你可以在这里放置任何想要的内容。
        </p>
      </div>
    </div>
  );

  const config: SidebarConfig = {
    logoSrc: '/Vector copy.png',
    logoText: 'RiskAgent',
    onLogoClick: () => console.log('Logo clicked'),
    navItems,
    customContent
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        config={config}
      />
      <div className={`min-h-screen transition-all duration-300 ${marginClass} p-8`}>
        <h1 className="text-3xl text-white">自定义内容侧边栏</h1>
        <p className="text-gray-300 mt-4">
          侧边栏中包含自定义的React组件内容
        </p>
      </div>
    </div>
  );
}

/**
 * 示例5: 实际应用场景 - ChatPage集成
 */
export function ChatPageWithSidebarExample() {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const marginClass = useSidebarMargin(isCollapsed);

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  const handleOpenMarketplace = () => {
    window.dispatchEvent(new CustomEvent('navigateToAgentMarketplace'));
  };

  const navItems: NavItem[] = [
    {
      id: 'new-chat',
      icon: <MessageSquare className="h-5 w-5" />,
      label: '新会话',
      onClick: handleBackToHome,
      tooltip: '开始新的对话'
    },
    {
      id: 'agent-marketplace',
      icon: <Grid3X3 className="h-5 w-5" />,
      label: 'Agent广场',
      onClick: handleOpenMarketplace,
      isActive: false,
      tooltip: '浏览所有可用的Agent'
    }
  ];

  const config: SidebarConfig = {
    logoSrc: '/Vector copy.png',
    logoText: 'RiskAgent',
    onLogoClick: handleBackToHome,
    navItems
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        config={config}
      />
      <div className={`min-h-screen transition-all duration-300 ${marginClass}`}>
        {/* 聊天界面内容 */}
        <div className="flex flex-col h-screen">
          <div className="flex-1 overflow-y-auto p-6">
            <h1 className="text-2xl text-white mb-4">聊天页面</h1>
            <div className="space-y-4">
              <div className="bg-gray-700/50 p-4 rounded-xl">
                <p className="text-gray-200">这是聊天消息内容...</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 p-4">
            <input
              type="text"
              placeholder="输入消息..."
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
