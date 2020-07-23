import Link from 'next/link'
import { useSelect } from 'downshift'

// export interface VersionOption {
//   name: string
//   url: string
// }

export default function VersionDropdown({
  versionOptions,
  selectedVersionName,
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

  return (
    <div className="g-version-dropdown">
      <label {...getLabelProps()}>Select Version</label>
      <button
        {...getToggleButtonProps()}
        className="version-btn g-type-buttons-and-standalone-links"
      >
        {selectedVersionName}
      </button>
      <ul
        {...getMenuProps()}
        className={`version-menu g-type-buttons-and-standalone-links${
          isOpen ? ' open' : ''
        }`}
      >
        {isOpen && (
          <>
            {versionOptions.map((versionOption, index) => (
              <li
                key={versionOption.name}
                {...getItemProps({ item: versionOption.name, index })}
                className={highlightedIndex === index ? 'highlight' : ''}
              >
                <Link href={versionOption.url} prefetch={false}>
                  <a>{versionOption.name}</a>
                </Link>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  )
}
