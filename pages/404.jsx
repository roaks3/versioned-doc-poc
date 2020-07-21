import Link from 'next/link'

export default function NotFound() {
  return (
    <div id="p-404">
      <h1>Page Not Found</h1>
      <p>
        We&lsquo;re sorry but we can&lsquo;t find the page you&lsquo;re looking
        for.
      </p>
      <p>
        <Link href="/">
          <a>Back to Home</a>
        </Link>
      </p>
    </div>
  )
}
