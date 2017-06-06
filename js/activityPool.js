var plannings_month = [];

//Constants
var API_HOST = "http://totvsjoi-hcm08.jv01.local:9090/";
var API_URL = API_HOST + "task-manager/api/";
var DATE_COMPLEMENT = "T10:00:00.0+0100";

$(function() {
    if (!localStorage.id_token){
        $(".login").fadeIn("fast", function(){
            $("#username").focus();
        });
    }
    else{
        $(".content").fadeIn("fast", function(){
            initialize();
        });
    }

    $("#form_login").submit(function(){
        loading("show");
        $.ajax({
            url: API_URL + "public/v1/account/authenticate",
            type: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            dataType: "json",
            data: JSON.stringify({
                "email" : $("#username").val(),
                "password" : $("#password").val()
            }),
            success: function(data) {
                localStorage.id_token = data.data;

                $(".login").fadeOut("fast", function(){
                    $(".content").fadeIn("fast", function(){
                        initialize();
                        loading("hide");
                    });
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                loading("hide");
                notify("", "N&atilde;o foi poss&iacute;vel fazer login!", "danger");
            }
        });
        return false;
    });

    $("#esqueceu_senha").click(function(){
        window.open(API_HOST + "tasks/#/forget", "_blank");
        window.close();
    });

    $("#btn_cadastrar").click(function(){
        window.open(API_HOST + "tasks/#/signup", "_blank");
        window.close();
    });

    $("#logout").click(function(){
        localStorage.removeItem("id_token");

        $(".content").fadeOut("fast", function(){
            $(".footer").addClass("hidden");
            $("#username").val("");
            $("#password").val("");
            $("#username").focus();

            $(".login").fadeIn("fast", function(){});
        });

    });

    $("#btn_search").click(function(){
        search();
    });

    $("#btn_voltar").click(function(){
        $(".appointment").fadeOut( "fast", function() {
            $(".content").fadeIn("fast", function(){
                $(".footer").removeClass("hidden");
                $(".agenda-form").addClass("hidden");
                $("#btn_agenda").addClass("hidden");
                $("#btn_apontar").removeClass("hidden");
                $("#email").val("");
                $("#email-cc").val("");
            });
        });
    });

    $("#btn_voltar_agrupadas").click(function(){
        $(".agendas_agrupadas").fadeOut( "fast", function() {
            $(".content").fadeIn("fast", function(){
                $(".footer").removeClass("hidden");
                $(".main_table tbody").html("");
            });
        });
    });

    $("#btn_apontar").click(function(){
        fill_appointment_fields();
    });

    $("#btn_agenda").click(function(){
        send_appointment_email();
    });

    $(".close_alert").click(function(){
        $(this).parent().parent().addClass("hidden");
    });

    $(".legenda").find("li").each(function(){
        $(this).css({"background-color": appointment_color($(this).attr("data-color"))});
    });

    $("#btn_agenda_agrupada").click(function(){
        var agendas = [];

        $(".table_agendas .item").each(function(){
            var tasks = [];
            var ticket = $(this).find(".ticket").text();
            var clientCode = $(this).find(".clientCode").text();
            var clientName = $(this).find(".clientName").text();
            var project = $(this).find(".project").text();
            var front = $(this).find(".front").text();

            $(this).next().find(".task").each(function(){
                var data = $(this).find(".date").text().split("/");
                if($(this).find(".check_send:checked").length > 0){
                    tasks.push({
                        "date" : data[2] + "-" + data[1] + "-" + data[0],
                        "timeStart" : $(this).find(".timeStart").val() + ":00",
                        "timeEnd" : $(this).find(".timeEnd").val() + ":00",
                        "timeInterval" : $(this).find(".timeInterval").val() + ":00",
                        "ticket" : ticket ,
                        "project" : project,
                        "front" : front,
                        "clientCode" : clientCode,
                        "clientName" : clientName,
                        "activity" : $(this).find(".activity").text()
                    });
                }
            });

            if(tasks.length > 0){
                agendas.push({
                    "ticket" : ticket,
                    "clientCode" : clientCode,
                    "clientName" : clientName,
                    "project" : project,
                    "front" : front,
                    "tasks" : tasks
                });
            }
        });

        if(agendas.length == 0){
            notify("Nenhuma tarefa selecionada" + "!", "Selecione pelo menos uma atividade", "danger");
            return;
        }

        if($("#email_agrupadas").val() == ""){
            notify("Email n&atilde;o informado" + "!", "Informe um e-mail de destinat&aacute;rio", "danger");
            return;
        }

        loading("show");

        $.ajax({
            url: API_URL + "v1/agendas/request",
            type: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.id_token,
                "Accept": "application/json, text/plain, * / *",
                "Content-Type": "application/json"
            },
            dataType: "json",
            data: JSON.stringify({
                "mailTo" : $("#email_agrupadas").val(),
                "mailCC" : $("#email-cc_agrupadas").val(),
                "items" : agendas
            }),
            success: function(data) {
                if (data.status == "success") {
                    notify(data.status.toUpperCase() + "!", data.message, "success");
                }
                else{
                    notify(data.status.toUpperCase() + "!", data.message, "warning");
                }

                loading("hide");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                notify(xhr.status + "!", thrownError, "danger");

                loading("hide");
            }
        });
    });

    $("#btn_solicitar_agendas").click(function(){
        $("#email_agrupadas").val($("#resource").attr("email_agenda"));
        $("#email-cc_agrupadas").val("");

        $(".footer").addClass("hidden");

        $(".content").fadeOut( "fast", function() {
            $(".agendas_agrupadas").fadeIn("fast", function(){});
        });

        var now = new Date();
        var month = (now.getMonth() + 1);
        var day = now.getDate();
        var day_ini = day - 7 > 0 ? day - 7 : 1;
        var year = now.getFullYear();

        if(month < 10)
            month = "0" + month;
        if(day < 10)
            day = "0" + day;
        if(day_ini < 10)
            day_ini = "0" + day_ini;

        var date_calendar_fin = new Date(year, (now.getMonth() + 1), 0);

        var dt_ini_per = year + '-' + month + '-' + day_ini;
        var dt_fin_per = year + '-' + month + '-' + day;

        $('#data_ini_periodo').val(dt_ini_per);
        $('#data_ini_periodo').attr({
            "min": year + '-' + month + '-01',
            "max": moment(date_calendar_fin).format('YYYY-MM-DD')
        });
        $('#data_fin_periodo').val(dt_fin_per);
        $('#data_fin_periodo').attr({
            "min": year + '-' + month + '-01',
            "max": moment(date_calendar_fin).format('YYYY-MM-DD')
        });

        getAgendasPeriodo();

        $("#email_agrupadas").val($("#resource").attr("email_agenda"));
        $("#email-cc_agrupadas").val("");

        $(".footer").addClass("hidden");

        $(".content").fadeOut( "fast", function() {
            $(".agendas_agrupadas").fadeIn("fast", function(){});
        });
    });

    $("#search_periodo").click(function(){
        if($('#data_ini_periodo').val() == ""){
            notify("Data de in&iacute;cio inv&aacute;lida" + "!", "Informe uma data correta", "warning");
            return;
        }

        if($('#data_ini_periodo').val() == ""){
            notify("Data de final inv&aacute;lida" + "!", "Informe uma data correta", "warning");
            return;
        }

        if($('#data_ini_periodo').val() > $('#data_fin_periodo').val()){
            notify("Datas inv&aacute;lidas" + "!", "Data inicial maior que final", "warning");
            return;
        }

        getAgendasPeriodo();
    });

    $(document).on("change", ".task .check_send", function(){
        if($(this)[0].checked){
            $(this).parent().parent().removeClass("transparente");
        }
        else{
            $(this).parent().parent().addClass("transparente");
        }
    });

    $(document).on("change", ".check_select_all", function(){
        if($(this)[0].checked){
            $(this).parent().parent().parent().parent().find(".check_send").each(function(){
                $(this)[0].checked = true;
                $(this).parent().parent().removeClass("transparente");
            });
        }
        else{
            $(this).parent().parent().parent().parent().find(".check_send").each(function(){
                $(this)[0].checked = false;
                $(this).parent().parent().addClass("transparente");
            });
        }
    });


});

/* Initialize App */
function initialize(){
    if (!_doDecode()){
        $(".login").fadeIn("fast", function(){
            $("#username").focus();
        });
    }
    else{
        loading("show");
        findEmailAgendaTo();

        var now = new Date();
        var month = (now.getMonth() + 1);
        var day = now.getDate();
        var year = now.getFullYear();

        $(".month").attr({"num_month": month});
        $(".year").attr({"num_year": year});

        if(month < 10)
            month = "0" + month;
        if(day < 10)
            day = "0" + day;
        var today = now.getFullYear() + '-' + month + '-' + day;

        $('#date_planning').val(today);
        $(".footer").removeClass("hidden");

        var now = new Date();
        var month = (now.getMonth() + 1);
        var day = now.getDate();
        var year = now.getFullYear();

        if(month < 10)
            month = "0" + month;
        if(day < 10)
            day = "0" + day;
        var today = now.getFullYear() + '-' + month + '-' + day;

        $('#calendar').fullCalendar({
            defaultDate: today,
            editable: true,
            eventLimit: false, // allow "more" link when too many events
            viewRender: function (view, element) {
                search();

                var date_calendar_year = moment($('#calendar').fullCalendar('getDate')).format('MM');
                var now = new Date();
                var month = (now.getMonth() + 1);

                if (parseInt(date_calendar_year) != month) {
                    $("#btn_solicitar_agendas").attr("disabled", "disabled");
                }
                else{
                    $("#btn_solicitar_agendas").removeAttr("disabled");
                }
            },
           eventClick: function(calEvent, jsEvent, view) {
                var element_day = $(this).parent().parent().parent().parent().find(".fc-day-top");

                var selected_day;
                for (var i = 0; i < element_day.length; i++){
                    var offset = element_day.eq(i).offset();

                    //alert(offset.left);
                    if (offset.left > jsEvent.pageX){
                        if (i == 0){
                            selected_day = element_day.eq(i);
                        }
                        else{
                            selected_day = element_day.eq(i - 1);
                        }
                        break;
                    }

                    if (i == element_day.length - 1){
                        selected_day = element_day.eq(i);
                    }
                }

                appointment_detail(calEvent, selected_day.attr("data-date"));
            },
            eventRender: function(event, element) {
                element.attr({
                    title: event.title
                });
            }
        });
        loading("hide");
    }
}

function send_appointment_email(){
    if ($("#date_planning").val() == ""){
        notify("Campos incorretos" + "!", "Data inv&aacute;lida", "danger");
        return;
    }

    if ($("#cliente-os").attr("cliente-os") == ""){
        notify("Campos incorretos" + "!", "Cliente n&atilde;o informado! Consulte o PMO!", "danger");
        return;
    }

    if ($("#projeto-os").val() == ""){
        notify("Campos incorretos" + "!", "Campo Projeto n&atilde;o est&aacute; informado", "danger");
        return;
    }

    if ($("#projeto-frente-os").val() == ""){
        notify("Campos incorretos" + "!", "Campo Frente n&atilde;o est&aacute; informado", "danger");
        return;
    }

    if ($("#ticket").val() == ""){
        notify("Campos incorretos" + "!", "Campo Ticket n&atilde;o est&aacute; informado", "danger");
        return;
    }


    loading("show");
    $("#btn_agenda").attr("disabled", "disabled");
    $.ajax({
        url: API_URL + "v1/agendas/request",
        type: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.id_token,
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        dataType: "json",
        data: JSON.stringify({
            "mailTo" : $("#email").val(),
            "mailCC" : $("#email-cc").val(),
            "items" : [{
                "ticket" : $("#ticket").val(),
                "clientCode" : $("#cliente-os").attr("cliente-os"),
                "clientName" : $("#cliente-os").attr("cliente-name"),
                "project" : $("#projeto-os").val(),
                "front" : $("#projeto-frente-os").val(),
                "tasks" : [{
                    "date" : $("#date_planning").val(),
                    "timeStart" : $("#time-ini").val() + ":00",
                    "timeEnd" : $("#time-fin").val() + ":00",
                    "timeInterval" : $("#time-interval").val() + ":00",
                    "ticket" : $("#ticket").val(),
                    "project" : $("#projeto-os").val(),
                    "front" : $("#projeto-frente-os").val(),
                    "clientCode" : $("#cliente-os").attr("cliente-os"),
                    "clientName" : $("#cliente-os").attr("cliente-name"),
                    "activity" : $("#atividades-os").val()
                }]
            }]
        }),
        success: function(data) {
            if (data.status == "success") {
                notify(data.status.toUpperCase() + "!", data.message, "success");
            }
            else{
                notify(data.status.toUpperCase() + "!", data.message, "warning");
            }
            $("#btn_agenda").removeAttr("disabled");
            loading("hide");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            notify(xhr.status.toUpperCase() + "!", thrownError, "danger");
            $("#btn_agenda").removeAttr("disabled");
            loading("hide");
        }
    });
}

function fill_appointment_fields(){
    if ($("#date_planning").val() == ""){
        notify("Campos incorretos" + "!", "Data inv&aacute;lida", "danger");
        return;
    }

    if ($("#cliente-os").attr("cliente-os") == ""){
        notify("Campos incorretos" + "!", "Cliente n&atilde;o informado! Consulte o PMO!", "danger");
        return;
    }

    if ($("#projeto-os").val() == ""){
        notify("Campos incorretos" + "!", "Campo Projeto n&atilde;o est&aacute; informado", "danger");
        return;
    }

    if ($("#projeto-frente-os").val() == ""){
        notify("Campos incorretos" + "!", "Campo Frente n&atilde;o est&aacute; informado", "danger");
        return;
    }

    if ($("#ticket").val() == ""){
        notify("Campos incorretos" + "!", "Campo Ticket n&atilde;o est&aacute; informado", "danger");
        return;
    }

    var data_planing = $("#date_planning").val().split("-");
    var commands = "loadApointment('" + $("#cliente-os").attr("cliente-os") + "', " +
                                  "'" + $("#cliente-os").attr("cliente-name") + "'," +
                                  "'" + $("#projeto-os").val() + "'," +
                                  "'" + $("#projeto-frente-os").val() + "'," +
                                  "'" + $("#produto-frente-os").val() + "'," +
                                  "'" + $("#local-atendimento-os").val() + "'," +
                                  "'" + $("#atividades-os").val() + "'," +
                                  "'" + data_planing[2] + "/" + data_planing[1] + "/" + data_planing[0] + "');";

    chrome.tabs.executeScript(null,
        {
            code:
                "var scr = document.createElement('script');" +
                "scr.innerHTML = \"" + commands + "\";" +
                "document.body.appendChild(scr);",
        }
    );
    window.close();
}

function search(){
    if ($("#resource").attr("code") != ""){
        loading("show");

        var date_calendar = $("#calendar").fullCalendar('getDate');
        var date_calendar_year = moment(date_calendar ).format('YYYY');
        var date_calendar_month = moment(date_calendar).format('MM');

        var date_calendar_fin = new Date(date_calendar_year, date_calendar_month, 0);

        var dt_ini = date_calendar_year + "-" + date_calendar_month + "-01";
        var dt_fin = date_calendar_year + "-" + date_calendar_month + "-" + date_calendar_fin.getDate();

        $.ajax({
            url: API_HOST + "pool-reader/api/rest/planning?allocationTypes=EM,FE,FN,PL,PV,RP&allocations=EM&allocations=FE&allocations=FN&allocations=PL&allocations=PV&allocations=RP&finalDate=" + dt_fin + "&initialDate=" + dt_ini + "&issue=&login=&name=&ociosity=false&resources=" + $("#resource").attr("code") + "&teams=&detail=true",
            dataType: "json",
            success: function(activityPool) {
                plannings_month = activityPool.plannings;
                var event;
                for (var i = 0; i < activityPool.plannings.length; i++){

                    event = {title: activityPool.plannings[i].resumo,
                             start: activityPool.plannings[i].inicio,
                             end: activityPool.plannings[i].termino + DATE_COMPLEMENT,
                             backgroundColor: appointment_color(activityPool.plannings[i].alocacao),
                             chamado: activityPool.plannings[i].chamado};

                    $('#calendar').fullCalendar( 'renderEvent', event);
                }

                for (var i = 0; i < activityPool.holidays.length; i++){
                    event = {title: activityPool.holidays[i].name,
                             start: activityPool.holidays[i].date,
                             rendering: 'background'};

                    $('#calendar').fullCalendar( 'renderEvent', event);
                }
                loading("hide");
            }
       });
    }
}

function appointment_detail(event, date){
    loading("show");
    $("#date_planning").val(date);
    $.ajax({
        url: API_HOST + "pool-reader/api/rest/planning/load?date=" + date + "&username=" + $("#resource").attr("code") ,
        dataType: "json",
        success: function(activity) {
            var is_found = false;
            for (var i = 0; i < activity.length; i++){
                if (event.chamado == activity[i].issue){
                    $("#ticket").val(activity[i].issue);
                    $("#cliente-os").val(activity[i].clientCode + " - " + activity[i].clientName);
                    $("#cliente-os").attr("cliente-os", activity[i].clientCode);
                    $("#cliente-os").attr("cliente-name", activity[i].clientName);
                    $("#projeto-os").val(activity[i].cfpProject);
                    $("#projeto-frente-os").val(activity[i].pmsProject);
                    $("#atividades-os").val(activity[i].resume);

                    $("#time-ini").val("08:00");
                    $("#time-fin").val("18:00");
                    $("#time-interval").val("01:30");
                    $("#tot-horas").val("08:30");

                    $("#email").val($("#resource").attr("email_agenda"));
                    $("#email-cc").val("");

                    $(".footer").addClass("hidden");

                    $(".content").fadeOut( "fast", function() {
                        $(".appointment").fadeIn("fast", function(){});
                    });

                    if (activity[i].hasAgenda == "Sim"){
                        $("#btn_agenda").removeClass("hidden");
                        $(".agenda-form").removeClass("hidden");
                        $("#btn_apontar").addClass("hidden");
                        $("#status").html("<span class='label label-warning'>Necessita solicita&ccedil;&atilde;o de agenda!</span>");
                    }
                    else{
                        $("#btn_agenda").addClass("hidden");
                        $(".agenda-form").addClass("hidden");
                        $("#btn_apontar").removeClass("hidden");
                        $("#status").html("<span class='label label-success'>N&atilde;o necessita solicita&ccedil;&atilde;o de agenda!</span>");
                    }

                    is_found = true;
                    loading("hide");
                    break;
                }
            }

            if (!is_found){
                loading("hide");
                notify("", "N&atilde;o foi poss&iacute;vel abrir a tarefa! Contate o suporte!", "danger");
            }
        }
   });
}

function appointment_color(alocation){
    var color = [["EM", "#808080"],
                 ["FE", "#FF8C00"],
                 ["FN", "#CC00FF"],
                 ["PL", "#FF5050"],
                 ["PV", "#00CC00"],
                 ["RP", "#FFCC00"],
                 ["FERIADO", "rgba(174, 234, 255, 0.55)"],
                 ["HOJE", "#337ab7"]];

    for (var i = 0; i < color.length; i++){
        if (color[i][0] == alocation){
            return color[i][1];
        }
    }

    return "#FFF";
}

function findEmailAgendaTo(){
    loading("show");
    $.ajax({
        url: API_URL + "v1/parameters?name=AGENDA_REQUEST_MAIL_TO",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.id_token,
            "Accept": "application/json, text/plain, * /*",
            "Content-Type": "application/json"
        },
        dataType: "json",
        success: function(data) {
            $("#resource").attr({"email_agenda": data.data});
            loading("hide");
        }
    });
}

