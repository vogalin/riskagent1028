# 通用侧边栏系统

## 🎯 系统概述

这是一个完整的、可复用的侧边栏系统，为整个应用提供统一的侧边栏体验。

### 核心特性

✅ **统一的交互逻辑** - 所有侧边栏保持一致的展开/收起行为
✅ **灵活的配置系统** - 通过配置对象轻松定制侧边栏
✅ **完整的类型支持** - 完整的TypeScript类型定义
✅ **状态持久化** - 自动保存用户的展开/收起偏好
✅ **响应式设计** - 适配各种屏幕尺寸
✅ **无障碍访问** - 支持键盘导航和屏幕阅读器
✅ **高性能** - 优化的渲染和状态管理
✅ **易于测试** - 完整的测试套件

---

## 📁 文件结构

```
src/
├── components/
│   └── Sidebar.tsx              # 核心侧边栏组件
├── hooks/
│   └── useSidebar.ts           # 侧边栏状态管理Hook
├── utils/
│   └── sidebarHelpers.ts       # 工具函数库
├── examples/
│   └── SidebarUsageExample.tsx # 使用示例
└── tests/
    └── Sidebar.test.tsx        # 测试文件

docs/
├── SIDEBAR_MIGRATION_GUIDE.md  # 迁移指南
└── SIDEBAR_SYSTEM_README.md    # 系统文档（本文件）
```

---

## 🚀 快速开始

### 1. 基础用法

```tsx
import Sidebar, { SidebarConfig } from '@/components/Sidebar';
import { useSidebar } from '@/hooks/useSidebar';
import { MessageSquare, Grid3X3 } from 'lucide-react';

function MyPage() {
  const { isCollapsed, toggleCollapse } = useSidebar();

  const config: SidebarConfig = {
    logoSrc: '/logo.png',
    logoText: 'MyApp',
    onLogoClick: () => navigate('/'),
    navItems: [
      {
        id: 'chat',
        icon: <MessageSquare className="h-5 w-5" />,
        label: '新会话',
        onClick: () => handleNewChat()
      },
      {
        id: 'marketplace',
        icon: <Grid3X3 className="h-5 w-5" />,
        label: 'Agent广场',
        onClick: () => handleMarketplace(),
        isActive: true
      }
    ]
  };

  return (
    <div>
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        config={config}
      />
      <main className={isCollapsed ? 'ml-16' : 'ml-64'}>
        {/* 页面内容 */}
      </main>
    </div>
  );
}
```

### 2. 完整功能示例

```tsx
const config: SidebarConfig = {
  // Logo
  logoSrc: '/Vector copy.png',
  logoText: 'RiskAgent',
  onLogoClick: () => navigate('/'),

  // 导航项
  navItems: [
    {
      id: 'chat',
      icon: <MessageSquare className="h-5 w-5" />,
      label: '新会话',
      onClick: handleNewChat,
      isActive: page === 'chat',
      tooltip: '开始新的对话'
    },
    {
      id: 'marketplace',
      icon: <Grid3X3 className="h-5 w-5" />,
      label: 'Agent广场',
      onClick: handleMarketplace,
      isActive: page === 'marketplace'
    }
  ],

  // 常用Agent
  showCommonAgents: true,
  commonAgents: [
    {
      id: '1',
      name: '小店追单',
      description: '风险预测分析',
      category: '流量质量',
      author: '反作弊算法',
      gradient: 'from-pink-400 to-purple-500'
    }
  ],
  onAgentClick: (agent) => handleAgentClick(agent),

  // 历史会话
  showHistorySessions: true,
  historySessions: sessions,
  onSessionClick: (session) => handleSessionClick(session),

  // 自定义内容
  customContent: <CustomWidget />
};
```

---

## 🎨 设计规范

### 尺寸规范

| 元素 | 展开状态 | 收起状态 |
|------|----------|----------|
| 侧边栏宽度 | 256px (w-64) | 64px (w-16) |
| Logo图标 | 40×40px | 32×32px |
| 导航图标 | 20×20px | 20×20px |
| 切换按钮 | 32×32px | 32×32px |
| 按钮内边距 | px-4 py-3 | p-3 |

### 颜色规范

