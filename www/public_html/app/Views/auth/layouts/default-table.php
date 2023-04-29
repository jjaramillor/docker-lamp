<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="generator" content="">
    <link rel="icon"  sizes="8x8" href="<?php echo base_url() ?>/favicon.ico">
    <title>template1</title>
	
    <!-- load extended styles -->
    <?= $this->renderSection('style') ?>

    <!-- default styles  -->
    <link rel="stylesheet" href="<?= base_url('public/vendor/fontawesome/css/fontawesome.min.css'); ?>">
    <link rel="stylesheet" href="<?= base_url('public/vendor/fontawesome/css/solid.min.css'); ?>">
    <link rel="stylesheet" href="<?= base_url('public/vendor/fontawesome/css/brands.min.css'); ?>">
    <link rel="stylesheet" href="<?= base_url('public/vendor/bootstrap/css/bootstrap.css'); ?>">
    <link rel="stylesheet" href="<?= base_url('public/vendor/datatables/datatables.css'); ?>">
    <link rel="stylesheet" href="<?= base_url('public/css/styles_hh.css'); ?>" >
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
</head>

<body class="bg-light">
    <!-- load extended modals -->
    <?= $this->renderSection('modals') ?>

    <!-- navbar -->
    <?= view('App\Views\auth\components\navbar') ?>

    <div  class="container">
      <!-- notifications -->
      <?= view('App\Views\auth\components\notifications') ?>

      <!-- load content from other views -->
      <?= $this->renderSection('main') ?>
    </div>

    <script src="<?= base_url("public/vendor/jquery/jquery.min.js") ?>" type="text/javascript"></script>
    <script src="<?= base_url("public/vendor/bootstrap/js/bootstrap.bundle.min.js") ?>" type="text/javascript"></script>
    <script src="<?= base_url("public/vendor/datatables/datatables.min.js") ?>" type="text/javascript"></script>
   
    <!-- inline js code -->
    <script type="text/javascript">
        $('#dataTables-table').DataTable({responsive: true,pageLength: 15,lengthChange: false,searching: true,ordering: true});
    </script>
    
    <!-- load extended scripts -->
    <?= $this->renderSection('script') ?>
</body>

</html>