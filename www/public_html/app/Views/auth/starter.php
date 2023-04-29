<?= $this->extend('auth/layouts/layout_main') ?>


  <?php  
 
   $tr_add_table = "";
  $data_script_col = "";
  $cmb_nivel_1 = "";
  $data_col = [];
  $data_col_nombre = [];


  $cols_nivel="col-3";
  $cols_area="col-3";
  $cols_grado="col-3";
  $cols_seccion="col-3";

  $nombre_colegio="";
  $data_perfil="var perfil=0;";
  $cmb_periodo="";

  foreach($periodoAct as $per)
  {
      $cmb_periodo.="<option value='".$per."'>".$per."</option>";
  }
  $style_acc="display:none";
  if($permiso_per==1)
  {
      $style_acc="display:block";
  }

  if ($perfil == 1) 
  {
 
    $cols_nivel="col-3";
    $cols_area="col-4";
    $cols_grado="col-4";
    $cols_seccion="col-4";
    $data_perfil="var perfil=1;"; 
    //ver si es admin: vera y escogerá todos los colegios,todos los niveles 
    $nombre_colegio=" ADMINISTRADOR DE SISTEMA";
    $cmb_nivel_1 = "<option>(SELECCIONA UN NIVEL)</option>";

    $cmb_colegio = "<select id='cmb_colegio_local' class='form-control' name='cmb_colegio_local'><option>(SELECCIONA UN COLEGIO)</option>";
    $cmb_ugel= "<select id='cmb_ugel' class='form-control' name='cmb_ugel'><option>(SELECCIONA UNA UGEL)</option>";

    $ugel_colegio=[];
    if(count($data_ugel)>0)
    {
     
      foreach($data_ugel as $dax)
      {
        $cmb_ugel .= "<option value='" . $dax->id_ugel . "'>" . $dax->nom_ugel . "</option>";
      
      }
      $cmb_ugel .= "</select>";
    }
    if (count($data_colegio) > 0) {

      foreach ($data_colegio as $dat) {
        $data_col_nombre[$dat->cod_local] = $dat->nom_colegio;
        $data_col[$dat->cod_local][$dat->id_nivel] = $dat->id_colegio;
        $ugel_colegio[$dat->id_ugel][$dat->cod_local] = $dat->nom_colegio;
      }
      foreach ($data_col_nombre as $codloc => $value) {
        $cmb_colegio .= "<option value='" . $codloc . "'>" . $value . "</option>";
      }
      $cmb_colegio .= "</select>";
      $data_script_col = "data_colegios=" . json_encode($data_col) . ";";
      $data_script_col.= "data_ugel_colegio=" . json_encode($ugel_colegio) . ";";
  
      $tr_add_table= "<div class='col-3' >{$cmb_ugel}</div>";
      $tr_add_table.= "<div class='col-6' >{$cmb_colegio}</div>";
    }
    else
    {
      $tr_add_table= "<div class='col-12' >NO HAY COLEGIO ASOCIADO A SU USUARIO</div>";  
    
    }
  
    

  } else if ($perfil == 2) {
    $data_perfil="var perfil=2;"; 
	    
    //$nombre_colegio="--";
    $cmb_nivel_1 = "<option>(SELECCIONA UN NIVEL)</option>";
    //si es director :vera y escogerá  todos los niveles 
    if (count($data_colegio) > 0) {
		$nombre_colegio=$data_colegio[0]['nom_colegio'];
      foreach ($data_colegio as $dat) {
        $data_col[$dat['cod_local']][$dat['id_nivel']] = $dat['id_colegio'];
        $cmb_nivel_1 .= "<option value='" . $dat['id_nivel'] . "' >";
        $cmb_nivel_1 .= ($dat['id_nivel'] == 1) ? "primaria" : "secundaria";
        $cmb_nivel_1 .= "</option>";
      }
      $data_script_col = "data_colegios=" . json_encode($data_col) . ";";
     
      
	$tr_add_table .= "<input id='cmb_colegio_local' type='hidden' value='" . $data_colegio[0]['cod_local'] . "'>";
    }
	else
	{
		$tr_add_table= "<div class='col-12' >NO HAY COLEGIO ASOCIADO A SU USUARIO</div>";
    
   
	}
    
  } else if ($perfil == 3) {
 
   
    //si es profesor o subdirector: vera y escogerá desde areas
    if (count($data_colegio) > 0) {
      $data_perfil="var perfil=3; $('#cmb_nivel').trigger('change');"; 
      $nombre_colegio=$data_colegio[0]['nom_colegio'];
      $cmb_nivel_1 = "<option>(SELECCIONA UN NIVEL)</option>";

      foreach ($data_colegio as $dat) {
        $data_col[$dat['cod_local']][$dat['id_nivel']] = $dat['id_colegio'];
        $cmb_nivel_1 .= "<option value='" . $dat['id_nivel'] . "' >";
        $cmb_nivel_1 .= ($dat['id_nivel'] == 1) ? "primaria" : "secundaria";
        $cmb_nivel_1 .= "</option>";
      }
      $data_script_col = "data_colegios=" . json_encode($data_col) . ";";
      $tr_add_table .= "<input id='cmb_colegio_local' type='hidden' value='" . $data_colegio[0]['cod_local'] . "'>";

    }
    else
	  {
		$tr_add_table= "<div class='col-12' >NO HAY COLEGIO ASOCIADO A SU USUARIO</div>";
    
   
	  }

  }


  ?>  
