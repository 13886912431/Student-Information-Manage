import { API } from "../common/API.js";

import { Pager } from "../../util/pager-plugin/pager.js";
import { message } from "../../util/message-plugin/message.js";
import echarts from "echarts";
import $ from "jquery";

import "../common/reset.css";
import "../../util/message-plugin/message.css";
import "../../util/pager-plugin/pager.css";
import "./index.css";

let total = 0; // 总数据量
let limit = 10; // 一页显示多少条数据
let current = 1; // 当前页码
let tableData = []; // 当前显示的表格数据

let isAdmin = false; // 是否是管理员

// 检查当前有没有登陆
const stuAccount = localStorage.getItem("stuAccount");
const stuPassword = localStorage.getItem("stuPassword");
if (!stuAccount && !stuPassword) {
    message({
        content: "当前未登陆，请先登陆",
        type: "load",
        onClose() {
            location.href = "./login.html";
        },
    });
} else {
    location.hash = "student-list";
    if (stuAccount === "13886912431" && stuPassword === "liuyinlin610") {
        isAdmin = true;
    }
    getTableData();
    bindEvent();
}

function bindEvent() {
    $(".menu dd").click(function () {
        // 左侧菜单样式切换
        $(".menu dd.active").removeClass("active");
        $(this).addClass("active");

        // 获取菜单项的id值，改变hash
        location.hash = this.dataset.id;
    });

    // 展开列表按钮
    $(".header .expan-btn").click(function () {
        $(".drop-list").slideToggle();
    });

    // 展开列表的切换hash
    $(".drop-list").click(function (e) {
        if (e.target.nodeName === "LI") {
            location.hash = e.target.dataset.id;
        }
        $(this).slideUp();
    });

    // 监听窗口大小改变
    $(window).resize(function () {
        if ($(this).width() >= 768) {
            $(".drop-list").hide();
        }
    });

    // 监听hash值的改变
    $(window).on("hashchange", function () {
        const hash = location.hash;
        // 右侧内容切换
        $(".content-item.show").removeClass("show");
        $(hash).addClass("show");
        if (hash === "#student-chart") {
            new PieChart();
        }

        // 左侧菜单样式切换
        $(".menu dd.active").removeClass("active");
        $($(".menu [data-id=" + hash.slice(1) + "]")).addClass("active");

        // 搜索区域显示切换
        if (hash.slice(1) === "student-list" && $(window).width() >= 768) {
            $(".search").show();
        } else {
            $(".search").hide();
        }
    });

    // 点击弹出编辑表单
    $("#tbody").on("click", ".edit", function () {
        if (!isAdmin) {
            message("您不是管理员", "warn");
            return;
        }
        $(".modal").slideDown();
        callFillForm(tableData[$(this).data("index")]);
    });

    // 编辑表单提交按钮
    $("#edit-submit").click(function (e) {
        e.preventDefault();
        const data = $("#edit-form").serializeArray();
        const result = dealwithFormData(data);
        if (checkFormData(result)) {
            API.updateStudent(result).then(resp => {
                if (resp.status === "success") {
                    $(".modal").slideUp();
                    getTableData();
                    message(resp.msg, "success");
                } else {
                    message(resp.msg, "error");
                }
            });
        }
    });

    // 添加学生表单提交按钮
    $("#add-submit").click(function (e) {
        e.preventDefault();
        const data = $("#add-form").serializeArray();
        const result = dealwithFormData(data);
        if (checkFormData(result)) {
            API.addStudent(result).then(resp => {
                if (resp.status === "success") {
                    message({
                        content: resp.msg,
                        type: "success",
                        duration: 2,
                        onClose() {
                            location.reload();
                        },
                    });
                } else {
                    message(resp.msg, "error");
                }
            });
        }
    });

    // 点击空白区域关闭编辑表单
    $(".modal").click(function (e) {
        if (e.target === this) {
            $(this).slideUp();
        }
    });

    //删除按钮
    $("#tbody").on("click", ".delete", function () {
        if (!isAdmin) {
            message("您不是管理员", "warn");
            return;
        }
        const sNo = tableData[$(this).data("index")].sNo;
        message({
            content: `确定删除学号${sNo}的学生信息吗？`,
            type: "confirm",
            onClose(isDel) {
                if (isDel) {
                    API.deleteStudent(sNo).then(resp => {
                        if (resp.status === "success") {
                            getTableData();
                            message(resp.msg, "success");
                        } else {
                            message(resp.msg, "error");
                        }
                    });
                }
            },
        });
    });

    //搜索按钮
    $(".search-submit").click(searchFunc);
    $(window).keydown(function (e) {
        if (e.code === "Enter") {
            searchFunc();
        }
    });

    /**
     * 搜索功能的函数
     */
    function searchFunc() {
        const value = $(".search-box").val();
        if (value) {
            $(".search-box").val("");
            current = 1;
            API.searchStudent({
                sex: -1,
                search: value,
                page: current,
                size: limit,
            }).then(resp => {
                if (resp.status === "success") {
                    total = resp.data.cont;
                    tableData = resp.data.searchList;
                    if (tableData.length === 0) {
                        message("没有找到符号条件的学生", "warn");
                        return;
                    }
                    $(".search-back").css({
                        visibility: "visible",
                    });
                    renderTable(tableData);
                    createPager();
                }
            });
        }
    }

    // 返回按钮
    $(".search-back").click(function () {
        getTableData();
        $(".search-back").css({
            visibility: "hidden",
        });
    });

    // 退出登录按钮
    $(".logout").click(function () {
        message({
            content: `确定退出登录吗？`,
            type: "confirm",
            onClose(isOut) {
                if (isOut) {
                    localStorage.removeItem("stuAccount");
                    localStorage.removeItem("stuPassword");
                    location.href = "./login.html";
                }
            },
        });
    });
}

