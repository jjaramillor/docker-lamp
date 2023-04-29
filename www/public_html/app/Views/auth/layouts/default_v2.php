<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="generator" content="">
	<link rel="icon"  sizes="8x8" href="<?php echo base_url() ?>/favicon.ico">
    <title>Modulo Usuario</title>
	
    <!-- load extended styles -->
    <?= $this->renderSection('style') ?>

    <!-- default styles  -->
    <link rel="stylesheet" href="<?= base_url('vendor/fontawesome/css/fontawesome.min.css'); ?>">
    <link rel="stylesheet" href="<?= base_url('vendor/fontawesome/css/solid.min.css'); ?>">
    <link rel="stylesheet" href="<?= base_url('vendor/fontawesome/css/brands.min.css'); ?>">
    <link rel="stylesheet" href="<?= base_url('layout/css/styles.css'); ?>">
    
    <link rel="stylesheet" href="<?= base_url('vendor/bootstrap/css/bootstrap.min.css'); ?>">
    <!--<link rel="stylesheet" href="<?= base_url('css/starter-template.css'); ?>">-->
</head>

<body class="bg-light">
    <!-- navbar -->
    <?= view('App\Views\auth\components\navbar') ?>

    <main role="main" class="container">
      <!-- notifications -->
      <?= view('App\Views\auth\components\notifications') ?>

      <!-- load content from other views -->
      <?= $this->renderSection('main') ?>
    </main>
    
    <script src="<?= base_url("vendor/jquery/jquery.min.js") ?>" type="text/javascript"></script>
    <script src="<?= base_url("vendor/bootstrap/js/bootstrap.bundle.min.js") ?>" type="text/javascript"></script>
    <script src="<?= base_url("vendor/bootstrap/js/getdata.js?v=2") ?>" type="text/javascript"></script>
    <script src="<?= base_url("vendor/bootstrap/js/sweetalert2@11.js?v=4") ?>" type="text/javascript"></script>
    <!-- Exportar Excel -->
    <script src="<?= base_url("vendor/bootstrap/js/xlsx.full.min.js") ?>" type="text/javascript"></script>
    <script src="<?= base_url("vendor/bootstrap/js/FileSaver.min.js") ?>" type="text/javascript"></script>
    <script src="<?= base_url("vendor/bootstrap/js/tableexport.min.js") ?>" type="text/javascript"></script>
    <!-- highcharts -->
    <script src="<?= base_url("vendor/bootstrap/js/highcharts/highcharts.js") ?>" type="text/javascript"></script>
    <script src="<?= base_url("vendor/bootstrap/js/highcharts/exporting.js") ?>" type="text/javascript"></script>
    <script src="<?= base_url("vendor/bootstrap/js/highcharts/export-data.js") ?>" type="text/javascript"></script>
    <script src="<?= base_url("vendor/bootstrap/js/highcharts/accessibility.js") ?>" type="text/javascript"></script>
       
    <!-- load extended scripts -->
    <?= $this->renderSection('script') ?>
</body>

</html>