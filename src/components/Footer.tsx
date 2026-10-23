import { Link } from 'react-router'
export default function Footer() {
  return (
    <footer className="workspace-footer">
      <p>© 2026 The Callout Order</p>
      <div>
        <Link to="/methodology">Sources & methodology</Link>
        <Link to="/community">Corrections</Link>
        <span>Independent research · No affiliation with Pump.fun</span>
      </div>
    </footer>
  )
}
