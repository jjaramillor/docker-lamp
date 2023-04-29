<?= $this->extend('auth/layouts/layout_main2') ?>
<?= $this->section('main') ?>
<?php
    $cmb_periodo="";
    foreach($periodoAct as $per)
    {   $perarr[]=$per;
    }
    $str_per=implode(",",$perarr);
    $cmb_periodo.="<option value='".$str_per."' >".$str_per."</option>";
   $data_cole_u=[];
   if(count($data_colegio)>0)
   {  
    foreach($data_colegio as $datc)
    {
      $data_cole_u[$datc->cod_local]=$datc->nom_colegio;
    } 
   }
   
   ?>
<section>
   <div class="container">
      <div class="row shadow-sm p-3 mb-4" style="background-color:#3e454f; color: #fff;">
         <div class="col-12 text-center">
            <h3> <b><?php echo $nombre_perfil;?></b></h3>
         </div>
      </div>
   </div>
</section>
<section>
   <div class="container">
      <div class="row shadow-sm bg-white p-3 mb-4">
          <div class='col-12' style="display:none" >
              <select id="cmb_periodo" name="cmb_periodo" class="form-control" onchange="get_periodo()">
                  <?= $cmb_periodo ?>
              </select>
          </div>
            <div class="col-3">
               <select  id="cmbUgel" class="form-control text-uppercase " name="cmbUgel"  onchange='get_data_niveles("<?= base_url("get_valor") ?>",0);'>
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

            <div class="col-9">
               <select  id="cmbColegio" class="form-control text-uppercase " name="cmbColegio"  onchange='get_data_niveles("<?= base_url("get_valor") ?>",1);'>
                  <option value=""> (SELECCIONA UN COLEGIO) </option>
                  <?php
                     foreach($data_cole_u as $col=>$nom_coleg){
                     ?>
                  <option value="<?php echo $col ?>"> <?php echo $nom_coleg ?></option>
                  <?php
                     }
                     ?>
               </select>
            </div>

            <div class="col-6">
               <select  id="cmbniveles" class="form-control text-uppercase " name="cmbniveles" onchange='get_data_niveles("<?= base_url("get_valor") ?>",2);'>
                  <option value=""> (SELECCIONA UN NIVEL) </option>
                  <?php
                     foreach($niveles as $id_niv=>$nom_nivel)
                     { ?>
                  <option value="<?php echo $id_niv ?>"> <?php echo $nom_nivel ?></option>
                  <?php
                     }
                     ?>
               </select>
            </div>

            <div class="col-6">
               <select  id="cmbarea" class="form-control text-uppercase " name="cmbarea" onchange='get_data_niveles("<?= base_url("get_valor") ?>",3);'>
                  <option value=""> (SELECCIONA UNA ÁREA) </option>
               </select>
            </div>

            <div class="col-6">
               <select  id="cmbgrado" class="form-control text-uppercase " name="cmbgrado" onchange='get_data_niveles("<?= base_url("get_valor") ?>",4);'>
                  <option value=""> (SELECCIONA UN GRADO) </option>
               </select>
            </div>

            <div class="col-6">
               <select  id="cmbseccion" class="form-control text-uppercase " name="cmbseccion">
                  <option value="">(SELECCIONA UNA SECCIÓN) </option>
               </select>
            </div>
 
            <div class="col-12">
               <button type="button" class="form-control btn btn-sm btn-primary" id="btnBuscar" onclick='getCapacidades("<?= base_url("get_capacidades") ?>","<?= base_url("get_detalle") ?>","<?= $idperfil ?>")' > 
               <i class='fas fa-search'></i> Buscar </button>
            </div>

      </div>
   </div>
   <!--contenedor -->
   <div class="container" id="contenedor" style='display:none;'>
      <div class="row shadow-sm bg-white p-3 mb-3">
         <div class="table-responsive">
             <h4 class="text-center">PERIODO 2022-1</h4>
            <div class="col-sm-12">
               <div id="cuadro_3"></div>
            </div>
             <h4 class="text-center">PERIODO 2022-2</h4>
             <div class="col-sm-12">
                 <div id="cuadro_3_2"></div>
             </div>
            <hr>
            <hr>
             <h4 class="text-center">PERIODO 2022-1</h4>
            <div class="col-sm-12">
               <div id="cuadro_4"></div>
            </div>

            <div class="col-sm-12">
               <div id="cuadro_7"></div>
            </div>
             <h4 class="text-center">PERIODO 2022-2</h4>
             <div class="col-sm-12">
                 <div id="cuadro_4_2"></div>
             </div>
             <div class="col-sm-12">
                 <div id="cuadro_7_2"></div>
             </div>
            <hr>
            <hr>
             <h4 class="text-center">PERIODO 2022-1</h4>
            <div class="col-sm-12">
               <div id="cuadro_5"></div>
            </div>
            <div class="col-sm-12">
               <div id="cuadro_6"></div>
            </div>
             <h4 class="text-center">PERIODO 2022-2</h4>
             <div class="col-sm-12">
                 <div id="cuadro_5_2"></div>
             </div>
             <div class="col-sm-12">
                 <div id="cuadro_6_2"></div>
             </div>
         </div>
      </div>
   </div>
</section>
<!-- modal-->
<div class="container">
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
</div>
<!-- fin modal-->
<!--</form>-->
<?= $this->endSection() ?>