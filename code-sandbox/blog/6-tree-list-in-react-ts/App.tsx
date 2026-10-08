import { TreeList } from "./components/tree-list"
import { data } from "./data"

import "./styles.css"

function App() {
  return (
    <div style={{ maxWidth: "14rem", margin: "0 auto" }}>
      <TreeList title={data.title} items={data.items} />
    </div>
  )
}

export default App
