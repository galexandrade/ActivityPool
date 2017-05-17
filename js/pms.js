var pmswidget = SuperWidget.extend({
	application: "services_portal_wdgt_pms",
	context: "/services-portal-wdgt-pms",
	loading: null,
	instanceId: null,
	window: null,
	divId: "window-controls",
	init: function() {

		pmswidget.loading = FLUIGC.loading(window);

		$("#visualizacaoPagina").children().first().hide();

		schedulerviewweek.hide();
		schedulerviewmonth.hide();
		schedulerviewmobile.hide();

		if (pmswidget.mobilecheck()) {
			$(".views-options, .hideonmobile").hide();
			$('.tecnico-incluiros,.tecnico-incluiros .btn-toolbar,.tecnico-incluiros .btn-toolbar .btn-group,.tecnico-incluiros .btn-group,.outro-podeincluir,.outro-podeincluir .btn-toolbar,.outro-podeincluir .btn-toolbar .btn-group,.nav-options-date,.nav-options-date .btn-toolbar,.nav-options-date .btn-toolbar .btn-group,.footer-btns').css({'width':'100%'});
			$('.tecnico-incluiros .btn-group .btn').css({'width':'25%'});
			$('.outro-podeincluir .btn-group .btn,.nav-options-date .btn-group .btn').css({'width':'50%'});
			$('.footer-btns .btn-group .btn').css({'width':'100%', 'margin-top': '5px', 'border-radius': '4px'});
			this.viewmobile();
		} else {
			this.viewMonth();
		}

		technicalinfo.getInfo();

	},
	bindings: {
		local: {
			'btn-back-schedule': ['click_hidden'],
			'btn-copy': ['click_copy'],
			'btn-fake': ['click_fake'],
			'btn-next-schedule': ['click_next'],
			'btn-no-click': ['click_stopClick'],
			'btn-previous-schedule': ['click_previous'],
			'btn-save-schedule': ['click_saveSchedule'],
			'btn-view-search-technical': ['click_viewSearchTechnical'],
			'btn-search-technical': ['click_searchTechnical'],
			'btn-schedule-click': ['click_clickSchedule'],
			'btn-show-detail': ['click_showDetail'],
			'btn-view-week': ['click_viewWeek'],
			'btn-view-month': ['click_viewMonth'],
			'btn-zoom-customer': ['click_zoomCustomer'],
			'select-change-customer': ['change_changeCustomer'],
			'select-change-project': ['change_changeProject'],
			'select-change-front': ['change_changeFront'],
			'btn-schedule-overlap': ['click_scheduleOverlap'],
			'btn-schedule-remove': ['click_removeSchedule'],
			'btn-search-customer': ['click_searchCustomer'],
			'btn-search-technical-name': ['click_searchtechnicalname'],
			'btn-open-search-technical-name': ['click_opensearchtechnicalname']
		},
		global: {
			'btn-click-day': ['click_clickDay'],
			'btn-add-customer': ['click_addCustomer'],
			'btn-select-technical': ['click_selectedtechnical'],
			'btn-os-add': ['click_orderServicesAdd'],
			'btn-remove-copy': ['click_removeCopy'],
			'btn-save-copy': ['click_saveCopy'],
			'btn-scheduler-add': ['click_schedulerAdd'],
			'btn-search-technical-name': ['click_searchtechnicalname'],
			'btn-open-search-technical-name': ['click_opensearchtechnicalname'],
			'btn-scheduler-modify': ['click_scheduleModify'],
			'btn-schedule-overlap': ['click_scheduleOverlap'],
			'btn-schedule-remove': ['click_removeSchedule'],
			'btn-search-customer': ['click_searchCustomer'],
			'btn-view-abilities': ['click_viewAbilites'],
			'btn-prev-abilities': ['click_prevAbilities'],
			'btn-next-abilities': ['click_nextAbilities'],
			'btn-go-to-abilities': ['click_gotoAbilities'],
			'btn-technical-selected': ['click_setTechnical'],
			'btn-save-os': ['click_saveOs'],
			'btn-clean-team': ['click_cleanTeam'],
			'btn-show-team': ['click_showTeam'],
			'btn-click-os-remove': ['click_showRemoveOs'],
			'btn-click-rda-close': ['click_showRdaClose'],
			'btn-click-printer': ['click_showPrinter'],
			'btn-printer': ['click_printer'],
			'btn-rda-close': ['click_rdaClose'],
			'btn-remove-os': ['click_removeOs'],
			'btn-save-expenses': ['click_saveExpenses'],
			'btn-show-task': ['click_showTaskDetail'],
			'blur-hour-pms': ['blur_calculateHourPms'],
			'btn-close-modal-option': ['click_closemodaloption'],
			'change-print': ['change_changePrint'],
			'time-pms-blur': ['blur_calcHours'],
			'btn-prev-step': ['click_prevstep'],
			'btn-next-step': ['click_nextstep'],
			'link-step': ['click_linkstep'],
			'change-local': ['change_changelocal'],
			'add-task-appointment': ['click_addtask'],
			'remove-task-appointment': ['click_removetask'],
			'btn-add-km': ['click_addkm'],
			'btn-remove-km': ['click_removekm'],
			'change-os-internal': ['change_changeosinternal']

		}
	},
	addkm: function(el, ev) {
		var c = $("#cliente-os").val();
		var cliente = c.split("-")[0];
		var loja = c.split("-")[1];
		console.log('changelocal', cliente, loja);
		zoomcustomer.km(cliente, loja, $("#local-atendimento-os").val(), $("#projeto-os").val(), $("#projeto-frente-os").val(), $("#data-os").val());
		$("#btn-add-km").hide();
		$("#btn-remove-km").show();
	},
	removekm: function(el, ev) {
		$("input[data-code='" + expenses.getkmcode() + "']").val("0,00");
		$("#btn-add-km").show();
		$("#btn-remove-km").hide();
		timeevents.sumexpenses();
	},
	mobilecheck: function() {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	},
	addtask: function(el, ev) {
		console.log("addtask", el, ev);

		$(".alert-apontamento").hide();

		var start = $(el).closest("tr").find(".time-pms-begin").val();
		var finish = $(el).closest("tr").find(".time-pms-end").val();
		var total = $(el).closest("tr").find(".time-pms-total").val();
		var perc = $(el).closest("tr").find(".percentual-pms").val();
		var notes = $(el).closest("tr").find(".notes-pms").val();

		if (start == "" || finish == "") {
			WCMC.messageError("Informe um horário de inicio e fim da tarefa");
			return false;
		}

		if (perc == "") { perc = "0"; }

		var id = orderservicesaddsave.addtask($(el).data("project"), $(el).data("task"), $(el).data("desc"), start, finish, total, notes, perc);
		if (id != null) {
			var html = "<tr><td>" + $(el).data("task") + "</td>" +
				"<td>" + $(el).data("desc") + "</td>" +
				"<td class='center'><input type='text' class='form-control inline input-hours-pms' value='" + start + "' readonly ></td>" +
				"<td class='center'><input type='text' class='form-control inline input-hours-pms' value='" + finish + "' readonly></td>" +
				"<td class='center'><input type='text' class='form-control inline input-hours-pms' value='" + total + "' readonly></td>" +
//				"<td class='center'><input type='text' class='form-control inline input-hours-pms' value='" + perc + "' readonly></td>" +
				"<td class='center'><input type='text' class='form-control inline' value='" + notes + "' readonly></td>";

			var s = eschedule.get();
			if (s == null || s.acao == "I") {
				html += "<td class='center'><button type='button' class='btn btn-danger btn-remove-task' data-remove-task-appointment data-id=" + id + " data-task='" + $(el).data("task") + "' data-project='" + $(el).data("project") + "'><span class='fluigicon fluigicon-remove'></span></button></td></tr>";
			} if (s.status != "3") {
				html += "<td class='center'><button type='button' class='btn btn-danger btn-remove-task' data-remove-task-appointment data-id=" + id + " data-task='" + $(el).data("task") + "' data-project='" + $(el).data("project") + "'><span class='fluigicon fluigicon-remove'></span></button></td></tr>";
			} else {
				html += "<td></td></tr>";
			}

			$("#tabelaapontamentos > tbody:last").append(html);

			var current = etasksproject.bytask($(el).data("project"), $(el).data("task"));
			if (current.traslado) {
				timeevents.calctraslado();
			}
			timeevents.calchourstartend();

			$(el).closest("tr").find(".time-pms-begin").val("");
			$(el).closest("tr").find(".time-pms-end").val("");
			$(el).closest("tr").find(".time-pms-total").val("");
	//		$(el).closest("tr").find(".percentual-pms").val("");
			$(el).closest("tr").find(".notes-pms").val("");

		}
	},
	removetask: function(el, ev) {
		$(el).closest("tr").remove();
		orderservicesaddsave.removetask($(el).data("id"));

		var current = etasksproject.bytask($(el).data("project"), $(el).data("task"));
		if (current.traslado) {
			timeevents.calctraslado();
		}
		timeevents.calchourstartend();
		if ($("#tabelaapontamentos > tbody > tr").length == 0) {
			$(".alert-apontamento").show();
		}

	},
	changeosinternal: function(el, ev) {
		console.log("internal");

		if ($(el).is(":checked")) {
    		$("#formMaintenanceOrderServices").children("div").each(function(){
				console.log("interna", this, $(this).data("internal"));
    			if ($(this).data("internal") == true) { $(this).hide(); }
    		});
    		$(".show-interna").hide();
			$('#hora-inicio-os').prop("disabled", false);
			$('#hora-fim-os').prop("disabled", false);
			$('#hora-traslado-os').prop("disabled", false);
			$('#hora-outros-os').prop("disabled", false);
			$('#hora-inicio-os').prop("readonly", false);
			$('#hora-fim-os').prop("readonly", false);
			$('#hora-traslado-os').prop("readonly", false);
			$('#hora-outros-os').prop("readonly", false);
			ereason.populate(null, "motivo-os", $(el).is(":checked"));

		} else {
			console.log("not interna");
    		$("#formMaintenanceOrderServices").children("div").each(function(){
    			if ($(this).data("internal") == true) { $(this).show(); }
    		});
    		$(".show-interna").show();
			$('#hora-inicio-os').prop("disabled", true);
			$('#hora-fim-os').prop("disabled", true);
			$('#hora-traslado-os').prop("disabled", true);
			$('#hora-outros-os').prop("disabled", true);
			$('#hora-inicio-os').prop("readonly", true);
			$('#hora-fim-os').prop("readonly", true);
			$('#hora-traslado-os').prop("readonly", true);
			$('#hora-outros-os').prop("readonly", true);

			var s = eschedule.get();
			if (s != null) {
				ereason.populate(s.motivocfp, "motivo-os", $(el).is(":checked"));
			} else {
				pmswidget.changeFront($("#projeto-frente-os"));
			}
		}


	},
	changelocal: function(el, ev) {
		var c = $("#cliente-os").val();
		var cliente = c.split("-")[0];
		var loja = c.split("-")[1];
		console.log('changelocal', cliente, loja);
		zoomcustomer.km(cliente, loja, $("#local-atendimento-os").val(), $("#projeto-os").val(), $("#projeto-frente-os").val(), $("#data-os").val());
	},
	prevstep: function(el, ev) {
		var prev = $(el).data("prev");
		$('.nav-tabs a[href="#' + prev + '"]').tab('show');

	},
	linkstep: function(el, ev) {
		ev.preventDefault()
		pmswidget.nextstep(el, ev)
	},
	nextstep: function(el, ev) {
		var next = $(el).data("next");
		$('.nav-tabs a[href="#' + next + '"]').tab('show');

		console.log("next", next, $("#lista-produtos").val(), $("#lista-segmentos").val(), $("#lista-bloco").val(), $("#lista-modulos").val());
		if (next == "step2") {
			if ($("#lista-produtos").val() == "" || $("#lista-produtos").val() == null) {
    			WCMC.messageError("Selecione ao menos um produto");
    			$('.nav-tabs a[href="#step1"]').tab('show');
    			return;
			}
			searchtechnical.segments();
		} else if (next == "step3") {
			if ($("#lista-segmentos").val() == "" || $("#lista-segmentos").val() == null) {
    			WCMC.messageError("Selecione ao menos um segmento");
    			$('.nav-tabs a[href="#step2"]').tab('show');
    			return;
			}
			searchtechnical.groups();
		} else if (next == "step4") {
			if ($("#lista-bloco").val() == "" || $("#lista-bloco").val() == null) {
    			WCMC.messageError("Selecione ao menos um bloco");
    			$('.nav-tabs a[href="#step3"]').tab('show');
    			return;
			}
			searchtechnical.modules();
		} else if (next == "step5") {
			if ($("#lista-modulos").val() == "" || $("#lista-modulos").val() == null) {
    			WCMC.messageError("Selecione ao menos um módulo");
    			$('.nav-tabs a[href="#step4"]').tab('show');
    			return;
			}
			searchtechnical.knowledge();
		}

	},
	closemodaloption: function(el, ev) {
		if ($("#schedule-option-modal").length > 0) { $("#schedule-option-modal").modal('hide'); }
	},
	stopClick: function(el, ev) {
		if (ev.stopPropagation) {
			ev.stopPropagation();
			ev.preventDefault();
		}
	},
	copy: function(el, ev) {
		this.stopClick(el, ev);
		var btn = el;
		if ($(el).get(0).tagName == "SPAN") { btn = $(el).parent(); }
		var c = orderservicesaddsave;
		if ($(btn).data("source") == "scheduler") { c = scheduleraddsave; }
		orderservicescopy.open(c);
	},
	saveCopy: function(el, ev) {
	//	if ($("#modalCopyOs").length > 0) { $("#modalCopyOs").modal('hide'); }
		orderservicescopy.save();
	},
	removeCopy: function(el, ev) {
//		if ($("#modalCopyOs").length > 0) { $("#modalCopyOs").modal('hide'); }
		orderservicescopy.remove();
	},
	previous: function(el, ev) { scheduler.prev(); },
	next: function(el, ev) { scheduler.next(); },
	showPrinter: function(el, ev) { this.display(printer); },
	printer: function(el, ev) { printer.print() },
	showRdaClose: function(el, ev) { this.display(rdaclose); },
	viewSearchTechnical: function(el, ev) { this.display(searchtechnical); },
	prevAbilities: function(el, ev) { abilities.prev(); },
	nextAbilities: function(el, ev) { abilities.next(); },
	gotoAbilities: function(el, ev) { abilities.gotopage($(el).data("page")); },
	cleanTeam: function(el, ev) { $("#lista-tecnicos").val(""); },
	rdaClose: function(el, ev) { rdaclose.close(); },
	searchTechnical: function(el, ev) {
		var type = $(el).data("type");
		console.log('searchTechnical', type);
		searchtechnical.search(type);
	},
	orderServicesAdd: function(el, ev) {
		if ($("#schedule-option-modal").length > 0) { $("#schedule-option-modal").modal('hide'); }
		var s = eschedule.get();
		//console.log("orderServicesAdd", s)
		if ($(el).data("type") == "new") {
			s = eschedule.init();
			eschedule.set(s);
		}

		console.log("orderServicesAdd", s)

		orderservicesadd.current(s);
		this.display(orderservicesadd);
	},
	schedulerAdd: function(el ,ev) {
		var s = eschedule.init();
		s.data = scheduleevents.dateclicked(el);
		s.horainicio = scheduleevents.hourclicked(el);
		s.dataagenda = schedulerdate.format(s.data);
		s.place = $(el).data("place");
		eschedule.set(s);
		//console.log("scheduleradd", s);
		scheduleradd.show(el, s);
	},
	scheduleModify: function(el ,ev) {
		if ($("#schedule-option-modal").length > 0) { $("#schedule-option-modal").modal('hide'); }
		var s = eschedule.get();
		console.log("schedulemodify", s);
		scheduleradd.show($("#" + s.id), s);
	},
	showDetail: function(el, ev) {
		this.stopClick(el, ev);
		//console.log('showDetail');
		$(el).hide();
		$("#scheduler-add").children("form").children("div").each(function(){
			if ($(this).data("only-detail") === true) { $(this).show(); }
		});
	},
	viewWeek: function() {
		scheduler.hide();
		scheduler.view(schedulerviewweek);
		scheduler.show();
	},
	viewMonth: function() {
		scheduler.hide();
		scheduler.view(schedulerviewmonth);
		scheduler.show();
	},
	viewmobile: function() {
		scheduler.hide();
		scheduler.view(schedulerviewmobile);
		scheduler.show();
	},
	display: function(w) {
		console.log('hidden:', w, w.divId(), w.get());
		pmswidget.window = w.divId();
		scheduler.hidden();
		w.show(w.get());
	},
	hidden: function() {
		//console.log('hidden:' + pmswidget.window)
		$("#" + pmswidget.window).fadeOut();
		scheduler.display();
	},
	windows: function() {
		return pmswidget.window;
	},
	zoomCustomer: function(el, ev) {
		//console.log(ev, el)
		var btn = el;
		if ($(el).get(0).tagName == "SPAN") { btn = $(el).parent(); }
		this.stopClick(el, ev);
		var r = $(btn).data("return-field");
		zoomcustomer.open(r);
	},
	addCustomer: function() {
		//console.log("click add");
		zoomcustomer.add();
	},
	selectedtechnical: function() {
		//console.log("click add");
		zoomtechnical.add();
	},
	clickDay: function(el, ev) {
		this.stopClick(el, ev);
		//console.log("click", eaccess.get("podeincluir"))
		if (eaccess.get("podeincluir")) {
			var p = el;
			if ($(el).get(0).tagName != "DIV") { p = $(el).find(".scheduler-day-month"); }

			var s = eschedule.init();
			s.data = scheduleevents.dateclicked(p);
			s.horainicio = scheduleevents.hourclicked(p);
			s.dataagenda = schedulerdate.format(s.data);
			s.place = $(el).data("place");

			//console.log("code", $(el).data("code"), p);
			if ($(el).data("code") != undefined) {
				s.tecnico = $(el).data("code");
			}

			eschedule.set(s);

			console.log(p, s)

			scheduleradd.show(p, s);
		}
	},
	setTechnical: function(el, ev) {
		//console.log("sete", $("#selecionar-tecnico").val(), $("#selecionar-tecnico").text())
		technicalinfo.set($("#selecionar-tecnico").val(), $("#selecionar-tecnico").text());
		$("#modal-technical").modal('hide');
	},
	changeCustomer: function(el, ev) {
		var fieldproject = $(el).data("project");
		var fieldplace = $(el).data("place");
		var key = $(el).data("key");
		//console.log("key", key);
		if (key !== undefined) {
			var val = $("#"+ key).val();
			var customer = val.split("-")[0];

			console.log("changeCustomer", customer);


			if (customer != "") {
				var store = val.split("-")[1];

				console.log("changeCustomer", customer, store, fieldproject);

				projects.get(customer, store, fieldproject);
				if (fieldplace !== undefined) { place.get(customer, store, fieldplace); }
			}
		}

	},
	changeProject: function(el, ev) {
		var project = $(el).val();
		var fieldfront = $(el).data("frente");
		var customer = $(el).data("cliente");

		var v = $("#" + customer).val();
		if (v != "") {
			var c = v.split("-")[0];
			var p = eprojects.bycode(c, project);
			front.get(project, fieldfront);
		}

	},
	changeFront: function(el, ev) {
		var front = $(el).val();
		var fieldproduct = $(el).data("produto");
		var projeto = $(el).data("project");
		var fieldreason = $(el).data("motivo");

		console.log('changeFront', front, fieldproduct, projeto);

		if (fieldproduct != undefined) {
			var v = $("#" + projeto).val();
			if (v != "" && front != "" & front != null) {
				productfront.get(v, front, fieldproduct);
				var  f = efront.bycode(v, front);

				console.log("reason", f, fieldreason)
				if (f != null) {
					ereason.populate(f.motivo, fieldreason, false)
				} else {
					ereason.populate(null, fieldreason, false)
				}
				var s = eschedule.get();
				if (s.acao  == "M") {
					$("#" + fieldreason).val(s.motivocfp)
				}

			}
		}
	},
	saveSchedule: function(el, ev) { scheduleraddsave.save(false); },

	clickSchedule: function(el, ev) {
		this.stopClick(el, ev);
		var id = $(el).data("id");
		var s = eschedule.byid(id);
		console.log('click schedule', s);
		eschedule.set(s);

		if ((s.incluiros && s.podealterar) || (s.alteraros && s.podealterar)) {
			scheduleroptions.show();
		} else if (s.status == "3") {
			scheduleroptions.confirm();
		} else if (s.podealterar) {
			scheduleradd.show(el, s);
		} else {
			orderservicesadd.current(s);
			this.display(orderservicesadd);
		}
	},
	scheduleOverlap: function(el, ev) {
		if ($("#schedule-overlap-modal").length > 0) { $("#schedule-overlap-modal").modal('hide'); }
		scheduleraddsave.save(true);
	},
	removeSchedule: function(el, ev) {
		if ($("#schedule-remove-modal").length > 0) { $("#schedule-remove-modal").modal('hide'); }

		var confirm = $(el).data("confirm");
		if ($(el).parent().parent().parent().parent()) {
			if ($(el).parent().parent().parent().parent().attr("id") == "schedule-option-modal") { confirm = true; }
		}

		if (confirm) { scheduleremove.show(); }
		else {
			if ($("#schedule-option-modal").length > 0) { $("#schedule-option-modal").modal('hide'); }
			scheduleremove.remove();
		}
	},
	searchCustomer: function(el, ev) {
		this.stopClick(el, ev);
		zoomcustomer.search();
	},
	opensearchtechnicalname: function(el, ev) {
		console.log('open searchtechnicalname', el, ev)
		this.stopClick(el, ev);
		zoomtechnical.open($(el).data("return-field"));
	},
	searchtechnicalname: function(el, ev) {
		console.log('searchtechnicalname', el, ev)
		this.stopClick(el, ev);
		zoomtechnical.search();
	},
	viewAbilites: function(el, ev) {
		var technical = $(el).data("id");
		abilities.show(technical);
	},
	showTeam: function(el, ev) {
		var team = eteam.byteam();
		var list = "";
		for (var i=0;i<team.length;i++) {
			list += (list == "") ? l[i] : "," + l[i];
		}
		$("#lista-tecnicos").val(list);
	},
	saveOs: function(el, ev) {
		orderservicesaddsave.save();
	},
	showRemoveOs: function(el, ev) {this.display(orderservicesremove); },
	removeOs: function(el, ev) {
		if ($("#schedule-option-modal").length > 0) { $("#schedule-option-modal").modal('hide'); }
		var type = $(el).data("os");
		if (type == undefined) {
			var c = $(el).attr("class");
			if (c.indexOf("os-single") != -1) { type = "single"; }
		}
		if (type == "single") {
			orderservicesremove.remove(1);
		} else {
			orderservicesremove.remove(2);
		}
	},
	saveExpenses: function(el, ev) {
		expenses.save();
	},
	showTaskDetail: function(el, ev) {
		var project = $(el).data("project");
		var task = $(el).data("task");
		var tr = $(el).parent().parent();
		console.log('showTaskDetail', project, task, tr)
		projectspms.detail(project, task, tr);
		$(el).hide();
	},
	calculateHourPms: function(el, ev) {
		timeevents.hourspms(el);
	},
	changePrint: function(el, ev) {
		$(".links-print").html("");
	},
	changeProjectFrontProduct: function(el,ev) {
		var projectField = $(el).data("project");
		var productField = $(el).data("product");
		var project = $("#"+projectField).val();

		if($("#"+productField).length) {
			if($(el).val() == null || $(el).val() == "") {
				$("#"+productField).empty();
				return;
			}
			productProjectFront.get(project,$(el).val(), productField);
		}
	},

	calcHours: function(el, ev) {

		console.log("calcHours", el, ev)

		var timePmsBegin = $(el).closest("tr").find(".time-pms-begin");
		var timePmsEnd = $(el).closest("tr").find(".time-pms-end");

		if(timePmsEnd.val() == "" || timePmsBegin.val() == "") {
			return;
		}

		var isvalidBegin = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($(timePmsBegin).val());
		var isvalidEnd = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($(timePmsEnd).val());

		if(isvalidBegin && isvalidEnd) {
			var beginningTime = moment($(timePmsBegin).val(), 'HH:mm');
			var endTime = moment($(timePmsEnd).val(), 'HH:mm');
			if(!beginningTime.isBefore(endTime)) {
    			WCMC.messageError("Hora inicial maior que a hora final");
				return;
			}
		}else {
			WCMC.messageError("Hora inicial e(ou) final inválida");
			return;
		}

		if($(timePmsAmount).data("traslado") == "S") {
			this.calcHoursAllTasks();
		}
	},

	calcHoursAllTasks: function() {
		var sumTraslado = "00:00";
		$(".time-pms-amount").each(function() {
			if($(this).data("traslado") == "S") {
				sumTraslado = moment(sumTraslado,"HH:mm").add(moment($(this).val(),"HH:mm")).format("HH:mm");
			}
		});

		$("#hora-traslado-os").val(sumTraslado);

		var r = schedulertime.calc($('#hora-inicio-os').val(), $('#hora-fim-os').val(), $('#hora-traslado-os').val(), $('#hora-outros-os').val());
		$("#hora-total-os").val(r);
	}

});





