
import Herosection from "../components/Herosection";
import Footer from "../components/Footer";
import Cta from "../components/cta";
import Tech from "../components/Tech";
import Features from "../components/Features";
import Navbar from "../components/Navbar";
import HowItWorks from "../components/HowItWorks";
import Tech1 from "../components/Tech1";









export default function App() {


  return (
    <div style={{ fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", background: "#F5F5F5", color: "#1A1A1A", minHeight: "100vh" }}>
      

    

    <Herosection/>

    <Features/>

    <HowItWorks/>

    
    
    

    <Cta/>

    
    </div>
);
}
