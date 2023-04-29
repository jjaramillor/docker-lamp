<?= $this->extend('auth/layouts/layout_main2') ?>

<?= $this->section('main') ?>
<!--<form action="<?= base_url('get_datos'); ?>" method="post" id="buscar_data">-->
<section>
      <div class="container">
         <div class="row shadow-sm p-3 mb-4" style="background-color:#3e454f; color: #fff;">
          <div class="col-12 text-center">
            <h3><b>REPORTE DE AVANCE POR UGEL</b></h3>
          </div>
        </div>
      </div>
 </section>
<section>
<section>
  <div class="container">
    <div class="row shadow-sm bg-white p-3 mb-4">
        <div class="col-8">
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

        <div class="col-4" style='display:none'>
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

        <div class="col-4">
        <button type="button" class="form-control btn btn-sm btn-primary" id="btnBuscar" onclick='getAvance("<?= base_url("get_avance") ?>")' >
          <i class='fas fa-search'></i> Buscar </button>
        </div>

        <div class="col">
        <button id="btnExportar" class="form-control btn btn-sm btn-info" onclick='exportar_tabla();' style='display:none;'>
        <i class="fas fa-file-excel"></i>Exportar</button>
        </div>

    </div>
  </div>
  <div class="container" id="contenedor" style='display:none;'>
    <div class="row shadow-sm bg-white p-3 mb-3" id='tabla_exportar'>
      <div class="table-responsive">

          <div class="row">
                <div class="col-sm-12"><h3 class="text-center">PERIODO 2022-1</h3></div>
                  <div class="col-sm-12">
                         <div id="cuadro_1-1"></div>
                  </div>
          </div>
          <div class="row">
              <div class="col-sm-12"><h3 class="text-center">PERIODO 2022-2</h3></div>
                  <div class="col-sm-12">
                      <div id="cuadro_1-2"></div>
                  </div>
          </div>

                <div class="col-sm-12">
                    <div id="cuadro_2"></div>
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
