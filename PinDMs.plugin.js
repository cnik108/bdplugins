//META{"name":"PinDMs"}*//

class PinDMs {
	initConstructor () {
		this.pinDMEntryMarkup =
			`<div class="${BDFDB.disCN.contextmenuitem} pindm-item">
				<span>REPLACE_context_pindm_text</span>
				<div class="${BDFDB.disCN.contextmenuhint}"></div>
			</div>`;
			
		this.unpinDMEntryMarkup =
			`<div class="${BDFDB.disCN.contextmenuitem} unpindm-item">
				<span>REPLACE_context_unpindm_text</span>
				<div class="${BDFDB.disCN.contextmenuhint}"></div>
			</div>`;
			
		this.pinDMsHeaderMarkup =
			`<header class="pinneddms-header">REPLACE_header_pinneddms_text</header>`;
			
		this.pinnedDMMarkup =
			`<div class="${BDFDB.disCN.dmchannel} pinned" style="height: 42px; opacity: 1;">
				<a>
					<div class="${BDFDB.disCNS.avatarwrapper + BDFDB.disCNS.avatarsmall + BDFDB.disCNS.forcedarktheme + BDFDB.disCN.avatarsmallold}">
						<div class="${BDFDB.disCN.avatarsmallold} stop-animation"></div>
						<div class="${BDFDB.disCNS.status + BDFDB.disCNS.statusold + BDFDB.disCN.avatarsmall}"></div>
					</div> 
					<div class="${BDFDB.disCN.dmchannelname}">
						<label style="cursor: pointer;"></label>
						<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontal + BDFDB.disCNS.horizontal2 + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.dmchannelactivity}" style="flex: 1 1 auto;">
							<div class="${BDFDB.disCN.dmchannelactivitytext}"></div>
						</div>
					</div>
					<button class="${BDFDB.disCN.dmchannelclose}"></button>
				</a>
			</div>`;
		
		this.richActivityMarkup = 
			`<svg name="RichActivity" class="${BDFDB.disCN.dmchannelactivityicon}" width="16" height="16" viewBox="0 0 16 16">
				<path class="${BDFDB.disCN.dmchannelactivityiconforeground}" fill="currentColor" d="M6,7 L2,7 L2,6 L6,6 L6,7 Z M8,5 L2,5 L2,4 L8,4 L8,5 Z M8,3 L2,3 L2,2 L8,2 L8,3 Z M8.88888889,0 L1.11111111,0 C0.494444444,0 0,0.494444444 0,1.11111111 L0,8.88888889 C0,9.50253861 0.497461389,10 1.11111111,10 L8.88888889,10 C9.50253861,10 10,9.50253861 10,8.88888889 L10,1.11111111 C10,0.494444444 9.5,0 8.88888889,0 Z" transform="translate(3 3)"></path>
			</svg>`;
	}

	getName () {return "PinDMs";}

	getDescription () {return "Allows you to pin DMs, making them appear at the top of your DM-list.";}

	getVersion () {return "1.1.6";}

	getAuthor () {return "DevilBro";}

	//legacy
	load () {}

	start () {
		var libraryScript = null;
		if (typeof BDFDB !== "object" || typeof BDFDB.isLibraryOutdated !== "function" || BDFDB.isLibraryOutdated()) {
			libraryScript = document.querySelector('head script[src="https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.js"]');
			if (libraryScript) libraryScript.remove();
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.js");
			document.head.appendChild(libraryScript);
		}
		this.startTimeout = setTimeout(() => {this.initialize();}, 30000);
		if (typeof BDFDB === "object" && typeof BDFDB.isLibraryOutdated === "function") this.initialize();
		else libraryScript.addEventListener("load", () => {this.initialize();});
	}