/**
 * 获取学生数据
 */
function getTableData() {
    API.studentData({
        page: current,
        size: limit,
    }).then(resp => {
        if (resp.status === "success") {
            total = resp.data.cont;
            tableData = resp.data.findByPage;
            renderTable(tableData);
            createPager();
        } else {
            message(resp.msg, "error");
        }
    });
}

/**
 * 创建分页
 */
function createPager() {
    $(".pager").html("");
    const pager = new Pager({
        limit,
        total,
        current,
        onClick(cur) {
            current = cur;
            getTableData();
        },
    });
}

/**
 * 渲染表格
 * @param {*} data
 */
function renderTable(data) {
    const str = data.reduce(function (prev, item, index) {
        return (prev += `<tr>
                <td>${item.sNo}</td>
                <td>${item.name}</td>
                <td>${item.sex ? "女" : "男"}</td>
                <td>${item.email}</td>
                <td>${new Date().getFullYear() - item.birth}</td>
                <td>${item.phone}</td>
                <td>${item.address}</td>
                <td>
                    <button class="edit btn ${isAdmin ? "" : "disabled"}" data-index=${index}>编辑</button>
                    <button class="delete btn ${isAdmin ? "" : "disabled"}" data-index=${index}>删除</button>
                </td>
            </tr>`);
    }, "");
    $("#tbody").html(str);
}

/**
 * 数据回填到编辑表单
 * @param {*} data
 */
function callFillForm(data) {
    // 获取到编辑的form元素
    const editForm = $("#edit-form")[0];
    for (const prop in data) {
        // 判断 form表单里面是否存在name=prop的input标签 若有 回填数据
        if (editForm[prop]) {
            if (prop === "id") {
                continue;
            }
            editForm[prop].value = data[prop];
        }
    }
}

/**
 * 处理表单数据
 * @param {*} arr
 */
function dealwithFormData(arr) {
    const data = {};
    arr.forEach(item => {
        data[item.name] = item.value;
    });
    return data;
}

/**
 * 检验表单数据
 * @param {*} data
 */
function checkFormData(data) {
    const { name, sex, email, sNo, birth, phone, address } = data;
    if (!name || !sex || !email || !sNo || !birth || !phone || !address) {
        message("信息填写不完全，请校验之后再提交", "warn");
        return false;
    }
    // 校验学号  学号为4 - 16 位数字
    if (!/^\d{4,16}$/.test(sNo)) {
        message("学号应为4到16位数字", "warn");
        return false;
    }
    // 校验出生年份  应该为4位数字
    if (!(birth > new Date().getFullYear() - 100 && birth <= new Date().getFullYear())) {
        message("闹呢，你确定你的出生年份是这个时间？", "warn");
        return false;
    }
    // 手机号校验  1开头11为有效数字
    if (!/^1\d{10}$/.test(phone)) {
        message("手机号码不正确", "warn");
        return false;
    }
    return {
        name,
        sex,
        email,
        sNo,
        birth,
        phone,
        address,
    };
}

/**
 * 创建图表
 */
function PieChart() {
    this.init();
}

PieChart.prototype.init = function () {
    this.option = {
        // 标题
        title: {
            text: "",
            left: "center", // 居中
        },
        // 工具提示
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        // 图例
        legend: {
            orient: "vertical", // 垂直排列
            left: "left", // 左对齐
            data: [],
        },
        // 系列
        series: {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            },
        },
    };
    this.getData();
};

/**
 * 获取所有学生信息
 */
PieChart.prototype.getData = function () {
    API.studentAllData().then(resp => {
        if (resp.status === "success") {
            this.addressChart(resp.data);
            this.sexChart(resp.data);
        }
    });
};

/**
 * 地址图表
 * @param {*} data
 */
PieChart.prototype.addressChart = function (data) {
    const addressChart = echarts.init($(".address-chart")[0]);
    const legendData = [];
    const seriesData = [];

    const obj = {};
    data.forEach(item => {
        if (!obj[item.address]) {
            obj[item.address] = 1;
            legendData.push(item.address);
        } else {
            obj[item.address]++;
        }
    });

    for (const key in obj) {
        seriesData.push({
            name: key,
            value: obj[key],
        });
    }

    this.option.legend.data = legendData;
    this.option.series.data = seriesData;
    this.option.series.name = "地区分布";
    this.option.title.text = "学生地区分布统计";
    addressChart.setOption(this.option);
};

/**
 * 性别图表
 * @param {*} data
 */
PieChart.prototype.sexChart = function (data) {
    const sexChart = echarts.init($(".sex-chart")[0]);
    const legendData = ["男", "女"];
    const seriesData = [];

    const obj = {};
    data.forEach(item => {
        if (!obj[item.sex]) {
            obj[item.sex] = 1;
        } else {
            obj[item.sex]++;
        }
    });

    for (const key in obj) {
        seriesData.push({
            name: key == 0 ? "男" : "女",
            value: obj[key],
        });
    }

    this.option.legend.data = legendData;
    this.option.series.data = seriesData;
    this.option.series.name = "性别比例";
    this.option.title.text = "学生性别比例统计";
    sexChart.setOption(this.option);
};
