var sleep = 2000;var store_code='00';function loadApointment(inject_customer, inject_name_customer, inject_project, inject_front, inject_produto, inject_local, inject_des_activity, inject_date){$('#data-os').val(inject_date);ecustomers.add(inject_customer, inject_name_customer, null, store_code);if ($('#cliente-os option[value='+ inject_customer + '-' + store_code +']').length == 0){$('#cliente-os').append($('<option>', {value:inject_customer + '-' + store_code, text:inject_name_customer}));};$('#cliente-os').val(inject_customer + '-' + store_code);pmswidget.changeCustomer('#cliente-os', null);setTimeout(function(){$('#projeto-os').val(inject_project);pmswidget.changeProject('#projeto-os', null);setTimeout(function(){$('#projeto-frente-os').val(inject_front);pmswidget.changeFront('#projeto-frente-os', null);/*$('#produto-frente-os').val(inject_produto);*/$('#local-atendimento-os').val(inject_local);pmswidget.changelocal('#local-atendimento-os', null);$('#atividades-os').val(inject_des_activity);if(inject_customer == 'T55140'){$('#email-aprovador').val('ldayer@supergasbras.com.br');}}, sleep);}, sleep);}
