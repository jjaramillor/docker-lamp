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
    <link rel="stylesheet" href="<?= base_url('public/vendor/bootstrap/css/bootstrap.css'); ?>">
    <link rel="stylesheet" href="<?= base_url('public/css/styles_hh.css'); ?>">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

<script src="https://kit.fontawesome.com/4ba62e8a69.js" crossorigin="anonymous"></script>
<link rel='stylesheet' href='https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css'>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-L7XMWEE9CG"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-L7XMWEE9CG');
</script>
</head>

<body>
    <!-- navbar -->
    <?= view('App\Views\auth\components\navbar') ?>
 
      <!-- notifications -->
      <?= view('App\Views\auth\components\notifications') ?>

      <!-- load content from other views -->
      <?= $this->renderSection('main') ?>

     <!-- <footer class="bottombar">
      <div class="container">
        <div class="row">
          <div class="col-12">
            © Copyright 2022. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>-->
      <script src="<?= base_url("public/vendor/jquery/jquery.min.js") ?>" type="text/javascript"></script>

   
      <script src="<?= base_url("public/vendor/bootstrap/js/bootstrap.bundle.min.js") ?>" type="text/javascript"></script>
    <script src="<?= base_url("public/vendor/bootstrap/js/bootstrap.min.js") ?>"></script>
   
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
  <script src="<?= base_url("public/vendor/jquery/jquery-ui.min.js") ?>" ></script>

    <script>
         function toggleMenu(){
        let navigation = document.querySelector('.navigation');
        let toggle = document.querySelector('.toggle');
        navigation.classList.toggle('active');
        toggle.classList.toggle('active');
      }
    </script>
    <!-- load extended scripts -->
    <?= $this->renderSection('script') ?>
    
</body>

</html>