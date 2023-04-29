<?= $this->extend('auth/layouts/auth') ?>
<?= $this->section('main') ?>

<?= view('App\Views\auth\components\notifications') ?>

<div class="card">
    <div class="card-body text-center">
        <div class="mb-4">
            <img src="https://evaluacionregional.grell.gob.pe/public/image/logo/logo-grell.png" width="80%">
        </div>
        <h4 class="mb-4 text-muted">MÓDULO DE REGISTRO DE RESULTADO DE EVALUACIONES REGIONALES</h4>
        <form action="<?= site_url('login'); ?>" method="POST" accept-charset="UTF-8">
            <?= csrf_field() ?>
            <div class="form-group">
                <input name="name" type="text" class="form-control" placeholder="Ingrese su usuario" value="<?= old('name') ?>">
            </div>

            <div class="form-group">
                <input name="password" type="password" class="form-control" placeholder="Ingrese su password">
            </div>

            <div class="form-group text-left">
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" name="remember" class="custom-control-input" id="remember-me">
                    <label class="custom-control-label" for="remember-me">Recordar</label>
                </div>
            </div>
            <button class="btn btn-primary shadow-2 mb-4">INGRESAR</button>
        </form>
    </div>
</div>

<?= $this->endSection() ?>