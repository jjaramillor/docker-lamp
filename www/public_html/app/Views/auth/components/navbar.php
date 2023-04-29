<div class="navigation">
   <ul class="nav_primer" >
      <?php $perfil= $userData['idperfil']; 
         $icon_class="fas fa-user-lock"; // perfil 1
         if($perfil==2)
         {  $icon_class="fas fa-user-tie"; }
         else if($perfil==3)
         {
           $icon_class="fas fa-user";
         }		 
				
		 
         ?>
      <li>
         <a href="#">
         <span class="icon"><i class="<?= $icon_class ?> "></i></span>
         <span class="title"  ><?= $userData['name'] ?></span>
         <input id='hh_usu' value='<?= $userData['id']  ?>' type='hidden'   />
         </a>
      </li>
      <li>         
         <a href="<?= site_url('logout') ?>" >
         <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
         <span class="title"  >Cerrar Sesión</span>
         </a>            
      </li>
      <hr style="border: 1px #333 solid;">
	 <?php 
	foreach($userData['accesos_menu'] as $rows_menu)
	{		echo "<li id='".$rows_menu->class_id_menu."'>
				 <a href=".site_url($rows_menu->ruta)." >
				 <span class='icon'><i class='".$rows_menu->class_icon."'></i></span>
				 <span class='title'  >".$rows_menu->alias."</span>
				 </a>
				</li>";
	}
	?>
	  
	     
   </ul>
</div>
<div class="toggle" onclick="toggleMenu()" ></div>
<section>
   <div class="container">
      <div class="row">
         <div class="col-4 logo">
            <img src="<?= base_url('public/image/logo/logo-grell.png'); ?>" width="100%" alt="">
         </div>
      </div>
   </div>
</section>