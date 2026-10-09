/**
 * Official Suit Number Generator & Registry Numbering Service
 * Configurable scheme compliant with standard Judicial Service of Ghana conventions:
 * Pattern: <DivisionCode>/<SequenceNumber>/<Year>
 * e.g., COMM/0104/2026, LD/0078/2026, GJ/0215/2026, HR/0019/2026
 *
 * NOTE: Fictional demonstrative numbering format for prototype.
 */

export interface SuitNumberConfig {
  divisionCode: string;
  year?: number;
  existingSuitNumbers: string[];
}

export function generateOfficialSuitNumber(config: SuitNumberConfig): string {
  const year = config.year || new Date().getFullYear();
  const division = config.divisionCode.toUpperCase().trim() || 'CV';

  // Find highest current sequence number for this division and year
  const prefix = `${division}/`;
  const suffix = `/${year}`;

  let maxSequence = 100;

  config.existingSuitNumbers.forEach((suit) => {
    if (suit.startsWith(prefix) && suit.endsWith(suffix)) {
      const parts = suit.split('/');
      if (parts.length === 3) {
        const seq = parseInt(parts[1], 10);
        if (!isNaN(seq) && seq > maxSequence) {
          maxSequence = seq;
        }
      }
    }
  });

  const nextSeq = maxSequence + 1;
  const formattedSeq = String(nextSeq).padStart(4, '0');
  const candidate = `${division}/${formattedSeq}/${year}`;

  // Collision safety fallback
  if (config.existingSuitNumbers.includes(candidate)) {
    return `${division}/${String(nextSeq + Math.floor(Math.random() * 900) + 1).padStart(4, '0')}/${year}`;
  }

  return candidate;
}

export function generateProvisionalCaseId(): string {
  const year = new Date().getFullYear();
  const randNum = Math.floor(10000 + Math.random() * 90000);
  return `PROV-${year}-${randNum}`;
}

export function generateFilingReference(): string {
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `EFL-${year}-${randNum}`;
}
