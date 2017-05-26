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
            url: "http://totvsjoi-hcm08.jv01.local:9090/task-manager/api/public/v1/account/authenticate",
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
        window.open("http://totvsjoi-hcm08.jv01.local:9090/tasks/#/forget", "_blank");
        window.close();
    });

    $("#btn_cadastrar").click(function(){
        window.open("http://totvsjoi-hcm08.jv01.local:9090/tasks/#/signup", "_blank");
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

        loading("show");

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

            console.log(agendas);
        });

        $.ajax({
            url: "http://totvsjoi-hcm08.jv01.local:9090/task-manager/api/v1/agendas/request",
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

        var items = [];
        var tasks = [];

        tasks.push({
            "date" : "2017-05-01",
            "timeStart" : "08:00:00",
            "timeEnd" : "18:00:00",
            "timeInterval" : "01:30",
            "ticket" : "111555" ,
            "project" : "000258508",
            "front" : "001",
            "clientCode" : "T15544",
            "clientName" : "Supergasbras",
            "activity" : "Testerd sfds fds fds fds fds fds dfds"
        });

        tasks.push({
            "date" : "2017-05-02",
            "timeStart" : "08:00:00",
            "timeEnd" : "18:00:00",
            "timeInterval" : "01:30",
            "ticket" : "111555" ,
            "project" : "000258508",
            "front" : "001",
            "clientCode" : "T15544",
            "clientName" : "Supergasbras",
            "activity" : "Testerd sfds fds fds fds fds fds dfds"
        });

        tasks.push({
            "date" : "2017-05-03",
            "timeStart" : "08:00:00",
            "timeEnd" : "18:00:00",
            "timeInterval" : "01:30",
            "ticket" : "111555" ,
            "project" : "000258508",
            "front" : "001",
            "clientCode" : "T15544",
            "clientName" : "Supergasbras",
            "activity" : "Testerd sfds fds fds fds fds fds dfds"
        });

        items.push({
            "ticket" : "111555",
            "clientCode" : "T15544",
            "clientName" : "Supergasbras",
            "project" : "000258508",
            "front" : "001",
            "tasks" : tasks
        });

        var tasks = [];
        tasks.push({
            "date" : "2017-05-03",
            "timeStart" : "08:00:00",
            "timeEnd" : "18:00:00",
            "timeInterval" : "01:30",
            "ticket" : "111555" ,
            "project" : "000258508",
            "front" : "001",
            "clientCode" : "T15544",
            "clientName" : "Supergasbras",
            "activity" : "Testerd sfds fds fds fds fds fds dfds"
        });

        items.push({
            "ticket" : "255558",
            "clientCode" : "T2225",
            "clientName" : "Firjan",
            "project" : "00026628",
            "front" : "001",
            "tasks" : tasks
        });


        $(".main_table tbody").html("");

        var linha = "";

        var tasks_head = "<tr class='expanded'>" +
                            "<td colspan='5'>" +
                                "<table class='table detail_table table-condensed table-bordered'>" +
                                    "<thead>" +
                                        "<tr>" +
                                            "<th>Data</th>" +
                                            "<th>Hr In&iacute;cio</th>" +
                                            "<th>Hr Final</th>" +
                                            "<th>Hr Interv</th>" +
                                            "<th>Descri&ccedil;&atilde;o</th>" +
                                            "<th></th>" +
                                        "</tr>" +
                                    "</thead>" +
                                    "<tbody>";

        var tasks_footer =          "</tbody>" +
                                "</table>" +
                            "</td>" +
                        "</tr>";

        for (var i=0; i<items.length; i++){
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
                                        "<tr class='task'>" +
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
                                            "<td class='activity'>" + items[i].tasks[j].activity + "</td>" +
                                            "<td>" +
                                                "<div class='btn-group' data-toggle='buttons'>" +
                                                    "<label class='btn btn-primary active'>" +
                                                        "<input type='checkbox' autocomplete='off' class='check_send' checked>" +
                                                        "<span class='glyphicon glyphicon-ok'></span>" +
                                                    "</label>" +
                                                "</div>" +
                                            "</td>" +
                                        "</tr>";

            }

            linha = linha + tasks_head + items_agenda + tasks_footer;

        }
        $(".main_table tbody").append(linha);

        $("#email_agrupadas").val($("#resource").attr("email_agenda"));
        $("#email-cc_agrupadas").val("");

        $(".footer").addClass("hidden");

        $(".content").fadeOut( "fast", function() {
            $(".agendas_agrupadas").fadeIn("fast", function(){});
        });
    });
});

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
    if ($("#projeto-os").val() == ""){
        notify("Campos incorretos" + "!", "Campo Projeto n&atilde;o est&aacute; informado", "danger");
    }
    else if ($("#projeto-frente-os").val() == ""){
        notify("Campos incorretos" + "!", "Campo Frente n&atilde;o est&aacute; informado", "danger");
    }
    else if ($("#ticket").val() == ""){
        notify("Campos incorretos" + "!", "Campo Ticket n&atilde;o est&aacute; informado", "danger");
    }
    else{
        loading("show");
        $("#btn_agenda").attr("disabled", "disabled");
        $.ajax({
            url: "http://totvsjoi-hcm08.jv01.local:9090/task-manager/api/v1/agendas/request",
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
}

function fill_appointment_fields(){
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
        var date_calendar_month = moment(date_calendar ).format('MM');

        var date_calendar_fin = new Date(date_calendar_year, date_calendar_month, 0);

        var dt_ini = date_calendar_year + "-" + date_calendar_month + "-01";
        var dt_fin = date_calendar_year + "-" + date_calendar_month + "-" + date_calendar_fin.getDate();

        $.ajax({
            url: "http://totvsjoi-hcm08.jv01.local:9090/pool-reader/api/rest/planning?allocationTypes=EM,FE,FN,PL,PV,RP&allocations=EM&allocations=FE&allocations=FN&allocations=PL&allocations=PV&allocations=RP&finalDate=" + dt_fin + "&initialDate=" + dt_ini + "&issue=&login=&name=&ociosity=false&resources=" + $("#resource").attr("code") + "&teams=",
            dataType: "json",
            success: function(activityPool) {
                var event;
                for (var i = 0; i < activityPool.plannings.length; i++){

                    event = {title: activityPool.plannings[i].resumo,
                             start: activityPool.plannings[i].inicio,
                             end: activityPool.plannings[i].termino + "T10:00:00.0+0100",
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
        url: "http://totvsjoi-hcm08.jv01.local:9090/pool-reader/api/rest/planning/load?date=" + date + "&username=" + $("#resource").attr("code"),
        dataType: "json",
        success: function(activity) {
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

                    loading("hide");

                    break;
                }
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
        url: "http://totvsjoi-hcm08.jv01.local:9090/task-manager/api/v1/parameters?name=AGENDA_REQUEST_MAIL_TO",
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
