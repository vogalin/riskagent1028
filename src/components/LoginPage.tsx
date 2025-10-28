import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onBack: () => void;
  onLogin: (username: string) => void;
  redirectMessage?: string;
}

export default function LoginPage({ onBack, onLogin, redirectMessage }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }

    setIsLoading(true);
    
    // 模拟登录请求
    setTimeout(() => {
      // 简单的模拟登录验证
      if (username.trim() && password.trim()) {
        onLogin(username);
      } else {
        setError('用户名或密码错误');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <img src="/Vector copy.png" alt="RiskAgent Logo" className="w-16 h-16 mr-4" />
            <span className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">RiskAgent</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">登录您的账户</h2>
          {redirectMessage && (
            <p className="text-sm text-blue-400 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 px-6 py-3 rounded-xl font-medium shadow-sm border border-blue-600/50">
              {redirectMessage}
            </p>
          )}
        </div>

        {/* Login Form */}
        <div className="bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-600/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border border-red-600/50 text-red-400 px-6 py-4 rounded-xl text-sm font-medium shadow-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-200 mb-3">
                用户名
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium bg-gray-700/50 focus:bg-gray-700 shadow-sm text-white placeholder-gray-400"
                placeholder="请输入用户名"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-200 mb-3">
                密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 pr-14 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium bg-gray-700/50 focus:bg-gray-700 shadow-sm text-white placeholder-gray-400"
                  placeholder="请输入密码"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors hover:scale-110"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-gray-300 hover:text-blue-400 text-sm transition-colors font-medium hover:scale-105"
            >
              返回首页
            </button>
          </div>
        </div>

        {/* Demo Info */}
        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-blue-600/50">
          <p className="text-sm text-blue-300 font-medium">
            <strong>演示提示：</strong>输入任意用户名和密码即可登录
          </p>
        </div>
      </div>
    </div>
  );
}