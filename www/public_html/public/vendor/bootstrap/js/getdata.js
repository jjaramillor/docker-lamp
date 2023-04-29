const color_ini = '#E94235';
const color_proc = '#FABB05';
const color_satis = '#73B4B9';

function get_nivel_evaluacion(obj, id_item) {
	
	event.preventDefault();
    var id_nivel = obj.value;

    var evaluaciones = new Array();
    evaluaciones[1] = ['1,7|Comunicacion', '2,8|Matematica'];
    evaluaciones[2] = ['3,9|Comunicacion', '4,10|Matematica', '5,11|Ciencias Sociales', '6,12|Ciencia y Tecnologia'];

    var arr_eval = evaluaciones[id_nivel];
    var html_eval = "<option value=''>(SELECCIONA UN AREA)</option>";
    //var html_eval="";
    for (var mx in arr_eval) {
        let id_arr = arr_eval[mx].split("|");

        html_eval += "<option value='"+id_arr[0]+"' >"+id_arr[1]+"</option>";
    }
    $("#"+id_item).empty().append(html_eval);

}


function getData(ulr_data, url_data_detalle) {
	event.preventDefault();
    var colegio = $("#cmbColegio").val();
    var niveles = $("#cmbniveles").val();
    var area = $("#cmbarea").val();
    var grado = $("#cmbgrado").val();
    var seccion = $("#cmbseccion").val();
    if (colegio == 0 || colegio == "") {
        $("#cmbColegio").focus();
        show_mensaje("Información Requerida", "Ingrese Nombre de Colegio", "question");
        return false;
    }
    if (niveles == 0 || niveles == "") {
        $("#cmbniveles").focus();
        show_mensaje("Información Requerida", "Ingrese Nivel", "question");
        return false;
    }
    if (area == 0 || area == "") {
        $("#cmbarea").focus();
        show_mensaje("Información Requerida", "Ingrese Área", "question");
        return false;
    }
    if (grado == 0 || grado == "") {
        $("#cmbgrado").focus();
        show_mensaje("Información Requerida", "Ingrese Grado", "question");
        return false;
    }

    var parametros = {
        colegio: colegio,
        niveles: niveles,
        area: area,
        grado: grado,
        seccion: seccion
    };
    //////////////
    $.ajax({
        url: ulr_data,
        method: "POST",
        dataType: 'json',
        data: parametros,
        success: function(datos) {
            if (datos.length > 0) {
                $("#contenedor").show();
                $("#btnExportar").show();
                var array_datos = datos;
                var preguntas = {},
                    respuestas = {},
                    resultados = {},
                    competencias = {},
                    competencias_preguntas = {},
                    total = 0,
                    total_colspan = 0;
                $.each(array_datos, function(index, val) {
                    preg = val['pregunta'];
                    resp = val['respuesta'];
                    resp = (resp == "" || resp == null) ? "O" : resp
                    compet = val['competencias'];

                    if (!preguntas[preg]) {
                        preguntas[preg] = 0;
                    }
                    preguntas[preg] += +1;
                    if (!respuestas[resp]) {
                        respuestas[resp] = 0;
                    }
                    respuestas[resp] += +1;
                    if (!competencias[compet]) {
                        competencias[compet] = 0;
                    }
                    competencias[compet] += +1;
                    if (!competencias_preguntas[compet + '|' + preg]) {
                        competencias_preguntas[compet + '|' + preg] = 0;
                    }
                    competencias_preguntas[compet + '|' + preg] += +1;
                    if (!resultados[preg + '|' + resp]) {
                        total++;
                        resultados[preg + '|' + resp] = 0;
                    }
                    resultados[preg + '|' + resp] += +1;

                });
                respuestas = order_items(respuestas, '');
                //----------------PINTADO RESULTADO CUADRO 1
                var rst = "",
                    rst_1 = "";
                rst += "<div class='table-responsive'>";
                rst += "<table class='table table-bordered text-center' id='tabla'>";
                rst += "<thead>";
                rst += "<tr>";
                rst += "<th class='text-uppercase color_tabla size_letra_1' >COMPETENCIA</th>";
                rst_1 += "<th class='text-uppercase color_tabla size_letra_2' >RESUMEN DE LAS RESPUESTAS </th>";
                for (var cmp in competencias) {
                    var cols_span = 0;
                    for (var prg in competencias_preguntas) {

                        var prg_split = prg.split("|");
                        if ($.trim(cmp) === $.trim(prg_split[0])) {
                            cols_span++;
                            rst_1 += "<th class='text-uppercase text-center color_tabla size_letra_2'>";
                            rst_1 += $.trim(prg_split[1]);
                            rst_1 += "</th>";
                        }
                    }
                    rst += "<th class='text-uppercase color_tabla size_letra_1'  colspan='" + cols_span + "'>" + cmp + "</th>";
                }
                rst += "</tr>";
                rst += "<tr>";
                rst += rst_1;
                rst += "</tr>";
                rst += "</thead>";
                rst += "<tbody>";
                // ;
                for (var rpta in respuestas) {
                    rst += "<tr>";
                    rst += "<td class='text-center color_tabla size_letra_1' >" + rpta + "</td>";
                    for (prg in competencias_preguntas) {
                        var split_detalle = prg.split("|");
                        var reslt = (resultados[split_detalle[1] + "|" + rpta] == undefined) ? 0 : resultados[split_detalle[1] + "|" + rpta];
                        rst += "<td class='text-center size_letra_3'>";
                        //rst+=reslt;
                        if (reslt != 0) {
                            rst += "<button type='button' class='btn btn-sm btn-light' data-toggle='modal' data-target='#detalleformmodal' ";
                            rst += "onclick=\"get_detalle('" + split_detalle[0] + "','" + split_detalle[1] + "','','','" + url_data_detalle + "','" + rpta + "')\">";
                            rst += reslt + "</button>";
                        } else {
                            rst += "";
                        }
                        rst += "</td>";
                    }
                    rst += "</tr>";
                }
                //
                rst += "<tr>";
                rst += "<td class='text-center color_tabla size_letra_1' >TOTAL DEL AULA </td>";
                for (prg in preguntas) {
                    rst += "<td class='text-center size_letra_3'>" + preguntas[prg] + "</td>";
                }
                rst += "</tr>";
                rst += "</tbody>";
                rst += "</table>";
                $("#cuadro_1").empty().append(rst);
                //----------------PINTADO RESULTADO CUADRO 2 PORCENTAJES
                var rst1 = "";
                rst1 += "<table class='table table-bordered text-center' id='tabla_1'>";
                rst1 += "<thead>";
                rst1 += "<tr>";
                rst1 += "<th class='text-uppercase color_tabla size_letra_1'>PORCENTAJE  DE LAS RESPUESTAS  </th>";
                for (var prg in preguntas) {
                    rst1 += "<th class='text-uppercase text-center color_tabla size_letra_1'>";
                    rst1 += $.trim(prg);
                    rst1 += "</th>";
                }
                rst1 += "</tr>";

                rst1 += "</thead>";
                rst1 += "<tbody>";
                // ;
                for (var rpta in respuestas) {
                    rst1 += "<tr>";
                    rst1 += "<td class='text-center color_tabla size_letra_2'>" + rpta + "</td>";
                    for (prg in preguntas) {
                        var reslt = (resultados[prg + "|" + rpta] == undefined) ? 0 : resultados[prg + "|" + rpta];
                        var porc = (calc(reslt, preguntas[prg], '%', '2') != 0) ? calc(reslt, preguntas[prg], '%', '2') + " %" : "0.0 %";
                        rst1 += "<td class='text-center size_letra_2'>" + porc + "</td>";
                    }
                    rst1 += "</tr>";
                }
                //
                rst1 += "<tr>";
                rst1 += "<td class='text-center color_tabla size_letra_2'>TOTAL DEL AULA </td>";
                for (prg in preguntas) {
                    //rst1+="<td>"+preguntas[prg]+"</td>";
                    rst1 += "<td class='text-center size_letra_3'>100 %</td>";
                }
                rst1 += "</tr>";
                rst1 += "</tbody>";
                rst1 += "</table>";
                rst1 += "</div>";
                $("#cuadro_2").empty().append(rst1);

            } else {
                $("#contenedor").hide();
                $("#btnExportar").hide();
                show_mensaje('No se encontró Información', 'Con los filtros ingresados', 'info');
            }
        }
    });
}

function getData2(ulr_data, url_data_detalle) {
    var colegio = $("#cmbColegio").val();
    var niveles = $("#cmbniveles").val();
    var area = $("#cmbarea").val();
    var grado = $("#cmbgrado").val();
    var seccion = $("#cmbseccion").val();
    if (colegio == 0 || colegio == "") {
        $("#cmbColegio").focus();
        show_mensaje("Información Requerida", "Ingrese Nombre de Colegio", "question");
        return false;
    }
    if (niveles == 0 || niveles == "") {
        $("#cmbniveles").focus();
        show_mensaje("Información Requerida", "Ingrese Nivel", "question");
        return false;
    }
    if (area == 0 || area == "") {
        $("#cmbarea").focus();
        show_mensaje("Información Requerida", "Ingrese Área", "question");
        return false;
    }
    if (grado == 0 || grado == "") {
        $("#cmbgrado").focus();
        show_mensaje("Información Requerida", "Ingrese Grado", "question");
        return false;
    }

    var parametros = {
        colegio: colegio,
        niveles: niveles,
        area: area,
        grado: grado,
        seccion: seccion
    };
    $.ajax({
        url: ulr_data,
        method: "POST",
        dataType: 'json',
        data: parametros,
        success: function(datos) {
            if (datos.length > 0) {
                $("#contenedor").show();
                $("#btnExportar").show();
                var array_datos = datos;
                var preguntas = {},
                    respuestas = {},
                    resultados = {},
                    competencias = {},
                    competencias_preguntas = {},
                    total = 0,
                    total_colspan = 0;
                var correctas = {},
                    correcta_resumen = {};
                $.each(array_datos, function(index, val) {
                    preg = val['pregunta'];
                    resp = val['respuesta'];
                    compet = val['competencias'];
                    correct = val['correcta'];

                    if (!preguntas[preg]) {
                        preguntas[preg] = 0;
                    }
                    preguntas[preg] += +1;
                    if (!respuestas[resp]) {
                        respuestas[resp] = 0;
                    }
                    respuestas[resp] += +1;
                    if (!competencias[compet]) {
                        total_colspan++;
                        competencias[compet] = 0;
                    }
                    competencias[compet] += +1;
                    if (!competencias_preguntas[compet + '|' + preg]) {
                        competencias_preguntas[compet + '|' + preg] = 0;
                    }
                    competencias_preguntas[compet + '|' + preg] += +1;
                    if (!resultados[preg + '|' + resp]) {
                        total++;
                        resultados[preg + '|' + resp] = 0;
                    }
                    resultados[preg + '|' + resp] += +1;
                    ///---------correctas
                    if (correct == resp) {
                        if (!correctas[compet + '|' + preg + '|C']) {
                            correctas[compet + '|' + preg + '|C'] = 0;
                        }
                        correctas[compet + '|' + preg + '|C'] += +1;
                        if (!correcta_resumen[compet + '|C']) {
                            correcta_resumen[compet + '|C'] = 0;
                        }
                        correcta_resumen[compet + '|C'] += +1;
                    } else if (resp == '' || resp == null) {
                        if (!correctas[compet + '|' + preg + '|O']) {
                            correctas[compet + '|' + preg + '|O'] = 0;
                        }
                        correctas[compet + '|' + preg + '|O'] += +1;

                        if (!correcta_resumen[compet + '|O']) {
                            correcta_resumen[compet + '|O'] = 0;
                        }
                        correcta_resumen[compet + '|O'] += +1;
                    } else if (correct != resp && (resp != '' || resp != null)) {
                        if (!correctas[compet + '|' + preg + '|I']) {
                            correctas[compet + '|' + preg + '|I'] = 0;
                        }
                        correctas[compet + '|' + preg + '|I'] += +1;

                        if (!correcta_resumen[compet + '|I']) {
                            correcta_resumen[compet + '|I'] = 0;
                        }
                        correcta_resumen[compet + '|I'] += +1;
                    }

                });
                respuestas = order_items(respuestas, '');
                //----------------PINTADO RESULTADO CUADRO 1
                var head_correctas = {
                    'C': 'correctas',
                    'I': 'incorrectas',
                    'O': 'omitidas'
                }
                var rst = "",
                    rst_1 = "";
                rst += "<div class='table-responsive'>";
                rst += "<table class='table table-bordered text-center'>";
                rst += "<thead>";
                rst += "<tr>";
                rst += "<th class='text-uppercase color_tabla size_letra_1' rowspan=2 ></th>";
                for (var cmp in competencias) {
                    var cols_span = 0;
                    for (var prg in competencias_preguntas) {
                        var prg_split = prg.split("|");
                        if ($.trim(cmp) === $.trim(prg_split[0])) {
                            cols_span++;
                            rst_1 += "<th class='text-uppercase text-center color_tabla size_letra_2'>";
                            rst_1 += $.trim(prg_split[1]);
                            rst_1 += "</th>";
                        }
                    }
                    rst += "<th class='text-uppercase text-center color_tabla size_letra_1' colspan='" + cols_span + "' >" + cmp + "</th>";
                }
                rst += "</tr>";
                rst += "<tr>";
                rst += rst_1;
                rst += "</tr>";
                rst += "</thead>";
                rst += "<tbody>";
                // ;
                for (var rpta in head_correctas) {
                    rst += "<tr>";
                    rst += "<td class='text-uppercase text-center color_tabla size_letra_2' >" + head_correctas[rpta] + "</td>";
                    for (var prg in competencias_preguntas) {
                        var split_detalle = prg.split("|");
                        var valor_prg = (correctas[prg + '|' + rpta] == undefined) ? 0 : correctas[prg + '|' + rpta];
                        rst += "<td class='text-center' style='font-size: 0.599em;font-family: cursive;'>";
                        //rst+=valor_prg;
                        if (valor_prg != 0) {
                            rst += "<button type='button' class='btn btn-sm btn-light' data-toggle='modal' data-target='#detalleformmodal' ";
                            rst += "onclick=\"get_detalle('" + split_detalle[0] + "','" + split_detalle[1] + "','','" + rpta + "','" + url_data_detalle + "')\">";
                            rst += valor_prg + "</button>";
                        } else {
                            rst += "";
                        }
                        rst += "</td>";

                    }
                    rst += "</tr>";
                }
                //
                rst += "<tr>";
                rst += "<td class='text-center color_tabla size_letra_2' >TOTAL DEL AULA </td>";
                for (prg in preguntas) {
                    rst += "<td class='text-center size_letra_3'>" + preguntas[prg] + "</td>";
                }
                rst += "</tr>";
                rst += "</tbody>";
                rst += "</table>";
                $("#cuadro_3").empty().append(rst);
                //----------------PINTADO RESULTADO CUADRO 2 PORCENTAJES
                var header_cabe = {};
                var cabecera = new Array();
                var array_correctas = new Array();
                var array_valor = new Array();
                var rst1 = "";
                rst1 += "<table class='table table-bordered text-center'>";
                rst1 += "<thead>";
                rst1 += "<tr>";
                rst1 += "<th class='text-uppercase color_tabla size_letra_1' ></th>";
                rst1 += "<th class='text-uppercase text-center color_tabla size_letra_1'  colspan='" + total_colspan + "'>RESUMEN</th>";
                rst1 += "</tr>";

                rst1 += "<tr>";
                rst1 += "<th class='text-uppercase text-center color_tabla size_letra_2' >Competencias</th>";
                for (var prg in competencias) {
                    rst1 += "<th class='text-uppercase text-center color_tabla size_letra_2' >";
                    rst1 += $.trim(prg);
                    rst1 += "</th>";
                }
                rst1 += "</tr>";

                rst1 += "</thead>";
                rst1 += "<tbody>";
                // ;
                for (var rpta in head_correctas) {
                    rst1 += "<tr>";
                    rst1 += "<td class='text-uppercase color_tabla size_letra_2' >" + head_correctas[rpta] + "</td>";
                    for (var prg in competencias) {
                        var split_detalle = prg.split("|");
                        var valor_prg = (correcta_resumen[prg + '|' + rpta] == undefined) ? 0 : correcta_resumen[prg + '|' + rpta];
                        rst1 += "<td class='text-center size_letra_2' >";
                        //rst1+=valor_prg;
                        if (valor_prg != 0) {
                            rst1 += "<button type='button' class='btn btn-sm btn-light' data-toggle='modal' data-target='#detalleformmodal' ";
                            rst1 += "onclick=\"get_detalle('" + split_detalle[0] + "','','','" + rpta + "','" + url_data_detalle + "')\">";
                            rst1 += valor_prg + "</button>";
                        } else {
                            rst1 += "";
                        }
                        rst1 += "</td>";
                    }
                    rst1 += "</tr>";
                }
                //
                rst1 += "<tr>";
                rst1 += "<td class='text-uppercase color_tabla size_letra_2' >TOTAL DEL AULA </td>";
                for (prg in competencias) {
                    cabecera.push(prg);
                    rst1 += "<td class='text-center size_letra_2' >";
                    //rst1+=competencias[prg];
                    rst1 += "<button type='button' class='btn btn-sm btn-info' data-toggle='modal' data-target='#detalleformmodal' ";
                    rst1 += "onclick=\"get_detalle('" + prg + "','','','','" + url_data_detalle + "')\">";
                    rst1 += competencias[prg] + "</button>";
                    rst1 += "</td>";
                }
                rst1 += "</tr>";
                rst1 += "</tbody>";
                rst1 += "</table>";
                rst1 += "</div>";
                $("#cuadro_4").empty().append(rst1);
                var array_name = [];
                var array_data = [];
                var array_name_inc = [];
                var array_data_inc = [];
                var array_name_omi = [];
                var array_data_omi = [];
                for (var head in head_correctas) {
                    for (var prg in competencias) {
                        if (head === 'C') {
                            array_name = head_correctas[head];
                            array_data = array_data.concat((correcta_resumen[prg + "|" + head] == undefined) ? 0 : correcta_resumen[prg + "|" + head]);
                        } else if (head === 'I') {
                            array_name_inc = head_correctas[head];
                            array_data_inc = array_data_inc.concat((correcta_resumen[prg + "|" + head] == undefined) ? 0 : correcta_resumen[prg + "|" + head]);
                        } else if (head === 'O') {
                            array_name_omi = head_correctas[head];
                            array_data_omi = array_data_omi.concat((correcta_resumen[prg + "|" + head] == undefined) ? 0 : correcta_resumen[prg + "|" + head]);
                        }
                    }
                }
                array_correctas.push({
                    'name': array_name,
                    'data': array_data
                });
                array_correctas.push({
                    'name': array_name_inc,
                    'data': array_data_inc
                });
                array_correctas.push({
                    'name': array_name_omi,
                    'data': array_data_omi
                });
                mostra_grafico('cuadro_5', cabecera, array_correctas, 'RESUMEN COMPETENCIAS');
            } else {
                $("#contenedor").hide();
                $("#btnExportar").hide();
                show_mensaje('No se encontró Información', 'Con los filtros ingresados', 'info');
            }
        }
    });
}

