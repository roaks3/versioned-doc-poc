import Link from 'next/link'
import { useSelect } from 'downshift'

// export interface VersionOption {
//   slug: string
//   display: string
//   url: string
// }

export default function VersionDropdown({
  versionOptions,
  selectedVersionSlug,
}) {
  const {
    isOpen,
    highlightedIndex,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
  } = useSelect({
    items: versionOptions.map((versionOption) => versionOption.name),
  })
  const selectedVersionDisplay = versionOptions.find(
    (option) => option.slug === selectedVersionSlug
  ).display

  return (
    <div className="g-version-dropdown">
      <label {...getLabelProps()}>Select Version</label>
      <button
        {...getToggleButtonProps()}
        className="version-btn g-type-buttons-and-standalone-links"
      >
        {selectedVersionDisplay}
      </button>
      <ul
        {...getMenuProps()}
        className={`version-menu g-type-buttons-and-standalone-links${
          isOpen ? ' open' : ''
        }`}
      >
        {isOpen && (
          <>
            {versionOptions.map((option, index) => (
              <li
                key={option.slug}
                {...getItemProps({ item: option.slug, index })}
                className={highlightedIndex === index ? 'highlight' : ''}
              >
                <Link href={option.url} prefetch={false}>
                  <a>{option.display}</a>
                </Link>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  )
}
