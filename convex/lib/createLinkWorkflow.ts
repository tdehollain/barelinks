export const TITLE_ENRICHMENT_DELAY_MS = 0;

export function getCompletedTitleFields(title: string | null | undefined) {
  const trimmedTitle = title?.trim();

  return trimmedTitle
    ? { title: trimmedTitle, isTitlePending: false as const }
    : { isTitlePending: false as const };
}

type CreateLinkWorkflowDependencies<LinkId> = {
  fetchRawTitle: (url: string) => Promise<string | null>;
  insertLink: (args: {
    url: string;
    title?: string;
    isTitlePending: boolean;
  }) => Promise<LinkId>;
  scheduleEnrichment: (
    delayMs: number,
    args: { linkId: LinkId; url: string }
  ) => Promise<void>;
};

export async function createLinkWithPreliminaryTitle<LinkId>(
  url: string,
  providedTitle: string | undefined,
  dependencies: CreateLinkWorkflowDependencies<LinkId>
): Promise<LinkId> {
  const preliminaryTitle =
    providedTitle?.trim() ||
    (await dependencies.fetchRawTitle(url)) ||
    undefined;

  const linkId = await dependencies.insertLink({
    url,
    title: preliminaryTitle,
    isTitlePending: true,
  });

  await dependencies.scheduleEnrichment(TITLE_ENRICHMENT_DELAY_MS, {
    linkId,
    url,
  });

  return linkId;
}