	initialize () {
		if (typeof BDFDB === "object") {
			BDFDB.loadMessage(this);
			
			this.UserStore = BDFDB.WebModules.findByProperties(["getUsers", "getUser"]);
			this.ActivityModule = BDFDB.WebModules.findByProperties(["getApplicationActivity","getStatus"]);
			this.ChannelStore = BDFDB.WebModules.findByProperties(["getDMFromUserId"]);
			this.ChannelSwitchUtils = BDFDB.WebModules.findByProperties(["selectPrivateChannel"]);
			this.PrivateChannelUtils = BDFDB.WebModules.findByProperties(["openPrivateChannel"]);
			this.UserContextMenuUtils = BDFDB.WebModules.findByProperties(["openUserContextMenu"]);
			
			var observer = null;
			
			observer = new MutationObserver((changes, _) => {
				changes.forEach(
					(change, i) => {
						if (change.addedNodes) {
							change.addedNodes.forEach((node) => {
								if (node && node.nodeType == 1 && node.className.includes(BDFDB.disCN.contextmenu)) {
									this.onContextMenu(node);
								}
							});
						}
					}
				);
			});
			BDFDB.addObserver(this, BDFDB.dotCN.appmount, {name:"dmContextObserver",instance:observer}, {childList: true});
			
			observer = new MutationObserver((changes, _) => {
				changes.forEach(
					(change, i) => {
						if (change.addedNodes) {
							change.addedNodes.forEach((node) => {
								if (node && node.tagName && node.querySelector(`a[href="/channels/@me"]`)) {
									$(BDFDB.dotCN.dmchannel + ".pinned, header.pinneddms-header").remove();
									this.addAllPinnedDMs();
								}
							});
						}
					}
				);
			});
			BDFDB.addObserver(this, BDFDB.dotCNS.dmchannels + BDFDB.dotCN.scroller, {name:"friendButtonObserver",instance:observer}, {childList: true});
			
			setTimeout(() => {this.onSwitch();},1000);
		}
		else {
			console.error(this.getName() + ": Fatal Error: Could not load BD functions!");
		}
	}

	stop () {
		if (typeof BDFDB === "object") {
			$(BDFDB.dotCN.dmchannel + ".pinned, header.pinneddms-header").remove();
			
			clearInterval(this.statusInterval);
			
			BDFDB.unloadMessage(this);
		}
	}
	
	onSwitch () {
		if (BDFDB.getSelectedServer()) clearInterval(this.statusInterval);
		if (!document.querySelector(BDFDB.dotCNS.guildselected + BDFDB.dotCN.friendsicon) || document.querySelector(BDFDB.dotCN.dmchannel + ".pinned")) return;
		
		this.addAllPinnedDMs();
		
		BDFDB.addObserver(this, BDFDB.dotCNS.dmchannels + BDFDB.dotCN.scroller, {name:"friendButtonObserver"}, {childList: true});
	}
	
	
	// begin of own functions
	
	changeLanguageStrings () {
		this.pinDMsHeaderMarkup = 	this.pinDMsHeaderMarkup.replace("REPLACE_header_pinneddms_text", this.labels.header_pinneddms_text);
		
		this.pinDMEntryMarkup = 	this.pinDMEntryMarkup.replace("REPLACE_context_pindm_text", this.labels.context_pindm_text);
		
		this.unpinDMEntryMarkup = 	this.unpinDMEntryMarkup.replace("REPLACE_context_unpindm_text", this.labels.context_unpindm_text);
	}
	
	onContextMenu (context) {
		if (!document.querySelector(BDFDB.dotCNS.guildselected + BDFDB.dotCN.friendsicon) || !context || !context.tagName || !context.parentElement || context.querySelector(".pindm-item") || context.querySelector(".unpindm-item")) return;
		var info = BDFDB.getKeyInformation({"node":context, "key":"user"}), ele = null;
		if (info && BDFDB.getKeyInformation({"node":context, "key":"handleClose"})) {
			ele = context.querySelectorAll(BDFDB.dotCN.contextmenuitem)[3];
		}
		else {
			info = BDFDB.getKeyInformation({"node":context, "key":"channel"});
			if (info && BDFDB.getKeyInformation({"node":context, "key":"handleChangeIcon"})) {
				ele = context.querySelectorAll(BDFDB.dotCN.contextmenuitem)[1];
			}
		}
		if (ele) {
			if (BDFDB.loadData(info.id, this, "pinnedDMs") == null) {
				$(this.pinDMEntryMarkup).insertBefore(ele)
					.on("click", (e) => {
						$(context).hide();
						var pinnedDMs = BDFDB.loadAllData(this, "pinnedDMs");
						if (typeof pinnedDMs[info.id] == "undefined") {
							var pos = Object.keys(pinnedDMs).length;
							pinnedDMs[info.id] = pos;
							BDFDB.saveAllData(pinnedDMs, this, "pinnedDMs");
							this.addPinnedDM(info.id, pos); 
						}
					});
			}
			else {
				$(this.unpinDMEntryMarkup).insertBefore(ele)
					.on("click", (e) => {
						$(context).hide();
						$(`${BDFDB.dotCN.dmchannel}.pinned[user-id="${info.id}"]`).remove();
						$(`${BDFDB.dotCN.dmchannel}.pinned[channel-id="${info.id}"]`).remove(); 
						BDFDB.removeData(info.id, this, "pinnedDMs");
						this.updatePinnedDMPositions();
					});
			}
				
			BDFDB.updateContextPosition(context);
		}
	}
	
