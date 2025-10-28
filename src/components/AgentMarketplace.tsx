import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Grid3x3 as Grid3X3, Shield, Search, Menu, X, Layout, MoreVertical, Trash2, Edit2, Link2, Check, AlertCircle, CheckCircle, User, LogOut } from 'lucide-react';

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

interface AgentMarketplaceProps {
  onBack: () => void;
  onStartAgent?: (agent: AgentCard) => void;
  historySessions?: HistorySession[];
  onSessionSwitch?: (sessionId: string) => void;
}

interface AgentCard {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  gradient: string;
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

const agentData: AgentCard[] = [
  // 流量质量 (25个)
  { id: '1', name: '小店追单监控', description: '实时监测广告主下单行为，智能识别异常追单模式，提供风险预警和防护建议', category: '流量质量', author: '反作弊算法', gradient: 'from-pink-400 to-purple-500' },
  { id: '2', name: '联盟媒体分析', description: '深度分析联盟媒体流量质量，识别虚假流量和作弊行为，保障广告投放效果', category: '流量质量', author: '反作弊算法', gradient: 'from-blue-400 to-purple-500' },
  { id: '3', name: '聚量异常检测', description: '监控流量突增异常，快速定位流量来源，防范恶意刷量攻击', category: '流量质量', author: '反作弊算法', gradient: 'from-pink-400 to-red-500' },
  { id: '4', name: '私信链条追踪', description: '追踪联盟私信传播链条，识别异常传播模式，防范私域流量作弊', category: '流量质量', author: '反作弊算法', gradient: 'from-purple-400 to-blue-500' },
  { id: '5', name: '流量质量评估', description: '综合评估流量来源质量，提供流量评分和优化建议，提升转化效率', category: '流量质量', author: '反作弊算法', gradient: 'from-cyan-400 to-blue-500' },
  { id: '6', name: '点击欺诈识别', description: '识别恶意点击和无效点击，保护广告预算，提高广告ROI', category: '流量质量', author: '反作弊算法', gradient: 'from-orange-400 to-red-500' },
  { id: '7', name: '转化率异常分析', description: '监控转化率波动，识别异常转化行为，防范虚假订单', category: '流量质量', author: '反作弊算法', gradient: 'from-green-400 to-teal-500' },
  { id: '8', name: '流量来源分析', description: '详细分析流量来源渠道，识别高质量流量源，优化投放策略', category: '流量质量', author: '反作弊算法', gradient: 'from-indigo-400 to-purple-500' },
  { id: '9', name: '设备指纹识别', description: '通过设备指纹技术识别异常设备，防范批量作弊行为', category: '流量质量', author: '反作弊算法', gradient: 'from-pink-400 to-rose-500' },
  { id: '10', name: '行为轨迹分析', description: '分析用户行为轨迹，识别机器行为和异常操作模式', category: '流量质量', author: '反作弊算法', gradient: 'from-yellow-400 to-orange-500' },
  { id: '11', name: '流量反作弊模型', description: '基于机器学习的反作弊模型，实时拦截作弊流量', category: '流量质量', author: '反作弊算法', gradient: 'from-blue-400 to-cyan-500' },
  { id: '12', name: 'IP地址分析', description: '分析IP地址分布和异常模式，识别代理IP和机房流量', category: '流量质量', author: '反作弊算法', gradient: 'from-purple-400 to-pink-500' },
  { id: '13', name: '用户留存分析', description: '分析用户留存率和活跃度，评估流量长期价值', category: '流量质量', author: '反作弊算法', gradient: 'from-teal-400 to-green-500' },
  { id: '14', name: '流量时段监控', description: '监控不同时段流量分布，识别异常时段流量波动', category: '流量质量', author: '反作弊算法', gradient: 'from-red-400 to-pink-500' },
  { id: '15', name: '广告位效果评估', description: '评估不同广告位的流量质量和转化效果', category: '流量质量', author: '反作弊算法', gradient: 'from-cyan-400 to-teal-500' },
  { id: '16', name: '重复访问检测', description: '识别异常重复访问行为，防范刷量作弊', category: '流量质量', author: '反作弊算法', gradient: 'from-orange-400 to-amber-500' },
  { id: '17', name: '跳出率分析', description: '分析页面跳出率异常，识别低质量流量', category: '流量质量', author: '反作弊算法', gradient: 'from-violet-400 to-purple-500' },
  { id: '18', name: '流量归因分析', description: '精准归因流量来源，评估各渠道贡献度', category: '流量质量', author: '反作弊算法', gradient: 'from-lime-400 to-green-500' },
  { id: '19', name: '恶意爬虫拦截', description: '识别和拦截恶意爬虫流量，保护网站资源', category: '流量质量', author: '反作弊算法', gradient: 'from-fuchsia-400 to-pink-500' },
  { id: '20', name: '流量成本优化', description: '分析流量成本效益，提供成本优化建议', category: '流量质量', author: '反作弊算法', gradient: 'from-sky-400 to-blue-500' },
  { id: '21', name: '移动端流量分析', description: '专注移动端流量质量分析，识别移动端作弊行为', category: '流量质量', author: '反作弊算法', gradient: 'from-rose-400 to-red-500' },
  { id: '22', name: '视频流量监控', description: '监控视频广告流量质量，防范虚假播放', category: '流量质量', author: '反作弊算法', gradient: 'from-emerald-400 to-teal-500' },
  { id: '23', name: '社交流量分析', description: '分析社交媒体流量特征，评估社交流量质量', category: '流量质量', author: '反作弊算法', gradient: 'from-amber-400 to-orange-500' },
  { id: '24', name: '搜索流量优化', description: '分析搜索流量质量，优化搜索广告投放', category: '流量质量', author: '反作弊算法', gradient: 'from-indigo-400 to-blue-500' },
  { id: '25', name: '流量预警系统', description: '实时流量监控预警，第一时间发现流量异常', category: '流量质量', author: '反作弊算法', gradient: 'from-pink-400 to-purple-500' },

  // 政策团组 (25个)
  { id: '26', name: '团组关系挖掘', description: '深度挖掘账户间团组关系，识别组织化作弊行为', category: '政策团组', author: '反作弊算法', gradient: 'from-blue-400 to-indigo-500' },
  { id: '27', name: '政策违规检测', description: '智能检测违反平台政策行为，自动预警和拦截', category: '政策团组', author: '反作弊算法', gradient: 'from-purple-400 to-pink-500' },
  { id: '28', name: '账号关联分析', description: '分析账号关联关系，识别马甲账号和团伙作案', category: '政策团组', author: '反作弊算法', gradient: 'from-green-400 to-emerald-500' },
  { id: '29', name: '组织化行为识别', description: '识别有组织的批量操作，防范团队作弊', category: '政策团组', author: '反作弊算法', gradient: 'from-orange-400 to-red-500' },
  { id: '30', name: '政策合规审核', description: '自动审核内容和行为合规性，确保符合平台规范', category: '政策团组', author: '反作弊算法', gradient: 'from-cyan-400 to-blue-500' },
  { id: '31', name: '黑产团伙追踪', description: '追踪黑产团伙操作痕迹，打击有组织作弊', category: '政策团组', author: '反作弊算法', gradient: 'from-red-400 to-pink-500' },
  { id: '32', name: '资金流向分析', description: '分析账户资金流向，识别异常资金往来', category: '政策团组', author: '反作弊算法', gradient: 'from-teal-400 to-cyan-500' },
  { id: '33', name: '协同作弊识别', description: '识别多账户协同作弊行为，追溯团伙网络', category: '政策团组', author: '反作弊算法', gradient: 'from-violet-400 to-purple-500' },
  { id: '34', name: '敏感词监控', description: '监控敏感词和违规内容，维护平台健康环境', category: '政策团组', author: '反作弊算法', gradient: 'from-amber-400 to-yellow-500' },
  { id: '35', name: '行为模式聚类', description: '聚类分析异常行为模式，发现潜在团伙', category: '政策团组', author: '反作弊算法', gradient: 'from-lime-400 to-green-500' },
  { id: '36', name: '政策规则引擎', description: '灵活配置政策规则，快速响应新型违规', category: '政策团组', author: '反作弊算法', gradient: 'from-fuchsia-400 to-pink-500' },
  { id: '37', name: '团伙网络可视化', description: '可视化展示团伙关系网络，辅助决策分析', category: '政策团组', author: '反作弊算法', gradient: 'from-sky-400 to-blue-500' },
  { id: '38', name: '违规行为预测', description: '预测潜在违规行为，提前介入防范', category: '政策团组', author: '反作弊算法', gradient: 'from-rose-400 to-red-500' },
  { id: '39', name: '批量注册检测', description: '检测批量注册行为，防范账号养殖', category: '政策团组', author: '反作弊算法', gradient: 'from-emerald-400 to-teal-500' },
  { id: '40', name: '社群运营分析', description: '分析社群运营行为，识别异常运营模式', category: '政策团组', author: '反作弊算法', gradient: 'from-orange-400 to-amber-500' },
  { id: '41', name: '跨平台关联', description: '跨平台关联分析，发现多平台作弊团伙', category: '政策团组', author: '反作弊算法', gradient: 'from-indigo-400 to-violet-500' },
  { id: '42', name: '举报信息处理', description: '智能处理用户举报信息，快速响应违规行为', category: '政策团组', author: '反作弊算法', gradient: 'from-pink-400 to-rose-500' },
  { id: '43', name: '政策变更适配', description: '快速适配政策变更，更新检测规则', category: '政策团组', author: '反作弊算法', gradient: 'from-teal-400 to-green-500' },
  { id: '44', name: '团组信用评分', description: '评估团组信用等级，建立信用体系', category: '政策团组', author: '反作弊算法', gradient: 'from-violet-400 to-purple-500' },
  { id: '45', name: '行为轨迹还原', description: '还原违规行为完整轨迹，辅助取证', category: '政策团组', author: '反作弊算法', gradient: 'from-cyan-400 to-blue-500' },
  { id: '46', name: '灰产情报监控', description: '监控灰产情报动态，提前部署防御', category: '政策团组', author: '反作弊算法', gradient: 'from-red-400 to-orange-500' },
  { id: '47', name: '违规成本分析', description: '分析违规行为成本，制定惩罚策略', category: '政策团组', author: '反作弊算法', gradient: 'from-lime-400 to-emerald-500' },
  { id: '48', name: '团伙特征库', description: '建立团伙特征库，快速识别已知团伙', category: '政策团组', author: '反作弊算法', gradient: 'from-fuchsia-400 to-purple-500' },
  { id: '49', name: '政策执行监督', description: '监督政策执行情况，确保公平公正', category: '政策团组', author: '反作弊算法', gradient: 'from-amber-400 to-orange-500' },
  { id: '50', name: '多维度风险评估', description: '多维度评估团组风险，提供综合风险报告', category: '政策团组', author: '反作弊算法', gradient: 'from-blue-400 to-indigo-500' },

  // 超投赔付 (25个)
  { id: '51', name: '超投监控预警', description: '实时监控广告投放超投情况，及时预警并采取措施', category: '超投赔付', author: '反作弊算法', gradient: 'from-purple-400 to-pink-500' },
  { id: '52', name: '赔付金额计算', description: '精确计算超投赔付金额，确保赔付准确无误', category: '超投赔付', author: '反作弊算法', gradient: 'from-green-400 to-teal-500' },
  { id: '53', name: '预算控制系统', description: '智能控制广告预算，防止超投发生', category: '超投赔付', author: '反作弊算法', gradient: 'from-orange-400 to-red-500' },
  { id: '54', name: '超投原因分析', description: '深度分析超投发生原因，提供改进建议', category: '超投赔付', author: '反作弊算法', gradient: 'from-cyan-400 to-blue-500' },
  { id: '55', name: '赔付流程自动化', description: '自动化处理赔付流程，提高处理效率', category: '超投赔付', author: '反作弊算法', gradient: 'from-pink-400 to-purple-500' },
  { id: '56', name: '投放预算优化', description: '优化广告投放预算分配，降低超投风险', category: '超投赔付', author: '反作弊算法', gradient: 'from-indigo-400 to-violet-500' },
  { id: '57', name: '超投趋势预测', description: '预测超投发生趋势，提前采取防范措施', category: '超投赔付', author: '反作弊算法', gradient: 'from-teal-400 to-green-500' },
  { id: '58', name: '赔付规则引擎', description: '灵活配置赔付规则，适应不同场景', category: '超投赔付', author: '反作弊算法', gradient: 'from-red-400 to-pink-500' },
  { id: '59', name: '投放异常检测', description: '检测投放过程异常，及时发现超投风险', category: '超投赔付', author: '反作弊算法', gradient: 'from-amber-400 to-orange-500' },
  { id: '60', name: '历史超投分析', description: '分析历史超投数据，总结经验教训', category: '超投赔付', author: '反作弊算法', gradient: 'from-violet-400 to-purple-500' },
  { id: '61', name: '实时消耗监控', description: '实时监控广告消耗速度，防止超预算', category: '超投赔付', author: '反作弊算法', gradient: 'from-lime-400 to-green-500' },
  { id: '62', name: '赔付凭证管理', description: '管理超投赔付凭证，规范赔付流程', category: '超投赔付', author: '反作弊算法', gradient: 'from-sky-400 to-blue-500' },
  { id: '63', name: '预算预警系统', description: '多级预算预警机制，层层把控超投风险', category: '超投赔付', author: '反作弊算法', gradient: 'from-fuchsia-400 to-pink-500' },
  { id: '64', name: '超投责任追溯', description: '追溯超投责任链条，明确责任归属', category: '超投赔付', author: '反作弊算法', gradient: 'from-emerald-400 to-teal-500' },
  { id: '65', name: '智能预算分配', description: '基于AI的智能预算分配，最大化ROI', category: '超投赔付', author: '反作弊算法', gradient: 'from-orange-400 to-amber-500' },
  { id: '66', name: '赔付数据看板', description: '可视化赔付数据看板，直观展示赔付情况', category: '超投赔付', author: '反作弊算法', gradient: 'from-indigo-400 to-blue-500' },
  { id: '67', name: '超投风险评级', description: '评估广告主超投风险等级，差异化管理', category: '超投赔付', author: '反作弊算法', gradient: 'from-rose-400 to-red-500' },
  { id: '68', name: '预算执行分析', description: '分析预算执行情况，优化预算策略', category: '超投赔付', author: '反作弊算法', gradient: 'from-teal-400 to-cyan-500' },
  { id: '69', name: '超投防护策略', description: '制定超投防护策略，多维度保障预算安全', category: '超投赔付', author: '反作弊算法', gradient: 'from-violet-400 to-purple-500' },
  { id: '70', name: '赔付审核系统', description: '审核超投赔付申请，确保合理合规', category: '超投赔付', author: '反作弊算法', gradient: 'from-cyan-400 to-blue-500' },
  { id: '71', name: '投放节奏控制', description: '控制广告投放节奏，平滑消耗曲线', category: '超投赔付', author: '反作弊算法', gradient: 'from-pink-400 to-rose-500' },
  { id: '72', name: '超投成本分析', description: '分析超投造成的成本损失，量化风险', category: '超投赔付', author: '反作弊算法', gradient: 'from-lime-400 to-emerald-500' },
  { id: '73', name: '赔付时效管理', description: '管理赔付处理时效，提升用户满意度', category: '超投赔付', author: '反作弊算法', gradient: 'from-amber-400 to-yellow-500' },
  { id: '74', name: '预算智能熔断', description: '智能熔断机制，紧急情况下自动停止投放', category: '超投赔付', author: '反作弊算法', gradient: 'from-fuchsia-400 to-purple-500' },
  { id: '75', name: '超投报表生成', description: '自动生成超投分析报表，辅助决策', category: '超投赔付', author: '反作弊算法', gradient: 'from-blue-400 to-indigo-500' },

  // 账户风险 (25个)
  { id: '76', name: '账户异常登录', description: '检测账户异常登录行为，防范账户盗用', category: '账户风险', author: '反作弊算法', gradient: 'from-red-400 to-orange-500' },
  { id: '77', name: '资金安全监控', description: '监控账户资金安全，防止资金被盗取', category: '账户风险', author: '反作弊算法', gradient: 'from-green-400 to-emerald-500' },
  { id: '78', name: '密码强度检测', description: '检测密码强度，提醒用户设置安全密码', category: '账户风险', author: '反作弊算法', gradient: 'from-purple-400 to-pink-500' },
  { id: '79', name: '异常操作识别', description: '识别账户异常操作，及时阻断风险行为', category: '账户风险', author: '反作弊算法', gradient: 'from-cyan-400 to-blue-500' },
  { id: '80', name: '账户安全评分', description: '综合评估账户安全等级，提供安全建议', category: '账户风险', author: '反作弊算法', gradient: 'from-orange-400 to-red-500' },
  { id: '81', name: '登录设备管理', description: '管理账户登录设备，异常设备及时预警', category: '账户风险', author: '反作弊算法', gradient: 'from-indigo-400 to-violet-500' },
  { id: '82', name: '账户权限审计', description: '审计账户权限变更，防范权限滥用', category: '账户风险', author: '反作弊算法', gradient: 'from-teal-400 to-green-500' },
  { id: '83', name: '实名认证核验', description: '核验账户实名信息，确保身份真实', category: '账户风险', author: '反作弊算法', gradient: 'from-pink-400 to-rose-500' },
  { id: '84', name: '风险等级分类', description: '分类管理不同风险等级账户，差异化防护', category: '账户风险', author: '反作弊算法', gradient: 'from-amber-400 to-orange-500' },
  { id: '85', name: '敏感操作保护', description: '对敏感操作增加验证，提升安全性', category: '账户风险', author: '反作弊算法', gradient: 'from-violet-400 to-purple-500' },
  { id: '86', name: '账户冻结机制', description: '高风险账户自动冻结，防止损失扩大', category: '账户风险', author: '反作弊算法', gradient: 'from-lime-400 to-green-500' },
  { id: '87', name: '异地登录检测', description: '检测异地登录行为，及时提醒用户', category: '账户风险', author: '反作弊算法', gradient: 'from-sky-400 to-blue-500' },
  { id: '88', name: '账户行为画像', description: '建立账户行为画像，识别异常行为模式', category: '账户风险', author: '反作弊算法', gradient: 'from-fuchsia-400 to-pink-500' },
  { id: '89', name: '二次验证管理', description: '管理二次验证设置，增强账户安全', category: '账户风险', author: '反作弊算法', gradient: 'from-emerald-400 to-teal-500' },
  { id: '90', name: '账户恢复流程', description: '安全的账户恢复流程，防止社工攻击', category: '账户风险', author: '反作弊算法', gradient: 'from-orange-400 to-amber-500' },
  { id: '91', name: '操作日志审计', description: '审计账户操作日志，追溯异常行为', category: '账户风险', author: '反作弊算法', gradient: 'from-indigo-400 to-blue-500' },
  { id: '92', name: '账户关联风险', description: '识别账户关联风险，防范连带损失', category: '账户风险', author: '反作弊算法', gradient: 'from-rose-400 to-red-500' },
  { id: '93', name: '生物识别验证', description: '集成生物识别技术，提升验证安全性', category: '账户风险', author: '反作弊算法', gradient: 'from-teal-400 to-cyan-500' },
  { id: '94', name: '账户状态监控', description: '实时监控账户状态变化，异常及时预警', category: '账户风险', author: '反作弊算法', gradient: 'from-violet-400 to-purple-500' },
  { id: '95', name: '信息泄露检测', description: '检测账户信息是否泄露，及时提醒修改', category: '账户风险', author: '反作弊算法', gradient: 'from-cyan-400 to-blue-500' },
  { id: '96', name: '账户活跃度分析', description: '分析账户活跃度异常，识别僵尸账户', category: '账户风险', author: '反作弊算法', gradient: 'from-pink-400 to-rose-500' },
  { id: '97', name: '风险行为预测', description: '预测账户潜在风险行为，提前防范', category: '账户风险', author: '反作弊算法', gradient: 'from-lime-400 to-emerald-500' },
  { id: '98', name: '安全策略配置', description: '灵活配置账户安全策略，适应不同需求', category: '账户风险', author: '反作弊算法', gradient: 'from-amber-400 to-yellow-500' },
  { id: '99', name: '账户风险报告', description: '生成账户风险分析报告，辅助决策', category: '账户风险', author: '反作弊算法', gradient: 'from-fuchsia-400 to-purple-500' },
  { id: '100', name: '多因素认证', description: '支持多因素认证方式，全方位保护账户', category: '账户风险', author: '反作弊算法', gradient: 'from-blue-400 to-indigo-500' },

  // 内容安全 (25个)
  { id: '101', name: '违规内容识别', description: '智能识别违规内容，自动拦截和审核', category: '内容安全', author: '反作弊算法', gradient: 'from-purple-400 to-pink-500' },
  { id: '102', name: '敏感图片检测', description: '检测图片中的敏感和违规内容，保护平台安全', category: '内容安全', author: '反作弊算法', gradient: 'from-green-400 to-teal-500' },
  { id: '103', name: '文本内容审核', description: '审核文本内容合规性，过滤违规信息', category: '内容安全', author: '反作弊算法', gradient: 'from-orange-400 to-red-500' },
  { id: '104', name: '视频内容审查', description: '审查视频内容，识别违规画面和声音', category: '内容安全', author: '反作弊算法', gradient: 'from-cyan-400 to-blue-500' },
  { id: '105', name: '广告创意审核', description: '审核广告创意合规性，确保符合规范', category: '内容安全', author: '反作弊算法', gradient: 'from-pink-400 to-purple-500' },
  { id: '106', name: '评论内容过滤', description: '过滤评论中的违规和不良内容', category: '内容安全', author: '反作弊算法', gradient: 'from-indigo-400 to-violet-500' },
  { id: '107', name: '暴力内容检测', description: '检测暴力血腥内容，维护健康环境', category: '内容安全', author: '反作弊算法', gradient: 'from-teal-400 to-green-500' },
  { id: '108', name: '低俗内容拦截', description: '拦截低俗不良内容，净化网络空间', category: '内容安全', author: '反作弊算法', gradient: 'from-red-400 to-pink-500' },
  { id: '109', name: '政治敏感识别', description: '识别政治敏感内容，确保合规运营', category: '内容安全', author: '反作弊算法', gradient: 'from-amber-400 to-orange-500' },
  { id: '110', name: '虚假信息鉴别', description: '鉴别虚假信息和谣言，维护信息真实', category: '内容安全', author: '反作弊算法', gradient: 'from-violet-400 to-purple-500' },
  { id: '111', name: '版权内容保护', description: '保护原创版权内容，打击侵权行为', category: '内容安全', author: '反作弊算法', gradient: 'from-lime-400 to-green-500' },
  { id: '112', name: '儿童内容守护', description: '守护儿童内容安全，过滤不适内容', category: '内容安全', author: '反作弊算法', gradient: 'from-sky-400 to-blue-500' },
  { id: '113', name: '恶意链接识别', description: '识别恶意链接和钓鱼网站，保护用户安全', category: '内容安全', author: '反作弊算法', gradient: 'from-fuchsia-400 to-pink-500' },
  { id: '114', name: '垃圾内容过滤', description: '过滤垃圾广告和灌水内容', category: '内容安全', author: '反作弊算法', gradient: 'from-emerald-400 to-teal-500' },
  { id: '115', name: '直播内容监控', description: '实时监控直播内容，及时处理违规', category: '内容安全', author: '反作弊算法', gradient: 'from-orange-400 to-amber-500' },
  { id: '116', name: '音频内容检测', description: '检测音频内容违规信息，全方位保护', category: '内容安全', author: '反作弊算法', gradient: 'from-indigo-400 to-blue-500' },
  { id: '117', name: '标题党识别', description: '识别标题党和虚假标题，规范内容', category: '内容安全', author: '反作弊算法', gradient: 'from-rose-400 to-red-500' },
  { id: '118', name: '内容质量评估', description: '评估内容质量，推荐优质内容', category: '内容安全', author: '反作弊算法', gradient: 'from-teal-400 to-cyan-500' },
  { id: '119', name: '洗稿内容检测', description: '检测洗稿和抄袭内容，保护原创', category: '内容安全', author: '反作弊算法', gradient: 'from-violet-400 to-purple-500' },
  { id: '120', name: '智能内容推荐', description: '基于安全的智能内容推荐系统', category: '内容安全', author: '反作弊算法', gradient: 'from-cyan-400 to-blue-500' },
  { id: '121', name: '用户举报处理', description: '处理用户举报的违规内容，及时响应', category: '内容安全', author: '反作弊算法', gradient: 'from-pink-400 to-rose-500' },
  { id: '122', name: '内容分级管理', description: '对内容进行分级管理，适配不同用户', category: '内容安全', author: '反作弊算法', gradient: 'from-lime-400 to-emerald-500' },
  { id: '123', name: 'AI内容识别', description: '识别AI生成内容，标注来源', category: '内容安全', author: '反作弊算法', gradient: 'from-amber-400 to-yellow-500' },
  { id: '124', name: '内容安全报告', description: '生成内容安全分析报告，监控平台健康度', category: '内容安全', author: '反作弊算法', gradient: 'from-fuchsia-400 to-purple-500' },
  { id: '125', name: '多语言内容审核', description: '支持多语言内容审核，全球化保护', category: '内容安全', author: '反作弊算法', gradient: 'from-blue-400 to-indigo-500' }
];

const categories = ['全部', '流量质量', '政策团组', '超投赔付', '账户风险', '内容安全'];

type HeaderStyle = 'compact' | 'minimal' | 'classic';

export default function AgentMarketplace({ onBack, onStartAgent, historySessions = [], onSessionSwitch }: AgentMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [headerStyle, setHeaderStyle] = useState<HeaderStyle>('compact');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 历史会话操作状态
  const [activeSessionMenu, setActiveSessionMenu] = useState<string | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [renameSessionId, setRenameSessionId] = useState<string>('');
  const [deleteSessionId, setDeleteSessionId] = useState<string>('');
  const [renameValue, setRenameValue] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 获取当前登录状态
  const { isLoggedIn, username } = getStoredLoginState();

  // 清除登录状态
  const clearLoginState = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
      localStorage.removeItem(STORAGE_KEYS.USERNAME);
    } catch (error) {
      console.error('清除登录状态失败:', error);
    }
  };

  // 处理登出
  const handleLogout = () => {
    clearLoginState();
    showToastMessage('已退出登录');
    // 触发登出事件，让父组件处理
    window.dispatchEvent(new CustomEvent('userLogout'));
  };

  // 处理登录
  const handleLogin = () => {
    // 触发登录事件，让父组件处理
    window.dispatchEvent(new CustomEvent('needLogin'));
  };

  // 筛选逻辑优化：支持"全部"选项和搜索自动切换
  const filteredAgents = agentData.filter(agent => {
    // 搜索过滤
    const matchesSearch = searchQuery === '' ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 分类过滤
    const matchesCategory = selectedCategory === '全部' || agent.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 分页逻辑
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAgents = filteredAgents.slice(startIndex, endIndex);

  // 当用户输入搜索内容时，自动切换到"全部"tab
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // 重置到第一页
    if (value.trim() !== '' && selectedCategory !== '全部') {
      setSelectedCategory('全部');
    }
  };

  // 切换分类时重置页码
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSessionClick = (session: HistorySession) => {
    if (session.isActive || !onSessionSwitch) return;

    onSessionSwitch(session.id);
    showToastMessage(`已切换到会话: ${session.title}`);
  };

  // Toast消息显示
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 历史会话操作函数
  const handleShareSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSessionMenu(null);

    try {
      const session = historySessions.find(s => s.id === sessionId);
      if (!session) return;

      const shareUrl = `${window.location.origin}/share/${sessionId}`;
      await navigator.clipboard.writeText(shareUrl);
      showToastMessage('分享地址已复制');
    } catch (error) {
      showToastMessage('复制失败，请重试');
    }
  };

  const handleOpenRenameModal = (sessionId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSessionMenu(null);
    setRenameSessionId(sessionId);
    setRenameValue(currentTitle);
    setShowRenameModal(true);
  };

  const handleRenameConfirm = () => {
    if (!renameValue.trim()) {
      showToastMessage('标题不能为空');
      return;
    }

    if (renameValue.length > 50) {
      showToastMessage('标题不能超过50个字符');
      return;
    }

    // TODO: 调用API更新会话标题
    console.log('重命名会话:', renameSessionId, '新标题:', renameValue);
    showToastMessage('重命名成功');

    setShowRenameModal(false);
    setRenameSessionId('');
    setRenameValue('');
  };

  const handleOpenDeleteModal = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSessionMenu(null);
    setDeleteSessionId(sessionId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: 调用API删除会话
    console.log('删除会话:', deleteSessionId);
    showToastMessage('会话已删除');

    setShowDeleteModal(false);
    setDeleteSessionId('');
  };

  const toggleSessionMenu = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSessionMenu(activeSessionMenu === sessionId ? null : sessionId);
  };

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeSessionMenu) {
        setActiveSessionMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeSessionMenu]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen bg-gray-800/90 backdrop-blur-xl border-r border-gray-700/50 z-10 transition-all duration-300 ease-in-out shadow-xl flex flex-col ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Toggle Button */}
        <div className="absolute -right-3 top-4 z-20">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-7 h-7 bg-gray-700/90 backdrop-blur-sm border border-gray-600/50 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            {isSidebarCollapsed ? (
              <Menu className="h-3 w-3 text-gray-300" />
            ) : (
              <X className="h-3 w-3 text-gray-300" />
            )}
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className={`flex items-center mb-8 cursor-pointer hover:opacity-80 transition-opacity ${
            isSidebarCollapsed ? 'justify-center' : ''
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
            <div className={`flex items-center w-full px-4 py-3 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-400 rounded-xl border border-blue-600/50 shadow-sm ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}>
              <Grid3X3 className="h-5 w-5 mr-3" />
              {!isSidebarCollapsed && 'Agent广场'}
            </div>
          </nav>

          {!isSidebarCollapsed && (
          <>
            <div className="mt-8 transition-opacity duration-300">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">常用Agent</h3>
            <div className="space-y-2">
              <div 
                onClick={() => onStartAgent?.({
                  id: 'sidebar-1',
                  name: '小店追单',
                  description: '帮助用户高效分析，广告主下单速度风险预测，并给出风险预测',
                  category: '流量质量',
                  author: '反作弊算法',
                  gradient: 'from-pink-400 to-purple-500'
                })}
                className="flex items-center px-4 py-3 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-pink-900/30 hover:to-purple-900/30 hover:text-pink-400 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
              >
                <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mr-3 shadow-sm"></div>
                流量质量-小店追单
              </div>
              <div 
                onClick={() => onStartAgent?.({
                  id: 'sidebar-2',
                  name: '联盟媒体分析',
                  description: '帮助用户高效分析，广告主下单速度风险预测，并给出风险预测',
                  category: '流量质量',
                  author: '反作弊算法',
                  gradient: 'from-blue-400 to-purple-500'
                })}
                className="flex items-center px-4 py-3 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-purple-900/30 hover:text-blue-400 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
              >
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3 shadow-sm"></div>
                流量质量-联盟媒体
              </div>
              <div 
                onClick={() => onStartAgent?.({
                  id: 'sidebar-3',
                  name: '团组关系',
                  description: '帮助用户高效分析，广告主下单速度风险预测，并给出风险预测',
                  category: '政策团组',
                  author: '反作弊算法',
                  gradient: 'from-purple-400 to-pink-500'
                })}
                className="flex items-center px-4 py-3 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-pink-900/30 hover:text-purple-400 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
              >
                <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-3 shadow-sm"></div>
                政策团组-团组关系
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">历史会话</h3>
            <div className="space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
              {historySessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSessionClick(session)}
                  className={`group px-3 py-3 rounded-lg cursor-pointer text-sm transition-all duration-200 relative ${
                    session.isActive
                      ? 'bg-blue-500/10 border border-blue-500/30'
                      : 'hover:bg-gray-700/40 border border-transparent hover:border-gray-600/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2.5 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        session.isActive ? 'bg-blue-400' : 'bg-gray-500 group-hover:bg-gray-400'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate text-sm leading-snug ${
                          session.isActive ? 'text-blue-300' : 'text-gray-200 group-hover:text-white'
                        }`} title={session.title}>
                          {session.title}
                        </div>
                        <div className={`text-xs mt-1 ${
                          session.isActive ? 'text-blue-400/70' : 'text-gray-500 group-hover:text-gray-400'
                        }`}>
                          {formatSessionTime(session.timestamp)}
                        </div>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="relative flex-shrink-0 ml-2">
                      <button
                        onClick={(e) => toggleSessionMenu(session.id, e)}
                        className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                          session.isActive ? 'text-blue-400 hover:bg-blue-500/20' : 'text-gray-400 hover:bg-gray-600/40 hover:text-white'
                        }`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* 下拉菜单 */}
                      {activeSessionMenu === session.id && (
                        <div className="absolute right-0 top-8 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 py-1">
                          <button
                            onClick={(e) => handleShareSession(session.id, e)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2 transition-colors"
                          >
                            <Link2 className="h-4 w-4" />
                            <span>分享</span>
                          </button>
                          <button
                            onClick={(e) => handleOpenRenameModal(session.id, session.title, e)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span>重命名</span>
                          </button>
                          <div className="border-t border-gray-700 my-1"></div>
                          <button
                            onClick={(e) => handleOpenDeleteModal(session.id, e)}
                            className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center space-x-2 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>删除</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {historySessions.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <div className="h-6 w-6 text-gray-400">💬</div>
                  </div>
                  <p className="text-sm">暂无聊天记录</p>
                </div>
              )}
            </div>
          </div>
            </>
          )}
        </div>

        {/* User Info Section - Sticky Bottom */}
        {!isSidebarCollapsed && (
          <div className="flex-shrink-0 border-t border-gray-700/50 bg-gray-800/95 backdrop-blur-sm">
            <div className="p-6">
              {isLoggedIn ? (
                <div className="transition-opacity duration-300">
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
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg font-medium"
                >
                  <User className="h-5 w-5 mr-2" />
                  登录
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`min-h-screen transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header */}
        {headerStyle === 'compact' && (
          <div className="bg-gray-800/50 backdrop-blur-sm px-8 py-8 border-b border-gray-700/50">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                {/* Logo and Title Section */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl border border-gray-600/50 shadow-lg">
                    <img src="/Vector copy.png" alt="RiskAgent Logo" className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">RiskAgent</h1>
                    <p className="text-sm text-gray-400 mt-0.5">连接数据与智慧，让风控更高效</p>
                  </div>
                </div>

                {/* Style Switcher */}
                <div className="flex items-center space-x-2 bg-gray-900/50 rounded-lg p-1 border border-gray-700/50">
                  <button
                    onClick={() => setHeaderStyle('compact')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                      headerStyle === 'compact'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    紧凑
                  </button>
                  <button
                    onClick={() => setHeaderStyle('minimal')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                      headerStyle === 'minimal'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    极简
                  </button>
                  <button
                    onClick={() => setHeaderStyle('classic')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                      headerStyle === 'classic'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    经典
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索Agent名称或描述..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 text-sm transition-all duration-200"
                />
              </div>
            </div>
          </div>
        )}

        {headerStyle === 'minimal' && (
          <div className="bg-gray-900/30 backdrop-blur-sm px-8 py-6 border-b border-gray-700/30">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                {/* Minimal Logo and Search */}
                <div className="flex items-center space-x-6 flex-1">
                  <div className="flex items-center space-x-3">
                    <img src="/Vector copy.png" alt="RiskAgent Logo" className="w-8 h-8" />
                    <h1 className="text-xl font-bold text-white">RiskAgent</h1>
                  </div>

                  {/* Inline Search Bar */}
                  <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="搜索Agent名称或描述..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white placeholder-gray-500 text-sm transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Style Switcher */}
                <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
                  <button
                    onClick={() => setHeaderStyle('compact')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                      headerStyle === 'compact'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    紧凑
                  </button>
                  <button
                    onClick={() => setHeaderStyle('minimal')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                      headerStyle === 'minimal'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    极简
                  </button>
                  <button
                    onClick={() => setHeaderStyle('classic')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                      headerStyle === 'classic'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    经典
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {headerStyle === 'classic' && (
          <div className="bg-gray-800/70 backdrop-blur-md px-8 py-10 border-b border-gray-700/50">
            <div className="max-w-7xl mx-auto text-center">
              <div className="flex items-center justify-end mb-6">
                {/* Style Switcher */}
                <div className="flex items-center space-x-2 bg-gray-900/50 rounded-lg p-1 border border-gray-700/50">
                  <button
                    onClick={() => setHeaderStyle('compact')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                      headerStyle === 'compact'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    紧凑
                  </button>
                  <button
                    onClick={() => setHeaderStyle('minimal')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                      headerStyle === 'minimal'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    极简
                  </button>
                  <button
                    onClick={() => setHeaderStyle('classic')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                      headerStyle === 'classic'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    经典
                  </button>
                </div>
              </div>

              {/* Logo and Title Section */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl border border-gray-600/50 shadow-xl mr-4">
                  <img src="/Vector copy.png" alt="RiskAgent Logo" className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">RiskAgent</h1>
              </div>
              <p className="text-gray-400 text-sm mb-6">连接数据与智慧，让风控更高效</p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索Agent名称或描述..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 text-sm transition-all duration-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 px-8 py-6 shadow-sm">
          <div className="flex space-x-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`pb-3 text-sm font-semibold border-b-2 transition-all duration-200 hover:scale-105 ${
                  selectedCategory === category
                    ? 'border-blue-500 text-blue-400 shadow-sm'
                    : 'border-transparent text-gray-400 hover:text-blue-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-3">
                  {selectedCategory}
                  {searchQuery && (
                    <span className="ml-3 text-lg text-gray-400">搜索: "{searchQuery}"</span>
                  )}
                </h2>
                <p className="text-gray-300 font-medium">
                  {selectedCategory === '全部' ? '探索所有Agent，找到最适合您的智能助手' : '守护平台流量生态安全，保护商家权益'}
                </p>
              </div>
              {(searchQuery || selectedCategory === '全部') && (
                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    找到 <span className="text-blue-400 font-semibold">{filteredAgents.length}</span> 个Agent
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('全部');
                      }}
                      className="mt-2 text-xs text-gray-500 hover:text-blue-400 transition-colors duration-200"
                    >
                      清除搜索
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Agent Grid */}
          {currentAgents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentAgents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => {
                      if (isLoggedIn) {
                        onStartAgent?.(agent);
                      } else {
                        onStartAgent?.(agent);
                      }
                    }}
                    className="group bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/40 p-5 hover:bg-gray-800/80 hover:border-gray-600/60 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3 mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${agent.gradient} rounded-lg flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-white truncate">{agent.name}</h3>
                          {selectedCategory === '全部' && (
                            <span className="px-2 py-0.5 bg-gray-700/40 text-gray-400 text-xs rounded flex-shrink-0">
                              {agent.category}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{agent.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
                      <span className="text-xs text-gray-500">By {agent.author}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isLoggedIn) {
                            onStartAgent?.(agent);
                          } else {
                            onStartAgent?.(agent);
                          }
                        }}
                        className="px-4 py-1.5 text-sm text-gray-300 border border-gray-600/50 rounded-md hover:bg-gray-700/50 hover:text-white hover:border-gray-500/50 transition-all duration-200"
                      >
                        使用
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    显示 {startIndex + 1} - {Math.min(endIndex, filteredAgents.length)} 条，共 {filteredAgents.length} 条
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm text-gray-300 border border-gray-600/50 rounded-md hover:bg-gray-700/50 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-300 transition-all duration-200"
                    >
                      上一页
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        // 显示策略：始终显示第一页、最后一页、当前页及其前后各一页
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
                                currentPage === page
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="text-gray-500 px-1">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm text-gray-300 border border-gray-600/50 rounded-md hover:bg-gray-700/50 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-300 transition-all duration-200"
                    >
                      下一页
                    </button>
                  </div>

                  <div className="text-sm text-gray-400">
                    第 {currentPage} / {totalPages} 页
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">未找到匹配的Agent</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery
                  ? `没有找到与 "${searchQuery}" 相关的Agent，请尝试其他关键词`
                  : `当前分类下暂无Agent`
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('全部');
                  }}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  清除搜索条件
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-50 animate-slide-in backdrop-blur-sm">
          <CheckCircle className="h-5 w-5" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 重命名模态框 */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Edit2 className="h-5 w-5 mr-2 text-blue-400" />
                重命名会话
              </h3>
              <button
                onClick={() => {
                  setShowRenameModal(false);
                  setRenameValue('');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                新标题
              </label>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder="请输入会话标题"
                maxLength={50}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameConfirm();
                  }
                }}
              />
              <div className="mt-2 text-xs text-gray-400 text-right">
                {renameValue.length} / 50
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRenameModal(false);
                  setRenameValue('');
                }}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleRenameConfirm}
                disabled={!renameValue.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>确认</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
                确认删除
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 mb-4">
                <p className="text-red-300 text-sm leading-relaxed">
                  这条会话将被永久删除，不可恢复及撤销
                </p>
              </div>
              <p className="text-gray-300 text-sm">
                确定要删除这条会话记录吗？
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}