// Navbar.jsx
import { Button } from "../../components/ui/button"
import { Menu } from "lucide-react"
export default function Navbar({onMenuClick}) {
  return (
    // Maine 'sticky top-0 z-50' add kiya hai taaki ye hamesha upar rahe
    <div className="sticky top-0 z-50 p-4 bg-black text-white flex items-center justify-between font-bold text-xl px-6 md:px-12">
      <div>
        MetaMark
      </div>
      
      <div>
        <Button className="text-white border-white/20" variant="outline" onClick={onMenuClick}>
          <Menu/>
        </Button>
      </div>
    </div>
  )
}