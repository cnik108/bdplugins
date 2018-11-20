//META{"name":"channelHistory"}*//

var channelHistory = (function(listener, bw, wc, backdrop, buttons, buttonsClone, buttonsForward, buttonsBackward, attach, attachClone, css){
  class channelHistory {
    getName(){ return "Channel History" }
    getDescription(){ return "Allows you to switch channels using mouse 4 & 5 or the added GUI buttons." }
    getVersion(){ return "1.2.4" }
    getAuthor(){ return "square" }

    start(){
      bw = require("electron").remote.getCurrentWindow();
      wc = bw.webContents;
      bw.on("app-command", listener);
      BdApi.injectCSS("css-channelHistory", css);
      attach();
      this.onSwitch();
    }

    stop(){
      bw.removeListener("app-command", listener);
      buttons.remove();
      buttonsClone.remove();
      BdApi.clearCSS("css-channelHistory");
    }

    load(){}

    onSwitch(can){
      attachClone();
      can = wc.canGoBack();
      buttonsBackward.forEach(button => button.classList.toggle("cant", !can));
      can = wc.canGoForward();
      buttonsForward.forEach(button => button.classList.toggle("cant", !can));
    }
  }

  listener = (ev, cmd) => {
    if (cmd !== 'browser-backward' && cmd !== 'browser-forward')
      return;
    if (backdrop = document.querySelector(".backdrop-1ocfXc"))
      backdrop.click();
    else if (cmd === 'browser-backward' && wc.canGoBack())
      wc.goBack();
    else if (cmd === 'browser-forward' && wc.canGoForward())
      wc.goForward();
    backdrop = void 0;
  };

  buttons = document.createElement("div");
  buttons.className = "channelHistoryButtons";
  buttons.innerHTML = `<div class="btn back">&lt;</div><div class="btn forward">&gt;</div>`;

  buttonsClone = buttons.cloneNode(true);
  buttonsClone.classList.add("clone");

  buttonsBackward = [buttons.firstChild, buttonsClone.firstChild]
  buttonsForward = [buttons.lastChild, buttonsClone.lastChild]

  buttonsBackward.forEach(button => button.onclick = () => listener(null, "browser-backward"));
  buttonsForward.forEach(button => button.onclick = () => listener(null, "browser-forward"));

  attach = (branding, titlebar) => {
    try {
      if (branding = document.querySelector(".wordmark-2iDDfm")) {
        branding.parentElement.insertBefore(buttons, branding.nextElementSibling);
      } else {
        // osx is *special*
        titlebar = document.querySelector(".titleBar-AC4pGV");
        titlebar.insertBefore(buttons, titlebar.firstChild);
      }
    } catch (err) { console.warn(err); }
  }

  attachClone = (channelName, after) => {
    try {
      channelName = document.querySelector(".channelName-3stJzi:not(.private-26pLvW)") || (after = document.querySelector(".searchBar-2_Yu-C .searchBarInner-1_Tg2R"));
      channelName.parentElement.insertBefore(buttonsClone, after ? null : channelName);
    } catch (err) { console.warn(err); }
  }

  css = `
    .channelHistoryButtons {
      color: #999;
      font-weight: bold;
      position: absolute;
      left: 71px;
    }
    .channelHistoryButtons.clone {
      display: none;
      flex: 0 0 28px;
      position: relative;
      left: unset;
      order: 0;
    }
    .hidden-by-OTB + * .channelHistoryButtons.clone {
      display: inline-block;
    }
    .channelHistoryButtons .btn {
      display: inline-block;
      pointer-events: all;
      -webkit-app-region: no-drag;
      cursor: pointer;
      padding: 0 2px;
    }
    .channelHistoryButtons .btn:hover:not(.cant) {
      color: #ddd;
    }
    .channelHistoryButtons .cant {
      opacity: 0.5;
    }
  `;

  return channelHistory;
})()
