/**
 * 侧边栏组件测试套件
 * 确保侧边栏在各种场景下都能正常工作
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar, { SidebarConfig } from '../components/Sidebar';
import { MessageSquare, Grid3X3 } from 'lucide-react';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Sidebar Component', () => {
  const mockOnToggleCollapse = vi.fn();
  const mockOnLogoClick = vi.fn();
  const mockNavItemClick = vi.fn();

  const basicConfig: SidebarConfig = {
    logoSrc: '/test-logo.png',
    logoText: 'TestApp',
    onLogoClick: mockOnLogoClick,
    navItems: [
      {
        id: 'chat',
        icon: <MessageSquare className="h-5 w-5" />,
        label: '新会话',
        onClick: mockNavItemClick,
        isActive: false
      },
      {
        id: 'marketplace',
        icon: <Grid3X3 className="h-5 w-5" />,
        label: 'Agent广场',
        onClick: mockNavItemClick,
        isActive: true
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('基础渲染', () => {
    it('应该正确渲染侧边栏', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      expect(screen.getByText('TestApp')).toBeInTheDocument();
      expect(screen.getByText('新会话')).toBeInTheDocument();
      expect(screen.getByText('Agent广场')).toBeInTheDocument();
    });

    it('收起状态下应该隐藏文字', () => {
      render(
        <Sidebar
          isCollapsed={true}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      expect(screen.queryByText('TestApp')).not.toBeInTheDocument();
      expect(screen.queryByText('新会话')).not.toBeInTheDocument();
    });

    it('应该渲染logo图片', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      const logo = screen.getByAltText('Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/test-logo.png');
    });
  });

  describe('交互功能', () => {
    it('点击切换按钮应该触发回调', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      const toggleButton = screen.getByTitle('收起侧边栏');
      fireEvent.click(toggleButton);

      expect(mockOnToggleCollapse).toHaveBeenCalledTimes(1);
    });

    it('点击logo应该触发回调', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      const logo = screen.getByText('TestApp').closest('div');
      if (logo) {
        fireEvent.click(logo);
        expect(mockOnLogoClick).toHaveBeenCalledTimes(1);
      }
    });

    it('点击导航项应该触发回调', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      const navButton = screen.getByText('新会话');
      fireEvent.click(navButton);

      expect(mockNavItemClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('激活状态', () => {
    it('应该正确显示激活状态的导航项', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      const activeItem = screen.getByText('Agent广场').closest('button');
      expect(activeItem).toHaveClass('from-blue-900/30');
    });

    it('非激活状态的导航项不应该有激活样式', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      const inactiveItem = screen.getByText('新会话').closest('button');
      expect(inactiveItem).not.toHaveClass('from-blue-900/30');
    });
  });

  describe('常用Agent', () => {
    const configWithAgents: SidebarConfig = {
      ...basicConfig,
      showCommonAgents: true,
      commonAgents: [
        {
          id: '1',
          name: '测试Agent',
          description: '测试描述',
          category: '测试分类',
          author: '测试作者',
          gradient: 'from-pink-400 to-purple-500'
        }
      ],
      onAgentClick: vi.fn()
    };

    it('展开状态下应该显示常用Agent', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={configWithAgents}
        />
      );

      expect(screen.getByText('常用Agent')).toBeInTheDocument();
      expect(screen.getByText(/测试Agent/)).toBeInTheDocument();
    });

    it('收起状态下不应该显示常用Agent', () => {
      render(
        <Sidebar
          isCollapsed={true}
          onToggleCollapse={mockOnToggleCollapse}
          config={configWithAgents}
        />
      );

      expect(screen.queryByText('常用Agent')).not.toBeInTheDocument();
    });

    it('点击Agent应该触发回调', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={configWithAgents}
        />
      );

      const agent = screen.getByText(/测试Agent/);
      fireEvent.click(agent);

      expect(configWithAgents.onAgentClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1' })
      );
    });
  });

  describe('历史会话', () => {
    const configWithSessions: SidebarConfig = {
      ...basicConfig,
      showHistorySessions: true,
      historySessions: [
        {
          id: 'session-1',
          title: '测试会话',
          agentName: '测试Agent',
          timestamp: new Date(),
          isActive: false,
          messages: [],
          type: 'chat'
        }
      ],
      onSessionClick: vi.fn()
    };

    it('展开状态下应该显示历史会话', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={configWithSessions}
        />
      );

      expect(screen.getByText('历史会话')).toBeInTheDocument();
      expect(screen.getByText('测试会话')).toBeInTheDocument();
    });

    it('收起状态下不应该显示历史会话', () => {
      render(
        <Sidebar
          isCollapsed={true}
          onToggleCollapse={mockOnToggleCollapse}
          config={configWithSessions}
        />
      );

      expect(screen.queryByText('历史会话')).not.toBeInTheDocument();
    });

    it('点击会话应该触发回调', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={configWithSessions}
        />
      );

      const session = screen.getByText('测试会话');
      fireEvent.click(session);

      expect(configWithSessions.onSessionClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'session-1' })
      );
    });
  });

  describe('自定义内容', () => {
    const configWithCustomContent: SidebarConfig = {
      ...basicConfig,
      customContent: <div data-testid="custom-content">自定义内容</div>
    };

    it('展开状态下应该显示自定义内容', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={configWithCustomContent}
        />
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('收起状态下不应该显示自定义内容', () => {
      render(
        <Sidebar
          isCollapsed={true}
          onToggleCollapse={mockOnToggleCollapse}
          config={configWithCustomContent}
        />
      );

      expect(screen.queryByTestId('custom-content')).not.toBeInTheDocument();
    });
  });

  describe('登录状态', () => {
    beforeEach(() => {
      localStorageMock.clear();
    });

    it('未登录时应该显示登录按钮', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      expect(screen.getByText('登录')).toBeInTheDocument();
    });

    it('已登录时应该显示用户信息', () => {
      localStorageMock.setItem('riskagent_is_logged_in', 'true');
      localStorageMock.setItem('riskagent_username', '测试用户');

      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      expect(screen.getByText('测试用户')).toBeInTheDocument();
      expect(screen.getByText('退出登录')).toBeInTheDocument();
    });

    it('收起状态下已登录应该只显示用户图标', () => {
      localStorageMock.setItem('riskagent_is_logged_in', 'true');
      localStorageMock.setItem('riskagent_username', '测试用户');

      render(
        <Sidebar
          isCollapsed={true}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      expect(screen.queryByText('测试用户')).not.toBeInTheDocument();
      expect(screen.queryByText('退出登录')).not.toBeInTheDocument();
    });
  });

  describe('响应式行为', () => {
    it('侧边栏应该应用正确的宽度类', () => {
      const { container, rerender } = render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      const sidebar = container.firstChild;
      expect(sidebar).toHaveClass('w-64');

      rerender(
        <Sidebar
          isCollapsed={true}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      expect(sidebar).toHaveClass('w-16');
    });

    it('切换状态时应该有过渡动画', () => {
      const { container } = render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      const sidebar = container.firstChild;
      expect(sidebar).toHaveClass('transition-all');
      expect(sidebar).toHaveClass('duration-300');
    });
  });

  describe('无障碍访问', () => {
    it('收起状态下导航项应该有tooltip', () => {
      render(
        <Sidebar
          isCollapsed={true}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      const navButtons = screen.getAllByRole('button');
      const chatButton = navButtons.find(btn =>
        btn.getAttribute('title') === '新会话'
      );

      expect(chatButton).toBeDefined();
    });

    it('切换按钮应该有描述性的title', () => {
      render(
        <Sidebar
          isCollapsed={false}
          onToggleCollapse={mockOnToggleCollapse}
          config={basicConfig}
        />
      );

      expect(screen.getByTitle('收起侧边栏')).toBeInTheDocument();
    });
  });
});
