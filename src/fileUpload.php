<?php

/**
 * fileUpload plugin for jQuery
 * -- Server side helper --
 * Do What The Fuck You Want To Public License wtfpl.org
 * Version {{ VERSION }}
 */
class fileUpload{
	public static function getFiles(){
		if(empty($_FILES['fileUploadFiles'])) return array();
		$r = $j = array();
		foreach($_FILES['fileUploadFiles'] as $part=>$data){
			foreach($data as $k=>$d){
				$r[$k][$part] = $d;
			}
		}
		foreach($r as $file) $j[] = new uploadedFile($file);
		return $j;
	}
}

class uploadedFile{
	private $file;
	private $error = 0;
	
	public function __construct($file){
		$this->file = $file;
		$this->error = $file['error'];
	}
	
	public function getName(){
		return isset($this->file['name'])?$this->file['name']:"";
	}
	
	public function getType(){
		return isset($this->file['type'])?$this->file['type']:"";
	}
	
	public function getSize(){
		return isset($this->file['size'])?$this->file['size']:"";
	}
	
	public function getTmpName(){
		return isset($this->file['tmp_name'])?$this->file['tmp_name']:"";
	}

	public function getError(){
		return $this->error;
	}
	
	public function moveTo($newLocation){
		set_error_handler(array($this, 'throwMoveError'));
		$z = true;
		try{
			$z = move_uploaded_file($this->file['tmp_name'], $newLocation);
		}catch(Exception $e){
			$this->error = $e->getMessage();
			$z = false;
		}
		restore_error_handler();
		return !!$z;
	}
	
	public function getContents(){
		return file_get_contents($this->file['tmp_name']);
	}
	
	private function throwMoveError($errno, $errstr, $errfile, $errline){
		$this->error = $errstr;
		throw new Exception($this->error);
	}
}

