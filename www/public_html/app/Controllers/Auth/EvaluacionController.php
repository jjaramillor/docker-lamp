<?php
namespace App\Controllers\Auth;

use CodeIgniter\Controller;
use Config\Email;
use Config\Services;


class EvaluacionController extends Controller
{

	/**
	 * Access to current session.
	 *
	 * @var \CodeIgniter\Session\Session
	 */
	protected $session;

	/**
	 * Authentication settings.
	 */
	protected $config;

    //--------------------------------------------------------------------
	public function __construct()
	{
		// start session
		$this->session = Services::session();
	}
	// tabla de preguntas
    public function get_evaluacion()
    {
        if($this->request->isAjax() )
		{
            $db = \Config\Database::connect();
			$id_evaluacion = $this->request->getPost('id_evaluacion');		

           $sql="SELECT a.`id_eval_pregunta`, a.`pregunta`,a.`id_capacidad`,a.`id_competencia`,b.`competencias`,c.`capacidad`,c.alias ,a.`correcta`,a.`puntaje`,a.`pregunta_tipo`,a.`grupo_comp`,a.`grupo_cap` FROM evaluacion_preguntas a INNER JOIN `eval_competencias` b";
		   $sql.=" ON a.id_competencia=b.id_competencia INNER JOIN `eval_capacidades` c  ON c.id_capacidad=a.id_capacidad WHERE a.id_evaluacion=".$id_evaluacion." AND a.`active`=1 ORDER BY a.`orden`";
			
             $query= $db->query($sql);
            $result_data = $query->getResult();
			$data_preguntas=[];		
			$col_cap=[];
			$col_comp=[];
			$data_capacidad=[];
			$data_competencia=[];
			$nro_preg=count($result_data);
			$array_tipo_preg=[]; 
			$respuestas_opcions=[];
			$respuestas_opcions_js=[];
			$dat_grup_preg=[];
			$xx=0;
                if($nro_preg>0)
                {	
					foreach($result_data as $row)
					{ 
					 $data_grup_cap[$row->grupo_cap]=$row->alias;
					 $data_competencia[$row->id_competencia]=$row->competencias;
					 $data_competencia2[$row->grupo_comp]=$row->competencias;
					@$data_preguntas[$row->id_competencia][$row->id_capacidad][$row->pregunta]=$row->correcta;
					@$dat_grup_preg[$row->grupo_comp][$row->grupo_cap][$row->pregunta]=$row->correcta;
					@$col_cap[$row->grupo_comp]+=+1;
					@$col_comp[$row->grupo_comp][$row->grupo_cap]+=+1;
					$id_preguntas[$row->id_eval_pregunta]=$row->pregunta_tipo;
					$array_tipo_preg[$row->pregunta_tipo]=$row->pregunta_tipo;
					//$opciones_preg_tipos[$row->pregunta_tipo][]

					}
				
				
					foreach($array_tipo_preg as $tipo)
					{
						$respuestas_opcions[$tipo]=$this->tipo_pregunta($tipo);
						$respuestas_opcions_js[$tipo]=$this->tipo_pregunta_js($tipo);
					}
					$html_cab1="<thead><tr><th class='bg-primary' colspan='".$nro_preg."'>TABLA DE RESPUESTAS CORRECTAS</th></tr><tr>";
					$html_cab2="<tr>";
					$html_bod="<tr>";
					$html_bod2="<tr>";
					
					foreach(@$dat_grup_preg as $id_comp=>$arr1)
					{
					 $html_cab1.="<th colspan='".@$col_cap[$id_comp]."' >".@$data_competencia2[$id_comp]."</th>";

						foreach($arr1 as $idcap=>$arr2)
						{
							 $html_cab2.="<th colspan='".@$col_comp[$id_comp][$idcap]."' >".$data_grup_cap[$idcap]."</th>"; 
					 
							foreach($arr2 as $idpreg=>$correcta_op)
							{
								$html_bod.="<td>".$idpreg."</td>";	
								$html_bod2.="<td>".$correcta_op."</td>";	
							}
							
						}
					}

					$html_bod.="</tr>";
					$html_bod2.="</tr>";
					$html_cab2.="</tr>";
					$html_cab1.="</tr></thead>";
					$html_table="<table class='table table-bordered table-dark text-center'>"; 
					$html_table.="";
					$html_table.=$html_cab1.$html_cab2.$html_bod.$html_bod2;
					$html_table.="</table><input  id='nro_preguntas_eval' type='hidden' value='".$nro_preg."' /> <input type='hidden' value='".json_encode($id_preguntas)."' id='id_preguntas'/>  <input type='hidden' value='".json_encode($respuestas_opcions_js)."' id='tipo_preg_opcions'/>";
					
                   
					$query->freeResult();
					return  $html_table;
                }
				else
				{
					$query->freeResult();
					return "0";
				}				
				
		}
		else
		{
			redirect('404');
		}

    }

