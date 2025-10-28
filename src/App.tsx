import React, { useState } from 'react';
import { Menu, X, Paperclip, BarChart3, Search, Users, Brain, Shield, MessageSquare, Grid3x3 as Grid3X3 } from 'lucide-react';
import AgentMarketplace from './components/AgentMarketplace.tsx';
import PlatformIntro from './components/PlatformIntro.tsx';
import ChatPage from './components/ChatPage.tsx';
import AgentChatPage from './components/AgentChatPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import FileUploadButton from './components/FileUploadButton.tsx';
import { useEffect } from 'react';

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

// 保存登录状态
const saveLoginState = (isLoggedIn: boolean, username: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn.toString());
    localStorage.setItem(STORAGE_KEYS.USERNAME, username);
  } catch (error) {
    console.warn('无法保存登录状态到本地存储');
  }
};

// 清除登录状态
const clearLoginState = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
  } catch (error) {
    console.warn('无法清除本地存储的登录状态');
  }
};

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedFeature, setSelectedFeature] = useState('流量分析');
  
  // 初始化登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(() => getStoredLoginState().isLoggedIn);
  const [username, setUsername] = useState(() => getStoredLoginState().username);
  
  const [pendingMessage, setPendingMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  // 获取当前选中功能对应的占位符文本
  const getPlaceholderText = () => {
    const placeholderTexts = {
      '流量分析': `同学你好，我是您的流量质量case排查助手，请您按照以下格式输入待排查信息查询对象：
查询对象: XXXXXXXX
对象类型: 账户id/卖家id/作者id  
查询周期: 202508XX-202508XX
资源位: 激励视频/搜索/喜番/硬广/软广/开屏/联盟/内部粉条/微信小程序`,
      '找数据': '找表、找口径、找数据点我，目前还在建设中会的有限，有问题找方炅',
      '政策团组关系': '输入团组申诉工单号或者输入两张执照就可以查询关联关系',
      '分析助手': '你好！我现在只会优质准召分析，其余场景归因覆盖建设中，有问题找方炅'
    };
    return placeholderTexts[selectedFeature as keyof typeof placeholderTexts] || '';
  };
  // 历史会话管理
  const [historySessions, setHistorySessions] = useState<HistorySession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // 统一的历史会话数据结构
  interface HistorySession {
    id: string;
    title: string;
    agentName: string;
    timestamp: Date;
    isActive: boolean;
    messages: any[];
    type: 'chat' | 'agent-chat'; // 区分普通聊天和Agent聊天
  }

  // 统一的历史会话管理函数
  const createHistorySession = (title: string, agentName: string, type: 'chat' | 'agent-chat' = 'chat') => {
    const newSession: HistorySession = {
      id: `session-${Date.now()}`,
      title: title,
      agentName: agentName,
      timestamp: new Date(),
      isActive: true,
      messages: [],
      type: type
    };
    
    // 将之前的会话设为非活跃状态
    setHistorySessions(prev => [
      newSession,
      ...prev.map(session => ({ ...session, isActive: false }))
    ]);
    
    setCurrentSessionId(newSession.id);
    return newSession;
  };

  // 切换会话
  const switchToSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setHistorySessions(prev => prev.map(session => ({
      ...session,
      isActive: session.id === sessionId
    })));
  };

  // 获取当前活跃会话
  const getCurrentSession = () => {
    return historySessions.find(session => session.isActive);
  };

  // 获取指定类型的历史会话
  const getSessionsByType = (type?: 'chat' | 'agent-chat', agentName?: string) => {
    return historySessions.filter(session => {
      if (type && session.type !== type) return false;
      if (agentName && session.agentName !== agentName) return false;
      return true;
    });
  };

  // 监听Agent切换事件
  useEffect(() => {
    const handleSwitchAgent = (event: CustomEvent) => {
      const targetAgent = event.detail;
      if (!isLoggedIn) {
        setSelectedAgent(targetAgent);
        setCurrentPage('login');
      } else {
        setSelectedAgent(targetAgent);
        setCurrentPage('agent-chat');
      }
    };

    const handleNeedLogin = (event: CustomEvent) => {
      const { agent } = event.detail;
      setSelectedAgent(agent);
      setCurrentPage('login');
    };

    const handleNavigateToAgentMarketplace = () => {
      setCurrentPage('agent-marketplace');
    };
    window.addEventListener('switchAgent', handleSwitchAgent as EventListener);
    window.addEventListener('needLogin', handleNeedLogin as EventListener);
    window.addEventListener('navigateToAgentMarketplace', handleNavigateToAgentMarketplace as EventListener);

    return () => {
      window.removeEventListener('switchAgent', handleSwitchAgent as EventListener);
      window.removeEventListener('needLogin', handleNeedLogin as EventListener);
      window.removeEventListener('navigateToAgentMarketplace', handleNavigateToAgentMarketplace as EventListener);
    };
  }, [isLoggedIn]);

  // 示例问题库
  const exampleQuestions = {
    '流量分析': [
      '分析最近7天的用户流量异常情况',
      '对比本月与上月的流量趋势变化',
      '识别高风险流量来源和特征'
    ],
    '找数据': [
      '查询用户ID为x123456的详细记录',
      '提取最近30天的交易异常数据',
      '导出高风险用户的行为特征数据'
    ],
    '政策团组关系': [
      '分析用户x789012的关联账户网络',
      '识别可疑团伙的组织结构特征',
      '查找与目标用户相关的风险群体'
    ],
    '分析助手': [
      '为什么用户x456789被标记为高风险？',
      '推荐针对当前异常的风控策略',
      '预测下周可能出现的风险趋势'
    ]
  };

  const handleFeaturePillClick = (title: string) => {
    if (title === '更多...') {
      setCurrentPage('agent-marketplace');
      return;
    }
    
    // 设置选中的功能
    setSelectedFeature(title);
    
    // 对于流量分析，设置随机示例问题；其他功能清空输入框显示占位符
    if (title === '流量分析') {
      const questions = exampleQuestions[title as keyof typeof exampleQuestions];
      if (questions) {
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        setInputValue(randomQuestion);
      }
    } else {
      // 清空输入框，让占位符文本显示
      setInputValue('');
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      if (!isLoggedIn) {
        setPendingMessage(inputValue);
        setCurrentPage('login');
      } else {
        // 直接跳转到聊天页，会话创建由ChatPage处理
        setCurrentPage('chat');
      }
    }
  };

  const handleLogin = (loginUsername: string) => {
    setIsLoggedIn(true);
    setUsername(loginUsername);
    
    // 保存登录状态到本地存储
    saveLoginState(true, loginUsername);
    
    if (selectedAgent) {
      setCurrentPage('agent-chat');
    } else if (pendingMessage) {
      setInputValue(pendingMessage);
      setPendingMessage('');
      setCurrentPage('chat');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    
    // 清除本地存储的登录状态
    clearLoginState();
    
    setSelectedAgent(null);
    setCurrentPage('home');
    setInputValue('');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedAgent(null);
    if (!pendingMessage) {
      setInputValue('');
    }
  };

  if (currentPage === 'agent-marketplace') {
    return (
      <AgentMarketplace 
        onBack={handleBackToHome} 
        historySessions={historySessions}
        onSessionSwitch={switchToSession}
        onStartAgent={(agent) => {
          if (!isLoggedIn) {
            setSelectedAgent(agent);
            setCurrentPage('login');
          } else {
            setSelectedAgent(agent);
            setCurrentPage('agent-chat');
          }
        }}
      />
    );
  }

  if (currentPage === 'platform-intro') {
    return <PlatformIntro onBack={handleBackToHome} />;
  }

  if (currentPage === 'login') {
    return (
      <LoginPage 
        onBack={handleBackToHome}
        onLogin={handleLogin}
        redirectMessage={pendingMessage ? '请先登录以继续您的对话' : selectedAgent ? '请先登录以使用Agent' : undefined}
      />
    );
  }

  if (currentPage === 'chat') {
    return (
      <ChatPage 
        onBack={handleBackToHome} 
        initialMessage={inputValue}
        username={username}
        onLogout={handleLogout}
        historySessions={historySessions}
        onSessionSwitch={switchToSession}
        onCreateHistorySession={(title, agentName) => createHistorySession(title, agentName, 'chat')}
      />
    );
  }

  if (currentPage === 'agent-chat' && selectedAgent) {
    return (
      <AgentChatPage 
        onBack={handleBackToHome} 
        agent={selectedAgent}
        username={username}
        onLogout={handleLogout}
        onCreateHistorySession={(title, agentName) => createHistorySession(title, agentName, 'agent-chat')}
        historySessions={getSessionsByType('agent-chat', selectedAgent.name)}
        onSessionSwitch={switchToSession}
      />
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="/riskagentBG.png"
          alt="background"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
      {/* Navigation */}
      <nav className="bg-transparent border-b border-gray-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <img src="/Vector copy.png" alt="RiskAgent Logo" className="w-10 h-10" />
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">RiskAgent</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button 
                  onClick={() => setCurrentPage('agent-marketplace')}
                  className="text-gray-300 hover:text-blue-400 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  Agent广场
                </button>
                <button 
                  onClick={() => setCurrentPage('platform-intro')}
                  className="text-gray-300 hover:text-blue-400 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  平台介绍
                </button>
                {isLoggedIn ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-300">欢迎，{username}</span>
                    <button 
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      退出登录
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setCurrentPage('login')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    登录
                  </button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-blue-400 p-2 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
                <button 
                  onClick={() => {
                    setCurrentPage('agent-marketplace');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-lg text-base font-medium w-full text-left transition-colors"
                >
                  Agent广场
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('platform-intro');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-lg text-base font-medium w-full text-left transition-colors"
                >
                  平台介绍
                </button>
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-gray-300 text-base">欢迎，{username}</div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-2 rounded-lg text-base font-medium transition-all"
                    >
                      退出登录
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setCurrentPage('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-base font-medium transition-all"
                  >
                    登录
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent mb-6 tracking-tight relative">
            Welcome To RiskAgent
          </h1>
          <p className="text-xl text-gray-300 mb-16 font-medium">
            风控不再复杂，用对话驱动决策
          </p>

          {/* AI Assistant Message */}
          <div className="max-w-4xl mx-auto mb-12">
            {/* ChatGPT Style Input Area */}
            <div className="relative bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-end p-4 space-x-3">
                <FileUploadButton />
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={getPlaceholderText()}
                    className="w-full bg-transparent border-none resize-none outline-none text-gray-100 placeholder-gray-400 text-sm leading-6 h-40 py-2 font-medium transition-all duration-200 overflow-y-auto text-left"
                    rows={1}
                    style={{ 
                      scrollbarWidth: 'none', 
                      msOverflowStyle: 'none',
                      height: '160px',
                      textAlign: 'left',
                      paddingLeft: '0px'
                    }}
                  />
                  <style jsx>{`
                    textarea::-webkit-scrollbar {
                      width: 6px;
                    }
                    textarea::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    textarea::-webkit-scrollbar-thumb {
                      background: #6b7280;
                      border-radius: 3px;
                    }
                    textarea::-webkit-scrollbar-thumb:hover {
                      background: #9ca3af;
                    }
                  `}</style>
                </div>
                <button 
                  onClick={handleSendMessage}
                  className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full transition-all duration-200 hover:scale-105 shadow-lg self-end"
                >
                  <span className="text-white text-sm font-semibold">发送</span>
                </button>
              </div>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <FeaturePill 
              icon={<BarChart3 className="h-4 w-4" />} 
              title="流量分析" 
              active={selectedFeature === '流量分析'}
              onClick={() => handleFeaturePillClick('流量分析')}
            />
            <FeaturePill 
              icon={<Search className="h-4 w-4" />} 
              title="找数据" 
              active={selectedFeature === '找数据'}
              onClick={() => handleFeaturePillClick('找数据')}
            />
            <FeaturePill 
              icon={<Users className="h-4 w-4" />} 
              title="政策团组关系" 
              active={selectedFeature === '政策团组关系'}
              onClick={() => handleFeaturePillClick('政策团组关系')}
            />
            <FeaturePill 
              icon={<Brain className="h-4 w-4" />} 
              title="分析助手" 
              active={selectedFeature === '分析助手'}
              onClick={() => handleFeaturePillClick('分析助手')}
            />
            <FeaturePill 
              title="更多..." 
              active={false}
              onClick={() => handleFeaturePillClick('更多...')}
            />
          </div>

        </div>
      </section>
      </div>
    </div>
  );
}

interface FeaturePillProps {
  icon?: React.ReactNode;
  title: string;
  active?: boolean;
  onClick?: () => void;
}

function FeaturePill({ icon, title, active = false, onClick }: FeaturePillProps) {
  return (
    <div className={`inline-flex items-center space-x-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-105 ${
      active 
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border border-blue-400' 
        : 'bg-gray-700/80 backdrop-blur-sm text-gray-200 border border-gray-600/50 hover:bg-gray-600 hover:shadow-lg hover:border-blue-400'
    }`}
    onClick={onClick}>
      {icon}
      <span>{title}</span>
    </div>
  );
}

export default App;