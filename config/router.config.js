export default [
  // user
  {
    path: "/user",
    component: "../layouts/UserLayout",
    routes: [
      { path: "/user", redirect: "/user/login" },
      { path: "/user/login", component: "./User/Login" },
      { path: "/user/register", component: "./User/Register" },
      { path: "/user/register-result", component: "./User/RegisterResult" }
    ]
  },
  // app
  {
    path: "/",
    component: "../layouts/BasicLayout",
    Routes: ["src/pages/Authorized"],
    authority: ["admin", "user"],
    routes: [
      // dashboard
      { path: "/", redirect: "/dashboard/analysis" },
      {
        path: "/dashboard",
        name: "dashboard",
        icon: "dashboard",
        routes: [
          {
            path: "/dashboard/analysis",
            name: "analysis",
            component: "./Dashboard/Analysis"
          }
        ]
      },
      {
        path: "/nodetube",
        name: "nodetube",
        icon: "dashboard",
        routes: [
          {
            path: "/nodetube",
            redirect: "./NodeTube/GroupList"
          },
          {
            path: "/nodetube/grouplist",
            name: "grouplist",
            component: "./NodeTube/GroupList"
          },
          {
            path: "/nodetube/nodelist",
            name: "nodelist",
            component: "./NodeTube/NodeList"
          }
        ]
      },
      {
        path: "/packagetube",
        name: "packagetube",
        icon: "dashboard",
        routes: [
          {
            path: "/packagetube",
            redirect: "./PkgTube/PackageList"
          },
          {
            path: "/packagetube/packagelist",
            name: "packagelist",
            component: "./PkgTube/PackageList"
          },
          {
            path: "/packagetube/packageversionlist",
            name: "packageversionlist",
            hideInMenu: true,
            component: "./PkgTube/PackageVersionList"
          },
          {
            path: "/packagetube/version/stepform",
            name: "stepform",
            component: "./VersionStepForms",
            hideChildrenInMenu: true,
            routes: [
              {
                path: "/packagetube/version/stepform",
                redirect: "/packagetube/version/stepform/info"
              },
              {
                path: "/packagetube/version/stepform/info",
                name: "info",
                component: "./VersionStepForms/Step1"
              },
              {
                path: "/packagetube/version/stepform/confirm",
                name: "confirm",
                component: "./VersionStepForms/Step2"
              },
              {
                path: "/packagetube/version/stepform/result",
                name: "result",
                component: "./VersionStepForms/Step3"
              }
            ]
          }
        ]
      },
      {
        component: "404"
      }
    ]
  }
];
