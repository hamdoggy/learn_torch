import { TorchFunctionCard } from "../types";

export const LOCAL_CARDS: TorchFunctionCard[] = [
  // --- 张量操作 ---
  {
    name: "torch.tensor",
    signature: "torch.tensor(data, dtype=None, device=None, requires_grad=False)",
    category: "张量操作",
    description: "从数据（如列表或 NumPy 数组）构造一个张量。这是创建张量最基本的方法。",
    difficulty: "入门",
    codeExample: `import torch

# 从列表创建
data = [[1, 2], [3, 4]]
x_data = torch.tensor(data)

print(f"Tensor:\\n{x_data}")`,
    output: `Tensor:
tensor([[1, 2],
        [3, 4]])`
  },
  {
    name: "torch.zeros",
    signature: "torch.zeros(*size, out=None, dtype=None, layout=torch.strided, device=None, requires_grad=False)",
    category: "张量操作",
    description: "返回一个全为标量 0 的张量，形状由变量参数 size 定义。",
    difficulty: "入门",
    codeExample: `import torch

# 创建一个 2x3 的全零张量
z = torch.zeros(2, 3)

print(z)`,
    output: `tensor([[0., 0., 0.],
        [0., 0., 0.]])`
  },
  {
    name: "torch.cat",
    signature: "torch.cat(tensors, dim=0, *, out=None)",
    category: "张量操作",
    description: "在给定的维度上将给定的张量序列连接（concatenate）起来。",
    difficulty: "进阶",
    codeExample: `import torch

x = torch.randn(2, 3)
# 在维度 0 上拼接 (增加行数)
res = torch.cat((x, x), dim=0)

print(f"Original shape: {x.shape}")
print(f"Concat shape: {res.shape}")`,
    output: `Original shape: torch.Size([2, 3])
Concat shape: torch.Size([4, 3])`
  },
  {
    name: "torch.stack",
    signature: "torch.stack(tensors, dim=0, *, out=None)",
    category: "张量操作",
    description: "沿着一个新的维度串联张量序列。所有张量必须具有相同的大小。",
    difficulty: "进阶",
    codeExample: `import torch

x = torch.tensor([1, 2])
y = torch.tensor([3, 4])

# Stack 会增加一个新的维度
res = torch.stack((x, y), dim=0)

print(res)
print(f"Shape: {res.shape}")`,
    output: `tensor([[1, 2],
        [3, 4]])
Shape: torch.Size([2, 2])`
  },
  {
    name: "torch.unsqueeze",
    signature: "torch.unsqueeze(input, dim)",
    category: "张量操作",
    description: "返回一个新的张量，其维度在指定位置插入了大小为 1 的维度。",
    difficulty: "进阶",
    codeExample: `import torch

x = torch.tensor([1, 2, 3, 4])
# 在索引 1 处增加维度
y = torch.unsqueeze(x, 1)

print(f"Original: {x.shape}")
print(f"Unsqueezed: {y.shape}")`,
    output: `Original: torch.Size([4])
Unsqueezed: torch.Size([4, 1])`
  },

  // --- 数学运算 ---
  {
    name: "torch.matmul",
    signature: "torch.matmul(input, other, *, out=None)",
    category: "数学运算",
    description: "两个张量的矩阵乘法。支持广播机制。",
    difficulty: "入门",
    codeExample: `import torch

# (2, 3) x (3, 2) -> (2, 2)
mat1 = torch.randn(2, 3)
mat2 = torch.randn(3, 2)
res = torch.matmul(mat1, mat2)

print(f"Result shape: {res.shape}")`,
    output: `Result shape: torch.Size([2, 2])`
  },
  {
    name: "torch.randn",
    signature: "torch.randn(*size, *, out=None, dtype=None, layout=torch.strided, device=None, requires_grad=False)",
    category: "数学运算",
    description: "返回一个张量，其中充满了均值为 0、方差为 1 的正态分布中的随机数。",
    difficulty: "入门",
    codeExample: `import torch

# 生成 3个 随机数
r = torch.randn(3)
print(r)`,
    output: `tensor([-0.1234,  1.5678, -0.9012])`
  },
  {
    name: "torch.clamp",
    signature: "torch.clamp(input, min=None, max=None, *, out=None)",
    category: "数学运算",
    description: "将输入张量中的所有元素限制在 [min, max] 范围内。",
    difficulty: "入门",
    codeExample: `import torch

a = torch.tensor([-1.5, 0.5, 1.5, 2.5])
# 限制在 [-0.5, 0.5] 之间
clamped = torch.clamp(a, min=-0.5, max=0.5)

print(clamped)`,
    output: `tensor([-0.5000, -0.5000,  0.5000,  0.5000])`
  },

  // --- 神经网络 ---
  {
    name: "torch.nn.Linear",
    signature: "torch.nn.Linear(in_features, out_features, bias=True)",
    category: "神经网络",
    description: "对输入数据应用线性变换：y = xA^T + b。是全连接层的实现。",
    difficulty: "入门",
    codeExample: `import torch
import torch.nn as nn

# 输入维度 20，输出维度 30
m = nn.Linear(20, 30)
input = torch.randn(128, 20)
output = m(input)

print(output.size())`,
    output: `torch.Size([128, 30])`
  },
  {
    name: "torch.nn.Conv2d",
    signature: "torch.nn.Conv2d(in_channels, out_channels, kernel_size, stride=1, padding=0, ...)",
    category: "神经网络",
    description: "对由多个输入平面组成的输入信号应用 2D 卷积。",
    difficulty: "进阶",
    codeExample: `import torch
import torch.nn as nn

# 1个输入通道 (灰度), 33个输出通道, 3x3 卷积核
m = nn.Conv2d(1, 33, 3, stride=2)
# Batch=20, Channel=1, H=50, W=100
input = torch.randn(20, 1, 50, 100)
output = m(input)

print(output.shape)`,
    output: `torch.Size([20, 33, 24, 49])`
  },
  {
    name: "torch.nn.ReLU",
    signature: "torch.nn.ReLU(inplace=False)",
    category: "神经网络",
    description: "应用整流线性单元函数：ReLU(x) = max(0, x)。最常用的激活函数之一。",
    difficulty: "入门",
    codeExample: `import torch
import torch.nn as nn

m = nn.ReLU()
input = torch.randn(2)
output = m(input)

print(f"Input: {input}")
print(f"Output: {output}")`,
    output: `Input: tensor([-0.85, 1.20])
Output: tensor([0.00, 1.20])`
  },
   {
    name: "torch.nn.CrossEntropyLoss",
    signature: "torch.nn.CrossEntropyLoss(weight=None, size_average=None, ignore_index=-100, ...)",
    category: "神经网络",
    description: "计算输入和目标之间的交叉熵损失。常用于多分类任务。",
    difficulty: "进阶",
    codeExample: `import torch
import torch.nn as nn

loss = nn.CrossEntropyLoss()
# 3个样本，5个类别
input = torch.randn(3, 5, requires_grad=True)
# 目标类别索引
target = torch.empty(3, dtype=torch.long).random_(5)
output = loss(input, target)

print(output)`,
    output: `tensor(1.6843, grad_fn=<NllLossBackward0>)`
  },

  // --- 优化算法 ---
  {
    name: "torch.optim.Adam",
    signature: "torch.optim.Adam(params, lr=0.001, betas=(0.9, 0.999), eps=1e-08, ...)",
    category: "优化算法",
    description: "实现 Adam 算法。这是一种基于一阶梯度的随机目标函数优化算法。",
    difficulty: "进阶",
    codeExample: `import torch

# 假设 model 是一个 nn.Module
# optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# 简单模拟参数
w = torch.tensor([1.0], requires_grad=True)
optimizer = torch.optim.Adam([w], lr=0.1)

optimizer.zero_grad()
loss = (w - 0)**2
loss.backward()
optimizer.step()

print(f"Updated w: {w.item():.4f}")`,
    output: `Updated w: 0.9000`
  },

   // --- 辅助工具 ---
  {
    name: "torch.utils.data.DataLoader",
    signature: "torch.utils.data.DataLoader(dataset, batch_size=1, shuffle=False, ...)",
    category: "辅助工具",
    description: "数据加载器。组合了数据集和采样器，并在数据集上提供可迭代对象。",
    difficulty: "进阶",
    codeExample: `import torch
from torch.utils.data import DataLoader, TensorDataset

x = torch.randn(10, 3)
y = torch.randn(10, 1)
dataset = TensorDataset(x, y)
loader = DataLoader(dataset, batch_size=5)

for batch_x, batch_y in loader:
    print(f"Batch x shape: {batch_x.shape}")`,
    output: `Batch x shape: torch.Size([5, 3])
Batch x shape: torch.Size([5, 3])`
  },
  {
    name: "torch.save",
    signature: "torch.save(obj, f, pickle_module=pickle, pickle_protocol=2, ...)",
    category: "辅助工具",
    description: "将对象保存到磁盘文件。常用于保存模型权重或整个模型。",
    difficulty: "入门",
    codeExample: `import torch

x = torch.tensor([1, 2, 3])
# 保存
torch.save(x, 'tensor.pt')
# 加载
y = torch.load('tensor.pt')

print(y)`,
    output: `tensor([1, 2, 3])`
  }
];