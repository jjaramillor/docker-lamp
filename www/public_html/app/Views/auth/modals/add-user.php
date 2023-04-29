<div class="modal fade" id="createuserformmodal" tabindex="-1" role="dialog" aria-labelledby="createuserformmodal" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createuserformmodaltitle">Registro nuevo usuario</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form action="<?= site_url('users/create-user'); ?>" method="POST" accept-charset="UTF-8" onsubmit="registerButton.disabled = true; return true;">
            <?= csrf_field() ?>
            <div class="form-group row">
                <div class="col">
                    <label for="name">Usuario</label>
                    <input class="form-control" required type="text" name="name" value="<?= old('name') ?>" placeholder="Nombres"/>
                </div>
                <div class="col">
                    <label for="firstname">Nombre Colegio</label>
                    <input class="form-control" required type="text" name="firstname" value="<?= old('firstname') ?>" placeholder="Nombre Colegio"/>
                </div>
            </div>
            <div class="form-group">
              <?php  $perfiles=[1=>'Administrador',2=>'Director',3=>'Profesor']; ?>
                <label for="name">Perfil</label>
                <select class="form-control" required  name="idperfil">
                  <?php
                  foreach($perfiles as $val=>$opc)
                  {
                    echo "<option value='".$val."'>".$opc."</option>";
                  }
                  ?>
                </select>                 
            </div>
            <div class="form-group">
                <label for="password">Cod Colegio(CodModular/CodLocal)</label>
                <input class="form-control" required type="text" name="cod_colegio" value="<?= old('cod_colegio') ?>" placeholder="Codigo de colegioo" />
            </div>
           
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input class="form-control" required type="password" name="password" value="" placeholder="contraseña" />
            </div>
            <div class="form-group">
                <input class="form-control" required type="password" name="password_confirm" value="" placeholder="Confirmar contraseña" />
            </div>

            <div class="text-right">
                <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fas fa-times-circle"></i> Cerrar</button>
                <button type="submit" class="btn btn-primary" name="registerButton"><i class="fas fa-plus-circle"></i>Registrar</button>
            </div>
        </form>
      </div>
    </div>
  </div>
</div>