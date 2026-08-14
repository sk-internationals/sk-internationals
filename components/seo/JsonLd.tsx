/**
 * A JSON-LD block. Structured data has no visual output, so this exists purely
 * to keep `dangerouslySetInnerHTML` — and the reasoning about what is safe to
 * put inside it — in one file rather than repeated at every call site.
 *
 * The payload is built from this repository's own content modules, never from
 * user input, which is what makes the raw injection safe here. The `<` escape
 * closes the one hole that remains: a stray `</script>` inside any string
 * would otherwise end the tag early and let the rest of the payload parse as
 * markup.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
