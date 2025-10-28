# 侧边栏组件迁移指南

## 目录
1. [概述](#概述)
2. [核心组件](#核心组件)
3. [迁移步骤](#迁移步骤)
4. [API文档](#api文档)
5. [最佳实践](#最佳实践)
6. [常见问题](#常见问题)

---

## 概述

本指南帮助你将现有的侧边栏组件迁移到统一的、可复用的侧边栏系统。新系统提供：

✅ **统一的交互逻辑** - 所有侧边栏保持一致的展开/收起行为
✅ **一致的视觉效果** - 统一的样式、动画和响应式设计
✅ **可复用的代码** - 减少重复代码，提高可维护性
✅ **灵活的配置** - 通过配置对象自定义侧边栏功能
✅ **完整的类型支持** - TypeScript类型定义完整

---

## 核心组件

### 1. Sidebar 组件
**位置**: `src/components/Sidebar.tsx`

通用的侧边栏UI组件，接收配置对象并渲染相应的内容。

```tsx
import Sidebar, { SidebarConfig } from '@/components/Sidebar';

<Sidebar
  isCollapsed={isCollapsed}
  onToggleCollapse={toggleCollapse}
  config={config}
/>
```

### 2. useSidebar Hook
**位置**: `src/hooks/useSidebar.ts`

管理侧边栏状态的自定义Hook。

```tsx
import { useSidebar } from '@/hooks/useSidebar';

const { isCollapsed, toggleCollapse, collapse, expand } = useSidebar();
```

### 3. 工具函数库
**位置**: `src/utils/sidebarHelpers.ts`

提供侧边栏相关的工具函数。

```tsx
import {
  getStoredLoginState,
  formatSessionTime,
  getSidebarClassNames,
  getNavButtonClasses
} from '@/utils/sidebarHelpers';
```

---

## 迁移步骤

### 步骤1: 安装依赖（如需要）

确保你的项目已安装必要的依赖：

```bash
npm install lucide-react  # 图标库
```

### 步骤2: 导入新组件和Hook

在你的页面组件中导入：

```tsx
import Sidebar, { SidebarConfig, NavItem } from '@/components/Sidebar';
import { useSidebar, useSidebarMargin } from '@/hooks/useSidebar';
```

### 步骤3: 替换现有侧边栏状态

**旧代码：**
```tsx
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
```

**新代码：**
```tsx
const { isCollapsed, toggleCollapse } = useSidebar();
```

### 步骤4: 配置侧边栏

创建侧边栏配置对象：

```tsx
const config: SidebarConfig = {
  // Logo配置
  logoSrc: '/Vector copy.png',
  logoText: 'RiskAgent',
  onLogoClick: () => handleBackToHome(),

  // 导航项配置
  navItems: [
    {
      id: 'new-chat',
      icon: <MessageSquare className="h-5 w-5" />,
      label: '新会话',
      onClick: () => handleNewChat(),
      isActive: false,
      tooltip: '开始新的对话'
    },
    {
      id: 'marketplace',
      icon: <Grid3X3 className="h-5 w-5" />,
      label: 'Agent广场',
      onClick: () => handleOpenMarketplace(),
      isActive: true
    }
  ],

  // 可选：常用Agent
  showCommonAgents: true,
  commonAgents: [
    {
      id: '1',
      name: '小店追单',
      description: '帮助用户高效分析',
      category: '流量质量',
      author: '反作弊算法',
      gradient: 'from-pink-400 to-purple-500'
    }
  ],
  onAgentClick: (agent) => handleAgentClick(agent),

  // 可选：历史会话
  showHistorySessions: true,
  historySessions: historySessions,
  onSessionClick: (session) => handleSessionClick(session),

  // 可选：自定义内容
  customContent: <YourCustomComponent />
};
```

### 步骤5: 渲染侧边栏

**旧代码：**
```tsx
<div className={`fixed left-0 top-0 h-screen ... ${
  isSidebarCollapsed ? 'w-16' : 'w-64'
}`}>
  {/* 复杂的侧边栏JSX */}
</div>
```

**新代码：**
```tsx
<Sidebar
  isCollapsed={isCollapsed}
  onToggleCollapse={toggleCollapse}
  config={config}
/>
```

### 步骤6: 调整主内容区域边距

**旧代码：**
```tsx
<div className={`min-h-screen ${
  isSidebarCollapsed ? 'ml-16' : 'ml-64'
}`}>
```

**新代码：**
```tsx
const marginClass = useSidebarMargin(isCollapsed);

<div className={`min-h-screen ${marginClass}`}>
```

### 步骤7: 移除旧代码

删除以下内容：
- 侧边栏相关的状态管理代码
- 侧边栏JSX结构
- 重复的登录状态管理
- 自定义的侧边栏样式

---

## API文档

### Sidebar 组件 Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `isCollapsed` | `boolean` | ✅ | 侧边栏是否收起 |
| `onToggleCollapse` | `() => void` | ✅ | 切换收起状态的回调 |
| `config` | `SidebarConfig` | ✅ | 侧边栏配置对象 |

### SidebarConfig 接口

```typescript
interface SidebarConfig {
  // Logo配置
  logoSrc?: string;                    // Logo图片路径
  logoText?: string;                   // Logo文字
  onLogoClick?: () => void;            // Logo点击回调

  // 导航项配置
  navItems: NavItem[];                 // 导航项数组

  // 常用Agent配置
  showCommonAgents?: boolean;          // 是否显示常用Agent
  commonAgents?: CommonAgent[];        // 常用Agent数组
  onAgentClick?: (agent: CommonAgent) => void;  // Agent点击回调

  // 历史会话配置
  showHistorySessions?: boolean;       // 是否显示历史会话
  historySessions?: HistorySession[];  // 历史会话数组
  onSessionClick?: (session: HistorySession) => void;  // 会话点击回调
  onSessionMenuAction?: (sessionId: string, action: string) => void;  // 会话菜单操作

  // 自定义内容
  customContent?: ReactNode;           // 自定义React组件
}
```

### NavItem 接口

```typescript
interface NavItem {
  id: string;              // 唯一标识
  icon: ReactNode;         // 图标（React组件）
  label: string;           // 标签文字
  onClick: () => void;     // 点击回调
  isActive?: boolean;      // 是否激活状态
  tooltip?: string;        // 收起时的提示文字
}
```

### useSidebar Hook 返回值

```typescript
{
  isCollapsed: boolean;           // 当前收起状态
  toggleCollapse: () => void;     // 切换收起状态
  collapse: () => void;           // 强制收起
  expand: () => void;             // 强制展开
  setIsCollapsed: (value: boolean) => void;  // 直接设置状态
}
```

---

## 最佳实践

### 1. 导航项配置

**推荐做法：**
```tsx
const navItems: NavItem[] = useMemo(() => [
  {
    id: 'chat',
    icon: <MessageSquare className="h-5 w-5" />,
    label: '新会话',
    onClick: handleNewChat,
    isActive: currentPage === 'chat'
  }
], [currentPage]);
```

**为什么：**
- 使用 `useMemo` 避免不必要的重新渲染
- 动态设置 `isActive` 反映当前状态
- 使用统一的图标尺寸 `h-5 w-5`

### 2. 事件处理

**推荐做法：**
```tsx
const handleAgentClick = useCallback((agent: CommonAgent) => {
  // 检查登录状态
  const { isLoggedIn } = getStoredLoginState();

  if (!isLoggedIn) {
    triggerLoginEvent('sidebar', agent);
    return;
  }

  // 执行导航
  navigate(`/agent/${agent.id}`);
}, [navigate]);
```

**为什么：**
- 使用 `useCallback` 优化性能
- 集中处理登录逻辑
- 使用工具函数保持代码整洁

### 3. 状态持久化

**推荐做法：**
```tsx
const { isCollapsed, toggleCollapse } = useSidebar(false);
```

**为什么：**
- Hook自动处理localStorage
- 用户偏好在页面刷新后保留
- 提供更好的用户体验

### 4. 响应式设计

**推荐做法：**
```tsx
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

// 移动端默认收起
const { isCollapsed, toggleCollapse } = useSidebar(isMobile);
```

### 5. 类型安全

**推荐做法：**
```tsx
import type { SidebarConfig, NavItem, CommonAgent } from '@/components/Sidebar';

const config: SidebarConfig = {
  // TypeScript会检查类型
};
```

---

## 常见问题

### Q1: 如何自定义侧边栏样式？

**A:** 侧边栏使用Tailwind CSS类名，你可以通过以下方式自定义：

```tsx
// 方式1: 修改Sidebar组件的className
// 在Sidebar.tsx中找到相应的元素并修改类名

// 方式2: 使用CSS覆盖
// 在你的CSS文件中添加更高优先级的样式
```

### Q2: 如何在侧边栏中添加新的功能区域？

**A:** 使用 `customContent` 属性：

```tsx
const config: SidebarConfig = {
  // ...其他配置
  customContent: (
    <div className="px-6 pb-6">
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">
          我的自定义区域
        </h3>
        <YourCustomComponent />
      </div>
    </div>
  )
};
```

### Q3: 如何处理侧边栏的权限控制？

**A:** 在配置对象中动态设置：

```tsx
const navItems: NavItem[] = [
  {
    id: 'admin',
    icon: <Settings className="h-5 w-5" />,
    label: '管理',
    onClick: handleAdmin
  }
].filter(item => {
  // 根据权限过滤
  if (item.id === 'admin' && !userHasAdminPermission) {
    return false;
  }
  return true;
});
```

### Q4: 如何实现侧边栏的懒加载？

**A:** 使用React的动态导入：

```tsx
const Sidebar = lazy(() => import('@/components/Sidebar'));

<Suspense fallback={<SidebarSkeleton />}>
  <Sidebar {...props} />
</Suspense>
```

### Q5: 侧边栏状态如何与路由同步？

**A:** 监听路由变化并更新配置：

```tsx
const location = useLocation();

const navItems: NavItem[] = useMemo(() => [
  {
    id: 'chat',
    icon: <MessageSquare className="h-5 w-5" />,
    label: '新会话',
    onClick: () => navigate('/chat'),
    isActive: location.pathname === '/chat'
  },
  {
    id: 'marketplace',
    icon: <Grid3X3 className="h-5 w-5" />,
    label: 'Agent广场',
    onClick: () => navigate('/marketplace'),
    isActive: location.pathname === '/marketplace'
  }
], [location.pathname, navigate]);
```

### Q6: 如何测试侧边栏组件？

**A:** 使用React Testing Library：

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '@/components/Sidebar';

test('sidebar toggles collapse state', () => {
  const onToggle = jest.fn();

  render(
    <Sidebar
      isCollapsed={false}
      onToggleCollapse={onToggle}
      config={mockConfig}
    />
  );

  const toggleButton = screen.getByTitle('收起侧边栏');
  fireEvent.click(toggleButton);

  expect(onToggle).toHaveBeenCalled();
});
```

### Q7: 侧边栏的动画如何自定义？

**A:** 修改transition类名：

```tsx
// 在Sidebar.tsx中找到:
className="transition-all duration-300 ease-in-out"

// 修改为:
className="transition-all duration-500 ease-out"
```

### Q8: 如何实现侧边栏的主题切换？

**A:** 通过Context或状态管理：

```tsx
const ThemeContext = createContext({ theme: 'dark' });

// 在Sidebar组件中使用
const { theme } = useContext(ThemeContext);

const bgClass = theme === 'dark'
  ? 'bg-gray-800/90'
  : 'bg-white/90';
```

---

## 迁移检查清单

- [ ] 导入新的Sidebar组件和Hook
- [ ] 创建SidebarConfig配置对象
- [ ] 替换旧的侧边栏JSX
- [ ] 更新状态管理逻辑
- [ ] 调整主内容区域边距
- [ ] 测试展开/收起功能
- [ ] 测试所有导航项点击
- [ ] 测试登录/登出功能
- [ ] 验证响应式行为
- [ ] 检查TypeScript类型错误
- [ ] 删除旧的侧边栏代码
- [ ] 更新相关文档

---

## 兼容性说明

### 浏览器支持
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### React版本
- React 18.0+
- React DOM 18.0+

### TypeScript版本
- TypeScript 5.0+

---

## 性能优化建议

1. **使用React.memo包裹静态内容**
```tsx
const StaticNavItem = React.memo(({ item }: { item: NavItem }) => (
  <button onClick={item.onClick}>
    {item.icon}
    {item.label}
  </button>
));
```

2. **使用useMemo缓存配置**
```tsx
const config = useMemo(() => ({
  navItems,
  commonAgents,
  historySessions
}), [navItems, commonAgents, historySessions]);
```

3. **虚拟化长列表**
```tsx
import { FixedSizeList } from 'react-window';

// 用于历史会话列表
```

---

## 技术支持

如有问题，请参考：
- 示例代码：`src/examples/SidebarUsageExample.tsx`
- 工具函数：`src/utils/sidebarHelpers.ts`
- Hook文档：`src/hooks/useSidebar.ts`

---

## 更新日志

### v1.0.0 (2024-01-15)
- ✨ 初始版本发布
- ✅ 完整的TypeScript类型支持
- ✅ 统一的交互逻辑
- ✅ 响应式设计
- ✅ 状态持久化
