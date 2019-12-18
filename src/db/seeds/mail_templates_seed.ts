import * as Knex from "knex";
exports.seed = (knex: Knex) => seed(knex);
const tableName = 'mail_templates';
async function seed(knex: Knex) {
  await knex(tableName).del();
  await knex(tableName).insert({
    type: 'signUp',
    subject: `Kích hoạt tài khoản`,
    body: `<div>
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                  <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:150px;"> <img height="auto" src="https://mapp.vn/wp-content/uploads/2019/07/Untitled-1.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="150" /> </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
                          <div style="font-family:Helvetica, Arial, sans-serif;font-size:20px;line-height:32px;text-align:center;color:#404040;">Đăng kí tài khoản công ty tại hệ thống CRM SOLAZU !</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#000000;">
                          <p>Bạn đã đăng kí tài khoản công ty trong hệ thống  CRM SOLAZU <div>{{email}}</div></p>
                          <p>Để kích hoạt tài khoản và tiếp tục đăng kí tài khoản cho công ty của bạn, nhấp vào link bên dưới:</p>
                          <div><a href="{{link}}">{{link}}</a></div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px;word-break:break-word;">
                          <div style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#000000;">Để biết thêm thông tin, hãy truy cập <a href="https://mapp.vn/">mapp.vn</a>.</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px;word-break:break-word;">
                          <div style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#000000;">Trân trọng,</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px;word-break:break-word;">
                          <div style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#000000;">Hệ thống CRM.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background:#F2F2F2;background-color:#F2F2F2;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#F2F2F2;background-color:#F2F2F2;width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:5px 0;text-align:center;">
                  <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
                          <div style="font-family:Helvetica, Arial, sans-serif;font-size:11px;line-height:20px;text-align:center;color:#707070;">Copyright © 2019 mAPP.vn<br/>A Product of Solazu Co.,Ltd. All Rights Reserved.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`,
  });
  await knex(tableName).insert({
    type: 'forgotPassword',
    subject: `Thiết lập mật khẩu mới!`,
    body: `<div>
        <div style="margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                  <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                            <tbody>
                              <tr>
                                <td style="width:150px;"> <img height="auto" src="https://mapp.vn/wp-content/uploads/2019/07/Untitled-1.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="150" /> </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
                          <div style="font-family:Helvetica, Arial, sans-serif;font-size:20px;line-height:32px;text-align:center;color:#404040;">Thiết lập mật khẩu mới!</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#000000;">
                          <p>Gần đây bạn đã yêu cầu đặt lại mật khẩu cho tài khoản HRM này:<div>{{email}}</div></p>
                          <p>Để cập nhật mật khẩu của bạn, nhấp vào link bên dưới:</p>
                          <div><a href="{{link}}">{{link}}</a></div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px;word-break:break-word;">
                          <div style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#000000;">Để biết thêm thông tin, hãy truy cập <a href="https://mapp.vn/">mapp.vn</a>.</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px;word-break:break-word;">
                          <div style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#000000;">Trân trọng,</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px;word-break:break-word;">
                          <div style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#000000;">Hệ thống CRM.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background:#F2F2F2;background-color:#F2F2F2;margin:0px auto;max-width:600px;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#F2F2F2;background-color:#F2F2F2;width:100%;">
            <tbody>
              <tr>
                <td style="direction:ltr;font-size:0px;padding:5px 0;text-align:center;">
                  <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
                          <div style="font-family:Helvetica, Arial, sans-serif;font-size:11px;line-height:20px;text-align:center;color:#707070;">Copyright © 2019 mAPP.vn<br/>A Product of Solazu Co.,Ltd. All Rights Reserved.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`,
  });

}
