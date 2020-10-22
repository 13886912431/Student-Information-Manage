/**
 * 可提供的类型（type）有：
 * info（普通信息）
 * warn（警告）
 * error（错误）
 * success（成功）
 * load（加载）
 * confirm（确定、取消）
 * @param  {...any} arg
 */
export function message(...arg) {
    if (document.querySelector(".message")) {
        return;
    }

    if (arg.length === 0) {
        _message();
    } else if (arg.length === 1) {
        if (typeof arg[0] === "string") {
            _message({
                content: arg[0],
            });
        } else if (typeof arg[0] === "object") {
            _message(arg[0]);
        }
    } else if (arg.length === 2) {
        if (typeof arg[1] === "function") {
            _message({
                content: arg[0],
                onClose: arg[1],
            });
        } else if (typeof arg[1] === "number") {
            _message({
                content: arg[0],
                duration: arg[1],
            });
        } else if (typeof arg[1] === "string") {
            _message({
                content: arg[0],
                type: arg[1],
            });
        }
    } else if (arg.length > 2) {
        _message({
            content: "都写这么多参数了，用一个对象传给我吧",
        });
    }

    function _message(option) {
        const defaultOption = {
            type: "info",
            content: "biu~ 说点什么好呢",
            onClose: null,
            duration: 2,
            close: null,
        };

        option = { ...defaultOption, ...option };

        function createDom() {
            option.div = document.createElement("div");
            option.div.className = `message ${option.type}`;
            option.div.innerHTML = `<span class="iconfont"></span><span class="content">${option.content}</span>`;

            if (option.type === "confirm") {
                option.duration = 0;
                option.div.innerHTML += '<div class="confirm-box"><div class="true-btn">确定</div><div class="false-btn">取消</div></div>';
            }

            document.body.appendChild(option.div);
            show();
        }

        createDom();

        if (typeof option.close === "function") {
            option.duration = 0;
            option.close(hide);
        }

        if (option.duration !== 0) {
            setTimeout(() => {
                hide(false);
            }, option.duration * 1000);
        } else {
            bindClickEvent();
        }

        function bindClickEvent() {
            option.div.addEventListener("click", function (e) {
                const targetClass = e.target.classList;
                if (targetClass.contains("true-btn")) {
                    hide(true);
                } else if (targetClass.contains("false-btn")) {
                    hide(false);
                }
            });
        }

        function show() {
            option.div.offsetHeight;
            option.div.style.transform = "translate(-50%, -50%) scale(1)";
        }

        function hide(bool) {
            option.div.addEventListener("transitionend", function () {
                this.remove();
                typeof option.onClose === "function" && option.onClose(bool);
            });
            option.div.style.transform = "translate(-50%, -50%) scale(0)";
        }
    }
}
