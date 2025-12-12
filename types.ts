export type TorchCategory = '全部' | '张量操作' | '数学运算' | '神经网络' | '优化算法' | '数据处理' | '辅助工具';

export interface TorchFunctionCard {
  name: string;
  signature: string;
  category: TorchCategory;
  description: string;
  codeExample: string;
  output: string; // New field for console output
  difficulty: '入门' | '进阶' | '高级';
}

export interface AppState {
  history: string[];
  queue: TorchFunctionCard[];
  currentCard: TorchFunctionCard | null;
  isLoading: boolean;
  error: string | null;
  selectedCategory: TorchCategory;
  searchQuery: string;
}