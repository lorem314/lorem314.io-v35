import { CustomComp } from "./components/custom-comp"

const fn = () => {}

export default function App() {
  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <button style={{}}>按钮</button>
      <CustomComp />
    </div>
  )
}