```css
/* 背景 */
bg-gray-800/90           /* 侧边栏主背景 */
bg-gray-800/95           /* 底部区域背景 */

/* 边框 */
border-gray-700/50       /* 主边框 */
border-blue-600/50       /* 激活边框 */

/* 文字 */
text-gray-200            /* 主文字 */
text-blue-400            /* 激活/悬停文字 */
text-gray-400            /* 次要文字 */

/* 渐变 */
from-blue-900/30 to-indigo-900/30  /* 激活状态 */
from-blue-500 to-purple-600        /* 用户头像 */
```

### 动画规范

```css
transition-all duration-300 ease-in-out  /* 展开/收起 */
transition-all duration-200              /* 按钮交互 */
hover:scale-105                          /* 按钮悬停 */
hover:scale-110                          /* 切换按钮悬停 */
```

---

## 🔧 核心API

### Sidebar 组件

```typescript
interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  config: SidebarConfig;
}
```

### SidebarConfig 配置

```typescript
interface SidebarConfig {
  // Logo配置
  logoSrc?: string;
  logoText?: string;
  onLogoClick?: () => void;

  // 导航配置
  navItems: NavItem[];

  // Agent配置
  showCommonAgents?: boolean;
  commonAgents?: CommonAgent[];
  onAgentClick?: (agent: CommonAgent) => void;

  // 会话配置
  showHistorySessions?: boolean;
  historySessions?: HistorySession[];
  onSessionClick?: (session: HistorySession) => void;

  // 自定义内容
  customContent?: ReactNode;
}
```

### useSidebar Hook

```typescript
function useSidebar(defaultCollapsed?: boolean): {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  collapse: () => void;
  expand: () => void;
  setIsCollapsed: (value: boolean) => void;
}
```

---

## 🎯 核心功能

### 1. 展开/收起

- **自动保存状态** - 用户偏好保存到localStorage
- **平滑动画** - 300ms的过渡动画
- **同步更新** - 主内容区域自动调整边距

### 2. 导航管理

- **激活状态** - 自动高亮当前页面
- **图标支持** - 使用lucide-react图标库
- **Tooltip提示** - 收起时显示完整标签

### 3. 登录集成

- **全局事件** - 通过CustomEvent与App.tsx通信
- **状态同步** - 自动读取localStorage的登录状态
- **统一样式** - 登录/登出按钮样式一致

### 4. 可扩展性

- **常用Agent** - 可选的快捷入口
- **历史会话** - 可选的会话列表
- **自定义内容** - 支持任意React组件

---

## 🔄 事件系统

### 全局事件

侧边栏通过CustomEvent与应用通信：

```typescript
// 触发登录
window.dispatchEvent(new CustomEvent('needLogin', {
  detail: { source: 'sidebar', agent: agentData }
}));

// 触发登出
window.dispatchEvent(new CustomEvent('userLogout'));

// 触发Agent切换
window.dispatchEvent(new CustomEvent('switchAgent', {
  detail: agentData
}));

// 导航到Agent广场
window.dispatchEvent(new CustomEvent('navigateToAgentMarketplace'));
```

### 监听事件（在App.tsx中）

```typescript
useEffect(() => {
  const handleNeedLogin = (event: CustomEvent) => {
    const { source, agent } = event.detail;
    // 处理登录逻辑
  };

  const handleUserLogout = () => {
    // 处理登出逻辑
  };

  window.addEventListener('needLogin', handleNeedLogin);
  window.addEventListener('userLogout', handleUserLogout);

  return () => {
    window.removeEventListener('needLogin', handleNeedLogin);
    window.removeEventListener('userLogout', handleUserLogout);
  };
}, []);
```

---

## 📱 响应式设计

### 断点策略

```typescript
// 桌面端
>= 1024px: 默认展开，可手动收起

// 平板端
768px - 1023px: 默认收起，可手动展开

// 移动端
< 768px: 建议使用抽屉式侧边栏（未来功能）
```

### 实现方式

```typescript
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

---

## ♿ 无障碍访问

### 键盘导航

- **Tab键** - 在可交互元素间切换焦点
- **Enter/Space** - 激活按钮
- **Escape** - 关闭模态框（如有）

### 屏幕阅读器

- **语义化标签** - 使用`<nav>`, `<button>`等
- **title属性** - 收起状态提供完整文本
- **alt文本** - Logo图片提供描述

### ARIA属性（建议添加）

```tsx
<button
  aria-label="展开侧边栏"
  aria-expanded={!isCollapsed}
>
  {isCollapsed ? <Menu /> : <X />}
</button>

<nav aria-label="主导航">
  {/* 导航项 */}