function getAgendasPeriodo(){
    var items = [];
    var tasks = [];

    var dt_ini_per = $('#data_ini_periodo').val();
    var dt_fin_per = $('#data_fin_periodo').val();

    var event;
    for (var i = 0; i < plannings_month.length; i++){
        var ticket = plannings_month[i].chamado;
        var project = plannings_month[i].cfpProject;
        var front = plannings_month[i].pmsProject;
        var clientCode = plannings_month[i].clientCode;
        var clientName = plannings_month[i].clientName;
        var activity = plannings_month[i].resumo;

        var inicio = new Date(plannings_month[i].inicio + DATE_COMPLEMENT);
        var termino = new Date(plannings_month[i].termino + DATE_COMPLEMENT);


        dt_ini_periodo = new Date(dt_ini_per + DATE_COMPLEMENT);
        dt_fin_periodo = new Date(dt_fin_per + DATE_COMPLEMENT);

        if (inicio < dt_ini_periodo){
            inicio = dt_ini_periodo;
        }

        if (termino > dt_fin_periodo){
            termino = dt_fin_periodo;
        }

        var item_existente = false;
        var idx_item_existente;
        for (var j = 0; j < items.length; j++){
            if(items[j].ticket == ticket &&
               items[j].clientCode == clientCode &&
               items[j].project == project &&
               items[j].front == front){
                item_existente = true;
                idx_item_existente = j;
            }
        }

        var day_task = inicio.getDate();
        while(day_task <= termino.getDate()){
            var dt_task = parseDate(day_task, inicio.getMonth() + 1, inicio.getFullYear());

            /* Weekday */
            if(dt_task.getDay() < 6 && dt_task.getDay() > 0){
                var it_task = {
                    "date" : parseDateToString(dt_task),
                    "timeStart" : "08:00:00",
                    "timeEnd" : "18:00:00",
                    "timeInterval" : "01:30",
                    "ticket" : ticket,
                    "project" : project,
                    "front" : front,
                    "clientCode" : clientCode,
                    "clientName" : clientName,
                    "activity" : activity
                };

                if(item_existente){
                    items[idx_item_existente].tasks.push(it_task);
                }

                tasks.push(it_task);
            }

            day_task++;
        }

        if(!item_existente && tasks.length > 0){
            items.push({
                "ticket" : ticket,
                "clientCode" : clientCode,
                "clientName" : clientName,
                "project" : project,
                "front" : front,
                "tasks" : tasks
            });
        }

        tasks = [];
    }

    for (var i = 0; i < items.length; i++){
        items[i].tasks.sort(order_tasks_by_date);
    }

    items.sort(order_items_by_date);

    console.log(items);

    $(".main_table tbody").html("");

    var linha = "";

    for (var i=0; i<items.length; i++){
        var tasks_head = "<tr class='expanded'>" +
                            "<td colspan='5'>" +
                                "<table class='table detail_table table-condensed table-bordered'>" +
                                    "<thead>" +
                                        "<tr>" +
                                            "<th class='text-center'>" +
                                                "<input type='checkbox' name='checkbox_select_" + i + "' id='checkbox_select_" + i + "' class='css-checkbox check_select_all' checked='checked' />" +
                                                "<label for='checkbox_select_" + i + "' class='css-label'></label>" +
                                            "</th>" +
                                            "<th class='vcenter'>Data</th>" +
                                            "<th class='vcenter'>Hr In&iacute;cio</th>" +
                                            "<th class='vcenter'>Hr Final</th>" +
                                            "<th class='vcenter'>Hr Interv</th>" +
                                        "</tr>" +
                                    "</thead>" +
                                    "<tbody>";

        var tasks_footer =          "</tbody>" +
                                "</table>" +
                            "</td>" +
                        "</tr>";

        linha = linha +
                "<tr class='item'>" +
                    "<td class='clientCode'>" + items[i].clientCode + "</td>" +
                    "<td class='clientName'>" + items[i].clientName + "</td>" +
                    "<td class='ticket'>" + items[i].ticket + "</td>" +
                    "<td class='project'>" + items[i].project + "</td>" +
                    "<td class='front'>" + items[i].front + "</td>" +
                "</tr>";



        var items_agenda = "";
        for (var j=0; j<items[i].tasks.length; j++){
             var data = items[i].tasks[j].date.split("-");

             items_agenda = items_agenda +
                                    "<tr class='task' title='" + items[i].tasks[j].activity + "'>" +
                                        "<td class='text-center'>" +
                                            "<input type='checkbox' name='checkbox" + i + j + "' id='checkbox" + i + j + "' class='css-checkbox check_send' checked='checked' />" +
                                            "<label for='checkbox" + i + j + "' class='css-label'></label>" +
                                        "</td>" +
                                        "<td class='date'>" + data[2] + "/" + data[1] + "/" + data[0] + "</td>" +
                                        "<td>" +
                                            "<input type='time' title='Hor&aacute;rio in&iacute;cio' class='timeStart' value='" + items[i].tasks[j].timeStart + "'>" +
                                        "</td>" +
                                        "<td>" +
                                            "<input type='time' title='Hor&aacute;rio t&eacute;rmino' class='timeEnd' value='" + items[i].tasks[j].timeEnd + "'>" +
                                        "</td>" +
                                        "<td>" +
                                            "<input type='time' title='Tempo intervalo' class='timeInterval' value='" + items[i].tasks[j].timeInterval + "'>" +
                                        "</td>" +
                                    "</tr>";

        }

        linha = linha + tasks_head + items_agenda + tasks_footer;

    }
    $(".main_table tbody").append(linha);
}

