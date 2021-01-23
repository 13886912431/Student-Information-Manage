import API from "../common/API.js";
import message from "../../util/message-plugin/message.js";
import $ from "jquery";

import "./login.css";
import "../common/reset.css";
import "../../util/message-plugin/message.css";

/**
 * 登陆按钮的点击函数
 */
function loginBtnClick() {
    const account = $(".form")[0].account.value;
    const password = $(".form")[0].password.value;
    if (account && password) {
        API.stuLogin({
            account,
            password,
        }).then(resp => {
            if (resp.status === "success") {
                message({
                    content: resp.msg, 
                    type: "success",
                    onClose(){
                        localStorage.setItem("stuAccount", account);
                        localStorage.setItem("stuPassword", password);
                        location.href = "./index.html";
                    }
                })
            } else {
                message(resp.msg, "warn")
            }
        });
    } else {
        if (!account) {
            $(".form .account .msg").show(200);
        } else if (!password) {
            $(".form .password .msg").show(200);
        }
    }
}

$(".login-btn").click(loginBtnClick);
$(window).keydown(function (e) {
    if (e.key === "Enter") {
        loginBtnClick();
    }
});

$(".form input").focus(function () {
    $(".form .msg").hide();
});