function getCapacidades(ulr_data, url_data_detalle,perfil) {
	
	event.preventDefault();
    var colegio = $("#cmbColegio").val();
    var niveles = $("#cmbniveles").val();
    var area = $("#cmbarea").val();
    var grado = $("#cmbgrado").val();
    var seccion = $("#cmbseccion").val();
    var id_ugel = $("#cmbUgel").val();
    
    if(perfil!='1')
    {
        
         if (colegio == 0 || colegio == "") {
        $("#cmbColegio").focus();
        show_mensaje("Información Requerida", "Ingrese Nombre de Colegio", "question");
        return false;
         }
        if (niveles == 0 || niveles == "") {
            $("#cmbniveles").focus();
            show_mensaje("Información Requerida", "Ingrese Nivel", "question");
            return false;
        }
        if (area == 0 || area == "") {
            $("#cmbarea").focus();
            show_mensaje("Información Requerida", "Ingrese Área", "question");
            return false;
        }
        if (grado == 0 || grado == "") {
            $("#cmbgrado").focus();
            show_mensaje("Información Requerida", "Ingrese Grado", "question");
            return false;
        } 
        
    }
    else
    {
        
          if (niveles == 0 || niveles == "") {
            $("#cmbniveles").focus();
            show_mensaje("Información Requerida", "Ingrese Nivel", "question");
            return false;
        }
        if (area == 0 || area == "") {
            $("#cmbarea").focus();
            show_mensaje("Información Requerida", "Ingrese Área", "question");
            return false;
        }
    }
  

    var parametros = {
        id_ugel: id_ugel,
        colegio: colegio,
        niveles: niveles,
        area: area,
        grado: grado,
        seccion: seccion
    };
    $.ajax({
        url: ulr_data,
        method: "POST",
        dataType: 'json',
        data: parametros,
        success: function(datos) {
                var datos1=datos['data_grado1'];
                var datos2=datos['data_grado2'];
            if (datos1.length > 0) {
                $("#contenedor").show();
                $("#btnExportar").show();
                var array_data = datos1;
                var array_competencias = {},
                    arrya_preguntas = {},
                    array_capacidades = {},
                    array_capacidades_2 = {},
                    array_correctas = {},
                    array_correctas_2 = {};
                var array_capacidades_3 = {},
                    array_correctas_3 = {},
                    total_colspan = 0;
                    var array_preguntas_corr={};
                $.each(array_data, function(index, val) {
                    competencia = $.trim(val['competencias']);
                    pregunta = $.trim(val['pregunta']);
                    capacidad = $.trim(val['capacidades']);
                    respuesta = $.trim(val['respuesta']);
                    correcta = $.trim(val['correcta']);

                    if (!array_competencias[competencia]) {
                        array_competencias[competencia] = 0;
                    }
                    array_competencias[competencia] += +1;
                    if (!arrya_preguntas[competencia + "|" + pregunta]) {
                        arrya_preguntas[competencia + "|" + pregunta] = 0;
                    }
                    arrya_preguntas[competencia + "|" + pregunta] += +1;
                    if (!array_capacidades[competencia + "|" + pregunta + "|" + capacidad]) {
                        array_capacidades[competencia + "|" + pregunta + "|" + capacidad] = 0;
                    }
                    array_capacidades[competencia + "|" + pregunta + "|" + capacidad] += +1;
                    if (!array_capacidades_3[capacidad]) {
                        total_colspan++;
                        array_capacidades_3[capacidad] = 0;
                    }
                    array_capacidades_3[capacidad] += +1;
                    /*--------------------------------------------------------------- */
                    if (respuesta === correcta) {
                        /*Correctas */
                        if (!array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|C']) {
                            array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|C'] = 0;
                        }
                        array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|C'] += +1;
                        if (!array_correctas_2[competencia + '|' + capacidad + '|C']) {
                            array_correctas_2[competencia + '|' + capacidad + '|C'] = 0;
                        }
                        array_correctas_2[competencia + '|' + capacidad + '|C'] += +1;
                        if (!array_correctas_3[capacidad + '|C']) {
                            array_correctas_3[capacidad + '|C'] = 0;
                        }
                        array_correctas_3[capacidad + '|C'] += +1;
                        
                        if (!array_preguntas_corr[pregunta]) 
						 {                        
							array_preguntas_corr[pregunta] = 0;
						  }
						  array_preguntas_corr[pregunta] += +1;
						  
						  
                    } else if (respuesta == '' || respuesta == null) {
                        /*Omitidas */
                        if (!array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|O']) {
                            array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|O'] = 0;
                        }
                        array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|O'] += +1;
                        if (!array_correctas_2[competencia + '|' + capacidad + '|O']) {
                            array_correctas_2[competencia + '|' + capacidad + '|O'] = 0;
                        }
                        array_correctas_2[competencia + '|' + capacidad + '|O'] += +1;
                        if (!array_correctas_3[capacidad + '|O']) {
                            array_correctas_3[capacidad + '|O'] = 0;
                        }
                        array_correctas_3[capacidad + '|O'] += +1;
                    } else if (correcta != respuesta && (respuesta != '' || respuesta != null)) {
                        /*Incorrectas */
                        if (!array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|I']) {
                            array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|I'] = 0;
                        }
                        array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|I'] += +1;
                        if (!array_correctas_2[competencia + '|' + capacidad + '|I']) {
                            array_correctas_2[competencia + '|' + capacidad + '|I'] = 0;
                        }
                        array_correctas_2[competencia + '|' + capacidad + '|I'] += +1;
                        if (!array_correctas_3[capacidad + '|I']) {
                            array_correctas_3[capacidad + '|I'] = 0;
                        }
                        array_correctas_3[capacidad + '|I'] += +1;
                    }
                    /*--------------------------------------------------------------- */
                    if (!array_capacidades_2[competencia + "|" + capacidad]) {
                        array_capacidades_2[competencia + "|" + capacidad] = 0;
                    }
                    array_capacidades_2[competencia + "|" + capacidad] += +1;
                    /*--------------------------------------------------------------- */
                });
                
               /* console.log(array_correctas);
				console.log("---------");
				console.log(array_preguntas_corr);
				console.log("---------");*/
				
                /*----------------------------Cuadro 1---------------------------- */
                var html = "",
                    html_1 = "",
                    html_2 = "",
                    html_3 = "",
                    html_4 = "",
                    html_5 = "";
                var array_cabecera = [],
                    array_cabecera_2 = [];
                var head_correctas = {
                    'C': 'correctas',
                    'I': 'incorrectas',
                    'O': 'omitidas'
                }
                html += "<div class='table-responsive'>";
                html += "<table class='table table-ms table-bordered'>";
                html += "<thead>";
                html += "<tr>";
                html += "<th class='text-uppercase color_tabla size_letra_1' rowspan=2></th>";
                for (var ar_cmp in array_competencias) {
                    var cols_span = 0;
                    for (var ar_prg in arrya_preguntas) {
                        var prg_split = ar_prg.split("|");
                        if ($.trim(ar_cmp) === $.trim(prg_split[0])) {
                            cols_span++;
                            html_1 += "<th class='text-uppercase text-center color_tabla size_letra_2'>";
                            html_1 += $.trim(prg_split[1]);
                            html_1 += "</th>";
                        }
                        for (var ar_cap in array_capacidades) {
                            var ar_cap_split = ar_cap.split("|");
                            if ($.trim(ar_cap_split[0] + "|" + ar_cap_split[1]) === $.trim(ar_cmp + "|" + prg_split[1])) {
                                html_2 += "<th class='text-uppercase text-center color_tabla size_letra_2'>";
                                html_2 += $.trim(ar_cap_split[2]);
                                html_2 += "</th>";
                            }
                        }
                    }
                    html += "<th class='text-uppercase text-center color_tabla size_letra_1' colspan='" + cols_span + "'>" + ar_cmp + "</th>";
                }
                html += "</tr>";
                html += "<tr>";
                html += html_1;
                html += "</tr>";

                html += "<tr>";
                html += "<th class='text-uppercase text-center color_tabla size_letra_2'>Capacidades</th>";
                html += html_2;
                html += "</tr>";

                html += "</thead>";
                html += "<tbody>";
                for (var ar_rpta in head_correctas) {
                    html += "<tr>";
                    html += "<td class='text-uppercase text-center color_tabla size_letra_2'>" + head_correctas[ar_rpta] + "</td>";
                    for (var arr_cap in array_capacidades) {
                        var split_detalle = arr_cap.split("|");
                        var valor_prg = (array_correctas[arr_cap + '|' + ar_rpta] == undefined) ? 0 : array_correctas[arr_cap + '|' + ar_rpta];
                        html += "<td class='text-center size_letra_3'>";
                        //html+=valor_prg;
                        if (valor_prg != 0) {
                            html += "<button type='button' class='btn btn-sm btn-light' data-toggle='modal' data-target='#detalleformmodal' ";
                            html += "onclick=\"get_detalle('" + split_detalle[0] + "','" + split_detalle[1] + "','" + split_detalle[2] + "','" + ar_rpta + "','" + url_data_detalle + "')\">";
                            html += valor_prg + "</button>";
                        } else {
                            html += "";
                        }
                        html += "</td>";
                    }
                    html += "</tr>";
                }
                html += "<tr>";
                html += "<td class='text-center color_tabla size_letra_2'>TOTAL DEL AULA </td>";
                for (var ar_cap in array_capacidades) {
                    html += "<td class='text-center size_letra_3'>" + array_capacidades[ar_cap] + "</td>";
                }
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                html += "</div>";

                $("#cuadro_3").empty().append(html);
                /*----------------------------Cuadro 2---------------------------- */
                html_3 += "<div class='table-responsive'>";
                html_3 += "<table class='table table-md table-bordered'>";
                html_3 += "<thead>";
                html_3 += "<tr>";
                html_3 += "<th class='text-uppercase color_tabla size_letra_1'></th>";
                for (var ar_cmp in array_competencias) {
                    var cols_span = 0;
                    for (var ar_prg in array_capacidades_2) {
                        var prg_split = ar_prg.split("|");
                        if ($.trim(ar_cmp) === $.trim(prg_split[0])) {
                            cols_span++;
                            html_4 += "<th class='text-uppercase text-center color_tabla size_letra_2'>";
                            html_4 += $.trim(prg_split[1]);
                            html_4 += "</th>";
                        }
                    }
                    html_3 += "<th class='text-uppercase text-center color_tabla size_letra_1' colspan='" + cols_span + "'>" + ar_cmp + "</th>";
                }
                html_3 += "</tr>";
                html_3 += "<tr>";
                html_3 += "<th class='text-uppercase color_tabla size_letra_2'>Capacidades</th>";
                html_3 += html_4;
                html_3 += "</tr>";
                html_3 += "</thead>";
                html_3 += "<tbody>";
                html_3 += "<tr>";
                for (var ar_rpta in head_correctas) {
                    html_3 += "<tr>";
                    html_3 += "<td class='text-uppercase color_tabla size_letra_2'>" + head_correctas[ar_rpta] + "</td>";
                    for (var arr_cap in array_capacidades_2) {
                        array_cabecera_2.push($.trim(arr_cap));
                        var split_detalle = arr_cap.split("|");
                        var valor_prg = (array_correctas_2[arr_cap + '|' + ar_rpta] == undefined) ? 0 : array_correctas_2[arr_cap + '|' + ar_rpta];
                        html_3 += "<td class='text-center size_letra_3'>";
                        //html_3+=valor_prg
                        if (valor_prg != 0) {
                            html_3 += "<button type='button' class='btn btn-sm btn-light' data-toggle='modal' data-target='#detalleformmodal' ";
                            html_3 += "onclick=\"get_detalle('" + split_detalle[0] + "','','" + split_detalle[1] + "','" + ar_rpta + "','" + url_data_detalle + "')\">";
                            html_3 += valor_prg + "</button>";
                        } else {
                            html_3 += "";
                        }
                        html_3 += "</td>";
                    }
                    html_3 += "</tr>";
                }
                html_3 += "</tr>";
                html += "</tbody>";
                html_3 += "</table>";
                html_3 += "</div>";
                $("#cuadro_4").empty().append(html_3);
                /*----------------------------Cuadro 3---------------------------- */
                html_5 += "<div class='table-responsive'>";
                html_5 += "<table class='table table-bordered'>";
                html_5 += "<thead>";
                html_5 += "<tr>";
                html_5 += "<th class='text-uppercase color_tabla size_letra_1'></th>";
                html_5 += "<th class='text-uppercase text-center color_tabla size_letra_1' colspan='" + total_colspan + "'>RESUMEN DE LAS COMPETENCIAS SEGÚN LAS CAPACIDADES</th>";
                html_5 += "</tr>";
                html_5 += "<tr>";
                html_5 += "<th class='text-uppercase color_tabla size_letra_2'>Capacidades</th>";
                for (var arr_cap in array_capacidades_3) {
                    array_cabecera.push($.trim(arr_cap));
                    html_5 += "<th class='text-uppercase color_tabla size_letra_2'>" + $.trim(arr_cap) + "</th>";
                }
                html_5 += "</tr>";
                html_5 += "</thead>";
                html_5 += "<tbody>";
                html_5 += "<tr>";
                for (var ar_rpta in head_correctas) {
                    html_5 += "<tr>";
                    html_5 += "<td class='text-uppercase color_tabla size_letra_2'>" + head_correctas[ar_rpta] + "</td>";
                    for (var arr_cap in array_capacidades_3) {
                        var split_detalle = arr_cap.split("|");
                        var valor_prg = (array_correctas_3[arr_cap + '|' + ar_rpta] == undefined) ? 0 : array_correctas_3[arr_cap + '|' + ar_rpta];
                        html_5 += "<td class='text-center size_letra_3'>";
                        //html_5+=valor_prg;
                        if (valor_prg != 0) {
                            html_5 += "<button type='button' class='btn btn-sm btn-light' data-toggle='modal' data-target='#detalleformmodal' ";
                            html_5 += "onclick=\"get_detalle('','','" + split_detalle[0] + "','" + ar_rpta + "','" + url_data_detalle + "')\">";
                            html_5 += valor_prg + "</button>";
                        } else {
                            html_5 += "";
                        }
                        html_5 += "</td>";
                    }
                    html_5 += "</tr>";
                }
                html_5 += "</tr>";
                html_5 += "</tbody>";
                html_5 += "</table>";
                html_5 += "</div>";
                $("#cuadro_5").empty().append(html_5);
                /*----------------------------Cuadro Grafica 1---------------------------- */
                var array_name = [],
                    array_cuadro_1 = [],
                    array_name_2 = [],
                    array_cuadro_2 = [];
                var array_data = [],
                    array_data_2 = [];
                var array_name_inc = [],
                    array_name_inc_2 = [];
                var array_data_inc = [],
                    array_data_inc_2 = [];
                var array_name_omi = [],
                    array_name_omi_2 = [];
                var array_data_omi = [],
                    array_data_omi_2 = [];
                //=======================================
                for (var head in head_correctas) {
                    /*---cuadro 1 */
                    for (var arr_serie_3 in array_capacidades_3) {
                        if (head === 'C') {
                            array_name = head_correctas[head];
                            array_data = array_data.concat((array_correctas_3[arr_serie_3 + "|" + head] == undefined) ? 0 : array_correctas_3[arr_serie_3 + "|" + head]);
                        } else if (head === 'I') {
                            array_name_inc = head_correctas[head];
                            array_data_inc = array_data_inc.concat((array_correctas_3[arr_serie_3 + "|" + head] == undefined) ? 0 : array_correctas_3[arr_serie_3 + "|" + head]);
                        } else if (head === 'O') {
                            array_name_omi = head_correctas[head];
                            array_data_omi = array_data_omi.concat((array_correctas_3[arr_serie_3 + "|" + head] == undefined) ? 0 : array_correctas_3[arr_serie_3 + "|" + head]);
                        }
                    }
                    /*---cuadro 2 */
                    for (var arr_serie_2 in array_capacidades_2) {
                        if (head === 'C') {
                            array_name_2 = head_correctas[head];
                            array_data_2 = array_data_2.concat((array_correctas_2[arr_serie_2 + "|" + head] == undefined) ? 0 : array_correctas_2[arr_serie_2 + "|" + head]);
                        } else if (head === 'I') {
                            array_name_inc_2 = head_correctas[head];
                            array_data_inc_2 = array_data_inc_2.concat((array_correctas_2[arr_serie_2 + "|" + head] == undefined) ? 0 : array_correctas_2[arr_serie_2 + "|" + head]);
                        } else if (head === 'O') {
                            array_name_omi_2 = head_correctas[head];
                            array_data_omi_2 = array_data_omi_2.concat((array_correctas_2[arr_serie_2 + "|" + head] == undefined) ? 0 : array_correctas_2[arr_serie_2 + "|" + head]);
                        }
                    }
                }
                /*--------------------------Cuadro Grafica 1----------------------------------------------------- */
                array_cuadro_1.push({
                    'name': array_name,
                    'data': array_data
                });
                array_cuadro_1.push({
                    'name': array_name_inc,
                    'data': array_data_inc
                });
                array_cuadro_1.push({
                    'name': array_name_omi,
                    'data': array_data_omi
                });
                mostra_grafico('cuadro_6', array_cabecera, array_cuadro_1, 'RESUMEN DE LAS COMPETENCIAS SEGÚN LAS CAPACIDADES');
                /*--------------------------Cuadro Grafica 2----------------------------------------------------- */
                array_cuadro_2.push({
                    'name': array_name_2,
                    'data': array_data_2
                });
                array_cuadro_2.push({
                    'name': array_name_inc_2,
                    'data': array_data_inc_2
                });
                array_cuadro_2.push({
                    'name': array_name_omi_2,
                    'data': array_data_omi_2
                });
                mostra_grafico('cuadro_7', array_cabecera_2, array_cuadro_2, 'RESUMEN DE LAS CAPACIDADES POR CADA COMPETENCIAS')

                /*------------------------------------------------------- */

            }
            if (datos2.length > 0) {
                $("#contenedor").show();
                $("#btnExportar").show();
                var array_data = datos2;
                var array_competencias = {},
                    arrya_preguntas = {},
                    array_capacidades = {},
                    array_capacidades_2 = {},
                    array_correctas = {},
                    array_correctas_2 = {};
                var array_capacidades_3 = {},
                    array_correctas_3 = {},
                    total_colspan = 0;
                var array_preguntas_corr={};
                $.each(array_data, function(index, val) {
                    competencia = $.trim(val['competencias']);
                    pregunta = $.trim(val['pregunta']);
                    capacidad = $.trim(val['capacidades']);
                    respuesta = $.trim(val['respuesta']);
                    correcta = $.trim(val['correcta']);

                    if (!array_competencias[competencia]) {
                        array_competencias[competencia] = 0;
                    }
                    array_competencias[competencia] += +1;
                    if (!arrya_preguntas[competencia + "|" + pregunta]) {
                        arrya_preguntas[competencia + "|" + pregunta] = 0;
                    }
                    arrya_preguntas[competencia + "|" + pregunta] += +1;
                    if (!array_capacidades[competencia + "|" + pregunta + "|" + capacidad]) {
                        array_capacidades[competencia + "|" + pregunta + "|" + capacidad] = 0;
                    }
                    array_capacidades[competencia + "|" + pregunta + "|" + capacidad] += +1;
                    if (!array_capacidades_3[capacidad]) {
                        total_colspan++;
                        array_capacidades_3[capacidad] = 0;
                    }
                    array_capacidades_3[capacidad] += +1;
                    /*--------------------------------------------------------------- */
                    if (respuesta === correcta) {
                        /*Correctas */
                        if (!array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|C']) {
                            array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|C'] = 0;
                        }
                        array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|C'] += +1;
                        if (!array_correctas_2[competencia + '|' + capacidad + '|C']) {
                            array_correctas_2[competencia + '|' + capacidad + '|C'] = 0;
                        }
                        array_correctas_2[competencia + '|' + capacidad + '|C'] += +1;
                        if (!array_correctas_3[capacidad + '|C']) {
                            array_correctas_3[capacidad + '|C'] = 0;
                        }
                        array_correctas_3[capacidad + '|C'] += +1;

                        if (!array_preguntas_corr[pregunta])
                        {
                            array_preguntas_corr[pregunta] = 0;
                        }
                        array_preguntas_corr[pregunta] += +1;


                    } else if (respuesta == '' || respuesta == null) {
                        /*Omitidas */
                        if (!array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|O']) {
                            array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|O'] = 0;
                        }
                        array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|O'] += +1;
                        if (!array_correctas_2[competencia + '|' + capacidad + '|O']) {
                            array_correctas_2[competencia + '|' + capacidad + '|O'] = 0;
                        }
                        array_correctas_2[competencia + '|' + capacidad + '|O'] += +1;
                        if (!array_correctas_3[capacidad + '|O']) {
                            array_correctas_3[capacidad + '|O'] = 0;
                        }
                        array_correctas_3[capacidad + '|O'] += +1;
                    } else if (correcta != respuesta && (respuesta != '' || respuesta != null)) {
                        /*Incorrectas */
                        if (!array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|I']) {
                            array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|I'] = 0;
                        }
                        array_correctas[competencia + '|' + pregunta + '|' + capacidad + '|I'] += +1;
                        if (!array_correctas_2[competencia + '|' + capacidad + '|I']) {
                            array_correctas_2[competencia + '|' + capacidad + '|I'] = 0;
                        }
                        array_correctas_2[competencia + '|' + capacidad + '|I'] += +1;
                        if (!array_correctas_3[capacidad + '|I']) {
                            array_correctas_3[capacidad + '|I'] = 0;
                        }
                        array_correctas_3[capacidad + '|I'] += +1;
                    }
                    /*--------------------------------------------------------------- */
                    if (!array_capacidades_2[competencia + "|" + capacidad]) {
                        array_capacidades_2[competencia + "|" + capacidad] = 0;
                    }
                    array_capacidades_2[competencia + "|" + capacidad] += +1;
                    /*--------------------------------------------------------------- */
                });

                /* console.log(array_correctas);
                 console.log("---------");
                 console.log(array_preguntas_corr);
                 console.log("---------");*/

                /*----------------------------Cuadro 1---------------------------- */
                var html = "",
                    html_1 = "",
                    html_2 = "",
                    html_3 = "",
                    html_4 = "",
                    html_5 = "";
                var array_cabecera = [],
                    array_cabecera_2 = [];
                var head_correctas = {
                    'C': 'correctas',
                    'I': 'incorrectas',
                    'O': 'omitidas'
                }
                html += "<div class='table-responsive'>";
                html += "<table class='table table-ms table-bordered'>";
                html += "<thead>";
                html += "<tr>";
                html += "<th class='text-uppercase color_tabla size_letra_1' rowspan=2></th>";
                for (var ar_cmp in array_competencias) {
                    var cols_span = 0;
                    for (var ar_prg in arrya_preguntas) {
                        var prg_split = ar_prg.split("|");
                        if ($.trim(ar_cmp) === $.trim(prg_split[0])) {
                            cols_span++;
                            html_1 += "<th class='text-uppercase text-center color_tabla size_letra_2'>";
                            html_1 += $.trim(prg_split[1]);
                            html_1 += "</th>";
                        }
                        for (var ar_cap in array_capacidades) {
                            var ar_cap_split = ar_cap.split("|");
                            if ($.trim(ar_cap_split[0] + "|" + ar_cap_split[1]) === $.trim(ar_cmp + "|" + prg_split[1])) {
                                html_2 += "<th class='text-uppercase text-center color_tabla size_letra_2'>";
                                html_2 += $.trim(ar_cap_split[2]);
                                html_2 += "</th>";
                            }
                        }
                    }
                    html += "<th class='text-uppercase text-center color_tabla size_letra_1' colspan='" + cols_span + "'>" + ar_cmp + "</th>";
                }
                html += "</tr>";
                html += "<tr>";
                html += html_1;
                html += "</tr>";

                html += "<tr>";
                html += "<th class='text-uppercase text-center color_tabla size_letra_2'>Capacidades</th>";
                html += html_2;
                html += "</tr>";

                html += "</thead>";
                html += "<tbody>";
                for (var ar_rpta in head_correctas) {
                    html += "<tr>";
                    html += "<td class='text-uppercase text-center color_tabla size_letra_2'>" + head_correctas[ar_rpta] + "</td>";
                    for (var arr_cap in array_capacidades) {
                        var split_detalle = arr_cap.split("|");
                        var valor_prg = (array_correctas[arr_cap + '|' + ar_rpta] == undefined) ? 0 : array_correctas[arr_cap + '|' + ar_rpta];
                        html += "<td class='text-center size_letra_3'>";
                        //html+=valor_prg;
                        if (valor_prg != 0) {
                            html += "<button type='button' class='btn btn-sm btn-light' data-toggle='modal' data-target='#detalleformmodal' ";
                            html += "onclick=\"get_detalle('" + split_detalle[0] + "','" + split_detalle[1] + "','" + split_detalle[2] + "','" + ar_rpta + "','" + url_data_detalle + "')\">";
                            html += valor_prg + "</button>";
                        } else {
                            html += "";
                        }
                        html += "</td>";
                    }
                    html += "</tr>";
                }
                html += "<tr>";
                html += "<td class='text-center color_tabla size_letra_2'>TOTAL DEL AULA </td>";
                for (var ar_cap in array_capacidades) {
                    html += "<td class='text-center size_letra_3'>" + array_capacidades[ar_cap] + "</td>";
                }
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                html += "</div>";

                $("#cuadro_3_2").empty().append(html);
                /*----------------------------Cuadro 2---------------------------- */
                html_3 += "<div class='table-responsive'>";
                html_3 += "<table class='table table-md table-bordered'>";
                html_3 += "<thead>";
                html_3 += "<tr>";
                html_3 += "<th class='text-uppercase color_tabla size_letra_1'></th>";
                for (var ar_cmp in array_competencias) {
                    var cols_span = 0;
                    for (var ar_prg in array_capacidades_2) {
                        var prg_split = ar_prg.split("|");
                        if ($.trim(ar_cmp) === $.trim(prg_split[0])) {
                            cols_span++;
                            html_4 += "<th class='text-uppercase text-center color_tabla size_letra_2'>";
                            html_4 += $.trim(prg_split[1]);
                            html_4 += "</th>";
                        }
                    }
                    html_3 += "<th class='text-uppercase text-center color_tabla size_letra_1' colspan='" + cols_span + "'>" + ar_cmp + "</th>";
                }
                html_3 += "</tr>";
                html_3 += "<tr>";
                html_3 += "<th class='text-uppercase color_tabla size_letra_2'>Capacidades</th>";
                html_3 += html_4;
                html_3 += "</tr>";
                html_3 += "</thead>";
                html_3 += "<tbody>";
                html_3 += "<tr>";
                for (var ar_rpta in head_correctas) {
                    html_3 += "<tr>";
                    html_3 += "<td class='text-uppercase color_tabla size_letra_2'>" + head_correctas[ar_rpta] + "</td>";
                    for (var arr_cap in array_capacidades_2) {
                        array_cabecera_2.push($.trim(arr_cap));
                        var split_detalle = arr_cap.split("|");
                        var valor_prg = (array_correctas_2[arr_cap + '|' + ar_rpta] == undefined) ? 0 : array_correctas_2[arr_cap + '|' + ar_rpta];
                        html_3 += "<td class='text-center size_letra_3'>";
                        //html_3+=valor_prg
                        if (valor_prg != 0) {
                            html_3 += "<button type='button' class='btn btn-sm btn-light' data-toggle='modal' data-target='#detalleformmodal' ";
                            html_3 += "onclick=\"get_detalle('" + split_detalle[0] + "','','" + split_detalle[1] + "','" + ar_rpta + "','" + url_data_detalle + "')\">";
                            html_3 += valor_prg + "</button>";
                        } else {
                            html_3 += "";
                        }
                        html_3 += "</td>";
                    }
                    html_3 += "</tr>";
                }
                html_3 += "</tr>";
                html += "</tbody>";
                html_3 += "</table>";
                html_3 += "</div>";
                $("#cuadro_4_2").empty().append(html_3);
                /*----------------------------Cuadro 3---------------------------- */
                html_5 += "<div class='table-responsive'>";
                html_5 += "<table class='table table-bordered'>";
                html_5 += "<thead>";
                html_5 += "<tr>";
                html_5 += "<th class='text-uppercase color_tabla size_letra_1'></th>";
                html_5 += "<th class='text-uppercase text-center color_tabla size_letra_1' colspan='" + total_colspan + "'>RESUMEN DE LAS COMPETENCIAS SEGÚN LAS CAPACIDADES</th>";
                html_5 += "</tr>";
                html_5 += "<tr>";
                html_5 += "<th class='text-uppercase color_tabla size_letra_2'>Capacidades</th>";
                for (var arr_cap in array_capacidades_3) {
                    array_cabecera.push($.trim(arr_cap));
                    html_5 += "<th class='text-uppercase color_tabla size_letra_2'>" + $.trim(arr_cap) + "</th>";
                }
                html_5 += "</tr>";
                html_5 += "</thead>";
                html_5 += "<tbody>";
                html_5 += "<tr>";
                for (var ar_rpta in head_correctas) {
                    html_5 += "<tr>";
                    html_5 += "<td class='text-uppercase color_tabla size_letra_2'>" + head_correctas[ar_rpta] + "</td>";
                    for (var arr_cap in array_capacidades_3) {
                        var split_detalle = arr_cap.split("|");
                        var valor_prg = (array_correctas_3[arr_cap + '|' + ar_rpta] == undefined) ? 0 : array_correctas_3[arr_cap + '|' + ar_rpta];
                        html_5 += "<td class='text-center size_letra_3'>";
                        //html_5+=valor_prg;
                        if (valor_prg != 0) {
                            html_5 += "<button type='button' class='btn btn-sm btn-light' data-toggle='modal' data-target='#detalleformmodal' ";
                            html_5 += "onclick=\"get_detalle('','','" + split_detalle[0] + "','" + ar_rpta + "','" + url_data_detalle + "')\">";
                            html_5 += valor_prg + "</button>";
                        } else {
                            html_5 += "";
                        }
                        html_5 += "</td>";
                    }
                    html_5 += "</tr>";
                }
                html_5 += "</tr>";
                html_5 += "</tbody>";
                html_5 += "</table>";
                html_5 += "</div>";
                $("#cuadro_5_2").empty().append(html_5);
                /*----------------------------Cuadro Grafica 1---------------------------- */
                var array_name = [],
                    array_cuadro_1 = [],
                    array_name_2 = [],
                    array_cuadro_2 = [];
                var array_data = [],
                    array_data_2 = [];
                var array_name_inc = [],
                    array_name_inc_2 = [];
                var array_data_inc = [],
                    array_data_inc_2 = [];
                var array_name_omi = [],
                    array_name_omi_2 = [];
                var array_data_omi = [],
                    array_data_omi_2 = [];
                //=======================================
                for (var head in head_correctas) {
                    /*---cuadro 1 */
                    for (var arr_serie_3 in array_capacidades_3) {
                        if (head === 'C') {
                            array_name = head_correctas[head];
                            array_data = array_data.concat((array_correctas_3[arr_serie_3 + "|" + head] == undefined) ? 0 : array_correctas_3[arr_serie_3 + "|" + head]);
                        } else if (head === 'I') {
                            array_name_inc = head_correctas[head];
                            array_data_inc = array_data_inc.concat((array_correctas_3[arr_serie_3 + "|" + head] == undefined) ? 0 : array_correctas_3[arr_serie_3 + "|" + head]);
                        } else if (head === 'O') {
                            array_name_omi = head_correctas[head];
                            array_data_omi = array_data_omi.concat((array_correctas_3[arr_serie_3 + "|" + head] == undefined) ? 0 : array_correctas_3[arr_serie_3 + "|" + head]);
                        }
                    }
                    /*---cuadro 2 */
                    for (var arr_serie_2 in array_capacidades_2) {
                        if (head === 'C') {
                            array_name_2 = head_correctas[head];
                            array_data_2 = array_data_2.concat((array_correctas_2[arr_serie_2 + "|" + head] == undefined) ? 0 : array_correctas_2[arr_serie_2 + "|" + head]);
                        } else if (head === 'I') {
                            array_name_inc_2 = head_correctas[head];
                            array_data_inc_2 = array_data_inc_2.concat((array_correctas_2[arr_serie_2 + "|" + head] == undefined) ? 0 : array_correctas_2[arr_serie_2 + "|" + head]);
                        } else if (head === 'O') {
                            array_name_omi_2 = head_correctas[head];
                            array_data_omi_2 = array_data_omi_2.concat((array_correctas_2[arr_serie_2 + "|" + head] == undefined) ? 0 : array_correctas_2[arr_serie_2 + "|" + head]);
                        }
                    }
                }
                /*--------------------------Cuadro Grafica 1----------------------------------------------------- */
                array_cuadro_1.push({
                    'name': array_name,
                    'data': array_data
                });
                array_cuadro_1.push({
                    'name': array_name_inc,
                    'data': array_data_inc
                });
                array_cuadro_1.push({
                    'name': array_name_omi,
                    'data': array_data_omi
                });
                mostra_grafico('cuadro_6_2', array_cabecera, array_cuadro_1, 'RESUMEN DE LAS COMPETENCIAS SEGÚN LAS CAPACIDADES');
                /*--------------------------Cuadro Grafica 2----------------------------------------------------- */
                array_cuadro_2.push({
                    'name': array_name_2,
                    'data': array_data_2
                });
                array_cuadro_2.push({
                    'name': array_name_inc_2,
                    'data': array_data_inc_2
                });
                array_cuadro_2.push({
                    'name': array_name_omi_2,
                    'data': array_data_omi_2
                });
                mostra_grafico('cuadro_7_2', array_cabecera_2, array_cuadro_2, 'RESUMEN DE LAS CAPACIDADES POR CADA COMPETENCIAS')

                /*------------------------------------------------------- */

            }
             if(datos1.length==0 && datos2.length==0) {
                $("#contenedor").hide();
                $("#btnExportar").hide();
                show_mensaje('No se encontró Información', 'Con los filtros ingresados', 'info');
            }
        }
    });
}

function get_detalle(valor1, valor2, valor3, valor4, ulr_data, valor5) {
    var colegio = $("#cmbColegio").val();
    var niveles = $("#cmbniveles").val();
    var area = $("#cmbarea").val();
    var grado = $("#cmbgrado").val();
    var seccion = $("#cmbseccion").val();

    var parametros = {
        valor1: valor1,
        valor2: valor2,
        valor3: valor3,
        valor4: valor4,
        colegio: colegio,
        niveles: niveles,
        area: area,
        grado: grado,
        seccion: seccion,
        valor5: valor5
    };
    $.ajax({
        url: ulr_data,
        method: "POST",
        dataType: 'json',
        data: parametros,
        success: function(datos) {

            if (datos.length > 0) {
                var array_data = datos;
                var resultados = [];
                $.each(array_data, function(index, val) {
                    correcto = $.trim(val['correcta']);
                    respuesta = $.trim(val['respuesta']);

                    if (valor4 === 'C') {
                        if (respuesta === correcto) {
                            resultados.push({
                                'apellidos': val['apellidos'],
                                'nombres': val['nombres'],
                                'colegio': val['nom_colegio'],
                                'correcta': val['correcta'],
                                'pregunta': val['pregunta'],
                                'respuesta': val['respuesta'],
                                'nota': val['nota'],
                                'seccion': val['seccion']
                            });
                        }
                        //correcto!=respuesta && (respuesta!='' || respuesta!=null)
                    } else if (valor4 === 'O') {
                        if (respuesta == '' || respuesta == null) {
                            resultados.push({
                                'apellidos': val['apellidos'],
                                'nombres': val['nombres'],
                                'colegio': val['nom_colegio'],
                                'correcta': val['correcta'],
                                'pregunta': val['pregunta'],
                                'respuesta': val['respuesta'],
                                'nota': val['nota'],
                                'seccion': val['seccion']
                            });
                        }
                    } else if (valor4 === 'I') {
                        if (correcto != respuesta && (respuesta != '' || respuesta != null)) {
                            resultados.push({
                                'apellidos': val['apellidos'],
                                'nombres': val['nombres'],
                                'colegio': val['nom_colegio'],
                                'correcta': val['correcta'],
                                'pregunta': val['pregunta'],
                                'respuesta': val['respuesta'],
                                'nota': val['nota'],
                                'seccion': val['seccion']
                            });
                        }
                    } else {
                        resultados.push({
                            'apellidos': val['apellidos'],
                            'nombres': val['nombres'],
                            'colegio': val['nom_colegio'],
                            'correcta': val['correcta'],
                            'pregunta': val['pregunta'],
                            'respuesta': val['respuesta'],
                            'nota': val['nota'],
                            'seccion': val['seccion']
                        });
                    }

                });
                var html = "";
                var head = ['apellidos', 'nombres', 'colegio', 'seccion', 'pregunta', 'respuesta', 'correcta', 'nota'];
                html += "<div>";
                html += "<table class='table table-md table-bordered'>";
                html += "<thead class='text-center text-uppercase alert-primary table-bordered'>";
                html += "<tr>";
                for (var h in head) {
                    html += "<th>" + head[h] + "</th>";
                }
                html += "</tr>";
                html += "</thead>";
                html += "<tbody>";
                for (var i in resultados) {
                    html += "<tr>";
                    for (var h in head) {
                        html += "<td>" + resultados[i][head[h]] + "</td>";
                    }
                    html += "</tr>";
                }
                html += "</tbody>";
                html += "</table>";
                html += "</div>";
                $("#contenedor_detalle").empty().append(html);
            } else {

            }
        }
    });
}

function show_mensaje(text_1, text_2, icono) {
    Swal.fire(
        text_1,
        text_2,
        icono /*'question' warning */
    )
}

function mostra_grafico(cuadro, array_categoria, array_serie, text_title) {
    Highcharts.chart(cuadro, {
        chart: {
            type: 'column'
        },
        title: {
            text: text_title
        },
        xAxis: {
            categories: array_categoria
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Totales'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent'
            }
        },
        series: array_serie
    });
}
function get_periodo(){
    limpiarControles(0);
   /* var val_periodo=$("#cmb_periodo").val();
    alert(val_periodo);*/
}

