import { stringify } from "qs";
import request from "@/utils/request";

export async function queryProjectNotice() {
  return request("/api/project/notice");
}

export async function queryActivities() {
  return request("/api/activities");
}

export async function queryVersions(params) {
  return request(`/api/versions?${stringify(params)}`);
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request("/api/rule", {
    method: "POST",
    body: {
      ...params,
      method: "delete"
    }
  });
}

export async function addRule(params) {
  return request("/api/rule", {
    method: "POST",
    body: {
      ...params,
      method: "post"
    }
  });
}

export async function updateRule(params) {
  return request("/api/rule", {
    method: "POST",
    body: {
      ...params,
      method: "update"
    }
  });
}

export async function queryPackage(params) {
  return request(`/api/packages?${stringify(params)}`);
}

export async function delPackage(params) {
  return request("/api/packages", {
    method: "POST",
    body: {
      ...params,
      method: "delete"
    }
  });
}

export async function addPackage(params) {
  return request("/api/packages", {
    method: "POST",
    body: {
      ...params,
      method: "add"
    }
  });
}
export async function updatePackage(params) {
  return request("/api/packages", {
    method: "POST",
    body: {
      ...params,
      method: "update"
    }
  });
}

export async function fakeSubmitForm(params) {
  return request("/api/forms", {
    method: "POST",
    body: params
  });
}

export async function fakeChartData() {
  return request("/api/fake_chart_data");
}

export async function queryTags() {
  return request("/api/tags");
}

export async function queryBasicProfile() {
  return request("/api/profile/basic");
}

export async function queryAdvancedProfile() {
  return request("/api/profile/advanced");
}

export async function queryFakeList(params) {
  return request(`/api/nodetube/querygrouplist?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/nodetube/editgroup`, {
    method: "POST",
    body: {
      ...restParams,
      method: "delete"
    }
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/nodetube/editgroup`, {
    method: "POST",
    body: {
      ...restParams,
      method: "post"
    }
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/nodetube/editgroup`, {
    method: "POST",
    body: {
      ...restParams,
      method: "update"
    }
  });
}

export async function fakeAccountLogin(params) {
  return request("/api/login/account", {
    method: "POST",
    body: params
  });
}

export async function fakeRegister(params) {
  return request("/api/register", {
    method: "POST",
    body: params
  });
}

export async function queryNotices() {
  return request("/api/notices");
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
