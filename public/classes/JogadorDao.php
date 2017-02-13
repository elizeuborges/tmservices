<?php
class JogadorDao extends Mapper
{	  
    
	public function getJogadorPelaIdade($idade){
		$sql = "SELECT * from jogador where idade= '$idade' order by idade desc";        
        $stmt = $this->db->query($sql);
        $jogador = '';
        if($row = $stmt->fetch()){
        	$jogador = new Jogador($row);	
        }
        return $jogador;
	}

    public function getIdadesSalvas($id_tm) {
        $sql = "SELECT idade from jogador where id_tm = '$id_tm' ";                    
        $stmt = $this->db->query($sql);        
		return $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
    }

    public function getJogadores($params) {
        $sql = "SELECT * from jogador where 1=1 ";        
                
        foreach ($params as $key => $value) {
			$sql.= " and $key = '$value' ";
		}      
        
        $stmt = $this->db->query($sql);
        $results = [];
        while($row = $stmt->fetch()) {
            $results[] = new Jogador($row);
        }
        return $results;
    }
			
	public function salvar(Jogador $jogador){
		$sql = "insert into jogador (
				id, efternavn, nationalitet, alder, stamina,
				strafpoint, availability, injury, fornavn,
				idade, asi, salario, id_tm, setpieces,
				handling, oneonones, arialability, longshots,
				injuryproneness, favposition, name_short,
				max_price, klub, strength, pace, technique,
				crossing, marking, tackling, passing,
				heading, finishing, workrate, positioning,
				communication, reflexes, kicking, throwing,
				jumping, adaptability, aggression, professionalism,
				charisma, rutine, no, name, country) 
			values (
				:id,
				:efternavn, :nationalitet, :alder, :stamina,
				:strafpoint, :availability, :injury, :fornavn,
				:idade, :asi, :salario, :id_tm, :setpieces,
				:handling, :oneonones, :arialability, :longshots,
				:injuryproneness, :favposition, :name_short,
				:max_price, :klub, :strength, :pace, :technique,
				:crossing, :marking, :tackling, :passing,
				:heading, :finishing, :workrate, :positioning,
				:communication, :reflexes, :kicking, :throwing,
				:jumping, :adaptability, :aggression, :professionalism,
				:charisma, :rutine, :no, :name, :country)";
		
		$stmt = $this->db->prepare($sql);
		
        $result = $stmt->execute([
            "id" => $jogador->id,
			"efternavn" => $jogador->efternavn,
			"nationalitet" => $jogador->nationalitet,
			"alder" => $jogador->alder,
			"stamina" => $jogador->stamina,
			"strafpoint" => $jogador->strafpoint,
			"availability" => $jogador->availability,
			"injury" => $jogador->injury,
			"fornavn" => $jogador->fornavn,
			"idade" => $jogador->idade,
			"asi" => $jogador->asi,
			"salario" => $jogador->salario,
			"id_tm" => $jogador->id_tm,
			"setpieces" => $jogador->setpieces,
			"handling" => $jogador->handling,
			"oneonones" => $jogador->oneonones,
			"arialability" => $jogador->arialability,
			"longshots" => $jogador->longshots,
			"injuryproneness" => $jogador->injuryproneness,
			"favposition" => $jogador->favposition,
			"name_short" => $jogador->name_short,
			"max_price" => $jogador->max_price,
			"klub" => $jogador->klub,
			"strength" => $jogador->strength,
			"pace" => $jogador->pace,
			"technique" => $jogador->technique,
			"crossing" => $jogador->crossing,
			"marking" => $jogador->marking,
			"tackling" => $jogador->tackling,
			"passing" => $jogador->passing,
			"heading" => $jogador->heading,
			"finishing" => $jogador->finishing,
			"workrate" => $jogador->workrate,
			"positioning" => $jogador->positioning,
			"communication" => $jogador->communication,
			"reflexes" => $jogador->reflexes,
			"kicking" => $jogador->kicking,
			"throwing" => $jogador->throwing,
			"jumping" => $jogador->jumping,
			"adaptability" => $jogador->adaptability,
			"aggression" => $jogador->aggression,
			"professionalism" => $jogador->professionalism,
			"charisma" => $jogador->charisma,
			"rutine" => $jogador->rutine,
			"no" => $jogador->no ,
			"name" => $jogador->name,
			"country" => $jogador->country
        ]);	
		
		if(!$result){
			
		}
						
	}
    
    public function jogadorNaoFoiSalvoEssaSemana(Jogador $jogador) {
        $sql = "SELECT count(*) from jogador j where j.id_tm = '$jogador->id_tm' and j.idade = '$jogador->idade'";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchColumn() == 0;
    }

}			