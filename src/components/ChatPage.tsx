import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Shield, MessageSquare, Grid3X3, Paperclip, Copy, Share, CheckCircle, AlertCircle, X, User, Bot, Menu, Clock } from 'lucide-react';
import FileUploadButton from './FileUploadButton';
import { renderMarkdown, formatTimestamp, generateSampleResponses } from '../utils/markdownRenderer';

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

// 清除登录状态
const clearLoginState = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
  } catch (error) {
    console.warn('无法清除本地存储的登录状态');
  }
};

interface ChatPageProps {
  onBack: () => void;
  initialMessage: string;
  username: string;
  onLogout: () => void;
  historySessions?: HistorySession[];
  onSessionSwitch?: (sessionId: string) => void;
  onCreateHistorySession?: (title: string, agentName: string) => void;
}

interface HistorySession {
  id: string;
  title: string;
  agentName: string;
  timestamp: Date;
  isActive: boolean;
  messages: any[];
  type: 'chat' | 'agent-chat';
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isGenerating?: boolean;
  queryInfo?: string;
  hasChart?: boolean;
  hasTable?: boolean;
  isSelected?: boolean;
}

export default function ChatPage({ onBack, initialMessage, username, onLogout, historySessions = [], onSessionSwitch, onCreateHistorySession }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [resolvedMessages, setResolvedMessages] = useState<Set<string>>(new Set());
  const [unresolvedMessages, setUnresolvedMessages] = useState<Set<string>>(new Set());
  const [isShareMode, setIsShareMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [isGeneratingShareLink, setIsGeneratingShareLink] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // 获取当前登录状态
  const { isLoggedIn: currentLoginStatus, username: currentUsername } = getStoredLoginState();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionCreatedRef = useRef(false);

  // 初始化第一条消息
  useEffect(() => {
    if (initialMessage && !sessionCreatedRef.current) {
      const userMessage: Message = {
        id: 'user-1',
        type: 'user',
        content: initialMessage,
        timestamp: new Date()
      };

      const aiMessage: Message = {
        id: 'ai-1',
        type: 'ai',
        content: '',
        timestamp: new Date(),
        isGenerating: true,
        queryInfo: '查询对象: 75724941 对象类型: 账户id 业务类型: 内循环 风险类型: 小店追单类 风险场景: 高退单率 查询周期: 2025-8-1到2025-8-15 资源位: 激励视频',
        hasChart: true,
        hasTable: true
      };

      setMessages([userMessage, aiMessage]);

      // 模拟AI生成过程
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === 'ai-1' 
            ? { 
                ...msg, 
                isGenerating: false,
                content: generateInitialAIResponse()
              }
            : msg
        ));
      }, 3000);

      // 创建历史会话
      if (onCreateHistorySession) {
        const sessionTitle = `${initialMessage.slice(0, 15)}${initialMessage.length > 15 ? '...' : ''} - 流量分析`;
        onCreateHistorySession(sessionTitle, '流量分析');
        sessionCreatedRef.current = true;
      }
    }
  }, [initialMessage, onCreateHistorySession]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const generateInitialAIResponse = () => {
    return `## 退单排查报告

### 1. 基本信息与活跃度概况
- **账户id**：78791468
- **查询周期**：20250820 至 20250826
- **总订单量**：88
- **总退单量**：22
- **首单总退单率**：0.25

### 2. 各数据维度风险表现

| 类别 | 具体 | 产品 |
|------|------|------|
| 第1期 | 社交媒体营销内容投放数据UI | 根据用户投放行为数据分析内容，高效投放，平台优质 |
| 第2期 | 事件主动推送到相关数据监管数据监管 | 根据平台对数据监管数据，对接相关企业 |
| 第3期 | 完成内容平台MVP设计案例 | 数据1G（相对算法设计平台1个产品方案） |

### 3. 图表详情
退单用户广告投放上安全监管数据的APP方案支付数据情况，安装率达100%，其他数据安全监管应用场景数据情况，排名多种功能，安装率约占27%，整体数据技术占据情况"新"高于其他APP。

### 关键发现
- 退单率异常高，需要重点关注
- 用户行为模式存在可疑特征
- 建议加强风险监控和预警机制`;
  };

  const generateAIResponse = (userInput: string) => {
    const sampleResponses = generateSampleResponses();
    return sampleResponses[Math.floor(Math.random() * sampleResponses.length)].content;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isGenerating: true
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
    setInputValue('');

    // 模拟AI生成
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessage.id 
          ? { 
              ...msg, 
              isGenerating: false,
              content: generateAIResponse(userMessage.content)
            }
          : msg
      ));
    }, 2000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      showToastMessage('复制成功');
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToastMessage('复制成功');
    }
  };

  const handleResolveToggle = (messageId: string) => {
    setResolvedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        setUnresolvedMessages(prevUnresolved => {
          const newUnresolvedSet = new Set(prevUnresolved);
          newUnresolvedSet.delete(messageId);
          return newUnresolvedSet;
        });
      }
      return newSet;
    });
  };

  const handleUnresolvedClick = (messageId: string) => {
    if (!unresolvedMessages.has(messageId)) {
      setShowFeedbackModal(true);
    } else {
      setUnresolvedMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmitFeedback = () => {
    setShowFeedbackModal(false);
    // 这里应该添加具体的messageId，但为了简化，我们使用当前时间戳
    const currentMessageId = `ai-${Date.now()}`;
    setUnresolvedMessages(prev => new Set([...prev, currentMessageId]));
    setSelectedReasons([]);
    setFeedbackText('');
    showToastMessage('反馈提交成功');
  };

  const handleEnterShareMode = () => {
    setIsShareMode(true);
    setSelectedMessages(new Set());
  };

  const handleExitShareMode = () => {
    setIsShareMode(false);
    setSelectedMessages(new Set());
  };

  const handleToggleMessageSelection = (messageId: string) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allMessageIds = messages.map(msg => msg.id);
    if (selectedMessages.size === messages.length) {
      // 取消全选
      setSelectedMessages(new Set());
    } else {
      // 全选
      setSelectedMessages(new Set(allMessageIds));
    }
  };

  const handleGenerateShareLink = async () => {
    if (selectedMessages.size === 0) return;
    
    setIsGeneratingShareLink(true);
    
    try {
      // 模拟生成分享链接的过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 获取选中的消息内容
      const selectedContent = messages
        .filter(msg => selectedMessages.has(msg.id))
        .map(msg => `${msg.type === 'user' ? '用户' : 'AI'}: ${msg.content}`)
        .join('\n\n');
      
      // 生成分享链接（实际项目中应该调用后端API）
      const shareId = Math.random().toString(36).substr(2, 9);
      const shareLink = `${window.location.origin}/share/${shareId}`;
      
      // 复制到剪贴板
      await navigator.clipboard.writeText(shareLink);
      
      showToastMessage('当前对话内容分享链接已生成');
      handleExitShareMode();
    } catch (error) {
      showToastMessage('生成分享链接失败，请重试');
    } finally {
      setIsGeneratingShareLink(false);
    }
  };

  const handleSessionClick = (session: HistorySession) => {
    if (session.isActive || !onSessionSwitch) return;
    
    onSessionSwitch(session.id);
    showToastMessage(`已切换到会话: ${session.title}`);
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

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedReasons([]);
    setFeedbackText('');
  };


  const renderChart = () => (
    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-6 mb-6 border border-blue-600/50">
      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
        设备系统版本分布
      </h4>
      <div className="h-48 bg-gray-700 rounded-lg border border-gray-600 flex items-end justify-around p-4 shadow-sm">
        {[
          { label: 'iOS', value: 45, color: 'bg-blue-500' },
          { label: 'Android', value: 32, color: 'bg-green-500' },
          { label: 'Web', value: 18, color: 'bg-purple-500' },
          { label: 'Other', value: 5, color: 'bg-gray-400' }
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div 
              className={`${item.color} rounded-t-md transition-all duration-1000 ease-out`}
              style={{ height: `${item.value * 2}px`, width: '40px' }}
            ></div>
            <div className="text-center">
              <div className="text-sm font-medium text-white">{item.label}</div>
              <div className="text-xs text-gray-300">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const feedbackReasons = [
    '没有理解问题',
    '没有完成任务',
    '编造事实',
    '废话太多',
    '没有创意',
    '文风不好',
    '引用网页质量不高',
    '信息陈旧'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 bottom-0 h-screen bg-gray-800/90 backdrop-blur-xl border-r border-gray-700/50 flex flex-col shadow-2xl transition-all duration-300 ease-in-out z-40 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Toggle Button */}
        <div className="absolute left-4 top-4 z-50">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-7 h-7 bg-gray-700/90 backdrop-blur-sm hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg border border-gray-600/50"
          >
            {isSidebarCollapsed ? (
              <Menu className="h-3 w-3 text-gray-300" />
            ) : (
              <X className="h-3 w-3 text-gray-300" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className={`flex items-center mb-8 cursor-pointer hover:opacity-80 transition-opacity ${
            isSidebarCollapsed ? 'justify-center mt-8' : ''
          }`} onClick={onBack}>
            <img src="/Vector copy.png" alt="RiskAgent Logo" className="w-10 h-10 mr-3" />
            {!isSidebarCollapsed && <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">RiskAgent</span>}
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={onBack}
              className={`flex items-center w-full px-4 py-3 text-gray-200 hover:bg-blue-900/30 hover:text-blue-400 rounded-xl transition-all duration-200 hover:scale-105 ${
                isSidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              {!isSidebarCollapsed && '新会话'}
            </button>
            <button
              onClick={() => {
                onBack();
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('navigateToAgentMarketplace'));
                }, 100);
              }}
              className={`flex items-center w-full px-4 py-3 text-gray-200 hover:bg-blue-900/30 hover:text-blue-400 rounded-xl transition-all duration-200 hover:scale-105 ${
              isSidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <Grid3X3 className="h-5 w-5 mr-3" />
              {!isSidebarCollapsed && 'Agent广场'}
            </button>
          </nav>

          {!isSidebarCollapsed && (
          <>
            <div className="mt-8 transition-opacity duration-300">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">常用Agent</h3>
            <div className="space-y-2">
              <div 
                onClick={() => {
                  const targetAgent = {
                    id: 'sidebar-1',
                    name: '小店追单',
                    description: '帮助用户高效分析，广告主下单速度风险预测，并给出风险预测',
                    category: '流量质量',
                    author: '反作弊算法',
                    gradient: 'from-pink-400 to-purple-500'
                  };
                  // 返回主页并切换到Agent
                  onBack();
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('switchAgent', { 
                      detail: targetAgent 
                    }));
                  }, 100);
                }}
                className="flex items-center px-4 py-3 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-pink-900/30 hover:to-purple-900/30 hover:text-pink-400 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
              >
                <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mr-3 shadow-sm"></div>
                流量质量-小店追单
              </div>
              <div 
                onClick={() => {
                  const targetAgent = {
                    id: 'sidebar-2',
                    name: '联盟媒体分析',
                    description: '帮助用户高效分析，广告主下单速度风险预测，并给出风险预测',
                    category: '流量质量',
                    author: '反作弊算法',
                    gradient: 'from-blue-400 to-purple-500'
                  };
                  onBack();
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('switchAgent', { 
                      detail: targetAgent 
                    }));
                  }, 100);
                }}
                className="flex items-center px-4 py-3 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-purple-900/30 hover:text-blue-400 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
              >
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3 shadow-sm"></div>
                流量质量-联盟媒体
              </div>
              <div 
                onClick={() => {
                  const targetAgent = {
                    id: 'sidebar-3',
                    name: '团组关系',
                    description: '帮助用户高效分析，广告主下单速度风险预测，并给出风险预测',
                    category: '政策团组',
                    author: '反作弊算法',
                    gradient: 'from-purple-400 to-pink-500'
                  };
                  onBack();
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('switchAgent', { 
                      detail: targetAgent 
                    }));
                  }, 100);
                }}
                className="flex items-center px-4 py-3 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-pink-900/30 hover:text-purple-400 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
              >
                <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-3 shadow-sm"></div>
                政策团组-团组关系
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              历史会话
            </h3>
            <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
              {historySessions.map((session) => (
                <div 
                  key={session.id}
                  onClick={() => handleSessionClick(session)}
                  className={`group px-4 py-4 rounded-xl cursor-pointer text-sm transition-all duration-200 hover:scale-[1.02] relative ${
                    session.isActive 
                      ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-400 border border-blue-600/50 shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-700/50 hover:shadow-lg border border-transparent hover:border-gray-600/50'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${
                      session.isActive ? 'bg-blue-500' : 'bg-gray-300 group-hover:bg-gray-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold truncate leading-5 ${
                        session.isActive ? 'text-blue-300' : 'text-gray-200 group-hover:text-white'
                      }`} title={session.title}>
                        {session.title}
                      </div>
                      <div className={`text-xs mt-1 ${
                        session.isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'
                      }`}>
                        {formatSessionTime(session.timestamp)}
                      </div>
                    </div>
                  </div>
                  {session.isActive && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-sm"></div>
                    </div>
                  )}
                </div>
              ))}
              
              {historySessions.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <MessageSquare className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm">暂无聊天记录</p>
                </div>
              )}
            </div>
          </div>
          </>
          )}
        </div>

        {/* User Info */}
        {!isSidebarCollapsed && (
        <div className="flex-shrink-0 p-6 border-t border-gray-700/50 transition-opacity duration-300 bg-gray-800/90">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{currentUsername || username}</div>
              <button 
                onClick={() => {
                  clearLoginState();
                  onLogout();
                }}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium hover:scale-105"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 px-6 py-5 shadow-lg z-20">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl mr-4 shadow-lg"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">流量分析</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 pb-32 bg-gradient-to-b from-gray-900/50 to-gray-800/80">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start ${message.type === 'user' ? 'justify-end' : 'justify-start'} ${isShareMode ? 'pl-12' : ''}`}>
                {/* 分享模式下的复选框 */}
                {isShareMode && (
                  <div className="flex-shrink-0 mr-3 mt-2">
                    <button
                      onClick={() => handleToggleMessageSelection(message.id)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${
                        selectedMessages.has(message.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      {selectedMessages.has(message.id) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
                
                {message.type === 'user' ? (
                  // User Message
                  <div className="flex flex-col items-end max-w-2xl">
                    <div className="flex items-end space-x-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-4 rounded-2xl rounded-br-md shadow-xl">
                        <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-2 mr-2 text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTimestamp(message.timestamp)}</span>
                    </div>
                  </div>
                ) : (
                  // AI Message
                  <div className="flex items-start space-x-3 max-w-4xl w-full">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 relative shadow-lg">
                      <Bot className="h-4 w-4 text-white" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl rounded-tl-md shadow-xl border border-gray-600/50 p-8 flex-1">
                      {message.isGenerating ? (
                        <div className="space-y-4">
                          <div className="flex items-center text-gray-300">
                            <div className="flex space-x-1 mr-3">
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm font-medium">正在分析中...</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-600/80 rounded-lg animate-pulse"></div>
                            <div className="h-4 bg-gray-600/80 rounded-lg animate-pulse w-3/4"></div>
                            <div className="h-4 bg-gray-600/80 rounded-lg animate-pulse w-1/2"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">

                          {/* Query Info */}
                          {message.queryInfo && (
                            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-5 rounded-xl text-sm text-gray-200 border border-blue-600/50 shadow-sm">
                              <div className="flex items-center mb-2">
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2"></div>
                                <span className="font-semibold text-blue-300">查询信息</span>
                              </div>
                              <span className="font-medium">{message.queryInfo}</span>
                            </div>
                          )}

                          {/* Content */}
                          <div 
                            className="prose prose-sm max-w-none text-gray-200 font-medium"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                          />

                          {/* Chart */}
                          {message.hasChart && renderChart()}

                          {/* Timestamp */}
                          <div className="flex items-center text-xs text-gray-400 pt-2 border-t border-gray-600/30">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatTimestamp(message.timestamp)}</span>
                          </div>

                          {/* Action Buttons */}
                          {/* Action Buttons - 只在用户输入后的AI回复中显示，排除引导语 */}
                          {message.type === 'ai' && !message.isGenerating && messages.length > 1 && (
                            <div className="flex items-center space-x-6 pt-4 border-t border-gray-600/50">
                            <button 
                              onClick={() => handleCopy(message.content)}
                              className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-all duration-200 group hover:scale-105"
                            >
                              <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-medium">复制</span>
                            </button>
                            <button 
                              onClick={handleEnterShareMode}
                              className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-all duration-200 group hover:scale-105"
                            >
                              <Share className="h-4 w-4 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-medium">分享</span>
                            </button>
                            <button 
                              onClick={() => handleResolveToggle(message.id)}
                              className={`flex items-center space-x-2 transition-all group ${
                                resolvedMessages.has(message.id) 
                                  ? 'text-green-400 bg-green-900/30 px-4 py-2 rounded-full border border-green-600/50 shadow-sm' 
                                  : 'text-gray-300 hover:text-green-400'
                              }`}
                            >
                              <CheckCircle className={`h-4 w-4 group-hover:scale-110 transition-transform ${
                                resolvedMessages.has(message.id) ? 'fill-current' : ''
                              }`} />
                              <span className="text-sm font-medium">解决</span>
                            </button>
                            <button 
                              onClick={() => handleUnresolvedClick(message.id)}
                              className={`flex items-center space-x-2 transition-all group ${
                                unresolvedMessages.has(message.id) 
                                  ? 'text-red-400 bg-red-900/30 px-4 py-2 rounded-full border border-red-600/50 shadow-sm' 
                                  : 'text-gray-300 hover:text-red-400'
                              }`}
                            >
                              <AlertCircle className={`h-4 w-4 group-hover:scale-110 transition-transform ${
                                unresolvedMessages.has(message.id) ? 'fill-current' : ''
                              }`} />
                              <span className="text-sm font-medium">未解决</span>
                            </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

      </div>

      {/* Fixed Input Area */}
      <div className={`fixed bottom-0 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50 shadow-2xl transition-all duration-300 ease-in-out z-30 ${
        isSidebarCollapsed ? 'left-16' : 'left-64'
      } right-0 ${isShareMode ? 'bottom-16' : 'bottom-0'}`}>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gray-700/95 backdrop-blur-sm border border-gray-600/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.005]">
              <div className="flex items-end p-4 space-x-3">
                <FileUploadButton />
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="继续提问..."
                    className="w-full bg-transparent border-none resize-none outline-none text-gray-100 placeholder-gray-400 text-base leading-6 min-h-[24px] max-h-32 py-2 font-medium"
                    rows={1}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isShareMode}
                  className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 rounded-full transition-all duration-200 hover:scale-105 disabled:scale-100 shadow-xl disabled:shadow-none"
                >
                  <span className="text-white text-sm font-bold">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 分享模式底部操作栏 */}
      {isShareMode && (
        <div className={`fixed bottom-0 right-0 bg-gray-800 border-t border-gray-700 p-4 shadow-lg z-40 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'left-16' : 'left-64'
        }`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="text-sm text-gray-300 font-medium">
              已选择 {selectedMessages.size} 条对话
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSelectAll}
                className="px-5 py-2 text-blue-400 hover:text-blue-300 font-semibold transition-all hover:scale-105"
              >
                {selectedMessages.size === messages.length ? '取消全选' : '全选'}
              </button>
              <button
                onClick={handleGenerateShareLink}
                disabled={selectedMessages.size === 0 || isGeneratingShareLink}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100"
              >
                {isGeneratingShareLink ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>生成中...</span>
                  </>
                ) : (
                  <span>复制链接</span>
                )}
              </button>
              <button
                onClick={handleExitShareMode}
                className="px-5 py-2 text-gray-300 hover:text-gray-200 font-semibold transition-all hover:scale-105"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-50 animate-slide-in backdrop-blur-sm">
          <CheckCircle className="h-5 w-5" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in border border-gray-600/50">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white">抱歉，RiskAgent让你有不好的感受</h3>
              <button
                onClick={handleCloseFeedbackModal}
                className="text-gray-400 hover:text-gray-200 transition-all hover:scale-110 p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              <div>
                <p className="text-gray-200 mb-6 font-medium">请选择理由帮助我们做的更好</p>
                <div className="grid grid-cols-2 gap-3">
                  {feedbackReasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => handleReasonToggle(reason)}
                      className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-sm ${
                        selectedReasons.includes(reason)
                          ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-300 border border-blue-600/50 shadow-lg'
                          : 'bg-gray-700/80 text-gray-200 border border-gray-600/50 hover:bg-gray-600/80 hover:shadow-md'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-200 mb-3 font-semibold">欢迎说说你的想法</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="请详细描述遇到的问题..."
                  className="w-full h-36 px-5 py-4 border border-gray-600/50 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium bg-gray-700/50 focus:bg-gray-700 shadow-sm text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-4 p-8 border-t border-gray-700/50">
              <button
                onClick={handleCloseFeedbackModal}
                className="px-8 py-3 text-gray-300 hover:text-white transition-all hover:scale-105 font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all hover:scale-105 shadow-xl font-semibold"
              >
                提交反馈
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}