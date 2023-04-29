<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php')) {
    require SYSTEMPATH . 'Config/Routes.php';
}

/*
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */

$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Auth\LoginController');
$routes->setDefaultMethod('login');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(true);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
//$routes->get('/', 'Home::index');
$routes->get('/', 'Auth\LoginController::login');

/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */

$routes->group('', ['namespace' => 'App\Controllers'], function($routes) 
{
	// Registration
	$routes->get('register', 'Auth\RegistrationController::register', ['as' => 'register']);
    $routes->post('register', 'Auth\RegistrationController::attemptRegister');

	// Activation
	$routes->get('activate-account', 'Auth\RegistrationController::activateAccount', ['as' => 'activate-account']);

	// Login-out
	$routes->get('login', 'Auth\LoginController::login', ['as' => 'login']);
	$routes->post('login', 'Auth\LoginController::attemptLogin');
    $routes->get('logout', 'Auth\LoginController::logout');
    $routes->get('noacceso', 'Auth\AccountController::noacceso');

	// Forgotten password
	$routes->get('forgot-password', 'Auth\PasswordController::forgotPassword', ['as' => 'forgot-password']);
    $routes->post('forgot-password', 'Auth\PasswordController::attemptForgotPassword');
	
    // Reset password
    $routes->get('reset-password', 'Auth\PasswordController::resetPassword', ['as' => 'reset-password']);
    $routes->post('reset-password', 'Auth\PasswordController::attemptResetPassword');

    // Account settings
    $routes->get('account', 'Auth\AccountController::account', ['as' => 'account']);
	
	$routes->get('students', 'Auth\AccountController::students', ['as' => 'students']);
	
    $routes->post('account', 'Auth\AccountController::updateAccount');
    $routes->post('change-email', 'Auth\AccountController::changeEmail'); // not used
    $routes->get('confirm-email', 'Auth\AccountController::confirmNewEmail'); // not used
    $routes->post('change-password', 'Auth\AccountController::changePassword'); // new
    $routes->post('delete-account', 'Auth\AccountController::deleteAccount'); // new

   $routes->post('get_areas_grado','Auth\AccountController::get_areas_grado');
   
   $routes->post('get_alumnos','Auth\AccountController::get_alumnos');
   $routes->post('get_evaluacion','Auth\EvaluacionController::get_evaluacion');
   $routes->post('get_alumnos_examen','Auth\EvaluacionController::get_alumnos_examen');
   $routes->post('ins_detalle_examen','Auth\Examen_alumnoController::ins_detalle_examen');
   $routes->post('ins2_examen_detalle','Auth\Examen_alumnoController::ins2_examen_detalle');
   $routes->post('up_detalle_examen','Auth\Examen_alumnoController::up_detalle_examen');

    // Profile
    $routes->get('profile', 'Auth\AccountController::profile', ['as' => 'profile']); // new 
    $routes->post('update-profile', 'Auth\AccountController::updateProfile'); // new

    // Users
    $routes->get('users', 'Auth\UsersController::users', ['as' => 'users']); // new
    $routes->get('users/enable/(:num)', 'Auth\UsersController::enable'); // new
    $routes->get('users/edit/(:num)', 'Auth\UsersController::edit'); // new
    $routes->post('users/update-user', 'Auth\UsersController::update'); // new
    $routes->get('users/delete/(:num)', 'Auth\UsersController::delete'); // new
    $routes->post('users/create-user', 'Auth\UsersController::createUser');
    $routes->get('users/logs', 'Auth\UsersController::userLogs', ['as' => 'userlogs']); // new

    // Settings
    $routes->get('settings', 'Auth\SettingsController::settings', ['as' => 'settings']); // new
    $routes->post('settings-update-system', 'Auth\SettingsController::updateSystem'); // new
    $routes->post('settings-update-email', 'Auth\SettingsController::updateEmail'); // new
    // actualizaciones
    
   $routes->get('notas_update/(:num)', 'Auth\ReporteController::get_notas_update', ['as' => 'get_notas_update']);
   
  $routes->get('get_prueba/(:num)/(:num)', 'Auth\ReporteController::get_prueba', ['as' => 'get_prueba']);
  
    /* reportes */
    $routes->get('notas_colegios', 'Auth\ReporteController::get_notas_colegio', ['as' => 'get_notas_colegio']);
	
	$routes->post('getNotasColegio', 'Auth\ReporteController::getNotasColegio', ['as' => 'getNotasColegio']);
	
    $routes->get('reporte', 'Auth\AccountController::reporte', ['as' => 'reporte']);
	$routes->post('get_datos', 'Auth\AccountController::get_datos');
	$routes->get('reporte-preguntas', 'Auth\AccountController::reporte_preguntas', ['as' => 'reporte_preguntas']);
	$routes->post('get_valor', 'Auth\AccountController::get_valor');
	$routes->get('reporte-capacidades', 'Auth\AccountController::reporte_capacidades', ['as' => 'reporte_capacidades']);
	$routes->post('get_capacidades', 'Auth\AccountController::get_capacidades');
	$routes->post('get_detalle', 'Auth\AccountController::get_detalle');
	$routes->get('reporte-notas', 'Auth\AccountController::reporte_notas', ['as' => 'reporte_notas']);
	$routes->post('get_notas', 'Auth\AccountController::get_notas');
    
	$routes->get('reporte-avance', 'Auth\AccountController::reporte_avance', ['as' => 'reporte_avance']); 
	$routes->post('get_avance', 'Auth\AccountController::get_avance');
	
	$routes->get('reporte-avance-niveles', 'Auth\AccountController::reporte_avance_niveles', ['as' => 'reporte_avance_niveles']); 
	$routes->post('get_avance_nivel', 'Auth\AccountController::get_avance_nivel');
	
	$routes->get('reporte-avance-areas', 'Auth\AccountController::reporte_avance_areas', ['as' => 'reporte_avance_areas']);
    $routes->post('get_avance_areas', 'Auth\AccountController::get_avance_areas'); 
    $routes->get('reporte-de-escala', 'Auth\AccountController::reporte_de_escala', ['as' => 'reporte_de_escala']);
    $routes->post('get_escala', 'Auth\AccountController::get_escala');
    
    $routes->get('reporte-micro_region', 'Auth\AccountController::reporte_escala_microregion');
    $routes->post('get_microregion', 'Auth\AccountController::get_microregion');
    
    $routes->get('reporte-regional', 'Auth\AccountController::reporte_escala_region');
    $routes->post('get_regional', 'Auth\AccountController::get_regional');

    
});


if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
    require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
