export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
         
        ],
      },
      {
        path: '/nodetube',
        name: 'nodetube',
        icon: 'dashboard',
        routes: [
          {
            path: '/nodetube',
            redirect: '/nodetube/grouplist'
          },
          {
            path: '/nodetube/grouplist',
            name: 'grouplist',
            component: './NodeTube/GroupList',
          },
         
        ],
      },
      
      {
        component: '404',
      },
    ],
  },
];