function notify(title, message, type){
    var icon = "";

    if (type == "success"){
        icon = "glyphicon-ok-sign";
    }
    if (type == "warning"){
        icon = "glyphicon-warning-sign";
    }
    if (type == "danger"){
        icon = "glyphicon-remove-sign";
    }
    if (type == "info"){
        icon = "glyphicon-info-sign";
    }



    $.notify({
        // options
        icon: 'glyphicon ' + icon,
        title: title,
        message: message
    },{
        // settings
        element: 'body',
        position: null,
        type: type,
        allow_dismiss: true,
        placement: {
            from: "top",
            align: "right"
        },
        offset: 10,
        spacing: 10,
        z_index: 1031,
        delay: 2000,
        timer: 1000,
        mouse_over: null,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        },
        onShow: null,
        onShown: null,
        onClose: null,
        onClosed: null,
        icon_type: 'class'
    });
}

/***************************** UTILS Functions ******************************************/
function _doDecode() {
    var sJWS = localStorage.id_token;
    var a = sJWS.split(".");
    var uHeader = b64utos(a[0]);
    var uClaim = b64utos(a[1]);
    var pHeader = KJUR.jws.JWS.readSafeJSONString(uHeader);
    var pClaim = KJUR.jws.JWS.readSafeJSONString(uClaim);
    //var sHeader = JSON.stringify(pHeader, null, "  ");
    //var sClaim = JSON.stringify(pClaim, null, "  ");

    var dt_exp = new Date(pClaim.exp * 1000);
    if (dt_exp >= new Date()){
        $("#resource").text(pClaim.name);
        $("#resource").attr({"code": pClaim.code,
                             "iss": pClaim.iss,
                             "exp": pClaim.exp,
                             "key": pClaim.key,
                             "email": pClaim.email});
        return true;
    }
    else{
        console.log("TOCKEN EXPIRADO");
        return false;
    }
}

