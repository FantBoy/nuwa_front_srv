import { parse } from "url";
import moment from "moment";
// mock tableListDataSource
let pkgtype = ["服务版本包", "脚本包"];
let tableListDataSource = [];
for (let i = 0; i < 28; i += 1) {
  tableListDataSource.push({
    key: i,
    version: `1.0.${i}`,
    installed_number: Math.floor(Math.random() * 30),
    owner: `创建者名称 ${i}`,
    desc: "这是一段描述",
    createtime: moment(new Date(`2017-07-${i + 1}`)).format(
      "YYYY-MM-DD HH:mm:ss"
    )
  });
}

function getVersion(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== "[object String]") {
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
      current: parseInt(params.currentPage, 10) || 1
    }
  };

  return res.json(result);
}
export default {
  "GET /api/versions": getVersion
};
