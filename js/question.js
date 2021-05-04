var question = new Vue({
    el: ".container",
    data: {
        cutDown: "10:00",
        useTime : "0分0秒",
        cutTime: 0,
        qId: 0,
        question: "xxxxxxxxxxxx",
        quAll: [],
        quIndex: [],
        quArr: [],
        option: [],
        current: 1,
        nbtn: "下一题",
        score: 0,
        useAnswer: [],
        checked: -1,
        check: [],
        answerAble: false,
        scoreable: false
    }, 
    methods: {
        getQuestions: function () {
            var that = this;
            axios.get("js/questArr.json")
                .then(function (response) {
                    that.quAll = response.data.questionArr;
                    that.arrangeQue();
                })
        },
        arrangeQue() {
            var i = 0;
            while (i < 10) {
                var rn = Math.floor(Math.random() * this.quAll.length);
                if (this.quIndex.indexOf(rn) == -1) {
                    this.quIndex.push(rn);
                    i++;
                }
            }
            for (const key in this.quIndex) {
                if (Object.hasOwnProperty.call(this.quIndex, key)) {
                    const element = this.quAll[this.quIndex[key]];
                    this.quArr.push(element);
                }
            }
            for (let i = 0; i < 10; i++) {
                this.check[i] = -1;
            }
            this.question = "问题" + this.current + "：" + this.quArr[this.current - 1].question;
            this.option = this.quArr[this.current - 1].option;
            this.answerAble = true;
            this.cutTime = +new Date();
            this.cutTime = Number.parseInt(this.cutTime) + 600000;
            var that = this;
            this.qId = setInterval(function () {
                var dateT = +new Date();
                var ltime = (that.cutTime - dateT) / 1000;
                if (ltime < 0) {
                    clearInterval(that.qId);
                    that.answerAble = false;
                    that.getScore();
                }
                var min = parseInt(ltime / 60 % 60);
                var sec = parseInt(ltime % 60);
                min = min < 10 ? "0" + min : min;
                sec = sec < 10 ? "0" + sec : sec;
                that.cutDown = min + ":" + sec;
                that.useTime = parseInt((600 - ltime) / 60 % 60) + "分" + parseInt((600 - ltime)%60) + "秒";
            }, 0);
        },
        nextBtn() {
            if (this.current < 10) {
                this.current++;
                if (this.current == 10) {
                    this.nbtn = "提交";
                }
                this.checked = this.check[this.current - 1];
                this.question = "问题" + this.current + "：" + this.quArr[this.current - 1].question;
                this.option = this.quArr[this.current - 1].option;
            } else {
                clearInterval(this.qId);
                this.answerAble = false;
                alert("提交成功");
                this.getScore();
            }
        },
        preBtn() {
            if (this.current > 1) {
                if (this.current == 9) {
                    this.nbtn = "下一题";
                }
                this.current--;
                this.checked = this.check[this.current - 1];
                this.question = "问题" + this.current + "：" + this.quArr[this.current - 1].question;
                this.option = this.quArr[this.current - 1].option;
            }
        },
        juge(index) {
            this.checked = index;
            this.check[this.current - 1] = index;
            console.log(this.option[index].olable);
            if (this.option[index].olable == this.quArr[this.current - 1].answer) {
                this.useAnswer[this.current - 1] = true;
            } else {
                this.useAnswer[this.current - 1] = false;
            }
        },
        getScore() {
            for (const key in this.useAnswer) {
                if (Object.hasOwnProperty.call(this.useAnswer, key)) {
                    const element = this.useAnswer[key];
                    if (element) {
                        this.score += 10;
                    }
                }
            }
            this.scoreable = true;
        }
    },
    created: function () {
        this.getQuestions();
    }
})