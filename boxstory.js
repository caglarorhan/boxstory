const boxStory = {
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
                    leftOfBox = boxStory.vw() - parseInt(boxData.width);
                    break;
                case "left":
                    leftOfBox = 0;
                    break;
                case "bottom":
                    console.log('Bottom geldi')
                    topOfBox = boxStory.vh() - parseInt(boxData.height);
                    leftOfBox = (boxStory.vw() - parseInt(boxData.width)) / 2;
                    break;
            }

            box.style.cssText = `width:${widthOfBox}; height: ${boxData.height}; left:${leftOfBox}px; top:${topOfBox}px; position:${boxData.position}; margin:${boxData.margin}; background-color:${boxData.bgColor}; z-index: ${boxData.z_index} border-radius:${boxData.border_radius}; border: ${boxData.border}; box-shadow:${boxData.box_shadow} ; box-sizing: border-box;`;
            box.id = 'box_' + boxData.content_id;
            box.innerHTML = boxData.content;
            box.append(boxCloseButton);

            box.addEventListener('click',event=>{
                event.stopPropagation();
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
        if(!document.querySelector('#box_' + boxData.content_id)){
            this.createBox(boxData);
        }

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
        if(!Object.values(document.styleSheets).map(rlz=>rlz.rules[0].selectorText).includes("."+animationName + "_" + boxData.content_id)){
            document.head.append(targetCSS);
        }

    },
    init(json_src) {
        let result = fetch(json_src).then(response => response.json()).then(data => {
            data.forEach((jsonData) => {
                let registeredDateTime = window.localStorage.getItem("box_" + jsonData.content_id);
                let expired = true;
                window.localStorage.removeItem("box_" + data.content_id)
                if (registeredDateTime) {
                    expired = new Date().getTime() - parseInt(registeredDateTime) > 0
                }
                if (jsonData.show && expired) {
                    boxStory.createBox(jsonData);
                    this.action(jsonData)
                } else {
                    return false;
                }
            })

        })
    },
    action(boxData){
        console.log('action giris')
        Object.keys(boxData.scenarios).forEach(scenarioName=>{
            let scenario = boxData.scenarios[scenarioName];
            const triggerElement = (scenario.event_source!=="window")?document.querySelector(scenario.event_source + boxData.content_id):document;

                    scenario.animations.forEach((animationData, animIndex) => {
                        this.createAnimation(boxData, animationData.animation_name); //CSS animasyonlari olusturulup style icine gomuldu
                        console.log('--->'+scenario.event_source +':'+ scenario.event);
                        if(scenario.event_source==="window" && scenario.event==='load'){ // window.load ise dogrudan class ekle (CSS animasyon olusmustu zaten)
                            console.log('evet')
                            document.querySelector("#box_" + boxData.content_id).style.display='';
                            document.querySelector("#box_" + boxData.content_id).classList.add(animationData.animation_name + "_" + boxData.content_id);
                        }
                        // animation applicator
                        function animApplicator(){
                            document.querySelector("#box_" + boxData.content_id).classList.remove(animationData.animation_name + "_" + boxData.content_id);
                            if (animationData.repetitive === "true" || animationData.repetitive) {
                                window.requestAnimationFrame(function (time) {
                                    window.requestAnimationFrame(function (time) {
                                        if(boxData.backdrop || boxData.backdrop ==='true'){
                                            document.querySelector('#backdrop_' + boxData.content_id).style.display='block';
                                        }
                                        document.querySelector('#box_' + boxData.content_id).style.display='block';
                                        document.querySelector("#box_" + boxData.content_id).classList.add(animationData.animation_name + "_" + boxData.content_id);
                                    });
                                });
                            } else {
                                document.querySelector('#box_' + boxData.content_id).style.display='block';
                                document.querySelector("#box_" + boxData.content_id).classList.add(animationData.animation_name + "_" + boxData.content_id);
                            }
                        }
                        //repetative degerine gore tek sefer implemente edilecek veya requestAnimationFrame kullanilacak
                        triggerElement.addEventListener(scenario.event,animApplicator)

                        document.querySelector("#box_" + boxData.content_id).addEventListener('animationend', () => {
                            console.log('animasyon bitti');
                            if (boxData.animations[animationData.animation_name].remove_after==="true" || boxData.animations[animationData.animation_name].remove_after===true) {
                                this.removeBox(boxData)
                                console.log('sadece animasyon bitti')

                            }
                                if(animIndex===scenario.animations.length-1){
                                    //senaryonun son animasyonu ve bu animasyon repetetive degilse eventlistener iptal edilecek
                                    triggerElement.removeEventListener(scenario.event, animApplicator, {passive:false});
                                    //*******************************************************************************************
                                }
                        }
                        );
                    })
            //exceptions (for event bubbling)
            scenario.except.forEach(itemIdPrefix=>{
                console.log(itemIdPrefix +'_' + boxData.content_id);
                document.querySelector(itemIdPrefix +'_' + boxData.content_id).addEventListener(scenario.event,(event)=>{
                    event.stopPropagation();
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
        window.localStorage.setItem('box_' + boxData.content_id, boxStory.expDateTime(boxData.life_hour));
    }
}
