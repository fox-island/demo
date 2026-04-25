const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const app = express();
const prisma = new PrismaClient();

// 【基础配置】允许接收 JSON 格式的数据，并解决跨域问题
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // 允许前端跨域访问
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200); // 处理预检请求
    next();
});

// ==========================================
// 1. 用户认证模块 API
// ==========================================

// POST /api/register - 注册接口
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' });

        // 检查用户是否已存在
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) return res.status(409).json({ error: '该用户名已被注册' });

        // 密码加密 (加盐10轮)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 存入数据库
        const user = await prisma.user.create({
            data: { username, password: hashedPassword }
        });

        res.status(201).json({ message: '注册成功', userId: user.id });
    } catch (err) {
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// POST /api/login - 登录接口
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' });

        // 查找用户
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(401).json({ error: '用户名或密码错误' });

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: '用户名或密码错误' });

        // 实际项目中这里应该用 jsonwebtoken 生成 token 返回给前端，这里为了简单先直接返回成功
        res.json({ message: '登录成功', userId: user.id, username: user.username });
    } catch (err) {
        res.status(500).json({ error: '服务器内部错误' });
    }
});


// ==========================================
// 2. 卡牌图鉴模块 API
// ==========================================

// GET /api/cards - 获取所有卡牌（图鉴）
app.get('/api/cards', async (req, res) => {
    try {
        // 按照稀有度排序，或者你可以改成按 id 排序
        const cards = await prisma.card.findMany({
            orderBy: { id: 'asc' }
        });
        res.json(cards);
    } catch (err) {
        res.status(500).json({ error: '获取卡牌失败' });
    }
});


// ==========================================
// 3. 知识树（侧边栏）模块 API
// ==========================================

// GET /api/menus - 获取树形侧边栏菜单
app.get('/api/menus', async (req, res) => {
    try {
        // 1. 查出所有知识条目
        const allKnowledge = await prisma.knowledge.findMany({
            orderBy: { sort: 'asc' } // 按你设定的 sort 字段排序
        });

        // 2. 递归组装树形结构
        function buildTree(list, parentId = null) {
            return list
                .filter(item => item.parentId === parentId)
                .map(item => {
                    const children = buildTree(list, item.id);
                    return {
                        id: String(item.menuKey), // 转字符串匹配前端 el-menu 的 index
                        name: item.title,
                        children: children.length > 0 ? children : undefined
                    };
                });
        }

        const menuTree = buildTree(allKnowledge);
        res.json(menuTree);
    } catch (err) {
        res.status(500).json({ error: '获取菜单失败' });
    }
});

// GET /api/knowledge/:menuKey - 获取具体知识条目内容
app.get('/api/knowledge/:menuKey', async (req, res) => {
    try {
        const { menuKey } = req.params;
        
        const detail = await prisma.knowledge.findUnique({
            where: { menuKey: menuKey },
            select: { title: true, content: true } // 只返回标题和内容，不返回 id 等无关字段
        });

        if (!detail) {
            return res.status(404).json({ error: '未找到该知识条目' });
        }

        res.json(detail);
    } catch (err) {
        res.status(500).json({ error: '获取内容失败' });
    }
});


// ==========================================
// 启动服务器
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 卡牌百科后端服务已启动：http://localhost:${PORT}`);
});
