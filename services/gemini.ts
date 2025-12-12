import { TorchFunctionCard, TorchCategory } from "../types";
import { LOCAL_CARDS } from "../data/cards";

/**
 * 模拟异步获取数据。
 * 在实际本地模式下，我们直接从 data/cards.ts 中筛选数据。
 */
export const fetchTorchCards = async (
  seenFunctions: string[], 
  count: number = 3, 
  category: TorchCategory = '全部',
  searchQuery: string = ''
): Promise<TorchFunctionCard[]> => {
  
  // 模拟网络延迟，让 UI 转换更自然
  await new Promise(resolve => setTimeout(resolve, 400));

  let availableCards = LOCAL_CARDS;

  // 1. 搜索过滤
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    availableCards = availableCards.filter(card => 
      card.name.toLowerCase().includes(query) || 
      card.description.toLowerCase().includes(query)
    );
    // 搜索模式下，如果没有找到精确匹配，我们就不排除已看过的，防止搜索结果为空
    // 如果找到了，返回前 count 个
    return availableCards.slice(0, count);
  }

  // 2. 类别过滤
  if (category !== '全部') {
    availableCards = availableCards.filter(card => card.category === category);
  }

  // 3. 排除已学过的
  // 注意：如果已学过的把所有卡片都占满了，为了演示效果，我们允许重复出现，或者重置
  const unseenCards = availableCards.filter(card => !seenFunctions.includes(card.name));
  
  // 如果所有卡片都看过了，重新从该类别的所有卡片中随机选，或者返回空让 UI 处理
  // 这里我们选择：如果有未看过的，从未看过的选；否则从全部符合类别的里面选（复习模式）
  const pool = unseenCards.length > 0 ? unseenCards : availableCards;

  if (pool.length === 0) {
    return [];
  }

  // 4. 随机打乱 (Fisher-Yates Shuffle)
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 5. 返回指定数量
  return shuffled.slice(0, count);
};