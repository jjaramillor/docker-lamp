<!-- load main layout with datatable -->
<?= $this->extend('auth/layouts/default-table') ?>

<!-- load modals -->
<?= $this->section('modals') ?>

    <!-- create user modal form -->
    <?= view('App\Views\auth\modals\add-user') ?>

<?= $this->endSection() ?>


<!-- load main content -->
<?= $this->section('main') ?>

    <div class="row">
      <div class="col-sm-4">
        <div class="card mt-3">
          <div class="card-body">
            <h5 class="card-title">Total usuarios</h5>
            <h3 class="card-text"><?= $usercount ?></h3>
          </div>
        </div>
      </div>
     
      <div class="col-sm-4">
        <div class="card mt-3">
          <div class="card-body">
            <h5 class="card-title">Nuevos usuarios</h5>
            <h3 class="card-text"><?= $newusers ?> <span class="text-small text-muted">(en los ultimos 30 dias)</span></h3>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card mt-3">
          <div class="card-body">
            <h5 class="card-title">Usuarios activos</h5>
            <h3 class="card-text"><?= $percentofactiveusers ?>%</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-3">
        <h1 class="h2">Usuarios</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
            <button type="button" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#createuserformmodal"><i class="fas fa-user-plus"></i> Crear usuario</button>
        </div>
    </div>

    <div class="card p-3">
        <div class="table-responsive">
            <table width="100%" class="table table-hover" id="dataTables-table" data-order='[[ 0, "asc" ]]'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>                      
                        <th>Nombres</th>
                        <th>Perfil</th>
                        <th>Estado</th>                        
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($data as $item):?>
                    <tr>
                        <td><?= $item['id'] ?></td>
                        <td><?= $item['name'] ?></td>
                        <td><?= $item['firstname'] ?></td>
                        <?php
                         $idperfil=$item['idperfil'];
                        switch ($idperfil) {
                          case 1: $perfil='Administrador' ; break;
                          case 2: $perfil='Director' ; break;
                          case 3: $perfil='Profesor' ; break;
                          default: $perfil='NO DEFINIDO';
                        }

                        ?>
                       
                        <td><?= $perfil ?></td>
                        <td>
                            <?php if ($item['active'] == 1) : ?>
                                Active
                            <?php else : ?>
                                Disabled
                            <?php endif ?>
                        </td>
                        <td class="text-right">
                            <?php if ($item['active'] == 0) : ?>
                                <a class="btn btn-outline-secondary btn-sm" href="<?= site_url('users/enable/').$item['id'] ?>"><i class="fas fa-user-check"></i> Activar</a>
                            <?php endif ?>

                            <a class="btn btn-outline-secondary btn-sm" href="<?= site_url('users/edit/').$item['id'] ?>"><i class="fas fa-edit"></i> Editar</a>
                           
                        </td>
                    </tr>
                    <?php endforeach;?>
                </tbody>
            </table>
        </div>
    </div>

<?= $this->endSection() ?>