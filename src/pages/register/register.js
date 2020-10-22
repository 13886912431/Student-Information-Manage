import { API } from "../common/API.js";
import { message } from "../../util/message-plugin/message.js";
import $ from "jquery";

import "./register.css";
import "../common/reset.css";
import "../../util/message-plugin/message.css";

const oInput = $(".form input");

$(".form input").on("input", function () {
    if ($(oInput[0]).val() || $(oInput[1]).val() || $(oInput[2]).val() || $(oInput[3]).val()) {
        $(".form label").show();
    } else {
        $(".form label").hide();
    }
});

$(".register-btn").click(function () {
    const data = $(".form").serializeArray();
    const result = {};
    data.forEach(item => {
        result[item.name] = item.value;
    });
    if (result.account && result.username && result.password === result.rePassword) {
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
        if (result.password !== result.rePassword) {
            message("两次密码不一致");
        }
    }
});