	addAllPinnedDMs () {
		let pinnedDMs = BDFDB.loadAllData(this, "pinnedDMs");
		let sortedDMs = [];
		delete pinnedDMs[""];
		for (let id in pinnedDMs) this.sortDM(sortedDMs, pinnedDMs[id], id);
		sortedDMs = sortedDMs.filter(n => n);
		for (let pos in sortedDMs) {
			pinnedDMs[sortedDMs[pos]] = parseInt(pos);
			this.addPinnedDM(sortedDMs[pos], pos);
		}
		BDFDB.saveAllData(pinnedDMs, this, "pinnedDMs");
	}
	
	sortDM (sortedDMs, pos, id) {
		if (typeof sortedDMs[pos] == "undefined") sortedDMs[pos] = id;
		else this.sortDM(sortedDMs, pos+1, id);
	}
	
	addPinnedDM (id, pos) {
		if (!document.querySelector(BDFDB.dotCN.dmchannel + " + header.pinneddms-header")) {
			$(this.pinDMsHeaderMarkup).insertBefore(document.querySelector(BDFDB.dotCN.dmchannel + " + header"));
			this.startUpdateInterval();
		}
		let user = this.UserStore.getUser(id);
		let channel = this.ChannelStore.getChannel(id);
		if (user || channel) {
			let pinnedDM = $(this.pinnedDMMarkup);
			pinnedDM.attr("user-id", user ? user.id : null).attr("channel-id", channel ? channel.id : null).insertAfter(BDFDB.dotCN.dmchannel + " + header.pinneddms-header")
				.on("contextmenu." + this.getName(), (e) => {
					if (user) {
						let DMid = this.ChannelStore.getDMFromUserId(user.id)
						if (DMid) {
							this.UserContextMenuUtils.openUserContextMenu(e, user, this.ChannelStore.getChannel(DMid));
						}
						else {
							this.PrivateChannelUtils.ensurePrivateChannel(BDFDB.myData.id, user.id).then(DMid => {
								this.UserContextMenuUtils.openUserContextMenu(e, user, this.ChannelStore.getChannel(DMid));
							});
						}
					}
					else if (channel) {
						var channelObj = BDFDB.getDivOfChannel(channel.id);
						if (channelObj && channelObj.div) BDFDB.getKeyInformation({"node":channelObj.div,"key":"onContextMenu"})(e);
						else BDFDB.showToast("Could not open ContextMenu, make sure the DM exists, Group DMs have to be loaded in the list.", {type:"error"});
					}
				})
				.on("click." + this.getName(), (e) => {
					if (e.target.classList && e.target.classList.contains(BDFDB.disCN.dmchannelclose)) return;
					else if (channel) this.ChannelSwitchUtils.selectPrivateChannel(channel.id);
					else if (user) {
						let DMid = this.ChannelStore.getDMFromUserId(user.id)
						if (DMid) {
							this.ChannelSwitchUtils.selectPrivateChannel(DMid);
						}
						else {
							this.PrivateChannelUtils.openPrivateChannel(BDFDB.myData.id, user.id);
						}
					}
				})
				.on("click." + this.getName(), BDFDB.dotCN.dmchannelclose, () => {
					pinnedDM.remove();
					BDFDB.removeData(user ? user.id : channel.id, this, "pinnedDMs");
					this.updatePinnedDMPositions();
				});
				
			this.setPinnedDM(pinnedDM[0]);
		}
	}
	
