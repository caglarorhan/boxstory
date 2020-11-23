const jsonDatum = [
    {
        "show": true,
        "life_hour": 0.01,
        "content_id": "9999-45t8yr34",
        "side": "",
        "position": "relative",
        "z_index": "900",
        "width": "500px",
        "height": "300px",
        "top": "0",
        "left": "auto",
        "bottom": "",
        "margin": "200px auto",
        "bgColor": "pink",
        "border": "",
        "border_radius": "0",
        "box_shadow": "",
        "backdrop": true,
        "backdrop_specs": {
            "rgba": "rgba(0,0,0,0.5)"
        },
        "remove_condition": {"condition": "timer", "value": 1},
        "content": "<div style='width: 500px; text-align: center; margin:0 auto; height:100%; background-color: deeppink'><div style='text-align: left'>Deneme icerigi buraya gelecek</div><\/div>",
        "animations": {
            "box_remover":{
                "animation_specs": {
                },
                "keyframes": "",
                "remove_after":"true"
            },
            "turner": {
                "animation_specs": {
                    "animation-delay": "",
                    "animation-duration": "0.7s",
                    "animation-direction": "",
                    "animation-play-state": ""
                },
                "keyframes": "0% {transform: rotate(0); opacity:1}" +
                    "100% {transform: rotate(360deg); opacity:0}",
                "remove_after":"true"
            },
            "first-load": {
                "animation_specs": {
                    "animation-delay": "",
                    "animation-duration": "3s",
                    "animation-direction": "",
                    "animation-play-state": ""
                },
                "keyframes": "0% {left:-1600px;;}" +
                    "100% {left:0}",
                "remove_after":""
            },
            "slide-out": {
                "animation_specs": {
                    "animation-delay": "",
                    "animation-duration": "1s",
                    "animation-direction": "",
                    "animation-play-state": ""
                },
                "keyframes": "0% {left:0;}" +
                    "100% {left:-1600px;}",
                "remove_after":"true"

            },
            "fly-down": {
                "animation_specs": {
                    "animation-delay": "",
                    "animation-duration": "2s",
                    "animation-direction": "",
                    "animation-play-state": ""
                },
                "keyframes": "0% {top:-1500px;}" +
                    "100% {top:200px;}"
            },
            "turn-in": {
                "animation_specs": {
                    "animation-duration": "1s",
                },
                "keyframes": "0% {transform: rotate(360deg); opacity:0; display:''}" +
                    "100% {transform: rotate(0); opacity:1; display:''}"

            }
        },
        "scenarios": {
            "leaving_window":{
                "event_source": "window",
                "event": "mouseleave",
                "animations": [
                    {
                        "animation_name":"fly-down",
                        "repetative":false
                    }
                ],
                "except":[]
            }
},
        "close_button": "true",
        "close_button_content": "<img src=\"https:\/\/www.ecanta.com.tr\/sources\/img\/close.svg\">",
        "close_button_specs": {
            "top": "0",
            "right": "0",
            "height": "20px",
            "width": "20px",
            "padding": "5px",
            "margin": "1px",
            "bgColor": "white",
            "border": "0 solid black",
            "title": "Kapat"
        }
    }
]

