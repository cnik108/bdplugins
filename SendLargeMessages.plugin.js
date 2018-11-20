//META{"name":"SendLargeMessages"}*//

class SendLargeMessages {
	initConstructor () {
		this.labels = {};
		
		this.messageDelay = 1000; //changing at own risk, might result in bans or mutes
		
		this.css = `
			.sendlargemessages-modal textarea {
				rows: 0;
				cols: 0;
				height: 100vw;
				resize: none;
			}
			.sendlargemessages-modal #warning-message {
				color: red;
			}
			
			.sendlargemessages-modal #character-counter {
				float: right;
				color: white;
				opacity: .5;
			}`;

		this.sendMessageModalMarkup =
			`<span class="sendlargemessages-modal DevilBro-modal">
				<div class="${BDFDB.disCN.backdrop}"></div>
				<div class="${BDFDB.disCN.modal}">
					<div class="${BDFDB.disCN.modalinner}">
						<div class="${BDFDB.disCNS.modalsub + BDFDB.disCN.modalsizelarge}">
							<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontal + BDFDB.disCNS.horizontal2 + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.modalheader}" style="flex: 0 0 auto;">
								<div class="${BDFDB.disCN.flexchild}" style="flex: 1 1 auto;">
									<h4 class="${BDFDB.disCNS.h4 + BDFDB.disCNS.headertitle + BDFDB.disCNS.size16 + BDFDB.disCNS.height20 + BDFDB.disCNS.weightsemibold + BDFDB.disCNS.defaultcolor + BDFDB.disCNS.h4defaultmargin + BDFDB.disCN.marginreset}">REPLACE_modal_header_text</h4>
									<div class="${BDFDB.disCNS.modalguildname + BDFDB.disCNS.small + BDFDB.disCNS.size12 + BDFDB.disCNS.height16 + BDFDB.disCN.primary}"></div>
								</div>
								<svg class="${BDFDB.disCNS.modalclose + BDFDB.disCN.flexchild}" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 12 12">
									<g fill="none" fill-rule="evenodd">
										<path d="M0 0h12v12H0"></path>
										<path class="fill" fill="currentColor" d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"></path>
									</g>
								</svg>
							</div>
							<div class="${BDFDB.disCNS.scrollerwrap + BDFDB.disCNS.modalcontent + BDFDB.disCNS.scrollerthemed + BDFDB.disCNS.themeghosthairline + BDFDB.disCNS.inputwrapper + BDFDB.disCNS.vertical + BDFDB.disCNS.flex + BDFDB.disCNS.directioncolumn + BDFDB.disCNS.flexchild + BDFDB.disCN.modalsubinner}" style="flex: 1 1 auto;">
								<textarea class="${BDFDB.disCNS.scroller + BDFDB.disCNS.inputdefault + BDFDB.disCN.input}" id="modal-inputtext"></textarea>
							</div>
							<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontal + BDFDB.disCNS.horizontal2 + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.alignstart + BDFDB.disCNS.nowrap + BDFDB.disCNS.modalsubinner + BDFDB.disCN.marginbottom8}" style="flex: 0 0 auto;">
								<h5 id="warning-message" class="${BDFDB.disCNS.flexchild + BDFDB.disCNS.h5 + BDFDB.disCNS.size12 + BDFDB.disCNS.height16 + BDFDB.disCNS.weightbold + BDFDB.disCNS.h5defaultmargin}" style="flex: 1 1 auto;"></h5>
								<h5 id="character-counter" class="${BDFDB.disCNS.flexchild + BDFDB.disCNS.h5 + BDFDB.disCNS.size12 + BDFDB.disCNS.height16 + BDFDB.disCNS.weightmedium + BDFDB.disCNS.h5defaultmargin}" style="flex: 0 0 auto;"></h5>
							</div>
							<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontalreverse + BDFDB.disCNS.horizontalreverse2 + BDFDB.disCNS.directionrowreverse + BDFDB.disCNS.justifystart + BDFDB.disCNS.alignstretch + BDFDB.disCNS.nowrap + BDFDB.disCN.modalfooter}">
								<button type="button" class="btn-send ${BDFDB.disCNS.button + BDFDB.disCNS.buttonlookfilled + BDFDB.disCNS.buttoncolorbrand + BDFDB.disCNS.buttonsizemedium + BDFDB.disCN.buttongrow}">
									<div class="${BDFDB.disCN.buttoncontents}">REPLACE_btn_send_text</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</span>`;
	}

	getName () {return "SendLargeMessages";}

	getDescription () {return "Opens a popout when your message is too large, which allows you to automatically send the message in several smaller messages.";}

	getVersion () {return "1.4.7";}

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
						