<?= $this->section('main') ?>

      <section>

      <div class="container">
         <div class="row shadow-sm p-3 mb-4" style="background-color:#3e454f; color: #fff;">
          <div class="col-12 text-center">
            <h3><b> <?php echo $nombre_colegio;  ?></b></h3>
          </div>
        </div>
      </div>
      </section>
      <section>
      <div class="container">
        <div class="row shadow-sm bg-white p-3 mb-4">
            <div class='col-12'  style="<?= $style_acc; ?>" >
                <select id="cmb_periodo" name="cmb_periodo" class="form-control">
                   <!-- <option value="2022-2">2022-2</option> -->
                   <?= $cmb_periodo  ?>
                </select>
            </div>
            <?= $tr_add_table ?>
      <?php if(count($data_colegio) > 0){ ?>
            <div class="<?= $cols_nivel ?>">
                <select id="cmb_nivel" class="form-control" name="cmb_nivel">                
                  <?= $cmb_nivel_1  ?>
                </select>           
            </div>
          
          <div class="<?= $cols_area ?>">     
            <select id="cmb_areas" class="form-control" name="cmb_areas">
            <option>(SELECCIONA UN ÁREA)</option>
              </select>
          </div>
          <div class="<?= $cols_grado ?>">
          <input type='hidden' value='0' id='grados_areas' />
              <select id="cmb_grado" class="form-control" name="cmb_grado">
              <option>(SELECCIONA UN GRADO)</option>
              </select>          
          </div>
          <div class="<?= $cols_seccion ?>">
          <select id="cmb_seccion" class="form-control" name="cmb_seccion">
          <option>(SELECCIONA UNA SECCIÓN)</option>
              </select>
          
          </div>
          <?php } ?>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="table-responsive" id="tbl_preguntas" >

       
     
        </div >
        </div >
      </div >
        

      <div class="container" id="tbl_alumnos_exam">

      </div>
          <div id="loading" style="display: none">
              <img  class="img_loader" src="<?php echo base_url('public/image/carga/ajax-loader.gif'); ?>" style="width:200px"
          </div>


  <?= $this->endSection() ?>
  <?= $this->section('script') ?>
  
  <script>
    $(document).ready(function()
    {
      
	    <?php echo $data_perfil; ?>
      var data_ugel = [];
      var data_ugel_colegio = [];
      var data_colegios = [];
      var colegio_det = {};
      var grados_areas = [];
      var areas_nivel = <?php echo json_encode($areas_nivel); ?>;
      var id_colegio = 0;
      var id_evaluacion = 0;

      <?php echo $data_script_col; ?>


      $("#cmb_periodo").change(function() {    

          $("#tbl_preguntas").html('');
          $("#tbl_alumnos_exam").html("");
        var html_colegios = "<option value=''>SELECCIONA UN COLEGIO</option>";
        $("#cmb_colegio_local").html(html_colegios);
        
        var cmb_periodo = $("#cmb_periodo").val();
        var html_ugels = <?php echo json_encode($cmb_ugel);  ?>;
        $("#cmb_grado").empty();
        $("#cmb_grado").html('');
        $("#cmb_ugel").html('');

        if (cmb_periodo != '') {
          $("#cmb_ugel").html(html_ugels); 
        }     


      });


      $("#cmb_ugel").change(function() {
          $("#tbl_preguntas").html('');
          $("#tbl_alumnos_exam").html("");
        var cod_ugel = $("#cmb_ugel").val();
        var html_colegios = "<option value=''>SELECCIONA UN COLEGIO</option>";
        $("#cmb_grado").empty();
        $("#cmb_grado").html('');
        $("#cmb_colegio_local").html('');

        if (cod_ugel != '') {
          for (var dc in data_ugel_colegio[cod_ugel]) {
            html_colegios += "<option value='" + dc + "'>" + data_ugel_colegio[cod_ugel][dc] + "</option>";
          }

        }
        $("#cmb_colegio_local").html(html_colegios);


      });
      
      $("#cmb_colegio_local").change(function() {
          $("#tbl_preguntas").html('');
          $("#tbl_alumnos_exam").html("");
        var cod_local = $("#cmb_colegio_local").val();
        var html_niveles = "<option value=''>SELECCIONA UN NIVEL</option>";
        $("#cmb_grado").empty();
        $("#cmb_nivel").empty();
        $("#cmb_nivel").html(html_niveles);

        if (cod_local != '') {
          for (var dc in data_colegios[cod_local]) {
            html_niveles += "<option value='" + dc + "'>" + (dc == 1 ? "primaria" : "secundaria") + "</option>";

          }

        }
        $("#cmb_nivel").html(html_niveles);


      });

      $("#cmb_nivel").on("change",function() {
          $("#tbl_preguntas").html('');
          $("#tbl_alumnos_exam").html("");
        var cod_local = $("#cmb_colegio_local").val();
        var html_grado = "<option value=''>SELECCIONE UN GRADO</option>";
        var html_areas = "<option value=''>SELECCIONA UN ÁREA</option>";
        var nivel = $("#cmb_nivel").val();
        var periodo = $("#cmb_periodo").val();
        $("#cmb_grado").empty();
        $("#cmb_grado").html(html_grado);

        if (cod_local != '' && nivel != '') {
          if (typeof eval(data_colegios[cod_local][nivel]) !== 'undefined') {
            id_colegio = data_colegios[cod_local][nivel];
          }
        }
        else{
            id_colegio=0;
        }
        //alert(id_colegio);
        grados_areas = [];
        if(id_colegio>0){

            $.ajax({
                url: "<?php echo site_url('get_areas_grado'); ?>",
                type: "POST",
                dataType: 'JSON',
                data: {
                    'id_colegio': id_colegio,
                    'periodo': periodo
                },
                beforeSend: function(f) {
                    console.log("cargando datos areas grado");
                }
            }).done(function(datos) {
                $("#cmb_areas").empty();
                colegio_det = datos;
                if (datos != '0') {
                    for (var m in datos) {
                        grados_areas[datos[m].id_area] = datos[m].id_area;

                    }
                    for (var an in areas_nivel) {
                        if (nivel != '' && nivel == areas_nivel[an].id_nivel) {
                            if (typeof eval(grados_areas[areas_nivel[an].id_area]) !== 'undefined') {
                                html_areas += "<option value='" + areas_nivel[an].id_area + "'>";
                                html_areas += areas_nivel[an].area + "</option>";
                            }
                        }

                    }


                }
                $("#cmb_areas").html(html_areas);

            }).fail(function(jqXHR, textStatus, errorThrown) {
                alert('Error!!');

            });

        }


      });

      $("#cmb_areas").change(function() {

        var area = $("#cmb_areas").val();
        $("#tbl_preguntas").html('');
        $("#tbl_alumnos_exam").html("");

        $("#cmb_grado").empty();
        var html_grados = "<option value=''>SELECCIONA UN GRADO</option>";
        var grados = [];
        if (colegio_det != '0' && area != '') {
          for (var m in colegio_det) {
            if (colegio_det[m].id_area == area) {
              grados[colegio_det[m].grado] = colegio_det[m].grado;
            }
          }
          for (var grad in grados) {
            html_grados += "<option value='" + grad + "'>" + grad + "</option>";
          }


        }
        $("#cmb_grado").html(html_grados);

      });

      $("#cmb_grado").change(function() {
          $("#tbl_alumnos_exam").html("");
          $("#tbl_preguntas").html('');
        var cod_local = $("#cmb_colegio_local").val();
        var area = $("#cmb_areas").val();
        var grado = $("#cmb_grado").val();
        var nivel = $("#cmb_nivel").val();
        var html_secc = "<option value=''>SELECCIONA UNA SECCIÓN</option>";
            console.log(colegio_det);
        for (var j in colegio_det) {
          if (colegio_det[j].grado == grado) {
            if (colegio_det[j].id_area == area) {
              id_evaluacion = colegio_det[j].id_evaluacion;
              html_secc += "<option value='" + colegio_det[j].seccion + "'>";
              html_secc += colegio_det[j].seccion + "</option>";
            }

          }
        }
        $("#cmb_seccion").html(html_secc);
        var tbl_eval = "<table><tr>";
        tbl_eval = "<th></th>";


        $.ajax({
          url: "<?php echo site_url('get_evaluacion'); ?>",
          type: "POST",
          dataType: 'HTML',
          data: {
            'id_evaluacion': id_evaluacion
          },
          beforeSend: function(f) {

          }
        }).done(function(datos) {
          // console.log(datos);
          if (datos != '0') {
            $("#tbl_preguntas").html(datos);
          }
          else
          {
            $("#tbl_preguntas").html("");
          }

        }).fail(function(jqXHR, textStatus, errorThrown) {
          alert('Error!!');
        });

      });

      $("#cmb_seccion").change(function() {
        var idcolegio_seccion = 0;
        var grado = $("#cmb_grado").val();
        var seccion = $("#cmb_seccion").val();
        var area = $("#cmb_areas").val();
        var id_alumno=$('#get_alumnos').val();
        if(id_alumno==undefined)
        {
          id_alumno='0';
        }
        var idcoleg = 0;
        

        $("#tbl_alumnos_exam").html("");
        if(id_colegio>0 && grado!='' && seccion!='' && id_evaluacion!=0)
        {
          $.ajax({
          url: "<?php echo site_url('get_alumnos_examen'); ?>",
          type: "POST",
          dataType: 'HTML',
          data: {
            'idcolegio_sec': idcolegio_seccion,
            'id_colegio': id_colegio,
            'id_evaluacion': id_evaluacion,
            'grado': grado,
            'seccion': seccion,
            'perfil': perfil,
            'id_alumno': id_alumno
          },
          beforeSend: function(f) {
              $("#loading").show();
          }
        }).done(function(datos) {
              $("#loading").hide();
              $("#tbl_alumnos_exam").html("");
          if(perfil==1)
          {
            console.log('datos cargados');   
          }
          if (datos != '0') {
            $("#tbl_alumnos_exam").html(datos);

          }
          else
          { 
            swal("no existe datos con el filtro buscado");
          }

        }).fail(function(jqXHR, textStatus, errorThrown) {
          alert('Error!!');
        });
        }
        else
        {
          $("#tbl_alumnos_exam").html("");
          swal("no existe datos con el filtro buscado");
        }

      });

      

    });
  </script>


<?= $this->endSection() ?>
