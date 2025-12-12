import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TorchFunctionCard, TorchCategory } from './types';
import { fetchTorchCards } from './services/gemini';
import { FlashCard } from './components/FlashCard';
import { Flame, Loader2, RefreshCw, CheckCircle2, ChevronRight, AlertCircle, Search, X } from 'lucide-react';

const CATEGORIES: TorchCategory[] = ['全部', '张量操作', '数学运算', '神经网络', '优化算法', '数据处理', '辅助工具'];

const App: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [queue, setQueue] = useState<TorchFunctionCard[]>([]);
  const [currentCard, setCurrentCard] = useState<TorchFunctionCard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  
  // New State for Search and Categories
  const [selectedCategory, setSelectedCategory] = useState<TorchCategory>('全部');
  const [searchInput, setSearchInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Initial Fetch
  useEffect(() => {
    loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCards = async (resetQueue: boolean = false, customCategory?: TorchCategory, searchQuery?: string) => {
    // Determine the parameters to use
    const categoryToUse = customCategory ?? selectedCategory;
    const searchToUse = searchQuery ?? '';

    // If we are just prefetching for the same context, verify queue needs filling
    if (!resetQueue && !searchToUse && (queue.length > 0 || currentCard)) return;

    setIsLoading(true);
    setError(null);

    // If resetting (changing category or searching), clear current state
    if (resetQueue) {
      setQueue([]);
      setCurrentCard(null);
    }

    try {
      // If searching, we ignore history to allow finding previously learned cards
      const contextHistory = searchToUse ? [] : history;
      // If searching, we fetch 1. If browsing, we fetch 3.
      const count = searchToUse ? 1 : 3;

      const newCards = await fetchTorchCards(contextHistory, count, categoryToUse, searchToUse);
      
      if (resetQueue) {
        if (newCards.length > 0) {
          setCurrentCard(newCards[0]);
          setQueue(newCards.slice(1));
        } else {
          // Handle empty search result
          if (searchToUse) {
             setError(`未找到与 "${searchToUse}" 相关的 PyTorch 函数。请尝试其他关键词。`);
          } else {
             setError("无法获取卡片。");
          }
        }
      } else {
        setQueue(prev => [...prev, ...newCards]);
         // If we were empty and just fetched
         if (!currentCard && newCards.length > 0) {
            setCurrentCard(newCards[0]);
            setQueue(prev => prev.slice(1));
         }
      }

    } catch (err) {
      setError("生成闪卡失败。请检查您的网络连接或 API Key。");
    } finally {
      setIsLoading(false);
      setIsInitializing(false);
      setIsSearching(false);
    }
  };

  const handleNext = useCallback(async () => {
    if (!currentCard) return;

    // Add current to history if it's not a search result (optional: decide if searches count as learning)
    // Let's assume searches also count as seeing a card
    if (!history.includes(currentCard.name)) {
      setHistory(prev => [...prev, currentCard.name]);
    }

    // Get next from queue
    if (queue.length > 0) {
      const nextCard = queue[0];
      setCurrentCard(nextCard);
      setQueue(prev => prev.slice(1));
      
      // Prefetch if queue runs low and we are NOT in a specific search result view
      // (Search usually returns 1 result, so we stop there unless we implement "similar results")
      // Here we assume if input is empty, we are in browse mode
      if (queue.length < 2 && searchInput === '') {
        fetchTorchCards([...history, currentCard.name], 3, selectedCategory).then(newCards => {
          setQueue(prev => [...prev, ...newCards]);
        }).catch(console.error);
      }
    } else {
      // Queue empty
      if (searchInput !== '') {
        // If we were searching, and finished the card, maybe go back to browse mode or just sit there?
        // Let's reset search and go back to category browsing automatically for better flow
        setSearchInput('');
        loadCards(true, selectedCategory, ''); 
      } else {
        // Explicit fetch needed for browse mode
        setIsLoading(true);
        try {
          const newCards = await fetchTorchCards([...history, currentCard.name], 3, selectedCategory);
          if (newCards.length > 0) {
            setCurrentCard(newCards[0]);
            setQueue(newCards.slice(1));
          }
        } catch (err) {
          setError("无法获取更多卡片。");
        } finally {
          setIsLoading(false);
        }
      }
    }
  }, [currentCard, history, queue, selectedCategory, searchInput]);

  const handleCategorySelect = (category: TorchCategory) => {
    if (category === selectedCategory && searchInput === '') return;
    setSelectedCategory(category);
    setSearchInput(''); // Clear search when changing category
    loadCards(true, category, '');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setIsSearching(true);
    // When searching, we keep the selected category visually but the search overrides logic
    loadCards(true, selectedCategory, searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput('');
    loadCards(true, selectedCategory, '');
  };

  const handleRetry = () => {
    loadCards(true, selectedCategory, searchInput);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-16 h-16 bg-torch-100 rounded-full flex items-center justify-center animate-pulse">
            <Flame className="text-torch-600 animate-bounce" size={32} />
          </div>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-slate-700">正在启动 TorchLearn...</h2>
        <p className="text-slate-500 mt-2">正在准备您的第一组 PyTorch 学习卡片</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-torch-100 selection:text-torch-900 pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-gradient-to-br from-torch-500 to-torch-600 p-1.5 rounded-lg text-white">
              <Flame size={20} fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 hidden sm:block">TorchLearn</span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
               <CheckCircle2 size={14} className="mr-1.5 text-green-500" />
               已学习 {history.length}
             </div>
             <a 
               href="https://pytorch.org/docs/stable/index.html" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-xs text-torch-600 hover:text-torch-700 font-medium hover:underline"
             >
               官方文档
             </a>
          </div>
        </div>
        
        {/* Controls Section (Search & Filter) */}
        <div className="max-w-3xl mx-auto px-4 py-3 border-t border-slate-100 space-y-3">
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative group">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="搜索函数 (例如: torch.matmul, Conv2d)..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-torch-500/50 focus:bg-white transition-all text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-torch-500 transition-colors" size={18} />
            {searchInput && (
              <button 
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </form>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`
                  whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all
                  ${selectedCategory === cat && !searchInput
                    ? 'bg-torch-50 border-torch-200 text-torch-700 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-torch-200 hover:text-torch-600'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 flex flex-col items-center min-h-[calc(100vh-12rem)]">
        
        {error ? (
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-red-100 text-center mt-8">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">出错了</h3>
            <p className="text-slate-500 mb-6">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={16} />
              重试
            </button>
          </div>
        ) : currentCard ? (
          <div className="w-full flex flex-col items-center gap-6">
            <FlashCard card={currentCard} />
            
            {/* Action Bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm sm:static sm:translate-x-0 sm:w-auto z-40">
              <button
                onClick={handleNext}
                disabled={isLoading}
                className={`
                  w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-torch-500/20 
                  flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:translate-y-0
                  ${isLoading 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-2xl'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span>加载中...</span>
                  </>
                ) : (
                  <>
                    <span>我学会了</span>
                    <ChevronRight size={24} />
                  </>
                )}
              </button>
            </div>
            
             <p className="text-slate-400 text-sm hidden sm:block">
               {searchInput ? "点击按钮将返回浏览模式" : "点击'我学会了'将获取下一个新函数"}
             </p>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 mt-12">
            <Loader2 size={40} className="text-torch-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">正在获取知识...</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
