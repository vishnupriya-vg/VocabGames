export function highlightWord(sentence, word, cls = 'word-highlight') {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = sentence.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === word.toLowerCase() ? (
      <mark key={i} className={cls}>{part}</mark>
    ) : (
      part
    )
  );
}