function get_data_niveles(ulr_data, id) {
    var id_valor = 0,
        id_valor_1 = 0;
    var tabla = "";
    var columnas = "";
    var columna_filter = "",
        columna_filter_1 = "";
    var inner_join = "";
    var campo = "",
        nombre_campo = "";
    let colegio_id = 0;
    let id_nivel = 0;
    var periodo='';
    var multiperiodo=0;
    if (id == 0) {
        id_valor = $.trim($("#cmbUgel").val());
        id_valor_1 = "";
        tabla = 'colegios';
        columnas = "cod_local AS id ,nom_colegio AS descripcion";
        columna_filter = 'id_ugel';
        columna_filter_1 = "";
        inner_join = "";
        campo = "cmbColegio";
        nombre_campo = "UN COLEGIO";
    } else if (id == 1) {
        id_valor = $.trim($("#cmbColegio").val());
        id_valor_1 = "";
        tabla = 'colegios';
        columnas = "ni.idnivel AS id ,ni.nivel AS descripcion";
        columna_filter = 'cod_local';
        columna_filter_1 = "";
        inner_join = "INNER JOIN niveles ni ON colegios.id_nivel=ni.idnivel";
        campo = "cmbniveles";
        nombre_campo = "UN NIVEL";
    } else    if (id == 2) {
        id_valor = $.trim($("#cmbniveles").val());
        periodo=$.trim($("#cmb_periodo").val());
        if(periodo=='2022-2,2022-1'){
            multiperiodo=1;
        }
        id_valor_1 = "";
        tabla = 'evaluaciones';
        columnas = "evaluaciones.id_evaluacion AS id ,a.area AS descripcion";
        columna_filter = 'id_nivel';
        columna_filter_1 = "";
        inner_join = "inner JOIN areas a on evaluaciones.id_area=a.id_area";
        campo = "cmbarea";
        nombre_campo = "UNA ÁREA";
    } else     if (id == 3) {
        id_valor = $.trim($("#cmbarea").val());
        id_valor_1 = $.trim($("#cmbColegio").val());
        id_nivel = $.trim($("#cmbniveles").val());
        tabla = 'colegio_detalle';
        columnas = "grado AS id,grado AS descripcion";
        columna_filter = 'id_area';
        columna_filter_1 = 'id_colegio';
        inner_join = "";
        campo = "cmbgrado";
        nombre_campo = "UN GRADO";
    } else     if (id == 4) {
        id_valor = $.trim($("#cmbgrado").val());
        id_valor_1 = $.trim($("#cmbniveles").val());
        colegio_id = $.trim($("#cmbColegio").val());
        tabla = 'grado_seccion';
        columnas = "seccion AS id, seccion AS descripcion";
        columna_filter = 'grado';
        columna_filter_1 = 'idnivel';
        inner_join = "";
        campo = "cmbseccion";
        nombre_campo = "UNA SECCIÓN";
    }
    if (id_valor == "" || id_valor == 0) {
        return false;
    }
    $.ajax({
        url: ulr_data,
        method: "POST",
        dataType: 'json',
        data: {
            'id_valor': id_valor,
            'tabla': tabla,
            'columnas': columnas,
            'columna_filter': columna_filter,
            'id_valor_1': id_valor_1,
            'columna_filter_1': columna_filter_1,
            'inner_join': inner_join,
            'colegio_id': colegio_id,
            'id_nivel': id_nivel,
            'periodo': periodo
        },
        success: function(datos) {
            $("#" + campo).empty();
            var select_option = "";
            var objDescrip=[];
            if (datos.length > 0) {
                select_option += "<option value=''>(SELECCIONA " + nombre_campo + ")</option>";

                var  descrip='';
                var  id='';
                for (var i in datos) {
                      descrip=datos[i]['descripcion'];
                     id=datos[i]['id'];
                     if(multiperiodo==1){
                         var  descripcion={ };
                         descripcion["descripcion"] = descrip;
                         descripcion["id"] = id;
                         var flag=0;
                         for(var mx in objDescrip)
                         {
                             if(objDescrip[mx].descripcion==descrip){
                                 var  id1=objDescrip[mx].id+","+id;
                                 objDescrip[mx].id=id1;
                                 flag=1;
                             }

                         }
                         if(flag==0)
                         {
                             objDescrip.push(descripcion);
                         }

                     }
                    select_option += "<option value='" + id + "'>" + descrip + "</option>";
                }
                if(multiperiodo==1){
                    select_option="";
                    select_option += "<option value=''>(SELECCIONA " + nombre_campo + ")</option>";
                    $.each(objDescrip, function(index, val) {
                        select_option += "<option value='" + val.id + "'>" + val.descripcion + "</option>";
                    });

                }
                $("#" + campo).append(select_option);
            } else {
                select_option += "<option value=''>(SELECCIONA " + nombre_campo + ") </option>";
                $("#" + campo).append(select_option);
            }
        }
    });
    limpiarControles(id);
}

function limpiarControles(id) {
    if (id === 0) {
      //  $("#cmbarea").find('option').not(':first').remove();
        //document.getElementById('cmbarea').selectedIndex = 0;
        $("#cmbarea").prop('selectedIndex',0);
        //$("#cmbniveles").prop('selectedIndex',0);
        $("#cmbgrado").prop('selectedIndex',0);
        $("#cmbseccion").prop('selectedIndex',0);
        $("#cmbniveles").prop('selectedIndex',0);
    }
    if (id === 1) {
        $("#cmbarea").find('option').not(':first').remove();
        $("#cmbgrado").find('option').not(':first').remove();
        $("#cmbseccion").find('option').not(':first').remove();
    } else if (id === 2) {
        $("#cmbgrado").find('option').not(':first').remove();
        $("#cmbseccion").find('option').not(':first').remove();
    } else if (id === 3) {
        $("#cmbseccion").find('option').not(':first').remove();
    }
}

function getNotas(ulr_data) {
    var ugel = $("#cmbUgel").val();
    var colegio = $("#cmbColegio").val();
    var niveles = $("#cmbniveles").val();
    var area = $("#cmbarea").val();
    var grado = $("#cmbgrado").val();
    var seccion = $("#cmbseccion").val();
    if (colegio == 0 || colegio == "") {
        $("#cmbColegio").focus();
        show_mensaje("Información Requerida", "Ingrese Nombre de Colegio", "question");
        return false;
    }
    if (niveles == 0 || niveles == "") {
        $("#cmbniveles").focus();
        show_mensaje("Información Requerida", "Ingrese Nivel", "question");
        return false;
    }
    if (area == 0 || area == "") {
        $("#cmbarea").focus();
        show_mensaje("Información Requerida", "Ingrese Área", "question");
        return false;
    }
    /* if(grado==0 || grado==""){
         $("#cmbgrado").focus();
         show_mensaje("Información Requerida","Ingrese Grado","question");
         return false;
     }*/
    var parametros = {
        colegio: colegio,
        ugel: ugel,
        niveles: niveles,
        area: area,
        grado: grado,
        seccion: seccion
    };
    $.ajax({
        url: ulr_data,
        method: "POST",
        dataType: 'json',
        data: parametros,
        success: function(datos) {
            var html = "",
                html_1 = "";
            if (datos.length > 0) {
                var array_datos = datos;
                var lista_grados = {
                    '1': '1er',
                    '2': '2do',
                    '3': '3er',
                    '4': '4to',
                    '5': '5to',
                    '6': '6to'
                };
                var cabecera = [],
                    array_alumno = [],
                    arry_preguntas = [],
                    array_resumen = [],
                    array_preg_resp = [],
                    array_nota = [];
                $.each(array_datos, function(index, val) {
                    colegio = $.trim(val['nom_colegio'] + '*' + val['grado'] + '*' + val['seccion']);
                    alumno = $.trim(val['nombre']);
                    pregunta = $.trim(val['pregunta']);
                    respuesta = $.trim(val['respuesta']);
                    nota = $.trim(val['nota']);
                    if (!cabecera[colegio]) {
                        cabecera[colegio] = 0;
                    }
                    cabecera[colegio] += +1;
                    if (!array_alumno[colegio + "|" + alumno]) {
                        array_alumno[colegio + "|" + alumno] = 0;
                    }
                    array_alumno[colegio + "|" + alumno] += +1;
                    if (!arry_preguntas[colegio + "|" + pregunta]) {
                        arry_preguntas[colegio + "|" + pregunta] = 0;
                    }
                    arry_preguntas[colegio + "|" + pregunta] += +1;
                    if (!array_resumen[colegio + "|" + alumno + "|" + pregunta]) {
                        array_resumen[colegio + "|" + alumno + "|" + pregunta] = 0;
                    }
                    array_resumen[colegio + "|" + alumno + "|" + pregunta] = respuesta;
                    if (!array_nota[colegio + "|" + alumno]) {
                        array_nota[colegio + "|" + alumno] = 0;
                    }
                    array_nota[colegio + "|" + alumno] = nota;
                });
                var colspan = 0;

                cabecera = order_items(cabecera, '');
                html += "<div class='table-responsive'>";
                html += "<table class='table table-md table-bordered'>";
                /*--------------------------------------------------------------- */
                html += "<thead>";
                for (var c in cabecera) {
                    var split_c = c.split("*");
                    html += "<tr>";
                    html += "<th class='color_tabla'>COLEGIO</th>";
                    html += "<th class='color_tabla'>" + split_c[0] + "&nbsp;&nbsp;&nbsp;" + lista_grados[split_c[1]] + "&nbsp;&nbsp;&nbsp;GRADO &nbsp;&nbsp;" + split_c[2] + "</th>";
                    html += "<tr>";
                    html += "<td class='color_tabla size_letra_2'>ITEMS</td>";
                    html += "<td class='color_tabla size_letra_2'>NOMBRES Y APELLIDOS </td>";
                    for (var ar in arry_preguntas) {
                        var split_ar = ar.split("|");
                        if ($.trim(c) === $.trim(split_ar[0])) {
                            html += "<td class='color_tabla size_letra_2'>" + split_ar[1] + "</td>";
                        }
                    }
                    html += "<td class='color_tabla size_letra_2'>NOTA</td>";
                    html += "</tr>";
                    var cnt = 0;
                    var color_celda = "";
                    var i_celda = 0;
                    for (var a in array_alumno) {
                        var split_a = a.split("|");
                        if ($.trim(c) === $.trim(split_a[0])) {
                            cnt++;
                            color_celda = (cnt % 2 == 0) ? "color: #818182;background-color: #f9f9f9;border-color: #e9e5e5;" : "";
                            html += "<tr style='" + color_celda + "'>";
                            html += "<td>" + cnt + "</td>";
                            html += "<td>" + split_a[1] + "</td>";
                            for (var ar in arry_preguntas) {
                                var split_re = ar.split("|");
                                if ($.trim(c) === $.trim(split_re[0])) {
                                    var resumen = (array_resumen[$.trim(c) + "|" + split_a[1] + "|" + split_re[1]] != undefined) ? array_resumen[$.trim(c) + "|" + split_a[1] + "|" + split_re[1]] : "";
                                    html += "<td class='size_letra_2'>" + resumen + "</td>";
                                }
                            }
                            html += "<td>" + array_nota[$.trim(a)] + "</td>";
                            html += "</tr>";
                        }
                    }
                    html += "</tr>";
                }
                html += "</thead>";
                /*--------------------------------------------------------------- */
                html += "</table>";
                html += "</div>";

                $("#cuadro_1").empty().append(html);
                $("#contenedor").show();
                $("#btnExportar").show();
            } else {
                $("#contenedor").hide();
                $("#btnExportar").hide();
                show_mensaje('No se encontró Información', 'Con los filtros ingresados', 'info');
            }
        }
    });
}

function getAvance(ulr_data) {
    var ugel = $("#cmbUgel").val();
    var colegio = $("#cmbColegio").val();
    var parametros = {
        colegio: colegio,
        ugel: ugel
    };
    $.ajax({
        url: ulr_data,
        method: "POST",
        dataType: 'json',
        data: parametros,
        success: function(dato) {
            var datos1 = dato['data_grado1'];
            var datos2 = dato['data_grado2'];
            var datos_T1 = dato['data_T1'];
            var datos_T2 = dato['data_T2'];

            if (datos1.length > 0) {
                var total_registros = 0
                total_registros = datos1.length;
                var array_datos = datos1;
                var array_datos_T = datos_T1;
                var array_ugel = Array(),
                    array_colegio = Array(),
                    array_ugel_cole = Array();
                $.each(array_datos, function(index, val) {
                    ugel = $.trim(val['nom_ugel']);
                    colegio = $.trim(val['nom_colegio']);
                    alumno = $.trim(val['id_alumno']);
                    if (!array_ugel[ugel]) {
                        array_ugel[ugel] = 0;
                    }
                    array_ugel[ugel] += +1;
                    if (!array_colegio[colegio]) {
                        array_colegio[colegio] = 0;
                    }
                    array_colegio[colegio] += +1;
                    if (!array_ugel_cole[ugel + "|" + colegio]) {
                        array_ugel_cole[ugel + "|" + colegio] = 0;
                    }
                    array_ugel_cole[ugel + "|" + colegio] += +1;
                });
                /////////////////////
                var array_T_ugel = Array(),
                    array_T_colegio = Array();
                $.each(array_datos_T, function(index, val) {
                    t_ugel = $.trim(val['nom_ugel']);
                    t_colegio = $.trim(val['nom_colegio']);
                    t_total = $.trim(val['total']);
                    t_grado = $.trim(val['grado']);
                    if (t_grado == '4') {
                        if (!array_T_ugel[t_ugel]) {
                            array_T_ugel[t_ugel] = 0;
                        }
                        array_T_ugel[t_ugel] += +1 * 2;
                        if (!array_T_colegio[t_ugel + "|" + t_colegio]) {
                            array_T_colegio[t_ugel + "|" + t_colegio] = 0;
                        }
                        array_T_colegio[t_ugel + "|" + t_colegio] += +1 * 2;
                    } else if (t_grado == '2') {
                        if (!array_T_ugel[t_ugel]) {
                            array_T_ugel[t_ugel] = 0;
                        }
                        array_T_ugel[t_ugel] += +1 * 4;
                        if (!array_T_colegio[t_ugel + "|" + t_colegio]) {
                            array_T_colegio[t_ugel + "|" + t_colegio] = 0;
                        }
                        array_T_colegio[t_ugel + "|" + t_colegio] += +1 * 4;
                    }

                });
                /////////////////////
                array_ugel_cole = order_items(array_ugel_cole, "r");
                array_T_colegio = order_items(array_T_colegio, "r");
                var array_col_ug = Array(),
                    array_ugl_col = Array(),
                    array_ugl_col_2 = Array();
                for (var ug in array_ugel) {
                    //array_col_ug.push([ug,array_ugel[ug]]);
                    array_ugl_col.push({
                        name: ug,
                        y: calc(array_ugel[ug], array_T_ugel[ug], "%", '2'),
                        drilldown: ug
                    });
                    /////////////////////////////
                    var array_sub_cole = [];
                    for (var col in array_ugel_cole) {
                        var col_split = col.split("|");
                        if ($.trim(ug) === $.trim(col_split[0])) {
                            //array_sub_cole=array_sub_cole.concat([[col_split[1],calc(array_ugel_cole[ug+"|"+col_split[1]],array_ugel[ug],"%",'2' ) ]] );
                            array_sub_cole = array_sub_cole.concat([
                                [col_split[1], calc(array_ugel_cole[ug + "|" + col_split[1]], array_T_colegio[ug + "|" + col_split[1]], "%", '2')]
                            ]);
                        }
                    }
                    array_ugl_col_2.push({
                        name: ug,
                        id: ug,
                        data: array_sub_cole
                    });
                }
                grafico_drilldown('cuadro_1-1', array_ugl_col, array_ugl_col_2);
                $("#contenedor").show();
            }
            else{
                $("#cuadro_1-1").html("");
            }
            if (datos2.length > 0) {
                var total_registros = 0
                total_registros = datos2.length;
                var array_datos = datos2;
                var array_datos_T = datos_T2;
                var array_ugel = Array(),
                    array_colegio = Array(),
                    array_ugel_cole = Array();
                $.each(array_datos, function(index, val) {
                    ugel = $.trim(val['nom_ugel']);
                    colegio = $.trim(val['nom_colegio']);
                    alumno = $.trim(val['id_alumno']);
                    if (!array_ugel[ugel]) {
                        array_ugel[ugel] = 0;
                    }
                    array_ugel[ugel] += +1;
                    if (!array_colegio[colegio]) {
                        array_colegio[colegio] = 0;
                    }
                    array_colegio[colegio] += +1;
                    if (!array_ugel_cole[ugel + "|" + colegio]) {
                        array_ugel_cole[ugel + "|" + colegio] = 0;
                    }
                    array_ugel_cole[ugel + "|" + colegio] += +1;
                });
                /////////////////////
                var array_T_ugel = Array(),
                    array_T_colegio = Array();
                $.each(array_datos_T, function(index, val) {
                    t_ugel = $.trim(val['nom_ugel']);
                    t_colegio = $.trim(val['nom_colegio']);
                    t_total = $.trim(val['total']);
                    t_grado = $.trim(val['grado']);
                    if (t_grado == '4') {
                        if (!array_T_ugel[t_ugel]) {
                            array_T_ugel[t_ugel] = 0;
                        }
                        array_T_ugel[t_ugel] += +1 * 2;
                        if (!array_T_colegio[t_ugel + "|" + t_colegio]) {
                            array_T_colegio[t_ugel + "|" + t_colegio] = 0;
                        }
                        array_T_colegio[t_ugel + "|" + t_colegio] += +1 * 2;
                    } else if (t_grado == '2') {
                        if (!array_T_ugel[t_ugel]) {
                            array_T_ugel[t_ugel] = 0;
                        }
                        array_T_ugel[t_ugel] += +1 * 4;
                        if (!array_T_colegio[t_ugel + "|" + t_colegio]) {
                            array_T_colegio[t_ugel + "|" + t_colegio] = 0;
                        }
                        array_T_colegio[t_ugel + "|" + t_colegio] += +1 * 4;
                    }

                });
                /////////////////////
                array_ugel_cole = order_items(array_ugel_cole, "r");
                array_T_colegio = order_items(array_T_colegio, "r");
                var array_col_ug = Array(),
                    array_ugl_col = Array(),
                    array_ugl_col_2 = Array();
                for (var ug in array_ugel) {
                    //array_col_ug.push([ug,array_ugel[ug]]);
                    array_ugl_col.push({
                        name: ug,
                        y: calc(array_ugel[ug], array_T_ugel[ug], "%", '2'),
                        drilldown: ug
                    });
                    /////////////////////////////
                    var array_sub_cole = [];
                    for (var col in array_ugel_cole) {
                        var col_split = col.split("|");
                        if ($.trim(ug) === $.trim(col_split[0])) {
                            //array_sub_cole=array_sub_cole.concat([[col_split[1],calc(array_ugel_cole[ug+"|"+col_split[1]],array_ugel[ug],"%",'2' ) ]] );
                            array_sub_cole = array_sub_cole.concat([
                                [col_split[1], calc(array_ugel_cole[ug + "|" + col_split[1]], array_T_colegio[ug + "|" + col_split[1]], "%", '2')]
                            ]);
                        }
                    }
                    array_ugl_col_2.push({
                        name: ug,
                        id: ug,
                        data: array_sub_cole
                    });
                }                               
                grafico_drilldown('cuadro_1-2', array_ugl_col, array_ugl_col_2);
                $("#contenedor").show();
            }
            else{
                $("#cuadro_1-2").html("");
            }
            if(datos1.length==0 &&  datos2.length==0 ) {
                $("#contenedor").hide();
                show_mensaje('No se encontró Información', 'Con los filtros ingresados', 'info');
            }
        }
    });
}

function getAvanceNiveles(ulr_data) {
    var ugel = $("#cmbUgel").val();
    if (ugel == 0 || ugel == "") {
        $("#cmbUgel").focus();
        show_mensaje("Información Requerida", "Seleccione alguna Ugel", "question");
        return false;
    }
    var parametros = {
        ugel: ugel
    };
    $.ajax({
        url: ulr_data,
        method: "POST",
        dataType: 'json',
        data: parametros,
        success: function(dato) {
            var datos1 = dato['data_grado1'];
            var datos2 = dato['data_grado2'];
            var datos_T1 = dato['data_T1'];
            var datos_T2 = dato['data_T2'];
            if (datos1.length > 0) {
                var array_datos = datos1;
                var array_datos_T = datos_T1;
                var array_colegio = Array(),
                    array_nivel = Array();
                $.each(array_datos, function(index, val) {
                    colegio = $.trim(val['nom_colegio']);
                    niveles = $.trim(val['id_nivel']);
                    niveles = (niveles == 1) ? "PRIMARIA" : "SECUNDARIA";
                    if (!array_colegio[colegio]) {
                        array_colegio[colegio] = 0;
                    }
                    array_colegio[colegio] += +1;
                    if (!array_nivel[colegio + "|" + niveles]) {
                        array_nivel[colegio + "|" + niveles] = 0;
                    }
                    array_nivel[colegio + "|" + niveles] += +1;
                });
                var array_cole = Array(),
                    array_T_niveles = Array();
                $.each(array_datos_T, function(index, val) {
                    t_colegio = $.trim(val['nom_colegio']);
                    t_niveles = $.trim(val['id_nivel']);
                    t_niveles = (t_niveles == 1) ? "PRIMARIA" : "SECUNDARIA";
                    t_grado = $.trim(val['grado']);
                    if (t_grado == '4') {
                        if (!array_cole[t_colegio]) {
                            array_cole[t_colegio] = 0;
                        }
                        array_cole[t_colegio] += +1 * 2;
                        if (!array_T_niveles[t_colegio + "|" + t_niveles]) {
                            array_T_niveles[t_colegio + "|" + t_niveles] = 0;
                        }
                        array_T_niveles[t_colegio + "|" + t_niveles] += +1 * 2;

                    } else if (t_grado == '2') {
                        if (!array_cole[t_colegio]) {
                            array_cole[t_colegio] = 0;
                        }
                        array_cole[t_colegio] += +1 * 4;
                        if (!array_T_niveles[t_colegio + "|" + t_niveles]) {
                            array_T_niveles[t_colegio + "|" + t_niveles] = 0;
                        }
                        array_T_niveles[t_colegio + "|" + t_niveles] += +1 * 4;
                    }
                });
                array_colegio = order_items(array_colegio, 'r');
                array_cole = order_items(array_cole, 'r');
                var array_ugl_col = Array(),
                    array_ugl_col_2 = Array();
                for (var ug in array_colegio) {
                    array_ugl_col.push({
                        name: ug,
                        y: calc(array_colegio[ug], array_cole[ug], "%", '2'),
                        drilldown: ug
                    });
                    /////////////////////////////
                    var array_sub_cole = [];
                    for (var col in array_nivel) {
                        var col_split = col.split("|");
                        if ($.trim(ug) === $.trim(col_split[0])) {
                            array_sub_cole = array_sub_cole.concat([
                                [col_split[1], calc(array_nivel[ug + "|" + col_split[1]], array_T_niveles[ug + "|" + col_split[1]], "%", '2')]
                            ]);
                        }
                    }
                    array_ugl_col_2.push({
                        name: ug,
                        id: ug,
                        data: array_sub_cole
                    });
                }
                grafico_drilldown('cuadro_1-1', array_ugl_col, array_ugl_col_2);    $("#contenedor").show();
            }
            if (datos2.length > 0) {
                var array_datos = datos2;
                var array_datos_T = datos_T2;
                var array_colegio = Array(),
                    array_nivel = Array();
                $.each(array_datos, function(index, val) {
                    colegio = $.trim(val['nom_colegio']);
                    niveles = $.trim(val['id_nivel']);
                    niveles = (niveles == 1) ? "PRIMARIA" : "SECUNDARIA";
                    if (!array_colegio[colegio]) {
                        array_colegio[colegio] = 0;
                    }
                    array_colegio[colegio] += +1;
                    if (!array_nivel[colegio + "|" + niveles]) {
                        array_nivel[colegio + "|" + niveles] = 0;
                    }
                    array_nivel[colegio + "|" + niveles] += +1;
                });
                var array_cole = Array(),
                    array_T_niveles = Array();
                $.each(array_datos_T, function(index, val) {
                    t_colegio = $.trim(val['nom_colegio']);
                    t_niveles = $.trim(val['id_nivel']);
                    t_niveles = (t_niveles == 1) ? "PRIMARIA" : "SECUNDARIA";
                    t_grado = $.trim(val['grado']);
                    if (t_grado == '4') {
                        if (!array_cole[t_colegio]) {
                            array_cole[t_colegio] = 0;
                        }
                        array_cole[t_colegio] += +1 * 2;
                        if (!array_T_niveles[t_colegio + "|" + t_niveles]) {
                            array_T_niveles[t_colegio + "|" + t_niveles] = 0;
                        }
                        array_T_niveles[t_colegio + "|" + t_niveles] += +1 * 2;

                    } else if (t_grado == '2') {
                        if (!array_cole[t_colegio]) {
                            array_cole[t_colegio] = 0;
                        }
                        array_cole[t_colegio] += +1 * 4;
                        if (!array_T_niveles[t_colegio + "|" + t_niveles]) {
                            array_T_niveles[t_colegio + "|" + t_niveles] = 0;
                        }
                        array_T_niveles[t_colegio + "|" + t_niveles] += +1 * 4;
                    }
                });
                array_colegio = order_items(array_colegio, 'r');
                array_cole = order_items(array_cole, 'r');
                var array_ugl_col = Array(),
                    array_ugl_col_2 = Array();
                for (var ug in array_colegio) {
                    array_ugl_col.push({
                        name: ug,
                        y: calc(array_colegio[ug], array_cole[ug], "%", '2'),
                        drilldown: ug
                    });
                    /////////////////////////////
                    var array_sub_cole = [];
                    for (var col in array_nivel) {
                        var col_split = col.split("|");
                        if ($.trim(ug) === $.trim(col_split[0])) {
                            array_sub_cole = array_sub_cole.concat([
                                [col_split[1], calc(array_nivel[ug + "|" + col_split[1]], array_T_niveles[ug + "|" + col_split[1]], "%", '2')]
                            ]);
                        }
                    }
                    array_ugl_col_2.push({
                        name: ug,
                        id: ug,
                        data: array_sub_cole
                    });
                }
                grafico_drilldown('cuadro_1-2', array_ugl_col, array_ugl_col_2);    $("#contenedor").show();
            }
            if(datos1.length==0 &&  datos2.length==0 ) {
                $("#contenedor").hide();
                show_mensaje('No se encontró Información', 'Con los filtros ingresados', 'info');
            }
        }
    });
}

