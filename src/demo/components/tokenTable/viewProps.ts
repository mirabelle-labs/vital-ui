import type { TokenSection } from '../../tokens';
import type { CopyFeedback } from '../../utils';

/** What every way of drawing a token section receives. */
export interface TokenViewProps {
	section: TokenSection;
	/** One per page, so only the token just copied says so. */
	copier: CopyFeedback;
}
