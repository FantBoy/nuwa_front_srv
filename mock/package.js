import { parse } from 'url';
import moment from 'moment';
// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 28; i += 1) {
  tableListDataSource.push({
    key: i,
    name: `包名.${i}`,
    owner: `创建者名称 ${i}`,
    desc: '这是一段描述',
    creattime:  moment(new Date(`2017-07-${i + 1}`)).format('YYYY-MM-DD'),

  });
}

function getPackages(req, res, u) {
    let url = u;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url; // eslint-disable-line
    }
  
    const params = parse(url, true).query;
    let dataSource = tableListDataSource;

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

export default {
    'GET /api/packages': getPackages,
};
  