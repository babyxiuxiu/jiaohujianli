let loadingRender = (function () {
    let $loadingBox = $('.loadingBox'),
        $current = $loadingBox.find('.current'),
        imgData = [
            "img/zf_concatAddress.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_phoneBg.jpg", "img/zf_cubeTip.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png"
        ];
    let n = 0,
        len = imgData.length;
    let run = function run(callback) {
        imgData.forEach(item => {
            let tempImg = new Image;
            tempImg.onload = () => {
                tempImg = null;
                $current.css('width', ((++n) / len) * 100 + '%');
                //加载完成：执行回调函数（让当前loading页面消失）
                if (n === len) {
                    clearTimeout(delayTimer);
                    callback && callback();
                    return;
                }
            };
            tempImg.src = item;
        });
    };
    //maxDelay：设置最长等待时间（假设10s，到达10s我们看加载多少了，如果已经达到了90%以上，我们可以正常访问内容了，如果不足这个比例，直接提示用户当前网络状况不佳，稍后重试）
    let delayTimer = null;
    let maxDelay = function maxDelay(callback) {
        delayTimer = setTimeout(() => {
            if (n / len >= 0.9) {
                $current.css('width', '100%');
                callback && callback();
                return;
            }
            alert('非常遗憾，当前您的网络状况不佳，请稍后再试！');
            //window.localtion.href='http://www.qq.com';//此时我们不应该继续加载图片，而是让其关掉页面或者是跳转到其他页面
        }, 10000);
    };
    //done：完成
    let done = function done() {
        //停留一秒钟再移除进入下一环节
        let timer = setTimeout(() => {
            $loadingBox.remove();
            clearTimeout(timer);
            phoneRender.init();
        }, 1000);
    };
    return {
        init: function () {
            $loadingBox.css('display', 'block');
            run(done);
            maxDelay(done);
        }
    }
})();
//loadingRender.init();
/* 由于开发过程中项目板块众多，每一个板块都是一个单例，我们最好规划一种机制，通过标识的判断可以让程序只执行对应板块的内容，这样开发哪个版块，我们就把标识改为啥（hash路由控制） */
// phone
let phoneRender = (function () {
    let $phoneBox = $('.phoneBox'),
        $time = $phoneBox.find('span'),
        $answer = $phoneBox.find('.answer'),
        $answerMarkLink = $answer.find('.markLink'),
        $hang = $phoneBox.find('.hang'),
        $hangMarkLink = $hang.find('.markLink'),
        answerBell = $('#answerBell')[0],
        introduction = $('#introduction')[0];
    let answerMarkTouch = function answerMarkTouch() {
        // 1、remove answer
        $answer.remove();
        answerBell.pause();
        $(answerBell).remove(); //一定要先暂停播放然后再移除，否则即使移除了浏览器也会播放着这个声音
        // 2、show hang
        $hang.css('transform', 'translateY(0)');
        $time.css('display', 'block');
        introduction.play();
        computedTime();
    };
    // 计算播放时间
    let autoTimer = null;
    let computedTime = function computedTime() {
        let duration = 0;
        // 我们让autio播放，首先会去加载资源，部分资源加载完成才会播放，才会计算出总时间 duration等信息，所以我们可以把获取信息放到can-Play事件中
        /* introduction.oncanplay=function(){
            duration = introduction.duration;
        }; */
        autoTimer = setInterval(() => {
            let val = introduction.currentTime,
                duration = introduction.duration;
            // 播放完成
            if (val >= duration) {
                clearInterval(autoTimer);
                closePhone();
                return;
            }
            let minute = Math.floor(val / 60),
                second = Math.floor(val - minute * 60);
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            $time.html('${minute}:${second}');
        }, 1000);
    };
    // 关闭phone
    let closePhone = function closePhone() {
        clearInterval(autoTimer);
        introduction.pause();
        $(introduction).remove();
        $phoneBox.remove();
        messageRender.init();
    };
    return {
        init: function () {
            $phoneBox.css('display', 'block');
            // 播放bell
            answerBell.play();
            answerBell.volume = 0.3;
            //点击answerMark
            $answerMarkLink.tap(answerMarkTouch);
            $hangMarkLink.tap(closePhone);
        }
    }
})();
// message
let messageRender = (function () {
    let $messageBox = $('.messageBox'),
        $wrapper = $messageBox.find('.wrapper'),
        $messageList = $wrapper.find('li'),
        $keyBoard = $messageBox.find('.keyBoard'),
        $textInp = $keyBoard.find('span'),
        $submit = $keyBoard.find('.submit'),
        demonMusic = $('#demonMusic')[0];
    let step = -1, //记录当前展示信息的索引
        total = $messageList.length + 1, //记录的是信息总条数（自己发一条所以是加1）
        autoTimer = null,
        interval = 1500; //记录信息相继出现的间隔时间
    //展示信息
    let tt = 0;
    let showMessage = function showMessage() {
        ++step;
        if (step === 2) {
            //已经展示两条了，此时我们暂时结束自动信息发送，让键盘出来，开始执行手动发送
            clearInterval(autoTimer);
            handleSend();
            return;
        }
        let $cur = $messageList.eq(step);
        $cur.addClass('active');
        if (step >= 3) {
            //展示的条数已经是4条或者4条以上，此时我们让wrapper向上移动过（移动的距离是新展示这一条的高度）
            /* let curH = $cur[0].offsetHeight,
                wraT = parseFloat($wrapper.css('top'));
            $wrapper.css('top', wraT - curH); */
            // JS中基于CSS获取transform,得到的结果是一个矩阵
            let curH = $cur[0].offsetHeight;
            tt -= curH;
            $wrapper.css('transform', 'translateY(${tt}px)')
        }
        if (step >= total - 1) {
            //展示完了
            clearInterval(autoTimer);
            closeMessage();
        }
    };
    //手动发送
    let handleSend = function handleSend() {
        $keyBoard.css({
            transform: 'translateY(0)'
        }).one('transitionend', () => {
            //transitionend监听trasition动画结束的事件,并且有几个样式属性改变，并执行了过渡效果，事件就会触发执行几次->用one方法做事件绑定，只会让其触发一次
            let str = '好的，马上介绍！',
                n = -1,
                textTimer = null;
            textTimer = setInterval(() => {
                let orginHTML = $textInp.html();
                $textInp.html(orginHTML + str[++n]);
                if (n >= str.length - 1) {
                    //文字显示完成
                    clearInterval(textTimer);
                    $submit.css('display', 'block');
                }
            }, 100);
        });
    };
    // 点击submit
    let handleSubmit = function handleSubmit() {
        //把新创建的li增加到页面中第二个li的后面
        $(`
            (<li class="self"> 
                <i class = "arrow"></i> 
                <img src = "img/zf_messageStudent.png" alt = "" class = "pic">
                ${$textInp.html()}
            </li>
        `).inserAfter($messageList.eq(1)).addClass('active');
        $messageList = $wrapper.find('li'); //重要：把新的Li放到页面中，我们此时应该重新获取Li，让messageList和页面中Li正对应，方便后期根据索引展示对应的LI
        // 该消失的消失
        $textInp.html('');
        $submit.css('display', 'none');
        $keyBoard.css('transform', 'translateY(3.7rem)');
        //继续向下展示剩余的消息
        autoTimer = setInterval(showMessage, interval);
    };
    //关掉message区域
    let closeMessage = function closeMessage() {
        let delayTimer = setTimeout(() => {
            demonMusic.pause();
            $(demonMusic).remove();
            $messageBox.remove();
            clearTimeout(delayTimer);
            cubeRender.init();
        }, interval);
    };
    return {
        init: function () {
            $messageBox.css('display', 'block');
            //加载模块立即展示一条信息，后期间隔interval再发送一条信息
            showMessage();
            autoTimer = setInterval(showMessage, interval);
            //submit
            $submit.tap(handleSubmit);
            //music
            demonMusic.play();
            demonMusic.volume = 0.3;
        }
    }
})();
// cube
let cubeRender = (function () {
    let $cubeBox = $('.cubeBox'),
        $cube = $('.cube'),
        $cubeList = $cube.find('li');
    //手指控制旋转
    let start = function start(ev) {
        //记录手指按下位置起始坐标
        let point = ev.changedTouches[0];
        this.strX = point.clientX;
        this.strY = point.clientY;
        this.changeX = 0;
        this.changeY = 0;
    };
    let move = function move(ev) {
        //用最新手指的位置-起始的位置 记录X/Y轴的偏移
        let point = ev.changedTouches[0];
        this.changeX = point.clientX - this.strX;
        this.changeY = point.clientY - this.strY;
    };
    let end = function end(ev) {
        let {
            changeX,
            changeY,
            rotateX,
            rotateY
        } = this,
        isMove = false;
        //验证是否发生移动(判断滑动误差)
        Math.abs(changeX) > 10 || Math.abs(changeY) > 10 ? isMove = true : null;
        //只有发生移动再处理
        if (isMove) {
            //1、左右滑=>change-X=>rotate-Y（正比：change越大 rotate越大）
            //2、上下滑=>change-Y=>rotate-X（反比：change越大 rotate越小）
            //3、为了让每一次操作旋转角度小一点，我们可以把移动距离的3/1作为旋转的角度即可
            rotateX = rotateX - changeY / 3;
            rotateY = rotateY + changeX / 3;
            //赋值给魔方盒子
            $(this).css('transform', `scale(0.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
            //让当前旋转的角度成为下一次起始的角度
            this.rotateX = rotateX;
            this.rotateY = rotateY;
        }
        //清空其它记录的自定义属性值
        ['strX', 'strY', 'changeX', 'changeY'].forEach(item => this[item] = null);
    };
    return {
        init: function () {
            $cubeBox.css('display', 'block');
            //手指操作cube，让cube跟着旋转
            let cube = $cube[0];
            cube[0].rotateX = -35;
            cube[0].rotateY = 35; //记录初始的旋转角度（存储到自定义属性上）
            $cube.on('touchstart', start).on('touchmove', move).on('touchend', end);
            //点击每一个页面跳转到详情区域对应的页面
            $cubeList.tap(function () {
                $cubeBox.css('display', 'none');
                //跳转到详情区域，通过传递点击li的索引，让其定位到具体的slide
                let index = $(this).index();
                detailRender.init(index);
            });
        }
    }
})();
//detail
let detailRender = (function () {
    let $detailBox = $('.detailBox'),
        swiper = null,
        $dl = $('.page1>dl'),
        swiperInit = function swiperInit() {
            swiper = new Swiper('.swiper-container', {
                //initialSlide:1 初始slide索引
                //direction:'horizontal/vertical' 控制滑动方向
                //loop: true //swiper有一个BUG：3D切换设置loop为ture的时候偶尔会出现无法切换的情况（2D效果没问题）=>无缝切换的原理：把真实第一张克隆一份到末尾，把真实最后一张也克隆一份放到开始（真是slide有五个，wrapper中会有7个slide）
                effect: 'coverflow',
                onInit: move,
                onTransitionEnd: move
            });
            //实例的私有属性：
            //1、activeIndex：当前展示slide块的索引
            //2、slides：获取所有的slide（数组）
            //实例的公有方法
            //slideTo：切换到指定索引的slide
        };
    let move = function move(swiper) {
        //swoper：当前创建的实例
        //1、判断当前是否为第一个slide：如果是让3D菜单展开，不是收起3D菜单
        let activeIn = swiper.activeIndex,
            slidAry = swiper.slides;
        if (activeIn === 0) {
            //page1
            $dl.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            });
            $dl.makisu('open');
        } else {
            //other page
            $dl.makisu({
                selector: 'dd',
                speed: 0
            });
            $dl.makisu('close');
        }
        //2、滑到哪一页，把当前页面设置对应的ID，其余页面移除ID即可
        slideAry.forEach((item, index) => {
            if (activeIn === index) {
                item.id = `page${index+1}`;
                return;
            }
            item.id = null;
        });
    };
    return {
        init: function (index = 0) {
            $detailBox.css('display', 'block');
            if (!swiper) {
                //防止重复初始化
                swiperInit();
            }
            swiper.slideTo(index, 0); //直接运动到具体的slide页面(第二个参数是切换的速度，0立即切换没有切换的动画效果)
        }
    }
})();
//hash
let url = window.location.href, //获取当前页面的URL地址 location.href='xxx'这种写法是让其跳转到某一个页面
    well = url.indexOf('#'),
    hash = well === -1 ? null : url.substr(well + 1);
switch (hash) {
    case 'loading':
        loadingRender.init();
        break;
    case 'phone':
        phoneRender.init();
        break;
    case 'message':
        messageRender.init();
        break;
    case 'cube':
        cubeRender.init();
        break;
    case 'detail':
        detailRender.init();
        break;
    default:
        loadingRender.init();
}