import type { Equipaments } from "../../types/equipament.types";
import "./index.css";

interface EquipamentListProps {
    equipaments: Equipaments[];
}

function EquipamentList({equipaments}: EquipamentListProps) {
  return (
    <div>
        <h2>Equipament List</h2>
        <ul>
            {equipaments.map((equipament) => (
                <li key={equipament.id}>
                    {equipament.name} - {equipament.status ? "Disponível" : "Indisponível"}
                </li>
            ))}
        </ul>
    </div>
  )
}

export default EquipamentList