	// tabla de alumnos y notas de examenes
	public function get_alumnos_examen()
	{

		if($this->request->isAjax() )
		{
            $db = \Config\Database::connect();
			$id_evaluacion = trim($this->request->getPost('id_evaluacion'));
			// $idcolegio_sec = trim($this->request->getPost('idcolegio_sec'));
			$id_colegio = $this->request->getPost('id_colegio');
			$seccion = trim($this->request->getPost('seccion'));
			$grado = trim($this->request->getPost('grado'));
			$get_id_alumno = trim($this->request->getPost('id_alumno'));
			$perfil = trim($this->request->getPost('perfil'));
			


				$filter1="";
				$nombres_alumno="";				
				$total_alumns=0;
				if($get_id_alumno!='0' &&  $get_id_alumno!='')
				{
					$nom_ape=explode(',',$get_id_alumno);
					if(count($nom_ape)>1)
					{
						$filter1=" AND (nombres like '%{$nom_ape[0]}%' OR apellidos like '%{$nom_ape[1]}%')  ";
						
					}
					else 
					{
						$filter1=" AND (nombres like '%{$get_id_alumno}%' OR apellidos like '%{$get_id_alumno}%')  ";
					}
					
					$sql_2="SELECT id_alumno,id_colegiosec,nombres,apellidos,dni,sexo FROM alumnos WHERE active=1 AND grado={$grado} AND seccion='{$seccion}' AND id_colegio={$id_colegio} {$filter1}";	
					
					$query2= $db->query($sql_2);
					$result_data2 = $query2->getResultArray();
					$total_alumns=count($result_data2);
					$nombres_alumno=$get_id_alumno;
						
				}
				else
				{
					$array_filter=['active'=>1,'id_colegio'=>$id_colegio,'seccion'=>$seccion];$builder=$db->table('alumnos');
					$total_alumns=$builder->select('id_alumno')->where($array_filter)->countAllResults();
				}

				if($total_alumns==0)
				{
			    	return  "0";
					return false;
				}

			$sql_1="SELECT id_eval_pregunta as id_pregunta,pregunta,id_evaluacion,correcta,puntaje,pregunta_tipo FROM `evaluacion_preguntas` WHERE id_evaluacion=".$id_evaluacion." AND active=1 ORDER BY orden";
			
			
			$query1= $db->query($sql_1);
			$result_data1 = $query1->getResult();
			$pregunta_p=[];
			$preguntas_c=[];
			$alumnos_preg=[];
			$tipos_preguntas=[];
			$numero_preguntas=count($result_data1);
			$total_tipos_preg=[];
			if($numero_preguntas>0)
			{
				foreach($result_data1 as $row)
				{ 
				 $pregunta_p[$row->id_pregunta]=trim($row->pregunta);
				 $preg_correcta[$row->id_pregunta]=trim($row->correcta);
				 $preg_puntaje[$row->id_pregunta]=trim($row->puntaje);
				 $preg_tipo[$row->id_pregunta]=$row->pregunta_tipo;
				 $tipos_preguntas[$row->pregunta_tipo]=$row->pregunta_tipo;
				 @$total_tipos_preg[$row->pregunta_tipo]+=+1;
				
				}
			
				$html="";
				$col_cab=0;
				$html_opc="";
				foreach($tipos_preguntas as $tipo_pre=>$val)
				{
					$opciones1=$this->tipo_pregunta($val);
					$col_cab=$col_cab+count($opciones1);
					$add_class="cls_verde";
						foreach($opciones1 as $opc=>$val2)
						{	if($val2=='')$val2='O';
							if($val==2)
							{
							 $add_class="cls_celeste";	
							}
							$html_opc.="<th class='".$add_class."'>".$val2."</th>";
						}
				}

				
				$num_tipo_preg=count($tipos_preguntas);				
				$tot_alumno_pts=[];
				$alumnos_opc=[];
				$data_examen=[];
				$data_examen_vacios=[];
				

				$sql_2="SELECT d.*,c.id_detalle,c.id_examen,id_pregunta,opcion_alias as respuesta,c.id_evaluacion,c.nota FROM
				( SELECT id_alumno,id_colegiosec,nombres,apellidos,dni,sexo FROM alumnos WHERE active=1 AND grado={$grado} AND seccion='{$seccion}' AND id_colegio={$id_colegio} {$filter1} ) AS d
				LEFT JOIN 
				( SELECT b.id_detalle,a.id_examen,a.id_alumno,a.id_evaluacion,b.id_pregunta,b.opcion_alias,a.nota
				FROM `examen_alumnos` a INNER JOIN  `examen_alumnos_det` b ON a.id_examen=b.id_examen WHERE a.id_evaluacion={$id_evaluacion} ORDER BY  b.id_pregunta) AS c 	ON d.id_alumno=c.id_alumno ORDER BY d.apellidos ";
			     //   echo $sql_2; exit();
				$query2= $db->query($sql_2);
				$result_data2 = $query2->getResult();
				$total_contest=[];
				$total_preg_c=[];
				$lista_alumnos_sec=[];
				$nota_alumno=[];
				if(count($result_data2)>0)
				{	
					foreach($result_data2 as $row)
					{
						
						$lista_alumnos_sec[]=trim($row->nombres).",".trim($row->apellidos);
						$nota_alumno[$row->id_alumno]=$row->nota;
						$data_pr=(is_null($row->id_pregunta)?"0":$row->id_pregunta);
						$puntos_preg=0;
						if(!is_null($row->id_pregunta) && !$row->id_pregunta=='')
						{
						    if(isset($preg_puntaje[$row->id_pregunta]))
						    {
						        $puntos_preg=$preg_puntaje[$row->id_pregunta];
						    }
						}
						$puntos_c=0;
						if($puntos_preg>0)
						{	if($preg_correcta[$row->id_pregunta]==$row->respuesta)
							{ $puntos_c=$puntos_preg; }
	
							if($preg_tipo[$row->id_pregunta]==2)
							{ 
								$puntos_c=$this->preguntas_puntaje($row->respuesta);
							}
                            if($preg_tipo[$row->id_pregunta]==3)
                            {
                                $puntos_c=$this->preguntas_puntaje_3($row->respuesta);
                            }
                            if($preg_tipo[$row->id_pregunta]==4)
                            {
                                $puntos_c=$this->preguntas_puntaje_4($row->respuesta);
                            }
						}
						$alumnos_preg[$row->id_alumno][$data_pr]=$row;
						$dat_alumnos[$row->id_alumno]=$row->apellidos.",".$row->nombres; // alumnos id
						@$tot_alumno_pts[$row->id_alumno]+=+$puntos_c; // notas
						if(!is_null($row->respuesta))
						{
						 @$alumnos_opc[$row->id_alumno][$row->respuesta]+=+1;
						 $total_contest[$row->id_alumno][$row->respuesta]=1;
						 $data_examen[$row->id_alumno][$row->id_examen]=$row->id_examen;
						
						 if($row->respuesta=='')
						 {
							@$total_preg_c[$row->id_alumno][$preg_tipo[$row->id_pregunta]]+=+0;
						 }
						 else
						 {
							@$total_preg_c[$row->id_alumno][$preg_tipo[$row->id_pregunta]]+=+1;
						 }
						}
						else
						{
						  $id_exa=(is_null($row->id_examen)?0:$row->id_examen);
						  $data_examen[$row->id_alumno][$id_exa]=$id_exa;
						 @$total_preg_c[$row->id_alumno][]+=+0;
						}
					}
		
					$list_alumnos=array_unique($lista_alumnos_sec);
				
					$item=0;
					$html="";
					foreach($dat_alumnos as $idalum=>$nombres)
					{		
						$item++;
						$id_exam=0;
						if(isset($data_examen[$idalum]))
							{
								foreach($data_examen[$idalum] as $datx)
								{
									$id_exam=$datx;
								}
							}
						$html.="<div class='row shadow-sm bg-white p-3 mb-3'>
						<div class='col-10'><h5>{$nombres}</h5></div><input type='hidden' value='".$id_exam."' id='examen_alum".$item."'   />";
						$nota_alum=(isset($tot_alumno_pts[$idalum]) && !is_null($tot_alumno_pts[$idalum])?$tot_alumno_pts[$idalum]:0);
						$id_total="tdtotal_".$item;						
						$html.="<div class='col-2 text-right negrita1'>TOTAL: <span id='".$id_total."'>".$nota_alum."</span>  pts</div>";	
						
						foreach($pregunta_p as $idpreg=>$preg)
						{
							$tip_preg=$preg_tipo[$idpreg];
							$opciones=$this->tipo_pregunta($tip_preg);
						
							$html.="<div class='col-3 col-sm-2 col-md-1'>";
							//si existe datos llenados en las tablas
							if(isset($alumnos_preg[$idalum][$idpreg]))
							{	
							//$id_examen=$alumnos_preg[$idalum][$idpreg]->id_examen;
							$id_detalle=$alumnos_preg[$idalum][$idpreg]->id_detalle;
							$id_exa=0;
							
							//up_idalumno_idexamen_iddetalle(tabla hija)
							$ht_selec="<select id='cmb_".$item."_".$idalum."_".$tip_preg."_".$idpreg."' class='up_opcionpreg form-control' data-idexamen='".$id_exam."' data-item='".$item."' data-upd='".$idalum."_".$id_exam."_".$id_detalle."'>";
							$ht_selec.="<option value='' data-type='0' >".$preg."</option>";
								foreach($opciones as $opciox=>$valx)
								{								
										$selected="";
										$puntaje=0;
										if($alumnos_preg[$idalum][$idpreg]->respuesta==$valx)
										{  $selected="selected"; }
										if($tip_preg==1)
										{
											if($preg_correcta[$idpreg]==$valx)
											{  $puntaje=$preg_puntaje[$idpreg];	}
	
											$ht_selec.="<option ".$selected." value='".$valx."' data-type='".$puntaje."' >".$valx."</option>";		
										}
										else if($tip_preg==2)
										{
										
										$puntaje=$this->preguntas_puntaje($valx);
										$ht_selec.="<option ".$selected." value='".$valx."' data-type='".$puntaje."' >".$valx."</option>";
										
										}
                                        else if($tip_preg==3)
                                        {

                                            $puntaje=$this->preguntas_puntaje_3($valx);
                                            $ht_selec.="<option ".$selected." value='".$valx."' data-type='".$puntaje."' >".$valx."</option>";

                                        }
                                        else if($tip_preg==4)
                                        {

                                            $puntaje=$this->preguntas_puntaje_4($valx);
                                            $ht_selec.="<option ".$selected." value='".$valx."' data-type='".$puntaje."' >".$valx."</option>";

                                        }
								
								 }
							 $ht_selec.="</select>";
							 
							}
							else
							{
							//si no se ha registrado las Respuestas
							//ins1 idalumno_idevaluacion_idpregunta(insertar detalle actualizar nota en la tabla principal)
							//ins2 idalumno_idevaluacion_idpregunta
							// insertar en ambas tablas
							$ins_val=($id_exam>0)?"ins1":"ins2";						

							$ht_selec="<select id='cmb_".$item."_".$idalum."_".$tip_preg."_".$idpreg."'  class='".$ins_val."_opcionpreg form-control' data-idexamen='".$id_exam."' data-item='".$item."' data-upd='".$idalum."_".$id_evaluacion."_".$idpreg."' >";
							$ht_selec.="<option value='' data-type='0'>".$preg."</option>";
								foreach($opciones as $opcp=>$valp)
								{   $puntaje=0;
									if($tip_preg==1)
									{	if($preg_correcta[$idpreg]==$valp)
										{  $puntaje=$preg_puntaje[$idpreg];	}
									}
									else if($tip_preg==2)
									{	
									$puntaje=$this->preguntas_puntaje($opcp);
										
									}
                                    else if($tip_preg==3)
                                    {
                                        $puntaje=$this->preguntas_puntaje_3($opcp);

                                    }
                                    else if($tip_preg==4)
                                    {
                                        $puntaje=$this->preguntas_puntaje_4($opcp);

                                    }
									$ht_selec.="<option data-type='".$puntaje."' value='".$valp."'>".$valp."</option>";
								}
								$ht_selec.="</select>";
							}
							$html.=$ht_selec."</div>";
							
								
						}
						$html.="<div class='col-12'></div>";
						foreach($tipos_preguntas as $tipo_pre=>$val)
						{
							$id_exams=0;
							if(isset($data_examen[$idalum]))
							{
								foreach($data_examen[$idalum] as $datx)
								{								
									$id_exams=$datx;
								}
							}
							$opciones1=$this->tipo_pregunta($val);
							$opciones1['']='';
                            //$html.="<div>HOLAAA:".$val."</div>";
                            //alert-success
							$col_cab=$col_cab+count($opciones1);
                            $add_class="col-7";
                            $cls1="alert alert-primary";

                            if($num_tipo_preg==4)
                            {
                                if($val==3){ $add_class="col-5"; $cls1="alert alert-info";}
                                if($val==4){ $add_class="col-6"; $cls1="alert alert-success";}
                                if($val==2){ $add_class="col-6"; $cls1="alert alert-warning";}

                            }else{
                                if($val==2 ){
                                    $add_class="col-5"; $cls1="alert alert-warning";
                                }
                            }
							if($num_tipo_preg==1)$add_class="col-12";
							$html.="<div class='".$add_class."'>
							<div class='".$cls1."'>
							  <div class='row'>";
								foreach($opciones1 as $opc=>$val2)
								{
                                    if($val2=='')$val2='Omitidas';
								    $colstd1="col-lg-2";
                                    if($val==1 && $val2=='Omitidas')
                                    {
                                        $colstd1="col-lg-4";
                                    }
                                    if($val==2 || $val==3 || $val==4)
                                    {
                                        $colstd1="col-lg-3";

                                    }

								$val_omitida=($val2=='Omitidas'?0:$val2);	
								$html.="<div class='col-md-6 ".$colstd1." text-center'><div style='font-weight:bold' >".$val2.": <span id='".$item."_".$id_exams."_".$val."_".$val_omitida."'>";
									if(isset($alumnos_opc[$idalum][$val2]))
									{
										$html.=@$alumnos_opc[$idalum][$val2];
									}
									else 
									{
										if($val2=='Omitidas')
										{
											$tot_cer=@$total_tipos_preg[$val];
											if($id_exams>0)
											{
		
												$tot_cer=@$total_tipos_preg[$val]-
												@$total_preg_c[$idalum][$val];
											}
											
											$html.=$tot_cer;
										}
										else
										{
											$html.="0";
										}
										
									}
									$html.="</span></div></div>";
								}
								$html.="</div></div></div>";
						}					
						$html.="</div >";
						
	
					}
	
					$html.="";
					$val_alum="";
					if($filter1!='')
					{
						$val_alum=$nombres_alumno;	
					}
					$html1="<div class='row'>
					<div class='col-8 col-lg-10'>
					  <input type='text' id='get_alumnos' class='form-control' placeholder='BUSCAR POR NOMBRE DEL ALUMNO' value='{$val_alum}'>
					</div>
					<div class='col-2 col-lg-1' id='buscar_alumno'>
					  <div class='btn btn-info btn-block'><i class='fas fa-search'></i></div>
					</div>
					<div class='col-2 col-lg-1' id='limpiar_filtro'>
					  <div  class='btn btn-info btn-block'><i class='fas fa-redo-alt'></i></div>
					</div>
				  </div>
				  <hr>";
				

					$htmlT=$html1.$html;
				

					$htmlT.="<script> 
					$(document).ready(function()
					{
						var lista_alumnos=".json_encode($list_alumnos).";
						var lis_alum=[];
						for(var m in lista_alumnos)
						{
							lis_alum.push(lista_alumnos[m]);
						}						

						$('#get_alumnos').autocomplete({
						source: lis_alum
					   });

					   $('#buscar_alumno').click(function(e)
					   {
						 $('#cmb_seccion').trigger('change');
					   });
	 
					   $('#limpiar_filtro').click(function(e)
					   {
						 $('#get_alumnos').val('');
						 $('#cmb_seccion').trigger('change');
					   });

					$('.up_opcionpreg').change(function(e)
					{ 
						var id_btn=e.target.id;
						var val_sel=e.target.value;
						var arr_btn =id_btn.split('_');
						
						var data_upd=$('#'+id_btn).data('upd');
						var item_alumno=$('#'+id_btn).data('item');
						var idexamen=$('#examen_alum'+item_alumno).val();
						let nota=suma_notas_alumno(id_btn,idexamen);
						let id_pregunta=arr_btn[4];
						//actualizar  tbl_detalle actualizar tbl_examen idalumno_idevaluacion_idpregunta
						
																		
						$.ajax({
							url: '".site_url('up_detalle_examen')."',
							type: 'POST',
							dataType: 'HTML',
							data: {
							  'datos_ins': data_upd,'idexamen':idexamen,'nota':nota,ussu:$('#hh_usu').val(),'val_sel':val_sel,id_pregunta:id_pregunta
							},
							beforeSend: function(f) {
							  console.log('actualizando datos');
							}
						  }).done(function(datos) {
							if(datos=='0')
							{
								swal('intente guardar nuevamente');
							}
							else
							{
								$('#'+id_btn).removeClass('ins1_opcionpreg');
								$('#'+id_btn).removeClass('ins2_opcionpreg');
								$('#'+id_btn).addClass('up_opcionpreg');
							}
						  }).fail(function(jqXHR, textStatus, errorThrown) {
							swal('Error!!');
						  });
						
						
						 
					 });
	
				   $('.ins1_opcionpreg').change(function(e)
					{
						var id_btn=e.target.id;
						var val_sel=e.target.value;
						var arr_btn =id_btn.split('_');
						
						var data_upd=$('#'+id_btn).data('upd');
						
						var item_alumno=$('#'+id_btn).data('item');
						var idexamen=$('#examen_alum'+item_alumno).val();
						var nota=suma_notas_alumno(id_btn,idexamen);
																	
						$.ajax({
							url: '".site_url('ins_detalle_examen')."',
							type: 'POST',
							dataType: 'HTML',
							data: {
							  'datos_ins': data_upd,'idexamen':idexamen,'nota':nota,ussu:$('#hh_usu').val(),'val_sel':val_sel
							},
							beforeSend: function(f) {
							  console.log('insertando datos');
							  
							}
						  }).done(function(datos) {
							console.log('respuesta insert 1 tabla');							
							if(datos!='0')
							{
								let data_update=datos;
								let id_exa=data_update.split('_');
								
								$('#'+id_btn).attr('data-idexamen',id_exa[1]);
								$('#'+id_btn).attr('data-upd',data_update);
								$('#'+id_btn).removeClass('ins1_opcionpreg');
								$('#'+id_btn).removeClass('ins2_opcionpreg');
								$('#'+id_btn).addClass('up_opcionpreg');
							}
							else
							{
								swal('intente guardar nuevamente...actualice la pagina');
							}	

						  }).fail(function(jqXHR, textStatus, errorThrown) {
							alert('Error!!');
						  });
	
				   });
	
				   $('.ins2_opcionpreg').change(function(e)
					{
					   
						var id_btn=e.target.id;
						var val_sel=e.target.value;
						var arr_btn =id_btn.split('_');
						var data_upd=$('#'+id_btn).data('upd');	
						let id_comun=arr_btn[0]+'_'+arr_btn[1]+'_'+arr_btn[2];
						var item_alumno=$('#'+id_btn).data('item');
						var idexamen=$('#examen_alum'+item_alumno).val();
						let arr_dat_upd=data_upd.split('_');
						let nota=suma_notas_alumno(id_btn,idexamen);
						
						if(parseInt(idexamen)==0)
						{
						    
						    	$.ajax({
							url: '".site_url('ins2_examen_detalle')."',
							type: 'POST',
							dataType: 'HTML',
							data: {
							  'datos_ins': data_upd,'idexamen':idexamen,'nota':nota,ussu:$('#hh_usu').val(),'val_sel':val_sel
							},
							beforeSend: function(f) {
							  console.log('insertando datos ... ambas tablas');
							}
						  }).done(function(datos) {
							console.log('respuesta insert 2 tablas');
							console.log(datos);							
							if(datos!='0')
							{
								//id_alumno_id_examen_id_detalle;
								let data_update=datos;
								let id_exa=data_update.split('_');
								
								$('#'+id_btn).attr('data-idexamen',id_exa[1]);
								$('#examen_alum'+item_alumno).val(id_exa[1]);
								$('#'+id_btn).attr('data-upd',data_update);
								$('#'+id_btn).removeClass('ins1_opcionpreg');
								$('#'+id_btn).removeClass('ins2_opcionpreg');
								$('#'+id_btn).addClass('up_opcionpreg');
								$('#cmb_seccion').trigger('change');							
								

							}
							else
							{
								swal('intente guardar nuevamente');
							}

						  }).fail(function(jqXHR, textStatus, errorThrown) {
								swal('Error!! cargar nuevamente la pagina!');
						  });
						    
						}
						else
						{
							$('#cmb_seccion').trigger('change');
						}

					
						
				   });

				  function suma_notas_alumno(item_alumno_tipo_preg,idexa) {
					  
					
					var items_arr=item_alumno_tipo_preg.split('_');
					var item=items_arr[1];
					var idalumno=items_arr[2];
					var tipo_preg=items_arr[3];				
					var idpreg=items_arr[4];				
					var id_pregs=JSON.parse($('#id_preguntas').val());	
                    
					var nro_preg=$('#nro_preguntas_eval').val();
					var tipo_preg_opcs=JSON.parse($('#tipo_preg_opcions').val());
				
				//console.log('tipo_preg_opcs'); 
				//console.log(tipo_preg_opcs); 
					var suma=0;
					var opciones_tipo={};
					var opciones_tipo2={};
					for(var x2 in tipo_preg_opcs)
					{
				
					opciones_tipo[x2]={};

						for(var x3 in tipo_preg_opcs[x2])
						{	
							let yx=(tipo_preg_opcs[x2][x3]==''?0:tipo_preg_opcs[x2][x3]);
							
							opciones_tipo[x2][yx]=0;
							
						}					
					}					
					opciones_tipo2=opciones_tipo;				
                    //console.log('opciones_tipo2'); 
                    //console.log(opciones_tipo2); 
					for(var x1 in id_pregs) 
					{
						
						var concat='cmb_'+item+'_'+idalumno+'_'+id_pregs[x1]+'_'+x1;		
						var elems = document.getElementById(concat);
						let valorx=$('#'+concat).val();
						let sel_index=0;						
						if(valorx=='')
						{
							sel_index=0;
						}
						else
						{
							sel_index=(elems.selectedIndex=='null'?0:elems.selectedIndex);
						}
			
						let seleccionado = elems.options[sel_index];
						//let valorx =$('#cmb_'+item+'_'+idalumno+'_'+id_pregs[x1]+'_'+x1).val();
						
						let val_dt = seleccionado.getAttribute('data-type');
						
						
						suma=suma+parseFloat(val_dt);
						for(var x4 in opciones_tipo)
						{
							if(id_pregs[x1]==x4)
							{
								
								if(valorx!='')
								{ opciones_tipo2[id_pregs[x1]][valorx]+=+1;
								}
								else if(valorx=='')
								{ 
									opciones_tipo2[id_pregs[x1]][0]+=+1;
								}
							}
						}
					}
									
								
					for(var x5 in opciones_tipo2)
					{
						for(var x6 in opciones_tipo2[x5])
						{
							
						 $('#'+item+'_'+idexa+'_'+x5+'_'+x6).html(opciones_tipo2[x5][x6]);
						
						}						
						
					}
					
					$('#tdtotal_'+item).html(suma);
					return suma;
					
				   }

				});

				   function suma_valores(item,idexamen,tipo_preg,opcion)
				   {

					$('#'+item+'_'+idexamen+'_'+tipo_preg+'_'+opcion).html('hx');
				   }

				  
				   </script>";
	
					return $htmlT;


				}
				else
				{
					return "0";
				}


			}
			else{
				return "0";
			}
			 

		}
		else
		{
			redirect('404');
		}

	}

