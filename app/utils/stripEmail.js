const stripEmail = e => {
  // Intentionally very conservative about what emails are equivalent. Although
  // gmail ignores dots in the local part, not all email systems do. The one
  // rule to apply is case insensitivity in the local part since that seems to
  // be almost universal.
  const parts = e.split('@');
  const localPart = parts.slice(0, -1).join('@');
  const domainPart = parts[parts.length - 1];
  return `${localPart.toLowerCase()}@${domainPart}`;
};

export default stripEmail;