const WDC_box = {
    expDateTime(lifeHour) {
        return new Date().getTime() + (lifeHour * 3600000)
    },
    vw() {
        return Math.min(document.documentElement.clientWidth, window.innerWidth)
    },
    vh() {
        return Math.min(document.documentElement.clientHeight, window.innerHeight)
    },
    createBox(boxData) {
        const backDrop = document.createElement('div');
        const boxCloseButton = document.createElement('span');
        const box = document.createElement('div');
console.log(boxData.backdrop_specs.rgba)
        if (boxData.backdrop === true || boxData.backdrop === "true") {
            backDrop.style.cssText = `width:100%; height:100%; overflow:hidden; position: fixed; z-index:${boxData.z_index};left:0;top:0; background-color: ${boxData.backdrop_specs.rgba};`;
            backDrop.id = 'backdrop_' + boxData.content_id;
            backDrop.addEventListener('click',()=>{
                this.removeBox(boxData);
            })
            document.body.append(backDrop);
        }
        if (boxData.close_button === true || boxData.close_button === "true") {
            boxCloseButton.style.cssText = `position: absolute; z-index:101; cursor:pointer; top:${boxData.close_button_specs.top}; right:${boxData.close_button_specs.right}; cursor:pointer; background-color:${boxData.close_button_specs.bgColor}; border:${boxData.close_button_specs.border}; height:${boxData.close_button_specs.height}; width:${boxData.close_button_specs.width}; padding:${boxData.close_button_specs.padding}; margin:${boxData.close_button_specs.margin}`;
            boxCloseButton.title = boxData.close_button_specs.title;
            boxCloseButton.id = 'box_close_button_' + boxData.content_id;
            boxCloseButton.innerHTML = boxData.close_button_content;
            boxCloseButton.addEventListener('click', ()=>{
                this.removeBox(boxData);
            })
        }
        //box creating...
            let widthOfBox = boxData.width.includes('%') ? boxData.width : boxData.width;
            let leftOfBox = boxData.left;
            let topOfBox = boxData.top;
            switch (boxData.side) {
                case "right":
                    leftOfBox = WDC_box.vw() - parseInt(boxData.width);
                    break;
                case "left":
                    leftOfBox = 0;
                    break;
                case "bottom":
                    topOfBox = WDC_box.vh() - parseInt(boxData.height);
                    leftOfBox = (WDC_box.vw() - parseInt(boxData.width)) / 2;
                    break;
            }


            box.style.cssText = `width:${widthOfBox}; height: ${boxData.height}; left:${leftOfBox}px; top:${topOfBox}px; position:${boxData.position}; margin:${boxData.margin}; background-color:${boxData.bgColor}; z-index: ${boxData.z_index} border-radius:${boxData.border_radius}; border: ${boxData.border}; box-shadow:${boxData.box_shadow} ; box-sizing: border-box;`;
            box.id = 'box_' + boxData.content_id;
            box.innerHTML = boxData.content;
            box.append(boxCloseButton);
            box.addEventListener('click',e=>{
                e.stopPropagation()
            })
            if (document.querySelector('#backdrop_' + boxData.content_id)) {
                document.querySelector('#backdrop_' + boxData.content_id).append(box);
                document.querySelector('#backdrop_' + boxData.content_id).style.display='none';
            } else {
                document.body.insertAdjacentElement('afterbegin', box);
                document.querySelector('#box_' + boxData.content_id).style.display='none';
            }

    },
    createAnimation(boxData, animationName) {
        console.log('create animation triggered');
        if(!document.querySelector('#box_' + boxData.content_id)){
            this.createBox(boxData);
        }
        document.querySelector('#backdrop_' + boxData.content_id).style.display='';
        document.querySelector('#box_' + boxData.content_id).style.display='';
        const targetCSS = document.createElement('style');
        let animationSpecsText = "";
        console.log(animationName)
        Object.entries(boxData.animations[animationName].animation_specs).forEach(([k, v]) => {
            if (v) {
                animationSpecsText += `${k}:${v}; `;
            }
        })
        targetCSS.innerHTML = `
        .${animationName}_${boxData.content_id}{
            animation-name: ${animationName};
            ${animationSpecsText}
            }
            @keyframes ${animationName} {
                               ${boxData.animations[animationName].keyframes}
                                }
            `;
        // CSS rule control
        console.log(`
        hedef class name: ${animationName + "_" + boxData.content_id}
        
        `)


        if(!Object.values(document.styleSheets).map(rlz=>rlz.rules[0].selectorText).includes("."+animationName + "_" + boxData.content_id)){
            document.head.append(targetCSS);
        }


    },
    init(json_src) {
        let result = fetch(json_src).then(response => response.json()).then(data => {
            jsonDatum.forEach((jsonData) => {
                let registeredDateTime = window.localStorage.getItem("box_" + jsonData.content_id);
                let expired = true;
                window.localStorage.removeItem("box_" + data.content_id)
                if (registeredDateTime) {
                    expired = new Date().getTime() - parseInt(registeredDateTime) > 0
                }
                if (jsonData.show && expired) {
                    WDC_box.createBox(jsonData);
                    this.action(jsonData)
                    //this.createAnimation(jsonData, 'first-load')

                } else {
                    return false;
                }
            })

        })
    },
    action(boxData){
        console.log('action triggered');
        Object.keys(boxData.scenarios).forEach(scenarioName=>{
            let scenario = boxData.scenarios[scenarioName];
            console.log(scenarioName);
            const triggerElement = (scenario.event_source!=="window")?document.querySelector(scenario.event_source + boxData.content_id):document;

            triggerElement.addEventListener(scenario.event,()=>{
                    scenario.animations.forEach(animationData => {
                        this.createAnimation(boxData, animationData.animation_name);




                        //repetative degerine gore tek sefer iplemente edilecek veya requestAnimationFrame kullanilacak
document.querySelector("#box_" + boxData.content_id).classList.remove(animationData.animation_name + "_" + boxData.content_id);
if(animationData.repetative==="true" || animationData.repetative){
    window.requestAnimationFrame(function(time) {
        window.requestAnimationFrame(function(time) {
            document.querySelector("#box_" + boxData.content_id).classList.add(animationData.animation_name + "_" + boxData.content_id);
        });
    });
}else{
    document.querySelector("#box_" + boxData.content_id).classList.add(animationData.animation_name + "_" + boxData.content_id);
}




                        document.querySelector("#box_" + boxData.content_id).addEventListener('animationend', () => {
                            if (boxData.animations[animationData.animation_name].remove_after==="true" || boxData.animations[animationData.animation_name].remove_after) {
                                this.removeBox(boxData)
                            }
                        });


                    })
                })


            //exceptions (for event bubbling)
            scenario.except.forEach(itemIdPrefix=>{
                document.querySelector(itemIdPrefix + boxData.content_id).addEventListener(scenario.event,(e)=>{
                    e.stopPropagation();
                })
            })
        })
    },
    removeBox(boxData) {
        if (boxData.backdrop === true || boxData.backdrop === "true") {
            document.querySelector('#backdrop_' + boxData.content_id).remove();
        } else {
            document.querySelector('#box_' + boxData.content_id).remove();
        }
        window.localStorage.setItem('box_' + boxData.content_id, WDC_box.expDateTime(boxData.life_hour));
    }
}
window.addEventListener('load', () => {
    WDC_box.init('https://s69.wdc.center/?cc=2312&b_code=y5698u48ur3');
})





