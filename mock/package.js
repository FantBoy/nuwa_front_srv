import { parse } from 'url';
import moment from 'moment';
// mock tableListDataSource
let pkgtype = ['服务版本包', '脚本包']
let tableListDataSource = [];
for (let i = 0; i < 28; i += 1) {
  tableListDataSource.push({
    key: i,
    name: `包名.${i}`,
    type: pkgtype[Math.floor(Math.random() * 2)],
    owner: `创建者名称 ${i}`,
    desc: '这是一段描述',
    createtime:  moment(new Date(`2017-07-${i + 1}`)).format('YYYY-MM-DD HH:mm:ss'),

  });
} 

function getPackages(req, res, u) {
    let url = u;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url; // eslint-disable-line
    }
  
    const params = parse(url, true).query;
    let dataSource = tableListDataSource;

    if (params.type) {
      const types = params.type.split(',');
      let filterDataSource = [];
      types.forEach(s => {
        filterDataSource = filterDataSource.concat(
          dataSource.filter(data => data.type === pkgtype[parseInt(s[0], 10)])
        );
      });
      dataSource = filterDataSource;
    }

    let pageSize = 10;
    if (params.pageSize) {
        pageSize = params.pageSize * 1;
    }
    const result = {
        list: dataSource,
        pagination: {
          total: dataSource.length,
          pageSize,
          current: parseInt(params.currentPage, 10) || 1,
        },
      };
    
      return res.json(result);
}

function postPackages(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, key, name, type, owner, desc, createtime } = body;
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => name.indexOf(item.name) === -1);
      break;
    case 'add':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        name,
        type,
        owner,
        desc,
        createtime,
    
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { desc, name, type, createtime, owner });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }
  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
      
    },
  };

  return res.json(result);
}

export default {
    'GET /api/packages': getPackages,
    'POST /api/packages': postPackages,
};
  