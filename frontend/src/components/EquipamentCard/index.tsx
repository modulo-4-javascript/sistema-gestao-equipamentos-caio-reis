import type { Equipaments } from "../../types/equipament.types";
import "./index.css";

interface EquipamentsCardProps {
    equipament: Equipaments;
}

function EquipamentCard({equipament}: EquipamentsCardProps) {
  return (
    <div className={`equipament-card ${equipament.status ? "available" : "unavailable"}`}>
        <h3>{equipament.name}</h3>
        <p>Status: {equipament.status ? "Disponível" : "Indisponível"}</p>
    </div>
  );
}  

export default EquipamentCard;