/*#########################*/
var zoomcustomer = (function(){
	var FTL = "search-customer.ftl";
	var returnid = "";
	var URL = pmswidget.context + "/api/rest/customer/";
	return {
		open: function(id) {
			returnid = id;

			WCMAPI.convertFtlAsync( pmswidget.application,
									FTL,
									{ },
								   function (data) {
										FLUIGC.modal({ "title": "Customer Search",
										         	   "content": data,
										         	   "id": 'modal-zoom-customer',
										         	   "actions": [{
												            'label': "Add",
												            'bind': 'data-btn-add-customer',
												            'classType': 'btn-primary'
												        },{
												            'label': "Close",
												            'classType': 'btn-default',
												            'autoClose': true
												        }]
										      		});
								   },
								   function(err) {
								      //FluigSocialHelper.hideLoading();
								   }
								);
		},
		checkkey: function(event) {
			if (event.which == 13 || event.keyCode == 13) {
				pmswidget.stopClick("", event);
				zoomcustomer.search();
			}
		},
		add: function() {
			//console.log('zoom add');
			$('#divResultSearchCustomer input').each(function() {
				var type = $(this).attr("type");
				if ((type == "checkbox") && $(this).is(":checked")) {
					var code = $(this).data('code');
					var name = $(this).data('name');
					var store = $(this).data('store');

					ecustomers.add(code, name, null, store);
					if ($("#" + returnid).length > 0) {
						ecustomers.populate(returnid, true);
						$("#" + returnid).val(code+"-"+store);
						pmswidget.changeCustomer($("#" + returnid), "");
					}
				}
			});

			if ($("#modal-zoom-customer").length > 0) { $("#modal-zoom-customer").modal('hide'); }

		},
		search: function() {
			//console.log("search");

			if (this.validate()) { return false; }

			var code = $("#cliente-pesquisa").val();
			var u = URL + "code/" + code;
			if (code == "" || code == null) {
				u = URL + "name/" + $("#nome-cliente-pesquisa").val();
			}

			var load = FLUIGC.loading("#modal-zoom-customer");
			load.show();

			//console.log("url", u)

			$.ajax({
	    		type: "GET",
	    		dataType: "json",
	    		url: u,
	    		data: "",
	    		error: function(XMLHttpRequest, textStatus, errorThrown) {
	    			//console.log("error customer");
	    			var response = $.parseJSON(XMLHttpRequest.responseText);
	    			WCMC.messageError(response.message.message);
	    			pmswidget.loading.hide();
				},
	    	    success: function (data, status, xhr) {
	    			//console.log("success customer", data);
	    			var content = $.parseJSON(data.content);

	    			var html = '<table class="table table-striped table-hover">' +
	    				'<thead>' +
	    				'<tr>' +
	    				'<td>&nbsp;</td>' +
	    				'<th>C&oacute;digo</th>' +
	    				'<th>Loja</th>' +
	    				'<th>Nome</th>' +
	    				'</tr>' +
	    				'</thead>' +
	    				'<tbody>';

	    	    	jQuery.each(content, function(code, value) {
	    	    		html += '<tr>' +
	    	    			    '<td><input type="checkbox" value="1" data-code="' + code + '" data-name="' + value.name +'" data-store="' + value.loja + '"></td>' +
	    	    			    '<td style="text-align: center">' + code + '</td>' +
	    	    			    '<td style="text-align: center">' + value.loja + '</td>' +
	    	    			    '<td><span title="' + value.name + '">' + value.name.substring(0, 40) + '</span></td>' +
	    	    			    '</tr>';
 	    	    	});

					html += '</tbody></table>';

					$("#divResultSearchCustomer").html(html);

					load.hide();
	    	    }
			});

		},
		validate: function() {
			if ($("#cliente-pesquisa").val() == "" && $("#nome-cliente-pesquisa").val() == "") {
				WCMC.messageError("Informe um codigo ou nome do cliente para pesquisa!");
				return true;
			}
			return false;
		},
		km: function(customer, store, place, project, front, date) {

			console.log("get km", customer, store, place, project, front, date);

			if (place != "" && place != "999") {
				var d = date.split("/");
				var f = d[0] + "-" + d[1] + "-" + d[2];

				var u = URL + "km/" + customer + "/" + store + "/" + place + "/" + project + "/" + front + "/" + f;

				var load = FLUIGC.loading($('.despesa-rda-os').parent().parent());
				load.show();

				console.log("url", u)

				$.ajax({
		    		type: "GET",
		    		dataType: "json",
		    		url: u,
		    		data: "",
		    		error: function(XMLHttpRequest, textStatus, errorThrown) {
		    			//console.log("error customer");
		    			var response = $.parseJSON(XMLHttpRequest.responseText);
		    			WCMC.messageError(response.message.message);
		    			load.hide();
					},
		    	    success: function (data, status, xhr) {
		    			var content = $.parseJSON(data.content);

		    			var total = "0,00";
		    			jQuery.each(content, function(code, value) {
		    				total = value.totalkm;
		    			});

		    			$(".despesa-rda-os").each(function () {
		    				if ($(this).data("code") == expenses.getkmcode()) {
		    					$(this).val(total);
		    				}
		    			});

		    			var s = total.replace(/[^\d,-]/g, '');
		    			s = s.replace(",", ".");
		    			var t = parseFloat(s);

		    			console.log("total", total, t)
		    			if (t > 0) {
		    				$("#btn-add-km").hide();
		    				$("#btn-remove-km").show();
		    			} else {
		    				$("#btn-add-km").show();
		    				$("#btn-remove-km").hide();
		    			}

		    			timeevents.sumexpenses();

		    			load.hide();
		    	    }
				});

			} else {
    			$(".despesa-rda-os").each(function () {
    				if ($(this).data("code") == expenses.getkmcode()) {
    					$(this).val("0,00");
    				}
    			});
    			timeevents.sumexpenses();
			}

		}
	};
})();
