<?= $this->extend('auth/layouts/layout_main2') ?>

<?= $this->section('main') ?>
<?php

$cmb_periodo="";
foreach($periodoAct as $per)
{
    $cmb_periodo.="<option value='".$per."'>".$per."</option>";
}

?>

<!--<form action="<?= base_url('get_datos'); ?>" method="post" id="buscar_data">-->
<section>
      <div class="container">
         <div class="row shadow-sm bg-white p-3 mb-4">
          <div class="col-12 text-center">
            <h4> <?php echo $nombre_perfil;?></h4>
          </div>
        </div>
      </div>
 </section>
<section>
<section>
  <div class="container">
    <div class="row shadow-sm bg-white p-3 mb-4">
        <div class='col-12' >
            <select id="cmb_periodo" name="cmb_periodo" class="selectpicker form-control" onchange="get_periodo()" multiple data-live-search="true">
                <?= $cmb_periodo ?>
            </select>
        </div>
     <div class="form-group" style=<?php echo $displa_none;  ?>>
        <div class="col">
        <select  id="cmbUgel" class="form-control" name="cmbUgel"  onchange='get_data_niveles("<?= base_url("get_valor") ?>",0);'> 
            <option value=""> (SELECCIONA UNA UGEL) </option>
            <?php
            foreach($data_ugel as $dat){
            ?>
            <option value="<?php echo $dat->id_ugel ?>"> <?php echo $dat->nom_ugel ?></option>
            <?php
            }
            ?>
         </select>
        </div>
      </div>

      <div class="form-group">
        <div class="col">
        <select  id="cmbColegio" class="form-control" name="cmbColegio"  onchange='get_data_niveles("<?= base_url("get_valor") ?>",1);'> 
            <option value=""> (SELECCIONA UN COLEGIO) </option>
            <?php
            foreach($data_colegio as $dat){
            ?>
            <option value="<?php echo $dat->cod_local ?>"> <?php echo $dat->nom_colegio ?></option>
            <?php
            }
            ?>
         </select>
        </div>
      </div>
      <div class="form-group">
        <div class="col">
        <select  id="cmbniveles" class="form-control" name="cmbniveles" onchange='get_data_niveles("<?= base_url("get_valor") ?>",2);'>
            <option value=""> (SELECCIONA UN NIVEL) </option>
        </select>
        </div>
      </div>
      <div class="form-group">
        <div class="col">
        <select  id="cmbarea" class="form-control" name="cmbarea" onchange='get_data_niveles("<?= base_url("get_valor") ?>",3);'>
            <option value=""> (SELECCIONA UNA ÁREA) </option>
        </select>
        </div>
      </div>
      <div class="form-group">
        <div class="col">
          <select  id="cmbgrado" class="form-control" name="cmbgrado" onchange='get_data_niveles("<?= base_url("get_valor") ?>",4);'>
            <option value=""> (SELECCIONA UN GRADO) </option>
        </select>
        </div>
      </div>
      <div class="form-group">
        <div class="col">
        <select  id="cmbseccion" class="form-control" name="cmbseccion">
        <option value="">(SELECCIONA UNA SECCIÓN) </option>
        </select>
        </div>
      </div>
      <div class="form-group">
        <div class="col">
        <button type="button" class="form-control btn btn-sm btn-primary" id="btnBuscar" onclick='getNotas("<?= base_url("get_notas") ?>")' >
          <i class='fas fa-search'></i> Buscar </button>
        </div>
      </div>
      <div class="form-group">
        <div class="col">
        <button id="btnExportar" class="form-control btn btn-sm btn-info" onclick='exportar_tabla();' style='display:none;'>
        <i class="fas fa-file-excel"></i>Exportar</button>
        </div>
      </div>
    </div>
  </div>
  <div class="container" id="contenedor" style='display:none;'>
    <div class="row shadow-sm bg-white p-3 mb-3" id='tabla_exportar'>
      <div class="table-responsive">
        <div class="col-sm-12">
        <div id="cuadro_1"></div>
        </div>
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
