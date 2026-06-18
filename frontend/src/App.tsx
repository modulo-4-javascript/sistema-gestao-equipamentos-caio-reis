import EquipamentList from "./components/EquipamentList";
import { equipaments } from "./data/equipament";

function App() {
  return (
    <>
      <EquipamentList equipaments = {equipaments}/>
    </>
  )
}

export default App
