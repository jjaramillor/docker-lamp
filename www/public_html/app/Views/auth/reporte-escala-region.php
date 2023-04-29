<?= $this->extend('auth/layouts/layout_main2') ?>

<?= $this->section('main') ?>
<?php

$cmb_periodo="";
foreach($periodoAct as $per)
{   $perarr[]=$per;
}
$str_per=implode(",",$perarr);
$cmb_periodo.="<option value='".$str_per."' >".$str_per."</option>";
?>
<section>
      <div class="container">
         <div class="row shadow-sm p-3 mb-4" style="background-color:#3e454f; color: #fff;">
          <div class="col-12 text-center">
            <h3> <b>REPORTE REGIONAL</b></h3>
          </div>
        </div>
      </div>
 </section>
<section>
<section>
  <div class="container">
    <div class="row shadow-sm bg-white p-3 mb-4">
        <div class='col-12' style="display:none" >
            <select id="cmb_periodo" name="cmb_periodo" class="form-control" onchange="get_periodo()">
                <?= $cmb_periodo ?>
            </select>
        </div>
        <div class="col-4">
        <select  id="cmb_nivel_avance" class="form-control" name="cmb_nivel_avance" onchange="get_nivel_evaluacion(this,'cmb_area_avance')" > 
            <option value='' > (SELECCIONA UN NIVEL) </option>
            <option value="1"> Primaria</option>
            <option value="2"> Secundaria </option>            
         </select>
        </div>
	  
        <div class="col-4">
        <select  id="cmb_area_avance" class="form-control " name="cmb_area_avance"> 
            <option value='' >(SELECCIONA UN ÁREA)</option>
                      
         </select>
        </div>

        <div class="col-4">
        <button type="button" class="form-control btn btn-sm btn-primary" id="btnBuscar" onclick='getRegional("<?= base_url("get_regional") ?>")' >
          <i class='fas fa-search'></i> Buscar </button>
        </div>

        <div class="col-12">
        <button id="btnExportar" class="form-control btn btn-sm btn-info" onclick='exportar_tabla();' style='display:none;'>
        <i class="fas fa-file-excel"></i>Exportar</button>
        </div>

    </div>
  </div>
  <div class="container" id="contenedor" style='display:none;'>
    <div class="row shadow-sm bg-white p-3 mb-3" id='tabla_exportar'>
      <div class="table-responsive">

          <div class="row">
              <div class="col-sm-6">
                  <div id="cuadro_1-1"></div>
              </div>
              <div class="col-sm-6">
                  <div id="cuadro_1-2"></div>
              </div>
          </div>
            <div class="col-sm-12">
            <div id="cuadro_1_resumen" class="table-responsive"></div>
            </div>
		<br>
		<br>
          <div class="row">
              <div class="col-sm-6">
                  <div id="cuadro_2-1"></div>
              </div>
              <div class="col-sm-6">
                  <div id="cuadro_2-2"></div>
              </div>
          </div>

		<div class="col-sm-12">
		<div id="cuadro_2_resumen" class="table-responsive"></div>
		</div>
		<br>
		<br>
          <div class="row">
              <div class="col-sm-6">
                  <div id="cuadro_3-1"></div>
              </div>
              <div class="col-sm-6">
                  <div id="cuadro_3-2"></div>
              </div>
          </div>

		<div class="col-sm-12">
		<div id="cuadro_3_resumen" class="table-responsive"></div>
		</div>
		<br>
		<br>
          <div class="row">
              <div class="col-sm-6">
                  <div id="cuadro_4-1"></div>
              </div>
              <div class="col-sm-6">
                  <div id="cuadro_4-2"></div>
              </div>
          </div>


		<div class="col-sm-12">
		<div id="cuadro_4_resumen" class="table-responsive"></div>
		</div>
		<br>
		<br>
		
      </div>
    </div>
  </div>
</section>

  <div class="container">
    <!-- modal-->
    <div class="modal fade" id="detalleformmodal" tabindex="-1" role="dialog" aria-labelledby="detalleformmodal" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="detalleformmodaltitle">Detalle 
            <button id="btnExportar" class="form-control btn btn-sm btn-info" onclick='exportar_tabla_detalle();'>
            <i class="fas fa-file-excel"></i>Exportar Detalle</button>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
            <div class="modal-body" id='contenedor_detalle'>
              
            </div>
        </div>
      </div>
    </div>
    <!-- fin modal-->
  </div>
<?= $this->endSection() ?>
