# 侧边栏系统快速参考

## 🚀 30秒快速开始

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
        onClick: () => handleChat()
      }
    ]
  };

  return (
    <>
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        config={config}
      />
      <main className={isCollapsed ? 'ml-16' : 'ml-64'}>
        {/* 内容 */}
      </main>
    </>
  );
}
```

---

## 📦 文件结构

```
src/
├── components/Sidebar.tsx       # 核心组件
├── hooks/useSidebar.ts         # 状态Hook
├── utils/sidebarHelpers.ts     # 工具函数
├── examples/SidebarUsageExample.tsx  # 示例
└── tests/Sidebar.test.tsx      # 测试
```

---

## 🎯 核心API

### Sidebar组件

```tsx
<Sidebar
  isCollapsed={boolean}
  onToggleCollapse={() => void}
  config={SidebarConfig}
/>
```

### useSidebar Hook

```tsx
const {
  isCollapsed,      // 当前状态
  toggleCollapse,   // 切换函数
  collapse,         // 强制收起
  expand           // 强制展开
} = useSidebar(defaultCollapsed?);
```

### SidebarConfig对象

```tsx
{
  // 基础配置
  logoSrc?: string,
  logoText?: string,
  onLogoClick?: () => void,
  navItems: NavItem[],

  // 可选功能
  showCommonAgents?: boolean,
  commonAgents?: CommonAgent[],
  onAgentClick?: (agent) => void,

  showHistorySessions?: boolean,
  historySessions?: HistorySession[],
  onSessionClick?: (session) => void,

  customContent?: ReactNode
}
```

### NavItem对象

```tsx
{
  id: string,
  icon: ReactNode,
  label: string,
  onClick: () => void,
  isActive?: boolean,
  tooltip?: string
}
```

---

## 💡 常用代码片段

### 1. 基础侧边栏

```tsx
const config: SidebarConfig = {
  logoSrc: '/logo.png',
  logoText: 'App',
  navItems: [
    {
      id: 'home',
      icon: <Home className="h-5 w-5" />,
      label: '首页',
      onClick: () => navigate('/')
    }
  ]
};
```

### 2. 带Agent的侧边栏

```tsx
const config: SidebarConfig = {
  ...basicConfig,
  showCommonAgents: true,
  commonAgents: [
    {
      id: '1',
      name: 'Agent名称',
      description: '描述',
      category: '分类',
      author: '作者',
      gradient: 'from-pink-400 to-purple-500'
    }
  ],
  onAgentClick: (agent) => handleAgent(agent)
};
```

### 3. 带历史会话的侧边栏

```tsx
const config: SidebarConfig = {
  ...basicConfig,
  showHistorySessions: true,
  historySessions: sessions,
  onSessionClick: (session) => loadSession(session)
};
```

### 4. 响应式侧边栏

```tsx
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);

const { isCollapsed } = useSidebar(isMobile);
```

### 5. 动态激活状态

```tsx
const navItems: NavItem[] = useMemo(() => [
  {
    id: 'chat',
    icon: <MessageSquare className="h-5 w-5" />,
    label: '新会话',
    onClick: () => navigate('/chat'),
    isActive: location.pathname === '/chat'
  }
], [location.pathname]);
```

---

## 🎨 样式速查

### 尺寸

```
侧边栏宽度: 展开 256px / 收起 64px
图标尺寸: 20×20px (h-5 w-5)
按钮内边距: 展开 px-4 py-3 / 收起 p-3
切换按钮: 32×32px (w-8 h-8)
```

### 颜色

```css
背景: bg-gray-800/90
边框: border-gray-700/50
文字: text-gray-200
激活: text-blue-400, from-blue-900/30
```

### 动画

```css
布局: transition-all duration-300 ease-in-out
交互: transition-all duration-200
悬停: hover:scale-105
```

---

## 🔧 工具函数速查

```tsx
import {
  getStoredLoginState,    // 获取登录状态
  clearLoginState,        // 清除登录状态
  formatSessionTime,      // 格式化时间
  triggerLoginEvent,      // 触发登录
  triggerLogoutEvent,     // 触发登出
  getSidebarClassNames,   // 生成样式
  getNavButtonClasses,    // 按钮样式
  validateSidebarConfig   // 验证配置
} from '@/utils/sidebarHelpers';
```

---

## 🎯 最佳实践

### ✅ 推荐

```tsx
// 使用Hook
const { isCollapsed } = useSidebar();

// 使用memo
const config = useMemo(() => ({...}), [deps]);

// 类型定义
const navItems: NavItem[] = [...];

// 工具函数
triggerLoginEvent('sidebar');
```

### ❌ 避免

```tsx
// 手动管理
const [isCollapsed, set] = useState(false);

// 每次重建
const config = {...};

// 使用any
const navItems: any[] = [...];

// 直接dispatch
window.dispatchEvent(...);
```

---

## 🐛 常见问题

### Q: 状态不保持？
**A:** 使用`useSidebar()` Hook而非`useState`

### Q: 登录状态不同步？
**A:** 确保App.tsx监听了`userLogout`事件

### Q: 内容被遮挡？
**A:** 使用`useSidebarMargin(isCollapsed)`或`ml-16`/`ml-64`

### Q: 导航不响应？
**A:** 检查`onClick`是否使用箭头函数

---

## 📚 文档链接

- **完整文档**: `SIDEBAR_SYSTEM_README.md`
- **迁移指南**: `SIDEBAR_MIGRATION_GUIDE.md`
- **实施总结**: `SIDEBAR_IMPLEMENTATION_SUMMARY.md`
- **验收清单**: `SIDEBAR_CHECKLIST.md`
- **代码示例**: `src/examples/SidebarUsageExample.tsx`

---

## 🎯 5分钟迁移清单

- [ ] 导入Sidebar和useSidebar
- [ ] 创建config对象
- [ ] 替换旧侧边栏JSX
- [ ] 调整主内容边距
- [ ] 测试所有功能
- [ ] 删除旧代码

---

## 💻 命令速查

```bash
# 测试
npm run test

# 构建
npm run build

# 开发
npm run dev
```

---

## 📞 需要帮助？

1. 查看完整文档
2. 运行示例代码
3. 阅读测试用例
4. 创建Issue

---

**版本**: 1.0.0
**最后更新**: 2024-01-15
