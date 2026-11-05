function extractMessages() {
    const messages = document.querySelectorAll('[data-chatgpt-selection-message-id]');

    console.log("Messages found:", messages.length);
    const message = messages[0];

    var children = message.querySelector('[data-markdown-text-style]').children;

    const entry = []
    for (var i = 0; i < children.length; i++) {
    console.dir(children[i])
        entry.push({
            type: children[i].nodeName,
            content: children[i].innerText
        })
    };

    const messageData = {
        role: "assistant",
        blocks: entry
    }
    const json = JSON.stringify(messageData, null, 2);

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
        json = extractMessages();
        saveFile(json)

    }
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});