import "./App.css";
import Navbar from "./components/Navbar";
import Save from "./components/Save";

function App() {
  return (
    <>
    <Navbar />
      <div className="container mx-auto flex justify-center items-center h-[700px] overflow-hidden">
        <Save/>
      </div>
    </>
  )
}

export default App;
