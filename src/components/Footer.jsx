import { profile } from '../data/profile'

export default function Footer() {
  return (
    <footer>
      <p>© {new Date().getFullYear()} {profile.firstName} {profile.lastName} · Designed & built with a <span className="heart">♥</span> for craft.</p>
    </footer>
  )
}