	setPinnedDM (pinnedDM) {
		if (pinnedDM && pinnedDM.parentElement) {
			let id = pinnedDM.getAttribute("user-id");
			let user = this.UserStore.getUser(id);
			if (user) {
				let data = BDFDB.loadData(user.id, "EditUsers", "users") || {};
				let activity = this.ActivityModule.getApplicationActivity(id);
				pinnedDM.querySelector(BDFDB.dotCN.avatarsmallold + ":not(" + BDFDB.dotCN.avatarwrapper + ")").style.backgroundImage = `url(${data.removeIcon ? "" : (data.url ? data.url : BDFDB.getUserAvatar(user.id))})`; 
				pinnedDM.querySelector(BDFDB.dotCN.status).classList.add(BDFDB.disCN[`status${BDFDB.getUserStatus(user.id)}`]);
				pinnedDM.querySelector(BDFDB.dotCN.dmchannelname + " > label").textContent = data.name ? data.name : user.username;
				pinnedDM.querySelector(BDFDB.dotCN.dmchannelname).style.color = data.color1 ? BDFDB.color2RGB(data.color1) : "";
				pinnedDM.querySelector(BDFDB.dotCN.dmchannelname).style.background = data.color2 ? BDFDB.color2RGB(data.color2) : "";
				pinnedDM.querySelector(BDFDB.dotCN.dmchannelactivitytext).innerHTML = activity ? this.getActivityString(activity.type, activity.name) : "";
				if (activity && activity.application_id && activity.session_id) {
					if (!pinnedDM.querySelector(BDFDB.dotCN.dmchannelactivityicon)) $(BDFDB.dotCN.dmchannelactivity, pinnedDM).append(this.richActivityMarkup);
				}
				else $(BDFDB.dotCN.dmchannelactivityicon, pinnedDM).remove();
			}
			else {
				id = pinnedDM.getAttribute("channel-id")
				let channel = this.ChannelStore.getChannel(id);
				if (channel) {
					pinnedDM.querySelector(BDFDB.dotCN.avatarsmallold + ":not(" + BDFDB.dotCN.avatarwrapper + ")").style.backgroundImage = `url(${BDFDB.getChannelAvatar(channel.id)})`;
					var channelname = channel.name;
					if (!channelname && channel.recipients.length > 0) {
						for (let dmmemberID of channel.recipients) {
							channelname = channelname ? channelname + ", " : channelname;
							channelname = channelname + this.UserStore.getUser(dmmemberID).username;
						}
					}
					pinnedDM.querySelector(BDFDB.dotCN.dmchannelname + " > label").textContent = channelname ? channelname : BDFDB.LanguageStrings.UNNAMED;
					pinnedDM.querySelectorAll(BDFDB.dotCNC.status + BDFDB.dotCN.dmchannelactivitytext).forEach(ele => {ele.remove();});
					pinnedDM.querySelector(BDFDB.dotCN.dmchannelactivity).innerHTML = channel.recipients.length+1 + " " + (channel.recipients.length+1 == 1 ? BDFDB.LanguageStrings.MEMBER : BDFDB.LanguageStrings.MEMBERS);
				}
			}
		}
	}
	
	updatePinnedDMPositions () {
		let pinnedDMs = BDFDB.loadAllData(this, "pinnedDMs");
		let pinnedDMEles =  Array.from(document.querySelectorAll(BDFDB.dotCN.dmchannel + ".pinned")).reverse();
		for (let i = 0; i < pinnedDMEles.length; i++) {
			pinnedDMs[pinnedDMEles[i].getAttribute("user-id") ? pinnedDMEles[i].getAttribute("user-id") : pinnedDMEles[i].getAttribute("channel-id")] = i;
		}
		if (pinnedDMEles.length == 0) $(BDFDB.dotCN.dmchannel + " + header.pinneddms-header").remove();
		BDFDB.saveAllData(pinnedDMs, this, "pinnedDMs")
	}
	
	startUpdateInterval () {
		clearInterval(this.statusInterval);
		this.statusInterval = setInterval(() => {
			for (let pinnedDM of document.querySelectorAll(BDFDB.dotCN.dmchannel + ".pinned")) this.setPinnedDM(pinnedDM);
			if (!document.querySelector(BDFDB.dotCN.dmchannel + " + header.pinneddms-header")) clearInterval(this.statusInterval); 
		},10000);
	}
	
	getActivityString (type, name) {
		let stringname = "";
		switch (type) {
			case 0:
				stringname = "PLAYING_GAME";
				break;
			case 1:
				stringname = "STREAMING";
				break;
			case 2:
				stringname = "LISTENING_TO";
				break;
			case 3:
				stringname = "WATCHING";
				break;
		}
		
		let string = BDFDB.LanguageStrings[stringname] || "";
		
		return string.replace("**!!{name}!!**", `<strong>${name}</strong>`).replace("**!!{game}!!**", `<strong>${name}</strong>`);
	}
	