			this.bindEventToTextArea();
		}
		else {
			console.error(this.getName() + ": Fatal Error: Could not load BD functions!");
		}
	}


	stop () {
		if (typeof BDFDB === "object") {			
			BDFDB.unloadMessage(this);
		}
	}
	
	onSwitch () {
		if (typeof BDFDB === "object") {
			this.bindEventToTextArea();
		}
	}

	
	// begin of own functions

	changeLanguageStrings () {
		this.sendMessageModalMarkup = 		this.sendMessageModalMarkup.replace("REPLACE_modal_header_text", this.labels.modal_header_text);
		this.sendMessageModalMarkup = 		this.sendMessageModalMarkup.replace("REPLACE_btn_cancel_text", this.labels.btn_cancel_text);
		this.sendMessageModalMarkup = 		this.sendMessageModalMarkup.replace("REPLACE_btn_send_text", this.labels.btn_send_text);
	}
	
	bindEventToTextArea () {
		var checkTextarea = (textarea, text) => {
			if (BDFDB.getParsedLength(text) > 1950) {
				textarea.selectionStart = 0;
				textarea.selectionEnd = textarea.value.length;
				document.execCommand("insertText", false, "");
				this.showSendModal(text);
			}
		};
		$(BDFDB.dotCNS.textareawrapchat + "textarea")
			.off("input." + this.getName())
			.on("input." + this.getName(), e => {
				clearTimeout(e.currentTarget.sendlargemessagestimeout);
				e.currentTarget.sendlargemessagestimeout = setTimeout(() => {checkTextarea(e.currentTarget, e.currentTarget.value);},100);
			})
			.off("paste." + this.getName())
			.on("paste." + this.getName(), e => {
				setImmediate(() => {
					checkTextarea(e.currentTarget, e.currentTarget.value);
				});
			});
	}
	
	showSendModal (text) {
		var sendMessageModal = $(this.sendMessageModalMarkup);
		var textinput = sendMessageModal.find("#modal-inputtext");
		var warning = sendMessageModal.find("#warning-message");
		var counter = sendMessageModal.find("#character-counter");
		
		var updateCounter = () => {
			var parsedlength = BDFDB.getParsedLength(textinput.val());
			var messageAmount = Math.ceil(parsedlength/1900);
			warning.text(messageAmount > 15 ? this.labels.modal_messages_warning : "");
			counter.text(parsedlength + " (" + (textinput[0].selectionEnd - textinput[0].selectionStart) + ") => " + this.labels.modal_messages_translation + ": " + messageAmount);
		};
		
		BDFDB.appendModal(sendMessageModal);
		sendMessageModal
			.on("click", ".btn-send", (e) => {
				e.preventDefault();
				var messages = this.formatText(textinput.val());
				messages.forEach((message,i) => {
					setTimeout(() => {
						this.sendMessage(message);
						if (i == messages.length-1) BDFDB.showToast(this.labels.toast_allsent_text, {type:"success"});
					},this.messageDelay * i);
				});
			});
			
		textinput
			.val(text)
			.focus()
			.off("keydown." + this.getName() + " click." + this.getName())
			.on("keydown." + this.getName() + " click." + this.getName(), () => {
				setTimeout(() => {
					updateCounter();
				},10);
			})
			.off("mousedown." + this.getName())
			.on("mousedown." + this.getName(), () => {
				$(document)
					.off("mouseup." + this.getName())
					.on("mouseup." + this.getName(), () => {
						$(document)
							.off("mouseup." + this.getName())
							.off("mousemove." + this.getName());
					})
					.off("mousemove." + this.getName())
					.on("mousemove." + this.getName(), () => {
						setTimeout(() => {
							updateCounter();
						},10);
					});
			});
		updateCounter();
	}
	
	formatText (text) {
		text = text.replace(new RegExp("\t", 'g'), "	");
		var longwords = text.match(/[\S]{1800,}/gm);
		for (var i in longwords) {
			let longword = longwords[i];
			let count1 = 0;
			let shortwords = [];
			longword.split("").forEach((char) => {
				if (shortwords[count1] && BDFDB.getParsedLength(shortwords[count1]) >= 1800) count1++;
				shortwords[count1] = shortwords[count1] ? shortwords[count1] + char : char;
			});
			text = text.replace(longword, shortwords.join(" "));
		}
		var messages = [];
		var count2 = 0;
		text.split(" ").forEach((word) => {
			if (messages[count2] && BDFDB.getParsedLength(messages[count2] + "" + word) > 1900) count2++;
			messages[count2] = messages[count2] ? messages[count2] + " " + word : word;
		});
		
		var insertCodeBlock = null, insertCodeLine = null;
		for (var j = 0; j < messages.length; j++) {
			if (insertCodeBlock) {
				messages[j] = insertCodeBlock + messages[j];
				insertCodeBlock = null;
			}
			else if (insertCodeLine) {
				messages[j] = insertCodeLine + messages[j];
				insertCodeLine = null;
			}
			
			var codeBlocks = messages[j].match(/`{3,}[\S]*\n|`{3,}/gm);
			var codeLines = messages[j].match(/[^`]{0,1}`{1,2}[^`]|[^`]`{1,2}[^`]{0,1}/gm);
			
			if (codeBlocks && codeBlocks.length % 2 == 1) {
				messages[j] = messages[j] + "```";
				insertCodeBlock = codeBlocks[codeBlocks.length-1] + "\n";
			}
			else if (codeLines && codeLines.length % 2 == 1) {
				insertCodeLine = codeLines[codeLines.length-1].replace(/[^`]/g, "");
				messages[j] = messages[j] + insertCodeLine;
			}
		}
		
		return messages;
	}
	
	sendMessage (text) {
		var textarea = document.querySelector(BDFDB.dotCNS.textareawrapchat + "textarea");
		if (textarea) {
			BDFDB.getOwnerInstance({"node":textarea, "name":"ChannelTextAreaForm", "up":true}).setState({textValue:text});
			BDFDB.triggerSend(textarea);
		}
	}
	
	setLabelsByLanguage () {
		switch (BDFDB.getDiscordLanguage().id) {
			case "hr":		//croatian
				return {
					toast_allsent_text:					"Sve veliku poslane.",
					modal_messages_translation:			"Vijesti",
					modal_messages_warning:				"Nemojte slati previše veliku!",
					modal_header_text:				 	"Pošalji veliku poruku:",
					btn_cancel_text:					"Prekid",
					btn_send_text:						"Poslati"
				};
			case "da":		//danish
				return {
					toast_allsent_text:					"Alle beskeder sendes.",
					modal_messages_translation:			"Beskeder",
					modal_messages_warning:				"Send ikke for mange beskeder!",
					modal_header_text:				 	"Send stor besked:",
					btn_cancel_text:					"Afbryde",
					btn_send_text:						"Sende"
				};
			case "de":		//german
				return {
					toast_allsent_text:					"Alle Nachrichten versendet.",
					modal_messages_translation:			"Nachrichten",
					modal_messages_warning:				"Schicke nicht zu viele Nachrichten!",
					modal_header_text:				 	"Große Nachricht senden:",
					btn_cancel_text:					"Abbrechen",
					btn_send_text:						"Senden"
				};
			case "es":		//spanish
				return {
					toast_allsent_text:					"Todos los mensajes enviados.",
					modal_messages_translation:			"Mensajes",
					modal_messages_warning:				"¡No envíe demasiados mensajes!",
					modal_header_text:				 	"Enviar mensaje grande:",
					btn_cancel_text:					"Cancelar",
					btn_send_text:						"Enviar"
				};
			case "fr":		//french
				return {
					toast_allsent_text:					"Tous les messages envoyés",
					modal_messages_translation:			"Messages",
					modal_messages_warning:				"N'envoyez pas trop de messages!",
					modal_header_text:				 	"Envoyer un gros message:",
					btn_cancel_text:					"Abandonner",
					btn_send_text:						"Envoyer"
				};
			case "it":		//italian
				return {
					toast_allsent_text:					"Tutti i messaggi inviati.",
					modal_messages_translation:			"Messaggi",
					modal_messages_warning:				"Non inviare troppi messaggi!",
					modal_header_text:				 	"Invia grande messaggio:",
					btn_cancel_text:					"Cancellare",
					btn_send_text:						"Inviare"
				};
			case "nl":		//dutch
				return {
					toast_allsent_text:					"Alle berichten verzonden.",
					modal_messages_translation:			"Berichten",
					modal_messages_warning:				"Stuur niet te veel berichten!",
					modal_header_text:				 	"Stuur een groot bericht:",
					btn_cancel_text:					"Afbreken",
					btn_send_text:						"Sturen"
				};
			case "no":		//norwegian
				return {
					toast_allsent_text:					"Alle meldinger sendt.",
					modal_messages_translation:			"Meldinger",
					modal_messages_warning:				"Ikke send for mange meldinger!",
					modal_header_text:				 	"Send stor melding:",
					btn_cancel_text:					"Avbryte",
					btn_send_text:						"Sende"
				};
			case "pl":		//polish
				return {
					toast_allsent_text:					"Wszystkie wiadomości zostały wysłane.",
					modal_messages_translation:			"Wiadomości",
					modal_messages_warning:				"Nie wysyłaj zbyt wielu wiadomości!",
					modal_header_text:					"Wyślij dużą wiadomość:",
					btn_cancel_text:					"Anuluj",
					btn_send_text:						"Wyślij"
				};
			case "pt-BR":	//portuguese (brazil)
				return {
					toast_allsent_text:					"Todas as mensagens enviadas.",
					modal_messages_translation:			"Mensagens",
					modal_messages_warning:				"Não envie muitas mensagens!",
					modal_header_text:				 	"Enviar mensagem grande:",
					btn_cancel_text:					"Cancelar",
					btn_send_text:						"Enviar"
				};
			case "fi":		//finnish
				return {
					toast_allsent_text:					"Kaikki lähetetyt viestit.",
					modal_messages_translation:			"Viestien",
					modal_messages_warning:				"Älä lähetä liian monta viestiä!",
					modal_header_text:				 	"Lähetä suuri viesti:",
					btn_cancel_text:					"Peruuttaa",
					btn_send_text:						"Lähettää"
				};
			case "sv":		//swedish
				return {
					toast_allsent_text:					"Alla meddelanden skickade.",
					modal_messages_translation:			"Meddelanden",
					modal_messages_warning:				"Skicka inte för många meddelanden!",
					modal_header_text:				 	"Skicka stort meddelande:",
					btn_cancel_text:					"Avbryta",
					btn_send_text:						"Skicka"
				};
			case "tr":		//turkish
				return {
					toast_allsent_text:					"Tüm mesajlar gönderildi.",
					modal_messages_translation:			"Mesajları",
					modal_messages_warning:				"Çok fazla mesaj göndermeyin!",
					modal_header_text:				 	"Büyük mesaj gönder:",
					btn_cancel_text:					"Iptal",
					btn_send_text:						"Göndermek"
				};
			case "cs":		//czech
				return {
					toast_allsent_text:					"Všechny zprávy byly odeslány.",
					modal_messages_translation:			"Zpráv",
					modal_messages_warning:				"Neposílejte příliš mnoho zpráv!",
					modal_header_text:				 	"Odeslat velkou zprávu:",
					btn_cancel_text:					"Zrušení",
					btn_send_text:						"Poslat"
				};
			case "bg":		//bulgarian
				return {
					toast_allsent_text:					"Всички изпратени съобщения.",
					modal_messages_translation:			"Съобщения",
					modal_messages_warning:				"Не изпращайте твърде много съобщения!",
					modal_header_text:				 	"Изпратете голямо съобщение:",
					btn_cancel_text:					"Зъбести",
					btn_send_text:						"изпращам"
				};
			case "ru":		//russian
				return {
					toast_allsent_text:					"Все отправленные сообщения.",
					modal_messages_translation:			"Сообщения",
					modal_messages_warning:				"Не отправляйте слишком много сообщений!",
					modal_header_text:				 	"Отправить сообщение:",
					btn_cancel_text:					"Отмена",
					btn_send_text:						"Послать"
				};
			case "uk":		//ukrainian
				return {
					toast_allsent_text:					"Всі повідомлення надіслано.",
					modal_messages_translation:			"Повідомлення",
					modal_messages_warning:				"Не надсилайте надто багато повідомлень!",
					modal_header_text:				 	"Надіслати велике повідомлення:",
					btn_cancel_text:					"Скасувати",
					btn_send_text:						"Відправити"
				};
			case "ja":		//japanese
				return {
					toast_allsent_text:					"すべてのメッセージが送信されました。",
					modal_messages_translation:			"メッセージ",
					modal_messages_warning:				"あまりにも多くのメッセージを送信しないでください！",
					modal_header_text:				 	"大きなメッセージを送信する：",
					btn_cancel_text:					"キャンセル",
					btn_send_text:						"送信"
				};
			case "zh-TW":	//chinese (traditional)
				return {
					toast_allsent_text:					"發送的所有消息。",
					modal_messages_translation:			"消息",
					modal_messages_warning:				"不要發送太多信息！",
					modal_header_text:				 	"發送大信息：",
					btn_cancel_text:					"取消",
					btn_send_text:						"發送"
				};
			case "ko":		//korean
				return {
					toast_allsent_text:					"모든 메시지가 전송되었습니다.",
					modal_messages_translation:			"메시지",
					modal_messages_warning:				"너무 많은 메시지를 보내지 마십시오!",
					modal_header_text:				 	"큰 메시지 보내기:",
					btn_cancel_text:					"취소",
					btn_send_text:						"보내다"
				};
			default:		//default: english
				return {
					toast_allsent_text:					"All messages sent.",
					modal_messages_translation:			"Messages",
					modal_messages_warning:				"Do not send too many messages!",
					modal_header_text:		 			"Send large message:",
					btn_cancel_text:					"Cancel",
					btn_send_text:						"Send"
				};
		}
	}
}
