
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
                    leftOfBox = boxStory.vw() - parseInt(boxData.width);
                    break;
                case "left":
                    leftOfBox = 0;
                    break;
                case "bottom":
                    topOfBox = boxStory.vh() - parseInt(boxData.height);
                    leftOfBox = (boxStory.vw() - parseInt(boxData.width)) / 2;
                    break;
            }


            box.style.cssText = `width:${widthOfBox}; height: ${boxData.height}; left:${leftOfBox}px; top:${topOfBox}px; position:${boxData.position}; margin:${boxData.margin}; background-color:${boxData.bgColor}; z-index: ${boxData.z_index} border-radius:${boxData.border_radius}; border: ${boxData.border}; box-shadow:${boxData.box_shadow} ; box-sizing: border-box;`;
            box.id = 'box_' + boxData.content_id;
            box.innerHTML = boxData.content;
            box.append(boxCloseButton);

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

            if(scenario.event_source==="window" && scenario.event_source==='load'){
                this.createAnimation(boxData, animationData.animation_name);
            }else{
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
            }

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
        window.localStorage.setItem('box_' + boxData.content_id, boxStory.expDateTime(boxData.life_hour));
    }
}