	setLabelsByLanguage () {
		switch (BDFDB.getDiscordLanguage().id) {
			case "hr":		//croatian
				return {
					context_pindm_text:				"Prikljucite Izravnu Poruku",
					context_unpindm_text:			"Otključaj Izravnu Poruku",
					header_pinneddms_text:			"Prikvačene Izravne Poruke"
				};
			case "da":		//danish
				return {
					context_pindm_text:				"Fastgør PB",
					context_unpindm_text:			"Frigør PB",
					header_pinneddms_text:			"Pinned Privat Beskeder"
				};
			case "de":		//german
				return {
					context_pindm_text:				"Direktnachricht anheften",
					context_unpindm_text:			"Direktnachricht loslösen",
					header_pinneddms_text:			"Gepinnte Direktnachrichten"
				};
			case "es":		//spanish
				return {
					context_pindm_text:				"Anclar MD",
					context_unpindm_text:			"Desanclar MD",
					header_pinneddms_text:			"Mensajes Directos Fijados"
				};
			case "fr":		//french
				return {
					context_pindm_text:				"Épingler MP",
					context_unpindm_text:			"Désépingler MP",
					header_pinneddms_text:			"Messages Prives Épinglés"
				};
			case "it":		//italian
				return {
					context_pindm_text:				"Fissa il messaggio diretto",
					context_unpindm_text:			"Togli il messaggio diretto",
					header_pinneddms_text:			"Messaggi Diretti Aggiunti"
				};
			case "nl":		//dutch
				return {
					context_pindm_text:				"PB pinnen",
					context_unpindm_text:			"PB losmaken",
					header_pinneddms_text:			"Vastgezette Persoonluke Berichten"
				};
			case "no":		//norwegian
				return {
					context_pindm_text:				"Fest DM",
					context_unpindm_text:			"Løsne DM",
					header_pinneddms_text:			"Pinned Direktemeldinger"
				};
			case "pl":		//polish
				return {
					context_pindm_text:				"Przypnij PW",
					context_unpindm_text:			"Odepnij PW",
					header_pinneddms_text:			"Prywatne Wiadomości Bezpośrednie"
				};
			case "pt-BR":	//portuguese (brazil)
				return {
					context_pindm_text:				"Fixar MD",
					context_unpindm_text:			"Desafixar MD",
					header_pinneddms_text:			"Mensagens diretas fixadas"
				};
			case "fi":		//finnish
				return {
					context_pindm_text:				"Kiinnitä yksityisviestit",
					context_unpindm_text:			"Poista yksityisviestit",
					header_pinneddms_text:			"Liitetyt yksityisviestit"
				};
			case "sv":		//swedish
				return {
					context_pindm_text:				"Fäst DM",
					context_unpindm_text:			"Lossa DM",
					header_pinneddms_text:			"Inlagda Direktmeddelanden"
				};
			case "tr":		//turkish
				return {
					context_pindm_text:				"DM'yi Sabitle",
					context_unpindm_text:			"DM'yi Kaldır",
					header_pinneddms_text:			"Direkt Mesajlar Sabitleyin"
				};
			case "cs":		//czech
				return {
					context_pindm_text:				"Připnout PZ",
					context_unpindm_text:			"Odepnout PZ",
					header_pinneddms_text:			"Připojené Přímá Zpráva"
				};
			case "bg":		//bulgarian
				return {
					context_pindm_text:				"Закачени ДС",
					context_unpindm_text:			"Откачи ДС",
					header_pinneddms_text:			"Свързани директни съобщения"
				};
			case "ru":		//russian
				return {
					context_pindm_text:				"Закрепить ЛС",
					context_unpindm_text:			"Открепить ЛС",
					header_pinneddms_text:			"Прикрепленные Личные Сообщения"
				};
			case "uk":		//ukrainian
				return {
					context_pindm_text:				"Закріпити ОП",
					context_unpindm_text:			"Відкріпити ОП",
					header_pinneddms_text:			"Прикріплені oсобисті повідомлення"
				};
			case "ja":		//japanese
				return {
					context_pindm_text:				"DMピン",
					context_unpindm_text:			"DMをピン止めする",
					header_pinneddms_text:			"固定された直接メッセージ"
				};
			case "zh-TW":	//chinese (traditional)
				return {
					context_pindm_text:				"引腳直接留言",
					context_unpindm_text:			"分離直接消息",
					header_pinneddms_text:			"固定私人信息"
				};
			case "ko":		//korean
				return {
					context_pindm_text:				"비공개 메시지 고정",
					context_unpindm_text:			"비공개 메시지 고정 해제",
					header_pinneddms_text:			"고정 된 비공개 메시지"
				};
			default:		//default: english
				return {
					context_pindm_text:				"Pin DM",
					context_unpindm_text:			"Unpin DM",
					header_pinneddms_text:			"Pinned Direct Messages"
				};
		}
	}
}