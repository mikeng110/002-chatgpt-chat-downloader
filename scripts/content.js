//todo 
//Identify what data-turn have already been handled 
//skip if 
//

    //   //  console.log(children[i].outerHTML);
    //    // console.log(children[i].querySelector("pre code")?.textContent);
function extractMessages() {
    //desire to include prompt then response 


    //assume always one prompt, and one response 
    const turns = document.querySelectorAll('[data-turn-key]');

    const turnsData = []

    for (let turn of turns) {
        console.dir(turn)
        const  user_message = turn.querySelector('[data-user-message-bubble]')
        const ai__message =  turn.querySelector('[data-chatgpt-selection-message-id]');

        const entry = []

        var children = ai__message.children

        for (var i = 0; i < children.length; i++) {
             entry.push({
                type: children[i].nodeName,  
                content: children[i].innerText
            })
        }

        const messageData = {
            thread: turn.baseURI,
            turn: turn.dataset.turnKey, 
            user_message: user_message.innerText,
            ai_blocks: entry,
            raw: turn.innerHTML
        }

        turnsData.push(messageData)
    }

    const json = JSON.stringify(turnsData, null, 2);

    return json
}

function saveFile(json){
    const blob = new Blob([json], {
    type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "conversation.json";

    link.click();

    URL.revokeObjectURL(url);

}

const observer = new MutationObserver(function() {
    const messages = document.querySelectorAll(
        '[data-chatgpt-selection-message-id]'
    );

    if (messages.length > 0) {
        console.log("Messages have appeared!");
        observer.disconnect();
        const json = extractMessages();
        saveFile(json)

    }
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});