<?php if (session()->has('success')) : ?>
    <div class="alert alert-success mt-3 alert-dismissible fade show" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>

        <h4 class="alert-heading">Bien hecho!</h4>
        <p><?= session('success') ?></p>
    </div>
<?php endif ?>

<?php if (session()->has('error')) : ?>
    <div class="alert alert-warning mt-3 alert-dismissible fade show" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>

        <h4 class="alert-heading">Verifique  el usuario o contraseña</h4>
        <p><?= session('error') ?></p>
    </div>
<?php endif ?>

<?php if (session()->has('errors')) : ?>
    <div class="alert alert-danger mt-3 alert-dismissible fade show" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>

        <h4 class="alert-heading">Error en el usuario y contraseña</h4>

        <ul class="">
            <?php foreach (session('errors') as $error) : ?>
            <li><?= $error ?></li>
            <?php endforeach ?>
        </ul>
    </div>
<?php endif ?>