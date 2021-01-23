import API from "../common/API.js";
import message from "../../util/message-plugin/message.js";
import $ from "jquery";

import "./register.css";
import "../common/reset.css";
import "../../util/message-plugin/message.css";

/**
 * 注册按钮的点击函数
 */
function registerBtnClick() {
    const data = $(".form").serializeArray();
    const result = {};
    data.forEach(item => {
        result[item.name] = item.value;
    });
    if (result.username && result.account && result.password && result.rePassword && result.password === result.rePassword) {
        API.stuRegister(result).then(resp => {
            if (resp.status === "success") {
                message({
                    content: resp.msg,
                    type: "success",
                    onClose() {
                        location.href = "./login.html";
                    },
                });
            } else {
                message(resp.msg, "warn");
            }
        });
    } else {
        if (!result.username) {
            message("请输入用户名");
            return;
        } else if (!result.account) {
            message("请输入账号");
            return;
        } else if (!result.password) {
            message("请输入密码");
            return;
        } else if (result.password !== result.rePassword) {
            message("两次密码不一致");
            return;
        }
    }
}

$(".register-btn").click(registerBtnClick);
$(window).keydown(function (e) {
    if (e.key === "Enter") {
        registerBtnClick();
    }
});
