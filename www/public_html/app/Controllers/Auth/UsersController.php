<?php
namespace App\Controllers\Auth;

use CodeIgniter\Controller;
use Config\Email;
use Config\Services;
use App\Models\UserModel;
use App\Models\LogsModel;

class UsersController extends Controller
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

    //--------------------------------------------------------------------

	/**
	 * Displays users page.
	 */
	public function users()
	{
		// check if user is signed-in if not redirect to login page
		if (! $this->session->isLoggedIn) {
			return redirect()->to('login');
		}
        $perfil=$this->session->userData['idperfil'];
        if($perfil!=1)
        {
            return redirect()->to('login');
        }
		// current year and month variable 
		$ym = date("Y-m");

		// load user model
		$users = new UserModel();

		// getall users
		$allusers = $users->findAll(); 

		// count all rows in users table
		$countusers = $users->countAll(); 

		// count all active user in the last 30 days
		$newusers = $users->like("created_at", $ym)->countAllResults(); 

		// count all active users
		$activeusers = $users->where('active', 1)->countAllResults(); 

		// calculate active users in how many percents
		$percentofactiveusers = ($activeusers / $countusers) * 100;
		
		// load the view with session data
		return view('auth/users', [
				'userData' => $this->session->userData, 
				'data' => $allusers, 
				'usercount' => $countusers, 
				'newusers' => $newusers,
				'percentofactiveusers' => $percentofactiveusers
			]);
	}

	public function enable()
	{
		// get the user id
		$id = $this->request->uri->getSegment(3);
		// validation does not work when data is not submitted via post form
		// $rules = [
		// 	'id'	=> 'required|integer',
		// ];
		// if (! $this->validate($rules)) {
		// 	return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
		// }
		$users = new UserModel();
		$user = [
			'id'  	=> $id,
			'active'  	=> 1,
		];
		if (! $users->save($user)) {
			return redirect()->back()->withInput()->with('errors', $users->errors());
        }
        return redirect()->back()->with('success', lang('Auth.enableUser'));
	}

	public function edit()
	{
		// get the user id
		$id = $this->request->uri->getSegment(3);

		// load user model
		$users = new UserModel();

		// get user data using the id
		$user = $users->where('id', $id)->first(); 

		// load the view with session data
		return view('auth/edits/edit-user', [
				'userData' => $this->session->userData, 
				'user' => $user, 
			]);
	}

	public function update()
	{
		/*$rules = [
			'id'	=> 'required|is_natural',
			'name'	=> 'required|min_length[4]',
			'firstname'	=> 'required|alpha_space|min_length[2]',			
			'cod_colegio'	=> 'required|is_natural',
			'idperfil'	=> 'required|idperfil|is_natural',
			'active'	=> 'required|integer'
		];

		if (! $this->validate($rules)) {
			return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
		}*/

		$users = new UserModel();

		$user = [
			'id'  	=> $this->request->getPost('id'),
			'name' 	=> $this->request->getPost('name'),
			'firstname' 	=> $this->request->getPost('firstname'),
			'cod_colegio' 	=> $this->request->getPost('cod_colegio'),
			'idperfil' 	=> $this->request->getPost('idperfil'),			
			'active' 	=> $this->request->getPost('active')
		];

		if (! $users->save($user)) {
			return redirect()->back()->withInput()->with('errors', $users->errors());
        }

        return redirect()->back()->with('success', lang('Cuenta actualizada correctamente'));
	}

	public function delete()
	{
		// get the user id
		$id = $this->request->uri->getSegment(3);

		// load user model
		$users = new UserModel();

		// delete user using the id
		$users->delete($id);

        return redirect()->back()->with('success', lang('Cuenta eliminada correctamente'));
	}

	public function createUser()
	{
		helper('text');

		// save new user, validation happens in the model
		$users = new UserModel();
		$getRule = $users->getRule('registration');
		$users->setValidationRules($getRule);
		
        $user = [
            'firstname'        	=> $this->request->getPost('firstname'),
            'cod_colegio'         => $this->request->getPost('cod_colegio'),
            'name'          	=> $this->request->getPost('name'),
            'idperfil'         	=> $this->request->getPost('idperfil'),
            'password'     		=> $this->request->getPost('password'),
            'password_confirm'	=> $this->request->getPost('password_confirm'),
            'activate_hash' 	=> random_string('alnum', 32)
        ];

        if (! $users->save($user)) {
			return redirect()->back()->withInput()->with('errors', $users->errors());
        }

		// send activation email //
		// send email activation is commented no email support //
		
		// helper('auth'); 
        // send_activation_email($user['email'], $user['activate_hash']);

		// success
        return redirect()->back()->with('success', 'Cuenta creada correctamente');
	}

	public function userLogs() 
	{
		// load logs model
		$logs = new LogsModel();
		// get all user logs
		$userlogs = $logs->findAll();

		return view('auth/user-logs', ['userData' => $this->session->userData, 'data' => $userlogs]);
	}

}