</nav>
```

---

## 🧪 测试

### 运行测试

```bash
npm run test
```

### 测试覆盖

- ✅ 基础渲染
- ✅ 展开/收起交互
- ✅ 导航项点击
- ✅ 登录状态切换
- ✅ Agent和会话列表
- ✅ 自定义内容
- ✅ 响应式行为
- ✅ 无障碍访问

### 测试示例

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '@/components/Sidebar';

test('点击切换按钮应该触发回调', () => {
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

---

## 🚀 性能优化

### 1. React.memo

```tsx
const NavItem = React.memo(({ item }: { item: NavItem }) => (
  <button onClick={item.onClick}>
    {item.icon} {item.label}
  </button>
));
```

### 2. useMemo

```tsx
const config = useMemo(() => ({
  navItems: [...],
  commonAgents: [...]
}), [dependencies]);
```

### 3. useCallback

```tsx
const handleClick = useCallback(() => {
  // 处理逻辑
}, [dependencies]);
```

### 4. 虚拟化长列表

```tsx
import { FixedSizeList } from 'react-window';

// 用于历史会话列表（如果数量很多）
<FixedSizeList
  height={300}
  itemCount={sessions.length}
  itemSize={60}
>
  {SessionRow}
</FixedSizeList>
```

---

## 🐛 故障排查

### 问题1: 侧边栏状态不保持

**症状**: 刷新页面后侧边栏总是展开

**解决方案**:
```typescript
// 确保使用useSidebar Hook
const { isCollapsed, toggleCollapse } = useSidebar();

// 而不是直接使用useState
const [isCollapsed, setIsCollapsed] = useState(false); // ❌
```

### 问题2: 登录状态不同步

**症状**: 登录后侧边栏还显示"登录"按钮

**解决方案**:
```typescript
// 确保App.tsx中正确监听了userLogout事件
useEffect(() => {
  const handleUserLogout = () => {
    setIsLoggedIn(false);
    clearLoginState();
  };

  window.addEventListener('userLogout', handleUserLogout);
  return () => window.removeEventListener('userLogout', handleUserLogout);
}, []);
```

### 问题3: 主内容被侧边栏遮挡

**症状**: 页面内容在侧边栏下方

**解决方案**:
```tsx
// 使用useSidebarMargin Hook
const marginClass = useSidebarMargin(isCollapsed);

<main className={`min-h-screen ${marginClass}`}>
  {/* 内容 */}
</main>
```

### 问题4: 导航项不响应点击

**症状**: 点击导航项没有反应

**解决方案**:
```typescript
// 检查onClick是否正确绑定
navItems: [
  {
    id: 'chat',
    icon: <MessageSquare />,
    label: '新会话',
    onClick: () => handleNewChat() // ✅ 箭头函数
  }
]

// 而不是
onClick: handleNewChat() // ❌ 立即执行
```

---

## 📚 相关文档

- [迁移指南](./SIDEBAR_MIGRATION_GUIDE.md) - 如何从旧侧边栏迁移
- [使用示例](./src/examples/SidebarUsageExample.tsx) - 完整的代码示例
- [测试文件](./src/tests/Sidebar.test.tsx) - 测试套件
- [工具函数](./src/utils/sidebarHelpers.ts) - 辅助函数库

---

## 🔮 未来规划

### Phase 1: 核心功能 ✅
- [x] 基础侧边栏组件
- [x] 状态管理Hook
- [x] 工具函数库
- [x] 完整文档

### Phase 2: 增强功能 🚧
- [ ] 抽屉式移动端侧边栏
- [ ] 多主题支持
- [ ] 国际化支持
- [ ] 可拖拽调整宽度

### Phase 3: 高级功能 📋
- [ ] 侧边栏布局模板
- [ ] 可视化配置工具
- [ ] Storybook集成
- [ ] 性能监控仪表板

---

## 🤝 贡献指南

### 提交代码

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### 代码规范

- 使用TypeScript
- 遵循ESLint规则
- 添加必要的注释
- 编写测试用例
- 更新相关文档

---

## 📄 许可证

MIT License - 查看 LICENSE 文件了解详情

---

## 👥 维护者

- **主要维护者**: [Your Name]
- **贡献者**: [Contributors List]

---

## 📞 支持

如有问题或建议，请：

1. 查看文档和示例代码
2. 搜索已有的Issues
3. 创建新的Issue并详细描述问题

---

**最后更新**: 2024-01-15
**版本**: 1.0.0
