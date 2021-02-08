const Req_Msg = {
  success: "拉取成功",
  fail: "拉取失败"
};

const User_Msg = {
  logout_success: "退出成功",
  logout_fail: "退出失败"
};

const Net_Msg = {
  net_abnormal:"网络异常"
}

const Upload_Msg = {
  upload_file_format:"上传文件格式不对",
  upload_file_size:"上传文件内容过大"
}

export const Messages = Object.assign(Req_Msg, User_Msg,Net_Msg,Upload_Msg);