	public  function tipo_pregunta($tipo){

		$opciones[1]=['A'=>'A','B'=>'B','C'=>'C','D'=>'D']; //general
		$opciones[2]=['Correc'=>'Correc','Parc'=>'Parc','Incor'=>'Incor']; // matematica ,nivel1
		$opciones[3]=['Correc'=>'Correc','Parc'=>'Parc','Incor'=>'Incor']; // matematica ,nivel1
		$opciones[4]=['Correc'=>'Correc','Incor'=>'Incor']; // matematica ,nivel1
		return $opciones[$tipo];
	}

	public  function tipo_pregunta_js($tipo){

		$opciones[1]=['0'=>'0','A'=>'A','B'=>'B','C'=>'C','D'=>'D']; //general
		$opciones[2]=['0'=>'0','Correc'=>'Correc','Parc'=>'Parc','Incor'=>'Incor']; // matematica ,nivel1
		$opciones[3]=['0'=>'0','Correc'=>'Correc','Parc'=>'Parc','Incor'=>'Incor']; // matematica ,nivel1
		$opciones[4]=['0'=>'0','Correc'=>'Correc','Incor'=>'Incor']; // matematica ,nivel1
		return $opciones[$tipo];
	}

	public function preguntas_puntaje($valor)
	{
		$puntajes=['Correc'=>2,'Parc'=>1,'Incor'=>0]; 
		if(isset($puntajes[$valor]))
		{
			return $puntajes[$valor]; 
		}
		else
		{	
				return 0;
			
			 
		}
		
	}
    public function preguntas_puntaje_4($valor)
    {
        $puntajes=['Correc'=>1,'Incor'=>0];
        if(isset($puntajes[$valor]))
        {
            return $puntajes[$valor];
        }
        else
        {
            return 0;


        }

    }
    public function preguntas_puntaje_3($valor)
    {
        $puntajes=['Correc'=>3,'Parc'=>1,'Incor'=>0];
        if(isset($puntajes[$valor]))
        {
            return $puntajes[$valor];
        }
        else
        {
            return 0;


        }

    }
	public function preguntas_puntaje_2($valor)
	{
		$puntajes=['Correc'=>2,'Parc'=>1,'Incor'=>0];
		if(isset($puntajes[$valor]))
		{
			return $puntajes[$valor]; 
		}
		else
		{	
				return 0;
			
			 
		}
		
	}
	

}