function loading(action){
    if (action == "show"){
        $.LoadingOverlay("show");
    }
    else{
        $.LoadingOverlay("hide");
    }
}

function parseDateToString(dateToParse){
    var month = (dateToParse.getMonth() + 1);
    var day = dateToParse.getDate();
    var year = dateToParse.getFullYear();

    if(month < 10)
        month = "0" + month;
    if(day < 10)
        day = "0" + day;

    return year + "-" + month + "-" + day;
}

function parseDate(day, month, year){
    if(parseInt(month) < 10)
        month = "0" + parseInt(month);
    if(parseInt(day) < 10)
        day = "0" + parseInt(day);

    return new Date(year + "-" + month + "-" + day + DATE_COMPLEMENT);
}

function order_tasks_by_date(a,b) {
    var a_date = a.date.split("-");
    var a_date = parseDate(a_date[2], a_date[1], a_date[0]);
    var b_date = b.date.split("-");
    var b_date = parseDate(b_date[2], b_date[1], b_date[0]);

    if (a_date < b_date)
        return -1;
    else
        return 1;

    return 0;
}

function order_items_by_date(a,b) {
    var a_date = a.tasks[0].date.split("-");
    var a_date = parseDate(a_date[2], a_date[1], a_date[0]);
    var b_date = b.tasks[0].date.split("-");
    var b_date = parseDate(b_date[2], b_date[1], b_date[0]);

    if (a_date < b_date)
        return -1;
    else
        return 1;

    return 0;
}
