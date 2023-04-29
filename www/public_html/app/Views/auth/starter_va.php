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
         <div class="row shadow-sm bg-white p-3 mb-4">
          <div class="col-12 text-center">
            <h4> <?php echo $nombre_colegio;  ?></h4>
          </div>
        </div>
      </div>
      </section>
      <section>
      <div class="container">
        <div class="row shadow-sm bg-white p-3 mb-4">
         
            <?= $tr_add_table ?>
      <?php if(count($data_colegio) > 0){ ?>
            <div class="<?= $cols_nivel ?>">
                <select id="cmb_nivel" class="form-control" name="cmb_nivel">                
                  <?= ($perfil == 2 || $perfil == 3) ? $cmb_nivel_1 : ""; ?>
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
    


  <?= $this->endSection() ?>
  <?= $this->section('script') ?>
  
  <script>
    $(document).ready(function()
    {
      var data_ugel_colegio = [];
      var data_colegios = [];
      var colegio_det = {};
      var grados_areas = [];
      var areas_nivel = <?php echo json_encode($areas_nivel); ?>;
      var id_colegio = 0;
      var id_evaluacion = 0;

      <?php echo $data_script_col; ?>

      $("#cmb_ugel").change(function() {
        var cod_ugel = $("#cmb_ugel").val();
        var html_colegios = "<option value=''>SELECCIONA UNA UGEL</option>";
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
        var cod_local = $("#cmb_colegio_local").val();
        var html_areas = "<option value=''>SELECCIONA UN ÁREA</option>";
        var nivel = $("#cmb_nivel").val();
        $("#cmb_grado").empty();
        $("#cmb_grado").html(html_areas);

        if (cod_local != '' && nivel != '') {
          if (typeof eval(data_colegios[cod_local][nivel]) !== 'undefined') {
            id_colegio = data_colegios[cod_local][nivel];
          }
        }
        grados_areas = [];

        $.ajax({
          url: "<?php echo site_url('get_areas_grado'); ?>",
          type: "POST",
          dataType: 'JSON',
          data: {
            'id_colegio': id_colegio
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

      });

      $("#cmb_areas").change(function() {

        var area = $("#cmb_areas").val();
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
        var cod_local = $("#cmb_colegio_local").val();
        var area = $("#cmb_areas").val();
        var grado = $("#cmb_grado").val();
        var nivel = $("#cmb_nivel").val();
        var html_secc = "<option value=''>SELECCIONA UNA SECCIÓN</option>";

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
        $("#tbl_preguntas").html('');

        $.ajax({
          url: "<?php echo site_url('get_evaluacion'); ?>",
          type: "POST",
          dataType: 'HTML',
          data: {
            'id_evaluacion': id_evaluacion
          },
          beforeSend: function(f) {
            console.log("cargando lista de alumnos");
          }
        }).done(function(datos) {
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
        for (var jn in colegio_det) {
          if (colegio_det[jn].id_colegio == id_colegio) {
            if (colegio_det[jn].grado == grado) {
              if (colegio_det[jn].id_area == area) {
                if (colegio_det[jn].seccion == seccion) {
                  idcolegio_seccion = colegio_det[jn].idcolegio_sec;
                }
              }
            }
          }

        }
        $("#tbl_alumnos_exam").html("");
        if(idcolegio_seccion>0)
        {
          $.ajax({
          url: "<?php echo site_url('get_alumnos_examen'); ?>",
          type: "POST",
          dataType: 'HTML',
          data: {
            'idcolegio_sec': idcolegio_seccion,
            'id_evaluacion': id_evaluacion,
            'id_alumno': id_alumno
          },
          beforeSend: function(f) {
            console.log("cargando alumnos y preguntas");
          }
        }).done(function(datos) {
          //console.log(datos);
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

      <?php echo $data_perfil; ?>

    });
  </script>


<?= $this->endSection() ?>
