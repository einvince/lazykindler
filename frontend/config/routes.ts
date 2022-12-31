export default [
    { path: '/welcome', name: '常用操作', icon: 'smile', component: './Welcome' },
    {
        path: '/book_list',
        icon: 'ReadOutlined',
        name: '书籍',
        routes: [
            {
                name: '集合',
                icon: 'smile',
                path: '/book_list/colls',
                component: './book_list/book_collections',
            },
            {
                name: '书库',
                icon: 'smile',
                path: '/book_list/all_books',
                component: './book_list/all_books',
            },
            {
                name: '临时导入',
                icon: 'smile',
                path: '/book_list/tmp_books',
                component: './book_list/tmp_books',
            },
        ],
    },
    {
        path: '/clipping',
        name: '高亮笔记',
        icon: 'FireOutlined',
        routes: [
            {
                path: '/clipping/colls',
                name: '集合',
                icon: 'smile',
                component: './clipping/clipping_collections',
            },
            {
                path: '/clipping/clippings',
                name: '摘抄',
                icon: 'smile',
                component: './clipping/clippings',
            },
            { component: './404' },
        ],
    },
    { path: '/', redirect: '/welcome' },
    { component: './404' },
];
