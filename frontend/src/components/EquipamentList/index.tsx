import type { Equipaments } from "../../types/equipament.types";
import EquipamentCard from "../EquipamentCard";
import "./index.css";

interface EquipamentListProps {
    equipaments: Equipaments[];
}

function EquipamentList({equipaments}: EquipamentListProps) {
  return (
    <div>
        {equipaments.map((equipament) => (
            <EquipamentCard key={equipament.id} equipament={equipament} />
        ))}
    </div>
  )
}

export default EquipamentList