function getAvanceAreas(ulr_data) {
    var ugel = $("#cmbUgel").val();
    var colegio = $("#cmbColegio").val();
    if (ugel == 0 || ugel == "") {
        $("#cmbUgel").focus();
        show_mensaje("Información Requerida", "Seleccione una ugel", "question");
        return false;
    }
    var parametros = {
        colegio: colegio,
        ugel: ugel
    };
    $.ajax({
        url: ulr_data,
        method: "POST",
        dataType: 'json',
        data: parametros,
        success: function(dato) {
            var datos1 = dato['data_grado1'];
            var datos_T1 = dato['data_T1'];
            var datos2 = dato['data_grado2'];
            var datos_T2 = dato['data_T2'];

            if (datos1.length > 0) {
                var array_datos = datos1;
                var array_datos_T = datos_T1;
                var array_areas = Array(),
                    array_nivel = Array();
                $.each(array_datos, function(index, val) {
                    area = $.trim(val['area']);
                    niveles = $.trim(val['id_nivel']);
                    niveles = (niveles == 1) ? "PRIMARIA" : "SECUNDARIA";
                    if (!array_nivel[niveles]) {
                        array_nivel[niveles] = 0;
                    }
                    array_nivel[niveles] += +1;

                    if (!array_areas[niveles + "|" + area]) {
                        array_areas[niveles + "|" + area] = 0;
                    }
                    array_areas[niveles + "|" + area] += +1;
                });
                var array_T_areas = Array(),
                    array_T_niveles = Array();
                $.each(array_datos_T, function(index, val) {
                    t_area = $.trim(val['area']);
                    t_niveles = $.trim(val['id_nivel']);
                    t_niveles = (t_niveles == 1) ? "PRIMARIA" : "SECUNDARIA";
                    t_grado = $.trim(val['grado']);
                    if (!array_T_niveles[t_niveles]) {
                        array_T_niveles[t_niveles] = 0;
                    }
                    array_T_niveles[t_niveles] += +1;

                    if (!array_T_areas[t_niveles + "|" + t_area]) {
                        array_T_areas[t_niveles + "|" + t_area] = 0;
                    }
                    array_T_areas[t_niveles + "|" + t_area] += +1;
                });
                array_nivel = order_items(array_nivel, 'r');
                array_T_niveles = order_items(array_T_niveles, 'r');

                var array_ugl_col = Array(),
                    array_ugl_col_2 = Array();
                for (var ug in array_nivel) {
                    array_ugl_col.push({
                        name: ug,
                        y: calc(array_nivel[ug], array_T_niveles[ug], "%", '2'),
                        drilldown: ug
                    });
                    /////////////////////////////
                    var array_sub_cole = [];
                    for (var col in array_areas) {
                        var col_split = col.split("|");
                        if ($.trim(ug) === $.trim(col_split[0])) {
                            array_sub_cole = array_sub_cole.concat([
                                [col_split[1], calc(array_areas[ug + "|" + col_split[1]], array_T_areas[ug + "|" + col_split[1]], "%", '2')]
                            ]);
                        }
                    }
                    array_ugl_col_2.push({
                        name: ug,
                        id: ug,
                        data: array_sub_cole
                    });
                }
                ///////////////////////
                grafico_drilldown('cuadro_1-1', array_ugl_col, array_ugl_col_2);
                $("#contenedor").show();
            }
            if (datos2.length > 0) {
                var array_datos = datos2;
                var array_datos_T = datos_T2;
                var array_areas = Array(),
                    array_nivel = Array();
                $.each(array_datos, function(index, val) {
                    area = $.trim(val['area']);
                    niveles = $.trim(val['id_nivel']);
                    niveles = (niveles == 1) ? "PRIMARIA" : "SECUNDARIA";
                    if (!array_nivel[niveles]) {
                        array_nivel[niveles] = 0;
                    }
                    array_nivel[niveles] += +1;

                    if (!array_areas[niveles + "|" + area]) {
                        array_areas[niveles + "|" + area] = 0;
                    }
                    array_areas[niveles + "|" + area] += +1;
                });
                var array_T_areas = Array(),
                    array_T_niveles = Array();
                $.each(array_datos_T, function(index, val) {
                    t_area = $.trim(val['area']);
                    t_niveles = $.trim(val['id_nivel']);
                    t_niveles = (t_niveles == 1) ? "PRIMARIA" : "SECUNDARIA";
                    t_grado = $.trim(val['grado']);
                    if (!array_T_niveles[t_niveles]) {
                        array_T_niveles[t_niveles] = 0;
                    }
                    array_T_niveles[t_niveles] += +1;

                    if (!array_T_areas[t_niveles + "|" + t_area]) {
                        array_T_areas[t_niveles + "|" + t_area] = 0;
                    }
                    array_T_areas[t_niveles + "|" + t_area] += +1;
                });
                array_nivel = order_items(array_nivel, 'r');
                array_T_niveles = order_items(array_T_niveles, 'r');

                var array_ugl_col = Array(),
                    array_ugl_col_2 = Array();
                for (var ug in array_nivel) {
                    array_ugl_col.push({
                        name: ug,
                        y: calc(array_nivel[ug], array_T_niveles[ug], "%", '2'),
                        drilldown: ug
                    });
                    /////////////////////////////
                    var array_sub_cole = [];
                    for (var col in array_areas) {
                        var col_split = col.split("|");
                        if ($.trim(ug) === $.trim(col_split[0])) {
                            array_sub_cole = array_sub_cole.concat([
                                [col_split[1], calc(array_areas[ug + "|" + col_split[1]], array_T_areas[ug + "|" + col_split[1]], "%", '2')]
                            ]);
                        }
                    }
                    array_ugl_col_2.push({
                        name: ug,
                        id: ug,
                        data: array_sub_cole
                    });
                }
                ///////////////////////
                grafico_drilldown('cuadro_1-2', array_ugl_col, array_ugl_col_2);
                $("#contenedor").show();
            }
             if(datos1.length==0 &&  datos2.length==0) {
                $("#contenedor").hide();
                show_mensaje('No se encontró Información', 'Con los filtros ingresados', 'info');
            }
        }
    });

}

function grafico_drilldown(cuadro, array_ugl_col, array_ugl_col_2) {
    Highcharts.chart(cuadro, {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Avance de Evaluación.'
        },
        subtitle: {
            text: ''
        },
        accessibility: {
            announceNewData: {
                enabled: true
            }
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Total de Porcentaje de Avance'
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}%'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },

        series: [{
            name: "<<<< ATRAS",
            colorByPoint: true,
            data: array_ugl_col
        }],
        drilldown: {
            breadcrumbs: {
                position: {
                    align: 'right'
                }
            },
            series: array_ugl_col_2
        }
    });
}

