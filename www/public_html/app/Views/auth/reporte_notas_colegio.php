<?= $this->extend('auth/layouts/layout_main2') ?>
<?= $this->section('main') ?>

<style>
   .table-dark2 thead
   {
   background-color: #e5b406;
   color: #fff;
   }
</style>
<?php
    $cmb_periodo="";
    foreach($periodoAct as $per)
    {   $perarr[]=$per;
    }
    $str_per=implode(",",$perarr);
    $cmb_periodo.="<option value='".$str_per."' >".$str_per."</option>";

   $data_colegio_arr=array();
   $tot_col=0;
   foreach($data_colegio as $dat)
   {        
    $data_colegio_arr[$dat->cod_local]=$dat->nom_colegio;
    $tot_col++;
   }
        
   
   ?>
<section>
   <div class="container">
      <div class="row shadow-sm p-3 mb-4" style="background-color:#3e454f; color: #fff;">
         <div class="col-12 text-center">
            <h4><b>REPORTE POR ESCALA</b></h4>
         </div>
      </div>
   </div>
</section>
<section>
   <div class="container">
      <div class="row shadow-sm bg-white p-3 mb-4">
          <div class='col-12' style="display:none">
          <select id="cmb_periodo" name="cmb_periodo" class="form-control" onchange="get_periodo()">
              <?= $cmb_periodo ?>
          </select>
          </div>
            <div class="col-3" style=<?php echo $displa_none;  ?> >
               <select  id="cmbUgel" class="form-control " name="cmbUgel"  onchange='get_data_niveles("<?= base_url("get_valor") ?>",0);'>
                  <option value=""> (SELECCIONA UNA UGEL) </option>
                  <?php
                     if($idperfil==1)
                     {
                       foreach($data_ugel as $dat){
                      ?>
                  <option value="<?php echo $dat->id_ugel ?>"> <?php echo $dat->nom_ugel ?></option>
                  <?php
                     }
                     }
                            
                             ?>
               </select>
            </div>

            <div class="col-6">
               <select  id="cmbColegio" class="form-control " name="cmbColegio"  onchange='get_data_niveles("<?= base_url("get_valor") ?>",1);'>
                  <option value=""> (SELECCIONA UN COLEGIO) </option>
                  <?php     
                     if($tot_col>0)
                     {
                        foreach($data_colegio_arr as $datcod=>$value_col){
                      ?>
                  <option value="<?php echo $datcod ?>"> <?php echo $value_col ?></option>
                  <?php
                     }
                     }
                     
                     
                            ?>
               </select>
            </div>

            <div class="col-3">
               <select  id="cmbniveles" class="form-control " name="cmbniveles" onchange='get_data_niveles("<?= base_url("get_valor") ?>",2);'>
                  <option value=""> (SELECCIONA UN NIVEL) </option>
               </select>
            </div>

            <div class="col-3">
               <select  id="cmbarea" class="form-control " name="cmbarea" onchange='get_data_niveles("<?= base_url("get_valor") ?>",3);'>
                  <option value=""> (SELECCIONA UNA ÁREA) </option>
               </select>
            </div>

            <div class="col-3">
               <select  id="cmbgrado" class="form-control " name="cmbgrado" onchange='get_data_niveles("<?= base_url("get_valor") ?>",4);'>
                  <option value=""> (SELECCIONA UN GRADO) </option>
               </select>
            </div>

            <div class="col-3">
               <select  id="cmbseccion" class="form-control " name="cmbseccion">
                  <option value="">(SELECCIONA UNA SECCIÓN) </option>
               </select>
            </div>

            <div class="col-3">
               <button type="button" class="form-control btn btn-sm btn-primary" id="btnBuscar" onclick='getNotasColegio()' >
               <i class='fas fa-search'></i> Buscar </button>
            </div>


      </div>
   </div>
   <div class="container" id="contenedor" >
      <div class="row shadow-sm bg-white p-3 mb-3" id='tabla_exportar'>
         <div class="table-responsive">
             <div class="col" id='div_export1' style='display:none'>
                 <button id="btnExportar" class="form-control btn btn-sm btn-info" onclick='exportTableToExcel("tbl_notas_examen1");' >
                     <i class="fas fa-file-excel"></i>Exportar 2022-1</button>
             </div>

             <div class="col-sm-12">
               <div id="cuadro_colegio1" class='table-responsive'></div>
            </div>
             <div class="col" id='div_export2' style='display:none'>
                 <button id="btnExportar" class="form-control btn btn-sm btn-info" onclick='exportTableToExcel("tbl_notas_examen2");' >
                 <i class="fas fa-file-excel"></i>Exportar 2022-2</button>
             </div>
             <div class="col-sm-12">
                 <div id="cuadro_colegio2" class='table-responsive'></div>
             </div>
         </div>
      </div>
      <div id="cuadro_colegio_export" style="display:none">
      <div id="cuadro_colegio_export2" style="display:none">
      </div>
   </div>
</section>
<?= $this->endSection() ?>
<?= $this->section('script') ?>

<script>
   function getNotasColegio()
   {
    $("#div_export1").hide();
    $("#div_export2").hide();
    $("#cuadro_colegio1").html("");
    $("#cuadro_colegio2").html("");
          var cod_local = $("#cmbColegio").val();
          var id_nivel = $("#cmbniveles").val();
    var id_evaluacion = $("#cmbarea").val();
          var seccion = $("#cmbseccion").val();
          var grado = $("#cmbgrado").val();
          var id_ugel = $("#cmb_ugel").val();
    
          if(id_nivel!='' && id_evaluacion!='')
    {
      $.ajax({
            url: "<?php echo site_url('getNotasColegio'); ?>",
            type: "POST",
            dataType: 'HTML',
            data: {
              'id_ugel': id_ugel,
              'cod_local': cod_local,
              'id_nivel': id_nivel,
              'id_evaluacion': id_evaluacion,
              'grado': grado,
              'seccion': seccion           
            
            },
            beforeSend: function(f) {
              console.log("cargando las notas del colegio");
            }
          }).done(function(datos) {
              console.log(datos);
                    var datosarr= datos.split("|");
                    var datos1=datosarr[0];
                    var datos2=datosarr[1];
            if (datos1!= '0'){
              $("#cuadro_colegio1").html(datos1);
                $("#div_export1").show();
   
            }
          if (datos2!= '0') {
              $("#cuadro_colegio2").html(datos2);
              $("#div_export2").show();
          }
          if(datos1== '0' && datos2== '0')
          {
              show_mensaje("no existe datos con el filtro buscado");
          }
   
          }).fail(function(jqXHR, textStatus, errorThrown) {
            alert('Error!!');
          });
    }
    else
    {
       show_mensaje("seleccione el nivel y area de  busqueda");
    }
    
          
          
    
   }
   
   function exportTableToExcel(tableID, filename = ''){
      var downloadLink;
      var dataType = 'application/vnd.ms-excel';
      var tableSelect = document.getElementById(tableID);
      var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
      
      // Specify file name
      filename = filename?filename+'.xls':'notas_colegio.xls';
      
      // Create download link element
      downloadLink = document.createElement("a");
      
      document.body.appendChild(downloadLink);
      
      if(navigator.msSaveOrOpenBlob){
          var blob = new Blob(['ufeff', tableHTML], {
              type: dataType
          });
          navigator.msSaveOrOpenBlob( blob, filename);
      }else{
          // Create a link to the file
          downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
      
          // Setting the file name
          downloadLink.download = filename;
          
          //triggering the function
          downloadLink.click();
      }
   }
    
</script>
<?= $this->endSection() ?>