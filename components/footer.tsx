/**
 * Renders a simple footer component with a developer tag.
 */
export function Footer() {
  return (
    <footer className="w-full py-4 text-center text-sm text-muted-foreground border-t bg-white dark:bg-gray-900 dark:border-gray-700 mt-8">
      <p>
        Developed by{" "}
        <a
          href="https://hxrshrathore.me"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          hxrshrathore.me
        </a>
      </p>
    </footer>
  )
}
