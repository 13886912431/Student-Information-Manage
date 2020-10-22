export class Pager {
    constructor(option) {
        const defaultOptions = {
            total: 1,
            limit: 10,
            current: 1,
            container: document.querySelector(".pager"),
            prevTest: "&laquo; 上一页",
            nextText: "下一页 &raquo;",
            firstText: "首页",
            lastText: "尾页",
            panelNumber: 5,
            onClick: null,
        };
        this.option = {
            ...defaultOptions,
            ...option,
        };
        this.init();
    }

    init() {
        this.maxPageNumber = Math.ceil(this.option.total / this.option.limit);

        this.pagerWrap = document.createElement("div");
        this.pagerWrap.className = "page-wrap";

        this.show();
        this.bindEvent();
    }

    show() {
        this.pagerWrap.innerHTML = "";

        // 创建首页
        this.createDom("page-first " + (this.option.current === 1 ? "disabled" : ""), this.option.firstText);

        // 创建上一页
        this.createDom("page-prev " + (this.option.current === 1 ? "disabled" : ""), this.option.prevTest);

        // 创建数字页码
        let min = this.option.current - Math.floor(this.option.panelNumber / 2);
        min < 1 && (min = 1);
        let max = min + this.option.panelNumber - 1;
        if (max > this.maxPageNumber) {
            max = this.maxPageNumber;
            min = this.maxPageNumber - this.option.panelNumber + 1;
            min < 1 && (min = 1);
        }
        for (let i = min; i <= max; i++) {
            this.createDom("page-num " + (i === this.option.current ? "active" : ""), i);
        }

        // 创建下一页
        this.createDom("page-next " + (this.option.current === this.maxPageNumber ? "disabled" : ""), this.option.nextText);

        // 创建尾页
        this.createDom("page-last " + (this.option.current === this.maxPageNumber ? "disabled" : ""), this.option.lastText);

        // 创建页码文本
        const span = document.createElement("span");
        span.innerHTML = `<span class="current">${this.option.current}</span> 
        / 
        <span class="total">${this.maxPageNumber}</span>`;
        span.className = "page-text";
        this.pagerWrap.appendChild(span);

        this.option.container.appendChild(this.pagerWrap);
    }

    bindEvent() {
        this.pagerWrap.onclick = e => {
            const targetClassList = e.target.classList;
            if (targetClassList.contains("page-first")) {
                this.toPage(1);
            } else if (targetClassList.contains("page-prev")) {
                // 如果这里使用++或--，则是把表达式的结果传递，并没有把current改变
                this.toPage(this.option.current - 1);
            } else if (targetClassList.contains("page-next")) {
                this.toPage(this.option.current + 1);
            } else if (targetClassList.contains("page-last")) {
                this.toPage(this.maxPageNumber);
            } else if (targetClassList.contains("page-num")) {
                this.toPage(+e.target.innerText);
            }
        };
    }

    createDom(className, text) {
        const div = document.createElement("div");
        div.className = `page-item ${className}`;
        div.innerHTML = text;
        this.pagerWrap.appendChild(div);
    }

    toPage(page) {
        page = Math.max(page, 1);
        page = Math.min(page, this.maxPageNumber);
        if (page === this.option.current) {
            return;
        }
        this.option.current = page;
        typeof this.option.onClick === "function" && this.option.onClick(this.option.current);
        this.show();
    }
}
