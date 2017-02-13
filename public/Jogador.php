<?php
class Jogador
{
    public $efternavn;
	public $nationalitet;
	public $alder;
	public $stamina;
	public $strafpoint;
	public $availability;
	public $injury;
	public $fornavn;
	public $idade;
	public $asi;
	public $salario;
	public $id;
	public $id_tm;
	public $setpieces;
	public $handling;
	public $oneonones;
	public $arialability;
	public $longshots;
	public $injuryproneness;
	public $favposition;
	public $name_short;
	public $max_price;
	public $klub;
	public $strength;
	public $pace;
	public $technique;
	public $crossing;
	public $marking;
	public $tackling;
	public $passing;
	public $heading;
	public $finishing;
	public $workrate;
	public $positioning;
	public $communication;
	public $reflexes;
	public $kicking;
	public $throwing;
	public $jumping;
	public $adaptability;
	public $aggression;
	public $professionalism;
	public $charisma;
	public $rutine;
	public $no;
	public $name;
	public $country;
	
	public function __construct(array $data) {
        foreach ($data as $key => $value) {
			$this->$key = $value == '' ? null : $value;
		}      
    }
    
}