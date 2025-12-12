import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TorchFunctionCard, TorchCategory } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "PyTorch 函数名称 (例如: torch.tensor, torch.nn.Linear)。" },
      signature: { type: Type.STRING, description: "典型的函数签名。" },
      category: { 
        type: Type.STRING, 
        enum: ['张量操作', '数学运算', '神经网络', '优化算法', '数据处理', '辅助工具'],
        description: "函数所属的功能分类。" 
      },
      description: { type: Type.STRING, description: "一句话简洁描述其功能 (中文)。" },
      codeExample: { 
        type: Type.STRING, 
        description: "一个正确的、可运行的 Python 代码示例。代码中不要包含输出结果的注释。" 
      },
      output: { 
        type: Type.STRING, 
        description: "代码示例运行后的控制台输出结果。展示张量的形状(shape)和数值。" 
      },
      difficulty: { type: Type.STRING, enum: ['入门', '进阶', '高级'] }
    },
    required: ["name", "signature", "category", "description", "codeExample", "output", "difficulty"],
  },
};

export const fetchTorchCards = async (
  seenFunctions: string[], 
  count: number = 3, 
  category: TorchCategory = '全部',
  searchQuery: string = ''
): Promise<TorchFunctionCard[]> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // System instruction sets the persona and output language
    const systemInstruction = `你是一位精通 PyTorch 的深度学习导师。
    你的任务是生成关于 PyTorch 函数的教育闪卡。
    请确保所有解释和描述都使用中文。
    
    关于代码示例的要求：
    1. 代码必须符合 Python 风格且准确无误。
    2. 代码部分**不要**包含行内注释形式的输出结果。
    3. **战术输出**：将代码运行后预期的控制台打印结果（Tensor 的值或 Shape）填入独立的 \`output\` 字段中。
    
    请确保初学者仅阅读代码和对应的输出块就能理解数据流向和函数作用。`;

    let prompt = '';

    if (searchQuery) {
      // Search mode prompt
      prompt = `请生成 1 个关于 PyTorch 函数 "${searchQuery}" 的闪卡。
      如果 "${searchQuery}" 不是一个准确的函数名，请找到最相关或名称最接近的 PyTorch 标准函数。
      请以 JSON 数组格式返回。`;
    } else {
      // Browsing/Learning mode prompt
      let categoryInstruction = '';
      if (category !== '全部') {
        categoryInstruction = `只生成属于 "${category}" 类别的函数。`;
      }

      prompt = `请生成 ${count} 个不同的 PyTorch 函数闪卡。
      不要包含以下用户已经学过的函数: ${JSON.stringify(seenFunctions)}。
      ${categoryInstruction}
      如果用户没有指定类别，请从不同类别中混合选择，并根据已学列表为空的情况优先从基础函数开始。
      尽量选择在研究和工业界常用的函数。
      请以 JSON 数组格式返回。`;
    }

    const result = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    if (!result.text) {
      throw new Error("No data returned from Gemini");
    }

    const cards = JSON.parse(result.text) as TorchFunctionCard[];
    return cards;
  } catch (error) {
    console.error("Error fetching cards from Gemini:", error);
    throw error;
  }
};