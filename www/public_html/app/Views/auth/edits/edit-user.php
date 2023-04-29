<!-- load main layout -->
<?= $this->extend('auth/layouts/default-table') ?>

<!-- load main content -->
<?= $this->section('main') ?>

    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-3">
        <h1 class="h2">Editar usuario</h1>
        <?php $perfiles=[1=>'Administrador',2=>'Director',3=>'Profesor'];
         $perfil=$user['idperfil'];?>
        <div class="btn-toolbar mb-2 mb-md-0">
            <a href="<?= site_url('users') ?>" class="btn btn-sm btn-secondary"><i class="fas fa-arrow-left"></i> Regresar</a>
        </div>
    </div>

    <div class="card p-3">
        <form action="<?= site_url('users/update-user'); ?>" method="POST" accept-charset="UTF-8" onsubmit="Button.disabled = true; return true;">
            <?= csrf_field() ?>
            <div class="form-group">
                <label for="firstname">Usuario</label>
                <input class="form-control" required type="text" name="name" id="name" value="<?= $user['name'] ?>" />
            </div> 
            <div class="form-group">
                <label for="firstname">Nombre Colegio</label>
                <input class="form-control" required type="text" name="firstname" id="firstname" value="<?= $user['firstname'] ?>" />
            </div>           
            <div class="form-group">
            <label for="name">Perfil</label>
           <?php  
              $label_cod_cole="";
           if($perfil==1)
            {
                $cmb_perfil="<input class='form-control'  type='hidden' name='idperfil' value=".$user['idperfil']." />";
                $cmb_perfil.="<label>Administrador</label>";
            }else
            {
                $perfiles=[2=>'Director',3=>'Profesor'];
                $cmb_perfil="<select id='idperfil' class='form-control'required  name='idperfil' >";
                foreach($perfiles as $val=>$per)
                {   $select=($val==$perfil)?"Selected":"";
                    $cmb_perfil.="<option ".$select." value='".$val."'>".$per."</option>";
                }
                $cmb_perfil.="</select>";
            }
            echo $cmb_perfil;
            ?>           

            </div>
            <?php 
         
           
            if($perfil==1)
            {              
              echo "<input type='hidden' name='cod_colegio' id='cod_colegio' >" ; 
            }
            else
            { 
                if($perfil==2) $label_cod_cole='Código Local';
                else if($perfil==3) $label_cod_cole='Código Modular';                
            ?>
                <div class="form-group">            
                <label  id='lbl_cod_colegio' for="cod_colegio"><?= $label_cod_cole ?></label>
                <input class="form-control" required type="text" name="cod_colegio" value="<?= $user['cod_colegio'] ?>" />
                </div>
           <?php 
                           
            }            
            ?>           
            <div class="form-group">
                <label for="active">Estado</label>
                <select class="form-control" name="active" required>
                    <?php if ($user['active'] === 1) : ?>
                        <option value="1" selected>Activo</option>
                    <?php else : ?>
                        <option value="1">Activo</option>
                    <?php endif ?>

                    <?php if ($user['active'] === 0) : ?>
                        <option value="0" selected>Desactivado</option>
                    <?php else : ?>
                        <option value="0">Desactivado</option>
                    <?php endif ?>
                </select>
              </div>
            <div class="text-right">
                <input name="id" type="hidden" value="<?= $user['id'] ?>" readonly/>
                <button type="submit" class="btn btn-primary" name="Button"><i class="fas fa-check-circle"></i> Actualizar</button>
            </div>
        </form>
    </div>

<?= $this->endSection() ?>
<?= $this->section('script') ?>
<script>
    $(document).ready(function()
    {
        $("#idperfil").change(function(e) 
        {
            let perfil=e.target.value;
            if(perfil==2)
            {
                $("#lbl_cod_colegio").text('Código Local');
            }
            else if(perfil==3)
            {
                $("#lbl_cod_colegio").text('Código Modular');
            }
        });

    });
</script>
<?= $this->endSection() ?>