import $ from "jquery";

export const API = {
    /**
     * 按页获取学生信息
     * @param {*} data
     */
    studentData(data) {
        return this.transferData("/api/student/findByPage", data);
    },

    /**
     * 获取所有学生信息
     */
    studentAllData(){
        return this.transferData("/api/student/findAll")
    },

    /**
     * 删除一个学生信息
     * @param {*} sNo
     */
    deleteStudent(sNo) {
        return this.transferData("/api/student/delBySno", {
            sNo,
        });
    },
    /**
     * 更新一个学生信息
     * @param {*} data
     */
    updateStudent(data) {
        return this.transferData("/api/student/updateStudent", data);
    },

    /**
     * 添加一个学生
     * @param {*} data
     */
    addStudent(data) {
        return this.transferData("/api/student/addStudent", data);
    },

    /**
     * 搜索关键字
     * @param {*} data
     */
    searchStudent(data) {
        return this.transferData("/api/student/searchStudent", data);
    },

    /**
     * 注册
     * @param {*} data
     */
    stuRegister(data) {
        return this.transferData("/api/student/stuRegister", data, "post");
    },

    /**
     * 登录
     * @param {*} data
     */
    stuLogin(data) {
        return this.transferData("/api/student/stuLogin", data, "post");
    },
    /**
     * 方便本项目网络请求的函数
     * @param {*} path 请求的网络路径
     * @param {*} data 请求数据
     * @param {*} type 请求方式
     */
    transferData(path, data, type = "get") {
        data = $.extend(data, {
            appkey: "Serein_1596286275961",
        });
        return $.ajax({
            type,
            url: "http://open.duyiedu.com" + path,
            data,
            dataType: "json",
        });
    },
};
