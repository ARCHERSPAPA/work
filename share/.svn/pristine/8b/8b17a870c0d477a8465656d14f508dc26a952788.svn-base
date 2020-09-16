import * as axios from 'axios';
import * as qs from 'qs';
import * as md5 from 'md5';

// const baseUrl = /^pre/.test(location.host)?"//preapp.madrock.com.cn":
/^h5/.test(location.host) ? "//appserver.madrock.com.cn" : "//test.appserver.com";

const baseUrl = function () {
  let host = location.host;
  if (/^pre/.test(host)) return "//preapp.madrock.com.cn";
  else if (/^oshare/.test(host)) return "//appserver.madrock.com.cn";
  else return "//test.appserver.com";
}

axios.defaults.baseURL = baseUrl();
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 5000;


const getParams = function (data) {
  let args = qs.parse(location.href.split("?")[1]);
  let params = {
    timeStamp: new Date().getTime(),
  };
  if (args["userId"]) {
    params["userId"] = args["userId"];
    params["sign"] = md5("userId" + args["userId"] + "&timestamp" + params.timeStamp);
  }
  if (args["pim"]) {
    params["pim"] = args["pim"];
  }

  params["version"] = args["ver"] ? args["ver"] : "2.0.0";
  params["terminal"] = args["terminal"] ? args["terminal"] : getTerminal()
  params["para"] = JSON.stringify(data);

  return params;
}

const getTerminal = function () {
  let a = 1;//默认安卓手机
  if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    a = 0
  }
  else if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1) {
    a = 1
  }
  return a;
}

const request = {
  doGet: function (obj) {
    return new Promise((resolve, reject) => {
      axios.get(obj.url, {
        params: getParams(obj.data),
      }).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  },
  doPost: function (obj) {
    return new Promise((resolve, reject) => {
      axios.post(obj.url, getParams(obj.data)).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  }

}

export default request;
