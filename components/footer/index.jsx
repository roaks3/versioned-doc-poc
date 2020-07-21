import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="g-footer">
      <div className="g-container">
        <div className="left">
          <Link href="/docs/stable">
            <a>Docs</a>
          </Link>
          <a href="https://hashicorp.com/privacy">Privacy</a>
          <Link href="/files/press-kit.zip">
            <a>Press Kit</a>
          </Link>
        </div>
      </div>
    </footer>
  )
}
