<?php namespace App\Models;

use CodeIgniter\Model;

class AlumnoModel extends Model
{
	protected $table      = 'alumnos';
	protected $primaryKey = 'idalumno';

	protected $returnType = 'array';
	protected $useSoftDeletes = false;

	// this happens first, model removes all other fields from input data
	protected $allowedFields = [
		'idgrado', 'nombres', 'apellidos', 'idcolegio','sexo','dni','active'
	];

	protected $useTimestamps = true;
	protected $createdField  = 'created_at';
	protected $updatedField  = 'updated_at';
	protected $dateFormat  	 = 'datetime';

	protected $validationRules = [];

	// we need different rules for registration, account update, etc
	protected $dynamicRules = [
		'registration' => [
			'idgrado' 		=> 'required|min_length[1]',
			'nombres' 			=> 'required|alpha_space|min_length[2]',
			'apellidos' 				=> 'required|alpha_space|min_length[2]',
			'idcolegio' 			=> 'required|min_length[1]',
			'sexo'			=> 'required|min_length[1]',
			'dni'			=> 'required|min_length[8]'
			
		],
		'updateAlumno' => [
			'idgrado'	=> 'required|is_natural',
			'nombres'	=> 'required|alpha_space|min_length[2]',
			'apellidos'	=> 'required|alpha_space|min_length[2]',
			'idcolegio'	=> 'required|min_length[1]',
			'dni'	=> 'required|alpha_space|min_length[8]',
            'active'=> 'required|integer',
		],		
		'enablealumno' => [
			'idalumno'	=> 'required|is_natural',
			'active'	=> 'required|integer'
		]
	];

	protected $validationMessages = [];

	protected $skipValidation = false;

	// this runs after field validation
	protected $beforeInsert = ['hashPassword'];
	protected $beforeUpdate = ['hashPassword'];


    //--------------------------------------------------------------------

    /**
     * Retrieves validation rule
     */
	public function getRule(string $rule)
	{
		return $this->dynamicRules[$rule];
	}

    //--------------------------------------------------------------------

	

}