function getRegional(ulr_data) {

event.preventDefault();
    var nivel = $("#cmb_nivel_avance").val();
    var id_evaluacion = $("#cmb_area_avance").val();

    var parametros = {
        'nivel': nivel,
        'id_evaluacion': id_evaluacion
    };
    $.ajax({
        url: ulr_data,
        method: "POST",
        dataType: 'json',
        data: parametros,
        success: function(dato) {
                console.log(dato);
            var datos1 = dato['data_grado1'];
            var datos2 = dato['data_grado2'];
            var array_categoria_sexo_1=[];
            var array_categoria_sexo_2=[];
            var array_categoria_area_1=[];
            var array_categoria_area_2=[];
            var array_categoria_gestion_1=[];
            var array_categoria_gestion_2=[];
            var array_inicio_1=[];
            var array_inicio_2=[];
            var array_proceso_1=[];
            var array_proceso_2=[];
            var array_satisfa_1=[];
            var array_satisfa_2=[];
            var array_inicio_sex_1=[];
            var array_inicio_sex_2=[];
            var array_proceso_sex_1=[];
            var array_proceso_sex_2=[];
            var array_satisfa_sex_1=[];
            var array_satisfa_sex_2=[];
            var array_inicio_are_1=[];
            var array_inicio_are_2=[];
            var array_proceso_are_1=[];
            var array_proceso_are_2=[];
            var array_satisfa_are_1=[];
            var array_satisfa_are_2=[];
            var array_inicio_gest_1=[];
            var array_inicio_gest_2=[];
            var array_proceso_gest_1=[];
            var array_proceso_gest_2=[];
            var array_satisfa_gest_1=[];
            var array_satisfa_gest_2=[];
            var array_scala_sexo_1=[];
            var array_scala_sexo_2=[];

            if (datos1.length > 0) {
                var array_datos = datos1;
                var head_Escala = ['INICIO', 'PROCESO', 'SATISFACTORIO'];
                var array_region = new Array(),
                    array_escala = new Array(),
                    array_nota = new Array(),
                    array_region_nota = new Array(),
                    array_sexo = new Array(),
                    array_scala_sexo = new Array();
                var array_gestion = new Array(),
                    array_gestion_nota = new Array();
                var array_area_reg = new Array(),
                    array_area_reg_nota = new Array();

                $.each(array_datos, function(index, val) {
                    region = 'region';
                    nota = parseInt($.trim(val['nota']));
                    area_geo = $.trim(val['area']).toUpperCase();
                    _id_gestion = parseInt($.trim(val['id_gestion']));
                    id_gestion = (_id_gestion == 1) ? 'ESTATAL' : 'PRIVADO';
                    sexo = $.trim(val['sexo']);
                    sexo = (sexo == 'M') ? "HOMBRES" : "MUJERES";
                    escala_1 = parseInt($.trim(val['escala1']));
                    escala_2 = parseInt($.trim(val['escala2']));
                    escala_3 = parseInt($.trim(val['escala3']));

                    if (!array_area_reg[area_geo]) {
                        array_area_reg[area_geo] = 0;
                    }
                    array_area_reg[area_geo] += +1;

                    if (!array_gestion[id_gestion]) {
                        array_gestion[id_gestion] = 0;
                    }
                    array_gestion[id_gestion] += +1;

                    if (!array_region[region]) {
                        array_region[region] = 0;
                    }
                    array_region[region] += +1;

                    if (!array_sexo[sexo]) {
                        array_sexo[sexo] = 0;
                    }
                    array_sexo[sexo] += +1;
                    if (nota >= 0 && nota <= escala_1) {
                        //INICIO
                        if (!array_region_nota["INICIO|" + region]) {
                            array_region_nota["INICIO|" + region] = 0;
                        }
                        array_region_nota["INICIO|" + region] += +1;
                        if (!array_area_reg_nota["INICIO|" + area_geo]) {
                            array_area_reg_nota["INICIO|" + area_geo] = 0;
                        }
                        array_area_reg_nota["INICIO|" + area_geo] += +1;
                        if (!array_gestion_nota["INICIO|" + id_gestion]) {
                            array_gestion_nota["INICIO|" + id_gestion] = 0;
                        }
                        array_gestion_nota["INICIO|" + id_gestion] += +1;
                        if (!array_scala_sexo["INICIO|" + sexo]) {
                            array_scala_sexo["INICIO|" + sexo] = 0;
                        }
                        array_scala_sexo["INICIO|" + sexo] += +1;

                    } else if (nota > escala_1 && nota <= escala_2) {
                        //PROCESO

                        if (!array_region_nota["PROCESO|" + region]) {
                            array_region_nota["PROCESO|" + region] = 0;
                        }
                        array_region_nota["PROCESO|" + region] += +1;

                        if (!array_area_reg_nota["PROCESO|" + area_geo]) {
                            array_area_reg_nota["PROCESO|" + area_geo] = 0;
                        }
                        array_area_reg_nota["PROCESO|" + area_geo] += +1;

                        if (!array_gestion_nota["PROCESO|" + id_gestion]) {
                            array_gestion_nota["PROCESO|" + id_gestion] = 0;
                        }
                        array_gestion_nota["PROCESO|" + id_gestion] += +1;

                        if (!array_scala_sexo["PROCESO|" + sexo]) {
                            array_scala_sexo["PROCESO|" + sexo] = 0;
                        }
                        array_scala_sexo["PROCESO|" + sexo] += +1;
                    } else if (nota > escala_2) {
                        //SATISFACTORIO
                        if (!array_region_nota["SATISFACTORIO|" + region]) {
                            array_region_nota["SATISFACTORIO|" + region] = 0;
                        }
                        array_region_nota["SATISFACTORIO|" + region] += +1;

                        if (!array_area_reg_nota["SATISFACTORIO|" + area_geo]) {
                            array_area_reg_nota["SATISFACTORIO|" + area_geo] = 0;
                        }
                        array_area_reg_nota["SATISFACTORIO|" + area_geo] += +1;

                        if (!array_gestion_nota["SATISFACTORIO|" + id_gestion]) {
                            array_gestion_nota["SATISFACTORIO|" + id_gestion] = 0;
                        }
                        array_gestion_nota["SATISFACTORIO|" + id_gestion] += +1;


                        if (!array_scala_sexo["SATISFACTORIO|" + sexo]) {
                            array_scala_sexo["SATISFACTORIO|" + sexo] = 0;
                        }
                        array_scala_sexo["SATISFACTORIO|" + sexo] += +1;
                    }


                });
                /////////////
                var array_categoria_region = new Array(),
                    array_T_sexo = new Array();
                var total_hombres = 0,
                    total_mujeres = 0;
                var total_privado = 0,
                    total_estatal = 0,
                    array_T_gestion = new Array();
                var total_urbana = 0,
                    total_rural = 0,
                    array_T_area = new Array();
                var array_categoria_area = new Array();
                var array_categoria_gestion = new Array();
                var array_categoria_sexo = new Array();

                for (var ug in array_region) {
                    array_categoria_region.push(ug);
                }

                for (var uga in array_area_reg) {
                    array_categoria_area.push(uga);
                }

                for (var gest in array_gestion) {
                    array_categoria_gestion.push(gest);
                }

                for (var gest in array_sexo) {
                    array_categoria_sexo.push(gest);
                }
                //////////
                for (var sx in array_sexo) {
                    array_T_sexo.push({
                        name: sx,
                        y: calc(array_sexo[sx], datos1.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'HOMBRES') {
                        total_hombres += array_sexo['HOMBRES'];
                    } else if (sx == 'MUJERES') {
                        total_mujeres += array_sexo['MUJERES'];
                    }
                }

                for (var sx in array_area_reg) {
                    array_T_area.push({
                        name: sx,
                        y: calc(array_area_reg[sx], datos1.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'URBANA') {
                        total_urbana += array_area_reg['URBANA'];
                    } else if (sx == 'RURAL') {
                        total_rural += array_area_reg['RURAL'];
                    }
                }

                for (var sx in array_gestion) {

                    array_T_gestion.push({
                        name: sx,
                        y: calc(array_gestion[sx], datos1.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'PRIVADO') {
                        total_privado += array_gestion['PRIVADO'];
                    } else if (sx == 'ESTATAL') {
                        total_estatal += array_gestion['ESTATAL'];
                    }
                }

                var array_inicio = new Array(),
                    array_proceso = new Array(),
                    array_satisfa = new Array();
                var array_inicio_sex = new Array(),
                    array_proceso_sex = new Array(),
                    array_satisfa_sex = new Array();
                var array_inicio_gest = new Array(),
                    array_proceso_gest = new Array(),
                    array_satisfa_gest = new Array();

                var array_inicio_are = new Array(),
                    array_proceso_are = new Array(),
                    array_satisfa_are = new Array();


                for (var ug = 0; ug < array_categoria_sexo.length; ug++) {

                    if (!array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]]) {
                        array_satisfa_sex.push(0);
                    } else if (array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]] >= 0) {
                        array_satisfa_sex.push(array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]]);
                    }

                    if (!array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]]) {
                        array_proceso_sex.push(0);
                    } else if (array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]] >= 0) {
                        array_proceso_sex.push(array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]]);
                    }

                    if (!array_scala_sexo['INICIO|' + array_categoria_sexo[ug]]) {
                        array_inicio_sex.push(0);
                    } else if (array_scala_sexo['INICIO|' + array_categoria_sexo[ug]] >= 0) {
                        array_inicio_sex.push(array_scala_sexo['INICIO|' + array_categoria_sexo[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_area.length; ug++) {

                    if (!array_area_reg_nota['SATISFACTORIO|' + array_categoria_area[ug]]) {
                        array_satisfa_are.push(0);
                    } else if (array_area_reg_nota['SATISFACTORIO|' + array_categoria_area[ug]] >= 0) {
                        array_satisfa_are.push(array_area_reg_nota['SATISFACTORIO|' + array_categoria_area[ug]]);
                    }

                    if (!array_area_reg_nota['PROCESO|' + array_categoria_area[ug]]) {
                        array_proceso_are.push(0);
                    } else if (array_area_reg_nota['PROCESO|' + array_categoria_area[ug]] >= 0) {
                        array_proceso_are.push(array_area_reg_nota['PROCESO|' + array_categoria_area[ug]]);
                    }

                    if (!array_area_reg_nota['INICIO|' + array_categoria_area[ug]]) {
                        array_inicio_are.push(0);
                    } else if (array_area_reg_nota['INICIO|' + array_categoria_area[ug]] >= 0) {
                        array_inicio_are.push(array_area_reg_nota['INICIO|' + array_categoria_area[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_gestion.length; ug++) {

                    if (!array_gestion_nota['SATISFACTORIO|' + array_categoria_gestion[ug]]) {
                        array_satisfa_gest.push(0);
                    } else if (array_gestion_nota['SATISFACTORIO|' + array_categoria_gestion[ug]] >= 0) {
                        array_satisfa_gest.push(array_gestion_nota['SATISFACTORIO|' + array_categoria_gestion[ug]]);
                    }

                    if (!array_gestion_nota['PROCESO|' + array_categoria_gestion[ug]]) {
                        array_proceso_gest.push(0);
                    } else if (array_gestion_nota['PROCESO|' + array_categoria_gestion[ug]] >= 0) {
                        array_proceso_gest.push(array_gestion_nota['PROCESO|' + array_categoria_gestion[ug]]);
                    }

                    if (!array_gestion_nota['INICIO|' + array_categoria_gestion[ug]]) {
                        array_inicio_gest.push(0);
                    } else if (array_gestion_nota['INICIO|' + array_categoria_gestion[ug]] >= 0) {
                        array_inicio_gest.push(array_gestion_nota['INICIO|' + array_categoria_gestion[ug]]);
                    }

                }

                for (var head in head_Escala) {
                    var array_inicio = new Array(),
                        array_proceso = new Array(),
                        array_satisfa = new Array();


                    for (var nta in array_region_nota) {
                        var split_nota = nta.split("|");
                        if ($.trim(split_nota[0]) == 'INICIO') {
                            array_inicio.push(array_region_nota[nta]);
                        } else if ($.trim(split_nota[0]) == 'PROCESO') {
                            array_proceso.push(array_region_nota[nta]);;
                        } else if ($.trim(split_nota[0]) == 'SATISFACTORIO') {
                            array_satisfa.push(array_region_nota[nta]);

                        }
                    }

                    //=======================================================================
                    var arr_sexo_f = new Array(),
                        arr_sexo_m = new Array();
                    var arr_gestion_e = new Array(),
                        arr_gestion_p = new Array();
                    var arr_area_r = new Array(),
                        arr_area_u = new Array();

                    for (var ar_sex in array_scala_sexo) {
                        var split_ar_sex = ar_sex.split("|");
                        if ($.trim(split_ar_sex[0]) == 'INICIO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["INICIO",calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_mujeres,"%",'2') ]] );
                                arr_sexo_f.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_sexo["INICIO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["INICIO",calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_hombres,"%",'2') ]] );
                                arr_sexo_m.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_sexo["INICIO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_sex[0]) == 'PROCESO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["PROCESO",calc(array_scala_sexo["PROCESO|"+split_ar_sex[1]],total_mujeres,"%",'2') ]] );
                                arr_sexo_f.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_sexo["PROCESO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["PROCESO",calc(array_scala_sexo["PROCESO|"+split_ar_sex[1]],total_hombres,"%",'2') ]] );
                                arr_sexo_m.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_sexo["PROCESO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_sex[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["SATISFACTORIO",calc(array_scala_sexo["SATISFACTORIO|"+split_ar_sex[1]],total_mujeres,"%",'2') ]] );
                                arr_sexo_f.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_sexo["SATISFACTORIO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_satis
                                });
                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["SATISFACTORIO",calc(array_scala_sexo["SATISFACTORIO|"+split_ar_sex[1]],total_hombres,"%",'2') ]] );
                                arr_sexo_m.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_sexo["SATISFACTORIO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }
                    //=======================================================================

                    for (var ar_reg in array_area_reg_nota) {
                        var split_ar_reg = ar_reg.split("|");
                        if ($.trim(split_ar_reg[0]) == 'INICIO') {
                            if ($.trim(split_ar_reg[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["INICIO",calc(array_area_reg_nota["INICIO|"+split_ar_reg[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'INICIO',
                                    y: calc(array_area_reg_nota["INICIO|" + split_ar_reg[1]], total_rural, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_reg[1]) == 'URBANA') {
                                //arr_area_u=arr_area_u.concat([["INICIO",calc(array_area_reg_nota["INICIO|"+split_ar_reg[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'INICIO',
                                    y: calc(array_area_reg_nota["INICIO|" + split_ar_reg[1]], total_urbana, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_reg[0]) == 'PROCESO') {
                            if ($.trim(split_ar_reg[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["PROCESO",calc(array_area_reg_nota["PROCESO|"+split_ar_reg[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'PROCESO',
                                    y: calc(array_area_reg_nota["PROCESO|" + split_ar_reg[1]], total_rural, "%", '2'),
                                    color: color_proc
                                });
                            } else if ($.trim(split_ar_reg[1]) == 'URBANA') {
                                //arr_area_u=arr_area_u.concat([["PROCESO",calc(array_area_reg_nota["PROCESO|"+split_ar_reg[1]],total_urbana,"%",'2') ]] );

                                arr_area_u.push({
                                    'name': 'PROCESO',
                                    y: calc(array_area_reg_nota["PROCESO|" + split_ar_reg[1]], total_urbana, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_reg[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_reg[1]) == 'RURAL') {
                                // arr_area_r=arr_area_r.concat([["SATISFACTORIO",calc(array_area_reg_nota["SATISFACTORIO|"+split_ar_reg[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_area_reg_nota["SATISFACTORIO|" + split_ar_reg[1]], total_rural, "%", '2'),
                                    color: color_satis
                                });
                            } else if ($.trim(split_ar_reg[1]) == 'URBANA') {
                                // arr_area_u=arr_area_u.concat([["SATISFACTORIO",calc(array_area_reg_nota["SATISFACTORIO|"+split_ar_reg[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_area_reg_nota["SATISFACTORIO|" + split_ar_reg[1]], total_urbana, "%", '2'),
                                    color: color_satis
                                });

                            }
                        }

                    }
                    //,['color':'#73B4B9'] satisf
                    //['color':'#FABB05']  proceso
                    //['color':'#E94235']  inicio                   //arr_sexo_f.push({'name':'INICIO',y:calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_mujeres,"%",'2'),color:'#E94235'});

                    for (var ar_reg in array_gestion_nota) {
                        var split_ar_reg = ar_reg.split("|");
                        if ($.trim(split_ar_reg[0]) == 'INICIO') {
                            if ($.trim(split_ar_reg[1]) == 'ESTATAL') {
                                // arr_gestion_e=arr_gestion_e.concat([["INICIO",calc(array_gestion_nota["INICIO|"+split_ar_reg[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'INICIO',
                                    y: calc(array_gestion_nota["INICIO|" + split_ar_reg[1]], total_estatal, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_reg[1]) == 'PRIVADO') {
                                //  arr_gestion_p=arr_gestion_p.concat([["INICIO",calc(array_gestion_nota["INICIO|"+split_ar_reg[1]],total_privado,"%",'2') ]] );

                                arr_gestion_p.push({
                                    'name': 'INICIO',
                                    y: calc(array_gestion_nota["INICIO|" + split_ar_reg[1]], total_privado, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_reg[0]) == 'PROCESO') {
                            if ($.trim(split_ar_reg[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["PROCESO",calc(array_gestion_nota["PROCESO|"+split_ar_reg[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'PROCESO',
                                    y: calc(array_gestion_nota["PROCESO|" + split_ar_reg[1]], total_estatal, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_reg[1]) == 'PRIVADO') {
                                // arr_gestion_p=arr_gestion_p.concat([["PROCESO",calc(array_gestion_nota["PROCESO|"+split_ar_reg[1]],total_privado,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'PROCESO',
                                    y: calc(array_gestion_nota["PROCESO|" + split_ar_reg[1]], total_privado, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_reg[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_reg[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["SATISFACTORIO",calc(array_gestion_nota["SATISFACTORIO|"+split_ar_reg[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_gestion_nota["SATISFACTORIO|" + split_ar_reg[1]], total_estatal, "%", '2'),
                                    color: color_satis
                                });
                            } else if ($.trim(split_ar_reg[1]) == 'PRIVADO') {
                                //arr_gestion_p=arr_gestion_p.concat([["SATISFACTORIO",calc(array_gestion_nota["SATISFACTORIO|"+split_ar_reg[1]],total_privado,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_gestion_nota["SATISFACTORIO|" + split_ar_reg[1]], total_privado, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }

                }


                stacked_column('cuadro_1-1', array_categoria_region, array_inicio, array_proceso, array_satisfa);

                pie_with_drilldown('cuadro_2-1', array_T_sexo, arr_sexo_f, arr_sexo_m, 'GRÁFICO POR SEXO', 'MUJERES', 'HOMBRES');

                pie_with_drilldown('cuadro_3-1', array_T_area, arr_area_r, arr_area_u, 'GRÁFICO POR ÁREA GEOGRÁFICA', 'RURAL', 'URBANA');

                pie_with_drilldown('cuadro_4-1', array_T_gestion, arr_gestion_e, arr_gestion_p, 'GRÁFICO POR GESTION', 'ESTATAL', 'PRIVADO');

                array_inicio_sex_1=array_inicio_sex;
                array_proceso_sex_1=array_proceso_sex;
                array_satisfa_sex_1=array_satisfa_sex;
                array_categoria_sexo_1=array_categoria_sexo;
                console.log("categoria sexo 1");
                console.log(array_categoria_sexo);
                array_inicio_1=array_inicio;
                console.log("categoria array_scala_sexo 1");
                console.log(array_scala_sexo);
                array_proceso_1=array_proceso;
                array_satisfa_1=array_satisfa;
                array_inicio_are_1=array_inicio_are;
                array_proceso_are_1=array_proceso_are;
                array_satisfa_are_1=array_satisfa_are;
                array_categoria_area_1=array_categoria_area;
                array_inicio_gest_1=array_inicio_gest;
                array_proceso_gest_1=array_proceso_gest;
                array_satisfa_gest_1=array_satisfa_gest;
                array_categoria_gestion_1=array_categoria_gestion;
                array_scala_sexo_1=array_scala_sexo;

               /* cuadros_resumen('cuadro_1_resumen', 'CUADRO NIVELES POR REGIÓN', array_inicio, array_proceso, array_satisfa, '-');

                cuadros_resumen('cuadro_2_resumen', 'CUADRO NIVELES POR SEXO', array_inicio_sex, array_proceso_sex, array_satisfa_sex, array_categoria_sexo);

                cuadros_resumen('cuadro_3_resumen', 'CUADRO NIVELES POR ÁREA GEOGRÁFICA', array_inicio_are, array_proceso_are, array_satisfa_are, array_categoria_area);

                cuadros_resumen('cuadro_4_resumen', 'CUADRO NIVELES POR GESTION', array_inicio_gest, array_proceso_gest, array_satisfa_gest, array_categoria_gestion);*/


                /////////////
                $("#contenedor").show();
            }
            if (datos2.length > 0) {
                var array_datos = datos2;
                var head_Escala = ['INICIO', 'PROCESO', 'SATISFACTORIO'];
                var array_region = new Array(),
                    array_escala = new Array(),
                    array_nota = new Array(),
                    array_region_nota = new Array(),
                    array_sexo = new Array(),
                    array_scala_sexo = new Array();
                var array_gestion = new Array(),
                    array_gestion_nota = new Array();
                var array_area_reg = new Array(),
                    array_area_reg_nota = new Array();

                $.each(array_datos, function(index, val) {
                    region = 'region';
                    nota = parseInt($.trim(val['nota']));
                    area_geo = $.trim(val['area']).toUpperCase();
                    _id_gestion = parseInt($.trim(val['id_gestion']));
                    id_gestion = (_id_gestion == 1) ? 'ESTATAL' : 'PRIVADO';
                    sexo = $.trim(val['sexo']);
                    sexo = (sexo == 'M') ? "HOMBRES" : "MUJERES";
                    escala_1 = parseInt($.trim(val['escala1']));
                    escala_2 = parseInt($.trim(val['escala2']));
                    escala_3 = parseInt($.trim(val['escala3']));

                    if (!array_area_reg[area_geo]) {
                        array_area_reg[area_geo] = 0;
                    }
                    array_area_reg[area_geo] += +1;

                    if (!array_gestion[id_gestion]) {
                        array_gestion[id_gestion] = 0;
                    }
                    array_gestion[id_gestion] += +1;


                    if (!array_region[region]) {
                        array_region[region] = 0;
                    }
                    array_region[region] += +1;


                    if (!array_sexo[sexo]) {
                        array_sexo[sexo] = 0;
                    }
                    array_sexo[sexo] += +1;

                    if (nota >= 0 && nota <= escala_1) {
                        //INICIO
                        if (!array_region_nota["INICIO|" + region]) {
                            array_region_nota["INICIO|" + region] = 0;
                        }
                        array_region_nota["INICIO|" + region] += +1;

                        if (!array_area_reg_nota["INICIO|" + area_geo]) {
                            array_area_reg_nota["INICIO|" + area_geo] = 0;
                        }
                        array_area_reg_nota["INICIO|" + area_geo] += +1;

                        if (!array_gestion_nota["INICIO|" + id_gestion]) {
                            array_gestion_nota["INICIO|" + id_gestion] = 0;
                        }
                        array_gestion_nota["INICIO|" + id_gestion] += +1;

                        if (!array_scala_sexo["INICIO|" + sexo]) {
                            array_scala_sexo["INICIO|" + sexo] = 0;
                        }
                        array_scala_sexo["INICIO|" + sexo] += +1;

                    } else if (nota > escala_1 && nota <= escala_2) {
                        //PROCESO

                        if (!array_region_nota["PROCESO|" + region]) {
                            array_region_nota["PROCESO|" + region] = 0;
                        }
                        array_region_nota["PROCESO|" + region] += +1;

                        if (!array_area_reg_nota["PROCESO|" + area_geo]) {
                            array_area_reg_nota["PROCESO|" + area_geo] = 0;
                        }
                        array_area_reg_nota["PROCESO|" + area_geo] += +1;

                        if (!array_gestion_nota["PROCESO|" + id_gestion]) {
                            array_gestion_nota["PROCESO|" + id_gestion] = 0;
                        }
                        array_gestion_nota["PROCESO|" + id_gestion] += +1;



                        if (!array_scala_sexo["PROCESO|" + sexo]) {
                            array_scala_sexo["PROCESO|" + sexo] = 0;
                        }
                        array_scala_sexo["PROCESO|" + sexo] += +1;
                    } else if (nota > escala_2) {
                        //SATISFACTORIO
                        if (!array_region_nota["SATISFACTORIO|" + region]) {
                            array_region_nota["SATISFACTORIO|" + region] = 0;
                        }
                        array_region_nota["SATISFACTORIO|" + region] += +1;

                        if (!array_area_reg_nota["SATISFACTORIO|" + area_geo]) {
                            array_area_reg_nota["SATISFACTORIO|" + area_geo] = 0;
                        }
                        array_area_reg_nota["SATISFACTORIO|" + area_geo] += +1;

                        if (!array_gestion_nota["SATISFACTORIO|" + id_gestion]) {
                            array_gestion_nota["SATISFACTORIO|" + id_gestion] = 0;
                        }
                        array_gestion_nota["SATISFACTORIO|" + id_gestion] += +1;


                        if (!array_scala_sexo["SATISFACTORIO|" + sexo]) {
                            array_scala_sexo["SATISFACTORIO|" + sexo] = 0;
                        }
                        array_scala_sexo["SATISFACTORIO|" + sexo] += +1;
                    }


                });

                /////////////
                var array_categoria_region = new Array(),
                    array_T_sexo = new Array();
                var total_hombres = 0,
                    total_mujeres = 0;
                var total_privado = 0,
                    total_estatal = 0,
                    array_T_gestion = new Array();
                var total_urbana = 0,
                    total_rural = 0,
                    array_T_area = new Array();
                var array_categoria_area = new Array();
                var array_categoria_gestion = new Array();
                var array_categoria_sexo = new Array();

                for (var ug in array_region) {
                    array_categoria_region.push(ug);
                }

                for (var uga in array_area_reg) {
                    array_categoria_area.push(uga);
                }

                for (var gest in array_gestion) {
                    array_categoria_gestion.push(gest);
                }

                for (var gest in array_sexo) {
                    array_categoria_sexo.push(gest);
                }
                //////////
                for (var sx in array_sexo) {
                    array_T_sexo.push({
                        name: sx,
                        y: calc(array_sexo[sx], datos2.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'HOMBRES') {
                        total_hombres += array_sexo['HOMBRES'];
                    } else if (sx == 'MUJERES') {
                        total_mujeres += array_sexo['MUJERES'];
                    }
                }

                for (var sx in array_area_reg) {
                    array_T_area.push({
                        name: sx,
                        y: calc(array_area_reg[sx], datos2.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'URBANA') {
                        total_urbana += array_area_reg['URBANA'];
                    } else if (sx == 'RURAL') {
                        total_rural += array_area_reg['RURAL'];
                    }
                }

                for (var sx in array_gestion) {

                    array_T_gestion.push({
                        name: sx,
                        y: calc(array_gestion[sx], datos2.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'PRIVADO') {
                        total_privado += array_gestion['PRIVADO'];
                    } else if (sx == 'ESTATAL') {
                        total_estatal += array_gestion['ESTATAL'];
                    }
                }

                var array_inicio = new Array(),
                    array_proceso = new Array(),
                    array_satisfa = new Array();
                var array_inicio_sex = new Array(),
                    array_proceso_sex = new Array(),
                    array_satisfa_sex = new Array();
                var array_inicio_gest = new Array(),
                    array_proceso_gest = new Array(),
                    array_satisfa_gest = new Array();

                var array_inicio_are = new Array(),
                    array_proceso_are = new Array(),
                    array_satisfa_are = new Array();


                for (var ug = 0; ug < array_categoria_sexo.length; ug++) {

                    if (!array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]]) {
                        array_satisfa_sex.push(0);
                    } else if (array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]] >= 0) {
                        array_satisfa_sex.push(array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]]);
                    }

                    if (!array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]]) {
                        array_proceso_sex.push(0);
                    } else if (array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]] >= 0) {
                        array_proceso_sex.push(array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]]);
                    }

                    if (!array_scala_sexo['INICIO|' + array_categoria_sexo[ug]]) {
                        array_inicio_sex.push(0);
                    } else if (array_scala_sexo['INICIO|' + array_categoria_sexo[ug]] >= 0) {
                        array_inicio_sex.push(array_scala_sexo['INICIO|' + array_categoria_sexo[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_area.length; ug++) {

                    if (!array_area_reg_nota['SATISFACTORIO|' + array_categoria_area[ug]]) {
                        array_satisfa_are.push(0);
                    } else if (array_area_reg_nota['SATISFACTORIO|' + array_categoria_area[ug]] >= 0) {
                        array_satisfa_are.push(array_area_reg_nota['SATISFACTORIO|' + array_categoria_area[ug]]);
                    }

                    if (!array_area_reg_nota['PROCESO|' + array_categoria_area[ug]]) {
                        array_proceso_are.push(0);
                    } else if (array_area_reg_nota['PROCESO|' + array_categoria_area[ug]] >= 0) {
                        array_proceso_are.push(array_area_reg_nota['PROCESO|' + array_categoria_area[ug]]);
                    }

                    if (!array_area_reg_nota['INICIO|' + array_categoria_area[ug]]) {
                        array_inicio_are.push(0);
                    } else if (array_area_reg_nota['INICIO|' + array_categoria_area[ug]] >= 0) {
                        array_inicio_are.push(array_area_reg_nota['INICIO|' + array_categoria_area[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_gestion.length; ug++) {

                    if (!array_gestion_nota['SATISFACTORIO|' + array_categoria_gestion[ug]]) {
                        array_satisfa_gest.push(0);
                    } else if (array_gestion_nota['SATISFACTORIO|' + array_categoria_gestion[ug]] >= 0) {
                        array_satisfa_gest.push(array_gestion_nota['SATISFACTORIO|' + array_categoria_gestion[ug]]);
                    }

                    if (!array_gestion_nota['PROCESO|' + array_categoria_gestion[ug]]) {
                        array_proceso_gest.push(0);
                    } else if (array_gestion_nota['PROCESO|' + array_categoria_gestion[ug]] >= 0) {
                        array_proceso_gest.push(array_gestion_nota['PROCESO|' + array_categoria_gestion[ug]]);
                    }

                    if (!array_gestion_nota['INICIO|' + array_categoria_gestion[ug]]) {
                        array_inicio_gest.push(0);
                    } else if (array_gestion_nota['INICIO|' + array_categoria_gestion[ug]] >= 0) {
                        array_inicio_gest.push(array_gestion_nota['INICIO|' + array_categoria_gestion[ug]]);
                    }

                }
                for (var head in head_Escala) {
                    var array_inicio = new Array(),
                        array_proceso = new Array(),
                        array_satisfa = new Array();

                    for (var nta in array_region_nota) {
                        var split_nota = nta.split("|");
                        if ($.trim(split_nota[0]) == 'INICIO') {
                            array_inicio.push(array_region_nota[nta]);
                        } else if ($.trim(split_nota[0]) == 'PROCESO') {
                            array_proceso.push(array_region_nota[nta]);;
                        } else if ($.trim(split_nota[0]) == 'SATISFACTORIO') {
                            array_satisfa.push(array_region_nota[nta]);


                        }
                    }

                    //=======================================================================
                    var arr_sexo_f = new Array(),
                        arr_sexo_m = new Array();
                    var arr_gestion_e = new Array(),
                        arr_gestion_p = new Array();
                    var arr_area_r = new Array(),
                        arr_area_u = new Array();

                    for (var ar_sex in array_scala_sexo) {
                        var split_ar_sex = ar_sex.split("|");
                        if ($.trim(split_ar_sex[0]) == 'INICIO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["INICIO",calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_mujeres,"%",'2') ]] );
                                arr_sexo_f.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_sexo["INICIO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["INICIO",calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_hombres,"%",'2') ]] );
                                arr_sexo_m.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_sexo["INICIO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_sex[0]) == 'PROCESO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["PROCESO",calc(array_scala_sexo["PROCESO|"+split_ar_sex[1]],total_mujeres,"%",'2') ]] );
                                arr_sexo_f.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_sexo["PROCESO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["PROCESO",calc(array_scala_sexo["PROCESO|"+split_ar_sex[1]],total_hombres,"%",'2') ]] );
                                arr_sexo_m.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_sexo["PROCESO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_sex[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["SATISFACTORIO",calc(array_scala_sexo["SATISFACTORIO|"+split_ar_sex[1]],total_mujeres,"%",'2') ]] );
                                arr_sexo_f.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_sexo["SATISFACTORIO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_satis
                                });
                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["SATISFACTORIO",calc(array_scala_sexo["SATISFACTORIO|"+split_ar_sex[1]],total_hombres,"%",'2') ]] );
                                arr_sexo_m.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_sexo["SATISFACTORIO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }
                    //=======================================================================

                    for (var ar_reg in array_area_reg_nota) {
                        var split_ar_reg = ar_reg.split("|");
                        if ($.trim(split_ar_reg[0]) == 'INICIO') {
                            if ($.trim(split_ar_reg[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["INICIO",calc(array_area_reg_nota["INICIO|"+split_ar_reg[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'INICIO',
                                    y: calc(array_area_reg_nota["INICIO|" + split_ar_reg[1]], total_rural, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_reg[1]) == 'URBANA') {
                                //arr_area_u=arr_area_u.concat([["INICIO",calc(array_area_reg_nota["INICIO|"+split_ar_reg[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'INICIO',
                                    y: calc(array_area_reg_nota["INICIO|" + split_ar_reg[1]], total_urbana, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_reg[0]) == 'PROCESO') {
                            if ($.trim(split_ar_reg[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["PROCESO",calc(array_area_reg_nota["PROCESO|"+split_ar_reg[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'PROCESO',
                                    y: calc(array_area_reg_nota["PROCESO|" + split_ar_reg[1]], total_rural, "%", '2'),
                                    color: color_proc
                                });
                            } else if ($.trim(split_ar_reg[1]) == 'URBANA') {
                                //arr_area_u=arr_area_u.concat([["PROCESO",calc(array_area_reg_nota["PROCESO|"+split_ar_reg[1]],total_urbana,"%",'2') ]] );

                                arr_area_u.push({
                                    'name': 'PROCESO',
                                    y: calc(array_area_reg_nota["PROCESO|" + split_ar_reg[1]], total_urbana, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_reg[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_reg[1]) == 'RURAL') {
                                // arr_area_r=arr_area_r.concat([["SATISFACTORIO",calc(array_area_reg_nota["SATISFACTORIO|"+split_ar_reg[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_area_reg_nota["SATISFACTORIO|" + split_ar_reg[1]], total_rural, "%", '2'),
                                    color: color_satis
                                });
                            } else if ($.trim(split_ar_reg[1]) == 'URBANA') {
                                // arr_area_u=arr_area_u.concat([["SATISFACTORIO",calc(array_area_reg_nota["SATISFACTORIO|"+split_ar_reg[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_area_reg_nota["SATISFACTORIO|" + split_ar_reg[1]], total_urbana, "%", '2'),
                                    color: color_satis
                                });

                            }
                        }

                    }
                    //,['color':'#73B4B9'] satisf
                    //['color':'#FABB05']  proceso
                    //['color':'#E94235']  inicio                   //arr_sexo_f.push({'name':'INICIO',y:calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_mujeres,"%",'2'),color:'#E94235'});

                    for (var ar_reg in array_gestion_nota) {
                        var split_ar_reg = ar_reg.split("|");
                        if ($.trim(split_ar_reg[0]) == 'INICIO') {
                            if ($.trim(split_ar_reg[1]) == 'ESTATAL') {
                                // arr_gestion_e=arr_gestion_e.concat([["INICIO",calc(array_gestion_nota["INICIO|"+split_ar_reg[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'INICIO',
                                    y: calc(array_gestion_nota["INICIO|" + split_ar_reg[1]], total_estatal, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_reg[1]) == 'PRIVADO') {
                                //  arr_gestion_p=arr_gestion_p.concat([["INICIO",calc(array_gestion_nota["INICIO|"+split_ar_reg[1]],total_privado,"%",'2') ]] );

                                arr_gestion_p.push({
                                    'name': 'INICIO',
                                    y: calc(array_gestion_nota["INICIO|" + split_ar_reg[1]], total_privado, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_reg[0]) == 'PROCESO') {
                            if ($.trim(split_ar_reg[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["PROCESO",calc(array_gestion_nota["PROCESO|"+split_ar_reg[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'PROCESO',
                                    y: calc(array_gestion_nota["PROCESO|" + split_ar_reg[1]], total_estatal, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_reg[1]) == 'PRIVADO') {
                                // arr_gestion_p=arr_gestion_p.concat([["PROCESO",calc(array_gestion_nota["PROCESO|"+split_ar_reg[1]],total_privado,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'PROCESO',
                                    y: calc(array_gestion_nota["PROCESO|" + split_ar_reg[1]], total_privado, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_reg[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_reg[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["SATISFACTORIO",calc(array_gestion_nota["SATISFACTORIO|"+split_ar_reg[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_gestion_nota["SATISFACTORIO|" + split_ar_reg[1]], total_estatal, "%", '2'),
                                    color: color_satis
                                });
                            } else if ($.trim(split_ar_reg[1]) == 'PRIVADO') {
                                //arr_gestion_p=arr_gestion_p.concat([["SATISFACTORIO",calc(array_gestion_nota["SATISFACTORIO|"+split_ar_reg[1]],total_privado,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_gestion_nota["SATISFACTORIO|" + split_ar_reg[1]], total_privado, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }

                }

                array_inicio_sex_2=array_inicio_sex;
                array_proceso_sex_2=array_proceso_sex;
                array_satisfa_sex_2=array_satisfa_sex;
                array_categoria_sexo_2=array_categoria_sexo;
                array_inicio_2=array_inicio;
                array_proceso_2=array_proceso;
                array_satisfa_2=array_satisfa;
                array_inicio_are_2=array_inicio_are;
                array_proceso_are_2=array_proceso_are;
                array_satisfa_are_2=array_satisfa_are;
                array_categoria_area_2=array_categoria_area;
                array_inicio_gest_2=array_inicio_gest;
                array_proceso_gest_2=array_proceso_gest;
                array_satisfa_gest_2=array_satisfa_gest;
                array_categoria_gestion_2=array_categoria_gestion;
                array_scala_sexo_2=array_scala_sexo;
                console.log("categoria array_scala_sexo 2");
                console.log(array_scala_sexo);

                console.log("categoria sexo 2");
                console.log(array_categoria_sexo_2);


                stacked_column('cuadro_1-2', array_categoria_region, array_inicio, array_proceso, array_satisfa);

                pie_with_drilldown('cuadro_2-2', array_T_sexo, arr_sexo_f, arr_sexo_m, 'GRÁFICO POR SEXO', 'MUJERES', 'HOMBRES');

                pie_with_drilldown('cuadro_3-2', array_T_area, arr_area_r, arr_area_u, 'GRÁFICO POR ÁREA GEOGRÁFICA', 'RURAL', 'URBANA');

                pie_with_drilldown('cuadro_4-2', array_T_gestion, arr_gestion_e, arr_gestion_p, 'GRÁFICO POR GESTION', 'ESTATAL', 'PRIVADO');

                /////////////
                $("#contenedor").show();
            }
             if(datos1.length==0 && datos2.length==0 )
            {
                $("#contenedor").hide();
                show_mensaje("no hay datos con el filtro buscado");

            }
             else{


                 var array_categoria_sexo_p=mergeAndGetUnique(array_categoria_sexo_1,array_categoria_sexo_2);
                 var array_categoria_area_p=mergeAndGetUnique(array_categoria_area_1,array_categoria_area_2);
                 var array_categoria_gestion_p=mergeAndGetUnique(array_categoria_gestion_1,array_categoria_gestion_2);

                 cuadros_resumen('cuadro_1_resumen', 'CUADRO NIVELES POR REGIÓN', array_inicio_1, array_inicio_2,array_proceso_1, array_proceso_2,array_satisfa_1,array_satisfa_2, '-');

                 cuadros_resumen_2('cuadro_2_resumen', 'CUADRO NIVELES POR SEXO', array_scala_sexo_1,array_scala_sexo_2, array_categoria_sexo_p);


                 cuadros_resumen('cuadro_3_resumen', 'CUADRO NIVELES POR ÁREA GEOGRÁFICA', array_inicio_are_1,array_inicio_are_2, array_proceso_are_1,array_proceso_are_2, array_satisfa_are_1,array_satisfa_are_2, array_categoria_area_p);

                 cuadros_resumen('cuadro_4_resumen', 'CUADRO NIVELES POR GESTION', array_inicio_gest_1,array_inicio_gest_2, array_proceso_gest_1,array_proceso_gest_2, array_satisfa_gest_1,array_satisfa_gest_2, array_categoria_gestion_p);
             }
        }
    });
}


function getMicroregion(ulr_data) {
	
	event.preventDefault();

    var ugel = $("#cmb_ugel").val();
    var micro_regi = $("#cmb_micro").val();
    var nivel = $("#cmb_nivel_avance").val();
    var periodo = $("#cmb_periodo").val();
    var id_evaluacion = $("#cmb_area_avance").val();

    var parametros = {
        'ugel': ugel,
        'nivel': nivel,
        'id_evaluacion': id_evaluacion,
        'micro_regi': micro_regi,
        'periodo': periodo
    };
    $.ajax({
        url: ulr_data,
        method: "POST",
        dataType: 'json',
        data: parametros,
        success: function(dato) {
           // console.log(dato); //return false;
            var datos1 = dato['data_grado1'];
            var datos2 = dato['data_grado2'];
            //console.log(datos1);
           // console.log(datos2);
            var array_inicio_1=[];
            var array_inicio_2=[];
            var array_proceso_1=[];
            var array_proceso_2=[];
            var array_satisfa_1=[];
            var array_satisfa_2=[];

            var array_inicio_sex_1=[];
            var array_inicio_sex_2=[];
            var array_proceso_sex_1=[];
            var array_proceso_sex_2=[];
            var array_satisfa_sex_1=[];
            var array_satisfa_sex_2=[];

            var array_inicio_are_1=[];
            var array_inicio_are_2=[];
            var array_proceso_are_1=[];
            var array_proceso_are_2=[];
            var array_satisfa_are_1=[];
            var array_satisfa_are_2=[];

            var array_inicio_gest_1=[];
            var array_inicio_gest_2=[];
            var array_proceso_gest_1=[];
            var array_proceso_gest_2=[];
            var array_satisfa_gest_1=[];
            var array_satisfa_gest_2=[];

            var array_categoria_ugel_1=[];
            var array_categoria_ugel_2=[];
            var array_categoria_sexo_1=[];
            var array_categoria_sexo_2=[];
            var array_categoria_area_1=[];
            var array_categoria_area_2=[];
            var array_categoria_gestion_1=[];
            var array_categoria_gestion_2=[];

            if (datos1.length > 0) {
                var array_datos = datos1;
                var head_Escala = ['INICIO', 'PROCESO', 'SATISFACTORIO'];
                var array_ugel = new Array(),
                    array_escala = new Array(),
                    array_nota = new Array(),
                    array_ugel_nota = new Array(),
                    array_sexo = new Array(),
                    array_scala_sexo = new Array();
                var array_gestion = new Array(),
                    array_gestion_nota = new Array();
                var array_area_reg = new Array(),
                    array_area_reg_nota = new Array();
                var ugel_nivel_ini = new Array(),
                    ugel_nivel_proc = new Array(),
                    ugel_nivel_satis = new Array();

                $.each(array_datos, function(index, val) {
                    ugel = $.trim(val['nom_ugel']);
                    nota = parseInt($.trim(val['nota']));
                    area_geo = $.trim(val['area']).toUpperCase();
                    _id_gestion = parseInt($.trim(val['id_gestion']));
                    id_gestion = (_id_gestion == 1) ? 'ESTATAL' : 'PRIVADO';
                    sexo = $.trim(val['sexo']);
                    sexo = (sexo == 'M') ? "HOMBRES" : "MUJERES";
                    escala_1 = parseInt($.trim(val['escala1']));
                    escala_2 = parseInt($.trim(val['escala2']));
                    escala_3 = parseInt($.trim(val['escala3']));

                    if (!array_area_reg[area_geo]) {
                        array_area_reg[area_geo] = 0;
                    }
                    array_area_reg[area_geo] += +1;

                    if (!array_gestion[id_gestion]) {
                        array_gestion[id_gestion] = 0;
                    }
                    array_gestion[id_gestion] += +1;
                    if (!array_ugel[ugel]) {
                        array_ugel[ugel] = 0;
                    }
                    array_ugel[ugel] += +1;
                    if (!array_sexo[sexo]) {
                        array_sexo[sexo] = 0;
                    }
                    array_sexo[sexo] += +1;
                    if (nota >= 0 && nota < (escala_1+1)) {

                        if (!array_area_reg_nota["INICIO|" + area_geo]) {
                            array_area_reg_nota["INICIO|" + area_geo] = 0;
                        }
                        array_area_reg_nota["INICIO|" + area_geo] += +1;
                        if (!array_gestion_nota["INICIO|" + id_gestion]) {
                            array_gestion_nota["INICIO|" + id_gestion] = 0;
                        }
                        array_gestion_nota["INICIO|" + id_gestion] += +1;
                        if (!array_ugel_nota["INICIO|" + ugel]) {
                            array_ugel_nota["INICIO|" + ugel] = 0;
                        }
                        array_ugel_nota["INICIO|" + ugel] += +1;
                        if (!array_scala_sexo["INICIO|" + sexo]) {
                            array_scala_sexo["INICIO|" + sexo] = 0;
                        }
                        array_scala_sexo["INICIO|" + sexo] += +1;
                    } else if (nota > escala_1 && nota < (escala_2+1)) {
                        //PROCESO
                        if (!array_area_reg_nota["PROCESO|" + area_geo]) {
                            array_area_reg_nota["PROCESO|" + area_geo] = 0;
                        }
                        array_area_reg_nota["PROCESO|" + area_geo] += +1;

                        if (!array_gestion_nota["PROCESO|" + id_gestion]) {
                            array_gestion_nota["PROCESO|" + id_gestion] = 0;
                        }
                        array_gestion_nota["PROCESO|" + id_gestion] += +1;

                        if (!array_ugel_nota["PROCESO|" + ugel]) {
                            array_ugel_nota["PROCESO|" + ugel] = 0;
                        }
                        array_ugel_nota["PROCESO|" + ugel] += +1;
                        if (!array_scala_sexo["PROCESO|" + sexo]) {
                            array_scala_sexo["PROCESO|" + sexo] = 0;
                        }
                        array_scala_sexo["PROCESO|" + sexo] += +1;
                    } else if (nota > escala_2) {
                        //SATISFACTORIO
                        if (!array_area_reg_nota["SATISFACTORIO|" + area_geo]) {
                            array_area_reg_nota["SATISFACTORIO|" + area_geo] = 0;
                        }
                        array_area_reg_nota["SATISFACTORIO|" + area_geo] += +1;
                        if (!array_gestion_nota["SATISFACTORIO|" + id_gestion]) {
                            array_gestion_nota["SATISFACTORIO|" + id_gestion] = 0;
                        }
                        array_gestion_nota["SATISFACTORIO|" + id_gestion] += +1;
                        if (!array_ugel_nota["SATISFACTORIO|" + ugel]) {
                            array_ugel_nota["SATISFACTORIO|" + ugel] = 0;
                        }
                        array_ugel_nota["SATISFACTORIO|" + ugel] += +1;
                        if (!array_scala_sexo["SATISFACTORIO|" + sexo]) {
                            array_scala_sexo["SATISFACTORIO|" + sexo] = 0;
                        }
                        array_scala_sexo["SATISFACTORIO|" + sexo] += +1;
                    }
                });
              //  console.log('PROCESO|HOMBRES');
              //  console.log(array_scala_sexo['PROCESO|HOMBRES']);

                var total_hombres = 0,
                    total_mujeres = 0,
                    array_T_sexo = new Array();
                var total_privado = 0,
                    total_estatal = 0,
                    array_T_gestion = new Array();
                var total_urbana = 0,
                    total_rural = 0,
                    array_T_area = new Array();
                var array_categoria_ugel = new Array();
                var array_categoria_area = new Array();
                var array_categoria_gestion = new Array();
                var array_categoria_sexo = new Array();
                for (var ug in array_ugel) {
                    array_categoria_ugel.push(ug);
                }
                for (var sex in array_sexo) {
                    array_categoria_sexo.push(sex);
                }
                for (var uga in array_area_reg) {
                    array_categoria_area.push(uga);
                }
                for (var gest in array_gestion) {
                    array_categoria_gestion.push(gest);
                }
                for (var sx in array_sexo) {
                    array_T_sexo.push({
                        name: sx,
                        y: calc(array_sexo[sx], datos1.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'HOMBRES') {
                        total_hombres += array_sexo['HOMBRES'];
                    } else if (sx == 'MUJERES') {
                        total_mujeres += array_sexo['MUJERES'];
                    }
                }
                for (var sx in array_gestion) {
                    array_T_gestion.push({
                        name: sx,
                        y: calc(array_gestion[sx], datos1.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'PRIVADO') {
                        total_privado += array_gestion['PRIVADO'];
                    } else if (sx == 'ESTATAL') {
                        total_estatal += array_gestion['ESTATAL'];
                    }
                }
                for (var sx in array_area_reg) {
                    array_T_area.push({
                        name: sx,
                        y: calc(array_area_reg[sx], datos1.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'URBANA') {
                        total_urbana += array_area_reg['URBANA'];
                    } else if (sx == 'RURAL') {
                        total_rural += array_area_reg['RURAL'];
                    }
                }
                var array_inicio = new Array(),
                    array_proceso = new Array(),
                    array_satisfa = new Array();
                var array_inicio_sex = new Array(),
                    array_proceso_sex = new Array(),
                    array_satisfa_sex = new Array();
                var array_inicio_are = new Array(),
                    array_proceso_are = new Array(),
                    array_satisfa_are = new Array();
                var array_inicio_gest = new Array(),
                    array_proceso_gest = new Array(),
                    array_satisfa_gest = new Array();

                for (var ug = 0; ug < array_categoria_ugel.length; ug++) {

                    if (!array_ugel_nota['SATISFACTORIO|' + array_categoria_ugel[ug]]) {
                        array_satisfa.push(0);
                    } else if (array_ugel_nota['SATISFACTORIO|' + array_categoria_ugel[ug]] >= 0) {
                        array_satisfa.push(array_ugel_nota['SATISFACTORIO|' + array_categoria_ugel[ug]]);
                    }

                    if (!array_ugel_nota['PROCESO|' + array_categoria_ugel[ug]]) {
                        array_proceso.push(0);
                    } else if (array_ugel_nota['PROCESO|' + array_categoria_ugel[ug]] >= 0) {
                        array_proceso.push(array_ugel_nota['PROCESO|' + array_categoria_ugel[ug]]);
                    }

                    if (!array_ugel_nota['INICIO|' + array_categoria_ugel[ug]]) {
                        array_inicio.push(0);
                    } else if (array_ugel_nota['INICIO|' + array_categoria_ugel[ug]] >= 0) {
                        array_inicio.push(array_ugel_nota['INICIO|' + array_categoria_ugel[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_sexo.length; ug++) {

                    if (!array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]]) {
                        array_satisfa_sex.push(0);
                    } else if (array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]] >= 0) {
                        array_satisfa_sex.push(array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]]);
                    }

                    if (!array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]]) {
                        array_proceso_sex.push(0);
                    } else if (array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]] >= 0) {
                        array_proceso_sex.push(array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]]);
                    }

                    if (!array_scala_sexo['INICIO|' + array_categoria_sexo[ug]]) {
                        array_inicio_sex.push(0);
                    } else if (array_scala_sexo['INICIO|' + array_categoria_sexo[ug]] >= 0) {
                        array_inicio_sex.push(array_scala_sexo['INICIO|' + array_categoria_sexo[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_area.length; ug++) {

                    if (!array_area_reg_nota['SATISFACTORIO|' + array_categoria_area[ug]]) {
                        array_satisfa_are.push(0);
                    } else if (array_area_reg_nota['SATISFACTORIO|' + array_categoria_area[ug]] >= 0) {
                        array_satisfa_are.push(array_area_reg_nota['SATISFACTORIO|' + array_categoria_area[ug]]);
                    }

                    if (!array_area_reg_nota['PROCESO|' + array_categoria_area[ug]]) {
                        array_proceso_are.push(0);
                    } else if (array_area_reg_nota['PROCESO|' + array_categoria_area[ug]] >= 0) {
                        array_proceso_are.push(array_area_reg_nota['PROCESO|' + array_categoria_area[ug]]);
                    }

                    if (!array_area_reg_nota['INICIO|' + array_categoria_area[ug]]) {
                        array_inicio_are.push(0);
                    } else if (array_area_reg_nota['INICIO|' + array_categoria_area[ug]] >= 0) {
                        array_inicio_are.push(array_area_reg_nota['INICIO|' + array_categoria_area[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_gestion.length; ug++) {

                    if (!array_gestion_nota['SATISFACTORIO|' + array_categoria_gestion[ug]]) {
                        array_satisfa_gest.push(0);
                    } else if (array_gestion_nota['SATISFACTORIO|' + array_categoria_gestion[ug]] >= 0) {
                        array_satisfa_gest.push(array_gestion_nota['SATISFACTORIO|' + array_categoria_gestion[ug]]);
                    }

                    if (!array_gestion_nota['PROCESO|' + array_categoria_gestion[ug]]) {
                        array_proceso_gest.push(0);
                    } else if (array_gestion_nota['PROCESO|' + array_categoria_gestion[ug]] >= 0) {
                        array_proceso_gest.push(array_gestion_nota['PROCESO|' + array_categoria_gestion[ug]]);
                    }

                    if (!array_gestion_nota['INICIO|' + array_categoria_gestion[ug]]) {
                        array_inicio_gest.push(0);
                    } else if (array_gestion_nota['INICIO|' + array_categoria_gestion[ug]] >= 0) {
                        array_inicio_gest.push(array_gestion_nota['INICIO|' + array_categoria_gestion[ug]]);
                    }
                }
                //,['color':'#73B4B9'] satisf
                //['color':'#FABB05']  proceso
                //['color':'#E94235']  inicio                   //arr_sexo_f.push({'name':'INICIO',y:calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_mujeres,"%",'2'),color:'#E94235'});

                for (var head in head_Escala) {
                    //=======================================================================
                    var arr_sexo_f = new Array(),
                        arr_sexo_m = new Array();
                    var arr_gestion_e = new Array(),
                        arr_gestion_p = new Array();
                    var arr_area_u = new Array(),
                        arr_area_r = new Array();

                    for (var ar_sex in array_scala_sexo) {
                        var split_ar_sex = ar_sex.split("|");

                        if ($.trim(split_ar_sex[0]) == 'INICIO') {

                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["INICIO",calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_mujeres,"%",'2') ]] );
                                arr_sexo_f.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_sexo["INICIO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["INICIO",calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_hombres,"%",'2') ]] );
                                arr_sexo_m.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_sexo["INICIO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_sex[0]) == 'PROCESO') {

                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["PROCESO",calc(array_scala_sexo["PROCESO|"+split_ar_sex[1]],total_mujeres,"%",'2') ]] );
                                arr_sexo_f.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_sexo["PROCESO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["PROCESO",calc(array_scala_sexo["PROCESO|"+split_ar_sex[1]],total_hombres,"%",'2') ]] );

                                arr_sexo_m.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_sexo["PROCESO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_sex[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["SATISFACTORIO",calc(array_scala_sexo["SATISFACTORIO|"+split_ar_sex[1]],total_mujeres,"%",'2') ]] );
                                arr_sexo_f.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_sexo["SATISFACTORIO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_satis
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["SATISFACTORIO",calc(array_scala_sexo["SATISFACTORIO|"+split_ar_sex[1]],total_hombres,"%",'2') ]] );
                                arr_sexo_m.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_sexo["SATISFACTORIO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }
                    //=======================================================================
                    for (var ar_gest in array_gestion_nota) { //array_gestion_nota
                        var split_ar_gest = ar_gest.split("|");
                        if ($.trim(split_ar_gest[0]) == 'INICIO') {
                            if ($.trim(split_ar_gest[1]) == 'PRIVADO') {
                                //arr_gestion_p=arr_gestion_p.concat([["INICIO",calc(array_gestion_nota["INICIO|"+split_ar_gest[1]],total_privado,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'INICIO',
                                    y: calc(array_gestion_nota["INICIO|" + split_ar_gest[1]], total_privado, "%", '2'),
                                    color: color_ini
                                });
                            } else if ($.trim(split_ar_gest[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["INICIO",calc(array_gestion_nota["INICIO|"+split_ar_gest[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'INICIO',
                                    y: calc(array_gestion_nota["INICIO|" + split_ar_gest[1]], total_estatal, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_gest[0]) == 'PROCESO') {
                            if ($.trim(split_ar_gest[1]) == 'PRIVADO') {
                                //arr_gestion_p=arr_gestion_p.concat([["PROCESO",calc(array_gestion_nota["PROCESO|"+split_ar_gest[1]],total_privado,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'PROCESO',
                                    y: calc(array_gestion_nota["PROCESO|" + split_ar_gest[1]], total_privado, "%", '2'),
                                    color: color_proc
                                });
                            } else if ($.trim(split_ar_gest[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["PROCESO",calc(array_gestion_nota["PROCESO|"+split_ar_gest[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'PROCESO',
                                    y: calc(array_gestion_nota["PROCESO|" + split_ar_gest[1]], total_estatal, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_gest[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_gest[1]) == 'PRIVADO') {
                                //arr_gestion_p=arr_gestion_p.concat([["SATISFACTORIO",calc(array_gestion_nota["SATISFACTORIO|"+split_ar_gest[1]],total_privado,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_gestion_nota["SATISFACTORIO|" + split_ar_gest[1]], total_privado, "%", '2'),
                                    color: color_satis
                                });
                            } else if ($.trim(split_ar_gest[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["SATISFACTORIO",calc(array_gestion_nota["SATISFACTORIO|"+split_ar_gest[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_gestion_nota["SATISFACTORIO|" + split_ar_gest[1]], total_estatal, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }

                    //=======================================================================

                    for (var ar_are_not in array_area_reg_nota) {
                        var split_ar_area = ar_are_not.split("|");
                        if ($.trim(split_ar_area[0]) == 'INICIO') {
                            if ($.trim(split_ar_area[1]) == 'URBANA') {
                                // arr_area_u=arr_area_u.concat([["INICIO",calc(array_area_reg_nota["INICIO|"+split_ar_area[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'INICIO',
                                    y: calc(array_area_reg_nota["INICIO|" + split_ar_area[1]], total_urbana, "%", '2'),
                                    color: color_ini
                                });
                            } else if ($.trim(split_ar_area[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["INICIO",calc(array_area_reg_nota["INICIO|"+split_ar_area[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'INICIO',
                                    y: calc(array_area_reg_nota["INICIO|" + split_ar_area[1]], total_rural, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_area[0]) == 'PROCESO') {
                            if ($.trim(split_ar_area[1]) == 'URBANA') {
                                //arr_area_u=arr_area_u.concat([["PROCESO",calc(array_area_reg_nota["PROCESO|"+split_ar_area[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'PROCESO',
                                    y: calc(array_area_reg_nota["PROCESO|" + split_ar_area[1]], total_urbana, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_area[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["PROCESO",calc(array_area_reg_nota["PROCESO|"+split_ar_area[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'PROCESO',
                                    y: calc(array_area_reg_nota["PROCESO|" + split_ar_area[1]], total_rural, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_area[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_area[1]) == 'URBANA') {
                                //arr_area_u=arr_area_u.concat([["SATISFACTORIO",calc(array_area_reg_nota["SATISFACTORIO|"+split_ar_area[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_area_reg_nota["SATISFACTORIO|" + split_ar_area[1]], total_urbana, "%", '2'),
                                    color: color_satis
                                });
                            } else if ($.trim(split_ar_area[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["SATISFACTORIO",calc(array_area_reg_nota["SATISFACTORIO|"+split_ar_area[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_area_reg_nota["SATISFACTORIO|" + split_ar_area[1]], total_rural, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }

                }

                stacked_column('cuadro_1-1', array_categoria_ugel, array_inicio, array_proceso, array_satisfa);
                pie_with_drilldown('cuadro_2-1', array_T_sexo, arr_sexo_f, arr_sexo_m, 'GRÁFICO POR SEXO', 'MUJERES', 'HOMBRES');
                pie_with_drilldown('cuadro_3-1', array_T_area, arr_area_u, arr_area_r, 'GRÁFICO POR REGIÓN GEOGRÁFICA', 'URBANA', 'RURAL');
                pie_with_drilldown('cuadro_4-1', array_T_gestion, arr_gestion_e, arr_gestion_p, 'GRÁFICO POR GESTION', 'ESTATAL', 'PRIVADO');

                array_inicio_1=array_inicio;
                array_proceso_1=array_proceso;
                array_satisfa_1=array_satisfa;

                array_inicio_sex_1=array_inicio_sex;
                array_proceso_sex_1=array_proceso_sex;
                array_satisfa_sex_1=array_satisfa_sex;

                array_inicio_are_1=array_inicio_are;
                array_proceso_are_1=array_proceso_are;
                array_satisfa_are_1=array_satisfa_are;

                array_inicio_gest_1=array_inicio_gest;
                array_proceso_gest_1=array_proceso_gest;
                array_satisfa_gest_1=array_satisfa_gest;
                array_categoria_ugel_1=array_categoria_ugel;
                array_categoria_sexo_1=array_categoria_sexo;
                array_categoria_area_1=array_categoria_area;
                array_categoria_gestion_1=array_categoria_gestion;

                /////////////
                $("#contenedor").show();
            }
            if (datos2.length > 0) {
                var array_datos = datos2;
                var head_Escala = ['INICIO', 'PROCESO', 'SATISFACTORIO'];
                var array_ugel = new Array(),
                    array_escala = new Array(),
                    array_nota = new Array(),
                    array_ugel_nota = new Array(),
                    array_sexo = new Array(),
                    array_scala_sexo = new Array();
                var array_gestion = new Array(),
                    array_gestion_nota = new Array();
                var array_area_reg = new Array(),
                    array_area_reg_nota = new Array();
                var ugel_nivel_ini = new Array(),
                    ugel_nivel_proc = new Array(),
                    ugel_nivel_satis = new Array();

                $.each(array_datos, function(index, val) {
                    ugel = $.trim(val['nom_ugel']);
                    nota = parseInt($.trim(val['nota']));
                    area_geo = $.trim(val['area']).toUpperCase();
                    _id_gestion = parseInt($.trim(val['id_gestion']));
                    id_gestion = (_id_gestion == 1) ? 'ESTATAL' : 'PRIVADO';
                    sexo = $.trim(val['sexo']);
                    sexo = (sexo == 'M') ? "HOMBRES" : "MUJERES";
                    escala_1 = parseInt($.trim(val['escala1']));
                    escala_2 = parseInt($.trim(val['escala2']));
                    escala_3 = parseInt($.trim(val['escala3']));

                    if (!array_area_reg[area_geo]) {
                        array_area_reg[area_geo] = 0;
                    }
                    array_area_reg[area_geo] += +1;

                    if (!array_gestion[id_gestion]) {
                        array_gestion[id_gestion] = 0;
                    }
                    array_gestion[id_gestion] += +1;


                    if (!array_ugel[ugel]) {
                        array_ugel[ugel] = 0;
                    }
                    array_ugel[ugel] += +1;


                    if (!array_sexo[sexo]) {
                        array_sexo[sexo] = 0;
                    }
                    array_sexo[sexo] += +1;

                    if (nota >= 0 && nota <= escala_1) {

                        if (!array_area_reg_nota["INICIO|" + area_geo]) {
                            array_area_reg_nota["INICIO|" + area_geo] = 0;
                        }
                        array_area_reg_nota["INICIO|" + area_geo] += +1;
                        if (!array_gestion_nota["INICIO|" + id_gestion]) {
                            array_gestion_nota["INICIO|" + id_gestion] = 0;
                        }
                        array_gestion_nota["INICIO|" + id_gestion] += +1;
                        if (!array_ugel_nota["INICIO|" + ugel]) {
                            array_ugel_nota["INICIO|" + ugel] = 0;
                        }
                        array_ugel_nota["INICIO|" + ugel] += +1;
                        if (!array_scala_sexo["INICIO|" + sexo]) {
                            array_scala_sexo["INICIO|" + sexo] = 0;
                        }
                        array_scala_sexo["INICIO|" + sexo] += +1;
                    } else if (nota > escala_1 && nota <= escala_2) {
                        //PROCESO
                        if (!array_area_reg_nota["PROCESO|" + area_geo]) {
                            array_area_reg_nota["PROCESO|" + area_geo] = 0;
                        }
                        array_area_reg_nota["PROCESO|" + area_geo] += +1;

                        if (!array_gestion_nota["PROCESO|" + id_gestion]) {
                            array_gestion_nota["PROCESO|" + id_gestion] = 0;
                        }
                        array_gestion_nota["PROCESO|" + id_gestion] += +1;

                        if (!array_ugel_nota["PROCESO|" + ugel]) {
                            array_ugel_nota["PROCESO|" + ugel] = 0;

                        }
                        array_ugel_nota["PROCESO|" + ugel] += +1;


                        if (!array_scala_sexo["PROCESO|" + sexo]) {
                            array_scala_sexo["PROCESO|" + sexo] = 0;
                        }
                        array_scala_sexo["PROCESO|" + sexo] += +1;
                    } else if (nota > escala_2) {
                        //SATISFACTORIO
                        if (!array_area_reg_nota["SATISFACTORIO|" + area_geo]) {
                            array_area_reg_nota["SATISFACTORIO|" + area_geo] = 0;
                        }
                        array_area_reg_nota["SATISFACTORIO|" + area_geo] += +1;
                        if (!array_gestion_nota["SATISFACTORIO|" + id_gestion]) {
                            array_gestion_nota["SATISFACTORIO|" + id_gestion] = 0;
                        }
                        array_gestion_nota["SATISFACTORIO|" + id_gestion] += +1;
                        if (!array_ugel_nota["SATISFACTORIO|" + ugel]) {
                            array_ugel_nota["SATISFACTORIO|" + ugel] = 0;
                        }
                        array_ugel_nota["SATISFACTORIO|" + ugel] += +1;
                        if (!array_scala_sexo["SATISFACTORIO|" + sexo]) {
                            array_scala_sexo["SATISFACTORIO|" + sexo] = 0;
                        }
                        array_scala_sexo["SATISFACTORIO|" + sexo] += +1;
                    }
                });

                var total_hombres = 0,
                    total_mujeres = 0,
                    array_T_sexo = new Array();
                var total_privado = 0,
                    total_estatal = 0,
                    array_T_gestion = new Array();
                var total_urbana = 0,
                    total_rural = 0,
                    array_T_area = new Array();
                var array_categoria_ugel = new Array();
                var array_categoria_area = new Array();
                var array_categoria_gestion = new Array();
                var array_categoria_sexo = new Array();
                for (var ug in array_ugel) {
                    array_categoria_ugel.push(ug);
                }
                for (var sex in array_sexo) {
                    array_categoria_sexo.push(sex);
                }
                for (var uga in array_area_reg) {
                    array_categoria_area.push(uga);
                }
                for (var gest in array_gestion) {
                    array_categoria_gestion.push(gest);
                }
                for (var sx in array_sexo) {
                    array_T_sexo.push({
                        name: sx,
                        y: calc(array_sexo[sx], datos2.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'HOMBRES') {
                        total_hombres += array_sexo['HOMBRES'];
                    } else if (sx == 'MUJERES') {
                        total_mujeres += array_sexo['MUJERES'];
                    }
                }
                for (var sx in array_gestion) {
                    array_T_gestion.push({
                        name: sx,
                        y: calc(array_gestion[sx], datos2.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'PRIVADO') {
                        total_privado += array_gestion['PRIVADO'];
                    } else if (sx == 'ESTATAL') {
                        total_estatal += array_gestion['ESTATAL'];
                    }
                }
                for (var sx in array_area_reg) {
                    array_T_area.push({
                        name: sx,
                        y: calc(array_area_reg[sx], datos2.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'URBANA') {
                        total_urbana += array_area_reg['URBANA'];
                    } else if (sx == 'RURAL') {
                        total_rural += array_area_reg['RURAL'];
                    }
                }
                var array_inicio = new Array(),
                    array_proceso = new Array(),
                    array_satisfa = new Array();
                var array_inicio_sex = new Array(),
                    array_proceso_sex = new Array(),
                    array_satisfa_sex = new Array();
                var array_inicio_are = new Array(),
                    array_proceso_are = new Array(),
                    array_satisfa_are = new Array();
                var array_inicio_gest = new Array(),
                    array_proceso_gest = new Array(),
                    array_satisfa_gest = new Array();

                for (var ug = 0; ug < array_categoria_ugel.length; ug++) {

                    if (!array_ugel_nota['SATISFACTORIO|' + array_categoria_ugel[ug]]) {
                        array_satisfa.push(0);
                    } else if (array_ugel_nota['SATISFACTORIO|' + array_categoria_ugel[ug]] >= 0) {
                        array_satisfa.push(array_ugel_nota['SATISFACTORIO|' + array_categoria_ugel[ug]]);
                    }

                    if (!array_ugel_nota['PROCESO|' + array_categoria_ugel[ug]]) {
                        array_proceso.push(0);
                    } else if (array_ugel_nota['PROCESO|' + array_categoria_ugel[ug]] >= 0) {
                        array_proceso.push(array_ugel_nota['PROCESO|' + array_categoria_ugel[ug]]);
                    }

                    if (!array_ugel_nota['INICIO|' + array_categoria_ugel[ug]]) {
                        array_inicio.push(0);
                    } else if (array_ugel_nota['INICIO|' + array_categoria_ugel[ug]] >= 0) {
                        array_inicio.push(array_ugel_nota['INICIO|' + array_categoria_ugel[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_sexo.length; ug++) {

                    if (!array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]]) {
                        array_satisfa_sex.push(0);
                    } else if (array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]] >= 0) {
                        array_satisfa_sex.push(array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]]);
                    }

                    if (!array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]]) {
                        array_proceso_sex.push(0);
                    } else if (array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]] >= 0) {
                        array_proceso_sex.push(array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]]);
                    }

                    if (!array_scala_sexo['INICIO|' + array_categoria_sexo[ug]]) {
                        array_inicio_sex.push(0);
                    } else if (array_scala_sexo['INICIO|' + array_categoria_sexo[ug]] >= 0) {
                        array_inicio_sex.push(array_scala_sexo['INICIO|' + array_categoria_sexo[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_area.length; ug++) {

                    if (!array_area_reg_nota['SATISFACTORIO|' + array_categoria_area[ug]]) {
                        array_satisfa_are.push(0);
                    } else if (array_area_reg_nota['SATISFACTORIO|' + array_categoria_area[ug]] >= 0) {
                        array_satisfa_are.push(array_area_reg_nota['SATISFACTORIO|' + array_categoria_area[ug]]);
                    }

                    if (!array_area_reg_nota['PROCESO|' + array_categoria_area[ug]]) {
                        array_proceso_are.push(0);
                    } else if (array_area_reg_nota['PROCESO|' + array_categoria_area[ug]] >= 0) {
                        array_proceso_are.push(array_area_reg_nota['PROCESO|' + array_categoria_area[ug]]);
                    }

                    if (!array_area_reg_nota['INICIO|' + array_categoria_area[ug]]) {
                        array_inicio_are.push(0);
                    } else if (array_area_reg_nota['INICIO|' + array_categoria_area[ug]] >= 0) {
                        array_inicio_are.push(array_area_reg_nota['INICIO|' + array_categoria_area[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_gestion.length; ug++) {

                    if (!array_gestion_nota['SATISFACTORIO|' + array_categoria_gestion[ug]]) {
                        array_satisfa_gest.push(0);
                    } else if (array_gestion_nota['SATISFACTORIO|' + array_categoria_gestion[ug]] >= 0) {
                        array_satisfa_gest.push(array_gestion_nota['SATISFACTORIO|' + array_categoria_gestion[ug]]);
                    }

                    if (!array_gestion_nota['PROCESO|' + array_categoria_gestion[ug]]) {
                        array_proceso_gest.push(0);
                    } else if (array_gestion_nota['PROCESO|' + array_categoria_gestion[ug]] >= 0) {
                        array_proceso_gest.push(array_gestion_nota['PROCESO|' + array_categoria_gestion[ug]]);
                    }

                    if (!array_gestion_nota['INICIO|' + array_categoria_gestion[ug]]) {
                        array_inicio_gest.push(0);
                    } else if (array_gestion_nota['INICIO|' + array_categoria_gestion[ug]] >= 0) {
                        array_inicio_gest.push(array_gestion_nota['INICIO|' + array_categoria_gestion[ug]]);
                    }
                }
                //,['color':'#73B4B9'] satisf
                //['color':'#FABB05']  proceso
                //['color':'#E94235']  inicio                   //arr_sexo_f.push({'name':'INICIO',y:calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_mujeres,"%",'2'),color:'#E94235'});

                for (var head in head_Escala) {
                    //=======================================================================
                    var arr_sexo_f = new Array(),
                        arr_sexo_m = new Array();
                    var arr_gestion_e = new Array(),
                        arr_gestion_p = new Array();
                    var arr_area_u = new Array(),
                        arr_area_r = new Array();

                    for (var ar_sex in array_scala_sexo) {
                        var split_ar_sex = ar_sex.split("|");

                        if ($.trim(split_ar_sex[0]) == 'INICIO') {

                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["INICIO",calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_mujeres,"%",'2') ]] );
                                arr_sexo_f.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_sexo["INICIO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["INICIO",calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_hombres,"%",'2') ]] );
                                arr_sexo_m.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_sexo["INICIO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_sex[0]) == 'PROCESO') {

                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["PROCESO",calc(array_scala_sexo["PROCESO|"+split_ar_sex[1]],total_mujeres,"%",'2') ]] );
                                arr_sexo_f.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_sexo["PROCESO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["PROCESO",calc(array_scala_sexo["PROCESO|"+split_ar_sex[1]],total_hombres,"%",'2') ]] );

                                arr_sexo_m.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_sexo["PROCESO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_sex[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["SATISFACTORIO",calc(array_scala_sexo["SATISFACTORIO|"+split_ar_sex[1]],total_mujeres,"%",'2') ]] );
                                arr_sexo_f.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_sexo["SATISFACTORIO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_satis
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["SATISFACTORIO",calc(array_scala_sexo["SATISFACTORIO|"+split_ar_sex[1]],total_hombres,"%",'2') ]] );
                                arr_sexo_m.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_sexo["SATISFACTORIO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }
                    //=======================================================================
                    for (var ar_gest in array_gestion_nota) { //array_gestion_nota
                        var split_ar_gest = ar_gest.split("|");
                        if ($.trim(split_ar_gest[0]) == 'INICIO') {
                            if ($.trim(split_ar_gest[1]) == 'PRIVADO') {
                                //arr_gestion_p=arr_gestion_p.concat([["INICIO",calc(array_gestion_nota["INICIO|"+split_ar_gest[1]],total_privado,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'INICIO',
                                    y: calc(array_gestion_nota["INICIO|" + split_ar_gest[1]], total_privado, "%", '2'),
                                    color: color_ini
                                });
                            } else if ($.trim(split_ar_gest[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["INICIO",calc(array_gestion_nota["INICIO|"+split_ar_gest[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'INICIO',
                                    y: calc(array_gestion_nota["INICIO|" + split_ar_gest[1]], total_estatal, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_gest[0]) == 'PROCESO') {
                            if ($.trim(split_ar_gest[1]) == 'PRIVADO') {
                                //arr_gestion_p=arr_gestion_p.concat([["PROCESO",calc(array_gestion_nota["PROCESO|"+split_ar_gest[1]],total_privado,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'PROCESO',
                                    y: calc(array_gestion_nota["PROCESO|" + split_ar_gest[1]], total_privado, "%", '2'),
                                    color: color_proc
                                });
                            } else if ($.trim(split_ar_gest[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["PROCESO",calc(array_gestion_nota["PROCESO|"+split_ar_gest[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'PROCESO',
                                    y: calc(array_gestion_nota["PROCESO|" + split_ar_gest[1]], total_estatal, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_gest[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_gest[1]) == 'PRIVADO') {
                                //arr_gestion_p=arr_gestion_p.concat([["SATISFACTORIO",calc(array_gestion_nota["SATISFACTORIO|"+split_ar_gest[1]],total_privado,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_gestion_nota["SATISFACTORIO|" + split_ar_gest[1]], total_privado, "%", '2'),
                                    color: color_satis
                                });
                            } else if ($.trim(split_ar_gest[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["SATISFACTORIO",calc(array_gestion_nota["SATISFACTORIO|"+split_ar_gest[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_gestion_nota["SATISFACTORIO|" + split_ar_gest[1]], total_estatal, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }

                    //=======================================================================

                    for (var ar_are_not in array_area_reg_nota) {
                        var split_ar_area = ar_are_not.split("|");
                        if ($.trim(split_ar_area[0]) == 'INICIO') {
                            if ($.trim(split_ar_area[1]) == 'URBANA') {
                                // arr_area_u=arr_area_u.concat([["INICIO",calc(array_area_reg_nota["INICIO|"+split_ar_area[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'INICIO',
                                    y: calc(array_area_reg_nota["INICIO|" + split_ar_area[1]], total_urbana, "%", '2'),
                                    color: color_ini
                                });
                            } else if ($.trim(split_ar_area[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["INICIO",calc(array_area_reg_nota["INICIO|"+split_ar_area[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'INICIO',
                                    y: calc(array_area_reg_nota["INICIO|" + split_ar_area[1]], total_rural, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_area[0]) == 'PROCESO') {
                            if ($.trim(split_ar_area[1]) == 'URBANA') {
                                //arr_area_u=arr_area_u.concat([["PROCESO",calc(array_area_reg_nota["PROCESO|"+split_ar_area[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'PROCESO',
                                    y: calc(array_area_reg_nota["PROCESO|" + split_ar_area[1]], total_urbana, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_area[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["PROCESO",calc(array_area_reg_nota["PROCESO|"+split_ar_area[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'PROCESO',
                                    y: calc(array_area_reg_nota["PROCESO|" + split_ar_area[1]], total_rural, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_area[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_area[1]) == 'URBANA') {
                                //arr_area_u=arr_area_u.concat([["SATISFACTORIO",calc(array_area_reg_nota["SATISFACTORIO|"+split_ar_area[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_area_reg_nota["SATISFACTORIO|" + split_ar_area[1]], total_urbana, "%", '2'),
                                    color: color_satis
                                });
                            } else if ($.trim(split_ar_area[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["SATISFACTORIO",calc(array_area_reg_nota["SATISFACTORIO|"+split_ar_area[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_area_reg_nota["SATISFACTORIO|" + split_ar_area[1]], total_rural, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }

                }

                stacked_column('cuadro_1-2', array_categoria_ugel, array_inicio, array_proceso, array_satisfa);

                pie_with_drilldown('cuadro_2-2', array_T_sexo, arr_sexo_f, arr_sexo_m, 'GRÁFICO POR SEXO', 'MUJERES', 'HOMBRES');

                pie_with_drilldown('cuadro_3-2', array_T_area, arr_area_u, arr_area_r, 'GRÁFICO POR REGIÓN GEOGRÁFICA', 'URBANA', 'RURAL');

                pie_with_drilldown('cuadro_4-2', array_T_gestion, arr_gestion_e, arr_gestion_p, 'GRÁFICO POR GESTION', 'ESTATAL', 'PRIVADO');

                $("#contenedor").show();
                array_inicio_2=array_inicio;
                array_proceso_2=array_proceso;
                array_satisfa_2=array_satisfa;

                array_inicio_sex_2=array_inicio_sex;
                array_proceso_sex_2=array_proceso_sex;
                array_satisfa_sex_2=array_satisfa_sex;

                array_inicio_are_2=array_inicio_are;
                array_proceso_are_2=array_proceso_are;
                array_satisfa_are_2=array_satisfa_are;

                array_inicio_gest_2=array_inicio_gest;
                array_proceso_gest_2=array_proceso_gest;
                array_satisfa_gest_2=array_satisfa_gest;

                array_categoria_ugel_2=array_categoria_ugel;
                array_categoria_sexo_2=array_categoria_sexo;
                array_categoria_area_2=array_categoria_area;
                array_categoria_gestion_2=array_categoria_gestion;

            }
            if(datos1.length>0 || datos2.length>0){
                var array_categoria_ugel_p=mergeAndGetUnique(array_categoria_ugel_1,array_categoria_ugel_2);
                var array_categoria_sexo_p=mergeAndGetUnique(array_categoria_sexo_1,array_categoria_sexo_2);
                var array_categoria_area_p=mergeAndGetUnique(array_categoria_area_1,array_categoria_area_2);
                var array_categoria_gestion_p=mergeAndGetUnique(array_categoria_gestion_1,array_categoria_gestion_2);

                cuadros_resumen('cuadro_1_resumen', 'CUADRO NIVELES POR UGEL', array_inicio_1,array_inicio_2, array_proceso_1, array_proceso_2,array_satisfa_1,array_satisfa_2, array_categoria_ugel_p);

                cuadros_resumen('cuadro_2_resumen', 'CUADRO NIVELES POR SEXO', array_inicio_sex_1,array_inicio_sex_2,array_proceso_sex_1, array_proceso_sex_2,array_satisfa_sex_1,array_satisfa_sex_2, array_categoria_sexo_p);

                cuadros_resumen('cuadro_3_resumen', 'CUADRO NIVELES POR ÁREA GEOGRÁFICA', array_inicio_are_1,array_inicio_are_2, array_proceso_are_1,array_proceso_are_2, array_satisfa_are_1,array_satisfa_are_2, array_categoria_area_p);

                cuadros_resumen('cuadro_4_resumen', 'CUADRO NIVELES POR GESTION', array_inicio_gest_1,array_inicio_gest_2, array_proceso_gest_1,array_proceso_gest_2, array_satisfa_gest_1,array_satisfa_gest_2, array_categoria_gestion_p);
            }
            if(datos1.length==0 && datos2.length==0){
                $("#contenedor").hide();
                show_mensaje("no hay datos con el filtro buscado");
            }
        }
    });
}

function getEscala(ulr_data) {
	
	event.preventDefault();

    var ugel = $('#cmbUgel').val();
    var cod_local = $('#cmbColegio').val();
    var nivel = $('#cmb_nivel_avance').val();
    var id_evaluacion = $('#cmb_area_avance').val();
    var periodo = $('#cmb_periodo').val();


    var parametros = {
        ugel: ugel,
        'nivel': nivel,
        'cod_local': cod_local,
        'periodo': periodo,
        'id_evaluacion': id_evaluacion
    };
    $.ajax({
        url: ulr_data,
        method: "POST",
        dataType: 'json',
        data: parametros,
        success: function(dato) {
            var datos1 = dato['data_grado1'];
            var datos2 = dato['data_grado2'];
            var total1 = dato['total1'];
            var total2 = dato['total2'];


            var array_inicio_1=[];
            var array_inicio_2=[];
            var array_proceso_1=[];
            var array_proceso_2=[];
            var array_satisfa_1=[];
            var array_satisfa_2=[];

            var array_T_sexo_1=[];
            var array_T_sexo_2=[];
            var arr_sexo_f_1=[];
            var arr_sexo_f_2=[];
            var arr_sexo_m_1=[];
            var arr_sexo_m_2=[];
            var array_T_area_1=[];
            var array_T_area_2=[];
            var arr_area_r_1=[];
            var arr_area_r_2=[];
            var arr_area_u_1=[];
            var arr_area_u_2=[];
            var array_T_gestion_1=[];
            var array_T_gestion_2=[];
            var arr_gestion_p_1=[];
            var arr_gestion_p_2=[];
            var arr_gestion_e_1=[];
            var arr_gestion_e_2=[];

            var array_categoria_ugel_1=[];
            var array_categoria_ugel_2=[];
            var array_categoria_sexo_1=[];
            var array_categoria_sexo_2=[];

            var array_inicio_sex_1=[];
            var array_inicio_sex_2=[];
            var array_proceso_sex_1=[];
            var array_proceso_sex_2=[];
            var array_satisfa_sex_1=[];
            var array_satisfa_sex_2=[];


            var array_inicio_are_1=[];
            var array_inicio_are_2=[];
            var array_proceso_are_1=[];
            var array_proceso_are_2=[];
            var array_satisfa_are_1=[];
            var array_satisfa_are_2=[];
            var array_inicio_gest_1=[];
            var array_inicio_gest_2=[];
            var array_proceso_gest_1=[];
            var array_proceso_gest_2=[];
            var array_satisfa_gest_1=[];
            var array_satisfa_gest_2=[];
            var array_categoria_area_1=[];
            var array_categoria_area_2=[];

            var array_categoria_gestion_1=[];
            var array_categoria_gestion_2=[];


            if (total1!='0') {

                var array_datos = datos1;
                var head_Escala = ['INICIO', 'PROCESO', 'SATISFACTORIO'];
                // ugel
                //sexo,area_geo,
                var array_ugel = new Array(),
                    array_ugel_nota = new Array();
                var array_sexo = new Array(),
                    array_scala_sexo = new Array();
                var array_gestion = new Array(),
                    array_scala_gestion = new Array();
                var array_area = new Array(),
                    array_scala_area = new Array();

                $.each(array_datos, function(index, val) {
                    ugel = $.trim(val['nom_ugel']);                   
					
                    nom_colegio = $.trim(val['nom_colegio']);
					if(cod_local!='')
					{
						ugel=nom_colegio;
						
					}
                    nota = parseInt($.trim(val['nota']));
                    area_geo = $.trim(val['area']).toUpperCase();
                    _id_gestion = parseInt($.trim(val['id_gestion']));
                    id_gestion = (_id_gestion == 1) ? 'ESTATAL' : 'PRIVADO';
                    sexo = $.trim(val['sexo']);
                    sexo = (sexo == 'M') ? "HOMBRES" : "MUJERES";
                    escala_1 = parseInt($.trim(val['escala1']));
                    escala_2 = parseInt($.trim(val['escala2']));
                    escala_3 = parseInt($.trim(val['escala3']));

                    if (!array_area[area_geo]) {
                        array_area[area_geo] = 0;
                    }
                    array_area[area_geo] += +1;
                    if (!array_gestion[id_gestion]) {
                        array_gestion[id_gestion] = 0;
                    }
                    array_gestion[id_gestion] += +1;
                    if (!array_ugel[ugel]) {
                        array_ugel[ugel] = 0;
                    }
                    array_ugel[ugel] += +1;
                    if (!array_sexo[sexo]) {
                        array_sexo[sexo] = 0;
                    }
                    array_sexo[sexo] += +1;
                    if (nota <= escala_1) {
                        if (!array_ugel_nota["INICIO|" + ugel]) {
                            array_ugel_nota["INICIO|" + ugel] = 0;
                        }
                        array_ugel_nota["INICIO|" + ugel] += +1;

                        if (!array_scala_area["INICIO|" + area_geo]) {
                            array_scala_area["INICIO|" + area_geo] = 0;
                        }
                        array_scala_area["INICIO|" + area_geo] += +1;

                        if (!array_scala_gestion["INICIO|" + id_gestion]) {
                            array_scala_gestion["INICIO|" + id_gestion] = 0;
                        }
                        array_scala_gestion["INICIO|" + id_gestion] += +1;

                        if (!array_scala_sexo["INICIO|" + sexo]) {
                            array_scala_sexo["INICIO|" + sexo] = 0;
                        }
                        array_scala_sexo["INICIO|" + sexo] += +1;

                    } else if (nota > escala_1 && nota <= escala_2) {
                        //PROCESO
                        if (!array_ugel_nota["PROCESO|" + ugel]) {
                            array_ugel_nota["PROCESO|" + ugel] = 0;
                        }
                        array_ugel_nota["PROCESO|" + ugel] += +1;

                        if (!array_scala_area["PROCESO|" + area_geo]) {
                            array_scala_area["PROCESO|" + area_geo] = 0;
                        }
                        array_scala_area["PROCESO|" + area_geo] += +1;

                        if (!array_scala_gestion["PROCESO|" + id_gestion]) {
                            array_scala_gestion["PROCESO|" + id_gestion] = 0;
                        }
                        array_scala_gestion["PROCESO|" + id_gestion] += +1;


                        if (!array_scala_sexo["PROCESO|" + sexo]) {
                            array_scala_sexo["PROCESO|" + sexo] = 0;
                        }
                        array_scala_sexo["PROCESO|" + sexo] += +1;

                    } else if (nota > escala_2) {
                        //SATISFACTORIO                     
                        if (!array_ugel_nota["SATISFACTORIO|" + ugel]) {
                            array_ugel_nota["SATISFACTORIO|" + ugel] = 0;
                        }
                        array_ugel_nota["SATISFACTORIO|" + ugel] += +1;

                        if (!array_scala_area["SATISFACTORIO|" + area_geo]) {
                            array_scala_area["SATISFACTORIO|" + area_geo] = 0;
                        }
                        array_scala_area["SATISFACTORIO|" + area_geo] += +1;

                        if (!array_scala_gestion["SATISFACTORIO|" + id_gestion]) {
                            array_scala_gestion["SATISFACTORIO|" + id_gestion] = 0;
                        }
                        array_scala_gestion["SATISFACTORIO|" + id_gestion] += +1;


                        if (!array_scala_sexo["SATISFACTORIO|" + sexo]) {
                            array_scala_sexo["SATISFACTORIO|" + sexo] = 0;
                        }
                        array_scala_sexo["SATISFACTORIO|" + sexo] += +1;
                    }


                });


                var array_categoria_ugel = new Array(),
                    array_categoria_sexo = new Array(),
                    array_categoria_gestion = new Array(),
                    array_categoria_area = new Array(),
                    array_T_sexo = new Array(),
                    array_T_area = new Array(),
                    array_T_gestion = new Array();
                var total_hombres = 0,
                    total_mujeres = 0;
                var total_urbana = 0,
                    total_rural = 0;
                var total_privada = 0,
                    total_estatal = 0;


                for (var ug in array_ugel) {
                    array_categoria_ugel.push(ug);
                }
                for (var sex in array_sexo) {
                    array_categoria_sexo.push(sex);
                }

                for (var gest in array_gestion) {
                    array_categoria_gestion.push(gest);
                }
                for (var are in array_area) {
                    array_categoria_area.push(are);
                }

                for (var sx in array_sexo) {
                    array_T_sexo.push({
                        name: sx,
                        y: calc(array_sexo[sx], datos1.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'HOMBRES') {
                        total_hombres += array_sexo['HOMBRES'];
                    } else if (sx == 'MUJERES') {
                        total_mujeres += array_sexo['MUJERES'];
                    }
                }

                for (var sx in array_area) {
                    array_T_area.push({
                        name: sx,
                        y: calc(array_area[sx], datos1.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'URBANA') {
                        total_urbana += array_area['URBANA'];
                    } else if (sx == 'RURAL') {
                        total_rural += array_area['RURAL'];
                    }
                }

                for (var sx in array_gestion) {
                    array_T_gestion.push({
                        name: sx,
                        y: calc(array_gestion[sx], datos1.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'PRIVADO') {
                        total_privada += array_gestion['PRIVADO'];
                    } else if (sx == 'ESTATAL') {
                        total_estatal += array_gestion['ESTATAL'];
                    }
                }
                var array_inicio = new Array(),
                    array_proceso = new Array(),
                    array_satisfa = new Array();
                var array_inicio_sex = new Array(),
                    array_proceso_sex = new Array(),
                    array_satisfa_sex = new Array();
                var array_inicio_gest = new Array(),
                    array_proceso_gest = new Array(),
                    array_satisfa_gest = new Array();

                var array_inicio_are = new Array(),
                    array_proceso_are = new Array(),
                    array_satisfa_are = new Array();

                for (var ug = 0; ug < array_categoria_ugel.length; ug++) {

                    if (!array_ugel_nota['SATISFACTORIO|' + array_categoria_ugel[ug]]) {
                        array_satisfa.push(0);
                    } else if (array_ugel_nota['SATISFACTORIO|' + array_categoria_ugel[ug]] >= 0) {
                        array_satisfa.push(array_ugel_nota['SATISFACTORIO|' + array_categoria_ugel[ug]]);
                    }

                    if (!array_ugel_nota['PROCESO|' + array_categoria_ugel[ug]]) {
                        array_proceso.push(0);
                    } else if (array_ugel_nota['PROCESO|' + array_categoria_ugel[ug]] >= 0) {
                        array_proceso.push(array_ugel_nota['PROCESO|' + array_categoria_ugel[ug]]);
                    }

                    if (!array_ugel_nota['INICIO|' + array_categoria_ugel[ug]]) {
                        array_inicio.push(0);
                    } else if (array_ugel_nota['INICIO|' + array_categoria_ugel[ug]] >= 0) {
                        array_inicio.push(array_ugel_nota['INICIO|' + array_categoria_ugel[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_sexo.length; ug++) {

                    if (!array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]]) {
                        array_satisfa_sex.push(0);
                    } else if (array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]] >= 0) {
                        array_satisfa_sex.push(array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]]);
                    }

                    if (!array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]]) {
                        array_proceso_sex.push(0);
                    } else if (array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]] >= 0) {
                        array_proceso_sex.push(array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]]);
                    }

                    if (!array_scala_sexo['INICIO|' + array_categoria_sexo[ug]]) {
                        array_inicio_sex.push(0);
                    } else if (array_scala_sexo['INICIO|' + array_categoria_sexo[ug]] >= 0) {
                        array_inicio_sex.push(array_scala_sexo['INICIO|' + array_categoria_sexo[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_area.length; ug++) {

                    if (!array_scala_area['SATISFACTORIO|' + array_categoria_area[ug]]) {
                        array_satisfa_are.push(0);
                    } else if (array_scala_area['SATISFACTORIO|' + array_categoria_area[ug]] >= 0) {
                        array_satisfa_are.push(array_scala_area['SATISFACTORIO|' + array_categoria_area[ug]]);
                    }

                    if (!array_scala_area['PROCESO|' + array_categoria_area[ug]]) {
                        array_proceso_are.push(0);
                    } else if (array_scala_area['PROCESO|' + array_categoria_area[ug]] >= 0) {
                        array_proceso_are.push(array_scala_area['PROCESO|' + array_categoria_area[ug]]);
                    }

                    if (!array_scala_area['INICIO|' + array_categoria_area[ug]]) {
                        array_inicio_are.push(0);
                    } else if (array_scala_area['INICIO|' + array_categoria_area[ug]] >= 0) {
                        array_inicio_are.push(array_scala_area['INICIO|' + array_categoria_area[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_gestion.length; ug++) {

                    if (!array_scala_gestion['SATISFACTORIO|' + array_categoria_gestion[ug]]) {
                        array_satisfa_gest.push(0);
                    } else if (array_scala_gestion['SATISFACTORIO|' + array_categoria_gestion[ug]] >= 0) {
                        array_satisfa_gest.push(array_scala_gestion['SATISFACTORIO|' + array_categoria_gestion[ug]]);
                    }

                    if (!array_scala_gestion['PROCESO|' + array_categoria_gestion[ug]]) {
                        array_proceso_gest.push(0);
                    } else if (array_scala_gestion['PROCESO|' + array_categoria_gestion[ug]] >= 0) {
                        array_proceso_gest.push(array_scala_gestion['PROCESO|' + array_categoria_gestion[ug]]);
                    }

                    if (!array_scala_gestion['INICIO|' + array_categoria_gestion[ug]]) {
                        array_inicio_gest.push(0);
                    } else if (array_scala_gestion['INICIO|' + array_categoria_gestion[ug]] >= 0) {
                        array_inicio_gest.push(array_scala_gestion['INICIO|' + array_categoria_gestion[ug]]);
                    }

                }


                for (var head in head_Escala) {


                    //=======================================================================
                    var arr_sexo_f = new Array(),
                        arr_sexo_m = new Array();

                    var arr_area_r = new Array(),
                        arr_area_r_push = new Array(),
                        arr_area_u = new Array(),
                        arr_area_u_push = new Array();

                    var arr_gestion_p = new Array(),
                        arr_gestion_p_push = new Array(),
                        arr_gestion_e = new Array(),
                        arr_gestion_e_push = new Array();

                    for (var ar_sex in array_scala_sexo) {
                        var split_ar_sex = ar_sex.split("|");
                        if ($.trim(split_ar_sex[0]) == 'INICIO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                // arr_sexo_f=arr_sexo_f.concat([["INICIO",calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_mujeres,"%",'2')]]);
                                arr_sexo_f.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_sexo["INICIO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["INICIO",calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_hombres,"%",'2')]]);
                                arr_sexo_m.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_sexo["INICIO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_sex[0]) == 'PROCESO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["PROCESO",calc(array_scala_sexo["PROCESO|"+split_ar_sex[1]],total_mujeres,"%",'2')]]);
                                arr_sexo_f.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_sexo["PROCESO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                arr_sexo_m.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_sexo["PROCESO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_proc
                                });
                                //arr_sexo_m=arr_sexo_m.concat([["PROCESO",calc(array_scala_sexo["PROCESO|"+split_ar_sex[1]],total_hombres,"%",'2')]]);
                            }
                        } else if ($.trim(split_ar_sex[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["SATISFACTORIO",calc(array_scala_sexo["SATISFACTORIO|"+split_ar_sex[1]],total_mujeres,"%",'2')]]);
                                arr_sexo_f.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_sexo["SATISFACTORIO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_satis
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                arr_sexo_m.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_sexo["SATISFACTORIO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_satis
                                });
                                //arr_sexo_m=arr_sexo_m.concat([["SATISFACTORIO",calc(array_scala_sexo["SATISFACTORIO|"+split_ar_sex[1]],total_hombres,"%",'2')]]);
                            }

                        }
                    }
                    //,['color':'#73B4B9'] satisf
                    //['color':'#FABB05']  proceso
                    //['color':'#E94235']  inicio                   //arr_sexo_f.push({'name':'INICIO',y:calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_mujeres,"%",'2'),color:'#E94235'});

                    //=======================================================================

                    for (var ar_area in array_scala_area) {
                        var split_ar_area = ar_area.split("|");
                        if ($.trim(split_ar_area[0]) == 'INICIO') {
                            if ($.trim(split_ar_area[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["INICIO",calc(array_scala_area["INICIO|"+split_ar_area[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_area["INICIO|" + split_ar_area[1]], total_rural, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_area[1]) == 'URBANA') {
                                // arr_area_u=arr_area_u.concat([["INICIO",calc(array_scala_area["INICIO|"+split_ar_area[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_area["INICIO|" + split_ar_area[1]], total_urbana, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_area[0]) == 'PROCESO') {

                            if ($.trim(split_ar_area[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["PROCESO",calc(array_scala_area["PROCESO|"+split_ar_area[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_area["PROCESO|" + split_ar_area[1]], total_rural, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_area[1]) == 'URBANA') {
                                //arr_area_u=arr_area_u.concat([["PROCESO",calc(array_scala_area["PROCESO|"+split_ar_area[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_area["PROCESO|" + split_ar_area[1]], total_urbana, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_area[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_area[1]) == 'RURAL') {
                                // arr_area_r=arr_area_r.concat([["SATISFACTORIO",calc(array_scala_area["SATISFACTORIO|"+split_ar_area[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_area["SATISFACTORIO|" + split_ar_area[1]], total_rural, "%", '2'),
                                    color: color_satis
                                });

                            } else if ($.trim(split_ar_area[1]) == 'URBANA') {
                                //arr_area_u=arr_area_u.concat([["SATISFACTORIO",calc(array_scala_area["SATISFACTORIO|"+split_ar_area[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_area["SATISFACTORIO|" + split_ar_area[1]], total_urbana, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }


                    for (var ar_area in array_scala_gestion) {
                        var split_ar_gestion = ar_area.split("|");
                        if ($.trim(split_ar_gestion[0]) == 'INICIO') {
                            if ($.trim(split_ar_gestion[1]) == 'PRIVADO') {
                                //arr_gestion_p=arr_gestion_p.concat([["INICIO",calc(array_scala_gestion["INICIO|"+split_ar_gestion[1]],total_privada,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_gestion["INICIO|" + split_ar_gestion[1]], total_privada, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_gestion[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["INICIO",calc(array_scala_gestion["INICIO|"+split_ar_gestion[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_gestion["INICIO|" + split_ar_gestion[1]], total_estatal, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_gestion[0]) == 'PROCESO') {

                            if ($.trim(split_ar_gestion[1]) == 'PRIVADO') {
                                //arr_gestion_p=arr_gestion_p.concat([["PROCESO",calc(array_scala_gestion["PROCESO|"+split_ar_gestion[1]],total_privada,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_gestion["PROCESO|" + split_ar_gestion[1]], total_privada, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_gestion[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["PROCESO",calc(array_scala_gestion["PROCESO|"+split_ar_gestion[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_gestion["PROCESO|" + split_ar_gestion[1]], total_estatal, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_gestion[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_gestion[1]) == 'PRIVADO') {
                                // arr_gestion_p=arr_gestion_p.concat([["SATISFACTORIO",calc(array_scala_gestion["SATISFACTORIO|"+split_ar_gestion[1]],total_privada,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_gestion["SATISFACTORIO|" + split_ar_gestion[1]], total_privada, "%", '2'),
                                    color: color_satis
                                });

                            } else if ($.trim(split_ar_gestion[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["SATISFACTORIO",calc(array_scala_gestion["SATISFACTORIO|"+split_ar_gestion[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_gestion["SATISFACTORIO|" + split_ar_gestion[1]], total_estatal, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }
                    //arr_gestion_e_push.push(arr_area_r);



                    //=======================================================================

                }


                stacked_column('cuadro_1-1', array_categoria_ugel, array_inicio, array_proceso, array_satisfa);
                pie_with_drilldown('cuadro_2-1', array_T_sexo, arr_sexo_f, arr_sexo_m, 'GRÁFICO NIVELES POR SEXO', 'MUJERES', 'HOMBRES');

                pie_with_drilldown('cuadro_3-1', array_T_area, arr_area_r, arr_area_u, 'GRÁFICO NIVELES POR ÁREA GEOGRÁFICA', 'RURAL', 'URBANA');
                pie_with_drilldown('cuadro_4-1', array_T_gestion, arr_gestion_p, arr_gestion_e, 'GRÁFICO NIVELES POR GESTION', 'PRIVADO', 'ESTATAL');
                array_inicio_1=array_inicio;
                array_proceso_1=array_proceso;
                array_satisfa_1=array_satisfa;
                array_T_sexo_1=array_T_sexo;
                arr_sexo_f_1=arr_sexo_f;
                arr_sexo_m_1=arr_sexo_m;
                array_T_area_1=array_T_area;
                arr_area_r_1=arr_area_r;
                arr_area_u_1=arr_area_u;
                array_T_gestion_1=array_T_gestion;
                arr_gestion_p_1=arr_gestion_p;
                arr_gestion_e_1=arr_gestion_e;

                array_categoria_ugel_1=array_categoria_ugel;
                 array_inicio_sex_1=array_inicio_sex;
                 array_proceso_sex_1=array_proceso_sex;
                 array_satisfa_sex_1=array_satisfa_sex;
                array_categoria_sexo_1=array_categoria_sexo;
                array_inicio_are_1=array_inicio_are;
                array_proceso_are_1=array_proceso_are;
                array_satisfa_are_1=array_satisfa_are;
                array_categoria_area_1=array_categoria_area;
                array_inicio_gest_1=array_inicio_gest;
                array_proceso_gest_1=array_proceso_gest;
                array_satisfa_gest_1=array_satisfa_gest;
                array_categoria_gestion_1=array_categoria_gestion;



                //pie_with_drilldown(cuadro,array_T_sexo,arr_serie1,arr_serie2,title_grafic='',serie1_name,serie2_name)

                /////////////
                $("#contenedor").show();
            }
            if (total2!='0') {

                var array_datos = datos2;
                var head_Escala = ['INICIO', 'PROCESO', 'SATISFACTORIO'];
                // ugel
                //sexo,area_geo,
                var array_ugel = new Array(),
                    array_ugel_nota = new Array();
                var array_sexo = new Array(),
                    array_scala_sexo = new Array();
                var array_gestion = new Array(),
                    array_scala_gestion = new Array();
                var array_area = new Array(),
                    array_scala_area = new Array();

                $.each(array_datos, function(index, val) {
                    ugel = $.trim(val['nom_ugel']);

                    nom_colegio = $.trim(val['nom_colegio']);
                    if(cod_local!='')
                    {
                        ugel=nom_colegio;

                    }
                    nota = parseInt($.trim(val['nota']));
                    area_geo = $.trim(val['area']).toUpperCase();
                    _id_gestion = parseInt($.trim(val['id_gestion']));
                    id_gestion = (_id_gestion == 1) ? 'ESTATAL' : 'PRIVADO';
                    sexo = $.trim(val['sexo']);
                    sexo = (sexo == 'M') ? "HOMBRES" : "MUJERES";
                    escala_1 = parseInt($.trim(val['escala1']));
                    escala_2 = parseInt($.trim(val['escala2']));
                    escala_3 = parseInt($.trim(val['escala3']));

                    if (!array_area[area_geo]) {
                        array_area[area_geo] = 0;
                    }
                    array_area[area_geo] += +1;
                    if (!array_gestion[id_gestion]) {
                        array_gestion[id_gestion] = 0;
                    }
                    array_gestion[id_gestion] += +1;
                    if (!array_ugel[ugel]) {
                        array_ugel[ugel] = 0;
                    }
                    array_ugel[ugel] += +1;
                    if (!array_sexo[sexo]) {
                        array_sexo[sexo] = 0;
                    }
                    array_sexo[sexo] += +1;
                    if (nota <= escala_1) {
                        if (!array_ugel_nota["INICIO|" + ugel]) {
                            array_ugel_nota["INICIO|" + ugel] = 0;
                        }
                        array_ugel_nota["INICIO|" + ugel] += +1;

                        if (!array_scala_area["INICIO|" + area_geo]) {
                            array_scala_area["INICIO|" + area_geo] = 0;
                        }
                        array_scala_area["INICIO|" + area_geo] += +1;

                        if (!array_scala_gestion["INICIO|" + id_gestion]) {
                            array_scala_gestion["INICIO|" + id_gestion] = 0;
                        }
                        array_scala_gestion["INICIO|" + id_gestion] += +1;

                        if (!array_scala_sexo["INICIO|" + sexo]) {
                            array_scala_sexo["INICIO|" + sexo] = 0;
                        }
                        array_scala_sexo["INICIO|" + sexo] += +1;

                    } else if (nota > escala_1 && nota <= escala_2) {
                        //PROCESO
                        if (!array_ugel_nota["PROCESO|" + ugel]) {
                            array_ugel_nota["PROCESO|" + ugel] = 0;
                        }
                        array_ugel_nota["PROCESO|" + ugel] += +1;

                        if (!array_scala_area["PROCESO|" + area_geo]) {
                            array_scala_area["PROCESO|" + area_geo] = 0;
                        }
                        array_scala_area["PROCESO|" + area_geo] += +1;

                        if (!array_scala_gestion["PROCESO|" + id_gestion]) {
                            array_scala_gestion["PROCESO|" + id_gestion] = 0;
                        }
                        array_scala_gestion["PROCESO|" + id_gestion] += +1;


                        if (!array_scala_sexo["PROCESO|" + sexo]) {
                            array_scala_sexo["PROCESO|" + sexo] = 0;
                        }
                        array_scala_sexo["PROCESO|" + sexo] += +1;

                    } else if (nota > escala_2) {
                        //SATISFACTORIO
                        if (!array_ugel_nota["SATISFACTORIO|" + ugel]) {
                            array_ugel_nota["SATISFACTORIO|" + ugel] = 0;
                        }
                        array_ugel_nota["SATISFACTORIO|" + ugel] += +1;

                        if (!array_scala_area["SATISFACTORIO|" + area_geo]) {
                            array_scala_area["SATISFACTORIO|" + area_geo] = 0;
                        }
                        array_scala_area["SATISFACTORIO|" + area_geo] += +1;

                        if (!array_scala_gestion["SATISFACTORIO|" + id_gestion]) {
                            array_scala_gestion["SATISFACTORIO|" + id_gestion] = 0;
                        }
                        array_scala_gestion["SATISFACTORIO|" + id_gestion] += +1;


                        if (!array_scala_sexo["SATISFACTORIO|" + sexo]) {
                            array_scala_sexo["SATISFACTORIO|" + sexo] = 0;
                        }
                        array_scala_sexo["SATISFACTORIO|" + sexo] += +1;
                    }


                });


                var array_categoria_ugel = new Array(),
                    array_categoria_sexo = new Array(),
                    array_categoria_gestion = new Array(),
                    array_categoria_area = new Array(),
                    array_T_sexo = new Array(),
                    array_T_area = new Array(),
                    array_T_gestion = new Array();
                var total_hombres = 0,
                    total_mujeres = 0;
                var total_urbana = 0,
                    total_rural = 0;
                var total_privada = 0,
                    total_estatal = 0;


                for (var ug in array_ugel) {
                    array_categoria_ugel.push(ug);
                }
                for (var sex in array_sexo) {
                    array_categoria_sexo.push(sex);
                }

                for (var gest in array_gestion) {
                    array_categoria_gestion.push(gest);
                }
                for (var are in array_area) {
                    array_categoria_area.push(are);
                }

                for (var sx in array_sexo) {
                    array_T_sexo.push({
                        name: sx,
                        y: calc(array_sexo[sx], datos2.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'HOMBRES') {
                        total_hombres += array_sexo['HOMBRES'];
                    } else if (sx == 'MUJERES') {
                        total_mujeres += array_sexo['MUJERES'];
                    }
                }

                for (var sx in array_area) {
                    array_T_area.push({
                        name: sx,
                        y: calc(array_area[sx], datos2.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'URBANA') {
                        total_urbana += array_area['URBANA'];
                    } else if (sx == 'RURAL') {
                        total_rural += array_area['RURAL'];
                    }
                }

                for (var sx in array_gestion) {
                    array_T_gestion.push({
                        name: sx,
                        y: calc(array_gestion[sx], datos2.length, "%", '2'),
                        drilldown: sx
                    });
                    if (sx == 'PRIVADO') {
                        total_privada += array_gestion['PRIVADO'];
                    } else if (sx == 'ESTATAL') {
                        total_estatal += array_gestion['ESTATAL'];
                    }
                }
                var array_inicio = new Array(),
                    array_proceso = new Array(),
                    array_satisfa = new Array();
                var array_inicio_sex = new Array(),
                    array_proceso_sex = new Array(),
                    array_satisfa_sex = new Array();
                var array_inicio_gest = new Array(),
                    array_proceso_gest = new Array(),
                    array_satisfa_gest = new Array();

                var array_inicio_are = new Array(),
                    array_proceso_are = new Array(),
                    array_satisfa_are = new Array();

                for (var ug = 0; ug < array_categoria_ugel.length; ug++) {

                    if (!array_ugel_nota['SATISFACTORIO|' + array_categoria_ugel[ug]]) {
                        array_satisfa.push(0);
                    } else if (array_ugel_nota['SATISFACTORIO|' + array_categoria_ugel[ug]] >= 0) {
                        array_satisfa.push(array_ugel_nota['SATISFACTORIO|' + array_categoria_ugel[ug]]);
                    }

                    if (!array_ugel_nota['PROCESO|' + array_categoria_ugel[ug]]) {
                        array_proceso.push(0);
                    } else if (array_ugel_nota['PROCESO|' + array_categoria_ugel[ug]] >= 0) {
                        array_proceso.push(array_ugel_nota['PROCESO|' + array_categoria_ugel[ug]]);
                    }

                    if (!array_ugel_nota['INICIO|' + array_categoria_ugel[ug]]) {
                        array_inicio.push(0);
                    } else if (array_ugel_nota['INICIO|' + array_categoria_ugel[ug]] >= 0) {
                        array_inicio.push(array_ugel_nota['INICIO|' + array_categoria_ugel[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_sexo.length; ug++) {

                    if (!array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]]) {
                        array_satisfa_sex.push(0);
                    } else if (array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]] >= 0) {
                        array_satisfa_sex.push(array_scala_sexo['SATISFACTORIO|' + array_categoria_sexo[ug]]);
                    }

                    if (!array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]]) {
                        array_proceso_sex.push(0);
                    } else if (array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]] >= 0) {
                        array_proceso_sex.push(array_scala_sexo['PROCESO|' + array_categoria_sexo[ug]]);
                    }

                    if (!array_scala_sexo['INICIO|' + array_categoria_sexo[ug]]) {
                        array_inicio_sex.push(0);
                    } else if (array_scala_sexo['INICIO|' + array_categoria_sexo[ug]] >= 0) {
                        array_inicio_sex.push(array_scala_sexo['INICIO|' + array_categoria_sexo[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_area.length; ug++) {

                    if (!array_scala_area['SATISFACTORIO|' + array_categoria_area[ug]]) {
                        array_satisfa_are.push(0);
                    } else if (array_scala_area['SATISFACTORIO|' + array_categoria_area[ug]] >= 0) {
                        array_satisfa_are.push(array_scala_area['SATISFACTORIO|' + array_categoria_area[ug]]);
                    }

                    if (!array_scala_area['PROCESO|' + array_categoria_area[ug]]) {
                        array_proceso_are.push(0);
                    } else if (array_scala_area['PROCESO|' + array_categoria_area[ug]] >= 0) {
                        array_proceso_are.push(array_scala_area['PROCESO|' + array_categoria_area[ug]]);
                    }

                    if (!array_scala_area['INICIO|' + array_categoria_area[ug]]) {
                        array_inicio_are.push(0);
                    } else if (array_scala_area['INICIO|' + array_categoria_area[ug]] >= 0) {
                        array_inicio_are.push(array_scala_area['INICIO|' + array_categoria_area[ug]]);
                    }

                }

                for (var ug = 0; ug < array_categoria_gestion.length; ug++) {

                    if (!array_scala_gestion['SATISFACTORIO|' + array_categoria_gestion[ug]]) {
                        array_satisfa_gest.push(0);
                    } else if (array_scala_gestion['SATISFACTORIO|' + array_categoria_gestion[ug]] >= 0) {
                        array_satisfa_gest.push(array_scala_gestion['SATISFACTORIO|' + array_categoria_gestion[ug]]);
                    }

                    if (!array_scala_gestion['PROCESO|' + array_categoria_gestion[ug]]) {
                        array_proceso_gest.push(0);
                    } else if (array_scala_gestion['PROCESO|' + array_categoria_gestion[ug]] >= 0) {
                        array_proceso_gest.push(array_scala_gestion['PROCESO|' + array_categoria_gestion[ug]]);
                    }

                    if (!array_scala_gestion['INICIO|' + array_categoria_gestion[ug]]) {
                        array_inicio_gest.push(0);
                    } else if (array_scala_gestion['INICIO|' + array_categoria_gestion[ug]] >= 0) {
                        array_inicio_gest.push(array_scala_gestion['INICIO|' + array_categoria_gestion[ug]]);
                    }

                }


                for (var head in head_Escala) {


                    //=======================================================================
                    var arr_sexo_f = new Array(),
                        arr_sexo_m = new Array();

                    var arr_area_r = new Array(),
                        arr_area_r_push = new Array(),
                        arr_area_u = new Array(),
                        arr_area_u_push = new Array();

                    var arr_gestion_p = new Array(),
                        arr_gestion_p_push = new Array(),
                        arr_gestion_e = new Array(),
                        arr_gestion_e_push = new Array();

                    for (var ar_sex in array_scala_sexo) {
                        var split_ar_sex = ar_sex.split("|");
                        if ($.trim(split_ar_sex[0]) == 'INICIO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                // arr_sexo_f=arr_sexo_f.concat([["INICIO",calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_mujeres,"%",'2')]]);
                                arr_sexo_f.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_sexo["INICIO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                //arr_sexo_m=arr_sexo_m.concat([["INICIO",calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_hombres,"%",'2')]]);
                                arr_sexo_m.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_sexo["INICIO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_sex[0]) == 'PROCESO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["PROCESO",calc(array_scala_sexo["PROCESO|"+split_ar_sex[1]],total_mujeres,"%",'2')]]);
                                arr_sexo_f.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_sexo["PROCESO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                arr_sexo_m.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_sexo["PROCESO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_proc
                                });
                                //arr_sexo_m=arr_sexo_m.concat([["PROCESO",calc(array_scala_sexo["PROCESO|"+split_ar_sex[1]],total_hombres,"%",'2')]]);
                            }
                        } else if ($.trim(split_ar_sex[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_sex[1]) == 'MUJERES') {
                                //arr_sexo_f=arr_sexo_f.concat([["SATISFACTORIO",calc(array_scala_sexo["SATISFACTORIO|"+split_ar_sex[1]],total_mujeres,"%",'2')]]);
                                arr_sexo_f.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_sexo["SATISFACTORIO|" + split_ar_sex[1]], total_mujeres, "%", '2'),
                                    color: color_satis
                                });

                            } else if ($.trim(split_ar_sex[1]) == 'HOMBRES') {
                                arr_sexo_m.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_sexo["SATISFACTORIO|" + split_ar_sex[1]], total_hombres, "%", '2'),
                                    color: color_satis
                                });
                                //arr_sexo_m=arr_sexo_m.concat([["SATISFACTORIO",calc(array_scala_sexo["SATISFACTORIO|"+split_ar_sex[1]],total_hombres,"%",'2')]]);
                            }

                        }
                    }
                    //,['color':'#73B4B9'] satisf
                    //['color':'#FABB05']  proceso
                    //['color':'#E94235']  inicio                   //arr_sexo_f.push({'name':'INICIO',y:calc(array_scala_sexo["INICIO|"+split_ar_sex[1]],total_mujeres,"%",'2'),color:'#E94235'});

                    //=======================================================================

                    for (var ar_area in array_scala_area) {
                        var split_ar_area = ar_area.split("|");
                        if ($.trim(split_ar_area[0]) == 'INICIO') {
                            if ($.trim(split_ar_area[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["INICIO",calc(array_scala_area["INICIO|"+split_ar_area[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_area["INICIO|" + split_ar_area[1]], total_rural, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_area[1]) == 'URBANA') {
                                // arr_area_u=arr_area_u.concat([["INICIO",calc(array_scala_area["INICIO|"+split_ar_area[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_area["INICIO|" + split_ar_area[1]], total_urbana, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_area[0]) == 'PROCESO') {

                            if ($.trim(split_ar_area[1]) == 'RURAL') {
                                //arr_area_r=arr_area_r.concat([["PROCESO",calc(array_scala_area["PROCESO|"+split_ar_area[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_area["PROCESO|" + split_ar_area[1]], total_rural, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_area[1]) == 'URBANA') {
                                //arr_area_u=arr_area_u.concat([["PROCESO",calc(array_scala_area["PROCESO|"+split_ar_area[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_area["PROCESO|" + split_ar_area[1]], total_urbana, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_area[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_area[1]) == 'RURAL') {
                                // arr_area_r=arr_area_r.concat([["SATISFACTORIO",calc(array_scala_area["SATISFACTORIO|"+split_ar_area[1]],total_rural,"%",'2') ]] );
                                arr_area_r.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_area["SATISFACTORIO|" + split_ar_area[1]], total_rural, "%", '2'),
                                    color: color_satis
                                });

                            } else if ($.trim(split_ar_area[1]) == 'URBANA') {
                                //arr_area_u=arr_area_u.concat([["SATISFACTORIO",calc(array_scala_area["SATISFACTORIO|"+split_ar_area[1]],total_urbana,"%",'2') ]] );
                                arr_area_u.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_area["SATISFACTORIO|" + split_ar_area[1]], total_urbana, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }


                    for (var ar_area in array_scala_gestion) {
                        var split_ar_gestion = ar_area.split("|");
                        if ($.trim(split_ar_gestion[0]) == 'INICIO') {
                            if ($.trim(split_ar_gestion[1]) == 'PRIVADO') {
                                //arr_gestion_p=arr_gestion_p.concat([["INICIO",calc(array_scala_gestion["INICIO|"+split_ar_gestion[1]],total_privada,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_gestion["INICIO|" + split_ar_gestion[1]], total_privada, "%", '2'),
                                    color: color_ini
                                });

                            } else if ($.trim(split_ar_gestion[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["INICIO",calc(array_scala_gestion["INICIO|"+split_ar_gestion[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'INICIO',
                                    y: calc(array_scala_gestion["INICIO|" + split_ar_gestion[1]], total_estatal, "%", '2'),
                                    color: color_ini
                                });
                            }
                        } else if ($.trim(split_ar_gestion[0]) == 'PROCESO') {

                            if ($.trim(split_ar_gestion[1]) == 'PRIVADO') {
                                //arr_gestion_p=arr_gestion_p.concat([["PROCESO",calc(array_scala_gestion["PROCESO|"+split_ar_gestion[1]],total_privada,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_gestion["PROCESO|" + split_ar_gestion[1]], total_privada, "%", '2'),
                                    color: color_proc
                                });

                            } else if ($.trim(split_ar_gestion[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["PROCESO",calc(array_scala_gestion["PROCESO|"+split_ar_gestion[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'PROCESO',
                                    y: calc(array_scala_gestion["PROCESO|" + split_ar_gestion[1]], total_estatal, "%", '2'),
                                    color: color_proc
                                });
                            }
                        } else if ($.trim(split_ar_gestion[0]) == 'SATISFACTORIO') {
                            if ($.trim(split_ar_gestion[1]) == 'PRIVADO') {
                                // arr_gestion_p=arr_gestion_p.concat([["SATISFACTORIO",calc(array_scala_gestion["SATISFACTORIO|"+split_ar_gestion[1]],total_privada,"%",'2') ]] );
                                arr_gestion_p.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_gestion["SATISFACTORIO|" + split_ar_gestion[1]], total_privada, "%", '2'),
                                    color: color_satis
                                });

                            } else if ($.trim(split_ar_gestion[1]) == 'ESTATAL') {
                                //arr_gestion_e=arr_gestion_e.concat([["SATISFACTORIO",calc(array_scala_gestion["SATISFACTORIO|"+split_ar_gestion[1]],total_estatal,"%",'2') ]] );
                                arr_gestion_e.push({
                                    'name': 'SATISFACTORIO',
                                    y: calc(array_scala_gestion["SATISFACTORIO|" + split_ar_gestion[1]], total_estatal, "%", '2'),
                                    color: color_satis
                                });
                            }
                        }
                    }

                }



                stacked_column('cuadro_1-2', array_categoria_ugel, array_inicio, array_proceso, array_satisfa);
                pie_with_drilldown('cuadro_2-2', array_T_sexo, arr_sexo_f, arr_sexo_m, 'GRÁFICO NIVELES POR SEXO', 'MUJERES', 'HOMBRES');
                pie_with_drilldown('cuadro_3-2', array_T_area, arr_area_r, arr_area_u, 'GRÁFICO NIVELES POR ÁREA GEOGRÁFICA', 'RURAL', 'URBANA');
                pie_with_drilldown('cuadro_4-2', array_T_gestion, arr_gestion_p, arr_gestion_e, 'GRÁFICO NIVELES POR GESTION', 'PRIVADO', 'ESTATAL');


                array_inicio_2=array_inicio;
                array_proceso_2=array_proceso;
                array_satisfa_2=array_satisfa;
                array_T_sexo_2=array_T_sexo;
                arr_sexo_f_2=arr_sexo_f;
                arr_sexo_m_2=arr_sexo_m;
                array_T_area_2=array_T_area;
                arr_area_r_2=arr_area_r;
                arr_area_u_2=arr_area_u;
                array_T_gestion_2=array_T_gestion;
                arr_gestion_p_2=arr_gestion_p;
                arr_gestion_e_2=arr_gestion_e;

                array_categoria_ugel_2=array_categoria_ugel;
                array_inicio_sex_2=array_inicio_sex;
                array_proceso_sex_2=array_proceso_sex;
                array_satisfa_sex_2=array_satisfa_sex;
                array_categoria_sexo_2=array_categoria_sexo;
                array_inicio_are_2=array_inicio_are;
                array_proceso_are_2=array_proceso_are;
                array_satisfa_are_2=array_satisfa_are;
                array_categoria_area_2=array_categoria_area;
                array_inicio_gest_2=array_inicio_gest;
                array_proceso_gest_2=array_proceso_gest;
                array_satisfa_gest_2=array_satisfa_gest;
                array_categoria_gestion_2=array_categoria_gestion;

                $("#contenedor").show();
            }
            if(total1=='0' && total2=='0') {
                $("#contenedor").hide();
				show_mensaje("no hay datos con el colegio buscado");

            }
            else{

                var array_categoria_ugel_p=mergeAndGetUnique(array_categoria_ugel_1,array_categoria_ugel_2);
                var array_categoria_sexo_p=mergeAndGetUnique(array_categoria_sexo_1,array_categoria_sexo_2);
                var array_categoria_area_p=mergeAndGetUnique(array_categoria_area_1,array_categoria_area_2);
                var array_categoria_gestion_p=mergeAndGetUnique(array_categoria_gestion_1,array_categoria_gestion_2);


                cuadros_resumen('cuadro_1_resumen', 'CUADRO NIVELES POR UGEL', array_inicio_1,array_inicio_2, array_proceso_1, array_proceso_2,array_satisfa_1,array_satisfa_2, array_categoria_ugel_p);
                cuadros_resumen('cuadro_2_resumen', 'CUADRO NIVELES POR SEXO', array_inicio_sex_1,array_inicio_sex_2, array_proceso_sex_1,array_proceso_sex_2, array_satisfa_sex_1,array_satisfa_sex_2, array_categoria_sexo_p);
                cuadros_resumen('cuadro_3_resumen', 'CUADRO NIVELES POR ÁREA GEOGRÁFICA', array_inicio_are_1,array_inicio_are_2, array_proceso_are_1,array_proceso_are_2, array_satisfa_are_1,array_satisfa_are_2, array_categoria_area_p);
                cuadros_resumen('cuadro_4_resumen', 'CUADRO NIVELES POR GESTION', array_inicio_gest_1,array_inicio_gest_2, array_proceso_gest_1,array_proceso_gest_2, array_satisfa_gest_1,array_satisfa_gest_2, array_categoria_gestion_p);
            }
        }
    });
}

function cuadros_resumen_2(cuadro_id, titulo, array_scala_sexo_1, array_scala_sexo_2, cabecera) {
    var cabNum=cabecera.length*2;
    var n1_1=0;
    var n1_2=0;
    var n2_1=0;
    var n2_2=0;
    var n3_1=0;
    var n3_2=0;
    var html = "<table class='table table-bordered'><tr><th colspan='" + (cabNum + 2) + "'>" + titulo + "</th></tr>";
    html += "<tr><th>NIVELES</th>";
    cabecera=['HOMBRES','MUJERES'];
    for (var cab in cabecera) {
        html += "<th>" + cabecera[cab] + "</th>";
        html += "<th>" + cabecera[cab] + "**</th>";
    }
    html += "<th>2022-2 / 2022-1</th>";
    html += "</tr>";
    html += "<tr>";
    html += "<th>PERIODO</th>";
    for (var cab in cabecera) {
        html += "<th>2022-1</th>";
        html += "<th>2022-2</th>";
    }
    html += "<th>% </th>";
    html += "</tr>";

    html += "<tr><th>INICIO</th>";
    var inicio1=0;
    var inicio2=0;
    var proceso1=0;
    var proceso2=0;
    var satisface1=0;
    var satisface2=0;

        inicio1=0;
        inicio2=0;
        for (var cab in cabecera) {
            inicio1=(array_scala_sexo_1['INICIO|'+cabecera[cab]]!=undefined)? array_scala_sexo_1['INICIO|'+cabecera[cab]]:0;
            inicio2=(array_scala_sexo_2['INICIO|'+cabecera[cab]]!=undefined)? array_scala_sexo_2['INICIO|'+cabecera[cab]]:0;
            html += "<td>" + inicio1 + "</td>";
            html += "<td>" + inicio2 + "</td>";
            n1_1=n1_1+inicio1;
            n1_2=n1_2+inicio2;
        }

    var t1=(parseFloat(n1_1)>0)?(n1_2/n1_1*100)-100:0; // 8 + 0.5
    t1=t1.toFixed(2);
    html += "<th>"+t1+"</th>";
    html += "</tr>";

    html += "<tr><th>PROCESO</th>";
    for (var cab in cabecera) {
        proceso1=(array_scala_sexo_1['PROCESO|'+cabecera[cab]]!=undefined)? array_scala_sexo_1['PROCESO|'+cabecera[cab]]:0;
        proceso2=(array_scala_sexo_2['PROCESO|'+cabecera[cab]]!=undefined)? array_scala_sexo_2['PROCESO|'+cabecera[cab]]:0;
        html += "<td>" + proceso1 + "</td>";
        html += "<td>" + proceso2 + "</td>";
        n2_1=n2_1+proceso1;
        n2_2=n2_2+proceso2;
    }
    var t2=(parseFloat(n2_1)>0)?(n2_2/n2_1*100)-100:0;
    t2=t2.toFixed(2);
    html += "<th>"+t2+"</th>";
    html += "</tr>";

    html += "<tr><th>SATISFACTORIO</th>";

    for (var cab in cabecera) {
        satisface1=(array_scala_sexo_1['SATISFACTORIO|'+cabecera[cab]]!=undefined)? array_scala_sexo_1['SATISFACTORIO|'+cabecera[cab]]:0;
        satisface2=(array_scala_sexo_2['SATISFACTORIO|'+cabecera[cab]]!=undefined)? array_scala_sexo_2['SATISFACTORIO|'+cabecera[cab]]:0;
        html += "<td>" + satisface1 + "</td>";
        html += "<td>" + satisface2 + "</td>";
        n3_1=n3_1+satisface1;
        n3_2=n3_2+satisface2;
    }

    var t3=(parseFloat(n3_1)>0)?(n3_2/n3_1*100)-100:0;
    t3=t3.toFixed(2);
    html += "<th>"+t3+"</th>";
    html += "</tr>";
    var s1=parseFloat(n1_1)+parseFloat(n2_1)+parseFloat(n3_1);
    var s2=parseFloat(n1_2)+parseFloat(n2_2)+parseFloat(n3_2);
    var tot1=(parseFloat(s1)>0)?(s2/s1*100)-100:0;
    //var tot2=calc(s2, s1, '%', '3')-100;
    tot1=tot1.toFixed(2);
    html += "<tr><th colspan='" + (cabNum + 1) + "'>TOTAL</th><th>" + tot1 + "</th></tr>";
    html += "</table>";
    $("#" + cuadro_id).html(html);


}

function cuadros_resumen(cuadro_id, titulo, array_inicio1, array_inicio2, array_proc1,array_proc2, array_satisf1,array_satisf2, cabecera) {
    var cabNum=cabecera.length*2;
    var n1_1=0;
    var n1_2=0;
    var n2_1=0;
    var n2_2=0;
    var n3_1=0;
    var n3_2=0;
    var html = "<table class='table table-bordered'><tr><th colspan='" + (cabNum + 2) + "'>" + titulo + "</th></tr>";
    html += "<tr><th>NIVELES</th>";

    for (var cab in cabecera) {
        html += "<th>" + cabecera[cab] + "</th>";
        html += "<th>" + cabecera[cab] + "</th>";
    }
    html += "<th>2022-2 / 2022-1</th>";
    html += "</tr>";
    html += "<tr>";
    html += "<th>PERIODO</th>";
    for (var cab in cabecera) {
        html += "<th>2022-1</th>";
        html += "<th>2022-2</th>";
    }
    html += "<th>% </th>";
    html += "</tr>";

    html += "<tr><th>INICIO</th>";
    var inicio1=0;
    var inicio2=0;
    var proceso1=0;
    var proceso2=0;
    var satisface1=0;
    var satisface2=0;
    for (var ini in array_inicio1) {
        inicio1=(array_inicio1[ini]!=undefined)? array_inicio1[ini]:0;
        inicio2=(array_inicio2[ini]!=undefined)? array_inicio2[ini]:0;
        html += "<td>" + inicio1 + "</td>";
        html += "<td>" + inicio2 + "</td>";
        n1_1=n1_1+inicio1;
        n1_2=n1_2+inicio2;

    }
    var t1=(parseFloat(n1_1)>0)?(n1_2/n1_1*100)-100:0; // 8 + 0.5
    t1=t1.toFixed(2);
    html += "<th>"+t1+"</th>";
    html += "</tr>";

    html += "<tr><th>PROCESO</th>";
    for (var proc in array_proc1) {
        proceso1=(array_proc1[proc]!=undefined)? array_proc1[proc]:0;
        proceso2=(array_proc2[proc]!=undefined)? array_proc2[proc]:0;
        html += "<td>" + proceso1 + "</td>";
        html += "<td>" + proceso2 + "</td>";
        n2_1=n2_1+proceso1;
        n2_2=n2_2+proceso2;
    }
    var t2=(parseFloat(n2_1)>0)?(n2_2/n2_1*100)-100:0;
    t2=t2.toFixed(2);
    html += "<th>"+t2+"</th>";
    html += "</tr>";

    html += "<tr><th>SATISFACTORIO</th>";
    for (var satisf in array_satisf1) {
        satisface1=(array_satisf1[satisf]!=undefined)? array_satisf1[satisf]:0;
        satisface2=(array_satisf2[satisf]!=undefined)? array_satisf2[satisf]:0;
        html += "<td>" + satisface1 + "</td>";
        html += "<td>" + satisface2 + "</td>";
        n3_1=n3_1+satisface1;
        n3_2=n3_2+satisface2;

    }
    var t3=(parseFloat(n3_1)>0)?(n3_2/n3_1*100)-100:0;
    t3=t3.toFixed(2);
    html += "<th>"+t3+"</th>";
    html += "</tr>";
    var s1=parseFloat(n1_1)+parseFloat(n2_1)+parseFloat(n3_1);
    var s2=parseFloat(n1_2)+parseFloat(n2_2)+parseFloat(n3_2);
    var tot1=(parseFloat(s1)>0)?(s2/s1*100)-100:0;
    //var tot2=calc(s2, s1, '%', '3')-100;
    tot1=tot1.toFixed(2);
    html += "<tr><th colspan='" + (cabNum + 1) + "'>TOTAL</th><th>" + tot1 + "</th></tr>";
    html += "</table>";
    $("#" + cuadro_id).html(html);


}

function stacked_column(cuadro, categoria_arr, array_inicio, array_proceso, array_satisfa) {
    Highcharts.chart(cuadro, {
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: categoria_arr
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total Escala'
            },
            stackLabels: {
                style: {
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    floating: false,
                    align: 'center'
                }
            }
        },
        legend: {
            align: 'right',
            x: -20,
            verticalAlign: 'top',
            y: 0,
            floating: false,
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false

        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent'
            },
            series: {
                dataLabels: {
                    enabled: true,
                    align: 'center',
                    color: '#000',
                    format: '<span style="font-size:14px; font-family:Montserrat">{point.percentage:.0f}%</span>'
                }
            }
        },
        series: [{
                name: 'SATISFACTORIO',
                data: array_satisfa
            },
            {
                name: 'PROCESO',
                data: array_proceso
            },
            {
                name: 'INICIO',
                data: array_inicio
            }
        ]
    });
}

function pie_with_drilldown(cuadro, array_T_sexo, arr_serie1, arr_serie2, title_grafic = '', serie1_name, serie2_name) {
    Highcharts.chart(cuadro, {
        chart: {
            type: 'pie'
        },
        title: {
            text: title_grafic
        },
        subtitle: {
            text: ''
        },

        accessibility: {
            announceNewData: {
                enabled: true
            },
            point: {
                valueSuffix: '%'
            }
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<span style="font-size:14px; font-family:Montserrat; color:#333">{point.y:.1f}%</span>'
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },
        series: [{
            name: "<< ATRAS",
            colorByPoint: true,
            data: array_T_sexo
        }],
        drilldown: {
            series: [{
                    name: serie1_name,
                    id: serie1_name,
                    data: arr_serie1
                },
                {
                    name: serie2_name,
                    id: serie2_name,
                    data: arr_serie2
                }
            ]
        }
    });

}
// ('cuadro_3',array_inicio_area,array_proceso_area,array_satisfa_area,'grafico area geografica');


function order_items(array, type) {
    var items = array;
    val_order = [], items_order = {};
    for (i_order in items) {
        if (type != '') {
            var value_order = (i_order != '') ? 1 : 0;
            val_order.push([parseInt(items[i_order]), value_order, i_order]);
        } else {
            var value_order = (i_order != '') ? 1 : -1;
            val_order.push([value_order, i_order, items[i_order]]);
        }
    }
    if (type != '') {
        val_order.sort((a, b) => (parseInt(a) < parseInt(b) ? 1 : -1));
    } else {
        val_order.sort();
    }
    for (i_order_f in val_order) {
        if (type != '') {
            items_order[val_order[i_order_f][2]] = val_order[i_order_f][0];
        } else {
            items_order[val_order[i_order_f][1]] = val_order[i_order_f][2];
        }
    }
    items = items_order;
    return items;
}

function calc(val, val2, type, dec) {
    val = (val == 0) ? '' : val;
    val2 = (val2 == 0) ? '' : val2;
    val = parseInt(val);
    val2 = parseInt(val2);
    val3 = val / val2;
    val3 = (type == '%') ? rounds((val3 * 100), dec) : val;
    val3 = ((val3 == 0 || isNaN(val3)) ? '' : val3);
    return val3;
}

function rounds(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function exportar_tabla() {
    //===========================================
    var d = new Date();
    var monthActual = d.getMonth() + 1;
    var dayActual = d.getDate();
    var yearActual = d.getFullYear();
    var minuto = d.getMinutes();
    var correlativo = (yearActual + "_" + monthActual + "_" + dayActual + "_" + minuto)
    //===========================================
    /* creamos el nuevo workbook */
    var workbook = XLSX.utils.book_new();

    /* convertimos tabla 'tablaOriginal' a un  worksheet llamado "Flota Sana" */
    var ws1 = XLSX.utils.table_to_sheet(document.getElementById('tabla_exportar'));
    XLSX.utils.book_append_sheet(workbook, ws1, "Resumen");

    /* convertimos tabla 'tablaFlSaC' a un  worksheet llamado "Tipo de Contrato" 
    var ws2 = XLSX.utils.table_to_sheet(document.getElementById('tabla_1'));
    XLSX.utils.book_append_sheet(workbook, ws2, "Tipo de Contrato");*/

    /* exportamos en el libro con los worksheets */
    XLSX.writeFile(workbook, "Exportar_Reporte" + correlativo + ".xlsx");
}

function exportar_tabla_detalle() {
    //===========================================
    var d = new Date();
    var monthActual = d.getMonth() + 1;
    var dayActual = d.getDate();
    var yearActual = d.getFullYear();
    var minuto = d.getMinutes();
    var correlativo = (yearActual + "_" + monthActual + "_" + dayActual + "_" + minuto)
    //===========================================
    /* creamos el nuevo workbook */
    var workbook = XLSX.utils.book_new();

    /* convertimos tabla 'tablaOriginal' a un  worksheet llamado "Flota Sana" */
    var ws1 = XLSX.utils.table_to_sheet(document.getElementById('contenedor_detalle'));
    XLSX.utils.book_append_sheet(workbook, ws1, "Resumen");

    /* exportamos en el libro con los worksheets */
    XLSX.writeFile(workbook, "Detalle_Exportar_Reporte" + correlativo + ".xlsx");
}

function mergeAndGetUnique(arrayA, arrayB) {
    var hash = {};
    var x;

    for (x = 0; x < arrayA.length; x++) {
        hash[arrayA[x]] = true;
    }
    for (x = 0; x < arrayB.length; x++) {
        hash[arrayB[x]] = true;
    }
    return Object.keys(hash);
}
